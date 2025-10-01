# Snake Game with PixiJS - Comprehensive Development Plan

## 1. Project Setup & Architecture

### 1.1 Project Structure

```
/snake-game
├── src/
│   ├── main.js                 # Entry point & Application setup
│   ├── core/
│   │   ├── Game.js            # Main game orchestrator
│   │   ├── GameState.js       # State machine (MENU, PLAYING, PAUSED, GAME_OVER)
│   │   └── Config.js          # Game constants and configuration
│   ├── entities/
│   │   ├── Snake.js           # Snake entity with movement logic
│   │   ├── Food.js            # Food spawning and management
│   │   └── Grid.js            # Grid system for snake movement
│   ├── systems/
│   │   ├── InputSystem.js     # Keyboard/touch input handling
│   │   ├── CollisionSystem.js # Collision detection (walls, self, food)
│   │   ├── RenderSystem.js    # Visual rendering coordination
│   │   └── ScoreSystem.js     # Score tracking and high score
│   ├── ui/
│   │   ├── MenuScreen.js      # Start menu
│   │   ├── HUD.js             # Score display, FPS counter
│   │   ├── GameOverScreen.js  # Game over overlay
│   │   └── PauseScreen.js     # Pause overlay
│   └── utils/
│       ├── Constants.js       # Game constants (grid size, speeds, colors)
│       ├── Easing.js          # Smooth animation helpers
│       └── ParticlePool.js    # Particle effects pooling
├── assets/
│   ├── images/                # Optional: snake/food textures
│   └── fonts/                 # Custom fonts if needed
├── index.html
├── style.css
└── package.json
```

### 1.2 Dependencies

```json
{
  "dependencies": {
    "pixi.js": "^8.x"
  },
  "devDependencies": {
    "vite": "^5.x"
  }
}
```

---

## 2. Core Game Logic

### 2.1 Grid System

- **Grid-based movement**: 20x20 cell grid (configurable)
- **Cell size**: Canvas width/height divided by grid count
- **Coordinate system**: Logical (grid coordinates) vs Visual (pixel coordinates)
- **Data structure**: Use Set for O(1) collision detection

```javascript
const GRID_SIZE = 20;
const CELL_SIZE = 800 / GRID_SIZE; // 40 pixels
```

### 2.2 Snake Entity

**Data Structure:**

```javascript
class Snake {
  segments = [
    { x: 10, y: 10 }, // Head
    { x: 9, y: 10 }, // Body
    { x: 8, y: 10 }, // Tail
  ];
  direction = { x: 1, y: 0 }; // Moving right
  nextDirection = { x: 1, y: 0 }; // Buffered input
  speed = 150; // milliseconds per move
}
```

**Movement Logic:**

1. Fixed time-step updates (not every frame)
2. Direction buffer prevents rapid 180° turns
3. Add new head position based on direction
4. Remove tail (unless food eaten)
5. Visual interpolation between grid positions for smoothness

**Visual Representation:**

- Use `Graphics` objects for each segment
- Rounded rectangles for modern look
- Different color for head vs body
- Gradient or pattern fills
- Scale animation on growth

### 2.3 Food System

**Properties:**

```javascript
class Food {
  position = { x: random, y: random };
  value = 1; // Score value
  type = "normal"; // Can add power-ups later
}
```

**Spawning:**

- Random grid position
- Avoid spawning on snake body
- Visual: Graphics circle with glow effect
- Animation: Pulsing scale, rotation

### 2.4 Collision Detection

**Three types:**

1. **Wall Collision**: `head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE`
2. **Self Collision**: Check if head position equals any body segment
3. **Food Collision**: Check if head position equals food position

**Optimization**: Use Set for occupied cells

```javascript
const occupiedCells = new Set();
snake.segments.forEach((seg) => occupiedCells.add(`${seg.x},${seg.y}`));
```

---

## 3. Smooth Movement Implementation

### 3.1 Fixed Time-Step Game Loop

