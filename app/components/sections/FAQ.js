'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

import { revealTransition } from '@/lib/motion'

const FAQS = [
  {
    id: 'types',
    question: 'What types of finance do you help with?',
    answer: 'All seven core routes to commercial funding under one roof. Commercial mortgages, property and development finance, bridging, buy to let and portfolio funding, asset and vehicle finance, cashflow and working capital, and full refinance or restructuring. Whatever the opportunity looks like, we know the route that gets it funded.',
  },
  {
    id: 'speed',
    question: 'How quickly can finance be arranged?',
    answer: 'Faster than you might expect. Bridging and asset finance can complete in days, while more complex development or commercial mortgage deals typically take a few weeks. Because we know exactly which lender suits your case before we approach them, you skip the slow rounds of rejection that cost other borrowers months.',
  },
  {
    id: 'fee',
    question: 'Do you charge a fee?',
    answer: 'We are completely transparent about how we are paid. In most cases our commission comes from the lender, not from you. Where a fee does apply, you will know the exact amount before any work begins. No surprises, no hidden costs, and nothing to pay for an initial conversation about your requirement.',
  },
  {
    id: 'lenders',
    question: 'Which lenders do you work with?',
    answer: 'A carefully vetted, whole of market panel built over years: high street banks, challenger banks, specialist lenders and private funders across the UK. That breadth matters, because the right lender for an 18 unit development is rarely the right lender for a fleet expansion. We match the funder to the deal, never the other way round.',
  },
  {
    id: 'declined',
    question: 'Can you help if my bank has already said no?',
    answer: 'Very often, yes. A high street decline says more about that bank’s appetite than about your business. We look at the opportunity behind the figures, present it properly, and take it to lenders who actually want deals like yours. Many of our strongest completions started life as a rejection somewhere else.',
  },
  {
    id: 'vehicles',
    question: 'Can you help with commercial vehicles and fleets?',
    answer: 'Absolutely. From a single van to an entire HGV fleet, including trailers, specialist vehicles and the switch to electric. We structure terms around how your business earns, so the vehicles start paying for themselves from the day they hit the road.',
  },
  {
    id: 'refinance',
    question: 'Can you help with a refinance?',
    answer: 'Yes, and it is often where we add the most value. We release equity from property and assets, consolidate expensive debt into cleaner structures, move commercial mortgages onto stronger terms and exit development facilities on time. If your current borrowing was arranged more than a couple of years ago, there is a good chance we can improve it.',
  },
  {
    id: 'information',
    question: 'What information will I need?',
    answer: 'Just enough to tell your story well. Typically that means a short summary of the requirement, recent accounts or income details, and information on any property or assets involved. We tell you exactly what is needed up front, help you package it, and handle the paperwork from there. You stay focused on running the business.',
  },
  {
    id: 'next-steps',
    question: 'What happens after I get in touch?',
    answer: 'A straightforward conversation about what you need and what you are trying to achieve. From there we assess the options, tell you honestly what is realistic, and outline the lenders best placed to help. If it makes sense to proceed, we manage the application from start to completion and keep you updated at every stage.',
  },
  {
    id: 'credit-check',
    question: 'Will speaking to you affect my credit score?',
    answer: 'No. An initial conversation with us involves no credit search. Lenders may carry out their own checks later in the process, and we will always tell you before that happens, so nothing is run without your knowledge.',
  },
  {
    id: 'new-business',
    question: 'Can newer businesses get funding?',
    answer: 'Often, yes. Limited trading history narrows the field, but it does not close it. Some lenders focus on the strength of the asset, the property or the people behind the business rather than years of accounts. We know which ones, and we present your case in the way they want to see it.',
  },
  {
    id: 'introducers',
    question: 'Do you work with accountants and other introducers?',
    answer: 'Yes. We work alongside accountants, solicitors, estate agents and other professionals who want a reliable finance partner for their clients. We keep you informed throughout, look after your client as we would our own, and make sure the relationship stays yours.',
  },
]


const EASE_OUT = [0.16, 1, 0.3, 1]

