"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, User, Scissors } from "lucide-react";

const RecentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments(pagination.page);
  }, [pagination.page]);

  const fetchAppointments = async (page) => {
    try {
      setLoading(true);
      setError("");

      const skip = (page - 1) * pagination.limit;
      const res = await axios.get(
        `/api/barber/completedappointment?skip=${skip}&limit=${pagination.limit}`
      );

      setAppointments(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: res.data.pagination.totalPages,
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Inline Skeleton Loader
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
        <div className="h-4 w-16 bg-gray-300 rounded-full"></div>
      </div>
      <div className="h-3 w-40 bg-gray-200 rounded"></div>
      <div className="h-3 w-32 bg-gray-200 rounded"></div>
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">📅 Recent Completed Appointments</h2>

      {/* Error State */}
      {error && (
        <p className="text-red-500 text-center font-medium">{error}</p>
      )}

      {/* Skeleton Loader */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: pagination.limit }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* No Data */}
      {!loading && !error && appointments.length === 0 && (
        <p className="text-gray-500 text-center">No appointments found.</p>
      )}

      {/* Appointments */}
      <div className="grid gap-4 md:grid-cols-2">
        {!loading &&
          appointments.map((appt, index) => (
            <motion.div
              key={appt._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize">
                  {appt.barberId?.username || "Unknown Barber"}
                </h3>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    appt.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : appt.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(appt.date).toLocaleDateString()} at {appt.time}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {appt.customerId?.username || "Guest"}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Scissors className="w-4 h-4" />
                {appt.services?.map((s) => s.name).join(", ") || "N/A"}
              </div>
            </motion.div>
          ))}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((p) => ({ ...p, page: p.page - 1 }))
            }
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() =>
              setPagination((p) => ({ ...p, page: p.page + 1 }))
            }
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAppointments;
