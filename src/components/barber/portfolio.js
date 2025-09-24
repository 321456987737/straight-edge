"use client"
import { useSession } from "next-auth/react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Upload, Image as ImageIcon, Plus } from "lucide-react"

const Portfolio = () => {
  const { data: session } = useSession()
  const [portfolio, setPortfolio] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const id = session?.user?.id || session?.user?._id

  useEffect(() => {
    if (!id) return
    fetchPortfolio(id)
  }, [id])

  const fetchPortfolio = async (id) => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/barber/${id}/portfolio`)
      setPortfolio(res.data.portfolio || [])
      setLoading(false)
    } catch (err) {
      setError("Failed to load portfolio")
      setLoading(false)
    }
  }

  const handleAddImage = async (file) => {
    if (!file || !id) return
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("images", file)
      const uploadimage = await axios.post("/api/upload", formData)
      const newimage = uploadimage.data.images
      const updateddata = newimage 
      const res = await axios.post(`/api/barber/${id}/portfolio`, {updateddata:updateddata} )
      setPortfolio(res.data.portfolio)
      setUploading(false)
      // Reset the file input after successful upload
      document.getElementById('file-input').value = ""
    } catch (err) {
      setError("Failed to upload image")
      setUploading(false)
    }
  }

  const handleDelete = async (fileId) => {
   try {
      await axios.delete(`/api/barber/${id}/portfolio`,{data:{fileId}})
      await axios.delete(`/api/upload`,{data:{fileId}})
   
   } catch (error) {
      setError("Failed to delete image")
      throw new Error(error)
   }
    setPortfolio((prev) => prev.filter(item => item.fileId !== fileId))
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
        <p className="text-gray-600">Showcase your best work to attract more clients</p>
      </div>

      {/* Upload Section */}
      <AddImage onUpload={handleAddImage} uploading={uploading} />

      {/* Portfolio Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Portfolio Images ({portfolio.length})</h2>

        {loading && <Skeleton />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <AnimatePresence>
          {!loading && portfolio.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {portfolio.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={item.url}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.fileId)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <X size={18} />
                  </button>
                  
                  {/* Image Number Badge */}
                  <div className="absolute top-3 left-3 bg-black/50 text-white text-sm px-2 py-1 rounded-full">
                    #{idx + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {!loading && portfolio.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No portfolio images yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Start building your portfolio by uploading your best work. Clients love to see examples of your skills!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Portfolio

// Upload Section Component - Fixed to work with your original function
const AddImage = ({ onUpload, uploading }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    setFile(selected)
    setPreview(selected ? URL.createObjectURL(selected) : "")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (file) {
      onUpload(file)
      // Reset after submit
      setFile(null)
      setPreview("")
    }
  }

  const resetFile = () => {
    setFile(null)
    setPreview("")
    document.getElementById('file-input').value = ""
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Upload className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add New Portfolio Image</h3>
          <p className="text-sm text-gray-600">Upload your best haircut photos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* File Input Area */}
          <div className={`flex-1 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            preview 
              ? 'border-green-200 bg-green-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}>
            {preview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-md mx-auto"
                  />
                  <button
                    type="button"
                    onClick={resetFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm text-green-600 font-medium">Image ready to upload!</p>
              </div>
            ) : (
              <div className="space-y-3 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 10MB)</p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Upload Info and Button */}
          <div className="lg:w-80 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Tips for great portfolio images:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use good lighting</li>
                <li>• Show different angles</li>
                <li>• High resolution images</li>
                <li>• Focus on the haircut</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add to Portfolio
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// Skeleton Loader
const Skeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, idx) => (
        <div key={idx} className="space-y-3">
          <div className="h-64 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl" />
        </div>
      ))}
    </div>
  )
}

// "use client"
// import { useSession } from "next-auth/react"
// import axios from "axios"
// import { motion, AnimatePresence } from "framer-motion"
// import { useState, useEffect } from "react"
// import { X } from "lucide-react"

// const Portfolio = () => {
//   const { data: session } = useSession()
//   const [portfolio, setPortfolio] = useState([])
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [uploading, setUploading] = useState(false)

//   const id = session?.user?.id || session?.user?._id

//   useEffect(() => {
//     if (!id) return
//     fetchPortfolio(id)
//   }, [id])

//   const fetchPortfolio = async (id) => {
//     try {
//       setLoading(true)
//       const res = await axios.get(`/api/barber/${id}/portfolio`)
//       setPortfolio(res.data.portfolio || [])
//       setLoading(false)
//     } catch (err) {
//       setError("Failed to load portfolio")
//       setLoading(false)
//     }
//   }

//   const handleAddImage = async (file) => {
//     if (!file || !id) return
//     try {
//       setUploading(true)
//       const formData = new FormData()
//       formData.append("images", file)
//       const uploadimage = await axios.post("/api/upload", formData)
//       const newimage = uploadimage.data.images
//       const updateddata = { portfolio: newimage }

//       const res = await axios.post(`/api/barber/${id}/portfolio`, { updateddata })
//       setPortfolio(res.data.portfolio)
//       setUploading(false)
//     } catch (err) {
//       console.error(err)
//       setError("Failed to upload image")
//       setUploading(false)
//     }
//   }

//   const handleDelete = async (idx) => {
//     const confirmDelete = window.confirm("Delete this image from portfolio?")
//     if (!confirmDelete) return

//     // here you’d call your delete API
//     // e.g. await axios.delete(`/api/barber/${id}/portfolio/${imageId}`)
//     // for now just remove locally:
//     setPortfolio((prev) => prev.filter((_, i) => i !== idx))
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Upload Section */}
//       <AddImage onUpload={handleAddImage} uploading={uploading} />

//       <h2 className="text-xl font-semibold text-gray-800">Portfolio</h2>

//       {loading && <Skeleton />}

//       {error && <p className="text-red-500">{error}</p>}

//       <AnimatePresence>
//         {!loading && portfolio.length > 0 && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//             {portfolio.map((item, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.2 }}
//                 className="relative group rounded-xl overflow-hidden shadow hover:shadow-lg"
//               >
//                 <img
//                   src={item.url}
//                   alt={`Portfolio ${idx}`}
//                   className="w-full h-48 object-cover"
//                 />
//                 {/* Delete Button */}
//                 <button
//                   onClick={() => handleDelete(idx)}
//                   className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//                 >
//                   <X size={16} />
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </AnimatePresence>

//       {!loading && portfolio.length === 0 && !error && (
//         <p className="text-gray-500">No portfolio images found.</p>
//       )}
//     </div>
//   )
// }

// export default Portfolio

// // Upload Section Component
// const AddImage = ({ onUpload, uploading }) => {
//   const [file, setFile] = useState(null)
//   const [preview, setPreview] = useState("")

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0]
//     setFile(selected)
//     setPreview(selected ? URL.createObjectURL(selected) : "")
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (file) onUpload(file)
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col sm:flex-row items-center gap-4"
//     >
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="block w-full text-sm text-gray-500
//           file:mr-4 file:py-2 file:px-4
//           file:rounded-lg file:border-0
//           file:text-sm file:font-semibold
//           file:bg-blue-500 file:text-white
//           hover:file:bg-blue-600"
//       />

//       {preview && (
//         <div className="w-20 h-20 rounded-lg overflow-hidden border">
//           <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={uploading}
//         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
//       >
//         {uploading ? "Uploading..." : "Add to Portfolio"}
//       </button>
//     </form>
//   )
// }

// // Skeleton Loader
// const Skeleton = () => {
//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//       {[...Array(8)].map((_, idx) => (
//         <div
//           key={idx}
//           className="h-48 w-full bg-gray-200 animate-pulse rounded-xl"
//         />
//       ))}
//     </div>
//   )
// }














