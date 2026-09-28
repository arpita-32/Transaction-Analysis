import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, PAYER_ACCOUNT_TYPES, getDefaultPayerAccountTypes, PayerAccountTypeConfig } from "../types";
import {
  User as UserIcon,
  Briefcase,
  Building2,
  Settings,
  Landmark,
  AtSign,
  FileText,
  List,
  Printer,
  ToggleLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Check,
  Smartphone,
  Lock,
  Globe,
  Plus,
  Trash2,
  Info
} from "lucide-react";

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
  currentRole?: string;
  allUsers?: User[];
}

type TabType =
  | "UserProfile"
  | "BusinessType"
  | "BusinessInfo"
  | "PersonalInfo"
  | "SettlementAccount"
  | "CallBackUrl"
  | "IPs"
  | "ManageVPA"
  | "KYCDocuments"
  | "PlanDetails"
  | "Agreement"
  | "Features"
  | "AccountStatus";

export const BUSINESS_TYPE_OPTIONS = [
  "SOLE PROPRIETORSHIP",
  "PARTNERSHIP FIRM",
  "LIMITED LIABILITY PARTNERSHIP (LLP)",
  "HINDU UNDIVIDED FAMILY",
  "TRUST",
  "SOCIETY",
  "ASSOCIATION OF PERSONS (AOP) / BODY OF INDIVIDUALS (BOI)",
  "PRIVATE LIMITED",
  "PUBLIC LIMITED"
] as const;

export function normalizeBusinessType(type?: string): string {
  if (!type) return "SOLE PROPRIETORSHIP";
  const clean = type.trim().toUpperCase();
  if (clean.includes("PROPRIET")) return "SOLE PROPRIETORSHIP";
  if (clean.includes("LLP") || clean.includes("LIMITED LIABILITY PARTNERSHIP")) return "LIMITED LIABILITY PARTNERSHIP (LLP)";
  if (clean.includes("PARTNER")) return "PARTNERSHIP FIRM";
  if (clean.includes("HUF") || clean.includes("HINDU")) return "HINDU UNDIVIDED FAMILY";
  if (clean.includes("TRUST")) return "TRUST";
  if (clean.includes("SOCIETY") || clean.includes("SOCIETIES")) return "SOCIETY";
  if (clean.includes("AOP") || clean.includes("BOI") || clean.includes("ASSOCIATION OF PERSONS") || clean.includes("BODY OF INDIVIDUALS")) {
    return "ASSOCIATION OF PERSONS (AOP) / BODY OF INDIVIDUALS (BOI)";
  }
  if (clean.includes("PUBLIC")) return "PUBLIC LIMITED";
  if (clean.includes("PRIVATE") || clean.includes("PVT")) return "PRIVATE LIMITED";

  const matched = BUSINESS_TYPE_OPTIONS.find((opt) => opt.toUpperCase() === clean);
  if (matched) return matched;

  return "SOLE PROPRIETORSHIP";
}

