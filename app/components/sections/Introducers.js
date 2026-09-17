'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

import { revealTransition } from '@/lib/motion'

const INTRODUCER_BENEFITS = [
  'Dedicated point of contact',
  'Quick assessment of enquiries',
  'Clear communication and progress updates',
  'Commercially focused finance introductions',
]

export function Introducers() {
  const contentRef = useRef(null)
  const contentInView = useInView(contentRef, { once: true, margin: '-80px' })

  const handleCtaClick = (e) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="introducers" aria-labelledby="introducers-heading">
      <div className="intro-split">
        {/* Copy */}
        <motion.div
          ref={contentRef}
          className="intro-split__content"
          initial={{ opacity: 0, y: 60 }}
          animate={contentInView ? { opacity: 1, y: 0 } : {}}
          transition={revealTransition()}
        >
          <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 500 }}>
            <span className="gold-number">08</span> <span className="gold-slash">/</span>{' '}
            <span className="eyebrow-text-dark">Introducer Partnerships</span>
          </span>

          <h2 id="introducers-heading" className="heading-1 intro-split__title">
            Stronger together.{' '}
            <em className="intro-split__emphasis">Better outcomes.</em>
          </h2>

          <p className="body-lg intro-split__lead">
            Partner with Foundation Finance and give your clients a clear route to
            specialist funding support. We work alongside accountants, solicitors,
            brokers and business advisors.
          </p>

          <ul className="intro-split__list">
            {INTRODUCER_BENEFITS.map((benefit) => (
              <li key={benefit} className="intro-split__item">
                <span className="intro-split__dot" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <a href="#contact" id="introducer-cta" className="btn-gold intro-split__cta" onClick={handleCtaClick}>
            Become an Introducer
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

        {/* Photo with angled edge */}
        <motion.div
          className="intro-split__media"
          initial={{ opacity: 0, x: 64 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={revealTransition(1)}
        >
          <Image
            src="/images/ffimages/introducer.jpg"
            alt="Business professionals talking together in an office"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="intro-split__image"
          />
          <div className="intro-split__shade" aria-hidden="true" />
        </motion.div>
      </div>

      <style>{`
        #introducers {
          background: #021435;
          overflow: hidden;
        }

        /* ── Split panel ───────────────────────────────────────────── */
        .intro-split {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .intro-split {
            grid-template-columns: 1fr 1fr;
            min-height: clamp(520px, 48vw, 640px);
          }
        }

        .intro-split__content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(56px, 8vw, 96px) 18px;
          order: 2;
        }
        @media (min-width: 480px) {
          .intro-split__content { padding-inline: 24px; }
        }
        @media (min-width: 900px) {
          .intro-split__content {
            order: 1;
            padding-inline: max(25px, calc((100vw - 1400px) / 2)) clamp(32px, 4vw, 64px);
          }
        }

        .intro-split__title {
          color: #ffffff;
          margin: clamp(14px, 2vw, 20px) 0 clamp(14px, 2vw, 20px);
        }

        .intro-split__emphasis {
          color: #DAA240;
          font-style: normal;
        }

        .intro-split__lead {
          color: rgba(255, 255, 255, 0.78);
          max-width: 520px;
          margin-bottom: clamp(20px, 3vw, 28px);
        }

        .intro-split__list {
          list-style: none;
          padding: 0;
          margin: 0 0 clamp(28px, 4vw, 40px);
          display: grid;
          gap: 12px;
        }

        .intro-split__item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(14px, 1.4vw, 16px);
          color: #ffffff;
        }

        .intro-split__dot {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #DAA240;
        }

        .intro-split__cta {
          align-self: flex-start;
          gap: 10px;
        }

        /* ── Photo ─────────────────────────────────────────────────── */
        .intro-split__media {
          position: relative;
          min-height: 280px;
          order: 1;
        }
        @media (min-width: 900px) {
          .intro-split__media {
            order: 2;
            min-height: 0;
            clip-path: polygon(14% 0, 100% 0, 100% 100%, 0 100%);
          }
        }

        .intro-split__image {
          object-fit: cover;
          object-position: center 70%;
        }

        /* Phones: copy above the photo, which gets a diagonal top edge
           cut against the navy panel */
        @media (max-width: 600px) {
          .intro-split__content {
            order: 1;
            padding-bottom: 40px;
          }
          /* 60% taller than the default 280px so the people are visible;
             the top edge rises from left to right */
          .intro-split__media {
            order: 2;
            min-height: 448px;
            clip-path: polygon(0 14%, 100% 0, 100% 100%, 0 100%);
          }
          .intro-split__image {
            object-position: center 40%;
          }
        }

        .intro-split__shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(2, 20, 53, 0.35) 0%, rgba(2, 20, 53, 0) 40%);
          pointer-events: none;
        }

      `}</style>
    </section>
  )
}
