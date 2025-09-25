"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import BookNow from "@/components/bookNow";
import axios from "axios";
import {
  Star,
  MapPin,
  Scissors,
  ChevronRight,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Skeleton Loading Components
const BarberCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-screen">
    <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        ))}
      </div>
    </div>
    <div className="px-5 py-4 border-t border-gray-200 flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
    </div>
  </div>
);

const TopRatedSkeleton = () => (
  <div className="mb-10">
    <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <BarberCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default function TopRatedBarbersPage() {
  const [BookingComponent, setBookingComponent] = useState(false);
  const [barberdata, setbarberdata] = useState(null);
  const [topRatedBarbers, setTopRatedBarbers] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination for top-rated barbers
  const [topRatedPagination, setTopRatedPagination] = useState({
    skip: 0,
    limit: 8,
    total: 0,
    hasMore: true,
  });

  // Ref for infinite scrolling
  const topRatedObserver = useRef();

  // Infinite scroll for top-rated barbers
  const lastTopRatedBarberRef = useCallback(
    (node) => {
      if (topRatedLoading) return;
      if (topRatedObserver.current) topRatedObserver.current.disconnect();
      topRatedObserver.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            topRatedPagination.hasMore &&
            !topRatedLoading
          ) {
            setTopRatedPagination((prev) => ({
              ...prev,
              skip: prev.skip + prev.limit,
            }));
          }
        },
        { threshold: 0.1 }
      );
      if (node) topRatedObserver.current.observe(node);
    },
    [topRatedLoading, topRatedPagination.hasMore]
  );

  // Fetch top-rated barbers on initial load and when pagination changes
  useEffect(() => {
    const fetchTopRatedBarbers = async () => {
      if (!topRatedPagination.hasMore && topRatedPagination.skip > 0) return;

      setTopRatedLoading(true);
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("topRated", "true");
        searchParams.append("skip", topRatedPagination.skip);
        searchParams.append("limit", topRatedPagination.limit);

        const res = await axios.get(
          `/api/barber/barbers?${searchParams.toString()}`
        );

        if (res.data && res.data.topRatedBarbers) {
          setTopRatedBarbers((prev) => {
            // If skip is 0, replace results
            if (topRatedPagination.skip === 0) return res.data.topRatedBarbers;

            // Otherwise, append new results, avoiding duplicates
            const existingIds = new Set(prev.map((b) => b._id));
            const filteredBarbers = res.data.topRatedBarbers.filter(
              (b) => !existingIds.has(b._id)
            );
            return [...prev, ...filteredBarbers];
          });

          setTopRatedPagination((prev) => ({
            ...prev,
            total: res.data.totalTopRated || 0,
            hasMore: res.data.hasMoreTopRated || false,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch top-rated barbers:", err);
        setError("Failed to fetch top-rated barbers. Please try again.");
      } finally {
        setTopRatedLoading(false);
        setInitialLoading(false);
      }
    };

    fetchTopRatedBarbers();
  }, [
    topRatedPagination.skip,
    topRatedPagination.limit,
    topRatedPagination.hasMore,
  ]);

  // Render barber card with ref for infinite scrolling
  const renderBarberCard = (barber, index, array) => {
    // Determine if this is the last element in the array
    const isLastElement = index === array.length - 1;

    // Assign the ref for infinite scrolling
    const ref = isLastElement ? lastTopRatedBarberRef : null;

    return (
     <motion.div
        ref={ref}
        key={barber._id}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="bg-white w-full  rounded-lg  border justify-center border-black/20 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col "
      >
       
        {/* Image Section */}
        <div className="w-full flex items-center justify-center ">

        <div className="w-32 h-32 mt-4 rounded-full bg-gray-100  flex items-center justify-center border-b border-black/20">
          {barber.image ? (
            <img
            src={barber.image[0].url}
            alt={barber.username}
            width={300}
            height={160}
            className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="h-16 w-16 text-gray-600" />
          )}
        </div>
          </div>
 <div className="bg-gray-200 h-0.5 w-[75%] mx-auto mt-2"/>
        {/* Content */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-black">
                {barber.username}
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <MapPin className="inline-block h-4 w-4 mr-1 text-black" />
                {barber.city}, {barber.province}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-black text-black bg-white">
              {barber.rating > 0 ? (
                <>
                  {barber.rating}{" "}
                  <Star className="h-3 w-3 ml-1 fill-black text-black" />
                </>
              ) : (
                "New"
              )}
            </span>
          </div>

          {/* Services */}
          <div className="mt-4">
            {barber.services &&
              barber.services.length > 0 &&
              barber.services.slice(0, 3).map((service, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.3 }}
                  className="inline-block border border-black rounded-full px-3 py-1 text-sm font-medium text-black mr-2 mb-2"
                >
                  <Scissors className="inline-block h-3 w-3 mr-1 text-black" />
                  {service.name} - ${service.price}
                </motion.span>
              ))}
            {barber.services && barber.services.length > 3 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="inline-block border border-black rounded-full px-3 py-1 text-sm font-medium text-black"
              >
                +{barber.services.length - 3} more
              </motion.span>
            )}
          </div>
        </div>

        {/* Footer always aligned */}
        <div className="px-5 py-4 border-t border-black/20 flex justify-between items-center">
          <Link
            href={`/customer/viewbarberProfile/${barber._id}`}
            className="text-sm font-medium text-black hover:underline flex items-center"
          >
            View Profile <ChevronRight className="h-4 w-4 ml-1 text-black" />
          </Link>
          <button onClick={() => {
            setBookingComponent(!BookingComponent)
            setbarberdata(barber);
          }} className="bg-black text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-800 transition">
            Book now
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="p-6 max-w-[1200px] mx-auto min-h-[100vh]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Professional Barbers
        </h1>
        
        {/* Initial Loading Skeleton */}
        {initialLoading && (
          <div>
            <TopRatedSkeleton />
          </div>
        )}

        {/* Top Rated Barbers Section */}
        {!initialLoading && topRatedBarbers.length > 0 && (
          <div className="mb-10">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {topRatedBarbers.map((barber, idx) =>
                renderBarberCard(barber, idx, topRatedBarbers)
              )}
            </div>
            {topRatedLoading && (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                {[...Array(2)].map((_, i) => (
                  <BarberCardSkeleton key={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 p-4 rounded-md my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!initialLoading && !error && topRatedBarbers.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No top-rated barbers found
            </h3>
            <p className="mt-1 text-gray-500">
              Check back later for top-rated barbers in your area
            </p>
          </div>
        )}
      </div>
      
      {BookingComponent && (
        <div>
          <div>
            {barberdata && <BookNow handleClose={setBookingComponent} barber={barberdata} />}
          </div>
        </div>
      )}
    </>
  );
}