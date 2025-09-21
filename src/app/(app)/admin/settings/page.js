"use client";
import React from "react";
import SearchCustomers from "@/components/admin/customer/search"
import Searchbarbers from "@/components/admin/barber/searchbarber";
const Page = () => {
  return (
    <div>
      <div className="flex flex-col">
        <div className=" w-full max-w-7xl mx-auto bg-white  text-black p-6 rounded-2xl ">
          <h1 className="text-3xl font-bold font-mono">Welcome, Admin 🎉</h1>
          <p className="mt-2 text-lg ">
            Manage users, assign roles, and keep your platform running smoothly.
          </p>
        </div>
         <div className="w-full flex items-center justify-center">
            <SearchCustomers/>
         </div>
         <div className="w-full flex items-center justify-center">
            <Searchbarbers/>
         </div>

      </div>
    </div>
  );
};

export default Page;
