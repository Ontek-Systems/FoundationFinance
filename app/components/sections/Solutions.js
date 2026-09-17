'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform, useMotionValue } from 'framer-motion'

import { revealTransition } from '@/lib/motion'

const SOLUTIONS = [
  {
    id: 'commercial',
    title: 'Commercial Finance',
    subtitle: 'For trading businesses and investment',
    image: '/images/ffimages/refinance_and_restructure.jpg',
    bullets: [
      'Business loans and working capital',
      'Commercial mortgages and property backed funding',
      'Acquisition and MBO support',
      'Tax, VAT and cashflow requirements',
      'Refinance and restructuring',
    ],
  },
  {
    id: 'property',
    title: 'Property Finance',
    subtitle: 'For investors and landlords',
    image: '/images/ffimages/property_finance2.jpg',
    bullets: [
      'Buy to let and portfolio funding',
      'Commercial mortgages',
      'Bridging and auction finance',
      'Property refurbishment finance',
      'Portfolio refinance and capital release',
    ],
  },
  {
    id: 'development',
    title: 'Development Finance',
    subtitle: 'New build, conversions and refurbishments',
    image: '/images/ffimages/development.jpg',
    bullets: [
      'Land acquisition and site purchase',
      'Ground up development finance',
      'Conversions and heavy refurbishment',
      'Mezzanine and stretch senior facilities',
      'Development exit routes',
    ],
  },
  {
    id: 'vehicles',
    title: 'Commercial Vehicle Finance',
    subtitle: 'Vans, trucks, fleets and EVs',
    image: '/images/ffimages/commercial_vehicle_finance2.jpg',
    bullets: [
      'Vans, pickups and light commercial vehicles',
      'HGVs, trailers and specialist vehicles',
      'Fleet expansion and electric vehicles',
      'Refinance of existing commercial vehicles',
    ],
  },
  {
    id: 'asset',
    title: 'Asset Finance',
    subtitle: 'Plant, machinery and equipment',
    image: '/images/ffimages/asset_finance.jpg',
    bullets: [
      'Plant and construction machinery',
      'Manufacturing and production equipment',
      'Technology and office equipment',
      'New and used purchases',
    ],
  },
  {
    id: 'cashflow',
    title: 'Business and Cashflow Finance',
    subtitle: 'Improve cashflow, fuel growth',
    image: '/images/ffimages/business_and_cashflow_finance.jpg',
    bullets: [
      'Invoice finance and debtor funding',
      'Merchant cash advance',
      'Business loans and revolving facilities',
      'Trade and stock finance',
    ],
  },
  {
    id: 'refinance',
    title: 'Refinance & Restructure',
    subtitle: 'Unlock equity and optimize existing facilities',
    image: '/images/ffimages/refinance_and_restructure2.jpg',
    imagePosition: 'object-[20%_center]',
    bullets: [
      'Release equity from existing assets and properties',
      'Consolidate business debt into structured facilities',
      'Restructure commercial mortgages at better terms',
      'Bridging loans to exit development facilities',
      'Capital release for business growth or acquisition',
    ],
  },
]

const BASE_SPEED = 0.5 // pixels per frame
const HOVER_SPEED_RATIO = 0.5
const SPEED_EASING = 0.03 // fraction of the gap to target speed closed each frame

function SolutionCard({ solution, index }) {
  return (
    <motion.article
      className="solution-card"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Background Image covering the whole card */}
      <div className="solution-card__bg-image">
        <Image
          src={solution.image}
          alt={`${solution.title} — Foundation Finance`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className={`solution-card__img ${solution.imagePosition ?? ''}`}
          priority={index < 3}
        />
        <div className="solution-card__bg-overlay" aria-hidden="true" />
      </div>

      <div className="solution-card__content">
        <h3 className="solution-card__title">{solution.title}</h3>
        <p className="solution-card__subtitle">{solution.subtitle}</p>

        <div className="solution-card__reveal">
          <ul className="solution-card__bullets">
            {solution.bullets.map((bullet) => (
              <li key={bullet} className="solution-card__bullet-item">{bullet}</li>
            ))}
          </ul>
        </div>

        <a
          href="#contact"
          className="btn-gold solution-card__cta-btn"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Learn more
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </motion.article>
  )
}

