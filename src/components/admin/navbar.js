"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  MessageSquare,
  Home,
  Calendar,
  Users,
  Scissors,
  BarChart3,
} from "lucide-react";

export default function Page() {
  const pathname = usePathname();

  // ✅ Unified nav links with hrefs
  const navLinks = [
    { label: "Dashboard", href: "/admin" },
    { label: "Appointments", href: "/admin/appointments" },
    { label: "Clients", href: "/admin/customers" },
    { label: "Barbers", href: "/admin/barbers" },
    { label: "Reports", href: "/admin/reports" },
  ];

  const bottomNavItems = [
    { label: "Home", icon: Home, href: "/admin" },
    { label: "Bookings", icon: Calendar, href: "/admin/appointments" },
    { label: "Clients", icon: Users, href: "/admin/customers" },
    { label: "Barbers", icon: Scissors, href: "/admin/barbers" },
    { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  ];

  return (
    <div className=" flex flex-col text-white">
      {/* Top Navbar */}
      <motion.nav
        className="sticky top-0 z-[1000] flex items-center justify-between px-6 lg:px-12 py-4 bg-black border-b border-white/10"
      >
        {/* Logo */}
        <img
          src="/namelogo.png"
          alt="logo"
          className="w-32 object-contain invert brightness-0"
        />

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-2">
          {navLinks.map(({ label, href }) => (
            <Link
              href={href}
              key={label}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                pathname === href
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Top Actions */}
        <div className="text-lg font-semibold">
          Admin panel
        </div>
        {/* <div className="flex gap-3">
          <Link
          href={"/admin"}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </Link>
          <Link
          href={"/admin"}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
        </div> */}
      </motion.nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Navbar (mobile only) */}
      <motion.nav
        className="fixed bottom-0 z-[100] left-0 right-0 flex justify-around items-center bg-black border-t border-white/10 px-4 py-3 lg:hidden"
      >
        {bottomNavItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center p-2 rounded-xl transition text-center ${
              pathname === href ? "bg-white text-black" : "text-gray-400"
            }`}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </motion.nav>
    </div>
  );
}
