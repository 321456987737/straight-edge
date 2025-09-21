"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock1 } from "lucide-react";

const Showreports = () => {
  const [reports, setreports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Fetch customers with pagination
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `/api/admin/report?page=${page}&limit=${limit}`
        );
        setreports(res.data.reports);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, [page]);

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((customer) => (
          <motion.div
            key={customer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center"
          >
            {/* Avatar */}
            {/* Info */}
            <h2 className="text-lg font-semibold">{customer.username || "username not given"}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-4 h-4" /> {customer.email || "email not given"}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone className="w-4 h-4" /> {customer.report || "N/A"}
            </p>
            {/* Location */}
            <div className="flex flex-col gap-1 text-sm text-gray-500 mt-3">
              <p className="flex items-center gap-1">
                <Clock1 className="w-4 h-4" /> {new Date(customer.createdAt).toLocaleDateString() || "Unknown"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-900"
          }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              num === page
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            page === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-900"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Showreports;