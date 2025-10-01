import { Container, Graphics } from "pixi.js";
import { GRID_SIZE, CELL_SIZE, COLORS } from "../utils/Constants";

export class Grid {
  public container: Container;
  private gridGraphics: Graphics;

  constructor() {
    this.container = new Container();
    this.gridGraphics = new Graphics();
    this.drawGrid();
    this.container.addChild(this.gridGraphics);
  }

  private drawGrid(): void {
    this.gridGraphics.clear();

    // Batch all lines into a single draw call for better performance
    // Draw all vertical lines
    for (let x = 0; x <= GRID_SIZE; x++) {
      const xPos = x * CELL_SIZE;
      this.gridGraphics.moveTo(xPos, 0).lineTo(xPos, GRID_SIZE * CELL_SIZE);
    }

    // Draw all horizontal lines
    for (let y = 0; y <= GRID_SIZE; y++) {
      const yPos = y * CELL_SIZE;
      this.gridGraphics.moveTo(0, yPos).lineTo(GRID_SIZE * CELL_SIZE, yPos);
    }

    // Single stroke call for all lines
    this.gridGraphics.stroke({ width: 1, color: COLORS.gridLine, alpha: 0.3 });

    // Mark as static to enable caching (grid never changes)
    this.gridGraphics.isRenderGroup = true;
  }
}
