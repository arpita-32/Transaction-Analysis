import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Download,
  MoreVertical,
  X,
  Calendar,
  Paperclip,
  RotateCcw,
  FileText,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Upload,
  FileUp,
  Eye,
  PlusCircle,
  UploadCloud,
  CheckCircle
} from "lucide-react";

export interface ChargebackRow {
  id: number;
  rrn: string;
  terminalId: string;
  adjType: string;
  amount: string;
  transferType: string;
  status: string;
  subStatus: string;
  glNo: string;
  txnDate: string;
  beneficiary: string;
  remitter: string;
  adjDate: string;
  leinAmount: string;
  transactionId: string;
  reasonText?: string;
  documentName?: string;
}

const initialRows: ChargebackRow[] = [
  // --- Chargeback Rows ---
  {
    id: 1,
    rrn: "47669879",
    terminalId: "0123456789",
    adjType: "Chargeback",
    amount: "3,782.00",
    transferType: "UPI",
    status: "New",
    subStatus: "Chargeback New",
    glNo: "354422",
    txnDate: "19/06/2024",
    beneficiary: "User357",
    remitter: "User357",
    adjDate: "12/03/25",
    leinAmount: "1000",
    transactionId: "Txnj34ll",
    reasonText:
      "Based on internal investigation and transaction monitoring, this case exhibits patterns consistent with suspicious or unauthorized activity. The merchant's supporting documents do not adequately address the discrepancies or provide sufficient evidence to counter the risk indicators.",
    documentName: "Admin_document.CSV"
  },
  {
    id: 2,
    rrn: "47669880",
    terminalId: "0123456789",
    adjType: "Chargeback",
    amount: "5,120.00",
    transferType: "UPI",
    status: "In Progress",
    subStatus: "Chargeback In Progress",
    glNo: "354422",
    txnDate: "20/06/2024",
    beneficiary: "User358",
    remitter: "User358",
    adjDate: "12/03/25",
    leinAmount: "1500",
    transactionId: "Txnj35mm",
    reasonText:
      "Customer initiated chargeback due to service fulfillment delay.",
    documentName: "Evidence_Receipt.pdf"
  },
  {
    id: 3,
    rrn: "47669881",
    terminalId: "0123456789",
    adjType: "Chargeback",
    amount: "1,250.00",
    transferType: "UPI",
    status: "Won",
    subStatus: "Chargeback Won",
    glNo: "354422",
    txnDate: "18/06/2024",
    beneficiary: "User359",
    remitter: "User359",
    adjDate: "11/03/25",
    leinAmount: "0",
    transactionId: "Txnj36nn",
    reasonText: "Merchant provided complete proof of service delivery with customer sign-off.",
    documentName: "Proof_Of_Delivery.pdf"
  },
  {
    id: 4,
    rrn: "47669882",
    terminalId: "0123456789",
    adjType: "Chargeback",
    amount: "8,400.00",
    transferType: "UPI",
    status: "Resubmit",
    subStatus: "Chargeback Resubmit",
    glNo: "354422",
    txnDate: "17/06/2024",
    beneficiary: "User360",
    remitter: "User360",
    adjDate: "10/03/25",
    leinAmount: "2000",
    transactionId: "Txnj37oo",
    reasonText: "Re-submission required due to missing authorization logs in initial packet.",
    documentName: "Auth_Log_Ext.CSV"
  },
  {
    id: 5,
    rrn: "47669883",
    terminalId: "0123456789",
    adjType: "Chargeback",
    amount: "2,100.00",
    transferType: "UPI",
    status: "Lost",
    subStatus: "Chargeback Lost",
    glNo: "354422",
    txnDate: "16/06/2024",
    beneficiary: "User361",
    remitter: "User361",
    adjDate: "09/03/25",
    leinAmount: "2100",
    transactionId: "Txnj38pp",
    reasonText: "Chargeback closed in favor of cardholder due to non-response from merchant within SLA.",
    documentName: "SLA_Notice.pdf"
  },

  // --- Pre Arbitration Rows ---
  {
    id: 6,
    rrn: "47669884",
    terminalId: "0123456789",
    adjType: "Pre Arbitration",
    amount: "2,450.00",
    transferType: "UPI",
    status: "New",
    subStatus: "Pre-Arbitration New",
    glNo: "354422",
    txnDate: "21/06/2024",
    beneficiary: "User362",
    remitter: "User362",
    adjDate: "12/03/25",
    leinAmount: "2000",
    transactionId: "Txnj39qq",
    reasonText: "Pre-arbitration notice issued by issuing bank regarding transaction discrepancy.",
    documentName: "Pre_Arbitration_Notice.pdf"
  },
  {
    id: 7,
    rrn: "47669885",
    terminalId: "0123456789",
    adjType: "Pre Arbitration",
    amount: "6,700.00",
    transferType: "UPI",
    status: "In Progress",
    subStatus: "Pre-Arbitration In Progress",
    glNo: "354422",
    txnDate: "22/06/2024",
    beneficiary: "User363",
    remitter: "User363",
    adjDate: "13/03/25",
    leinAmount: "3000",
    transactionId: "Txnj40rr",
    reasonText: "Issuer rejected initial chargeback response. Case escalated to pre-arbitration review.",
    documentName: "PreArb_Escalation.pdf"
  },
  {
    id: 8,
    rrn: "47669886",
    terminalId: "0123456789",
    adjType: "Pre Arbitration",
    amount: "4,100.00",
    transferType: "UPI",
    status: "Won",
    subStatus: "Pre-Arbitration Won",
    glNo: "354422",
    txnDate: "15/06/2024",
    beneficiary: "User364",
    remitter: "User364",
    adjDate: "09/03/25",
    leinAmount: "0",
    transactionId: "Txnj41ss",
    reasonText: "Pre-arbitration ruled in favor of acquirer bank after secondary audit.",
    documentName: "NPCI_PreArb_Ruling.pdf"
  },

  // --- Differed Chargeback Rows ---
  {
    id: 9,
    rrn: "47669887",
    terminalId: "0123456789",
    adjType: "Differed Chargeback",
    amount: "1,890.00",
    transferType: "UPI",
    status: "New",
    subStatus: "Differed Chargeback New",
    glNo: "354422",
    txnDate: "22/06/2024",
    beneficiary: "User365",
    remitter: "User365",
    adjDate: "12/03/25",
    leinAmount: "1000",
    transactionId: "Txnj42tt",
    reasonText: "Differed chargeback initiated per network settlement cycle.",
    documentName: "Differed_Log.CSV"
  },
  {
    id: 10,
    rrn: "47669888",
    terminalId: "0123456789",
    adjType: "Differed Chargeback",
    amount: "3,300.00",
    transferType: "UPI",
    status: "In Progress",
    subStatus: "Differed Chargeback In Progress",
    glNo: "354422",
    txnDate: "23/06/2024",
    beneficiary: "User366",
    remitter: "User366",
    adjDate: "13/03/25",
    leinAmount: "1500",
    transactionId: "Txnj43uu",
    reasonText: "Differed settlement balance verification underway by operations team.",
    documentName: "Batch_Audit.pdf"
  },
  {
    id: 11,
    rrn: "47669889",
    terminalId: "0123456789",
    adjType: "Differed Chargeback",
    amount: "950.00",
    transferType: "UPI",
    status: "Won",
    subStatus: "Differed Chargeback Won",
    glNo: "354422",
    txnDate: "14/06/2024",
    beneficiary: "User367",
    remitter: "User367",
    adjDate: "08/03/25",
    leinAmount: "0",
    transactionId: "Txnj44vv",
    reasonText: "Reconciliation discrepancy resolved and funds released.",
    documentName: "Recon_Clearance.pdf"
  },

  // --- Fraud Chargeback Rows ---
  {
    id: 12,
    rrn: "47669890",
    terminalId: "0123456789",
    adjType: "Fraud Chargeback",
    amount: "12,300.00",
    transferType: "UPI",
    status: "New",
    subStatus: "Fraud Chargeback New",
    glNo: "354422",
    txnDate: "23/06/2024",
    beneficiary: "User368",
    remitter: "User368",
    adjDate: "12/03/25",
    leinAmount: "3000",
    transactionId: "Txnj45ww",
    reasonText: "Fraud alert raised by risk engine.",
    documentName: "Risk_Analysis_Report.pdf"
  },
  {
    id: 13,
    rrn: "47669891",
    terminalId: "0123456789",
    adjType: "Fraud Chargeback",
    amount: "18,500.00",
    transferType: "UPI",
    status: "In Progress",
    subStatus: "Fraud Chargeback In Progress",
    glNo: "354422",
    txnDate: "24/06/2024",
    beneficiary: "User369",
    remitter: "User369",
    adjDate: "14/03/25",
    leinAmount: "5000",
    transactionId: "Txnj46xx",
    reasonText: "Multiple high-value fraudulent attempts detected across velocity rules.",
    documentName: "Cyber_Security_Audit.pdf"
  },
  {
    id: 14,
    rrn: "47669892",
    terminalId: "0123456789",
    adjType: "Fraud Chargeback",
    amount: "7,800.00",
    transferType: "UPI",
    status: "Resubmit",
    subStatus: "Fraud Chargeback Resubmit",
    glNo: "354422",
    txnDate: "16/06/2024",
    beneficiary: "User370",
    remitter: "User370",
    adjDate: "10/03/25",
    leinAmount: "2500",
    transactionId: "Txnj47yy",
    reasonText: "Resubmitting fraud dispute with police FIR document copy.",
    documentName: "FIR_Copy.pdf"
  },

  // --- Arbitration Rows ---
  {
    id: 15,
    rrn: "47669893",
    terminalId: "0123456789",
    adjType: "Arbitration",
    amount: "8,900.00",
    transferType: "UPI",
    status: "New",
    subStatus: "Arbitration New",
    glNo: "354422",
    txnDate: "24/06/2024",
    beneficiary: "User371",
    remitter: "User371",
    adjDate: "12/03/25",
    leinAmount: "2500",
    transactionId: "Txnj48zz",
    reasonText: "Arbitration proceedings initiated following unresolved pre-arbitration.",
    documentName: "Arbitration_Filing.pdf"
  },
  {
    id: 16,
    rrn: "47669894",
    terminalId: "0123456789",
    adjType: "Arbitration",
    amount: "15,400.00",
    transferType: "UPI",
    status: "In Progress",
    subStatus: "Arbitration In Progress",
    glNo: "354422",
    txnDate: "25/06/2024",
    beneficiary: "User372",
    remitter: "User372",
    adjDate: "15/03/25",
    leinAmount: "4000",
    transactionId: "Txnj49aa",
    reasonText: "Arbitration panel reviewing final evidentiary submission from both institutions.",
    documentName: "Final_Evidence_Packet.pdf"
  },
  {
    id: 17,
    rrn: "47669895",
    terminalId: "0123456789",
    adjType: "Arbitration",
    amount: "11,200.00",
    transferType: "UPI",
    status: "Won",
    subStatus: "Arbitration Won",
    glNo: "354422",
    txnDate: "10/06/2024",
    beneficiary: "User373",
    remitter: "User373",
    adjDate: "05/03/25",
    leinAmount: "0",
    transactionId: "Txnj50bb",
    reasonText: "Arbitration panel ruled in favor of acquirer bank.",
    documentName: "Arbitration_Panel_Verdict.pdf"
  }
];

