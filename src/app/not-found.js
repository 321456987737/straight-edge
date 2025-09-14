"use client";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - diagonal black & white */}
      <div className="absolute inset-0 bg-[linear-gradient(112deg,#000_50%,#fff_50%)]"></div>

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md text-black p-8 rounded-2xl shadow-lg border border-white/20 
                   bg-white/90 backdrop-blur-xl"
      >
        {/* Funny Animated 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <h1 className="text-[5rem] font-extrabold drop-shadow-lg">4</h1>
          <motion.div
            animate={{ rotate: [0, -20, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Scissors size={80} className="text-black drop-shadow-md" />
          </motion.div>
          <h1 className="text-[5rem] font-extrabold drop-shadow-lg">4</h1>
        </motion.div>

        {/* Funny Text */}
        <h2 className="text-2xl font-bold mb-2">Oops… Wrong Cut!</h2>
        <p className="text-black mb-6">
          Looks like our barber trimmed this page a little too short.  
          Don’t worry, your hairstyle is safe — just not this URL. ✂️😂
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-full sm:w-auto bg-white/20 border-black border-2 backdrop-blur-md text-black font-medium py-3 px-6 rounded-lg hover:bg-white/30 transition"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center justify-center w-full  border-black border-2 sm:w-auto  text-black font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </motion.button>
        </div>

        {/* Tiny footer joke */}
        <p className="text-xs text-black mt-6 italic">
          P.S. No actual pages were harmed during this haircut.
        </p>
      </motion.div>
    </div>
  );
}
