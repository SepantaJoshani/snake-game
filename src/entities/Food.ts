import { Container, Graphics } from "pixi.js";
import { GRID_SIZE, CELL_SIZE, COLORS } from "../utils/Constants";
import type { Position } from "./Snake";

export class Food {
  public container: Container;
  public position: Position;
  private foodGraphic: Graphics;

  constructor() {
    this.container = new Container();
    this.foodGraphic = new Graphics();
    this.position = { x: 0, y: 0 };
    this.container.addChild(this.foodGraphic);
    this.spawn();
  }

  public spawn(occupiedPositions: Set<string> = new Set()): void {
    let validPosition = false;

    while (!validPosition) {
      this.position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };

      const posKey = `${this.position.x},${this.position.y}`;
      if (!occupiedPositions.has(posKey)) {
        validPosition = true;
      }
    }

    this.render();
  }

  private render(): void {
    this.foodGraphic.clear();

    const centerX = this.position.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = this.position.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 4;

    // Draw main food circle
    this.foodGraphic.circle(centerX, centerY, radius);
    this.foodGraphic.fill(COLORS.food);

    // Add subtle glow effect
    this.foodGraphic.circle(centerX, centerY, radius + 2);
    this.foodGraphic.stroke({ width: 2, color: COLORS.foodGlow, alpha: 0.5 });
  }
}
