import { useState, useMemo, useRef, useEffect } from "react";
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
  Building2,
  Edit3,
  CheckCircle,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  Building,
  ShieldCheck,
  FileCheck2
} from "lucide-react";
import { getStoredMerchants, updateStoredMerchant } from "../utils/merchantStorage";

export interface MerchantReviewItem {
  id: string;
  name: string;
  username: string;
  adminName: string;
  mobileNumber: string;
  status: "Approved" | "Pending" | "Rejected";
  agreementStatus: "Success" | "Pending";
  productType: string;
  vpa: string;
  merchantId: string;
  mcc: string;
  date: string;
  createdDate?: string;
  kycStatus?: string;
  // Details
  businessLegalName: string;
  brandName: string;
  storeName: string;
  businessAddress: string;
  pincode: string;
  state: string;
  district: string;
  city: string;
  onboardingType?: string;
  businessEntityType: string;
  establishmentYear: string;
  businessRegisteredMobile: string;
  businessRegisteredEmail: string;
  businessPan: string;
  businessRegNumber: string;
  cin?: string;
  cinNumber?: string;
  turnoverYear: string;
  turnoverAmount: string;
  gstin: string;
  natureOfBusiness: string;
  longitude: string;
  latitude: string;
  merchantWebsiteUrl: string;
  merchantSystemIp: string;
  // Personal Info / Directors
  directors?: Array<{
    id?: number;
    name: string;
    din?: string;
    address: string;
    pincode: string;
    state: string;
    district: string;
    city: string;
    mobileNumber: string;
    emailId: string;
    pan: string;
    kycDocumentType: string;
    kycDocumentNumber: string;
  }>;
  director1: {
    name: string;
    din?: string;
    address: string;
    pincode: string;
    state: string;
    district: string;
    city: string;
    mobileNumber: string;
    emailId: string;
    pan: string;
    kycDocumentType: string;
    kycDocumentNumber: string;
  };
  director2?: {
    name: string;
    din?: string;
    address: string;
    pincode: string;
    state: string;
    district: string;
    city: string;
    mobileNumber: string;
    emailId: string;
    pan: string;
    kycDocumentType: string;
    kycDocumentNumber: string;
  };
  // Product Info
  productInfo: {
    productType: string;
    dailyMaxAmountUsage: string;
    minPerTransactionLimit: string;
    maxPerTransactionLimit: string;
    creditLimitAmount: string;
  };
  // Bank Info
  bankInfo: {
    verified: boolean;
    accountType: string;
    beneficiaryName: string;
    bankAccountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    pincode: string;
    state: string;
    district?: string;
    city: string;
  };
  createVpa: string;
  mappedPlan?: string;
  kycSelects?: { [key: string]: string };
  uploadedFiles?: { [key: string]: string };
  additionalDocs?: Array<{ id: number; key: string }>;
}

const initialMerchantList: MerchantReviewItem[] = [
  {
    id: "MCH-001",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Approved",
    kycStatus: "APPROVED BY Checker",
    agreementStatus: "Success",
    productType: "UPI",
    vpa: "rudransh.panigrahi@okisu",
    merchantId: "MID987211",
    mcc: "5411",
    date: "2026-03-15",
    createdDate: "07/03/2025",
    businessLegalName: "Jai Maa Hotel",
    brandName: "Maa Hotel",
    storeName: "Maa Hotel",
    businessAddress: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    businessEntityType: "Sole Proprietorship",
    establishmentYear: "2020",
    businessRegisteredMobile: "+91 98756 12345",
    businessRegisteredEmail: "maahotel@gmail.com",
    businessPan: "ABC7982RR",
    businessRegNumber: "AK/46664/33/MF",
    turnoverYear: "2024",
    turnoverAmount: "₹ 9,29,82,220",
    gstin: "27ABCDE1234F1Z5",
    natureOfBusiness: "Retail",
    longitude: "-122.4194",
    latitude: "37.7749",
    merchantWebsiteUrl: "www.maahotel.com",
    merchantSystemIp: "192.0.2.146",
    director1: {
      name: "Ayush Khan",
      din: "08472910",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    director2: {
      name: "Ayush Khan",
      din: "09281726",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "200000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "100000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Savings Account",
      beneficiaryName: "Ayush Khan",
      bankAccountNumber: "89273897243",
      ifscCode: "SBIN000282",
      bankName: "State Bank of India",
      branchName: "Bada Bazaar",
      pincode: "753009",
      state: "Odisha",
      city: "Cuttack"
    },
    createVpa: "rudransh.panigrahi@okisu",
    mappedPlan: "Sample Plan"
  },
  {
    id: "MCH-002",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Approved",
    kycStatus: "APPROVED BY Checker",
    agreementStatus: "Success",
    productType: "UPI",
    vpa: "krishna.retail@okisu",
    merchantId: "MID987212",
    mcc: "5411",
    date: "2026-03-14",
    createdDate: "07/04/2025",
    businessLegalName: "Jai Maa Hotel",
    brandName: "Maa Hotel",
    storeName: "Maa Hotel",
    businessAddress: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    businessEntityType: "Sole Proprietorship",
    establishmentYear: "2020",
    businessRegisteredMobile: "+91 98756 12345",
    businessRegisteredEmail: "maahotel@gmail.com",
    businessPan: "ABC7982RR",
    businessRegNumber: "AK/46664/33/MF",
    turnoverYear: "2024",
    turnoverAmount: "₹ 9,29,82,220",
    gstin: "27ABCDE1234F1Z5",
    natureOfBusiness: "Retail",
    longitude: "-122.4194",
    latitude: "37.7749",
    merchantWebsiteUrl: "www.maahotel.com",
    merchantSystemIp: "192.0.2.146",
    director1: {
      name: "Ayush Khan",
      din: "08472910",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    director2: {
      name: "Ayush Khan",
      din: "09281726",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "200000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "100000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Savings Account",
      beneficiaryName: "Ayush Khan",
      bankAccountNumber: "89273897243",
      ifscCode: "SBIN000282",
      bankName: "State Bank of India",
      branchName: "Bada Bazaar",
      pincode: "753009",
      state: "Odisha",
      city: "Cuttack"
    },
    createVpa: "rudransh.panigrahi@okisu",
    mappedPlan: "Sample Plan"
  },
  {
    id: "MCH-003",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Rejected",
    kycStatus: "REJECTED",
    agreementStatus: "Pending",
    productType: "UPI",
    vpa: "das.traders@okisu",
    merchantId: "MID987213",
    mcc: "5499",
    date: "2026-03-12",
    createdDate: "07/05/2025",
    businessLegalName: "Jai Maa Hotel",
    brandName: "Maa Hotel",
    storeName: "Maa Hotel",
    businessAddress: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    businessEntityType: "Sole Proprietorship",
    establishmentYear: "2020",
    businessRegisteredMobile: "+91 98756 12345",
    businessRegisteredEmail: "maahotel@gmail.com",
    businessPan: "ABC7982RR",
    businessRegNumber: "AK/46664/33/MF",
    turnoverYear: "2024",
    turnoverAmount: "₹ 9,29,82,220",
    gstin: "27ABCDE1234F1Z5",
    natureOfBusiness: "Retail",
    longitude: "-122.4194",
    latitude: "37.7749",
    merchantWebsiteUrl: "www.maahotel.com",
    merchantSystemIp: "192.0.2.146",
    director1: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    director2: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "200000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "100000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Savings Account",
      beneficiaryName: "Ayush Khan",
      bankAccountNumber: "89273897243",
      ifscCode: "SBIN000282",
      bankName: "State Bank of India",
      branchName: "Bada Bazaar",
      pincode: "753009",
      state: "Odisha",
      city: "Cuttack"
    },
    createVpa: "rudransh.panigrahi@okisu"
  },
  {
    id: "MCH-004",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Pending",
    kycStatus: "PENDING AT Maker",
    agreementStatus: "Pending",
    productType: "UPI",
    vpa: "saho.store@okisu",
    merchantId: "MID987214",
    mcc: "5411",
    date: "2026-03-11",
    createdDate: "07/06/2025",
    businessLegalName: "Jai Maa Hotel",
    brandName: "Maa Hotel",
    storeName: "Maa Hotel",
    businessAddress: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    businessEntityType: "Sole Proprietorship",
    establishmentYear: "2020",
    businessRegisteredMobile: "+91 98756 12345",
    businessRegisteredEmail: "maahotel@gmail.com",
    businessPan: "ABC7982RR",
    businessRegNumber: "AK/46664/33/MF",
    turnoverYear: "2024",
    turnoverAmount: "₹ 9,29,82,220",
    gstin: "27ABCDE1234F1Z5",
    natureOfBusiness: "Retail",
    longitude: "-122.4194",
    latitude: "37.7749",
    merchantWebsiteUrl: "www.maahotel.com",
    merchantSystemIp: "192.0.2.146",
    director1: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    director2: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "200000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "100000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Savings Account",
      beneficiaryName: "Ayush Khan",
      bankAccountNumber: "89273897243",
      ifscCode: "SBIN000282",
      bankName: "State Bank of India",
      branchName: "Bada Bazaar",
      pincode: "753009",
      state: "Odisha",
      city: "Cuttack"
    },
    createVpa: "rudransh.panigrahi@okisu"
  },
  {
    id: "MCH-005",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Pending",
    kycStatus: "REFERRED BACK",
    agreementStatus: "Pending",
    productType: "UPI",
    vpa: "panigrahi.mart@okisu",
    merchantId: "MID987215",
    mcc: "5411",
    date: "2026-03-10",
    createdDate: "07/07/2025",
    businessLegalName: "Jai Maa Hotel",
    brandName: "Maa Hotel",
    storeName: "Maa Hotel",
    businessAddress: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    businessEntityType: "Sole Proprietorship",
    establishmentYear: "2020",
    businessRegisteredMobile: "+91 98756 12345",
    businessRegisteredEmail: "maahotel@gmail.com",
    businessPan: "ABC7982RR",
    businessRegNumber: "AK/46664/33/MF",
    turnoverYear: "2024",
    turnoverAmount: "₹ 9,29,82,220",
    gstin: "27ABCDE1234F1Z5",
    natureOfBusiness: "Retail",
    longitude: "-122.4194",
    latitude: "37.7749",
    merchantWebsiteUrl: "www.maahotel.com",
    merchantSystemIp: "192.0.2.146",
    director1: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    director2: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "200000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "100000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Savings Account",
      beneficiaryName: "Ayush Khan",
      bankAccountNumber: "89273897243",
      ifscCode: "SBIN000282",
      bankName: "State Bank of India",
      branchName: "Bada Bazaar",
      pincode: "753009",
      state: "Odisha",
      city: "Cuttack"
    },
    createVpa: "rudransh.panigrahi@okisu"
  },
  {
    id: "MCH-006",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Rejected",
    kycStatus: "REJECTED",
    agreementStatus: "Pending",
    productType: "UPI",
    vpa: "rudransh.panigrahi@okisu",
    merchantId: "MID987216",
    mcc: "5411",
    date: "2026-03-09",
    createdDate: "07/08/2025",
    businessLegalName: "Jai Maa Hotel",
    brandName: "Maa Hotel",
    storeName: "Maa Hotel",
    businessAddress: "E-12, Infocity",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    businessEntityType: "Sole Proprietorship",
    establishmentYear: "2020",
    businessRegisteredMobile: "+91 98756 12345",
    businessRegisteredEmail: "maahotel@gmail.com",
    businessPan: "ABC7982RR",
    businessRegNumber: "AK/46664/33/MF",
    turnoverYear: "2024",
    turnoverAmount: "₹ 9,29,82,220",
    gstin: "27ABCDE1234F1Z5",
    natureOfBusiness: "Retail",
    longitude: "-122.4194",
    latitude: "37.7749",
    merchantWebsiteUrl: "www.maahotel.com",
    merchantSystemIp: "192.0.2.146",
    director1: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    director2: {
      name: "Ayush Khan",
      address: "E-2, Infocity",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "rahul.sharma@gmail.com",
      pan: "YBN90218TT",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876543210"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "200000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "100000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Savings Account",
      beneficiaryName: "Ayush Khan",
      bankAccountNumber: "89273897243",
      ifscCode: "SBIN000282",
      bankName: "State Bank of India",
      branchName: "Bada Bazaar",
      pincode: "753009",
      state: "Odisha",
      city: "Cuttack"
    },
    createVpa: "rudransh.panigrahi@okisu"
  }
];

