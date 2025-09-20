"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Star, MapPin, Eye, Trash2, Ban } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminTopRatedBarbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 2,
    total: 0,
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("topRated", "true");
        searchParams.append("skip", String(pagination.skip));
        searchParams.append("limit", String(pagination.limit));

        const res = await axios.get(`/api/barber/barbers?${searchParams.toString()}`);

        if (res.data?.topRatedBarbers) {
          setBarbers(res.data.topRatedBarbers);
          setPagination((prev) => ({
            ...prev,
            total: res.data.totalTopRated || 0,
            totalPages: Math.max(1, Math.ceil((res.data.totalTopRated || 0) / prev.limit)),
          }));
        } else {
          setBarbers([]);
          setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load top-rated barbers.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
    // we intentionally keep pagination.limit & skip in deps so fetch triggers correctly
  }, [pagination.skip, pagination.limit]);

  // Pagination handlers
  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        skip: prev.skip + prev.limit,
        page: prev.page + 1,
      }));
    }
  };

  const handlePrev = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({
        ...prev,
        skip: prev.skip - prev.limit,
        page: prev.page - 1,
      }));
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this barber?");
    if (!confirm) return;

    try {
      const response = await axios.delete("/api/barber/barbers", { data: { id } });
      // optimistic refresh: remove deleted barber from list
      setBarbers((prev) => prev.filter((b) => b._id !== id));
      // update total (if your API doesn't return a fresh total, adjust accordingly)
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting barber:", error);
      alert("Failed to delete barber. See console for details.");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl border border-gray-200 shadow-sm max-w-[1200px] mx-auto">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Top Rated Barbers</h2>

      {/* Error */}
      {error && (
        <div className="bg-red-50 p-3 text-red-600 rounded-md mb-4">{error}</div>
      )}

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Desktop / Tablet: Table */}
      {!loading && barbers.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-3 border">Barber</th>
                  <th className="px-4 py-3 border">Location</th>
                  <th className="px-4 py-3 border">Rating</th>
                  <th className="px-4 py-3 border">Services</th>
                  <th className="px-4 py-3 border">Reports</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {barbers.map((barber, idx) => (
                  <motion.tr
                    key={barber._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 border font-medium">{barber.username}</td>

                    <td className="px-4 py-3 border flex items-center gap-1 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" /> {barber.city}, {barber.province}
                    </td>

                    <td className="px-4 py-3 border text-yellow-500 flex items-center gap-1">
                      {barber.rating > 0 ? (
                        <>
                          {Math.round((barber.rating + Number.EPSILON) * 10) / 10}
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        </>
                      ) : (
                        "New"
                      )}
                    </td>

                    <td className="px-4 py-3 border">{barber.services?.length || 0} services</td>

                    <td className="px-4 py-3 border text-red-600 font-medium flex items-center gap-1">
                      <Ban className="h-4 w-4" /> {barber.reports || 0}
                    </td>

                    <td className="px-4 py-3 border flex gap-3">
                      <Link href={`/customer/viewbarberProfile/${barber._id}`} className="text-blue-600 hover:underline flex items-center gap-1">
                        <Eye className="h-4 w-4" /> View
                      </Link>

                      <button onClick={() => handleDelete(barber._id)} className="text-red-600 hover:underline flex items-center gap-1">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>

                      <button className="text-yellow-600 hover:underline flex items-center gap-1">
                        <Ban className="h-4 w-4" /> Block
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card list */}
          <div className="md:hidden space-y-3">
            {barbers.map((barber, idx) => (
              <motion.div
                key={barber._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="border rounded-lg p-3 bg-white shadow-sm"
                role="group"
                aria-labelledby={`barber-${barber._id}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 id={`barber-${barber._id}`} className="font-medium text-sm truncate">
                      {barber.username}
                    </h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" /> {barber.city}, {barber.province}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600 flex items-center justify-end gap-1">
                      {barber.rating > 0 ? (
                        <>
                          {Math.round((barber.rating + Number.EPSILON) * 10) / 10}
                          <Star className="h-4 w-4" />
                        </>
                      ) : (
                        "New"
                      )}
                    </p>
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 justify-end">
                      <Ban className="h-3.5 w-3.5" /> {barber.reports || 0} reports
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
                  <div className="text-xs text-gray-700">{barber.services?.length || 0} services</div>

                  <div className="flex gap-2">
                    <Link href={`/customer/viewbarberProfile/${barber._id}`} className="px-3 py-1 text-xs border rounded-md hover:bg-gray-50">
                      <Eye className="h-3.5 w-3.5 inline-block mr-1 align-text-bottom" /> View
                    </Link>

                    <button onClick={() => handleDelete(barber._id)} className="px-3 py-1 text-xs border rounded-md text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5 inline-block mr-1 align-text-bottom" /> Delete
                    </button>

                    <button className="px-3 py-1 text-xs border rounded-md text-yellow-600 hover:bg-yellow-50">
                      <Ban className="h-3.5 w-3.5 inline-block mr-1 align-text-bottom" /> Block
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0 justify-between mt-6">
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handlePrev}
                disabled={pagination.page === 1}
                className="flex-1 md:flex-none px-3 py-2 border rounded-md text-sm disabled:opacity-50"
                aria-label="Previous page"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={pagination.page === pagination.totalPages}
                className="flex-1 md:flex-none px-3 py-2 border rounded-md text-sm disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </button>
            </div>

            <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && barbers.length === 0 && (
        <p className="text-gray-500 text-center py-6">No top-rated barbers found</p>
      )}
    </div>
  );
}
