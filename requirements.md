# Electrical Practice Games — Requirements

> **Source of Truth:** All project decisions, architecture, and technical details are documented here. Update this document when decisions change.

## Overview

A web app providing interactive electrical wiring practice for UK electrical students. The app contains one-way and two-way Ceiling Rose Practice levels.

- **Target users:** Beginner UK electrical students
- **Deployment:** Coolify (static SPA via nginx)
- **No backend required for V1**

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18.x |
| Build tool | Vite | 6.x |
| Language | TypeScript | strict mode |
| State management | Zustand | 5.x |
| Drag and drop | @dnd-kit/react | 0.4+ |
| Styling | TailwindCSS | 3.x |
| Routing | React Router | 6.x |
| Rendering | SVG | — |

---

## Architecture

### Design Principles

1. **Game engine is shared** — the engine handles connections, validation, and rendering. Game-specific content lives in JSON config files.
2. **JSON-driven game data** — each game level is a configuration file, not new code.
3. **No overengineering** — V1 implements only what is needed. Scalability is achieved through the JSON architecture, not abstraction.
4. **MVP-first** — every decision defers complexity until it is actually needed.

### Folder Structure

```
src/
├── engine/                    # Shared game engine
│   ├── types/
│   │   └── index.ts           # All shared TypeScript interfaces
│   ├── store/
│   │   └── useGameStore.ts     # Zustand store factory
│   ├── validation/
│   │   ├── wiringRules.ts      # Per-wire validation
│   │   └── circuitValidation.ts  # Full circuit validation
│   └── index.ts               # Barrel export
├── components/                # Shared UI components
│   ├── Button.tsx
│   ├── GameShell.tsx
│   └── GameSelect.tsx
└── games/
    └── ceiling-rose/          # Game module
        ├── index.tsx           # Route entry
        ├── CeilingRoseGame.tsx # Main game component
        ├── data/
        │   └── ceiling-rose-v1.json  # Game config
        ├── components/         # Game-specific UI
        │   ├── Canvas.tsx
        │   ├── Terminal.tsx
        │   ├── WireLayer.tsx
        │   ├── WirePalette.tsx
        │   ├── InstructionPanel.tsx
        │   ├── ResultModal.tsx
        │   └── visual/
        │       ├── CeilingRoseVisual.tsx
        │       ├── SwitchVisual.tsx
        │       ├── Switch2WayVisual.tsx
        │       ├── LampVisual.tsx
        │       └── SupplyVisual.tsx
        └── hooks/
            └── useCeilingRoseStore.ts
```

### Adding a New Game

1. Create `src/games/<new-game>/data/<new-game-v1.json>` with the circuit configuration
2. Create `src/games/<new-game>/<NewGame>.tsx` using the same shared components
3. Add a route in `App.tsx`
4. Add entry to `GameSelect.tsx` game catalog

**No changes to the engine are required for new games.** Ceiling rose variants share `CeilingRoseGame`, which receives a typed configuration prop. Add the JSON file, route, and catalog entry for each new variant.

---

## Data Model

### Core Interfaces

All shared via `engine/types/index.ts`:

- **Terminal** — a single connection point on a component
- **Component** — a physical device (supply, switch, rose, lamp, etc.)
- **WireCore** — a single conductor in the palette (the draggable item)
- **CableGroup** — a cable type grouping cores (e.g. Twin & Earth, 3-Core & Earth)
- **Connection** — a placed wire connecting two terminals
- **CorrectConnection** — the expected answer for a single wire
- **GameConfig** — the complete configuration for a game level (JSON file)

### Port Types (Electrical Roles)

```ts
type PortType =
  | 'live'           // permanent live (brown)
  | 'neutral'        // neutral (blue)
  | 'switched_live'  // switched live, e.g. from switch L1
  | 'earth'          // earth terminal
  | 'cpc'            // circuit protective conductor (green/yellow)
  | 'com'            // switch common terminal
  | 'L1'             // switch L1 terminal (strapper)
  | 'L2'             // switch L2 terminal (strapper)
  | 'lamp_l'         // lamp live terminal
  | 'lamp_n'         // lamp neutral terminal
  | 'spare';         // unused/spare terminal
```

### Conductor Colours (UK)

```ts
type ConductorColor =
  | 'brown' | 'blue' | 'green/yellow' | 'grey' | 'black' | 'red' | 'white';
```

