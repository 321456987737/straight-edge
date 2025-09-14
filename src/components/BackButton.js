"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onClick={onClick}
      className={`
        absolute top-8 left-8 z-50 
        p-3 rounded-full 
        border-2 
        transition-all hover:scale-110 
        bg-transparent 
      `}
      style={{
        mixBlendMode: "difference",     // makes border + icon invert
        borderColor: "white",           // base color (will invert automatically)
      }}
    >
      <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
    </motion.button>
  );
};

export default BackButton;
