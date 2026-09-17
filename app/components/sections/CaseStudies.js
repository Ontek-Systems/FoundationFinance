'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

import { revealTransition } from '@/lib/motion'

const CASES = [
  {
    id: 'development-case',
    category: 'Development Finance',
    title: 'Ground Up Residential Development',
    amount: '£2.4m',
    amountLabel: 'Facility Secured',
    tags: ['Ground up Build', '18 Units', 'Yorkshire'],
    description: 'A property developer required funding for an 18 unit residential development. We structured a ground up development facility covering 100% of build costs and a significant portion of land purchase, with a clear exit via sales and refinance.',
    metrics: [
      { label: 'LTV',   value: '68%' },
      { label: 'Term',  value: '18 Months' },
      { label: 'Units', value: '18' },
    ],
  },
  {
    id: 'property-case',
    category: 'Property Finance',
    title: 'Commercial Property Refinance Programme',
    amount: '£1.2m',
    amountLabel: 'Refinanced',
    tags: ['Commercial Mortgage', 'Refinance', 'East Midlands'],
    description: 'An investor sought to refinance a mixed use commercial property following an initial bridging loan. We sourced a commercial mortgage at improved terms, providing capital release and a longer term finance solution.',
    metrics: [
      { label: 'LTV',  value: '65%' },
      { label: 'Term', value: '10 Years' },
      { label: 'Type', value: 'Mixed use' },
    ],
  },
  {
    id: 'business-case',
    category: 'Business Finance',
    title: 'Fleet Expansion and Working Capital',
    amount: '£750k',
    amountLabel: 'Funded',
    tags: ['Vehicle Finance', 'Asset Finance', 'Logistics'],
    description: 'A logistics business required funding to expand its commercial vehicle fleet and support growing working capital requirements. We structured a combined vehicle finance and revolving credit facility tailored to seasonal cashflow.',
    metrics: [
      { label: 'Vehicles', value: '22' },
      { label: 'Term',     value: '4 Years' },
      { label: 'Type',     value: 'HGV Fleet' },
    ],
  },
]

