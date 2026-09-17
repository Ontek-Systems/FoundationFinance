'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ShieldCheck, Landmark, TrendingUp, MessageSquareText } from 'lucide-react'

import { revealTransition } from '@/lib/motion'

const PILLARS = [
  { icon: ShieldCheck, title: 'FCA Authorised', text: 'A regulated commercial finance broker you can trust.' },
  { icon: Landmark, title: 'UK-Wide Lender Network', text: 'Specialist lenders matched to your deal.' },
  { icon: TrendingUp, title: 'Commercially Minded', text: 'We focus on the opportunity behind the figures.' },
  { icon: MessageSquareText, title: 'Plain English', text: 'No jargon. Just clear, structured routes to funding.' },
]

const PARTICLE_COUNT = 30
const PILLAR_INTERVAL_MS = 3000

export function About() {
  const sectionRef = useRef(null)
  const textRef    = useRef(null)
  const imageRef   = useRef(null)

  const textInView  = useInView(textRef,  { once: true, margin: '-80px' })
  const imageInView = useInView(imageRef, { once: true, margin: '-80px' })

  // 3D image tilt
  const imageRotateXVal = useMotionValue(0)
  const imageRotateYVal = useMotionValue(0)
  const springImageRotateX = useSpring(imageRotateXVal, { stiffness: 80, damping: 25 })
  const springImageRotateY = useSpring(imageRotateYVal, { stiffness: 80, damping: 25 })

  // Scroll-driven transforms
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8])
  const scrollRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-6, 0, 6])
  const scrollScale  = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.94])
  const networkRotation = useTransform(scrollYProgress, [0, 1], [0, 90])



  const finalRotateX = useTransform([scrollRotateX, springImageRotateX], ([sX, mX]) => sX + mX)
  const finalRotateY = useTransform([scrollRotateY, springImageRotateY], ([sY, mY]) => sY + mY)

  // Particles — initialised client-side only to avoid hydration mismatch
  const [particles, setParticles] = useState([])
  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 4,
        delay: Math.random() * 1.5,
        duration: Math.random() * 2.5 + 2,
      })),
    )
  }, [])

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    imageRotateXVal.set(y * -12)
    imageRotateYVal.set(x * 12)
  }

  const handleImageMouseLeave = () => {
    imageRotateXVal.set(0)
    imageRotateYVal.set(0)
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding"
      style={{
        background: 'var(--navy)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating gold dust particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            className="gold-particle"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              '--d': `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Accent ambient blur orb */}
      <motion.div
        aria-hidden="true"
        className="about-ambient-orb"
        style={{ y: parallaxY }}
      />

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="about-split">

          {/* ── Text Content ─────────────────────────────────────────── */}
          <motion.div
            ref={textRef}
            className="about-text"
            initial={{ opacity: 0, y: 60 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={revealTransition()}
          >
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 10px)',
                marginBottom: 'clamp(16px, 3vw, 24px)',
              }}
            >
              <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 400 }}>
                <span style={{ color: '#DAA240', fontWeight: 400 }}>04</span> <span style={{ color: '#DAA240', fontWeight: 400 }}>/</span> <span style={{ color: '#ffffff', fontWeight: 400 }}>About Foundation Finance</span>
              </span>
            </div>

            <h2
              className="heading-1"
              style={{ color: '#ffffff', marginBottom: 'clamp(18px, 3vw, 28px)' }}
            >
              Finance is our foundation.{' '}
              <em style={{ color: 'var(--gold)' }}>Your success</em>{' '}
              is our focus.
            </h2>


            <p
              style={{
                fontFamily: 'var(--next-font-roboto), system-ui, sans-serif',
                color: 'rgba(255,255,255,0.72)',
                fontSize: 'clamp(15px, 2.2vw, 18px)',
                lineHeight: 1.78,
                marginBottom: 'var(--about-gap)',
              }}
            >
              Foundation Finance provides finance introductions for business owners,
              investors and developers, presenting each opportunity clearly to the
              right specialists.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={textInView ? { opacity: 1, y: 0 } : {}}
              transition={revealTransition(1)}
            >
              <PillarRotator />
            </motion.div>

            <motion.a
              href="#how-it-works"
              id="about-cta"
              className="btn-gold"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
              whileHover={{ y: -3, boxShadow: '0 14px 40px rgba(218,162,64,0.4)' }}
              whileTap={{ y: 0 }}
            >
              See How It Works
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>


          </motion.div>

          {/* ── Arched Image Column ──────────────────────────────────── */}
          <div
            ref={imageRef}
            className="about-image-column"
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {/* Spinning geometric node-network backdrop */}
            <motion.svg
              viewBox="0 0 500 500"
              fill="none"
              className="about-network-svg"
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                x: '-50%', y: '-50%',
                rotate: networkRotation,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.28,
              }}
              aria-hidden="true"
            >
              <circle cx="250" cy="250" r="220" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="6 8" />
              <circle cx="250" cy="250" r="160" stroke="url(#goldGrad)" strokeWidth="0.75" />
              <circle cx="250" cy="250" r="100" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3 4" />

              <line x1="250" y1="30" x2="250" y2="470" stroke="url(#goldGrad)" strokeWidth="0.5" />
              <line x1="30" y1="250" x2="470" y2="250" stroke="url(#goldGrad)" strokeWidth="0.5" />
              <line x1="94.4" y1="94.4" x2="405.6" y2="405.6" stroke="url(#goldGrad)" strokeWidth="0.5" strokeDasharray="5 5" />
              <line x1="94.4" y1="405.6" x2="405.6" y2="94.4" stroke="url(#goldGrad)" strokeWidth="0.5" strokeDasharray="5 5" />

              <circle cx="250" cy="90" r="4" fill="#DAA240" />
              <circle cx="250" cy="410" r="4" fill="#DAA240" />
              <circle cx="90" cy="250" r="4" fill="#DAA240" />
              <circle cx="410" cy="250" r="4" fill="#DAA240" />
              <circle cx="144" cy="144" r="3" fill="#DAA240" />
              <circle cx="356" cy="356" r="3" fill="#DAA240" />
              <circle cx="144" cy="356" r="3" fill="#DAA240" />
              <circle cx="356" cy="144" r="3" fill="#DAA240" />

              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DAA240" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#DAA240" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#DAA240" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Arched image container with 3D tilting */}
            <motion.div
              className="arched-image-container"
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={imageInView ? { opacity: 1, scale: 1 } : {}}
              transition={revealTransition(0, 0.2)}
              style={{
                width: '100%',
                maxWidth: '480px',
                rotateX: finalRotateX,
                rotateY: finalRotateY,
                scale: scrollScale,
                transformStyle: 'preserve-3d',
                perspective: 1200,
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%', transform: 'translateZ(0px)' }}>
                <Image
                  src="/images/ffimages/about.jpg"
                  alt="Looking up at glass office towers against the sky"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />

                {/* Bottom fade for legibility over the dark bg */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(2,20,53,0.7) 100%)',
                  }}
                />

                {/* Arched corner decorative frames */}
                {[
                  { top: 0, left: 0, borderTop: '2px solid #DAA240', borderLeft: '2px solid #DAA240' },
                  { bottom: 0, right: 0, borderBottom: '2px solid #DAA240', borderRight: '2px solid #DAA240' },
                ].map((s, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    style={{ position: 'absolute', width: 'clamp(40px, 8vw, 64px)', height: 'clamp(40px, 8vw, 64px)', ...s }}
                  />
                ))}
              </div>
            </motion.div>


          </div>
        </div>
      </div>

      <style>{`
        #about {
          padding-top: 70px !important;
          padding-bottom: 70px !important;
        }

        /* ── Layout ────────────────────────────────────────────────────
           Mobile-first: stack text over image. The image sits below the
           copy so the reader gets context before the visual. */
        .about-split {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(40px, 7vw, 96px);
          align-items: center;
          position: relative;
          z-index: 2;
        }

        /* Ambient orb scales down on phones */
        .about-ambient-orb {
          position: absolute;
          right: -250px;
          top: 30%;
          width: clamp(360px, 60vw, 750px);
          height: clamp(360px, 60vw, 750px);
          background: radial-gradient(circle, rgba(218, 162, 64, 0.065) 0%, transparent 68%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 1;
        }



        /* ── Pillar rotator ───────────────────────────────────────────
           One shared gap (--about-gap) above and below the accent line,
           above the progress bars and above the CTA keeps rhythm even. */
        #about {
          --about-gap: clamp(28px, 3.5vw, 40px);
        }
        .about-rotator {
          margin-bottom: var(--about-gap);
          padding-top: var(--about-gap);
          border-top: 1px solid var(--gold-border);
        }
        /* All items share one grid cell; invisible copies reserve the
           height of the tallest point so the layout never shifts. */
        .about-rotator__stage {
          display: grid;
          perspective: 1200px;
        }
        .about-rotator__item {
          grid-area: 1 / 1;
          display: flex;
          gap: clamp(16px, 2.5vw, 22px);
          align-items: center;
          backface-visibility: hidden;
          will-change: transform, opacity;
        }
        .about-rotator__item--sizer {
          visibility: hidden;
        }
        .about-rotator__icon {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
        }
        .about-rotator__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: clamp(22px, 3vw, 30px);
          line-height: 1.2;
          color: #ffffff;
          margin: 0 0 6px;
        }
        .about-rotator__text {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(15px, 1.8vw, 17px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.68);
          margin: 0;
        }
        .about-rotator__progress {
          display: flex;
          gap: 8px;
          margin-top: var(--about-gap);
        }
        .about-rotator__dot {
          position: relative;
          flex: 1;
          max-width: 56px;
          height: 3px;
          padding: 0;
          border: none;
          overflow: hidden;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.14);
        }
        .about-rotator__dot:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }
        .about-rotator__dot-fill {
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform-origin: left center;
        }
        /* The active bar's fill is the timer: when it finishes, the
           rotator advances. Pausing freezes the bar exactly in place. */
        @keyframes about-rotator-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .about-rotator__dot-fill--active {
          animation: about-rotator-fill var(--pillar-interval) linear forwards;
        }

        /* ── Image column ───────────────────────────────────────────── */
        .about-image-column {
          order: 2;
        }

        /* Network SVG backdrop scales to the column */
        .about-network-svg {
          width: clamp(300px, 70%, 500px);
          height: clamp(300px, 70%, 500px);
        }

        /* ── Arched image container ───────────────────────────────────
           Mobile: a gentle arch and a wide cinematic ratio so the image
           doesn't eat the whole viewport. The arch softens further on
           very small screens. */
        .arched-image-container {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          border: 1.5px solid rgba(218, 162, 64, 0.22);
          box-shadow: 0 30px 70px rgba(1, 8, 23, 0.65), inset 0 0 50px rgba(218, 162, 64, 0.05);
          background: transparent;
          transition: border-color 0.5s ease;
          z-index: 1;
        }
        .arched-image-container:hover {
          border-color: rgba(218, 162, 64, 0.5);
        }





        /* ── Particles ────────────────────────────────────────────────
           Very subtle — not visible at first glance, only if you look.
           No glow, just faint dim dots drifting fast. */
        @keyframes float-particle {
          0%   { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
          20%  { opacity: 0.22; }
          80%  { opacity: 0.22; }
          100% { transform: translateY(-320px) translateX(60px) scale(0.8); opacity: 0; }
        }
        .gold-particle {
          position: absolute;
          background: radial-gradient(circle, rgba(218, 162, 64, 0.2) 0%, rgba(218, 162, 64, 0.1) 50%, rgba(218, 162, 64, 0) 100%);
          pointer-events: none;
          animation: float-particle var(--d, 3.5s) linear infinite;
        }

        /* ── Breakpoints ────────────────────────────────────────────── */

        /* Tablet: side-by-side, but keep inline badges (they read better
           than floating badges until the column is wide enough). */
        @media (min-width: 768px) {
          .about-split {
            grid-template-columns: 1.1fr 0.9fr;
            gap: clamp(48px, 6vw, 80px);
          }
          .about-image-column {
            order: 0;
          }
          .arched-image-container {
            aspect-ratio: 4 / 5;
          }
          .about-network-svg {
            width: clamp(380px, 80%, 500px);
            height: clamp(380px, 80%, 500px);
          }
        }

        /* Laptop: layout settings */
        @media (min-width: 1024px) {
          .arched-image-container {
          }
        }

        /* Phones: copy, pillar rotator and CTA centred */
        @media (max-width: 600px) {
          .about-text {
            text-align: center;
          }
          .about-rotator__item {
            flex-direction: column;
            gap: 12px;
          }
          .about-rotator__progress {
            justify-content: center;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .gold-particle { animation: none !important; }
          .about-ambient-orb { transition: none !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Rotating pillar: one point on screen, turns vertically to the next ──
const PILLAR_EASE = [0.45, 0, 0.2, 1]
const PILLAR_TRANSITION = { duration: 1.1, ease: PILLAR_EASE }
const PILLAR_INTERVAL_STYLE = { '--pillar-interval': `${PILLAR_INTERVAL_MS}ms` }

function PillarRotator() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const pillar = PILLARS[activeIndex]
  const Icon = pillar.icon
  const enterState = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotateX: -55, y: 18 }
  const exitState = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotateX: 55, y: -18 }
  const fillPlayState = isPaused ? 'paused' : 'running'

  const handleFillEnd = () => {
    setActiveIndex((current) => (current + 1) % PILLARS.length)
  }

  return (
    <div
      className="about-rotator"
      style={PILLAR_INTERVAL_STYLE}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="about-rotator__stage" aria-live="polite">
        {PILLARS.map((item) => (
          <PillarContent key={item.title} pillar={item} className="about-rotator__item about-rotator__item--sizer" isHidden />
        ))}
        <AnimatePresence initial={false}>
          <motion.div
            key={pillar.title}
            className="about-rotator__item"
            initial={enterState}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={exitState}
            transition={PILLAR_TRANSITION}
          >
            <span className="about-rotator__icon" aria-hidden="true">
              <Icon size={26} strokeWidth={1.6} />
            </span>
            <div>
              <h3 className="about-rotator__title">{pillar.title}</h3>
              <p className="about-rotator__text">{pillar.text}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="about-rotator__progress">
        {PILLARS.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className="about-rotator__dot"
            aria-label={`Show ${item.title}`}
            aria-current={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {index === activeIndex && (
              <span
                key={activeIndex}
                className="about-rotator__dot-fill about-rotator__dot-fill--active"
                style={{ animationPlayState: fillPlayState }}
                onAnimationEnd={handleFillEnd}
              />
            )}
            {index < activeIndex && <span className="about-rotator__dot-fill" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function PillarContent({ pillar, className, isHidden }) {
  const Icon = pillar.icon
  return (
    <div className={className} aria-hidden={isHidden}>
      <span className="about-rotator__icon">
        <Icon size={26} strokeWidth={1.6} />
      </span>
      <div>
        <p className="about-rotator__title">{pillar.title}</p>
        <p className="about-rotator__text">{pillar.text}</p>
      </div>
    </div>
  )
}
