# Extended Voice Presets & Enhanced 3D Game Difficulty

Upgrade the Web Speech API Text-to-Speech system with dedicated Halloween character voice presets ('Ancient Crypt', 'Shrieking Banshee', 'Gravelly Grave-Digger') and significantly elevate the challenge of the 3D Three.js Pumpkin Crypt game based on user request.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the addition of specific horror voice presets and explicitly requested a **more difficult 3D game experience**.

- **Confirmed Decision 1 (TTS Voice Presets)**: Implement 'Ancient Crypt', 'Shrieking Banshee', and 'Gravelly Grave-Digger' with customized pitch, speech rate, natural voice heuristics, sample preview, and persona cards.
- **Confirmed Decision 2 (Game Difficulty)**: Elevate 3D game difficulty with selectable tiers (Mortal, Nightmare, Hellfire), smarter phantom patrol & chase mechanics, fog sanity hazards, and a responsive spirit dash mechanic.

---

## 1. Overview & Core Concept

### What It Delivers
1. **Extended Ghost Host Presets**:
   - **Ancient Crypt**: Sub-bass, tomb-like resonant cadence (Pitch `0.25`, Rate `0.68x`, deep reverberating presence).
   - **Shrieking Banshee**: Piercing, frantic supernatural tempo (Pitch `1.65`, Rate `1.15x`, urgent vocal trajectory).
   - **Gravelly Grave-Digger**: Gritty, measured, bone-weary baritone (Pitch `0.52`, Rate `0.82x`, deliberate cadence).
   - Live sample preview button for each preset so users can audition voices before playing full stories.
2. **Elevated 3D Game Challenge ("Pumpkin Crypt")**:
   - **Difficulty Selector**: *Mortal* (classic), *Nightmare* (faster enemies, 7 altars), *Hellfire* (frenzy phantoms, expanding fog traps, tight hit window).
   - **Advanced Phantom AI**: Swarming behavior, telegraph speed increase, and pincer maneuvers.
   - **Spirit Dash / Dodge**: Space/Shift burst maneuver with cooldown to escape aggressive phantoms.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[Story Reader] ──> [Select 'Ancient Crypt' / 'Shrieking Banshee' / 'Gravelly Grave-Digger']
                 ──> [Audition Voice Sample] ──> [Read Aloud with Persona Pitch & Rate]

[3D Game Title] ──> [Select Difficulty: Mortal / Nightmare / Hellfire]
                 ──> [Enter Crypt: Fast Phantoms, Fog Zones, Dash Evasion]
```

### Visual Identity & Component Styling
- **TTS Preset Cards**: Sleek dark obsidian cards with colored persona tags (e.g., Crypt Green, Banshee Cyan, Grave-Digger Amber), pitch/rate meter readouts, and instant "Sample Voice" buttons.
- **3D Game HUD**: Integrated difficulty badge, dash stamina meter, and intensified enemy warning telegraphs.

---

## 3. Key Product Decisions & Trade-Offs

- **Web Speech API Parameter Bounds**: Different browser engines clamp pitch between 0.1 and 2.0. We calibrate 'Ancient Crypt' at 0.25 and 'Shrieking Banshee' at 1.65 to ensure reliable synthesis across Chrome, Edge, Safari, and Firefox.
- **Difficulty Tiers over Forced Hard Mode**: Rather than making the base game unplayable for beginners, adding difficulty presets allows players to choose between standard horror exploration and an intense reflex survival challenge.

---

## 4. Technical Architecture & System Flow

```
┌────────────────────────────────────────────────────────┐
│                   GHOST SPEECH ENGINE                  │
│  src/utils/ghostSpeech.ts                              │
│  ├── Ancient Crypt (Pitch: 0.25, Rate: 0.68)           │
│  ├── Shrieking Banshee (Pitch: 1.65, Rate: 1.15)       │
│  └── Gravelly Grave-Digger (Pitch: 0.52, Rate: 0.82)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 GHOST HOST NARRATOR                    │
│  src/components/GhostHostNarrator.tsx                  │
│  ├── Live Preset Switcher & Audible Preview Sample     │
│  └── Synchronized Pitch & Speed Sliders                │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                  THREE.JS 3D GAME                      │
│  src/components/Halloween3DGame.tsx                    │
│  ├── Difficulty States (Mortal / Nightmare / Hellfire)  │
│  ├── Enemy Speed & Swarm Vector Calculations           │
│  ├── Fog Hazard Proximity & Sanity Depletion           │
│  └── Shift / Double-Tap Spirit Dash Mechanic           │
└────────────────────────────────────────────────────────┘
```

### Verification Plan
1. **TTS Presets**: Verify that selecting each new preset updates pitch/rate sliders and plays speech in the designated tone.
2. **Game Difficulty**: Test enemy pursuit speed, altar completion count, and dash mechanics in Nightmare and Hellfire modes.
3. **Build & Lint**: Run `lint_applet` and `compile_applet` to confirm zero regression.