```javascript
let elapsed = 0;
const moveInterval = 150; // ms per grid move

app.ticker.add((ticker) => {
  elapsed += ticker.deltaMS;

  if (elapsed >= moveInterval) {
    elapsed -= moveInterval;
    updateSnakeLogic(); // Logical grid movement
  }

  // Visual interpolation every frame
  const progress = elapsed / moveInterval;
  interpolateVisuals(progress);
});
```

### 3.2 Visual Interpolation

```javascript
function interpolateVisuals(progress) {
  snake.segments.forEach((segment, i) => {
    const visual = segment.sprite;
    const prev = segment.prevPosition || segment;

    // Smooth transition
    visual.x = lerp(prev.x, segment.x, progress) * CELL_SIZE;
    visual.y = lerp(prev.y, segment.y, progress) * CELL_SIZE;
  });
}
```

### 3.3 Progressive Difficulty

- Speed increases every 5 food items
- `moveInterval = Math.max(50, 150 - (score * 5))`

---

## 4. UI/UX Design

### 4.1 Visual Style

**Color Palette:**

```javascript
const COLORS = {
  background: 0x1a1a2e,
  gridLine: 0x16213e,
  snakeHead: 0x4ecca3,
  snakeBody: 0x3a9279,
  food: 0xff6b6b,
  foodGlow: 0xff9999,
  text: 0xeeeeee,
};
```

**Modern Design Elements:**

- Dark theme with vibrant accents
- Subtle grid lines (optional)
- Rounded corners on all shapes
- Drop shadows and glows
- Smooth transitions

### 4.2 Particle Effects

**When eating food:**

- 10-15 particles burst from food position
- Use `Graphics` circles
- Physics: velocity, gravity, fade out
- Pool particles for performance

**On collision:**

- Screen shake effect
- Flash effect

### 4.3 HUD (Heads-Up Display)

```javascript
class HUD {
  scoreText;
  highScoreText;
  fpsText; // Development only

  update(score, highScore, fps) {
    this.scoreText.text = `Score: ${score}`;
    this.highScoreText.text = `High: ${highScore}`;
  }
}
```

### 4.4 Screens

**Menu Screen:**

- Title with animation
- "Press SPACE to Start"
- High score display
- Controls explanation

**Pause Screen:**

- Semi-transparent overlay
- "PAUSED" text
- Resume instructions

**Game Over Screen:**

- Final score
- High score comparison
- Restart button
- Fade-in animation

---

## 5. Input System

### 5.1 Keyboard Controls

```javascript
class InputSystem {
  directionBuffer = [];

  constructor() {
    window.addEventListener("keydown", this.handleInput);
  }

  handleInput = (event) => {
    const keyMap = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    };

    const direction = keyMap[event.key];
    if (direction) {
      this.directionBuffer.push(direction);
    }
  };

  consumeInput(currentDirection) {
    while (this.directionBuffer.length > 0) {
      const dir = this.directionBuffer.shift();

      // Prevent 180° turns
      if (dir.x !== -currentDirection.x && dir.y !== -currentDirection.y) {
        return dir;
      }
    }
    return currentDirection;
  }
}
```

### 5.2 Touch Controls (Mobile)

- Swipe detection
- On-screen directional pad
- Responsive design

---

## 6. Performance Optimizations

### 6.1 Sprite Pooling

```javascript
class SpritePool {
  pool = [];

  get() {
    return this.pool.pop() || new Graphics();
  }

  release(sprite) {
    sprite.clear();
    this.pool.push(sprite);
  }
}
```

### 6.2 Batch Rendering

- Group all snake segments in single Container
- Use Graphics for simple shapes instead of Sprites
- Minimize state changes

### 6.3 Efficient Updates

- Only update what changed
- Use `visible = false` instead of removing/adding
- Dirty flag system

---

## 7. State Machine

```javascript
const GameStates = {
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "game_over",
};

class GameState {
  currentState = GameStates.MENU;

  transition(newState) {
    this.onExit(this.currentState);
    this.currentState = newState;
    this.onEnter(newState);
  }

  onEnter(state) {
    switch (state) {
      case GameStates.PLAYING:
        this.game.start();
        break;
      case GameStates.PAUSED:
        this.game.pause();
        break;
      // ... etc
    }
  }
}
```

---

