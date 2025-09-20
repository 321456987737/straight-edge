import React from "react";
import Searchbarbers from "@/components/admin/barber/searchbarber";
import Barberchart from "@/components/admin/barbergraphsbytime"
import NewVsReturningCustomers from "@/components/admin/barber/morethen1appointment"
import BarbersByLocation from "@/components/admin/barber/barbersnylocation"
import Showbarber from "@/components/admin/barber/showbarber";
const Page = () => {
  return (
    <div className="mt-6">
      <h1 className="text-2xl ml-6 items-center font-semibold md:text-3xl mb-6 ">
        Barber Page
      </h1>
      <div className="flex w-full items-center justify-center">
        <Searchbarbers />
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="max-w-7xl w-full">
        <Barberchart />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="max-w-7xl w-full">
          <NewVsReturningCustomers />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="max-w-7xl w-full">
          <BarbersByLocation />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="max-w-7xl w-full">
          <Showbarber />
        </div>
      </div>
    </div>
  );
};

export default Page;
