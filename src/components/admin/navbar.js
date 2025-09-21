"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Calendar, Users, Scissors, BarChart3 } from "lucide-react";

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

  // ✅ Active path check
  const isActive = (href) => pathname === href;

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
            <Bell className="w-5 h-5 text-gray-400" />
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



// "use client";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Bell,
//   MessageSquare,
//   Home,
//   Calendar,
//   Users,
//   Scissors,
//   BarChart3,
// } from "lucide-react";

// export default function Page() {
//   const pathname = usePathname();

//   // ✅ Unified nav links with hrefs
//   const navLinks = [
//     { label: "Dashboard", href: "/admin" },
//     { label: "Appointments", href: "/admin/appointments" },
//     { label: "Clients", href: "/admin/customers" },
//     { label: "Barbers", href: "/admin/barbers" },
//     { label: "Reports", href: "/admin/reports" },
//   ];

//   const bottomNavItems = [
//     { label: "Home", icon: Home, href: "/admin" },
//     { label: "Bookings", icon: Calendar, href: "/admin/appointments" },
//     { label: "Clients", icon: Users, href: "/admin/customers" },
//     { label: "Barbers", icon: Scissors, href: "/admin/barbers" },
//     { label: "Reports", icon: BarChart3, href: "/admin/reports" },
//   ];

//   return (
//     <div className=" flex flex-col text-white w-full">
//       {/* Top Navbar */}
//       <motion.nav
//         className="sticky top-0 z-[1000] w-full flex items-center justify-between px-6 lg:px-12 py-4 bg-black border-b border-white/10"
//       >
//         {/* Logo */}
//         <img
//           src="/namelogo.png"
//           alt="logo"
//           className="w-32 object-contain invert brightness-0"
//         />

//         {/* Desktop Nav */}
//         <div className="hidden lg:flex gap-2">
//           {navLinks.map(({ label, href }) => (
//             <Link
//               href={href}
//               key={label}
//               className={`px-4 py-2 rounded-lg font-medium transition ${
//                 pathname === href
//                   ? "bg-white text-black"
//                   : "text-gray-400 hover:text-white hover:bg-white/10"
//               }`}
//               aria-current={pathname === href ? "page" : undefined}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>

//         {/* Top Actions */}
//         <div className="text-lg font-semibold">
//           Admin panel
//         </div>
  
//       </motion.nav>

//       {/* Spacer */}
//       <div className="flex-1" />

     
//  <motion.nav
//   className="fixed bottom-0 z-[100] left-0 w-screen flex justify-evenly items-center bg-black border-t border-white/10 py-3 lg:hidden"
// >
//   {bottomNavItems.map(({ label, icon: Icon, href }) => (
//     <Link
//       key={label}
//       href={href}
//       className={`flex flex-col items-center py-2 rounded-xl transition text-center ${
//         pathname === href ? "bg-white text-black" : "text-gray-400"
//       }`}
//       aria-current={pathname === href ? "page" : undefined}
//     >
//       <Icon className="w-5 h-5 mb-1" />
//       <span className="text-xs font-medium">{label}</span>
//     </Link>
//   ))}
// </motion.nav>

//     </div>
//   );
// }
