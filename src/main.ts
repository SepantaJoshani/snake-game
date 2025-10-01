import "./style.css";
import { Application } from "pixi.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from "./utils/Constants";
import { Game } from "./core/Game";

function calculateResponsiveSize(): {
  width: number;
  height: number;
  scale: number;
} {
  const padding = 20;
  const maxWidth = window.innerWidth - padding;
  const maxHeight = window.innerHeight - padding;

  // Calculate the scale to fit within viewport while maintaining aspect ratio
  const scaleX = maxWidth / CANVAS_WIDTH;
  const scaleY = maxHeight / CANVAS_HEIGHT;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1x

  return {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    scale,
  };
}

function resizeCanvas(app: Application): void {
  const { scale } = calculateResponsiveSize();

  // Update canvas CSS size for responsive display
  if (app.canvas) {
    const displayWidth = CANVAS_WIDTH * scale;
    const displayHeight = CANVAS_HEIGHT * scale;

    app.canvas.style.width = `${displayWidth}px`;
    app.canvas.style.height = `${displayHeight}px`;
  }
}

async function initializeGame() {
  const app = new Application();
  const { width, height } = calculateResponsiveSize();

  await app.init({
    width,
    height,
    backgroundColor: COLORS.background,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  const appContainer = document.querySelector<HTMLDivElement>("#app");
  if (appContainer) {
    appContainer.appendChild(app.canvas);
  }

  // Initial resize
  resizeCanvas(app);

  // Handle window resize
  window.addEventListener("resize", () => {
    resizeCanvas(app);
  });

  // Handle orientation change (mobile)
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      resizeCanvas(app);
    }, 100);
  });

  // Initialize the game
  new Game(app);

  console.log("🐍 Snake Game initialized!");
  console.log(`Canvas size: ${CANVAS_WIDTH}x${CANVAS_HEIGHT}`);
  console.log(`Device: ${isMobileDevice() ? "Mobile" : "Desktop"}`);
}

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

initializeGame().catch(console.error);
