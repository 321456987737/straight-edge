"use client";
import { useEffect, useState } from "react";
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

export default function CustomersByLocation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/customer/by-location");
        if (res.data.success) {
          // format data for recharts
          setData(
            res.data.data.map((item) => ({
              name: item._id || "Unknown",
              count: item.count,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching location data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-2xl  max-w-7xl w-full"
    >
      <h2 className="text-xl font-semibold mb-4">📍 Customers by Location</h2>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="md:h-[360px] h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#000000" /> {/* blue bars */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
