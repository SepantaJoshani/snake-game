import { Application, Ticker, Graphics, Container } from "pixi.js";
import { Stats } from "pixi-stats";
import { Grid } from "../entities/Grid";
import { Snake } from "../entities/Snake";
import { Food } from "../entities/Food";
import { InputSystem } from "../systems/InputSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { AudioSystem } from "../systems/AudioSystem";
import { HUD } from "../ui/HUD";
import { MenuScreen } from "../ui/MenuScreen";
import { PauseScreen } from "../ui/PauseScreen";
import { GameOverScreen } from "../ui/GameOverScreen";
import { TouchControls } from "../ui/TouchControls";
import { GameState } from "./GameState";
import { ParticlePool } from "../utils/ParticlePool";
import {
  GameStates,
  INITIAL_MOVE_INTERVAL,
  MIN_MOVE_INTERVAL,
  FOOD_SPEED_THRESHOLD,
  CELL_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "../utils/Constants";

export class Game {
  private app: Application;
  private gameState: GameState;

  // Entities
  private grid: Grid;
  private snake: Snake;
  private food: Food;

  // Systems
  private inputSystem: InputSystem;
  private collisionSystem: CollisionSystem;
  private scoreSystem: ScoreSystem;
  private audioSystem: AudioSystem;
  private particlePool: ParticlePool;

  // UI
  private hud: HUD;
  private menuScreen: MenuScreen;
  private pauseScreen: PauseScreen;
  private gameOverScreen: GameOverScreen;
  private touchControls: TouchControls;

  // Performance monitoring
  private stats: Stats;
  private showStats: boolean;

  // Game loop variables
  private elapsed: number;
  private moveInterval: number;
  private foodCount: number;

  // Screen effects
  private gameContainer: Container;
  private flashOverlay: Graphics;
  private fadeOverlay: Graphics;
  private screenShake: {
    active: boolean;
    duration: number;
    intensity: number;
    elapsed: number;
  };

  constructor(app: Application) {
    this.app = app;
    this.gameState = new GameState(GameStates.MENU);

    // Initialize entities
    this.grid = new Grid();
    this.snake = new Snake();
    this.food = new Food();

    // Initialize systems
    this.inputSystem = new InputSystem();
    this.collisionSystem = new CollisionSystem();
    this.scoreSystem = new ScoreSystem();
    this.audioSystem = new AudioSystem();
    this.particlePool = new ParticlePool();

    // Initialize UI
    this.hud = new HUD();
    this.menuScreen = new MenuScreen();
    this.pauseScreen = new PauseScreen();
    this.gameOverScreen = new GameOverScreen();
    this.touchControls = new TouchControls();

    // Initialize performance monitoring
    this.showStats = import.meta.env.DEV; // Show in dev mode by default
    this.stats = new Stats(this.app.renderer);
    this.setupPerformanceMonitoring();

    // Game loop variables
    this.elapsed = 0;
    this.moveInterval = INITIAL_MOVE_INTERVAL;
    this.foodCount = 0;

    // Initialize screen effects
    this.gameContainer = new Container();
    this.flashOverlay = new Graphics();
    this.fadeOverlay = new Graphics();
    this.screenShake = {
      active: false,
      duration: 0,
      intensity: 0,
      elapsed: 0,
    };

    this.setupScene();
    this.setupScreenEffects();
    this.setupGameStateListeners();
    this.setupInputHandlers();
    this.setupTouchControls();
    this.startGameLoop();

    // Update menu with current high score
    this.menuScreen.updateHighScore(this.scoreSystem.getHighScore());
  }

  private setupPerformanceMonitoring(): void {
    // Add stats to DOM - pixi-stats uses view property instead of dom
    if (this.showStats) {
      const statsElement =
        (this.stats as any).view || (this.stats as any).domElement;
      if (statsElement) {
        document.body.appendChild(statsElement);
        this.positionStatsElement(statsElement);
      }
    }
  }

  private positionStatsElement(element: HTMLElement): void {
    // Position stats in top-left corner with fixed positioning
    element.style.position = "fixed";
    element.style.top = "10px";
    element.style.left = "10px";
    element.style.zIndex = "9999";
    element.style.opacity = "0.85";
    
    // Make it smaller and more compact
    element.style.transform = "scale(0.7)";
    element.style.transformOrigin = "top left";
    
    // Ensure it doesn't interfere with touch
    element.style.pointerEvents = "none";
  }

  public toggleStats(): void {
    this.showStats = !this.showStats;

    const statsElement =
      (this.stats as any).view || (this.stats as any).domElement;
    if (!statsElement) return;

    if (this.showStats) {
      document.body.appendChild(statsElement);
      this.positionStatsElement(statsElement);
    } else {
      if (statsElement.parentNode) {
        statsElement.parentNode.removeChild(statsElement);
      }
    }
  }

  private setupScene(): void {
    // Add game elements to game container for shake effect
    this.gameContainer.addChild(this.grid.container);
    this.gameContainer.addChild(this.snake.container);
    this.gameContainer.addChild(this.food.container);
    this.gameContainer.addChild(this.particlePool.getContainer());

    // Mark game container as render group for better batching
    this.gameContainer.isRenderGroup = true;

    // Add containers to stage
    this.app.stage.addChild(this.gameContainer);
    this.app.stage.addChild(this.hud.container);
    this.app.stage.addChild(this.menuScreen.container);
    this.app.stage.addChild(this.pauseScreen.container);
    this.app.stage.addChild(this.gameOverScreen.container);
    this.app.stage.addChild(this.touchControls.container);

    // Mark UI containers as render groups for better batching
    this.hud.container.isRenderGroup = true;
    this.menuScreen.container.isRenderGroup = true;
    this.pauseScreen.container.isRenderGroup = true;
    this.gameOverScreen.container.isRenderGroup = true;
    this.touchControls.container.isRenderGroup = true;
  }

  private setupScreenEffects(): void {
    // Setup flash overlay (white flash)
    this.flashOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.flashOverlay.fill({ color: 0xffffff, alpha: 0 });
    this.app.stage.addChild(this.flashOverlay);

    // Setup fade overlay (black fade)
    this.fadeOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.fadeOverlay.fill({ color: 0x000000, alpha: 0 });
    this.app.stage.addChild(this.fadeOverlay);
  }

  private setupGameStateListeners(): void {
    this.gameState.onStateChange(GameStates.MENU, () => {
      this.menuScreen.show();
      this.pauseScreen.hide();
      this.gameOverScreen.hide();
      this.touchControls.hide();
      this.fadeIn(500);

      // Stop background music on menu
      this.audioSystem.stopBackgroundMusic();
    });

    this.gameState.onStateChange(GameStates.PLAYING, () => {
      this.menuScreen.hide();
      this.pauseScreen.hide();
      this.gameOverScreen.hide();
      this.touchControls.show();
      this.fadeIn(300);

      // Start background music when playing
      if (!this.audioSystem.isMusicPlaying()) {
        this.audioSystem.startBackgroundMusic();
      }
    });

    this.gameState.onStateChange(GameStates.PAUSED, () => {
      this.pauseScreen.show();
      this.touchControls.show();
      // Music continues playing during pause
    });

    this.gameState.onStateChange(GameStates.GAME_OVER, () => {
      this.triggerFlash();
      this.gameOverScreen.show(
        this.scoreSystem.getScore(),
        this.scoreSystem.getHighScore()
      );
      this.menuScreen.updateHighScore(this.scoreSystem.getHighScore());
      this.touchControls.hide();

      // Stop background music on game over
      this.audioSystem.stopBackgroundMusic();
    });
  }

  private setupInputHandlers(): void {
    // Keyboard handlers
    window.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        this.handleSpacePress();
      } else if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        this.handlePausePress();
      } else if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        this.toggleStats();
      } else if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        this.toggleMute();
      }
    });

    // Touch handlers for mobile
    this.setupTouchHandlers();
  }

  private setupTouchHandlers(): void {
    let touchStartTime = 0;
    let touchStartTarget: EventTarget | null = null;
    const TAP_TIME_THRESHOLD = 200; // Maximum time for a tap (ms)

    window.addEventListener("touchstart", (event) => {
      touchStartTime = Date.now();
      touchStartTarget = event.target;
    });

    window.addEventListener("touchend", (event) => {
      const touchDuration = Date.now() - touchStartTime;

      // Check if touch started on canvas (not on touch controls or UI)
      const touchedCanvas = touchStartTarget instanceof HTMLCanvasElement;

      // Only trigger on quick taps (not swipes) and only on canvas
      if (touchDuration < TAP_TIME_THRESHOLD && touchedCanvas) {
        const currentState = this.gameState.getCurrentState();

        // Handle tap based on current state
        if (
          currentState === GameStates.MENU ||
          currentState === GameStates.GAME_OVER
        ) {
          event.preventDefault();
          this.handleSpacePress();
        } else if (currentState === GameStates.PLAYING) {
          // Single tap on canvas to pause during gameplay
          event.preventDefault();
          this.handlePausePress();
        } else if (currentState === GameStates.PAUSED) {
          event.preventDefault();
          this.gameState.transition(GameStates.PLAYING);
        }
      }

      touchStartTarget = null;
    });
  }

  private setupTouchControls(): void {
    // Connect touch control buttons to input system
    this.touchControls.onDirectionInput((direction) => {
      // Add direction to input buffer (same as keyboard/swipe input)
      const currentState = this.gameState.getCurrentState();
      if (currentState === GameStates.PLAYING) {
        // Directly set the snake direction for immediate response
        const currentDirection = this.snake.direction;

        // Validate against 180-degree turns
        if (
          direction.x !== -currentDirection.x ||
          direction.y !== -currentDirection.y
        ) {
          this.snake.setDirection(direction);
        }
      }
    });
  }

  private toggleMute(): void {
    this.audioSystem.toggleMute();
    this.audioSystem.playUISound(); // Give audio feedback for toggle
  }

  private handleSpacePress(): void {
    // Resume audio context on user interaction (required by browsers)
    this.audioSystem.resumeAudioContext();

    const currentState = this.gameState.getCurrentState();

    if (currentState === GameStates.MENU) {
      this.audioSystem.playUISound();
      this.startNewGame();
    } else if (currentState === GameStates.PAUSED) {
      this.audioSystem.playUISound();
      this.gameState.transition(GameStates.PLAYING);
    } else if (currentState === GameStates.GAME_OVER) {
      this.audioSystem.playUISound();
      this.startNewGame();
    }
  }

  private handlePausePress(): void {
    const currentState = this.gameState.getCurrentState();

    if (currentState === GameStates.PLAYING) {
      this.audioSystem.playUISound();
      this.gameState.transition(GameStates.PAUSED);
    } else if (currentState === GameStates.PAUSED) {
      this.audioSystem.playUISound();
      this.gameState.transition(GameStates.PLAYING);
    }
  }

  private startNewGame(): void {
    // Remove old entities from stage
    if (this.snake) {
      this.app.stage.removeChild(this.snake.container);
      this.snake.container.destroy({ children: true });
    }
    if (this.food) {
      this.app.stage.removeChild(this.food.container);
      this.food.container.destroy({ children: true });
    }

    // Create new entities
    this.snake = new Snake();
    this.food = new Food();

    // Reset game state
    this.scoreSystem.reset();
    this.inputSystem.clearBuffer();
    this.elapsed = 0;
    this.moveInterval = INITIAL_MOVE_INTERVAL;
    this.foodCount = 0;

    // Add new entities to stage
    this.app.stage.addChild(this.snake.container);
    this.app.stage.addChild(this.food.container);

    // Spawn food avoiding snake
    const occupied = this.collisionSystem.getOccupiedPositions(this.snake);
    this.food.spawn(occupied);

    // Start game
    this.gameState.transition(GameStates.PLAYING);
  }

  private startGameLoop(): void {
    this.app.ticker.add((ticker: Ticker) => {
      this.update(ticker.deltaMS);
    });
  }

  private update(deltaMS: number): void {
    const currentState = this.gameState.getCurrentState();

    // Update performance stats
    if (this.showStats) {
      this.stats.update();
    }

    // Calculate level and speed progress
    const level = Math.floor(this.foodCount / FOOD_SPEED_THRESHOLD) + 1;
    const speedProgress =
      (INITIAL_MOVE_INTERVAL - this.moveInterval) /
      (INITIAL_MOVE_INTERVAL - MIN_MOVE_INTERVAL);

    // Update HUD
    this.hud.update(
      this.scoreSystem.getScore(),
      this.scoreSystem.getHighScore(),
      level,
      speedProgress
    );

    // Update food animation (runs in all states)
    this.food.update(deltaMS);

    // Update particle system (runs in all states)
    this.particlePool.update(deltaMS);

    // Update screen effects (runs in all states)
    this.updateScreenEffects(deltaMS);

    // Only update game logic when playing
    if (currentState !== GameStates.PLAYING) {
      return;
    }

    // Fixed time-step update
    this.elapsed += deltaMS;

    if (this.elapsed >= this.moveInterval) {
      this.elapsed -= this.moveInterval;
      this.updateGameLogic();
    }

    // Interpolate snake position for smooth movement
    const progress = Math.min(this.elapsed / this.moveInterval, 1);
    this.snake.interpolate(progress);
  }

  private updateGameLogic(): void {
    // Process input
    const newDirection = this.inputSystem.consumeInput(this.snake.direction);
    this.snake.setDirection(newDirection);

    // Move snake
    this.snake.move();

    // Check collisions
    const head = this.snake.getHead();

    // Wall collision
    if (this.collisionSystem.checkWallCollision(head)) {
      this.audioSystem.playCollisionSound();
      this.triggerScreenShake(200, 8);
      this.gameState.transition(GameStates.GAME_OVER);
      return;
    }

    // Self collision
    if (this.collisionSystem.checkSelfCollision(this.snake)) {
      this.audioSystem.playCollisionSound();
      this.triggerScreenShake(200, 8);
      this.gameState.transition(GameStates.GAME_OVER);
      return;
    }

    // Food collision
    if (this.collisionSystem.checkFoodCollision(this.snake, this.food)) {
      this.audioSystem.playEatSound();
      this.snake.grow();
      this.scoreSystem.addPoints();
      this.foodCount++;

      // Create particle burst at food position
      const foodX = this.food.position.x * CELL_SIZE + CELL_SIZE / 2;
      const foodY = this.food.position.y * CELL_SIZE + CELL_SIZE / 2;
      this.particlePool.burst(foodX, foodY, 0xff6b6b, 12);

      // Increase difficulty
      if (this.foodCount % FOOD_SPEED_THRESHOLD === 0) {
        this.moveInterval = Math.max(MIN_MOVE_INTERVAL, this.moveInterval - 10);
      }

      // Spawn new food
      const occupied = this.collisionSystem.getOccupiedPositions(this.snake);
      this.food.spawn(occupied);
    }
  }

  private triggerScreenShake(duration: number, intensity: number): void {
    this.screenShake.active = true;
    this.screenShake.duration = duration;
    this.screenShake.intensity = intensity;
    this.screenShake.elapsed = 0;
  }

  private triggerFlash(): void {
    this.flashOverlay.alpha = 0.6;
  }

  private fadeIn(duration: number): void {
    this.fadeOverlay.alpha = 1;

    // Gradually fade in
    const fadeStep = 1 / (duration / 16); // Assuming 60fps
    const fadeInterval = setInterval(() => {
      this.fadeOverlay.alpha -= fadeStep;
      if (this.fadeOverlay.alpha <= 0) {
        this.fadeOverlay.alpha = 0;
        clearInterval(fadeInterval);
      }
    }, 16);
  }

  private updateScreenEffects(deltaMS: number): void {
    // Update screen shake
    if (this.screenShake.active) {
      this.screenShake.elapsed += deltaMS;

      if (this.screenShake.elapsed >= this.screenShake.duration) {
        // End shake - reset position
        this.screenShake.active = false;
        this.gameContainer.position.set(0, 0);
      } else {
        // Apply shake - random offset
        const progress = this.screenShake.elapsed / this.screenShake.duration;
        const currentIntensity = this.screenShake.intensity * (1 - progress); // Decrease over time

        const offsetX = (Math.random() - 0.5) * currentIntensity * 2;
        const offsetY = (Math.random() - 0.5) * currentIntensity * 2;

        this.gameContainer.position.set(offsetX, offsetY);
      }
    }

    // Update flash effect (fade out)
    if (this.flashOverlay.alpha > 0) {
      this.flashOverlay.alpha -= deltaMS * 0.003; // Fade out speed
      if (this.flashOverlay.alpha < 0) {
        this.flashOverlay.alpha = 0;
      }
    }
  }
}
