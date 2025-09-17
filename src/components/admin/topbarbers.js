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
        searchParams.append("skip", pagination.skip);
        searchParams.append("limit", pagination.limit);

        const res = await axios.get(`/api/barber/barbers?${searchParams.toString()}`);

        if (res.data?.topRatedBarbers) {
          setBarbers(res.data.topRatedBarbers);
          setPagination((prev) => ({
            ...prev,
            total: res.data.totalTopRated || 0,
            totalPages: Math.ceil((res.data.totalTopRated || 0) / prev.limit),
          }));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load top-rated barbers.");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
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
  try {
    const response = await axios.delete("/api/barber/barbers", {
      data: { id }   // ✅ JSON body
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error deleting barber:", error);
  }
};

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Top Rated Barbers</h2>

      {/* Error */}
      {error && (
        <div className="bg-red-50 p-3 text-red-600 rounded-md mb-4">{error}</div>
      )}

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Table */}
      {!loading && barbers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-3 border">Barber</th>
                  <th className="px-4 py-3 border">Location</th>
                  <th className="px-4 py-3 border">Rating</th>
                  <th className="px-4 py-3 border">Services</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {barbers.map((barber, idx) => (
                  // <motion.tr
                  //   key={barber._id}
                  //   initial={{ opacity: 0, y: 10 }}
                  //   animate={{ opacity: 1, y: 0 }}
                  //   transition={{ delay: idx * 0.05 }}
                  //   className="hover:bg-gray-50"
                  // >
                  //   {/* Barber Name */}
                  //   <td className="px-4 py-3 border font-medium">{barber.username}</td>

                  //   {/* Location */}
                  //   <td className="px-4 py-3 border flex items-center gap-1 text-gray-700">
                  //     <MapPin className="h-4 w-4 text-gray-500" />
                  //     {barber.city}, {barber.province}
                  //   </td>

                  //   {/* Rating */}
                  //   <td className="px-4 py-3 border text-yellow-500 flex items-center gap-1">
                  //     {barber.rating > 0 ? (
                  //       <>
                  //         {barber.rating}
                  //         <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  //       </>
                  //     ) : (
                  //       "New"
                  //     )}
                  //   </td>

                  //   {/* Services Count */}
                  //   <td className="px-4 py-3 border">
                  //     {barber.services?.length || 0} services
                  //   </td>

                  //   {/* Actions */}
                  //   <td className="px-4 py-3 border flex gap-3">
                  //     <Link
                  //       href={`/customer/viewbarberProfile/${barber._id}`}
                  //       className="text-blue-600 hover:underline flex items-center gap-1"
                  //     >
                  //       <Eye className="h-4 w-4" /> View
                  //     </Link>
                  //     <button onClick={() => handleDelete(barber._id)} className="text-red-600 hover:underline flex items-center gap-1">
                  //       <Trash2 className="h-4 w-4" /> Delete
                  //     </button>
                  //     <button className="text-yellow-600 hover:underline flex items-center gap-1">
                  //       <Ban className="h-4 w-4" /> Block
                  //     </button>
                  //   </td>
                  //   <tr className=" w-full h-full px-4 py-3 border">
                  //     {barber.reports}
                  //   </tr>
                  // </motion.tr>
<motion.tr
  key={barber._id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: idx * 0.05 }}
  className="hover:bg-gray-50"
>
  {/* Barber Name */}
  <td className="px-4 py-3 border font-medium">{barber.username}</td>

  {/* Location */}
  <td className="px-4 py-3 border flex items-center gap-1 text-gray-700">
    <MapPin className="h-4 w-4 text-gray-500" />
    {barber.city}, {barber.province}
  </td>

  {/* Rating */}
  <td className="px-4 py-3 border text-yellow-500 flex items-center gap-1">
    {barber.rating > 0 ? (
      <>
        {barber.rating}
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      </>
    ) : (
      "New"
    )}
  </td>

  {/* Services Count */}
  <td className="px-4 py-3 border">
    {barber.services?.length || 0} services
  </td>

  {/* Reports Count */}
  <td className="px-4 py-3 border text-red-600 font-medium flex items-center gap-1">
    <Ban className="h-4 w-4" />
    {barber.reports || 0} reports
  </td>

  {/* Actions */}
  <td className="px-4 py-3 border flex gap-3">
    <Link
      href={`/customer/viewbarberProfile/${barber._id}`}
      className="text-blue-600 hover:underline flex items-center gap-1"
    >
      <Eye className="h-4 w-4" /> View
    </Link>
    <button
      onClick={() => handleDelete(barber._id)}
      className="text-red-600 hover:underline flex items-center gap-1"
    >
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

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrev}
              disabled={pagination.page === 1}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        !loading && (
          <p className="text-gray-500 text-center py-6">
            No top-rated barbers found
          </p>
        )
      )}
    </div>
  );
}

