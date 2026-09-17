'use client'
// Client component: scroll-linked curtain reveal, randomly swapping photo mosaic and header measurement all need the browser.

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'

import { fadeUp } from '@/lib/motion'

import { HeroMap } from './HeroMap'

/* The 7 core services. The mosaic shows a few at once and swaps them at random. */
const HERO_ROUTES = [
  { src: '/images/ffimages/property_finance2.jpg', label: 'Property Finance', tagline: 'For investors and landlords' },
  { src: '/images/ffimages/refinance_and_restructure.jpg', label: 'Commercial Finance', tagline: 'For trading businesses and investment' },
  { src: '/images/ffimages/refinance_and_restructure2.jpg', label: 'Refinance & Restructure', position: 'object-top', tagline: 'Unlock equity, restructure facilities' },
  { src: '/images/ffimages/business_and_cashflow_finance.jpg', label: 'Business & Cashflow', tagline: 'Improve cashflow, fuel growth' },
  { src: '/images/ffimages/asset_finance.jpg', label: 'Asset Finance', tagline: 'Plant, machinery and equipment' },
  { src: '/images/ffimages/commercial_vehicle_finance2.jpg', label: 'Vehicle Finance', tagline: 'Vans, trucks, fleets and EVs' },
  { src: '/images/ffimages/development.jpg', label: 'Development Finance', tagline: 'New build, conversions and refurbishments' },
]

/* Tile positions in the mosaic: one large left, one top right, two bottom right.
   Initial routes are fixed (not random) so server and client render the same markup. */
const INITIAL_TILE_ROUTES = [0, 1, 2, 3]

const TILE_SWAP_INTERVAL_MS = 2000

/* How many of the most recently swapped tiles are held back from the next swap */
const RECENT_TILE_COOLDOWN = 2
const TILE_FADE_DURATION_S = 1.35

/* Scroll distance (px) after which the ledge stops nudging */
const NUDGE_SCROLL_THRESHOLD = 8

/* Portion of the curtain's rise over which the intro fades back */
const INTRO_FADE_RANGE = [0.1, 0.8]

