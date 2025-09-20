import React from 'react'
import TotalUsers from "@/components/admin/customer/totalcustomer"
import NewVsReturningCustomers from "@/components/admin/customer/customerthathavebookedappointment"
import CustomersByLocation from "@/components/admin/customer/by-location"
import SearchCustomers from "@/components/admin/customer/search"
import Showcustomer from "@/components/admin/customer/showcustomer"
const Page = () => {
  return (
    <div className='mt-6'>
     <h1 className='text-2xl ml-6 items-center font-semibold md:text-3xl mb-6 '>Customer Page </h1>
     <div className='flex w-full items-center justify-center'>
      <SearchCustomers/>
     </div>
     <div className='w-full flex items-center justify-center'>
      <TotalUsers/>
     </div>
    
     <div>
      <NewVsReturningCustomers />
     </div>
     <div className='flex items-center w-full justify-center'>
      <CustomersByLocation/>
     </div>
     <div className='flex items-center w-full justify-center'>
      <Showcustomer/>
     </div>

    </div>
  )
}

export default Page