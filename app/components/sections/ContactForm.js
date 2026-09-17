'use client'

import { useState, useRef } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { CircleUserRound } from 'lucide-react'

import { revealTransition } from '@/lib/motion'
import { UK_DOT_FRAME_WIDTH, UK_DOT_FRAME_HEIGHT } from '@/lib/ukDotMap'

import { useDotMapCanvas } from './HeroMap'

/* Dark-background colours for the dot map: faint white dots that light up gold */
const CONTACT_DOT_PALETTE = {
  base: { red: 255, green: 255, blue: 255, alpha: 0.06 },
  ring: { red: 218, green: 162, blue: 64, alpha: 0.9 },
  core: { red: 240, green: 200, blue: 120, alpha: 1 },
}

const FUNDING_TABS = [
  { id: 'commercial',  label: 'Commercial',  icon: '💼' },
  { id: 'property',    label: 'Property',    icon: '🏠' },
  { id: 'development', label: 'Development', icon: '🏗️' },
  { id: 'vehicles',    label: 'Vehicles',    icon: '🚛' },
  { id: 'asset',       label: 'Asset',       icon: '⚙️' },
  { id: 'cashflow',    label: 'Cashflow',    icon: '📊' },
  { id: 'refinance',   label: 'Refinance',   icon: '🔄' },
]

const INITIAL_FORM_STATE = {
  name: '', email: '', phone: '', company: '', amount: '', message: '', fundingType: 'commercial',
}

function FormField({ id, label, type, name, value, onChange, required, placeholder }) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="ff-field-wrap" data-focused={focused || undefined} data-filled={value ? true : undefined}>
      <label htmlFor={id} className="ff-field-label">
        {label}{required && <span className="ff-required">*</span>}
      </label>
      <div className="ff-input-shell">
        <input
          id={id} type={type} name={name} value={value}
          onChange={onChange} required={required} placeholder={placeholder}
          className="ff-field-input"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <span className="ff-input-bar" />
      </div>
    </div>
  )
}

function TextareaField({ id, label, name, value, onChange, placeholder, rows }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="ff-field-wrap" data-focused={focused || undefined} data-filled={value ? true : undefined}>
      <label htmlFor={id} className="ff-field-label">{label}</label>
      <div className="ff-input-shell">
        <textarea
          id={id} name={name} value={value} onChange={onChange}
          rows={rows} placeholder={placeholder}
          className="ff-field-input ff-field-textarea"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ resize: 'none' }}
        />
        <span className="ff-input-bar" />
      </div>
    </div>
  )
}

