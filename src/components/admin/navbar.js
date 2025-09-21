"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Calendar, Users, Scissors, BarChart3, Settings } from "lucide-react";
import { useState, useEffect } from "react";
export default function AdminNavbar() {
  const pathname = usePathname() || "";

  const navLinks = [
    { label: "Dashboard", href: "/admin" },
    { label: "Appointments", href: "/admin/appointments" },
    { label: "Clients", href: "/admin/customers" },
    { label: "Barbers", href: "/admin/barbers" },
    { label: "Reports", href: "/admin/report" },
  ];

  const bottomNavItems = [
    { label: "Home", icon: Home, href: "/admin" },
    { label: "Bookings", icon: Calendar, href: "/admin/appointments" },
    { label: "Clients", icon: Users, href: "/admin/customers" },
    { label: "Barbers", icon: Scissors, href: "/admin/barbers" },
    { label: "Reports", icon: BarChart3, href: "/admin/report" },
  ];
  const [settingscolor, setsettingscolor] = useState(false)
  // ✅ Active path check
  const isActive = (href) => pathname === href;
  useEffect(() => {
    if (pathname === "/admin/settings") {
      setsettingscolor(true)
    }else{
      setsettingscolor(false)
    }
  }, [pathname])
  
  return (
    <>
      {/* Top Navbar */}
      <motion.nav className="sticky top-0 z-[1000] w-full bg-black border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
          {/* Logo */}
          <img
            src="/namelogo.png"
            alt="logo"
            className="w-24 invert brightness-0 sm:w-28 md:w-32 object-contain"
          />

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-3 items-center">
            {navLinks.map(({ label, href }) => (
              <Link
                href={href}
                key={label}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive(href)
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm font-semibold">
              Admin panel
            </div>
            <Link href={"/admin/settings"}>

            <Settings  className={`w-5 h-5  text-gray-400  ${settingscolor ? "text-white underline-offset-8 " : ""}`} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Bottom Nav (mobile) */}
      <motion.nav className="fixed bottom-0 z-[100] left-0 right-0 lg:hidden">
        <div className="max-w-screen-xl mx-auto  sm:px-6">
          <div className="backdrop-blur-sm bg-black/95 border-t border-white/10 rounded-t-lg flex justify-between items-center px-2 py-2">
            {bottomNavItems.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-md text-center text-xs font-medium transition-all ${
                  isActive(href) ? "bg-white text-black" : "text-gray-400"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <Icon className="w-5 h-5 mb-0" />
                <span className="text-[10px] sm:text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
}

