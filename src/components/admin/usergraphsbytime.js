"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const CustomerChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("thisMonth");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/customers?filter=${type}`);
      setData(res.data.customersData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last12Months", label: "Last 12 Months" },
  ];

  return (
    <div className="bg-white text-black w-full rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-bold">Customer Growth</h2>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                filter === f.value
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart or Skeleton */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-28 bg-gray-200 rounded"></div>
          <div className="h-[200px] sm:h-[300px] w-full bg-gray-300 rounded-lg"></div>
        </div>
      ) : (
        <div className="w-full h-[200px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis
                dataKey="date"
                stroke="#374151"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#374151" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  color: "#000000",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#000000"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#000000" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CustomerChart;

// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
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

// const CustomerChart = () => {
//   const [data, setData] = useState([]);
//   const [filter, setFilter] = useState("thisMonth");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData(filter);
//   }, [filter]);

//   const fetchData = async (type) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`/api/admin/customers?filter=${type}`);
//       setData(res.data.customersData);
//     } catch (error) {
//       console.error("Error fetching chart data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filters = [
//     { value: "thisMonth", label: "This Month" },
//     { value: "lastMonth", label: "Last Month" },
//     { value: "last12Months", label: "Last 12 Months" },
//   ];

//   return (
//     <div className="bg-white text-black w-full  rounded-2xl p-6 ">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//         <h2 className="text-xl font-bold">Customer Growth</h2>

//         <div className="flex gap-2">
//           {filters.map((f) => (
//             <motion.button
//               key={f.value}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setFilter(f.value)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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

//       {loading ? (
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 w-32 bg-gray-200 rounded"></div>
//           <div className="h-[300px] w-full bg-gray-300 rounded-lg"></div>
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height={350}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
//             <XAxis dataKey="date" stroke="#374151" />
//             <YAxis stroke="#374151" />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#ffffff",
//                 border: "1px solid #d1d5db",
//                 borderRadius: "0.5rem",
//                 color: "#000000",
//               }}
//             />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="customers"
//               stroke="#000000"
//               strokeWidth={3}
//               dot={{ r: 5, fill: "#000000" }}
//               activeDot={{ r: 8 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// };

// export default CustomerChart;
