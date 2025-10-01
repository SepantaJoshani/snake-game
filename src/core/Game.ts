import { Application, Ticker } from "pixi.js";
import { Grid } from "../entities/Grid";
import { Snake } from "../entities/Snake";
import { Food } from "../entities/Food";
import { InputSystem } from "../systems/InputSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { HUD } from "../ui/HUD";
import { MenuScreen } from "../ui/MenuScreen";
import { PauseScreen } from "../ui/PauseScreen";
import { GameOverScreen } from "../ui/GameOverScreen";
import { GameState } from "./GameState";
import {
  GameStates,
  INITIAL_MOVE_INTERVAL,
  MIN_MOVE_INTERVAL,
  FOOD_SPEED_THRESHOLD,
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

  // UI
  private hud: HUD;
  private menuScreen: MenuScreen;
  private pauseScreen: PauseScreen;
  private gameOverScreen: GameOverScreen;

  // Game loop variables
  private elapsed: number;
  private moveInterval: number;
  private foodCount: number;

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

    // Initialize UI
    this.hud = new HUD();
    this.menuScreen = new MenuScreen();
    this.pauseScreen = new PauseScreen();
    this.gameOverScreen = new GameOverScreen();

    // Game loop variables
    this.elapsed = 0;
    this.moveInterval = INITIAL_MOVE_INTERVAL;
    this.foodCount = 0;

    this.setupScene();
    this.setupGameStateListeners();
    this.setupInputHandlers();
    this.startGameLoop();

    // Update menu with current high score
    this.menuScreen.updateHighScore(this.scoreSystem.getHighScore());
  }

  private setupScene(): void {
    this.app.stage.addChild(this.grid.container);
    this.app.stage.addChild(this.snake.container);
    this.app.stage.addChild(this.food.container);
    this.app.stage.addChild(this.hud.container);
    this.app.stage.addChild(this.menuScreen.container);
    this.app.stage.addChild(this.pauseScreen.container);
    this.app.stage.addChild(this.gameOverScreen.container);
  }

  private setupGameStateListeners(): void {
    this.gameState.onStateChange(GameStates.MENU, () => {
      this.menuScreen.show();
      this.pauseScreen.hide();
      this.gameOverScreen.hide();
    });

    this.gameState.onStateChange(GameStates.PLAYING, () => {
      this.menuScreen.hide();
      this.pauseScreen.hide();
      this.gameOverScreen.hide();
    });

    this.gameState.onStateChange(GameStates.PAUSED, () => {
      this.pauseScreen.show();
    });

    this.gameState.onStateChange(GameStates.GAME_OVER, () => {
      this.gameOverScreen.show(
        this.scoreSystem.getScore(),
        this.scoreSystem.getHighScore()
      );
      this.menuScreen.updateHighScore(this.scoreSystem.getHighScore());
    });
  }

  private setupInputHandlers(): void {
    window.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        this.handleSpacePress();
      } else if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        this.handlePausePress();
      }
    });
  }

  private handleSpacePress(): void {
    const currentState = this.gameState.getCurrentState();

    if (currentState === GameStates.MENU) {
      this.startNewGame();
    } else if (currentState === GameStates.PAUSED) {
      this.gameState.transition(GameStates.PLAYING);
    } else if (currentState === GameStates.GAME_OVER) {
      this.startNewGame();
    }
  }

  private handlePausePress(): void {
    const currentState = this.gameState.getCurrentState();

    if (currentState === GameStates.PLAYING) {
      this.gameState.transition(GameStates.PAUSED);
    } else if (currentState === GameStates.PAUSED) {
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

    // Update HUD
    this.hud.update(
      this.scoreSystem.getScore(),
      this.scoreSystem.getHighScore()
    );

    // Update food animation (runs in all states)
    this.food.update(deltaMS);

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
      this.gameState.transition(GameStates.GAME_OVER);
      return;
    }

    // Self collision
    if (this.collisionSystem.checkSelfCollision(this.snake)) {
      this.gameState.transition(GameStates.GAME_OVER);
      return;
    }

    // Food collision
    if (this.collisionSystem.checkFoodCollision(this.snake, this.food)) {
      this.snake.grow();
      this.scoreSystem.addPoints();
      this.foodCount++;

      // Increase difficulty
      if (this.foodCount % FOOD_SPEED_THRESHOLD === 0) {
        this.moveInterval = Math.max(MIN_MOVE_INTERVAL, this.moveInterval - 10);
      }

      // Spawn new food
      const occupied = this.collisionSystem.getOccupiedPositions(this.snake);
      this.food.spawn(occupied);
    }
  }
}
