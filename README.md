# Portfolio Journey

A scroll-driven developer portfolio told through three objects: a **book** that opens, a **smartphone** it becomes, and a **laptop** the phone turns into. Optional interaction experiments sit outside the core and can be switched on, off, swapped or deleted without touching it.

All copy and imagery is **placeholder** (`[bracketed]`). Nothing describes real projects, roles, achievements or articles.

```bash
npm install
npm run dev          # portfolio  → http://localhost:5173/
                     # lab        → http://localhost:5173/lab.html
npm run build        # visitor build (portfolio only)
npm run build:lab    # also ships lab.html + sandbox.html
```

---

## 1. The core journey

| Scene | What happens | File |
|---|---|---|
| 1 · Book | Autoplay: closed book → cover opens → 4 pages turn → stops on the central spread → camera zooms in → intro appears on the pages. Scrolling pulls the camera back, closes the book and reveals the header. **Skip intro** button + `Esc`. | `src/core/journey/Journey.tsx`, `Book.tsx` |
| 2 · Mobile | The closed cover *becomes* the phone (same element, same size at hand-off), then docks to the left. Three interface states slide in the screen while copy changes beside it. | same |
| 3 · Transform | Phone travels to centre → rotates 90° → widens into a laptop screen → keyboard deck grows → web UI fades in. One continuous element throughout. | same |
| 4 · Web | Laptop docks right; three browser states cross-fade as copy advances on the left. Then the camera flies *into* the screen, which reads “Projects”. | same |
| 5 · Projects | Full-bleed featured project (clip-path + scale on scroll), then a pinned horizontal gallery with mixed card sizes and a counter. Native scroll-snap on narrow screens. | `src/core/sections/Projects.tsx` |
| 6 · Achievements | Stat strip, then an alternating timeline whose rail fills as you scroll; milestones reveal on entry. | `Achievements.tsx` |
| 7 · Articles | Editorial layout: a lead story plus an indexed list; hovering a row shows a cursor-following preview. | `Articles.tsx` |
| 8 · About + Contact | The book returns, opens onto the About spread, closes and turns over to its back cover (sign-off), which hands off to the Contact epilogue. “Back to page one” returns to the start. | `Finale.tsx` |

The whole journey runs off one number, `p` (viewport-heights scrolled). The timeline is documented at the top of `Journey.tsx`; every visual property is a pure function of `p` and the intro clock, written straight to styles (no React re-render per frame).

**Responsive:** below 820px the device sits in the upper half with copy underneath; book pages size text to the page via container queries.
**Reduced motion:** `prefers-reduced-motion` swaps the pinned journey for `JourneyStatic.tsx` (same objects and copy, no scroll-linked transforms) and disables experiment motion.

### Replacing content
Edit **`src/content/placeholder.ts`** only. Every `image` field takes a URL (e.g. put files in `/public/screens/` and use `'/screens/app-1.png'`); until set, a labelled wireframe renders instead. Visual tokens (neutral placeholders, light + dark) are in `src/styles/tokens.css`.

---

## 2. Experiments — isolated by design

```
src/
  core/                ← the portfolio. Never imports from experiments/
  shared/              ← the contract both sides may use
    chapters.ts          chapter ids + anchors
    journeyBus.ts        read-only "where is the visitor" broadcast
    slots.ts             names of integration points
  experiments/
    <id>/manifest.ts     ← discovered automatically
    experiments.config.ts  what visitors get (all OFF by default)
    host.tsx / registry.ts / resolve.ts
    sandbox/             isolated preview page
  lab/                   experiment control room
  main.tsx               composition root — the ONLY file that wires experiments in
```

### How experiments attach (without coupling)
1. **Slots.** The core renders empty `<Slot name>` points: `global` (overlays/effects), `after-journey`, `after-projects`, `before-finale`. Each experiment variant declares which slot it mounts in.
2. **`data-fx-*` hooks.** The core marks elements semantically; experiments decorate them and undo everything on unmount:
   `data-fx-heading` · `data-fx-reveal` · `data-fx-magnetic` · `data-fx-card` · `data-fx-float` · `data-fx-link` · `data-fx-nav` / `data-fx-nav-group`.
   With no experiments enabled these attributes do nothing.
3. **Journey bus.** `useJourney()` exposes chapter, progress and header state. Experiments read it; only the core publishes.

Each experiment is lazy-loaded (disabled ones cost nothing) and wrapped in an error boundary (a crash removes the experiment, not the page).

### The experiments

| Group | id | Variants |
|---|---|---|
| A Terminal | `terminal` | `dock` · `dropdown` (toggle with <kbd>`</kbd>) · `section` — commands: `help ls cd pwd whoami projects articles contact theme echo date history clear sudo exit`, Tab-completion, ↑/↓ history |
| B Tech universe | `tech-universe` | `orbit` · `graph` (draggable physics) · `clusters` — data in `tech-universe/data.ts` (placeholders) |
| C Playground | `playground` | `workbench` (props knobs + generated code) · `css-lab` (live scoped CSS) · `drawer` |
| D Microinteractions | `cursor` | `dot-ring` · `blend` · `spotlight` · `trail` |
| | `magnetic` | `subtle` · `strong` |
| | `card-hover` | `spotlight` · `tilt` · `lift` |
| | `type-interactive` | `letter-lift` · `scramble` · `proximity` |
| | `scroll-text` | `word-rise` · `blur-in` · `scrub` |
| | `subtle-motion` | `parallax` · `breathe` · `pointer` |
| | `page-transition` | `wipe` · `fade` · `chapter-card` |
| | `nav-feedback` | `pill` · `underline` · `bracket` |
| E Progress | `progress` | `rail` · `ring` · `objects` · `topbar` |

### The lab (`/lab.html`)
- Toggle any experiment and pick its variant; choices persist in your browser.
- **Combined preview** — the real portfolio in a frame with your combination applied (`/?fx=id:variant,…`). Desktop / tablet / mobile widths.
- **Solo** — one experiment alone on a neutral sandbox page that carries every hook and chapter anchor (`/sandbox.html?fx=id:variant`), with a live bus readout.
- **Export config** — copies an `experimentsConfig` block; paste it into `src/experiments/experiments.config.ts` to ship that combination.

Set `allowUrlPreview = false` in `experiments.config.ts` to stop `?fx=` from working on the production site.

### Add / change / remove
- **Add:** create `src/experiments/<id>/manifest.ts` exporting `defineExperiment({...})`. It appears in the lab automatically.
- **New variant:** add an entry to `variants` and branch on `variant` in the component.
- **Remove one:** delete its folder. Nothing else references it (a stale key in the config is ignored).
- **Remove the whole system:** delete the two marked lines in `src/main.tsx` and the `value` prop on `<SlotProvider>`, then the `experiments/` and `lab/` folders.
