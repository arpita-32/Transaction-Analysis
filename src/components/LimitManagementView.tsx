import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Check, X, Eye, FileText, Landmark, User as UserIcon } from "lucide-react";

interface LimitData {
  id: string;
  name: string;
  userType: "Merchant" | "Partner" | "Aggregator";
  maxDaily: string;
  minTxn: string;
  maxTxn: string;
  creditLimit: string;
  ledgerBalance: string;
  holdBalance: string;
  releaseBalance: string;
  
  // Details for the Modal
  email: string;
  phone: string;
  legalName: string;
  pan: string;
  bankName: string;
  bankAccount: string;
  ifsc: string;
  status: string;
}

const mockLimits: Record<string, LimitData> = {
  "56743565433": {
    id: "56743565433",
    name: "OxyMoney Solutions Private Limited",
    userType: "Merchant",
    maxDaily: "20,000",
    minTxn: "10",
    maxTxn: "1,000",
    creditLimit: "1,50,000",
    ledgerBalance: "10,00,000",
    holdBalance: "95,00,000",
    releaseBalance: "50,00,000",
    email: "finance@oxymoney.com",
    phone: "9876543210",
    legalName: "OxyMoney Solutions Private Limited",
    pan: "AACO1234M",
    bankName: "State Bank of India",
    bankAccount: "30291048576",
    ifsc: "SBIN0001234",
    status: "Active"
  },
  "88472910482": {
    id: "88472910482",
    name: "SwiftPay Corp Limited",
    userType: "Partner",
    maxDaily: "50,000",
    minTxn: "20",
    maxTxn: "5,000",
    creditLimit: "2,00,000",
    ledgerBalance: "25,00,000",
    holdBalance: "1,20,00,000",
    releaseBalance: "75,00,000",
    email: "settlement@swiftpay.com",
    phone: "9123456789",
    legalName: "SwiftPay Corp Limited",
    pan: "ABCP5678K",
    bankName: "HDFC Bank",
    bankAccount: "501002244558",
    ifsc: "HDFC0000123",
    status: "Active"
  },
  "10293847561": {
    id: "10293847561",
    name: "National Aggregation Services",
    userType: "Aggregator",
    maxDaily: "1,00,000",
    minTxn: "100",
    maxTxn: "20,000",
    creditLimit: "10,00,000",
    ledgerBalance: "1,50,00,000",
    holdBalance: "5,00,00,000",
    releaseBalance: "2,00,00,000",
    email: "compliance@nas-aggregator.in",
    phone: "8899001122",
    legalName: "National Aggregation Services Ltd.",
    pan: "AADN9081J",
    bankName: "ICICI Bank",
    bankAccount: "000401556677",
    ifsc: "ICIC0000004",
    status: "Active"
  }
};

