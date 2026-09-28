import React, { useState } from "react";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { User } from "../types";

interface CreateMakerUserViewProps {
  onBack?: () => void;
  onUserCreated?: (user: User) => void;
}

export function CreateMakerUserView({
  onBack,
  onUserCreated
}: CreateMakerUserViewProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"Maker" | "Checker">("Maker");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdUsernameDisplay, setCreatedUsernameDisplay] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    if (!emailId.trim()) {
      newErrors.emailId = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId.trim())) {
      newErrors.emailId = "Please enter a valid email address";
    }
    if (!userName.trim()) {
      newErrors.userName = "User Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const finalUsername = userName.trim() || emailId.trim();
    setCreatedUsernameDisplay(finalUsername);

    // Create user record
    const newUser: User = {
      id: `${selectedRole === "Maker" ? "MKR" : "CHK"}${Math.floor(100000 + Math.random() * 900000)}`,
      username: finalUsername,
      role: selectedRole === "Maker" ? "Maker" : "Checker",
      status: "Active",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: emailId.trim(),
      outstandingBalance: 0,
      createDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      makerUsername: "ta_partner",
      parentUsername: "ta_partner",
      planName: `Partner ${selectedRole} Operations Plan`,
      bankAccountNumber: "91" + mobileNumber.trim(),
      bankName: "State Bank of India",
      ifscCode: "SBIN0001234",
      vpa: `${finalUsername.toLowerCase()}@ta`,
      payerAccountTypes: {
        Savings: true,
        Current: true
      }
    };

    if (onUserCreated) {
      onUserCreated(newUser);
    }

    setIsSuccessModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    // Reset form fields
    setFirstName("");
    setLastName("");
    setMobileNumber("");
    setEmailId("");
    setUserName("");
    setSelectedRole("Maker");
    setErrors({});
  };

  return (
    <div className="space-y-4 py-2 select-none">
      {/* Back Navigation Header */}
      <div>
        <button
          onClick={() => {
            if (onBack) onBack();
          }}
          className="inline-flex items-center space-x-2 text-base font-bold text-gray-900 hover:text-gray-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900 stroke-[2.5]" />
          <span>Create MD User</span>
        </button>

        {/* 3 Lime-Green Accent Dashes */}
        <div className="flex items-center space-x-1.5 mt-2">
          <div className="h-[3.5px] w-12 bg-[#C5DB29] rounded-full"></div>
          <div className="h-[3.5px] w-3.5 bg-[#C5DB29] rounded-full"></div>
          <div className="h-[3.5px] w-1.5 bg-[#C5DB29] rounded-full"></div>
        </div>

        {/* Instruction Subtext */}
        <p className="text-xs text-gray-500 font-normal mt-2">
          Please enter all the details.
        </p>
      </div>

      {/* Form Container Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200/90 rounded-md p-6 sm:p-7 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* First Name */}
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1.5">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                }}
                className={`w-full text-xs font-normal border ${
                  errors.firstName ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#447837]"
                } rounded px-3.5 py-2.5 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.firstName ? "focus:ring-red-400" : "focus:ring-[#447837]"
                }`}
              />
              {errors.firstName && (
                <span className="text-red-500 text-[11px] mt-1 block font-medium">
                  {errors.firstName}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1.5">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                }}
                className={`w-full text-xs font-normal border ${
                  errors.lastName ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#447837]"
                } rounded px-3.5 py-2.5 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.lastName ? "focus:ring-red-400" : "focus:ring-[#447837]"
                }`}
              />
              {errors.lastName && (
                <span className="text-red-500 text-[11px] mt-1 block font-medium">
                  {errors.lastName}
                </span>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1.5">
                Mobile Number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, ""));
                  if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: "" }));
                }}
                className={`w-full text-xs font-normal border ${
                  errors.mobileNumber ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#447837]"
                } rounded px-3.5 py-2.5 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.mobileNumber ? "focus:ring-red-400" : "focus:ring-[#447837]"
                }`}
              />
              {errors.mobileNumber && (
                <span className="text-red-500 text-[11px] mt-1 block font-medium">
                  {errors.mobileNumber}
                </span>
              )}
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1.5">
                Email ID<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Email ID"
                value={emailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                  if (errors.emailId) setErrors((prev) => ({ ...prev, emailId: "" }));
                }}
                className={`w-full text-xs font-normal border ${
                  errors.emailId ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#447837]"
                } rounded px-3.5 py-2.5 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.emailId ? "focus:ring-red-400" : "focus:ring-[#447837]"
                }`}
              />
              {errors.emailId && (
                <span className="text-red-500 text-[11px] mt-1 block font-medium">
                  {errors.emailId}
                </span>
              )}
            </div>

            {/* User Name */}
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1.5">
                User Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder=""
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (errors.userName) setErrors((prev) => ({ ...prev, userName: "" }));
                }}
                className={`w-full text-xs font-normal border ${
                  errors.userName ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#447837]"
                } rounded px-3.5 py-2.5 bg-white text-gray-800 focus:outline-none focus:ring-1 ${
                  errors.userName ? "focus:ring-red-400" : "focus:ring-[#447837]"
                }`}
              />
              {errors.userName && (
                <span className="text-red-500 text-[11px] mt-1 block font-medium">
                  {errors.userName}
                </span>
              )}
            </div>

            {/* Select Role ID Dropdown */}
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1.5">
                Select Role ID
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as "Maker" | "Checker")}
                  className="w-full text-xs font-normal border border-gray-300 rounded px-3.5 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837] appearance-none cursor-pointer pr-10"
                >
                  <option value="Maker">Maker</option>
                  <option value="Checker">Checker</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button (Green theme, wide centered) */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="w-80 sm:w-96 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white font-medium text-sm rounded shadow-xs transition cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Success Modal Popup (Matches image 2 exactly) */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl text-center space-y-3 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Green Circular Check Badge */}
            <div className="w-20 h-20 mx-auto rounded-full border-[3px] border-[#589748] flex items-center justify-center bg-white mb-2">
              <Check className="w-10 h-10 text-[#589748] stroke-[3]" />
            </div>

            {/* Success Heading */}
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Success
            </h3>

            {/* Body message */}
            <p className="text-xs text-gray-600 font-normal leading-relaxed">
              User created successfully with username
              <br />
              <span className="font-semibold text-gray-800 break-all">
                {createdUsernameDisplay}
              </span>
            </p>

            {/* Bottom-right Okay Button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-1.5 bg-[#589748] hover:bg-[#447837] text-white text-xs font-semibold rounded-full transition shadow-xs cursor-pointer"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
