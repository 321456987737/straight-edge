"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Image as ImageIcon, ArrowUp, Scissors, Star, Briefcase } from "lucide-react";
import axios from "axios";
import Image from "next/image";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  // Refs
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const reviewsRef = useRef(null);
  const portfolioRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`);
        setUser(res.data.Barber);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [id]);

  // Show scroll-to-top button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
      
      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 100;
      
      if (portfolioRef.current && scrollPosition >= portfolioRef.current.offsetTop) {
        setActiveSection("portfolio");
      } else if (reviewsRef.current && scrollPosition >= reviewsRef.current.offsetTop) {
        setActiveSection("reviews");
      } else if (servicesRef.current && scrollPosition >= servicesRef.current.offsetTop) {
        setActiveSection("services");
      } else if (aboutRef.current && scrollPosition >= aboutRef.current.offsetTop) {
        setActiveSection("about");
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll with offset
  const handleScroll = useCallback((ref, section) => {
    setActiveSection(section);
    if (ref.current) {
      const yOffset = -40; // 40px gap from top
      const y = ref.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  if (!user) return (
       <div className="relative mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-900 bg-white rounded-xl animate-pulse">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200" />
        <div className="text-center sm:text-left mt-4 sm:mt-0 flex-1 space-y-2">
          <div className="h-6 sm:h-7 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-4 sm:gap-6 mt-6 border-b border-gray-200 pb-2 hide-scrollbar">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-6 w-20 bg-gray-200 rounded"
          />
        ))}
      </div>

      {/* About Section */}
      <section className="mt-8">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </section>

      {/* Services */}
      <section className="mt-12">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100"
            >
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-12">
        <div className="h-6 w-28 bg-gray-200 rounded mb-4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-2"
            >
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="mt-12">
        <div className="h-6 w-28 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg"
            />
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="relative min-h-screen mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-900 bg-white rounded-xl   ">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {user?.image?.url ? (
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
            <Image
              src={user.image.url}
              alt={user.image.alt || user.username}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <UserIcon className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 p-4 text-gray-500" />
        )}
        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">{user.location}</p>
          {user.experience && (
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              {user.experience} years of experience
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex overflow-x-auto gap-4 sm:gap-6 mt-6 border-b border-gray-200 pb-2 hide-scrollbar">
        <button 
          onClick={() => handleScroll(aboutRef, "about")} 
          className={`text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
            activeSection === "about" 
              ? "text-gray-700 bg-blue-50 font-medium" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          About
        </button>
        <button 
          onClick={() => handleScroll(servicesRef, "services")} 
          className={`text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
            activeSection === "services" 
              ? "text-gray-700 bg-blue-50 font-medium" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Services & Prices
        </button>
        <button 
          onClick={() => handleScroll(reviewsRef, "reviews")} 
          className={`text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
            activeSection === "reviews" 
              ? "text-gray-700 bg-blue-50 font-medium" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Reviews
        </button>
        <button 
          onClick={() => handleScroll(portfolioRef, "portfolio")} 
          className={`text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
            activeSection === "portfolio" 
              ? "text-gray-700 bg-blue-50 font-medium" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Portfolio
        </button>
      </div>

      {/* About */}
      <section ref={aboutRef} className="mt-8">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2"
        >
          <UserIcon className="w-5 h-5" /> About Me
        </motion.h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {user.about || "No description available."}
        </p>
      </section>

      {/* Services */}
      <section ref={servicesRef} className="mt-12">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2"
        >
          <Scissors className="w-5 h-5" /> Services & Prices
        </motion.h2>
        {user.services?.length > 0 ? (
          <div className="space-y-3">
            {user.services.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                <span className="text-sm sm:text-base">{s.name}</span>
                <span className="text-gray-700 font-medium text-sm sm:text-base">
                  {s.duration ? `${s.duration} min - ` : ""}${s.price}$
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">No services available.</p>
        )}
      </section>

      {/* Reviews */}
      <section ref={reviewsRef} className="mt-12">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2"
        >
          <Star className="w-5 h-5" /> Reviews
        </motion.h2>
        {user.reviews?.length ? (
          <div className="space-y-4">
            {user.reviews.map((review, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                </div>
                <p className="text-sm sm:text-base text-gray-700">{review.comment}</p>
                {review.author && (
                  <p className="text-xs text-gray-500 mt-2">- {review.author}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">No reviews yet.</p>
        )}
      </section>

      {/* Portfolio */}
      <section ref={portfolioRef} className="mt-12">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2"
        >
          <Briefcase className="w-5 h-5" /> Portfolio
        </motion.h2>
        {user.portfolio?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {user.portfolio.map((item, i) => (
              <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                {item.url ? (
                  <Image 
                    src={item.url} 
                    alt={item.alt || `Portfolio image ${i+1}`} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">No portfolio images yet.</p>
        )}
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-10"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;