# Animation Standards

All page-load reveal animations (text, content, images fading/sliding into
view) are centralized in [`lib/motion.js`](lib/motion.js). This is the single
source of truth — do not hardcode entrance timing inside section components.

## Change the whole site's load-in speed

Edit two values in `lib/motion.js`:

| Constant             | Meaning                                  | Current |
|----------------------|------------------------------------------|---------|
| `REVEAL_DURATION`    | How long each reveal takes (seconds)     | `1.6`   |
| `REVEAL_DELAY_BASE`  | Delay before any reveal starts (seconds) | `0.45`  |
| `REVEAL_STAGGER`     | Extra delay per staggered sibling        | `0.18`  |
| `EASE_SMOOTH`        | Shared easing curve                      | `[0.16, 1, 0.3, 1]` |

(Both duration and base delay were raised by `0.4s` from the original design
to slow the load-in.)

## How sections use it

- **Variant-based** (Hero, StatsBar): `import { fadeUp }` and pass it as
  `variants={fadeUp}` with a `custom={i}` stagger index.
- **Inline transition**: `import { revealTransition }` and use
  `transition={revealTransition(index, extraDelay)}`.
  - `index` — position in a staggered group (`0` for single elements).
  - `extraDelay` — one-off extra delay for that element, in seconds.

## Intentionally NOT covered

These keep their own local timing and must not be routed through the module:

- **Ambient background loops** — orbs, sector ticker, pulsing glows
  (`repeat: Infinity`).
- **Interaction animations** — FAQ accordion open/close, hover states,
  mobile menu, form success state.
