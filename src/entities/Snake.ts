import { Container, Graphics } from "pixi.js";
import { CELL_SIZE, COLORS, Directions } from "../utils/Constants";

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
  private previousSegments: Position[];

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

    // Store previous positions for interpolation
    this.previousSegments = this.segments.map((seg) => ({ ...seg }));

    this.render();
  }

  public move(): void {
    // Store previous positions for interpolation
    this.previousSegments = this.segments.map((seg) => ({ ...seg }));

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

  public interpolate(progress: number): void {
    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    // Render with interpolated positions
    this.renderInterpolated(progress);
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  private renderInterpolated(progress: number): void {
    // Clear existing graphics
    this.segmentGraphics.forEach((graphic) => graphic.destroy());
    this.segmentGraphics = [];
    this.container.removeChildren();

    const totalSegments = this.segments.length;

    // Render each segment with interpolated positions
    this.segments.forEach((segment, index) => {
      const graphic = new Graphics();
      const isHead = index === 0;

      // Calculate gradient color based on position (darker towards tail)
      const gradientFactor = index / Math.max(totalSegments - 1, 1);
      const color = this.interpolateColor(
        COLORS.snakeHead,
        COLORS.snakeBody,
        gradientFactor
      );

      // Get interpolated position
      const prevSegment = this.previousSegments[index] || segment;
      const interpolatedX = this.lerp(prevSegment.x, segment.x, progress);
      const interpolatedY = this.lerp(prevSegment.y, segment.y, progress);

      const padding = 2;
      const x = interpolatedX * CELL_SIZE + padding;
      const y = interpolatedY * CELL_SIZE + padding;
      const size = CELL_SIZE - padding * 2;
      const radius = isHead ? 14 : 12; // More rounded corners

      // Draw subtle shadow/outline
      graphic.roundRect(x + 1, y + 1, size, size, radius);
      graphic.fill({ color: 0x000000, alpha: 0.3 });

      // Draw main segment with gradient color
      graphic.roundRect(x, y, size, size, radius);
      graphic.fill(color);

      // Add outline for depth
      graphic.roundRect(x, y, size, size, radius);
      graphic.stroke({ width: 1, color: 0xffffff, alpha: 0.2 });

      // Enhanced head visuals
      if (isHead) {
        // Brighter outline for head
        graphic.roundRect(x, y, size, size, radius);
        graphic.stroke({ width: 2, color: 0xffffff, alpha: 0.4 });

        // Add eyes based on direction
        this.drawEyes(graphic, x, y, size);
      }

      this.segmentGraphics.push(graphic);
      this.container.addChild(graphic);
    });
  }

  private render(): void {
    // Clear existing graphics
    this.segmentGraphics.forEach((graphic) => graphic.destroy());
    this.segmentGraphics = [];
    this.container.removeChildren();

    const totalSegments = this.segments.length;

    // Render each segment
    this.segments.forEach((segment, index) => {
      const graphic = new Graphics();
      const isHead = index === 0;

      // Calculate gradient color based on position (darker towards tail)
      const gradientFactor = index / Math.max(totalSegments - 1, 1);
      const color = this.interpolateColor(
        COLORS.snakeHead,
        COLORS.snakeBody,
        gradientFactor
      );

      const padding = 2;
      const x = segment.x * CELL_SIZE + padding;
      const y = segment.y * CELL_SIZE + padding;
      const size = CELL_SIZE - padding * 2;
      const radius = isHead ? 14 : 12; // More rounded corners

      // Draw subtle shadow/outline
      graphic.roundRect(x + 1, y + 1, size, size, radius);
      graphic.fill({ color: 0x000000, alpha: 0.3 });

      // Draw main segment with gradient color
      graphic.roundRect(x, y, size, size, radius);
      graphic.fill(color);

      // Add outline for depth
      graphic.roundRect(x, y, size, size, radius);
      graphic.stroke({ width: 1, color: 0xffffff, alpha: 0.2 });

      // Enhanced head visuals
      if (isHead) {
        // Brighter outline for head
        graphic.roundRect(x, y, size, size, radius);
        graphic.stroke({ width: 2, color: 0xffffff, alpha: 0.4 });

        // Add eyes based on direction
        this.drawEyes(graphic, x, y, size);
      }

      this.segmentGraphics.push(graphic);
      this.container.addChild(graphic);
    });
  }

  private interpolateColor(
    color1: number,
    color2: number,
    factor: number
  ): number {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return (r << 16) | (g << 8) | b;
  }

  private drawEyes(
    graphic: Graphics,
    x: number,
    y: number,
    size: number
  ): void {
    const eyeSize = 4;
    const eyeOffset = 8;

    // Determine eye positions based on direction
    let eye1X = x + size / 2 - eyeOffset;
    let eye1Y = y + size / 2 - eyeOffset;
    let eye2X = x + size / 2 + eyeOffset;
    let eye2Y = y + size / 2 - eyeOffset;

    // Adjust eye positions based on movement direction
    if (this.direction.x === 1) {
      // Moving right
      eye1X = x + size - 12;
      eye1Y = y + size / 2 - 6;
      eye2X = x + size - 12;
      eye2Y = y + size / 2 + 6;
    } else if (this.direction.x === -1) {
      // Moving left
      eye1X = x + 12;
      eye1Y = y + size / 2 - 6;
      eye2X = x + 12;
      eye2Y = y + size / 2 + 6;
    } else if (this.direction.y === -1) {
      // Moving up
      eye1X = x + size / 2 - 6;
      eye1Y = y + 12;
      eye2X = x + size / 2 + 6;
      eye2Y = y + 12;
    } else if (this.direction.y === 1) {
      // Moving down
      eye1X = x + size / 2 - 6;
      eye1Y = y + size - 12;
      eye2X = x + size / 2 + 6;
      eye2Y = y + size - 12;
    }

    // Draw eyes with white color
    graphic.circle(eye1X, eye1Y, eyeSize);
    graphic.fill({ color: 0xffffff, alpha: 0.9 });

    graphic.circle(eye2X, eye2Y, eyeSize);
    graphic.fill({ color: 0xffffff, alpha: 0.9 });

    // Add pupils
    graphic.circle(eye1X, eye1Y, eyeSize / 2);
    graphic.fill({ color: 0x000000, alpha: 0.8 });

    graphic.circle(eye2X, eye2Y, eyeSize / 2);
    graphic.fill({ color: 0x000000, alpha: 0.8 });
  }
}
