import Link from 'next/link'
import Image from 'next/image'

const COMPANY_LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Introducers',  href: '#introducers' },
  { label: 'FAQ',          href: '#faq' },
]

const SOLUTION_LINKS = [
  'Commercial Finance',
  'Property Finance',
  'Development Finance',
  'Vehicle Finance',
  'Asset Finance',
  'Refinance & Restructure',
]

const LEGAL_LABELS = ['Privacy', 'Terms', 'Cookies', 'Important Information']

const ARROW_ICON = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="site-footer">
      <div className="section-container">
        {/* CTA band */}
        <div className="ff-cta">
          <div>
            <span className="eyebrow ff-eyebrow">
              <span className="gold-number">08</span> <span className="gold-slash">/</span>{' '}
              <span className="eyebrow-text-dark">Ready When You Are</span>
            </span>
            <p className="ff-cta__heading">
              Let&rsquo;s get your next move <em className="ff-cta__funded">funded.</em>
            </p>
          </div>
          <Link href="#contact" className="btn-gold ff-cta__button">
            Start a Conversation
            {ARROW_ICON}
          </Link>
        </div>

        {/* Columns */}
        <div className="ff-grid">
          <div className="ff-brand">
            <div className="ff-logo">
              <Image
                src="/assets/images/logo.png"
                alt="Foundation Finance"
                width={173}
                height={62}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="ff-tagline">
              Tailored commercial finance introductions for business owners, property professionals and developers across the UK.
            </p>
            <span className="ff-badge">
              <span className="ff-badge__dot" aria-hidden="true" />
              FCA Authorised &middot; FRN 667200
            </span>
          </div>

          <nav aria-label="Company" className="ff-col">
            <h3 className="ff-col__title">Company</h3>
            <ul>
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="ff-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Solutions" className="ff-col">
            <h3 className="ff-col__title">Solutions</h3>
            <ul>
              {SOLUTION_LINKS.map((label) => (
                <li key={label}>
                  <Link href="#solutions" className="ff-link">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ff-col">
            <h3 className="ff-col__title">Get in touch</h3>
            <ul>
              <li>
                <span className="ff-label">Call</span>
                <span className="ff-link ff-link--strong">07835 905219</span>
              </li>
              <li>
                <span className="ff-label">Email</span>
                <span className="ff-link ff-link--strong">
                  kibria@foundationfinance.co.uk
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ff-bottom">
          <p>
            &copy; {year} EFF Finance Limited, trading as Foundation Finance. Registered in England and Wales.
            Authorised and regulated by the Financial Conduct Authority.
          </p>
          <div className="ff-legal">
            {LEGAL_LABELS.map((label) => (
              <span key={label} className="ff-link ff-link--small">{label}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse 60% 50% at 85% 0%, rgba(218, 162, 64, 0.08), transparent 70%),
            #010E2B;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.6);
        }
        .site-footer::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(218, 162, 64, 0.5), transparent);
        }
        .site-footer ul { list-style: none; margin: 0; padding: 0; }

        .ff-eyebrow {
          display: block;
          margin-bottom: clamp(14px, 2vw, 20px);
        }

        /* ── CTA band ──────────────────────────────────────────────── */
        .ff-cta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          padding: clamp(48px, 7vw, 80px) 0 clamp(40px, 6vw, 64px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .ff-cta__heading {
          font-family: var(--next-font-playfair), Georgia, serif;
          font-size: clamp(28px, 4.4vw, 48px);
          line-height: 1.15;
          color: #ffffff;
        }
        /* "funded." — gold shimmer with an underline that draws itself in */
        .ff-cta__funded {
          position: relative;
          display: inline-block;
          background: linear-gradient(90deg, #C89020 0%, #F5C842 40%, #DAA240 60%, #C89020 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 2.5s linear infinite;
        }
        .ff-cta__funded::after {
          content: '';
          position: absolute;
          left: 0; right: 0.3em; bottom: 0.02em;
          height: 2px;
          background: linear-gradient(90deg, #DAA240, #F5C842);
          transform-origin: left;
          animation: ff-underline 3s var(--ease-smooth) infinite;
        }
        @keyframes ff-underline {
          0%        { transform: scaleX(0); transform-origin: left; }
          30%, 70%  { transform: scaleX(1); transform-origin: left; }
          70.01%    { transform-origin: right; }
          100%      { transform: scaleX(0); transform-origin: right; }
        }

        .ff-cta__button {
          flex-shrink: 0;
          font-size: 12px;
          padding: 16px 40px;
        }

        @media (prefers-reduced-motion: reduce) {
          .ff-cta__funded,
          .ff-cta__funded::after { animation: none; }
        }

        /* ── Columns ───────────────────────────────────────────────── */
        .ff-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 40px 24px;
          padding: clamp(40px, 6vw, 64px) 0;
        }
        .ff-brand { grid-column: 1 / -1; }
        .ff-logo { display: inline-block; margin-bottom: 18px; }
        .ff-tagline {
          font-size: 14px;
          line-height: 1.7;
          max-width: 340px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 22px;
        }
        .ff-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border: 1px solid rgba(218, 162, 64, 0.3);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
        }
        .ff-badge__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #DAA240;
          box-shadow: 0 0 10px rgba(218, 162, 64, 0.8);
        }

        .ff-col__title {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #DAA240;
          margin-bottom: 20px;
        }
        .ff-col li + li { margin-top: 12px; }
        .ff-col:last-child { grid-column: 1 / -1; }
        .ff-col:last-child li + li { margin-top: 18px; }

        .ff-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 4px;
        }

        .ff-link {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.2s ease;
          overflow-wrap: anywhere;
        }
        .ff-link:hover,
        .ff-link:focus-visible { color: #DAA240; }
        .ff-link--strong {
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
        }
        .ff-link--small {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
        }

        /* ── Bottom bar ────────────────────────────────────────────── */
        .ff-bottom {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 24px 0 clamp(28px, 4vw, 36px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.35);
        }
        .ff-legal {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 22px;
        }

        /* ── Breakpoints ───────────────────────────────────────────── */
        /* Phones: everything centred */
        @media (max-width: 600px) {
          .site-footer .section-container { text-align: center; }
          .ff-cta { align-items: center; }
          .ff-tagline { margin-inline: auto; }
          .ff-legal { justify-content: center; }
        }

        @media (min-width: 768px) {
          .ff-cta {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
          }
          .ff-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .ff-col:last-child { grid-column: auto; }
        }
        @media (min-width: 1100px) {
          .ff-grid {
            grid-template-columns: 1.6fr 1fr 1.1fr 1.3fr;
            gap: 48px;
          }
          .ff-brand { grid-column: auto; }
          .ff-bottom {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
          }
          .ff-bottom p { max-width: 640px; }
          .ff-legal { flex-shrink: 0; }
        }
      `}</style>
    </footer>
  )
}
