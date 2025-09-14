"use client";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertCircle, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <motion.div
        className="max-w-4xl w-full bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Side - Big 404 */}
        <motion.div
          className="flex items-center justify-center md:w-2/5 bg-zinc-950 p-12"
          variants={itemVariants}
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[6rem] md:text-[8rem] font-bold text-white tracking-tight"
          >
            404
          </motion.h1>
        </motion.div>

        {/* Right Side - Content */}
        <div className="p-8 md:p-12 md:w-3/5">
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center text-red-500 mb-3">
              <AlertCircle size={22} className="mr-2" />
              <h2 className="text-xl font-semibold">Page Not Found</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Sorry, the page you are looking for does not exist or has been moved.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-white">
              Possible reasons:
            </h3>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                The page may have been deleted or renamed.
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                You might have mistyped the URL.
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                The resource is temporarily unavailable.
              </li>
            </ul>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="flex items-center justify-center bg-white text-black font-medium py-3 px-6 rounded-lg shadow hover:bg-gray-200 transition-colors"
            >
              <Home size={18} className="mr-2" />
              Go Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center justify-center border border-white text-white hover:bg-zinc-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center text-gray-400 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <HelpCircle size={18} className="mr-2" />
              Help
            </motion.button>
          </motion.div>

          {/* Footer Help */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-gray-800"
          >
            <p className="text-sm text-gray-500">
              Need assistance?{" "}
              <a href="#" className="text-white hover:underline">
                Contact Support
              </a>{" "}
              or{" "}
              <a href="#" className="text-white hover:underline">
                Visit Help Center
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
