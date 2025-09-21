"use client";
import Report from "@/components/admin/report/report";
import Showreports from "@/components/admin/report/reportbyuser"
const Page = () => {
  return (
    <div>
      <h1 className="text-2xl mt-7 ml-6 items-center font-semibold md:text-3xl ">
        Report Page
      </h1>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl ">
          <Report /> 
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl ">
          <Showreports /> 
        </div>
      </div>
    </div>
  );
};

export default Page;
// "use client"
// import React from 'react'
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { motion } from "framer-motion";
// const Page = () => {
//   const [Reports, setReports] = useState([])
//   const [error, seterror] = useState("")
//   const [loading, setloading] = useState(false)
//   const [totalreports, settotalreports ] = useState(0)
//    const [filter, setFilter] = useState("thisMonth");
//   useEffect(() => {
//     fetchreportdata(filter)
//   }, [filter])
//     const fetchreportdata = async (filter)=>{
//       setloading(true)
//       try {
//         const res = await axios.get(`/api/admin/reportsdata?filter=${filter}`)
//         setReports(res.data.Reports)
//         settotalreports(res.data.Totalreports)
//         setloading(false)
//       } catch (error) {
//           throw new Error("failed to load data")
//       }finally{
//         setloading(false)
//       }
//     }
//     const filters =[
//       {value:"thisMonth", label:"This Month"},
//       {value:"lastMonth", label:"Last Month"},
//       {value:"last12Month", label:"Last 12 Month"},
//     ]

//   return (
//    <div className="bg-white max-w-7xl text-black rounded-2xl p-4 sm:p-6 w-full overflow-hidden  ">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//         <h2 className="text-lg sm:text-xl font-bold">Total reports</h2> {/* ✅ Updated */}
//           <div className='flex w-full items-center justify-center'>
//             <div className='border border-gray-500 rounded-lg shadow-md'>
//                 Total Reports {totalreports}
//             </div>
//           </div>

//         <div className="flex flex-wrap gap-2">
//           {filters.map((f) => (
//             <motion.button
//               key={f.value}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setFilter(f.value)}
//               className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
//                 filter === f.value
//                   ? "bg-black text-white"
//                   : "bg-gray-200 text-black hover:bg-gray-300"
//               }`}
//             >
//               {f.label}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       {/* Chart */}
//       {loading ? (
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 w-28 sm:w-32 bg-gray-200 rounded"></div>
//           <div className="h-[250px] sm:h-[300px] w-full bg-gray-300 rounded-lg"></div>
//         </div>
//       ) : (
//         <div className="w-full h-[250px] sm:h-[350px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart Reports={Reports}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
//               <XAxis dataKey="date" stroke="#374151" />
//               <YAxis stroke="#374151" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#ffffff",
//                   border: "1px solid #d1d5db",
//                   borderRadius: "0.5rem",
//                   color: "#000000",
//                 }}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="reports" // ✅ Updated to customers
//                 stroke="#000000"
//                 strokeWidth={3}
//                 dot={{ r: 5, fill: "#000000" }}
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Page
