import { Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import { IntroScreen } from "./components/shared/IntroScreen";
import { INTRO_STORAGE_KEY, INTRO_REVEAL_AT_MS } from "@/lib/motion";

const roboto = Roboto({
  variable: "--next-font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--next-font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "Foundation Finance",
  description:
    "Foundation Finance provides tailored commercial finance introductions for business owners, property professionals, developers and investors across the UK. Authorised and regulated by the FCA.",
  keywords:
    "commercial finance, property finance, development finance, business loans, asset finance, vehicle finance, bridging loans, UK finance broker",
  openGraph: {
    title: "Foundation Finance — Funding Property. Business. Growth.",
    description:
      "Tailored finance introductions for business owners, property professionals and developers. Seven core funding routes. One clear point of contact.",
    type: "website",
    locale: "en_GB",
  },
};

/* Runs before first paint: shows the intro once per browser session (never for
   reduced-motion users) and tells lib/motion.js when the site becomes visible. */
const INTRO_SCRIPT = `try {
  var root = document.documentElement;
  if (sessionStorage.getItem("${INTRO_STORAGE_KEY}") || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.dataset.introSeen = "";
  } else {
    sessionStorage.setItem("${INTRO_STORAGE_KEY}", "1");
    window.__ffIntroEndsAt = performance.now() + ${INTRO_REVEAL_AT_MS};
  }
} catch (error) {
  document.documentElement.dataset.introSeen = "";
}`;

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      lang="en-GB"
      className={`${roboto.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#021435] text-white">
        <IntroScreen />
        {children}
      </body>
    </html>
  );
}

