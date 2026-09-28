import { useState, useMemo, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Search,
  Download,
  Eye,
  CheckCircle2,
  X,
  Check,
  FileText,
  UploadCloud,
  FileCheck2,
  CheckCircle
} from "lucide-react";

export interface PartnerReviewItem {
  id: string;
  name: string;
  username: string;
  adminName: string;
  mobileNumber: string;
  status: "Approved" | "Pending" | "Rejected";
  email: string;
  businessType: string;
  businessName: string;
  businessVolume: string;
  address: string;
  pincode: string;
  state: string;
  district: string;
  city: string;
  pan: string;
  aadhaar: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankName: string;
  beneficiaryName: string;
  ifscCode: string;
  branchName: string;
  bankPincode: string;
  bankCity: string;
  bankState: string;
  apkLink: string;
  companyWebsite: string;
  approvedLevel: string;
  fileName: string;
  legalEntityName: string;
  registeredPhone: string;
}

export const STATUS_OPTIONS = [
  "Select Status",
  "APPROVED BY CHECKER 1",
  "APPROVED",
  "PENDING AT Checker 1",
  "PENDING AT Checker 2",
  "REJECTED"
];

const defaultPartnerList: PartnerReviewItem[] = [
  {
    id: "PR-001",
    name: "Rudransh Panigrahi",
    username: "rudransh.panigrahi",
    adminName: "admin_isu",
    mobileNumber: "+91 9283 978311",
    status: "Pending",
    email: "johndoe@gmail.com",
    businessType: "Proprietorship",
    businessName: "Maa Hotel",
    businessVolume: "50 Cr",
    address: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    pan: "CGHK8892Y",
    aadhaar: "7261 6271 0015",
    bankAccountType: "Savings Account",
    bankAccountNumber: "89273897243",
    bankName: "State Bank of India",
    beneficiaryName: "Ayush Khan",
    ifscCode: "SBIN000282",
    branchName: "Bada Bazaar",
    bankPincode: "753009",
    bankCity: "Cuttack",
    bankState: "Odisha",
    apkLink: "https://play.google.com/store/apps/",
    companyWebsite: "johndoe.com",
    approvedLevel: "PENDING AT Checker 1",
    fileName: "Service-Level Agreement",
    legalEntityName: "JaiJui Fintech Pvt Ltd",
    registeredPhone: "9511290073"
  },
  {
    id: "PR-002",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Approved",
    email: "krishna@dasenterprises.in",
    businessType: "PrivateLimitedCompany.Limited",
    businessName: "Das Enterprises Private Limited",
    businessVolume: "50 Cr",
    address: "Plot 42, Saheed Nagar",
    pincode: "751007",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    pan: "CGHK8892Y",
    aadhaar: "7261 6271 0015",
    bankAccountType: "Current Account",
    bankAccountNumber: "89273897243",
    bankName: "State Bank of India",
    beneficiaryName: "Krishna Das",
    ifscCode: "SBIN000282",
    branchName: "Bada Bazaar",
    bankPincode: "753009",
    bankCity: "Cuttack",
    bankState: "Odisha",
    apkLink: "https://play.google.com/store/apps/",
    companyWebsite: "johndoe.com",
    approvedLevel: "APPROVED BY CHECKER 1",
    fileName: "Service-Level Agreement",
    legalEntityName: "Das Enterprises Pvt Ltd",
    registeredPhone: "+91 98721 72818"
  },
  {
    id: "PR-003",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Approved",
    email: "krishna.isu@gmail.com",
    businessType: "Proprietorship",
    businessName: "Maa Hotel",
    businessVolume: "50 Cr",
    address: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    pan: "CGHK8892Y",
    aadhaar: "7261 6271 0015",
    bankAccountType: "Savings Account",
    bankAccountNumber: "89273897243",
    bankName: "State Bank of India",
    beneficiaryName: "Ayush Khan",
    ifscCode: "SBIN000282",
    branchName: "Bada Bazaar",
    bankPincode: "753009",
    bankCity: "Cuttack",
    bankState: "Odisha",
    apkLink: "https://play.google.com/store/apps/",
    companyWebsite: "johndoe.com",
    approvedLevel: "APPROVED",
    fileName: "Service-Level Agreement",
    legalEntityName: "JaiJui Fintech Pvt Ltd",
    registeredPhone: "9511290073"
  },
  {
    id: "PR-004",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Pending",
    email: "krish.das2@gmail.com",
    businessType: "PrivateLimitedCompany.Limited",
    businessName: "Maa Hotel",
    businessVolume: "200 Cr. per annum",
    address: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    pan: "CGHK8892Y",
    aadhaar: "7261 6271 0015",
    bankAccountType: "Savings Account",
    bankAccountNumber: "89273897243",
    bankName: "State Bank of India",
    beneficiaryName: "Ayush Khan",
    ifscCode: "SBIN000282",
    branchName: "Bada Bazaar",
    bankPincode: "753009",
    bankCity: "Cuttack",
    bankState: "Odisha",
    apkLink: "https://play.google.com/store/apps/",
    companyWebsite: "johndoe.com",
    approvedLevel: "PENDING AT Checker 2",
    fileName: "Service-Level Agreement",
    legalEntityName: "JaiJui Fintech Pvt Ltd",
    registeredPhone: "9511290073"
  },
  {
    id: "PR-005",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Rejected",
    email: "krish.rejected@gmail.com",
    businessType: "Proprietorship",
    businessName: "Maa Hotel",
    businessVolume: "50 Cr",
    address: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    pan: "CGHK8892Y",
    aadhaar: "7261 6271 0015",
    bankAccountType: "Savings Account",
    bankAccountNumber: "89273897243",
    bankName: "State Bank of India",
    beneficiaryName: "Ayush Khan",
    ifscCode: "SBIN000282",
    branchName: "Bada Bazaar",
    bankPincode: "753009",
    bankCity: "Cuttack",
    bankState: "Odisha",
    apkLink: "https://play.google.com/store/apps/",
    companyWebsite: "johndoe.com",
    approvedLevel: "REJECTED",
    fileName: "Service-Level Agreement",
    legalEntityName: "JaiJui Fintech Pvt Ltd",
    registeredPhone: "9511290073"
  },
  {
    id: "PR-006",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Pending",
    email: "krish.das3@gmail.com",
    businessType: "Proprietorship",
    businessName: "Maa Hotel",
    businessVolume: "50 Cr",
    address: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    pan: "CGHK8892Y",
    aadhaar: "7261 6271 0015",
    bankAccountType: "Savings Account",
    bankAccountNumber: "89273897243",
    bankName: "State Bank of India",
    beneficiaryName: "Ayush Khan",
    ifscCode: "SBIN000282",
    branchName: "Bada Bazaar",
    bankPincode: "753009",
    bankCity: "Cuttack",
    bankState: "Odisha",
    apkLink: "https://play.google.com/store/apps/",
    companyWebsite: "johndoe.com",
    approvedLevel: "PENDING AT Checker 1",
    fileName: "Service-Level Agreement",
    legalEntityName: "JaiJui Fintech Pvt Ltd",
    registeredPhone: "9511290073"
  }
];

