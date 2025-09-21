"use client";
import React, { useState, useEffect } from "react";
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
import { StampIcon } from "lucide-react";
import { motion } from "framer-motion";

const Report = () => {
  const [Reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalReports, setTotalReports] = useState(0);
  const [filter, setFilter] = useState("thisMonth");

  useEffect(() => {
    fetchReportData(filter);
  }, [filter]);

  const fetchReportData = async (filter) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/reportsdata?filter=${filter}`);
      setReports(res.data.Reports);
      setTotalReports(res.data.TotalReports);
      console.log(res.data.Reports,res.data.TotalReports);
      setError("");
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last12Months", label: "Last 12 Months" }, // ✅ fixed
  ];

  return (
    <div className="bg-white text-black rounded-2xl p-4 sm:p-6 w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col mb-6 gap-4">
        <div className="flex w-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center max-w-[240px] w-full gap-2 md:gap-4 bg-white shadow-lg border border-black rounded-xl md:rounded-2xl p-3 md:p-5 hover:shadow-xl transition"
          >
            <div className="flex-shrink-0">
              <StampIcon />
            </div>
            <div>
              <motion.h3
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-lg md:text-2xl   font-bold"
              >
                {loading ? "Loading..." : "Total Reports"}
              </motion.h3>
              <p className="text-gray-500 text-xs md:text-sm">
                {totalReports}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-end gap-2">
          {filters.map((f) => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.value)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
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

      {/* Chart */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-28 sm:w-32 bg-gray-200 rounded"></div>
          <div className="h-[250px] sm:h-[300px] w-full bg-gray-300 rounded-lg"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full h-[250px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Reports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="date" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  color: "#000000",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reports" // ✅ matches API
                stroke="#000000"
                strokeWidth={3}
                dot={{ r: 5, fill: "#000000" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Report;
