"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Lock, Phone, MapPin, 
  Scissors, Clock, Plus, X, Calendar,
  DollarSign, ArrowLeft, CheckCircle, AlertCircle,
  Star, Map, Building
} from "lucide-react";
import axios from "axios";

const BarberSignup = ({ onBack }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
    location: "",
    province: "",
    city: "",
    services: [{ name: "", price: "" }],
    workinghours: [{ day: "", start: "", end: "" }],
    // rating: 0,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const provinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu and Kashmir",
  "Islamabad Capital Territory"
];

  
  const citiesByProvince = {
  "Punjab": [
    "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala",
    "Sialkot", "Bahawalpur", "Sargodha", "Sheikhupura", "Rahim Yar Khan"
  ],
  "Sindh": [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Mirpur Khas",
    "Nawabshah", "Jacobabad", "Shikarpur", "Khairpur", "Dadu"
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat",
    "Dera Ismail Khan", "Charsadda", "Nowshera", "Mansehra", "Hangu"
  ],
  "Balochistan": [
    "Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi",
    "Chaman", "Zhob", "Dera Murad Jamali", "Pasni", "Usta Mohammad"
  ],
  "Gilgit-Baltistan": [
    "Gilgit", "Skardu", "Hunza", "Chilas", "Ghizer",
    "Nagar", "Ghanche", "Astore"
  ],
  "Azad Jammu and Kashmir": [
    "Muzaffarabad", "Mirpur", "Kotli", "Bhimber", "Rawalakot",
    "Bagh", "Pallandri"
  ],
  "Islamabad Capital Territory": [
    "Islamabad"
  ]
};


  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday", "Sunday"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === "province") {
      setForm(prev => ({ ...prev, city: "" }));
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...form.services];
    updatedServices[index][field] = value;
    setForm({ ...form, services: updatedServices });
    
    if (errors.services && errors.services[index] && errors.services[index][field]) {
      const updatedErrors = {...errors};
      delete updatedErrors.services[index][field];
      if (Object.keys(updatedErrors.services[index]).length === 0) {
        delete updatedErrors.services[index];
      }
      if (Object.keys(updatedErrors.services).length === 0) {
        delete updatedErrors.services;
      }
      setErrors(updatedErrors);
    }
  };

  const handleWorkingHoursChange = (index, field, value) => {
    const updatedHours = [...form.workinghours];
    updatedHours[index][field] = value;
    setForm({ ...form, workinghours: updatedHours });
    
    if (errors.workinghours && errors.workinghours[index] && errors.workinghours[index][field]) {
      const updatedErrors = {...errors};
      delete updatedErrors.workinghours[index][field];
      if (Object.keys(updatedErrors.workinghours[index]).length === 0) {
        delete updatedErrors.workinghours[index];
      }
      if (Object.keys(updatedErrors.workinghours).length === 0) {
        delete updatedErrors.workinghours;
      }
      setErrors(updatedErrors);
    }
  };

  const addService = () => {
    setForm({
      ...form,
      services: [...form.services, { name: "", price: "" }]
    });
  };

  const removeService = (index) => {
    if (form.services.length === 1) return;
    const updatedServices = [...form.services];
    updatedServices.splice(index, 1);
    setForm({ ...form, services: updatedServices });
  };

  const addWorkingHours = () => {
    setForm({
      ...form,
      workinghours: [...form.workinghours, { day: "", start: "", end: "" }]
    });
  };

  const removeWorkingHours = (index) => {
    if (form.workinghours.length === 1) return;
    const updatedHours = [...form.workinghours];
    updatedHours.splice(index, 1);
    setForm({ ...form, workinghours: updatedHours });
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

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!form.province) {
      newErrors.province = "Province is required";
    }

    if (!form.city) {
      newErrors.city = "City is required";
    }

    const serviceErrors = [];
    form.services.forEach((service, index) => {
      const serviceError = {};
      if (!service.name.trim()) {
        serviceError.name = "Service name is required";
      }
      if (!service.price) {
        serviceError.price = "Price is required";
      } else if (isNaN(service.price) || parseFloat(service.price) <= 0) {
        serviceError.price = "Price must be a valid number greater than 0";
      }
      if (Object.keys(serviceError).length > 0) {
        serviceErrors[index] = serviceError;
      }
    });
    if (serviceErrors.length > 0) {
      newErrors.services = serviceErrors;
    }

    const hoursErrors = [];
    const daysSet = new Set();
    
    form.workinghours.forEach((hour, index) => {
      const hourError = {};
      
      if (!hour.day) {
        hourError.day = "Day is required";
      } else if (daysSet.has(hour.day)) {
        hourError.day = "Duplicate day";
      } else {
        daysSet.add(hour.day);
      }
      
      if (!hour.start) {
        hourError.start = "Start time is required";
      }
      
      if (!hour.end) {
        hourError.end = "End time is required";
      } else if (hour.start && hour.end && hour.start >= hour.end) {
        hourError.end = "End time must be after start time";
      }
      
      if (Object.keys(hourError).length > 0) {
        hoursErrors[index] = hourError;
      }
    });
    
    if (hoursErrors.length > 0) {
      newErrors.workinghours = hoursErrors;
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
        ...form,
        services: form.services.map(service => ({
          name: service.name,
          price: parseFloat(service.price)
        }))
      };

      console.log("Submitting data:", submissionData);
     let res = await axios.post("/api/barber/signup", submissionData);
      if (res.data.success || res.data.status === 200) {
        router.push("/signin");
      }
      setSubmitStatus({ type: "success", message: "Registration successful! You can now log in." });
      
      setForm({
        username: "",
        email: "",
        password: "",
        number: "",
        location: "",
        province: "",
        city: "",
        services: [{ name: "", price: "" }],
        workinghours: [{ day: "", start: "", end: "" }],
        // rating: 0,
      });
      
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onBack}
          className="flex items-center text-white mb-6 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </motion.button>
      <div className=" max-w-2xl mx-auto mb-28" >

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div>
                <img src="/logo.png" alt="logo" className="h-40 w-40 invert brightness-0"/>
              </div>
              {/* <div className="w-28 h-28 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"> */}
                {/* <Scissors size={48} className="text-white" /> */}
              {/* </div> */}
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">Barber Registration</h1>
            <p className="text-gray-400">Create your professional profile to start accepting clients</p>
          </div>

          <AnimatePresence>
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-8 p-4 rounded-lg border flex items-center ${
                  submitStatus.type === "success" 
                    ? "bg-green-950/20 border-green-500 text-green-300" 
                    : "bg-red-950/20 border-red-500 text-red-300"
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
            className="space-y-8 border border-gray-700 rounded-xl p-6 bg-gray-800/30 backdrop-blur-sm shadow-xl"
          >
            {/* Basic Information Section */}
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
                  className={`w-full p-3 rounded bg-gray-900 text-white border ${
                    errors.username ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  placeholder="Enter your username"
                />
                {errors.username && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.username}</p>}
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
                  className={`w-full p-3 rounded bg-gray-900 text-white border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.email}</p>}
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
                  className={`w-full p-3 rounded bg-gray-900 text-white border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  placeholder="At least 6 characters"
                />
                {errors.password && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.password}</p>}
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
                  className={`w-full p-3 rounded bg-gray-900 text-white border ${
                    errors.number ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.number && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.number}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="flex items-center text-sm font-medium">
                  <MapPin size={16} className="mr-2" />
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={`w-full p-3 rounded bg-gray-900 text-white border ${
                    errors.location ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  placeholder="Your barbershop address"
                />
                {errors.location && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.location}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="province" className="flex items-center text-sm font-medium">
                  <Map size={16} className="mr-2" />
                  Province *
                </label>
                <select
                  id="province"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className={`w-full p-3 rounded bg-gray-900 text-white border ${
                    errors.province ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.province}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="flex items-center text-sm font-medium">
                  <Building size={16} className="mr-2" />
                  City *
                </label>
                <select
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  disabled={!form.province}
                  className={`w-full p-3 rounded bg-gray-900 text-white border ${
                    errors.city ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50`}
                >
                  <option value="">Select City</option>
                  {form.province && citiesByProvince[form.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.city}</p>}
              </div>

              {/* <div className="space-y-2">
                <label htmlFor="rating" className="flex items-center text-sm font-medium">
                  <Star size={16} className="mr-2" />
                  Initial Rating (optional)
                </label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="0.0"
                />
              </div> */}
            </motion.div>

            {/* Services Section */}
            <motion.div 
              className="pt-8 border-t border-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Scissors size={20} className="mr-2" />
                Services Offered *
              </h2>
              {form.services.map((service, index) => (
                <motion.div 
                  key={index} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <div className="md:col-span-5 space-y-2">
                    <label htmlFor={`service-name-${index}`} className="block text-sm font-medium">Service Name</label>
                    <input
                      id={`service-name-${index}`}
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                      className={`w-full p-3 rounded bg-gray-900 text-white border ${
                        errors.services && errors.services[index] && errors.services[index].name 
                          ? "border-red-500" 
                          : "border-gray-700"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      placeholder="e.g., Haircut, Beard Trim"
                    />
                    {errors.services && errors.services[index] && errors.services[index].name && (
                      <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.services[index].name}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-5 space-y-2">
                    <label htmlFor={`service-price-${index}`} className="block text-sm font-medium">Price ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                      <input
                        id={`service-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={service.price}
                        onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                        className={`w-full pl-9 p-3 rounded bg-gray-900 text-white border ${
                          errors.services && errors.services[index] && errors.services[index].price 
                            ? "border-red-500" 
                            : "border-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.services && errors.services[index] && errors.services[index].price && (
                      <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.services[index].price}</p>
                    )}
                  </div>
                  
                  <div className="h-full flex items-center">
                    {form.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="py-3 px-4 bg-gray-800 border border-gray-700 rounded hover:border-red-500 hover:text-red-500 text-white transition flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              
              <motion.button
                type="button"
                onClick={addService}
                className="py-2 px-4 bg-gray-800 border border-gray-700 hover:border-white text-white rounded transition flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} className="mr-2" />
                Add Another Service
              </motion.button>
            </motion.div>

            {/* Working Hours Section */}
            <motion.div 
              className="pt-8 border-t border-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Clock size={20} className="mr-2" />
                Working Hours *
              </h2>
              {form.workinghours.map((hour, index) => (
                <motion.div 
                  key={index} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <div className="md:col-span-3 space-y-2">
                    <label htmlFor={`day-${index}`} className="block text-sm font-medium">Day</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                      <select
                        id={`day-${index}`}
                        value={hour.day}
                        onChange={(e) => handleWorkingHoursChange(index, "day", e.target.value)}
                        className={`w-full pl-9 p-3 rounded bg-gray-900 text-white border appearance-none ${
                          errors.workinghours && errors.workinghours[index] && errors.workinghours[index].day 
                            ? "border-red-500" 
                            : "border-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      >
                        <option value="">Select day</option>
                        {daysOfWeek.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    {errors.workinghours && errors.workinghours[index] && errors.workinghours[index].day && (
                      <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.workinghours[index].day}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-3 space-y-2">
                    <label htmlFor={`start-${index}`} className="block text-sm font-medium">Start Time</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                      <input
                        id={`start-${index}`}
                        type="time"
                        value={hour.start}
                        onChange={(e) => handleWorkingHoursChange(index, "start", e.target.value)}
                        className={`w-full pl-9 p-3 rounded bg-gray-900 text-white border ${
                          errors.workinghours && errors.workinghours[index] && errors.workinghours[index].start 
                            ? "border-red-500" 
                            : "border-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      />
                    </div>
                    {errors.workinghours && errors.workinghours[index] && errors.workinghours[index].start && (
                      <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.workinghours[index].start}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-3 space-y-2">
                    <label htmlFor={`end-${index}`} className="block text-sm font-medium">End Time</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                      <input
                        id={`end-${index}`}
                        type="time"
                        value={hour.end}
                        onChange={(e) => handleWorkingHoursChange(index, "end", e.target.value)}
                        className={`w-full pl-9 p-3 rounded bg-gray-900 text-white border ${
                          errors.workinghours && errors.workinghours[index] && errors.workinghours[index].end 
                            ? "border-red-500" 
                            : "border-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      />
                    </div>
                    {errors.workinghours && errors.workinghours[index] && errors.workinghours[index].end && (
                      <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.workinghours[index].end}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-3 flex items-end h-12">
                    {form.workinghours.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkingHours(index)}
                        className="w-full py-3 px-4 bg-gray-800 border border-gray-700 hover:border-red-500 hover:text-red-500 text-white rounded transition flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              
              <motion.button
                type="button"
                onClick={addWorkingHours}
                className="py-2 px-4 bg-gray-800 border border-gray-700 hover:border-white  text-white rounded transition flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} className="mr-2" />
                Add Another Time Slot
              </motion.button>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="pt-8 border-t border-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 bg-black border-2 cursor-pointer border-white text-white font-semibold rounded transition flex items-center justify-center`}
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
    </div>
  );
};

export default BarberSignup;
// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   User, Mail, Lock, Phone, MapPin, 
//   Scissors, Clock, Plus, X, Calendar,
//   DollarSign, ArrowLeft, CheckCircle, AlertCircle
// } from "lucide-react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// const BarberSignup = ({ onBack }) => {
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     number: "",
//     location: "",
//     services: [{ name: "", price: "" }],
//     workinghours: [{ day: "", start: "", end: "" }],
//   });
//   const router = useRouter();
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   const daysOfWeek = [
//     "Monday", "Tuesday", "Wednesday", "Thursday", 
//     "Friday", "Saturday", "Sunday"
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleServiceChange = (index, field, value) => {
//     const updatedServices = [...form.services];
//     updatedServices[index][field] = value;
//     setForm({ ...form, services: updatedServices });
    
//     if (errors.services && errors.services[index] && errors.services[index][field]) {
//       const updatedErrors = {...errors};
//       delete updatedErrors.services[index][field];
//       if (Object.keys(updatedErrors.services[index]).length === 0) {
//         delete updatedErrors.services[index];
//       }
//       if (Object.keys(updatedErrors.services).length === 0) {
//         delete updatedErrors.services;
//       }
//       setErrors(updatedErrors);
//     }
//   };

//   const handleWorkingHoursChange = (index, field, value) => {
//     const updatedHours = [...form.workinghours];
//     updatedHours[index][field] = value;
//     setForm({ ...form, workinghours: updatedHours });
    
//     if (errors.workinghours && errors.workinghours[index] && errors.workinghours[index][field]) {
//       const updatedErrors = {...errors};
//       delete updatedErrors.workinghours[index][field];
//       if (Object.keys(updatedErrors.workinghours[index]).length === 0) {
//         delete updatedErrors.workinghours[index];
//       }
//       if (Object.keys(updatedErrors.workinghours).length === 0) {
//         delete updatedErrors.workinghours;
//       }
//       setErrors(updatedErrors);
//     }
//   };

//   const addService = () => {
//     setForm({
//       ...form,
//       services: [...form.services, { name: "", price: "" }]
//     });
//   };

//   const removeService = (index) => {
//     if (form.services.length === 1) return;
//     const updatedServices = [...form.services];
//     updatedServices.splice(index, 1);
//     setForm({ ...form, services: updatedServices });
//   };

//   const addWorkingHours = () => {
//     setForm({
//       ...form,
//       workinghours: [...form.workinghours, { day: "", start: "", end: "" }]
//     });
//   };

//   const removeWorkingHours = (index) => {
//     if (form.workinghours.length === 1) return;
//     const updatedHours = [...form.workinghours];
//     updatedHours.splice(index, 1);
//     setForm({ ...form, workinghours: updatedHours });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!form.username.trim()) {
//       newErrors.username = "Username is required";
//     }

//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
//       newErrors.email = "Invalid email address";
//     }

//     if (!form.password) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!form.number.trim()) {
//       newErrors.number = "Phone number is required";
//     } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.number.replace(/\D/g, ''))) {
//       newErrors.number = "Invalid phone number";
//     }

//     if (!form.location.trim()) {
//       newErrors.location = "Location is required";
//     }

//     const serviceErrors = [];
//     form.services.forEach((service, index) => {
//       const serviceError = {};
//       if (!service.name.trim()) {
//         serviceError.name = "Service name is required";
//       }
//       if (!service.price) {
//         serviceError.price = "Price is required";
//       } else if (isNaN(service.price) || parseFloat(service.price) <= 0) {
//         serviceError.price = "Price must be a valid number greater than 0";
//       }
//       if (Object.keys(serviceError).length > 0) {
//         serviceErrors[index] = serviceError;
//       }
//     });
//     if (serviceErrors.length > 0) {
//       newErrors.services = serviceErrors;
//     }

//     const hoursErrors = [];
//     const daysSet = new Set();
    
//     form.workinghours.forEach((hour, index) => {
//       const hourError = {};
      
//       if (!hour.day) {
//         hourError.day = "Day is required";
//       } else if (daysSet.has(hour.day)) {
//         hourError.day = "Duplicate day";
//       } else {
//         daysSet.add(hour.day);
//       }
      
//       if (!hour.start) {
//         hourError.start = "Start time is required";
//       }
      
//       if (!hour.end) {
//         hourError.end = "End time is required";
//       } else if (hour.start && hour.end && hour.start >= hour.end) {
//         hourError.end = "End time must be after start time";
//       }
      
//       if (Object.keys(hourError).length > 0) {
//         hoursErrors[index] = hourError;
//       }
//     });
    
//     if (hoursErrors.length > 0) {
//       newErrors.workinghours = hoursErrors;
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const submissionData = {
//         ...form,
//         services: form.services.map(service => ({
//           name: service.name,
//           price: parseFloat(service.price)
//         }))
//       };

//       console.log("Submitting data:", submissionData);
//       const res = await axios.post("/api/barber/signup", submissionData);
//       router.push("/signin");
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       setSubmitStatus({ type: "success", message: "Registration successful! You can now log in." });
      
//       setForm({
//         username: "",
//         email: "",
//         password: "",
//         number: "",
//         location: "",
//         services: [{ name: "", price: "" }],
//         workinghours: [{ day: "", start: "", end: "" }],
//       });
      
//     } catch (error) {
//       console.error("Registration error:", error);
//       setSubmitStatus({ 
//         type: "error", 
//         message: error.response?.data?.message || "Registration failed. Please try again." 
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen  pb-60 bg-black text-white p-4 md:p-8">
//       <motion.button
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//         onClick={onBack}
//         className="flex items-center text-white mb-6 hover:text-gray-300 transition-colors"
//       >
//         <ArrowLeft size={20} className="mr-2" />
//         Back
//       </motion.button>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         className="max-w-2xl mx-auto"
//       >
//         <div className="text-center mb-10">
//           <motion.div
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="flex justify-center mb-6"
//           >
//             {/* <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
//               <Scissors size={40} className="text-black" />
//             </div> */}
//           <div>
//             <img src="/logo.png" alt="" className="h-40 w-40 invert brightness-0" />
//           </div>
//           </motion.div>
//           <h1 className="text-4xl font-bold mb-2">Barber Registration</h1>
//           <p className="text-gray-400">Create your professional profile to start accepting clients</p>
//         </div>

//         <AnimatePresence>
//           {submitStatus && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className={`mb-8 p-4 rounded-lg border flex items-center ${
//                 submitStatus.type === "success" 
//                   ? "bg-green-950/20 border-green-500 text-green-300" 
//                   : "bg-red-950/20 border-red-500 text-red-300"
//               }`}
//             >
//               {submitStatus.type === "success" ? (
//                 <CheckCircle size={24} className="mr-3" />
//               ) : (
//                 <AlertCircle size={24} className="mr-3" />
//               )}
//               {submitStatus.message}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <motion.form
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//           onSubmit={handleSubmit}
//           className="space-y-8 border-2 mb-32 border-white/20 p-6 rounded-lg"
//         >
//           {/* Basic Information Section */}
//           <motion.div 
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.5 }}
//           >
//             <div className="space-y-2">
//               <label htmlFor="username" className="flex items-center text-sm font-medium">
//                 <User size={16} className="mr-2" />
//                 Username *
//               </label>
//               <input
//                 id="username"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded  bg-black text-white border-2  ${
//                   errors.username ? "border-red-500" : "border-white/20"
//                 } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                 placeholder="Enter your username"
//               />
//               {errors.username && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.username}</p>}
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="email" className="flex items-center text-sm font-medium">
//                 <Mail size={16} className="mr-2" />
//                 Email *
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded bg-black text-white border ${
//                   errors.email ? "border-red-500" : "border-white/20"
//                 } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                 placeholder="your.email@example.com"
//               />
//               {errors.email && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.email}</p>}
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="password" className="flex items-center text-sm font-medium">
//                 <Lock size={16} className="mr-2" />
//                 Password *
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded bg-black text-white border ${
//                   errors.password ? "border-red-500" : "border-white/20"
//                 } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                 placeholder="At least 6 characters"
//               />
//               {errors.password && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.password}</p>}
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="number" className="flex items-center text-sm font-medium">
//                 <Phone size={16} className="mr-2" />
//                 Phone Number *
//               </label>
//               <input
//                 id="number"
//                 name="number"
//                 value={form.number}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded bg-black text-white border ${
//                   errors.number ? "border-red-500" : "border-white/20"
//                 } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                 placeholder="+1 (555) 123-4567"
//               />
//               {errors.number && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.number}</p>}
//             </div>

//             <div className="md:col-span-2 space-y-2">
//               <label htmlFor="location" className="flex items-center text-sm font-medium">
//                 <MapPin size={16} className="mr-2" />
//                 Location *
//               </label>
//               <input
//                 id="location"
//                 name="location"
//                 value={form.location}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded bg-black text-white border ${
//                   errors.location ? "border-red-500" : "border-white/20"
//                 } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                 placeholder="Your barbershop address"
//               />
//               {errors.location && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.location}</p>}
//             </div>
//           </motion.div>

//           {/* Services Section */}
//           <motion.div 
//             className="pt-8 border-t border-white/20"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.5 }}
//           >
//             <h2 className="text-xl font-semibold mb-6 flex items-center">
//               <Scissors size={20} className="mr-2" />
//               Services Offered *
//             </h2>
//             {form.services.map((service, index) => (
//               <motion.div 
//                 key={index} 
//                 className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-center "
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 * index, duration: 0.3 }}
//               >
//                 <div className="md:col-span-5 space-y-2">
//                   <label htmlFor={`service-name-${index}`} className="block text-sm font-medium">Service Name</label>
//                   <input
//                     id={`service-name-${index}`}
//                     value={service.name}
//                     onChange={(e) => handleServiceChange(index, "name", e.target.value)}
//                     className={`w-full p-3 rounded bg-black text-white border ${
//                       errors.services && errors.services[index] && errors.services[index].name 
//                         ? "border-red-500" 
//                         : "border-white/20"
//                     } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                     placeholder="e.g., Haircut, Beard Trim"
//                   />
//                   {errors.services && errors.services[index] && errors.services[index].name && (
//                     <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.services[index].name}</p>
//                   )}
//                 </div>
                
//                 <div className="md:col-span-5 space-y-2">
//                   <label htmlFor={`service-price-${index}`} className="block text-sm font-medium">Price ($)</label>
//                   <div className="relative">
//                     <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
//                     <input
//                       id={`service-price-${index}`}
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={service.price}
//                       onChange={(e) => handleServiceChange(index, "price", e.target.value)}
//                       className={`w-full pl-9 p-3 rounded bg-black text-white border ${
//                         errors.services && errors.services[index] && errors.services[index].price 
//                           ? "border-red-500" 
//                           : "border-white/20"
//                       } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                       placeholder="0.00"
//                     />
//                   </div>
//                   {errors.services && errors.services[index] && errors.services[index].price && (
//                     <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.services[index].price}</p>
//                   )}
//                 </div>
                
//                 <div className="h-full  flex items-center   ">
//                   {form.services.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeService(index)}
//                       className=" py-3 mt-[20px] px-4 bg-black border border-white/20 rounded-full hover:border-red-500 hover:text-red-500 text-white transition flex items-center justify-center"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
            
//             <motion.button
//               type="button"
//               onClick={addService}
//               className="py-2 px-4 bg-black border border-white/20 hover:border-white text-white rounded transition flex items-center"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <Plus size={16} className="mr-2" />
//               Add Another Service
//             </motion.button>
//           </motion.div>

//           {/* Working Hours Section */}
//           <motion.div 
//             className="pt-8 border-t border-white/20"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.5 }}
//           >
//             <h2 className="text-xl font-semibold mb-6 flex items-center">
//               <Clock size={20} className="mr-2" />
//               Working Hours *
//             </h2>
//             {form.workinghours.map((hour, index) => (
//               <motion.div 
//                 key={index} 
//                 className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-start"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 * index, duration: 0.3 }}
//               >
//                 <div className="md:col-span-3 space-y-2">
//                   <label htmlFor={`day-${index}`} className="block text-sm font-medium">Day</label>
//                   <div className="relative">
//                     <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
//                     <select
//                       id={`day-${index}`}
//                       value={hour.day}
//                       onChange={(e) => handleWorkingHoursChange(index, "day", e.target.value)}
//                       className={`w-full pl-9 p-3 rounded bg-black text-white border appearance-none ${
//                         errors.workinghours && errors.workinghours[index] && errors.workinghours[index].day 
//                           ? "border-red-500" 
//                           : "border-white/20"
//                       } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                     >
//                       <option value="">Select day</option>
//                       {daysOfWeek.map(day => (
//                         <option key={day} value={day}>{day}</option>
//                       ))}
//                     </select>
//                   </div>
//                   {errors.workinghours && errors.workinghours[index] && errors.workinghours[index].day && (
//                     <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.workinghours[index].day}</p>
//                   )}
//                 </div>
                
//                 <div className="md:col-span-3 space-y-2">
//                   <label htmlFor={`start-${index}`} className="block text-sm font-medium">Start Time</label>
//                   <div className="relative">
//                     <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
//                     <input
//                       id={`start-${index}`}
//                       type="time"
//                       value={hour.start}
//                       onChange={(e) => handleWorkingHoursChange(index, "start", e.target.value)}
//                       className={`w-full pl-9 p-3 rounded bg-black text-white border ${
//                         errors.workinghours && errors.workinghours[index] && errors.workinghours[index].start 
//                           ? "border-red-500" 
//                           : "border-white/20"
//                       } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                     />
//                   </div>
//                   {errors.workinghours && errors.workinghours[index] && errors.workinghours[index].start && (
//                     <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.workinghours[index].start}</p>
//                   )}
//                 </div>
                
//                 <div className="md:col-span-3 space-y-2">
//                   <label htmlFor={`end-${index}`} className="block text-sm font-medium">End Time</label>
//                   <div className="relative">
//                     <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
//                     <input
//                       id={`end-${index}`}
//                       type="time"
//                       value={hour.end}
//                       onChange={(e) => handleWorkingHoursChange(index, "end", e.target.value)}
//                       className={`w-full pl-9 p-3 rounded bg-black text-white border ${
//                         errors.workinghours && errors.workinghours[index] && errors.workinghours[index].end 
//                           ? "border-red-500" 
//                           : "border-white/20"
//                       } focus:outline-none focus:ring-2 focus:ring-white/50`}
//                     />
//                   </div>
//                   {errors.workinghours && errors.workinghours[index] && errors.workinghours[index].end && (
//                     <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle size={14} className="mr-1" /> {errors.workinghours[index].end}</p>
//                   )}
//                 </div>
                
//                 <div className="md:col-span-3 flex items-end h-12">
//                   {form.workinghours.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeWorkingHours(index)}
//                       className="w-full py-3 px-4 bg-black border border-white/20 hover:border-red-500 hover:text-red-500 text-white rounded transition flex items-center justify-center"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
            
//             <motion.button
//               type="button"
//               onClick={addWorkingHours}
//               className="py-2 px-4 bg-black border border-white/20 hover:border-white text-white rounded transition flex items-center"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <Plus size={16} className="mr-2" />
//               Add Another Time Slot
//             </motion.button>
//           </motion.div>

//           {/* Submit Button */}
//           <motion.div 
//             className="pt-8 border-t border-white/20"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6, duration: 0.5 }}
//           >
//             <motion.button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-4 px-6 bg-black text-white cursor-pointer border-2 border-white font-semibold rounded transition flex items-center justify-center ${
//                 isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-black"
//               }`}
//               whileHover={isSubmitting ? {} : { scale: 1.02 }}
//               whileTap={isSubmitting ? {} : { scale: 0.98 }}
//             >
//               {isSubmitting ? (
//                 <>
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     className="h-5 w-5 border-t-2 border-black rounded-full mr-3"
//                   />
//                   Processing...
//                 </>
//               ) : (
//                 "Register as Barber"
//               )}
//             </motion.button>
//           </motion.div>
//         </motion.form>
//       </motion.div>
//     </div>
//   );
// };

// export default BarberSignup;