## 8. Enhanced Features (Optional)

### 8.1 Power-ups

- **Speed Boost**: Temporary speed increase
- **Slow Motion**: Temporary slow down
- **Shield**: One-time collision protection
- **Score Multiplier**: 2x points for 10 seconds

### 8.2 Game Modes

- **Classic**: Standard gameplay
- **Timed Challenge**: Score as much as possible in 60 seconds
- **Obstacles**: Walls appear in the arena
- **Endless**: No speed increase

### 8.3 Audio

```javascript
class AudioSystem {
  sounds = {
    eat: new Audio("eat.mp3"),
    gameOver: new Audio("gameover.mp3"),
    background: new Audio("bgm.mp3"),
  };

  muted = false;

  play(soundName) {
    if (!this.muted) {
      this.sounds[soundName].play();
    }
  }
}
```

### 8.4 Statistics

- Games played
- Total score
- Average score
- Longest snake

---

## 9. Implementation Checklist

### Phase 1: Core Foundation

- [ ] Setup PixiJS Application
- [ ] Create grid system
- [ ] Implement basic snake movement
- [ ] Add food spawning
- [ ] Basic collision detection

### Phase 2: Visual Polish

- [ ] Graphics-based rendering
- [ ] Smooth interpolation
- [ ] Color scheme implementation
- [ ] Particle effects
- [ ] Screen transitions

### Phase 3: UI/UX

- [ ] Menu screen
- [ ] HUD (score display)
- [ ] Pause functionality
- [ ] Game over screen
- [ ] High score (localStorage)

### Phase 4: Input & Controls

- [ ] Keyboard input
- [ ] Direction buffering
- [ ] Touch controls
- [ ] Responsive design

### Phase 5: Polish & Performance

- [ ] Sprite pooling
- [ ] Performance optimization
- [ ] Sound effects
- [ ] Animations
- [ ] Testing

---

## 10. Key PixiJS Patterns to Use

### Application Setup

```javascript
const app = new Application();

await app.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1a1a2e,
  antialias: true,
  resolution: window.devicePixelRatio,
});

document.body.appendChild(app.canvas);
```

### Game Loop with Ticker

```javascript
app.ticker.add((ticker) => {
  const deltaTime = ticker.deltaTime;
  const deltaMS = ticker.deltaMS;

  // Update game logic
  gameState.update(deltaTime);

  // Update visuals
  renderSystem.render(deltaMS);
});
```

### Graphics for Snake Segments

```javascript
const segment = new Graphics();
segment.roundRect(0, 0, CELL_SIZE - 2, CELL_SIZE - 2, 8);
segment.fill(COLORS.snakeBody);
segment.position.set(x * CELL_SIZE, y * CELL_SIZE);
```

### Container Hierarchy

```javascript
const gameContainer = new Container();
const snakeContainer = new Container();
const foodContainer = new Container();

gameContainer.addChild(snakeContainer, foodContainer);
app.stage.addChild(gameContainer);
```

---

## 11. Best Practices

1. **Separation of Concerns**: Each system handles one responsibility
2. **Dependency Injection**: Pass dependencies to constructors
3. **Pure Functions**: Make functions side-effect free where possible
4. **Constants**: Use named constants instead of magic numbers
5. **Cleanup**: Always destroy objects when done
6. **Performance**: Pool objects, minimize allocations in game loop
7. **Testing**: Test each system independently
8. **Comments**: Explain WHY, not WHAT

---

## 12. Development Timeline (Estimated)

- **Day 1**: Setup + Grid + Basic Snake Movement
- **Day 2**: Food + Collision + Core Game Loop
- **Day 3**: Visual Polish + Interpolation
- **Day 4**: UI/UX + Screens
- **Day 5**: Input System + State Machine
- **Day 6**: Particle Effects + Audio
- **Day 7**: Testing + Performance + Polish

---

## Next Steps

1. Initialize npm project: `npm init -y`
2. Install dependencies: `npm install pixi.js vite`
3. Setup Vite dev server
4. Create basic HTML structure
5. Start with Application setup and grid rendering
6. Build incrementally, test each feature

Let me know when you're ready to start implementation!
