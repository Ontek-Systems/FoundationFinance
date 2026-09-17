'use client'

import { motion } from 'framer-motion'

import { revealTransition } from '@/lib/motion'

const PHONE_DISPLAY = '07835 905219'
const EMAIL = 'kibria@foundationfinance.co.uk'
const LOCATION = 'Based in Leicester, UK'

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z',
  },
  {
    label: 'Facebook',
    path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z',
  },
  {
    label: 'LinkedIn',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
  {
    label: 'WhatsApp',
    path: 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.78h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.81 11.81 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z',
  },
]

export function ContactBar() {
  return (
    <motion.div
      className="cbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={revealTransition()}
    >
      <div className="section-container cbar-inner">
        <div className="cbar-group">
          <ul className="cbar-socials">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <span className="cbar-social" role="img" aria-label={social.label}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </span>
              </li>
            ))}
          </ul>

          <span className="cbar-divider cbar-hide-mobile" aria-hidden="true" />

          <span className="cbar-link">
            <span className="cbar-label">Call</span>
            <span>{PHONE_DISPLAY}</span>
          </span>

          <span className="cbar-divider" aria-hidden="true" />

          <span className="cbar-link cbar-email">
            {EMAIL}
          </span>
        </div>

        <div className="cbar-group cbar-hide-mobile">
          <span className="cbar-divider" aria-hidden="true" />
          <span className="cbar-location">{LOCATION}</span>
        </div>
      </div>

      <style>{`
        .cbar {
          position: sticky;
          top: 0;
          z-index: 300;
          height: 35px;
          display: flex;
          align-items: center;
          background: linear-gradient(90deg, #C38E32 0%, #D4A444 50%, #C38E32 100%);
          box-shadow: 0 2px 8px rgba(195, 142, 50, 0.2);
          color: #fff;
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: 13px;
          letter-spacing: 0.03em;
        }
        .cbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          width: 100%;
          overflow: hidden;
        }
        .cbar-group {
          display: flex;
          align-items: center;
          gap: 24px;
          white-space: nowrap;
        }
        .cbar-divider {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.45);
        }
        .cbar-socials {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .cbar-social {
          display: flex;
          color: #fff;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .cbar-social svg {
          width: 14px;
          height: 14px;
        }
        .cbar-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .cbar-label,
        .cbar-location {
          font-weight: 700;
        }
        /* Roboto reserves descender space, which makes caps and digits sit
           above centre. Trim the text box to the cap height so it centres
           optically; nudge down 1px where text-box is unsupported. */
        .cbar-link,
        .cbar-location {
          line-height: 1;
          text-box: trim-both cap alphabetic;
        }
        @supports not (text-box: trim-both cap alphabetic) {
          .cbar-link,
          .cbar-location {
            transform: translateY(1px);
          }
        }
        .cbar-social:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }
        .cbar-link:hover {
          opacity: 0.8;
        }
        .cbar-social:focus-visible,
        .cbar-link:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Tablet & below: socials + phone + email only, centred. */
        @media (max-width: 900px) {
          .cbar-hide-mobile {
            display: none !important;
          }
          .cbar-inner {
            justify-content: center;
          }
          .cbar-group {
            gap: 16px;
          }
        }

        /* Phones: drop the email so everything fits on one line. */
        @media (max-width: 520px) {
          .cbar-email,
          .cbar-email + .cbar-divider,
          .cbar-link + .cbar-divider {
            display: none;
          }
          .cbar {
            font-size: 12px;
          }
        }
      `}</style>
    </motion.div>
  )
}
