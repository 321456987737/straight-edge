import React from 'react'
import Totals from '@/components/admin/totals'
import CustomerChart from "@/components/admin/usergraphsbytime";
import Barberchart from "@/components/admin/barbergraphsbytime"
import TotalAppointments from "@/components/admin/totalappointments"
import TopRatedBarbersPage from "@/components/admin/topbarbers"
import SalesChart from "@/components/admin/totalsales"
const Page = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4 w-full">
      <div className='flex w-full max-w-[1200px]  items-center justify-center'>
      <Totals/>
      </div>
      <div className='w-full max-w-7xl'>
        <SalesChart/>
      </div>
      <div className="lg:flex lg:flex-row flex flex-col   gap-4 w-full">
      <CustomerChart />
      <Barberchart />
      </div>
      <div className='flex w-full max-w-[1200px]  items-center justify-center'>
        <TotalAppointments/>
      </div>
      <div>
        <TopRatedBarbersPage />
      </div>
    </div>
  )
}

export default Page
