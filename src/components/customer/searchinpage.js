"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import BookNow from "../bookNow";
import axios from "axios";
import FilterSidebar from "@/components/FilterSidebar";
import {
  Star,
  MapPin,
  Scissors,
  ChevronRight,
  Search,
  Filter,
  X,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Skeleton Loading Components
const BarberCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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

const SearchResultsSkeleton = () => (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <BarberCardSkeleton key={i} />
    ))}
  </div>
);

export default function SearchInPage() {

  const [BookingComponent, setBookingComponent] = useState(false);
  const [barberdata, setbarberdata] = useState(null);
  console.log(barberdata,"this is the barber data ")
  // State for search and filters
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [topRatedBarbers, setTopRatedBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    province: "",
    city: "",
    specialty: "",
    rating: "",
  });

  // Separate pagination for search results and top-rated barbers
  const [searchPagination, setSearchPagination] = useState({
    skip: 0,
    limit: 2,
    total: 0,
    hasMore: true,
  });

  const [topRatedPagination, setTopRatedPagination] = useState({
    skip: 0,
    limit: 6,
    total: 0,
    hasMore: true,
  });

  // Track if we've made our initial data fetch
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  // Separate refs for search results and top-rated barbers
  const searchObserver = useRef();
  const topRatedObserver = useRef();

  // Infinite scroll for search results
  const lastSearchBarberRef = useCallback(
    (node) => {
      if (loading) return;
      if (searchObserver.current) searchObserver.current.disconnect();
      searchObserver.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            searchPagination.hasMore &&
            !loading
          ) {
            console.log("Loading more search results...");
            setSearchPagination((prev) => ({
              ...prev,
              skip: prev.skip + prev.limit,
            }));
          }
        },
        { threshold: 0.1 }
      );
      if (node) searchObserver.current.observe(node);
    },
    [loading, searchPagination.hasMore]
  );

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
            console.log("Loading more top-rated barbers...");
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
      } finally {
        setTopRatedLoading(false);
        setHasFetchedInitialData(true);
        setInitialLoading(false);
      }
    };

    fetchTopRatedBarbers();
  }, [
    topRatedPagination.skip,
    topRatedPagination.limit,
    topRatedPagination.hasMore,
  ]);

  // Fetch barbers with filters and pagination
  useEffect(() => {
    const fetchBarbers = async () => {
      if (!searchPagination.hasMore && searchPagination.skip > 0) return;

      setLoading(true);
      setError("");
      try {
        const searchParams = new URLSearchParams();
        if (query.trim()) searchParams.append("search", query);
        if (filters.province) searchParams.append("province", filters.province);
        if (filters.city) searchParams.append("city", filters.city);
        if (filters.specialty)
          searchParams.append("specialty", filters.specialty);
        if (filters.rating) searchParams.append("rating", filters.rating);
        searchParams.append("skip", searchPagination.skip);
        searchParams.append("limit", searchPagination.limit);

        console.log(
          `Fetching barbers with skip=${searchPagination.skip}, limit=${searchPagination.limit}`
        );
        const res = await axios.get(
          `/api/barber/barbers?${searchParams.toString()}`
        );

        if (res.data && res.data.Barbers) {
          const newBarbers = res.data.Barbers || [];

          setResults((prev) => {
            // If skip is 0, replace results (new search/filter)
            if (searchPagination.skip === 0) return newBarbers;

            // Otherwise, append new results, avoiding duplicates
            const existingIds = new Set(prev.map((b) => b._id));
            const filteredBarbers = newBarbers.filter(
              (b) => !existingIds.has(b._id)
            );
            return [...prev, ...filteredBarbers];
          });

          setSearchPagination((prev) => ({
            ...prev,
            total: res.data.total || 0,
            hasMore: res.data.hasMore || false,
          }));
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch barbers. Please try again.");
        if (searchPagination.skip === 0) setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if there's a search query or active filters
    if (
      query.trim() ||
      filters.province ||
      filters.city ||
      filters.specialty ||
      filters.rating
    ) {
      fetchBarbers();
    } else if (searchPagination.skip === 0) {
      // Reset results when there's no search or filters
      setResults([]);
      setLoading(false);
    }
  }, [
    query,
    filters.province,
    filters.city,
    filters.specialty,
    filters.rating,
    searchPagination.skip,
    searchPagination.limit,
    searchPagination.hasMore,
  ]);

  // Reset search pagination when filters/search change
  useEffect(() => {
    setResults([]);
    setSearchPagination((prev) => ({ ...prev, skip: 0, hasMore: true }));
  }, [
    query,
    filters.province,
    filters.city,
    filters.specialty,
    filters.rating,
  ]);

  // Apply filters from sidebar
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      province: "",
      city: "",
      specialty: "",
      rating: "",
    });
    setQuery("");
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.province || filters.city || filters.specialty || filters.rating;
  const isSearching = query || hasActiveFilters;

  // Render barber card with proper ref for infinite scrolling
  const renderBarberCard = (barber, index, array, isTopRated = false) => {
    // Determine if this is the last element in the array
    const isLastElement = index === array.length - 1;

    // Assign the appropriate ref based on whether it's a top-rated barber or search result
    const ref = isLastElement
      ? isTopRated
        ? lastTopRatedBarberRef
        : lastSearchBarberRef
      : null;

    return (
      <motion.div
        ref={ref}
        key={barber._id}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg border border-black/20 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
      >
        {/* Image Section */}
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center border-b border-black/20">
          {barber.image ? (
            <Image
              src={barber.image}
              alt={barber.username}
              width={300}
              height={160}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-gray-600" />
          )}
        </div>

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
          {/* <BookNow barber={barber} /> */}
        </div>
      </motion.div>
    );
  };

  return (
    <>
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Find Your Perfect Barber
      </h1>
      {/* Search Input & Filters */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, location, or service..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
        >
          <Filter className="h-5 w-5 mr-1" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
              !
            </span>
          )}
        </button>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.province && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Province: {filters.province}
              <button
                onClick={() =>
                  setFilters({ ...filters, province: "", city: "" })
                }
                className="ml-2 text-blue-600 hover:text-blue-800"
                aria-label="Remove province filter"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              City: {filters.city}
              <button
                onClick={() => setFilters({ ...filters, city: "" })}
                className="ml-2 text-green-600 hover:text-green-800"
                aria-label="Remove city filter"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          {filters.specialty && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Service: {filters.specialty}
              <button
                onClick={() => setFilters({ ...filters, specialty: "" })}
                className="ml-2 text-purple-600 hover:text-purple-800"
                aria-label="Remove specialty filter"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          {filters.rating && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Min Rating: {filters.rating}{" "}
              <Star className="h-3 w-3 ml-1 fill-current" />
              <button
                onClick={() => setFilters({ ...filters, rating: "" })}
                className="ml-2 text-yellow-600 hover:text-yellow-800"
                aria-label="Remove rating filter"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-sm text-gray-600 hover:text-gray-800 underline flex items-center"
          >
            Clear all filters
          </button>
        </div>
      )}
      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
      
      {/* Initial Loading Skeleton - Show only before any data is fetched */}
      {initialLoading && !hasFetchedInitialData && (
        <div>
          <TopRatedSkeleton />
        </div>
      )}

      {/* Top Rated Barbers Section with Skeleton */}
      {!initialLoading && topRatedBarbers.length > 0 && !isSearching && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Top Rated Barbers
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {topRatedBarbers.map((barber, idx) =>
              renderBarberCard(barber, idx, topRatedBarbers, true)
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

      {/* Search Results with Skeleton */}
      {isSearching && (
        <>
          {!loading && results.length > 0 && (
            <p className="text-gray-600 mb-4">
              {searchPagination.total} barber
              {searchPagination.total !== 1 ? "s" : ""} found
            </p>
          )}
          
          {loading && searchPagination.skip === 0 ? (
            <SearchResultsSkeleton />
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((barber, idx) =>
                  renderBarberCard(barber, idx, results, false)
                )}
              </div>
              {loading && (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                  {[...Array(2)].map((_, i) => (
                    <BarberCardSkeleton key={i} />
                  ))}
                </div>
              )}
            </>
          )}
          
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
          {!loading && !error && results.length === 0 && (
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
                No barbers found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <div className="mt-6">
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    {BookingComponent && (
  <div >
    <div>
      {barberdata && <BookNow handleClose={setBookingComponent} barber={barberdata} />}
    </div>
  </div>
)}

</>
  );
}
// "use client";
// import { useState, useEffect, useRef, useCallback } from "react";
// import BookNow from "../bookNow";
// import axios from "axios";
// import FilterSidebar from "@/components/FilterSidebar";
// import {
//   Star,
//   MapPin,
//   Scissors,
//   ChevronRight,
//   Search,
//   Filter,
//   X,
//   User,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";

// // Skeleton Loading Components
// const BarberCardSkeleton = () => (
//   <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//     {/* Image Skeleton */}
//     <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
    
//     {/* Content Skeleton */}
//     <div className="p-5">
//       <div className="flex justify-between items-start mb-4">
//         <div className="space-y-2">
//           <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
//           <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
//         </div>
//         <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
//       </div>
      
//       {/* Services Skeleton */}
//       <div className="flex flex-wrap gap-2 mt-4">
//         {[...Array(3)].map((_, i) => (
//           <div key={i} className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
//         ))}
//       </div>
//     </div>
    
//     {/* Footer Skeleton */}
//     <div className="px-5 py-4 border-t border-gray-200 flex justify-between items-center">
//       <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
//       <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
//     </div>
//   </div>
// );

// const TopRatedSkeleton = () => (
//   <div className="mb-10">
//     <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
//     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//       {[...Array(4)].map((_, i) => (
//         <BarberCardSkeleton key={i} />
//       ))}
//     </div>
//   </div>
// );

// const SearchResultsSkeleton = () => (
//   <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//     {[...Array(4)].map((_, i) => (
//       <BarberCardSkeleton key={i} />
//     ))}
//   </div>
// );

// export default function SearchInPage() {
//   // State for search and filters
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [topRatedBarbers, setTopRatedBarbers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [topRatedLoading, setTopRatedLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     province: "",
//     city: "",
//     specialty: "",
//     rating: "",
//   });

//   // Separate pagination for search results and top-rated barbers
//   const [searchPagination, setSearchPagination] = useState({
//     skip: 0,
//     limit: 2,
//     total: 0,
//     hasMore: true,
//   });

//   const [topRatedPagination, setTopRatedPagination] = useState({
//     skip: 0,
//     limit: 6,
//     total: 0,
//     hasMore: true,
//   });

//   // Track if we've made our initial data fetch
//   const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

//   // Separate refs for search results and top-rated barbers
//   const searchObserver = useRef();
//   const topRatedObserver = useRef();

//   // Infinite scroll for search results
//   const lastSearchBarberRef = useCallback(
//     (node) => {
//       if (loading) return;
//       if (searchObserver.current) searchObserver.current.disconnect();
//       searchObserver.current = new IntersectionObserver(
//         (entries) => {
//           if (
//             entries[0].isIntersecting &&
//             searchPagination.hasMore &&
//             !loading
//           ) {
//             console.log("Loading more search results...");
//             setSearchPagination((prev) => ({
//               ...prev,
//               skip: prev.skip + prev.limit,
//             }));
//           }
//         },
//         { threshold: 0.1 }
//       ); // Lower threshold for earlier detection
//       if (node) searchObserver.current.observe(node);
//     },
//     [loading, searchPagination.hasMore]
//   );

//   // Infinite scroll for top-rated barbers
//   const lastTopRatedBarberRef = useCallback(
//     (node) => {
//       if (topRatedLoading) return;
//       if (topRatedObserver.current) topRatedObserver.current.disconnect();
//       topRatedObserver.current = new IntersectionObserver(
//         (entries) => {
//           if (
//             entries[0].isIntersecting &&
//             topRatedPagination.hasMore &&
//             !topRatedLoading
//           ) {
//             console.log("Loading more top-rated barbers...");
//             setTopRatedPagination((prev) => ({
//               ...prev,
//               skip: prev.skip + prev.limit,
//             }));
//           }
//         },
//         { threshold: 0.1 }
//       ); // Lower threshold for earlier detection
//       if (node) topRatedObserver.current.observe(node);
//     },
//     [topRatedLoading, topRatedPagination.hasMore]
//   );

//   // Fetch top-rated barbers on initial load and when pagination changes
//   useEffect(() => {
//     const fetchTopRatedBarbers = async () => {
//       if (!topRatedPagination.hasMore && topRatedPagination.skip > 0) return;

//       setTopRatedLoading(true);
//       try {
//         const searchParams = new URLSearchParams();
//         searchParams.append("topRated", "true");
//         searchParams.append("skip", topRatedPagination.skip);
//         searchParams.append("limit", topRatedPagination.limit);

//         const res = await axios.get(
//           `/api/barber/barbers?${searchParams.toString()}`
//         );

//         if (res.data && res.data.topRatedBarbers) {
//           setTopRatedBarbers((prev) => {
//             // If skip is 0, replace results
//             if (topRatedPagination.skip === 0) return res.data.topRatedBarbers;

//             // Otherwise, append new results, avoiding duplicates
//             const existingIds = new Set(prev.map((b) => b._id));
//             const filteredBarbers = res.data.topRatedBarbers.filter(
//               (b) => !existingIds.has(b._id)
//             );
//             return [...prev, ...filteredBarbers];
//           });

//           setTopRatedPagination((prev) => ({
//             ...prev,
//             total: res.data.totalTopRated || 0,
//             hasMore: res.data.hasMoreTopRated || false,
//           }));
//         }
//       } catch (err) {
//         console.error("Failed to fetch top-rated barbers:", err);
//       } finally {
//         setTopRatedLoading(false);
//         setHasFetchedInitialData(true);
//         setInitialLoading(false);
//       }
//     };

//     fetchTopRatedBarbers();
//   }, [
//     topRatedPagination.skip,
//     topRatedPagination.limit,
//     topRatedPagination.hasMore,
//   ]);

//   // Fetch barbers with filters and pagination
//   useEffect(() => {
//     const fetchBarbers = async () => {
//       if (!searchPagination.hasMore && searchPagination.skip > 0) return;

//       setLoading(true);
//       setError("");
//       try {
//         const searchParams = new URLSearchParams();
//         if (query.trim()) searchParams.append("search", query);
//         if (filters.province) searchParams.append("province", filters.province);
//         if (filters.city) searchParams.append("city", filters.city);
//         if (filters.specialty)
//           searchParams.append("specialty", filters.specialty);
//         if (filters.rating) searchParams.append("rating", filters.rating);
//         searchParams.append("skip", searchPagination.skip);
//         searchParams.append("limit", searchPagination.limit);

//         console.log(
//           `Fetching barbers with skip=${searchPagination.skip}, limit=${searchPagination.limit}`
//         );
//         const res = await axios.get(
//           `/api/barber/barbers?${searchParams.toString()}`
//         );

//         if (res.data && res.data.Barbers) {
//           const newBarbers = res.data.Barbers || [];

//           setResults((prev) => {
//             // If skip is 0, replace results (new search/filter)
//             if (searchPagination.skip === 0) return newBarbers;

//             // Otherwise, append new results, avoiding duplicates
//             const existingIds = new Set(prev.map((b) => b._id));
//             const filteredBarbers = newBarbers.filter(
//               (b) => !existingIds.has(b._id)
//             );
//             return [...prev, ...filteredBarbers];
//           });

//           setSearchPagination((prev) => ({
//             ...prev,
//             total: res.data.total || 0,
//             hasMore: res.data.hasMore || false,
//           }));
//         }
//       } catch (err) {
//         console.error("Search error:", err);
//         setError("Failed to fetch barbers. Please try again.");
//         if (searchPagination.skip === 0) setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Only fetch if there's a search query or active filters
//     if (
//       query.trim() ||
//       filters.province ||
//       filters.city ||
//       filters.specialty ||
//       filters.rating
//     ) {
//       fetchBarbers();
//     } else if (searchPagination.skip === 0) {
//       // Reset results when there's no search or filters
//       setResults([]);
//       setLoading(false);
//     }
//   }, [
//     query,
//     filters.province,
//     filters.city,
//     filters.specialty,
//     filters.rating,
//     searchPagination.skip,
//     searchPagination.limit,
//     searchPagination.hasMore,
//   ]);

//   // Reset search pagination when filters/search change
//   useEffect(() => {
//     setResults([]);
//     setSearchPagination((prev) => ({ ...prev, skip: 0, hasMore: true }));
//   }, [
//     query,
//     filters.province,
//     filters.city,
//     filters.specialty,
//     filters.rating,
//   ]);

//   // Apply filters from sidebar
//   const handleApplyFilters = (newFilters) => {
//     setFilters(newFilters);
//     setShowFilters(false);
//   };

//   // Reset all filters
//   const handleResetFilters = () => {
//     setFilters({
//       province: "",
//       city: "",
//       specialty: "",
//       rating: "",
//     });
//     setQuery("");
//   };

//   // Check if any filter is active
//   const hasActiveFilters =
//     filters.province || filters.city || filters.specialty || filters.rating;
//   const isSearching = query || hasActiveFilters;

//   // Render barber card with proper ref for infinite scrolling
//   const renderBarberCard = (barber, index, array, isTopRated = false) => {
//     // Determine if this is the last element in the array
//     const isLastElement = index === array.length - 1;

//     // Assign the appropriate ref based on whether it's a top-rated barber or search result
//     const ref = isLastElement
//       ? isTopRated
//         ? lastTopRatedBarberRef
//         : lastSearchBarberRef
//       : null;

//     return (
//       <motion.div
//         ref={ref}
//         key={barber._id}
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         whileHover={{ scale: 1.02 }}
//         className="bg-white rounded-lg border border-black/20 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
//       >
//         {/* Image Section */}
//         <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center border-b border-black/20">
//           {barber.image ? (
//             <Image
//               src={barber.image}
//               alt={barber.username}
//               width={300}
//               height={160}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <User className="h-16 w-16 text-gray-600" />
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-5 flex-1">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="text-lg font-semibold text-black">
//                 {barber.username}
//               </h3>
//               <p className="text-sm text-gray-700 mt-1">
//                 <MapPin className="inline-block h-4 w-4 mr-1 text-black" />
//                 {barber.city}, {barber.province}
//               </p>
//             </div>
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-black text-black bg-white">
//               {barber.rating > 0 ? (
//                 <>
//                   {barber.rating}{" "}
//                   <Star className="h-3 w-3 ml-1 fill-black text-black" />
//                 </>
//               ) : (
//                 "New"
//               )}
//             </span>
//           </div>

//           {/* Services */}
//           <div className="mt-4">
//             {barber.services &&
//               barber.services.length > 0 &&
//               barber.services.slice(0, 3).map((service, idx) => (
//                 <motion.span
//                   key={idx}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 + idx * 0.1, duration: 0.3 }}
//                   className="inline-block border border-black rounded-full px-3 py-1 text-sm font-medium text-black mr-2 mb-2"
//                 >
//                   <Scissors className="inline-block h-3 w-3 mr-1 text-black" />
//                   {service.name} - ${service.price}
//                 </motion.span>
//               ))}
//             {barber.services && barber.services.length > 3 && (
//               <motion.span
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5, duration: 0.3 }}
//                 className="inline-block border border-black rounded-full px-3 py-1 text-sm font-medium text-black"
//               >
//                 +{barber.services.length - 3} more
//               </motion.span>
//             )}
//           </div>
//         </div>

//         {/* Footer always aligned */}
//         <div className="px-5 py-4 border-t border-black/20 flex justify-between items-center">
//           <Link
//             href={`/customer/viewbarberProfile/${barber._id}`}
//             className="text-sm font-medium text-black hover:underline flex items-center"
//           >
//             View Profile <ChevronRight className="h-4 w-4 ml-1 text-black" />
//           </Link>
//           <motion.div
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
//           >
//            <BookNow barber={barber} />
//             {/* <BookNow barber={barber} /> */}
//           </motion.div>
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="p-6 max-w-[1200px] mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         Find Your Perfect Barber
//       </h1>
//       {/* Search Input & Filters */}
//       <div className="flex gap-2 mb-6">
//         <div className="relative flex-1">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search by name, location, or service..."
//             className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//         </div>
//         <button
//           onClick={() => setShowFilters(true)}
//           className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
//         >
//           <Filter className="h-5 w-5 mr-1" />
//           Filters
//           {hasActiveFilters && (
//             <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
//               !
//             </span>
//           )}
//         </button>
//       </div>
//       {/* Active Filters Display */}
//       {hasActiveFilters && (
//         <div className="flex flex-wrap gap-2 mb-6">
//           {filters.province && (
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//               Province: {filters.province}
//               <button
//                 onClick={() =>
//                   setFilters({ ...filters, province: "", city: "" })
//                 }
//                 className="ml-2 text-blue-600 hover:text-blue-800"
//                 aria-label="Remove province filter"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </span>
//           )}
//           {filters.city && (
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//               City: {filters.city}
//               <button
//                 onClick={() => setFilters({ ...filters, city: "" })}
//                 className="ml-2 text-green-600 hover:text-green-800"
//                 aria-label="Remove city filter"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </span>
//           )}
//           {filters.specialty && (
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//               Service: {filters.specialty}
//               <button
//                 onClick={() => setFilters({ ...filters, specialty: "" })}
//                 className="ml-2 text-purple-600 hover:text-purple-800"
//                 aria-label="Remove specialty filter"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </span>
//           )}
//           {filters.rating && (
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
//               Min Rating: {filters.rating}{" "}
//               <Star className="h-3 w-3 ml-1 fill-current" />
//               <button
//                 onClick={() => setFilters({ ...filters, rating: "" })}
//                 className="ml-2 text-yellow-600 hover:text-yellow-800"
//                 aria-label="Remove rating filter"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </span>
//           )}
//           <button
//             onClick={handleResetFilters}
//             className="text-sm text-gray-600 hover:text-gray-800 underline flex items-center"
//           >
//             Clear all filters
//           </button>
//         </div>
//       )}
//       {/* Filter Sidebar */}
//       <FilterSidebar
//         isOpen={showFilters}
//         onClose={() => setShowFilters(false)}
//         onApply={handleApplyFilters}
//         currentFilters={filters}
//       />
      
//       {/* Initial Loading Skeleton - Show only before any data is fetched */}
//       {initialLoading && !hasFetchedInitialData && (
//         <div>
//           <TopRatedSkeleton />
//         </div>
//       )}

//       {/* Top Rated Barbers Section with Skeleton */}
//       {!initialLoading && topRatedBarbers.length > 0 && !isSearching && (
//         <div className="mb-10">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//             Top Rated Barbers
//           </h2>
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//             {topRatedBarbers.map((barber, idx) =>
//               renderBarberCard(barber, idx, topRatedBarbers, true)
//             )}
//           </div>
//           {topRatedLoading && (
//             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
//               {[...Array(2)].map((_, i) => (
//                 <BarberCardSkeleton key={i} />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Search Results with Skeleton */}
//       {isSearching && (
//         <>
//           {!loading && results.length > 0 && (
//             <p className="text-gray-600 mb-4">
//               {searchPagination.total} barber
//               {searchPagination.total !== 1 ? "s" : ""} found
//             </p>
//           )}
          
//           {loading && searchPagination.skip === 0 ? (
//             <SearchResultsSkeleton />
//           ) : (
//             <>
//               <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//                 {results.map((barber, idx) =>
//                   renderBarberCard(barber, idx, results, false)
//                 )}
//               </div>
//               {loading && (
//                 <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
//                   {[...Array(2)].map((_, i) => (
//                     <BarberCardSkeleton key={i} />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
          
//           {error && (
//             <div className="bg-red-50 p-4 rounded-md my-6">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-red-400"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* No Results Message */}
//           {!loading && !error && results.length === 0 && (
//             <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">
//                 No barbers found
//               </h3>
//               <p className="mt-1 text-gray-500">
//                 Try adjusting your search or filter criteria
//               </p>
//               <div className="mt-6">
//                 <button
//                   onClick={handleResetFilters}
//                   className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                 >
//                   Reset All Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