interface MerchantReviewViewProps {
  onBack?: () => void;
  isCheckerOne?: boolean;
  isCheckerTwo?: boolean;
  currentRole?: string;
}

export function MerchantReviewView({
  onBack,
  isCheckerOne = false,
  isCheckerTwo = false,
  currentRole = "Checker 2",
}: MerchantReviewViewProps) {
  const isCheckerTwoActive = isCheckerTwo || currentRole === "Checker 2";
  const [partners, setPartners] = useState<PartnerReviewItem[]>(defaultPartnerList);
  const [selectedPartner, setSelectedPartner] = useState<PartnerReviewItem | null>(null);

  const getInitialDateStr = () => {
    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // Filters from Screenshot
  const [fromDate, setFromDate] = useState<string>(getInitialDateStr());
  const [toDate, setToDate] = useState<string>(getInitialDateStr());
  const [statusFilter, setStatusFilter] = useState<string>("Select Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string>("Select Status");
  const [appliedFromDate, setAppliedFromDate] = useState<string>("");
  const [appliedToDate, setAppliedToDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fromDateInputRef = useRef<HTMLInputElement>(null);
  const toDateInputRef = useRef<HTMLInputElement>(null);

  // Table pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Toast message
  const [toastMessage, setToastMessage] = useState<string>("");

  // Checker 1 Modals state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectSections, setRejectSections] = useState({
    all: false,
    businessInfo: false,
    basicInfo: false,
    financeOthers: false
  });
  const [rejectionReason, setRejectionReason] = useState<string>("");

  const [isMapPlanModalOpen, setIsMapPlanModalOpen] = useState<boolean>(false);
  const [planDropdownOpen, setPlanDropdownOpen] = useState<boolean>(false);
  const [planSearchQuery, setPlanSearchQuery] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("Master Plan");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Checker 2 Specific Modals & State
  const [isRejectToCheckerOneOpen, setIsRejectToCheckerOneOpen] = useState<boolean>(false);
  const [rejectToCheckerOneReason, setRejectToCheckerOneReason] = useState<string>("");

  const [isRejectUserCheckerTwoOpen, setIsRejectUserCheckerTwoOpen] = useState<boolean>(false);
  const [rejectUserReason, setRejectUserReason] = useState<string>("");

  const [isViewPlanDetailsOpen, setIsViewPlanDetailsOpen] = useState<boolean>(false);

  // Document preview modal
  const [previewDocTitle, setPreviewDocTitle] = useState<string | null>(null);

  // Upload agreement state
  const [uploadedAgreementFile, setUploadedAgreementFile] = useState<File | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Filtered partners
  const filteredPartners = useMemo(() => {
    if (!hasSubmitted) return [];
    return partners.filter((p) => {
      if (appliedStatusFilter && appliedStatusFilter !== "Select Status") {
        const filter = appliedStatusFilter.toUpperCase();
        if (filter === "APPROVED BY CHECKER 1") {
          const lvl = p.approvedLevel.toUpperCase();
          if (!lvl.includes("CHECKER 1") && !lvl.includes("CHECKER ONE")) {
            return false;
          }
        } else if (filter === "APPROVED") {
          const lvl = p.approvedLevel.toUpperCase();
          if (p.status !== "Approved" && !lvl.includes("APPROVED")) {
            return false;
          }
        } else if (filter === "PENDING AT CHECKER 1") {
          const lvl = p.approvedLevel.toUpperCase();
          if (!lvl.includes("PENDING") || (!lvl.includes("CHECKER 1") && !lvl.includes("CHECKER ONE"))) {
            return false;
          }
        } else if (filter === "PENDING AT CHECKER 2") {
          const lvl = p.approvedLevel.toUpperCase();
          if (!lvl.includes("PENDING") || (!lvl.includes("CHECKER 2") && !lvl.includes("CHECKER TWO"))) {
            return false;
          }
        } else if (filter === "REJECTED") {
          const lvl = p.approvedLevel.toUpperCase();
          if (p.status !== "Rejected" && !lvl.includes("REJECTED")) {
            return false;
          }
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesUser = p.username.toLowerCase().includes(q);
        const matchesAdmin = p.adminName.toLowerCase().includes(q);
        const matchesPhone = p.mobileNumber.toLowerCase().includes(q);
        const matchesEmail = p.email.toLowerCase().includes(q);
        if (!matchesName && !matchesUser && !matchesAdmin && !matchesPhone && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }, [partners, hasSubmitted, appliedStatusFilter, searchQuery]);

  const totalEntries = filteredPartners.length;
  const paginatedPartners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPartners.slice(start, start + pageSize);
  }, [filteredPartners, currentPage]);

  const handleExportCSV = () => {
    const headers = "Name,Username,Admin Name,Mobile Number,Status,Email,Business Name,Volume\n";
    const rows = filteredPartners
      .map(
        (p) =>
          `"${p.name}","${p.username}","${p.adminName}","${p.mobileNumber}","${p.status}","${p.email}","${p.businessName}","${p.businessVolume}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Review_Partner_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Partner review table exported to CSV successfully.");
  };

  const handleRejectAllToggle = (checked: boolean) => {
    setRejectSections({
      all: checked,
      businessInfo: checked,
      basicInfo: checked,
      financeOthers: checked
    });
  };

  const handleSendForReSubmission = () => {
    if (!selectedPartner) return;
    const updated = {
      ...selectedPartner,
      status: "Rejected" as const,
      approvedLevel: "REJECTED - PENDING RESUBMISSION"
    };
    setSelectedPartner(updated);
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsRejectModalOpen(false);
    showToast("Partner application sent for re-submission successfully.");
  };

  const handleOpenMapPlan = () => {
    setIsMapPlanModalOpen(true);
  };

  const handleConfirmMap = () => {
    setIsMapPlanModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleContinueAndApprove = () => {
    if (!selectedPartner) return;
    const updated = {
      ...selectedPartner,
      status: "Approved" as const,
      approvedLevel: "APPROVED BY CHECKER ONE"
    };
    setSelectedPartner(updated);
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsSuccessModalOpen(false);
    showToast("The user has been mapped successfully and approved by Checker 1.");
  };

  const handleDownloadDoc = (docName: string) => {
    showToast(`Downloading ${docName}...`);
  };

  const handleConfirmRejectToCheckerOne = () => {
    if (!selectedPartner) return;
    const updated = {
      ...selectedPartner,
      status: "Pending" as const,
      approvedLevel: "REJECTED TO CHECKER ONE",
    };
    setSelectedPartner(updated);
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsRejectToCheckerOneOpen(false);
    setRejectToCheckerOneReason("");
    showToast("Sent back to Checker 1 for re-submission.");
  };

  const handleConfirmRejectUserCheckerTwo = () => {
    if (!selectedPartner) return;
    const updated = {
      ...selectedPartner,
      status: "Rejected" as const,
      approvedLevel: "REJECTED AT CHECKER TWO",
    };
    setSelectedPartner(updated);
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsRejectUserCheckerTwoOpen(false);
    setRejectUserReason("");
    showToast("User onboarding rejected successfully.");
  };

  const handleCheckerTwoApprove = () => {
    if (!selectedPartner) return;
    const updated = {
      ...selectedPartner,
      status: "Approved" as const,
      approvedLevel: "APPROVED AT CHECKER TWO",
    };
    setSelectedPartner(updated);
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast("Partner onboarding approved successfully by Checker 2.");
  };

  const renderDocActionButtons = (docTitle: string) => (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => setPreviewDocTitle(docTitle)}
        className="px-3 py-1 bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] rounded-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>View</span>
      </button>
      <button
        type="button"
        onClick={() => handleDownloadDoc(docTitle)}
        className="px-3 py-1 bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] rounded-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Download</span>
      </button>
    </div>
  );

  // =========================================================================
  // DETAIL VIEW (Screenshots 2, 3, 4, 5, 6)
  // =========================================================================
  if (selectedPartner) {
    return (
      <div className="space-y-6 py-2 select-none font-sans max-w-6xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-[100000] bg-[#143B28] border border-emerald-500/40 text-[#4ADE80] px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage("")} className="text-emerald-300 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Breadcrumb Header */}
        <div className="flex items-center space-x-2 text-lg font-bold text-gray-800">
          <button
            onClick={() => setSelectedPartner(null)}
            className="hover:text-[#447837] flex items-center space-x-1.5 transition text-gray-700"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 mr-1" />
            <span>Review Partner</span>
          </button>
          <span className="text-gray-400 font-normal">/</span>
          <span className="text-gray-900 font-bold">{selectedPartner.name}</span>
        </div>

        {/* 1. User Info Card */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-[15px] font-bold text-gray-900">User Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Name</span>
              <span className="text-gray-800 font-medium">{selectedPartner.name}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Email ID</span>
              <span className="text-gray-800 font-medium">{selectedPartner.email}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Mobile Number</span>
              <span className="text-gray-800 font-medium">{selectedPartner.mobileNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Username</span>
              <span className="text-gray-800 font-medium">{selectedPartner.username}</span>
            </div>
          </div>
        </div>

        {/* 2. Business Info Card */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-[15px] font-bold text-gray-900">Business Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Type of Business</span>
              <span className="text-gray-800 font-medium">{selectedPartner.businessType}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Business Name</span>
              <span className="text-gray-800 font-medium">{selectedPartner.businessName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Business Volume</span>
              <span className="text-gray-800 font-medium">{selectedPartner.businessVolume}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Business Address Proof</span>
              {renderDocActionButtons("Business Address Proof")}
            </div>
            {selectedPartner.businessType !== "Proprietorship" && (
              <>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Company AOA</span>
                  {renderDocActionButtons("Company AOA")}
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Company MOA</span>
                  {renderDocActionButtons("Company MOA")}
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Company Reg Certificate</span>
                  {renderDocActionButtons("Company Registration Certificate")}
                </div>
              </>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Business Registered Address</span>
              <span className="text-gray-800 font-medium">{selectedPartner.address}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Pincode</span>
              <span className="text-gray-800 font-medium">{selectedPartner.pincode}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">State</span>
              <span className="text-gray-800 font-medium">{selectedPartner.state}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">District</span>
              <span className="text-gray-800 font-medium">{selectedPartner.district}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">City</span>
              <span className="text-gray-800 font-medium">{selectedPartner.city}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Business Type</span>
              <span className="text-gray-800 font-medium">{selectedPartner.businessType}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">PAN</span>
              <span className="text-gray-800 font-mono font-medium">{selectedPartner.pan}</span>
            </div>
          </div>
        </div>

        {/* 3. Basic Information Card */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-[15px] font-bold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Address</span>
              <span className="text-gray-800 font-medium">{selectedPartner.aadhaar}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Aadhaar Front Image</span>
              {renderDocActionButtons("Aadhaar Front Image")}
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Aadhaar Back Image</span>
              {renderDocActionButtons("Aadhaar Back Image")}
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">PAN</span>
              <span className="text-gray-800 font-mono font-medium">{selectedPartner.pan}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">PAN Image</span>
              {renderDocActionButtons("PAN Image")}
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Authorized Signatory Image</span>
              {renderDocActionButtons("Authorized Signatory Image")}
            </div>
          </div>
        </div>

        {/* Financial Documents (Checker 1 Only) */}
        {!isCheckerTwoActive && (
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="text-[15px] font-bold text-gray-900">Financial Documents</h2>
            <div className="text-xs text-gray-700 py-1">
              SHOP NO.A6, Mahavinagar Building, Manik...
            </div>
          </div>
        )}

        {/* Bank Info Card */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-[15px] font-bold text-gray-900">Bank Info</h2>
            <div className="flex items-center space-x-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Verified</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Account Type</span>
              <span className="text-gray-800 font-medium">{selectedPartner.bankAccountType}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Beneficiary Name</span>
              <span className="text-gray-800 font-medium">{selectedPartner.beneficiaryName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Bank Account Number</span>
              <span className="text-gray-800 font-mono font-medium">{selectedPartner.bankAccountNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">IFSC Code</span>
              <span className="text-gray-800 font-mono font-medium">{selectedPartner.ifscCode}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Bank Name</span>
              <span className="text-gray-800 font-medium">{selectedPartner.bankName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Branch Name</span>
              <span className="text-gray-800 font-medium">{selectedPartner.branchName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Pincode</span>
              <span className="text-gray-800 font-medium">{selectedPartner.bankPincode}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">State</span>
              <span className="text-gray-800 font-medium">{selectedPartner.bankState}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">City</span>
              <span className="text-gray-800 font-medium">{selectedPartner.bankCity}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Cancelled Cheque</span>
              {renderDocActionButtons("Cancelled Cheque")}
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Last Bank Statement(Six Month)</span>
              {renderDocActionButtons("Last Bank Statement (6 Months)")}
            </div>
          </div>
        </div>

        {/* Others Card */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-[15px] font-bold text-gray-900">Others</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">APK Link</span>
              <a
                href={selectedPartner.apkLink}
                target="_blank"
                rel="noreferrer"
                className="text-[#447837] hover:underline font-medium break-all"
              >
                {selectedPartner.apkLink}
              </a>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Company Master Data</span>
              {renderDocActionButtons("Company Master Data")}
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">PIN Code</span>
              <span className="text-gray-800 font-medium">751003</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Company Website</span>
              <a
                href={`https://${selectedPartner.companyWebsite}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#447837] hover:underline font-medium"
              >
                {selectedPartner.companyWebsite}
              </a>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">State</span>
              <span className="text-gray-800 font-medium">Odisha</span>
            </div>
          </div>
        </div>

        {/* Other Info Card */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-[15px] font-bold text-gray-900">Other Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Agreement Draft</span>
              {renderDocActionButtons("Agreement Draft")}
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Approved_level</span>
              <span className="text-gray-900 font-bold uppercase tracking-wide">
                {isCheckerTwoActive && selectedPartner.status === "Pending"
                  ? "APPROVED AT CHECKER ONE"
                  : selectedPartner.approvedLevel}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-gray-800 font-medium">{selectedPartner.email}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">File Name</span>
              <span className="text-gray-800 font-medium">{selectedPartner.fileName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Mobile</span>
              <span className="text-gray-800 font-medium">{selectedPartner.registeredPhone}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Name</span>
              <span className="text-gray-800 font-medium">{selectedPartner.legalEntityName}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Phone</span>
              <span className="text-gray-800 font-medium">{selectedPartner.registeredPhone}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Status</span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{selectedPartner.status}</span>
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Business Type</span>
              <span className="text-gray-800 font-medium">{selectedPartner.businessType}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Username</span>
              <span className="text-gray-800 font-medium">{selectedPartner.username}</span>
            </div>
          </div>
        </div>

        {/* Agreement Sign Up & Actions for Checker 2 vs Checker 1 */}
        {isCheckerTwoActive ? (
          <>
            {/* Agreement Sign Up Card (Checker 2 - Image 17) */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs flex items-center justify-between">
              <span className="text-[15px] font-bold text-gray-900">Agreement Sign Up</span>
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewDocTitle("Agreement Sign Up")}
                  className="px-3.5 py-1.5 bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] rounded-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc("Agreement Sign Up")}
                  className="px-3.5 py-1.5 bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] rounded-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* View Plan Card (Checker 2 - Image 17) */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs flex items-center justify-between">
              <span className="text-[15px] font-bold text-gray-900">View Plan</span>
              <button
                type="button"
                onClick={() => setIsViewPlanDetailsOpen(true)}
                className="px-3.5 py-1.5 bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] rounded-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
            </div>

            {/* Action Buttons: Reject to Checker 1, Reject, Approve (Checker 2 - Image 17) */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectToCheckerOneOpen(true)}
                className="px-6 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-md text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                Reject to Checker 1
              </button>
              <button
                type="button"
                onClick={() => setIsRejectUserCheckerTwoOpen(true)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleCheckerTwoApprove}
                className="px-8 py-2.5 bg-[#447837] hover:bg-[#36612B] text-white rounded-md text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                Approve
              </button>
            </div>
          </>
        ) : (
          /* Checker 1 Agreement Sign Up Card */
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Agreement Sign Up</h2>
              <p className="text-xs text-gray-500 mt-0.5">Please upload the agreement</p>
            </div>

            <label className="block border-2 border-dashed border-gray-200 hover:border-[#447837] rounded-xl p-8 bg-gray-50/40 hover:bg-[#F0F6EE]/30 cursor-pointer transition text-center">
              <input
                type="file"
                accept=".xls,.xlsx,.csv,.tsv,.pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedAgreementFile(e.target.files[0]);
                    showToast(`Uploaded ${e.target.files[0].name} successfully.`);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#F5F2F7] flex items-center justify-center border border-[#E4DDE9]">
                  <UploadCloud className="w-6 h-6 text-[#447837]" />
                </div>
                <div className="text-xs font-semibold text-gray-800">
                  Drag &amp; drop files or <span className="text-[#447837] underline">Browse</span>
                </div>
                <div className="text-[11px] text-gray-400">
                  {uploadedAgreementFile ? (
                    <span className="font-semibold text-emerald-700">Selected: {uploadedAgreementFile.name}</span>
                  ) : (
                    "Supported formats: XLS, CSV, TSV"
                  )}
                </div>
              </div>
            </label>

            {/* Action Buttons: Reject & Map Plan (Screenshot 6) */}
            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                className="px-6 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleOpenMapPlan}
                className="px-6 py-2 border border-[#447837] text-[#447837] hover:bg-[#447837] hover:text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Map plan
              </button>
            </div>
          </div>
        )}

        {/* MODAL CHECKER 2: REJECT AT CHECKER 1 (Screenshot 13) */}
        {isRejectToCheckerOneOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100002] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-fadeIn relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[16px] font-bold text-gray-900">Reject at Checker 1</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectToCheckerOneOpen(false);
                    setRejectToCheckerOneReason("");
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Illustration */}
              <div className="flex justify-center py-2">
                <div className="relative">
                  <div className="w-20 h-24 bg-white border border-gray-200 rounded-lg shadow-xs flex flex-col p-2 space-y-1.5 rotate-[-6deg]">
                    <div className="h-1.5 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="h-1 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-1 bg-gray-100 rounded-full w-4/5"></div>
                  </div>
                  <div className="absolute inset-0 w-20 h-24 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col p-2 space-y-1.5 ml-2 mt-1">
                    <div className="h-5 bg-[#801414] rounded-sm w-full mb-1"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-[#801414] text-white flex items-center justify-center shadow-md">
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-gray-700 block">
                  Reason of Rejection<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Reason of Rejection"
                  value={rejectToCheckerOneReason}
                  onChange={(e) => setRejectToCheckerOneReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                />
              </div>

              <button
                type="button"
                onClick={handleConfirmRejectToCheckerOne}
                className="w-full py-2.5 bg-[#801414] hover:bg-[#681010] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Send for Re-Submission
              </button>
            </div>
          </div>
        )}

        {/* MODAL CHECKER 2: REJECT USER (Screenshot 14) */}
        {isRejectUserCheckerTwoOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100002] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-fadeIn relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[16px] font-bold text-gray-900">Reject User</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectUserCheckerTwoOpen(false);
                    setRejectUserReason("");
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Illustration */}
              <div className="flex justify-center py-2">
                <div className="relative">
                  <div className="w-20 h-24 bg-white border border-gray-200 rounded-lg shadow-xs flex flex-col p-2 space-y-1.5 rotate-[-6deg]">
                    <div className="h-1.5 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="h-1 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-1 bg-gray-100 rounded-full w-4/5"></div>
                  </div>
                  <div className="absolute inset-0 w-20 h-24 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col p-2 space-y-1.5 ml-2 mt-1">
                    <div className="h-5 bg-[#801414] rounded-sm w-full mb-1"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-[#801414] text-white flex items-center justify-center shadow-md">
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                This action is irreversible. It will reject the user, and the self-onboarding process will need to be restarted.
              </p>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-gray-700 block">
                  Reason of Rejection<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Reason of Rejection"
                  value={rejectUserReason}
                  onChange={(e) => setRejectUserReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                />
              </div>

              <button
                type="button"
                onClick={handleConfirmRejectUserCheckerTwo}
                className="w-full py-2.5 bg-[#801414] hover:bg-[#681010] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Send for Re-Submission
              </button>
            </div>
          </div>
        )}

        {/* MODAL CHECKER 2: VIEW PLAN DETAILS (Screenshot 15) */}
        {isViewPlanDetailsOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100002] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-fadeIn relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[16px] font-bold text-gray-900">View Plan Details</h3>
                <button
                  type="button"
                  onClick={() => setIsViewPlanDetailsOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-600 py-1">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Feature</span>
                  <span className="text-gray-900 font-semibold font-mono">UPI_API</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Sub-feature Name</span>
                  <span className="text-gray-900 font-semibold font-mono">ONLINE_UPI_INTENT</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Service Provider Name</span>
                  <span className="text-gray-900 font-semibold font-mono">UPI_API_ONLINE_UPI_...</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Plan Name</span>
                  <span className="text-gray-900 font-semibold">partnerplan</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Plan Type</span>
                  <span className="text-gray-900 font-semibold">Partner</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Set Value Fixed</span>
                  <span className="text-gray-900 font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Set Value Percentage</span>
                  <span className="text-gray-900 font-semibold">1</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Commission Value</span>
                  <span className="text-gray-900 font-semibold">False</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-500 font-medium">Auth</span>
                  <span className="text-gray-900 font-semibold font-mono">POST</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsViewPlanDetailsOpen(false)}
                className="w-full py-2.5 bg-[#801414] hover:bg-[#681010] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* MODAL 1: REJECT USER (Screenshot 183529) */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100002] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[16px] font-bold text-gray-900">Reject User</h3>
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stacked document illustration with red cross */}
              <div className="flex justify-center py-2">
                <div className="relative">
                  <div className="w-20 h-24 bg-white border border-gray-200 rounded-lg shadow-xs flex flex-col p-2 space-y-1.5 rotate-[-6deg]">
                    <div className="h-1.5 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="h-1 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-1 bg-gray-100 rounded-full w-4/5"></div>
                  </div>
                  <div className="absolute inset-0 w-20 h-24 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col p-2 space-y-1.5 ml-2 mt-1">
                    <div className="h-5 bg-[#801414] rounded-sm w-full mb-1"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-[#801414] text-white flex items-center justify-center shadow-md">
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">
                  Section with Issues<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-700 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rejectSections.all}
                      onChange={(e) => handleRejectAllToggle(e.target.checked)}
                      className="rounded text-[#447837] focus:ring-[#447837]"
                    />
                    <span>Reject All</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rejectSections.businessInfo}
                      onChange={(e) => setRejectSections({ ...rejectSections, businessInfo: e.target.checked })}
                      className="rounded text-[#447837] focus:ring-[#447837]"
                    />
                    <span>Reject Business Info</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rejectSections.basicInfo}
                      onChange={(e) => setRejectSections({ ...rejectSections, basicInfo: e.target.checked })}
                      className="rounded text-[#447837] focus:ring-[#447837]"
                    />
                    <span>Reject Basic Info</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rejectSections.financeOthers}
                      onChange={(e) => setRejectSections({ ...rejectSections, financeOthers: e.target.checked })}
                      className="rounded text-[#447837] focus:ring-[#447837]"
                    />
                    <span>Reject Finance &amp; others</span>
                  </label>
                </div>
              </div>

              {/* Reason Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">
                  Reason of Rejection<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Reason of Rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                />
              </div>

              {/* Submit button in TA Green */}
              <button
                onClick={handleSendForReSubmission}
                className="w-full py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                Send for Re-Submission
              </button>
            </div>
          </div>
        )}

        {/* MODAL 2: MAP USER (Screenshots 183521, 183508) */}
        {isMapPlanModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100002] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[16px] font-bold text-gray-900">Map User</h3>
                <button
                  onClick={() => setIsMapPlanModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Assign Type */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-gray-700 block">Assign Type</label>
                <input
                  type="text"
                  disabled
                  value="Merchant"
                  className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Select User */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-gray-700 block">Select User</label>
                <input
                  type="text"
                  disabled
                  value="User A, User B"
                  className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Select Plan Dropdown */}
              <div className="space-y-1 text-xs relative">
                <label className="font-semibold text-gray-700 block">Select Plan</label>
                <button
                  onClick={() => setPlanDropdownOpen(!planDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#447837]"
                >
                  <span>{selectedPlan}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {planDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for Plan"
                        value={planSearchQuery}
                        onChange={(e) => setPlanSearchQuery(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-[#447837]"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {["Master Plan", "Sample Plan", "Standard Retail Plan", "Enterprise Plan"]
                        .filter((p) => p.toLowerCase().includes(planSearchQuery.toLowerCase()))
                        .map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setSelectedPlan(p);
                              setPlanDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${
                              selectedPlan === p
                                ? "bg-[#F0F6EE] text-[#447837] font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Details Card (Screenshot 183508) */}
              <div className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-gray-800 pb-1 border-b border-gray-200/60">Plan Details</h4>
                <div className="space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Feature</span>
                    <span className="font-semibold text-gray-900">UPI_API</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Sub-feature Name</span>
                    <span className="font-semibold text-gray-900">ONLINE_UPI_INTENT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Service Provider Name</span>
                    <span className="font-semibold text-gray-900">UPI_API_ONLINE_UPI...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Plan Name</span>
                    <span className="font-semibold text-gray-900">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Plan Type</span>
                    <span className="font-semibold text-gray-900">Merchant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Set Value Fixed</span>
                    <span className="font-semibold text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Set Value Percentage</span>
                    <span className="font-semibold text-gray-900">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Commission Value</span>
                    <span className="font-semibold text-gray-900">False</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Auth</span>
                    <span className="font-semibold text-gray-900">POST</span>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleConfirmMap}
                  className="w-full py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  Map
                </button>
                <button
                  onClick={() => setIsMapPlanModalOpen(false)}
                  className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: USER MAPPED SUCCESSFULLY (Screenshot 183501) */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100003] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-6 text-center animate-fadeIn relative">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-gray-900 pt-1">User Mapped Successfully</h3>

              {/* Big Green Checkmark Badge with Confetti */}
              <div className="flex items-center justify-center py-3 relative">
                <div className="relative">
                  {/* Confetti pieces around badge */}
                  <span className="absolute -top-3 -left-3 w-3 h-1 bg-amber-400 rotate-45 rounded-full animate-bounce"></span>
                  <span className="absolute -top-2 right-1 w-2.5 h-2.5 bg-sky-500 rounded-full"></span>
                  <span className="absolute -bottom-2 -left-2 w-3 h-1.5 bg-purple-500 rotate-12 rounded-full"></span>
                  <span className="absolute top-1/2 -left-6 w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span className="absolute top-1/2 -right-6 w-2.5 h-1 bg-teal-500 rotate-90 rounded-full"></span>
                  <span className="absolute -bottom-3 right-0 w-3 h-1 bg-amber-500 rotate-[-30deg] rounded-full"></span>

                  {/* Main Green Checkmark Circle */}
                  <div className="w-20 h-20 rounded-full bg-[#52B788] text-white flex items-center justify-center shadow-lg shadow-[#52B788]/20">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 px-4 leading-relaxed font-medium">
                The user has been mapped successfully and now is eligible for approval. Please continue to approve.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleContinueAndApprove}
                  className="w-full py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  Continue &amp; Approve
                </button>
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full py-2 text-gray-600 hover:text-gray-900 text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: DOCUMENT PREVIEW */}
        {previewDocTitle && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100003] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900">{previewDocTitle}</h3>
                <button
                  onClick={() => setPreviewDocTitle(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center space-y-3 min-h-[220px]">
                <FileCheck2 className="w-12 h-12 text-[#447837]" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-800">{previewDocTitle}.pdf</p>
                  <p className="text-[11px] text-gray-500">Verified by Transaction Analysts KYC Engine</p>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                    KYC APPROVED
                  </span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full">
                    1.8 MB
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setPreviewDocTitle(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadDoc(previewDocTitle);
                    setPreviewDocTitle(null);
                  }}
                  className="px-4 py-2 bg-[#447837] text-white hover:bg-[#36602A] rounded-lg text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // MAIN TABLE VIEW (Screenshot 183443)
  // =========================================================================
  return (
    <div className="space-y-5 py-2 select-none font-sans max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100000] bg-[#143B28] border border-emerald-500/40 text-[#4ADE80] px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="text-emerald-300 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Breadcrumb Title & Back Button matching screenshot */}
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-gray-800 hover:text-black hover:bg-gray-100 rounded-lg transition cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Partner Review
          </h1>
        </div>

        {/* Segmented Accent Indicator: lime bar, green segment, yellow dots */}
        <div className="flex items-center space-x-1.5 pl-6 pt-0.5">
          <div className="h-1 w-12 bg-[#84CC16] rounded-full"></div>
          <div className="h-1 w-3.5 bg-[#447837] rounded-full"></div>
          <div className="h-1 w-1.5 bg-[#EAB308] rounded-full"></div>
          <div className="h-1 w-1.5 bg-[#EAB308] rounded-full"></div>
        </div>
      </div>

      {/* FILTER CONTAINER (Matching Screenshot with Green Theme) */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* From Date* */}
          <div className="relative flex-1 min-w-[180px]">
            <div
              onClick={() => {
                if (fromDateInputRef.current) {
                  try {
                    fromDateInputRef.current.showPicker();
                  } catch {
                    fromDateInputRef.current.focus();
                  }
                }
              }}
              className="bg-[#ECEEF2] hover:bg-[#E6E9EE] transition rounded-t-md border-b-2 border-gray-400 focus-within:border-[#447837] px-3.5 pt-2 pb-1.5 flex items-center justify-between cursor-pointer"
            >
              <div className="flex-1 pr-2">
                <span className="block text-[11px] font-medium text-gray-500 leading-tight">
                  From Date<span className="text-gray-500">*</span>
                </span>
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-800 font-normal outline-none pt-0.5 leading-normal"
                />
              </div>
              <div className="text-gray-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <input
              ref={fromDateInputRef}
              type="date"
              className="sr-only"
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m, d] = e.target.value.split("-");
                  setFromDate(`${parseInt(m)}/${parseInt(d)}/${y}`);
                }
              }}
            />
          </div>

          {/* To Date* */}
          <div className="relative flex-1 min-w-[180px]">
            <div
              onClick={() => {
                if (toDateInputRef.current) {
                  try {
                    toDateInputRef.current.showPicker();
                  } catch {
                    toDateInputRef.current.focus();
                  }
                }
              }}
              className="bg-[#ECEEF2] hover:bg-[#E6E9EE] transition rounded-t-md border-b-2 border-gray-400 focus-within:border-[#447837] px-3.5 pt-2 pb-1.5 flex items-center justify-between cursor-pointer"
            >
              <div className="flex-1 pr-2">
                <span className="block text-[11px] font-medium text-gray-500 leading-tight">
                  To Date<span className="text-gray-500">*</span>
                </span>
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-800 font-normal outline-none pt-0.5 leading-normal"
                />
              </div>
              <div className="text-gray-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <input
              ref={toDateInputRef}
              type="date"
              className="sr-only"
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m, d] = e.target.value.split("-");
                  setToDate(`${parseInt(m)}/${parseInt(d)}/${y}`);
                }
              }}
            />
          </div>

          {/* Status* Dropdown */}
          <div className="relative flex-1 min-w-[220px]">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`w-full text-left transition rounded-t-md border-b-2 px-3.5 pt-2 pb-1.5 flex items-center justify-between cursor-pointer ${
                isStatusDropdownOpen
                  ? "bg-[#E6EAE4] border-[#447837]"
                  : "bg-[#ECEEF2] hover:bg-[#E6E9EE] border-gray-400"
              }`}
            >
              <div className="flex-1 pr-2">
                <span className={`block text-[11px] font-medium leading-tight ${isStatusDropdownOpen ? "text-[#447837]" : "text-gray-500"}`}>
                  Status<span className="text-gray-500">*</span>
                </span>
                <span className="block text-sm text-gray-800 font-normal pt-0.5 truncate">
                  {statusFilter}
                </span>
              </div>
              <div className="text-gray-600 shrink-0">
                <svg className={`w-3.5 h-3.5 transition-transform ${isStatusDropdownOpen ? "rotate-180 text-[#447837]" : "text-gray-500"}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            {isStatusDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsStatusDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-0.5 bg-white border border-gray-200 rounded-b-lg shadow-2xl z-50 py-1 max-h-72 overflow-y-auto">
                  {STATUS_OPTIONS.map((opt) => {
                    const isSelected = statusFilter === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-xs text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-[#EBF4E9] text-[#447837] font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="truncate pr-2">{opt}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#447837] stroke-[2.5] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Submit Button in Green Theme */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => {
                setAppliedStatusFilter(statusFilter);
                setAppliedFromDate(fromDate);
                setAppliedToDate(toDate);
                setHasSubmitted(true);
                setCurrentPage(1);
                showToast("Partner details fetched successfully.");
              }}
              className="px-8 py-3 bg-[#447837] hover:bg-[#36602A] active:bg-[#2D5023] text-white rounded-lg text-sm font-semibold transition shadow-xs cursor-pointer flex items-center justify-center min-w-[110px]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {!hasSubmitted ? (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#EBF4E9] text-[#447837] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">Select Criteria &amp; Click Submit</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Please select the date range and status, then click Submit to fetch the partner review details.
          </p>
        </div>
      ) : (
        <>
          {/* SEARCH AND EXPORT BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Search Name, mobile number, email i..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-normal pl-3.5 pr-8 py-2.5 bg-white border border-gray-300 rounded-md outline-none focus:border-[#447837]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-md text-xs font-medium text-gray-700 transition shadow-2xs cursor-pointer"
            >
              <span>Export To CSV</span>
              <Download className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* TABLE (Screenshot 183443) */}
          <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px] bg-white">
                  <th className="px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center space-x-1">
                      <span>Name</span>
                      <span>↓</span>
                    </span>
                  </th>
                  <th className="px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center space-x-1">
                      <span>Username</span>
                      <span>↓</span>
                    </span>
                  </th>
                  <th className="px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center space-x-1">
                      <span>Admin Name</span>
                      <span>↓</span>
                    </span>
                  </th>
                  <th className="px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center space-x-1">
                      <span>Mobile Number</span>
                      <span>↓</span>
                    </span>
                  </th>
                  <th className="px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center space-x-1">
                      <span>Status</span>
                      <span>↓</span>
                    </span>
                  </th>
                  <th className="px-5 py-3.5 whitespace-nowrap text-center">
                    <span className="inline-flex items-center space-x-1">
                      <span>Details</span>
                      <span>↓</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-normal text-xs text-gray-700">
                {paginatedPartners.length > 0 ? (
                  paginatedPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{partner.name}</td>
                      <td className="px-5 py-3.5 text-gray-600 font-mono">{partner.username}</td>
                      <td className="px-5 py-3.5 text-gray-600 font-mono">{partner.adminName}</td>
                      <td className="px-5 py-3.5 text-gray-700 font-mono">{partner.mobileNumber}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${
                            partner.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : partner.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{partner.approvedLevel || partner.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedPartner(partner)}
                          className="inline-flex items-center space-x-1 text-[#447837] hover:underline font-semibold text-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      No records found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500">
            <div>
              Showing {totalEntries > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries < 10 ? `0${totalEntries}` : totalEntries} entries
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
              >
                « Prev
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2.5 py-1 rounded border text-xs font-medium ${
                    currentPage === page
                      ? "bg-[#447837] text-white border-[#447837]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-1 text-gray-400">...</span>
              <button
                onClick={() => setCurrentPage(10)}
                className="px-2.5 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                10
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Next »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
