"use client"
import { useState } from "react";
import Menu from "@/components/barber/menu";
export default function Barberlayout({ children }) {
 const [activeItem, setActiveItem] = useState("/dashboard/Dashboard");

   return (
   <div className="flex min-h-screen bg-white">
      <div>

       <Menu activeItem={activeItem} setActiveItem={setActiveItem}/>
      </div>
      <div className="flex-1 mt-16 overflow-y-auto">
           {/* {renderContent()} */}
        {children}
      </div>
   </div>
     );
}
