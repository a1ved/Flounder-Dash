# Flounder Dash

An underwater endless runner starring an original little flounder. Swim between three lanes, collect pearls, and survive an increasingly fast reef.

## Play

Extract this folder and open `index.html` in a modern browser. No installation, build step, API keys, or internet connection is required.

- Left / Right or A / D: change lanes
- Up / W / Space: jump over driftwood
- Down / S: dive beneath jellyfish
- Coral: move to a different lane
- P / Escape: pause or resume
- Enter: start or restart
- Mobile: swipe on the game or use the on-screen buttons

Bubble shields last 10 seconds and absorb one hit. Distance is your score; pearls are collected separately. Best distance is saved in your browser when storage is available. Sound is optional and starts muted. Switching browser tabs automatically pauses the run.

## Repository

Source: https://github.com/a1ved/Flounder-Dash

Download or clone the repository, then open `index.html` to play. Keep `index.html`, `style.css`, and `game.js` together. This is a static game and can be hosted by any static web server. Uploading the source does not automatically enable web hosting.

## Files

- `index.html`: page structure, game HUD, menus, controls
- `style.css`: responsive layout and visual design
- `game.js`: game loop, procedural Canvas art, obstacles, collision detection, audio, and persistence

## Implementation

Plain HTML, CSS, and JavaScript with the Canvas 2D API. Pseudo-3D perspective projects three lanes into the distance. Every obstacle row leaves two lanes open. Gameplay uses time-based movement and crossing detection for collisions. Jump/dive moves have a brief duration; time them as an obstacle reaches your fish.

All visuals and sounds are generated in code. No Subway Surfers assets or third-party character assets are included. This is an original small browser game inspired by the three-lane endless-runner genre, not a full 3D commercial game.

## Validation

JavaScript syntax checked with Node. Start/pause/resume checked in a desktop browser. Deterministic logic checks passed for lane boundaries, damaging collisions, jumping logs, diving under jellyfish, shields, pearl collection, pause/resume, and restart reset. Mobile controls are implemented but have not been tested on a physical phone.
