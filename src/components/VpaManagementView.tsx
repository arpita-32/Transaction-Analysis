import { useState, useMemo } from "react";
import {
  Search,
  Download,
  FileText,
  Plus,
  Ban,
  CheckCircle,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Upload,
  RotateCcw,
  AlertTriangle,
  X,
  Check,
  Calendar,
  ShieldAlert
} from "lucide-react";

interface VpaManagementViewProps {
  currentRole?: string;
  activeSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export interface PayeeVpaRecord {
  approvalStatus: string;
  updatedBy: string;
  vpaStatus: string;
  approvedBy: string;
  terminalId: string;
  mcc: string;
  remarks: string;
  merchantName: string;
  vpa: string;
  createdDate: string;
  merchantId: string;
  createdBy: string;
  updatedAt: string;
  reasonCode?: string;
  attachmentFileName?: string;
}

export interface PayerVpaRecord {
  payerVpa: string;
  status: "Blacklist" | "Greylist";
  blockedOn: string;
  blockByUserId: string;
  blockedByUserRole: string;
  reasonCode: string;
  evidence: string;
  remark: string;
  unblockedOn: string;
  unblockByUserId: string;
  unblockedByUserRole: string;
  unblockReason: string;
}

const initialPayeeVpaData: PayeeVpaRecord[] = [
  {
    approvalStatus: "APPROVED",
    updatedBy: "taadmin",
    vpaStatus: "ACTIVE",
    approvedBy: "taadmin",
    terminalId: "TAM000000051510001",
    mcc: "5411",
    remarks: "UPDATED RECENTLY",
    merchantName: "Aarav Tech Solutions",
    vpa: "aaravtech@ta",
    createdDate: "10/08/2026 11:30:00 AM",
    merchantId: "TAM0000000515",
    createdBy: "david.internalrisk@yopmail.com",
    updatedAt: "10/08/2026 11:30:00 AM",
    reasonCode: "100"
  },
  {
    approvalStatus: "APPROVED",
    updatedBy: "taadmin",
    vpaStatus: "ACTIVE",
    approvedBy: "taadmin",
    terminalId: "TAM000000051408002",
    mcc: "5812",
    remarks: "REGULAR MERCHANT",
    merchantName: "Priya Digital Services",
    vpa: "priyadigital@ta",
    createdDate: "05/08/2026 02:15:00 PM",
    merchantId: "TAM0000000514",
    createdBy: "taadmin",
    updatedAt: "05/08/2026 02:15:00 PM",
    reasonCode: "101"
  },
  {
    approvalStatus: "APPROVED",
    updatedBy: "taadmin",
    vpaStatus: "ACTIVE",
    approvedBy: "taadmin",
    terminalId: "0763",
    mcc: "",
    remarks: "VPA ACTIVE",
    merchantName: "Rahul Ahirwar",
    vpa: "qamerchant4@ta",
    createdDate: "29/07/2026 04:28:21 PM",
    merchantId: "TAM0000000186",
    createdBy: "david.internalrisk@yopmail.com",
    updatedAt: "29/07/2026 04:28:21 PM",
    reasonCode: "100"
  },
  {
    approvalStatus: "APPROVED",
    updatedBy: "taadmin",
    vpaStatus: "ACTIVE",
    approvedBy: "taadmin",
    terminalId: "TAM000000051337733",
    mcc: "5442",
    remarks: "",
    merchantName: "Govind Sharma",
    vpa: "airpau1784899655119.mp@ta",
    createdDate: "24/07/2026 06:57:41 PM",
    merchantId: "TAM0000000513",
    createdBy: "taadmin",
    updatedAt: "24/07/2026 06:57:41 PM",
    reasonCode: "101"
  },
  {
    approvalStatus: "APPROVED",
    updatedBy: "taadmin",
    vpaStatus: "ACTIVE",
    approvedBy: "taadmin",
    terminalId: "TAM000000051226077",
    mcc: "5442",
    remarks: "",
    merchantName: "Govind Sharma",
    vpa: "airpau1784899438076.mp@ta",
    createdDate: "24/07/2026 06:54:04 PM",
    merchantId: "TAM0000000512",
    createdBy: "taadmin",
    updatedAt: "24/07/2026 06:54:04 PM",
    reasonCode: "102"
  },
  {
    approvalStatus: "PENDING",
    updatedBy: "taadmin",
    vpaStatus: "ACTIVE",
    approvedBy: "",
    terminalId: "TAM000000051137331",
    mcc: "5442",
    remarks: "",
    merchantName: "Govind Sharma",
    vpa: "airpau1784899373041.mp@ta",
    createdDate: "24/07/2026 06:53:00 PM",
    merchantId: "TAM0000000511",
    createdBy: "taadmin",
    updatedAt: "24/07/2026 06:53:00 PM",
    reasonCode: "103"
  },
  {
    approvalStatus: "REJECTED",
    updatedBy: "taadmin",
    vpaStatus: "INACTIVE",
    approvedBy: "taadmin",
    terminalId: "TAM000000051048822",
    mcc: "5442",
    remarks: "",
    merchantName: "Govind Sharma",
    vpa: "airpau1784899365896.mp@ta",
    createdDate: "24/07/2026 06:52:52 PM",
    merchantId: "TAM0000000510",
    createdBy: "taadmin",
    updatedAt: "24/07/2026 06:52:52 PM",
    reasonCode: "104"
  },
  {
    approvalStatus: "APPROVED",
    updatedBy: "taadmin",
    vpaStatus: "ACTIVE",
    approvedBy: "taadmin",
    terminalId: "TAM000000050933119",
    mcc: "5442",
    remarks: "",
    merchantName: "Govind Sharma",
    vpa: "airpau1784899358753.mp@ta",
    createdDate: "24/07/2026 06:52:40 PM",
    merchantId: "TAM0000000509",
    createdBy: "taadmin",
    updatedAt: "24/07/2026 06:52:40 PM",
    reasonCode: "100"
  }
];

const initialPayerVpaData: PayerVpaRecord[] = [
  {
    payerVpa: "rahul@ta",
    status: "Blacklist",
    blockedOn: "02.08.2025",
    blockByUserId: "cybercore",
    blockedByUserRole: "Internal Risk User",
    reasonCode: "100",
    evidence: "Evidence file: fraud_alert_report_100.pdf",
    remark: "Multiple failed authentication attempts flagged by risk engine.",
    unblockedOn: "",
    unblockByUserId: "",
    unblockedByUserRole: "",
    unblockReason: ""
  },
  {
    payerVpa: "ananya.k@ta",
    status: "Greylist",
    blockedOn: "15.06.2025",
    blockByUserId: "cybercore",
    blockedByUserRole: "Internal Risk User",
    reasonCode: "101",
    evidence: "Evidence file: fraud_alert_report_101.pdf",
    remark: "Chargeback pattern flagged by risk engine.",
    unblockedOn: "01.07.2025",
    unblockByUserId: "cybercore",
    unblockedByUserRole: "Internal Risk User",
    unblockReason: "Investigation concluded no fraud; VPA cleared for use."
  },
  {
    payerVpa: "meera.sharma@ta",
    status: "Greylist",
    blockedOn: "10.05.2025",
    blockByUserId: "cybercore",
    blockedByUserRole: "Internal Risk User",
    reasonCode: "102",
    evidence: "Evidence file: fraud_alert_report_102.pdf",
    remark: "Multiple failed authentication attempts flagged by risk engine.",
    unblockedOn: "20.05.2025",
    unblockByUserId: "cybercore",
    unblockedByUserRole: "Internal Risk User",
    unblockReason: "Customer verified identity; hold released."
  },
  {
    payerVpa: "vikram.stores@ta",
    status: "Greylist",
    blockedOn: "22.04.2025",
    blockByUserId: "cybercore",
    blockedByUserRole: "Internal Risk User",
    reasonCode: "104",
    evidence: "Evidence file: fraud_alert_report_104.pdf",
    remark: "Blocked on customer request pending review.",
    unblockedOn: "30.04.2025",
    unblockByUserId: "cybercore",
    unblockedByUserRole: "Internal Risk User",
    unblockReason: "Customer request withdrawn."
  }
];

export function VpaManagementView({ activeSubView = "Payee" }: VpaManagementViewProps) {
  // Main subview state: "Payee" vs "Payer"
  const currentSubView = activeSubView === "Payer" ? "Payer" : "Payee";

  // Shared Data States
  const [payeeList, setPayeeList] = useState<PayeeVpaRecord[]>(initialPayeeVpaData);
  const [payerList, setPayerList] = useState<PayerVpaRecord[]>(initialPayerVpaData);

  // Payee Mode: "list" | "update"
  const [payeeMode, setPayeeMode] = useState<"update" | "list">("list");

  // Payee VPA Update filters
  const [updateCategory, setUpdateCategory] = useState<string>("");
  const [updateSearchType, setUpdateSearchType] = useState<string>("");
  const [updateSearchVal, setUpdateSearchVal] = useState<string>("");
  const [updateFromDate, setUpdateFromDate] = useState<string>("");
  const [updateToDate, setUpdateToDate] = useState<string>("");
  const [updateHasSearched, setUpdateHasSearched] = useState<boolean>(false);
  const [updateTableFilter, setUpdateTableFilter] = useState<string>("");

  // Applied Payee VPA Update filters
  const [appliedUpdateSearchType, setAppliedUpdateSearchType] = useState<string>("");
  const [appliedUpdateSearchVal, setAppliedUpdateSearchVal] = useState<string>("");
  const [appliedUpdateFromDate, setAppliedUpdateFromDate] = useState<string>("");
  const [appliedUpdateToDate, setAppliedUpdateToDate] = useState<string>("");

  // Payee VPA List filters
  const [listCategory, setListCategory] = useState<string>("");
  const [listFromDate, setListFromDate] = useState<string>("");
  const [listToDate, setListToDate] = useState<string>("");
  const [listStatus, setListStatus] = useState<string>("APPROVED");
  const [listStatusUserSelected, setListStatusUserSelected] = useState<boolean>(false);
  const [listStatusDropdownOpen, setListStatusDropdownOpen] = useState<boolean>(false);
  const [listHasSearched, setListHasSearched] = useState<boolean>(false);
  const [listTableFilter, setListTableFilter] = useState<string>("");

  // Applied Payee VPA List filters
  const [appliedListCategory, setAppliedListCategory] = useState<string>("");
  const [appliedListFromDate, setAppliedListFromDate] = useState<string>("");
  const [appliedListToDate, setAppliedListToDate] = useState<string>("");
  const [appliedListStatus, setAppliedListStatus] = useState<string>("");

  // Payee Sort states
  const [payeeSortKey, setPayeeSortKey] = useState<keyof PayeeVpaRecord | "">("");
  const [payeeSortDir, setPayeeSortDir] = useState<"asc" | "desc">("asc");

  // Payee Action Kebab Menu
  const [openKebabIndex, setOpenKebabIndex] = useState<number | null>(null);

  // Payee Modals
  const [viewDetailsModalRecord, setViewDetailsModalRecord] = useState<PayeeVpaRecord | null>(null);
  const [addVpaRecord, setAddVpaRecord] = useState<PayeeVpaRecord | null>(null);
  const [addVpaNewInput, setAddVpaNewInput] = useState<string>("");
  const [addVpaVerified, setAddVpaVerified] = useState<boolean>(false);
  const [addVpaFile, setAddVpaFile] = useState<File | null>(null);
  const [addVpaRemarks, setAddVpaRemarks] = useState<string>("");

  const [blockVpaRecord, setBlockVpaRecord] = useState<PayeeVpaRecord | null>(null);
  const [blockVpaFile, setBlockVpaFile] = useState<File | null>(null);
  const [blockVpaReason, setBlockVpaReason] = useState<string>("");

  const [unblockVpaRecord, setUnblockVpaRecord] = useState<PayeeVpaRecord | null>(null);
  const [unblockVpaFile, setUnblockVpaFile] = useState<File | null>(null);
  const [unblockVpaReason, setUnblockVpaReason] = useState<string>("");

  // Payer Module States
  const [payerListType, setPayerListType] = useState<"Blacklist" | "Greylist">("Blacklist");
  const [payerListTypeSelected, setPayerListTypeSelected] = useState<boolean>(false);
  const [payerListTypeDropdownOpen, setPayerListTypeDropdownOpen] = useState<boolean>(false);

  const [payerSearchBy, setPayerSearchBy] = useState<string>("");
  const [payerSearchBySelected, setPayerSearchBySelected] = useState<boolean>(false);
  const [payerSearchByDropdownOpen, setPayerSearchByDropdownOpen] = useState<boolean>(false);
  const [payerSearchVal, setPayerSearchVal] = useState<string>("");
  const [payerReasonCodeVal, setPayerReasonCodeVal] = useState<string>("");
  const [payerFromDate, setPayerFromDate] = useState<string>("");
  const [payerToDate, setPayerToDate] = useState<string>("");

  const [payerHasSearched, setPayerHasSearched] = useState<boolean>(false);
  const [payerTableFilter, setPayerTableFilter] = useState<string>("");

  // Applied Payer filters
  const [appliedPayerListType, setAppliedPayerListType] = useState<"Blacklist" | "Greylist">("Blacklist");
  const [appliedPayerSearchBy, setAppliedPayerSearchBy] = useState<string>("");
  const [appliedPayerSearchBySelected, setAppliedPayerSearchBySelected] = useState<boolean>(false);
  const [appliedPayerSearchVal, setAppliedPayerSearchVal] = useState<string>("");
  const [appliedPayerReasonCodeVal, setAppliedPayerReasonCodeVal] = useState<string>("");
  const [appliedPayerFromDate, setAppliedPayerFromDate] = useState<string>("");
  const [appliedPayerToDate, setAppliedPayerToDate] = useState<string>("");

  const [payerRowsPerPage, setPayerRowsPerPage] = useState<number>(10);
  const [payerCurrentPage, setPayerCurrentPage] = useState<number>(1);
  const [payerGoToInput, setPayerGoToInput] = useState<string>("1");

  const [payerSortKey, setPayerSortKey] = useState<keyof PayerVpaRecord | "">("");
  const [payerSortDir, setPayerSortDir] = useState<"asc" | "desc">("asc");

  // Payer Modals
  const [blockPayerModalOpen, setBlockPayerModalOpen] = useState<boolean>(false);
  const [blockPayerVpaVal, setBlockPayerVpaVal] = useState<string>("");
  const [blockPayerVpaDisabled, setBlockPayerVpaDisabled] = useState<boolean>(false);
  const [blockPayerReasonCode, setBlockPayerReasonCode] = useState<string>("");
  const [blockPayerReasonDropdownOpen, setBlockPayerReasonDropdownOpen] = useState<boolean>(false);
  const [blockPayerFile, setBlockPayerFile] = useState<File | null>(null);
  const [blockPayerRemark, setBlockPayerRemark] = useState<string>("");
  const [blockPayerGreylistSource, setBlockPayerGreylistSource] = useState<PayerVpaRecord | null>(null);

  const [bulkPayerModalOpen, setBulkPayerModalOpen] = useState<boolean>(false);
  const [bulkPayerFile, setBulkPayerFile] = useState<File | null>(null);
  const [bulkPayerVpaList, setBulkPayerVpaList] = useState<string[]>([]);
  const [bulkPayerReasonCode, setBulkPayerReasonCode] = useState<string>("");
  const [bulkPayerReasonDropdownOpen, setBulkPayerReasonDropdownOpen] = useState<boolean>(false);
  const [bulkPayerEvidenceFile, setBulkPayerEvidenceFile] = useState<File | null>(null);
  const [bulkPayerRemark, setBulkPayerRemark] = useState<string>("");

  const [greylistWarningModalOpen, setGreylistWarningModalOpen] = useState<boolean>(false);
  const [greylistWarningDesc, setGreylistWarningDesc] = useState<string>("");
  const [greylistWarningContinueAction, setGreylistWarningContinueAction] = useState<(() => void) | null>(null);

  const [otpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [otpModalTitle, setOtpModalTitle] = useState<string>("OTP Verification");
  const [otpValue, setOtpValue] = useState<string>("");
  const [pendingOtpAction, setPendingOtpAction] = useState<(() => void) | null>(null);

  const [payerViewModal, setPayerViewModal] = useState<{ title: string; vpa: string; contentLabel: string; content: string } | null>(null);

  const [payerUnblockModalOpen, setPayerUnblockModalOpen] = useState<boolean>(false);
  const [payerUnblockRecord, setPayerUnblockRecord] = useState<PayerVpaRecord | null>(null);
  const [payerUnblockReason, setPayerUnblockReason] = useState<string>("");
  const [payerUnblockFile, setPayerUnblockFile] = useState<File | null>(null);

  // Global Notification / Toast
  const [toastMsg, setToastMsg] = useState<string>("");
  const [verifyToastMsg, setVerifyToastMsg] = useState<string>("");
  const [verifyToastError, setVerifyToastError] = useState<boolean>(false);
  const [successModalTitle, setSuccessModalTitle] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  const triggerVerifyToast = (msg: string, isError = false) => {
    setVerifyToastMsg(msg);
    setVerifyToastError(isError);
    setTimeout(() => setVerifyToastMsg(""), 3200);
  };

const parseYyyyMmDdLocal = (dateStr: string, isEnd = false): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      if (isEnd) {
        return new Date(year, month, day, 23, 59, 59, 999);
      }
      return new Date(year, month, day, 0, 0, 0, 0);
    }
  }
  const fallback = new Date(dateStr);
  if (!isNaN(fallback.getTime())) {
    if (isEnd) fallback.setHours(23, 59, 59, 999);
    else fallback.setHours(0, 0, 0, 0);
    return fallback;
  }
  return null;
};

const parseRecordDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const cleanStr = dateStr.trim();
  const datePart = cleanStr.split(" ")[0];
  if (datePart.includes("/")) {
    const parts = datePart.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day, 12, 0, 0);
      }
    }
  } else if (datePart.includes(".")) {
    const parts = datePart.split(".");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day, 12, 0, 0);
      }
    }
  } else if (datePart.includes("-")) {
    const parts = datePart.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day, 12, 0, 0);
        }
      } else {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day, 12, 0, 0);
        }
      }
    }
  }
  const fallback = new Date(cleanStr);
  return isNaN(fallback.getTime()) ? null : fallback;
};

// --- Payee Filter Logic ---
  const isUpdateSubmitEnabled = useMemo(() => {
    if (!updateCategory || !updateSearchType) return false;
    if (updateSearchType === "Date") {
      return Boolean(updateFromDate && updateToDate);
    }
    if (updateSearchType === "Status") {
      return Boolean(updateSearchVal);
    }
    if (["VPA", "Merchant ID", "MCC", "Reason Code"].includes(updateSearchType)) {
      return Boolean(updateSearchVal.trim());
    }
    return false;
  }, [updateCategory, updateSearchType, updateFromDate, updateToDate, updateSearchVal]);

  const isListSubmitEnabled = useMemo(() => {
    return Boolean(listCategory && listFromDate && listToDate && listStatusUserSelected);
  }, [listCategory, listFromDate, listToDate, listStatusUserSelected]);

  const isPayerSubmitEnabled = useMemo(() => {
    if (!payerListTypeSelected || !payerSearchBySelected) return false;
    if (payerSearchBy === "All") return true;
    if (payerSearchBy === "Payer VPA") return Boolean(payerSearchVal.trim());
    if (payerSearchBy === "Reason Code") return Boolean(payerReasonCodeVal);
    if (payerSearchBy === "Blocked on Date") return Boolean(payerFromDate && payerToDate);
    return false;
  }, [payerListTypeSelected, payerSearchBySelected, payerSearchBy, payerSearchVal, payerReasonCodeVal, payerFromDate, payerToDate]);

  const filteredPayeeUpdateResults = useMemo(() => {
    if (!updateHasSearched) return [];
    let list = payeeList;

    if (appliedUpdateSearchType === "Status") {
      if (appliedUpdateSearchVal && appliedUpdateSearchVal.toLowerCase() !== "all") {
        list = list.filter(
          r => r.vpaStatus.toLowerCase() === appliedUpdateSearchVal.toLowerCase() || r.approvalStatus.toLowerCase() === appliedUpdateSearchVal.toLowerCase()
        );
      }
    } else if (appliedUpdateSearchType === "Date") {
      if (appliedUpdateFromDate) {
        const from = parseYyyyMmDdLocal(appliedUpdateFromDate, false);
        if (from) {
          list = list.filter(r => {
            const d = parseRecordDate(r.createdDate);
            return d ? d >= from : true;
          });
        }
      }
      if (appliedUpdateToDate) {
        const to = parseYyyyMmDdLocal(appliedUpdateToDate, true);
        if (to) {
          list = list.filter(r => {
            const d = parseRecordDate(r.createdDate);
            return d ? d <= to : true;
          });
        }
      }
    } else if (appliedUpdateSearchType === "VPA" && appliedUpdateSearchVal.trim()) {
      const q = appliedUpdateSearchVal.trim().toLowerCase();
      list = list.filter(r => r.vpa.toLowerCase().includes(q));
    } else if (appliedUpdateSearchType === "Merchant ID" && appliedUpdateSearchVal.trim()) {
      const q = appliedUpdateSearchVal.trim().toLowerCase();
      list = list.filter(r => r.merchantId.toLowerCase().includes(q));
    } else if (appliedUpdateSearchType === "MCC" && appliedUpdateSearchVal.trim()) {
      const q = appliedUpdateSearchVal.trim().toLowerCase();
      list = list.filter(r => r.mcc.toLowerCase().includes(q));
    } else if (appliedUpdateSearchType === "Reason Code" && appliedUpdateSearchVal.trim()) {
      const q = appliedUpdateSearchVal.trim().toLowerCase();
      list = list.filter(r => (r.reasonCode || "").toLowerCase().includes(q));
    }

    if (updateTableFilter.trim()) {
      const q = updateTableFilter.trim().toLowerCase();
      list = list.filter(
        r =>
          r.merchantName.toLowerCase().includes(q) ||
          r.vpa.toLowerCase().includes(q) ||
          r.merchantId.toLowerCase().includes(q) ||
          r.terminalId.toLowerCase().includes(q)
      );
    }

    if (payeeSortKey) {
      list = [...list].sort((a, b) => {
        const av = (a[payeeSortKey] || "").toString().toLowerCase();
        const bv = (b[payeeSortKey] || "").toString().toLowerCase();
        if (av < bv) return payeeSortDir === "asc" ? -1 : 1;
        if (av > bv) return payeeSortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [payeeList, updateHasSearched, appliedUpdateSearchType, appliedUpdateSearchVal, appliedUpdateFromDate, appliedUpdateToDate, updateTableFilter, payeeSortKey, payeeSortDir]);

  const filteredPayeeListResults = useMemo(() => {
    if (!listHasSearched) return [];
    let list = payeeList;

    if (appliedListStatus && appliedListStatus.toUpperCase() !== "ALL") {
      list = list.filter(r => r.approvalStatus.toUpperCase() === appliedListStatus.toUpperCase());
    }

    if (appliedListFromDate) {
      const from = parseYyyyMmDdLocal(appliedListFromDate, false);
      if (from) {
        list = list.filter(r => {
          const d = parseRecordDate(r.createdDate);
          return d ? d >= from : true;
        });
      }
    }

    if (appliedListToDate) {
      const to = parseYyyyMmDdLocal(appliedListToDate, true);
      if (to) {
        list = list.filter(r => {
          const d = parseRecordDate(r.createdDate);
          return d ? d <= to : true;
        });
      }
    }

    if (listTableFilter.trim()) {
      const q = listTableFilter.trim().toLowerCase();
      list = list.filter(
        r =>
          r.merchantName.toLowerCase().includes(q) ||
          r.vpa.toLowerCase().includes(q) ||
          r.merchantId.toLowerCase().includes(q) ||
          r.terminalId.toLowerCase().includes(q)
      );
    }

    if (payeeSortKey) {
      list = [...list].sort((a, b) => {
        const av = (a[payeeSortKey] || "").toString().toLowerCase();
        const bv = (b[payeeSortKey] || "").toString().toLowerCase();
        if (av < bv) return payeeSortDir === "asc" ? -1 : 1;
        if (av > bv) return payeeSortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [payeeList, listHasSearched, appliedListStatus, appliedListFromDate, appliedListToDate, listTableFilter, payeeSortKey, payeeSortDir]);

  const handlePayeeSort = (key: keyof PayeeVpaRecord) => {
    if (payeeSortKey === key) {
      setPayeeSortDir(payeeSortDir === "asc" ? "desc" : "asc");
    } else {
      setPayeeSortKey(key);
      setPayeeSortDir("asc");
    }
  };

  // --- Payer Filter Logic ---
  const filteredPayerResults = useMemo(() => {
    if (!payerHasSearched) return [];
    let list = payerList.filter(r => r.status.toLowerCase() === appliedPayerListType.toLowerCase());

    if (appliedPayerSearchBySelected) {
      if (appliedPayerSearchBy === "All") {
        // Return all
      } else if (appliedPayerSearchBy === "Payer VPA" && appliedPayerSearchVal.trim()) {
        list = list.filter(r => r.payerVpa.toLowerCase().includes(appliedPayerSearchVal.trim().toLowerCase()));
      } else if (appliedPayerSearchBy === "Reason Code" && appliedPayerReasonCodeVal) {
        list = list.filter(r => r.reasonCode === appliedPayerReasonCodeVal);
      } else if (appliedPayerSearchBy === "Blocked on Date") {
        if (appliedPayerFromDate) {
          const from = parseYyyyMmDdLocal(appliedPayerFromDate, false);
          if (from) {
            list = list.filter(r => {
              const d = parseRecordDate(r.blockedOn);
              return d ? d >= from : true;
            });
          }
        }
        if (appliedPayerToDate) {
          const to = parseYyyyMmDdLocal(appliedPayerToDate, true);
          if (to) {
            list = list.filter(r => {
              const d = parseRecordDate(r.blockedOn);
              return d ? d <= to : true;
            });
          }
        }
      }
    }

    if (payerTableFilter.trim()) {
      const q = payerTableFilter.trim().toLowerCase();
      list = list.filter(
        r =>
          r.payerVpa.toLowerCase().includes(q) ||
          r.blockByUserId.toLowerCase().includes(q) ||
          r.blockedByUserRole.toLowerCase().includes(q) ||
          r.reasonCode.toLowerCase().includes(q)
      );
    }

    if (payerSortKey) {
      list = [...list].sort((a, b) => {
        const av = (a[payerSortKey] || "").toString().toLowerCase();
        const bv = (b[payerSortKey] || "").toString().toLowerCase();
        if (av < bv) return payerSortDir === "asc" ? -1 : 1;
        if (av > bv) return payerSortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [
    payerList,
    appliedPayerListType,
    payerHasSearched,
    appliedPayerSearchBySelected,
    appliedPayerSearchBy,
    appliedPayerSearchVal,
    appliedPayerReasonCodeVal,
    appliedPayerFromDate,
    appliedPayerToDate,
    payerTableFilter,
    payerSortKey,
    payerSortDir
  ]);

  const paginatedPayerResults = useMemo(() => {
    const start = (payerCurrentPage - 1) * payerRowsPerPage;
    return filteredPayerResults.slice(start, start + payerRowsPerPage);
  }, [filteredPayerResults, payerCurrentPage, payerRowsPerPage]);

  const payerTotalPages = Math.max(1, Math.ceil(filteredPayerResults.length / payerRowsPerPage));

  const handlePayerSort = (key: keyof PayerVpaRecord) => {
    if (payerSortKey === key) {
      setPayerSortDir(payerSortDir === "asc" ? "desc" : "asc");
    } else {
      setPayerSortKey(key);
      setPayerSortDir("asc");
    }
  };

  // Helper Export CSV
  const exportCsv = (data: Record<string, any>[], filename: string) => {
    if (!data.length) {
      triggerToast("No data available to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(h => `"${(obj[h] || "").toString().replace(/"/g, '""')}"`).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("Exported to CSV successfully");
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-6 min-h-[560px] shadow-xs relative text-left">
      <h1 className="text-xl font-bold text-gray-900 mb-5">VPA Management</h1>

      {/* PAYEE SUBVIEW */}
      {currentSubView === "Payee" && (
        <div>
          {/* Mode Tabs */}
          <div className="flex gap-10 mb-6">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-800">
              <input
                type="radio"
                name="vpaMode"
                value="update"
                checked={payeeMode === "update"}
                onChange={() => setPayeeMode("update")}
                className="accent-[#447837] w-4 h-4 cursor-pointer"
              />
              VPA Update
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-800">
              <input
                type="radio"
                name="vpaMode"
                value="list"
                checked={payeeMode === "list"}
                onChange={() => setPayeeMode("list")}
                className="accent-[#447837] w-4 h-4 cursor-pointer"
              />
              VPA List
            </label>
          </div>

          {/* VPA UPDATE MODE */}
          {payeeMode === "update" && (
            <div>
              <div className="flex items-end gap-6 flex-wrap pb-4 border-b border-gray-100">
                <div className="flex flex-col min-w-[220px]">
                  <label className="text-xs font-semibold text-gray-700 mb-1.5">Search Category</label>
                  <select
                    value={updateCategory}
                    onChange={(e) => {
                      setUpdateCategory(e.target.value);
                      setUpdateSearchType("");
                      setUpdateSearchVal("");
                      setUpdateFromDate("");
                      setUpdateToDate("");
                      setUpdateHasSearched(false);
                    }}
                    className="w-full text-xs font-medium border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none"
                  >
                    <option value="">Select Search Category</option>
                    <option value="Aggregator">Aggregator</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>

                {updateCategory && (
                  <div className="flex flex-col min-w-[220px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Search Type</label>
                    <select
                      value={updateSearchType}
                      onChange={(e) => {
                        const st = e.target.value;
                        setUpdateSearchType(st);
                        setUpdateSearchVal(st === "Status" ? "All" : "");
                        setUpdateFromDate("");
                        setUpdateToDate("");
                        setUpdateHasSearched(false);
                      }}
                      className="w-full text-xs font-medium border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none"
                    >
                      <option value="">Select Search Type</option>
                      <option value="Status">Status</option>
                      <option value="Date">Date</option>
                      <option value="VPA">VPA</option>
                      <option value="Merchant ID">Merchant ID</option>
                      <option value="MCC">MCC</option>
                      <option value="Reason Code">Reason Code</option>
                    </select>
                  </div>
                )}

                {updateSearchType === "Date" && (
                  <>
                    <div className="flex flex-col min-w-[180px]">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">From Date</label>
                      <input
                        type="date"
                        value={updateFromDate}
                        onChange={(e) => {
                          setUpdateFromDate(e.target.value);
                          setUpdateHasSearched(false);
                        }}
                        className="text-xs border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837]"
                      />
                    </div>
                    <div className="flex flex-col min-w-[180px]">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">To Date</label>
                      <input
                        type="date"
                        value={updateToDate}
                        onChange={(e) => {
                          setUpdateToDate(e.target.value);
                          setUpdateHasSearched(false);
                        }}
                        className="text-xs border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837]"
                      />
                    </div>
                  </>
                )}

                {updateSearchType === "Status" && (
                  <div className="flex flex-col min-w-[200px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                    <select
                      value={updateSearchVal}
                      onChange={(e) => {
                        setUpdateSearchVal(e.target.value);
                        setUpdateHasSearched(false);
                      }}
                      className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white"
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                )}

                {updateSearchType === "VPA" && (
                  <div className="flex flex-col min-w-[220px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">VPA</label>
                    <input
                      type="text"
                      placeholder="Enter VPA"
                      value={updateSearchVal}
                      onChange={(e) => {
                        setUpdateSearchVal(e.target.value);
                        setUpdateHasSearched(false);
                      }}
                      className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white"
                    />
                  </div>
                )}

                {updateSearchType === "Merchant ID" && (
                  <div className="flex flex-col min-w-[220px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Merchant ID</label>
                    <input
                      type="text"
                      placeholder="Enter Merchant ID"
                      value={updateSearchVal}
                      onChange={(e) => {
                        setUpdateSearchVal(e.target.value);
                        setUpdateHasSearched(false);
                      }}
                      className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white"
                    />
                  </div>
                )}

                {updateSearchType === "MCC" && (
                  <div className="flex flex-col min-w-[220px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">MCC</label>
                    <select
                      value={updateSearchVal}
                      onChange={(e) => {
                        setUpdateSearchVal(e.target.value);
                        setUpdateHasSearched(false);
                      }}
                      className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white"
                    >
                      <option value="">Select MCC</option>
                      <option value="5442">5442 - Fuel Dealers</option>
                      <option value="5411">5411 - Grocery</option>
                      <option value="5732">5732 - Electronics</option>
                    </select>
                  </div>
                )}

                {updateSearchType === "Reason Code" && (
                  <div className="flex flex-col min-w-[220px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Reason Code</label>
                    <select
                      value={updateSearchVal}
                      onChange={(e) => {
                        setUpdateSearchVal(e.target.value);
                        setUpdateHasSearched(false);
                      }}
                      className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white"
                    >
                      <option value="">Select Reason Code</option>
                      <option value="100">100 - Suspicious Activity</option>
                      <option value="101">101 - Fraud Alert</option>
                      <option value="102">102 - Multiple Failed Attempts</option>
                    </select>
                  </div>
                )}

                {updateSearchType && (
                  <button
                    disabled={!isUpdateSubmitEnabled}
                    onClick={() => {
                      setAppliedUpdateSearchType(updateSearchType);
                      setAppliedUpdateSearchVal(updateSearchVal);
                      setAppliedUpdateFromDate(updateFromDate);
                      setAppliedUpdateToDate(updateToDate);
                      setUpdateHasSearched(true);
                    }}
                    className={`px-6 py-2 rounded text-xs font-bold transition shadow-xs h-[34px] ${
                      isUpdateSubmitEnabled
                        ? "bg-[#447837] text-white hover:bg-[#36602A] cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                    }`}
                  >
                    Submit
                  </button>
                )}
              </div>

              {/* Toolbar & Search */}
              <div className="flex items-center justify-between gap-4 mt-5 mb-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search"
                    value={updateTableFilter}
                    onChange={(e) => setUpdateTableFilter(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-md pl-3 pr-8 py-2 bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#447837]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
                {updateHasSearched && filteredPayeeUpdateResults.length > 0 && (
                  <button
                    onClick={() => exportCsv(filteredPayeeUpdateResults, "vpa-update-list.csv")}
                    className="flex items-center gap-1.5 border border-[#3B5BDB] text-[#3B5BDB] hover:bg-blue-50 px-4 py-1.5 rounded text-xs font-bold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export to CSV
                  </button>
                )}
              </div>

              {/* Table / Empty state */}
              {!updateHasSearched ? (
                <div className="py-16 text-center text-sm text-gray-500">
                  Select the search criteria above and click Submit to view VPA records.
                </div>
              ) : filteredPayeeUpdateResults.length === 0 ? (
                <div className="py-16 text-center text-sm text-gray-500">
                  No matching VPA records found. Try a different search value.
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs text-left text-gray-700 whitespace-nowrap">
                    <thead className="bg-[#447837] text-white font-semibold">
                      <tr>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("approvalStatus")}>
                          Vpa Approval Status ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("updatedBy")}>
                          Updated By ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("vpaStatus")}>
                          Vpa Status ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("approvedBy")}>
                          Approved By ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("terminalId")}>
                          Terminal Id ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("mcc")}>
                          Mcc ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("reasonCode")}>
                          Reason Code ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("remarks")}>
                          Active Inactive Remarks ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("merchantName")}>
                          Merchant Name ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("vpa")}>
                          Vpa Id ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("createdDate")}>
                          Created At ↕
                        </th>
                        <th className="p-3">Attachment</th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("merchantId")}>
                          Merchant Id ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("createdBy")}>
                          Created By ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("updatedAt")}>
                          Updated At ↕
                        </th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayeeUpdateResults.map((r, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80">
                          <td className="p-3 font-semibold">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                r.approvalStatus === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : r.approvalStatus === "PENDING"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {r.approvalStatus}
                            </span>
                          </td>
                          <td className="p-3">{r.updatedBy}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                r.vpaStatus === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {r.vpaStatus}
                            </span>
                          </td>
                          <td className="p-3">{r.approvedBy}</td>
                          <td className="p-3">{r.terminalId}</td>
                          <td className="p-3">{r.mcc}</td>
                          <td className="p-3 font-medium text-gray-800 font-mono">{r.reasonCode || "-"}</td>
                          <td className="p-3">{r.remarks}</td>
                          <td className="p-3 font-semibold">{r.merchantName}</td>
                          <td className="p-3 font-mono">{r.vpa}</td>
                          <td className="p-3">{r.createdDate}</td>
                          <td className="p-3">
                            <button
                              onClick={() => triggerToast(`Downloading attachment for ${r.vpa}`)}
                              className="text-gray-600 hover:text-[#447837] cursor-pointer"
                              title="Download Attachment"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="p-3">{r.merchantId}</td>
                          <td className="p-3">{r.createdBy}</td>
                          <td className="p-3">{r.updatedAt}</td>
                          <td className="p-3 relative">
                            <button
                              onClick={() => setOpenKebabIndex(openKebabIndex === idx ? null : idx)}
                              className="p-1 hover:bg-gray-200 rounded cursor-pointer text-gray-700"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openKebabIndex === idx && (
                              <div className="absolute right-3 top-8 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1.5 min-w-[130px]">
                                {r.vpaStatus === "INACTIVE" ? (
                                  <button
                                    onClick={() => {
                                      setOpenKebabIndex(null);
                                      setUnblockVpaRecord(r);
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> UnBlock
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setOpenKebabIndex(null);
                                        setAddVpaRecord(r);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Add VPA
                                    </button>
                                    <button
                                      onClick={() => {
                                        setOpenKebabIndex(null);
                                        setBlockVpaRecord(r);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-700 hover:bg-emerald-50 flex items-center gap-1.5"
                                    >
                                      <Ban className="w-3.5 h-3.5" /> Block VPA
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VPA LIST MODE */}
          {payeeMode === "list" && (
            <div>
              {/* Filter Row */}
              <div className="flex items-center gap-4 flex-wrap mb-5 pb-4 border-b border-gray-100">
                <div className="relative border border-gray-300 rounded-md px-3 pt-2 pb-1 min-w-[210px] bg-white focus-within:border-blue-600">
                  <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-gray-500 font-medium">Search Category</span>
                  <select
                    value={listCategory}
                    onChange={(e) => {
                      setListCategory(e.target.value);
                      if (e.target.value === "Aggregator") {
                        setListStatus("APPROVED");
                      }
                      setListHasSearched(false);
                    }}
                    className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none cursor-pointer"
                  >
                    <option value="">Select Search Category</option>
                    <option value="Aggregator">Aggregator</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>

                <div className="relative border border-gray-300 rounded-md px-3 pt-2 pb-1 min-w-[180px] bg-white">
                  <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-gray-500 font-medium">From Date</span>
                  <input
                    type="date"
                    value={listFromDate}
                    onChange={(e) => {
                      setListFromDate(e.target.value);
                      setListHasSearched(false);
                    }}
                    className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none cursor-pointer"
                  />
                </div>

                <div className="relative border border-gray-300 rounded-md px-3 pt-2 pb-1 min-w-[180px] bg-white">
                  <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-gray-500 font-medium">To Date</span>
                  <input
                    type="date"
                    value={listToDate}
                    onChange={(e) => {
                      setListToDate(e.target.value);
                      setListHasSearched(false);
                    }}
                    className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none cursor-pointer"
                  />
                </div>

                {/* Custom Status Dropdown */}
                <div className="relative min-w-[180px]">
                  <div
                    onClick={() => setListStatusDropdownOpen(!listStatusDropdownOpen)}
                    className="relative border border-gray-300 rounded-md px-3 pt-2 pb-1 bg-white cursor-pointer flex items-center justify-between"
                  >
                    <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-gray-500 font-medium">Status</span>
                    <span className="text-xs font-semibold text-gray-800">{listStatus}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>

                  {listStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                      {(listCategory === "Partner" ? ["ALL", "PENDING", "APPROVED", "REJECTED"] : ["APPROVED"]).map(st => (
                        <div
                          key={st}
                          onClick={() => {
                            setListStatus(st);
                            setListStatusUserSelected(true);
                            setListStatusDropdownOpen(false);
                            setListHasSearched(false);
                          }}
                          className="px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                        >
                          <span>{st}</span>
                          {listStatus === st && <Check className="w-3.5 h-3.5 text-gray-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  disabled={!isListSubmitEnabled}
                  onClick={() => {
                    setAppliedListCategory(listCategory);
                    setAppliedListFromDate(listFromDate);
                    setAppliedListToDate(listToDate);
                    setAppliedListStatus(listStatus);
                    setListHasSearched(true);
                  }}
                  className={`px-6 py-2.5 rounded text-xs font-bold transition shadow-xs ${
                    isListSubmitEnabled
                      ? "bg-[#447837] text-white hover:bg-[#36602A] cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                  }`}
                >
                  Submit
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search"
                    value={listTableFilter}
                    onChange={(e) => setListTableFilter(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-md pl-3 pr-8 py-2 bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#447837]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
                {listHasSearched && filteredPayeeListResults.length > 0 && (
                  <button
                    onClick={() => exportCsv(filteredPayeeListResults, "vpa-list.csv")}
                    className="flex items-center gap-1.5 border border-[#3B5BDB] text-[#3B5BDB] hover:bg-blue-50 px-4 py-1.5 rounded text-xs font-bold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export to CSV
                  </button>
                )}
              </div>

              {/* Table / Empty State */}
              {!listHasSearched ? (
                <div className="py-16 text-center text-sm text-gray-500">
                  Select Search Category and Status above, then click Submit to view VPA records.
                </div>
              ) : filteredPayeeListResults.length === 0 ? (
                <div className="py-16 text-center text-sm text-gray-500">No VPAs match your search.</div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs text-left text-gray-700 whitespace-nowrap">
                    <thead className="bg-[#447837] text-white font-semibold">
                      <tr>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("approvalStatus")}>
                          Vpa Approval Status ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("updatedBy")}>
                          Updated By ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("vpaStatus")}>
                          Vpa Status ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("approvedBy")}>
                          Approved By ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("terminalId")}>
                          Terminal Id ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("mcc")}>
                          Mcc ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("reasonCode")}>
                          Reason Code ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("remarks")}>
                          Active Inactive Remarks ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("merchantName")}>
                          Merchant Name ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("vpa")}>
                          Vpa Id ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("createdDate")}>
                          Created At ↕
                        </th>
                        <th className="p-3">Attachment</th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("merchantId")}>
                          Merchant Id ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("createdBy")}>
                          Created By ↕
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => handlePayeeSort("updatedAt")}>
                          Updated At ↕
                        </th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayeeListResults.map((r, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80">
                          <td className="p-3 font-semibold">{r.approvalStatus}</td>
                          <td className="p-3">{r.updatedBy}</td>
                          <td className="p-3">{r.vpaStatus}</td>
                          <td className="p-3">{r.approvedBy}</td>
                          <td className="p-3">{r.terminalId}</td>
                          <td className="p-3">{r.mcc}</td>
                          <td className="p-3 font-mono font-medium text-gray-800">{r.reasonCode || "-"}</td>
                          <td className="p-3">{r.remarks}</td>
                          <td className="p-3 font-semibold">{r.merchantName}</td>
                          <td className="p-3 font-mono">{r.vpa}</td>
                          <td className="p-3">{r.createdDate}</td>
                          <td className="p-3">
                            <button
                              onClick={() => triggerToast(`Downloading attachment for ${r.vpa}`)}
                              className="text-gray-600 hover:text-[#447837] cursor-pointer"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="p-3">{r.merchantId}</td>
                          <td className="p-3">{r.createdBy}</td>
                          <td className="p-3">{r.updatedAt}</td>
                          <td className="p-3">
                            <button
                              onClick={() => setViewDetailsModalRecord(r)}
                              className="p-1 hover:bg-gray-200 rounded cursor-pointer text-gray-700"
                              title="View / Edit VPA"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PAYER SUBVIEW */}
      {currentSubView === "Payer" && (
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900">Payer</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setBlockPayerVpaVal("");
                  setBlockPayerVpaDisabled(false);
                  setBlockPayerReasonCode("");
                  setBlockPayerRemark("");
                  setBlockPayerFile(null);
                  setBlockPayerGreylistSource(null);
                  setBlockPayerModalOpen(true);
                }}
                className="px-5 py-2 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#36602A] transition shadow-xs cursor-pointer"
              >
                Block Payer VPA
              </button>
              <button
                onClick={() => {
                  setBulkPayerFile(null);
                  setBulkPayerVpaList([]);
                  setBulkPayerReasonCode("");
                  setBulkPayerEvidenceFile(null);
                  setBulkPayerRemark("");
                  setBulkPayerModalOpen(true);
                }}
                className="px-5 py-2 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#36602A] transition shadow-xs cursor-pointer"
              >
                Bulk Payer VPA Block
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-6 flex-wrap pb-4 border-b border-gray-100">
            {/* List Type Dropdown */}
            <div className="flex flex-col min-w-[240px]">
              <label className="text-xs font-semibold text-gray-700 mb-1.5">List Type</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPayerListTypeDropdownOpen(!payerListTypeDropdownOpen)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer"
                >
                  <span>{payerListTypeSelected ? `Payer VPA ${payerListType}` : "Select List Type"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {payerListTypeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                    {(["Blacklist", "Greylist"] as const).map(lt => (
                      <div
                        key={lt}
                        onClick={() => {
                          setPayerListType(lt);
                          setPayerListTypeSelected(true);
                          setPayerListTypeDropdownOpen(false);
                          setPayerHasSearched(false);
                          setPayerSearchBy("");
                          setPayerSearchBySelected(false);
                        }}
                        className="px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      >
                        <span>Payer VPA {lt}</span>
                        {payerListTypeSelected && payerListType === lt && <Check className="w-3.5 h-3.5 text-gray-500" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search By Dropdown */}
            {payerListTypeSelected && (
              <div className="flex flex-col min-w-[240px]">
                <label className="text-xs font-semibold text-gray-700 mb-1.5">Search By</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPayerSearchByDropdownOpen(!payerSearchByDropdownOpen)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer"
                  >
                    <span>{payerSearchBySelected ? payerSearchBy : "Select Search By"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {payerSearchByDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                      {["All", "Payer VPA", "Reason Code", "Blocked on Date"].map(sb => (
                        <div
                          key={sb}
                          onClick={() => {
                            setPayerSearchBy(sb);
                            setPayerSearchBySelected(true);
                            setPayerSearchByDropdownOpen(false);
                            setPayerHasSearched(false);
                          }}
                          className="px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                        >
                          <span>{sb}</span>
                          {payerSearchBySelected && payerSearchBy === sb && <Check className="w-3.5 h-3.5 text-gray-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dynamic Search By Inputs */}
            {payerSearchBySelected && payerSearchBy === "Payer VPA" && (
              <div className="flex flex-col min-w-[220px]">
                <label className="text-xs font-semibold text-gray-700 mb-1.5">Payer VPA</label>
                <input
                  type="text"
                  placeholder="Enter Payer VPA"
                  value={payerSearchVal}
                  onChange={(e) => {
                    setPayerSearchVal(e.target.value);
                    setPayerHasSearched(false);
                  }}
                  className="w-full text-xs font-semibold border border-gray-300 rounded px-3 py-2 bg-white"
                />
              </div>
            )}

            {payerSearchBySelected && payerSearchBy === "Reason Code" && (
              <div className="flex flex-col min-w-[220px]">
                <label className="text-xs font-semibold text-gray-700 mb-1.5">Reason Code</label>
                <select
                  value={payerReasonCodeVal}
                  onChange={(e) => {
                    setPayerReasonCodeVal(e.target.value);
                    setPayerHasSearched(false);
                  }}
                  className="w-full text-xs font-semibold border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option value="">Select Reason Code</option>
                  <option value="100">100 - Suspicious Activity</option>
                  <option value="101">101 - Fraud Alert</option>
                  <option value="102">102 - Multiple Failed Attempts</option>
                  <option value="103">103 - Compliance Hold</option>
                  <option value="104">104 - Customer Request</option>
                </select>
              </div>
            )}

            {payerSearchBySelected && payerSearchBy === "Blocked on Date" && (
              <>
                <div className="flex flex-col min-w-[180px]">
                  <label className="text-xs font-semibold text-gray-700 mb-1.5">From Date</label>
                  <input
                    type="date"
                    value={payerFromDate}
                    onChange={(e) => {
                      setPayerFromDate(e.target.value);
                      setPayerHasSearched(false);
                    }}
                    className="text-xs border border-gray-300 rounded px-3 py-2 bg-white"
                  />
                </div>
                <div className="flex flex-col min-w-[180px]">
                  <label className="text-xs font-semibold text-gray-700 mb-1.5">To Date</label>
                  <input
                    type="date"
                    value={payerToDate}
                    onChange={(e) => {
                      setPayerToDate(e.target.value);
                      setPayerHasSearched(false);
                    }}
                    className="text-xs border border-gray-300 rounded px-3 py-2 bg-white"
                  />
                </div>
              </>
            )}
          </div>

          {!payerListTypeSelected ? (
            <div className="py-16 text-center text-sm text-gray-500">Select a List Type above to view records.</div>
          ) : (
            <div>
              {/* Reset & Submit Buttons */}
              <div className="flex items-center justify-end gap-3 my-4">
                <button
                  onClick={() => {
                    setPayerSearchBy("");
                    setPayerSearchBySelected(false);
                    setPayerSearchVal("");
                    setPayerReasonCodeVal("");
                    setPayerFromDate("");
                    setPayerToDate("");
                    setPayerHasSearched(false);
                  }}
                  className="text-xs font-bold text-rose-700 hover:underline cursor-pointer px-2 py-1"
                >
                  Reset
                </button>

                <button
                  disabled={!isPayerSubmitEnabled}
                  onClick={() => {
                    setAppliedPayerListType(payerListType);
                    setAppliedPayerSearchBy(payerSearchBy);
                    setAppliedPayerSearchBySelected(payerSearchBySelected);
                    setAppliedPayerSearchVal(payerSearchVal);
                    setAppliedPayerReasonCodeVal(payerReasonCodeVal);
                    setAppliedPayerFromDate(payerFromDate);
                    setAppliedPayerToDate(payerToDate);
                    setPayerHasSearched(true);
                    setPayerCurrentPage(1);
                  }}
                  className={`px-6 py-2 rounded text-xs font-bold transition shadow-xs ${
                    isPayerSubmitEnabled
                      ? "bg-[#447837] text-white hover:bg-[#36602A] cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                  }`}
                >
                  Submit
                </button>
              </div>

              {!payerHasSearched ? (
                <div className="py-16 text-center text-sm text-gray-500">
                  Select Search By above, then click Submit to view records.
                </div>
              ) : (
                <div>
                  {/* Toolbar */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Search"
                        value={payerTableFilter}
                        onChange={(e) => setPayerTableFilter(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-md pl-3 pr-8 py-2 bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#447837]"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>

                    <button
                      onClick={() => exportCsv(filteredPayerResults, `payer-vpa-${payerListType.toLowerCase()}.csv`)}
                      className="flex items-center gap-1.5 border border-[#3B5BDB] text-[#3B5BDB] hover:bg-blue-50 px-4 py-1.5 rounded text-xs font-bold transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export to CSV
                    </button>
                  </div>

                  {/* Payer Table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-xs text-left text-gray-700 whitespace-nowrap">
                      <thead className="bg-[#447837] text-white font-semibold">
                        {payerListType === "Greylist" ? (
                          <tr>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("payerVpa")}>
                              Payer VPA ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("blockedOn")}>
                              Blocked on ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("unblockedOn")}>
                              Unblocked on ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("unblockByUserId")}>
                              Unblock By UserID ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("unblockedByUserRole")}>
                              Unblocked By Userrole ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("reasonCode")}>
                              Reason Code ↕
                            </th>
                            <th className="p-3">Evidence</th>
                            <th className="p-3">Remark</th>
                            <th className="p-3">Action</th>
                          </tr>
                        ) : (
                          <tr>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("payerVpa")}>
                              Payer VPA ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("blockedOn")}>
                              Blocked on ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("blockByUserId")}>
                              Block By UserID ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("blockedByUserRole")}>
                              Blocked By Userrole ↕
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handlePayerSort("reasonCode")}>
                              Reason Code ↕
                            </th>
                            <th className="p-3">Evidence</th>
                            <th className="p-3">Remark</th>
                            <th className="p-3">Action</th>
                          </tr>
                        )}
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedPayerResults.map((r, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/80">
                            <td className="p-3 font-semibold font-mono">{r.payerVpa}</td>
                            <td className="p-3">{r.blockedOn}</td>

                            {payerListType === "Greylist" ? (
                              <>
                                <td className="p-3">{r.unblockedOn}</td>
                                <td className="p-3">{r.unblockByUserId}</td>
                                <td className="p-3">{r.unblockedByUserRole}</td>
                              </>
                            ) : (
                              <>
                                <td className="p-3">{r.blockByUserId}</td>
                                <td className="p-3">{r.blockedByUserRole}</td>
                              </>
                            )}

                            <td className="p-3">{r.reasonCode}</td>

                            <td className="p-3">
                              <button
                                onClick={() =>
                                  setPayerViewModal({
                                    title: "Evidence",
                                    vpa: r.payerVpa,
                                    contentLabel: "Evidence",
                                    content: r.evidence
                                  })
                                }
                                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                              >
                                View
                              </button>
                            </td>

                            <td className="p-3">
                              <button
                                onClick={() =>
                                  setPayerViewModal({
                                    title: "Remark",
                                    vpa: r.payerVpa,
                                    contentLabel: "Remark",
                                    content: r.remark
                                  })
                                }
                                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                              >
                                View
                              </button>
                            </td>

                            <td className="p-3 font-bold">
                              {payerListType === "Greylist" ? (
                                <button
                                  onClick={() => {
                                    setBlockPayerVpaVal(r.payerVpa);
                                    setBlockPayerVpaDisabled(true);
                                    setBlockPayerReasonCode(r.reasonCode);
                                    setBlockPayerRemark(r.remark);
                                    setBlockPayerGreylistSource(r);
                                    setBlockPayerModalOpen(true);
                                    setGreylistWarningDesc(
                                      "Kindly check the Greylist for this VPA and download its records and evidence before blocking it for future use cases."
                                    );
                                    setGreylistWarningModalOpen(true);
                                  }}
                                  className="text-gray-900 hover:text-[#447837] cursor-pointer"
                                >
                                  Block
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setPayerUnblockRecord(r);
                                    setPayerUnblockReason("");
                                    setPayerUnblockFile(null);
                                    setPayerUnblockModalOpen(true);
                                  }}
                                  className="text-gray-900 hover:text-[#447837] cursor-pointer"
                                >
                                  Unblock
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between gap-4 mt-5 text-xs text-gray-700 font-medium">
                    <div className="flex items-center gap-2">
                      <span>Row per page</span>
                      <select
                        value={payerRowsPerPage}
                        onChange={(e) => {
                          setPayerRowsPerPage(Number(e.target.value));
                          setPayerCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-2 py-1 bg-white font-semibold"
                      >
                        <option value={3}>3</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Go to</span>
                      <input
                        type="text"
                        value={payerGoToInput}
                        onChange={(e) => setPayerGoToInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const page = parseInt(payerGoToInput, 10);
                            if (page >= 1 && page <= payerTotalPages) {
                              setPayerCurrentPage(page);
                            }
                          }
                        }}
                        className="w-12 text-center border border-gray-300 rounded py-1 font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={payerCurrentPage <= 1}
                        onClick={() => setPayerCurrentPage(p => Math.max(1, p - 1))}
                        className="px-2 py-1 text-gray-600 disabled:opacity-40 cursor-pointer font-semibold"
                      >
                        ‹ Previous
                      </button>

                      <span className="px-2.5 py-1 bg-rose-800 text-white font-bold rounded">
                        {payerCurrentPage}
                      </span>

                      <button
                        disabled={payerCurrentPage >= payerTotalPages}
                        onClick={() => setPayerCurrentPage(p => Math.min(payerTotalPages, p + 1))}
                        className="px-2 py-1 text-gray-600 disabled:opacity-40 cursor-pointer font-semibold"
                      >
                        Next ›
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- ALL MODALS --- */}

      {/* PAYEE: View VPA Details Modal */}
      {viewDetailsModalRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[460px] max-w-[92vw] shadow-2xl relative text-left">
            <button
              onClick={() => setViewDetailsModalRecord(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 cursor-pointer text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">New VPA Details</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Merchant Name<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={viewDetailsModalRecord.merchantName}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  New VPA<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={viewDetailsModalRecord.vpa}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <FileText className="w-4 h-4 text-gray-600" />
                <button
                  onClick={() => triggerVerifyToast("There is no attachment available!!!", true)}
                  className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                >
                  attached file
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setViewDetailsModalRecord(null)}
                  className="w-full py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYEE: Add VPA Modal */}
      {addVpaRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[460px] max-w-[92vw] shadow-2xl relative text-left">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Add VPA</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Merchant Name<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={addVpaRecord.merchantName}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Old VPA<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={addVpaRecord.vpa}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Create VPA<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter VPA ID"
                    value={addVpaNewInput}
                    onChange={(e) => {
                      setAddVpaNewInput(e.target.value);
                      setAddVpaVerified(false);
                    }}
                    className="flex-1 border border-gray-300 rounded-md p-2.5 text-xs font-semibold focus:ring-1 focus:ring-[#447837]"
                  />
                  <button
                    onClick={() => {
                      if (!addVpaNewInput.trim()) {
                        triggerToast("Enter a VPA ID to verify");
                        return;
                      }
                      setAddVpaVerified(true);
                      triggerVerifyToast("VPA available for onboard.");
                    }}
                    className="px-4 py-2 border border-rose-600 text-rose-600 rounded-md font-bold hover:bg-emerald-50 transition cursor-pointer whitespace-nowrap"
                  >
                    {addVpaVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>

              <div>
                <label className="inline-block border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer">
                  Attach Files
                  <input
                    type="file"
                    onChange={(e) => setAddVpaFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {addVpaFile && <span className="ml-2 text-gray-600 font-medium">{addVpaFile.name}</span>}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Remarks<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <textarea
                  placeholder="Enter Your Remarks"
                  value={addVpaRemarks}
                  onChange={(e) => setAddVpaRemarks(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs font-medium h-20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAddVpaRecord(null)}
                  className="flex-1 py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!addVpaNewInput.trim() || !addVpaRemarks.trim()) {
                      triggerToast("Please fill all required fields.");
                      return;
                    }
                    if (!addVpaVerified) {
                      triggerToast("Please verify the VPA before adding.");
                      return;
                    }
                    const newRecord: PayeeVpaRecord = {
                      ...addVpaRecord,
                      vpa: addVpaNewInput.trim(),
                      remarks: addVpaRemarks.trim(),
                      vpaStatus: "ACTIVE",
                      approvalStatus: "APPROVED",
                      updatedAt: new Date().toLocaleString()
                    };
                    setPayeeList([newRecord, ...payeeList]);
                    setAddVpaRecord(null);
                    setSuccessModalTitle("Successfully Updated!!");
                  }}
                  className="flex-1 py-2.5 bg-[#447837] text-white rounded-md font-bold hover:bg-[#36602A] transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYEE: Block VPA Modal */}
      {blockVpaRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[460px] max-w-[92vw] shadow-2xl relative text-left">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Block VPA</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Merchant Name*</label>
                <input
                  type="text"
                  value={blockVpaRecord.merchantName}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">VPA*</label>
                <input
                  type="text"
                  value={blockVpaRecord.vpa}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold font-mono"
                />
              </div>

              <div>
                <label className="inline-block border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer">
                  Attach Files
                  <input
                    type="file"
                    onChange={(e) => setBlockVpaFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {blockVpaFile && <span className="ml-2 text-gray-600 font-medium">{blockVpaFile.name}</span>}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Reason of Blocking*</label>
                <textarea
                  placeholder="Enter Reason of Blocking"
                  value={blockVpaReason}
                  onChange={(e) => setBlockVpaReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs font-medium h-20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setBlockVpaRecord(null)}
                  className="flex-1 py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!blockVpaReason.trim()) {
                      triggerToast("Reason of Blocking is required");
                      return;
                    }
                    setPayeeList(
                      payeeList.map(r =>
                        r.vpa === blockVpaRecord.vpa ? { ...r, vpaStatus: "INACTIVE", remarks: blockVpaReason } : r
                      )
                    );
                    setBlockVpaRecord(null);
                    setSuccessModalTitle("Blocked Successfully!!");
                  }}
                  className="flex-1 py-2.5 bg-[#447837] text-white rounded-md font-bold hover:bg-[#36602A] cursor-pointer"
                >
                  Confirm Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYEE: Unblock VPA Modal */}
      {unblockVpaRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[460px] max-w-[92vw] shadow-2xl relative text-left">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Unblock VPA</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Merchant Name*</label>
                <input
                  type="text"
                  value={unblockVpaRecord.merchantName}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Blocked VPA*</label>
                <input
                  type="text"
                  value={unblockVpaRecord.vpa}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold font-mono"
                />
              </div>

              <div>
                <label className="inline-block border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer">
                  Attach Files
                  <input
                    type="file"
                    onChange={(e) => setUnblockVpaFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {unblockVpaFile && <span className="ml-2 text-gray-600 font-medium">{unblockVpaFile.name}</span>}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Reason of Unblocking*</label>
                <textarea
                  placeholder="Enter Reason of Unblocking"
                  value={unblockVpaReason}
                  onChange={(e) => setUnblockVpaReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs font-medium h-20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setUnblockVpaRecord(null)}
                  className="flex-1 py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!unblockVpaReason.trim()) {
                      triggerToast("Reason of Unblocking is required");
                      return;
                    }
                    setPayeeList(
                      payeeList.map(r =>
                        r.vpa === unblockVpaRecord.vpa ? { ...r, vpaStatus: "ACTIVE", remarks: unblockVpaReason } : r
                      )
                    );
                    setUnblockVpaRecord(null);
                    setSuccessModalTitle("Unblocked Successfully!!");
                  }}
                  className="flex-1 py-2.5 bg-[#447837] text-white rounded-md font-bold hover:bg-[#36602A] cursor-pointer"
                >
                  Unblock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYER: Block Payer VPA Modal */}
      {blockPayerModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[460px] max-w-[92vw] shadow-2xl relative text-left">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Block Payer VPA</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Payer VPA<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Payer VPA"
                  disabled={blockPayerVpaDisabled}
                  value={blockPayerVpaVal}
                  onChange={(e) => setBlockPayerVpaVal(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 font-semibold font-mono disabled:bg-gray-100"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Sample format: username@ta (e.g. meera.sharma@ta)
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Reason Code<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setBlockPayerReasonDropdownOpen(!blockPayerReasonDropdownOpen)}
                    className="w-full border border-gray-300 rounded-md p-2.5 text-left font-semibold flex items-center justify-between bg-white"
                  >
                    <span>
                      {blockPayerReasonCode
                        ? `${blockPayerReasonCode} - ${
                            blockPayerReasonCode === "100"
                              ? "Suspicious Activity"
                              : blockPayerReasonCode === "101"
                              ? "Fraud Alert"
                              : blockPayerReasonCode === "102"
                              ? "Multiple Failed Attempts"
                              : blockPayerReasonCode === "103"
                              ? "Compliance Hold"
                              : "Customer Request"
                          }`
                        : "Select Reason Code"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {blockPayerReasonDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                      {[
                        { code: "100", label: "Suspicious Activity" },
                        { code: "101", label: "Fraud Alert" },
                        { code: "102", label: "Multiple Failed Attempts" },
                        { code: "103", label: "Compliance Hold" },
                        { code: "104", label: "Customer Request" }
                      ].map(rc => (
                        <div
                          key={rc.code}
                          onClick={() => {
                            setBlockPayerReasonCode(rc.code);
                            setBlockPayerReasonDropdownOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-semibold flex items-center justify-between"
                        >
                          <span>{rc.code} - {rc.label}</span>
                          {blockPayerReasonCode === rc.code && <Check className="w-3.5 h-3.5 text-gray-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="inline-block border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer">
                  Attach Evidence
                  <input
                    type="file"
                    onChange={(e) => setBlockPayerFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {blockPayerFile && <span className="ml-2 text-gray-600 font-medium">{blockPayerFile.name}</span>}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Remark<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <textarea
                  placeholder="Enter Your Remark"
                  value={blockPayerRemark}
                  onChange={(e) => setBlockPayerRemark(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 h-20 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setBlockPayerModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!blockPayerVpaVal.trim()) {
                      triggerToast("Payer VPA is required");
                      return;
                    }
                    if (!blockPayerReasonCode) {
                      triggerToast("Reason Code is required");
                      return;
                    }
                    if (!blockPayerRemark.trim()) {
                      triggerToast("Remark is required");
                      return;
                    }

                    const doBlock = () => {
                      const newPayerRecord: PayerVpaRecord = {
                        payerVpa: blockPayerVpaVal.trim(),
                        status: "Blacklist",
                        blockedOn: new Date().toLocaleDateString("en-GB").split("/").join("."),
                        blockByUserId: "cybercore",
                        blockedByUserRole: "Internal Risk User",
                        reasonCode: blockPayerReasonCode,
                        evidence: `Evidence file: ${blockPayerFile ? blockPayerFile.name : "none attached"}`,
                        remark: blockPayerRemark.trim(),
                        unblockedOn: "",
                        unblockByUserId: "",
                        unblockedByUserRole: "",
                        unblockReason: ""
                      };

                      // Remove from Greylist if present
                      const filtered = payerList.filter(
                        r => !(r.payerVpa.toLowerCase() === blockPayerVpaVal.trim().toLowerCase() && r.status === "Greylist")
                      );
                      setPayerList([newPayerRecord, ...filtered]);
                      setBlockPayerModalOpen(false);
                      setPayerListType("Blacklist");
                      setPayerListTypeSelected(true);
                      setSuccessModalTitle("VPA Blocked Successfully!!");
                    };

                    const inGreylist = payerList.some(
                      r => r.payerVpa.toLowerCase() === blockPayerVpaVal.trim().toLowerCase() && r.status === "Greylist"
                    );

                    if (inGreylist && !blockPayerGreylistSource) {
                      setGreylistWarningDesc(
                        "Kindly check the Greylist for this VPA and download its records and evidence before blocking it for future use cases."
                      );
                      setGreylistWarningContinueAction(() => doBlock);
                      setGreylistWarningModalOpen(true);
                    } else {
                      doBlock();
                    }
                  }}
                  className="flex-1 py-2.5 bg-[#447837] text-white rounded-md font-bold hover:bg-[#36602A] cursor-pointer"
                >
                  Confirm Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYER: Bulk Payer VPA Block Modal */}
      {bulkPayerModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[520px] max-w-[92vw] shadow-2xl relative text-left">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Bulk Payer VPA Block</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Payer VPAs<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer">
                    Upload VPA List (CSV/TXT)
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBulkPayerFile(file);
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const text = (evt.target?.result || "").toString();
                            const lines = text
                              .split(/[\r\n,]+/)
                              .map(v => v.trim())
                              .filter(v => v && v.includes("@"));
                            setBulkPayerVpaList(Array.from(new Set(lines)));
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {bulkPayerFile && <span className="text-gray-600 font-medium">{bulkPayerFile.name}</span>}
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const sample = "Payer VPA Block list\nrahul@ta\nmeera.sharma@ta\nvikram.stores@ta\nananya.k@ta";
                    const blob = new Blob([sample], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "sample_payer_vpa_list.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-xs font-semibold text-rose-800 hover:underline mt-2 inline-block"
                >
                  ⬇ Download sample file
                </a>
              </div>

              {bulkPayerVpaList.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="font-bold text-gray-800 mb-1">
                    Preview — {bulkPayerVpaList.length} unique VPA(s)
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[11px] text-gray-700">
                    {bulkPayerVpaList.map((vpa, i) => (
                      <div key={i}>{vpa}</div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Reason Code<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setBulkPayerReasonDropdownOpen(!bulkPayerReasonDropdownOpen)}
                    className="w-full border border-gray-300 rounded-md p-2.5 text-left font-semibold flex items-center justify-between bg-white"
                  >
                    <span>
                      {bulkPayerReasonCode
                        ? `${bulkPayerReasonCode} - ${
                            bulkPayerReasonCode === "100"
                              ? "Suspicious Activity"
                              : bulkPayerReasonCode === "101"
                              ? "Fraud Alert"
                              : bulkPayerReasonCode === "102"
                              ? "Multiple Failed Attempts"
                              : bulkPayerReasonCode === "103"
                              ? "Compliance Hold"
                              : "Customer Request"
                          }`
                        : "Select Reason Code"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {bulkPayerReasonDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                      {[
                        { code: "100", label: "Suspicious Activity" },
                        { code: "101", label: "Fraud Alert" },
                        { code: "102", label: "Multiple Failed Attempts" },
                        { code: "103", label: "Compliance Hold" },
                        { code: "104", label: "Customer Request" }
                      ].map(rc => (
                        <div
                          key={rc.code}
                          onClick={() => {
                            setBulkPayerReasonCode(rc.code);
                            setBulkPayerReasonDropdownOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-semibold flex items-center justify-between"
                        >
                          <span>{rc.code} - {rc.label}</span>
                          {bulkPayerReasonCode === rc.code && <Check className="w-3.5 h-3.5 text-gray-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="inline-block border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer">
                  Attach Evidence
                  <input
                    type="file"
                    onChange={(e) => setBulkPayerEvidenceFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {bulkPayerEvidenceFile && <span className="ml-2 text-gray-600 font-medium">{bulkPayerEvidenceFile.name}</span>}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Remark<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <textarea
                  placeholder="Enter Your Remark"
                  value={bulkPayerRemark}
                  onChange={(e) => setBulkPayerRemark(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 h-20 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setBulkPayerModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!bulkPayerVpaList.length) {
                      triggerToast("Please upload at least one Payer VPA");
                      return;
                    }
                    if (!bulkPayerReasonCode) {
                      triggerToast("Reason Code is required");
                      return;
                    }
                    if (!bulkPayerRemark.trim()) {
                      triggerToast("Remark is required");
                      return;
                    }

                    const now = new Date().toLocaleDateString("en-GB").split("/").join(".");
                    const newRecords: PayerVpaRecord[] = bulkPayerVpaList.map(vpa => ({
                      payerVpa: vpa,
                      status: "Blacklist",
                      blockedOn: now,
                      blockByUserId: "cybercore",
                      blockedByUserRole: "Internal Risk User",
                      reasonCode: bulkPayerReasonCode,
                      evidence: `Evidence file: ${bulkPayerEvidenceFile ? bulkPayerEvidenceFile.name : "none attached"}`,
                      remark: bulkPayerRemark.trim(),
                      unblockedOn: "",
                      unblockByUserId: "",
                      unblockedByUserRole: "",
                      unblockReason: ""
                    }));

                    setPayerList(prev => {
                      const keys = new Set(bulkPayerVpaList.map(v => v.toLowerCase()));
                      const filtered = prev.filter(r => !keys.has(r.payerVpa.toLowerCase()));
                      return [...newRecords, ...filtered];
                    });

                    setBulkPayerModalOpen(false);
                    setPayerListType("Blacklist");
                    setPayerListTypeSelected(true);
                    setSuccessModalTitle("VPA Blocked Successfully!!");
                  }}
                  className="flex-1 py-2.5 bg-[#447837] text-white rounded-md font-bold hover:bg-[#36602A] cursor-pointer"
                >
                  Confirm Bulk Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Greylist Warning Modal */}
      {greylistWarningModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] p-4">
          <div className="bg-white rounded-xl p-6 w-[420px] max-w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Warning: Greylist Payer VPA</h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">{greylistWarningDesc}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setGreylistWarningModalOpen(false)}
                className="flex-1 py-2 border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setGreylistWarningModalOpen(false);
                  if (greylistWarningContinueAction) {
                    greylistWarningContinueAction();
                  }
                }}
                className="flex-1 py-2 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#36602A] cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYER: Unblock Modal */}
      {payerUnblockModalOpen && payerUnblockRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[460px] max-w-[92vw] shadow-2xl relative text-left">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Unblock Payer VPA</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Payer VPA*</label>
                <input
                  type="text"
                  value={payerUnblockRecord.payerVpa}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 text-gray-700 font-semibold font-mono"
                />
              </div>

              <div>
                <label className="inline-block border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer">
                  Attach Files
                  <input
                    type="file"
                    onChange={(e) => setPayerUnblockFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {payerUnblockFile && <span className="ml-2 text-gray-600 font-medium">{payerUnblockFile.name}</span>}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Reason of Unblocking*</label>
                <textarea
                  placeholder="Enter Reason of Unblocking"
                  value={payerUnblockReason}
                  onChange={(e) => setPayerUnblockReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 h-20 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPayerUnblockModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!payerUnblockReason.trim()) {
                      triggerToast("Reason of Unblocking is required");
                      return;
                    }
                    setPayerUnblockModalOpen(false);
                    setOtpModalTitle("OTP Verification — Unblock Payer VPA");
                    setOtpValue("");
                    setPendingOtpAction(() => () => {
                      const now = new Date().toLocaleDateString("en-GB").split("/").join(".");
                      setPayerList(
                        payerList.map(r =>
                          r.payerVpa === payerUnblockRecord.payerVpa
                            ? {
                                ...r,
                                status: "Greylist",
                                unblockedOn: now,
                                unblockByUserId: "cybercore",
                                unblockedByUserRole: "Internal Risk User",
                                unblockReason: payerUnblockReason
                              }
                            : r
                        )
                      );
                      setSuccessModalTitle("Unblocked Successfully!!");
                    });
                    setOtpModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-[#447837] text-white rounded-md font-bold hover:bg-[#36602A] cursor-pointer"
                >
                  Unblock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] p-4">
          <div className="bg-white rounded-xl p-6 w-[400px] max-w-full text-center shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">{otpModalTitle}</h3>
            <p className="text-xs text-gray-500 mb-5">
              An OTP has been sent to your registered mobile number. Enter it below to confirm this action.
            </p>

            <div className="text-left mb-4">
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Enter OTP<span className="text-rose-600 ml-0.5">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-center font-mono font-bold tracking-widest text-sm"
              />
            </div>

            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => triggerToast("OTP resent to registered mobile number")}
                className="text-xs font-bold text-[#447837] hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOtpModalOpen(false)}
                className="flex-1 py-2 border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!/^\d{6}$/.test(otpValue.trim())) {
                    triggerToast("Enter a valid 6-digit OTP");
                    return;
                  }
                  setOtpModalOpen(false);
                  if (pendingOtpAction) {
                    pendingOtpAction();
                  }
                }}
                className="flex-1 py-2 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#36602A] cursor-pointer"
              >
                Verify & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payer Evidence / Remark View Modal */}
      {payerViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[10000]">
          <div className="bg-white rounded-xl p-7 w-[460px] max-w-[92vw] shadow-2xl relative text-left">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">{payerViewModal.title}</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Payer VPA</label>
                <input
                  type="text"
                  value={payerViewModal.vpa}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-100 font-mono text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">{payerViewModal.contentLabel}</label>
                <textarea
                  value={payerViewModal.content}
                  disabled
                  className="w-full border border-gray-200 rounded-md p-2.5 bg-gray-50 text-gray-800 font-medium h-28"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setPayerViewModal(null)}
                  className="w-full py-2.5 border border-[#447837] text-[#447837] rounded-md font-bold hover:bg-emerald-50 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Success Modal */}
      {successModalTitle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10002] p-4">
          <div className="bg-white rounded-xl p-8 w-[400px] max-w-full text-center shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{successModalTitle}</h2>

            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div>
            </div>

            <button
              onClick={() => setSuccessModalTitle(null)}
              className="w-full py-3 bg-[#447837] text-white rounded-md text-xs font-bold hover:bg-[#36602A] transition cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Top Right Green Verify Toast */}
      {verifyToastMsg && (
        <div
          className={`fixed top-5 right-5 z-[100000] px-5 py-3 rounded-lg text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 transition-all ${
            verifyToastError ? "bg-rose-600" : "bg-emerald-600"
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
            {verifyToastError ? "✕" : "✓"}
          </div>
          <span>{verifyToastMsg}</span>
        </div>
      )}

      {/* Floating Bottom Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100000] bg-gray-900 text-white px-5 py-3 rounded-lg font-medium text-xs shadow-2xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
