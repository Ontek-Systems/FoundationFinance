'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Network, UserCircle } from 'lucide-react'

import { fadeUp } from '@/lib/motion'

const RIGHT_BLOCKS = [
  {
    icon: Network,
    title: 'Whole of Market Access',
    text: 'A carefully vetted panel of banks, challenger lenders and private funders across the UK, matched to your deal rather than a generic product.',
    linkLabel: 'Explore Solutions',
    href: '#solutions',
  },
  {
    icon: UserCircle,
    title: 'One Point of Contact',
    text: 'A dedicated broker manages your case from start to finish, guided by a clear five step process, no handoffs, no chasing.',
    linkLabel: 'How It Works',
    href: '#how-it-works',
  },
]

export function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      id="stats"
      aria-label="What we do at Foundation Finance"
      className="stats-bar-section section-padding"
    >
      <div className="section-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="stats-layout">
          <motion.div
            className="stats-left"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <div className="stats-left__eyebrow-wrap">
              <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 500 }}>
                <span style={{ color: '#DAA240', fontWeight: 500 }}>01</span>{' '}
                <span style={{ color: '#DAA240', fontWeight: 500 }}>/</span>{' '}
                <span style={{ color: '#000000', fontWeight: 500 }}>Introduction</span>
              </span>
            </div>

            <h2 className="heading-1 stats-left__title">
              A single, trusted route through commercial finance.
            </h2>
            <p className="stats-left__text">
              We connect property professionals, business owners and developers
              to the right lender, fast, structured, and backed by a network
              built over years in the market.
            </p>
          </motion.div>

          <div className="stats-right">
            {RIGHT_BLOCKS.map((block, i) => {
              const Icon = block.icon
              return (
                <motion.div
                  key={block.title}
                  className="stats-right-block"
                  variants={fadeUp}
                  custom={i + 1}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                >
                  <div className="stats-right-block__header">
                    <span className="stats-right-block__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3 className="stats-right-block__title">{block.title}</h3>
                  </div>

                  <p className="stats-right-block__text">{block.text}</p>

                  <a
                    href={block.href}
                    className="stats-right-block__link"
                    onClick={(e) => scrollTo(e, block.href)}
                  >
                    {block.linkLabel}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .stats-bar-section {
          position: relative;
          overflow: hidden;
          background: var(--off-white);
          padding-top: 70px !important;
          padding-bottom: 70px !important;
        }

        /* ── Layout: big title left, two stacked blocks right ─────────── */
        .stats-layout {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: start;
        }

        .stats-left__eyebrow-wrap {
          display: inline-flex;
          align-items: center;
          margin-bottom: clamp(16px, 2.4vw, 24px);
        }

        .stats-left__title {
          color: #021435;
          margin-bottom: clamp(18px, 2.6vw, 26px);
        }

        .stats-left__text {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(2, 20, 53, 0.65);
          font-size: clamp(15px, 1.9vw, 18px);
          line-height: 1.75;
          max-width: 440px;
        }

        .stats-right {
          display: flex;
          flex-direction: column;
          gap: clamp(24px, 3vw, 32px);
        }

        /* Line the right column up with the headline, not the eyebrow */
        @media (min-width: 801px) {
          .stats-right {
            padding-top: clamp(34px, 4.2vw, 42px);
          }
        }

        .stats-right-block {
          padding-top: clamp(24px, 3vw, 32px);
          border-top: 1px solid rgba(2, 20, 53, 0.12);
        }

        .stats-right-block:first-child {
          padding-top: 0;
          border-top: none;
        }

        .stats-right-block__header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: clamp(10px, 1.4vw, 12px);
        }

        /* Thin gold line icon — no box */
        .stats-right-block__icon {
          flex: none;
          display: inline-flex;
          color: #DAA240;
        }
        .stats-right-block__icon svg {
          width: 24px;
          height: 24px;
          stroke-width: 1.25;
        }

        .stats-right-block__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          color: #021435;
          font-weight: 400;
          font-size: clamp(20px, 2.3vw, 24px);
        }

        .stats-right-block__text {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(2, 20, 53, 0.65);
          font-size: clamp(15px, 1.7vw, 16px);
          line-height: 1.75;
          margin-bottom: clamp(12px, 1.6vw, 14px);
          max-width: 460px;
        }

        /* Text link with a full-width gold underline */
        .stats-right-block__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 4px;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #021435;
          text-decoration: none;
          background: linear-gradient(#DAA240, #DAA240) left bottom / 100% 2px no-repeat;
          transition: color 0.25s ease, gap 0.25s ease;
        }

        .stats-right-block__link:hover,
        .stats-right-block__link:focus-visible {
          color: #8A5C02;
          gap: 12px;
        }

        /* ── Responsive ─────────────────────────────────────────────── */
        @media (max-width: 800px) {
          .stats-layout {
            grid-template-columns: 1fr;
          }

          .stats-left__text {
            max-width: 100%;
          }

          .stats-right-block__text {
            max-width: 100%;
          }
        }

        /* Phones: everything centred */
        @media (max-width: 600px) {
          .stats-layout {
            text-align: center;
          }

          .stats-right-block__header {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  )
}
