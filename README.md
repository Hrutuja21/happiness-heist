# The Happiness Heist: Sukh vs. Suvidha

A single-player 2D college-life adventure built with **Phaser 3**, **Vite**, HTML, CSS and JavaScript. All visuals are drawn procedurally with Phaser shapes, emoji and CSS; no game-art downloads or backend are required.

## 1. Project introduction
The player explores four college-life chapters, collects Sukh and Suvidha tokens, avoids pressure-themed enemies and reviews a Happiness Mirror report after each chapter. It is an educational simulation, not a clinical measure of happiness.

## 2. Game objective
Collect the chapter's required tokens and reach the glowing exit. The game rewards a mix of wellbeing, comfort, health, academic progress and relationships. Facility items alone are not enough for a balanced result.

## 3. Sukh and Suvidha
- **Sukh** is represented by hearts and mindful/reflection actions: peace, satisfaction and connection.
- **Suvidha** is represented by facility/comfort tokens: useful physical resources and convenience.
- Enemy contact increases stress and reduces health, energy and Sukh.
- A level report explains the player's current balance without judging the player.

## 4. Controls
- Desktop: Arrow keys or **W/A/S/D** to move; **Space** for a reflection action; **1–6** for choices (gadget, help a friend, sleep, study, exercise, entertainment); **P** or **Esc** to pause.
- Mobile/tablet: lower-left virtual joystick; lower-right **ACT** button.
- The pause panel includes resume, restart level and main menu. Sound can be toggled from the HUD or Settings.

## 5. Run locally
Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## 6. Production build and preview

```bash
npm run build
npm run preview
```
Vite writes the production website to `dist/`.

## 7. Deploy on Netlify
1. Push this project folder to a Git repository.
2. In Netlify, choose **Add new site → Import an existing project** and connect the repository.
3. Set build command to `npm run build` and publish directory to `dist` (also declared in `netlify.toml`).
4. Deploy. No environment variables are required.

## 8. Deploy on Render
1. Push the project to GitHub/GitLab.
2. In Render, select **New → Static Site** and connect the repository.
3. Use build command `npm install && npm run build` and publish directory `dist` (also declared in `render.yaml`).
4. Create the static site. No server process or environment variables are required.

## 9. Project structure

```text
happiness-heist/
├── index.html
├── package.json
├── netlify.toml
├── render.yaml
├── README.md
└── src/
    ├── main.js                 # UI screens, controls, save/export wiring
    ├── gameConfig.js           # Level and starting-value configuration
    ├── styles.css              # Responsive interface and touch controls
    ├── scenes/
    │   ├── BootScene.js        # Procedural player texture setup
    │   └── GameScene.js        # World, movement, collision and level flow
    ├── entities/
    │   ├── Player.js
    │   ├── Enemy.js
    │   └── Collectible.js
    ├── systems/
    │   ├── scoring.js
    │   └── storage.js
    └── assets/                 # Reserved for optional original assets
```

## 10. Experiment procedure
1. Choose **Experiment Mode** from the main menu.
2. Enter an anonymous participant ID (do not enter personal identifiers).
3. Play the four chapters. Every fresh experiment starts from the same initial values.
4. After each chapter, continue through the Happiness Mirror. At the final dashboard, open Experiment Data.
5. Export the locally saved sessions as CSV. Data is stored only in this browser's localStorage; it is not uploaded anywhere.

## 11. Scoring formula
The overall score is clamped to 0–100:

`0.35 × Sukh + 0.20 × Suvidha + 0.15 × Health + 0.15 × Academic Performance + 0.10 × Relationships − 0.05 × Stress`

Balance score considers the Sukh–Suvidha difference and low health/high stress penalties. Stability score uses the average absolute change in Sukh during a chapter. These are game-design indices, not validated psychological scales.

## 12. Assumptions and limitations
- This is a self-contained educational game. No account, network service, database or analytics endpoint is used.
- The visual environment is an original stylized campus abstraction; chapter names and collectible sets communicate the different college-life contexts rather than depicting a literal campus floor plan.
- Experiment records are local to one browser/device. For a multi-participant research study, export each participant's CSV and combine them manually; localStorage does not synchronize between devices.
- Audio effects are generated with Web Audio after interaction. Background music is intentionally omitted so the game remains lightweight and permission-safe.
- The score and Happiness Mirror are illustrative learning aids, not clinical, academic or financial advice.


## Phaser startup fix
The Game scene UI notifications and mobile controls communicate through the Phaser
Game event emitter. This avoids querying `game.scene.getScene('Game')` before the
scene has been created, which can return `null` during startup.
