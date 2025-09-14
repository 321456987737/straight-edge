"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Calendar,
  Clock,
  Scissors,
  RotateCwc,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function AppointmentsPage() {
  const { data: session } = useSession();
  const id = session?.user?.id || session?.user?._id;

  const [appointments, setAppointments] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [stats, setStats] = useState({
    upcoming: 0,
    past: 0,
    completed: 0,
    cancelled: 0,
  });
  const [cancellingId, setCancellingId] = useState(null);
  const observerRef = useRef(null);

  const fetchAppointments = useCallback(
    async (filter = activeFilter, reset = false) => {
      if (loading || !id) return;
      try {
        setLoading(true);
        const currentSkip = reset ? 0 : skip;

        const res = await axios.get(
          `/api/barber/${id}/appointments?status=${filter}&skip=${currentSkip}&limit=5`
        );

        if (res.data?.appointments?.length > 0) {
          if (reset) {
            setAppointments(res.data.appointments);
            setSkip(res.data.appointments.length);
          } else {
            setAppointments((prev) => [...prev, ...res.data.appointments]);
            setSkip((prev) => prev + res.data.appointments.length);
          }
          setHasMore(res.data.appointments.length >= 5);
        } else {
          if (reset) setAppointments([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    },
    [skip, id, loading, activeFilter]
  );

  const fetchStats = useCallback(async () => {
    if (!id) return;
    try {
      const responses = await Promise.all([
        axios.get(`/api/barber/${id}/appointments?status=upcoming&limit=1`),
        axios.get(`/api/barber/${id}/appointments?status=past&limit=1`),
        axios.get(`/api/barber/${id}/appointments?status=completed&limit=1`),
        axios.get(`/api/barber/${id}/appointments?status=cancelled&limit=1`),
      ]);

      setStats({
        upcoming: responses[0].data?.totalCount || 0,
        past: responses[1].data?.totalCount || 0,
        completed: responses[2].data?.totalCount || 0,
        cancelled: responses[3].data?.totalCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchStats();
      handleFilterChange("upcoming");
    }
  }, [id]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSkip(0);
    setHasMore(true);
    fetchAppointments(filter, true);
  };

  const cancelAppointment = async (appointmentId) => {
    if (!id) return;
    
    setCancellingId(appointmentId);
    try {
      await axios.patch(`/api/barber/${id}/appointments`, {
        appointmentId,
        status: "cancelled"
      });

      setAppointments(prev => 
        prev.filter(appt => appt._id !== appointmentId)
      );
      
      setStats(prev => ({
        ...prev,
        upcoming: prev.upcoming - 1,
        cancelled: prev.cancelled + 1
      }));
      
      alert("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchAppointments();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchAppointments, hasMore, loading]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const groupByDate = (list) => {
    return list.reduce((acc, appt) => {
      const dateLabel = formatDate(appt.date);
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(appt);
      return acc;
    }, {});
  };

  const groupedAppointments = groupByDate(appointments);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Appointments</h1>
          <div className="flex gap-2 flex-wrap">
            {["upcoming", "past", "completed", "cancelled"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  activeFilter === filter
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} (
                {stats[filter]})
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {appointments.length === 0 && !loading ? (
          <div className="text-center py-20 border border-gray-300 rounded-xl bg-white">
            <Calendar className="mx-auto text-gray-500 mb-3" size={32} />
            <h3 className="font-medium text-black">No appointments</h3>
            <p className="text-gray-600 text-sm">
              No {activeFilter} appointments available.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="space-y-10">
              {Object.entries(groupedAppointments).map(([dateLabel, list]) => (
                <div key={dateLabel}>
                  <h2 className="text-lg font-semibold text-black mb-6 ml-14">
                    {dateLabel}
                  </h2>
                  <AnimatePresence>
                    {list.map((appt) => (
                      <motion.div
                        key={appt._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative pl-14 mb-2"
                      >
                        {/* Timeline dot */}
                        <div
                          className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-white shadow ${getStatusColor(
                            appt.status
                          )}`}
                        ></div>

                        {/* Card */}
                        <div className="p-5 bg-white border border-gray-300 rounded-xl shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            {/* Customer */}
                            <div className="flex items-center gap-3">
                              {appt.customerId?.image ? (
                                <img
                                  src={appt.customerId.image}
                                  alt={appt.customerId.username}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                                  <UserIcon size={18} />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-black">
                                  {appt.customerId?.username || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appt.customerId?.email}
                                </p>
                              </div>
                            </div>
                            {/* Time */}
                            <span className="text-sm text-gray-700 flex items-center gap-1">
                              <Clock size={14} />
                              {appt.time}
                            </span>
                          </div>

                          {/* Services + Total */}
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-sm text-black">
                              <p className="font-medium flex items-center gap-1 mb-1">
                                <Scissors size={14} className="text-black" />
                                Services
                              </p>
                              <ul className="ml-5 space-y-1 text-gray-800">
                                {appt.services?.map((s, idx) => (
                                  <li key={idx}>
                                    {s.name} - ${s.price}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600">Total</p>
                              <p className="text-lg font-bold text-black">
                                $
                                {appt.services?.reduce(
                                  (t, s) => t + s.price,
                                  0
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Cancel Button for Upcoming Appointments */}
                          {activeFilter === "upcoming" && appt.status !== "cancelled" && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => cancelAppointment(appt._id)}
                                disabled={cancellingId === appt._id}
                                className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <X size={16} />
                                {cancellingId === appt._id ? "Cancelling..." : "Cancel Appointment"}
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loader */}
        <div ref={observerRef} className="flex justify-center py-8">
          {loading && (
            <div className="relative w-full">
              {/* Timeline vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-10 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    {/* Date label */}
                    <div className="h-5 w-24 bg-gray-200 rounded mb-6 ml-14"></div>

                    {/* Appointment skeleton */}
                    {[1, 2].map((j) => (
                      <div key={j} className="relative pl-14 mb-2">
                        {/* Timeline dot */}
                        <div className="absolute left-4 top-5 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>

                        {/* Card */}
                        <div className="p-5 bg-white border border-gray-300 rounded-xl shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            {/* Customer */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                              <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                <div className="h-3 w-40 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                            {/* Time */}
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                          </div>

                          {/* Services + Total */}
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="space-y-2">
                              <div className="h-4 w-20 bg-gray-200 rounded"></div>
                              <div className="h-3 w-40 bg-gray-100 rounded"></div>
                              <div className="h-3 w-28 bg-gray-100 rounded"></div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="h-3 w-12 bg-gray-200 rounded ml-auto"></div>
                              <div className="h-5 w-16 bg-gray-300 rounded ml-auto"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!hasMore && appointments.length > 0 && (
            <p className="text-gray-500 text-sm">No more appointments</p>
          )}
        </div>
      </div>
    </div>
  );
}



// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User as UserIcon,
//   Calendar,
//   Clock,
//   Scissors,
//   RotateCcw,
// } from "lucide-react";
// import { useSession } from "next-auth/react";

// export default function AppointmentsPage() {
//   const { data: session } = useSession();
//   const id = session?.user?.id || session?.user?._id;

//   const [appointments, setAppointments] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [activeFilter, setActiveFilter] = useState("upcoming");
//   const [stats, setStats] = useState({
//     upcoming: 0,
//     past: 0,
//     completed: 0,
//     cancelled: 0,
//   });
//   const observerRef = useRef(null);

//   const fetchAppointments = useCallback(
//     async (filter = activeFilter, reset = false) => {
//       if (loading || !id) return;
//       try {
//         setLoading(true);
//         const currentSkip = reset ? 0 : skip;

//         const res = await axios.get(
//           `/api/barber/${id}/appointments?status=${filter}&skip=${currentSkip}&limit=5`
//         );

//         if (res.data?.appointments?.length > 0) {
//           if (reset) {
//             setAppointments(res.data.appointments);
//             setSkip(res.data.appointments.length);
//           } else {
//             setAppointments((prev) => [...prev, ...res.data.appointments]);
//             setSkip((prev) => prev + res.data.appointments.length);
//           }
//           setHasMore(res.data.appointments.length >= 5);
//         } else {
//           if (reset) setAppointments([]);
//           setHasMore(false);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [skip, id, loading, activeFilter]
//   );

//   const fetchStats = useCallback(async () => {
//     if (!id) return;
//     try {
//       const responses = await Promise.all([
//         axios.get(`/api/barber/${id}/appointments?status=upcoming&limit=1`),
//         axios.get(`/api/barber/${id}/appointments?status=past&limit=1`),
//         axios.get(`/api/barber/${id}/appointments?status=completed&limit=1`),
//         axios.get(`/api/barber/${id}/appointments?status=cancelled&limit=1`),
//       ]);

//       setStats({
//         upcoming: responses[0].data?.totalCount || 0,
//         past: responses[1].data?.totalCount || 0,
//         completed: responses[2].data?.totalCount || 0,
//         cancelled: responses[3].data?.totalCount || 0,
//       });
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     }
//   }, [id]);

//   useEffect(() => {
//     if (id) {
//       fetchStats();
//       handleFilterChange("upcoming");
//     }
//   }, [id]);

//   const handleFilterChange = (filter) => {
//     setActiveFilter(filter);
//     setSkip(0);
//     setHasMore(true);
//     fetchAppointments(filter, true);
//   };

//   // Infinite scroll observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) {
//           fetchAppointments();
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (observerRef.current) observer.observe(observerRef.current);

//     return () => {
//       if (observerRef.current) observer.unobserve(observerRef.current);
//     };
//   }, [fetchAppointments, hasMore, loading]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) return "Today";
//     if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-500";
//       case "cancelled":
//         return "bg-red-500";
//       case "pending":
//         return "bg-yellow-500";
//       default:
//         return "bg-blue-500";
//     }
//   };

//   const groupByDate = (list) => {
//     return list.reduce((acc, appt) => {
//       const dateLabel = formatDate(appt.date);
//       if (!acc[dateLabel]) acc[dateLabel] = [];
//       acc[dateLabel].push(appt);
//       return acc;
//     }, {});
//   };

//   const groupedAppointments = groupByDate(appointments);

//   return (
//     <div className="min-h-screen bg-white text-black p-6">
//       <div className="max-w-5xl mx-auto space-y-10">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <h1 className="text-3xl font-bold">Appointments</h1>
//           <div className="flex gap-2 flex-wrap">
//             {["upcoming", "past", "completed", "cancelled"].map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => handleFilterChange(filter)}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
//                   activeFilter === filter
//                     ? "bg-black text-white border-black"
//                     : "bg-white text-black border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 {filter.charAt(0).toUpperCase() + filter.slice(1)} (
//                 {stats[filter]})
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Timeline */}
//         {appointments.length === 0 && !loading ? (
//           <div className="text-center py-20 border border-gray-300 rounded-xl bg-white">
//             <Calendar className="mx-auto text-gray-500 mb-3" size={32} />
//             <h3 className="font-medium text-black">No appointments</h3>
//             <p className="text-gray-600 text-sm">
//               No {activeFilter} appointments available.
//             </p>
//           </div>
//         ) : (
//           <div className="relative">
//             <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
//             <div className="space-y-10">
//               {Object.entries(groupedAppointments).map(([dateLabel, list]) => (
//                 <div key={dateLabel}>
//                   <h2 className="text-lg font-semibold text-black mb-6 ml-14">
//                     {dateLabel}
//                   </h2>
//                   <AnimatePresence>
//                     {list.map((appt) => (
//                       <motion.div
//                         key={appt._id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: 20 }}
//                         transition={{ duration: 0.3 }}
//                         className="relative pl-14 mb-2"
//                       >
//                         {/* Timeline dot */}
//                         <div
//                           className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-white shadow ${getStatusColor(
//                             appt.status
//                           )}`}
//                         ></div>

//                         {/* Card */}
//                         <div className="p-5 bg-white border border-gray-300 rounded-xl shadow-sm">
//                           <div className="flex justify-between items-start mb-3">
//                             {/* Customer */}
//                             <div className="flex items-center gap-3">
//                               {appt.customerId?.image ? (
//                                 <img
//                                   src={appt.customerId.image}
//                                   alt={appt.customerId.username}
//                                   className="w-10 h-10 rounded-full object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
//                                   <UserIcon size={18} />
//                                 </div>
//                               )}
//                               <div>
//                                 <p className="font-medium text-black">
//                                   {appt.customerId?.username || "Unknown"}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                   {appt.customerId?.email}
//                                 </p>
//                               </div>
//                             </div>
//                             {/* Time */}
//                             <span className="text-sm text-gray-700 flex items-center gap-1">
//                               <Clock size={14} />
//                               {appt.time}
//                             </span>
//                           </div>

//                           {/* Services + Total */}
//                           <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                             <div className="text-sm text-black">
//                               <p className="font-medium flex items-center gap-1 mb-1">
//                                 <Scissors size={14} className="text-black" />
//                                 Services
//                               </p>
//                               <ul className="ml-5 space-y-1 text-gray-800">
//                                 {appt.services?.map((s, idx) => (
//                                   <li key={idx}>
//                                     {s.name} - ${s.price}
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xs text-gray-600">Total</p>
//                               <p className="text-lg font-bold text-black">
//                                 $
//                                 {appt.services?.reduce(
//                                   (t, s) => t + s.price,
//                                   0
//                                 )}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Loader */}
//         <div ref={observerRef} className="flex justify-center py-8">
//           {loading && (
//             <div className="relative w-full">
//               {/* Timeline vertical line */}
//               <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

//               <div className="space-y-10 animate-pulse">
//                 {[1, 2, 3].map((i) => (
//                   <div key={i}>
//                     {/* Date label */}
//                     <div className="h-5 w-24 bg-gray-200 rounded mb-6 ml-14"></div>

//                     {/* Appointment skeleton */}
//                     {[1, 2].map((j) => (
//                       <div key={j} className="relative pl-14 mb-2">
//                         {/* Timeline dot */}
//                         <div className="absolute left-4 top-5 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>

//                         {/* Card */}
//                         <div className="p-5 bg-white border border-gray-300 rounded-xl shadow-sm">
//                           <div className="flex justify-between items-start mb-3">
//                             {/* Customer */}
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-full bg-gray-300"></div>
//                               <div className="space-y-2">
//                                 <div className="h-4 w-32 bg-gray-200 rounded"></div>
//                                 <div className="h-3 w-40 bg-gray-100 rounded"></div>
//                               </div>
//                             </div>
//                             {/* Time */}
//                             <div className="h-4 w-16 bg-gray-200 rounded"></div>
//                           </div>

//                           {/* Services + Total */}
//                           <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                             <div className="space-y-2">
//                               <div className="h-4 w-20 bg-gray-200 rounded"></div>
//                               <div className="h-3 w-40 bg-gray-100 rounded"></div>
//                               <div className="h-3 w-28 bg-gray-100 rounded"></div>
//                             </div>
//                             <div className="text-right space-y-2">
//                               <div className="h-3 w-12 bg-gray-200 rounded ml-auto"></div>
//                               <div className="h-5 w-16 bg-gray-300 rounded ml-auto"></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {!hasMore && appointments.length > 0 && (
//             <p className="text-gray-500 text-sm">No more appointments</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
