"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  console.log(session, "this is the session");
  console.log(session?.user?.role, "this is the session");
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  const handleClick = (type) => {
    setSelected(type);

    setTimeout(() => {
      // if (session?.user?.role === type) {
      //   // If role matches, go to dashboard
      //   router.push(`/${type}`);
      // } else {
        // Otherwise, go to signup
        router.push(`/signup?type=${type}`);
      // }
    }, 800); // match animation duration
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Black Section (Barber) */}
      <motion.div
        initial={{ clipPath: "polygon(0 0, 100% 0, 30% 100%, 0% 100%)" }}
        animate={
          selected === "barber"
            ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }
            : selected === "customer"
            ? { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0% 100%)" }
            : { clipPath: "polygon(0 0, 60% 0, 40% 100%, 0% 100%)" }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-full w-full bg-black z-20"
      >
        <div className="h-full w-[50%] flex items-center justify-center">
          {!selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-full flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="invert brightness-0 w-48" />
              </div>
              <motion.button
                onClick={() => handleClick("barber")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-white border-2 border-white cursor-pointer rounded-lg font-semibold text-lg transition-colors shadow-lg"
              >
                Continue as Barber
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* White Section (Customer) */}
      <motion.div
        initial={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 50% 100%)" }}
        animate={
          selected === "customer"
            ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }
            : selected === "barber"
            ? { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }
            : { clipPath: "polygon(60% 0, 100% 0, 100% 100%, 50% 100%)" }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-full w-full bg-white z-10"
      >
        <div className="h-full w-[50%] flex items-center justify-center ml-auto">
          {!selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-full flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="w-48" />
              </div>
              <motion.button
                onClick={() => handleClick("customer")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white border-2 border-black text-black rounded-lg font-semibold text-lg cursor-pointer transition-colors shadow-lg"
              >
                Continue as Customer
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Page;



// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";

// const Page = () => {
//   const [selected, setSelected] = useState(null);

//   const handleClick = (type) => {
//     setSelected(type);
//     setTimeout(() => {
//       console.log(`Navigating to /signup?type=${type}`);
//     }, 800);
//   };

//   const handleBack = () => {
//     setSelected(null);
//   };

//   return (
//     <div className="relative h-screen w-screen overflow-hidden">
//       {/* Black Section */}
//       <motion.div
//         initial={{ clipPath: "polygon(0 0, 60% 0, 50% 100%, 0% 100%)" }}
//         animate={
//           selected === "barber"
//             ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }
//             : selected === "customer"
//             ? { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0% 100%)" }
//             : { clipPath: "polygon(0 0, 60% 0, 50% 100%, 0% 100%)" }
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
//                 <img src="/logo.png" alt="" className="invert brightness-0 w-48" />

//               </div>
//               <motion.button
//                 onClick={() => handleClick("barber")}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-4 bg-black text-white border-2 border-white cursor-pointer rounded-lg font-semibold text-lg  transition-colors shadow-lg"
//               >
//                 Continue as Barber
//               </motion.button>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>

//       {/* White Section */}
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
//         <div className="h-full w-[150%] flex items-center justify-center">
//           {!selected && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-center"
//             >
//               <div className="w-full flex items-center justify-center">
//                 <img src="/logo.png" alt="" className=" w-48" />

//               </div>
//               <motion.button
//                 onClick={() => handleClick("customer")}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-4 bg-white border-2 border-black  text-black rounded-lg font-semibold text-lg  cursor-pointer transition-colors shadow-lg"
//               >
//                 Continue as Customer
//               </motion.button>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>

//       {/* Back Button */}
//       {selected && (
//         <motion.button
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           onClick={handleBack}
//           className={`absolute top-8 left-8 z-50 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 ${
//             selected === "barber"
//               ? "bg-white/20 text-white hover:bg-white/30"
//               : "bg-black/20 text-black hover:bg-black/30"
//           }`}
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M10 19l-7-7m0 0l7-7m-7 7h18"
//             />
//           </svg>
//         </motion.button>
//       )}

//       {/* Redirecting State */}
//     </div>
//   );
// };

// export default Page;
