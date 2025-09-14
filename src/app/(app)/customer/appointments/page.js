"use client";
import React, { useState, useEffect } from "react";
import {
  Scissors,
  Search,
  Calendar,
  MapPin,
  User,
  Edit,
  Clock,
  Phone,
  Mail,
  Save,
  X,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import BookNow from "@/components/bookNow";
import Link from "next/link";

const Dashboard = () => {
  const [bookingComponent, setBookingComponent] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editFormData, setEditFormData] = useState({ date: "", time: "" });
  const [recommendedBarbers, setrecommendedBarbers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  let id = session?.user?.id || session?.user?._id;

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;
    try {
      const response = await axios.get(`/api/customerdata/${id}`);
      const appointmentsResponse = await axios.get(`/api/appointments/${id}`);
      setAppointments(appointmentsResponse.data.appointments || []);
      setUser(response.data.customerData);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleAppointmentUpdate = async (appointmentId) => {
    try {
      const response = await axios.put(
        `/api/appointments/${appointmentId}`,
        editFormData
      );

      const updatedAppointment = response.data?.appointment || response.data;

      if (!updatedAppointment) {
        throw new Error("No updated appointment data received");
      }

      setAppointments(
        appointments.map((app) => {
          if (app && app._id === appointmentId) {
            return {
              ...app,
              date: updatedAppointment.date || app.date,
              time: updatedAppointment.time || app.time,
            };
          }
          return app;
        })
      );

      setEditingAppointment(null);
      setEditFormData({ date: "", time: "" });
    } catch (err) {
      console.error("Failed to update appointment:", err);
      alert("Failed to update appointment. Please try again.");
    }
  };

  const handleAppointmentCancel = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`/api/appointments/${appointmentId}`);
      setAppointments(
        appointments.filter((app) => app && app._id !== appointmentId)
      );
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const startEditing = (appointment) => {
    if (!appointment) return;

    setEditingAppointment(appointment._id);
    setEditFormData({
      date: appointment.date ? appointment.date.split("T")[0] : "",
      time: appointment.time || "",
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter((app) => {
      if (!app || !app.date) return false;
      const appointmentDate = new Date(app.date);
      return app.status === "pending" && appointmentDate > now;
    });
  };

  const getCompletedAppointments = () => {
    return appointments.filter((app) => app && app.status === "completed");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    recommenderbarbersfetch();
  }, []);

  const recommenderbarbersfetch = async () => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("topRated", "true");
      const response = await axios.get(
        `/api/barber/barbers?${searchParams.toString()}`
      );
      setrecommendedBarbers(response.data.topRatedBarbers);
    } catch (err) {
      console.log(err);
    }
  };

  const upcomingAppointments = getUpcomingAppointments();
  const completedAppointments = getCompletedAppointments();

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Welcome, {user?.username || "User"}!
        </h1>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-700 border border-gray-300"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-50 rounded-lg p-4 mb-6 shadow-md">
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/customer" 
              className="p-3 bg-blue-600 text-white font-medium rounded-lg text-center text-sm flex flex-col items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar size={18} className="mb-1" />
              <span>Book Now</span>
            </Link>
            <Link 
              href="/customer" 
              className="p-3 bg-gray-800 text-white rounded-lg text-center text-sm flex flex-col items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search size={18} className="mb-1" />
              <span>Find Barbers</span>
            </Link>
            <Link 
              href="/customer" 
              className="p-3 bg-green-600 text-white rounded-lg text-center text-sm flex flex-col items-center col-span-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} className="mb-1" />
              <span>New Booking</span>
            </Link>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.username || "User"}!
          </h1>
          <p className="text-gray-600 mt-2 text-base md:text-lg">
            Manage your bookings, explore new barbers, and schedule your next
            appointment.
          </p>
        </div>
      </div>

      {/* User Info Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center sm:w-16 sm:h-16">
            <User size={24} className="text-blue-600 sm:size-7" />
          </div>
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">Personal Information</h2>
            <p className="text-gray-600 text-sm">Your account details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="p-2 bg-gray-50 rounded-lg text-sm md:text-base">
              {user?.username || "Not available"}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Mail size={16} className="text-gray-500 flex-shrink-0" />
              <span className="text-sm truncate md:text-base">{user?.email || "Not available"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Phone size={16} className="text-gray-500 flex-shrink-0" />
              <span className="text-sm md:text-base">{user?.number || "Not available"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                <span className="text-sm md:text-base">{user?.city || "Not available"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Province
              </label>
              <p className="p-2 bg-gray-50 rounded-lg text-sm md:text-base">
                {user?.province || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold sm:text-xl">Upcoming Appointments</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {upcomingAppointments.length}
          </span>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        {editingAppointment === appointment._id ? (
                          <input
                            type="date"
                            value={editFormData.date}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                date: e.target.value,
                              })
                            }
                            className="p-1.5 border border-gray-300 rounded text-sm w-full max-w-[140px]"
                          />
                        ) : (
                          <span className="text-sm">
                            {formatDate(appointment.date)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        {editingAppointment === appointment._id ? (
                          <input
                            type="time"
                            value={editFormData.time}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                time: e.target.value,
                              })
                            }
                            className="p-1.5 border border-gray-300 rounded text-sm w-full max-w-[110px]"
                          />
                        ) : (
                          <span className="text-sm">
                            {appointment.time || "Time not set"}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-base mb-1 sm:text-lg">
                      Appointment with {appointment.barber?.username || "Unknown Barber"}
                    </h3>

                    <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                      <MapPin size={14} />
                      <span className="text-sm">
                        {appointment.barber?.city || "Unknown city"},{" "}
                        {appointment.barber?.province || "Unknown province"}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium text-gray-700 mb-1 text-sm">
                        Services:
                      </p>
                      <ul className="list-disc list-inside pl-2">
                        {appointment.services &&
                        appointment.services.length > 0 ? (
                          appointment.services.map((service, index) => (
                            <li
                              key={index}
                              className="text-gray-600 text-xs mb-0.5 sm:text-sm"
                            >
                              {service.name} - Rs. {service.price}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-600 text-xs sm:text-sm">
                            No services selected
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {editingAppointment === appointment._id ? (
                        <>
                          <button
                            onClick={() =>
                              handleAppointmentUpdate(appointment._id)
                            }
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                          >
                            <Save size={14} />
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingAppointment(null);
                              setEditFormData({ date: "", time: "" });
                            }}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(appointment)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                          >
                            <Edit size={14} />
                            Reschedule
                          </button>
                          <button
                            onClick={() =>
                              handleAppointmentCancel(appointment._id)
                            }
                            className="px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition text-xs sm:text-sm"
                          >
                            Cancel Appointment
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center mt-3 lg:mt-0 lg:pl-4 lg:border-l lg:border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center sm:w-18 sm:h-18">
                      <Scissors size={22} className="text-gray-500" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {appointment.status || "unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <Calendar size={36} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">No upcoming appointments</p>
            <p className="text-gray-400 mt-1 text-xs">
              Book your first appointment to get started
            </p>
          </div>
        )}
      </div>

      {/* Completed Appointments */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold sm:text-xl">Completed Appointments</h2>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {completedAppointments.length}
          </span>
        </div>

        {completedAppointments.length > 0 ? (
          <div className="space-y-4">
            {completedAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span className="text-sm">
                          {appointment.time || "Time not set"}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-base mb-1 sm:text-lg">
                      Appointment with {appointment.barber?.username || "Unknown Barber"}
                    </h3>

                    <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                      <MapPin size={14} />
                      <span className="text-sm">
                        {appointment.barber?.city || "Unknown city"},{" "}
                        {appointment.barber?.province || "Unknown province"}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium text-gray-700 mb-1 text-sm">
                        Services:
                      </p>
                      <ul className="list-disc list-inside pl-2">
                        {appointment.services &&
                        appointment.services.length > 0 ? (
                          appointment.services.map((service, index) => (
                            <li
                              key={index}
                              className="text-gray-600 text-xs mb-0.5 sm:text-sm"
                            >
                              {service.name} - Rs. {service.price}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-600 text-xs sm:text-sm">
                            No services selected
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center mt-3 lg:mt-0 lg:pl-4 lg:border-l lg:border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center sm:w-18 sm:h-18">
                      <Scissors size={22} className="text-gray-500" />
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-2">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <Scissors size={36} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">
              No completed appointments yet
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions - Desktop Only */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 hidden lg:block shadow-sm">
        <h2 className="text-lg font-semibold sm:text-xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href={"/customer"}>
            <button className="p-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex flex-col items-center w-full text-sm">
              <Calendar size={20} className="mb-1.5" />
              <span>Book Appointment</span>
            </button>
          </Link>
          <Link href={"/customer"}>
            <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex flex-col items-center w-full text-sm">
              <Search size={20} className="mb-1.5" />
              <span>Find Barbers</span>
            </button>
          </Link>
          <Link href={"/customer"}>
            <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex flex-col items-center w-full text-sm">
              <User size={20} className="mb-1.5" />
              <span>New Booking</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Recommended Barbers */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold sm:text-xl mb-4">
          Recommended Barbers in {user?.city || "your area"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedBarbers.slice(0, 3).map((barber) => (
            <div
              key={barber._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
            >
              <div className="h-36 bg-gray-100 flex items-center justify-center sm:h-40">
                <User size={48} className="text-gray-400" />
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-base mb-0.5 sm:text-lg">
                  {barber.username}
                </h3>
                <p className="text-gray-500 text-xs mb-1.5 truncate">{barber.email}</p>
                <p className="text-gray-600 text-xs mb-2">📞 {barber.number}</p>

                <div className="flex items-center gap-1.5 my-1.5">
                  <div className="flex items-center text-yellow-500 text-sm">
                    {"★".repeat(Math.floor(barber.rating))}
                    <span className="text-gray-600 ml-1 text-xs">
                      {barber.rating}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    ({barber.reviews?.length || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                  <MapPin size={14} />
                  <span className="text-xs">
                    {barber.city}, {barber.province}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedBarber(barber);
                    setBookingComponent(true);
                  }}
                  className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-xs sm:text-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingComponent && (
        <BookNow
          barber={selectedBarber}
          handleClose={() => {
            setBookingComponent(false);
            setSelectedBarber(null);
            fetchUser();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;


// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Scissors,
//   Search,
//   Calendar,
//   MapPin,
//   User,
//   Edit,
//   Clock,
//   Phone,
//   Mail,
//   Save,
//   X,
//   ChevronDown,
// } from "lucide-react";
// import { useSession } from "next-auth/react";
// import axios from "axios";
// import BookNow from "@/components/bookNow";
// import Link from "next/link";

// const Dashboard = () => {
//   const [bookingComponent, setBookingComponent] = useState(false);
//   const [selectedBarber, setSelectedBarber] = useState(null);
//   const [user, setUser] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [editingAppointment, setEditingAppointment] = useState(null);
//   const [editFormData, setEditFormData] = useState({ date: "", time: "" });
//   const [recommendedBarbers, setrecommendedBarbers] = useState([]);
//   const { data: session } = useSession();
//   let id = session?.user?.id || session?.user?._id;

//   useEffect(() => {
//     fetchUser();
//   }, [id]);

//   const fetchUser = async () => {
//     if (!id) return;
//     try {
//       const response = await axios.get(`/api/customerdata/${id}`);
//       const appointmentsResponse = await axios.get(`/api/appointments/${id}`);
//       setAppointments(appointmentsResponse.data.appointments || []);
//       setUser(response.data.customerData);
//     } catch (err) {
//       console.error("Failed to fetch user data:", err);
//     }
//   };

//   const handleAppointmentUpdate = async (appointmentId) => {
//     try {
//       const response = await axios.put(
//         `/api/appointments/${appointmentId}`,
//         editFormData
//       );

//       // Safely access the updated appointment data
//       const updatedAppointment = response.data?.appointment || response.data;

//       if (!updatedAppointment) {
//         throw new Error("No updated appointment data received");
//       }

//       // Update the appointment while preserving all existing data
//       setAppointments(
//         appointments.map((app) => {
//           if (app && app._id === appointmentId) {
//             return {
//               ...app, // Keep all existing data
//               date: updatedAppointment.date || app.date,
//               time: updatedAppointment.time || app.time,
//             };
//           }
//           return app;
//         })
//       );

//       setEditingAppointment(null);
//       setEditFormData({ date: "", time: "" });
//     } catch (err) {
//       console.error("Failed to update appointment:", err);
//       alert("Failed to update appointment. Please try again.");
//     }
//   };

//   const handleAppointmentCancel = async (appointmentId) => {
//     if (!confirm("Are you sure you want to cancel this appointment?")) return;

//     try {
//       await axios.delete(`/api/appointments/${appointmentId}`);
//       setAppointments(
//         appointments.filter((app) => app && app._id !== appointmentId)
//       );
//     } catch (err) {
//       console.error("Failed to cancel appointment:", err);
//       alert("Failed to cancel appointment. Please try again.");
//     }
//   };

//   const startEditing = (appointment) => {
//     if (!appointment) return;

//     setEditingAppointment(appointment._id);
//     setEditFormData({
//       date: appointment.date ? appointment.date.split("T")[0] : "", // Format date for input
//       time: appointment.time || "",
//     });
//   };

//   // Get upcoming appointments (pending status and future date)
//   const getUpcomingAppointments = () => {
//     const now = new Date();
//     return appointments.filter((app) => {
//       if (!app || !app.date) return false;
//       const appointmentDate = new Date(app.date);
//       return app.status === "pending" && appointmentDate > now;
//     });
//   };

//   // Get completed appointments
//   const getCompletedAppointments = () => {
//     return appointments.filter((app) => app && app.status === "completed");
//   };

//   // Format date to readable format
//   const formatDate = (dateString) => {
//     if (!dateString) return "Date not available";
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const upcomingAppointments = getUpcomingAppointments();
//   const completedAppointments = getCompletedAppointments();

//   // Recommended barbers based on user's location
//   useEffect(() => {
//     recommenderbarbersfetch();
//   }, []);
//   const recommenderbarbersfetch = async () => {
//     try {
//       const searchParams = new URLSearchParams();
//       searchParams.append("topRated", "true");
//       const response = await axios.get(
//         `/api/barber/barbers?${searchParams.toString()}`
//       );
//       setrecommendedBarbers(response.data.topRatedBarbers);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // const recommendedBarbers = [
//   //   {
//   //     id: 1,
//   //     name: "David",
//   //     rating: 4.8,
//   //     reviews: 120,
//   //     image: "/barber1.jpg",
//   //     city: "Quetta",
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Emily",
//   //     rating: 4.9,
//   //     reviews: 95,
//   //     image: "/barber2.jpg",
//   //     city: "Quetta",
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Michael",
//   //     rating: 4.7,
//   //     reviews: 150,
//   //     image: "/barber3.jpg",
//   //     city: "Quetta",
//   //   },
//   // ];

//   return (
//     <div className="min-h-screen bg-white text-gray-900 px-4 py-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
//         <div className="mb-4 sm:mb-0">
//           <h1 className="text-3xl md:text-4xl font-bold">
//             Welcome back, {user?.username || "User"}!
//           </h1>
//           <p className="text-gray-600 mt-2 text-lg">
//             Manage your bookings, explore new barbers, and schedule your next
//             appointment.
//           </p>
//         </div>
//       </div>

//       {/* User Info */}
//       <div className="bg-white rounded-xl border border-gray-400/50 p-8 mb-10">
//         <div className="flex items-center gap-5 mb-6">
//           <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
//             <User size={40} className="text-blue-600" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold">Personal Information</h2>
//             <p className="text-gray-600 text-lg">Your account details</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-3">
//               Username
//             </label>
//             <p className="p-4 bg-gray-50 rounded-lg text-lg">
//               {user?.username || "Not available"}
//             </p>
//           </div>

//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-3">
//               Email
//             </label>
//             <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//               <Mail size={20} className="text-gray-500" />
//               <span className="text-lg">{user?.email || "Not available"}</span>
//             </div>
//           </div>

//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-3">
//               Phone Number
//             </label>
//             <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//               <Phone size={20} className="text-gray-500" />
//               <span className="text-lg">{user?.number || "Not available"}</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label className="block text-base font-medium text-gray-700 mb-3">
//                 City
//               </label>
//               <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                 <MapPin size={20} className="text-gray-500" />
//                 <span className="text-lg">{user?.city || "Not available"}</span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-base font-medium text-gray-700 mb-3">
//                 Province
//               </label>
//               <p className="p-4 bg-gray-50 rounded-lg text-lg">
//                 {user?.province || "Not available"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Upcoming Appointments */}
//       <div className="bg-white rounded-xl border border-gray-400/50 p-8 mb-10">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
//           <span className="bg-blue-100 text-blue-800 text-base font-medium px-4 py-2 rounded-full">
//             {upcomingAppointments.length}
//           </span>
//         </div>

//         {upcomingAppointments.length > 0 ? (
//           <div className="space-y-6">
//             {upcomingAppointments.map((appointment) => (
//               <div
//                 key={appointment._id}
//                 className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
//               >
//                 <div className="flex flex-col lg:flex-row gap-7">
//                   <div className="flex-1">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-500 mb-4">
//                       <div className="flex items-center gap-2">
//                         <Calendar size={20} />
//                         {editingAppointment === appointment._id ? (
//                           <input
//                             type="date"
//                             value={editFormData.date}
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData,
//                                 date: e.target.value,
//                               })
//                             }
//                             className="p-2 border border-gray-300 rounded text-lg"
//                           />
//                         ) : (
//                           <span className="text-lg">
//                             {formatDate(appointment.date)}
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Clock size={20} />
//                         {editingAppointment === appointment._id ? (
//                           <input
//                             type="time"
//                             value={editFormData.time}
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData,
//                                 time: e.target.value,
//                               })
//                             }
//                             className="p-2 border border-gray-300 rounded text-lg"
//                           />
//                         ) : (
//                           <span className="text-lg">
//                             {appointment.time || "Time not set"}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <h3 className="font-semibold text-xl mb-3">
//                       Appointment with{" "}
//                       {appointment.barber?.username || "Unknown Barber"}
//                     </h3>

//                     <div className="flex items-center gap-2 text-gray-600 mb-5">
//                       <MapPin size={18} />
//                       <span className="text-lg">
//                         {appointment.barber?.city || "Unknown city"},{" "}
//                         {appointment.barber?.province || "Unknown province"}
//                       </span>
//                     </div>

//                     <div className="mb-5">
//                       <p className="font-medium text-gray-700 mb-3 text-lg">
//                         Services:
//                       </p>
//                       <ul className="list-disc list-inside pl-2">
//                         {appointment.services &&
//                         appointment.services.length > 0 ? (
//                           appointment.services.map((service, index) => (
//                             <li
//                               key={index}
//                               className="text-gray-600 text-lg mb-1"
//                             >
//                               {service.name} - Rs. {service.price}
//                             </li>
//                           ))
//                         ) : (
//                           <li className="text-gray-600 text-lg">
//                             No services selected
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div className="flex flex-wrap gap-4">
//                       {editingAppointment === appointment._id ? (
//                         <>
//                           <button
//                             onClick={() =>
//                               handleAppointmentUpdate(appointment._id)
//                             }
//                             className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-lg"
//                           >
//                             <Save size={18} />
//                             Save Changes
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingAppointment(null);
//                               setEditFormData({ date: "", time: "" });
//                             }}
//                             className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-lg"
//                           >
//                             <X size={18} />
//                             Cancel
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => startEditing(appointment)}
//                             className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-lg"
//                           >
//                             <Edit size={18} />
//                             Reschedule
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleAppointmentCancel(appointment._id)
//                             }
//                             className="px-5 py-3 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition text-lg"
//                           >
//                             Cancel Appointment
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-center justify-center">
//                     <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
//                       <Scissors size={40} className="text-gray-400" />
//                     </div>
//                     <span
//                       className={`px-4 py-2 rounded-full text-base font-medium ${
//                         appointment.status === "pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {appointment.status || "unknown"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
//             <Calendar size={56} className="mx-auto text-gray-400 mb-4" />
//             <p className="text-gray-500 text-xl">No upcoming appointments</p>
//             <p className="text-gray-400 mt-2 text-lg">
//               Book your first appointment to get started
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Completed Appointments */}
//       <div className="bg-white rounded-xl border border-gray-400/50  p-8 mb-10">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-semibold">Completed Appointments</h2>
//           <span className="bg-green-100 text-green-800 text-base font-medium px-4 py-2 rounded-full">
//             {completedAppointments.length}
//           </span>
//         </div>

//         {completedAppointments.length > 0 ? (
//           <div className="space-y-6">
//             {completedAppointments.map((appointment) => (
//               <div
//                 key={appointment._id}
//                 className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
//               >
//                 <div className="flex flex-col lg:flex-row gap-7">
//                   <div className="flex-1">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-500 mb-4">
//                       <div className="flex items-center gap-2">
//                         <Calendar size={20} />
//                         <span className="text-lg">
//                           {formatDate(appointment.date)}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Clock size={20} />
//                         <span className="text-lg">
//                           {appointment.time || "Time not set"}
//                         </span>
//                       </div>
//                     </div>

//                     <h3 className="font-semibold text-xl mb-3">
//                       Appointment with{" "}
//                       {appointment.barber?.username || "Unknown Barber"}
//                     </h3>

//                     <div className="flex items-center gap-2 text-gray-600 mb-5">
//                       <MapPin size={18} />
//                       <span className="text-lg">
//                         {appointment.barber?.city || "Unknown city"},{" "}
//                         {appointment.barber?.province || "Unknown province"}
//                       </span>
//                     </div>

//                     <div className="mb-5">
//                       <p className="font-medium text-gray-700 mb-3 text-lg">
//                         Services:
//                       </p>
//                       <ul className="list-disc list-inside pl-2">
//                         {appointment.services &&
//                         appointment.services.length > 0 ? (
//                           appointment.services.map((service, index) => (
//                             <li
//                               key={index}
//                               className="text-gray-600 text-lg mb-1"
//                             >
//                               {service.name} - Rs. {service.price}
//                             </li>
//                           ))
//                         ) : (
//                           <li className="text-gray-600 text-lg">
//                             No services selected
//                           </li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-center justify-center">
//                     <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
//                       <Scissors size={40} className="text-gray-400" />
//                     </div>
//                     <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-base font-medium">
//                       Completed
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
//             <Scissors size={56} className="mx-auto text-gray-400 mb-4" />
//             <p className="text-gray-500 text-xl">
//               No completed appointments yet
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-xl border border-gray-400/50  p-8 mb-10">
//         <h2 className="text-2xl font-semibold mb-7">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           <button
//             // onClick={() => {
//             //   setSelectedBarber(null);
//             //   setBookingComponent(true);
//             // }}
//             className="p-5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex flex-col items-center text-lg"
//           >
//             <Link href={"/customer"}>
//               <div className="flex items-center justify-center">
//                 <Calendar size={28} className="mb-3" />
//               </div>
//               <span>Book Appointment</span>
//             </Link>
//           </button>
//           <button className="p-5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex flex-col items-center text-lg">
//             <Link href={"/customer"}>
//               <div>
//                 <div className="flex items-center justify-center">
//                   <Search size={28} className="mb-3" />
//                 </div>
//                 <span>Find Barbers</span>
//               </div>
//             </Link>
//           </button>
//           <button className="p-5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex flex-col items-center text-lg">
//             <Link href={"/customer"}>
//               <div className="flex items-center justify-center">
//                 <User size={28} className="mb-3" />
//               </div>
//               <span>New Booking</span>
//             </Link>
//           </button>
//         </div>
//       </div>

//       {/* Recommended Barbers */}
//       <div className="bg-white rounded-xl border border-gray-500/50  p-8 mb-10">
//         <h2 className="text-2xl font-semibold mb-7">
//           Recommended Barbers in {user?.city || "your area"}
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
//           {recommendedBarbers.slice(0, 3).map((barber) => (
//             <div
//               key={barber._id}
//               className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
//             >
//               {/* Avatar */}
//               <div className="h-48 bg-gray-200 flex items-center justify-center">
//                 <User size={80} className="text-gray-400" />
//               </div>

//               {/* Barber Info */}
//               <div className="p-5">
//                 <h3 className="font-semibold text-xl mb-1">
//                   {barber.username}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-2">{barber.email}</p>
//                 <p className="text-gray-600 text-sm mb-4">📞 {barber.number}</p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 my-3">
//                   <div className="flex items-center text-yellow-500">
//                     {"★".repeat(barber.rating)}
//                     <span className="text-gray-600 ml-2 text-base">
//                       {barber.rating}
//                     </span>
//                   </div>
//                   <span className="text-gray-500 text-base">
//                     ({barber.reviews?.length || 0} reviews)
//                   </span>
//                 </div>

//                 {/* Location */}
//                 <div className="flex items-center gap-2 text-gray-600 mb-5">
//                   <MapPin size={18} />
//                   <span className="text-lg">
//                     {barber.city}, {barber.province}
//                   </span>
//                 </div>

//                 {/* Book Now Button */}
//                 <button
//                   onClick={() => {
//                     setSelectedBarber(barber);
//                     setBookingComponent(true);
//                   }}
//                   className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-lg"
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Booking Modal */}
//       {bookingComponent && (
//         <BookNow
//           barber={selectedBarber}
//           handleClose={() => {
//             setBookingComponent(false);
//             setSelectedBarber(null);
//             fetchUser(); // Refresh appointments after booking
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;
