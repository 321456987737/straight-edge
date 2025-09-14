"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Lock } from "lucide-react";

export default function SignIn() {
  const [form, setForm] = useState({ number: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      number: form.number,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      // Fetch session to get role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "barber") {
        router.push("/barber");
      } else {
        router.push("/customer/dashboard");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(112deg,#000_50%,#fff_50%)]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white text-black p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Sign in to continue</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="number" className="block text-sm font-medium mb-1">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" /> Phone Number
              </div>
            </label>
            <input
              id="number"
              name="number"
              type="text"
              value={form.number}
              onChange={handleChange}
              required
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              <div className="flex items-center">
                <Lock size={16} className="mr-2" /> Password
              </div>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded bg-black text-white font-semibold transition 
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"}`}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Phone, Lock } from "lucide-react";
// import Link from "next/link";

// export default function SignIn() {
//   const [form, setForm] = useState({ number: "", password: "" });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (error) setError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       // Call your API to validate login
//       const res = await axios.post("/api/auth/signin", form);
      
//       // Navigate to dashboard or role-specific page
//       if (res.data.role === "barber") {
//         router.push("/barber/dashboard");
//       } else {
//         router.push("/customer/dashboard");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Tilted black/white background */}
//       <div className="absolute inset-0 bg-[linear-gradient(112deg,#000_50%,#fff_50%)]"></div>

//       {/* Sign-in card */}
//       <motion.div 
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative z-10 w-full max-w-md bg-white text-black p-8 pt-0 rounded-2xl shadow-lg border border-gray-200"
//       >
//          <div>
//             <img src="/logo.png" alt="" className="w-40 h-40 mx-auto " />
//          </div>
//         <h1 className="text-2xl font-bold mb-4">Welcome Back</h1>
     

//         {error && (
//           <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label htmlFor="number" className="block text-sm font-medium mb-1">
//               <div className="flex items-center">
//                 <Phone size={16} className="mr-2" /> Phone Number
//               </div>
//             </label>
//             <input
//               id="number"
//               name="number"
//               type="text"
//               value={form.number}
//               onChange={handleChange}
//               required
//               className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder="+1 (555) 123-4567"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium mb-1">
//               <div className="flex items-center">
//                 <Lock size={16} className="mr-2" /> Password
//               </div>
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder="Enter your password"
//             />
//           </div>

//           <motion.button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full py-3 rounded bg-white text-black border-2 cursor-pointer border-black font-semibold transition 
//               ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:white"}`}
//             whileHover={isSubmitting ? {} : { scale: 1.02 }}
//             whileTap={isSubmitting ? {} : { scale: 0.98 }}
//           >
//             {isSubmitting ? "Signing In..." : "Sign In"}
//           </motion.button>
//         </form>
//            <p className="text-gray-600 my-6 text-center">create new <span className="text-blue-500"><Link href={"/signup?type=customer"}> account? </Link></span></p>
//       </motion.div>
//     </div>
//   );
// }
