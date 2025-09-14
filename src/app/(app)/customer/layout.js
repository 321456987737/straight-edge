"use client";
import { useState } from "react";
import Navbar from "@/components/customer/navbar";
import Footer from "@/components/customer/footer";
export default function CustomerLayout({ children }) {
  const [activeItem, setActiveItem] = useState("/dashboard/Dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div>
        <Navbar activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>

      <div className="flex-1 mt-16 overflow-y-auto">
        {/* {renderContent()} */}
        {children}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
