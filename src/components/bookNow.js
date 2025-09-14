"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MapPin, Clock, User, Check, Calendar } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

const BookNow = ({ barber, handleClose }) => {
  const [open, setOpen] = useState(true);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
 
const {data:session} = useSession();
const user = session?.user || session?.username || null;
  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [open]);

  // Generate time slots based on barber.workinghours
  useEffect(() => {
    if (!date) {
      setAvailableTimes([]);
      return;
    }
    
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    
    const workingDay = barber.workinghours?.find((wh) => wh.day === dayOfWeek);
    
    if (!workingDay) {
      setAvailableTimes([]);
      return;
    }

    const times = [];
    const [startHour, startMinute] = workingDay.start.split(":").map(Number);
    const [endHour, endMinute] = workingDay.end.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")}`;
      times.push(timeString);

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute -= 60;
      }
    }

    setAvailableTimes(times);
    setTime("");
  }, [date, barber?.workinghours]);

  const handleSubmit = async (e) => {
    if (!session) {
      alert("Please log in to book an appointment.");
      return;
    }else{
      console.log(session,"this is the session")
    }
    e.preventDefault();
    
    if (!selectedService || !date || !time) {
      alert("Please choose a service, date and time.");
      return;
    }

    if (!user) {
      alert("Please log in to book an appointment.");
      return;
    }

    const service = barber.services?.find((s) => s._id === selectedService);
    
    try {
      setLoading(true);
      
      const bookingData = {
        customerId: user.id,
        barber:barber,
        barberId: barber._id,
        services: [{
          name: service.name,
          price: service.price
        }],
        date: new Date(date).toISOString(),
        time: time,
        status: "pending"
      };

      const response = await axios.post('/api/bookings', bookingData);
      
      if (response.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 3);
  const maxDateFormatted = maxDate.toISOString().split("T")[0];

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (typeof handleClose === "function") handleClose(false);
      }}
    >
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        
          {/* Centered modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 680 }}
              className="w-full bg-white rounded-2xl z-51 shadow-2xl overflow-hidden ring-1 ring-black/5"
            >
              {/* Header */}
              <div className="flex items-start gap-3 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
                    {barber?.username?.charAt(0)?.toUpperCase() || <User />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {barber?.username}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {barber?.city || "Unknown city"}
                        {barber?.province ? `, ${barber.province}` : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full text-sm">
                    <span className="font-medium text-amber-700">
                      {barber?.rating ?? "New"}
                    </span>
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
                {bookingSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Booking Confirmed!
                    </h3>
                    <p className="text-gray-600">
                      Your appointment has been successfully booked.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Quick info row */}
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{barber?.number || "No phone"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {barber?.workinghours?.length
                            ? "Working hours available"
                            : "No working hours"}
                        </span>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Select a service
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {barber.services?.map((service) => (
                          <motion.button
                            key={service._id}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => setSelectedService(service._id)}
                            className={`flex flex-col p-3 border rounded-lg text-left transition ${
                              selectedService === service._id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{service.name}</span>
                              <span className="text-sm font-semibold">Rs. {service.price}</span>
                            </div>
                            {selectedService === service._id && (
                              <div className="mt-2 flex items-center text-xs text-blue-600">
                                <Check className="w-3 h-3 mr-1" />
                                Selected
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Booking form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={date}
                            min={minDate}
                            max={maxDateFormatted}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {date && availableTimes.length === 0 && (
                          <p className="text-red-500 text-xs mt-1">
                            Barber is not available on this day
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <select
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                          disabled={availableTimes.length === 0}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select a time</option>
                          {availableTimes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!selectedService || availableTimes.length === 0 || loading}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookNow;
