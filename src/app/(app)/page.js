"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleClick = (type) => {
    setSelected(type);
    setTimeout(() => {
      router.push(`/signup?type=${type}`);
    }, 800); // keep animation in sync
  };

  // Desktop polygons
  const desktopInitialBlack = "polygon(0 0, 60% 0, 40% 100%, 0% 100%)";
  const desktopInitialWhite = "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)";

  // Mobile diagonal polygons (adjust the 45/55 to change angle)
  // Black is top with an angled bottom edge (45% left / 55% right)
  const mobileDiagonalBlack = "polygon(0 0, 100% 0, 100% 55%, 0% 45%)";
  // White is bottom with matching angled top edge
  const mobileDiagonalWhite = "polygon(0 45%, 100% 55%, 100% 100%, 0% 100%)";

  // Full-screen polygon
  const full = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
  // Collapsed polygons (hide one or the other)
  const collapsedZeroHeight = "polygon(0 0, 100% 0, 100% 0, 0 0)"; // collapsed to 0 height (top hide)
  const collapsedZeroBottom = "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"; // collapsed to 0 height at bottom (bottom hide)
  const collapsedLeft = "polygon(0 0, 0% 0, 0% 100%, 0 100%)"; // collapsed to left (desktop hide)
  const collapsedRight = "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"; // collapsed to right (desktop hide)

  // compute animate polygons depending on selection + device
  const blackAnimate =
    selected === "barber"
      ? full
      : selected === "customer"
      ? isMobile
        ? collapsedZeroHeight
        : collapsedLeft
      : isMobile
      ? mobileDiagonalBlack
      : desktopInitialBlack;

  const whiteAnimate =
    selected === "customer"
      ? full
      : selected === "barber"
      ? isMobile
        ? collapsedZeroBottom
        : collapsedRight
      : isMobile
      ? mobileDiagonalWhite
      : desktopInitialWhite;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* optional back button */}
     

      {/* Black Panel (Barber) */}
      <motion.div
        initial={{
          clipPath: isMobile ? mobileDiagonalBlack : desktopInitialBlack,
        }}
        animate={{ clipPath: blackAnimate }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-black z-30"
      >
        <div className="w-full h-full flex flex-col md:flex-row">
          {/* content area (left on desktop, top on mobile) */}
          <div className="md:w-1/2 h-1/2 md:h-full flex items-center justify-center">
            {!selected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="text-center px-6"
              >
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="w-32 h-32 sm:w-32 sm:h-32 md:w-48 md:h-48 object-contain invert-[1] brightness-0"
                  />
                </div>

                <motion.button
                  onClick={() => handleClick("barber")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="min-w-[160px] sm:min-w-[180px] px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg border-2 border-white bg-black text-white shadow-lg transition-colors duration-200 hover:bg-white hover:text-black"
                >
                  Continue as Barber
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* spacer (right/bottom) — empty */}
          <div className="md:w-1/2 h-1/2 md:h-full" />
        </div>
      </motion.div>

      {/* White Panel (Customer) */}
      <motion.div
        initial={{
          clipPath: isMobile ? mobileDiagonalWhite : desktopInitialWhite,
        }}
        animate={{ clipPath: whiteAnimate }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-white z-20"
      >
        <div className="w-full h-full flex flex-col md:flex-row">
          {/* spacer (left/top) */}
          <div className="md:w-1/2 h-1/2 md:h-full" />

          {/* content area (right on desktop, bottom on mobile) */}
          <div className="md:w-1/2 h-1/2 md:h-full flex items-center justify-center">
            {!selected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="text-center px-6"
              >
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="w-32 h-32 sm:w-32 sm:h-32 md:w-48 md:h-48 object-contain"
                  />
                </div>

                <motion.button
                  onClick={() => handleClick("customer")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="min-w-[160px] sm:min-w-[180px] px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg border-2 border-black bg-white text-black shadow-lg transition-colors duration-200 hover:bg-black hover:text-white"
                >
                  Continue as Customer
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import BackButton from "@/components/BackButton";
// import { useSession } from "next-auth/react";

// const Page = () => {
//   const { data: session } = useSession();
//   console.log(session, "this is the session");
//   console.log(session?.user?.role, "this is the session");
//   const [selected, setSelected] = useState(null);
//   const router = useRouter();

//   const handleClick = (type) => {
//     setSelected(type);

//     setTimeout(() => {
//       // if (session?.user?.role === type) {
//       //   // If role matches, go to dashboard
//       //   router.push(`/${type}`);
//       // } else {
//         // Otherwise, go to signup
//         router.push(`/signup?type=${type}`);
//       // }
//     }, 800); // match animation duration
//   };

//   return (
//     <div className="relative h-screen w-screen overflow-hidden">
//       {/* Black Section (Barber) */}
//       <motion.div
//         initial={{ clipPath: "polygon(0 0, 100% 0, 30% 100%, 0% 100%)" }}
//         animate={
//           selected === "barber"
//             ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }
//             : selected === "customer"
//             ? { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0% 100%)" }
//             : { clipPath: "polygon(0 0, 60% 0, 40% 100%, 0% 100%)" }
//         }
//         transition={{ duration: 0.8, ease: "easeInOut" }}
//         className="absolute top-0 left-0 h-full w-full bg-black z-20"
//       >
//         <div className="h-full w-[50%] flex items-center justify-center">
//           {!selected && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-center"
//             >
//               <div className="w-full flex items-center justify-center">
//                 <img src="/logo.png" alt="logo" className="invert brightness-0 w-48" />
//               </div>
//               <motion.button
//                 onClick={() => handleClick("barber")}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-4 bg-black text-white border-2 border-white cursor-pointer rounded-lg font-semibold text-lg transition-colors shadow-lg"
//               >
//                 Continue as Barber
//               </motion.button>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>

//       {/* White Section (Customer) */}
//       <motion.div
//         initial={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 50% 100%)" }}
//         animate={
//           selected === "customer"
//             ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }
//             : selected === "barber"
//             ? { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }
//             : { clipPath: "polygon(60% 0, 100% 0, 100% 100%, 50% 100%)" }
//         }
//         transition={{ duration: 0.8, ease: "easeInOut" }}
//         className="absolute top-0 left-0 h-full w-full bg-white z-10"
//       >
//         <div className="h-full w-[50%] flex items-center justify-center ml-auto">
//           {!selected && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-center"
//             >
//               <div className="w-full flex items-center justify-center">
//                 <img src="/logo.png" alt="logo" className="w-48" />
//               </div>
//               <motion.button
//                 onClick={() => handleClick("customer")}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-4 bg-white border-2 border-black text-black rounded-lg font-semibold text-lg cursor-pointer transition-colors shadow-lg"
//               >
//                 Continue as Customer
//               </motion.button>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Page;


