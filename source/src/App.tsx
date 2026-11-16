import { Nav, ScrollHero } from './components/Hero'
import { ScrollProgress } from './components/ui'
import { Industries, WhatsAppSection } from './components/WhatsApp'
import { AutomotiveSection } from './components/Automotive'
import { TryIt } from './components/TryIt'
import { Contact, FAQ, Process } from './components/Rest'

export default function App() {
  return (
    <>
      <Nav />
      <ScrollProgress />
      <main>
        <ScrollHero />
        <Industries />
        <AutomotiveSection />
        <WhatsAppSection />
        <TryIt />
        <Process />
        <FAQ />
        <Contact />
      </main>
    </>
  )
}
