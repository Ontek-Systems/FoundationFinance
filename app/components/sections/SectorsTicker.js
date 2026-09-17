'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'

import { revealTransition } from '@/lib/motion'

const SECTOR_CARDS = [
  { id: 'residential',   title: 'Residential Developers',    subtitle: 'Housing conversions & ground up builds' },
  { id: 'investors',     title: 'Property Investors',        subtitle: 'Portfolio expansion & capital release' },
  { id: 'commercial',    title: 'Commercial Property',       subtitle: 'Offices, retail & industrial units' },
  { id: 'construction',  title: 'Construction Companies',    subtitle: 'SME contractors & building firms' },
  { id: 'healthcare',    title: 'Healthcare Businesses',     subtitle: 'Care homes, clinics & surgeries' },
  { id: 'hospitality',   title: 'Hospitality & Leisure',     subtitle: 'Hotels, pubs, restaurants & gyms' },
  { id: 'manufacturing', title: 'Manufacturing & Production', subtitle: 'Plant machinery, tooling & equipment' },
  { id: 'professional',  title: 'Professional Services',     subtitle: 'Accountants, solicitors & agencies' },
  { id: 'transport',     title: 'Transport & Logistics',     subtitle: 'Haulage, HGV fleets & EV transit' },
  { id: 'retail',        title: 'Retail & Ecommerce',        subtitle: 'Stores, outlets & online brands' },
  { id: 'recruitment',   title: 'Recruitment Agencies',      subtitle: 'Contractor payroll & invoice backing' },
  { id: 'technology',    title: 'Technology & Software',     subtitle: 'IP backing, SaaS & tech infrastructure' },
]

const ROW1 = [...SECTOR_CARDS, ...SECTOR_CARDS]
const ROW2 = [...SECTOR_CARDS].reverse().concat([...SECTOR_CARDS].reverse())

function TickerCard({ sector }) {
  return (
    <div className="st-card-wrap">
      <motion.div
        className="st-card"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <span className="st-card__title">{sector.title}</span>
        <span className="st-card__divider" aria-hidden="true" />
        <span className="st-card__sub">{sector.subtitle}</span>
      </motion.div>
    </div>
  )
}

