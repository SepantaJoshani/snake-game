import type { Direction } from '../entities/Snake';
import { Directions } from '../utils/Constants';

export class InputSystem {
  private directionBuffer: Direction[];

  constructor() {
    this.directionBuffer = [];
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const keyMap: Record<string, Direction> = {
      ArrowUp: Directions.UP,
      ArrowDown: Directions.DOWN,
      ArrowLeft: Directions.LEFT,
      ArrowRight: Directions.RIGHT,
      w: Directions.UP,
      W: Directions.UP,
      s: Directions.DOWN,
      S: Directions.DOWN,
      a: Directions.LEFT,
      A: Directions.LEFT,
      d: Directions.RIGHT,
      D: Directions.RIGHT,
    };

    const direction = keyMap[event.key];
    if (direction) {
      event.preventDefault();
      this.directionBuffer.push({ ...direction });
    }
  }

  public consumeInput(currentDirection: Direction): Direction {
    while (this.directionBuffer.length > 0) {
      const dir = this.directionBuffer.shift()!;

      // Prevent 180-degree turns
      if (
        dir.x !== -currentDirection.x ||
        dir.y !== -currentDirection.y
      ) {
        return dir;
      }
    }
    return currentDirection;
  }

  public clearBuffer(): void {
    this.directionBuffer = [];
  }
}
