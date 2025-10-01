# 🐍 Snake Game - Claude 4.5 Sonnet Capability Test

> **A fully vibe-coded project testing Claude 4.5 Sonnet's capabilities with Cursor** 🧪  
> This is an experimental project to explore AI-assisted game development workflows!

<div align="center">

![PixiJS](https://img.shields.io/badge/PixiJS-8.13.2-ff0066?style=for-the-badge&logo=pixijs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite)
![Claude 4.5](https://img.shields.io/badge/Claude-4.5_Sonnet-8A2BE2?style=for-the-badge)

</div>

---

## 🧪 Experiment Goals

This project tests **Claude 4.5 Sonnet's** ability to build a complete, production-quality game through a structured vibe-coding workflow. The goal is to see how far we can go with minimal manual coding.

### 🚀 The Vibe-Coding Workflow

Here's the exact process I followed - **I'd love for you to try it and share your results!**

#### **Step 1: Setup Clean Code Foundation**

Added a custom Clean Code rule to Cursor workspace to ensure structured, maintainable code from the start.

- Enforces SOLID principles
- Meaningful variable names
- Single responsibility functions
- DRY principle

#### **Step 2: Create PixiJS MCP Server**

Connected to PixiJS GitHub repository using MCP (Model Context Protocol) server with [gitmcp](https://gitmcp.io/).

This gave Claude real-time access to PixiJS v8 documentation and examples.

#### **Step 3: Generate Comprehensive Game Plan**

Created `GAME_PLAN.md` with Claude's help using the PixiJS MCP:

- Complete architecture design
- System breakdown (entities, systems, UI)
- Performance optimization strategies
- Best practices and patterns

#### **Step 4: Break Down Into Tasks**

Generated `TASKS.md` - detailed step-by-step implementation:

- 16 phases with 70+ individual tasks
- Each task has clear completion criteria
- Incremental, testable progress

#### **Step 5: Execute with Task Runner**

Created a `task-runner.md` command in `.cursor/commands/` to:

- Read current task from TASKS.md
- Implement the task
- Mark as complete
- Move to next task

#### **Step 6: Validate with Browser Testing**

After each task, used Playwright MCP (or Cursor's new `@browser` feature) to:

- Check the result in browser
- Identify visual/functional issues
- Fix problems immediately
- Ensure quality at each step

### 🎯 Results

The workflow produced a **fully functional, polished game** with:

- ✅ 60 FPS smooth gameplay with interpolation
- ✅ Procedural audio system (Web Audio API)
- ✅ Full mobile support with touch controls
- ✅ Particle effects and screen effects
- ✅ Professional code quality (TypeScript strict mode)
- ✅ Performance optimizations (object pooling, render groups)
- ✅ Complete UI system (menu, HUD, pause, game over)

**Total development time**: ~7 focused sessions following the task list

---

## 🎮 What Got Built

### Core Game Features

- Classic snake mechanics with grid-based movement (20x20 grid)
- Progressive difficulty (speed increases every 5 food items)
- Complete collision system (walls, self, food)
- Score tracking with localStorage persistence

### Visual & Audio Polish

- **Smooth 60 FPS** with fixed time-step + visual interpolation
- **Procedural audio** - all sounds generated via Web Audio API (no audio files!)
- **Particle effects** with physics (velocity, gravity, fade)
- **Screen effects** (shake, flash, smooth transitions)
- **Gradient snake** with animated eyes that track direction
- **Animated food** with pulse and rotation

### Mobile & Responsive

- Full touch controls (directional pad + swipe gestures)
- Responsive canvas scaling (works on all screen sizes)
- Orientation change handling
- Optimized for both desktop and mobile

### Performance Engineering

- **Object pooling** (zero allocations in game loop)
- **Render groups** for optimized batching
- **TypeScript strict mode** with full type safety
- Performance stats monitoring (toggle with F key)

---

## 🏗️ Technical Architecture

Claude 4.5 organized the code using **clean architecture patterns**:

```
src/
├── core/          # Game orchestrator & state machine
├── entities/      # Snake, Food, Grid
├── systems/       # Input, Collision, Score, Audio
├── ui/            # Menu, HUD, Pause, GameOver screens
└── utils/         # Constants, ParticlePool
```

**Key Design Patterns Applied**:

- **Entity-Component-System** for game objects
- **State Machine** for game flow (MENU → PLAYING ⇄ PAUSED → GAME_OVER)
- **Object Pooling** for performance (zero allocations in game loop)
- **Observer Pattern** for event handling

---

## 🎹 Controls

**Desktop**: Arrow Keys or WASD • Space (start/pause) • P (pause) • M (mute) • F (stats)  
**Mobile**: Touch controls + Swipe gestures

---

## 🛠️ Tech Stack

- **PixiJS v8** (WebGL rendering) • **TypeScript** (strict mode) • **Vite** (build tool)
- **Web Audio API** (procedural sounds) • **localStorage** (persistence)
- **Touch Events API** (mobile) • **pixi-stats** (performance monitoring)

---

## 🚀 Try It Yourself

```bash
pnpm install
pnpm dev
```

Game runs at `http://localhost:5173` with HMR enabled.

---

## 💭 Key Takeaways

### What Claude 4.5 Did Well

✅ **Architectural Planning** - Generated comprehensive 560-line game plan  
✅ **Task Breakdown** - Created 803 lines of detailed, sequential tasks  
✅ **Code Quality** - Followed SOLID principles and Clean Code patterns  
✅ **Performance** - Implemented object pooling and optimization techniques  
✅ **Problem Solving** - Handled complex challenges (interpolation, audio context, mobile touch)

### Interesting Challenges Claude Solved

- **Smooth Movement**: Fixed time-step + visual interpolation for 60 FPS
- **Direction Buffering**: Prevents 180° turns while staying responsive
- **Procedural Audio**: Generated all sounds with Web Audio API (no files!)
- **Mobile UX**: Touch controls that don't conflict with swipe gestures
- **Performance**: Zero allocations in game loop via object pooling

---

## 🙏 Try This Workflow!

I'd love to see others try this structured vibe-coding approach with **any AI model you like**:

1. **Add Clean Code rules** to your workspace
2. **Connect to docs** via MCP (like PixiJS GitHub)
3. **Generate a game plan** with your AI assistant
4. **Break into tasks** (detailed checklist)
5. **Use task runner** to execute systematically
6. **Validate with @browser** after each step

**Share your results!** What worked? What didn't? What did you build? Which AI model did you use?

This experiment shows that with proper structure and tooling, AI can be a powerful pair programming partner. The key is giving it context (docs via MCP), constraints (Clean Code rules), and a systematic workflow (task runner).

---

## 📚 Resources

**Tools Used**:

- [Cursor](https://cursor.com) - AI-powered code editor
- [Claude 4.5 Sonnet](https://www.anthropic.com/claude) - AI pair programming
- [gitmcp](https://gitmcp.io/) - MCP server for GitHub repositories
- [PixiJS v8 Docs](https://pixijs.com/8.x/guides) - Game engine documentation

**Learning**:

- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

<div align="center">

**🐍 Built entirely through vibe-coding with Claude 4.5 Sonnet in Cursor**

_An experiment in structured AI-assisted development_

**If you try this workflow, tag me and share your results!** 🙌

</div>
