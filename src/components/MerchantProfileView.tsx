import React, { useState } from "react";
import {
  User,
  Building2,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Edit2,
  Check,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Download,
  ExternalLink,
  Save,
  X,
  FileText,
  AlertCircle,
  Copy
} from "lucide-react";

interface MerchantProfileViewProps {
  onChangePasswordClick: () => void;
  onViewQr?: () => void;
  onBackToDashboard?: () => void;
}

export function MerchantProfileView({
  onChangePasswordClick,
  onViewQr,
  onBackToDashboard,
}: MerchantProfileViewProps) {
  const [activeTab, setActiveTab] = useState<
    "business" | "bank" | "upi" | "kyc" | "security"
  >("business");

  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Merchant Profile State in TA Branding
  const [merchantData, setMerchantData] = useState({
    merchantId: "TA-MER-9941",
    terminalId: "TA-TID-882190",
    signatoryName: "Shakti Kumar",
    businessName: "Shakti Retail & UPI Enterprise",
    businessCategory: "Retail & Grocery (MCC 5411)",
    businessType: "Sole Proprietorship",
    username: "shakti.kumar",
    email: "shakti.kumar@retailupi.com",
    phone: "+91 98765 43210",
    altPhone: "+91 80 4123 4567",
    address: "#42, Whitefield Main Road, ITPL Tech Park Area",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560066",
    registrationDate: "14 Jan 2026",
    status: "Active & Verified",
    pan: "ABCDE1234F",
    gstin: "29AABCU9603R1ZM",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50100482910381",
    maskedAccount: "•••• •••• •••• 8291",
    ifsc: "HDFC0001234",
    branch: "Whitefield Main Branch, Bengaluru",
    accountType: "Current Account",
    settlementCycle: "T+1 Auto-Settlement (Cut-off 23:59 IST)",
    instantSettlement: true,
    primaryVpa: "shaktiretail@tapay",
    secondaryVpa: "shakti.9876543210@tapay",
    dailyLimit: "₹ 5,00,000.00",
    singleTxnLimit: "₹ 1,00,000.00",
    mdrRate: "0.00% on UPI QR / Rupay Debit",
    agreementRef: "TA-AGR-2026-9941",
    agreementDate: "21/09/2026 09:22 AM",
    twoFactorAuth: true,
  });

  // Draft state for edit form
  const [editForm, setEditForm] = useState({ ...merchantData });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMerchantData({ ...editForm });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleCancel = () => {
    setEditForm({ ...merchantData });
    setIsEditing(false);
  };

  return (
    <div className="w-full text-left font-sans animate-fadeIn pb-12">
      {/* Toast Banner */}
      {saveToast && (
        <div className="mb-4 bg-[#EBF4E9] border border-[#C8E2BF] text-[#2E5324] px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#447837]" />
            <span>Merchant profile details updated successfully!</span>
          </div>
          <button
            onClick={() => setSaveToast(false)}
            className="text-[#447837] hover:text-[#2E5324] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 select-none">
        <div className="text-xs text-gray-500 font-medium">
          <span>Home</span>
          <span className="mx-1.5 text-gray-300">/</span>
          <span>Merchant Portal</span>
          <span className="mx-1.5 text-gray-300">/</span>
          <span className="text-[#447837] font-bold">My Profile</span>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold text-[#447837] hover:text-[#2E5324] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>← Back to Merchant Dashboard</span>
          </button>
        )}
      </div>

      {/* Top Merchant Hero Card in TA Green Palette */}
      <div className="bg-white border border-[#D8E6D5] rounded-2xl shadow-xs p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#F0F7EE] to-transparent pointer-events-none opacity-60"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          {/* Avatar and Basic Credentials */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#447837] to-[#2E5324] text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md border-2 border-white">
                SK
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2.5 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-sans">
                  {merchantData.signatoryName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4E9] border border-[#C8E2BF] text-[#2E5324] text-[11px] font-bold">
                  TA Merchant
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {merchantData.businessName}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-700">MID:</span>
                  <span className="font-mono text-[#2E5324] font-bold">{merchantData.merchantId}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-700">TID:</span>
                  <span className="font-mono text-gray-700">{merchantData.terminalId}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>KYC Verified &amp; Agreement Signed</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            {!isEditing ? (
              <button
                onClick={() => {
                  setEditForm({ ...merchantData });
                  setIsEditing(true);
                }}
                className="flex-1 md:flex-none px-4 py-2 bg-[#EBF4E9] hover:bg-[#E0EEDD] border border-[#C8E2BF] text-[#2E5324] rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="flex-1 md:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            {onViewQr && (
              <button
                onClick={onViewQr}
                className="flex-1 md:flex-none px-4 py-2 bg-[#447837] hover:bg-[#36612B] text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Store Standee QR</span>
              </button>
            )}

            <button
              onClick={onChangePasswordClick}
              className="flex-1 md:flex-none px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-gray-500" />
              <span>Security &amp; PIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pills Tabs */}
      <div className="flex items-center space-x-2 mb-6 border-b border-gray-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("business")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === "business"
              ? "bg-[#447837] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-[#F2F7F0] hover:text-[#2E5324] border border-gray-200/80"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Business &amp; Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("bank")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === "bank"
              ? "bg-[#447837] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-[#F2F7F0] hover:text-[#2E5324] border border-gray-200/80"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Bank &amp; Settlements</span>
        </button>

        <button
          onClick={() => setActiveTab("upi")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === "upi"
              ? "bg-[#447837] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-[#F2F7F0] hover:text-[#2E5324] border border-gray-200/80"
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>VPAs &amp; Limits</span>
        </button>

        <button
          onClick={() => setActiveTab("kyc")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === "kyc"
              ? "bg-[#447837] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-[#F2F7F0] hover:text-[#2E5324] border border-gray-200/80"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>KYC &amp; Agreement</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === "security"
              ? "bg-[#447837] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-[#F2F7F0] hover:text-[#2E5324] border border-gray-200/80"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security &amp; 2FA</span>
        </button>
      </div>

      {/* TAB CONTENT 1: BUSINESS & PROFILE DETAILS */}
      {activeTab === "business" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Business &amp; Signatory Information
              </h2>
              <p className="text-xs text-gray-500">
                Official Merchant Profile registered with Transaction Analysts Partner Network
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => {
                  setEditForm({ ...merchantData });
                  setIsEditing(true);
                }}
                className="text-xs font-bold text-[#447837] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Fields</span>
              </button>
            )}
          </div>

          {isEditing ? (
            /* EDIT FORM */
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Signatory Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.signatoryName}
                    onChange={(e) => setEditForm({ ...editForm, signatoryName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF7] border border-[#C8E2BF] rounded-lg text-gray-900 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Business / Store Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.businessName}
                    onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF7] border border-[#C8E2BF] rounded-lg text-gray-900 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF7] border border-[#C8E2BF] rounded-lg text-gray-900 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF7] border border-[#C8E2BF] rounded-lg text-gray-900 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Store / Operational Address
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF7] border border-[#C8E2BF] rounded-lg text-gray-900 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City &amp; State
                  </label>
                  <input
                    type="text"
                    value={`${editForm.city}, ${editForm.state}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(",");
                      setEditForm({
                        ...editForm,
                        city: parts[0]?.trim() || editForm.city,
                        state: parts[1]?.trim() || editForm.state,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF7] border border-[#C8E2BF] rounded-lg text-gray-900 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Postal PIN Code
                  </label>
                  <input
                    type="text"
                    value={editForm.pincode}
                    onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF7] border border-[#C8E2BF] rounded-lg text-gray-900 focus:outline-none focus:border-[#447837]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#447837] hover:bg-[#36612B] text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* READ-ONLY VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs divide-y md:divide-y-0 divide-gray-100">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Signatory Full Name</span>
                <span className="font-bold text-gray-900">{merchantData.signatoryName}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Store / Enterprise Name</span>
                <span className="font-bold text-gray-900">{merchantData.businessName}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Merchant User ID</span>
                <span className="font-mono font-bold text-[#2E5324]">{merchantData.username}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Merchant Category (MCC)</span>
                <span className="font-semibold text-gray-800">{merchantData.businessCategory}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Business Constitution</span>
                <span className="font-semibold text-gray-800">{merchantData.businessType}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Registration Date</span>
                <span className="font-medium text-gray-700">{merchantData.registrationDate}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Primary Contact Email</span>
                <span className="font-mono font-bold text-gray-900">{merchantData.email}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Registered Phone</span>
                <span className="font-mono font-bold text-gray-900">{merchantData.phone}</span>
              </div>

              <div className="md:col-span-2 flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Store Address</span>
                <span className="font-medium text-gray-800 text-right max-w-md">
                  {merchantData.address}, {merchantData.city}, {merchantData.state} - {merchantData.pincode}
                </span>
              </div>

              <div className="md:col-span-2 flex justify-between py-3">
                <span className="text-gray-500">Partner Platform</span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#EBF4E9] text-[#2E5324] rounded-lg font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#447837]" />
                  <span>Transaction Analysts (TA) Acquiring Hub</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: BANK & SETTLEMENT DETAILS */}
      {activeTab === "bank" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Settlement Bank Account
                </h2>
                <p className="text-xs text-gray-500">
                  All customer UPI payments &amp; QR collections are settled directly to this account
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-full text-xs font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Penny Drop Verified</span>
              </span>
            </div>

            {/* Bank Card Display in TA Green Palette */}
            <div className="bg-gradient-to-br from-[#2E5324] to-[#447837] text-white p-6 rounded-2xl shadow-md mb-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-emerald-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                    Primary Settlement A/C
                  </span>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                  {merchantData.bankName}
                </span>
              </div>

              <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest mb-6">
                {merchantData.maskedAccount}
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 text-xs text-emerald-100">
                <div>
                  <span className="block text-[10px] text-emerald-200 uppercase">Account Holder</span>
                  <span className="font-bold text-white text-sm">{merchantData.signatoryName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-emerald-200 uppercase">IFSC Code</span>
                  <span className="font-mono font-bold text-white">{merchantData.ifsc}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-emerald-200 uppercase">Settlement Cycle</span>
                  <span className="font-semibold text-white">T+1 Daily Auto-Credit</span>
                </div>
              </div>
            </div>

            {/* Detailed Bank Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs divide-y md:divide-y-0 divide-gray-100">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Bank Name</span>
                <span className="font-bold text-gray-900">{merchantData.bankName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Branch Name</span>
                <span className="font-medium text-gray-800">{merchantData.branch}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Account Type</span>
                <span className="font-semibold text-gray-800">{merchantData.accountType}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Instant Settlement (IMPS/UPI)</span>
                <span className="font-bold text-emerald-700">Enabled (0.00% fee)</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Settlement Currency</span>
                <span className="font-bold text-gray-900">INR (₹)</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">TA Routing Partner</span>
                <span className="font-semibold text-[#2E5324]">Transaction Analysts India</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: VPAs & LIMITS */}
      {activeTab === "upi" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Configured Virtual Payment Addresses (VPAs)
                </h2>
                <p className="text-xs text-gray-500">
                  Incoming UPI payments received on these handles are auto-routed to your settlement account
                </p>
              </div>
              {onViewQr && (
                <button
                  onClick={onViewQr}
                  className="px-3.5 py-1.5 bg-[#447837] text-white rounded-lg text-xs font-bold hover:bg-[#36612B] transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Preview Store QR</span>
                </button>
              )}
            </div>

            {/* VPA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl border-2 border-[#C8E2BF] bg-[#FAFDF9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase bg-[#EBF4E9] text-[#2E5324] px-2 py-0.5 rounded">
                    Primary Store VPA
                  </span>
                  <button
                    onClick={() => handleCopy(merchantData.primaryVpa, "primaryVpa")}
                    className="text-xs text-[#447837] hover:text-[#2E5324] flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === "primaryVpa" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="font-mono font-bold text-sm text-gray-900 mb-1">
                  {merchantData.primaryVpa}
                </div>
                <p className="text-[11px] text-gray-500">
                  Linked to Static Standee QR &amp; Dynamic UPI Intent
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    Secondary Mobile VPA
                  </span>
                  <button
                    onClick={() => handleCopy(merchantData.secondaryVpa, "secondaryVpa")}
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === "secondaryVpa" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="font-mono font-bold text-sm text-gray-900 mb-1">
                  {merchantData.secondaryVpa}
                </div>
                <p className="text-[11px] text-gray-500">
                  Linked to registered mobile number fallback
                </p>
              </div>
            </div>

            {/* Limits & Pricing Table */}
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">
              Configured Limits &amp; Transaction Rules
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-medium text-gray-500">Daily Total Collection Limit</td>
                    <td className="py-3 px-4 font-bold text-gray-900 text-right">{merchantData.dailyLimit}</td>
                  </tr>
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-medium text-gray-500">Max Per-Transaction Limit</td>
                    <td className="py-3 px-4 font-bold text-gray-900 text-right">{merchantData.singleTxnLimit}</td>
                  </tr>
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-medium text-gray-500">Merchant Discount Rate (MDR)</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 text-right">{merchantData.mdrRate}</td>
                  </tr>
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-medium text-gray-500">Terminal ID (TID)</td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900 text-right">{merchantData.terminalId}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: KYC & AGREEMENT */}
      {activeTab === "kyc" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  KYC Verification &amp; Legal Agreement
                </h2>
                <p className="text-xs text-gray-500">
                  Regulatory compliance and digitally executed contracts with Transaction Analysts
                </p>
              </div>
              <span className="px-3 py-1 bg-[#EBF4E9] border border-[#C8E2BF] text-[#2E5324] rounded-full text-xs font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#447837]" />
                <span>100% Compliant</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* PAN Card */}
              <div className="p-4 rounded-xl border border-gray-200 bg-[#FBFDFB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">Permanent Account Number (PAN)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Verified ✓
                  </span>
                </div>
                <div className="font-mono font-black text-base text-gray-900 mb-1">
                  {merchantData.pan}
                </div>
                <span className="text-[10px] text-gray-400 block">
                  Cardholder: Shakti Kumar • ITD Database Match
                </span>
              </div>

              {/* GSTIN */}
              <div className="p-4 rounded-xl border border-gray-200 bg-[#FBFDFB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">Goods &amp; Services Tax (GSTIN)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active ✓
                  </span>
                </div>
                <div className="font-mono font-black text-base text-gray-900 mb-1">
                  {merchantData.gstin}
                </div>
                <span className="text-[10px] text-gray-400 block">
                  Karnataka Tax Jurisdiction • Regular Taxpayer
                </span>
              </div>
            </div>

            {/* E-Signed Legal Agreement Card */}
            <div className="bg-[#FAFDF9] border border-[#C8E2BF] rounded-xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF4E9] text-[#447837] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      TA Merchant Services &amp; UPI Acquiring Agreement
                    </h4>
                    <p className="text-xs text-gray-500">
                      Ref: <strong className="font-mono text-gray-800">{merchantData.agreementRef}</strong> • Executed: {merchantData.agreementDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                    Digitally E-Signed ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: SECURITY & 2FA */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Security, Passwords &amp; Authentication
                </h2>
                <p className="text-xs text-gray-500">
                  Manage login credentials and two-factor authentication for your merchant portal
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5">
                    Account Password
                  </h4>
                  <p className="text-xs text-gray-500">
                    Last updated recently. Ensure you use a strong password with symbols and numbers.
                  </p>
                </div>
                <button
                  onClick={onChangePasswordClick}
                  className="px-4 py-2 bg-[#447837] hover:bg-[#36612B] text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-[#FAFDF9]">
                <div>
                  <div className="flex items-center space-x-2 mb-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      Two-Factor Authentication (2FA)
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      Enabled
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    OTP authentication required upon login from unfamiliar devices.
                  </p>
                </div>
                <div className="w-11 h-6 bg-[#447837] rounded-full p-1 cursor-pointer transition">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-xs"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5">
                    Active Session Log
                  </h4>
                  <p className="text-xs text-gray-500">
                    Logged in via Chrome on Windows • IP 103.21.244.18 (Bengaluru, KA)
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Current Session Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
