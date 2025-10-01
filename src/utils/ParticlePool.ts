import { Container, Graphics } from "pixi.js";

interface Particle {
  graphic: Graphics;
  active: boolean;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: number;
}

export class ParticlePool {
  private particles: Particle[];
  private container: Container;

  constructor(poolSize: number = 50) {
    this.particles = [];
    this.container = new Container();

    // Pre-create particle pool
    for (let i = 0; i < poolSize; i++) {
      const graphic = new Graphics();
      this.container.addChild(graphic);

      this.particles.push({
        graphic,
        active: false,
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        life: 0,
        maxLife: 1,
        color: 0xffffff,
      });
    }
  }

  public getContainer(): Container {
    return this.container;
  }

  public burst(x: number, y: number, color: number, count: number = 15): void {
    for (let i = 0; i < count; i++) {
      const particle = this.getInactiveParticle();
      if (!particle) break;

      // Activate particle
      particle.active = true;
      particle.x = x;
      particle.y = y;
      particle.color = color;
      particle.maxLife = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 seconds
      particle.life = particle.maxLife;

      // Random velocity in all directions
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3; // 2 to 5 pixels per frame
      particle.velocityX = Math.cos(angle) * speed;
      particle.velocityY = Math.sin(angle) * speed;

      this.renderParticle(particle);
    }
  }

  public update(delta: number): void {
    const gravity = 0.15;
    const friction = 0.98;

    this.particles.forEach((particle) => {
      if (!particle.active) return;

      // Update physics
      particle.velocityY += gravity; // Apply gravity
      particle.velocityX *= friction; // Apply friction
      particle.velocityY *= friction;

      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      // Update life
      particle.life -= delta * 0.001;

      if (particle.life <= 0) {
        particle.active = false;
        particle.graphic.clear();
        return;
      }

      this.renderParticle(particle);
    });
  }

  private getInactiveParticle(): Particle | null {
    return this.particles.find((p) => !p.active) || null;
  }

  private renderParticle(particle: Particle): void {
    const lifePercent = particle.life / particle.maxLife;
    const alpha = lifePercent;
    const size = 3 + lifePercent * 3; // Shrinks from 6 to 3

    particle.graphic.clear();
    particle.graphic.circle(particle.x, particle.y, size);
    particle.graphic.fill({ color: particle.color, alpha });
  }
}
