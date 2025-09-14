"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Phone, ArrowLeft, 
  CheckCircle, AlertCircle 
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const BarberSignup = ({ onBack }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.number.trim()) {
      newErrors.number = "Phone number is required";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.number.replace(/\D/g, ''))) {
      newErrors.number = "Invalid phone number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        ...form
      };

      console.log("Submitting data:", submissionData);
      const res = await axios.post("/api/customer/signup", submissionData);
  console.log(1)
      if (res.data.success === true || res.data.status === 200) {
          router.push("/signin");
          return;
        }
  console.log(1)
          
        setSubmitStatus({ type: "success", message: "Registration successful! You can now log in." });
  console.log(1)
      
  

    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus({ 
        type: "error", 
        message: error.response?.data?.message || "Registration failed. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-60 bg-white text-black p-4 md:p-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onBack}
        className="flex items-center text-black mb-6 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div>
              <img src="/logo.png" alt="" className="h-40 w-40 brightness-0" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">Customer Registration</h1>
          <p className="text-gray-600">Create your professional account</p>
        </div>

        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-8 p-4 rounded-lg border flex items-center ${
                submitStatus.type === "success" 
                  ? "bg-green-100 border-green-600 text-green-700" 
                  : "bg-red-100 border-red-600 text-red-700"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle size={24} className="mr-3" />
              ) : (
                <AlertCircle size={24} className="mr-3" />
              )}
              {submitStatus.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-8 border-2 mb-32 border-black/20 p-6 rounded-lg"
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="space-y-2">
              <label htmlFor="username" className="flex items-center text-sm font-medium">
                <User size={16} className="mr-2" />
                Username *
              </label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-white text-black border-2 ${
                  errors.username ? "border-red-500" : "border-black/20"
                } focus:outline-none focus:ring-2 focus:ring-black/50`}
                placeholder="Enter your username"
              />
              {errors.username && <p className="text-sm text-red-600 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.username}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center text-sm font-medium">
                <Mail size={16} className="mr-2" />
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-white text-black border ${
                  errors.email ? "border-red-500" : "border-black/20"
                } focus:outline-none focus:ring-2 focus:ring-black/50`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-sm text-red-600 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center text-sm font-medium">
                <Lock size={16} className="mr-2" />
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-white text-black border ${
                  errors.password ? "border-red-500" : "border-black/20"
                } focus:outline-none focus:ring-2 focus:ring-black/50`}
                placeholder="At least 6 characters"
              />
              {errors.password && <p className="text-sm text-red-600 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="number" className="flex items-center text-sm font-medium">
                <Phone size={16} className="mr-2" />
                Phone Number *
              </label>
              <input
                id="number"
                name="number"
                value={form.number}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-white text-black border ${
                  errors.number ? "border-red-500" : "border-black/20"
                } focus:outline-none focus:ring-2 focus:ring-black/50`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.number && <p className="text-sm text-red-600 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.number}</p>}
            </div>
          </motion.div>

          <motion.div 
            className="pt-8 border-t border-black/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 bg-white text-black cursor-pointer border-2 border-black font-semibold rounded transition flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-white"
              }`}
              whileHover={isSubmitting ? {} : { scale: 1.02 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-t-2 border-white rounded-full mr-3"
                  />
                  Processing...
                </>
              ) : (
                "Register as Barber"
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default BarberSignup;
