"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Edit,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Eye,
  EyeOff,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between py-4 border-b border-gray-200">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-sm text-gray-800 max-w-[60%] text-right break-words">
      {value ?? "—"}
    </div>
  </div>
);

const AppointmentItem = ({ a }) => {
  const dateLabel = a?.date
    ? new Date(a.date).toLocaleDateString()
    : a?.date ?? "—";

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <div>
        <div className="text-sm text-gray-800 font-medium">
          {a?.services?.length > 0
            ? a.services.map((service, idx) => (
                <span key={idx}>
                  {service.name}
                  {idx < a.services.length - 1 && ", "}
                </span>
              ))
            : "Service"}
        </div>
        <div className="text-xs text-gray-500">
          {a?.barber?.username ?? "Unknown"}
        </div>
      </div>
      <div className="text-xs text-gray-500 text-right">
        <div>{dateLabel}</div>
        <div>{a?.time ?? "—"}</div>
      </div>
    </div>
  );
};

export default function Page() {
  const { id } = useParams();
  const [customerdata, setCustomerdata] = useState(null);
  const [openedit, setOpenedit] = useState(false);
  const [appointments, setAppointments] = useState({
    completed: [],
    pending: [],
    cancelled: [],
  });
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    number: "",
    province: "",
    city: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      setLoadingCustomer(true);
      setError(null);
      try {
        const res = await axios.get(`/api/customerdata/${id}`);
        setCustomerdata(res.data?.customerData ?? null);

        // Pre-fill form with existing data
        if (res.data?.customerData) {
          setFormData({
            username: res.data.customerData.username || "",
            email: res.data.customerData.email || "",
            number: res.data.customerData.number || "",
            province: res.data.customerData.province || "",
            city: res.data.customerData.city || "",
            location: res.data.customerData.location || "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Failed to load customer data.");
      } finally {
        setLoadingCustomer(false);
      }
    };

    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      setError(null);
      try {
        const res = await axios.get(`/api/appointments/${id}`);
        const userAppointments = res.data.appointments || [];

        setAppointments({
          completed: userAppointments.filter(
            (item) => item.status === "completed"
          ),
          pending: userAppointments.filter((item) => item.status === "pending"),
          cancelled: userAppointments.filter(
            (item) => item.status === "cancelled"
          ),
        });
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError((prev) => (prev ? prev : "Failed to load appointments."));
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchCustomer();
    fetchAppointments();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    // Validate passwords match if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create update object with only changed fields
      const updateData = {
        username: formData.username,
        email: formData.email,
        number: formData.number,
        province: formData.province,
        city: formData.city,
        location: formData.location,
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await axios.put(`/api/updateuser/${id}`, updateData);

      if (res.data.success) {
        setSuccess("Profile updated successfully");
        setCustomerdata({
          ...customerdata,
          ...updateData,
        });
        setTimeout(() => {
          setOpenedit(false);
          setSuccess("");
        }, 1500);
      } else {
        setError(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-6 sm:py-8 md:py-12">
      <div className="max-w-5xl mx-auto border border-gray-300 px-4 sm:px-6 md:px-12 py-5 rounded-lg">
        {/* Header */}
        <div className="flex  items-center justify-between  mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-0">Your Profile</h1>
          <button
            onClick={() => setOpenedit(true)}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-md text-sm text-blue-800 self-start sm:self-auto"
          >
            <Edit size={14} />
            Edit Profile
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8">
          {/* Top row: avatar + name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center overflow-hidden">
                <span className="text-lg font-medium text-white">
                  {customerdata?.username
                    ? customerdata.username.charAt(0).toUpperCase()
                    : "U"}
                </span>
              </div>
              <div>
                <div className="text-lg font-semibold capitalize">
                  {loadingCustomer
                    ? "Loading..."
                    : customerdata?.username ?? "Unknown user"}
                </div>
                <div className="text-xs text-gray-500">
                  Member since{" "}
                  {customerdata?.createdAt
                    ? new Date(customerdata.createdAt).getFullYear()
                    : "—"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="bg-blue-100 px-3 py-2 rounded-md text-xs sm:text-sm text-blue-800">
                Role:{" "}
                <span className="font-medium">
                  {customerdata?.role ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-md text-xs sm:text-sm text-green-800">
                <Users size={14} />
                <span className="font-medium">
                  {customerdata?.followers ?? 0}
                </span>
                <span>Followers</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-md text-xs sm:text-sm text-purple-800">
                <Users size={14} />
                <span className="font-medium">
                  {customerdata?.following ?? 0}
                </span>
                <span>Following</span>
              </div>
            </div>
          </div>

          {/* Mobile accordion sections */}
          <div className="lg:hidden space-y-4">
            {/* Personal Info Accordion */}
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('personal')}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <h2 className="text-lg font-medium">Personal Information</h2>
                {expandedSection === 'personal' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedSection === 'personal' && (
                <div className="p-4 border-t border-gray-200">
                  <InfoRow
                    label={
                      <span className="flex items-center gap-2 text-gray-600">
                        <UserIcon size={14} /> Full Name
                      </span>
                    }
                    value={customerdata?.username}
                  />
                  <InfoRow
                    label={
                      <span className="flex items-center gap-2 text-gray-600">
                        <MailIcon size={14} /> Email
                      </span>
                    }
                    value={customerdata?.email}
                  />
                  <InfoRow
                    label={
                      <span className="flex items-center gap-2 text-gray-600">
                        <PhoneIcon size={14} /> Phone Number
                      </span>
                    }
                    value={customerdata?.number}
                  />
                  <InfoRow
                    label={
                      <span className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon size={14} /> Province
                      </span>
                    }
                    value={customerdata?.province || "—"}
                  />
                  <InfoRow
                    label={
                      <span className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon size={14} /> City
                      </span>
                    }
                    value={customerdata?.city || "—"}
                  />
                  <InfoRow
                    label={
                      <span className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon size={14} /> Location
                      </span>
                    }
                    value={customerdata?.location || "—"}
                  />
                </div>
              )}
            </div>

            {/* Appointments Accordions */}
            {['completed', 'pending', 'cancelled'].map((status) => (
              <div key={status} className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(status)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {status === 'completed' && <CheckCircle size={18} className="text-green-500" />}
                    {status === 'pending' && <Clock size={18} className="text-yellow-500" />}
                    {status === 'cancelled' && <XCircle size={18} className="text-red-500" />}
                    <div>
                      <div className="text-sm text-gray-800 font-medium capitalize">
                        {status}
                      </div>
                      <div className="text-xs text-gray-500">
                        {loadingAppointments
                          ? "..."
                          : appointments[status].length}{" "}
                        total
                      </div>
                    </div>
                  </div>
                  {expandedSection === status ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSection === status && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-1 max-h-44 overflow-y-auto">
                      {loadingAppointments ? (
                        <div className="text-xs text-gray-500">
                          Loading {status} appointments...
                        </div>
                      ) : appointments[status].length === 0 ? (
                        <div className="text-xs text-gray-500">
                          No {status} appointments
                        </div>
                      ) : (
                        appointments[status]
                          .slice(0, 5)
                          .map((a) => <AppointmentItem key={a._id} a={a} />)
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Personal info */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <InfoRow
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <UserIcon size={14} /> Full Name
                    </span>
                  }
                  value={customerdata?.username}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <MailIcon size={14} /> Email
                    </span>
                  }
                  value={customerdata?.email}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <PhoneIcon size={14} /> Phone Number
                    </span>
                  }
                  value={customerdata?.number}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPinIcon size={14} /> Province
                    </span>
                  }
                  value={customerdata?.province || "—"}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPinIcon size={14} /> City
                    </span>
                  }
                  value={customerdata?.city || "—"}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPinIcon size={14} /> Location
                    </span>
                  }
                  value={customerdata?.location || "—"}
                />
              </div>
            </div>

            {/* Middle and Right columns - Appointments summary */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Completed */}
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <div>
                      <div className="text-sm text-gray-800 font-medium">
                        Completed
                      </div>
                      <div className="text-xs text-gray-500">
                        {loadingAppointments
                          ? "..."
                          : appointments.completed.length}{" "}
                        total
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {loadingAppointments
                      ? "Loading..."
                      : appointments.completed.length}
                  </div>
                </div>

                <div className="space-y-1 max-h-44 overflow-y-auto">
                  {loadingAppointments ? (
                    <div className="text-xs text-gray-500">
                      Loading completed appointments...
                    </div>
                  ) : appointments.completed.length === 0 ? (
                    <div className="text-xs text-gray-500">
                      No completed appointments
                    </div>
                  ) : (
                    appointments.completed
                      .slice(0, 5)
                      .map((a) => <AppointmentItem key={a._id} a={a} />)
                  )}
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-yellow-500" />
                    <div>
                      <div className="text-sm text-gray-800 font-medium">
                        Pending
                      </div>
                      <div className="text-xs text-gray-500">
                        {loadingAppointments
                          ? "..."
                          : appointments.pending.length}{" "}
                        total
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {loadingAppointments
                      ? "Loading..."
                      : appointments.pending.length}
                  </div>
                </div>

                <div className="space-y-1 max-h-44 overflow-y-auto">
                  {loadingAppointments ? (
                    <div className="text-xs text-gray-500">
                      Loading pending appointments...
                    </div>
                  ) : appointments.pending.length === 0 ? (
                    <div className="text-xs text-gray-500">
                      No pending appointments
                    </div>
                  ) : (
                    appointments.pending
                      .slice(0, 5)
                      .map((a) => <AppointmentItem key={a._id} a={a} />)
                  )}
                </div>
              </div>

              {/* Cancelled */}
              <div className="bg-white rounded-md p-4 border border-gray-200 md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <XCircle size={18} className="text-red-500" />
                    <div>
                      <div className="text-sm text-gray-800 font-medium">
                        Cancelled
                      </div>
                      <div className="text-xs text-gray-500">
                        {loadingAppointments
                          ? "..."
                          : appointments.cancelled.length}{" "}
                        total
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {loadingAppointments
                      ? "Loading..."
                      : appointments.cancelled.length}
                  </div>
                </div>
                <div className="space-y-1 max-h-44 overflow-y-auto">
                  {loadingAppointments ? (
                    <div className="text-xs text-gray-500">
                      Loading cancelled appointments...
                    </div>
                  ) : appointments.cancelled.length === 0 ? (
                    <div className="text-xs text-gray-500">
                      No cancelled appointments
                    </div>
                  ) : (
                    appointments.cancelled
                      .slice(0, 5)
                      .map((a) => <AppointmentItem key={a._id} a={a} />)
                  )}
                </div>
              </div>
            </div>
          </div>
           <div className="w-full flex items-center justify-center mt-12">
        <button onClick={() => signOut()} className="border-2 border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition ">
          Sign Out
        </button>
      </div>

          {error && <div className="mt-4 text-xs text-red-500">{error}</div>}
        </div>
      </div>

      {/* Edit Modal */}
      {openedit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 w-full h-full"
            onClick={() => setOpenedit(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-4 sm:p-6 md:p-8 z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Edit Profile
                </h2>
                <p className="text-sm text-gray-500">
                  Update your personal details
                </p>
              </div>
              <button
                onClick={() => setOpenedit(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Feedback */}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenedit(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition mt-2 sm:mt-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     
    </div>
  );
}