---

## Game Configuration Schema

Each game level is a JSON file matching `GameConfig`:

```json
{
  "gameId": "string",
  "title": "string",
  "description": "string",
  "difficulty": "beginner | intermediate | advanced",
  "components": [
    {
      "id": "string",
      "componentType": "supply | ceiling_rose | switch_1way | switch_2way | lamp | junction_box | socket",
      "label": "string",
      "positionX": 0,
      "positionY": 0,
      "terminals": [
        {
          "id": "string",
          "label": "string",
          "labelColor": "ConductorColor",
          "portType": "PortType",
          "localX": 0,
          "localY": 0
        }
      ]
    }
  ],
  "cableGroups": [
    {
      "id": "string",
      "name": "string",
      "expandByDefault": true,
      "cores": [
        {
          "id": "string",
          "color": "ConductorColor",
          "label": "string",
          "defaultPortRole": "PortType",
          "compatiblePorts": ["PortType"]
        }
      ]
    }
  ],
  "correctConnections": [
    { "from": "terminalId", "to": "terminalId", "wireCoreId": "wireCoreId" }
  ],
  "optionalConnections": [
    { "from": "terminalId", "to": "terminalId", "wireCoreId": "wireCoreId" }
  ],
  "instructions": [
    {
      "step": 1,
      "text": "string",
      "highlightTerminals": ["terminalId"]
    }
  ],
  "feedback": {
    "correct": "string",
    "incomplete": "string",
    "incorrect": "string"
  }
}
```

---

## User Interaction Flow

### Wire Connection Flow (Two-Step)

1. User **selects a wire core** from the WirePalette (click or drag)
   - Selected wire is highlighted in the palette
   - Cursor changes to indicate "wire ready"

2. User **clicks a source terminal** on the canvas
   - Source terminal is held in local UI state; Canvas derives a pending preview from it and the selected wire core
   - A dashed wire follows the cursor
   - Source terminal highlights green

3. User **clicks a target terminal**
   - A completed connection is added to the store with `status: 'placed'`
   - Wire rendered as a solid bezier curve on the canvas

### Cancel Flow

| Platform | Action |
|---|---|
| Desktop | Press `ESC` key |
| Mobile | Tap anywhere on empty canvas (not a terminal) |

### Wire Removal

- **Click on a placed wire** to delete it
- The wire and both endpoints are removed from the connections array

### Test Circuit

- "Test Circuit" button runs full circuit validation
- Results shown in an alert with per-wire feedback and the missing terminal pairs

---

## Validation Engine

### Per-Wire Validation

Each connection is validated against `correctConnections`:

1. Find the matching `CorrectConnection` for this terminal pair (order-independent)
2. Compare `connection.wireCoreId` against `CorrectConnection.wireCoreId`
3. Return `{ isCorrect, correctWireCoreId, feedbackMessage }`

### Circuit Validation

Runs on "Test Circuit" button press:

1. Validate each placed connection individually
2. Identify missing required connections by terminal pair and wire core (order-independent), even when both terminals have other connections
3. Reject duplicate pairs; validate optional connections including their core, and exclude them from extra connections
4. Calculate score
5. Return `CircuitValidationResult` with status, score, and feedback

### Scoring

```
score = max(0, (correctCount × 10) - (incorrectCount × 5) + (status === "correct" ? 20 : 0))
```

---

## State Management (Zustand)

```ts
interface GameState {
  config: GameConfig | null;
  connections: Connection[];
  selectedWireCoreId: string | null;
  activeTerminalId: string | null;
  currentStep: number;
  score: number;
  attempts: number;
  gameStatus: 'idle' | 'building' | 'checking' | 'complete';
  lastValidationResult: CircuitValidationResult | null;
}
```

Store is created via `createGameStore()` factory — each game gets its own store instance.

---

## UX Design Decisions

### Wire Palette

- Wires are grouped by cable type (Twin & Earth, 3-Core & Earth)
- Groups are collapsible (expanded by default)
- Wire cores are individually selectable/draggable
- Selected wire highlighted with blue border and ring

### Wire Availability

- **Infinite** — wires are always available in the palette
- User can reuse the same wire colour across terminal pairs; duplicate terminal pairs are rejected
- Palette wires are NOT consumed on placement

### Canvas

- SVG-based rendering
- Grid background for visual reference
- Components positioned via `positionX`, `positionY` from config
- Terminals positioned via `localX`, `localY` within component

