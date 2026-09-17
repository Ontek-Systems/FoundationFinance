import { Navbar } from './components/shared/Navbar'
import { ContactBar } from './components/shared/ContactBar'
import { Footer } from './components/shared/Footer'
import { Hero } from './components/sections/Hero'
import { StatsBar } from './components/sections/StatsBar'
import { About } from './components/sections/About'
import { Solutions } from './components/sections/Solutions'
import { HowItWorks } from './components/sections/HowItWorks'
import { CaseStudies } from './components/sections/CaseStudies'
import { ContactForm } from './components/sections/ContactForm'
import { Introducers } from './components/sections/Introducers'
import { FAQ } from './components/sections/FAQ'

export default function Home() {
  return (
    <>
      <ContactBar />
      <Navbar />
      <main id="main-content">
        <Hero />
        <StatsBar />
 	      <ContactForm />
        <Solutions />
        <CaseStudies />
        <About />
        <HowItWorks />
        <Introducers />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
