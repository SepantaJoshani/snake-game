# Snake Game - Step-by-Step Task List

**Progress Tracking**: Mark completed tasks with `[x]`

---

## 🚀 Phase 1: Project Setup & Foundation

### Task 1.1: Initialize Project

- [x] Create `package.json` with `pnpm init -y`
- [x] Install dependencies: `pnpm install pixi.js`
- [x] Install dev dependencies: `npm install -D vite`
- [x] Add scripts to `package.json`:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```

**Completion Criteria**: `pnpm run dev` starts development server

---

### Task 1.2: Create Basic HTML Structure

- [x] Create `index.html` with basic structure
- [x] Add `<div id="app"></div>` container
- [x] Link to `src/main.js` as module
- [x] Create `style.css` with basic reset and centering

**Completion Criteria**: HTML loads and displays canvas container

**Files to create:**

```
index.html
style.css
```

---

### Task 1.3: Setup PixiJS Application

- [x] Create `src/main.js`
- [x] Import PixiJS Application
- [x] Initialize Application with config:
  - Width: 800px
  - Height: 800px
  - Background: `0x1a1a2e`
  - Antialias: true
- [x] Append canvas to DOM
- [x] Test that blue/dark canvas appears

**Completion Criteria**: Canvas renders on screen with dark background

**Files to create:**

```
src/main.js
```

---

### Task 1.4: Create Constants File

- [x] Create `src/utils/Constants.js`
- [x] Define grid constants:
  - `GRID_SIZE = 20`
  - `CELL_SIZE = 40` (800 / 20)
- [x] Define color palette:
  - Background, grid, snake, food colors
- [x] Define game speed constants
- [x] Export all constants

**Completion Criteria**: Constants can be imported and used

**Files to create:**

```
src/utils/Constants.js
```

---

## 🎨 Phase 2: Grid System

### Task 2.1: Create Grid Class

- [x] Create `src/entities/Grid.js`
- [x] Constructor accepts grid size and cell size
- [x] Method `drawGrid()` using PixiJS Graphics
- [x] Draw horizontal and vertical lines
- [x] Use subtle color for grid lines (optional)
- [x] Add grid to main container

**Completion Criteria**: Grid lines visible on canvas

**Files to create:**

```
src/entities/Grid.js
```

---

### Task 2.2: Test Grid Rendering

- [x] Import Grid in `main.js`
- [x] Create Grid instance
- [x] Add to app stage
- [x] Verify grid displays correctly
- [x] Verify cell spacing is correct

**Completion Criteria**: 20x20 grid visible, properly sized

---

## 🐍 Phase 3: Basic Snake Entity

### Task 3.1: Create Snake Class Structure

- [x] Create `src/entities/Snake.js`
- [x] Define constructor with initial position
- [x] Create segments array with 3 initial positions
- [x] Define direction object `{ x: 1, y: 0 }`
- [x] Create container for snake graphics

**Completion Criteria**: Snake class can be instantiated

**Files to create:**

```
src/entities/Snake.js
```

---

### Task 3.2: Implement Snake Visual Rendering

- [x] Create `render()` method in Snake class
- [x] For each segment, create Graphics rectangle
- [x] Use different color for head vs body
- [x] Round the corners (radius: 8)
- [x] Position segments on grid
- [x] Add 2px gap between cells

**Completion Criteria**: Snake appears as 3 green rectangles in a row

---

### Task 3.3: Implement Basic Snake Movement

- [x] Create `move()` method
- [x] Calculate new head position based on direction
- [x] Add new head to front of segments array
- [x] Remove last segment (tail)
- [x] Update visual positions
- [x] **Don't** handle collisions yet

**Completion Criteria**: Snake moves when `move()` is called manually

---

### Task 3.4: Integrate Snake with Game Loop

- [x] Import Snake in `main.js`
- [x] Create Snake instance
- [x] Add to app stage
- [x] Create simple ticker callback
- [x] Call `snake.move()` every 500ms
- [x] Test snake moves across screen

**Completion Criteria**: Snake automatically moves right continuously

---

## ⏱️ Phase 4: Fixed Time-Step Loop

### Task 4.1: Implement Time Accumulator

- [x] Create `elapsed` variable in main.js
- [x] Set `moveInterval = 150` (ms)
- [x] In ticker, accumulate `deltaMS`
- [x] Only call `move()` when elapsed >= moveInterval
- [x] Reset elapsed after movement
- [x] Test movement is consistent

**Completion Criteria**: Snake moves at fixed interval regardless of FPS

---

### Task 4.2: Add FPS Counter (Development Tool)

- [x] Create Text object for FPS display
- [x] Update text with `ticker.FPS` each frame
- [x] Position in top-right corner
- [x] Style appropriately

**Completion Criteria**: FPS counter visible and updating

---

## 🎮 Phase 5: Input System

### Task 5.1: Create InputSystem Class

- [x] Create `src/systems/InputSystem.js`
- [x] Add constructor with keyboard event listener
- [x] Create direction buffer array
- [x] Map arrow keys to direction objects
- [x] Map WASD keys to direction objects
- [x] Push directions to buffer on keydown

**Completion Criteria**: Input system logs key presses

**Files to create:**

```
src/systems/InputSystem.js
```

---

### Task 5.2: Implement Direction Buffering

- [x] Create `consumeInput(currentDirection)` method
- [x] Process buffer FIFO
- [x] Validate against 180° turns
- [x] Return valid direction or current
- [x] Clear invalid inputs from buffer

**Completion Criteria**: Only valid directions are processed

---

### Task 5.3: Connect Input to Snake

- [x] Integrate InputSystem in main.js
- [x] Before each move, consume input
- [x] Update snake direction
- [x] Test all 4 directions work
- [x] Test 180° turn is blocked
- [x] Test rapid inputs are buffered

**Completion Criteria**: Snake responds to keyboard, smooth direction changes

---

## 🍎 Phase 6: Food System

### Task 6.1: Create Food Class

- [x] Create `src/entities/Food.js`
- [x] Constructor with random position method
- [x] Store position as `{ x, y }` grid coordinates
- [x] Create `render()` method with Graphics
- [x] Draw circle with food color
- [x] Add glow effect (optional)

**Completion Criteria**: Food class creates visual food item

**Files to create:**

```
src/entities/Food.js
```

---

### Task 6.2: Implement Food Spawning Logic

- [x] Create `spawn()` method
- [x] Generate random x, y within grid bounds
- [x] Check position not occupied by snake
- [x] Retry until valid position found
- [x] Update visual position

**Completion Criteria**: Food spawns at random valid locations

---

### Task 6.3: Integrate Food with Game

- [x] Create Food instance in main.js
- [x] Add to app stage
- [x] Initial spawn on game start
- [x] Test food appears on grid
- [x] Test food doesn't spawn on snake

**Completion Criteria**: Food visible on grid, not overlapping snake

---

## 💥 Phase 7: Collision Detection

### Task 7.1: Create CollisionSystem Class

- [x] Create `src/systems/CollisionSystem.js`
- [x] Create `checkWallCollision(head)` method
- [x] Check if head x/y out of bounds
- [x] Return boolean
- [x] Test with manual head positions

**Completion Criteria**: Wall collision detection works

**Files to create:**

```
src/systems/CollisionSystem.js
```

---

### Task 7.2: Implement Self-Collision Detection

- [x] Create `checkSelfCollision(snake)` method
- [x] Get head position
- [x] Check if head matches any body segment
- [x] Use Set for O(1) lookup (optimization)
- [x] Return boolean

**Completion Criteria**: Self-collision detected when snake hits itself

---

### Task 7.3: Implement Food Collision Detection

- [x] Create `checkFoodCollision(snake, food)` method
- [x] Compare snake head with food position
- [x] Return boolean
- [x] Test with manual positions

**Completion Criteria**: Food collision detected correctly

---

### Task 7.4: Integrate Collision Handling

- [x] Integrate CollisionSystem in main.js
- [x] After each move, check all collisions
- [x] On food collision:
  - Don't remove tail (snake grows)
  - Respawn food
  - Increase score
- [x] On wall/self collision:
  - Log "Game Over" (for now)
  - Stop game loop
- [x] Test all collision types

**Completion Criteria**: Snake grows when eating, game stops on collision

---

## 📊 Phase 8: Score System

### Task 8.1: Create ScoreSystem Class

- [x] Create `src/systems/ScoreSystem.js`
- [x] Initialize score = 0
- [x] Create `addPoints(value)` method
- [x] Create `reset()` method
- [x] Create `getScore()` method

**Completion Criteria**: Score can be tracked and updated

**Files to create:**

```
src/systems/ScoreSystem.js
```

---

### Task 8.2: Integrate Score with Food Collection

- [x] Import ScoreSystem in main.js
- [x] Create instance
- [x] On food collision, add points
- [x] Log score to console
- [x] Test score increments correctly

**Completion Criteria**: Score increases when eating food

---

### Task 8.3: Add Score Display (HUD)

- [x] Create Text object for score
- [x] Position in top-left corner
- [x] Style with good font and color
- [x] Update text each frame
- [x] Format: "Score: XXX"

**Completion Criteria**: Score visible on screen and updates

---

### Task 8.4: Implement High Score

- [x] Add `highScore` property to ScoreSystem
- [x] On game over, compare scores
- [x] Update high score if current > high
- [x] Save to localStorage
- [x] Load from localStorage on init
- [x] Display high score on HUD

**Completion Criteria**: High score persists between sessions

---

## 🎬 Phase 9: Game State Machine

### Task 9.1: Create GameState Class

- [x] Create `src/core/GameState.js`
- [x] Define state constants (MENU, PLAYING, PAUSED, GAME_OVER)
- [x] Create `currentState` property
- [x] Create `transition(newState)` method
- [x] Add `onEnter(state)` and `onExit(state)` hooks

**Completion Criteria**: State machine can transition between states

**Files to create:**

```
src/core/GameState.js
```

---

### Task 9.2: Implement State Behaviors

- [x] MENU state: Show title, wait for start
- [x] PLAYING state: Normal game loop
- [x] PAUSED state: Freeze game, show pause overlay
- [x] GAME_OVER state: Stop loop, show final score
- [x] Handle state transitions properly

**Completion Criteria**: Each state behaves correctly

---

### Task 9.3: Add Pause Functionality

- [x] Listen for spacebar/P key
- [x] Toggle between PLAYING and PAUSED
- [x] Pause ticker when paused
- [x] Resume ticker when unpaused
- [x] Test pause/resume works

**Completion Criteria**: Game can be paused and resumed

---

## 🎨 Phase 10: Visual Polish

### Task 10.1: Improve Snake Visual

- [x] Add gradient to snake body
- [x] Make head distinct (different color/shape)
- [x] Add subtle shadow/outline
- [x] Make corners more rounded
- [x] Add visual "eyes" to head (optional)

**Completion Criteria**: Snake looks modern and polished ✅

---

### Task 10.2: Improve Food Visual

- [x] Make food a circle
- [x] Add pulsing scale animation
- [x] Add glow effect using filters
- [x] Add rotation animation
- [x] Use vibrant color

**Completion Criteria**: Food is attractive and animated ✅

---

### Task 10.3: Implement Smooth Interpolation

- [x] Store previous position for each segment
- [x] Create `interpolate(progress)` method
- [x] In ticker, calculate progress = elapsed / moveInterval
- [x] Lerp between previous and current positions
- [x] Apply to visual sprites only
- [x] Test smooth movement

**Completion Criteria**: Snake movement is smooth, not jumpy ✅

---

### Task 10.4: Add Particle Effects

- [x] Create `src/utils/ParticlePool.js`
- [x] Create particle Graphics objects
- [x] On food eaten, burst 10-15 particles
- [x] Give particles velocity and gravity
- [x] Fade out over time
- [x] Pool particles for reuse

**Completion Criteria**: Eating food creates particle burst ✅

**Files to create:**

```
src/utils/ParticlePool.js
```

---

### Task 10.5: Add Screen Effects

- [x] Implement screen shake on collision
- [x] Add flash effect on game over
- [x] Add smooth fade transitions between states
- [x] Test all effects work

**Completion Criteria**: Visual feedback for game events ✅

---

## 🖥️ Phase 11: UI Screens

### Task 11.1: Create MenuScreen

- [x] Create `src/ui/MenuScreen.js`
- [x] Design title text with styling
- [x] Add "Press SPACE to Start" instruction
- [x] Show high score
- [x] Add simple animation to title
- [x] Handle start input

**Completion Criteria**: Menu screen displays on game start

**Files to create:**

```
src/ui/MenuScreen.js
```

---

### Task 11.2: Create PauseScreen

- [x] Create `src/ui/PauseScreen.js`
- [x] Semi-transparent overlay
- [x] "PAUSED" text centered
- [x] "Press SPACE to Resume" instruction
- [x] Show/hide based on state

**Completion Criteria**: Pause screen appears when paused

**Files to create:**

```
src/ui/PauseScreen.js
```

---

### Task 11.3: Create GameOverScreen

- [x] Create `src/ui/GameOverScreen.js`
- [x] Display "GAME OVER"
- [x] Show final score
- [x] Show high score comparison
- [x] "Press SPACE to Restart" instruction
- [x] Add fade-in animation
- [x] Handle restart input

**Completion Criteria**: Game over screen shows on collision

**Files to create:**

```
src/ui/GameOverScreen.js
```

---

### Task 11.4: Create HUD Component

- [x] Create `src/ui/HUD.js`
- [x] Extract score display logic
- [x] Add current score
- [x] Add high score
- [x] Add FPS (optional, dev mode)
- [x] Style nicely

**Completion Criteria**: HUD is clean and always visible during play

**Files to create:**

```
src/ui/HUD.js
```

---

## 🎯 Phase 12: Progressive Difficulty

### Task 12.1: Implement Speed Increase

- [x] Track food eaten count
- [x] Every 5 food items, decrease moveInterval
- [x] Set minimum speed (50ms)
- [x] Formula: `Math.max(50, 150 - (foodCount * 5))`
- [x] Test difficulty progression

**Completion Criteria**: Game gets faster as you eat more food

---

### Task 12.2: Add Difficulty Indicator

- [x] Show current speed/level on HUD
- [x] Visual indicator of difficulty
- [x] Update on speed changes

**Completion Criteria**: Player can see difficulty level ✅

---

## ⚡ Phase 13: Performance Optimization

### Task 13.1: Implement Sprite Pooling

- [ ] Audit object creation in game loop
- [ ] Pool snake segment graphics
- [ ] Pool particle graphics
- [ ] Reuse instead of recreating
- [ ] Test performance improvement

**Completion Criteria**: No new allocations in game loop

---

### Task 13.2: Optimize Rendering

- [ ] Group all game objects in Containers
- [ ] Use Graphics instead of Sprites
- [ ] Minimize draw calls
- [ ] Test FPS remains 60

**Completion Criteria**: Game runs smoothly at 60 FPS

---

### Task 13.3: Code Cleanup

- [ ] Remove console.logs
- [ ] Remove unused code
- [ ] Add comments for complex logic
- [ ] Ensure clean code principles followed
- [ ] Run linter if available

**Completion Criteria**: Code is clean and maintainable

---

## 🎵 Phase 14: Audio (Optional)

### Task 14.1: Add Sound Effects

- [ ] Find/create sound files (eat, collision)
- [ ] Create AudioSystem class
- [ ] Play sound on food eaten
- [ ] Play sound on collision
- [ ] Add mute toggle

**Completion Criteria**: Sound effects play on events

**Files to create:**

```
src/systems/AudioSystem.js
```

---

### Task 14.2: Add Background Music

- [ ] Find/create background music
- [ ] Loop background music
- [ ] Lower volume appropriately
- [ ] Stop on game over
- [ ] Resume on restart

**Completion Criteria**: Background music enhances experience

---

## 📱 Phase 15: Mobile Support (Optional)

### Task 15.1: Add Touch Controls

- [ ] Detect swipe gestures
- [ ] Map swipes to directions
- [ ] Test on mobile device
- [ ] Add visual feedback
- [ ] Check responsive design

**Completion Criteria**: Game playable on mobile

---

### Task 15.2: Make Responsive

- [ ] Scale canvas to fit screen
- [ ] Maintain aspect ratio
- [ ] Test on different screen sizes
- [ ] Add orientation detection

**Completion Criteria**: Game works on different screen sizes

---

## ✅ Phase 16: Final Polish & Testing

### Task 16.1: Comprehensive Testing

- [ ] Test all game states
- [ ] Test all collisions
- [ ] Test pause/resume
- [ ] Test restart
- [ ] Test high score persistence
- [ ] Test edge cases

**Completion Criteria**: No bugs found

---

### Task 16.2: Balance Gameplay

- [ ] Adjust starting speed
- [ ] Adjust speed progression
- [ ] Adjust colors for better visibility
- [ ] Get feedback from testers

**Completion Criteria**: Game feels fun and balanced

---

### Task 16.3: Add Final Touches

- [ ] Add favicon
- [ ] Add meta tags
- [ ] Add instructions screen
- [ ] Polish all animations
- [ ] Final visual tweaks

**Completion Criteria**: Game feels complete

---

### Task 16.4: Build for Production

- [ ] Run `npm run build`
- [ ] Test production build
- [ ] Optimize asset loading
- [ ] Check bundle size

**Completion Criteria**: Production build works perfectly

---

## 🚀 Deployment (Optional)

### Task 17.1: Deploy to GitHub Pages

- [ ] Create GitHub repository
- [ ] Push code
- [ ] Configure GitHub Pages
- [ ] Test deployed version

**Completion Criteria**: Game is live and playable online

---

## 📝 Notes

- **Work incrementally**: Complete each task fully before moving to next
- **Test frequently**: After each task, verify it works
- **Commit often**: Git commit after completing each phase
- **Don't skip ahead**: Follow the order for best results
- **Ask for help**: If stuck on a task, ask for guidance

---

## 🎯 Current Progress

**Core game completed!** ✅

### Completed Features:

- ✅ Full game implementation with PixiJS
- ✅ Grid system, Snake entity, Food spawning
- ✅ Collision detection (walls, self, food)
- ✅ Input system with direction buffering
- ✅ Score system with localStorage persistence
- ✅ Game state machine (Menu, Playing, Paused, Game Over)
- ✅ UI screens and HUD
- ✅ Progressive difficulty

### Optional Enhancements Available:

- Phase 10: Visual polish (smooth interpolation, particle effects)
- Phase 13: Performance optimization
- Phase 14: Audio system
- Phase 15: Mobile support

Great job! 🐍✨
