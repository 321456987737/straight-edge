"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#000000", "#9ca3af"]; // black & gray

export default function NewVsReturningCustomers() {
  const [chartData, setChartData] = useState([
    { name: "New Customers", value: 0 },
    { name: "Returning Customers", value: 0 },
  ]);
  const [users, setUsers] = useState({ new: [], returning: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/admin/customer/rebooking");
        // Expect API to return { chart, users }
        setChartData(res.data.chart);
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching customer data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // ✅ Skeleton Loader
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl w-full animate-pulse">
        <h2 className="text-lg font-semibold text-center mb-12">
          New vs Returning Customers
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Skeleton */}
          <div className="lg:w-1/2 h-72 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gray-200"></div>
          </div>

          {/* List Skeleton */}
          <div className="lg:w-1/2 flex flex-col justify-center gap-6">
            <div>
              <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
              <ul className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="h-3 w-48 bg-gray-200 rounded"></li>
                ))}
              </ul>
            </div>

            <div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-3"></div>
              <ul className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="h-3 w-48 bg-gray-200 rounded"></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main Component
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-lg font-semibold text-center mb-12">
        New vs Returning Customers
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Donut Chart */}
        <div className="lg:w-1/2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Users List */}
        <div className="lg:w-1/2 flex flex-col justify-center gap-4">
          <div>
            <h3 className="font-semibold text-black mb-2">
              New Customers ({users.new.length})
            </h3>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {users.new.map((u) => (
                <li key={u._id} className="text-sm text-gray-700">
                  {u.name || u.email || "Unknown User"}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">
              Returning Customers ({users.returning.length})
            </h3>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {users.returning.map((u) => (
                <li key={u._id} className="text-sm text-gray-700">
                  {u.name || u.email || "Unknown User"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
