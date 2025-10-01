import "./style.css";
import { Application } from "pixi.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from "./utils/Constants";
import { Game } from "./core/Game";

async function initializeGame() {
  const app = new Application();

  await app.init({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: COLORS.background,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  });

  const appContainer = document.querySelector<HTMLDivElement>("#app");
  if (appContainer) {
    appContainer.appendChild(app.canvas);
  }

  // Initialize the game
  new Game(app);

  console.log("🐍 Snake Game initialized!");
  console.log(`Canvas size: ${CANVAS_WIDTH}x${CANVAS_HEIGHT}`);
}

initializeGame().catch(console.error);
