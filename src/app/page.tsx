import HeroSection from '@/components/landing-page-sections/hero-section/hero-section'
import UsageSection from '@/components/landing-page-sections/usage-section'
import { Footer } from '@/components/landing-page-sections/footer'

const HomePage = () => {
  return (
    // <div className='flex flex-col min-h-screen items-center justify-center'>
    <div className='flex flex-col w-full'>
      <HeroSection />
      <UsageSection />
      <Footer />
    </div>
  )
}

export default HomePage