export function SectorsTicker() {
  const trackRef1 = useRef(null)
  const trackRef2 = useRef(null)

  const x1 = useMotionValue(0)
  const x2 = useMotionValue(0)

  const [trackWidth1, setTrackWidth1] = useState(0)
  const [trackWidth2, setTrackWidth2] = useState(0)

  const [isRow1Hovered, setIsRow1Hovered] = useState(false)
  const [isRow2Hovered, setIsRow2Hovered] = useState(false)

  // Measure track widths dynamically on mount and resize
  useEffect(() => {
    const measure = () => {
      if (trackRef1.current) {
        setTrackWidth1(trackRef1.current.scrollWidth)
      }
      if (trackRef2.current) {
        setTrackWidth2(trackRef2.current.scrollWidth)
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Animation Loop for Row 1 (scrolls left)
  useEffect(() => {
    if (trackWidth1 === 0) return

    let animationFrameId
    const baseSpeed = 0.85 // pixels per frame

    const tick = () => {
      const currentX = x1.get()
      const speed = isRow1Hovered ? baseSpeed * 0.3 : baseSpeed // slow down to 30% on hover
      const nextX = currentX - speed

      // Loop wrap-around at half width since list is duplicated
      if (nextX < -trackWidth1 / 2) {
        x1.set(nextX + trackWidth1 / 2)
      } else {
        x1.set(nextX)
      }
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [trackWidth1, isRow1Hovered, x1])

  // Animation Loop for Row 2 (scrolls right)
  useEffect(() => {
    if (trackWidth2 === 0) return

    let animationFrameId
    const baseSpeed = 0.85 // pixels per frame

    // Initialize starting position of row 2 at the midpoint offset to align scroll wrapping
    if (x2.get() === 0) {
      x2.set(-trackWidth2 / 2)
    }

    const tick = () => {
      const currentX = x2.get()
      const speed = isRow2Hovered ? baseSpeed * 0.3 : baseSpeed // slow down to 30% on hover
      const nextX = currentX + speed

      // Loop wrap-around at 0 boundary
      if (nextX > 0) {
        x2.set(nextX - trackWidth2 / 2)
      } else {
        x2.set(nextX)
      }
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [trackWidth2, isRow2Hovered, x2])

  return (
    <section id="sectors" aria-label="Sectors we serve" className="st-section section-padding">
      {/* Header */}
      <motion.div
        className="st-header"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={revealTransition()}
      >
        <div className="st-header__accent">
          <span className="eyebrow st-header__eyebrow" style={{ fontSize: '11px', fontWeight: 500 }}>
            <span style={{ color: '#DAA240', fontWeight: 500 }}>06</span> <span style={{ color: '#DAA240', fontWeight: 500 }}>/</span> <span style={{ color: '#000000', fontWeight: 500 }}>Sectors We Support</span>
          </span>
        </div>
        <h2 className="heading-1 st-header__title">
          Finance for every<em className="st-header__em"> industry.</em>
        </h2>
        <p className="st-header__sub">
          From property and construction to technology and healthcare, we structure funding for businesses across every sector.
        </p>
      </motion.div>

      {/* Ticker rows */}
      <div className="st-ticker-wrapper">
        {/* Edge fades */}
        <div className="st-fade st-fade--left" aria-hidden="true" />
        <div className="st-fade st-fade--right" aria-hidden="true" />

        {/* Row 1 — left */}
        <div
          className="st-row st-row--overflow"
          onMouseEnter={() => setIsRow1Hovered(true)}
          onMouseLeave={() => setIsRow1Hovered(false)}
        >
          <motion.div ref={trackRef1} className="st-track" style={{ x: x1 }}>
            {ROW1.map((s, i) => <TickerCard key={`r1-${i}`} sector={s} />)}
          </motion.div>
        </div>

        {/* Row 2 — right */}
        <div
          className="st-row st-row--overflow"
          onMouseEnter={() => setIsRow2Hovered(true)}
          onMouseLeave={() => setIsRow2Hovered(false)}
        >
          <motion.div ref={trackRef2} className="st-track" style={{ x: x2 }}>
            {ROW2.map((s, i) => <TickerCard key={`r2-${i}`} sector={s} />)}
          </motion.div>
        </div>
      </div>

      <style>{`
        /* ── Section ────────────────────────────────────────────────── */
        .st-section {
          background: #ffffff;
          border-top: 1px solid rgba(165, 117, 21, 0.12);
          border-bottom: 1px solid rgba(165, 117, 21, 0.12);
          overflow: hidden;
          position: relative;
          padding-top: 70px !important;
          padding-bottom: 70px !important;
        }

        /* ── Header ────────────────────────────────────────────────── */
        .st-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto clamp(32px, 5vw, 60px);
          padding: 0 clamp(16px, 4vw, 24px);
        }

        .st-header__accent {
          display: inline-flex;
          align-items: center;
          gap: clamp(8px, 1.5vw, 12px);
          margin-bottom: clamp(12px, 2vw, 18px);
        }

        .st-header__line {
          display: block;
          width: clamp(20px, 4vw, 28px);
          height: 1.5px;
          background: #C89020;
        }

        .st-header__eyebrow {
          letter-spacing: 0.18em;
          font-size: 11px;
          font-weight: 500;
        }

        .st-header__title {
          color: #021435;
          margin-bottom: clamp(10px, 1.8vw, 16px);
        }

        .st-header__em {
          color: #021435;
        }

        .st-header__sub {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(14px, 2vw, 16px);
          line-height: 1.7;
          color: #4a5060;
          max-width: 540px;
          margin: 0 auto;
        }

        /* ── Ticker wrapper ────────────────────────────────────────── */
        .st-ticker-wrapper {
          position: relative;
        }

        /* Edge fades — narrow on mobile so they don't eat the viewport */
        .st-fade {
          position: absolute;
          top: 0; bottom: 0;
          width: clamp(60px, 12vw, 200px);
          z-index: 2;
          pointer-events: none;
        }
        .st-fade--left  { left: 0;  background: linear-gradient(90deg,  #ffffff 0%, transparent 100%); }
        .st-fade--right { right: 0; background: linear-gradient(270deg, #ffffff 0%, transparent 100%); }

        .st-row {
          position: relative;
          z-index: 1;
          padding: 12px 0;
          margin-top: -12px;
          margin-bottom: calc(clamp(10px, 1.8vw, 16px) - 24px);
        }
        .st-row:last-child { margin-bottom: -12px; }
        .st-row--overflow { overflow: hidden; }

        /* ── Marquee tracks ────────────────────────────────────────── */
        .st-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }

        /* ── Cards ───────────────────────────────────────────────────
           Mobile: title-only pills are narrower and read cleaner on a
           small marquee. The subtitle + divider appear at ≥640px. */
        .st-card-wrap {
          padding: 12px clamp(6px, 1.4vw, 10px);
          flex-shrink: 0;
        }

        .st-card {
          display: inline-flex;
          align-items: center;
          gap: clamp(10px, 1.8vw, 14px);
          height: clamp(44px, 7vw, 56px);
          background: #ffffff;
          padding: 0 clamp(16px, 3vw, 24px);
          box-shadow:
            0 2px 8px rgba(2, 20, 53, 0.04),
            0 6px 20px rgba(2, 20, 53, 0.04);
          cursor: default;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
          white-space: nowrap;
        }

        .st-card__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: clamp(13px, 2vw, 15px);
          font-weight: 400;
          color: #021435;
          letter-spacing: -0.01em;
        }

        .st-card__divider {
          display: none;                       /* hidden on mobile */
          width: 1px;
          height: clamp(12px, 1.6vw, 16px);
          background: rgba(165, 117, 21, 0.25);
          flex-shrink: 0;
        }

        .st-card__sub {
          display: none;                       /* hidden on mobile */
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(11px, 1.4vw, 12px);
          color: #8A5C02;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        /* ── Breakpoints ───────────────────────────────────────────── */

        /* Tablet & up: reveal the subtitle + divider for richer pills. */
        @media (min-width: 640px) {
          .st-card__divider { display: block; }
          .st-card__sub     { display: inline; }
        }

        /* Reduced motion: freeze the marquee. */
        @media (prefers-reduced-motion: reduce) {
          .st-track { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