export function LimitManagementView() {
  const [userType, setUserType] = useState<"Merchant" | "Partner" | "Aggregator">("Merchant");
  const [searchBy, setSearchBy] = useState<string>("id");
  const [searchValue, setSearchValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [searchError, setSearchError] = useState("");
  
  // Active limit data being edited
  const [limitData, setLimitData] = useState<LimitData | null>(null);
  
  // Modal & Tooltip UI states
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleReset = () => {
    setSearchValue("");
    setSubmitted(false);
    setLimitData(null);
    setSearchError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchError("");

    if (!searchValue.trim()) {
      setSearchError("Please enter an ID or name to search.");
      return;
    }

    // Try finding in mock database
    let found: LimitData | undefined = undefined;

    if (searchBy === "id") {
      found = mockLimits[searchValue.trim()];
    } else {
      // Search by name
      found = Object.values(mockLimits).find(
        (item) =>
          item.name.toLowerCase().includes(searchValue.trim().toLowerCase()) &&
          item.userType === userType
      );
    }

    if (found && found.userType === userType) {
      setLimitData({ ...found });
      setSubmitted(true);
    } else {
      // If not found, let's auto-generate a realistic mock one based on the input so the user always gets a response!
      const generatedId = searchBy === "id" ? searchValue.trim() : "TA" + Math.floor(1000000 + Math.random() * 9000000);
      const generatedName = searchBy === "name" ? searchValue.trim() : `${userType} Solutions Pvt Ltd`;
      
      const newMock: LimitData = {
        id: generatedId,
        name: generatedName,
        userType: userType,
        maxDaily: userType === "Aggregator" ? "1,00,000" : userType === "Partner" ? "50,000" : "20,000",
        minTxn: "10",
        maxTxn: userType === "Aggregator" ? "20,000" : userType === "Partner" ? "5,000" : "1,000",
        creditLimit: userType === "Aggregator" ? "10,00,000" : userType === "Partner" ? "2,00,000" : "1,50,000",
        ledgerBalance: "5,00,000",
        holdBalance: "15,00,000",
        releaseBalance: "2,00,000",
        email: `contact@${generatedName.toLowerCase().replace(/[^a-z]/g, "") || "company"}.com`,
        phone: "9" + Math.floor(100000000 + Math.random() * 900000000),
        legalName: generatedName,
        pan: "ABCDE" + Math.floor(1000 + Math.random() * 9000) + "F",
        bankName: "State Bank of India",
        bankAccount: "3" + Math.floor(1000000000 + Math.random() * 9000000000),
        ifsc: "SBIN000" + Math.floor(1000 + Math.random() * 9000),
        status: "Active"
      };
      
      setLimitData(newMock);
      setSubmitted(true);
    }
  };

  const handleUpdate = () => {
    if (!limitData) return;
    
    // Trigger standard visual notification
    setToastMessage(`Limits for ${limitData.name} updated successfully!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 select-text relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-[#1e293b] text-white px-5 py-3.5 rounded-lg shadow-xl border border-gray-700/50"
          >
            <div className="bg-[#10b981] p-1.5 rounded-full text-white">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Success</span>
              <span className="text-xs text-gray-300 font-medium">{toastMessage}</span>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-white pl-4"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold text-gray-500 font-sans tracking-wide">
          Limit Management / <span className="text-gray-800 font-bold">Manage Limit</span>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="pb-2">
        <h1 className="text-[24px] font-black text-gray-900 tracking-tight leading-none font-sans">
          Limit Management
        </h1>
      </div>

      {/* Search Criteria Card */}
      <div id="search-criteria-card" className="bg-white border border-gray-200/80 rounded-lg shadow-2xs p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Type Select */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2 font-sans">
                User Type
              </label>
              <select
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value as any);
                  setSearchValue("");
                  setSubmitted(false);
                  setLimitData(null);
                }}
                className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none h-[42px]"
              >
                <option value="Merchant">Merchant</option>
                <option value="Partner">Partner</option>
                <option value="Aggregator">Aggregator</option>
              </select>
            </div>

            {/* Search User By Select */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2 font-sans">
                Search User By
              </label>
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none h-[42px]"
              >
                <option value="id">{userType} ID</option>
                <option value="name">{userType} Name/Business Legal Name</option>
              </select>
            </div>

            {/* Value input (Merchant/Partner/Aggregator ID or Name) */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2 font-sans">
                {searchBy === "id" ? `${userType} ID` : `${userType} Name`}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchBy === "id" ? `Enter ${userType} ID` : `Enter ${userType} Name`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3.5 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none h-[42px]"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {searchError && (
            <p className="text-red-600 text-xs font-semibold mt-1">{searchError}</p>
          )}

          {/* Buttons row */}
          <div className="flex justify-end items-center space-x-3.5 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-xs font-extrabold text-[#447837] hover:bg-red-50 transition-colors duration-150 rounded"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#447837] text-white text-xs font-extrabold rounded shadow-xs hover:bg-[#6c1e23] transition-colors duration-150"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Ledger & Limits Form Card */}
      {submitted && limitData && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-gray-200/80 rounded-lg shadow-2xs p-6 space-y-6"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex flex-col">
              <h2 className="text-[15px] font-black text-gray-900 tracking-tight font-sans">
                Ledger & Limits
              </h2>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                Configuring limits for {limitData.name} ({limitData.id})
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="flex items-center space-x-2 px-3.5 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span>View {userType} Details</span>
            </button>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* Max daily amount usage */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2 font-sans">
                Maximum Amount Usage Daily
              </label>
              <input
                type="text"
                value={limitData.maxDaily}
                onChange={(e) => setLimitData({ ...limitData, maxDaily: e.target.value })}
                className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
              />
            </div>

            {/* Per Transaction Limit Min (Merchant Only) */}
            {limitData.userType === "Merchant" && (
              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2 font-sans">
                  Per Transaction Limit Min
                </label>
                <input
                  type="text"
                  value={limitData.minTxn}
                  onChange={(e) => setLimitData({ ...limitData, minTxn: e.target.value })}
                  className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
                />
              </div>
            )}

            {/* Per Transaction Limit Max (Merchant Only) */}
            {limitData.userType === "Merchant" && (
              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2 font-sans">
                  Per Transaction Limit Max
                </label>
                <input
                  type="text"
                  value={limitData.maxTxn}
                  onChange={(e) => setLimitData({ ...limitData, maxTxn: e.target.value })}
                  className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
                />
              </div>
            )}



            {/* Credit Limit */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2 font-sans">
                Credit Limit
              </label>
              <input
                type="text"
                value={limitData.creditLimit}
                onChange={(e) => setLimitData({ ...limitData, creditLimit: e.target.value })}
                className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
              />
            </div>

            {/* Ledger Balance - disabled / read-only grey background */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 tracking-wider uppercase mb-2 font-sans">
                Ledger Balance
              </label>
              <input
                type="text"
                disabled
                value={limitData.ledgerBalance}
                className="w-full text-xs font-bold border border-gray-200 rounded px-3.5 py-2.5 bg-gray-50/80 text-gray-500 cursor-not-allowed select-none"
              />
            </div>

            {/* Hold Balance - disabled / read-only grey background */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 tracking-wider uppercase mb-2 font-sans">
                Hold Balance
              </label>
              <input
                type="text"
                disabled
                value={limitData.holdBalance}
                className="w-full text-xs font-bold border border-gray-200 rounded px-3.5 py-2.5 bg-gray-50/80 text-gray-500 cursor-not-allowed select-none"
              />
            </div>

            {/* Release Balance - with tooltip */}
            <div className="relative">
              <div className="flex items-center space-x-1.5 mb-2">
                <label className="block text-[11px] font-extrabold text-gray-500 tracking-wider uppercase font-sans">
                  Release Balance
                </label>
                <div className="relative inline-block">
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                  {showTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-[#1e293b] text-white text-[10px] p-2.5 rounded shadow-lg z-20 leading-relaxed font-sans font-medium text-center">
                      Maximum fund release value that can be cleared safely back into the bank settlements pipeline.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e293b]"></div>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={limitData.releaseBalance}
                onChange={(e) => setLimitData({ ...limitData, releaseBalance: e.target.value })}
                className="w-full text-xs font-semibold border border-gray-300/80 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end items-center space-x-3.5 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-xs font-extrabold text-[#447837] hover:bg-red-50 transition-colors duration-150 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-6 py-2.5 bg-[#447837] text-white text-xs font-extrabold rounded shadow-xs hover:bg-[#6c1e23] transition-colors duration-150"
            >
              Update
            </button>
          </div>
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && limitData && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="bg-[#447837] text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-red-200" />
                  <h3 className="text-base font-black tracking-tight font-sans">
                    {userType} Profile Details
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-red-100 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6">
                {/* Header Information */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-gray-900 leading-tight">
                      {limitData.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      {userType} ID: {limitData.id} • Status: <span className="text-emerald-600 font-bold">{limitData.status}</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-red-50 text-[#447837] rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
                    {limitData.userType}
                  </span>
                </div>

                {/* Info blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business & contact details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <h5 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider font-sans">
                        Business Information
                      </h5>
                    </div>
                    <div className="space-y-2 pl-7 text-xs font-semibold text-gray-700">
                      <div>
                        <span className="text-gray-400 font-normal block mb-0.5">Legal Business Name</span>
                        {limitData.legalName}
                      </div>
                      <div>
                        <span className="text-gray-400 font-normal block mb-0.5">Business PAN</span>
                        {limitData.pan}
                      </div>
                      <div>
                        <span className="text-gray-400 font-normal block mb-0.5">Contact Email</span>
                        {limitData.email}
                      </div>
                      <div>
                        <span className="text-gray-400 font-normal block mb-0.5">Contact Mobile</span>
                        +91 {limitData.phone}
                      </div>
                    </div>
                  </div>

                  {/* Bank accounts */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Landmark className="w-4 h-4 text-gray-400 shrink-0" />
                      <h5 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider font-sans">
                        Settlement Bank Account
                      </h5>
                    </div>
                    <div className="space-y-2 pl-7 text-xs font-semibold text-gray-700">
                      <div>
                        <span className="text-gray-400 font-normal block mb-0.5">Bank Name</span>
                        {limitData.bankName}
                      </div>
                      <div>
                        <span className="text-gray-400 font-normal block mb-0.5">Account Number</span>
                        <span className="font-mono">{limitData.bankAccount}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-normal block mb-0.5">IFSC Code</span>
                        <span className="font-mono uppercase">{limitData.ifsc}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-100 px-6 py-3.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded transition-colors duration-150"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
