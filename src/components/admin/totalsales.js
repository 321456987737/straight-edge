"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const SalesChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("thisMonth");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/sales?filter=${type}`);
      setData(res.data.salesData); // [{ date, sales }]
      console.log(res.data.salesData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
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
    <div className="bg-white w-full text-black rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-bold">Total Sales</h2>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition ${
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
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#000" tick={{ fontSize: 12 }} />
              <YAxis stroke="#000" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  color: "#000000",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="sales"
                fill="#000000"
                barSize={25} // smaller bars for better fit
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesChart;



// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { motion } from "framer-motion";

// const SalesChart = () => {
//   const [data, setData] = useState([]);
//   const [filter, setFilter] = useState("thisMonth");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData(filter);
//   }, [filter]);

//   const fetchData = async (type) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`/api/admin/sales?filter=${type}`);
//       setData(res.data.salesData); // [{ date, sales }]
//       console.log(res.data.salesData);
//     } catch (error) {
//       console.error("Error fetching sales data:", error);
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
//     <div className="bg-white w-full text-black rounded-2xl p-6 ">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//         <h2 className="text-xl font-bold">Total Sales</h2>

//         <div className="flex gap-2 flex-wrap">
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

//       {/* Chart or Skeleton */}
//       {loading ? (
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 w-32 bg-gray-200 rounded"></div>
//           <div className="h-[300px] w-full bg-gray-300 rounded-lg"></div>
//         </div>
//       ) : (
//         <div className="w-full h-[250px] sm:h-[350px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis dataKey="date" stroke="#000" />
//               <YAxis stroke="#000" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#ffffff",
//                   border: "1px solid #d1d5db",
//                   borderRadius: "0.5rem",
//                   color: "#000000",
//                 }}
//               />
//               <Legend />
//               <Bar
//                 dataKey="sales"
//                 fill="#000000"
//                 barSize={40}
//                 radius={[6, 6, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesChart;