const SEARCH_BY_OPTIONS = [
  "Created Date",
  "Updated Date",
  "Status",
  "MCC",
  "Merchant ID",
  "VPA"
];

const KYC_STATUS_OPTIONS = [
  "PENDING AT Maker",
  "APPROVED BY Checker",
  "PENDING AT Checker",
  "REJECTED",
  "REFERRED BACK",
  "EKYC COMPLETED",
  "All",
  "APPROVED",
  "PENDING AT Checker 3",
  "APPROVED BY Checker 4",
  "PENDING AT Checker 4",
  "PENDING AT Checker 1",
  "PENDING AT Checker 2"
];

interface CheckerMerchantReviewViewProps {
  currentRole: string;
  onBack?: () => void;
  preselectedMerchantId?: string;
}

export function CheckerMerchantReviewView({
  currentRole,
  onBack,
  preselectedMerchantId
}: CheckerMerchantReviewViewProps) {
  const [merchants, setMerchants] = useState<MerchantReviewItem[]>(() => getStoredMerchants());
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantReviewItem | null>(() => {
    if (preselectedMerchantId) {
      const all = getStoredMerchants();
      return all.find((m) => m.id === preselectedMerchantId || m.merchantId === preselectedMerchantId) || null;
    }
    return null;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const latest = getStoredMerchants();
      setMerchants(latest);
      if (selectedMerchant) {
        const found = latest.find((m) => m.id === selectedMerchant.id || m.merchantId === selectedMerchant.merchantId);
        if (found) setSelectedMerchant(found);
      }
    };
    window.addEventListener("ta_merchants_updated", handleUpdate);
    return () => window.removeEventListener("ta_merchants_updated", handleUpdate);
  }, [selectedMerchant]);

  useEffect(() => {
    if (preselectedMerchantId) {
      const found = merchants.find((m) => m.id === preselectedMerchantId || m.merchantId === preselectedMerchantId);
      if (found) setSelectedMerchant(found);
    }
  }, [preselectedMerchantId, merchants]);

  // Search filter states (Matching User Screenshots with Green Theme)
  const [searchBy, setSearchBy] = useState("Created Date");
  const [isSearchByOpen, setIsSearchByOpen] = useState(false);
  const [fromDate, setFromDate] = useState("9/22/2026");
  const [toDate, setToDate] = useState("9/22/2026");
  const [kycStatus, setKycStatus] = useState("All");
  const [isKycStatusOpen, setIsKycStatusOpen] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(true);
  const [appliedSearchBy, setAppliedSearchBy] = useState("Created Date");
  const [appliedFromDate, setAppliedFromDate] = useState("9/22/2026");
  const [appliedToDate, setAppliedToDate] = useState("9/22/2026");
  const [appliedKycStatus, setAppliedKycStatus] = useState("All");

  const fromDateInputRef = useRef<HTMLInputElement>(null);
  const toDateInputRef = useRef<HTMLInputElement>(null);

  const [productTypeFilter, setProductTypeFilter] = useState("UPI");
  const [generalSearch, setGeneralSearch] = useState("");

  // Modals state
  const [isViewPlanModalOpen, setIsViewPlanModalOpen] = useState(false);
  const [isRejectToMakerModalOpen, setIsRejectToMakerModalOpen] = useState(false);
  const [rejectToMakerReason, setRejectToMakerReason] = useState("");
  const [isMapUserModalOpen, setIsMapUserModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Sample Plan");
  const [planSearch, setPlanSearch] = useState("");
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);

  const isChecker = currentRole === "Checker" || currentRole === "Checker 4";
  const isMaker = currentRole === "Maker" || currentRole === "Checker 3";

  const [isUserMappedSuccessOpen, setIsUserMappedSuccessOpen] = useState(false);
  const [isLegalDocModalOpen, setIsLegalDocModalOpen] = useState(false);
  const [docPage, setDocPage] = useState(1);
  const [docZoom, setDocZoom] = useState(100);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveComments, setApproveComments] = useState("");

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectSection, setRejectSection] = useState("Reject All");
  const [rejectSectionDropdownOpen, setRejectSectionDropdownOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Edit Product Info Modal
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editProductForm, setEditProductForm] = useState({
    productType: "UPI",
    dailyMaxAmountUsage: "200000",
    minPerTransactionLimit: "1",
    maxPerTransactionLimit: "50000",
    creditLimitAmount: "100000000"
  });

  // Edit Personal Info Modal
  const [isEditPersonalOpen, setIsEditPersonalOpen] = useState(false);
  const [editPersonalForm, setEditPersonalForm] = useState({
    d1Name: "Ayush Khan",
    d1Address: "E-2, Infocity",
    d1Mobile: "+91 89879 87211",
    d1Email: "rahul.sharma@gmail.com",
    d2Name: "Ayush Khan",
    d2Address: "E-2, Infocity",
    d2Mobile: "+91 89879 87211",
    d2Email: "rahul.sharma@gmail.com"
  });

  // Document Viewer Modal
  const [previewDocTitle, setPreviewDocTitle] = useState<string | null>(null);

  // Notification toast
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleSubmitFilters = () => {
    setAppliedSearchBy(searchBy);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setAppliedKycStatus(kycStatus);
    setHasSubmitted(true);
    showToast(`Filters submitted. Viewing records for status: ${kycStatus}`);
  };

  // Filtered merchants based on submitted criteria and general search
  const filteredMerchants = useMemo(() => {
    if (!hasSubmitted) return [];
    return merchants.filter((m) => {
      // Status & KYC filter
      if (appliedKycStatus && appliedKycStatus !== "All") {
        const target = appliedKycStatus.toUpperCase();
        const currentKyc = (m.kycStatus || m.status || "").toUpperCase();
        if (target === "REJECTED") {
          if (currentKyc !== "REJECTED" && m.status !== "Rejected") return false;
        } else if (target === "APPROVED") {
          if (currentKyc !== "APPROVED" && m.status !== "Approved") return false;
        } else if (target === "PENDING") {
          if (!currentKyc.includes("PENDING") && m.status !== "Pending") return false;
        } else {
          if (currentKyc !== target && !currentKyc.includes(target)) return false;
        }
      }

      // General search
      if (generalSearch.trim()) {
        const q = generalSearch.toLowerCase();
        const matches =
          m.name.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q) ||
          m.adminName.toLowerCase().includes(q) ||
          m.mobileNumber.toLowerCase().includes(q) ||
          m.businessRegisteredEmail.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          (m.vpa && m.vpa.toLowerCase().includes(q)) ||
          (m.mcc && m.mcc.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [merchants, hasSubmitted, appliedKycStatus, generalSearch]);

  const handleExportCsv = () => {
    const headers = ["Name", "Username", "Admin Name", "Mobile Number", "Status", "Agreement Status", "Product Type"];
    const rows = filteredMerchants.map((m) => [
      m.name,
      m.username,
      m.adminName,
      m.mobileNumber,
      m.status,
      m.agreementStatus,
      m.productType
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `review_merchants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported merchant review list to CSV.");
  };

  const handleOpenEditProduct = () => {
    if (!selectedMerchant) return;
    setEditProductForm({
      productType: selectedMerchant.productInfo.productType,
      dailyMaxAmountUsage: selectedMerchant.productInfo.dailyMaxAmountUsage,
      minPerTransactionLimit: selectedMerchant.productInfo.minPerTransactionLimit,
      maxPerTransactionLimit: selectedMerchant.productInfo.maxPerTransactionLimit,
      creditLimitAmount: selectedMerchant.productInfo.creditLimitAmount
    });
    setIsEditProductOpen(true);
  };

  const handleSaveProductInfo = () => {
    if (!selectedMerchant) return;
    const updated = {
      ...selectedMerchant,
      productInfo: { ...editProductForm }
    };
    setSelectedMerchant(updated);
    setMerchants(merchants.map((m) => (m.id === updated.id ? updated : m)));
    setIsEditProductOpen(false);
    showToast("Product Info updated successfully.");
  };

  const handleOpenEditPersonal = () => {
    if (!selectedMerchant) return;
    setEditPersonalForm({
      d1Name: selectedMerchant.director1.name,
      d1Address: selectedMerchant.director1.address,
      d1Mobile: selectedMerchant.director1.mobileNumber,
      d1Email: selectedMerchant.director1.emailId,
      d2Name: selectedMerchant.director2.name,
      d2Address: selectedMerchant.director2.address,
      d2Mobile: selectedMerchant.director2.mobileNumber,
      d2Email: selectedMerchant.director2.emailId
    });
    setIsEditPersonalOpen(true);
  };

  const handleSavePersonalInfo = () => {
    if (!selectedMerchant) return;
    const updated = {
      ...selectedMerchant,
      director1: {
        ...selectedMerchant.director1,
        name: editPersonalForm.d1Name,
        address: editPersonalForm.d1Address,
        mobileNumber: editPersonalForm.d1Mobile,
        emailId: editPersonalForm.d1Email
      },
      director2: {
        ...selectedMerchant.director2,
        name: editPersonalForm.d2Name,
        address: editPersonalForm.d2Address,
        mobileNumber: editPersonalForm.d2Mobile,
        emailId: editPersonalForm.d2Email
      }
    };
    setSelectedMerchant(updated);
    setMerchants(merchants.map((m) => (m.id === updated.id ? updated : m)));
    setIsEditPersonalOpen(false);
    showToast("Personal Info updated successfully.");
  };

  // Plan mapping submission
  const handleMapPlanSubmit = () => {
    if (!selectedMerchant) return;
    const updated = {
      ...selectedMerchant,
      mappedPlan: selectedPlan
    };
    setSelectedMerchant(updated);
    setMerchants(merchants.map((m) => (m.id === updated.id ? updated : m)));
    setIsMapUserModalOpen(false);
    setIsUserMappedSuccessOpen(true);
  };

  // Approve submission
  const handleApproveSubmit = () => {
    if (!selectedMerchant) return;
    const updated: MerchantReviewItem = {
      ...selectedMerchant,
      status: "Approved",
      agreementStatus: "Success"
    };
    setSelectedMerchant(updated);
    setMerchants(merchants.map((m) => (m.id === updated.id ? updated : m)));
    setIsApproveModalOpen(false);
    showToast(`Merchant ${selectedMerchant.name} approved successfully.`);
  };

  // Reject submission
  const handleRejectSubmit = () => {
    if (!selectedMerchant) return;
    const updated: MerchantReviewItem = {
      ...selectedMerchant,
      status: "Rejected"
    };
    setSelectedMerchant(updated);
    setMerchants(merchants.map((m) => (m.id === updated.id ? updated : m)));
    setIsRejectModalOpen(false);
    showToast(`Merchant sent for re-submission under ${rejectSection}.`);
  };

  const availablePlans = [
    "Sample Plan",
    "Standard Merchant Plan",
    "UPI Prime Tier 1",
    "Retail Starter Plan",
    "Enterprise High Volume"
  ].filter((p) => p.toLowerCase().includes(planSearch.toLowerCase()));

  // ==========================================
  // DETAIL VIEW (Screenshots 3, 4, 5, 6)
  // ==========================================
  if (selectedMerchant) {
    return (
      <div className="w-full bg-[#FAF9F6]/50 min-h-full pb-16 font-sans">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-8 z-50 bg-[#36612B] text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Back navigation header */}
        <div className="mb-4">
          <button
            onClick={() => setSelectedMerchant(null)}
            className="inline-flex items-center text-[#447837] hover:text-[#36612B] font-medium text-[15px] group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
            <span>Merchant review</span>
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-[15px] font-bold text-[#447837]">Merchant Info</h2>
        </div>

        {/* Space container with Cards */}
        <div className="space-y-4">
          {/* Card 1: Business Info */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-2xs">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Business Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 text-sm">
              <div>
                <span className="text-gray-600">Business Legal Name<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.businessLegalName}</p>
              </div>
              <div>
                <span className="text-gray-600">Brand Name<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.brandName}</p>
              </div>
              <div>
                <span className="text-gray-600">Store Name</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.storeName}</p>
              </div>
              <div>
                <span className="text-gray-600">Business Registered Address<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.businessAddress}</p>
              </div>
              <div>
                <span className="text-gray-600">Pincode<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.pincode}</p>
              </div>
              <div>
                <span className="text-gray-600">State<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.state}</p>
              </div>
              <div>
                <span className="text-gray-600">District<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.district}</p>
              </div>
              <div>
                <span className="text-gray-600">City<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.city}</p>
              </div>
              <div>
                <span className="text-gray-600">Onboarding Type</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.onboardingType || "Offline"}</p>
              </div>
              <div>
                <span className="text-gray-600">Business Entity Type<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.businessEntityType}</p>
              </div>
              <div>
                <span className="text-gray-600">Establishment Year</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.establishmentYear}</p>
              </div>
              <div>
                <span className="text-gray-600">Business Registered Mobile Number<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.businessRegisteredMobile}</p>
              </div>
              <div>
                <span className="text-gray-600">Business Registered Email</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.businessRegisteredEmail}</p>
              </div>
              <div>
                <span className="text-gray-600">Business PAN</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.businessPan}</p>
              </div>
              <div>
                <span className="text-gray-600">Business Registration Number (CIN)<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.cin || selectedMerchant.cinNumber || selectedMerchant.businessRegNumber || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600">Turnover Year<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.turnoverYear}</p>
              </div>
              <div>
                <span className="text-gray-600">Turnover Amount<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.turnoverAmount}</p>
              </div>
              <div>
                <span className="text-gray-600">GSTIN<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.gstin}</p>
              </div>
              <div>
                <span className="text-gray-600">Nature of Business<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.natureOfBusiness}</p>
              </div>
              <div>
                <span className="text-gray-600">MCC<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.mcc || "5411"}</p>
              </div>
              <div>
                <span className="text-gray-600">Longitude</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.longitude}</p>
              </div>
              <div>
                <span className="text-gray-600">Latitude</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.latitude}</p>
              </div>
              <div>
                <span className="text-gray-600">Merchant Website URL</span>
                <p className="font-medium text-blue-600 hover:underline mt-1 cursor-pointer">
                  {selectedMerchant.merchantWebsiteUrl}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Merchant System IP</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.merchantSystemIp}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Personal Info */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-2xs relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">Personal Info</h3>
              <button
                onClick={handleOpenEditPersonal}
                className="flex items-center space-x-1 text-sm font-semibold text-[#447837] hover:text-[#36612B] border border-[#447837]/30 hover:border-[#447837] px-3 py-1 rounded-md transition cursor-pointer bg-[#F0F6EE]/40 hover:bg-[#F0F6EE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Render all directors dynamically */}
            {((selectedMerchant.directors && selectedMerchant.directors.length > 0)
              ? selectedMerchant.directors
              : [selectedMerchant.director1, selectedMerchant.director2].filter(Boolean)
            ).map((dir, idx) => {
              const dirNum = idx + 1;
              return (
                <div key={dirNum} className={`pt-4 first-of-type:pt-0 ${idx > 0 ? "border-t border-gray-200 mt-6" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-[#447837]">Director {dirNum} Details</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      dirNum === 1
                        ? "bg-emerald-50 text-[#447837] border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      {dirNum === 1 ? "Director 1 (Primary / E-Sign)" : `Director ${dirNum}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <span className="text-gray-600">Name<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.name || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Address<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.address || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Pincode<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.pincode || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">State<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.state || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">District<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.district || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">City<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.city || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Mobile Number<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.mobileNumber || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email ID<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.emailId || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">PAN<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.pan || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">DIN (Director Identification Number)<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.din || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">KYC Document Type<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.kycDocumentType || "Aadhaar Card"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">KYC Document Number<span className="text-red-500">*</span></span>
                      <p className="font-medium text-gray-900 mt-1">{dir.kycDocumentNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card 3: Product Info */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-2xs relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Product Info</h3>
              <button
                onClick={handleOpenEditProduct}
                className="flex items-center space-x-1 text-sm font-semibold text-[#447837] hover:text-[#36612B] border border-[#447837]/30 hover:border-[#447837] px-3 py-1 rounded-md transition cursor-pointer bg-[#F0F6EE]/40 hover:bg-[#F0F6EE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-gray-600">Product Type</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.productInfo.productType}</p>
              </div>
              <div>
                <span className="text-gray-600">Daily Maximum Amount Usage</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.productInfo.dailyMaxAmountUsage}</p>
              </div>
              <div>
                <span className="text-gray-600">Minimum Per Transaction Limit</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.productInfo.minPerTransactionLimit}</p>
              </div>
              <div>
                <span className="text-gray-600">Maximum Per Transaction Limit</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.productInfo.maxPerTransactionLimit}</p>
              </div>
              <div>
                <span className="text-gray-600">Credit Limit Amount</span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.productInfo.creditLimitAmount}</p>
              </div>
            </div>
          </div>

          {/* Card 4: Bank Info */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-base font-semibold text-gray-900">Bank Info</h3>
              {selectedMerchant.bankInfo.verified && (
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#36612B] bg-[#EBF4E9] px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36612B]" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-gray-600">Account Type<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.accountType}</p>
              </div>
              <div>
                <span className="text-gray-600">Beneficiary Name<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.beneficiaryName}</p>
              </div>
              <div>
                <span className="text-gray-600">Bank Account Number<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.bankAccountNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">IFSC Code<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.ifscCode}</p>
              </div>
              <div>
                <span className="text-gray-600">Bank Name<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.bankName}</p>
              </div>
              <div>
                <span className="text-gray-600">Branch Name<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.branchName}</p>
              </div>
              <div>
                <span className="text-gray-600">Pincode<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.pincode}</p>
              </div>
              <div>
                <span className="text-gray-600">State<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.state}</p>
              </div>
              <div>
                <span className="text-gray-600">City<span className="text-red-500">*</span></span>
                <p className="font-medium text-gray-900 mt-1">{selectedMerchant.bankInfo.city}</p>
              </div>
            </div>
          </div>

          {/* Card 5: Create VPA */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-2xs">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Create VPA</h3>
            <div className="text-sm">
              <span className="text-gray-600">Create VPA<span className="text-red-500">*</span></span>
              <p className="font-medium text-gray-900 mt-1">{selectedMerchant.createVpa}</p>
            </div>
          </div>

          {/* Card 6: KYC Documents */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">KYC Documents</h3>
                <p className="text-xs text-gray-500 mt-0.5">Uploaded business & personal identification documents</p>
              </div>
              <button
                onClick={() => showToast("Downloading all KYC documents zip...")}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] text-xs font-semibold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All</span>
              </button>
            </div>

            {/* Upload Business Document */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-[#447837] mb-3">Upload Business Document</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 text-sm">
                <DocItemRow
                  label="Business PAN"
                  fileName={selectedMerchant.uploadedFiles?.["businessPan"]}
                  onView={() => setPreviewDocTitle(`Business PAN (${selectedMerchant.businessPan || "PAN"})`)}
                />
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Business Address Proof Type</span>
                  <span className="font-medium text-gray-900">{selectedMerchant.kycSelects?.["businessAddressProofType"] || "Rent Agreement"}</span>
                </div>
                <DocItemRow
                  label="Business Address Proof"
                  fileName={selectedMerchant.uploadedFiles?.["businessAddressProof"]}
                  onView={() => setPreviewDocTitle(`Business Address Proof (${selectedMerchant.kycSelects?.["businessAddressProofType"] || "Rent Agreement"})`)}
                />
                <DocItemRow
                  label="Certificate of Incorporation *"
                  fileName={selectedMerchant.uploadedFiles?.["certIncorporation"]}
                  onView={() => setPreviewDocTitle("Certificate of Incorporation")}
                />
                <DocItemRow
                  label="Memorandum of Association (MOA) *"
                  fileName={selectedMerchant.uploadedFiles?.["moa"]}
                  onView={() => setPreviewDocTitle("Memorandum of Association (MOA)")}
                />
                <DocItemRow
                  label="Signed Attached Copy of AOA (Articles of Association)"
                  fileName={selectedMerchant.uploadedFiles?.["aoa"]}
                  onView={() => setPreviewDocTitle("Signed Attached Copy of AOA")}
                />
                <DocItemRow
                  label="MCA Details (Ministry of Corporate Affairs)"
                  fileName={selectedMerchant.uploadedFiles?.["mcaDetails"]}
                  onView={() => setPreviewDocTitle("MCA Details (Ministry of Corporate Affairs)")}
                />
                <DocItemRow
                  label="Registration Certificate"
                  fileName={selectedMerchant.uploadedFiles?.["regCert"]}
                  onView={() => setPreviewDocTitle("Registration Certificate")}
                />
                <DocItemRow
                  label="GST Registration Document"
                  fileName={selectedMerchant.uploadedFiles?.["gstDoc"]}
                  onView={() => setPreviewDocTitle(`GST Registration Document (${selectedMerchant.gstin || "GSTIN"})`)}
                />
                <DocItemRow
                  label="Partnership Deed"
                  fileName={selectedMerchant.uploadedFiles?.["partnershipDeed"]}
                  onView={() => setPreviewDocTitle("Partnership Deed")}
                />
                <DocItemRow
                  label="Business License Document"
                  fileName={selectedMerchant.uploadedFiles?.["licenseDoc"]}
                  onView={() => setPreviewDocTitle("Business License Document")}
                />
                <DocItemRow
                  label="Store Inside Image"
                  fileName={selectedMerchant.uploadedFiles?.["storeInsideImage"]}
                  onView={() => setPreviewDocTitle("Store Inside Image")}
                />
                <DocItemRow
                  label="Store Outside Image"
                  fileName={selectedMerchant.uploadedFiles?.["storeOutsideImage"]}
                  onView={() => setPreviewDocTitle("Store Outside Image")}
                />
                <DocItemRow
                  label="TA MA Declaration"
                  fileName={selectedMerchant.uploadedFiles?.["taMaDeclaration"]}
                  onView={() => setPreviewDocTitle("TA MA Declaration")}
                />
                <DocItemRow
                  label="Turnover Declaration Document"
                  fileName={selectedMerchant.uploadedFiles?.["turnoverDeclaration"]}
                  onView={() => setPreviewDocTitle("Turnover Declaration Document")}
                />
                <DocItemRow
                  label="SBO/UBO Declaration Form (Significant / Ultimate Beneficial Owner) *"
                  fileName={selectedMerchant.uploadedFiles?.["sboUboDeclaration"]}
                  onView={() => setPreviewDocTitle("SBO/UBO Declaration Form")}
                />
              </div>
            </div>

            {/* Directors Documents (Matching created directors) */}
            {((selectedMerchant.directors && selectedMerchant.directors.length > 0)
              ? selectedMerchant.directors
              : [selectedMerchant.director1, selectedMerchant.director2].filter(Boolean)
            ).map((dir, idx) => {
              const dirNum = idx + 1;
              const isPrimary = dirNum === 1;
              return (
                <div key={dirNum} className="pt-4 border-t border-gray-100 mb-6 first-of-type:pt-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-[#447837]">
                      Person {dirNum} Documents ({dir.name || `Director ${dirNum}`})
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isPrimary
                          ? "bg-emerald-50 text-[#447837] border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {isPrimary ? "Director 1 (Mandatory & E-Sign)" : `Director ${dirNum} (Optional)`}
                    </span>
                  </div>

                  {isPrimary && (
                    <p className="text-xs text-gray-600 mb-3">
                      <strong className="text-gray-900">Note:</strong> Director 1 will be the default primary director for E-Signing. All updates and communication will be sent exclusively to their contact details ({dir.emailId || selectedMerchant.businessRegisteredEmail}).
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 text-sm mt-2">
                    <DocItemRow
                      label={`Individual PAN Card${isPrimary ? " *" : ""}`}
                      fileName={selectedMerchant.uploadedFiles?.[`individualPanCard_${dirNum}`] || (isPrimary ? selectedMerchant.uploadedFiles?.["individualPanCard"] : undefined)}
                      onView={() => setPreviewDocTitle(`Director ${dirNum} (${dir.name}) - Individual PAN Card (${dir.pan || "PAN"})`)}
                    />
                    <DocItemRow
                      label={`Kyc Document Front Page (${dir.kycDocumentType || "Aadhaar / ID"})${isPrimary ? " *" : ""}`}
                      fileName={selectedMerchant.uploadedFiles?.[`individualKycFront_${dirNum}`] || (isPrimary ? selectedMerchant.uploadedFiles?.["individualKycFront"] : undefined)}
                      onView={() => setPreviewDocTitle(`Director ${dirNum} (${dir.name}) - Kyc Document Front Page`)}
                    />
                    <DocItemRow
                      label={`Kyc Document Back Page${isPrimary ? " *" : ""}`}
                      fileName={selectedMerchant.uploadedFiles?.[`individualKycBack_${dirNum}`] || (isPrimary ? selectedMerchant.uploadedFiles?.["individualKycBack"] : undefined)}
                      onView={() => setPreviewDocTitle(`Director ${dirNum} (${dir.name}) - Kyc Document Back Page`)}
                    />
                    <div className="flex items-center justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">Individual Address Proof Type</span>
                      <span className="font-medium text-gray-900">{selectedMerchant.kycSelects?.[`individualAddressProofType_${dirNum}`] || dir.kycDocumentType || "Aadhaar Card"}</span>
                    </div>
                    <DocItemRow
                      label={`Individual Address Proof${isPrimary ? " *" : ""}`}
                      fileName={selectedMerchant.uploadedFiles?.[`individualAddressProof_${dirNum}`] || (isPrimary ? selectedMerchant.uploadedFiles?.["individualAddressProof"] : undefined)}
                      onView={() => setPreviewDocTitle(`Director ${dirNum} (${dir.name}) - Address Proof`)}
                    />
                    <DocItemRow
                      label={`Individual Photo${isPrimary ? " *" : ""}`}
                      fileName={selectedMerchant.uploadedFiles?.[`individualPhoto_${dirNum}`] || (isPrimary ? selectedMerchant.uploadedFiles?.["individualPhoto"] : undefined)}
                      onView={() => setPreviewDocTitle(`Director ${dirNum} (${dir.name}) - Photo`)}
                    />
                  </div>
                </div>
              );
            })}

            {/* Additional Documents if any */}
            {selectedMerchant.additionalDocs && selectedMerchant.additionalDocs.length > 0 && (
              <div className="pt-4 border-t border-gray-100 mb-6">
                <h4 className="text-sm font-bold text-[#447837] mb-3">Additional Uploaded Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 text-sm">
                  {selectedMerchant.additionalDocs.map((doc, idx) => (
                    <DocItemRow
                      key={doc.id}
                      label={`Additional Document ${idx + 1}`}
                      fileName={selectedMerchant.uploadedFiles?.[doc.key]}
                      onView={() => setPreviewDocTitle(`Additional Document ${idx + 1}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Plan Section (Screenshots 6 & 12) */}
          {isChecker && (
            <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">View Plan</h3>
                <button
                  onClick={() => setIsViewPlanModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F0F6EE] text-[#447837] hover:bg-[#E4EFE2] rounded-md text-xs font-semibold cursor-pointer transition shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#447837]" />
                  <span>View</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons Bar */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            {isChecker ? (
              <>
                <button
                  onClick={() => setIsRejectToMakerModalOpen(true)}
                  className="px-6 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-sm font-semibold transition cursor-pointer"
                >
                  Reject to Maker
                </button>

                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-6 py-2.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-sm font-semibold transition cursor-pointer"
                >
                  Reject
                </button>

                <button
                  onClick={() => setIsLegalDocModalOpen(true)}
                  className="px-8 py-2.5 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-6 py-2.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-sm font-semibold transition cursor-pointer"
                >
                  Reject
                </button>

                <button
                  onClick={() => setIsMapUserModalOpen(true)}
                  className="px-6 py-2.5 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  Map Plan
                </button>

                <button
                  onClick={() => setIsApproveModalOpen(true)}
                  className="px-6 py-2.5 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* MODAL 1: MAP USER MODAL (Screenshot 7)           */}
        {/* ================================================= */}
        {isMapUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setIsMapUserModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-5">Map User</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Type</label>
                  <input
                    type="text"
                    value="Merchant"
                    disabled
                    className="w-full px-3.5 py-2 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700 font-medium"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Plan</label>
                  <button
                    onClick={() => setPlanDropdownOpen(!planDropdownOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white hover:border-gray-400"
                  >
                    <span>{selectedPlan || "Select Plan"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {planDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2">
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Search for Plan"
                          value={planSearch}
                          onChange={(e) => setPlanSearch(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 rounded border border-gray-200 text-xs focus:outline-hidden focus:border-[#447837]"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {availablePlans.map((plan) => (
                          <button
                            key={plan}
                            onClick={() => {
                              setSelectedPlan(plan);
                              setPlanDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded text-xs transition ${
                              selectedPlan === plan ? "bg-[#F0F6EE] text-[#447837] font-semibold" : "hover:bg-gray-100 text-gray-800"
                            }`}
                          >
                            {plan}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 space-y-2">
                  <button
                    onClick={handleMapPlanSubmit}
                    className="w-full py-2.5 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white text-sm font-semibold transition cursor-pointer"
                  >
                    Map
                  </button>
                  <button
                    onClick={() => setIsMapUserModalOpen(false)}
                    className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 2: USER MAPPED SUCCESSFULLY (Screenshot 8) */}
        {/* ================================================= */}
        {isUserMappedSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center relative">
              <button
                onClick={() => setIsUserMappedSuccessOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-5">User Mapped Successfully</h3>

              {/* Graphic circle check with confetti accents */}
              <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-md">
                  <Check className="w-9 h-9 stroke-[3]" />
                </div>
                {/* Visual confetti dots */}
                <span className="absolute top-0 right-2 w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="absolute bottom-1 left-2 w-2 h-2 rounded-full bg-[#EC4899]" />
                <span className="absolute top-3 left-1 w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <span className="absolute bottom-2 right-1 w-2 h-2 rounded-full bg-[#8B5CF6]" />
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-6 px-2">
                The user has been mapped successfully and now is eligible for approval. Please continue to preview the document.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsUserMappedSuccessOpen(false);
                    setIsLegalDocModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  Preview Document
                </button>
                <button
                  onClick={() => setIsUserMappedSuccessOpen(false)}
                  className="w-full py-2 rounded-lg text-gray-600 hover:text-gray-800 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 3: LEGAL AGREEMENT DOCUMENT (Screenshot 9)  */}
        {/* ================================================= */}
        {isLegalDocModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
              {/* Top toolbar */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200">
                <button
                  onClick={() => setIsLegalDocModalOpen(false)}
                  className="flex items-center text-sm font-semibold text-gray-800 hover:text-black cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Document</span>
                </button>
                <button
                  onClick={() => setIsLegalDocModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-header instruction banner */}
              <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-200 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
                <span>Read, Review and add your signature to the document. You may either add a text signature or a normal signature.</span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={docPage <= 1}
                    onClick={() => setDocPage(p => Math.max(1, p - 1))}
                    className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-gray-700">Page {docPage} of 10</span>
                  <button
                    disabled={docPage >= 10}
                    onClick={() => setDocPage(p => Math.min(10, p + 1))}
                    className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-40"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setDocZoom(z => Math.min(150, z + 10))}
                    className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 flex items-center space-x-1"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom in</span>
                  </button>
                  <button
                    onClick={() => setDocZoom(z => Math.max(70, z - 10))}
                    className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 flex items-center space-x-1"
                  >
                    <ZoomOut className="w-3 h-3" />
                    <span>Zoom out</span>
                  </button>
                </div>
              </div>

              {/* Document Paper Container */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-100 flex justify-center">
                <div
                  className="bg-white border border-gray-200 shadow-md p-10 max-w-2xl w-full font-serif text-gray-800 transition-transform"
                  style={{ transform: `scale(${docZoom / 100})`, transformOrigin: "top center" }}
                >
                  <h1 className="text-2xl font-bold tracking-widest text-[#447837] text-center mb-2 uppercase">
                    LEGAL AGREEMENT
                  </h1>
                  <div className="h-1 bg-[#447837] w-full mb-6" />

                  <p className="text-sm leading-relaxed mb-6">
                    This Agreement (&ldquo;Agreement&rdquo;) is entered into as of the <strong>21st day of March, 2026</strong>, by and between{" "}
                    <strong>{selectedMerchant.businessLegalName}</strong>, with an address of <strong>{selectedMerchant.businessAddress}, {selectedMerchant.city}</strong> (the &ldquo;First Party&rdquo;), and <strong>Transaction Analysts India Pvt Ltd</strong>, with an address of Bengaluru, Karnataka (the &ldquo;Second Party&rdquo;) (collectively, the &ldquo;Parties&rdquo;).
                  </p>

                  <div className="space-y-5 text-sm leading-relaxed font-sans">
                    <div>
                      <h2 className="text-base font-bold text-[#447837] font-serif mb-1">
                        1. Scope of Services
                      </h2>
                      <p className="text-gray-700">
                        The First Party agrees to perform merchant acquiring and transaction settlement services according to NPCI and banking partner guidelines under plan <strong>{selectedMerchant.mappedPlan || "Sample Plan"}</strong>.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#447837] font-serif mb-1">
                        2. Compensation
                      </h2>
                      <p className="text-gray-700">
                        In consideration for the services provided, the Second Party agrees to pay the First Party the MDR commission percentage as stipulated in Schedule B of the agreed commercial structure.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#447837] font-serif mb-1">
                        3. Confidentiality
                      </h2>
                      <p className="text-gray-700">
                        Both Parties agree to maintain the confidentiality of any proprietary or confidential customer and financial information disclosed during the term of this Agreement.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#447837] font-serif mb-1">
                        4. Governing Law & Jurisdiction
                      </h2>
                      <p className="text-gray-700">
                        This Agreement shall be construed and governed in accordance with the laws of India, and courts of Bhubaneswar / Bengaluru shall have exclusive jurisdiction.
                      </p>
                    </div>

                    {/* Signatures section */}
                    <div className="pt-8 mt-6 border-t border-gray-200 grid grid-cols-2 gap-8">
                      <div>
                        <div className="h-10 border-b border-gray-400 flex items-end">
                          <span className="font-script text-lg text-blue-800 italic">Ayush Khan</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Authorized Signatory (First Party)</p>
                      </div>
                      <div>
                        <div className="h-10 border-b border-gray-400 flex items-end">
                          <span className="font-script text-lg text-[#447837] italic">Shakti Kumar (Maker)</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Verified Maker Reviewer (Second Party)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer modal actions */}
              <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
                <button
                  onClick={() => showToast("Legal Agreement downloaded as PDF.")}
                  className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Agreement PDF</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLegalDocModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsLegalDocModalOpen(false);
                      setIsApproveModalOpen(true);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#447837] hover:bg-[#36612B] rounded-lg shadow-xs cursor-pointer"
                  >
                    Proceed to Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 4: APPROVE USER MODAL (Screenshot 10)       */}
        {/* ================================================= */}
        {isApproveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center relative">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Approve User</h3>

              {/* Graphic Illustration */}
              <div className="relative w-24 h-20 mx-auto mb-4 flex items-center justify-center">
                <div className="w-14 h-16 bg-gray-50 border border-gray-300 rounded-md shadow-xs p-1 flex flex-col justify-around">
                  <div className="w-6 h-3 bg-[#447837] rounded-xs" />
                  <div className="w-full h-1 bg-gray-200 rounded" />
                  <div className="w-3/4 h-1 bg-gray-200 rounded" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white shadow">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div className="text-left mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Additional Comments</label>
                <input
                  type="text"
                  placeholder="Additional Comments"
                  value={approveComments}
                  onChange={(e) => setApproveComments(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#447837]"
                />
              </div>

              <button
                onClick={handleApproveSubmit}
                className="w-full py-2.5 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white text-sm font-semibold transition cursor-pointer"
              >
                Approve
              </button>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 5: REJECT USER MODAL (Screenshot 10)        */}
        {/* ================================================= */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center relative">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-3">Reject User</h3>

              {/* Graphic Illustration with red (X) */}
              <div className="relative w-24 h-20 mx-auto mb-3 flex items-center justify-center">
                <div className="w-14 h-16 bg-gray-50 border border-gray-300 rounded-md shadow-xs p-1 flex flex-col justify-around">
                  <div className="w-6 h-3 bg-[#447837] rounded-xs" />
                  <div className="w-full h-1 bg-gray-200 rounded" />
                  <div className="w-3/4 h-1 bg-gray-200 rounded" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#EF4444] border-2 border-white flex items-center justify-center text-white shadow">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {isChecker ? (
                <>
                  <p className="text-xs text-gray-500 mb-4 px-2 leading-relaxed">
                    This action is irreversible. It will reject the merchant, and the onboarding process will need to be restarted.
                  </p>

                  <div className="text-left mb-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Reason of Rejection<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Reason of Rejection"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#447837]"
                    />
                  </div>
                </>
              ) : (
                <div className="text-left space-y-4 mb-6">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Select section with Issue<span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={() => setRejectSectionDropdownOpen(!rejectSectionDropdownOpen)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white hover:border-gray-400 text-gray-800"
                    >
                      <span>{rejectSection || "Select section with Issue"}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {rejectSectionDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                        {[
                          "Reject All",
                          "Reject Business Info",
                          "Reject Personal Info",
                          "Reject Product Info",
                          "Reject Bank Info",
                          "Reject Create VPA",
                          "Reject KYC Documents"
                        ].map((sec) => (
                          <button
                            key={sec}
                            onClick={() => {
                              setRejectSection(sec);
                              setRejectSectionDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 text-xs transition ${
                              rejectSection === sec ? "bg-[#F0F6EE] text-[#447837] font-semibold" : "hover:bg-gray-100 text-gray-800"
                            }`}
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Reason of Rejection<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Reason of Rejection"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#447837]"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleRejectSubmit}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition cursor-pointer shadow-xs"
              >
                Send for Re-Submission
              </button>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 5B: REJECT TO MAKER                         */}
        {/* ================================================= */}
        {isRejectToMakerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center relative">
              <button
                onClick={() => setIsRejectToMakerModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Reject to Maker</h3>

              {/* Graphic Illustration with red (X) */}
              <div className="relative w-24 h-20 mx-auto mb-4 flex items-center justify-center">
                <div className="w-14 h-16 bg-gray-50 border border-gray-300 rounded-md shadow-xs p-1 flex flex-col justify-around">
                  <div className="w-6 h-3 bg-[#447837] rounded-xs" />
                  <div className="w-full h-1 bg-gray-200 rounded" />
                  <div className="w-3/4 h-1 bg-gray-200 rounded" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#EF4444] border-2 border-white flex items-center justify-center text-white shadow">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div className="text-left mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Reason of Rejection<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Reason of Rejection"
                  value={rejectToMakerReason}
                  onChange={(e) => setRejectToMakerReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#447837]"
                />
              </div>

              <button
                onClick={() => {
                  if (!rejectToMakerReason.trim()) {
                    showToast("Please enter reason of rejection.");
                    return;
                  }
                  if (selectedMerchant) {
                    setMerchants(merchants.map(m => m.id === selectedMerchant.id ? { ...m, status: "Rejected", kycStatus: "REJECTED" } : m));
                  }
                  setIsRejectToMakerModalOpen(false);
                  setSelectedMerchant(null);
                  showToast("Rejected and sent back to Maker.");
                }}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition cursor-pointer shadow-xs"
              >
                Send for Re-Submission
              </button>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 5C: VIEW PLAN DETAILS (Screenshot 7)        */}
        {/* ================================================= */}
        {isViewPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-900">View Plan Details</h3>
                <button
                  onClick={() => setIsViewPlanModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm mb-6">
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Feature:</span>
                  <span className="font-semibold text-gray-800">UPI_API</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Sub-feature Name:</span>
                  <span className="font-semibold text-gray-800">ONLINE_UPI_INTENT</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Service Provider Name:</span>
                  <span className="font-semibold text-gray-800 truncate block">UPI_API_ONLINE_UPI...</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Plan Name:</span>
                  <span className="font-semibold text-gray-800">partnerplan</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Plan Type:</span>
                  <span className="font-semibold text-gray-800">Merchant</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Set Value Fixed:</span>
                  <span className="font-semibold text-gray-800">0</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Set Value Percentage:</span>
                  <span className="font-semibold text-gray-800">1</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Commission Value:</span>
                  <span className="font-semibold text-gray-800">False</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Auth:</span>
                  <span className="font-semibold text-gray-800">POST</span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100">
                <button
                  onClick={() => setIsViewPlanModalOpen(false)}
                  className="px-6 py-2 bg-[#447837] hover:bg-[#36612B] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 6: EDIT PRODUCT INFO                        */}
        {/* ================================================= */}
        {isEditProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
              <button
                onClick={() => setIsEditProductOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Product Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Type</label>
                  <input
                    type="text"
                    value={editProductForm.productType}
                    onChange={(e) => setEditProductForm({ ...editProductForm, productType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Daily Maximum Amount Usage</label>
                  <input
                    type="text"
                    value={editProductForm.dailyMaxAmountUsage}
                    onChange={(e) => setEditProductForm({ ...editProductForm, dailyMaxAmountUsage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Min Per Transaction Limit</label>
                    <input
                      type="text"
                      value={editProductForm.minPerTransactionLimit}
                      onChange={(e) => setEditProductForm({ ...editProductForm, minPerTransactionLimit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Max Per Transaction Limit</label>
                    <input
                      type="text"
                      value={editProductForm.maxPerTransactionLimit}
                      onChange={(e) => setEditProductForm({ ...editProductForm, maxPerTransactionLimit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Credit Limit Amount</label>
                  <input
                    type="text"
                    value={editProductForm.creditLimitAmount}
                    onChange={(e) => setEditProductForm({ ...editProductForm, creditLimitAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-5">
                <button
                  onClick={() => setIsEditProductOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProductInfo}
                  className="px-5 py-2 bg-[#447837] hover:bg-[#36612B] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 7: EDIT PERSONAL INFO                       */}
        {/* ================================================= */}
        {isEditPersonalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setIsEditPersonalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Personal Info</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-xs font-bold text-[#447837] uppercase mb-2">Director 1 Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={editPersonalForm.d1Name}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d1Name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={editPersonalForm.d1Mobile}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d1Mobile: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Email ID</label>
                      <input
                        type="text"
                        value={editPersonalForm.d1Email}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d1Email: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Address</label>
                      <input
                        type="text"
                        value={editPersonalForm.d1Address}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d1Address: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-bold text-[#447837] uppercase mb-2">Director 2 Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={editPersonalForm.d2Name}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d2Name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={editPersonalForm.d2Mobile}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d2Mobile: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Email ID</label>
                      <input
                        type="text"
                        value={editPersonalForm.d2Email}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d2Email: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Address</label>
                      <input
                        type="text"
                        value={editPersonalForm.d2Address}
                        onChange={(e) => setEditPersonalForm({ ...editPersonalForm, d2Address: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-5">
                <button
                  onClick={() => setIsEditPersonalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePersonalInfo}
                  className="px-5 py-2 bg-[#447837] hover:bg-[#36612B] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* MODAL 8: DOCUMENT VIEWER PREVIEW                  */}
        {/* ================================================= */}
        {previewDocTitle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#447837]" />
                  <h3 className="text-base font-bold text-gray-900">{previewDocTitle}</h3>
                </div>
                <button
                  onClick={() => setPreviewDocTitle(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-20 bg-white border border-gray-300 rounded shadow-xs mb-3 flex flex-col items-center justify-center text-gray-400">
                  <FileCheck2 className="w-8 h-8 text-[#447837]" />
                  <span className="text-[10px] font-bold mt-1 text-gray-600">VERIFIED</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{previewDocTitle}</p>
                <p className="text-xs text-gray-500 mt-1">Status: Digitally Signed & Verified KYC Document</p>
                <p className="text-[11px] text-gray-400 mt-0.5">File size: 1.4 MB &bull; Uploaded on 15 Mar 2026</p>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => showToast(`Downloaded ${previewDocTitle}`)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#F0F6EE] text-[#447837] hover:bg-[#E4EFE2] rounded-lg text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setPreviewDocTitle(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TABLE VIEW (Screenshots 1 & 2)
  // ==========================================
  return (
    <div className="w-full bg-[#FAF9F6]/50 min-h-full pb-16 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-[#36612B] text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Title with back button & accent bar */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-full text-gray-700 hover:text-black hover:bg-gray-100 transition cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Merchant Review</h1>
        </div>
        <div className="flex items-center space-x-1.5 ml-8">
          <div className="h-1 w-12 bg-[#84CC16] rounded-full"></div>
          <div className="h-1 w-3.5 bg-[#447837] rounded-full"></div>
          <div className="h-1 w-1.5 bg-[#EAB308] rounded-full"></div>
          <div className="h-1 w-1.5 bg-[#EAB308] rounded-full"></div>
        </div>
      </div>

      {/* SEARCH BAR CONTAINER (Matching Screenshots with Green Theme) */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          
          {/* Field 1: Search By */}
          <div className="relative flex-1 min-w-[200px]">
            <button
              type="button"
              onClick={() => {
                setIsSearchByOpen(!isSearchByOpen);
                setIsKycStatusOpen(false);
              }}
              className={`w-full relative h-[48px] px-3.5 bg-white border rounded-md text-left flex items-center justify-between transition cursor-pointer ${
                isSearchByOpen ? "border-[#447837] ring-1 ring-[#447837]" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium leading-none ${
                isSearchByOpen ? "text-[#447837] font-semibold" : "text-gray-500"
              }`}>
                Search By
              </span>
              <span className="text-sm text-gray-800 font-normal truncate pr-2">
                {searchBy}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#447837] shrink-0 transition-transform ${isSearchByOpen ? "rotate-180" : ""}`} />
            </button>

            {isSearchByOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSearchByOpen(false)} />
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {SEARCH_BY_OPTIONS.map((opt) => {
                    const isSelected = searchBy === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSearchBy(opt);
                          setIsSearchByOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition ${
                          isSelected ? "bg-[#EBF4E9] text-[#447837] font-medium" : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#447837] shrink-0 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Field 2: From Date */}
          <div className="relative flex-1 min-w-[170px]">
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
              className="relative h-[48px] px-3.5 bg-white border border-gray-300 hover:border-gray-400 focus-within:border-[#447837] rounded-md flex items-center justify-between cursor-pointer transition"
            >
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 leading-none">
                From Date
              </span>
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 outline-none pr-2 font-normal"
              />
              <Calendar className="w-4 h-4 text-gray-500 hover:text-gray-700 shrink-0" />
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

          {/* Field 3: To Date */}
          <div className="relative flex-1 min-w-[170px]">
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
              className="relative h-[48px] px-3.5 bg-white border border-gray-300 hover:border-gray-400 focus-within:border-[#447837] rounded-md flex items-center justify-between cursor-pointer transition"
            >
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 leading-none">
                To Date
              </span>
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 outline-none pr-2 font-normal"
              />
              <Calendar className="w-4 h-4 text-gray-500 hover:text-gray-700 shrink-0" />
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

          {/* Field 4: KYC Status */}
          <div className="relative flex-1 min-w-[220px]">
            <button
              type="button"
              onClick={() => {
                setIsKycStatusOpen(!isKycStatusOpen);
                setIsSearchByOpen(false);
              }}
              className={`w-full relative h-[48px] px-3.5 bg-white border rounded-md text-left flex items-center justify-between transition cursor-pointer ${
                isKycStatusOpen ? "border-[#447837] ring-1 ring-[#447837]" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium leading-none ${
                isKycStatusOpen ? "text-[#447837] font-semibold" : "text-gray-500"
              }`}>
                KYC Status
              </span>
              <span className="text-sm text-gray-800 font-normal truncate pr-2">
                {kycStatus}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#447837] shrink-0 transition-transform ${isKycStatusOpen ? "rotate-180" : ""}`} />
            </button>

            {isKycStatusOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsKycStatusOpen(false)} />
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
                  {KYC_STATUS_OPTIONS.map((opt) => {
                    const isSelected = kycStatus === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setKycStatus(opt);
                          setIsKycStatusOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition ${
                          isSelected ? "bg-[#EBF4E9] text-[#447837] font-medium" : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#447837] shrink-0 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Field 5: Submit Button in Green Theme */}
          <div>
            <button
              type="button"
              onClick={handleSubmitFilters}
              className="h-[48px] px-8 bg-[#447837] hover:bg-[#36602A] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {!hasSubmitted ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#F4F9F2] text-[#447837] flex items-center justify-center mx-auto mb-4 border border-[#D5E8CE]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Search Merchant Reviews
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Select your search criteria, date range, and KYC status above, then click <strong className="text-[#447837]">Submit</strong> to fetch and review merchant applications.
          </p>
        </div>
      ) : (
        <>
          {/* Table Search & Export bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Search Name, mobile number, email i..."
                value={generalSearch}
                onChange={(e) => setGeneralSearch(e.target.value)}
                className="w-full pl-3.5 pr-9 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#447837]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCsv}
              className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-[#EBF4E9] text-[#2F6B22] hover:bg-[#DEF0DA] border border-[#CDE3C8] text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export To CSV</span>
            </button>
          </div>

          {/* Table Card (Screenshot 2) */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 bg-gray-50/70">
                <th className="px-6 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>Name</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
                <th className="px-6 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>Username</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
                <th className="px-6 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>Created Date</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
                <th className="px-6 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>Admin Name</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
                <th className="px-6 py-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>Mobile Number</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-center">
                  <div className="flex items-center justify-center space-x-1 cursor-pointer">
                    <span>Status</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-center">
                  <div className="flex items-center justify-center space-x-1 cursor-pointer">
                    <span>Agreement Status</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-center">
                  <div className="flex items-center justify-center space-x-1 cursor-pointer">
                    <span>Details</span>
                    <span className="text-gray-400 text-[10px]">↓</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No merchants found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{merchant.name}</td>
                    <td className="px-6 py-4 text-gray-600">{merchant.username}</td>
                    <td className="px-6 py-4 text-gray-600">{merchant.createdDate || "07/03/2025"}</td>
                    <td className="px-6 py-4 text-gray-600">{merchant.adminName}</td>
                    <td className="px-6 py-4 text-gray-600">{merchant.mobileNumber}</td>
                    <td className="px-6 py-4 text-center">
                      {merchant.status === "Approved" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF4E9] text-[#2F6B22]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B22] mr-1.5" />
                          Approved
                        </span>
                      ) : merchant.status === "Pending" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mr-1.5" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#DC2626]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-1.5" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {merchant.agreementStatus === "Success" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF4E9] text-[#2F6B22]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B22] mr-1.5" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mr-1.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedMerchant(merchant)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#EBF4E9] text-[#2F6B22] hover:bg-[#DEF0DA] text-xs font-semibold cursor-pointer transition shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#2F6B22]" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer (Screenshot 2) */}
        <div className="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Showing 1 to {filteredMerchants.length} of {merchants.length} entries</span>
          <div className="flex items-center space-x-1.5">
            <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50">
              « Prev
            </button>
            <button className="px-2.5 py-1 rounded bg-[#447837] text-white font-bold">1</button>
            <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">2</button>
            <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">10</button>
            <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-100">
              Next »
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

// Subcomponent for Document rows with [View] and [Download]
function DocItemRow({
  label,
  fileName,
  onView
}: {
  key?: string | number;
  label: string;
  fileName?: string;
  onView: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col pr-2 min-w-0">
        <span className="text-gray-800 text-sm font-medium truncate">{label}</span>
        {fileName ? (
          <span className="text-[11px] text-[#447837] font-medium flex items-center space-x-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#447837] shrink-0 inline-block mr-1"></span>
            <span className="truncate max-w-[200px]">{fileName}</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 ml-1">Uploaded</span>
          </span>
        ) : (
          <span className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block mr-1"></span>
            <span>Document on file (Verified)</span>
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <button
          type="button"
          onClick={onView}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] text-xs font-semibold transition cursor-pointer"
        >
          <Eye className="w-3 h-3" />
          <span>View</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const link = document.createElement("a");
            link.href = "#";
            link.setAttribute("download", `${(fileName || label).replace(/\s+/g, "_")}.pdf`);
            link.click();
          }}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] text-xs font-semibold transition cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
