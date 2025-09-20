"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import BarberSearch from "@/components/customer/search/search";
import { Home, UserIcon, Scissors, Users, CalendarDays, AlertCircle } from "lucide-react";
const navItems = [
  { href: "/customer", label: "Home", icon: Home },
  { href: "/customer/services", label: "Services", icon: Scissors },
  { href: "/customer/professionals", label: "Pros", icon: Users },
  { href: "/customer/appointments", label: "Book", icon: CalendarDays },
  { href: "/customer/reports", label: "Report", icon: AlertCircle },
];

export default function Navbar({ profileImage }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const id = session?.user?.id || session?.user?._id;

  return (
    <>
      {/* ===== Top Navbar ===== */}
      <motion.header 
        // initial={{ y: -50, opacity: 0 }}
        // animate={{ y: 0, opacity: 1 }}
        // transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800 text-white h-16 flex items-center justify-between px-4 md:px-8 "
      >
        {/* Logo */}

        <Link href="/customer" className="flex items-center gap-2">
          <Image 
            src="/namelogo.png" 
            alt="Logo" 
            width={120} 
            height={40} 
            className="brightness-0 invert object-contain"
          />
        </Link>
   
       

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <motion.div
                key={href}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Link
                  href={href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
                {isActive && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-white via-gray-300 to-white rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </nav>
          <div className="flex items-center gap-4">

                {/* <BarberSearch/> */}
        {/* Profile image */}
        <Link href={`/customer/profile/${id}`}>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-end cursor-pointer"
          >
            {profileImage ? (
              <Image
              src={profileImage}
              alt="Profile"
              width={22}
              height={22}
                className="rounded-full border-2 border-gray-700 hover:border-white transition"
              />
            ) : (
              <div className="p-1 rounded-full border-2 border-gray-700 hover:border-white transition">
                <UserIcon size={22} className="text-white" />
              </div>
            )}
          </motion.div>
        </Link>
      </div>
      </motion.header>

      {/* ===== Bottom Navigation (Mobile) ===== */}
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg text-white flex justify-around items-center h-16 w-full border-t border-gray-800 md:hidden"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center px-2 py-1 text-xs font-medium transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.2 }}
                className={`p-2 rounded-full ${
                  isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={20} />
              </motion.div>
              <span className={`mt-1 ${isActive ? "text-white" : "text-gray-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
}


// with animation that i goes up and down according to scroll


// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import BarberSearch from "@/components/customer/search/search";
// import { Home, UserIcon, Scissors, Users, CalendarDays } from "lucide-react";

// const navItems = [
//   { href: "/customer", label: "Home", icon: Home },
//   { href: "/customer/services", label: "Services", icon: Scissors },
//   { href: "/customer/professionals", label: "Pros", icon: Users },
//   { href: "/customer/appointments", label: "Book", icon: CalendarDays },
// ];

// export default function Navbar({ profileImage }) {
//   const pathname = usePathname();
//   const { data: session } = useSession();
//   const id = session?.user?.id || session?.user?._id;

//   const [hidden, setHidden] = useState(false);

//   useEffect(() => {
//     let lastScrollY = window.scrollY;

//     const handleScroll = () => {
//       if (window.innerWidth >= 768) {
//         if (window.scrollY > lastScrollY && window.scrollY > 50) {
//           // scrolling down
//           setHidden(true);
//         } else {
//           // scrolling up
//           setHidden(false);
//         }
//         lastScrollY = window.scrollY;
//       } else {
//         setHidden(false); // always visible on mobile
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <>
//       {/* ===== Top Navbar ===== */}
//       <motion.header
//         initial={{ y: 0 }}
//         animate={{ y: hidden ? "-100%" : "0%" }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//         className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800 text-white h-16 flex items-center justify-between px-4 md:px-8 shadow-md"
//       >
//         {/* Logo */}
//         <Link href="/barber" className="flex items-center gap-2">
//           <Image
//             src="/namelogo.png"
//             alt="Logo"
//             width={120}
//             height={40}
//             className="brightness-0 invert object-contain"
//           />
//         </Link>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
//           {navItems.map(({ href, label, icon: Icon }) => {
//             const isActive = pathname === href;
//             return (
//               <motion.div
//                 key={href}
//                 whileHover={{ scale: 1.05 }}
//                 className="relative"
//               >
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

//         <div className="flex items-center gap-4">
//           <BarberSearch />
//           {/* Profile image */}
//           <Link href={`/barber/profile/${id}`}>
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               className="flex items-center justify-end cursor-pointer"
//             >
//               {profileImage ? (
//                 <Image
//                   src={profileImage}
//                   alt="Profile"
//                   width={22}
//                   height={22}
//                   className="rounded-full border-2 border-gray-700 hover:border-white transition"
//                 />
//               ) : (
//                 <div className="p-1 rounded-full border-2 border-gray-700 hover:border-white transition">
//                   <UserIcon size={28} className="text-white" />
//                 </div>
//               )}
//             </motion.div>
//           </Link>
//         </div>
//       </motion.header>

//       {/* ===== Bottom Navigation (Mobile) ===== */}
//       <motion.nav
//         initial={{ y: 0 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg text-white flex justify-around items-center h-16 w-full border-t border-gray-800 md:hidden"
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
//                   isActive
//                     ? "bg-white text-black"
//                     : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 <Icon size={20} />
//               </motion.div>
//               <span
//                 className={`mt-1 ${isActive ? "text-white" : "text-gray-400"}`}
//               >
//                 {label}
//               </span>
//             </Link>
//           );
//         })}
//       </motion.nav>
//     </>
//   );
// }