function CaseCard({ caseItem, index }) {
  return (
    <motion.article
      id={caseItem.id}
      className="case-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={revealTransition(index)}
      whileHover={{ y: -8 }}
    >
      <div className="case-card__inner">
        <p className="case-card__category">{caseItem.category}</p>

        <p className="case-card__amount">{caseItem.amount}</p>
        <p className="case-card__amount-label">{caseItem.amountLabel}</p>

        <h3 className="case-card__title">{caseItem.title}</h3>
        <p className="case-card__desc">{caseItem.description}</p>

        <dl className="case-card__metrics">
          {caseItem.metrics.map((metric) => (
            <div key={metric.label} className="case-card__metric">
              <dt className="case-card__metric-label">{metric.label}</dt>
              <dd className="case-card__metric-value">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <p className="case-card__tags">{caseItem.tags.join(' / ')}</p>
      </div>
    </motion.article>
  )
}

export function CaseStudies() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  const scrollToContact = (e) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="case-studies"
      className="section-padding case-section"
    >
      {/* Background photo */}
      <Image
        src="/images/case studies/case-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="case-bg-image"
        priority={false}
      />
      {/* Dark overlay for legibility */}
      <div className="case-bg-overlay" aria-hidden="true" />

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="case-header"
          initial={{ opacity: 0, y: 60 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={revealTransition()}
        >
          <div className="case-heading-block">
            <div className="case-header__accent">
              <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 400 }}>
                <span style={{ color: '#DAA240', fontWeight: 400 }}>07</span> <span style={{ color: '#DAA240', fontWeight: 400 }}>/</span> <span style={{ color: '#ffffff', fontWeight: 400 }}>Case Studies</span>
              </span>
            </div>
            <h2 className="heading-1" style={{ color: '#ffffff' }}>
              Real requirements.{' '}
              <em className="case-header__emphasis">Clear routes forward.</em>
            </h2>
          </div>
          <p className="body-lg case-header__disclaimer">
            Indicative examples of the types of transactions we have helped to introduce.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="case-cards-grid">
          {CASES.map((caseItem, index) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} index={index} />
          ))}
        </div>

        {/* Section CTA */}
        <div className="case-cta-row">
          <motion.a
            href="#contact"
            className="btn-gold case-cta"
            onClick={scrollToContact}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={revealTransition(0, 0.2)}
            whileHover={{ y: -3, boxShadow: '0 14px 44px rgba(218,162,64,0.4)' }}
          >
            Discuss your requirement
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>

        {/* Disclaimer */}
        <motion.p
          className="case-footnote"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Case studies are illustrative examples only. All transactions are subject to individual assessment. Past performance does not guarantee future results.
        </motion.p>
      </div>

      <style>{`
        #case-studies {
          padding-top: 70px !important;
          padding-bottom: 70px !important;
        }

        .case-section {
          position: relative;
          overflow: hidden;
        }

        .case-bg-image {
          object-fit: cover;
          z-index: 0;
        }

        .case-bg-overlay {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(180deg, rgba(2, 8, 23, 0.82) 0%, rgba(2, 20, 53, 0.88) 55%, rgba(2, 8, 23, 0.92) 100%);
        }

        /* ── Header ──────────────────────────────────────────────────
           Mobile-first: stacked. At ≥768px it becomes a side-by-side row. */
        .case-header {
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.4vw, 24px);
          margin-bottom: clamp(40px, 6vw, 64px);
        }

        .case-header__accent {
          display: inline-flex;
          align-items: center;
          gap: clamp(8px, 1.5vw, 10px);
          margin-bottom: clamp(12px, 2vw, 20px);
        }

        .case-header__emphasis {
          color: #ffffff;
        }

        .case-header__disclaimer {
          color: rgba(255, 255, 255, 0.65);
          text-align: left;
          max-width: 460px;
        }

        /* ── Cards grid ─────────────────────────────────────────────── */
        .case-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(24px, 3.5vw, 32px);
          margin-bottom: 0;
        }

        /* ── Card ────────────────────────────────────────────────────
           No border, no fill, no blur — the photo background reads
           straight through. Cards are separated by a thin rule: a
           horizontal line while stacked on mobile/tablet, a vertical
           line between columns once the grid goes 3-up on desktop. */
        .case-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          text-align: left;
        }
        .case-card:not(:last-child) {
          padding-bottom: clamp(24px, 3.5vw, 32px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
        }

        @media (min-width: 860px) {
          .case-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .case-card {
            padding: 0 clamp(24px, 2.8vw, 32px);
          }
          .case-card:first-child {
            padding-left: 0;
          }
          .case-card:last-child {
            padding-right: 0;
          }
          .case-card:not(:last-child) {
            padding-bottom: 0;
            border-bottom: none;
            border-right: 1px solid rgba(255, 255, 255, 0.14);
          }
        }

        /* Inner block sits centred within each column; text stays left */
        .case-card__inner {
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        /* White label with the same gold underline as the nav links */
        .case-card__category {
          position: relative;
          align-self: flex-start;
          padding-bottom: 6px;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: #ffffff;
          font-size: clamp(10px, 1.4vw, 11px);
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: clamp(18px, 2.6vw, 24px);
        }
        .case-card__category::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #C38E32, #F0C66B, #C38E32);
        }

        .case-card__amount {
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: clamp(40px, 5vw, 52px);
          font-weight: 400;
          line-height: 1;
          color: #ffffff;
        }

        .case-card__amount-label {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.5);
          font-size: clamp(9px, 1.3vw, 10.5px);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-top: clamp(8px, 1.2vw, 10px);
          margin-bottom: clamp(20px, 3vw, 28px);
        }

        .case-card__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          color: #ffffff;
          font-weight: 400;
          font-size: clamp(19px, 2.2vw, 22px);
          line-height: 1.3;
          margin-bottom: clamp(10px, 1.6vw, 14px);
        }

        .case-card__desc {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(13px, 1.6vw, 14px);
          line-height: 1.72;
          margin-bottom: clamp(20px, 2.8vw, 26px);
        }

        /* Metrics — side by side, each column divided by a thin line.
           Pinned to the bottom of the card (margin-top: auto) so the
           stats row lines up across all cards regardless of how long
           each card's description happens to be. */
        .case-card__metrics {
          display: flex;
          align-items: stretch;
          justify-content: flex-start;
          gap: clamp(16px, 2vw, 24px);
          margin: auto 0 clamp(20px, 2.8vw, 26px);
        }

        .case-card__metric {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;
          text-align: left;
          padding-right: clamp(16px, 2vw, 24px);
        }

        .case-card__metric:not(:last-child) {
          border-right: 1px solid rgba(255, 255, 255, 0.12);
        }

        .case-card__metric-label {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.4);
          font-size: clamp(9px, 1.2vw, 10px);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .case-card__metric-value {
          font-family: var(--next-font-playfair), Georgia, serif;
          color: #ffffff;
          font-weight: 400;
          font-size: clamp(14px, 1.8vw, 16px);
          line-height: 1.2;
          margin: 0;
        }

        .case-card__tags {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.32);
          font-size: clamp(10.5px, 1.4vw, 11.5px);
          letter-spacing: 0.04em;
        }

        /* ── Section CTA ─────────────────────────────────────────────
           Equal space above and below so the button sits centred between
           the cards and the footnote. */
        .case-cta-row {
          display: flex;
          justify-content: center;
          margin: clamp(40px, 6vw, 56px) 0;
        }
        .case-cta {
          font-size: 12px;
          padding: 16px 40px;
        }

        /* ── Footnote ──────────────────────────────────────────────── */
        .case-footnote {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.32);
          font-size: clamp(10px, 1.4vw, 11px);
          text-align: center;
          line-height: 1.65;
        }

        /* ── Breakpoints ───────────────────────────────────────────── */
        /* Phones: header centred, cards stay left-aligned */
        @media (max-width: 600px) {
          .case-header {
            align-items: center;
            text-align: center;
          }
          .case-header__disclaimer {
            text-align: center;
          }
        }

        @media (min-width: 768px) {
          .case-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </section>
  )
}
