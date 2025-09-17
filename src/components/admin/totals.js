"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Scissors, Calendar, CheckCircle } from "lucide-react";

const Totals = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [totalBarber, setTotalBarber] = useState(0);
  const [totalappointment, setTotalappointment] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/totals");
      setTotalUser(res.data.totals.customers);
      setTotalBarber(res.data.totals.barbers);
      setTotalappointment(res.data.totals.appointments);
      setCompletedAppointments(res.data.totals.completedAppointment);
    } catch (error) {
      console.error("Error fetching totals:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Users",
      value: totalUser,
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-black" />,
    },
    {
      label: "Barbers",
      value: totalBarber,
      icon: <Scissors className="w-6 h-6 md:w-8 md:h-8 text-black" />,
    },
    {
      label: "Appointments",
      value: totalappointment,
      icon: <Calendar className="w-6 h-6 md:w-8 md:h-8 text-black" />,
    },
    {
      label: "Completed",
      value: completedAppointments,
      icon: <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-black" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 md:p-6 p-2">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 md:gap-4 bg-white shadow-lg border border-black rounded-xl md:rounded-2xl p-3 md:p-5 hover:shadow-xl transition"
        >
          <div className="flex-shrink-0">{stat.icon}</div>
          <div>
            <motion.h3
              key={stat.value}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-lg md:text-2xl font-bold"
            >
              {loading ? "..." : stat.value}
            </motion.h3>
            <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Totals;
