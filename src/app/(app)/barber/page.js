"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, DollarSign, Users, Star, Calendar, TrendingUp, Clock, UserCheck, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
export default function DashboardPage() {
  // const barberId = "68b84da5d1b06cc1516439b0";
  const {data:session} = useSession();
  const barberId = session?.user?.id || session?.user?._id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!barberId) return;
    fetchData(page);
  }, [page, barberId]);

  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/barber/${barberId}/dashboard?page=${pageNum}&limit=10`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-72 bg-gray-200 rounded"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mr-4"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-3 w-20 bg-gray-200 rounded mt-3"></div>
            </div>
          ))}
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Customer", "Service", "Date & Time", "Status", "Price"].map(
                    (col, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-5">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-8 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    </div>

    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Failed to load dashboard data</p>
          <button 
            onClick={() => fetchData(page)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { stats, appointments, page: currentPage, totalPages } = data;

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 mb-16 sm:px-6 lg:px-8 py-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Barber Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here s your performance overview</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 mr-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalSales.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+2.5% from last week</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50 mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Today s Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-50 mr-4">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating} <span className="text-amber-500">⭐</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
            <span className="text-sm text-gray-500">{stats.totalAppointments} total appointments</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length > 0 ? (
                  appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{a?.barber?.username || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{a?.services?.map((s) => s.name).join(", ")}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(a.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {a.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            a.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : a.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : a.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {a.services?.reduce((sum, s) => sum + (s.price || 0), 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="text-gray-500 italic">No appointments found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-5">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * 5 + 1}</span> to <span className="font-medium">{(currentPage - 1) * 5 + appointments.length}</span> of{' '}
            <span className="font-medium">{stats.totalAppointments}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-md border ${currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-md ${currentPage === pageNum ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2 py-1.5 text-sm text-gray-500">...</span>}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-md border ${currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";

// export default function DashboardPage() {
//   const [data, setData] = useState(null);
//   const barberId = "68b84da5d1b06cc1516439b0"; // replace dynamically later

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`/api/barber/${barberId}/dashboard`);
//         setData(res.data);
//       } catch (err) {
//         console.error("Error fetching dashboard:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
//         <p className="animate-pulse text-lg">Loading dashboard...</p>
//       </div>
//     );
//   }

//   const { stats, appointments, barber } = data;

//   return (
//     <div className="min-h-screen bg-neutral-900 text-white px-8 py-10">
//       {/* Header */}
//       <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
//       <p className="text-gray-400 mb-8">
//         Welcome back, <span className="font-semibold">{barber.username}</span>
//       </p>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-10">
//         <motion.div whileHover={{ scale: 1.05 }} className="bg-neutral-800 p-6 rounded-2xl shadow">
//           <p className="text-sm text-gray-400">Total Appointments</p>
//           <p className="text-3xl font-semibold">{stats.totalAppointments}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.05 }} className="bg-neutral-800 p-6 rounded-2xl shadow">
//           <p className="text-sm text-gray-400">Appointments Today</p>
//           <p className="text-3xl font-semibold">{stats.appointmentsToday}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.05 }} className="bg-neutral-800 p-6 rounded-2xl shadow">
//           <p className="text-sm text-gray-400">Appointments Tomorrow</p>
//           <p className="text-3xl font-semibold">{stats.appointmentsTomorrow}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.05 }} className="bg-neutral-800 p-6 rounded-2xl shadow">
//           <p className="text-sm text-gray-400">Total Earnings</p>
//           <p className="text-3xl font-semibold">${stats.totalEarnings}</p>
//         </motion.div>

//         <motion.div whileHover={{ scale: 1.05 }} className="bg-neutral-800 p-6 rounded-2xl shadow">
//           <p className="text-sm text-gray-400">Average Rating</p>
//           <p className="text-3xl font-semibold">{stats.averageRating}</p>
//         </motion.div>
//       </div>

//       {/* All Appointments */}
//       <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
//       <div className="overflow-hidden rounded-xl border border-neutral-700">
//         <table className="w-full text-left">
//           <thead className="bg-neutral-800 text-gray-400">
//             <tr>
//               <th className="px-4 py-3">Date</th>
//               <th className="px-4 py-3">Time</th>
//               <th className="px-4 py-3">Customer</th>
//               <th className="px-4 py-3">Service</th>
//               <th className="px-4 py-3">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-neutral-800">
//             {appointments.length > 0 ? (
//               appointments.map((appt, i) => (
//                 <tr key={i} className="hover:bg-neutral-800/40">
//                   <td className="px-4 py-3">
//                     {new Date(appt.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3">{appt.time}</td>
//                   <td className="px-4 py-3 font-medium">{appt.customer}</td>
//                   <td className="px-4 py-3">{appt.service}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-3 py-1 rounded-lg text-sm font-medium ${
//                         appt.status === "confirmed"
//                           ? "bg-green-600/20 text-green-400"
//                           : appt.status === "completed"
//                           ? "bg-blue-600/20 text-blue-400"
//                           : "bg-gray-600/20 text-gray-400"
//                       }`}
//                     >
//                       {appt.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-6 text-gray-400 italic">
//                   No appointments found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Quick Actions */}
//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//         <div className="flex gap-4">
//           <button className="px-4 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200">
//             Add Availability
//           </button>
//           <button className="px-4 py-2 bg-neutral-800 rounded-lg shadow hover:bg-neutral-700">
//             View Calendar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
