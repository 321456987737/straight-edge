"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Ban, Trash2, User, X } from "lucide-react";
import { motion } from "framer-motion";

const Searchbarbers = () => {
  const [query, setQuery] = useState("");
  const [barbers, setbarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedbarber, setSelectedbarber] = useState(null);

  // ✅ Debounce fetch
  const fetchbarbers = useCallback(async (search) => {
    if (!search) {
      setbarbers([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/barber/searchbarber?search=${encodeURIComponent(
          search
        )}&limit=12`
      );
      setbarbers(res.data?.barbers || []);
    } catch (err) {
      console.error("Error fetching barbers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchbarbers(query);
    }, 500);

    return () => clearTimeout(delay);
  }, [query, fetchbarbers]);

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/barber/searchbarber?id=${id}`);
      setbarbers((prev) => prev.filter((c) => c._id !== id));
      if (selectedbarber?._id === id) setSelectedbarber(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Restrict
  const handleRestrict = async (id) => {
    try {
      await axios.put(`/api/admin/barber/searchbarber?id=${id}`);
      setbarbers((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, restricted: !c.restricted } : c
        )
      );
      if (selectedbarber?._id === id) {
        setSelectedbarber({
          ...selectedbarber,
          restricted: !selectedbarber.restricted,
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
        <label className="text-lg font-semibold">Search barbers</label>
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
      ) : barbers.length === 0 && query ? (
        <p className="text-gray-500">No barbers found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <motion.div
              key={barber._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-xl shadow-md p-4 flex flex-col items-center text-center bg-white"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden">
                {barber.image ? (
                  <img
                    src={barber.image}
                    alt={barber.username}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-600" />
                )}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-lg">{barber.username}</h3>
              <p className="text-gray-500 text-sm">{barber.email}</p>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleDelete(barber._id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => handleRestrict(barber._id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${
                    barber.restricted
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  {barber.restricted ? "Unrestrict" : "Restrict"}
                </button>
                <button
                  onClick={() => setSelectedbarber(barber)}
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
      {selectedbarber && (
        <div onClick={() => setSelectedbarber(null)} className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedbarber(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {selectedbarber.image ? (
                  <img
                    src={selectedbarber.image}
                    alt={selectedbarber.username}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedbarber.username}
                </h3>
                <p className="text-gray-500">{selectedbarber.email}</p>
                <p className="text-gray-500">{selectedbarber.number}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {selectedbarber.role}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {selectedbarber.city || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Province:</span>{" "}
                {selectedbarber.province || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {selectedbarber.location || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Followers:</span>{" "}
                {selectedbarber.followers}
              </p>
              <p>
                <span className="font-semibold">Following:</span>{" "}
                {selectedbarber.following}
              </p>
              <p>
                <span className="font-semibold">Restricted:</span>{" "}
                {selectedbarber.restricted ? "Yes 🚫" : "No ✅"}
              </p>
              <p>
                <span className="font-semibold">Joined:</span>{" "}
                {new Date(selectedbarber.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Searchbarbers;

