// Grid Configuration
export const GRID_SIZE = 20;
export const CELL_SIZE = 40; // 800 / 20 = 40 pixels per cell
export const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE; // 800px
export const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE; // 800px

// Game Speed
export const INITIAL_MOVE_INTERVAL = 150; // milliseconds per move
export const MIN_MOVE_INTERVAL = 50; // fastest possible speed
export const SPEED_INCREASE_RATE = 5; // decrease interval by this much per food

// Color Palette
export const COLORS = {
  background: 0x1a1a2e,
  gridLine: 0x16213e,
  snakeHead: 0x4ecca3,
  snakeBody: 0x3a9279,
  food: 0xff6b6b,
  foodGlow: 0xff9999,
  text: 0xeeeeee,
  textDark: 0x888888,
} as const;

// Game States
export const GameStates = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
} as const;

// Direction Vectors
export const Directions = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const;

// Score Configuration
export const POINTS_PER_FOOD = 10;
export const FOOD_SPEED_THRESHOLD = 5; // Increase speed every N food items
