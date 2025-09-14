"use client";

import DesktopNavbar from "./DesktopNavbar";

export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
    </>
  );
}

// "use client";
// import BarberSearch from "@/components/customer/search/search";
// import { motion } from "framer-motion";
// import { Home, Scissors, Users, CalendarDays } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";

// const navItems = [
//   { href: "/customer", label: "Home", icon: Home },
//   { href: "/customer/services", label: "Services", icon: Scissors },
//   { href: "/customer/professionals", label: "Pros", icon: Users },
//   { href: "/customer/appointments", label: "Book", icon: CalendarDays },
// ];

// export default function Navbar() {
//   const pathname = usePathname();

//   return (
//     <>
//       {/* ===== Top Navbar (logo + links + actions) ===== */}
//       <motion.header
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800 text-white h-16 flex items-center justify-between px-4 sm:px-6 md:px-10 shadow-md"
//       >
//         {/* Left Logo */}
//         <Link href="/customer/dashboard" className="flex items-center gap-2">
//           <Image
//             src="/namelogo.png"
//             alt="Logo"
//             width={120}
//             height={40}
//             className="brightness-0 invert object-contain"
//           />
//         </Link>

//         {/* Center Nav Links (Desktop only) */}
//         <nav className="hidden md:flex items-center gap-10 flex-1 justify-center">
//           {navItems.map(({ href, label, icon: Icon }) => {
//             const isActive = pathname === href;
//             return (
//               <motion.div key={href} whileHover={{ scale: 1.05 }} className="relative">
//                 <Link
//                   href={href}
//                   className={`flex items-center gap-2 text-sm font-medium transition-colors ${
//                     isActive ? "text-white" : "text-gray-400 hover:text-white"
//                   }`}
//                 >
//                   <Icon size={18} />
//                   {label}
//                 </Link>
//                 {isActive && (
//                   <motion.div
//                     layoutId="underline"
//                     className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-white via-gray-300 to-white rounded-full"
//                   />
//                 )}
//               </motion.div>
//             );
//           })}
//         </nav>

//         {/* Right Search + Buttons */}
//         <div className="flex items-center space-x-2 sm:space-x-3">
//           <div className="hidden sm:block">
//             <BarberSearch />
//           </div>
//           <Link
//             href="/customer/appointments"
//             className="bg-white text-black text-sm font-medium px-3 sm:px-4 py-1 rounded-md hover:bg-gray-200 transition"
//           >
//             Book
//           </Link>
//           <Link
//             href="/auth/signin"
//             className="bg-gray-800 text-sm font-medium px-3 sm:px-4 py-1 rounded-md hover:bg-gray-700 transition"
//           >
//             Log in
//           </Link>
//         </div>
//       </motion.header>

//       {/* ===== Mobile Bottom Navbar ===== */}
//       <motion.nav
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg text-white flex justify-around items-center h-16 w-full border-t border-gray-800 md:hidden"
//       >
//         {navItems.map(({ href, label, icon: Icon }) => {
//           const isActive = pathname === href;
//           return (
//             <Link
//               key={href}
//               href={href}
//               className="flex flex-col items-center justify-center px-2 py-1 text-xs font-medium transition-colors"
//             >
//               <motion.div
//                 whileHover={{ scale: 1.2 }}
//                 className={`p-2 rounded-full ${
//                   isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 <Icon size={20} />
//               </motion.div>
//               <span className={`mt-1 ${isActive ? "text-white" : "text-gray-400"}`}>
//                 {label}
//               </span>
//             </Link>
//           );
//         })}
//       </motion.nav>
//     </>
//   );
// }
