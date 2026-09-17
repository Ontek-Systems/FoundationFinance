'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { EASE_SMOOTH } from '@/lib/motion'

/* Images are placeholders borrowed from other sections — swap for final photography */
const STEPS = [
  {
    id: 'enquiry',
    number: '01',
    title: 'Initial Enquiry',
    description: 'Share your funding requirement with us. Whether that is a quick summary or full details, we start by understanding your situation and objectives.',
    points: ['Information gathering and organisation'],
    image: '/images/ffimages/introduction.jpg',
    imageAlt: 'Team meeting around a table discussing a funding enquiry',
    ctaLabel: 'Start an Enquiry',
  },
  {
    id: 'assessment',
    number: '02',
    title: 'Assessment',
    description: 'We review your requirements, assess the opportunity and identify the most suitable route to funding from our specialist lender network.',
    points: ['Lender identification and sourcing'],
    image: '/images/ffimages/assessing.jpg',
    imageAlt: 'Two advisers reviewing figures on a tablet',
    ctaLabel: 'View Solutions',
    ctaHref: '#solutions',
  },
  {
    id: 'structure',
    number: '03',
    title: 'Solution Structured',
    description: 'We identify the right lender for your specific requirement and present the options clearly, with honest guidance on the most appropriate solution.',
    points: ['Application packaging and presentation'],
    image: '/images/ffimages/solution.jpg',
    imageAlt: 'Adviser presenting funding options to a group',
    ctaLabel: 'Discuss Funding',
  },
  {
    id: 'application',
    number: '04',
    title: 'Application Managed',
    description: 'We coordinate the information required and manage the application process, keeping things organised and on track throughout.',
    points: [
      'Communication between all parties',
      'Progress monitoring and updates',
      'Query handling and issue resolution',
    ],
    image: '/images/ffimages/managed.jpg',
    imageAlt: 'Adviser working through application paperwork at a desk',
    ctaLabel: 'Discuss Funding',
  },
  {
    id: 'completion',
    number: '05',
    title: 'Completion',
    description: 'Funding is confirmed and in place. We remain available to review your ongoing requirements and help you plan future funding needs.',
    points: ['Coordination through to completion'],
    image: '/images/ffimages/completion.jpg',
    imageAlt: 'Two businessmen shaking hands to agree a deal',
    ctaLabel: 'Start the Process',
  },
]

const SECTION_NUMBER = '05'
const STAGE_WORDS = ['One', 'Two', 'Three', 'Four', 'Five']
const DEFAULT_CTA_HREF = '#contact'

/* Local, snappy reveal timing. The shared revealTransition bakes the intro
   screen's remaining time into its delay at first render, which left these
   below-the-fold rows waiting ~5s before appearing. */
const STEP_REVEAL = { duration: 0.7, ease: EASE_SMOOTH }
const STEP_CONTENT_REVEAL = { duration: 0.7, delay: 0.1, ease: EASE_SMOOTH }