const STATUS_OPTIONS = [
  "Chargeback Raise",
  "Differed Chargeback Raise",
  "Fraud Chargeback Raise",
  "Pre-Arbitration Raise",
  "Arbitration Raise"
];

const SUB_STATUS_MAP: Record<string, string[]> = {
  "Chargeback Raise": [
    "Chargeback New",
    "Chargeback Lost",
    "Chargeback In Progress",
    "Chargeback Resubmit",
    "Chargeback Won"
  ],
  "Differed Chargeback Raise": [
    "Differed Chargeback New",
    "Differed Chargeback Lost",
    "Differed Chargeback In Progress",
    "Differed Chargeback Resubmit",
    "Differed Chargeback Won"
  ],
  "Fraud Chargeback Raise": [
    "Fraud Chargeback New",
    "Fraud Chargeback Lost",
    "Fraud Chargeback In Progress",
    "Fraud Chargeback Resubmit",
    "Fraud Chargeback Won"
  ],
  "Pre-Arbitration Raise": [
    "Pre-Arbitration New",
    "Pre-Arbitration Lost",
    "Pre-Arbitration In Progress",
    "Pre-Arbitration Resubmit",
    "Pre-Arbitration Won"
  ],
  "Arbitration Raise": [
    "Arbitration New",
    "Arbitration Lost",
    "Arbitration In Progress",
    "Arbitration Resubmit",
    "Arbitration Won"
  ]
};

