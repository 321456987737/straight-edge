"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Scissors,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & About */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Scissors className="w-7 h-7 text-white" />
            <h2 className="text-xl font-bold">Barber Studio</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Where style meets precision. Book your appointment and get the best
            grooming experience with our professional barbers.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">
              Book Appointment
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Services
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              About Us
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Contact
            </li>
          </ul>
        </motion.div>

        {/* Contact & Socials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Get In Touch</h3>
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Phone className="w-5 h-5" />
            <span>+92 300 1234567</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
            <span>info@barberstudio.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <MapPin className="w-5 h-5" />
            <span>Lahore, Pakistan</span>
          </div>

          {/* Socials */}
          <div className="flex gap-4 mt-4">
            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
              <motion.a
                key={idx}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom line */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} Barber Studio. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
