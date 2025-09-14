"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserIcon, Calendar, Phone, Mail, Clock } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomersPage() {
  const { data: session } = useSession();
  const id = session?.user?.id || session?.user?._id;

  const [customers, setCustomers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchCustomers(true);
    }
  }, [id]);

  const fetchCustomers = useCallback(
    async (reset = false) => {
      if (loading || !id || !hasMore) return;

      try {
        setLoading(true);
        const currentSkip = reset ? 0 : skip;

        const res = await axios.get(
          `/api/barber/${id}/customer?skip=${currentSkip}&limit=2`
        );

        if (res.data?.customers?.length > 0) {
          if (reset) {
            setCustomers(res.data.customers);
          } else {
            setCustomers((prev) => [...prev, ...res.data.customers]);
          }
          setSkip(currentSkip + 1);
          setHasMore(res.data.hasMore);
        } else {
          if (reset) setCustomers([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    },
    [skip, id, loading, hasMore]
  );

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchCustomers();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchCustomers, hasMore, loading]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 ">
          <h1 className="text-3xl font-bold text-gray-900">Your Customers</h1>
          <p className="text-gray-600 mt-3 text-lg">
            View and manage all customers who booked with you
          </p>
        </div>

        {/* Customer Cards */}
        {customers.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm">
            <Calendar className="text-gray-500 mb-4" size={40} />
            <h3 className="font-semibold text-xl text-gray-900">
              No customers yet
            </h3>
            <p className="text-gray-600 text-sm mt-2 max-w-sm text-center">
              Once customers book appointments with you, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {customers.map((customer, index) => (
                <motion.div
                  key={customer._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  ref={index === customers.length - 1 ? observerRef : null}
                  className="group bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-6">
                    {/* Top Info */}
                    <div className="flex items-center gap-4 mb-5">
                      {customer.image ? (
                        <img
                          src={customer.image}
                          alt={customer.username}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 group-hover:border-black transition"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                          <UserIcon size={20} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {customer.username || "Unknown Customer"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {customer.appointmentCount} appointment
                          {customer.appointmentCount !== 1 ? "s" : ""} with you
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <Mail size={16} className="text-black" />
                          <span>{customer.email}</span>
                        </div>
                      )}

                      {customer.phone && (
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <Phone size={16} className="text-black" />
                          <span>{customer.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Clock size={16} className="text-black" />
                        <span>Last booking: {formatDate(customer.lastBooking)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Calendar size={16} className="text-black" />
                        <span>First booking: {formatDate(customer.firstBooking)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* End of list message */}
        {!hasMore && customers.length > 0 && (
          <p className="text-center text-gray-500 py-10 text-sm">
            🎉 You’ve reached the end of your customer list
          </p>
        )}
      </div>
    </div>
  );
}

// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { User as UserIcon, Calendar, Phone, Mail, Clock } from "lucide-react";
// import { useSession } from "next-auth/react";

// export default function CustomersPage() {
//   const { data: session } = useSession();
//   const id = session?.user?.id || session?.user?._id;

//   const [customers, setCustomers] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const observerRef = useRef(null);

//   const fetchCustomers = useCallback(async () => {
//     if (loading || !id) return;
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `/api/barber/${id}/customer?skip=${skip}&limit=10`
//       );

//       if (res.data?.customers?.length > 0) {
//         setCustomers((prev) => [...prev, ...res.data.customers]);
//         setSkip((prev) => prev + res.data.customers.length);
//         setHasMore(res.data.customers.length >= 10);
//       } else {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [skip, id, loading]);

//   // Initial fetch
//   useEffect(() => {
//     if (id) {
//       setSkip(0);
//       setCustomers([]);
//       setHasMore(true);
//       fetchCustomers();
//     }
//   }, [id]);

//   // Infinite scroll observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) {
//           fetchCustomers();
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (observerRef.current) observer.observe(observerRef.current);

//     return () => {
//       if (observerRef.current) observer.unobserve(observerRef.current);
//     };
//   }, [fetchCustomers, hasMore, loading]);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
//           <p className="text-gray-600 mt-2">
//             All customers who have booked appointments with you
//           </p>
//         </div>

//         {/* Customer Cards */}
//         {customers.length === 0 && !loading ? (
//           <div className="text-center py-20 border border-gray-300 rounded-xl bg-white">
//             <Calendar className="mx-auto text-gray-500 mb-3" size={32} />
//             <h3 className="font-medium text-black">No customers yet</h3>
//             <p className="text-gray-600 text-sm">
//               Customers will appear here once they book appointments.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {customers.map((customer, index) => (
//               <motion.div
//                 key={customer._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.05 }}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
//               >
//                 <div className="p-5">
//                   <div className="flex items-center gap-4 mb-4">
//                     {customer.image ? (
//                       <img
//                         src={customer.image}
//                         alt={customer.username}
//                         className="w-14 h-14 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
//                         <UserIcon size={24} />
//                       </div>
//                     )}
//                     <div>
//                       <h3 className="font-semibold text-lg text-gray-900">
//                         {customer.username || "Unknown Customer"}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         {customer.appointmentCount} appointment
//                         {customer.appointmentCount !== 1 ? "s" : ""}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     {customer.email && (
//                       <div className="flex items-center text-gray-700">
//                         <Mail size={16} className="mr-2 text-gray-500" />
//                         <span className="text-sm">{customer.email}</span>
//                       </div>
//                     )}

//                     {customer.phone && (
//                       <div className="flex items-center text-gray-700">
//                         <Phone size={16} className="mr-2 text-gray-500" />
//                         <span className="text-sm">{customer.phone}</span>
//                       </div>
//                     )}

//                     <div className="flex items-center text-gray-700">
//                       <Clock size={16} className="mr-2 text-gray-500" />
//                       <span className="text-sm">
//                         Last booking: {formatDate(customer.lastBooking)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* Loader and observer */}
//         <div ref={observerRef} className="mt-8">
//           {loading && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse"
//                 >
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="w-14 h-14 rounded-full bg-gray-200"></div>
//                     <div className="space-y-2">
//                       <div className="h-5 w-32 bg-gray-200 rounded"></div>
//                       <div className="h-4 w-24 bg-gray-200 rounded"></div>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="h-4 w-40 bg-gray-200 rounded"></div>
//                     <div className="h-4 w-32 bg-gray-200 rounded"></div>
//                     <div className="h-4 w-36 bg-gray-200 rounded"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//           {!hasMore && customers.length > 0 && (
//             <p className="text-center text-gray-500 py-6">
//               No more customers to show
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
