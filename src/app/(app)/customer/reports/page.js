"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Send,
  CheckCircle,
  XCircle,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const id = session?.user?.id || session?.user?._id; // ✅ get user id safely

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    report: "",
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setMessage("You must be logged in to submit a report.");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // ✅ include `userId` in the payload
      const res = await axios.post("/api/report", {
        ...formData,
        customerId: id,
      });

      setMessage(res.data.message);
      setIsSuccess(true);
      setFormData({ username: "", email: "", report: "" });
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Something went wrong. Try again."
      );
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Report an Issue
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Let us know what&apos;s wrong and we&apos;ll fix it ASAP. Email and
            username are optional.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center ${
                  isSuccess
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="Your username"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Report */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Details <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="report"
                  value={formData.report}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                  placeholder="Please describe the issue in detail..."
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                  ></motion.div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Report
                </>
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <p className="text-center text-gray-500 text-xs mt-6">
            We typically respond to reports within 24 hours
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
