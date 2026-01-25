import HeroSection from '@/components/landing-page-sections/hero-section/hero-section'
import UsageSection from '@/components/landing-page-sections/usage-section'

const HomePage = () => {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
      <HeroSection />
      <UsageSection />
    </div>
  )
}

export default HomePage