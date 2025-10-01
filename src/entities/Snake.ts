import { Container, Graphics } from 'pixi.js';
import { CELL_SIZE, COLORS, Directions } from '../utils/Constants';

export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}

export class Snake {
  public container: Container;
  public segments: Position[];
  public direction: Direction;
  private segmentGraphics: Graphics[];
  private shouldGrow: boolean;

  constructor(startX: number = 10, startY: number = 10) {
    this.container = new Container();
    this.segments = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    this.direction = { ...Directions.RIGHT };
    this.segmentGraphics = [];
    this.shouldGrow = false;

    this.render();
  }

  public move(): void {
    // Calculate new head position
    const head = this.segments[0];
    const newHead: Position = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    // Add new head to front
    this.segments.unshift(newHead);

    // Remove tail unless we should grow
    if (!this.shouldGrow) {
      this.segments.pop();
    } else {
      this.shouldGrow = false;
    }

    this.render();
  }

  public grow(): void {
    this.shouldGrow = true;
  }

  public setDirection(newDirection: Direction): void {
    // Prevent 180-degree turns
    if (
      newDirection.x === -this.direction.x &&
      newDirection.y === -this.direction.y
    ) {
      return;
    }
    this.direction = { ...newDirection };
  }

  public getHead(): Position {
    return this.segments[0];
  }

  private render(): void {
    // Clear existing graphics
    this.segmentGraphics.forEach((graphic) => graphic.destroy());
    this.segmentGraphics = [];
    this.container.removeChildren();

    // Render each segment
    this.segments.forEach((segment, index) => {
      const graphic = new Graphics();
      const isHead = index === 0;
      const color = isHead ? COLORS.snakeHead : COLORS.snakeBody;

      // Draw rounded rectangle for segment
      const padding = 2;
      graphic.roundRect(
        segment.x * CELL_SIZE + padding,
        segment.y * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2,
        8
      );
      graphic.fill(color);

      // Add slight border for head
      if (isHead) {
        graphic.roundRect(
          segment.x * CELL_SIZE + padding,
          segment.y * CELL_SIZE + padding,
          CELL_SIZE - padding * 2,
          CELL_SIZE - padding * 2,
          8
        );
        graphic.stroke({ width: 2, color: 0xffffff, alpha: 0.3 });
      }

      this.segmentGraphics.push(graphic);
      this.container.addChild(graphic);
    });
  }
}
