import React, { useState, useMemo, FormEvent } from "react";
import {
  CreditCard,
  Banknote,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Landmark,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Sliders,
  Calendar,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Paperclip,
  Smartphone,
  Sparkles,
  FileText,
  AlertTriangle,
  Send,
  Lock,
  Layers,
  HelpCircle,
  Trash2
} from "lucide-react";


// =============================================================================
// BILLING MANAGEMENT VIEW (Exact match to the 8 user reference images)
// =============================================================================
export interface BillingTransaction {
  id: string;
  walletTxnId: string;
  userId: string;
  userType: "Partner" | "Merchant";
  userName: string;
  adjustmentType: "Credit" | "Debit";
  adjustmentAmount: number;
  adjustmentDate: string;
  walletId?: string;
  walletRefId?: string;
  utr?: string;
}

export function BillingManagementView({ onBack }: { onBack?: () => void }) {
  // Top Filter state
  const [dateRange, setDateRange] = useState<string>("9/1/2026 – 9/7/2026");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("MAY 2026");
  const [tempStartDate, setTempStartDate] = useState<number | null>(1);
  const [tempEndDate, setTempEndDate] = useState<number | null>(7);
  const [dateRangeWarning, setDateRangeWarning] = useState(false);

  const [userTypeFilter, setUserTypeFilter] = useState<"Partner" | "Merchant">("Partner");
  const [searchByFilter, setSearchByFilter] = useState<"Partner ID" | "Wallet ID" | "Wallet Ref ID" | "UTR">("Partner ID");
  const [searchByValue, setSearchByValue] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [appliedUserType, setAppliedUserType] = useState<"Partner" | "Merchant">("Partner");
  const [appliedSearchBy, setAppliedSearchBy] = useState<"Partner ID" | "Wallet ID" | "Wallet Ref ID" | "UTR">("Partner ID");
  const [appliedSearchVal, setAppliedSearchVal] = useState<string>("");
  const [validationToast, setValidationToast] = useState<string | null>(null);

  // Table search & pagination state
  const [tableSearchTerm, setTableSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [goToPage, setGoToPage] = useState<string>("1");

  // Modals state
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Adjustment Request Form state (Image 14)
  const [adjustmentForm, setAdjustmentForm] = useState({
    userType: "Partner",
    userId: "john_doe",
    userName: "John Doe",
    adjustmentDate: "27/09/2025",
    adjustmentType: "Debit" as "Credit" | "Debit",
    utrNumber: "2198371239861",
    adjustmentAmount: "10000",
    paymentReceiptName: "",
    remark: "",
  });

  // OTP Verification state (Image 15)
  const [otpDigits, setOtpDigits] = useState<string[]>(["9", "9", "9", "9", "9", "0"]);
  const [otpTimer, setOtpTimer] = useState<number>(30);

  // Success summary state (Image 13)
  const [successDetails, setSuccessDetails] = useState({
    amount: "₹ 10000",
    partnerId: "32043204820",
    partnerName: "Rahul",
    walletId: "23128393920",
    walletRefId: "392084293840",
    statusDescription: "NA",
    statusCode: "1",
    adjustmentType: "Debit" as "Credit" | "Debit",
  });

  // Sample transactions matching Image 12
  const [transactions, setTransactions] = useState<BillingTransaction[]>([
    {
      id: "1",
      walletTxnId: "21087373201932849",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239861",
    },
    {
      id: "2",
      walletTxnId: "21087373201932850",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239862",
    },
    {
      id: "3",
      walletTxnId: "21087373201932851",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239863",
    },
    {
      id: "4",
      walletTxnId: "21087373201932852",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239864",
    },
    {
      id: "5",
      walletTxnId: "21087373201932853",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239865",
    },
    {
      id: "6",
      walletTxnId: "21087373201932854",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239866",
    },
    {
      id: "7",
      walletTxnId: "21087373201932855",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239867",
    },
    {
      id: "8",
      walletTxnId: "21087373201932856",
      userId: "NSDL00000619",
      userType: "Partner",
      userName: "John Doe",
      adjustmentType: "Credit",
      adjustmentAmount: 100,
      adjustmentDate: "02.08.2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: "2198371239868",
    },
  ]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // User type filter
      if (userTypeFilter && txn.userType !== userTypeFilter) {
        return false;
      }
      // Top search by filter
      if (searchByValue.trim()) {
        const query = searchByValue.toLowerCase().trim();
        if (searchByFilter === "Partner ID" && !txn.userId.toLowerCase().includes(query)) return false;
        if (searchByFilter === "Wallet ID" && !(txn.walletId || "").toLowerCase().includes(query)) return false;
        if (searchByFilter === "Wallet Ref ID" && !(txn.walletRefId || "").toLowerCase().includes(query)) return false;
        if (searchByFilter === "UTR" && !(txn.utr || "").toLowerCase().includes(query)) return false;
      }
      // Table search term
      if (tableSearchTerm.trim()) {
        const q = tableSearchTerm.toLowerCase();
        const matches =
          txn.walletTxnId.toLowerCase().includes(q) ||
          txn.userId.toLowerCase().includes(q) ||
          txn.userName.toLowerCase().includes(q) ||
          txn.adjustmentType.toLowerCase().includes(q) ||
          txn.adjustmentAmount.toString().includes(q) ||
          txn.adjustmentDate.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [transactions, userTypeFilter, searchByFilter, searchByValue, tableSearchTerm]);

  // Date selection handler
  const handleSelectDay = (day: number) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(day);
      setTempEndDate(null);
    } else {
      if (day < tempStartDate) {
        setTempStartDate(day);
        setTempEndDate(null);
      } else {
        const diffDays = day - tempStartDate;
        if (diffDays > 7) {
          setDateRangeWarning(true);
          setTimeout(() => setDateRangeWarning(false), 4500);
          setTempEndDate(day);
          setDateRange(`5/${tempStartDate}/2026 – 5/${day}/2026`);
          setIsDatePickerOpen(false);
        } else {
          setDateRangeWarning(false);
          setTempEndDate(day);
          setDateRange(`5/${tempStartDate}/2026 – 5/${day}/2026`);
          setIsDatePickerOpen(false);
        }
      }
    }
  };

  // Submit Ledger Adjustment Request (Image 14 -> Image 15)
  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustmentForm.userId || !adjustmentForm.adjustmentAmount) {
      alert("Please fill in required fields.");
      return;
    }
    setIsAdjustmentModalOpen(false);
    setIsOtpModalOpen(true);
    setOtpTimer(30);
  };

  // Verify OTP (Image 15 -> Image 13)
  const handleOtpVerify = () => {
    setIsOtpModalOpen(false);
    setSuccessDetails({
      amount: `₹ ${adjustmentForm.adjustmentAmount}`,
      partnerId: "32043204820",
      partnerName: adjustmentForm.userName || "Rahul",
      walletId: "23128393920",
      walletRefId: "392084293840",
      statusDescription: "NA",
      statusCode: "1",
      adjustmentType: adjustmentForm.adjustmentType,
    });
    setIsSuccessModalOpen(true);
  };

  // Close Success Modal and push to table
  const handleSuccessClose = () => {
    const newTxn: BillingTransaction = {
      id: Date.now().toString(),
      walletTxnId: `210873${Date.now().toString().slice(-8)}`,
      userId: adjustmentForm.userId,
      userType: adjustmentForm.userType as "Partner" | "Merchant",
      userName: adjustmentForm.userName,
      adjustmentType: adjustmentForm.adjustmentType,
      adjustmentAmount: parseFloat(adjustmentForm.adjustmentAmount) || 10000,
      adjustmentDate: adjustmentForm.adjustmentDate || "27/09/2025",
      walletId: "23128393920",
      walletRefId: "392084293840",
      utr: adjustmentForm.utrNumber,
    };
    setTransactions((prev) => [newTxn, ...prev]);
    setIsSuccessModalOpen(false);
  };

  // CSV Export (Image 12)
  const handleExportCSV = () => {
    const csvHeader = "Wallet Transaction ID,User ID,User Type,User Name,Adjustment Type,Adjustment Amount,Adjustment Date\n";
    const csvRows = filteredTransactions
      .map((t) => `"${t.walletTxnId}","${t.userId}","${t.userType}","${t.userName}","${t.adjustmentType}","${t.adjustmentAmount}","${t.adjustmentDate}"`)
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `billing_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAF7] p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* 7-DAY DATE RANGE WARNING TOAST (Exact match from Image 2) */}
      {dateRangeWarning && (
        <div className="fixed top-5 right-5 z-[99999] flex items-center space-x-2.5 bg-[#EAB308] text-white px-4 py-3 rounded-md shadow-lg border border-[#CA8A04] animate-bounce">
          <AlertTriangle className="w-5 h-5 text-white shrink-0" />
          <span className="text-sm font-semibold">Date range cannot exceed 7 days</span>
          <button
            onClick={() => setDateRangeWarning(false)}
            className="ml-2 hover:bg-white/20 p-1 rounded transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Breadcrumb (Exact match from Image 12) */}
      <div className="text-xs text-gray-500 mb-3 font-medium">
        User Management / <span className="text-gray-800 font-semibold">Billing Management</span>
      </div>

      {/* Header Row (Images 1, 2, 3, 4, 12) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-900 hover:text-[#447837] transition p-1 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 font-bold" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-sans tracking-tight">
            Bill Management
          </h1>
        </div>

        {/* Adjustment Request Button (Exact match from Image 1) */}
        <button
          onClick={() => setIsAdjustmentModalOpen(true)}
          className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-4 py-2 rounded-lg text-sm bg-white shadow-2xs transition cursor-pointer"
        >
          Adjustment Request
        </button>
      </div>

      {/* Decorative Accent Underline Indicator (Yellow/Green pill bar from Image 1 & Settlement view) */}
      <div className="flex items-center space-x-1.5 mb-6">
        <div className="h-1.5 w-16 bg-[#FBBF24] rounded-full"></div>
        <div className="h-1.5 w-4 bg-[#447837] rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-[#FBBF24] rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-[#447837] rounded-full"></div>
      </div>

      {/* FILTER CONTROLS BAR (Exact match to Images 1, 2, 3, 4, 12) */}
      <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-2xs mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* 1. Date Range Input & Popover */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Date Range
            </label>
            <div
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 cursor-pointer hover:border-[#447837] focus:border-[#447837] transition"
            >
              <span className="truncate text-xs sm:text-sm font-medium">
                {dateRange || "Start date  End date"}
              </span>
              <div className="p-1 rounded hover:bg-gray-100 text-[#447837]">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {/* Datepicker Popover (Exact match to Image 1) */}
            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-gray-900 tracking-wider">
                      {selectedMonth}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedMonth(selectedMonth === "MAY 2026" ? "APRIL 2026" : "MAY 2026")}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedMonth(selectedMonth === "MAY 2026" ? "JUNE 2026" : "MAY 2026")}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400 mb-2">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {/* Empty spaces for start of month */}
                  <div className="h-8"></div>
                  <div className="h-8"></div>
                  <div className="h-8"></div>
                  <div className="h-8"></div>
                  <div className="h-8"></div>

                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isStart = tempStartDate === day;
                    const isEnd = tempEndDate === day;
                    const inRange =
                      tempStartDate &&
                      tempEndDate &&
                      day > tempStartDate &&
                      day < tempEndDate;

                    return (
                      <button
                        key={day}
                        onClick={() => handleSelectDay(day)}
                        className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition cursor-pointer text-xs ${
                          isStart || isEnd
                            ? "bg-[#447837] text-white font-bold shadow-xs"
                            : inRange
                            ? "bg-[#EBF4E9] text-[#2E5324]"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Max range: 7 days</span>
                  <button
                    onClick={() => {
                      setTempStartDate(1);
                      setTempEndDate(7);
                      setDateRange("5/1/2026 – 5/7/2026");
                      setIsDatePickerOpen(false);
                    }}
                    className="text-[#447837] font-bold hover:underline cursor-pointer"
                  >
                    Quick 7 Days
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. User Type Dropdown (Exact match to Image 3) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              User Type
            </label>
            <div className="relative">
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value as "Partner" | "Merchant")}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 font-medium focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] pr-8 cursor-pointer"
              >
                <option value="Partner">Partner</option>
                <option value="Merchant">Merchant</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Search By Dropdown (Exact match to Image 4) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Search By
            </label>
            <div className="relative">
              <select
                value={searchByFilter}
                onChange={(e) =>
                  setSearchByFilter(e.target.value as "Partner ID" | "Wallet ID" | "Wallet Ref ID" | "UTR")
                }
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 font-medium focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] pr-8 cursor-pointer"
              >
                <option value="Partner ID">Partner ID</option>
                <option value="Wallet ID">Wallet ID</option>
                <option value="Wallet Ref ID">Wallet Ref ID</option>
                <option value="UTR">UTR</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Dynamic Input & Green Theme Search Button (Exact match from Image 1 & Green Theme) */}
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {searchByFilter}
              </label>
              <input
                type="text"
                value={searchByValue}
                onChange={(e) => setSearchByValue(e.target.value)}
                placeholder="Enter Data"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
              />
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  // Triggers filter refresh
                }}
                className="px-6 py-2.5 bg-[#447837] hover:bg-[#36612B] text-white font-semibold text-sm rounded-lg transition shadow-xs cursor-pointer text-center"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY ROW: Table Search & Export to CSV (Exact match to Image 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Table Search Input with Search Icon */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            value={tableSearchTerm}
            onChange={(e) => setTableSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
          />
        </div>

        {/* Export to CSV Button in Green Theme */}
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#447837] hover:bg-[#36612B] text-white font-semibold rounded-lg text-xs transition shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* TRANSACTIONS TABLE (Exact match to Image 12) */}
      <div className="bg-white border border-gray-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#FAFDF9] border-b border-gray-200/80 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>Wallet Transaction ID</span>
                    <span className="text-gray-400 text-[9px]">▲▼</span>
                  </div>
                </th>
                <th className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>User ID</span>
                    <span className="text-gray-400 text-[9px]">▲▼</span>
                  </div>
                </th>
                <th className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>User Type</span>
                    <span className="text-gray-400 text-[9px]">▲▼</span>
                  </div>
                </th>
                <th className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>User Name</span>
                    <span className="text-gray-400 text-[9px]">▲▼</span>
                  </div>
                </th>
                <th className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>Adjustment Type</span>
                    <span className="text-gray-400 text-[9px]">▲▼</span>
                  </div>
                </th>
                <th className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>Adjustment Amount</span>
                    <span className="text-gray-400 text-[9px]">▲▼</span>
                  </div>
                </th>
                <th className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>Adjustment Date</span>
                    <span className="text-gray-400 text-[9px]">▲▼</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400 font-medium">
                    No Records Found
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, rowsPerPage).map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#F8FAF7] transition">
                    <td className="px-4 py-3.5 font-mono text-gray-900 font-medium">
                      {txn.walletTxnId}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-gray-800">
                      {txn.userId}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      {txn.userType}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {txn.userName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`font-semibold ${
                          txn.adjustmentType === "Credit" ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {txn.adjustmentType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-gray-900">
                      {txn.adjustmentAmount}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {txn.adjustmentDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM PAGINATION BAR (Exact match to Images 12 & 15) */}
        <div className="px-4 py-3.5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          {/* Left: Row per page & Go to */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Row per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-800 font-semibold focus:outline-none focus:border-[#447837]"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span>Go to</span>
              <input
                type="text"
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                className="w-10 px-2 py-1 text-center border border-gray-300 rounded text-gray-800 font-semibold focus:outline-none focus:border-[#447837]"
              />
            </div>
          </div>

          {/* Right: Page Numbers `< 1 ... 4 5 [6] 7 8 ... 50 >` */}
          <div className="flex items-center space-x-1 font-medium select-none">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-2 py-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
            >
              1
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button
              onClick={() => setCurrentPage(4)}
              className={`px-2 py-1 rounded cursor-pointer ${
                currentPage === 4 ? "border border-[#447837] text-[#447837] font-bold" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              4
            </button>
            <button
              onClick={() => setCurrentPage(5)}
              className={`px-2 py-1 rounded cursor-pointer ${
                currentPage === 5 ? "border border-[#447837] text-[#447837] font-bold" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              5
            </button>
            <button
              onClick={() => setCurrentPage(6)}
              className={`px-2 py-1 rounded cursor-pointer ${
                currentPage === 6 ? "border border-[#447837] text-[#447837] font-bold" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              6
            </button>
            <button
              onClick={() => setCurrentPage(7)}
              className={`px-2 py-1 rounded cursor-pointer ${
                currentPage === 7 ? "border border-[#447837] text-[#447837] font-bold" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              7
            </button>
            <button
              onClick={() => setCurrentPage(8)}
              className={`px-2 py-1 rounded cursor-pointer ${
                currentPage === 8 ? "border border-[#447837] text-[#447837] font-bold" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              8
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button
              onClick={() => setCurrentPage(50)}
              className="px-2 py-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
            >
              50
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(50, currentPage + 1))}
              className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: LEDGER ADJUSTMENT REQUEST (Exact match to Image 14)              */}
      {/* ========================================================================= */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
              Ledger Adjustment Request
            </h2>

            <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* User Type * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    User Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={adjustmentForm.userType}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, userType: e.target.value })}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837] pr-8 cursor-pointer"
                    >
                      <option value="Partner">Partner</option>
                      <option value="Merchant">Merchant</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* User ID * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    User ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adjustmentForm.userId}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, userId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                {/* User Name * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adjustmentForm.userName}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, userName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                {/* Adjustment Date * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Adjustment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adjustmentForm.adjustmentDate}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, adjustmentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                {/* Adjustment Type * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Adjustment Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={adjustmentForm.adjustmentType}
                      onChange={(e) =>
                        setAdjustmentForm({ ...adjustmentForm, adjustmentType: e.target.value as "Credit" | "Debit" })
                      }
                      className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837] pr-8 cursor-pointer"
                    >
                      <option value="Credit">Credit</option>
                      <option value="Debit">Debit</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* UTR Number * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    UTR Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adjustmentForm.utrNumber}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, utrNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837]"
                  />
                </div>

                {/* Adjustment Amount * (with ₹ prefix) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Adjustment Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      value={adjustmentForm.adjustmentAmount}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, adjustmentAmount: e.target.value })}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#447837]"
                    />
                  </div>
                </div>

                {/* Payment Receipt * (Upload file with paperclip) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Payment Receipt <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-2xs">
                      <Paperclip className="w-3.5 h-3.5 text-gray-500" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAdjustmentForm({ ...adjustmentForm, paymentReceiptName: file.name });
                          }
                        }}
                      />
                    </label>
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                      {adjustmentForm.paymentReceiptName || "receipt_219837123.pdf"}
                    </span>
                  </div>
                </div>

                {/* Remark with character counter 0/5000 */}
                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Remark
                    </label>
                    <span className="text-[11px] text-gray-400">
                      {adjustmentForm.remark.length}/5000
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter Remark"
                    maxLength={5000}
                    value={adjustmentForm.remark}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, remark: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#447837]"
                  />
                </div>
              </div>

              {/* Action Buttons: Cancel & Submit Request in Green Theme */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#447837] hover:bg-[#36612B] text-white font-bold text-sm rounded-lg transition shadow-xs cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: OTP VERIFICATION (Exact match to Image 15)                       */}
      {/* ========================================================================= */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center relative">
            <div className="flex items-center space-x-2 text-gray-800 font-bold text-base mb-4 text-left">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <span>OTP Verification</span>
            </div>

            <p className="text-xs text-gray-600 mb-6 text-left">
              Please enter the verification code we have sent you.
            </p>

            {/* 6-box OTP entry (Image 15) */}
            <div className="flex items-center justify-center space-x-2.5 mb-5">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newDigits = [...otpDigits];
                    newDigits[index] = e.target.value;
                    setOtpDigits(newDigits);
                  }}
                  className="w-10 h-10 text-center text-base font-bold text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] bg-white shadow-2xs"
                />
              ))}
            </div>

            {/* Countdown / Resend text */}
            <p className="text-xs text-gray-500 mb-6">
              {otpTimer > 0 ? (
                <>Resend OTP in <span className="font-semibold text-gray-700">{otpTimer} seconds</span>.</>
              ) : (
                <button
                  type="button"
                  onClick={() => setOtpTimer(30)}
                  className="text-[#447837] font-bold hover:underline cursor-pointer"
                >
                  Resend OTP now
                </button>
              )}
            </p>

            {/* Actions: Back & Verify in Green Theme */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setIsAdjustmentModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleOtpVerify}
                className="px-6 py-2 bg-[#447837] hover:bg-[#36612B] text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LEDGER DEBIT/CREDIT SUCCESS (Exact match to Image 13)            */}
      {/* ========================================================================= */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm sm:max-w-md w-full p-6 text-center relative border border-gray-100">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-6">
              Ledger Successfully {successDetails.adjustmentType === "Credit" ? "Credited" : "Debited"}
            </h2>

            {/* Big Green Circle with Checkmark (Exact match to Image 13) */}
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>

            {/* Details Card (Image 13) */}
            <div className="border border-gray-200/90 rounded-xl p-4 text-xs space-y-2.5 text-left mb-6 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Amount</span>
                <span className="font-bold text-gray-900">{successDetails.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Partner ID</span>
                <span className="font-mono text-gray-800 font-medium">{successDetails.partnerId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Partner Name</span>
                <span className="font-medium text-gray-900">{successDetails.partnerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Wallet ID</span>
                <span className="font-mono text-gray-800 font-medium">{successDetails.walletId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Wallet Ref ID</span>
                <span className="font-mono text-gray-800 font-medium">{successDetails.walletRefId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Status Description</span>
                <span className="font-medium text-gray-700">{successDetails.statusDescription}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Status Code</span>
                <span className="font-bold text-gray-900">{successDetails.statusCode}</span>
              </div>
            </div>

            {/* Bright Green Close Button (Image 13) */}
            <button
              type="button"
              onClick={handleSuccessClose}
              className="w-full py-2.5 px-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm rounded-lg transition shadow-xs cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
