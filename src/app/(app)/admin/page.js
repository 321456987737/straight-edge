import React from 'react'
import Totals from '@/components/admin/totals'
import CustomerChart from "@/components/admin/usergraphsbytime";
import Barberchart from "@/components/admin/barbergraphsbytime"
const Page = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4 w-full">
      <div className='flex w-full max-w-[1200px]  items-center justify-center'>
      <Totals/>

      </div>
      <div className="lg:flex lg:flex-row flex flex-col   gap-4 w-full">
      <CustomerChart />
      <Barberchart />
      </div>
      mamaia
    </div>
  )
}

export default Page