export function ProfileView({ user, onUpdateUser, onBack, currentRole = "Admin Maker", allUsers = [] }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("UserProfile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(() => ({
    ...user,
    businessType: normalizeBusinessType(user.businessType)
  }));
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const isPartnerOrAggregator =
    user.role?.toUpperCase().startsWith("PARTNER") ||
    user.role?.toUpperCase().startsWith("AGGREGATOR") ||
    user.role?.toUpperCase() === "PAYMENT AGGREGATOR/PARTNER";

  const isAggregator =
    user.role?.toUpperCase() === "AGGREGATOR" ||
    user.role?.toLowerCase().includes("aggregator");

  // Local state for payer account types
  const [localPayerAccountTypes, setLocalPayerAccountTypes] = useState<{ [key: string]: boolean }>(() => {
    return {
      ...getDefaultPayerAccountTypes(user.role),
      ...(user.payerAccountTypes || {})
    };
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    typeLabel: string;
    targetState: boolean;
    code: string;
    backendValue: string;
  }>({
    open: false,
    typeLabel: "",
    targetState: false,
    code: "",
    backendValue: ""
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Sync user state changes
  useEffect(() => {
    setEditedUser({
      ...user,
      businessType: normalizeBusinessType(user.businessType)
    });
    setIsActive(user.status === "Active" || user.status === "Approved by Bank Checker");
    
    const userFeats = { ...(user.features || {}) };
    delete userFeats["UPI API"];
    delete userFeats["UPI SDK"];
    delete userFeats["ONLINE UPI CASHPOINT"];
    delete userFeats["UPI REFUND"];

    setLocalFeatures({
      "ONLINE UPI INTENT": user.features?.["ONLINE UPI INTENT"] ?? true,
      "ONLINE QR COLLECT": user.features?.["ONLINE QR COLLECT"] ?? true,
      "OFFLINE STATIC QR": user.features?.["OFFLINE STATIC QR"] ?? false,
      "UPI CASHPOINT": user.features?.["UPI CASHPOINT"] ?? false,
      "UPI MANDATE": user.features?.["UPI MANDATE"] ?? false,
      "SMART UPI REFUND": user.features?.["SMART UPI REFUND"] ?? false,
      "STANDARD UPI REFUND": user.features?.["STANDARD UPI REFUND"] ?? true,
      "INSTANT UPI REFUND": user.features?.["INSTANT UPI REFUND"] ?? false,
      ...userFeats
    });
    setLocalPayerAccountTypes({
      ...getDefaultPayerAccountTypes(user.role),
      ...(user.payerAccountTypes || {})
    });
  }, [user]);

  // Parent partner lookup for Merchant & Agent profiles
  const parentPartner = !isPartnerOrAggregator
    ? allUsers?.find(
        (u) =>
          (u.username.toLowerCase() === (user.parentUsername || "").toLowerCase() ||
           u.username.toLowerCase() === (user.makerUsername || "").toLowerCase()) &&
          (u.role.toUpperCase().includes("PARTNER") || u.role.toUpperCase().includes("AGGREGATOR"))
      ) || allUsers?.find((u) => u.role.toUpperCase().includes("PARTNER") || u.role.toUpperCase().includes("AGGREGATOR"))
    : null;

  const parentPayerTypes = parentPartner
    ? { ...getDefaultPayerAccountTypes(parentPartner.role), ...(parentPartner.payerAccountTypes || {}) }
    : null;

  // Admin, Admin Maker, Admin Checker, Aggregator, and Bank User have edit access.
  // Internal risk user, Bank risk user, and Financial user have only view access.
  const hasEditAccess =
    currentRole === "Admin" ||
    currentRole === "Admin Maker" ||
    currentRole === "Admin Checker" ||
    currentRole === "Partner" ||
    currentRole === "Aggregator" ||
    currentRole === "Bank User" ||
    currentRole.toLowerCase() === "admin" ||
    currentRole.toLowerCase() === "admin maker" ||
    currentRole.toLowerCase() === "admin checker" ||
    currentRole.toLowerCase() === "partner" ||
    currentRole.toLowerCase() === "aggregator" ||
    currentRole.toLowerCase() === "bank user";

  const handlePayerAccountTypeToggleClick = (typeConfig: PayerAccountTypeConfig) => {
    if (!hasEditAccess) {
      setToast({
        show: true,
        message: "You do not have permission to edit features for this user."
      });
      return;
    }

    // Check if locked due to partner entitlement
    if (!isPartnerOrAggregator && parentPayerTypes) {
      const isParentEnabled = parentPayerTypes[typeConfig.label] ?? true;
      if (!isParentEnabled) {
        setToast({
          show: true,
          message: `${typeConfig.label} must first be enabled at the Partner/Aggregator level before it can be enabled for this Merchant/Agent.`
        });
        return;
      }
    }

    const currentVal = localPayerAccountTypes[typeConfig.label] ?? (
      isPartnerOrAggregator ? true : (typeConfig.label === "Savings" || typeConfig.label === "Current")
    );
    const targetVal = !currentVal;

    setConfirmModal({
      open: true,
      typeLabel: typeConfig.label,
      targetState: targetVal,
      code: typeConfig.code,
      backendValue: typeConfig.value
    });
  };

  const handleConfirmPayerAccountTypeUpdate = () => {
    const { typeLabel, targetState } = confirmModal;
    const updatedTypes = {
      ...localPayerAccountTypes,
      [typeLabel]: targetState
    };

    setLocalPayerAccountTypes(updatedTypes);
    setConfirmModal({ ...confirmModal, open: false });

    const updatedUser = {
      ...user,
      payerAccountTypes: updatedTypes
    };

    setEditedUser(updatedUser);
    onUpdateUser(updatedUser);

    setToast({
      show: true,
      message: `Payer Account Type '${typeLabel}' ${targetState ? "activated" : "deactivated"} successfully.`
    });
  };

  // Local state for toggles to ensure live interactivity!
  const [localFeatures, setLocalFeatures] = useState<{ [key: string]: boolean }>(() => {
    const userFeats = { ...(user.features || {}) };
    delete userFeats["UPI API"];
    delete userFeats["UPI SDK"];
    delete userFeats["ONLINE UPI CASHPOINT"];
    delete userFeats["UPI REFUND"];

    return {
      "ONLINE UPI INTENT": user.features?.["ONLINE UPI INTENT"] ?? true,
      "ONLINE QR COLLECT": user.features?.["ONLINE QR COLLECT"] ?? true,
      "OFFLINE STATIC QR": user.features?.["OFFLINE STATIC QR"] ?? false,
      "UPI CASHPOINT": user.features?.["UPI CASHPOINT"] ?? false,
      "UPI MANDATE": user.features?.["UPI MANDATE"] ?? false,
      "SMART UPI REFUND": user.features?.["SMART UPI REFUND"] ?? false,
      "STANDARD UPI REFUND": user.features?.["STANDARD UPI REFUND"] ?? true,
      "INSTANT UPI REFUND": user.features?.["INSTANT UPI REFUND"] ?? false,
      ...userFeats
    };
  });

  const [isActive, setIsActive] = useState(user.status === "Active" || user.status === "Approved by Bank Checker");

  const loggedInUserEmail = "smruti.nanda@iserveu.co.in";

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [pendingSaveAction, setPendingSaveAction] = useState<"edit" | "status" | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<boolean | null>(null);

  // 6-digit individual box state & timer
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(30);

  // Sync otpInput when otpDigits change
  useEffect(() => {
    setOtpInput(otpDigits.join(""));
  }, [otpDigits]);

  // When modal opens, focus first box & start 30s timer
  useEffect(() => {
    if (isOtpModalOpen) {
      setOtpDigits(["", "", "", "", "", ""]);
      setTimerSeconds(30);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 120);
    }
  }, [isOtpModalOpen]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isOtpModalOpen && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, timerSeconds]);

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

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newDigits = ["", "", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      if (otpError) setOtpError("");
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleStartEdit = () => {
    const initialIps = user.ipAddresses && user.ipAddresses.length > 0
      ? [...user.ipAddresses]
      : user.ips
      ? user.ips.split(",").map((i) => i.trim()).filter(Boolean)
      : ["103.21.244.1", "103.21.245.2"];
    setEditedUser({
      ...user,
      callbackType: user.callbackType || "UPI",
      callbackUrl: user.callbackUrl || user.productionCallbackUrl || user.uatCallbackUrl || "",
      ipAddresses: initialIps,
      ips: initialIps.join(", ")
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Trigger OTP modal for saving edits
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    setPendingSaveAction("edit");
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpInput("");
    setOtpError("");
    setIsOtpModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFeatureToggle = (featureName: string) => {
    if (!hasEditAccess) return;
    const nextState = !localFeatures[featureName];
    const updated = { ...localFeatures, [featureName]: nextState };
    setLocalFeatures(updated);
    
    // Save to parent state immediately
    onUpdateUser({
      ...user,
      features: updated
    });

    setToast({
      show: true,
      message: `Feature "${featureName}" ${nextState ? "enabled" : "disabled"} successfully.`
    });
  };

  const handleStatusToggle = () => {
    if (!hasEditAccess) return;
    const nextActive = !isActive;
    
    // Generate a secure 6-digit simulated OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    setPendingStatusChange(nextActive);
    setPendingSaveAction("status");
    setOtpInput("");
    setOtpError("");
    setIsOtpModalOpen(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpInput.trim();
    if (entered.length === 6 && /^\d+$/.test(entered)) {
      if (pendingSaveAction === "edit") {
        onUpdateUser(editedUser);
        setIsEditing(false);
        setToast({
          show: true,
          message: "Profile changes saved successfully after OTP verification!"
        });
      } else if (pendingSaveAction === "status" && pendingStatusChange !== null) {
        setIsActive(pendingStatusChange);
        
        onUpdateUser({
          ...user,
          status: pendingStatusChange ? "Active" : "Inactive"
        });

        setToast({
          show: true,
          message: pendingStatusChange ? "Active Successfully" : "Inactive Successfully"
        });
      }
      setIsOtpModalOpen(false);
      setPendingSaveAction(null);
      setPendingStatusChange(null);
      setOtpInput("");
      setOtpError("");
    } else {
      setOtpError("Please enter a 6-digit numeric OTP code.");
    }
  };

  const handleResendOtp = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    setOtpInput("");
    setOtpError("");
    setToast({
      show: true,
      message: "A new OTP has been sent successfully!"
    });
  };

  // Sidebar Tabs Config
  const tabs = isAggregator
    ? [
        { id: "UserProfile", label: "User Profile", icon: UserIcon },
        { id: "BusinessInfo", label: "Business Information", icon: Building2 },
        { id: "PersonalInfo", label: "Personal Information", icon: UserIcon },
        { id: "SettlementAccount", label: "Bank Information", icon: Landmark },
        { id: "CallBackUrl", label: "CALLBACK URL", icon: Globe },
        { id: "IPs", label: "IP ADDRESS", icon: ShieldCheck },
        { id: "ManageVPA", label: "Manage VPA", icon: AtSign },
        { id: "PlanDetails", label: "Plan Details", icon: List },
        { id: "Features", label: "Features", icon: ToggleLeft },
        { id: "AccountStatus", label: "Account Status", icon: AlertCircle },
      ]
    : [
        { id: "UserProfile", label: "User Profile", icon: UserIcon },
        { id: "BusinessType", label: "Business Type", icon: Briefcase },
        { id: "BusinessInfo", label: "Business Information", icon: Building2 },
        { id: "PersonalInfo", label: "Personal Information", icon: UserIcon },
        { id: "SettlementAccount", label: isPartnerOrAggregator ? "Bank Information" : "Settlement Account", icon: Landmark },
        { id: "CallBackUrl", label: "CALLBACK URL", icon: Globe },
        { id: "IPs", label: "IP ADDRESS", icon: ShieldCheck },
        { id: "ManageVPA", label: "Manage VPA", icon: AtSign },
        { id: "KYCDocuments", label: "KYC Documents", icon: FileText },
        { id: "PlanDetails", label: "Plan Details", icon: List },
        ...(!isPartnerOrAggregator
          ? [{ id: "Agreement", label: "Agreement", icon: Printer }]
          : []),
        { id: "Features", label: "Features", icon: ToggleLeft },
        { id: "AccountStatus", label: "Account Status", icon: AlertCircle },
      ];

  return (
    <>
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 right-6 z-[9999] flex items-center space-x-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg py-3 px-4 shadow-lg"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold font-sans">{toast.message}</span>
          </motion.div>
        )}

        {isOtpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm overflow-hidden shadow-2xl p-6 relative text-left"
            >
              {/* Header with smartphone icon */}
              <div className="flex items-center space-x-2 text-left mb-1">
                <Smartphone className="w-5 h-5 text-gray-700 shrink-0" />
                <h3 className="text-base font-bold text-gray-900 font-sans">
                  OTP Verification
                </h3>
              </div>
              <p className="text-xs text-gray-500 text-left mb-3 leading-relaxed">
                Please enter the verification code we have sent you.
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* 6 Individual Square Input Boxes matching screenshot */}
                <div className="flex items-center justify-between gap-1.5 my-3" onPaste={handleDigitPaste}>
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
                  <div className="flex items-center space-x-1.5 text-xs text-red-600 font-bold bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {/* Resend OTP in 30 seconds timer */}
                <div className="text-center text-xs text-gray-500 font-medium py-1">
                  {timerSeconds > 0 ? (
                    <span>
                      Resend OTP in <strong className="text-gray-800 font-bold">{timerSeconds} seconds.</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleResendOtp();
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
                      setIsOtpModalOpen(false);
                      setPendingStatusChange(null);
                      setOtpInput("");
                      setOtpError("");
                    }}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#D05B27] hover:bg-[#b84d1f] text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    Verify
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
      >
      {/* Title & Accent Divider */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xl font-bold text-gray-800 font-sans tracking-tight hover:text-[#447837] transition"
          >
            ← Profile
          </button>
          <div className="flex h-1.5 w-32 mt-2 rounded-full overflow-hidden">
            <div className="bg-[#447837] w-2/3"></div>
            <div className="bg-yellow-500 w-1/3"></div>
          </div>
        </div>
        {hasEditAccess && activeTab !== "Features" ? (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-bold border border-gray-300 text-gray-500 rounded-md px-3.5 py-2 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="text-xs font-bold bg-[#447837] text-white rounded-md px-4 py-2 hover:bg-[#447837] transition shadow-xs"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-xs font-bold bg-[#447837] text-white rounded-md px-4 py-2 hover:bg-[#447837] transition shadow-xs flex items-center space-x-1"
              >
                <span>Edit User</span>
              </button>
            )}
          </div>
        ) : !hasEditAccess ? (
          <button
            onClick={onBack}
            className="text-xs font-bold border border-gray-300 rounded-md px-3.5 py-2 hover:bg-gray-50 transition"
          >
            Back to List
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        {/* LEFT COLUMN: Profile Summary & Tabs list */}
        <div className="lg:col-span-4 bg-white border border-gray-200 py-8 px-0 rounded-xl flex flex-col items-center shadow-xs overflow-hidden">
          {/* Avatar representation with turban/cap as per Screenshot 2026-07-17 */}
          <div className="w-24 h-24 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center mb-4 bg-[#FAF5EE] shadow-xs">
            <img
              src="/profile_avatar.png"
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.innerHTML = `<span class="text-4xl select-none">👳‍♂️</span>`;
                }
              }}
            />
          </div>
          
          <h3 className="text-xl font-bold text-gray-950 font-sans tracking-wide text-center px-4 leading-tight">
            {user.username || "khatabook"}
          </h3>
          <span className="text-[15px] text-gray-400 font-normal tracking-wide mt-1 mb-8 capitalize text-center">
            {user.role || "Partner"}
          </span>

          {/* Sub tabs lists */}
          <div className="w-full border-t border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center space-x-4 px-6 py-3.5 transition-all duration-150 ${
                    isActive
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span className="font-sans font-medium text-[15px] leading-none select-none">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Details Card */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">
          {/* User Profile tab */}
          {activeTab === "UserProfile" && (
            <div className="space-y-6">
              {isAggregator ? (
                <div className="space-y-6">
                  {/* Top card block with small avatar and title */}
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-[#FAF5EE] shadow-xs shrink-0">
                      <img
                        src="/profile_avatar.png"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `<span class="text-2xl select-none">👳‍♂️</span>`;
                          }
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xl font-bold text-gray-900 leading-tight">
                        {user.username || "khatabook"}
                      </h4>
                      <span className="text-sm text-gray-400 font-medium">
                        {user.role || "Aggregator"}
                      </span>
                    </div>
                  </div>

                  {/* Clean rows of profile fields: only Username and Account Type */}
                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
                    <div className="flex justify-between items-center py-3 text-sm">
                      <span className="text-gray-400 font-normal">Username</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.username || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                          className="text-right border border-gray-300 rounded px-2.5 py-1 focus:border-[#447837] focus:outline-none font-bold font-mono text-xs text-gray-800"
                        />
                      ) : (
                        <span className="text-gray-800 font-bold font-mono">{user.username}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center py-3 text-sm">
                      <span className="text-gray-400 font-normal">Account Type</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.role || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                          className="text-right border border-gray-300 rounded px-2.5 py-1 focus:border-[#447837] focus:outline-none font-bold text-xs text-gray-800"
                        />
                      ) : (
                        <span className="text-gray-800 font-bold uppercase">{user.role}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : isPartnerOrAggregator ? (
                <div className="space-y-6">
                  {/* Top card block with small avatar and title */}
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-[#FAF5EE] shadow-xs shrink-0">
                      <img
                        src="/profile_avatar.png"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `<span class="text-2xl select-none">👳‍♂️</span>`;
                          }
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xl font-bold text-gray-900 leading-tight">
                        {user.username || "khatabook"}
                      </h4>
                      <span className="text-sm text-gray-400 font-medium">
                        {user.role || "Partner"}
                      </span>
                    </div>
                  </div>

                  {/* Clean rows: Username and Account Type only */}
                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
                    <div className="flex justify-between items-center py-3 text-sm">
                      <span className="text-gray-400 font-normal">Username</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.username || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                          className="text-right border border-gray-300 rounded px-2.5 py-1 focus:border-[#447837] focus:outline-none font-bold font-mono text-xs text-gray-800"
                        />
                      ) : (
                        <span className="text-gray-800 font-bold font-mono">{user.username}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center py-3 text-sm">
                      <span className="text-gray-400 font-normal">Account Type</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.role || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                          className="text-right border border-gray-300 rounded px-2.5 py-1 focus:border-[#447837] focus:outline-none font-bold text-xs text-gray-800"
                        />
                      ) : (
                        <span className="text-gray-800 font-bold">{user.role}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                      User Profile
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                    <div>
                      <span className="text-gray-400 block mb-1">Username</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.username || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                          className="w-full text-xs font-mono font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-800 font-mono text-sm font-bold">{user.username}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Account Type</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.role || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                          className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-800 uppercase font-bold">{user.role}</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Business Type tab */}
          {activeTab === "BusinessType" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Business Entity Type
                </h4>
              </div>
              <div>
                <span className="text-gray-400 block text-xs mb-1">Business Type</span>
                {isEditing ? (
                  <select
                    value={normalizeBusinessType(editedUser.businessType)}
                    onChange={(e) => setEditedUser({ ...editedUser, businessType: e.target.value })}
                    className="text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none bg-white text-gray-800"
                  >
                    {BUSINESS_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-800 text-sm font-bold bg-[#447837]/5 text-[#447837] px-3 py-1 rounded inline-block font-mono">
                    {normalizeBusinessType(user.businessType)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Business Information tab */}
          {activeTab === "BusinessInfo" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Business Information
                </h4>
              </div>
              {isAggregator ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                  <div>
                    <span className="text-gray-400 block mb-1">Business Type</span>
                    {isEditing ? (
                      <select
                        value={normalizeBusinessType(editedUser.businessType)}
                        onChange={(e) => setEditedUser({ ...editedUser, businessType: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none bg-white font-bold"
                      >
                        {BUSINESS_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-800 font-bold">{normalizeBusinessType(user.businessType)}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Business Legal Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.businessLegalName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, businessLegalName: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.businessLegalName || "Odisha Tech Retail Pvt. Ltd."}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Brand Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.brandName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, brandName: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.brandName || "OTR Mart"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Business PAN</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.businessPan || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, businessPan: e.target.value })}
                        className="w-full text-xs font-mono font-bold uppercase border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono font-bold uppercase">{user.businessPan || "FPSPP3433H"}</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400 block mb-1">Business Registered Address</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.businessAddress || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, businessAddress: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.businessAddress || "Plot No. 12, Chandrasekharpur, Bhubaneswar, Odisha"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Pincode</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.pin || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, pin: e.target.value })}
                        className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono">{user.pin || "751016"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">City</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.city || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.city || "Bhubaneswar"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">State</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.state || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, state: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.state || "Odisha"}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                  <div>
                    <span className="text-gray-400 block mb-1">Business Type</span>
                    {isEditing ? (
                      <select
                        value={normalizeBusinessType(editedUser.businessType)}
                        onChange={(e) => setEditedUser({ ...editedUser, businessType: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none bg-white font-bold"
                      >
                        {BUSINESS_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-800 font-bold">{normalizeBusinessType(user.businessType)}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Business Legal Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.businessLegalName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, businessLegalName: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.businessLegalName || "Odisha Tech Retail Pvt. Ltd."}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Brand Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.brandName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, brandName: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.brandName || "OTR Mart"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Store Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.brandName ? editedUser.brandName + " Store" : ""}
                        disabled
                        className="w-full text-xs bg-gray-50 border border-gray-200 text-gray-500 rounded px-2.5 py-1.5 focus:outline-none cursor-not-allowed"
                      />
                    ) : (
                      <span className="text-gray-800">{user.brandName ? user.brandName + " Store" : "OTR Mart Bhubaneswar"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Business Registered Address</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.businessAddress || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, businessAddress: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.businessAddress || "Plot No. 12, Chandrasekharpur, Bhubaneswar, Odisha"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Pincode</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.pin || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, pin: e.target.value })}
                        className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono">{user.pin || "751016"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">State</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.state || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, state: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.state || "Odisha"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">District</span>
                    <span className="text-gray-800">KHORDA</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">City</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.city || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.city || "Bhubaneswar"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Business PAN</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.businessPan || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, businessPan: e.target.value })}
                        className="w-full text-xs font-mono font-bold uppercase border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono font-bold uppercase">{user.businessPan || "FPSPP3433H"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Establishment Year</span>
                    <span className="text-gray-800 font-mono">2020</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">GSTIN</span>
                    <span className="text-gray-800 font-mono">21ABCDE1234F1Z5</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Nature of Business</span>
                    <span className="text-gray-800">MS10</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">MCC</span>
                    <span className="text-gray-800 font-mono">6013</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Personal Information tab */}
          {activeTab === "PersonalInfo" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Personal Information
                </h4>
              </div>
              {isAggregator ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                  <div>
                    <span className="text-gray-400 block mb-1">First Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.firstName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 text-sm font-bold">{user.firstName}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Last Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.lastName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 text-sm font-bold">{user.lastName}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Email ID</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.email}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Mobile Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.mobileNumber || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, mobileNumber: e.target.value })}
                        className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono">{user.mobileNumber}</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400 block mb-1">Aadhaar Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.aadhaarNumber || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, aadhaarNumber: e.target.value })}
                        className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono font-bold">{user.aadhaarNumber || "987654321098"}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                  <div>
                    <span className="text-gray-400 block mb-1">First Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.firstName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 text-sm font-bold">{user.firstName}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Last Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.lastName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 text-sm font-bold">{user.lastName}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Email ID</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.email}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Mobile Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.mobileNumber || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, mobileNumber: e.target.value })}
                        className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono">{user.mobileNumber}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Aadhaar Number / Card</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.aadhaarNumber || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, aadhaarNumber: e.target.value })}
                        className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono">{user.aadhaarNumber || "987654321098"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Address</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.businessAddress || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, businessAddress: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.businessAddress || "Flat No. 204, Kalinga Heights, Nayapalli, Bhubaneswar"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">City</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.city || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.city || "Bhubaneswar"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">State</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.state || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, state: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.state || "Odisha"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Pin Code</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.pin || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, pin: e.target.value })}
                        className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono">{user.pin || "751012"}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Call Back tab */}
          {activeTab === "CallBackUrl" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  CALLBACK URL
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6 text-xs font-medium">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Callback Type <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <select
                      value={editedUser.callbackType || "UPI"}
                      onChange={(e) => setEditedUser({ ...editedUser, callbackType: e.target.value })}
                      className="w-full text-xs font-bold border border-gray-300 rounded-lg px-3 py-2.5 focus:border-[#447837] focus:outline-none bg-white shadow-sm"
                    >
                      <option value="UPI">UPI</option>
                      <option value="UPI Cashpoint">UPI Cashpoint</option>
                    </select>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-lg font-bold text-gray-800 text-xs">
                      {user.callbackType || "UPI"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Callback URL <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter Callback URL (e.g. https://example.com/callback)"
                      value={editedUser.callbackUrl ?? editedUser.uatCallbackUrl ?? ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          callbackUrl: e.target.value,
                          uatCallbackUrl: e.target.value,
                          productionCallbackUrl: e.target.value
                        })
                      }
                      className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:border-[#447837] focus:outline-none shadow-sm"
                    />
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-lg font-mono font-bold text-gray-800 text-xs break-all">
                      {user.callbackUrl || user.productionCallbackUrl || user.uatCallbackUrl || "https://uat.kapoorpay.com/callback"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* IPs tab */}
          {activeTab === "IPs" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                    IP ADDRESS
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    API calls will only be accepted from these authorized IP addresses.
                  </p>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentList = editedUser.ipAddresses || [];
                      const updated = [...currentList, ""];
                      setEditedUser({
                        ...editedUser,
                        ipAddresses: updated,
                        ips: updated.join(", ")
                      });
                    }}
                    className="bg-[#447837] hover:bg-[#681f24] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center shadow-sm transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add More IP
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-600">
                    Configured IP Addresses
                  </label>
                  {((editedUser.ipAddresses && editedUser.ipAddresses.length > 0)
                    ? editedUser.ipAddresses
                    : [""]
                  ).map((ipVal, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-gray-400 w-12 shrink-0">
                        IP {idx + 1}:
                      </span>
                      <input
                        type="text"
                        placeholder={`e.g. 103.21.244.${idx + 1}`}
                        value={ipVal}
                        onChange={(e) => {
                          const currentList = [...(editedUser.ipAddresses || [""])];
                          currentList[idx] = e.target.value;
                          setEditedUser({
                            ...editedUser,
                            ipAddresses: currentList,
                            ips: currentList.join(", ")
                          });
                        }}
                        className="flex-1 text-xs font-mono border border-gray-300 rounded px-3 py-2 focus:border-[#447837] focus:outline-none"
                      />
                      {((editedUser.ipAddresses?.length || 0) > 1) && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentList = (editedUser.ipAddresses || []).filter((_, i) => i !== idx);
                            setEditedUser({
                              ...editedUser,
                              ipAddresses: currentList,
                              ips: currentList.join(", ")
                            });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded border border-red-100 transition-colors"
                          title="Remove IP"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentList = editedUser.ipAddresses || [];
                        const updated = [...currentList, ""];
                        setEditedUser({
                          ...editedUser,
                          ipAddresses: updated,
                          ips: updated.join(", ")
                        });
                      }}
                      className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-[#447837] hover:text-[#447837] text-gray-600 text-xs font-bold rounded-lg flex items-center justify-center transition-all bg-gray-50/50"
                    >
                      <Plus className="w-4 h-4 mr-1.5 text-[#447837]" /> Add Another IP Address
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-500">
                    Allowed IP List
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(user.ipAddresses && user.ipAddresses.length > 0
                      ? user.ipAddresses
                      : user.ips
                      ? user.ips.split(",").map((i) => i.trim()).filter(Boolean)
                      : ["103.21.244.1", "103.21.245.2"]
                    ).map((ip, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-mono text-xs font-bold text-gray-800">{ip}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Allowed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settlement Account tab */}
          {activeTab === "SettlementAccount" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Bank Information
                </h4>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                  <Check className="w-3 h-3 mr-1" /> Verified
                </span>
              </div>
              {isAggregator ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                  <div>
                    <span className="text-gray-400 block mb-1">Account Type</span>
                    {isEditing ? (
                      <select
                        value={editedUser.accountType || "Savings"}
                        onChange={(e) => setEditedUser({ ...editedUser, accountType: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none bg-white text-gray-800"
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Escrow">Escrow</option>
                      </select>
                    ) : (
                      <span className="text-gray-800 font-bold">{user.accountType || "Savings"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">IFSC Code</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.ifscCode || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, ifscCode: e.target.value })}
                        className="w-full text-xs font-mono font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none uppercase text-[#447837]"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono font-bold text-sm text-[#447837]">{user.ifscCode || "IOBA0000159"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Bank Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.bankName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, bankName: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-bold">{user.bankName || "INDIAN OVERSEAS BANK"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Bank Account Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.bankAccountNumber || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, bankAccountNumber: e.target.value })}
                        className="w-full text-xs font-mono font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono text-sm font-bold">{user.bankAccountNumber || "111111111111"}</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400 block mb-1">Branch Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.branchName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, branchName: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.branchName || "Unit III, New Station Square, Bhubaneswar"}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                  <div>
                    <span className="text-gray-400 block mb-1">Bank Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.bankName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, bankName: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-bold">{user.bankName || "INDIAN OVERSEAS BANK"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Branch Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.branchName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, branchName: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800">{user.branchName || "Unit III, New Station Square, Bhubaneswar"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Account Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.bankAccountNumber || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, bankAccountNumber: e.target.value })}
                        className="w-full text-xs font-mono font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono text-sm font-bold">{user.bankAccountNumber || "111111111111"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Beneficiary Name</span>
                    <span className="text-gray-800 font-bold">{user.firstName} {user.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Account Type</span>
                    {isEditing ? (
                      <select
                        value={editedUser.accountType || "Savings"}
                        onChange={(e) => setEditedUser({ ...editedUser, accountType: e.target.value })}
                        className="w-full text-xs font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none bg-white text-gray-800"
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Escrow">Escrow</option>
                      </select>
                    ) : (
                      <span className="text-gray-800">{user.accountType || "Savings"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">IFSC Code</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.ifscCode || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, ifscCode: e.target.value })}
                        className="w-full text-xs font-mono font-bold border border-gray-300 rounded px-2.5 py-1.5 focus:border-[#447837] focus:outline-none uppercase text-[#447837]"
                      />
                    ) : (
                      <span className="text-gray-800 font-mono font-bold text-sm text-[#447837]">{user.ifscCode || "IOBA0000159"}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manage VPA tab */}
          {activeTab === "ManageVPA" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Manage VPA
                </h4>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center">
                  <Lock className="w-3 h-3 mr-1 text-amber-600" /> Non-Editable Attribute
                </span>
              </div>
              <div className="text-xs font-medium space-y-3">
                <span className="text-gray-400 block mb-1">Virtual Payment Address (VPA)</span>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      disabled
                      value={editedUser.vpa || `${user.username.toLowerCase()}@ta`}
                      className="w-full bg-gray-100 text-gray-500 border border-gray-200 px-4 py-2.5 rounded font-mono font-bold text-sm cursor-not-allowed select-none"
                    />
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center">
                      <Lock className="w-4 h-4 mr-2 shrink-0 text-amber-600" />
                      <span>
                        <strong>Locked Attribute:</strong> The VPA address is registered with Transaction Analysts and cannot be edited.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <span className="bg-red-50 text-[#447837] border border-red-100 px-4 py-2 rounded font-mono font-bold text-sm inline-block">
                      {user.vpa || `${user.username.toLowerCase()}@ta`}
                    </span>
                    <span className="text-xs text-gray-400 font-medium flex items-center">
                      <Lock className="w-3.5 h-3.5 mr-1 text-gray-400" /> Fixed / Locked
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* KYC Documents tab */}
          {activeTab === "KYCDocuments" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  KYC Documents
                </h4>
              </div>

              {/* Individual Documents */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Director / Individual Documents (5 Directors Supported)
                </h5>

                {[1, 2, 3, 4, 5].map((dNum) => (
                  <div key={dNum} className="border border-gray-100 rounded-lg overflow-hidden text-xs">
                    <div className="bg-gray-50/80 px-4 py-2 font-bold text-gray-700 border-b border-gray-100 flex items-center justify-between">
                      <span>Person {dNum} Documents (Director {dNum})</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        dNum === 1 ? "bg-emerald-100 text-[#447837]" : "bg-gray-200 text-gray-600"
                      }`}>
                        {dNum === 1 ? "Compulsory" : "Optional"}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-gray-600 font-medium">Individual PAN Card</span>
                        <button className="text-[#447837] hover:underline font-bold">View</button>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-gray-600 font-medium">KYC Document Front Page</span>
                        <button className="text-[#447837] hover:underline font-bold">View</button>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-gray-600 font-medium">KYC Document Back Page</span>
                        <button className="text-[#447837] hover:underline font-bold">View</button>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-gray-600 font-medium">Individual Address Proof</span>
                        <button className="text-[#447837] hover:underline font-bold">View</button>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-gray-600 font-medium">Individual Photo</span>
                        <button className="text-[#447837] hover:underline font-bold">View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Documents */}
              <div className="space-y-3 pt-3">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Business Documents</h5>
                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 text-xs">
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">Business PAN *</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">Certificate of Incorporation *</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">Memorandum of Association (MOA) *</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">Signed Attached Copy of AOA (Articles of Association)</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">MCA Details (Ministry of Corporate Affairs)</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5 bg-white">
                    <div>
                      <span className="text-gray-800 font-bold block">
                        SBO/UBO Declaration Form (Significant / Ultimate Beneficial Owner) *
                      </span>
                      <span className="text-[10px] text-gray-500">Official Declaration</span>
                    </div>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">Turnover Declaration Document</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">GST Registration Certificate *</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">Store Inside Image *</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">Store Outside Image *</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-gray-600 font-medium">TA MA Declaration *</span>
                    <button className="text-[#447837] hover:underline font-bold">View</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plan Details tab */}
          {activeTab === "PlanDetails" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Plan Details
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                <div>
                  <span className="text-gray-400 block mb-1">Feature</span>
                  <span className="text-gray-800 font-bold">UPI_API</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Sub-feature Name</span>
                  <span className="text-gray-800">ONLINE_UPI_INTENT</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Service Provider Name</span>
                  <span className="text-gray-800 font-mono text-[11px]">UPI_API_ONLINE_UPI_INTENT_1_200</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Plan Name</span>
                  <span className="text-gray-800 font-bold text-[#447837]">{user.planName || "Merchant Plan"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Plan Type</span>
                  <span className="text-gray-800 font-bold uppercase">{user.role}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Set Value Fixed</span>
                  <span className="text-gray-800 font-mono">1.5</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Set Value Percentage</span>
                  <span className="text-gray-800 font-mono">0</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Commission Value</span>
                  <span className="text-gray-800">False</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 block mb-1">MCC Description</span>
                  <span className="text-gray-800">Agricultural Services(AS01)</span>
                </div>
              </div>
            </div>
          )}

          {/* Agreement tab */}
          {activeTab === "Agreement" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Agreement
                </h4>
              </div>
              <p className="text-xs text-gray-400 italic">No agreement documents available for this user account.</p>
            </div>
          )}

          {/* Features Toggle Switches & Payer Account Type Tab */}
          {activeTab === "Features" && (
            <div className="space-y-8">
              {/* Payer Account Type Section */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide flex items-center">
                    <Landmark className="w-4 h-4 mr-2 text-[#447837]" />
                    Payer Account Type
                  </h4>
                </div>

                {/* 14 Payer Account Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3.5">
                  {PAYER_ACCOUNT_TYPES.map((typeConfig) => {
                    const isParentEnabled = isPartnerOrAggregator
                      ? true
                      : (parentPayerTypes ? (parentPayerTypes[typeConfig.label] ?? true) : true);

                    const isLocked = !isPartnerOrAggregator && !isParentEnabled;
                    const isActive = localPayerAccountTypes[typeConfig.label] ?? (
                      isPartnerOrAggregator ? true : (typeConfig.label === "Savings" || typeConfig.label === "Current")
                    );

                    return (
                      <div
                        key={typeConfig.label}
                        onClick={() => {
                          if (isLocked) {
                            setToast({
                              show: true,
                              message: `${typeConfig.label} must first be enabled at the Partner/Aggregator level before it can be enabled for this Merchant/Agent.`
                            });
                          }
                        }}
                        className={`p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                          isLocked
                            ? "bg-gray-100/80 border-gray-200 opacity-75 cursor-not-allowed"
                            : isActive
                            ? "bg-emerald-50/40 border-emerald-200 shadow-2xs"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-gray-900 font-sans">
                              {typeConfig.label}
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200">
                              Code {typeConfig.code}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">
                              {typeConfig.value}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            {typeConfig.description}
                          </p>

                          {isLocked && (
                            <div className="flex items-center text-[10px] text-amber-700 font-medium pt-0.5">
                              <Lock className="w-3 h-3 mr-1 text-amber-600 shrink-0" />
                              Locked at Partner Level
                            </div>
                          )}
                        </div>

                        {/* Toggle switch */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {isLocked ? (
                            <div
                              title={`${typeConfig.label} must first be enabled at the Partner/Aggregator level before it can be enabled for this Merchant/Agent.`}
                              className="p-1.5 bg-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                            >
                              <Lock className="w-4 h-4" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={!hasEditAccess}
                              onClick={() => handlePayerAccountTypeToggleClick(typeConfig)}
                              className={`relative inline-flex h-6 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isActive ? "bg-[#447837]" : "bg-gray-300"
                              } ${!hasEditAccess ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  isActive ? "translate-x-6" : "translate-x-0"
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* General System Features Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                    General System Features
                  </h4>
                </div>
                
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg bg-gray-50/50">
                  {Object.keys(localFeatures).map((feat) => (
                    <div key={feat} className="flex justify-between items-center px-4 py-3.5">
                      <span className="text-xs font-bold text-gray-700">{feat}</span>
                      
                      {/* Toggle switch */}
                      <button
                        type="button"
                        disabled={!hasEditAccess}
                        onClick={() => handleFeatureToggle(feat)}
                        className={`relative inline-flex h-5 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          localFeatures[feat] ? "bg-[#447837]" : "bg-gray-200"
                        } ${!hasEditAccess ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            localFeatures[feat] ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Account Status tab */}
          {activeTab === "AccountStatus" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-[#447837] uppercase tracking-wide">
                  Account Status & Onboarding State
                </h4>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400">Onboarding Status</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
                    Onboarding Completed
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400">KYC Status</span>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
                    Verified
                  </span>
                </div>

                <div className="flex justify-between items-center py-4 bg-gray-50 px-4 rounded-lg border border-gray-100 mt-4">
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-bold text-xs">Account Status</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">Toggle to set user state as Active or Inactive</span>
                  </div>

                  {/* Switch */}
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold uppercase ${isActive ? "text-green-600" : "text-gray-400"}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                    <button
                      type="button"
                      disabled={!hasEditAccess}
                      onClick={handleStatusToggle}
                      className={`relative inline-flex h-6 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isActive ? "bg-green-600" : "bg-gray-300"
                      } ${!hasEditAccess ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>

    {/* Confirmation Modal for Payer Account Type Update */}
    <AnimatePresence>
      {confirmModal.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[100000] p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-100 text-left"
          >
            <div className="flex items-center space-x-3 text-[#447837]">
              <AlertCircle className="w-6 h-6 text-[#447837] shrink-0" />
              <h3 className="text-base font-bold text-gray-900 font-sans">
                Confirm {confirmModal.targetState ? "Activation" : "Deactivation"}
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to {confirmModal.targetState ? "activate" : "deactivate"} the payer account type{" "}
              <strong className="text-gray-900">{confirmModal.typeLabel}</strong> (Code {confirmModal.code}) for user{" "}
              <strong className="text-gray-900">{user.username}</strong>?
            </p>

            <div className={`p-3.5 rounded-lg text-xs leading-relaxed ${confirmModal.targetState ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-amber-50 text-amber-900 border border-amber-200"}`}>
              {confirmModal.targetState ? (
                <span>
                  <strong>Activation Notice:</strong> Transactions originating from <strong>{confirmModal.typeLabel}</strong> ({confirmModal.backendValue}) accounts will be accepted for this user.
                </span>
              ) : (
                <span>
                  <strong>Deactivation Notice:</strong> Incoming payment requests from <strong>{confirmModal.typeLabel}</strong> ({confirmModal.backendValue}) accounts will be rejected with <code>statusCode 4001</code> (Payment Mode Restricted).
                </span>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayerAccountTypeUpdate}
                className={`px-4 py-2 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer ${
                  confirmModal.targetState ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#447837] hover:bg-[#681f24]"
                }`}
              >
                Confirm {confirmModal.targetState ? "Activate" : "Deactivate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
