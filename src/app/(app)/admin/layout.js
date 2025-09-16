"use client";
import Navbar from "@/components/admin/navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {/* Sidebar or Navbar */}
      <Navbar />
      {/* Main content area */}
      <main className="  ">
        {children}
      </main>
    </div>
  );
}