export function Hero() {
  const sectionRef = useRef(null)
  const curtainRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [hasScrolled, setHasScrolled] = useState(false)

  /* Scroll distance until the curtain reaches the navbar, measured below */
  const revealDistanceRef = useRef(1)

  const { scrollY } = useScroll()
  const scrollYProgress = useTransform(scrollY, (latest) =>
    Math.min(Math.max(latest / revealDistanceRef.current, 0), 1)
  )

  const introOpacity = useTransform(scrollYProgress, INTRO_FADE_RANGE, [1, 0])
  const introScale = useTransform(scrollYProgress, INTRO_FADE_RANGE, [1, 0.94])
  const introY = useTransform(scrollYProgress, INTRO_FADE_RANGE, [0, -48])
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHasScrolled(latest > NUDGE_SCROLL_THRESHOLD)
  })

  /* The intro fills one screen minus the header and the ledge, so expose
     the real header heights to CSS and re-measure the reveal distance. */
  useEffect(() => {
    const section = sectionRef.current
    const navbar = document.getElementById('navbar')
    const contactBar = document.querySelector('.cbar')
    if (!section || !navbar) return

    const updateOffsets = () => {
      section.style.setProperty('--hero-nav-h', `${navbar.offsetHeight}px`)
      section.style.setProperty('--hero-bar-h', `${contactBar ? contactBar.offsetHeight : 0}px`)
      const curtain = curtainRef.current
      if (curtain) {
        const curtainTop = section.offsetTop + curtain.offsetTop
        revealDistanceRef.current = Math.max(curtainTop - navbar.offsetHeight, 1)
      }
    }

    updateOffsets()
    const observer = new ResizeObserver(updateOffsets)
    observer.observe(section)
    observer.observe(navbar)
    if (contactBar) observer.observe(contactBar)
    return () => observer.disconnect()
  }, [])

  const handleRevealCurtain = () => {
    const curtain = curtainRef.current
    const navbar = document.getElementById('navbar')
    if (!curtain) return
    const navbarHeight = navbar ? navbar.offsetHeight : 0
    const top = curtain.getBoundingClientRect().top + window.scrollY - navbarHeight
    window.scrollTo({ top, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }


  const introMotionStyle = shouldReduceMotion
    ? undefined
    : { opacity: introOpacity, scale: introScale, y: introY }
  const mapMotionStyle = shouldReduceMotion ? undefined : { scale: mapScale }
  const curtainClassName = hasScrolled ? 'hero-curtain' : 'hero-curtain hero-curtain--pulse'

  return (
    <section id="hero" ref={sectionRef} className="hero-section" aria-labelledby="hero-title">
      <div className="hero-intro">
        <motion.div className="section-container hero-intro__inner" style={introMotionStyle}>
          <HeroIntroContent />
          <HeroMap motionStyle={mapMotionStyle} />
        </motion.div>
      </div>

      <div ref={curtainRef} className={curtainClassName}>
        <button
          type="button"
          className="hero-ledge"
          onClick={handleRevealCurtain}
          aria-label="Scroll to our finance solutions"
        >
          <span className="hero-ledge__grip" aria-hidden="true" />
          <span className="eyebrow hero-ledge__text">Seven Funding Routes</span>
        </button>

        <div className="section-container hero-mosaic-container">
          <HeroMosaic shouldReduceMotion={shouldReduceMotion} />
          <HeroRoutesGrid />
        </div>
      </div>

      <style>{`
        .hero-section {
          --hero-nav-h: 92px;
          --hero-bar-h: 40px;
          /* One spacing value for curtain top → grip → text → images */
          --hero-ledge-space: 13px;
          --hero-ledge-grip-h: 3px;
          --hero-ledge-text-h: 11px;
          --hero-ledge-h: calc(var(--hero-ledge-space) * 3 + var(--hero-ledge-grip-h) + var(--hero-ledge-text-h));
          position: relative;
          background: var(--off-white);
          /* clip (not hidden) so the sticky intro keeps working */
          overflow: clip;
        }

        /* Hero only: 20px more side gutter than the site-wide container
           (25px / 24px / 18px at desktop / tablet / phone) */
        .hero-section .section-container {
          padding-inline: 45px;
        }

        @media (max-width: 768px) {
          .hero-section .section-container {
            padding-inline: 44px;
          }
        }

        @media (max-width: 480px) {
          .hero-section .section-container {
            padding-inline: 38px;
          }
        }

        /* ── Pinned intro ───────────────────────────────────────────── */
        /* min-height (not height) so content can never be clipped under
           the navbar on short screens — it just grows instead. */
        .hero-intro {
          position: sticky;
          top: var(--hero-nav-h);
          z-index: 1;
          display: flex;
          /* Capped so tall monitors don't get a sea of empty space */
          min-height: min(calc(100svh - var(--hero-nav-h) - var(--hero-bar-h) - var(--hero-ledge-h)), 860px);
          padding-block: clamp(28px, 5vh, 56px);
          background:
            radial-gradient(circle at 76% 52%, rgba(218, 162, 64, 0.1) 0%, rgba(218, 162, 64, 0) 34%),
            linear-gradient(180deg, #ffffff 0%, #f7f8fb 100%);
        }

        /* Faint architectural grid, faded towards the edges */
        .hero-intro::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(2, 20, 53, 0.052) 1px, transparent 1px),
            linear-gradient(90deg, rgba(2, 20, 53, 0.052) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse at 70% 50%, #000 0%, transparent 70%);
          mask-image: radial-gradient(ellipse at 70% 50%, #000 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-intro__inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          align-items: center;
          gap: clamp(24px, 4vw, 72px);
          width: 100%;
          transform-origin: left top;
        }

        .hero-intro__content {
          max-width: 600px;
        }

        .hero-intro__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: clamp(14px, 2.4vh, 22px);
        }

        /* Same .display face, sized to the viewport so it never crowds */
        .hero-intro__title {
          font-size: clamp(36px, min(4.4vw, 7.4vh), 70px);
          line-height: 1.04;
          color: var(--navy);
          margin-bottom: clamp(14px, 2.4vh, 22px);
        }

        .hero-intro__title-line {
          display: block;
        }

        .hero-intro__title-accent {
          color: var(--gold);
          font-style: italic;
        }

        .hero-intro__text {
          font-size: clamp(15px, min(1.25vw, 2.3vh), 17px);
          color: rgba(2, 20, 53, 0.65);
          max-width: 470px;
          margin-bottom: clamp(20px, 3.4vh, 32px);
        }

        .hero-intro__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: clamp(18px, 3vh, 28px);
        }

        .hero-intro__actions a {
          min-height: 48px;
        }

        .hero-intro__trust {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px 18px;
          padding-top: clamp(14px, 2.4vh, 20px);
          border-top: 1px solid rgba(2, 20, 53, 0.08);
          color: rgba(2, 20, 53, 0.55);
          list-style: none;
        }

        .hero-intro__trust li {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-intro__trust li::before {
          content: '';
          width: 5px;
          height: 5px;
          background: var(--gold);
          transform: rotate(45deg);
        }

        /* ── Rising curtain ─────────────────────────────────────────── */
        .hero-curtain {
          position: relative;
          z-index: 2;
          background: var(--off-white);
          border-top: 1px solid var(--gold-border);
          box-shadow: 0 -28px 60px -30px rgba(2, 20, 53, 0.22);
          padding-bottom: 24px;
        }

        .hero-ledge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: var(--hero-ledge-space);
          width: 100%;
          height: var(--hero-ledge-h);
          padding: var(--hero-ledge-space) 0;
          background: none;
          border: none;
          cursor: pointer;
        }

        .hero-ledge__grip {
          width: 44px;
          height: var(--hero-ledge-grip-h);
          flex-shrink: 0;
          background: var(--gold);
          transition: width var(--transition-base);
        }

        .hero-ledge__text {
          display: block;
          line-height: var(--hero-ledge-text-h);
          color: rgba(2, 20, 53, 0.55);
          transition: color var(--transition-fast);
        }

        /* Slow breathing pulse until the visitor starts scrolling */
        .hero-curtain--pulse {
          animation: heroCurtainFloat 3.2s ease-in-out infinite;
        }

        @keyframes heroCurtainFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        .hero-curtain--pulse .hero-ledge__grip {
          animation: heroGripPulse 3.2s ease-in-out infinite;
        }

        .hero-curtain--pulse .hero-ledge__text {
          animation: heroTextPulse 3.2s ease-in-out infinite;
        }

        @keyframes heroGripPulse {
          0%, 100% { width: 44px; opacity: 0.6; box-shadow: 0 0 0 rgba(218, 162, 64, 0); }
          50%      { width: 88px; opacity: 1;   box-shadow: 0 0 14px rgba(218, 162, 64, 0.55); }
        }

        @keyframes heroTextPulse {
          0%, 100% { color: rgba(2, 20, 53, 0.45); }
          50%      { color: rgba(2, 20, 53, 0.85); }
        }

        .hero-ledge:hover .hero-ledge__grip,
        .hero-ledge:focus-visible .hero-ledge__grip {
          width: 88px;
        }

        .hero-ledge:hover .hero-ledge__text,
        .hero-ledge:focus-visible .hero-ledge__text {
          color: var(--gold);
        }

        .hero-ledge:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: -4px;
        }

        /* ── Collage controls ───────────────────────────────────────── */
        .hero-controls {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          margin-top: clamp(14px, 2vw, 20px);
        }

        .hero-controls__toggle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 44px;
          padding: 0 4px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(2, 20, 53, 0.55);
          transition: color var(--transition-fast);
        }

        .hero-controls__toggle:hover {
          color: var(--gold);
        }

        .hero-controls__toggle:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }
        /* ── Mosaic gutter: 20px tighter than the hero container above ─ */
        .hero-section .hero-mosaic-container {
          padding-inline: 25px;
        }

        @media (max-width: 768px) {
          .hero-section .hero-mosaic-container {
            padding-inline: 24px;
          }
        }

        @media (max-width: 480px) {
          .hero-section .hero-mosaic-container {
            padding-inline: 18px;
          }
        }

        /* ── Collage stage ──────────────────────────────────────────── */
        .hero-collage-stage {
          position: relative;
          height: clamp(360px, 42vw, 560px);
          overflow: hidden;
        }

        .hero-collage {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: clamp(15px, 2vw, 25px);
        }

        .hero-photo {
          position: relative;
          overflow: hidden;
          background: transparent;
        }

        .hero-photo--large {
          height: 100%;
        }

        .hero-photo__layer {
          position: absolute;
          inset: 0;
        }

        .hero-photo-right {
          display: flex;
          flex-direction: column;
          gap: clamp(15px, 2vw, 25px);
          height: 100%;
        }

        .hero-photo--top {
          flex: 1 1 0;
          min-height: 0;
        }

        .hero-photo-bottom-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(15px, 2vw, 25px);
          flex: 1 1 0;
          min-height: 0;
        }

        /* ── Photo overlay ──────────────────────────────────────────── */
        .hero-photo-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(16px, 2.2vw, 26px);
          background: linear-gradient(180deg, rgba(2, 20, 53, 0.1) 0%, rgba(2, 20, 53, 0.2) 30%, rgba(2, 20, 53, 0.92) 100%);
        }

        /* Hairline inset frame, brightens on hover */
        .hero-photo-overlay::after {
          content: '';
          position: absolute;
          inset: clamp(8px, 1vw, 12px);
          border: 1px solid rgba(255, 255, 255, 0.43);
          pointer-events: none;
          transition: border-color var(--transition-fast);
        }

        .hero-photo:hover .hero-photo-overlay::after {
          border-color: rgba(218, 162, 64, 0.6);
        }

        .hero-photo-overlay__body {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(6px, 0.9vw, 10px);
        }

        .hero-photo-overlay__tagline {
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(12px, 1.1vw, 14px);
          line-height: 1.4;
          text-shadow: 0 1px 14px rgba(2, 20, 53, 0.85);
        }

        /* Small tiles: taglines crowd them on narrower desktops */
        @media (max-width: 1279px) {
          .hero-photo--bottom .hero-photo-overlay__tagline {
            display: none;
          }
        }

        .hero-photo-overlay__label {
          color: #ffffff;
          font-family: var(--next-font-playfair), Georgia, serif;
          font-weight: 400;
          font-size: clamp(20px, 2.6vw, 30px);
          line-height: 1.15;
          text-shadow: 0 2px 18px rgba(2, 20, 53, 0.75);
        }

        .hero-photo-overlay__cta {
          padding: 8px 18px;
          font-size: 10px;
        }


        /* ── Responsive ─────────────────────────────────────────────── */
        /* Tablet and phone: one centred column with the map as a backdrop.
           No pinning or scroll fade here — the page simply scrolls. */
        @media (max-width: 1023px) {
          .hero-intro {
            position: relative;
            top: auto;
            align-items: center;
          }

          /* !important beats the inline scroll-linked motion styles */
          .hero-intro__inner {
            grid-template-columns: minmax(0, 1fr);
            justify-items: center;
            text-align: center;
            opacity: 1 !important;
            transform: none !important;
          }

          .hero-intro__content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-intro__title {
            font-size: clamp(32px, 7vw, 56px);
          }

          .hero-intro__text {
            margin-inline: auto;
          }

          .hero-intro__actions {
            justify-content: center;
            width: 100%;
          }

          .hero-intro__trust {
            justify-content: center;
            width: 100%;
          }

          .hero-curtain--pulse {
            animation: none;
          }
        }

        @media (max-width: 480px) {
          .hero-intro__trust {
            flex-direction: column;
          }
        }

        @media (max-width: 700px) {
          .hero-intro__actions a {
            flex: 1 1 200px;
            justify-content: center;
          }

          /* Let the mosaic flow naturally instead of scrolling inside a
             fixed-height stage. */
          .hero-collage-stage {
            height: auto;
          }

          .hero-collage {
            position: relative;
            inset: auto;
            grid-template-columns: 1fr;
            grid-auto-rows: min-content;
          }

          .hero-photo--large {
            height: clamp(220px, 60vw, 300px);
          }

          .hero-photo-right {
            height: auto;
          }

          .hero-photo--top {
            height: clamp(160px, 44vw, 220px);
            flex: none;
          }

          .hero-photo-bottom-row {
            height: clamp(130px, 36vw, 180px);
            flex: none;
          }

          .hero-photo-overlay {
            padding: 14px 16px;
            gap: 8px;
          }
        }

        /* Small phones: the bottom row splits into two narrow tiles —
           drop the Explore button there and shrink labels so the tiles
           read as clean image chips rather than cramped cards. */
        @media (max-width: 480px) {
          .hero-photo--bottom .hero-photo-overlay__cta {
            display: none;
          }

          .hero-photo--bottom .hero-photo-overlay__label {
            font-size: 15px;
          }

          .hero-photo-overlay__label {
            font-size: 18px;
          }

          .hero-photo-overlay__cta {
            padding: 7px 14px;
            font-size: 9.5px;
          }
        }


        /* ── Phones: all seven routes as a static grid ────────────────
           One full-width lead tile, then three rows of two. The rotating
           mosaic and its pause control are hidden. */
        .hero-routes-grid {
          display: none;
        }

        @media (max-width: 600px) {
          .hero-mosaic {
            display: none;
          }

          .hero-routes-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            list-style: none;
          }

          .hero-routes-grid .hero-photo {
            height: clamp(150px, 42vw, 190px);
          }

          .hero-routes-grid .hero-photo:first-child {
            grid-column: 1 / -1;
            height: clamp(210px, 58vw, 260px);
          }

          .hero-routes-grid .hero-photo-overlay {
            padding: 14px 12px;
          }

          .hero-routes-grid .hero-photo-overlay__body {
            align-items: center;
            text-align: center;
          }

          .hero-routes-grid .hero-photo-overlay__label {
            font-size: 16px;
          }

          .hero-routes-grid .hero-photo:first-child .hero-photo-overlay__label {
            font-size: 22px;
          }

          .hero-routes-grid .hero-photo-overlay__body {
            gap: 10px;
          }

          /* No buttons on phones; taglines only on the lead tile */
          .hero-routes-grid .hero-photo:not(:first-child) .hero-photo-overlay__tagline {
            display: none;
          }

          .hero-routes-grid .hero-photo-overlay__cta {
            display: none;
          }

          /* Pull the first image up closer to the "Seven Funding Routes" label */
          .hero-ledge {
            justify-content: flex-end;
            padding-bottom: 14px;
          }

          /* Intro: breathing room above the ledge line, full-width CTA */
          .hero-intro {
            padding-block: 40px 56px;
          }

          .hero-intro__text {
            margin-bottom: 28px;
          }

          .hero-intro__actions {
            margin-bottom: 32px;
          }

          .hero-intro__actions a {
            flex: 1 1 100%;
            max-width: 320px;
            margin-inline: auto;
          }

          .hero-intro__trust {
            padding-top: 22px;
            gap: 12px;
          }

          .hero-section {
            --hero-ledge-h: 88px;
          }
        }

        /* Very short landscape screens: don't pin, just stack */
        @media (max-height: 520px) {
          .hero-intro {
            position: relative;
            top: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-intro {
            position: relative;
            top: auto;
          }

          .hero-curtain--pulse,
          .hero-curtain--pulse .hero-ledge__grip,
          .hero-curtain--pulse .hero-ledge__text {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

function HeroIntroContent() {
  return (
    <div className="hero-intro__content">
      <motion.p
        className="eyebrow hero-intro__eyebrow"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <span>
          <span className="gold-number">UK Wide</span>&nbsp;
          <span className="gold-slash">/</span>&nbsp;
          <span className="eyebrow-text-light">Commercial Finance Brokers</span>
        </span>
      </motion.p>

      <motion.h1
        id="hero-title"
        className="display hero-intro__title"
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="visible"
      >
        <span className="hero-intro__title-line">Funding Property,</span>
        <span className="hero-intro__title-line">
          Business &amp; <span className="hero-intro__title-accent">Growth.</span>
        </span>
      </motion.h1>

      <motion.p
        className="body-lg hero-intro__text"
        variants={fadeUp}
        custom={2}
        initial="hidden"
        animate="visible"
      >
        Tailored finance introductions for business owners, property
        professionals and developers. Seven core funding routes, one clear
        point of contact.
      </motion.p>

      <motion.div
        className="hero-intro__actions"
        variants={fadeUp}
        custom={3}
        initial="hidden"
        animate="visible"
      >
        <a href="#contact" className="btn-gold">
          Discuss Funding
          <ArrowIcon />
        </a>
      </motion.div>

      <motion.ul
        className="label hero-intro__trust"
        variants={fadeUp}
        custom={4}
        initial="hidden"
        animate="visible"
      >
        <li>Authorised &amp; regulated by the FCA</li>
        <li>Whole of market access</li>
      </motion.ul>
    </div>
  )
}

function HeroMosaic({ shouldReduceMotion }) {
  const mosaicRef = useRef(null)
  const isInView = useInView(mosaicRef, { amount: 0.5 })
  const [tileRoutes, setTileRoutes] = useState(INITIAL_TILE_ROUTES)
  const [isPaused, setIsPaused] = useState(false)
  const tileRoutesRef = useRef(INITIAL_TILE_ROUTES)
  const recentTilesRef = useRef([])
  const hoveredTileRef = useRef(-1)

  const isRotating = isInView && !isPaused && !shouldReduceMotion

  useEffect(() => {
    if (!isRotating) return
    const interval = setInterval(() => {
      /* Picked here, not inside a setState updater: React may run updaters twice,
         which would let the recorded tile differ from the one actually swapped. */
      const excludedTiles = [...recentTilesRef.current, hoveredTileRef.current]
      const { nextRoutes, swappedTile } = swapRandomTile(tileRoutesRef.current, excludedTiles)
      tileRoutesRef.current = nextRoutes
      recentTilesRef.current = [swappedTile, ...recentTilesRef.current].slice(0, RECENT_TILE_COOLDOWN)
      setTileRoutes(nextRoutes)
    }, TILE_SWAP_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isRotating])

  const handleTogglePause = () => setIsPaused((prev) => !prev)
  const toggleLabel = isPaused ? 'Play' : 'Pause'
  const [largeRoute, topRoute, ...bottomRoutes] = tileRoutes

  /* A hovered or focused tile is held still; the other tiles keep swapping. */
  const handleTileHoldChange = (tile) => {
    hoveredTileRef.current = tile
  }

  return (
    <div ref={mosaicRef} className="hero-mosaic" role="region" aria-label="Our finance solutions">
      <div className="hero-collage-stage">
        <div className="hero-collage">
          <HeroTile
            routeIndex={largeRoute}
            tileIndex={0}
            onHoldChange={handleTileHoldChange}
            className="hero-photo--large"
            sizes="(max-width: 700px) 90vw, 45vw"
            shouldReduceMotion={shouldReduceMotion}
          />
          <div className="hero-photo-right">
            <HeroTile
              routeIndex={topRoute}
              tileIndex={1}
              onHoldChange={handleTileHoldChange}
              className="hero-photo--top"
              sizes="(max-width: 700px) 90vw, 45vw"
              shouldReduceMotion={shouldReduceMotion}
            />
            <div className="hero-photo-bottom-row">
              {bottomRoutes.map((routeIndex, position) => (
                <HeroTile
                  key={position}
                  routeIndex={routeIndex}
                  tileIndex={position + 2}
                  onHoldChange={handleTileHoldChange}
                  className="hero-photo--bottom"
                  sizes="(max-width: 700px) 45vw, 22vw"
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-controls">
        <button type="button" className="label hero-controls__toggle" onClick={handleTogglePause}>
          {toggleLabel}
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </div>
  )
}

/* Phone-only static grid showing every route at once */
function HeroRoutesGrid() {
  return (
    <ul className="hero-routes-grid" aria-label="Our finance solutions">
      {HERO_ROUTES.map((route) => (
        <li key={route.src} className="hero-photo">
          <Image src={route.src} alt="" fill sizes="(max-width: 600px) 90vw, 1px" className={`object-cover ${route.position ?? ''}`} />
          <HeroPhotoOverlay route={route} />
        </li>
      ))}
    </ul>
  )
}

/* Picks a tile (skipping the excluded ones: recently swapped, hovered) and gives it a route that isn't on screen. */
function swapRandomTile(currentRoutes, excludedTiles) {
  const tileChoices = currentRoutes.map((_, tile) => tile).filter((tile) => !excludedTiles.includes(tile))
  const swappedTile = tileChoices[Math.floor(Math.random() * tileChoices.length)]
  const offscreenRoutes = HERO_ROUTES.map((_, route) => route).filter((route) => !currentRoutes.includes(route))
  const nextRoute = offscreenRoutes[Math.floor(Math.random() * offscreenRoutes.length)]

  const nextRoutes = currentRoutes.map((route, tile) => (tile === swappedTile ? nextRoute : route))
  return { nextRoutes, swappedTile }
}

/* Photos load eagerly (`priority`): a tile's new photo mounts mid-crossfade, and
   next/image's lazy IntersectionObserver doesn't reliably fire in that case. */
function HeroTile({ routeIndex, tileIndex, className, sizes, onHoldChange, shouldReduceMotion }) {
  const route = HERO_ROUTES[routeIndex]
  const fadeDuration = shouldReduceMotion ? 0 : TILE_FADE_DURATION_S
  const handleHold = () => onHoldChange(tileIndex)
  const handleRelease = () => onHoldChange(-1)

  return (
    <div className={`hero-photo ${className}`}
      onMouseEnter={handleHold}
      onMouseLeave={handleRelease}
      onFocus={handleHold}
      onBlur={handleRelease}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={route.src}
          className="hero-photo__layer"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeDuration, ease: [0.65, 0, 0.35, 1] }}
        >
          <Image src={route.src} alt="" fill sizes={sizes} className={`object-cover ${route.position ?? ''}`} priority />
          <HeroPhotoOverlay route={route} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function HeroPhotoOverlay({ route }) {
  return (
    <div className="hero-photo-overlay">
      <div className="hero-photo-overlay__body">
        <span className="hero-photo-overlay__label">{route.label}</span>
        <span className="hero-photo-overlay__tagline">{route.tagline}</span>
        <a href="#solutions" className="btn-gold hero-photo-overlay__cta" aria-label={`Explore ${route.label}`}>
          Explore
          <ArrowIcon />
        </a>
      </div>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" />
      <rect x="7" y="1" width="3" height="10" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M2.5 1v10l8-5z" />
    </svg>
  )
}
