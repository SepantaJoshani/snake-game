import type { Direction } from "../entities/Snake";
import { Directions } from "../utils/Constants";

interface TouchPosition {
  x: number;
  y: number;
}

export class InputSystem {
  private directionBuffer: Direction[];
  private touchStart: TouchPosition | null = null;
  private readonly minSwipeDistance = 30; // Minimum pixels for a valid swipe

  constructor() {
    this.directionBuffer = [];
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Touch event listeners
    window.addEventListener("touchstart", this.handleTouchStart.bind(this), {
      passive: false,
    });
    window.addEventListener("touchend", this.handleTouchEnd.bind(this), {
      passive: false,
    });
    window.addEventListener("touchmove", this.preventScroll.bind(this), {
      passive: false,
    });
  }

  private preventScroll(event: TouchEvent): void {
    // Prevent default scrolling behavior on mobile
    event.preventDefault();
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();

    if (!this.touchStart) {
      return;
    }

    const touch = event.changedTouches[0];
    const touchEnd: TouchPosition = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const deltaX = touchEnd.x - this.touchStart.x;
    const deltaY = touchEnd.y - this.touchStart.y;

    // Calculate absolute distances
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if swipe is long enough
    if (
      absDeltaX < this.minSwipeDistance &&
      absDeltaY < this.minSwipeDistance
    ) {
      this.touchStart = null;
      return;
    }

    // Determine swipe direction based on the dominant axis
    let direction: Direction | null = null;

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      direction = deltaX > 0 ? Directions.RIGHT : Directions.LEFT;
    } else {
      // Vertical swipe
      direction = deltaY > 0 ? Directions.DOWN : Directions.UP;
    }

    if (direction) {
      this.directionBuffer.push({ ...direction });
    }

    this.touchStart = null;
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
      if (dir.x !== -currentDirection.x || dir.y !== -currentDirection.y) {
        return dir;
      }
    }
    return currentDirection;
  }

  public clearBuffer(): void {
    this.directionBuffer = [];
  }
}