export function DisputeView({ currentRole = "Admin Maker" }: { currentRole?: string }) {
  const roleLower = currentRole?.toLowerCase() || "";
  const isReadOnlyRole =
    roleLower === "aggregator" ||
    roleLower === "partner" ||
    roleLower.includes("viewer") ||
    roleLower.includes("internal ops");

  const [chargebackMode, setChargebackMode] = useState<"select" | "raise" | "view">(
    isReadOnlyRole ? "view" : "select"
  );

  useEffect(() => {
    if (isReadOnlyRole) {
      setChargebackMode("view");
    }
  }, [isReadOnlyRole]);

  const [rows, setRows] = useState<ChargebackRow[]>(initialRows);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Bulk Upload state
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isUploadSuccessModalOpen, setIsUploadSuccessModalOpen] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDownloadSampleFile = () => {
    const headers = "Txnuid,Uid,Adjdate,Adjtype,Remitter,Beneficiery,Response,Txndate,Txntime,RRN,Txnamount,Merchant Code,PA/PG Name,TAT,payer_vpa,PayeeVpa,Debit Status,Api comment,txn Status,Moble Number,Reason Code,Dispute Cycle";
    const sampleRow1 = "TXN10001,UID98761,12/03/2025,Chargeback,User357,User358,Success,19/06/2024,10:30:00,47669879,3782.00,MERCH001,UPI_PG,24h,user357@upi,user358@upi,Debited,Successful transaction,Success,9876543210,RC101,1";
    const sampleRow2 = "TXN10002,UID98762,12/03/2025,Pre Arbitration,User359,User360,Success,20/06/2024,11:45:00,47669880,5120.00,MERCH002,UPI_PG,24h,user359@upi,user360@upi,Debited,Double debit reported,Success,9876543211,RC102,1";
    const csvContent = `${headers}\n${sampleRow1}\n${sampleRow2}\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Bulk_mechant_onboarding.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Search / Filter Form state
  const [fromDate, setFromDate] = useState("7/23/2026");
  const [toDate, setToDate] = useState("7/23/2026");
  const [rrnInput, setRrnInput] = useState("");
  const [txnIdInput, setTxnIdInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Dropdown Open States
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSubStatusOpen, setIsSubStatusOpen] = useState(false);

  // Menu popover state
  const [activeMenuRowId, setActiveMenuRowId] = useState<number | null>(null);

  // Modal States
  const [selectedRow, setSelectedRow] = useState<ChargebackRow | null>(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineModalSource, setDeclineModalSource] = useState<"action" | "remarks">("action");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);

  // Decline Request Form inputs
  const [declineReason, setDeclineReason] = useState("");
  const [declineAttachmentName, setDeclineAttachmentName] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeSubStatusOptions = statusFilter && SUB_STATUS_MAP[statusFilter]
    ? SUB_STATUS_MAP[statusFilter]
    : [];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    triggerToast("Chargeback query results updated");
  };

  const handleOpenDeclineModal = (row: ChargebackRow, source: "action" | "remarks" = "action") => {
    setSelectedRow(row);
    setDeclineModalSource(source);
    setDeclineReason("");
    setDeclineAttachmentName("");
    setIsDeclineModalOpen(true);
    setActiveMenuRowId(null);
    setIsRemarksModalOpen(false);
  };

  const handleOpenHistoryModal = (row: ChargebackRow) => {
    setSelectedRow(row);
    setIsHistoryModalOpen(true);
    setActiveMenuRowId(null);
  };

  const handleOpenRemarksModal = (row: ChargebackRow) => {
    setSelectedRow(row);
    setIsRemarksModalOpen(false);
    setTimeout(() => {
      setIsRemarksModalOpen(true);
    }, 50);
    setActiveMenuRowId(null);
  };

  const handleAccept = (row: ChargebackRow) => {
    setRows(prev =>
      prev.map(r => (r.id === row.id ? { ...r, status: "Accepted" } : r))
    );
    triggerToast(`Chargeback for RRN ${row.rrn} accepted successfully`);
    setActiveMenuRowId(null);
  };

  const handleConsider = () => {
    if (selectedRow) {
      setRows(prev =>
        prev.map(r => (r.id === selectedRow.id ? { ...r, status: "Considered" } : r))
      );
      triggerToast(`Request considered for RRN ${selectedRow.rrn}`);
      setIsRemarksModalOpen(false);
    }
  };

  const handleConfirmDecline = (e: FormEvent) => {
    e.preventDefault();
    if (selectedRow) {
      setRows(prev =>
        prev.map(r => (r.id === selectedRow.id ? { ...r, status: "Rejected" } : r))
      );
      triggerToast(`Decline request submitted for RRN ${selectedRow.rrn}`);
      setIsDeclineModalOpen(false);
    }
  };

  // Filter rows
  const filteredRows = rows.filter(r => {
    if (rrnInput && !r.rrn.toLowerCase().includes(rrnInput.toLowerCase())) return false;
    if (txnIdInput && !r.transactionId.toLowerCase().includes(txnIdInput.toLowerCase())) return false;
    
    if (statusFilter) {
      const sf = statusFilter.toLowerCase();
      if (sf.includes("chargeback") && !sf.includes("differed") && !sf.includes("fraud")) {
        if (!r.adjType.toLowerCase().startsWith("chargeback") && r.adjType.toLowerCase() !== "chargeback") return false;
      } else if (sf.includes("differed")) {
        if (!r.adjType.toLowerCase().includes("differed")) return false;
      } else if (sf.includes("fraud")) {
        if (!r.adjType.toLowerCase().includes("fraud")) return false;
      } else if (sf.includes("pre-arbitration") || sf.includes("pre arbitration")) {
        if (!r.adjType.toLowerCase().includes("pre arbitration") && !r.adjType.toLowerCase().includes("pre-arbitration")) return false;
      } else if (sf.includes("arbitration")) {
        if (!r.adjType.toLowerCase().includes("arbitration") || r.adjType.toLowerCase().includes("pre")) return false;
      }
    }

    if (subStatusFilter) {
      const ssf = subStatusFilter.toLowerCase().replace(/-/g, " ");
      const rSub = r.subStatus.toLowerCase().replace(/-/g, " ");
      const rStat = r.status.toLowerCase().replace(/-/g, " ");
      if (!rSub.includes(ssf) && !rStat.includes(ssf)) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.rrn.toLowerCase().includes(q) ||
        r.terminalId.toLowerCase().includes(q) ||
        r.adjType.toLowerCase().includes(q) ||
        r.amount.toLowerCase().includes(q) ||
        r.transferType.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.subStatus.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 font-sans text-left pb-12"
    >
      {/* Toast message matching Screenshot 3 */}
      <AnimatePresence>
        {(showSuccessToast || toastMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 right-4 z-[250] bg-[#52C480] text-white px-5 py-3 rounded-lg shadow-lg text-xs font-semibold flex items-center space-x-3"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <span>{toastMessage || "File uploaded successfully"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chargeback Title & Progress bar matching screenshot */}
      <div className="pt-1">
        <div
          onClick={() => {
            if (!isReadOnlyRole) {
              setChargebackMode("select");
              setSubmitted(false);
            }
          }}
          className={`flex items-center text-gray-800 font-semibold text-sm ${
            !isReadOnlyRole ? "cursor-pointer hover:text-gray-900" : ""
          } transition`}
        >
          {!isReadOnlyRole && <ArrowLeft className="w-4 h-4 mr-1 text-gray-800 stroke-[2.5]" />}
          <span>Chargeback</span>
        </div>
        <div className="flex items-center space-x-1 mt-1 mb-5">
          <div className="w-9 h-1 bg-[#447837] rounded-full"></div>
          <div className="w-3 h-1 bg-[#8BC34A] rounded-full"></div>
          <div className="w-1.5 h-1 bg-[#CDDC39] rounded-full"></div>
        </div>
      </div>

      {/* MODE 1: SELECT CARDS (Landing Screen - Matches Screenshot 1) */}
      {chargebackMode === "select" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 px-4">
          {/* Card 1: Raise Chargeback */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={() => setChargebackMode("raise")}
            className="bg-white rounded-lg border border-gray-200/90 shadow-2xs hover:shadow-md p-10 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] group"
          >
            <div className="w-16 h-16 rounded-lg bg-[#EAF3E7] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8 text-[#447837]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2" />
                <path d="M11 2v4M13 2v4" />
                <path d="M9 10l-3 3 3 3" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Raise Chargeback</span>
          </motion.div>

          {/* Card 2: View Chargeback */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={() => setChargebackMode("view")}
            className="bg-white rounded-lg border border-gray-200/90 shadow-2xs hover:shadow-md p-10 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] group"
          >
            <div className="w-16 h-16 rounded-lg bg-[#EAF3E7] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8 text-[#447837]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <circle cx="19" cy="11" r="3" fill="#EAF3E7" stroke="#447837" strokeWidth="1.5" />
                <circle cx="19" cy="11" r="1" fill="#447837" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">View Chargeback</span>
          </motion.div>
        </div>
      )}

      {/* MODE 2: RAISE CHARGEBACK (Matches Screenshot 1) */}
      {chargebackMode === "raise" && (
        <div className="py-4 space-y-6">
          {/* Main Upload Container */}
          <div className="border border-gray-200/90 bg-white rounded-xl p-10 flex flex-col items-center justify-center max-w-2xl mx-auto shadow-2xs">
            {/* Top Outer Box containing Excel Graphic */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setUploadedFileName(e.dataTransfer.files[0].name);
                }
              }}
              className={`w-full max-w-xl border ${isDragging ? "border-[#447837] bg-red-50/20" : "border-gray-300"} rounded-lg p-12 flex flex-col items-center justify-center bg-white transition-all mb-6`}
            >
              {/* Excel Icon Frame */}
              <div className="w-48 h-32 bg-[#EAF3E7] border border-[#C8E2C2] rounded-md flex items-center justify-center relative shadow-2xs">
                {/* Folded Top Corner */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-[#D5EBD0] rounded-bl-sm"></div>
                {/* Central Excel Block */}
                <div className="w-14 h-16 bg-[#447837] rounded flex items-center justify-center shadow-md">
                  <span className="text-white text-3xl font-extrabold font-sans select-none">X</span>
                </div>
              </div>
            </div>

            <input
              type="file"
              id="bulk-chargeback-upload"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedFileName(e.target.files[0].name);
                }
              }}
            />

            {/* Buttons Row */}
            <div className="flex items-center space-x-3 mb-4">
              <label
                htmlFor="bulk-chargeback-upload"
                className="px-6 py-2 bg-[#447837] hover:bg-[#38642e] text-white text-xs font-semibold rounded cursor-pointer transition shadow-2xs"
              >
                Browse
              </label>
              <button
                type="button"
                onClick={() => setUploadedFileName("")}
                className="px-6 py-2 bg-white border border-[#447837] text-[#447837] hover:bg-[#EAF3E7] text-xs font-semibold rounded transition cursor-pointer"
              >
                Reset
              </button>
            </div>

            {uploadedFileName && (
              <div className="mb-4 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-md flex items-center space-x-2">
                <span>Selected: {uploadedFileName}</span>
                <X className="w-4 h-4 cursor-pointer hover:text-emerald-900" onClick={() => setUploadedFileName("")} />
              </div>
            )}

            {/* Instruction Text */}
            <p className="text-xs text-[#8492A6] text-center mb-5 font-normal">
              Please upload only Excel/CSV File (Bulk_mechant_onboarding.xlsx)*
            </p>

            {/* Download Sample File Button */}
            <button
              type="button"
              onClick={handleDownloadSampleFile}
              className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded flex items-center space-x-2 shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-white shrink-0" />
              <span>Download Sample File</span>
            </button>
          </div>

          {/* Action Row Bottom Right */}
          <div className="flex justify-end space-x-3 max-w-2xl mx-auto pt-2">
            <button
              type="button"
              onClick={() => {
                setIsUploadSuccessModalOpen(true);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 4000);
              }}
              className="px-6 py-2 bg-[#447837] hover:bg-[#38642e] text-white text-xs font-semibold rounded cursor-pointer transition shadow-2xs"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => {
                setChargebackMode("select");
                setUploadedFileName("");
              }}
              className="px-5 py-2 bg-white border border-[#447837] text-[#447837] hover:bg-[#EAF3E7] text-xs font-semibold rounded cursor-pointer transition"
            >
              cancel
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: VIEW CHARGEBACK (Search & Table View) */}
      {chargebackMode === "view" && (
        <div className="space-y-4">
          {!isReadOnlyRole && (
            <div className="flex justify-between items-center px-1">
              <button
                onClick={() => setChargebackMode("select")}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Selection</span>
              </button>
            </div>
          )}

      {/* Search / Filter Card Container matching screenshot */}
      <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-6 md:p-8 relative">
        <form onSubmit={handleSearchSubmit} className="space-y-6">
          {/* First Row: From Date, To Date, RRN Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* From Date */}
            <div className="relative border border-gray-300 rounded-md focus-within:border-[#3F51B5] focus-within:ring-1 focus-within:ring-[#3F51B5] transition-all bg-white">
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-normal text-gray-500 z-10">
                From Date
              </span>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <input
                  type="text"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="w-full text-xs font-normal text-gray-800 bg-transparent focus:outline-none"
                />
                <Calendar className="w-4 h-4 text-gray-500 shrink-0 ml-2 pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div className="relative border border-gray-300 rounded-md focus-within:border-[#3F51B5] focus-within:ring-1 focus-within:ring-[#3F51B5] transition-all bg-white">
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-normal text-gray-500 z-10">
                To Date
              </span>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <input
                  type="text"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="w-full text-xs font-normal text-gray-800 bg-transparent focus:outline-none"
                />
                <Calendar className="w-4 h-4 text-gray-500 shrink-0 ml-2 pointer-events-none" />
              </div>
            </div>

            {/* RRN Number */}
            <div className="relative border border-gray-300 rounded-md focus-within:border-[#3F51B5] focus-within:ring-1 focus-within:ring-[#3F51B5] transition-all bg-white">
              <input
                type="text"
                value={rrnInput}
                onChange={e => setRrnInput(e.target.value)}
                placeholder="RRN Number"
                className="w-full px-3.5 py-2.5 text-xs font-normal text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Second Row: Transaction Id, Status, Sub Status, Submit */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Transaction Id */}
            <div className="md:col-span-3 relative border border-gray-300 rounded-md focus-within:border-[#3F51B5] focus-within:ring-1 focus-within:ring-[#3F51B5] transition-all bg-white">
              <input
                type="text"
                value={txnIdInput}
                onChange={e => setTxnIdInput(e.target.value)}
                placeholder="Transaction Id"
                className="w-full px-3.5 py-2.5 text-xs font-normal text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* Status Dropdown */}
            <div className="md:col-span-4 relative">
              <div
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsSubStatusOpen(false);
                }}
                className={`relative border rounded-md px-3.5 py-2.5 bg-white cursor-pointer transition-all flex items-center justify-between ${
                  isStatusOpen
                    ? "border-[#3F51B5] ring-1 ring-[#3F51B5]"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span
                  className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-normal transition-colors z-10 ${
                    isStatusOpen ? "text-[#3F51B5]" : "text-gray-500"
                  }`}
                >
                  Status
                </span>
                <span className="text-xs text-gray-800 font-normal truncate h-4 flex items-center">
                  {statusFilter || ""}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isStatusOpen ? "rotate-180 text-[#3F51B5]" : "text-gray-500"
                  }`}
                />
              </div>

              {/* Status Menu */}
              {isStatusOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-b-md shadow-xl z-50 overflow-hidden py-1">
                  {STATUS_OPTIONS.map(opt => (
                    <div
                      key={opt}
                      onClick={() => {
                        setStatusFilter(opt);
                        setIsStatusOpen(false);
                        setSubStatusFilter("");
                      }}
                      className={`px-4 py-2.5 text-xs font-normal hover:bg-gray-100/80 cursor-pointer transition-colors ${
                        statusFilter === opt ? "bg-gray-50 font-medium text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sub Status Dropdown */}
            <div className="md:col-span-3 relative">
              <div
                onClick={() => {
                  if (!statusFilter) return;
                  setIsSubStatusOpen(!isSubStatusOpen);
                  setIsStatusOpen(false);
                }}
                className={`relative border rounded-md px-3.5 py-2.5 transition-all flex items-center justify-between ${
                  !statusFilter
                    ? "bg-gray-100/80 border-gray-200/90 cursor-not-allowed opacity-80"
                    : isSubStatusOpen
                    ? "bg-white border-[#3F51B5] ring-1 ring-[#3F51B5] cursor-pointer"
                    : "bg-white border-gray-300 hover:border-gray-400 cursor-pointer"
                }`}
              >
                <span
                  className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-normal transition-colors z-10 ${
                    !statusFilter
                      ? "text-gray-400"
                      : isSubStatusOpen
                      ? "text-[#3F51B5]"
                      : "text-gray-500"
                  }`}
                >
                  Sub Status
                </span>
                <span className="text-xs text-gray-800 font-normal truncate h-4 flex items-center">
                  {subStatusFilter || ""}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    !statusFilter
                      ? "text-gray-300"
                      : isSubStatusOpen
                      ? "rotate-180 text-[#3F51B5]"
                      : "text-gray-500"
                  }`}
                />
              </div>

              {/* Sub Status Menu */}
              {isSubStatusOpen && statusFilter && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-b-md shadow-xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
                  {activeSubStatusOptions.map(opt => (
                    <div
                      key={opt}
                      onClick={() => {
                        setSubStatusFilter(opt);
                        setIsSubStatusOpen(false);
                      }}
                      className={`px-4 py-2.5 text-xs font-normal hover:bg-gray-100/80 cursor-pointer transition-colors ${
                        subStatusFilter === opt ? "bg-gray-50 font-medium text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-start md:justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#447837] hover:bg-[#681611] text-white text-xs font-semibold rounded-md shadow-xs transition cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Toolbar & Table Section */}
      {submitted && (
        <div className="space-y-3">
          {/* Toolbar row */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-1">
            {/* Search Here Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Here"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#447837] placeholder-gray-400 text-gray-700 shadow-2xs"
              />
            </div>

            {/* Download File Button */}
            <button
              onClick={() => triggerToast("Chargeback report downloaded successfully")}
              className="px-4 py-2 bg-[#333333] hover:bg-black text-white text-xs font-semibold rounded flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer self-end sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-lg border border-gray-200/80 shadow-xs overflow-visible relative">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-700 font-bold bg-white">
                    <th className="py-3.5 px-4 font-semibold text-gray-800">Sl no.</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800">RRN</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800">Terminal Id</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800">Adjustment Type</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800">Txn Amount</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800">Transfer Type</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800 text-center">Action</th>
                    <th className="py-3.5 px-4 font-semibold text-gray-800 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-normal text-gray-700">
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-gray-800">{row.id}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-800">{row.rrn}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-700">{row.terminalId}</td>
                        <td className="py-3.5 px-4 text-gray-700">{row.adjType}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-800">{row.amount}</td>
                        <td className="py-3.5 px-4 text-gray-700">{row.transferType}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              row.status === "New"
                                ? "text-emerald-600"
                                : row.status === "Accepted" || row.status === "Considered"
                                ? "text-emerald-700 font-bold"
                                : row.status === "Rejected"
                                ? "text-red-600 font-bold"
                                : "text-amber-600 font-semibold"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>

                        {/* Action Column with Accept & Reject Pill Buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleAccept(row)}
                              className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] border border-emerald-200 transition flex items-center space-x-1 cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                              <span>Accept</span>
                            </button>

                            <button
                              onClick={() => handleOpenDeclineModal(row, "action")}
                              className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFCDD2] border border-red-200 transition flex items-center space-x-1 cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C62828]"></span>
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>

                        {/* Details Column with 3 Dots Popover Menu */}
                        <td className="py-3.5 px-4 text-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuRowId(activeMenuRowId === row.id ? null : row.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Popover Dropdown matching Screenshot 4 */}
                          {activeMenuRowId === row.id && (
                            <div className="absolute right-4 top-10 z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 text-left text-xs">
                              <button
                                onClick={() => handleOpenHistoryModal(row)}
                                className="w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#447837] flex items-center space-x-2.5 transition cursor-pointer font-medium"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                                <span>Adjustment History</span>
                              </button>

                              <button
                                onClick={() => handleOpenRemarksModal(row)}
                                className="w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#447837] flex items-center space-x-2.5 transition cursor-pointer font-medium"
                              >
                                <FileText className="w-3.5 h-3.5 text-gray-500" />
                                <span>Remarks</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-400 italic">
                        No chargeback records found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Bar */}
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-3">
              <div className="flex items-center space-x-2">
                <span>Rows per page:</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-700 focus:outline-none">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>

              {/* Red Progress Accent Line */}
              <div className="w-full max-w-xs h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-[#447837]"></div>
              </div>

              <div className="flex items-center space-x-4">
                <span>1–5 of 12</span>
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-black cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      )}

      {/* MODAL 1: DECLINE REQUEST MODAL */}
      <AnimatePresence>
        {isDeclineModalOpen && selectedRow && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-3xs flex items-center justify-center p-4 overflow-y-auto">
            {declineModalSource === "action" ? (
              /* SINGLE-COLUMN VERTICAL MODAL FOR ACTION COLUMN REJECT */
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden my-6 p-6 md:p-8 relative"
              >
                {/* Header */}
                <div className="relative text-left pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Decline Request</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Please upload the document & Reason.</p>
                  <button
                    onClick={() => setIsDeclineModalOpen(false)}
                    className="absolute right-0 top-0 p-1 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Content - Single Column Vertical Stack */}
                <form onSubmit={handleConfirmDecline} className="space-y-3.5 text-left text-xs pt-3">
                  {/* RRN */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 text-xs">
                      RRN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedRow.rrn || "6975164354"}
                      className="w-full bg-[#ECEEF0] border border-gray-200/80 rounded-md px-3.5 py-2 text-xs text-gray-800 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Transaction Id */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 text-xs">
                      Transaction Id <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedRow.transactionId || "Txnj34ll"}
                      className="w-full bg-[#ECEEF0] border border-gray-200/80 rounded-md px-3.5 py-2 text-xs text-gray-800 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 text-xs">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedRow.amount ? Number(selectedRow.amount.toString().replace(/,/g, '')).toLocaleString('en-IN') : "67,000"}
                      className="w-full bg-[#ECEEF0] border border-gray-200/80 rounded-md px-3.5 py-2 text-xs text-gray-800 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 text-xs">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedRow.status || "New"}
                      className="w-full bg-[#ECEEF0] border border-gray-200/80 rounded-md px-3.5 py-2 text-xs text-gray-800 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Created Date */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 text-xs">
                      Created Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value="02/04/2025"
                        className="w-full bg-[#ECEEF0] border border-gray-200/80 rounded-md px-3.5 py-2 text-xs text-gray-800 font-medium focus:outline-none pr-9"
                      />
                      <Calendar className="w-4 h-4 text-gray-700 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Attachment */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 text-xs">
                      Attachment <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add Attachment"
                        value={declineAttachmentName}
                        onChange={e => setDeclineAttachmentName(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C5281C] pr-9"
                      />
                      <Paperclip className="w-4 h-4 text-gray-700 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Reason for Declination */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 text-xs">
                      Reason for Declination <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="02/04/2025"
                      value={declineReason}
                      onChange={e => setDeclineReason(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C5281C] resize-none"
                    ></textarea>
                  </div>

                  {/* Stacked Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#C5281C] hover:bg-[#A81E13] text-white font-bold rounded-md shadow-2xs transition cursor-pointer text-xs"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeclineModalOpen(false)}
                      className="w-full py-2.5 bg-white border border-[#C5281C] text-[#C5281C] hover:bg-red-50 font-bold rounded-md transition cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* 2-COLUMN GRID MODAL FOR 3 DOTS -> REMARKS -> DECLINE */
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden my-6 p-6 md:p-8 relative"
              >
                {/* Header: Centered Red Title */}
                <div className="relative text-center pb-4">
                  <h3 className="text-xl font-bold text-[#D32F2F]">Decline Request</h3>
                  <button
                    onClick={() => setIsDeclineModalOpen(false)}
                    className="absolute right-0 top-0 p-1 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Content - 2 Column Grid Layout */}
                <form onSubmit={handleConfirmDecline} className="space-y-4 text-left text-xs pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {/* RRN */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 text-xs">
                        RRN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedRow.rrn || "8293798124"}
                        className="w-full bg-[#F3F4F6] border border-gray-200/90 rounded-md px-3.5 py-2.5 text-xs text-gray-800 font-medium focus:outline-none"
                      />
                    </div>

                    {/* Transaction Id */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 text-xs">
                        Transaction Id <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedRow.transactionId || "Txnj34ll"}
                        className="w-full bg-[#F3F4F6] border border-gray-200/90 rounded-md px-3.5 py-2.5 text-xs text-gray-800 font-medium focus:outline-none"
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 text-xs">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedRow.amount || "78000"}
                        className="w-full bg-[#F3F4F6] border border-gray-200/90 rounded-md px-3.5 py-2.5 text-xs text-gray-800 font-medium focus:outline-none"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 text-xs">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedRow.status || "New"}
                        className="w-full bg-[#F3F4F6] border border-gray-200/90 rounded-md px-3.5 py-2.5 text-xs text-gray-800 font-medium focus:outline-none"
                      />
                    </div>

                    {/* Created Date */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 text-xs">
                        Created Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value="02/04/2025"
                          className="w-full bg-[#F3F4F6] border border-gray-200/90 rounded-md px-3.5 py-2.5 text-xs text-gray-800 font-medium focus:outline-none pr-9"
                        />
                        <Calendar className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Attachment */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 text-xs">
                        Attachment
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Add Attachment"
                          value={declineAttachmentName}
                          onChange={e => setDeclineAttachmentName(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] pr-9"
                        />
                        <Paperclip className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Reason for Declination - Full Width */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-gray-900 font-semibold mb-1 text-xs">
                        Reason for Declination <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Add reason for declination"
                        value={declineReason}
                        onChange={e => setDeclineReason(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md p-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Side-by-Side Action Buttons: Reject & Cancel */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg shadow-sm transition cursor-pointer text-xs"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeclineModalOpen(false)}
                      className="w-full py-2.5 bg-white border border-[#D32F2F] text-[#D32F2F] hover:bg-red-50 font-bold rounded-lg transition cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADJUSTMENT HISTORY MODAL (Matches Screenshot 5) */}
      <AnimatePresence>
        {isHistoryModalOpen && selectedRow && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-3xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center text-left">
                <h3 className="text-sm font-bold text-gray-900">Adjustment History</h3>
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs text-left">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedRow.adjType.includes("Raise")
                        ? selectedRow.adjType
                        : `${selectedRow.adjType} Raised`}
                    </p>
                    <span className="px-2 py-0.5 mt-1 inline-block rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {selectedRow.status || "New"}
                    </span>
                  </div>
                  <span className="text-gray-400 font-mono">01-05-2025 11.45 PM</span>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <div>
                    <p className="font-semibold text-gray-800">Merchant Accepted</p>
                    <span className="px-2 py-0.5 mt-1 inline-block rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                      Lost
                    </span>
                  </div>
                  <span className="text-gray-400 font-mono">01-05-2025 11.45 PM</span>
                </div>

                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="w-full py-2.5 bg-[#447837] hover:bg-[#36602A] text-white font-bold rounded-lg transition cursor-pointer mt-4 shadow-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: REMARKS MODAL (Matches Screenshot 6) */}
      <AnimatePresence>
        {isRemarksModalOpen && selectedRow && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-3xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center text-left">
                <h3 className="text-sm font-bold text-gray-900">Remarks</h3>
                <button
                  onClick={() => setIsRemarksModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs text-left">
                {/* Document */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-gray-700">Document</span>
                    <button
                      type="button"
                      onClick={() => triggerToast("Downloading CSV document")}
                      className="text-[#447837] font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-lg p-2.5 flex items-center space-x-2 text-gray-700 font-mono border border-gray-200">
                    <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="truncate">{selectedRow.documentName || "Admin_document.CSV"}</span>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <span className="font-semibold text-gray-700 block mb-1.5">Reason</span>
                  <div className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-3 text-gray-600 leading-relaxed max-h-36 overflow-y-auto">
                    {selectedRow.reasonText ||
                      "Based on internal investigation and transaction monitoring, this case exhibits patterns consistent with suspicious or unauthorized activity."}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleConsider}
                    className="w-full py-2.5 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Consider
                  </button>
                  <button
                    onClick={() => handleOpenDeclineModal(selectedRow, "remarks")}
                    className="w-full py-2.5 bg-[#C82333] hover:bg-[#b01e2b] text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: UPLOAD SUCCESS MODAL (Matches Screenshot 3) */}
      <AnimatePresence>
        {isUploadSuccessModalOpen && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-3xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-8 text-center relative space-y-5"
            >
              {/* Close 'X' button */}
              <button
                onClick={() => {
                  setIsUploadSuccessModalOpen(false);
                  setChargebackMode("select");
                  setUploadedFileName("");
                }}
                className="absolute top-4 right-4 text-white bg-[#447837] hover:bg-[#36602A] p-1.5 rounded-full transition cursor-pointer shadow-xs flex items-center justify-center"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Vector Illustration */}
              <div className="w-36 h-32 mx-auto relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background Soft Arc */}
                  <path d="M20 100 C 40 40, 120 40, 140 100" fill="#F3F4F6" opacity="0.6" />
                  {/* Document Sheet */}
                  <rect x="35" y="25" width="60" height="75" rx="4" fill="white" stroke="#D1D5DB" strokeWidth="2" />
                  <rect x="43" y="37" width="22" height="4" rx="2" fill="#9CA3AF" />
                  <rect x="43" y="47" width="44" height="3" rx="1.5" fill="#E5E7EB" />
                  <rect x="43" y="55" width="44" height="3" rx="1.5" fill="#E5E7EB" />
                  <rect x="43" y="63" width="34" height="3" rx="1.5" fill="#E5E7EB" />
                  <rect x="43" y="71" width="40" height="3" rx="1.5" fill="#E5E7EB" />
                  {/* Green Check Circle */}
                  <circle cx="88" cy="30" r="12" fill="#48BB78" />
                  <path d="M82 30 L86 34 L94 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Character Illustration */}
                  <path d="M98 98 C 98 75, 120 75, 120 98" fill="#1F2937" />
                  <circle cx="110" cy="62" r="10" fill="#48BB78" />
                  <path d="M102 82 L120 85" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Success Message Title */}
              <h3 className="text-lg font-bold text-gray-900">File Upload successfully!</h3>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsUploadSuccessModalOpen(false);
                  setChargebackMode("select");
                  setUploadedFileName("");
                }}
                className="w-full py-2.5 bg-[#447837] hover:bg-[#36602A] text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
