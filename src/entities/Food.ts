import { Container, Graphics } from "pixi.js";
import { GRID_SIZE, CELL_SIZE, COLORS } from "../utils/Constants";
import type { Position } from "./Snake";

export class Food {
  public container: Container;
  public position: Position;
  private foodGraphic: Graphics;
  private animationTime: number;
  private glowGraphic: Graphics;

  constructor() {
    this.container = new Container();
    this.glowGraphic = new Graphics();
    this.foodGraphic = new Graphics();
    this.position = { x: 0, y: 0 };
    this.animationTime = 0;

    // Add glow graphic behind main food
    this.container.addChild(this.glowGraphic);
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

    // Reset animation when spawning
    this.animationTime = 0;
    this.render();
  }

  public update(delta: number): void {
    // Increment animation time
    this.animationTime += delta * 0.05;

    // Calculate pulsing scale (oscillates between 0.85 and 1.15)
    const pulseScale = 1 + Math.sin(this.animationTime * 2) * 0.15;

    // Calculate rotation (slow continuous rotation)
    const rotation = this.animationTime * 0.5;

    // Apply transformations to main food
    this.foodGraphic.scale.set(pulseScale);
    this.foodGraphic.rotation = rotation;

    // Pulse glow effect (scale and alpha)
    const glowScale = 1.2 + Math.sin(this.animationTime * 3) * 0.3;
    const glowAlpha = 0.3 + Math.sin(this.animationTime * 3) * 0.2;
    this.glowGraphic.scale.set(glowScale);
    this.glowGraphic.alpha = glowAlpha;
    this.glowGraphic.rotation = rotation * 0.5; // Slower rotation for glow
  }

  private render(): void {
    this.foodGraphic.clear();
    this.glowGraphic.clear();

    const centerX = this.position.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = this.position.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 6;

    // Set pivot point to center for proper rotation and scaling
    this.foodGraphic.pivot.set(centerX, centerY);
    this.foodGraphic.position.set(centerX, centerY);
    this.glowGraphic.pivot.set(centerX, centerY);
    this.glowGraphic.position.set(centerX, centerY);

    // Draw glow layer (larger, behind main food)
    this.glowGraphic.circle(centerX, centerY, radius + 8);
    this.glowGraphic.fill({ color: COLORS.foodGlow, alpha: 0.4 });

    // Draw main food circle with vibrant color
    this.foodGraphic.circle(centerX, centerY, radius);
    this.foodGraphic.fill(COLORS.food);

    // Add inner highlight for depth
    this.foodGraphic.circle(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      radius * 0.4
    );
    this.foodGraphic.fill({ color: 0xffffff, alpha: 0.3 });

    // Add outer ring for extra visual appeal
    this.foodGraphic.circle(centerX, centerY, radius);
    this.foodGraphic.stroke({ width: 2, color: COLORS.foodGlow, alpha: 0.6 });
  }
}
