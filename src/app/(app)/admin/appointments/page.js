import React from 'react'
import TotalAppointments from "@/components/admin/totalappointments";
import TotalCompletdAppointments from "@/components/admin/totalappointmentcompleted";
import SalesChart from "@/components/admin/totalsales"
import Recentappointments from "@/components/admin/recentCompletedappointments"
import RecentPendingAppointments from "@/components/admin/recentpendingappointment"
import RecentCancelledAppointments from "@/components/admin/recentcancelledappointment"
export default function Page() {
  return (
    <div className='mt-6'>
      <h1 className='text-2xl ml-6 items-center font-semibold md:text-3xl '>Appointments Page </h1>
        <div className='w-full flex items-center justify-center'>
          <div className='max-w-7xl w-full'>
        <SalesChart/>
          </div>
      </div>
      <div className='flex flex-col md:flex-row gap-4'>
        <TotalAppointments />
        <TotalCompletdAppointments />
      </div>
      <div className='w-full flex flex-col md:flex-row gap-4  justify-center'>
        <Recentappointments />
        <RecentPendingAppointments />
      </div>
      <div className='w-full flex items-center  justify-center'>
      <RecentCancelledAppointments />
      </div>
    </div>
  )
}