### Instructions Panel

- Step-by-step guidance
- Current step highlighted
- Previous/Next navigation
- Step indicator dots

### Results

- Test displays an alert with success, incomplete, or incorrect feedback
- Incorrect wires and missing required terminal pairs are listed
- Score and attempts appear in the header
- Editing wiring clears the previous result, score, and illuminated lamp
- `ResultModal` is currently unused

---

## V2 Extension Points (2-Way Switching)

The architecture already supports V2 additions via JSON config:

### 2-Way Switch Component

```json
{
  "id": "switch_2way_1",
  "componentType": "switch_2way",
  "label": "2-Way Switch",
  "terminals": [
    { "id": "sw1_com", "portType": "com" },
    { "id": "sw1_L1", "portType": "L1" },
    { "id": "sw1_L2", "portType": "L2" }
  ]
}
```

### 3-Core & Earth Cable Group

```json
{
  "id": "three_core_earth",
  "name": "3-Core & Earth 1.5mm²",
  "cores": [
    { "id": "brown_live", "color": "brown", "label": "Brown (Live)" },
    { "id": "grey_strapper", "color": "grey", "label": "Grey (Strapper)" },
    { "id": "white_strapper", "color": "white", "label": "White (Strapper)" }
  ]
}
```

### Adding V2 Game

1. Create `ceiling-rose-v2.json` with 2-way switches and 3-core cable
2. Add route in `App.tsx`
3. Add entry in `GameSelect.tsx`
4. **No engine changes required**

---

## Deployment (Coolify)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Runtime:** Static SPA served via nginx
- **No backend, no database**

---

## Project Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm test` | Run engine and store regression tests |

---

## Notes

- React version is 18.x (not 19) for compatibility
- Vite 6.x is the latest stable
- @dnd-kit uses the new v0.4+ hooks API (`useDraggable`, `useDroppable`, `DragDropProvider`, `DragOverlay`)
- Zustand v5 uses `create` from 'zustand' with devtools middleware
- Path aliases: `@engine/*`, `@components/*`, `@games/*` map to `src/engine/*`, etc.

## Configuration ownership and verification

- `src/games/ceiling-rose/data/` is the single source for both level configurations. Routes import these JSON files into the bundle; public copies and runtime configuration fetches are removed.
- Both routes render the shared `CeilingRoseGame` with a level key, isolating state when changing levels.
- Canvas uses pointer coordinates transformed through the SVG screen matrix, draws pending previews, and allows background click/tap or Escape to cancel.
- Regression tests exercise every single-wire omission in both levels, reversed endpoints, duplicate scoring, wrong cores, optional connections, and state invalidation after edits.

## Symbol Match

- Route: `/games/symbols`, linked from the game selection screen.
- 18 symbols redrawn as SVG from the two supplied Unit 203 photos in `src/images`.
- One symbol per question with four shuffled, unique names; every included symbol appears once per full round.
- Sticky score and progress header; no timer. A correct answer earns 10 points, or 5 after a hint. Incorrect answers and reveals earn 0. Each question can be scored only once.
- Help opens explicit hint and reveal controls and explains scoring before use.
- Answer feedback includes the correct name and an explanation. Advancement is manual, with keyboard focus moved to Next and then to the next heading.
- Results offer another full round or a fresh round containing only missed/revealed symbols, plus illustrated review cards.
- Responsive single-column phone layout, native keyboard-operable buttons, live feedback, visible focus indicators, and reduced-motion support.
- No progress persistence: leaving or reloading starts a new round.
- Four unlabelled photo symbols (square with cross, presumed dimmer, presumed bell, presumed loudspeaker) remain excluded pending confirmation of the worksheet answer key. Do not turn tentative identifications into scored questions.
- Content reference for installation-plan conventions: https://support.maxem.io/hubfs/IEC%2060617%20SYMBOLS.pdf (installation symbols on pages 21–23). The main intake point identification also appears in https://booksite.elsevier.com/samplechapters/9780750687515/9780750687515.pdf . Explicit labels in the user's worksheets take precedence for the worksheet-specific names.
- Tests cover round integrity, unique choices, correct-answer inclusion, scoring, review subsets and non-mutating shuffling. Browser checks cover 10/5/0 scoring, disabled completed answers, full-round completion, review restart, menu navigation, and a 390px mobile layout.
