import { Pricing } from '@/components/ui/pricing-cards'
import pricingDetails from '@/data/pricing-details'

const PlansPage = () => {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-background'>
      
      {/* Sidebar: Hidden on small screens, fixed width on large */}
      {/* <aside className="hidden md:block sticky top-0 h-screen border-r">
        <AppSidebar />
      </aside> */}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-muted/5 pb-12">
        
        {/* Mobile Header (Optional: if you want a menu button for mobile later) */}
        <div className="md:hidden p-4 border-b flex justify-between items-center bg-card shadow-sm">
          <span className="font-extrabold text-xl text-foreground tracking-tight">Plans</span>
          {/* You could add a Sheet/Mobile Menu trigger here */}
        </div>

        <div className="container mx-auto">
          <Pricing cardDetail={pricingDetails} />
        </div>
      </main>
    </div>
  )
}

export default PlansPage
