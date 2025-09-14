"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import axios from "axios";
import useDebounce from "./useDebounce";

export default function BarberSearch() {
  const router = useRouter();

  return (
 <>
      {/* Trigger Button */}
      <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            router.push("/search");
          }}
        // onClick={() => setOpen(true)}
        className="p-2 rounded-full border-2 border-gray-700 hover:border-white "
      >
        <SearchIcon size={18} />
      </motion.button>
    </>
  );
}

//with the search component that appears on the same 

// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search as SearchIcon, X } from "lucide-react";
// import axios from "axios";
// import useDebounce from "./useDebounce";

// export default function BarberSearch() {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);

//   const debouncedQuery = useDebounce(query, 500);

//   useEffect(() => {
//     if (!debouncedQuery.trim()) {
//       setResults([]);
//       return;
//     }
//     axios
//       .get(`/api/barbers?search=${debouncedQuery}`)
//       .then((res) => setResults(res.data))
//       .catch(console.error);
//   }, [debouncedQuery]);

//   return (
//     <>
//       {/* Trigger Button */}
//       <motion.button
//           whileHover={{ scale: 1.1 }}
//         onClick={() => setOpen(true)}
//         className="p-2 rounded-full border-2 border-gray-700 hover:border-white "
//       >
//         <SearchIcon size={18} />
//       </motion.button>

//       {/* Fullscreen Search Overlay */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             key="overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed w-[100vw] h-[100vh] inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center"
//             onClick={() => setOpen(false)}
//             role="dialog"
//             aria-modal="true"
//           >
//             {/* Modal Container */}
//             <motion.div
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: 50, opacity: 0 }}
//               transition={{ duration: 0.4, ease: "easeOut" }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-2xl shadow-lg w-[90%]    h-[70vh] p-12 flex flex-col relative"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={() => setOpen(false)}
//                 className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
//                 aria-label="Close search"
//               >
//                 <X size={24} />
//               </button>

//               {/* Search Input */}
//               <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
//                 <SearchIcon size={20} className="text-gray-500" />
//                 <input
//                   type="text"
//                   placeholder="Search barbers..."
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   className="flex-1 outline-none text-gray-800"
//                   autoFocus
//                 />
//               </div>

//               {/* Results */}
//               <div className="mt-4 overflow-y-auto flex-1 space-y-2">
//                 {results.length === 0 && debouncedQuery.trim() !== "" ? (
//                   <p className="text-gray-500 text-center mt-10">
//                     No barbers found
//                   </p>
//                 ) : (
//                   results.map((barber) => (
//                     <div
//                       key={barber.id}
//                       className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition cursor-pointer"
//                     >
//                       {barber.name}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
