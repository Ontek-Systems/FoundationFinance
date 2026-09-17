/**
 * Shared entrance-animation timing for all page sections.
 *
 * Every "load-in" reveal (text, content, images fading/sliding into view)
 * should route its Framer Motion transition through the helpers here so the
 * whole site can be re-timed from a single place.
 *
 * To make every entrance slower/faster, change REVEAL_DURATION and
 * REVEAL_DELAY_BASE below — nothing else.
 *
 * NOTE: This intentionally does NOT cover:
 *   - Ambient background loops (orbs, ticker, pulsing glows — `repeat: Infinity`)
 *   - Interaction animations (accordion open/close, hover, mobile menu)
 * Those are not page-load reveals and keep their own local timing.
 */

/** Standard easing curve used across the site. */
export const EASE_SMOOTH = [0.16, 1, 0.3, 1]

/** How long each entrance reveal takes, in seconds. */
export const REVEAL_DURATION = 1.6

/** Delay before any entrance reveal begins, in seconds. */
export const REVEAL_DELAY_BASE = 0.45

/** Extra delay per staggered sibling (cards, list items), in seconds. */
export const REVEAL_STAGGER = 0.18

/** sessionStorage key marking the first-visit intro as already shown. */
export const INTRO_STORAGE_KEY = 'ff-intro-seen'

/** When the intro curtain has lifted enough to reveal the site, in ms from load. */
export const INTRO_REVEAL_AT_MS = 3800

/**
 * Seconds until the first-visit intro screen lifts (0 once it has gone).
 * Keeps above-the-fold reveals from playing unseen behind the intro.
 */
function introDelay() {
  if (typeof window === 'undefined' || !window.__ffIntroEndsAt) return 0
  return Math.max(0, (window.__ffIntroEndsAt - performance.now()) / 1000)
}

/**
 * Build a Framer Motion `transition` object for an entrance reveal.
 * @param {number} index - Position in a staggered group (0 for single elements).
 * @param {number} extraDelay - Additional delay on top of the base, in seconds.
 * @returns {{ duration: number, delay: number, ease: number[] }}
 */
export function revealTransition(index = 0, extraDelay = 0) {
  return {
    duration: REVEAL_DURATION,
    delay: introDelay() + REVEAL_DELAY_BASE + extraDelay + index * REVEAL_STAGGER,
    ease: EASE_SMOOTH,
  }
}

/**
 * Standard fade-up variant object for `motion` components that use
 * `variants` + a `custom` stagger index.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 56, filter: 'blur(8px)' },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: revealTransition(index),
  }),
}