export function Solutions() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const trackRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  const x = useMotionValue(0)
  const [halfTrackWidth, setHalfTrackWidth] = useState(0)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)

  // Measure half of the track (first 7 cards) dynamically to handle infinite looping
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        const children = trackRef.current.children
        if (children.length >= 14) {
          const rect1 = children[0].getBoundingClientRect()
          const rect8 = children[7].getBoundingClientRect()
          const width = rect8.left - rect1.left
          setHalfTrackWidth(width)
        }
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Auto-scrolling animation loop — eases down to half speed while hovered
  useEffect(() => {
    if (halfTrackWidth === 0) return

    let animationFrameId
    let currentSpeed = BASE_SPEED

    const tick = () => {
      const targetSpeed = isHoveredRef.current ? BASE_SPEED * HOVER_SPEED_RATIO : BASE_SPEED
      currentSpeed += (targetSpeed - currentSpeed) * SPEED_EASING
      if (!isDraggingRef.current) {
        x.set(x.get() - currentSpeed)
      }
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [halfTrackWidth, x])

  // Handle infinite wrap-around seamlessly on x changes (both drag and auto-scroll)
  useEffect(() => {
    if (halfTrackWidth === 0) return

    const unsubscribe = x.on('change', (latest) => {
      if (latest < -halfTrackWidth) {
        x.set(latest + halfTrackWidth)
      } else if (latest > 0) {
        x.set(latest - halfTrackWidth)
      }
    })

    return () => unsubscribe()
  }, [halfTrackWidth, x])

  const handleDragStart = () => {
    isDraggingRef.current = true
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
  }

  return (
    <section id="solutions" ref={sectionRef} className="solutions-section section-padding">
      <motion.div
        aria-hidden="true"
        className="solutions-section__glow"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['-10%', '10%']) }}
      />

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="solutions-header"
          initial={{ opacity: 0, y: 60 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={revealTransition()}
        >
          <div className="solutions-header__accent">
            <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 500 }}>
              <span style={{ color: '#DAA240', fontWeight: 500 }}>03</span> <span style={{ color: '#DAA240', fontWeight: 500 }}>/</span> <span style={{ color: '#000000', fontWeight: 500 }}>Finance Solutions</span>
            </span>
          </div>
          <h2 className="heading-1 solutions-header__title">
            Finance built around{' '}
            <em className="solutions-header__emphasis">the opportunity.</em>
          </h2>
          <p className="body-lg solutions-header__sub">
            Seven core funding routes. One clear point of contact.
          </p>
        </motion.div>

        {/* Draggable Auto-moving Carousel with faded sides */}
        <div
          className="solutions-carousel-container"
          onMouseEnter={() => { isHoveredRef.current = true }}
          onMouseLeave={() => { isHoveredRef.current = false }}
        >
          <motion.div
            ref={trackRef}
            className="solutions-carousel-track"
            drag="x"
            style={{ x }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {[...SOLUTIONS, ...SOLUTIONS].map((solution, index) => (
              <SolutionCard key={`${solution.id}-${index}`} solution={solution} index={index} />
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <div className="solutions-cta">
          <motion.a
            href="#contact"
            className="btn-gold solutions-cta__btn"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            whileHover={{ y: -3, boxShadow: '0 14px 40px rgba(218,162,64,0.4)' }}
            whileTap={{ y: 0 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Start an Enquiry
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>
      </div>

      <style>{`
        .solutions-section {
          background: #ffffff;
          position: relative;
          overflow: hidden;
          padding-top: 70px !important;
          padding-bottom: 70px !important;
        }

        .solutions-section__glow {
          display: none;
        }

        /* ── Header ──────────────────────────────────────────────────── */
        .solutions-header {
          text-align: center;
          /* Plus the carousel's 24px top padding = half the previous gap */
          margin-bottom: clamp(6px, 1.5vw, 24px);
        }

        .solutions-header__accent {
          display: inline-flex;
          align-items: center;
          gap: clamp(10px, 2vw, 14px);
          margin-bottom: clamp(14px, 2.4vw, 20px);
        }

        .solutions-header__title {
          color: #021435;
          margin-bottom: clamp(12px, 2vw, 20px);
        }

        .solutions-header__emphasis {
          color: #021435;
        }

        .solutions-header__sub {
          color: #2D3748;
          font-size: clamp(15px, 2.2vw, 19px);
          line-height: 1.6;
          max-width: 580px;
          margin: 0 auto;
        }

        /* ── Carousel Container ───────────────────────────────────────── */
        .solutions-carousel-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 24px 0;
          /* Matches the header's margin-bottom so the gap above and below the cards is equal */
          margin-bottom: clamp(6px, 1.5vw, 24px);
          background: transparent;
        }



        .solutions-carousel-track {
          display: flex;
          gap: clamp(16px, 2.4vw, 28px);
          width: max-content;
          cursor: grab;
          user-select: none;
        }
        .solutions-carousel-track:active {
          cursor: grabbing;
        }

        /* ── Card ────────────────────────────────────────────────────── */
        .solution-card {
          width: clamp(280px, 24vw, 350px);
          height: clamp(440px, 40vw, 490px);
          position: relative;
          overflow: hidden;
          background: transparent;
          border: 1px solid rgba(2, 20, 53, 0.08);
          box-shadow: 0 8px 24px -10px rgba(2, 20, 53, 0.08);
          transition: border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .solution-card:hover {
          border-color: rgba(2, 20, 53, 0.2);
        }

        /* Full card background image */
        .solution-card__bg-image {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .solution-card__img {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .solution-card:hover .solution-card__img {
          transform: scale(1.05);
        }

        .solution-card__bg-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2, 20, 53, 0.25) 0%, rgba(2, 20, 53, 0) 22%, rgba(2, 20, 53, 0) 40%, rgba(2, 20, 53, 0.8) 68%, rgba(2, 20, 53, 0.97) 100%),
            rgba(2, 20, 53, 0.1);
          transition: background-color 0.4s ease;
          z-index: 1;
        }

        /* Darken the whole image while the bullet list is open */
        @media (hover: hover) {
          .solution-card:hover .solution-card__bg-overlay {
            background-color: rgba(2, 20, 53, 0.35);
          }
        }

        /* Hairline inset frame (matches hero tiles), brightens on hover */
        .solution-card__bg-overlay::after {
          content: '';
          position: absolute;
          inset: clamp(8px, 1vw, 12px);
          border: 1px solid rgba(255, 255, 255, 0.43);
          pointer-events: none;
          transition: border-color var(--transition-fast);
        }

        .solution-card:hover .solution-card__bg-overlay::after {
          border-color: rgba(218, 162, 64, 0.6);
        }

        /* Content pinned to the bottom */
        .solution-card__content {
          position: relative;
          z-index: 2;
          margin-top: auto;
          display: flex;
          flex-direction: column;
          padding: clamp(22px, 2.8vw, 28px);
          text-shadow: 0 1px 3px rgba(2, 20, 53, 0.9), 0 2px 12px rgba(2, 20, 53, 0.8), 0 4px 32px rgba(2, 20, 53, 0.7);
        }

        .solution-card__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: clamp(22px, 2.3vw, 26px);
          font-weight: 400;
          color: #ffffff;
          line-height: 1.2;
          margin: 0 0 8px;
        }

        .solution-card__subtitle {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(13.5px, 1.5vw, 14.5px);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.5;
          margin: 0;
        }

        /* Bullets revealed on hover (pointer devices only) */
        .solution-card__reveal {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition: grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
        }

        .solution-card__bullets {
          overflow: hidden;
          min-height: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .solution-card__bullet-item {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: 13.5px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.88);
          padding: 7px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .solution-card__bullet-item:first-child {
          margin-top: 14px;
        }

        @media (hover: hover) {
          .solution-card:hover .solution-card__reveal {
            grid-template-rows: 1fr;
            opacity: 1;
          }
        }

        /* CTA Link — gold button */
        .solution-card__cta-btn {
          margin-top: 22px;
          align-self: flex-start;
          padding: 11px 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-shadow: none;
        }

        /* Section CTA */
        .solutions-cta {
          text-align: center;
        }

        .solutions-cta__btn {
          font-size: clamp(11px, 1.6vw, 12px);
          padding: clamp(14px, 2.4vw, 16px) clamp(32px, 6vw, 48px);
          letter-spacing: 0.12em;
        }

        /* ── Responsive ─────────────────────────────────────────────── */

        /* Phones: cards keep their footprint but grow with content so
           long bullet lists never clip against the fixed height. */
        @media (max-width: 640px) {
          .solution-card {
            width: min(78vw, 320px);
            height: auto;
            min-height: 440px;
          }

          .solutions-carousel-container {
            padding: 16px 0;
          }
        }

        /* Phones: no hover, so the bullets are always shown on a
           darker, taller card with a full-width button */
        @media (max-width: 600px) {
          .solution-card {
            width: 82vw;
            min-height: 500px;
          }

          .solution-card__bg-overlay {
            background:
              linear-gradient(180deg, rgba(2, 20, 53, 0.1) 0%, rgba(2, 20, 53, 0.35) 30%, rgba(2, 20, 53, 0.9) 55%, rgba(2, 20, 53, 0.98) 100%);
          }

          .solution-card__content {
            padding: 26px 24px 24px;
          }

          .solution-card__title {
            font-size: 24px;
          }

          .solution-card__subtitle {
            padding-bottom: 14px;
            border-bottom: 2px solid #DAA240;
            align-self: flex-start;
          }

          .solution-card__reveal {
            grid-template-rows: 1fr;
            opacity: 1;
          }

          .solution-card__bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 5px 0;
            border-top: none;
            font-size: 13.5px;
          }

          .solution-card__bullet-item::before {
            content: '';
            flex-shrink: 0;
            width: 5px;
            height: 5px;
            margin-top: 7px;
            background: #DAA240;
            transform: rotate(45deg);
          }

          .solution-card__bullet-item:first-child {
            margin-top: 12px;
          }

          .solution-card__cta-btn {
            align-self: stretch;
            justify-content: center;
            margin-top: 20px;
            padding: 13px 20px;
          }

          .solutions-header__sub {
            max-width: 300px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .solution-card, .solution-card__reveal, .solution-card__bg-overlay::after { transition: none !important; }
        }
      `}</style>
    </section>
  )
}
