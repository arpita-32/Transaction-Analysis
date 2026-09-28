import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Edit2,
  X,
  CheckCircle2
} from "lucide-react";

interface MyProfileViewProps {
  currentRole: string;
  onChangePasswordClick: () => void;
  onBack?: () => void;
}

export function MyProfileView({
  currentRole,
  onChangePasswordClick,
  onBack
}: MyProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ""
  });

  // Profile details initialized to Screenshot 2026-07-17 154801.png
  // If current role is Merchant, user can view both or customized
  const isMerchant = currentRole === "Merchant";

  const [profileDetails, setProfileDetails] = useState({
    username: isMerchant ? "tamerchant" : "taadmin",
    accountType: isMerchant ? "Merchant" : currentRole === "Partner" ? "Partner" : "Admin",
    name: isMerchant ? "Shakti Kumar" : "Dibendu Saha",
    email: isMerchant ? "shakti.kumar@quickretail.in" : "sangram.nayak@iserveu.co.in",
    phoneNumber: isMerchant ? "9834567890" : "9348200271"
  });

  const [editFormData, setEditFormData] = useState({ ...profileDetails });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileDetails({ ...editFormData });
    setIsEditing(false);
    setToast({ show: true, message: "Profile updated successfully!" });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-left font-sans">
      {/* ========================================================================= */}
      {/* 1. BREADCRUMBS & TOP HEADER                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium mb-1">
            <span className="hover:text-gray-800 transition cursor-pointer">Home</span>
            <span className="text-gray-400">/</span>
            <span className="hover:text-gray-800 transition cursor-pointer">User Management</span>
            <span className="text-gray-400">/</span>
            <span className="text-[#1E293B] font-semibold">My Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">
            User Profile
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onChangePasswordClick}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-[#447837]" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PROFILE CARD (Exact Parity with Screenshot 2026-07-17 154801.png)       */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-center"
      >
        <div className="w-full max-w-[580px] bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative">
          {/* Header: Avatar, Name and Role */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              {/* Circular Illustrated Avatar with Turban/Cap (Screenshot 2026-07-17) */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 shadow-xs bg-[#FAF5EE] flex items-center justify-center shrink-0">
                  <img
                    src="/profile_avatar.png"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image not ready
                      const target = e.currentTarget;
                      target.style.display = "none";
                      if (target.parentElement) {
                        target.parentElement.innerHTML = `<span class="text-3xl select-none">👳‍♂️</span>`;
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col text-left">
                <h2 className="text-xl font-bold text-[#111827] tracking-tight leading-snug">
                  {profileDetails.name}
                </h2>
                <span className="text-sm font-normal text-[#6B7280]">
                  {profileDetails.accountType}
                </span>
              </div>
            </div>

            {/* Edit button */}
            <button
              type="button"
              onClick={() => {
                setEditFormData({ ...profileDetails });
                setIsEditing(true);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#447837]" />
              <span>Edit</span>
            </button>
          </div>

          {/* 5 Clean Horizontal Key-Value Rows (Screenshot 2026-07-17 154801.png) */}
          <div className="divide-y divide-gray-100 text-sm">
            {/* Row 1: Username */}
            <div className="flex items-center justify-between py-4">
              <span className="text-[#6B7280] font-normal text-sm">
                Username
              </span>
              <span className="text-[#111827] font-semibold text-sm font-mono">
                {profileDetails.username}
              </span>
            </div>

            {/* Row 2: Account Type */}
            <div className="flex items-center justify-between py-4">
              <span className="text-[#6B7280] font-normal text-sm">
                Account Type
              </span>
              <span className="text-[#111827] font-semibold text-sm">
                {profileDetails.accountType}
              </span>
            </div>

            {/* Row 3: Name */}
            <div className="flex items-center justify-between py-4">
              <span className="text-[#6B7280] font-normal text-sm">
                Name
              </span>
              <span className="text-[#111827] font-semibold text-sm">
                {profileDetails.name}
              </span>
            </div>

            {/* Row 4: Email */}
            <div className="flex items-center justify-between py-4">
              <span className="text-[#6B7280] font-normal text-sm">
                Email
              </span>
              <span className="text-[#111827] font-semibold text-sm truncate max-w-[260px] text-right font-mono">
                {profileDetails.email}
              </span>
            </div>

            {/* Row 5: Phone Number */}
            <div className="flex items-center justify-between py-4">
              <span className="text-[#6B7280] font-normal text-sm">
                Phone Number
              </span>
              <span className="text-[#111827] font-semibold text-sm font-mono">
                {profileDetails.phoneNumber}
              </span>
            </div>
          </div>

          {/* Quick Demo Switcher if user wants to toggle between Dibendu Saha (Admin) and Merchant */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Status: <strong className="text-emerald-600 font-semibold">Active</strong></span>
            <button
              type="button"
              onClick={() => {
                if (profileDetails.name === "Dibendu Saha") {
                  setProfileDetails({
                    username: "tamerchant",
                    accountType: "Merchant",
                    name: "Shakti Kumar",
                    email: "shakti.kumar@quickretail.in",
                    phoneNumber: "9834567890"
                  });
                } else {
                  setProfileDetails({
                    username: "taadmin",
                    accountType: "Admin",
                    name: "Dibendu Saha",
                    email: "sangram.nayak@iserveu.co.in",
                    phoneNumber: "9348200271"
                  });
                }
              }}
              className="text-[#447837] hover:underline font-semibold cursor-pointer"
            >
              Toggle Demo Profile ({profileDetails.name === "Dibendu Saha" ? "Shakti Kumar" : "Dibendu Saha"})
            </button>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. EDIT PROFILE MODAL                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-gray-900 text-base">Edit User Profile</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, username: e.target.value })
                    }
                    className="w-full text-xs font-mono font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Account Type
                  </label>
                  <input
                    type="text"
                    value={editFormData.accountType}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, accountType: e.target.value })
                    }
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    className="w-full text-xs font-mono font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.phoneNumber}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phoneNumber: e.target.value })
                    }
                    className="w-full text-xs font-mono font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#447837] hover:bg-[#36612B] text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
