"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ServicesPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const id = session?.user?.id || session?.user?._id;
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    visible: false,
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
      const res = await axios.get(`/api/barber/${id}`);
      setBarber(res.data.barberData || res.data); // safer
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      alert("Please fill in both service name and price");
      return;
    }

    try {
      const res = await axios.post(`/api/barber/${id}/services`, newService);
      setBarber(res.data.barber);
      setNewService({ name: "", price: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      alert("Error adding service: " + err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const res = await axios.delete(`/api/barber/${id}/services/${serviceId}`);
      setBarber(res.data);
      setShowDeleteConfirm({ visible: false, id: null, name: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      alert("Error deleting service: " + err.message);
    }
  };

  const openDeleteConfirm = (id, name) => {
    setShowDeleteConfirm({ visible: true, id, name });
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm({ visible: false, id: null, name: "" });
  };

  const confirmDelete = () => {
    handleDeleteService(showDeleteConfirm.id);
  };

  return (
    <motion.div
      className="min-h-screen bg-white py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            {loading ? (
              <div className="h-7 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">
                {barber?.username}’s Services
              </h1>
            )}
            <p className="text-gray-600 mt-2">
              Manage your service offerings and prices
            </p>
          </div>
          <button
            onClick={() => router.push(`/barber/profile/${id}`)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded-md transition-colors"
          >
            Back to Profile
          </button>
        </motion.div>

        {/* Add Service Form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Add New Service</h3>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Service name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              />
              <input
                type="number"
                placeholder="Price"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              />
              <button
                onClick={handleAddService}
                className="border border-black text-black font-medium py-2 px-4 rounded-md text-sm transition-colors whitespace-nowrap"
              >
                Add Service
              </button>
            </div>
          </div>
        </motion.div>

        {/* Services List */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Current Services</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your available services and their prices
            </p>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <ul className="divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="h-7 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </li>
                ))}
              </ul>
            ) : barber?.services?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {barber.services.map((service, index) => (
                    <motion.li
                      key={service._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-6 py-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-black">
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rs. {service.price}
                        </p>
                      </div>
                      <button
                        onClick={() => openDeleteConfirm(service._id, service.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No services added yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeDeleteConfirm}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{showDeleteConfirm.name}</span>? This
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServicesPage;
