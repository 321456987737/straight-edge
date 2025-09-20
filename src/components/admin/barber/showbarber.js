"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Blocks } from "lucide-react";

const Showbarber = () => {
  const [barbers, setbarbers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Fetch barbers with pagination
  useEffect(() => {
    const fetchbarbers = async () => {
      try {
        const res = await axios.get(
          `/api/admin/barber/showbarber?page=${page}&limit=${limit}`
        );
        setbarbers(res.data.barbers);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };
    fetchbarbers();
  }, [page]);

  return (
    <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
        Barbers
      </h1>

      {/* barber Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {barbers.map((barber) => (
          <motion.div
            key={barber._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center w-full h-full"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold mb-4 overflow-hidden">
              {barber.image ? (
                <img
                  src={barber.image}
                  alt={barber.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>

            {/* Info */}
            <h2 className="text-base sm:text-lg font-semibold">
              {barber.username}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1 break-words">
              <Mail className="w-4 h-4" /> {barber.email}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone className="w-4 h-4" /> {barber.number || "N/A"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone className="w-4 h-4" /> {barber.role || "N/A"}
            </p>

            {/* Restriction Badge */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mt-3">
              <Blocks className="w-4 h-4" />
              {barber.restricted ? (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                  Restricted
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-medium">
                  Unrestricted
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-500 mt-3">
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {barber.province || "Unknown"}
              </p>
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {barber.city || "Unknown"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center flex-wrap mt-8 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-900"
          }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
              num === page
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
            page === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-900"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Showbarber;

// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { User, Mail, Phone, MapPin, Blocks } from "lucide-react";

// const Showbarber = () => {
//   const [barbers, setbarbers] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 6;

//   // Fetch barbers with pagination
//   useEffect(() => {
//     const fetchbarbers = async () => {
//       try {
//         const res = await axios.get(
//           `/api/admin/barber/showbarber?page=${page}&limit=${limit}`
//         );
//         setbarbers(res.data.barbers);
//         setTotalPages(res.data.totalPages);
//       } catch (error) {
//         console.error("Error fetching barbers:", error);
//       }
//     };
//     fetchbarbers();
//   }, [page]);

//   return (
//     <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
//       <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
//         Barbers
//       </h1>

//       {/* barber Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {barbers.map((barber) => (
//           <motion.div
//             key={barber._id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center w-full h-full"
//           >
//             {/* Avatar */}
//             <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold mb-4 overflow-hidden">
//               {barber.image ? (
//                 <img
//                   src={barber.image}
//                   alt={barber.username}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <User className="w-8 h-8" />
//               )}
//             </div>

//             {/* Info */}
//             <h2 className="text-base sm:text-lg font-semibold">
//               {barber.username}
//             </h2>
//             <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1 break-words">
//               <Mail className="w-4 h-4" /> {barber.email}
//             </p>
//             <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
//               <Phone className="w-4 h-4" /> {barber.number || "N/A"}
//             </p>
//             <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
//               <Phone className="w-4 h-4" /> {barber.role || "N/A"}
//             </p>

//             {/* Restriction Badge */}
//             <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mt-3">
//               <Blocks className="w-4 h-4" />
//               {barber.restricted ? (
//                 <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
//                   Restricted
//                 </span>
//               ) : (
//                 <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-medium">
//                   Unrestricted
//                 </span>
//               )}
//             </div>

//             {/* Location */}
//             <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-500 mt-3">
//               <p className="flex items-center gap-1">
//                 <MapPin className="w-4 h-4" /> {barber.province || "Unknown"}
//               </p>
//               <p className="flex items-center gap-1">
//                 <MapPin className="w-4 h-4" /> {barber.city || "Unknown"}
//               </p>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center flex-wrap mt-8 gap-2">
//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//           className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
//             page === 1
//               ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//               : "bg-gray-800 text-white hover:bg-gray-900"
//           }`}
//         >
//           Prev
//         </button>

//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//           <button
//             key={num}
//             onClick={() => setPage(num)}
//             className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
//               num === page
//                 ? "bg-yellow-500 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//           >
//             {num}
//           </button>
//         ))}

//         <button
//           onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           disabled={page === totalPages}
//           className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
//             page === totalPages
//               ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//               : "bg-gray-800 text-white hover:bg-gray-900"
//           }`}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Showbarber;