function handleAnchorClick(e) {
  const href = e.currentTarget.getAttribute('href')
  if (!href?.startsWith('#')) return
  e.preventDefault()
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

function StepRow({ step, index }) {
  // Step 1 has its image on the left, then sides alternate
  const isImageRight = index % 2 === 1
  const rowClass = `hiw-row ${isImageRight ? 'hiw-row--image-right' : ''} ${index % 2 === 0 ? 'hiw-row--tinted' : ''}`

  return (
    <article id={`step-${step.id}`} className={rowClass} aria-labelledby={`step-${step.id}-title`}>
      <motion.div
        className="hiw-row__media"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={STEP_REVEAL}
      >
        <Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 900px) 100vw, 50vw" className="hiw-row__image" />
      </motion.div>

      <motion.div
        className="hiw-row__content"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={STEP_CONTENT_REVEAL}
      >
        <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 500 }}>
          <span className="gold-number">{SECTION_NUMBER}</span> <span className="gold-slash">/</span>{' '}
          <span className="eyebrow-text-light">Stage {STAGE_WORDS[index]} of {STAGE_WORDS[STEPS.length - 1]}</span>
        </span>
        <h3 id={`step-${step.id}-title`} className="hiw-row__title">{step.title}</h3>
        <p className="hiw-row__description">{step.description}</p>
        <ul className="hiw-row__points">
          {step.points.map((point) => (
            <li key={point} className="hiw-row__point">
              <span className="hiw-row__dot" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        <a href={step.ctaHref ?? DEFAULT_CTA_HREF} className="btn-gold hiw-row__cta" onClick={handleAnchorClick}>
          {step.ctaLabel}
        </a>
      </motion.div>
    </article>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading">
      <motion.header
        className="hiw-header section-container"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={STEP_REVEAL}
      >
        <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 500 }}>
          <span className="gold-number">{SECTION_NUMBER}</span> <span className="gold-slash">/</span>{' '}
          <span className="eyebrow-text-light">The Process</span>
        </span>
        <h2 id="how-it-works-heading" className="heading-1 hiw-header__title">
          A simple process. Powerful outcomes.
        </h2>
        <p className="body-lg hiw-header__lead">
          From initial conversation to completion, we manage every step of your funding journey
          with one clear point of contact.
        </p>
      </motion.header>

      <div className="hiw-rows">
        <div className="hiw-rows__line" aria-hidden="true" />
        {STEPS.map((step, index) => (
          <StepRow key={step.id} step={step} index={index} />
        ))}
      </div>

      <style>{`
        #how-it-works {
          background: #ffffff;
        }

        /* ── Header ──────────────────────────────────────────────────── */
        .hiw-header {
          text-align: center;
          padding-top: clamp(56px, 8vw, 96px);
          padding-bottom: clamp(40px, 6vw, 72px);
        }

        .hiw-header__title {
          color: #021435;
          margin: clamp(16px, 2.4vw, 24px) auto clamp(16px, 2.4vw, 24px);
        }

        .hiw-header__lead {
          color: #4A5568;
          max-width: 640px;
          margin: 0 auto;
        }

        /* ── Rows ────────────────────────────────────────────────────── */
        .hiw-row {
          display: grid;
          grid-template-columns: 1fr;
          background: #ffffff;
        }
        .hiw-row--tinted {
          background: #F5F7FA;
        }

        @media (min-width: 900px) {
          .hiw-row {
            grid-template-columns: 1fr 1fr;
            min-height: clamp(520px, 44vw, 760px);
          }
          .hiw-row--image-right .hiw-row__media {
            order: 2;
          }
        }

        .hiw-row__media {
          position: relative;
          min-height: 280px;
        }

        @media (min-width: 900px) {
          .hiw-row__media {
            min-height: 0;
          }
        }

        /* One continuous gold line down the centre of every row */
        .hiw-rows {
          position: relative;
        }
        .hiw-rows__line {
          display: none;
        }
        @media (min-width: 900px) {
          .hiw-rows__line {
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            width: 6.4px;
            transform: translateX(-50%);
            background: #DAA240;
            z-index: 2;
            pointer-events: none;
          }
        }

        .hiw-row__image {
          object-fit: cover;
        }

        .hiw-row__content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: clamp(40px, 7vw, 96px) clamp(18px, 7vw, 128px);
        }

        .hiw-row__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: clamp(32px, 4vw, 60px);
          font-weight: 400;
          line-height: 1.12;
          color: #021435;
          margin: clamp(18px, 2.4vw, 28px) 0;
        }

        .hiw-row__description {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.8;
          color: #4A5568;
          max-width: 560px;
          margin: 0 0 clamp(16px, 2vw, 22px);
        }

        .hiw-row__points {
          list-style: none;
          padding: 0;
          margin: 0 0 clamp(24px, 3vw, 36px);
          display: grid;
          gap: 10px;
        }

        .hiw-row__point {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(14px, 1.3vw, 16px);
          color: #021435;
        }

        .hiw-row__dot {
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #DAA240;
        }

        .hiw-row__cta {
          padding: 18px 44px;
        }

        /* Phones: step copy centred */
        @media (max-width: 600px) {
          .hiw-row__content {
            align-items: center;
            text-align: center;
          }
          .hiw-row__description {
            margin-inline: auto;
          }
          .hiw-row__point {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  )
}
