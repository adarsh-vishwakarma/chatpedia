import PricingSection from '@/components/PricingSection'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300 mt-10">

      <PricingSection />
    </main>
    </div>
  )
}

export default page