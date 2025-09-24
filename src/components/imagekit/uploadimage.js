import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

export default function ImageUpload({ images = null, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get image src (File OR URL from DB)
  const getImageSrc = (img) => {
    if (!img) return null;
    if (img instanceof File) return URL.createObjectURL(img); // File upload
    if (Array.isArray(img) && img[0]?.url) return img[0].url; // From DB
    return null;
  };

  const imageSrc = getImageSrc(images);

  return (
    <div
      className="h-24 w-24 rounded-full overflow-hidden relative cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {!imageSrc ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-full flex flex-col items-center justify-center bg-[#D4AF37]/10"
        >
          <Upload className="w-6 h-6 text-[#D4AF37]" />
          <p className="text-[10px] text-[#D4AF37] text-center leading-tight">
            Upload
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            key={imageSrc}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative w-full h-full"
          >
            <img
              src={imageSrc}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-xs text-white">Change</p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}








// import { useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Upload } from "lucide-react";

// export default function ImageUpload({ images = null, onChange }) {
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     onChange(file);

//     // Reset input so same file can be reselected
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <div
//       className="h-24 w-24 rounded-full overflow-hidden relative cursor-pointer"
//       onClick={() => fileInputRef.current?.click()}
//     >
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileSelect}
//         accept="image/*"
//         className="hidden"
//       />

//       {!images ? (
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="w-full h-full flex flex-col items-center justify-center bg-[#D4AF37]/10"
//         >
//           <Upload className="w-6 h-6 text-[#D4AF37]" />
//           <p className="text-[10px] text-[#D4AF37] text-center leading-tight">
//             Upload
//           </p>
//         </motion.div>
//       ) : (
//         <AnimatePresence>
//           <motion.div
//             key={images.name}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             className="relative w-full h-full"
//           >
//             <img
//               src={URL.createObjectURL(images)}
//               alt="Profile Preview"
//               className="w-full h-full object-cover"
//             />
//             {/* Optional overlay for hover effect */}
//             <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
//               <p className="text-xs text-white">Change</p>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       )}
//     </div>
//   );
// }