function ContactDetail({ icon, label, value }) {
  return (
    <motion.div
      className="contact-detail-row"
      whileHover={{ x: 5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="contact-detail-icon">
        {icon}
      </div>
      <div>
        <p className="contact-detail-label">{label}</p>
        <p className="contact-detail-value">{value}</p>
      </div>
    </motion.div>
  )
}

/* Pointer travel (px) before a press on the tab row counts as a drag */
const TAB_DRAG_THRESHOLD = 5

/* Lets a mouse drag the tab row sideways like a finger swipe does. A drag
   swallows the click that follows so it doesn't also select a tab. */
function useDragScroll() {
  const dragRef = useRef({ startX: 0, startScroll: 0, isDown: false, hasMoved: false })

  const handlePointerDown = (e) => {
    const row = e.currentTarget
    const isScrollable = row.scrollWidth > row.clientWidth
    if (e.pointerType !== 'mouse' || !isScrollable) return
    dragRef.current = { startX: e.clientX, startScroll: e.currentTarget.scrollLeft, isDown: true, hasMoved: false }
  }

  const handlePointerMove = (e) => {
    const drag = dragRef.current
    if (!drag.isDown) return
    const distance = e.clientX - drag.startX
    if (Math.abs(distance) > TAB_DRAG_THRESHOLD) drag.hasMoved = true
    e.currentTarget.scrollLeft = drag.startScroll - distance
  }

  const handlePointerEnd = () => {
    dragRef.current.isDown = false
  }

  const handleClickCapture = (e) => {
    if (!dragRef.current.hasMoved) return
    e.stopPropagation()
    e.preventDefault()
    dragRef.current.hasMoved = false
  }

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerEnd,
    onPointerLeave: handlePointerEnd,
    onClickCapture: handleClickCapture,
  }
}

export function ContactForm() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE)
  const [activeTab, setActiveTab] = useState('commercial')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const tabDragHandlers = useDragScroll()

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const mapFrameRef = useRef(null)
  const mapCanvasRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  /* The map sits behind the content, so the pointer is tracked on the whole section */
  useDotMapCanvas(mapFrameRef, mapCanvasRef, shouldReduceMotion, {
    palette: CONTACT_DOT_PALETTE,
    pointerTargetRef: sectionRef,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleTabSelect = (tabId, tabElement) => {
    setActiveTab(tabId)
    tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    setFormState((prev) => ({ ...prev, fundingType: tabId }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding"
      style={{
        background: 'var(--navy)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top border gradient */}
      <div
        className="contact-top-border"
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(218,162,64,0.3) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient orb bottom center */}
      <motion.div
        aria-hidden="true"
        className="contact-orb contact-orb--bottom"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Left ambient orb */}
      <motion.div
        aria-hidden="true"
        className="contact-orb contact-orb--left"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Background trace lines */}
      <div className="contact-trace-lines" aria-hidden="true">
        <div className="trace-line trace-line-h1" />
        <div className="trace-line trace-line-h2" />
        <div className="trace-line trace-line-v1" />
        <div className="trace-line trace-line-v2" />
        <div className="trace-line trace-line-diagonal" />
      </div>

      <motion.div
        aria-hidden="true"
        className="uk-map-wrap"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={revealTransition(0, 0.2)}
      >
        <div ref={mapFrameRef} className="uk-map-frame">
          <canvas ref={mapCanvasRef} className="uk-map-canvas" />
        </div>
      </motion.div>

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-grid">

          {/* ── Left: Info panel ── */}
          <div className="contact-info-panel">

            <motion.div
              style={{ position: 'relative', zIndex: 1 }}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={revealTransition()}
            >
              <div className="contact-header__accent">
                <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 400 }}>
                  <span style={{ color: '#DAA240', fontWeight: 400 }}>02</span> <span style={{ color: '#DAA240', fontWeight: 400 }}>/</span> <span style={{ color: '#ffffff', fontWeight: 400 }}>Get in Touch</span>
                </span>
              </div>
              <h2 className="heading-1" style={{ color: '#ffffff', marginBottom: 'clamp(14px, 2.4vw, 20px)' }}>
                Ready to discuss{' '}
                <em className="contact-header__emphasis">your funding?</em>
              </h2>
              <p
                className="body-lg"
                style={{ color: 'rgba(255,255,255,0.52)', marginBottom: 'clamp(28px, 4.5vw, 48px)', lineHeight: 1.82 }}
              >
                Tell us about your requirement and we will come back to you promptly
                with clear, practical next steps.
              </p>
            </motion.div>

            <motion.div
              style={{ position: 'relative', zIndex: 1 }}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={revealTransition(0, 0.18)}
            >
              <div className="contact-details-list">
                <ContactDetail
                  icon={
                    <CircleUserRound color="#DAA240" strokeWidth={1.3} aria-hidden="true" />
                  }
                  label="Your Contact"
                  value="Kibria Choudhury"
                />
                <ContactDetail
                  icon={
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="#DAA240" strokeWidth="1.3" />
                      <path d="M2 5l7 5 7-5" stroke="#DAA240" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  }
                  label="Email"
                  value="kibria@foundationfinance.co.uk"
                />
                <ContactDetail
                  icon={
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M3 3h3.5l1.5 4L6.5 8.5S8 11.5 9.5 13l1.5-1.5 4 1.5V16a1 1 0 01-1 1C6.7 17 1 11.3 1 4a1 1 0 011-1z" stroke="#DAA240" strokeWidth="1.3" strokeLinejoin="round" />
                    </svg>
                  }
                  label="Telephone"
                  value="07835 905219"
                />
              </div>

              {/* FCA badge */}
              <motion.div className="fca-badge">
                <div className="fca-badge-header">
                  <span>FCA Authorised and Regulated</span>
                </div>
                <p className="fca-badge-body">
                  Foundation Finance is a trading name of EFF Finance Limited.
                  Registered in England. FRN: 667200. Authorised and regulated by the Financial Conduct Authority.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={revealTransition(0, 0.22)}
          >
            <div className="contact-form-card">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="contact-success"
                  >
                    <motion.div
                      className="contact-success__icon"
                      animate={{
                        scale: [1, 1.08, 1],
                        boxShadow: ['0 0 0 0 rgba(218,162,64,0)', '0 0 0 18px rgba(218,162,64,0.07)', '0 0 0 0 rgba(218,162,64,0)'],
                      }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      aria-hidden="true"
                    >
                      <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                        <path d="M6 14l6 6 10-10" stroke="#DAA240" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                    <h3 className="contact-success__title">Enquiry Received</h3>
                    <p className="contact-success__text">
                      Thank you for getting in touch. We will review your requirement and
                      come back to you within one business day.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    id="funding-enquiry-form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Form header */}
                    <div className="cf-form-header">
                      <p className="eyebrow cf-overline">
                        <span className="gold-number">02</span>{' '}
                        <span className="gold-slash">/</span>{' '}
                        <span className="eyebrow-text-light">Funding Enquiry</span>
                      </p>
                      <h3 className="cf-form-title">What do you need funding for?</h3>
                    </div>

                    {/* Funding type tabs */}
                    <div className="cf-tabs-slider">
                      <div className="cf-tabs-container" {...tabDragHandlers}>
                        {FUNDING_TABS.map((tab) => (
                          <motion.button
                            key={tab.id}
                            type="button"
                            id={`tab-${tab.id}`}
                            onClick={(e) => handleTabSelect(tab.id, e.currentTarget)}
                            className={`cf-tab ${activeTab === tab.id ? 'cf-tab-active' : ''}`}
                            whileHover={activeTab !== tab.id ? { y: -2 } : {}}
                            whileTap={{ scale: 0.96 }}
                          >
                            <span className="cf-tab-label">{tab.label}</span>
                            {activeTab === tab.id && (
                              <motion.div
                                className="cf-tab-indicator"
                                layoutId="tab-indicator"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="cf-fields">
                      <div className="cf-row-2">
                        <FormField id="contact-name"    label="Full Name"           type="text"  name="name"    value={formState.name}    onChange={handleChange} required placeholder="Your full name" />
                        <FormField id="contact-company" label="Company or Business" type="text"  name="company" value={formState.company} onChange={handleChange} placeholder="Trading name" />
                      </div>
                      <div className="cf-row-2">
                        <FormField id="contact-email"   label="Email Address"       type="email" name="email"   value={formState.email}   onChange={handleChange} required placeholder="your@email.co.uk" />
                        <FormField id="contact-phone"   label="Phone Number"        type="tel"   name="phone"   value={formState.phone}   onChange={handleChange} placeholder="07xxx xxxxxx" />
                      </div>
                      <div className="cf-row-1">
                        <FormField id="contact-amount"  label="Funding Amount"      type="text"  name="amount"  value={formState.amount}  onChange={handleChange} placeholder="e.g. £250,000" />
                      </div>
                      <div className="cf-row-1">
                        <TextareaField
                          id="contact-message" label="Tell Us About Your Requirement"
                          name="message" value={formState.message} onChange={handleChange}
                          rows={4} placeholder="Brief description of what you are looking to fund..."
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      id="contact-submit"
                      className="btn-gold cf-submit-btn"
                      whileHover={{ y: -3, boxShadow: '0 12px 44px rgba(218,162,64,0.48)' }}
                      whileTap={{ y: 0, scale: 0.99 }}
                    >
                      Send Funding Enquiry
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.button>

                    <p className="cf-privacy">
                      By submitting this form you consent to being contacted regarding your enquiry.
                      We do not share your details with third parties without consent.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        #contact {
          padding-top: 70px !important;
          padding-bottom: 70px !important;
        }

        /* ── Grid ────────────────────────────────────────────────────── */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: flex-start;
        }

        .contact-header__accent {
          display: inline-flex;
          align-items: center;
          gap: clamp(8px, 1.5vw, 10px);
          margin-bottom: clamp(16px, 2.6vw, 24px);
        }

        .contact-header__line {
          display: block;
          width: clamp(20px, 4vw, 28px);
          height: 1.5px;
          background: #DAA240;
        }

        .contact-header__emphasis {
          color: #ffffff;
        }

        /* ── Background Trace Lines ─────────────────────────────────── */
        .contact-trace-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .trace-line {
          position: absolute;
          background: rgba(218, 162, 64, 0.025);
        }

        .trace-line-h1 { top: 18%; left: 0; right: 0; height: 1px; }
        .trace-line-h2 { top: 72%; left: 0; right: 0; height: 1px; }
        .trace-line-v1 { left: 15%; top: 0; bottom: 0; width: 1px; }
        .trace-line-v2 { left: 82%; top: 0; bottom: 0; width: 1px; }
        .trace-line-diagonal {
          top: 50%;
          left: 50%;
          width: 120%;
          height: 1px;
          transform: translate(-50%, -50%) rotate(-32deg);
        }

        /* ── Info panel ─────────────────────────────────────────────── */
        .contact-info-panel {
          padding-top: 8px;
          position: relative;
        }

        /* ── UK dot map ──────────────────────────────────────────────────
           Positioned against the section itself so it can be sized as a
           percentage of the section's height. Dots are faint so the info
           panel stays legible; they light up gold around the pointer. */
        .uk-map-wrap {
          position: absolute;
          top: 50%;
          left: -15%;
          transform: translateY(-50%);
          width: 80%;
          height: 80%;
          z-index: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }

        .uk-map-frame {
          position: relative;
          height: 100%;
          max-width: 100%;
          aspect-ratio: ${UK_DOT_FRAME_WIDTH} / ${UK_DOT_FRAME_HEIGHT};
        }

        .uk-map-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }


        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.4vw, 20px);
          margin-bottom: clamp(28px, 4.5vw, 44px);
        }

        .contact-detail-row {
          display: flex;
          align-items: center;
          gap: clamp(12px, 2vw, 16px);
          cursor: default;
        }

        /* Bare gold line icon — no box */
        .contact-detail-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-detail-icon svg {
          width: 22px;
          height: 22px;
        }

        .contact-detail-label {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.36);
          font-size: clamp(8.5px, 1.3vw, 9.5px);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .contact-detail-value {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: #ffffff;
          font-size: clamp(14px, 1.9vw, 15px);
          font-weight: 500;
        }
        .contact-detail-link {
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .contact-detail-link:hover {
          color: #DAA240;
        }

        /* FCA badge */
        .fca-badge {
          padding: clamp(14px, 2.4vw, 18px) clamp(16px, 2.8vw, 22px);
          border: none;
          background: rgba(10, 31, 82, 0.4);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.03);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .fca-badge:hover {
          background: rgba(10, 31, 82, 0.5);
          box-shadow: 0 16px 36px rgba(218, 162, 64, 0.05), 0 12px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.05);
        }
        .fca-badge-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: #DAA240;
          font-size: clamp(9px, 1.4vw, 10px);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .fca-badge-body {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.4);
          font-size: clamp(10.5px, 1.5vw, 11.5px);
          line-height: 1.65;
        }

        /* ── Form card ──────────────────────────────────────────────── */
        .contact-form-card {
          background: #ffffff;
          border: none;
          padding: clamp(24px, 4vw, 44px) clamp(22px, 4vw, 44px) clamp(22px, 3.6vw, 40px);
          box-shadow:
            0 35px 90px rgba(1, 8, 23, 0.45),
            0 0 60px rgba(218, 162, 64, 0.08);
          position: relative;
          overflow: hidden;
        }

        /* Form header */
        .cf-form-header {
          margin-bottom: clamp(18px, 3vw, 28px);
        }
        .cf-overline {
          margin-bottom: 10px;
        }
        .cf-form-title {
          font-family: var(--next-font-playfair), Georgia, serif;
          color: #021435;
          font-weight: 400;
          font-size: clamp(18px, 2.8vw, 22px);
          line-height: 1.3;
        }

        /* Tabs */
        .cf-tabs-container {
          display: flex;
          gap: clamp(4px, 0.8vw, 6px);
          flex-wrap: wrap;
          margin-bottom: clamp(20px, 3vw, 30px);
          padding: clamp(4px, 0.6vw, 5px);
          border: none;
        }
        .cf-tab {
          position: relative;
          flex: 1 1 auto;
          min-width: clamp(44px, 8vw, 60px);
          padding: clamp(8px, 1.4vw, 10px) clamp(4px, 0.8vw, 6px);
          border: none;
          background: transparent;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(10px, 1.5vw, 11.5px);
          font-weight: 600;
          letter-spacing: 0.03em;
          color: rgba(2, 20, 53, 0.5);
          cursor: pointer;
          transition: color 0.25s ease;
          overflow: hidden;
          text-align: center;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cf-tab:hover {
          color: rgba(2, 20, 53, 0.85);
        }
        .cf-tab-active {
          color: #ffffff;
        }
        .cf-tab-label {
          position: relative;
          z-index: 1;
        }
        .cf-tab-indicator {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #DAA240 0%, #C89020 100%);
          z-index: 0;
        }

        /* Fields */
        .cf-fields {
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.4vw, 18px);
          margin-bottom: clamp(20px, 3vw, 28px);
        }
        .cf-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(14px, 2.4vw, 18px);
        }

        /* Field styling */
        .ff-field-wrap {
          position: relative;
        }
        .ff-field-label {
          display: block;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(2, 20, 53, 0.75);
          font-size: clamp(9px, 1.4vw, 10px);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 8px;
          transition: color 0.25s ease;
        }
        .ff-field-wrap[data-focused] .ff-field-label {
          color: #C89020;
        }
        .ff-required {
          color: #C89020;
          margin-left: 3px;
        }

        .ff-input-shell {
          position: relative;
        }
        .ff-field-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(2, 20, 53, 0.04);
          border: none;
          padding: clamp(12px, 1.8vw, 13px) clamp(14px, 2vw, 16px);
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(14px, 1.8vw, 14px);
          font-weight: 400;
          color: #021435;
          outline: none;
          min-height: 44px;
          box-shadow: inset 0 1px 3px rgba(2, 20, 53, 0.08);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .ff-field-input::placeholder {
          color: rgba(2, 20, 53, 0.32);
        }
        .ff-field-input:focus {
          background: rgba(2, 20, 53, 0.07);
          box-shadow:
            0 0 16px rgba(218, 162, 64, 0.18),
            inset 0 1px 3px rgba(2, 20, 53, 0.1);
        }
        .ff-field-textarea {
          display: block;
          line-height: 1.65;
          min-height: 96px;
        }

        /* Submit button */
        .cf-submit-btn {
          width: 100%;
          justify-content: center;
          padding: clamp(14px, 2.2vw, 16px) clamp(20px, 3vw, 24px);
          font-size: clamp(11.5px, 1.7vw, 12.5px);
          letter-spacing: 0.08em;
          border: none;
          min-height: 48px;
        }

        /* Privacy note */
        .cf-privacy {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(2, 20, 53, 0.4);
          font-size: clamp(10px, 1.4vw, 11px);
          text-align: center;
          margin-top: clamp(12px, 2vw, 16px);
          line-height: 1.6;
        }

        /* ── Success state ──────────────────────────────────────────── */
        .contact-success {
          text-align: center;
          padding: clamp(40px, 8vw, 64px) clamp(16px, 4vw, 24px);
        }
        .contact-success__icon {
          width: clamp(56px, 10vw, 80px);
          height: clamp(56px, 10vw, 80px);
          border: 2px solid #DAA240;
          background: rgba(218, 162, 64, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto clamp(20px, 4vw, 32px);
        }
        .contact-success__icon svg {
          width: clamp(22px, 4vw, 32px);
          height: clamp(22px, 4vw, 32px);
        }
        .contact-success__title {
          font-family: var(--next-font-playfair), Georgia, serif;
          color: #021435;
          font-weight: 400;
          font-size: clamp(20px, 3.2vw, 24px);
          margin-bottom: 14px;
        }
        .contact-success__text {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(2, 20, 53, 0.6);
          line-height: 1.75;
          max-width: 340px;
          margin: 0 auto;
          font-size: clamp(13px, 1.8vw, 14px);
        }

        /* ── Ambient orbs ──────────────────────────────────────────── */
        .contact-orb {
          position: absolute;
          pointer-events: none;
        }
        .contact-orb--bottom {
          bottom: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(400px, 60vw, 900px);
          height: clamp(240px, 36vw, 500px);
          background: radial-gradient(ellipse, rgba(218, 162, 64, 0.07) 0%, transparent 68%);
          filter: blur(50px);
        }
        .contact-orb--left {
          top: 20%;
          left: -120px;
          width: clamp(240px, 36vw, 400px);
          height: clamp(240px, 36vw, 400px);
          background: radial-gradient(circle, rgba(218, 162, 64, 0.04) 0%, transparent 70%);
          filter: blur(60px);
        }

        /* ── Breakpoints ────────────────────────────────────────────── */

        /* Stack the two columns on tablet & below */
        @media (max-width: 1100px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: clamp(36px, 5vw, 52px);
          }
        }

        /* Single-column fields on small phones */
        @media (max-width: 600px) {
          .cf-row-2 {
            grid-template-columns: 1fr;
          }

          .uk-map-wrap {
            display: none;
          }

          /* Let grid columns shrink below the swipeable tab row's
             width, otherwise the whole grid overflows the screen */
          .contact-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .contact-grid > * {
            min-width: 0;
          }

          /* Info panel: everything centred */
          .contact-info-panel {
            text-align: center;
          }

          .contact-details-list {
            align-items: center;
          }

          .contact-detail-row {
            flex-direction: column;
            gap: 8px;
          }

          .fca-badge-header {
            justify-content: center;
          }

          /* Form header centred above the slider */
          .cf-form-header {
            text-align: center;
          }

          /* Tabs: a single swipeable row that bleeds to the card edges */
          .cf-tabs-container {
            flex-wrap: nowrap;
            gap: 8px;
            margin-inline: -18px;
            padding: 0 18px;
            overflow-x: auto;
            scroll-snap-type: x proximity;
            scroll-padding-inline: 18px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .cf-tabs-container::-webkit-scrollbar {
            display: none;
          }

          .cf-tabs-container:active {
            cursor: grabbing;
          }

          /* Fade on the right edge hints that the row scrolls */
          .cf-tabs-slider {
            position: relative;
            margin-bottom: clamp(20px, 3vw, 30px);
          }

          .cf-tabs-slider::after {
            content: '';
            position: absolute;
            top: 0;
            right: -18px;
            bottom: 0;
            width: 40px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0), #ffffff);
            pointer-events: none;
          }

          .cf-tabs-slider .cf-tabs-container {
            margin-bottom: 0;
          }

          .cf-tab {
            flex: 0 0 auto;
            min-width: 0;
            padding: 12px 18px;
            user-select: none;
            min-height: 44px;
            background: rgba(2, 20, 53, 0.035);
            scroll-snap-align: start;
          }

          .cf-tab-active {
            background: transparent;
          }

          .cf-tab-label {
            font-size: 11px;
            letter-spacing: 0.03em;
            white-space: nowrap;
          }

          .contact-form-card {
            padding: 24px 18px 20px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .contact-orb { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
