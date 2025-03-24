import Hero from "./components/Hero"
import WearYourStory from "./components/WearYourStory"
import FeatureCarousel from "./components/FeatureCarousel"
import PortfolioGrid from "./components/PortfolioGrid"
import ContactForm from "./components/ContactForm"
import SectionTransition from "./components/SectionTransition"
import { FloatingActionButton } from "./components"

export default function Home() {
  return (
    <>
      <Hero />
      <SectionTransition>
        <WearYourStory />
      </SectionTransition>
      <SectionTransition>
        <PortfolioGrid />
      </SectionTransition>
      <SectionTransition>
        <FeatureCarousel />
      </SectionTransition>
      <SectionTransition>
        <ContactForm />
      </SectionTransition>
      <FloatingActionButton />
    </>
  )
}

