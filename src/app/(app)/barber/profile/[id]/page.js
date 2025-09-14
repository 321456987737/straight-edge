"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [newWorkingHour, setNewWorkingHour] = useState({
    day: "",
    start: "",
    end: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    visible: false,
    type: "",
    id: null,
    name: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchBarberData();
  }, [id]);

  const fetchBarberData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/barber/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch barber data");
      }
      const data = await response.json();
      console.log(data)
      setBarber(data.barberData);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/barber/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(barber),
      });

      if (!response.ok) {
        throw new Error("Failed to update barber data");
      }

      const updatedData = await response.json();
      setBarber(updatedData.barber);
      setEditMode(false);
      // Show success notification
    } catch (err) {
      setError(err.message);
      // Show error notification
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      // Show validation error
      return;
    }

    try {
      const response = await fetch(`/api/barber/${id}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      const updatedData = await response.json();
      setBarber(updatedData.barber);
      setNewService({ name: "", price: "" });
    } catch (err) {
      setError(err.message);
      alert("Error adding service: " + err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(`/api/barber/${id}/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      const updatedData = await response.json();
      setBarber(updatedData);
      setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
    } catch (err) {
      setError(err.message);
      alert("Error deleting service: " + err.message);
    }
  };

  const handleAddWorkingHour = async () => {
    if (!newWorkingHour.day || !newWorkingHour.start || !newWorkingHour.end) {
      // Show validation error
      return;
    }

    try {
      const response = await fetch(`/api/barber/${id}/workinghours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkingHour),
      });

      if (!response.ok) {
        throw new Error("Failed to add working hour");
      }

      const updatedData = await response.json();
      setBarber(updatedData);
      setNewWorkingHour({ day: "", start: "", end: "" });
    } catch (err) {
      setError(err.message);
      alert("Error adding working hour: " + err.message);
    }
  };

  const handleDeleteWorkingHour = async (whId) => {
    try {
      const response = await fetch(`/api/barber/${id}/workinghours/${whId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete working hour");
      }

      const updatedData = await response.json();
      setBarber(updatedData);
      setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
    } catch (err) {
      setError(err.message);
      alert("Error deleting working hour: " + err.message);
    }
  };

  const openDeleteConfirm = (type, id, name) => {
    setShowDeleteConfirm({ visible: true, type, id, name });
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
  };

  const confirmDelete = () => {
    if (showDeleteConfirm.type === "service") {
      handleDeleteService(showDeleteConfirm.id);
    } else if (showDeleteConfirm.type === "workingHour") {
      handleDeleteWorkingHour(showDeleteConfirm.id);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading barber profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchBarberData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {barber?.username} Profile
          </h1>
          <div className="flex flex-wrap gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="border border-black  cursor-pointer hover:scale-105 text-black font-medium py-2 px-4 rounded-md transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow rounded-lg mb-8 overflow-x-auto">
          <div className="border-b border-gray-200">
            <nav className="flex min-w-max">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
                  activeTab === "services"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("hours")}
                className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
                  activeTab === "hours"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Working Hours
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and contact information.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Username
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={barber.username || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, username: e.target.value })
                        }
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : typeof barber.username === "string" &&
                      barber.username.trim() !== "" ? (
                      barber.username
                    ) : barber ? (
                      "Not provided"
                    ) : (
                      ""
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <input
                        type="email"
                        value={barber.email || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, email: e.target.value })
                        }
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : typeof barber.email === "string" &&
                      barber.email.trim() !== "" ? (
                      barber.email
                    ) : barber ? (
                      "Not provided"
                    ) : (
                      ""
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <input
                        type="tel"
                        value={barber.number || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, number: e.target.value })
                        }
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : typeof barber.number === "string" &&
                      barber.number.trim() !== "" ? (
                      barber.number
                    ) : barber ? (
                      "Not provided"
                    ) : (
                      ""
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <textarea
                        value={barber.location || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, location: e.target.value })
                        }
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : typeof barber.location === "string" &&
                      barber.location.trim() !== "" ? (
                      barber.location
                    ) : barber ? (
                      "Not provided"
                    ) : (
                      ""
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Password
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <input
                        type="password"
                        value={barber.password || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, password: e.target.value })
                        }
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : typeof barber.password === "string" &&
                      barber.password.trim() !== "" ? (
                      barber.password
                    ) : barber ? (
                      "Not provided"
                    ) : (
                      ""
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    province
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <textarea
                        value={barber.province || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, province: e.target.value })
                        }
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : typeof barber.province === "string" &&
                      barber.province.trim() !== "" ? (
                      barber.province
                    ) : barber ? (
                      "Not provided"
                    ) : (
                      ""
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">city</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <textarea
                        value={barber.city || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, city: e.target.value })
                        }
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : typeof barber.city === "string" &&
                      barber.city.trim() !== "" ? (
                      barber.city
                    ) : barber ? (
                      "Not provided"
                    ) : (
                      ""
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Followers
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <textarea
                        value={barber.followers || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, followers: e.target.value })
                        }
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : barber?.followers ? (
                      Number(barber.followers)
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Following
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <textarea
                        value={barber.following || ""}
                        onChange={(e) =>
                          setBarber({ ...barber, following: e.target.value })
                        }
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    ) : barber?.following ? (
                      Number(barber.following)
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Services
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Manage your service offerings and prices.
                  </p>
                </div>
                <div className="w-full md:max-w-md flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Service name"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Price"
                      value={newService.price}
                      onChange={(e) =>
                        setNewService({ ...newService, price: e.target.value })
                      }
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                  <button
                    onClick={handleAddService}
                    className="border border-black text-black  font-medium py-2 px-4 rounded-md text-sm transition-colors whitespace-nowrap"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              {barber.services && barber.services.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {barber.services.map((service) => (
                    <li key={service._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-black truncate">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Rs. {service.price}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            openDeleteConfirm(
                              "service",
                              service._id,
                              service.name
                            )
                          }
                          className="ml-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-500">No services added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Working Hours Tab */}
        {activeTab === "hours" && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Working Hours
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Manage your availability.
                  </p>
                </div>
                <div className="w-full md:max-w-xl flex flex-col sm:flex-row gap-2">
                  <select
                    value={newWorkingHour.day}
                    onChange={(e) =>
                      setNewWorkingHour({
                        ...newWorkingHour,
                        day: e.target.value,
                      })
                    }
                    className="shadow-sm focus:ring-black focus:border-black block w-full text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newWorkingHour.start}
                      onChange={(e) =>
                        setNewWorkingHour({
                          ...newWorkingHour,
                          start: e.target.value,
                        })
                      }
                      className="shadow-sm  block w-full text-sm border-gray-300 rounded-md p-2 border"
                    />
                    <span className="self-center">-</span>
                    <input
                      type="time"
                      value={newWorkingHour.end}
                      onChange={(e) =>
                        setNewWorkingHour({
                          ...newWorkingHour,
                          end: e.target.value,
                        })
                      }
                      className="shadow-sm  block w-full text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                  <button
                    onClick={handleAddWorkingHour}
                    className="border border-black  hover:bg-black/5 text-black font-medium py-2 px-4 rounded-md text-sm transition-colors whitespace-nowrap"
                  >
                    Add Hours
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              {barber.workinghours && barber.workinghours.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {barber.workinghours.map((wh) => (
                    <li key={wh._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-black truncate">
                            {wh.day}
                          </p>
                          <p className="text-sm text-gray-500">
                            {wh.start} - {wh.end}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            openDeleteConfirm(
                              "workingHour",
                              wh._id,
                              `${wh.day} (${wh.start}-${wh.end})`
                            )
                          }
                          className="ml-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500">No working hours added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm.visible && (
          <div
            onClick={closeDeleteConfirm}
            className="fixed inset-0 bg-black/50  bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-lg max-w-md w-full p-6 z-[100]">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete {showDeleteConfirm.name}? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
