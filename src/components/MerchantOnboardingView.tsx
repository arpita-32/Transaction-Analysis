import { useState, useRef, useEffect } from "react";
import { CreateMerchantWizard } from "./CreateMerchantWizard";
import { CheckerMerchantReviewView } from "./CheckerMerchantReviewView";
import { DraftMerchantView } from "./DraftMerchantView";
import {
  ArrowLeft,
  UploadCloud,
  ListChecks,
  Download,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Edit3,
  Trash2,
  Eye,
  Check,
  XCircle,
  Plus,
  Send,
  Filter
} from "lucide-react";

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
  onClear: () => void;
}

function DateRangePicker({ fromDate, toDate, onChange, onClear }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (fromDate) {
      const d = new Date(fromDate + "T00:00:00");
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  });
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayNum: number) => {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(dayNum).padStart(2, "0");
    const selectedIso = `${year}-${formattedMonth}-${formattedDay}`;

    if (!fromDate || (fromDate && toDate)) {
      onChange(selectedIso, "");
    } else {
      if (selectedIso >= fromDate) {
        onChange(fromDate, selectedIso);
        setIsOpen(false);
      } else {
        onChange(selectedIso, "");
      }
    }
  };

  const setPresetRange = (days: number) => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - days);

    const pad = (n: number) => String(n).padStart(2, "0");
    const toIso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const fromIso = `${past.getFullYear()}-${pad(past.getMonth() + 1)}-${pad(past.getDate())}`;

    onChange(fromIso, toIso);
    setViewDate(today);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let displayLabel = "Select Date Range (Start Date – End Date)";
  if (fromDate && toDate) {
    displayLabel = `${formatDateDisplay(fromDate)} – ${formatDateDisplay(toDate)}`;
  } else if (fromDate) {
    displayLabel = `${formatDateDisplay(fromDate)} – Select End Date`;
  }

  let diffDays = 0;
  if (fromDate && toDate) {
    const s = new Date(fromDate + "T00:00:00");
    const e = new Date(toDate + "T00:00:00");
    diffDays = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border border-gray-300 hover:border-[#447837] rounded-xl px-3.5 py-2.5 bg-white cursor-pointer transition shadow-2xs ${
          isOpen ? "border-[#447837] ring-1 ring-[#447837]" : ""
        }`}
      >
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <Calendar className="w-4 h-4 text-[#447837] shrink-0" />
          <span className={`text-xs font-semibold truncate ${fromDate ? "text-gray-900" : "text-gray-400"}`}>
            {displayLabel}
          </span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition"
              title="Clear date selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Single Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 w-76 sm:w-80 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-bold text-gray-900 font-sans tracking-wide">
              {monthNames[month]} {year}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Presets */}
          <div className="flex items-center justify-between gap-1 mb-3">
            <button
              type="button"
              onClick={() => setPresetRange(15)}
              className="text-[10px] font-bold px-2 py-1 bg-[#EBF4E9] text-[#447837] hover:bg-[#447837] hover:text-white rounded-md transition border border-[#C8E2BF]"
            >
              Last 15 Days
            </button>
            <button
              type="button"
              onClick={() => setPresetRange(30)}
              className="text-[10px] font-bold px-2 py-1 bg-[#EBF4E9] text-[#447837] hover:bg-[#447837] hover:text-white rounded-md transition border border-[#C8E2BF]"
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md transition"
            >
              Clear
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName, idx) => (
              <span key={idx} className="text-[10px] font-bold text-gray-400 uppercase py-1">
                {dayName}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold">
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-7" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const padMonth = String(month + 1).padStart(2, "0");
              const padDay = String(dayNum).padStart(2, "0");
              const dateIso = `${year}-${padMonth}-${padDay}`;

              const isStart = dateIso === fromDate;
              const isEnd = dateIso === toDate;

              let isInRange = false;
              if (fromDate && toDate) {
                isInRange = dateIso > fromDate && dateIso < toDate;
              } else if (fromDate && !toDate && hoverDate && hoverDate >= fromDate) {
                isInRange = dateIso > fromDate && dateIso <= hoverDate;
              }

              return (
                <div
                  key={dayNum}
                  onMouseEnter={() => setHoverDate(dateIso)}
                  onMouseLeave={() => setHoverDate(null)}
                  onClick={() => handleDayClick(dayNum)}
                  className={`h-7 flex items-center justify-center cursor-pointer transition relative text-xs ${
                    isStart || isEnd
                      ? "bg-[#447837] text-white font-bold rounded-lg z-10 shadow-xs"
                      : isInRange
                      ? "bg-[#EBF4E9] text-[#447837] font-semibold"
                      : "text-gray-700 hover:bg-gray-100 rounded-lg"
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500">
            {fromDate && !toDate && (
              <span className="text-[#447837] font-semibold">Click end date...</span>
            )}
            {fromDate && toDate && (
              <span className="text-[#447837] font-semibold">
                {diffDays} {diffDays === 1 ? "day" : "days"} selected
              </span>
            )}
            {!fromDate && !toDate && (
              <span>Select start date</span>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[#447837] hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MerchantOnboardingViewProps {
  currentRole?: string;
  activeSubView?: string;
  onBack?: () => void;
}

interface ReviewMerchantRecord {
  mid: string;
  businessLegalName: string;
  brandName: string;
  aggregator: string;
  category: "UPI" | "UPI Cashpoint";
  submittedDate: string;
  kycStatus: "Verified" | "Pending" | "Failed";
  reviewStatus: "Pending Review" | "Under Verification" | "Approved" | "Action Required";
  submittedBy: string;
  documentsCount: number;
}

const initialReviewMerchants: ReviewMerchantRecord[] = [
  {
    mid: "MID90218491",
    businessLegalName: "Apex Retailers Pvt Ltd",
    brandName: "Apex Supermart",
    aggregator: "PayPro Aggregator",
    category: "UPI",
    submittedDate: "2026-07-28 14:32",
    kycStatus: "Verified",
    reviewStatus: "Pending Review",
    submittedBy: "partner_maker",
    documentsCount: 4
  },
  {
    mid: "MID90218492",
    businessLegalName: "Zenith Agro Supplies",
    brandName: "Zenith Fresh",
    aggregator: "FastTrack Pay",
    category: "UPI Cashpoint",
    submittedDate: "2026-07-27 11:15",
    kycStatus: "Pending",
    reviewStatus: "Under Verification",
    submittedBy: "partner_user1",
    documentsCount: 3
  },
  {
    mid: "MID90218493",
    businessLegalName: "Nexus Electronics LLP",
    brandName: "Nexus Digital Hub",
    aggregator: "FinLink Solutions",
    category: "UPI",
    submittedDate: "2026-07-26 16:45",
    kycStatus: "Verified",
    reviewStatus: "Approved",
    submittedBy: "partner_maker",
    documentsCount: 5
  },
  {
    mid: "MID90218494",
    businessLegalName: "Sunrise Pharmacy Pvt Ltd",
    brandName: "Sunrise Meds",
    aggregator: "SwiftSettle Services",
    category: "UPI",
    submittedDate: "2026-07-25 09:20",
    kycStatus: "Failed",
    reviewStatus: "Action Required",
    submittedBy: "partner_user2",
    documentsCount: 2
  }
];

interface DraftMerchantRecord {
  draftId: string;
  businessLegalName: string;
  brandName: string;
  aggregator: string;
  category: "UPI" | "UPI Cashpoint";
  stepCompleted: string;
  progressPercent: number;
  lastUpdated: string;
}

const initialDraftMerchants: DraftMerchantRecord[] = [
  {
    draftId: "DFT-2026-081",
    businessLegalName: "Ocean Breeze Hospitality",
    brandName: "Breeze Cafe",
    aggregator: "PayPro Aggregator",
    category: "UPI",
    stepCompleted: "Step 2 of 4: Bank Details Pending",
    progressPercent: 50,
    lastUpdated: "2026-07-28 18:20"
  },
  {
    draftId: "DFT-2026-082",
    businessLegalName: "Urban Style Apparels",
    brandName: "Urban Trendz",
    aggregator: "FastTrack Pay",
    category: "UPI Cashpoint",
    stepCompleted: "Step 3 of 4: Document Upload Pending",
    progressPercent: 75,
    lastUpdated: "2026-07-27 13:40"
  },
  {
    draftId: "DFT-2026-083",
    businessLegalName: "Green Earth Organics",
    brandName: "GreenBasket",
    aggregator: "FinLink Solutions",
    category: "UPI",
    stepCompleted: "Step 1 of 4: Basic Profile Incomplete",
    progressPercent: 25,
    lastUpdated: "2026-07-25 10:12"
  }
];

interface BatchRecord {
  batchId: string;
  aggregatorName: string;
  totalMerchants: number;
  successCount: number;
  failedCount: number;
  status: "Completed" | "Processing" | "Failed";
  uploadDate: string;
  uploadedBy: string;
}

interface MerchantDetailRecord {
  mid: string;
  tid: string;
  batchId?: string;
  businessType: string;
  businessLegalName: string;
  brandName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: string;
  long: string;
  mcc: string;
  merchantName: string;
  emailId: string;
  mobileNumber: string;
  panCard: string;
  accountType: string;
  ifscCode: string;
  bankName: string;
  bankAccountNumber: string;
  branchName: string;
  vpa: string;
  status: "Active" | "Pending" | "Rejected";
  onboardingDate: string;
}

const mockBatches: BatchRecord[] = [
  {
    batchId: "BATCH_TA_9821",
    aggregatorName: "KapoorPay (KAPAG1234K)",
    totalMerchants: 45,
    successCount: 45,
    failedCount: 0,
    status: "Completed",
    uploadDate: "28/07/2026 04:30 PM",
    uploadedBy: "ta_admin"
  },
  {
    batchId: "BATCH_TA_9820",
    aggregatorName: "FastPay Solutions",
    totalMerchants: 120,
    successCount: 118,
    failedCount: 2,
    status: "Completed",
    uploadDate: "27/07/2026 02:15 PM",
    uploadedBy: "ta_admin"
  },
  {
    batchId: "BATCH_TA_9819",
    aggregatorName: "Khatabook Pay Aggregator",
    totalMerchants: 30,
    successCount: 30,
    failedCount: 0,
    status: "Completed",
    uploadDate: "25/07/2026 11:00 AM",
    uploadedBy: "admin_maker_01"
  }
];

const categoryAggregatorsList: Record<"UPI" | "UPI Cashpoint", string[]> = {
  "UPI": ["Khatabook", "Airpay", "Mpurse", "Oxymoney"],
  "UPI Cashpoint": ["Spicemoney", "Paypoint", "Consisty"]
};

const mockMerchantDetailsList: MerchantDetailRecord[] = [
  {
    mid: "MID987654101",
    tid: "TID0012981",
    businessType: "PRIVATE_LIMITED",
    businessLegalName: "Airpay Retail Mart Pvt Ltd",
    brandName: "Airpay Superstore",
    address: "Shop 12, BKC Complex, Bandra East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400051",
    lat: "19.0760",
    long: "72.8777",
    mcc: "5411",
    merchantName: "Rajesh Kumar",
    emailId: "rajesh.store@airpay.in",
    mobileNumber: "9876543210",
    panCard: "ABCDE1234F",
    accountType: "Current",
    ifscCode: "HDFC0000123",
    bankName: "HDFC Bank",
    bankAccountNumber: "918273645012",
    branchName: "BKC Branch",
    vpa: "rajeshstore@airpay",
    status: "Active",
    onboardingDate: "2026-07-28"
  },
  {
    mid: "MID987654102",
    tid: "TID0012982",
    businessType: "PROPRIETORSHIP",
    businessLegalName: "Anand Traders (Oxymoney)",
    brandName: "Oxymoney Retail",
    address: "104 MG Road, Brigade Junction",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    lat: "12.9716",
    long: "77.5946",
    mcc: "5311",
    merchantName: "Anand Sharma",
    emailId: "anand.traders@oxymoney.com",
    mobileNumber: "9876543211",
    panCard: "FGHIJ5678K",
    accountType: "Savings",
    ifscCode: "SBIN0000456",
    bankName: "State Bank of India",
    bankAccountNumber: "918273645013",
    branchName: "MG Road Branch",
    vpa: "anandtraders@oxymoney",
    status: "Active",
    onboardingDate: "2026-07-28"
  },
  {
    mid: "MID987654103",
    tid: "TID0012983",
    businessType: "PARTNERSHIP",
    businessLegalName: "Khatabook Digital Retails",
    brandName: "KhataPay Express",
    address: "Plot 45, Sector 18",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122008",
    lat: "28.4595",
    long: "77.0266",
    mcc: "5999",
    merchantName: "Vikram Khanna",
    emailId: "contact@khatapay.in",
    mobileNumber: "9811223344",
    panCard: "KLMNO9012P",
    accountType: "Current",
    ifscCode: "ICIC0001122",
    bankName: "ICICI Bank",
    bankAccountNumber: "554433221100",
    branchName: "Cyber City Branch",
    vpa: "khatapay@upi",
    status: "Active",
    onboardingDate: "2026-07-25"
  },
  {
    mid: "MID987654104",
    tid: "TID0012984",
    businessType: "LLP",
    businessLegalName: "Mpurse Digital Payments LLP",
    brandName: "Mpurse Pay Point",
    address: "A-12, Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    lat: "28.6280",
    long: "77.3649",
    mcc: "5399",
    merchantName: "Rohan Verma",
    emailId: "rohan@mpurse.in",
    mobileNumber: "9871122334",
    panCard: "MNOPQ1234R",
    accountType: "Current",
    ifscCode: "UTIB0000123",
    bankName: "Axis Bank",
    bankAccountNumber: "998877665544",
    branchName: "Noida Sector 62",
    vpa: "rohanstore@mpurse",
    status: "Active",
    onboardingDate: "2026-07-26"
  },
  {
    mid: "MID987654105",
    tid: "TID0012985",
    businessType: "PROPRIETORSHIP",
    businessLegalName: "Spicemoney Cashpoint Hub",
    brandName: "Spicemoney Kendra",
    address: "Main Market, Near Bus Stand",
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    lat: "25.5941",
    long: "85.1376",
    mcc: "6012",
    merchantName: "Sanjay Yadav",
    emailId: "sanjay.kendra@spicemoney.com",
    mobileNumber: "9431012345",
    panCard: "PQRST5678U",
    accountType: "Savings",
    ifscCode: "PUNB0102000",
    bankName: "Punjab National Bank",
    bankAccountNumber: "102000150023",
    branchName: "Patna Main",
    vpa: "spicemoney.sanjay@upi",
    status: "Active",
    onboardingDate: "2026-07-27"
  },
  {
    mid: "MID987654106",
    tid: "TID0012986",
    businessType: "PRIVATE_LIMITED",
    businessLegalName: "Paypoint India Services Pvt Ltd",
    brandName: "Paypoint Cash Express",
    address: "12/A Ring Road",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
    lat: "22.7196",
    long: "75.8577",
    mcc: "6012",
    merchantName: "Amitabh Joshi",
    emailId: "amitabh@paypoint.co.in",
    mobileNumber: "9826011223",
    panCard: "UVWXY9012Z",
    accountType: "Current",
    ifscCode: "BARB0INDORE",
    bankName: "Bank of Baroda",
    bankAccountNumber: "445566778899",
    branchName: "Ring Road Branch",
    vpa: "paypoint.indore@upi",
    status: "Active",
    onboardingDate: "2026-07-28"
  },
  {
    mid: "MID987654107",
    tid: "TID0012987",
    businessType: "PARTNERSHIP",
    businessLegalName: "Consisty Financial Systems",
    brandName: "Consisty Cashpoint",
    address: "45 Commercial Street",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
    lat: "22.5726",
    long: "88.3639",
    mcc: "6012",
    merchantName: "Subhash Banerjee",
    emailId: "subhash@consisty.in",
    mobileNumber: "9830012345",
    panCard: "ABCDE5678Z",
    accountType: "Current",
    ifscCode: "UBIN0530018",
    bankName: "Union Bank of India",
    bankAccountNumber: "300181010045",
    branchName: "Dalhousie Branch",
    vpa: "consisty.cash@upi",
    status: "Active",
    onboardingDate: "2026-07-28"
  }
];

export function MerchantOnboardingView({ currentRole, activeSubView, onBack }: MerchantOnboardingViewProps) {
  const [subMode, setSubMode] = useState<"menu" | "upload" | "view_details" | "review" | "drafts" | "create_merchant">(
    activeSubView === "CreateMerchant" || activeSubView === "" || (currentRole === "Partner" && !activeSubView)
      ? "create_merchant"
      : activeSubView === "MerchantReview"
      ? "review"
      : activeSubView === "DraftMerchant"
      ? "drafts"
      : activeSubView === "MerchantInfo" || activeSubView === "view_details"
      ? "view_details"
      : currentRole === "Partner"
      ? "create_merchant"
      : "menu"
  );

  // Review & Drafts State
  const [reviewMerchants, setReviewMerchants] = useState<ReviewMerchantRecord[]>(initialReviewMerchants);
  const [draftMerchants, setDraftMerchants] = useState<DraftMerchantRecord[]>(initialDraftMerchants);
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>("");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>("All");
  const [draftSearchQuery, setDraftSearchQuery] = useState<string>("");
  const [selectedReviewMerchant, setSelectedReviewMerchant] = useState<ReviewMerchantRecord | null>(null);
  const [reviewActionToast, setReviewActionToast] = useState<string>("");
  const [preselectedReviewId, setPreselectedReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (activeSubView === "CreateMerchant" || activeSubView === "") {
      setSubMode("create_merchant");
    } else if (activeSubView === "MerchantReview") {
      setSubMode("review");
    } else if (activeSubView === "DraftMerchant") {
      setSubMode("drafts");
    } else if (activeSubView === "MerchantInfo" || activeSubView === "view_details") {
      setSubMode("view_details");
    }
  }, [activeSubView]);

  // Upload State
  const [uploadCategory, setUploadCategory] = useState<"" | "UPI" | "UPI Cashpoint">("");
  const [selectedAggregator, setSelectedAggregator] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [batches, setBatches] = useState<BatchRecord[]>(mockBatches);

  // View Details Input State
  const [viewCategory, setViewCategory] = useState<"" | "UPI" | "UPI Cashpoint">("");
  const [aggregatorInput, setAggregatorInput] = useState<string>("");
  const [selectedAggregatorName, setSelectedAggregatorName] = useState<string>("");
  const [isAggregatorDropdownOpen, setIsAggregatorDropdownOpen] = useState<boolean>(false);
  const [reportType, setReportType] = useState<"Latest" | "Previous">("Latest");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  // Submitted Details State
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [submittedCategory, setSubmittedCategory] = useState<"" | "UPI" | "UPI Cashpoint">("");
  const [submittedAggregator, setSubmittedAggregator] = useState<string>("");
  const [submittedReportType, setSubmittedReportType] = useState<"Latest" | "Previous">("Latest");
  const [submittedFromDate, setSubmittedFromDate] = useState<string>("");
  const [submittedToDate, setSubmittedToDate] = useState<string>("");
  const [tableSearchQuery, setTableSearchQuery] = useState<string>("");

  const aggregatorWrapperRef = useRef<HTMLDivElement>(null);

  // Close Aggregator Dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        aggregatorWrapperRef.current &&
        !aggregatorWrapperRef.current.contains(event.target as Node)
      ) {
        setIsAggregatorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadSampleFile = () => {
    let headers = "";
    let row1 = "";
    let row2 = "";
    let fileName = "Bulk_merchant_onboarding.csv";

    if (uploadCategory === "UPI Cashpoint") {
      headers =
        "Business Type,Business Legal Name,Brand Name,Address,City,State,Pincode,Lat,Long,MCC,Merchant Name,Email Id,Mobile Number,PAN Card,Account type,IFSC Code,Bank name,Bank account number,Branch Name,VPA,Bank Code,Nature of Business,Store Id,KYC Document Type,KYC Document Number,Maximum Amount Usage Daily Limit,Per Transaction Limit Maximum,Per Transaction Limit Minimum,Plan Id,Request Type,Role Id,User Type,Username";
      row1 =
        "PRIVATE,iserveu QA,iservu QA,Bhubaneswar,bhubaneswar,odisha,110010,21.5734,68.3551,6013,Kapil,qatestbc555@yopmail.com,7204440141,ABFCA2026D,Current,UTIB0000001,Axis Bank,917012345678901,,bciduat0000001.qacwbc@ta,tamacw,Retail,STORE001,PAN Card,ABECA2026D,100000,5000,1,PLAN001,CREATE,5,TRANSACTIONAL,qamerchantuat";
      row2 =
        "PRIVATE,BMW,BMW,Bhubaneswar,bhubaneswar,odisha,759001,21.5739,68.3552,6014,Ramshree,ramshree123@yopmail.com,9437682851,CVGHA2036D,Current,UTIB0000002,Axis Bank,917012345678901,,bciduat0000001.qacwbc@ta,tamacw,Retail,STORE002,PAN Card,CVGHA2036D,100000,5000,1,PLAN002,CREATE,6,TRANSACTIONAL,qamerchantuat";
      fileName = "Bulk_merchant_onboarding_UPI_Cashpoint.csv";
    } else {
      headers =
        "Business Type,Business Legal Name,Brand Name,Address,City,State,Pincode,Lat,Long,MCC,Merchant Name,Email Id,Mobile Number,PAN Card,Account type,IFSC Code,Bank name,Bank account number,Branch Name,VPA";
      row1 =
        'PRIVATE_LIMITED,Rajesh Supermarket Pvt Ltd,Rajesh Mart,"Shop 12, BKC Complex",Mumbai,Maharashtra,400051,19.0760,72.8777,5411,Rajesh Kumar,rajesh.store@gmail.com,9876543210,ABCDE1234F,Current,HDFC0000123,HDFC Bank,918273645012,BKC Branch,rajeshstore@upi';
      row2 =
        'PROPRIETORSHIP,Anand Traders,Anand Store,"104 MG Road",Bengaluru,Karnataka,560001,12.9716,77.5946,5311,Anand Sharma,anand.traders@yahoo.com,9876543211,FGHIJ5678K,Savings,SBIN0000456,State Bank of India,918273645013,MG Road Branch,anandtraders@upi';
      fileName = "Bulk_merchant_onboarding_UPI.csv";
    }

    const csvContent = `${headers}\n${row1}\n${row2}\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUploadSubmit = () => {
    if (!uploadedFileName) return;

    const newBatch: BatchRecord = {
      batchId: `BATCH_TA_${Math.floor(1000 + Math.random() * 9000)}`,
      aggregatorName: `${selectedAggregator} (${uploadCategory})`,
      totalMerchants: 25,
      successCount: 25,
      failedCount: 0,
      status: "Completed",
      uploadDate: new Date().toLocaleString(),
      uploadedBy: "ta_admin"
    };

    setBatches([newBatch, ...batches]);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setSubMode("view_details");
      setUploadedFileName("");
    }, 2000);
  };

  // Validate date range and submit view details form
  const handleViewSubmit = () => {
    if (!viewCategory) {
      setValidationError("Please select an Onboarding Type first.");
      return;
    }

    if (!aggregatorInput.trim()) {
      setValidationError("Please select or type an Aggregator name.");
      return;
    }

    if (reportType === "Previous") {
      if (!fromDate || !toDate) {
        setValidationError("Please select both From Date and To Date for Previous report.");
        return;
      }
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setValidationError("Invalid date selection.");
        return;
      }
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        setValidationError("To Date cannot be earlier than From Date.");
        return;
      }

      if (diffDays < 15) {
        setValidationError(
          `Selection error: Please select a date range of minimum 15 days (Currently selected: ${diffDays} ${
            diffDays === 1 ? "day" : "days"
          }).`
        );
        return;
      }
    }

    setValidationError("");
    setSubmittedCategory(viewCategory);
    setSubmittedAggregator(aggregatorInput.trim());
    setSubmittedReportType(reportType);
    setSubmittedFromDate(fromDate);
    setSubmittedToDate(toDate);
    setHasSubmitted(true);
  };

  // Filter aggregators based on category and query
  const matchingAggregators = (viewCategory && categoryAggregatorsList[viewCategory] ? categoryAggregatorsList[viewCategory] : []).filter((a) =>
    a.toLowerCase().includes(aggregatorInput.toLowerCase())
  );

  // Helper to highlight matching characters in yellow (matches screenshot)
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
    return (
      <>
        {before}
        <span className="bg-amber-200 text-gray-950 font-semibold rounded-xs px-0.5">
          {match}
        </span>
        {after}
      </>
    );
  };

  // Filter Merchant Details
  const filteredMerchants = mockMerchantDetailsList.filter((m) => {
    const matchesQuery =
      tableSearchQuery === "" ||
      m.mid.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      m.tid.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      m.merchantName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      m.businessLegalName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      m.mobileNumber.includes(tableSearchQuery);

    return matchesQuery;
  });

  if (subMode === "create_merchant") {
    return (
      <CreateMerchantWizard
        onBack={() => {
          if (onBack) onBack();
          else setSubMode("menu");
        }}
        onViewInReview={(mid) => {
          setPreselectedReviewId(mid);
          setSubMode("review");
        }}
        onSaveDraft={(draftData) => {
          const newDraft: DraftMerchantRecord = {
            draftId: `DFT-2026-${Math.floor(100 + Math.random() * 900)}`,
            businessLegalName: draftData.businessInfo?.businessLegalName || "Draft Merchant Application",
            brandName: draftData.businessInfo?.brandName || "New Merchant",
            aggregator: "Partner Portal",
            category: draftData.productInfo?.productType === "UPI Cashpoint" ? "UPI Cashpoint" : "UPI",
            stepCompleted: `Step ${draftData.step} of 8: In Progress`,
            progressPercent: Math.round((draftData.step / 8) * 100),
            lastUpdated: new Date().toLocaleString()
          };
          setDraftMerchants([newDraft, ...draftMerchants]);
        }}
        onSubmitSuccess={(merchantData) => {
          setReviewMerchants([merchantData, ...reviewMerchants]);
        }}
      />
    );
  }

  if (subMode === "review") {
    return (
      <CheckerMerchantReviewView
        currentRole={currentRole}
        preselectedMerchantId={preselectedReviewId}
        onBack={() => {
          setPreselectedReviewId(null);
          if (onBack) onBack();
          else setSubMode("menu");
        }}
      />
    );
  }

  if (subMode === "drafts") {
    return (
      <DraftMerchantView
        onBack={() => {
          if (onBack) onBack();
          else setSubMode("create_merchant");
        }}
        onNavigateToCreate={() => setSubMode("create_merchant")}
        onResumeDraft={() => {
          setSubMode("create_merchant");
        }}
      />
    );
  }

  return (
    <div className="space-y-6 py-2 select-none">
      {/* SUCCESS TOAST */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[100000] bg-emerald-700 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>Bulk Merchants onboarded successfully! Batch created.</span>
        </div>
      )}

      {/* HEADER SECTION (Matches Screenshot) */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            {subMode !== "menu" ? (
              <button
                type="button"
                onClick={() => setSubMode("menu")}
                className="p-1 rounded-full hover:bg-gray-200/60 transition cursor-pointer"
                title="Back to Bulk Onboarding"
              >
                <ArrowLeft className="w-5 h-5 text-gray-800 stroke-[2.5]" />
              </button>
            ) : onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-1 rounded-full hover:bg-gray-200/60 transition cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-800 stroke-[2.5]" />
              </button>
            ) : (
              <ArrowLeft className="w-5 h-5 text-gray-800 stroke-[2.5]" />
            )}
            <h1 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
              {subMode === "menu"
                ? "Bulk Onboarding"
                : subMode === "upload"
                ? "Upload / Create Merchants"
                : subMode === "review"
                ? "Merchant Review"
                : subMode === "drafts"
                ? "Draft Merchant Applications"
                : "View Merchant Details"}
            </h1>
          </div>
          {/* Green Accent Underline Bar */}
          <div className="w-[126px] h-[5px] bg-[#447837] rounded-full mt-2 ml-8"></div>
        </div>
      </div>

      {/* MODE 1: MAIN BULK ONBOARDING CARDS */}
      {subMode === "menu" && (
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CARD 1: Upload Merchants */}
            <div
              onClick={() => {
                setSubMode("upload");
                setUploadCategory("");
                setSelectedAggregator("");
                setUploadedFileName("");
              }}
              className="bg-white border border-gray-200/90 rounded-2xl p-12 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:border-[#447837]/40 transition-all duration-200 cursor-pointer group"
            >
              <div className="w-20 h-20 bg-[#EBF4E9] rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                <UploadCloud className="w-10 h-10 text-[#447837] stroke-[2.2]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 font-sans group-hover:text-[#447837] transition-colors">
                Upload Merchants
              </h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[260px]">
                Upload an excel sheet to bulk onboard merchants aggregator-wise
              </p>
            </div>

            {/* CARD 2: View Merchant Details */}
            <div
              onClick={() => {
                setSubMode("view_details");
                setViewCategory("");
                setAggregatorInput("");
                setSelectedAggregatorName("");
                setValidationError("");
                setHasSubmitted(false);
              }}
              className="bg-white border border-gray-200/90 rounded-2xl p-12 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:border-[#447837]/40 transition-all duration-200 cursor-pointer group"
            >
              <div className="w-20 h-20 bg-[#EBF4E9] rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                <ListChecks className="w-10 h-10 text-[#447837] stroke-[2.2]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 font-sans group-hover:text-[#447837] transition-colors">
                View Merchant Details
              </h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[260px]">
                View uploaded batches, merchant details, and onboarding status
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: UPLOAD MERCHANTS SCREEN */}
      {subMode === "upload" && (
        <div className="py-4 space-y-6">
          <div className="border border-gray-200/90 bg-white rounded-2xl p-10 flex flex-col items-center justify-center max-w-2xl mx-auto shadow-2xs">
            {/* Onboarding Type & Aggregator Configuration */}
            <div className="w-full max-w-xl bg-gray-50/80 border border-gray-200 rounded-xl p-5 mb-6 space-y-4 shadow-2xs">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Select Onboarding Configuration
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Onboarding Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={uploadCategory}
                      onChange={(e) => {
                        const newType = e.target.value as "" | "UPI" | "UPI Cashpoint";
                        setUploadCategory(newType);
                        setSelectedAggregator("");
                      }}
                      className="w-full text-xs font-semibold border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white text-gray-800 focus:border-[#447837] focus:ring-1 focus:ring-[#447837] focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select Onboarding Type</option>
                      <option value="UPI">UPI</option>
                      <option value="UPI Cashpoint">UPI Cashpoint</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Aggregator <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedAggregator}
                      disabled={!uploadCategory}
                      onChange={(e) => setSelectedAggregator(e.target.value)}
                      className={`w-full text-xs font-semibold border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white text-gray-800 focus:border-[#447837] focus:ring-1 focus:ring-[#447837] focus:outline-none appearance-none ${
                        !uploadCategory ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <option value="">
                        {!uploadCategory ? "Select Onboarding Type first" : "Select Aggregator"}
                      </option>
                      {uploadCategory &&
                        categoryAggregatorsList[uploadCategory]?.map((agg) => (
                          <option key={agg} value={agg}>{agg}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Outer Box containing Excel Graphic */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setUploadedFileName(e.dataTransfer.files[0].name);
                }
              }}
              className={`w-full max-w-xl border ${
                isDragging ? "border-[#447837] bg-[#EBF4E9]/30" : "border-gray-300"
              } rounded-xl p-10 flex flex-col items-center justify-center bg-white transition-all mb-6`}
            >
              {/* Excel Icon Frame */}
              <div className="w-48 h-32 bg-[#EBF4E9] border border-[#C8E2BF] rounded-md flex items-center justify-center relative shadow-2xs">
                <div className="absolute top-0 right-0 w-6 h-6 bg-[#C8E2BF] rounded-bl-sm"></div>
                <div className="w-14 h-16 bg-[#447837] rounded flex items-center justify-center shadow-md">
                  <span className="text-white text-3xl font-extrabold font-sans select-none">
                    X
                  </span>
                </div>
              </div>
            </div>

            <input
              type="file"
              id="bulk-merchant-upload-input"
              accept=".csv, .xlsx, .xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedFileName(e.target.files[0].name);
                }
              }}
            />

            <div className="flex items-center space-x-3 mb-4">
              <label
                htmlFor="bulk-merchant-upload-input"
                className="px-6 py-2 bg-[#447837] hover:bg-[#35622A] text-white text-xs font-semibold rounded cursor-pointer transition shadow-2xs"
              >
                Browse
              </label>
              <button
                type="button"
                onClick={() => setUploadedFileName("")}
                className="px-6 py-2 bg-white border border-[#447837] text-[#447837] hover:bg-[#EBF4E9] text-xs font-semibold rounded transition cursor-pointer"
              >
                Reset
              </button>
            </div>

            {uploadedFileName && (
              <div className="mb-4 text-xs font-semibold text-[#447837] bg-[#EBF4E9] border border-[#C8E2BF] px-4 py-1.5 rounded-md flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-[#447837]" />
                <span>Selected: {uploadedFileName}</span>
                <X
                  className="w-4 h-4 cursor-pointer hover:text-red-700 ml-2"
                  onClick={() => setUploadedFileName("")}
                />
              </div>
            )}

            <p className="text-xs text-[#8492A6] text-center mb-6 font-normal">
              Please upload only Excel/CSV File (Bulk_merchant_onboarding.xlsx)*
            </p>

            <button
              type="button"
              onClick={handleDownloadSampleFile}
              className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-white shrink-0" />
              <span>Download Sample File</span>
            </button>
          </div>

          <div className="flex items-center justify-end space-x-3 max-w-2xl mx-auto">
            <button
              type="button"
              disabled={!uploadedFileName || !uploadCategory || !selectedAggregator}
              onClick={handleUploadSubmit}
              className={`px-6 py-2 text-white text-xs font-semibold rounded transition shadow-2xs ${
                uploadedFileName && uploadCategory && selectedAggregator
                  ? "bg-[#447837] hover:bg-[#35622A] cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => {
                setSubMode("menu");
                setUploadedFileName("");
              }}
              className="px-5 py-2 bg-white border border-[#447837] text-[#447837] hover:bg-[#EBF4E9] text-xs font-semibold rounded cursor-pointer transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: VIEW MERCHANT DETAILS */}
      {subMode === "view_details" && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
          {/* Top Filter Bar with Custom Aggregator Autocomplete, Report Type, Date Range & Submit Button */}
          <div className="border-b border-gray-100 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* ONBOARDING TYPE SELECTOR */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Onboarding Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={viewCategory}
                    onChange={(e) => {
                      const newType = e.target.value as "" | "UPI" | "UPI Cashpoint";
                      setViewCategory(newType);
                      setAggregatorInput("");
                      setSelectedAggregatorName("");
                      setValidationError("");
                    }}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white text-gray-800 focus:border-[#447837] focus:ring-1 focus:ring-[#447837] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Onboarding Type</option>
                    <option value="UPI">UPI</option>
                    <option value="UPI Cashpoint">UPI Cashpoint</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* AGGREGATOR SELECTOR WITH AUTOCOMPLETE */}
              <div className="md:col-span-3 relative" ref={aggregatorWrapperRef}>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Aggregator <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={aggregatorInput}
                    disabled={!viewCategory}
                    onChange={(e) => {
                      setAggregatorInput(e.target.value);
                      setIsAggregatorDropdownOpen(true);
                      setValidationError("");
                    }}
                    onFocus={() => {
                      if (viewCategory) setIsAggregatorDropdownOpen(true);
                    }}
                    placeholder={!viewCategory ? "Select Onboarding Type first..." : `Search ${viewCategory} aggregator...`}
                    className={`w-full text-xs font-medium border-2 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none shadow-2xs placeholder:text-gray-400 ${
                      !viewCategory
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-[#447837] bg-white text-gray-900"
                    }`}
                  />
                </div>

                {/* AUTOCOMPLETE POPOVER DROPDOWN */}
                {isAggregatorDropdownOpen && viewCategory && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2 font-sans animate-in fade-in duration-100">
                    <div className="px-4 py-1.5 text-[11px] font-medium text-gray-400">
                      {matchingAggregators.length}{" "}
                      {matchingAggregators.length === 1 ? "match" : "matches"} ({viewCategory})
                    </div>

                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                      {matchingAggregators.map((agg, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedAggregatorName(agg);
                            setAggregatorInput(agg);
                            setIsAggregatorDropdownOpen(false);
                            setValidationError("");
                          }}
                          className={`px-4 py-2.5 text-xs text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837] cursor-pointer transition flex items-center justify-between ${
                            aggregatorInput === agg ? "bg-[#EBF4E9] font-semibold text-[#447837]" : ""
                          }`}
                        >
                          <span>{highlightMatch(agg, aggregatorInput)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* REPORT TYPE DROPDOWN (Latest / Previous) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Report Type
                </label>
                <div className="relative">
                  <select
                    value={reportType}
                    onChange={(e) => {
                      setReportType(e.target.value as "Latest" | "Previous");
                      setValidationError("");
                    }}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white text-gray-800 focus:border-[#447837] focus:ring-1 focus:ring-[#447837] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Latest">Latest Report</option>
                    <option value="Previous">Previous Report</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* IF PREVIOUS REPORT IS SELECTED: DATE SELECTION (Single Calendar Range Picker) */}
              {reportType === "Previous" && (
                <div className="md:col-span-3 animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Date Selection <span className="text-red-500">*</span>
                  </label>
                  <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onChange={(from, to) => {
                      setFromDate(from);
                      setToDate(to);
                      setValidationError("");
                    }}
                    onClear={() => {
                      setFromDate("");
                      setToDate("");
                      setValidationError("");
                    }}
                  />
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className={reportType === "Previous" ? "md:col-span-1 flex justify-end" : "md:col-span-4 flex justify-start"}>
                <button
                  type="button"
                  onClick={handleViewSubmit}
                  className="w-full md:w-auto px-8 py-2.5 bg-[#447837] hover:bg-[#35622A] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <span>Submit</span>
                </button>
              </div>
            </div>

            {/* VALIDATION ERROR ALERT BOX */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* RESULTS AREA - ONLY SHOWN AFTER CLICKING SUBMIT */}
          {!hasSubmitted ? (
            <div className="py-16 text-center max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 bg-[#EBF4E9] rounded-full flex items-center justify-center mx-auto text-[#447837]">
                <Search className="w-8 h-8 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Select Options & Click Submit</h3>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Sub-Header Bar with Table Quick Search & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
                    <span>Merchant Details — {submittedAggregator}</span>
                    <span className="px-2.5 py-0.5 bg-[#447837] text-white text-[10px] font-bold rounded-full">
                      {submittedCategory}
                    </span>
                    <span className="px-2 py-0.5 bg-[#EBF4E9] text-[#447837] text-[10px] font-bold rounded-full">
                      {submittedReportType} Report
                    </span>
                  </h3>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter MID, TID, Merchant Name..."
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const csvHeader = [
                        "Business Type", "Business Legal Name", "Brand Name", "Address", "City", "State",
                        "Pincode", "Lat", "Long", "MCC", "Merchant Name", "Email Id", "Mobile Number",
                        "PAN Card", "Account Type", "IFSC Code", "Bank Name", "Bank Account Number",
                        "Branch Name", "TID", "MID", "VPA", "Status"
                      ].join(",");
                      const csvRows = filteredMerchants.map(m => [
                        m.businessType, `"${m.businessLegalName}"`, `"${m.brandName}"`, `"${m.address}"`,
                        m.city, m.state, m.pincode, m.lat, m.long, m.mcc, `"${m.merchantName}"`,
                        m.emailId, m.mobileNumber, m.panCard, m.accountType, m.ifscCode,
                        `"${m.bankName}"`, m.bankAccountNumber, `"${m.branchName}"`, m.tid, m.mid, m.vpa, m.status
                      ].join(","));
                      const csvContent = "data:text/csv;charset=utf-8," + [csvHeader, ...csvRows].join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `Merchant_Report_${submittedAggregator}_${submittedCategory}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-3.5 py-2 bg-white border border-[#447837] text-[#447837] hover:bg-[#EBF4E9] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Detailed Merchant Table displaying all Excel Fields in Requested Sequence */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs font-sans whitespace-nowrap">
                  <thead className="bg-[#447837] text-white text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Business Type</th>
                      <th className="px-4 py-3">Business Legal Name</th>
                      <th className="px-4 py-3">Brand Name</th>
                      <th className="px-4 py-3">Address</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Pincode</th>
                      <th className="px-4 py-3">Lat</th>
                      <th className="px-4 py-3">Long</th>
                      <th className="px-4 py-3">MCC</th>
                      <th className="px-4 py-3">Merchant Name</th>
                      <th className="px-4 py-3">Email Id</th>
                      <th className="px-4 py-3">Mobile Number</th>
                      <th className="px-4 py-3">PAN Card</th>
                      <th className="px-4 py-3">Account Type</th>
                      <th className="px-4 py-3">IFSC Code</th>
                      <th className="px-4 py-3">Bank Name</th>
                      <th className="px-4 py-3">Bank Account Number</th>
                      <th className="px-4 py-3">Branch Name</th>
                      <th className="px-4 py-3">TID</th>
                      <th className="px-4 py-3">MID</th>
                      <th className="px-4 py-3">VPA</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {filteredMerchants.length > 0 ? (
                      filteredMerchants.map((m) => (
                        <tr key={m.mid} className="hover:bg-[#EBF4E9]/50 transition">
                          <td className="px-4 py-3 font-semibold text-gray-900 font-mono text-[11px]">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-800">
                              {m.businessType}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {m.businessLegalName}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{m.brandName}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                            {m.address}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{m.city}</td>
                          <td className="px-4 py-3 text-gray-600">{m.state}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono">{m.pincode}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{m.lat}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{m.long}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono">{m.mcc}</td>
                          <td className="px-4 py-3 font-bold text-gray-900">
                            {m.merchantName}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{m.emailId}</td>
                          <td className="px-4 py-3 text-gray-800 font-mono">
                            {m.mobileNumber}
                          </td>
                          <td className="px-4 py-3 font-mono text-gray-800">{m.panCard}</td>
                          <td className="px-4 py-3 text-gray-600">{m.accountType}</td>
                          <td className="px-4 py-3 font-mono text-gray-600">
                            {m.ifscCode}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {m.bankName}
                          </td>
                          <td className="px-4 py-3 font-mono text-gray-700">
                            {m.bankAccountNumber}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{m.branchName}</td>
                          <td className="px-4 py-3 font-bold text-[#447837] font-mono">
                            {m.tid}
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900 font-mono">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-800">
                              {m.mid}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-blue-700">{m.vpa}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={23}
                          className="px-4 py-10 text-center text-gray-400 font-medium"
                        >
                          No merchant details found for {submittedAggregator}. Try searching another MID or Aggregator.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: MERCHANT REVIEW (Dedicated Partner Subview) */}
      {subMode === "review" && (
        <div className="py-4 space-y-6">
          {reviewActionToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{reviewActionToast}</span>
              </div>
              <button onClick={() => setReviewActionToast("")} className="text-emerald-700 hover:text-emerald-950">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {(["All", "Pending Review", "Under Verification", "Approved", "Action Required"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setReviewStatusFilter(status)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                        reviewStatusFilter === status
                          ? "bg-[#447837] text-white shadow-2xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search MID, Brand, or Aggregator..."
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                />
              </div>
            </div>

            {/* Review Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="px-4 py-3">MID</th>
                    <th className="px-4 py-3">Business Legal Name</th>
                    <th className="px-4 py-3">Brand Name</th>
                    <th className="px-4 py-3">Aggregator</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Submitted Date</th>
                    <th className="px-4 py-3">KYC Status</th>
                    <th className="px-4 py-3">Review Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white font-medium">
                  {reviewMerchants
                    .filter((m) => {
                      if (reviewStatusFilter !== "All" && m.reviewStatus !== reviewStatusFilter) {
                        return false;
                      }
                      if (
                        reviewSearchQuery &&
                        !m.mid.toLowerCase().includes(reviewSearchQuery.toLowerCase()) &&
                        !m.businessLegalName.toLowerCase().includes(reviewSearchQuery.toLowerCase()) &&
                        !m.brandName.toLowerCase().includes(reviewSearchQuery.toLowerCase()) &&
                        !m.aggregator.toLowerCase().includes(reviewSearchQuery.toLowerCase())
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((item) => (
                      <tr key={item.mid} className="hover:bg-gray-50/70 transition">
                        <td className="px-4 py-3 font-mono font-bold text-gray-900">{item.mid}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{item.businessLegalName}</td>
                        <td className="px-4 py-3 text-gray-700">{item.brandName}</td>
                        <td className="px-4 py-3 text-gray-600">{item.aggregator}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{item.submittedDate}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.kycStatus === "Verified"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.kycStatus === "Pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {item.kycStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.reviewStatus === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.reviewStatus === "Action Required"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {item.reviewStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {item.reviewStatus !== "Approved" && (
                              <button
                                onClick={() => {
                                  setReviewMerchants(
                                    reviewMerchants.map((rm) =>
                                      rm.mid === item.mid ? { ...rm, reviewStatus: "Approved" } : rm
                                    )
                                  );
                                  setReviewActionToast(`Merchant ${item.mid} has been approved successfully!`);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition"
                                title="Approve Merchant"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedReviewMerchant(item)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-[11px] font-semibold transition"
                            >
                              Review Docs
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Review Modal */}
          {selectedReviewMerchant && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-200">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Merchant Review: {selectedReviewMerchant.businessLegalName}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">MID: {selectedReviewMerchant.mid}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReviewMerchant(null)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl">
                    <div>
                      <span className="text-gray-500 block">Brand Name:</span>
                      <span className="font-semibold text-gray-900">{selectedReviewMerchant.brandName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Aggregator:</span>
                      <span className="font-semibold text-gray-900">{selectedReviewMerchant.aggregator}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Category:</span>
                      <span className="font-semibold text-gray-900">{selectedReviewMerchant.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">KYC Status:</span>
                      <span className="font-semibold text-gray-900">{selectedReviewMerchant.kycStatus}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Uploaded Verification Documents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#447837]" />
                          <span className="font-medium text-gray-800">Certificate of Incorporation.pdf</span>
                        </div>
                        <span className="text-emerald-700 font-semibold text-[11px]">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#447837]" />
                          <span className="font-medium text-gray-800">Company PAN Card & GST.pdf</span>
                        </div>
                        <span className="text-emerald-700 font-semibold text-[11px]">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#447837]" />
                          <span className="font-medium text-gray-800">Cancelled Cheque / Bank Proof.pdf</span>
                        </div>
                        <span className="text-emerald-700 font-semibold text-[11px]">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setReviewMerchants(
                        reviewMerchants.map((rm) =>
                          rm.mid === selectedReviewMerchant.mid ? { ...rm, reviewStatus: "Action Required" } : rm
                        )
                      );
                      setReviewActionToast(`Clarification requested for ${selectedReviewMerchant.mid}`);
                      setSelectedReviewMerchant(null);
                    }}
                    className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold"
                  >
                    Request Clarification
                  </button>
                  <button
                    onClick={() => {
                      setReviewMerchants(
                        reviewMerchants.map((rm) =>
                          rm.mid === selectedReviewMerchant.mid ? { ...rm, reviewStatus: "Approved" } : rm
                        )
                      );
                      setReviewActionToast(`Merchant ${selectedReviewMerchant.mid} approved!`);
                      setSelectedReviewMerchant(null);
                    }}
                    className="px-4 py-1.5 bg-[#447837] text-white hover:bg-[#35622A] rounded-lg text-xs font-semibold"
                  >
                    Approve Merchant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
