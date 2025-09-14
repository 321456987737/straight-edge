// components/FilterSidebar.js
"use client";
import { useState, useEffect } from "react";

const provinces = {
  Punjab: ["Lahore", "Rawalpindi", "Multan", "Faisalabad", "Gujranwala"],
  Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Abbottabad", "Mardan", "Swat"],
  Balochistan: ["Quetta", "Gwadar", "Turbat", "Khuzdar"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu", "Hunza"],
  "Azad Jammu and Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot"],
  "Islamabad Capital Territory": ["Islamabad"],
};

const specialties = [
  "Haircut",
  "Beard Trim",
  "Facial",
  "Hair Coloring",
  "Shave",
  "Hair Styling",
  "Kids Haircut",
];

const ratings = [
  { value: "5", label: "5 ★" },
  { value: "4", label: "4 ★ & Up" },
  { value: "3", label: "3 ★ & Up" },
];

export default function FilterSidebar({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) {
  const [province, setProvince] = useState(currentFilters.province || "");
  const [city, setCity] = useState(currentFilters.city || "");
  const [specialty, setSpecialty] = useState(currentFilters.specialty || "");
  const [rating, setRating] = useState(currentFilters.rating || "");

  useEffect(() => {
    setProvince(currentFilters.province || "");
    setCity(currentFilters.city || "");
    setSpecialty(currentFilters.specialty || "");
    setRating(currentFilters.rating || "");
  }, [currentFilters]);

  const handleApply = () => {
    onApply({
      province,
      city,
      specialty,
      rating,
    });
  };

  const handleReset = () => {
    setProvince("");
    setCity("");
    setSpecialty("");
    setRating("");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white text-black shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Province Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Province
              </label>
              <select
                className="w-full px-3 py-2 bg-white text-black border border-black rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setCity("");
                }}
              >
                <option value="">All Provinces</option>
                {Object.keys(provinces).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                City
              </label>
              <select
                className="w-full px-3 py-2 bg-white text-black border border-black rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!province}
              >
                <option value="">All Cities</option>
                {province &&
                  provinces[province].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Service
              </label>
              <select
                className="w-full px-3 py-2 bg-white text-black border border-black rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">All Services</option>
                {specialties.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Minimum Rating
              </label>
              <select
                className="w-full px-3 py-2 bg-white text-black border border-black rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Any Rating</option>
                {ratings.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-black bg-white flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-black rounded-md text-sm font-medium text-black hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// // components/FilterSidebar.js
// "use client";
// import { useState, useEffect } from "react";

// // Province/city data
// const provinces = {
//   Punjab: ["Lahore", "Rawalpindi", "Multan", "Faisalabad", "Gujranwala"],
//   Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
//   "Khyber Pakhtunkhwa": ["Peshawar", "Abbottabad", "Mardan", "Swat"],
//   Balochistan: ["Quetta", "Gwadar", "Turbat", "Khuzdar"],
//   "Gilgit-Baltistan": ["Gilgit", "Skardu", "Hunza"],
//   "Azad Jammu and Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot"],
//   "Islamabad Capital Territory": ["Islamabad"]
// };

// // Specialty options
// const specialties = ["Haircut", "Beard Trim", "Facial", "Hair Coloring", "Shave", "Hair Styling", "Kids Haircut"];

// // Rating options
// const ratings = [
//   { value: "5", label: "5 ★" },
//   { value: "4", label: "4 ★ & Up" },
//   { value: "3", label: "3 ★ & Up" },
// ];

// export default function FilterSidebar({ isOpen, onClose, onApply, currentFilters }) {
//   const [province, setProvince] = useState(currentFilters.province || "");
//   const [city, setCity] = useState(currentFilters.city || "");
//   const [specialty, setSpecialty] = useState(currentFilters.specialty || "");
//   const [rating, setRating] = useState(currentFilters.rating || "");

//   // Update local state when currentFilters changes
//   useEffect(() => {
//     setProvince(currentFilters.province || "");
//     setCity(currentFilters.city || "");
//     setSpecialty(currentFilters.specialty || "");
//     setRating(currentFilters.rating || "");
//   }, [currentFilters]);

//   const handleApply = () => {
//     onApply({
//       province,
//       city,
//       specialty,
//       rating
//     });
//   };

//   const handleReset = () => {
//     setProvince("");
//     setCity("");
//     setSpecialty("");
//     setRating("");
//   };

//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm z-[99]"

//           onClick={onClose}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-100 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <h2 className="text-xl font-semibold">Filters</h2>
//             <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
          
//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {/* Province Filter */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 value={province}
//                 onChange={(e) => {
//                   setProvince(e.target.value);
//                   setCity(""); // Reset city when province changes
//                 }}
//               >
//                 <option value="">All Provinces</option>
//                 {Object.keys(provinces).map((prov) => (
//                   <option key={prov} value={prov}>{prov}</option>
//                 ))}
//               </select>
//             </div>

//             {/* City Filter */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 disabled={!province}
//               >
//                 <option value="">All Cities</option>
//                 {province &&
//                   provinces[province].map((c) => (
//                     <option key={c} value={c}>{c}</option>
//                   ))}
//               </select>
//             </div>

//             {/* Specialty Filter */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 value={specialty}
//                 onChange={(e) => setSpecialty(e.target.value)}
//               >
//                 <option value="">All Services</option>
//                 {specialties.map((srv) => (
//                   <option key={srv} value={srv}>{srv}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Rating Filter */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//               >
//                 <option value="">Any Rating</option>
//                 {ratings.map((r) => (
//                   <option key={r.value} value={r.value}>{r.label}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div className="p-4 border-t bg-gray-50 flex justify-between">
//             <button
//               onClick={handleReset}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
//             >
//               Reset
//             </button>
//             <button
//               onClick={handleApply}
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }