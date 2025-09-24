"use client";
import { User2Icon, Upload, X, Camera, Edit3, Save, Clock, Scissors, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Portfolio from "@/components/barber/portfolio";
import { Suspense } from "react";
const Page = () => {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [newWorkingHour, setNewWorkingHour] = useState({ day: "", start: "", end: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    visible: false,
    type: "",
    id: null,
    name: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchBarberData();
  }, [id]);

  const fetchBarberData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/barber/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch barber data");
      }
      const data = await response.json();
      setBarber(data.barberData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('images', file);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadData = await uploadResponse.json();
      
      if (!uploadData.images || uploadData.images.length === 0) {
        throw new Error('No image data returned from server');
      }

      const newImage = uploadData.images[0];
      const oldFileId = barber?.image?.[0]?.fileId;

      if (oldFileId) {
        try {
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId: oldFileId }),
          });
        } catch (deleteError) {
          console.error('Failed to delete old image:', deleteError);
        }
      }

      const updatedBarber = {
        ...barber,
        image: [{
          fileId: newImage.fileId,
          url: newImage.url,
          thumbnailUrl: newImage.thumbnailUrl,
          alt: `Profile picture of ${barber?.username || 'barber'}`,
          uploadedAt: new Date().toISOString()
        }]
      };

      setBarber(updatedBarber);

      const saveResponse = await fetch(`/api/barber/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBarber),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save image to database');
      }

    } catch (err) {
      console.error('Upload error:', err);
      alert(`Error uploading image: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeProfileImage = async () => {
    if (!barber?.image?.[0]?.fileId) return;

    try {
      const oldFileId = barber.image[0].fileId;

      const deleteResponse = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: oldFileId }),
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete image from storage');
      }

      const updatedBarber = { ...barber, image: null };
      setBarber(updatedBarber);

      const saveResponse = await fetch(`/api/barber/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBarber),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to remove image from database");
      }

    } catch (err) {
      console.error('Remove image error:', err);
      alert("Error removing image: " + err.message);
      fetchBarberData();
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/barber/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(barber),
      });

      if (!response.ok) {
        throw new Error("Failed to update barber data");
      }

      const updatedData = await response.json();
      setBarber(updatedData.barber);
      setEditMode(false);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      alert('Please fill in both service name and price');
      return;
    }

    try {
      const response = await fetch(`/api/barber/${id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      if (!response.ok) throw new Error("Failed to add service");

      const updatedData = await response.json();
      setBarber(updatedData.barber);
      setNewService({ name: "", price: "" });
    } catch (err) {
      setError(err.message);
      alert("Error adding service: " + err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(`/api/barber/${id}/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete service");

      const updatedData = await response.json();
      setBarber(updatedData);
      setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
    } catch (err) {
      setError(err.message);
      alert("Error deleting service: " + err.message);
    }
  };

  const handleAddWorkingHour = async () => {
    if (!newWorkingHour.day || !newWorkingHour.start || !newWorkingHour.end) {
      alert('Please fill in all working hour fields');
      return;
    }

    try {
      const response = await fetch(`/api/barber/${id}/workinghours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkingHour),
      });

      if (!response.ok) throw new Error("Failed to add working hour");

      const updatedData = await response.json();
      setBarber(updatedData);
      setNewWorkingHour({ day: "", start: "", end: "" });
    } catch (err) {
      setError(err.message);
      alert("Error adding working hour: " + err.message);
    }
  };

  const handleDeleteWorkingHour = async (whId) => {
    try {
      const response = await fetch(`/api/barber/${id}/workinghours/${whId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete working hour");

      const updatedData = await response.json();
      setBarber(updatedData);
      setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
    } catch (err) {
      setError(err.message);
      alert("Error deleting working hour: " + err.message);
    }
  };

  const openDeleteConfirm = (type, id, name) => {
    setShowDeleteConfirm({ visible: true, type, id, name });
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
  };

  const confirmDelete = () => {
    if (showDeleteConfirm.type === "service") {
      handleDeleteService(showDeleteConfirm.id);
    } else if (showDeleteConfirm.type === "workingHour") {
      handleDeleteWorkingHour(showDeleteConfirm.id);
    }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorView error={error} onRetry={fetchBarberData} />;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ProfileImage 
                barber={barber} 
                editMode={editMode}
                uploading={uploading}
                uploadProgress={uploadProgress}
                onImageClick={triggerFileInput}
                onRemoveImage={removeProfileImage}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading || !editMode}
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                {barber?.username || 'Barber'} Profile
              </h1>
              <p className="text-gray-600 mt-1">Manage your barber profile and services</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 border border-gray-300 hover:border-black bg-white text-black font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === "profile" && (
            <ProfileTab barber={barber} editMode={editMode} setBarber={setBarber} />
          )}
          
          {activeTab === "services" && (
            <ServicesTab 
              barber={barber}
              newService={newService}
              setNewService={setNewService}
              onAddService={handleAddService}
              onDeleteService={openDeleteConfirm}
              editMode={editMode}
            />
          )}
          
          {activeTab === "hours" && (
            <WorkingHoursTab
              barber={barber}
              newWorkingHour={newWorkingHour}
              setNewWorkingHour={setNewWorkingHour}
              onAddWorkingHour={handleAddWorkingHour}
              onDeleteWorkingHour={openDeleteConfirm}
              editMode={editMode}
            />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteModal 
          showDeleteConfirm={showDeleteConfirm}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      </div>
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense>
        <Portfolio />
        </Suspense>
      </div>
    </div>
  );
};

// Skeleton Loading Component
const PageSkeleton = () => (
  <div className="min-h-screen bg-white py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gray-200 animate-pulse"></div>
          </div>
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex-1 py-4 px-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item}>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Component for Profile Image with Professional Styling
const ProfileImage = ({ barber, editMode, uploading, uploadProgress, onImageClick, onRemoveImage }) => (
  <div className="relative group">
    <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
      {barber?.image?.[0]?.url ? (
        <img 
          src={barber.image[0].url} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <User2Icon size={32} className="text-gray-600" />
        </div>
      )}
    </div>
    
    {uploading && (
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-xs">{uploadProgress}%</div>
        </div>
      </div>
    )}
    
    {editMode && !uploading && (
      <>
        <button
          onClick={onImageClick}
          className="absolute -bottom-2 -right-2 bg-black hover:bg-gray-800 text-white p-2 rounded-full shadow-lg transition-all duration-200 group-hover:scale-110"
        >
          <Camera size={16} />
        </button>
        
        {barber?.image?.[0]?.url && (
          <button
            onClick={onRemoveImage}
            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-all duration-200"
          >
            <X size={12} />
          </button>
        )}
      </>
    )}
  </div>
);

// Error View Component
const ErrorView = ({ error, onRetry }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="text-red-500 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-black">Error Loading Profile</h3>
        <p className="text-sm text-gray-600 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// Tab Navigation Component
const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
    <div className="flex">
      {[
        { id: "profile", label: "Profile", icon: User2Icon },
        { id: "services", label: "Services", icon: Scissors },
        { id: "hours", label: "Working Hours", icon: Clock }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 py-4 px-6 text-center font-medium text-sm transition-all duration-200 flex-1 ${
            activeTab === tab.id
              ? "border-b-2 border-black text-black bg-gray-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

// Profile Tab Component
const ProfileTab = ({ barber, editMode, setBarber }) => (
  <div>
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-black">Profile Information</h3>
      <p className="text-sm text-gray-600 mt-1">Manage your personal and business details</p>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormField
          label="Username"
          value={barber?.username || ""}
          editMode={editMode}
          onChange={(value) => setBarber({ ...barber, username: value })}
          icon={User2Icon}
        />
        
        <FormField
          label="Email Address"
          type="email"
          value={barber?.email || ""}
          editMode={editMode}
          onChange={(value) => setBarber({ ...barber, email: value })}
          icon={Mail}
        />
        
        <FormField
          label="Phone Number"
          type="tel"
          value={barber?.number || ""}
          editMode={editMode}
          onChange={(value) => setBarber({ ...barber, number: value })}
          icon={Phone}
        />
        
        <FormField
          label="Location"
          type="textarea"
          value={barber?.location || ""}
          editMode={editMode}
          onChange={(value) => setBarber({ ...barber, location: value })}
          icon={MapPin}
        />
        
        <FormField
          label="Province"
          value={barber?.province || ""}
          editMode={editMode}
          onChange={(value) => setBarber({ ...barber, province: value })}
        />
        
        <FormField
          label="City"
          value={barber?.city || ""}
          editMode={editMode}
          onChange={(value) => setBarber({ ...barber, city: value })}
        />
      </div>
    </div>
  </div>
);

// Form Field Component
const FormField = ({ label, value, editMode, onChange, type = "text", icon: Icon }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      {Icon && <Icon size={16} />}
      {label}
    </label>
    {editMode ? (
      type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
        />
      )
    ) : (
      <div className="px-3 py-2 bg-gray-50 rounded-lg min-h-[42px] border border-transparent">
        {value || <span className="text-gray-400">Not provided</span>}
      </div>
    )}
  </div>
);

// Services Tab Component
const ServicesTab = ({ barber, newService, setNewService, onAddService, onDeleteService, editMode }) => (
  <div>
    <div className="px-6 py-5 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-black">Services & Pricing</h3>
          <p className="text-sm text-gray-600 mt-1">Manage your service offerings</p>
        </div>
        {editMode && (
          <div className="flex gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Service name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
            <input
              type="number"
              placeholder="Price"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
            <button
              onClick={onAddService}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="p-6">
      {barber?.services?.length > 0 ? (
        <div className="grid gap-3">
          {barber.services.map((service) => (
            <div key={service._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-black">{service.name}</span>
                <span className="text-black font-semibold ml-2">Rs. {service.price}</span>
              </div>
              {editMode && (
                <button
                  onClick={() => onDeleteService("service", service._id, service.name)}
                  className="text-red-600 hover:text-red-700 p-2 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Scissors size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No services added yet</p>
        </div>
      )}
    </div>
  </div>
);

// Working Hours Tab Component
const WorkingHoursTab = ({ barber, newWorkingHour, setNewWorkingHour, onAddWorkingHour, onDeleteWorkingHour, editMode }) => (
  <div>
    <div className="px-6 py-5 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-black">Working Hours</h3>
          <p className="text-sm text-gray-600 mt-1">Set your availability schedule</p>
        </div>
        {editMode && (
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={newWorkingHour.day}
              onChange={(e) => setNewWorkingHour({ ...newWorkingHour, day: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="">Select day</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={newWorkingHour.start}
              onChange={(e) => setNewWorkingHour({ ...newWorkingHour, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
            <span className="self-center">-</span>
            <input
              type="time"
              value={newWorkingHour.end}
              onChange={(e) => setNewWorkingHour({ ...newWorkingHour, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
            <button
              onClick={onAddWorkingHour}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="p-6">
      {barber?.workinghours?.length > 0 ? (
        <div className="grid gap-3">
          {barber.workinghours.map((wh) => (
            <div key={wh._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Calendar size={16} className="text-gray-400" />
                <span className="font-medium text-black">{wh.day}</span>
                <span className="text-gray-600">{wh.start} - {wh.end}</span>
              </div>
              {editMode && (
                <button
                  onClick={() => onDeleteWorkingHour("workingHour", wh._id, `${wh.day} (${wh.start}-${wh.end})`)}
                  className="text-red-600 hover:text-red-700 p-2 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No working hours set yet</p>
        </div>
      )}
    </div>
  </div>
);

// Delete Confirmation Modal Component
const DeleteModal = ({ showDeleteConfirm, onClose, onConfirm }) => (
  showDeleteConfirm.visible && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in fade-in-90 zoom-in-90">
        <h3 className="text-lg font-semibold text-black mb-2">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-medium">{showDeleteConfirm.name}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
);

export default Page;

// "use client";
// import { User2Icon, Upload, X, Camera, Edit3, Save, Clock, Scissors, MapPin, Phone, Mail, Calendar } from "lucide-react";
// import { useParams } from "next/navigation";
// import React, { useState, useEffect, useRef } from "react";

// const Page = () => {
//   const { id } = useParams();
//   const [barber, setBarber] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [newService, setNewService] = useState({ name: "", price: "" });
//   const [newWorkingHour, setNewWorkingHour] = useState({ day: "", start: "", end: "" });
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState({
//     visible: false,
//     type: "",
//     id: null,
//     name: "",
//   });

//   useEffect(() => {
//     if (!id) return;
//     fetchBarberData();
//   }, [id]);

//   const fetchBarberData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/barber/${id}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch barber data");
//       }
//       const data = await response.json();
//       setBarber(data.barberData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file
//     if (!file.type.startsWith('image/')) {
//       alert('Please select a valid image file (JPEG, PNG, etc.)');
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       alert('Image size should be less than 10MB');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     try {
//       const formData = new FormData();
//       formData.append('images', file);

//       // Simulate progress (since we can't track actual upload progress with fetch)
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 200);

//       // Upload new image
//       const uploadResponse = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//         // Don't set Content-Type header - let browser set it with boundary
//       });

//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       if (!uploadResponse.ok) {
//         const errorData = await uploadResponse.json();
//         throw new Error(errorData.error || 'Upload failed');
//       }

//       const uploadData = await uploadResponse.json();
      
//       if (!uploadData.images || uploadData.images.length === 0) {
//         throw new Error('No image data returned from server');
//       }

//       const newImage = uploadData.images[0];
//       const oldFileId = barber?.image?.[0]?.fileId;

//       // Delete old image if exists
//       if (oldFileId) {
//         try {
//           await fetch('/api/upload', {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ fileId: oldFileId }),
//           });
//         } catch (deleteError) {
//           console.error('Failed to delete old image:', deleteError);
//           // Continue with update even if deletion fails
//         }
//       }

//       // Update barber data with new image
//       const updatedBarber = {
//         ...barber,
//         image: [{
//           fileId: newImage.fileId,
//           url: newImage.url,
//           thumbnailUrl: newImage.thumbnailUrl,
//           alt: `Profile picture of ${barber?.username || 'barber'}`,
//           uploadedAt: new Date().toISOString()
//         }]
//       };

//       setBarber(updatedBarber);

//       // Save to database
//       const saveResponse = await fetch(`/api/barber/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedBarber),
//       });

//       if (!saveResponse.ok) {
//         throw new Error('Failed to save image to database');
//       }

//       console.log('Profile image updated successfully');

//     } catch (err) {
//       console.error('Upload error:', err);
//       alert(`Error uploading image: ${err.message}`);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const removeProfileImage = async () => {
//     if (!barber?.image?.[0]?.fileId) return;

//     try {
//       const oldFileId = barber.image[0].fileId;

//       // Delete from ImageKit
//       const deleteResponse = await fetch('/api/upload', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ fileId: oldFileId }),
//       });

//       if (!deleteResponse.ok) {
//         throw new Error('Failed to delete image from storage');
//       }

//       // Update local state
//       const updatedBarber = { ...barber, image: null };
//       setBarber(updatedBarber);

//       // Update database
//       const saveResponse = await fetch(`/api/barber/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedBarber),
//       });

//       if (!saveResponse.ok) {
//         throw new Error("Failed to remove image from database");
//       }

//     } catch (err) {
//       console.error('Remove image error:', err);
//       alert("Error removing image: " + err.message);
//       fetchBarberData(); // Revert state on error
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch(`/api/barber/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(barber),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update barber data");
//       }

//       const updatedData = await response.json();
//       setBarber(updatedData.barber);
//       setEditMode(false);
      
//       console.log('Profile updated successfully');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleAddService = async () => {
//     if (!newService.name || !newService.price) {
//       alert('Please fill in both service name and price');
//       return;
//     }

//     try {
//       const response = await fetch(`/api/barber/${id}/services`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newService),
//       });

//       if (!response.ok) throw new Error("Failed to add service");

//       const updatedData = await response.json();
//       setBarber(updatedData.barber);
//       setNewService({ name: "", price: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error adding service: " + err.message);
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     try {
//       const response = await fetch(`/api/barber/${id}/services/${serviceId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Failed to delete service");

//       const updatedData = await response.json();
//       setBarber(updatedData);
//       setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error deleting service: " + err.message);
//     }
//   };

//   const handleAddWorkingHour = async () => {
//     if (!newWorkingHour.day || !newWorkingHour.start || !newWorkingHour.end) {
//       alert('Please fill in all working hour fields');
//       return;
//     }

//     try {
//       const response = await fetch(`/api/barber/${id}/workinghours`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newWorkingHour),
//       });

//       if (!response.ok) throw new Error("Failed to add working hour");

//       const updatedData = await response.json();
//       setBarber(updatedData);
//       setNewWorkingHour({ day: "", start: "", end: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error adding working hour: " + err.message);
//     }
//   };

//   const handleDeleteWorkingHour = async (whId) => {
//     try {
//       const response = await fetch(`/api/barber/${id}/workinghours/${whId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Failed to delete working hour");

//       const updatedData = await response.json();
//       setBarber(updatedData);
//       setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error deleting working hour: " + err.message);
//     }
//   };

//   const openDeleteConfirm = (type, id, name) => {
//     setShowDeleteConfirm({ visible: true, type, id, name });
//   };

//   const closeDeleteConfirm = () => {
//     setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
//   };

//   const confirmDelete = () => {
//     if (showDeleteConfirm.type === "service") {
//       handleDeleteService(showDeleteConfirm.id);
//     } else if (showDeleteConfirm.type === "workingHour") {
//       handleDeleteWorkingHour(showDeleteConfirm.id);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorView error={error} onRetry={fetchBarberData} />;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <ProfileImage 
//                 barber={barber} 
//                 editMode={editMode}
//                 uploading={uploading}
//                 uploadProgress={uploadProgress}
//                 onImageClick={triggerFileInput}
//                 onRemoveImage={removeProfileImage}
//               />
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="hidden"
//                 disabled={uploading || !editMode}
//               />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 {barber?.username || 'Barber'} Profile
//               </h1>
//               <p className="text-gray-600 mt-1">Manage your barber profile and services</p>
//             </div>
//           </div>
          
//           <div className="flex gap-3">
//             {editMode ? (
//               <>
//                 <button
//                   onClick={handleSave}
//                   className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
//                 >
//                   <Save size={18} />
//                   Save Changes
//                 </button>
//                 <button
//                   onClick={() => setEditMode(false)}
//                   className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => setEditMode(true)}
//                 className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-800 font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
//               >
//                 <Edit3 size={18} />
//                 Edit Profile
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {activeTab === "profile" && (
//             <ProfileTab barber={barber} editMode={editMode} setBarber={setBarber} />
//           )}
          
//           {activeTab === "services" && (
//             <ServicesTab 
//               barber={barber}
//               newService={newService}
//               setNewService={setNewService}
//               onAddService={handleAddService}
//               onDeleteService={openDeleteConfirm}
//               editMode={editMode}
//             />
//           )}
          
//           {activeTab === "hours" && (
//             <WorkingHoursTab
//               barber={barber}
//               newWorkingHour={newWorkingHour}
//               setNewWorkingHour={setNewWorkingHour}
//               onAddWorkingHour={handleAddWorkingHour}
//               onDeleteWorkingHour={openDeleteConfirm}
//               editMode={editMode}
//             />
//           )}
//         </div>

//         {/* Delete Confirmation Modal */}
//         <DeleteModal 
//           showDeleteConfirm={showDeleteConfirm}
//           onClose={closeDeleteConfirm}
//           onConfirm={confirmDelete}
//         />
//       </div>
//     </div>
//   );
// };

// // Component for Profile Image with Professional Styling
// const ProfileImage = ({ barber, editMode, uploading, uploadProgress, onImageClick, onRemoveImage }) => (
//   <div className="relative group">
//     <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
//       {barber?.image?.[0]?.url ? (
//         <img 
//           src={barber.image[0].url} 
//           alt="Profile" 
//           className="w-full h-full object-cover"
//         />
//       ) : (
//         <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//           <User2Icon size={32} className="text-blue-600" />
//         </div>
//       )}
//     </div>
    
//     {uploading && (
//       <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
//         <div className="text-white text-center">
//           <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
//           <div className="text-xs">{uploadProgress}%</div>
//         </div>
//       </div>
//     )}
    
//     {editMode && !uploading && (
//       <>
//         <button
//           onClick={onImageClick}
//           className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 group-hover:scale-110"
//         >
//           <Camera size={16} />
//         </button>
        
//         {barber?.image?.[0]?.url && (
//           <button
//             onClick={onRemoveImage}
//             className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-all duration-200"
//           >
//             <X size={12} />
//           </button>
//         )}
//       </>
//     )}
//   </div>
// );

// // Loading Spinner Component
// const LoadingSpinner = () => (
//   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//     <div className="flex flex-col items-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//       <p className="text-gray-600">Loading barber profile...</p>
//     </div>
//   </div>
// );

// // Error View Component
// const ErrorView = ({ error, onRetry }) => (
//   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//     <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
//       <div className="text-red-500 text-center">
//         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         </div>
//         <h3 className="text-lg font-semibold mb-2">Error Loading Profile</h3>
//         <p className="text-sm text-gray-600 mb-6">{error}</p>
//         <button
//           onClick={onRetry}
//           className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Tab Navigation Component
// const TabNavigation = ({ activeTab, setActiveTab }) => (
//   <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
//     <div className="flex">
//       {[
//         { id: "profile", label: "Profile", icon: User2Icon },
//         { id: "services", label: "Services", icon: Scissors },
//         { id: "hours", label: "Working Hours", icon: Clock }
//       ].map((tab) => (
//         <button
//           key={tab.id}
//           onClick={() => setActiveTab(tab.id)}
//           className={`flex items-center gap-2 py-4 px-6 text-center font-medium text-sm transition-all duration-200 flex-1 ${
//             activeTab === tab.id
//               ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
//               : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//           }`}
//         >
//           <tab.icon size={16} />
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// // Profile Tab Component
// const ProfileTab = ({ barber, editMode, setBarber }) => (
//   <div>
//     <div className="px-6 py-5 border-b border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
//       <p className="text-sm text-gray-600 mt-1">Manage your personal and business details</p>
//     </div>
    
//     <div className="p-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <FormField
//           label="Username"
//           value={barber?.username || ""}
//           editMode={editMode}
//           onChange={(value) => setBarber({ ...barber, username: value })}
//           icon={User2Icon}
//         />
        
//         <FormField
//           label="Email Address"
//           type="email"
//           value={barber?.email || ""}
//           editMode={editMode}
//           onChange={(value) => setBarber({ ...barber, email: value })}
//           icon={Mail}
//         />
        
//         <FormField
//           label="Phone Number"
//           type="tel"
//           value={barber?.number || ""}
//           editMode={editMode}
//           onChange={(value) => setBarber({ ...barber, number: value })}
//           icon={Phone}
//         />
        
//         <FormField
//           label="Location"
//           type="textarea"
//           value={barber?.location || ""}
//           editMode={editMode}
//           onChange={(value) => setBarber({ ...barber, location: value })}
//           icon={MapPin}
//         />
        
//         <FormField
//           label="Province"
//           value={barber?.province || ""}
//           editMode={editMode}
//           onChange={(value) => setBarber({ ...barber, province: value })}
//         />
        
//         <FormField
//           label="City"
//           value={barber?.city || ""}
//           editMode={editMode}
//           onChange={(value) => setBarber({ ...barber, city: value })}
//         />
//       </div>
//     </div>
//   </div>
// );

// // Form Field Component
// const FormField = ({ label, value, editMode, onChange, type = "text", icon: Icon }) => (
//   <div>
//     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//       {Icon && <Icon size={16} />}
//       {label}
//     </label>
//     {editMode ? (
//       type === "textarea" ? (
//         <textarea
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           rows={3}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//         />
//       ) : (
//         <input
//           type={type}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//         />
//       )
//     ) : (
//       <div className="px-3 py-2 bg-gray-50 rounded-lg min-h-[42px] border border-transparent">
//         {value || <span className="text-gray-400">Not provided</span>}
//       </div>
//     )}
//   </div>
// );

// // Services Tab Component
// const ServicesTab = ({ barber, newService, setNewService, onAddService, onDeleteService, editMode }) => (
//   <div>
//     <div className="px-6 py-5 border-b border-gray-200">
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">Services & Pricing</h3>
//           <p className="text-sm text-gray-600 mt-1">Manage your service offerings</p>
//         </div>
//         {editMode && (
//           <div className="flex gap-3 w-full lg:w-auto">
//             <input
//               type="text"
//               placeholder="Service name"
//               value={newService.name}
//               onChange={(e) => setNewService({ ...newService, name: e.target.value })}
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               value={newService.price}
//               onChange={(e) => setNewService({ ...newService, price: e.target.value })}
//               className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={onAddService}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>
//     </div>

//     <div className="p-6">
//       {barber?.services?.length > 0 ? (
//         <div className="grid gap-3">
//           {barber.services.map((service) => (
//             <div key={service._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div>
//                 <span className="font-medium text-gray-900">{service.name}</span>
//                 <span className="text-blue-600 font-semibold ml-2">Rs. {service.price}</span>
//               </div>
//               {editMode && (
//                 <button
//                   onClick={() => onDeleteService("service", service._id, service.name)}
//                   className="text-red-600 hover:text-red-700 p-2 transition-colors"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 text-gray-500">
//           <Scissors size={48} className="mx-auto mb-4 text-gray-300" />
//           <p>No services added yet</p>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // Working Hours Tab Component
// const WorkingHoursTab = ({ barber, newWorkingHour, setNewWorkingHour, onAddWorkingHour, onDeleteWorkingHour, editMode }) => (
//   <div>
//     <div className="px-6 py-5 border-b border-gray-200">
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
//           <p className="text-sm text-gray-600 mt-1">Set your availability schedule</p>
//         </div>
//         {editMode && (
//           <div className="flex gap-3 w-full lg:w-auto">
//             <select
//               value={newWorkingHour.day}
//               onChange={(e) => setNewWorkingHour({ ...newWorkingHour, day: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select day</option>
//               {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
//                 <option key={day} value={day}>{day}</option>
//               ))}
//             </select>
//             <input
//               type="time"
//               value={newWorkingHour.start}
//               onChange={(e) => setNewWorkingHour({ ...newWorkingHour, start: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="self-center">-</span>
//             <input
//               type="time"
//               value={newWorkingHour.end}
//               onChange={(e) => setNewWorkingHour({ ...newWorkingHour, end: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={onAddWorkingHour}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>
//     </div>

//     <div className="p-6">
//       {barber?.workinghours?.length > 0 ? (
//         <div className="grid gap-3">
//           {barber.workinghours.map((wh) => (
//             <div key={wh._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-4">
//                 <Calendar size={16} className="text-gray-400" />
//                 <span className="font-medium text-gray-900">{wh.day}</span>
//                 <span className="text-gray-600">{wh.start} - {wh.end}</span>
//               </div>
//               {editMode && (
//                 <button
//                   onClick={() => onDeleteWorkingHour("workingHour", wh._id, `${wh.day} (${wh.start}-${wh.end})`)}
//                   className="text-red-600 hover:text-red-700 p-2 transition-colors"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 text-gray-500">
//           <Clock size={48} className="mx-auto mb-4 text-gray-300" />
//           <p>No working hours set yet</p>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // Delete Confirmation Modal Component
// const DeleteModal = ({ showDeleteConfirm, onClose, onConfirm }) => (
//   showDeleteConfirm.visible && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in fade-in-90 zoom-in-90">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
//         <p className="text-gray-600 mb-6">
//           Are you sure you want to delete <span className="font-medium">{showDeleteConfirm.name}</span>? 
//           This action cannot be undone.
//         </p>
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// );

// export default Page;








// "use client";
// import { User2Icon } from "lucide-react";
// import { useParams } from "next/navigation";
// import React, { useState, useEffect } from "react";

// const Page = () => {
//   const { id } = useParams();
//   const [barber, setBarber] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [newService, setNewService] = useState({ name: "", price: "" });
//   const [newWorkingHour, setNewWorkingHour] = useState({
//     day: "",
//     start: "",
//     end: "",
//   });
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState({
//     visible: false,
//     type: "",
//     id: null,
//     name: "",
//   });

//   useEffect(() => {
//     if (!id) return;
//     fetchBarberData();
//   }, [id]);

//   const fetchBarberData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/barber/${id}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch barber data");
//       }
//       const data = await response.json();
//       console.log(data)
//       setBarber(data.barberData);
//       console.log(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch(`/api/barber/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(barber),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update barber data");
//       }

//       const updatedData = await response.json();
//       setBarber(updatedData.barber);
//       setEditMode(false);
//       // Show success notification
//     } catch (err) {
//       setError(err.message);
//       // Show error notification
//     }
//   };

//   const handleAddService = async () => {
//     if (!newService.name || !newService.price) {
//       // Show validation error
//       return;
//     }

//     try {
//       const response = await fetch(`/api/barber/${id}/services`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newService),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add service");
//       }

//       const updatedData = await response.json();
//       setBarber(updatedData.barber);
//       setNewService({ name: "", price: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error adding service: " + err.message);
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     try {
//       const response = await fetch(`/api/barber/${id}/services/${serviceId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete service");
//       }

//       const updatedData = await response.json();
//       setBarber(updatedData);
//       setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error deleting service: " + err.message);
//     }
//   };

//   const handleAddWorkingHour = async () => {
//     if (!newWorkingHour.day || !newWorkingHour.start || !newWorkingHour.end) {
//       // Show validation error
//       return;
//     }

//     try {
//       const response = await fetch(`/api/barber/${id}/workinghours`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newWorkingHour),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add working hour");
//       }

//       const updatedData = await response.json();
//       setBarber(updatedData);
//       setNewWorkingHour({ day: "", start: "", end: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error adding working hour: " + err.message);
//     }
//   };

//   const handleDeleteWorkingHour = async (whId) => {
//     try {
//       const response = await fetch(`/api/barber/${id}/workinghours/${whId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete working hour");
//       }

//       const updatedData = await response.json();
//       setBarber(updatedData);
//       setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
//     } catch (err) {
//       setError(err.message);
//       alert("Error deleting working hour: " + err.message);
//     }
//   };

//   const openDeleteConfirm = (type, id, name) => {
//     setShowDeleteConfirm({ visible: true, type, id, name });
//   };

//   const closeDeleteConfirm = () => {
//     setShowDeleteConfirm({ visible: false, type: "", id: null, name: "" });
//   };

//   const confirmDelete = () => {
//     if (showDeleteConfirm.type === "service") {
//       handleDeleteService(showDeleteConfirm.id);
//     } else if (showDeleteConfirm.type === "workingHour") {
//       handleDeleteWorkingHour(showDeleteConfirm.id);
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <p className="text-gray-600">Loading barber profile...</p>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
//           <div className="text-red-500 text-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-12 w-12 mx-auto mb-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
//             <p className="text-sm">{error}</p>
//             <button
//               onClick={fetchBarberData}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-white py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header with actions */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             {barber?.username} Profile
//           </h1>
//           <div className="flex flex-wrap gap-2">
//             {editMode ? (
//               <>
//                 <button
//                   onClick={handleSave}
//                   className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
//                 >
//                   Save Changes
//                 </button>
//                 <button
//                   onClick={() => setEditMode(false)}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => setEditMode(true)}
//                 className="border border-black  cursor-pointer hover:scale-105 text-black font-medium py-2 px-4 rounded-md transition-colors"
//               >
//                 Edit Profile
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="bg-white shadow rounded-lg mb-8 overflow-x-auto">
//           <div className="border-b border-gray-200">
//             <nav className="flex min-w-max">
//               <button
//                 onClick={() => setActiveTab("profile")}
//                 className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
//                   activeTab === "profile"
//                     ? "border-b-2 border-black text-black"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Profile Information
//               </button>
//               <button
//                 onClick={() => setActiveTab("services")}
//                 className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
//                   activeTab === "services"
//                     ? "border-b-2 border-black text-black"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Services
//               </button>
//               <button
//                 onClick={() => setActiveTab("hours")}
//                 className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
//                   activeTab === "hours"
//                     ? "border-b-2 border-black text-black"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Working Hours
//               </button>
//             </nav>
//           </div>
//         </div>






//         {/* Profile Tab */}
//         {activeTab === "profile" && (
//           <div className="bg-white shadow overflow-hidden rounded-lg">
//             <div className=" flex justify-between items-center">
//             <div className="px-4 py-5 sm:px-6">

//               <h3 className=" text-lg leading-6 font-medium text-gray-900">
//                 Profile Information
//               </h3>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 Personal details and contact information.
//               </p>
//             </div>
//             <div className="flex items-center justify-center h-full mr-3">
//               {barber.image ? <div className="">
//                         <img src={barber.image[0].url} alt="profile picture" />
//               </div>:<div>
//                 <div className="w-14 h-14 rounded-full  bg-blue-100 text-blue-600 flex items-center justify-center">
//                   <User2Icon size={24} />
//                   </div>
//                 </div>}
//             </div>
//             </div>
//             <div className="border-t border-gray-200">
//               <dl>
//                 <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Username
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={barber.username || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, username: e.target.value })
//                         }
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : typeof barber.username === "string" &&
//                       barber.username.trim() !== "" ? (
//                       barber.username
//                     ) : barber ? (
//                       "Not provided"
//                     ) : (
//                       ""
//                     )}
//                   </dd>
//                 </div>
//                 <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Email address
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <input
//                         type="email"
//                         value={barber.email || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, email: e.target.value })
//                         }
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : typeof barber.email === "string" &&
//                       barber.email.trim() !== "" ? (
//                       barber.email
//                     ) : barber ? (
//                       "Not provided"
//                     ) : (
//                       ""
//                     )}
//                   </dd>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Phone number
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <input
//                         type="tel"
//                         value={barber.number || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, number: e.target.value })
//                         }
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : typeof barber.number === "string" &&
//                       barber.number.trim() !== "" ? (
//                       barber.number
//                     ) : barber ? (
//                       "Not provided"
//                     ) : (
//                       ""
//                     )}
//                   </dd>
//                 </div>
//                 <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Location
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <textarea
//                         value={barber.location || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, location: e.target.value })
//                         }
//                         rows="3"
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : typeof barber.location === "string" &&
//                       barber.location.trim() !== "" ? (
//                       barber.location
//                     ) : barber ? (
//                       "Not provided"
//                     ) : (
//                       ""
//                     )}
//                   </dd>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Password
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <input
//                         type="password"
//                         value={barber.password || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, password: e.target.value })
//                         }
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : typeof barber.password === "string" &&
//                       barber.password.trim() !== "" ? (
//                       barber.password
//                     ) : barber ? (
//                       "Not provided"
//                     ) : (
//                       ""
//                     )}
//                   </dd>
//                 </div>
//                 <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     province
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <textarea
//                         value={barber.province || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, province: e.target.value })
//                         }
//                         rows="3"
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : typeof barber.province === "string" &&
//                       barber.province.trim() !== "" ? (
//                       barber.province
//                     ) : barber ? (
//                       "Not provided"
//                     ) : (
//                       ""
//                     )}
//                   </dd>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">city</dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <textarea
//                         value={barber.city || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, city: e.target.value })
//                         }
//                         rows="3"
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : typeof barber.city === "string" &&
//                       barber.city.trim() !== "" ? (
//                       barber.city
//                     ) : barber ? (
//                       "Not provided"
//                     ) : (
//                       ""
//                     )}
//                   </dd>
//                 </div>
//                 <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Followers
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <textarea
//                         value={barber.followers || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, followers: e.target.value })
//                         }
//                         rows="3"
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : barber?.followers ? (
//                       Number(barber.followers)
//                     ) : (
//                       "Not provided"
//                     )}
//                   </dd>
//                 </div>

//                 <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Following
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {editMode ? (
//                       <textarea
//                         value={barber.following || ""}
//                         onChange={(e) =>
//                           setBarber({ ...barber, following: e.target.value })
//                         }
//                         rows="3"
//                         className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                       />
//                     ) : barber?.following ? (
//                       Number(barber.following)
//                     ) : (
//                       "Not provided"
//                     )}
//                   </dd>
//                 </div>
//               </dl>
//             </div>
//           </div>
//         )}











//         {/* Services Tab */}
//         {activeTab === "services" && (
//           <div className="bg-white shadow overflow-hidden rounded-lg">
//             <div className="px-4 py-5 sm:px-6">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                   <h3 className="text-lg leading-6 font-medium text-gray-900">
//                     Services
//                   </h3>
//                   <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                     Manage your service offerings and prices.
//                   </p>
//                 </div>
//                 <div className="w-full md:max-w-md flex flex-col sm:flex-row gap-2">
//                   <div className="flex-1">
//                     <input
//                       type="text"
//                       placeholder="Service name"
//                       value={newService.name}
//                       onChange={(e) =>
//                         setNewService({ ...newService, name: e.target.value })
//                       }
//                       className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md p-2 border"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <input
//                       type="number"
//                       placeholder="Price"
//                       value={newService.price}
//                       onChange={(e) =>
//                         setNewService({ ...newService, price: e.target.value })
//                       }
//                       className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md p-2 border"
//                     />
//                   </div>
//                   <button
//                     onClick={handleAddService}
//                     className="border border-black text-black  font-medium py-2 px-4 rounded-md text-sm transition-colors whitespace-nowrap"
//                   >
//                     Add Service
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-gray-200">
//               {barber.services && barber.services.length > 0 ? (
//                 <ul className="divide-y divide-gray-200">
//                   {barber.services.map((service) => (
//                     <li key={service._id} className="px-4 py-4 sm:px-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex flex-col">
//                           <p className="text-sm font-medium text-black truncate">
//                             {service.name}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             Rs. {service.price}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() =>
//                             openDeleteConfirm(
//                               "service",
//                               service._id,
//                               service.name
//                             )
//                           }
//                           className="ml-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div className="px-4 py-12 text-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-12 w-12 mx-auto text-gray-400 mb-3"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                   <p className="text-gray-500">No services added yet.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Working Hours Tab */}
//         {activeTab === "hours" && (
//           <div className="bg-white shadow overflow-hidden rounded-lg">
//             <div className="px-4 py-5 sm:px-6">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                   <h3 className="text-lg leading-6 font-medium text-gray-900">
//                     Working Hours
//                   </h3>
//                   <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                     Manage your availability.
//                   </p>
//                 </div>
//                 <div className="w-full md:max-w-xl flex flex-col sm:flex-row gap-2">
//                   <select
//                     value={newWorkingHour.day}
//                     onChange={(e) =>
//                       setNewWorkingHour({
//                         ...newWorkingHour,
//                         day: e.target.value,
//                       })
//                     }
//                     className="shadow-sm focus:ring-black focus:border-black block w-full text-sm border-gray-300 rounded-md p-2 border"
//                   >
//                     <option value="">Select day</option>
//                     <option value="Monday">Monday</option>
//                     <option value="Tuesday">Tuesday</option>
//                     <option value="Wednesday">Wednesday</option>
//                     <option value="Thursday">Thursday</option>
//                     <option value="Friday">Friday</option>
//                     <option value="Saturday">Saturday</option>
//                     <option value="Sunday">Sunday</option>
//                   </select>
//                   <div className="flex gap-2">
//                     <input
//                       type="time"
//                       value={newWorkingHour.start}
//                       onChange={(e) =>
//                         setNewWorkingHour({
//                           ...newWorkingHour,
//                           start: e.target.value,
//                         })
//                       }
//                       className="shadow-sm  block w-full text-sm border-gray-300 rounded-md p-2 border"
//                     />
//                     <span className="self-center">-</span>
//                     <input
//                       type="time"
//                       value={newWorkingHour.end}
//                       onChange={(e) =>
//                         setNewWorkingHour({
//                           ...newWorkingHour,
//                           end: e.target.value,
//                         })
//                       }
//                       className="shadow-sm  block w-full text-sm border-gray-300 rounded-md p-2 border"
//                     />
//                   </div>
//                   <button
//                     onClick={handleAddWorkingHour}
//                     className="border border-black  hover:bg-black/5 text-black font-medium py-2 px-4 rounded-md text-sm transition-colors whitespace-nowrap"
//                   >
//                     Add Hours
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-gray-200">
//               {barber.workinghours && barber.workinghours.length > 0 ? (
//                 <ul className="divide-y divide-gray-200">
//                   {barber.workinghours.map((wh) => (
//                     <li key={wh._id} className="px-4 py-4 sm:px-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex flex-col">
//                           <p className="text-sm font-medium text-black truncate">
//                             {wh.day}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {wh.start} - {wh.end}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() =>
//                             openDeleteConfirm(
//                               "workingHour",
//                               wh._id,
//                               `${wh.day} (${wh.start}-${wh.end})`
//                             )
//                           }
//                           className="ml-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div className="px-4 py-12 text-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-12 w-12 mx-auto text-gray-400 mb-3"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   <p className="text-gray-500">No working hours added yet.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showDeleteConfirm.visible && (
//           <div
//             onClick={closeDeleteConfirm}
//             className="fixed inset-0 bg-black/50  bg-opacity-50 flex items-center justify-center p-4 z-50"
//           >
//             <div className="bg-white rounded-lg max-w-md w-full p-6 z-[100]">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Confirm Deletion
//               </h3>
//               <p className="text-gray-500 mb-6">
//                 Are you sure you want to delete {showDeleteConfirm.name}? This
//                 action cannot be undone.
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={closeDeleteConfirm}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Page;
