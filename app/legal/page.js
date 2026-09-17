import Link from 'next/link'

import { Footer } from '../components/shared/Footer'

export const metadata = {
  title: 'Important Information | Foundation Finance',
  description: 'Regulatory information, privacy, terms of business and cookie policy for Foundation Finance.',
}

export default function LegalPage() {
  return (
    <>
      <main id="main-content" className="section-container legal-page">
        <Link href="/" className="legal-back">&larr; Back to home</Link>

        <h1>Important Information</h1>

        <section>
          <h2>Regulatory status</h2>
          <p>
            Foundation Finance is a trading name of EFF Finance Limited. Registered in England and Wales.
            Authorised and regulated by the Financial Conduct Authority. FRN: 667200.
          </p>
          <p>
            Foundation Finance acts as a credit broker and not a lender. We introduce clients to a panel of
            specialist lenders and finance providers. We may receive a commission or fee for introducing
            clients to lenders. The lender will always be disclosed to you before any agreement is entered into.
          </p>
          <p className="legal-warning">
            Your property may be repossessed if you do not keep up repayments on a mortgage or loan secured
            against it. Think carefully before securing debts against your home.
          </p>
        </section>

        <section id="privacy">
          <h2>Privacy Policy</h2>
          <p>Our full privacy policy will be published here.</p>
        </section>

        <section id="terms">
          <h2>Terms of Business</h2>
          <p>Our terms of business will be published here.</p>
        </section>

        <section id="cookies">
          <h2>Cookie Policy</h2>
          <p>Our cookie policy will be published here.</p>
        </section>
      </main>
      <Footer />

      <style>{`
        .legal-page {
          width: 100%;
          max-width: 780px;
          padding-top: clamp(40px, 8vw, 80px);
          padding-bottom: clamp(48px, 8vw, 96px);
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          font-size: 15px;
        }
        .legal-back {
          font-size: 13px;
          color: #DAA240;
          text-decoration: none;
        }
        .legal-back:hover, .legal-back:focus-visible { text-decoration: underline; }
        .legal-page h1 {
          font-family: var(--next-font-playfair), serif;
          font-size: clamp(30px, 5vw, 42px);
          color: #fff;
          margin: 20px 0 32px;
        }
        .legal-page section {
          padding-top: 28px;
          margin-top: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          scroll-margin-top: 24px;
        }
        .legal-page h2 {
          font-family: var(--next-font-playfair), serif;
          font-size: 22px;
          color: #fff;
          margin-bottom: 12px;
        }
        .legal-page p + p { margin-top: 12px; }
        .legal-warning {
          padding: 14px 16px;
          border-left: 2px solid #DAA240;
          background: rgba(218, 162, 64, 0.06);
          color: rgba(255, 255, 255, 0.85);
        }
      `}</style>
    </>
  )
}
