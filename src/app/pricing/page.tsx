import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { Pricing } from '@/components/ui/pricing-cards'
import pricingDetails from '@/data/pricing-details'
import React from 'react'

const PlansPage = () => {
  return (
    // Outer wrapper: prevents body overflow and handles theme bg
    <div className='flex min-h-screen w-full bg-background'>
      {/* Sidebar: Hidden on small screens, fixed width on large */}
      {/* <aside className="hidden md:block sticky top-0 h-screen border-r">
        <AppSidebar />
      </aside> */}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header (Optional: if you want a menu button for mobile later) */}
        <div className="md:hidden p-4 border-b flex justify-between items-center bg-card">
          <span className="font-bold text-xl">Plans</span>
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