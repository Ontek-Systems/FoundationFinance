'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

import { revealTransition } from '@/lib/motion'

// Ordered to match the section order on the homepage
const NAV_LINKS = [
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Solutions',    href: '#solutions' },
  { label: 'About',        href: '#about' },
  { label: 'Process',      href: '#how-it-works' },
  { label: 'Introducers',  href: '#introducers' },
  { label: 'FAQ',          href: '#faq' },
]

const CTA_LABEL = 'Get in Touch'


/* Eased scroll, noticeably smoother/slower than the browser's native
   "smooth" behavior, which feels abrupt over long distances. */
function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [mounted, setMounted]     = useState(false)

  useEffect(() => { setMounted(true) }, [])

  /* Lock body scroll while the full-screen drawer is open */
  useEffect(() => {
    if (menuOpen) {
      const { overflow } = document.body.style
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = overflow }
    }
  }, [menuOpen])

  const scrollTo = useCallback((e, href) => {
    e.preventDefault()
    e.currentTarget.blur()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (!target) return
    const targetY = target.getBoundingClientRect().top + window.scrollY
    smoothScrollTo(targetY)
  }, [])

  return (
    <>
    <motion.header
      id="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={revealTransition()}
      style={{
        position: 'sticky',
        // Sits directly beneath the sticky 35px ContactBar
        top: 35,
        zIndex: 200,
        background: 'rgba(1, 14, 43, 0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(218,162,64,0.05)',
        paddingTop: 'clamp(16px, 4vw, 26px)',
        paddingBottom: 'clamp(8px, 2vw, 14px)',
      }}
    >
      <div
        className="section-container pb-[20px]"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingBottom: '12px'}}
      >
        {/* Logo */}
        <Link
          href="#hero"
          onClick={(e) => scrollTo(e, '#hero')}
          id="navbar-logo"
          aria-label="Foundation Finance home"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'relative',
              height: 'clamp(34.5px, 6.9vw, 46px)',
              width: 'clamp(115px, 27.6vw, 161px)',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Image
              src="/assets/images/logo.png"
              alt="Foundation Finance Logo"
              width={138}
              height={92}
              style={{ objectFit: 'contain' }}
              priority
            />
          </motion.div>
        </Link>

        {/* Right cluster: nav links + divider + CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3vw, 40px)', flexShrink: 0 }}>
          <nav
            aria-label="Main navigation"
            className="navbar-desktop"
            style={{
              display: 'flex', alignItems: 'center',
              gap: 'clamp(20px, 3vw, 40px)',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Divider between nav links and CTA */}
          <span
            aria-hidden="true"
            className="navbar-desktop"
            style={{
              display: 'block',
              width: '1px',
              height: '18px',
              background: 'rgba(255,255,255,0.25)',
            }}
          />

          <a
            href="#contact"
            id="navbar-cta"
            className="navbar-desktop nav-link nav-cta"
            onClick={(e) => scrollTo(e, '#contact')}
          >
            {CTA_LABEL}
          </a>

          {/* Hamburger */}
          <button
            id="navbar-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="navbar-mobile-menu"
            className="navbar-mobile"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px',
              display: 'flex', flexDirection: 'column', gap: '5px',
              minWidth: 44, minHeight: 44,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{
                  display: 'block', width: 'clamp(20px, 5vw, 24px)', height: '2px',
                  background: '#DAA240', transformOrigin: 'center',
                }}
                animate={{
                  rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                  y:      menuOpen ? (i === 0 ? 7  : i === 2 ? -7  : 0) : 0,
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </button>
        </div>
      </div>

      <style>{`
        /* Desktop bar is visible from 1080px; below that, hamburger + drawer take over.
           CTA stays visible as a compact pill right up to the break point so the
           primary action is reachable on landscape phones and small tablets too. */
        @media (max-width: 1079px) {
          .navbar-desktop { display: none !important; }
        }
        @media (min-width: 1080px) {
          .navbar-mobile  { display: none !important; }
        }

        .nav-link {
          position: relative;
          padding: 6px 0;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: clamp(10px, 1.2vw, 11.5px);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          color: #ffffff;
          text-decoration: none;
        }
        /* Gold underline grows out from the centre on hover */
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #C38E32, #F0C66B, #C38E32);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link:hover::after,
        .nav-link:focus-visible::after {
          transform: scaleX(1);
        }
        .nav-link:focus-visible {
          outline: 2px solid #DAA240;
          outline-offset: 4px;
          border-radius: 2px;
        }

        /* Same look as the other links, but the underline is always shown */
        .nav-cta { font-weight: 700; }
        .nav-cta::after {
          transform: scaleX(1);
          animation: nav-cta-pulse 3s ease-in-out infinite;
        }
        .nav-cta:hover::after { animation-play-state: paused; }
        /* Slow breathing pulse to draw the eye to the main action */
        @keyframes nav-cta-pulse {
          0%, 100% { transform: scaleX(1); }
          50%      { transform: scaleX(1.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar-mobile, .navbar-desktop,
          .nav-link::after { transition: none !important; }
          .nav-cta::after { animation: none; }
        }
      `}</style>
    </motion.header>

    {/* Portalled to <body> so the drawer's fixed positioning isn't
        contained by the header's animated `transform`, which would
        otherwise confine it to the header's own box instead of the
        full viewport and let the hero section show above it. */}
    {mounted && createPortal(
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="navbar-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 199,
              overflowY: 'auto',
              background: 'linear-gradient(160deg, rgba(1,14,43,0.985) 0%, rgba(2,20,53,0.985) 60%, rgba(10,31,82,0.985) 100%)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              willChange: 'opacity',
            }}
          >
            {/* Header bar inside the drawer keeps logo accessible */}
            <div
              className="section-container"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'clamp(16px, 4vw, 26px) clamp(20px, 5vw, 40px)',
                borderBottom: '1px solid rgba(218,162,64,0.12)',
              }}
            >
              <Link
                href="#hero"
                onClick={(e) => scrollTo(e, '#hero')}
                aria-label="Foundation Finance home"
                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <Image src="/assets/images/logo.png" alt="" width={100} height={60} style={{ objectFit: 'contain' }} priority />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'rgba(218,162,64,0.08)', border: '1px solid rgba(218,162,64,0.2)',
                  width: 44, height: 44,
                  color: '#DAA240', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="section-container"
              style={{ padding: 'clamp(20px, 6vw, 40px) clamp(20px, 5vw, 40px) clamp(32px, 8vw, 60px)' }}
            >
              <p className="eyebrow" style={{ marginBottom: 'clamp(16px, 4vw, 24px)', fontSize: '11px' }}>
                Navigate
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      opacity: 1,
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => scrollTo(e, link.href)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        fontFamily: 'var(--next-font-playfair), Georgia, serif',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: 'clamp(20px, 5.5vw, 28px)',
                        fontWeight: 600,
                        padding: 'clamp(16px, 3vw, 20px) 0',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      <span>{link.label}</span>
                      <svg
                        width="clamp(20px, 4vw, 26px)" height="clamp(20px, 4vw, 26px)"
                        viewBox="0 0 16 16" fill="none" aria-hidden="true"
                        style={{ color: '#DAA240', opacity: 0.7 }}
                      >
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* CTA card pinned near the bottom of the drawer's content stack */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: 'clamp(28px, 6vw, 44px)' }}
              >
                <a
                  href="#contact"
                  onClick={(e) => scrollTo(e, '#contact')}
                  className="btn-gold"
                  style={{
                    width: '100%', justifyContent: 'center', textAlign: 'center',
                    padding: 'clamp(14px, 3vw, 18px) 24px',
                    fontSize: 'clamp(12px, 2.6vw, 14px)',
                    letterSpacing: '0.14em',
                  }}
                >
                  {CTA_LABEL}
                </a>
                <p
                  style={{
                    fontFamily: 'var(--next-font-roboto), system-ui, sans-serif',
                    fontSize: 'clamp(12px, 2.6vw, 13px)',
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'center',
                    marginTop: 'clamp(14px, 3vw, 20px)',
                  }}
                >
                  Authorised &amp; regulated by the FCA
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}
