import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff, ShieldCheck, CheckCircle2, Lock, Smartphone } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  // 6 digit box state
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(30);

  useEffect(() => {
    setOtpInput(otpDigits.join(""));
  }, [otpDigits]);

  useEffect(() => {
    if (isOtpStep) {
      setOtpDigits(["", "", "", "", "", ""]);
      setTimerSeconds(30);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 120);
    }
  }, [isOtpStep]);

  useEffect(() => {
    let interval: any = null;
    if (isOtpStep && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, timerSeconds]);

  const handleDigitChange = (index: number, val: string) => {
    const digitsOnly = val.replace(/\D/g, "");
    if (!digitsOnly) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      if (otpError) setOtpError("");
      return;
    }
    const lastChar = digitsOnly.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = lastChar;
    setOtpDigits(newDigits);
    if (otpError) setOtpError("");

    if (index < 5 && lastChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    // Generate a 6-digit random OTP
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generated);
    setIsOtpStep(true);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpInput("");
    setOtpError("");
    console.log("Change Password OTP code:", generated);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpInput.trim();
    if (entered.length === 6 && /^\d+$/.test(entered)) {
      onSuccess("Password changed successfully!");
      // Reset state
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsOtpStep(false);
      onClose();
    } else {
      setOtpError("Please enter a 6-digit numeric OTP code.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 font-sans">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight flex items-center">
              <Lock className="w-5 h-5 mr-2 text-[#447837]" />
              Change Password
            </h3>
            <button
              onClick={onClose}
              className="text-white bg-[#447837] hover:bg-[#36602A] p-1.5 rounded-full shadow-xs transition duration-150 flex items-center justify-center cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          {!isOtpStep ? (
            <form onSubmit={handleSendOtp} className="p-6 space-y-4 text-left">
              {/* Old Password */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enter Old Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter Old Password"
                    className="w-full text-xs border border-gray-300 rounded px-3 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enter New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    className="w-full text-xs border border-gray-300 rounded px-3 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full text-xs border border-gray-300 rounded px-3 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6B8FF7] hover:bg-[#5A7EE6] text-white rounded-md text-xs font-bold transition duration-150 shadow-sm"
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-md text-xs font-bold transition duration-150 shadow-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </form>
          ) : (
            /* OTP Verification Step matching 6-box design */
            <form onSubmit={handleVerifyOtp} className="p-6 space-y-4 text-left">
              <div className="flex items-center space-x-2 text-left mb-1">
                <Smartphone className="w-5 h-5 text-gray-700 shrink-0" />
                <h3 className="text-base font-bold text-gray-900 font-sans">
                  OTP Verification
                </h3>
              </div>
              <p className="text-xs text-gray-500 text-left mb-3 leading-relaxed">
                Please enter the verification code we have sent you.
              </p>

              {/* 6 Square Input Boxes */}
              <div className="flex items-center justify-between gap-1.5 my-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:bg-white focus:border-[#D05B27] focus:ring-2 focus:ring-[#D05B27]/20 focus:outline-none transition shadow-2xs font-mono"
                  />
                ))}
              </div>

              {otpError && (
                <div className="text-xs text-red-600 font-bold bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                  {otpError}
                </div>
              )}

              {/* Resend timer */}
              <div className="text-center text-xs text-gray-500 font-medium py-1">
                {timerSeconds > 0 ? (
                  <span>
                    Resend OTP in <strong className="text-gray-800 font-bold">{timerSeconds} seconds.</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const generated = Math.floor(100000 + Math.random() * 900000).toString();
                      setOtpCode(generated);
                      setOtpDigits(["", "", "", "", "", ""]);
                      setOtpInput("");
                      setOtpError("");
                      setTimerSeconds(30);
                    }}
                    className="text-[#D05B27] hover:underline font-bold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-between space-x-3 pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpStep(false);
                    setOtpInput("");
                    setOtpError("");
                  }}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
