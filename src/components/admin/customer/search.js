"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Ban, Trash2, User, X } from "lucide-react";
import { motion } from "framer-motion";

const SearchCustomers = () => {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ✅ Debounce fetch
  const fetchCustomers = useCallback(async (search) => {
    if (!search) {
      setCustomers([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/customer/search?search=${encodeURIComponent(
          search
        )}&limit=12`
      );
      setCustomers(res.data?.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers(query);
    }, 500);

    return () => clearTimeout(delay);
  }, [query, fetchCustomers]);

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/customer/search?id=${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      if (selectedCustomer?._id === id) setSelectedCustomer(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Restrict
  const handleRestrict = async (id) => {
    try {
      await axios.put(`/api/admin/customer/search?id=${id}`);
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, restricted: !c.restricted } : c
        )
      );
      if (selectedCustomer?._id === id) {
        setSelectedCustomer({
          ...selectedCustomer,
          restricted: !selectedCustomer.restricted,
        });
      }
    } catch (err) {
      console.error("Restrict failed:", err);
    }
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl">
      {/* 🔍 Search */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">Search Customers</label>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:black"
        />
      </div>

      {/* 📊 Results */}
      {loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : customers.length === 0 && query ? (
        <p className="text-gray-500">No customers found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-xl shadow-md p-4 flex flex-col items-center text-center bg-white"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden">
                {customer.image ? (
                  <img
                    src={customer.image}
                    alt={customer.username}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-600" />
                )}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-lg">{customer.username}</h3>
              <p className="text-gray-500 text-sm">{customer.email}</p>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => handleRestrict(customer._id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${
                    customer.restricted
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  {customer.restricted ? "Unrestrict" : "Restrict"}
                </button>
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🔹 Popup Modal */}
      {selectedCustomer && (
        <div onClick={() => setSelectedCustomer(null)} className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {selectedCustomer.image ? (
                  <img
                    src={selectedCustomer.image}
                    alt={selectedCustomer.username}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedCustomer.username}
                </h3>
                <p className="text-gray-500">{selectedCustomer.email}</p>
                <p className="text-gray-500">{selectedCustomer.number}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {selectedCustomer.role}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {selectedCustomer.city || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Province:</span>{" "}
                {selectedCustomer.province || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {selectedCustomer.location || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Followers:</span>{" "}
                {selectedCustomer.followers}
              </p>
              <p>
                <span className="font-semibold">Following:</span>{" "}
                {selectedCustomer.following}
              </p>
              <p>
                <span className="font-semibold">Restricted:</span>{" "}
                {selectedCustomer.restricted ? "Yes 🚫" : "No ✅"}
              </p>
              <p>
                <span className="font-semibold">Joined:</span>{" "}
                {new Date(selectedCustomer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SearchCustomers;

