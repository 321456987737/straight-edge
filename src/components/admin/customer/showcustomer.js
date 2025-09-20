"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Blocks } from "lucide-react";

const Showcustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Fetch customers with pagination
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `/api/admin/customer/showcustomer?page=${page}&limit=${limit}`
        );
        setCustomers(res.data.customers);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, [page]);

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <motion.div
            key={customer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold mb-4 overflow-hidden">
              {customer.image ? (
                <img
                  src={customer.image}
                  alt={customer.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>

            {/* Info */}
            <h2 className="text-lg font-semibold">{customer.username}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-4 h-4" /> {customer.email}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone className="w-4 h-4" /> {customer.number || "N/A"}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone className="w-4 h-4" /> {customer.role || "N/A"}
            </p>

            {/* Restriction Badge */}
            <div className="flex items-center justify-center gap-2 text-sm mt-3">
              <Blocks className="w-4 h-4" />
              {customer.restricted ? (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                  Restricted
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                  Unrestricted
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1 text-sm text-gray-500 mt-3">
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {customer.province || "Unknown"}
              </p>
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {customer.city || "Unknown"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
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
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
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
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
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

export default Showcustomer;

// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { User, Mail, Phone, MapPin, Blocks } from "lucide-react";

// const Showcustomer = () => {
//   const [customers, setCustomers] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 6;

//   // Fetch customers with pagination
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const res = await axios.get(
//           `/api/admin/customer/showcustomer?page=${page}&limit=${limit}`
//         );
//         setCustomers(res.data.customers);
//         setTotalPages(res.data.totalPages);
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//       }
//     };
//     fetchCustomers();
//   }, [page]);

//   return (
//     <div className="p-6 w-full max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Customers</h1>

//       {/* Customer Cards Grid */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {customers.map((customer) => (
//           <motion.div
//             key={customer._id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center"
//           >
//             {/* Avatar */}
//             <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold mb-4 overflow-hidden">
//               {customer.image ? (
//                 <img
//                   src={customer.image}
//                   alt={customer.username}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <User className="w-8 h-8" />
//               )}
//             </div>

//             {/* Info */}
//             <h2 className="text-lg font-semibold">{customer.username}</h2>
//             <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
//               <Mail className="w-4 h-4" /> {customer.email}
//             </p>
//             <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
//               <Phone className="w-4 h-4" /> {customer.number || "N/A"}
//             </p>
//             <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
//               <Phone className="w-4 h-4" /> {customer.role || "N/A"}
//             </p>

//             {/* Restriction Badge */}
//             <div className="flex items-center justify-center gap-2 text-sm mt-3">
//               <Blocks className="w-4 h-4" />
//               {customer.restricted ? (
//                 <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-medium">
//                   Restricted
//                 </span>
//               ) : (
//                 <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
//                   Unrestricted
//                 </span>
//               )}
//             </div>

//             {/* Location */}
//             <div className="flex flex-col gap-1 text-sm text-gray-500 mt-3">
//               <p className="flex items-center gap-1">
//                 <MapPin className="w-4 h-4" /> {customer.province || "Unknown"}
//               </p>
//               <p className="flex items-center gap-1">
//                 <MapPin className="w-4 h-4" /> {customer.city || "Unknown"}
//               </p>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-8 gap-2">
//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//           className={`px-4 py-2 rounded-lg text-sm font-medium ${
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
//             className={`px-4 py-2 rounded-lg text-sm font-medium ${
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
//           className={`px-4 py-2 rounded-lg text-sm font-medium ${
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

// export default Showcustomer;