function FAQItem({ faq, index, isOpen, onToggle }) {
  const number = `${String(index + 1).padStart(2, '0')}.`

  return (
    <motion.div
      className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={revealTransition(Math.min(index, 4))}
    >
      {/* Gold line over the top separator when open (bottom border turns gold via CSS) */}
      <motion.span
        className="faq-item__rule"
        aria-hidden="true"
        initial={false}
        animate={{ scaleX: isOpen ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      />

      <button
        type="button"
        className="faq-item__question"
        id={`faq-question-${faq.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
        onClick={onToggle}
      >
        <span className="faq-item__number" aria-hidden="true">{number}</span>
        <span className="faq-item__question-text">{faq.question}</span>
        <span className="faq-item__icon" aria-hidden="true">
          <motion.svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            id={`faq-answer-${faq.id}`}
            role="region"
            aria-labelledby={`faq-question-${faq.id}`}
            className="faq-item__answer-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.5, ease: EASE_OUT }, opacity: { duration: 0.35 } }}
          >
            <p className="faq-item__answer">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const introRef = useRef(null)
  const introInView = useInView(introRef, { once: true, margin: '-80px' })
  const [openId, setOpenId] = useState(FAQS[0].id)

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <section id="faq" className="section-padding faq-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div aria-hidden="true" className="faq-orb" />

      <div className="section-container faq-grid">
        {/* Left: sticky intro */}
        <div className="faq-intro-col">
          <motion.div
            ref={introRef}
            className="faq-intro"
            initial={{ opacity: 0, y: 40 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={revealTransition()}
          >
            <span className="eyebrow faq-eyebrow">
              <span className="faq-gold">07 /</span> Questions
            </span>
            <h2 className="heading-1 faq-heading">
              Questions, answered <em className="faq-gold">clearly.</em>
            </h2>
            <p className="body-lg faq-intro__body">
              Straight answers to the things people ask us most. Anything else, just pick up the phone.
            </p>
            <FAQContactCard ctaId="faq-cta" className="faq-card--desktop" onContactClick={handleContactClick} />
          </motion.div>
        </div>

        {/* Right: questions */}
        <div className="faq-list">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              index={index}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>

        <FAQContactCard ctaId="faq-cta-mobile" className="faq-card--mobile" onContactClick={handleContactClick} />
      </div>

      <style>{`
        .faq-section {
          position: relative;
          background: #ffffff;
          /* clip, not hidden: hidden would break position: sticky */
          overflow: clip;
          padding-top: clamp(56px, 8vw, 110px) !important;
          padding-bottom: clamp(56px, 8vw, 110px) !important;
          /* ContactBar (35px) + Navbar on desktop */
          --faq-header-h: 128px;
        }

        .faq-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(36px, 6vw, 56px);
        }

        .faq-gold { color: #DAA240; }

        /* ── Intro ─────────────────────────────────────────────────── */
        .faq-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          color: #021435;
          margin-bottom: clamp(14px, 2vw, 20px);
        }
        .faq-heading {
          color: #021435;
          margin-bottom: 22px;
        }
        .faq-intro__body {
          color: #2D3748;
          max-width: 440px;
        }

        /* Contact card */
        .faq-card {
          position: relative;
          margin-top: clamp(28px, 3.5vw, 40px);
          max-width: 440px;
          padding: 24px 26px;
          background: linear-gradient(135deg, #021435 0%, #0A1F52 100%);
          border-radius: 4px;
          box-shadow: 0 18px 40px rgba(2, 20, 53, 0.18);
        }
        .faq-card__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: 22px;
          color: #ffffff;
          margin-bottom: 4px;
        }
        .faq-card__text {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 20px;
        }
        .faq-card__actions {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px 24px;
        }
        .faq-card__cta {
          font-size: 11.5px;
          padding: 13px 26px;
        }
        .faq-card__phone {
          display: flex;
          flex-direction: column;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .faq-card__phone:hover,
        .faq-card__phone:focus-visible { color: #DAA240; }
        .faq-card__phone-label {
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #DAA240;
        }

        /* ── List ──────────────────────────────────────────────────── */
        .faq-list {
          display: flex;
          flex-direction: column;
        }

        .faq-item {
          position: relative;
          border-bottom: 1px solid rgba(2, 20, 53, 0.09);
          transition: background 0.35s ease, border-color 0.35s ease;
        }
        .faq-item:first-child {
          border-top: 1px solid rgba(2, 20, 53, 0.09);
        }
        .faq-item:hover {
          background: linear-gradient(90deg, rgba(218, 162, 64, 0.06), rgba(218, 162, 64, 0) 80%);
        }
        .faq-item--open,
        .faq-item--open:hover {
          background: transparent;
          border-bottom-color: #DAA240;
        }
        .faq-item__rule {
          position: absolute;
          top: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: #DAA240;
          transform-origin: left;
          z-index: 1;
        }

        .faq-item__question {
          width: 100%;
          display: flex;
          align-items: center;
          gap: clamp(16px, 2vw, 24px);
          padding: clamp(20px, 2.4vw, 26px) clamp(16px, 2vw, 24px);
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .faq-item__question:focus-visible {
          outline: 2px solid #DAA240;
          outline-offset: -2px;
        }

        .faq-item__number {
          flex-shrink: 0;
          min-width: 36px;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          font-size: clamp(13px, 1.4vw, 14px);
          line-height: 1;
          color: #DAA240;
        }

        .faq-item__question-text {
          flex: 1;
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: clamp(17px, 2.1vw, 21px);
          line-height: 1.35;
          color: #021435;
          transition: color 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faq-item__question:hover .faq-item__question-text {
          transform: translateX(4px);
        }

        .faq-item__icon {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(218, 162, 64, 0.1);
          color: #C89020;
          transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
        }
        .faq-item__question:hover .faq-item__icon {
          background: rgba(218, 162, 64, 0.2);
        }
        .faq-item--open .faq-item__icon {
          background: #DAA240;
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(218, 162, 64, 0.4);
        }

        .faq-item__answer-wrap { overflow: hidden; }

        .faq-item__answer {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(14px, 1.8vw, 15.5px);
          line-height: 1.8;
          color: rgba(2, 20, 53, 0.75);
          max-width: 68ch;
          /* Indent to line up with the question text */
          padding: 0 clamp(60px, 7vw, 84px) clamp(22px, 3vw, 30px) calc(clamp(16px, 2vw, 24px) * 2 + 36px);
        }

        .faq-orb {
          position: absolute;
          top: -140px;
          left: -160px;
          width: clamp(300px, 42vw, 560px);
          height: clamp(300px, 42vw, 560px);
          background: radial-gradient(circle, rgba(218, 162, 64, 0.07) 0%, transparent 70%);
          filter: blur(70px);
          pointer-events: none;
        }

        /* ── Desktop: two columns, intro sticks centred in the viewport
           area below the header ───────────────────────────────────── */
        @media (min-width: 1024px) {
          .faq-grid {
            grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
            gap: clamp(56px, 7vw, 120px);
            align-items: start;
          }
          .faq-intro-col {
            position: sticky;
            top: var(--faq-header-h);
            height: calc(100vh - var(--faq-header-h));
            display: flex;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .faq-item__answer { padding-right: 16px; }
        }

        /* The contact card sits beside the intro, except on phones where
           it follows the question list */
        .faq-card--mobile { display: none; }

        @media (max-width: 600px) {
          .faq-intro {
            text-align: center;
          }
          .faq-intro__body {
            margin-inline: auto;
          }
          .faq-card--desktop { display: none; }
          .faq-card--mobile {
            display: block;
            width: 100%;
            margin: 0 auto;
            text-align: center;
          }
          .faq-card__actions {
            flex-direction: column;
          }
          .faq-card__phone {
            align-items: center;
          }
        }
      `}</style>
    </section>
  )
}

function FAQContactCard({ ctaId, className, onContactClick }) {
  return (
    <div className={`faq-card ${className}`}>
      <p className="faq-card__title">Still have a question?</p>
      <p className="faq-card__text">Speak to us directly. No obligation, no jargon.</p>
      <div className="faq-card__actions">
        <motion.a
          href="#contact"
          id={ctaId}
          className="btn-gold faq-card__cta"
          onClick={onContactClick}
          whileHover={{ y: -2, boxShadow: '0 12px 36px rgba(218,162,64,0.35)' }}
          whileTap={{ y: 0 }}
        >
          Ask Us Directly
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
        <span className="faq-card__phone">
          <span className="faq-card__phone-label">Or call</span>
          07835 905219
        </span>
      </div>
    </div>
  )
}
