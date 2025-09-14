"use client";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Scissors, 
  Settings as SettingsIcon,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const menuItems = [
  { id: "/barber", label: "Dashboard", icon: LayoutDashboard },
  { id: "/barber/appointment", label: "Appointments", icon: CalendarDays },
  { id: "/barber/customer", label: "Customers", icon: Users },
  { id: "/barber/services", label: "Services", icon: Scissors },
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
        className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800 text-white h-16 flex items-center justify-between px-4 md:px-8 shadow-md"
      >
        {/* Logo */}
        <Link href="/barber" className="flex items-center gap-2">
          <Image 
            src="/namelogo.png" 
            alt="Logo" 
            width={120} 
            height={40} 
            className="brightness-0 invert object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center lg:gap-8 gap-4 flex-1 justify-center">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = pathname === id;
            return (
              <motion.div 
                key={id}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Link
                  href={id}
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

        {/* Profile image */}
        <Link href={`/barber/profile/${id}`}>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-end cursor-pointer"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                width={38}
                height={38}
                className="rounded-full border-2 border-gray-700 hover:border-white transition"
              />
            ) : (
              <div className="p-1 rounded-full border-2 border-gray-700 hover:border-white transition">
                <UserIcon size={22} className="text-white" />
              </div>
            )}
          </motion.div>
        </Link>
      </motion.header>

      {/* ===== Bottom Navigation (Mobile) ===== */}
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg text-white flex justify-around items-center h-16 w-full border-t border-gray-800 md:hidden"
      >
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = pathname === id;
          return (
            <Link
              key={id}
              href={id}
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

// "use client";
// import { 
//   LayoutDashboard, 
//   CalendarDays, 
//   Users, 
//   Scissors, 
//   Settings as SettingsIcon,
//   User as UserIcon
// } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { useSession, signOut } from "next-auth/react";
// const menuItems = [
//   { id: "/barber", label: "Dashboard", icon: LayoutDashboard },
//   { id: "/barber/appointment", label: "Appointments", icon: CalendarDays },
//   { id: "/barber/customer", label: "Customers", icon: Users },
//   { id: "/barber/services", label: "Services", icon: Scissors },
//   { id: "/barber/settings", label: "Settings", icon: SettingsIcon },
// ];

// export default function Navbar({ profileImage }) {
//   const pathname = usePathname();
//   const {data:session} = useSession();
//   console.log(session)
//   const id = session?.user?.id || session?.user?._id;
//   return (
//     <>
//       {/* ===== Top Navbar (logo + profile for mobile, full menu for md+) ===== */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white h-16 flex items-center justify-between px-4 md:px-8 shadow-md">
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

//         {/* Menu items (visible md+) */}
//         <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
//           {menuItems.map(({ id, label, icon: Icon }) => {
//             const isActive = pathname === id;
//             return (
//               <Link
//                 key={id}
//                 href={id}
//                 className={`flex items-center gap-2 text-sm font-medium transition-colors ${
//                   isActive ? "text-white" : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 <Icon size={18} />
//                 {label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Profile image/icon */}
//           <Link href={`/barber/profile/${id}`}>
//         <div className="flex items-center justify-end">
//           {profileImage ? (
//               <Image
//                 src={profileImage}
//                 alt="Profile"
//                 width={36}
//                 height={36}
//               />
//             ) : (
//               <UserIcon size={28} className="text-white" />
//             )}
//         </div>
//             </Link>
 
//       </header>

//       {/* ===== Bottom Navigation (mobile only) ===== */}
//       {/* ===== Bottom Navigation (mobile only) ===== */}
//       <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white flex justify-around items-center h-16 w-full border-t border-gray-800 md:hidden">
//         {menuItems.map(({ id, label, icon: Icon }) => {
//           const isActive = pathname === id;
//           return (
//             <Link
//               key={id}
//               href={id}
//               className={`flex flex-col items-center justify-center px-2 py-1 text-xs font-medium transition-colors ${
//                 isActive ? "text-white" : "text-gray-400 hover:text-white"
//               }`}
//             >
//               <Icon size={22} />
//               <span className="mt-1">{label}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </>
//   );
// }
