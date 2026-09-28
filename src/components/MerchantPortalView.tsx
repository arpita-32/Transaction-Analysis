import React, { useState, useEffect } from "react";
import {
  FileText,
  AlertTriangle,
  X,
  ArrowLeft,
  Calendar,
  MapPin,
  User as UserIcon,
  CheckCircle,
  Download,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  BarChart2,
  HelpCircle,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  Plus,
  Info,
  UploadCloud,
  Eye,
  FileSpreadsheet,
  Check,
  Lock,
  Edit2,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { TransactionAnalyticsIllustration } from "./TransactionAnalyticsIllustration";
import { MerchantProfileView } from "./MerchantProfileView";
import { MyProfileView } from "./MyProfileView";
import { ShowUserView } from "./ShowUserView";
import { ReportsView } from "./ReportsView";
import { SettlementAccountView } from "./SettlementAndBillingViews";
import { initialUsers } from "../mockData";
import { User } from "../types";

interface MerchantPortalViewProps {
  currentRole: string;
  isESigned: boolean;
  onESignSuccess: () => void;
  onNavigateToDashboard: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onChangePasswordClick?: () => void;
  users?: User[];
  onSelectProfile?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onCreateUserClick?: () => void;
}

export function MerchantPortalView({
  currentRole,
  isESigned,
  onESignSuccess,
  onNavigateToDashboard,
  activeTab = "Dashboard",
  onTabChange,
  onChangePasswordClick,
  users = initialUsers,
  onSelectProfile,
  onUpdateUser,
  onCreateUserClick
}: MerchantPortalViewProps) {
  // Navigation inside Merchant portal: "welcome" | "document" | "dashboard"
  const [viewState, setViewState] = useState<"welcome" | "document" | "dashboard">(
    isESigned ? "dashboard" : "welcome"
  );

  // Modals
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [merchantStatusFilter, setMerchantStatusFilter] = useState("All");

  // Bulk Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Document Review States
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Acknowledgement states (replaces digital signature)
  const [acknowledged, setAcknowledged] = useState(isESigned);
  const [acknowledgedDate, setAcknowledgedDate] = useState(isESigned ? "21/09/2026 09:22 AM" : "");

  // Sync isESigned and activeTab change
  useEffect(() => {
    if (isESigned) {
      setViewState("dashboard");
      setAcknowledged(true);
    } else if (activeTab === "eSign") {
      setViewState("document");
    }
  }, [isESigned, activeTab]);

  // Handle Proceed after acknowledgement
  const handleProceedAcknowledgement = () => {
    if (!acknowledged && !isESigned) return;
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setAcknowledgedDate(formatted);
    setShowSuccessModal(true);
  };

  const handlePreviewSuccess = () => {
    setShowSuccessModal(false);
    setShowCompleteModal(true);
  };

  const handleCompleteToDashboard = () => {
    setShowCompleteModal(false);
    onESignSuccess();
    setViewState("dashboard");
    if (onTabChange) onTabChange("Dashboard");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleProcessUpload = () => {
    if (!uploadFile) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setUploadFile(null);
        if (onTabChange) onTabChange("ShowUser");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="w-full min-h-full flex flex-col font-sans relative">
      {/* ========================================================================= */}
      {/* 1. SUB-VIEW: SETTLEMENT ACCOUNT                                           */}
      {/* ========================================================================= */}
      {activeTab === "SettlementAccount" && (
        <SettlementAccountView
          isMerchantView={true}
          onBack={() => {
            if (onTabChange) onTabChange("Dashboard");
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. SUB-VIEW: SHOW USER                                                    */}
      {/* ========================================================================= */}
      {(activeTab === "ShowUser" || activeTab === "UserManagement") && (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full animate-fadeIn">
          <ShowUserView
            users={users}
            onSelectProfile={(user) => {
              if (onSelectProfile) {
                onSelectProfile(user);
              } else if (onTabChange) {
                onTabChange("MyProfile");
              }
            }}
            currentRole={currentRole}
            onCreateUserClick={() => {
              if (onCreateUserClick) {
                onCreateUserClick();
              } else {
                setShowUploadModal(true);
              }
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-VIEW: MY PROFILE                                                   */}
      {/* ========================================================================= */}
      {(activeTab === "MyProfile" || activeTab === "AccountManagement") && (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full animate-fadeIn">
          <MyProfileView
            currentRole={currentRole}
            onChangePasswordClick={onChangePasswordClick || (() => {})}
            onBack={() => {
              if (onTabChange) onTabChange("Dashboard");
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-VIEW: REPORTS                                                      */}
      {/* ========================================================================= */}
      {activeTab === "Reports" && (
        <div className="w-full animate-fadeIn">
          <ReportsView currentRole="Merchant" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUB-VIEW: HELP & SUPPORT                                               */}
      {/* ========================================================================= */}
      {activeTab === "HelpSupport" && (
        <div className="p-6 max-w-5xl mx-auto w-full animate-fadeIn">
          <div className="bg-white border border-[#E2EDE0] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EBF4E9] flex items-center justify-center text-[#447837]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Merchant Help & Support</h2>
                <p className="text-xs text-gray-500">Transaction Analysts Partner Operations Desk</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 rounded-xl p-5 hover:border-[#447837] transition bg-[#FAFDF9]">
                <h3 className="font-bold text-sm text-gray-900 mb-1">Email Support</h3>
                <p className="text-xs text-gray-500 mb-3">Reach our merchant operations desk for dispute or settlement queries.</p>
                <a href="mailto:merchant-support@transactionanalysts.com" className="text-xs font-bold text-[#447837] hover:underline">
                  merchant-support@transactionanalysts.com
                </a>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 hover:border-[#447837] transition bg-[#FAFDF9]">
                <h3 className="font-bold text-sm text-gray-900 mb-1">Helpline Desk</h3>
                <p className="text-xs text-gray-500 mb-3">Toll-free priority assistance for active merchants (9:00 AM – 7:00 PM IST).</p>
                <span className="text-xs font-bold text-[#447837]">
                  1800-266-9941
                </span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-900 block mb-1">How do T+1 UPI settlements work?</span>
                <span className="text-gray-600 leading-relaxed">All successful UPI transactions received on your QR or VPA are batched and directly credited to your verified settlement account by 08:00 AM next banking day.</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-900 block mb-1">Where can I view my acknowledged Terms and Conditions?</span>
                <span className="text-gray-600 leading-relaxed">You can download or view your acknowledged Terms and Conditions anytime by navigating to the Terms &amp; Conditions section from your portal.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MAIN MERCHANT DASHBOARD                                                */}
      {/* ========================================================================= */}
      {activeTab === "Dashboard" && viewState !== "document" && (
        <div className="w-full bg-white flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 py-8 text-center select-none animate-fadeIn">
          {/* Header Title & Subtitle matching TA Green theme */}
          <h1 className="text-3xl sm:text-[36px] font-bold text-[#1F2430] tracking-tight mb-2 font-sans">
            Welcome to TA
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium mb-8 font-sans">
            Banking made easy - Just in a jiffy •
          </p>

          {/* Central Illustration */}
          <div className="w-full max-w-2xl px-2">
            <TransactionAnalyticsIllustration
              onClick={() => {
                setViewState("document");
              }}
              className="w-full max-w-2xl h-auto cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. DOCUMENT VIEW: TERMS AND CONDITIONS WITH ACKNOWLEDGEMENT CHECKBOX       */}
      {/* ========================================================================= */}
      {viewState === "document" && (
        <div className="w-full bg-[#F4F6F8] min-h-[calc(100vh-80px)] flex flex-col text-left animate-fadeIn">
          {/* Top Document Workspace Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewState("dashboard")}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition flex items-center cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  Terms and Conditions
                </h2>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Ref: TA-TC-2026-9941</span>
                  <span>•</span>
                  <span>Pages: 1 of 1</span>
                  {isESigned || acknowledged ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Acknowledged &amp; Verified
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Pending Acknowledgement
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Document Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 text-xs">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(60, prev - 15))}
                  className="p-1 text-gray-600 hover:text-gray-900"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-medium text-gray-700">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(160, prev + 15))}
                  className="p-1 text-gray-600 hover:text-gray-900"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => alert("Terms and Conditions downloaded as PDF.")}
                className="px-3.5 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#447837]" />
                <span>Download PDF</span>
              </button>
            </div>
          </header>

          {/* Main 2-Column Document Layout */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 sm:p-6 gap-6 max-w-7xl mx-auto w-full">
            {/* Left/Center: Terms and Conditions Document Sheet */}
            <div className="flex-1 overflow-auto flex justify-center items-start bg-gray-200/60 p-4 rounded-xl shadow-inner min-h-[600px]">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                className="w-full max-w-[760px] bg-white border border-gray-300 rounded-lg shadow-xl p-8 sm:p-12 text-left relative transition-transform duration-150"
              >
                {/* Formal Letterhead */}
                <div className="border-b-2 border-[#447837] pb-6 mb-8 flex justify-between items-start">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#2E5324] font-serif tracking-wide">
                      TRANSACTION ANALYSTS
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Digital Payment Acquiring &amp; Settlement Services
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500 font-mono">
                    <p className="font-bold text-gray-800">Doc Ref: TA/TC/2026/094</p>
                    <p>Bengaluru, Karnataka</p>
                  </div>
                </div>

                {/* Document Title: Terms and Conditions */}
                <div className="text-center mb-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-wider font-serif">
                    TERMS AND CONDITIONS
                  </h2>
                  <p className="text-xs text-gray-500 font-sans mt-1">
                    Merchant UPI Acquiring, Onboarding &amp; Settlement Operations
                  </p>
                  <div className="h-1 bg-[#447837] w-24 mx-auto mt-2 rounded-full"></div>
                </div>

                {/* Document Body: Professional Terms & Conditions */}
                <div className="text-xs sm:text-[13px] leading-relaxed text-gray-700 space-y-4 font-sans">
                  <p>
                    These Terms and Conditions (&ldquo;Terms&rdquo;) govern the provision of digital payments acquiring, merchant aggregation, UPI collections, and automated settlement services provided by <strong>Transaction Analysts India Pvt Ltd</strong> (&ldquo;Company&rdquo; or &ldquo;First Party&rdquo;) to the registered merchant entity or proprietor (&ldquo;Merchant&rdquo; or &ldquo;Second Party&rdquo;, <strong>Shakti Kumar, Merchant ID: TA-MER-9941</strong>), effective as of the date of electronic acknowledgement.
                  </p>

                  <div>
                    <h3 className="font-bold text-sm text-[#2E5324] mb-1 font-serif">
                      1. Scope of UPI Acquiring Services
                    </h3>
                    <p className="text-gray-600">
                      The Company provides merchant acquiring infrastructure, static and dynamic UPI QR generation, Virtual Payment Address (VPA) allocation, and automated settlement routing in strict compliance with Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI) directives.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#2E5324] mb-1 font-serif">
                      2. Merchant Onboarding &amp; KYC Verification
                    </h3>
                    <p className="text-gray-600">
                      The Merchant warrants that all business entity details, PAN, GSTIN, identity proofs, and settlement bank credentials submitted during registration are accurate, complete, and legally valid. Any subsequent updates to business ownership or banking details must be communicated within three (3) business days.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#2E5324] mb-1 font-serif">
                      3. Settlement Schedules &amp; Processing Fees
                    </h3>
                    <p className="text-gray-600">
                      All cleared UPI transaction proceeds collected by the Merchant shall be credited to the verified settlement account under the configured T+1 settlement cycle, net of applicable Merchant Discount Rate (MDR), GST, and partner gateway processing fees specified in the onboarding schedule.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#2E5324] mb-1 font-serif">
                      4. Merchant Obligations &amp; Acceptable Usage
                    </h3>
                    <p className="text-gray-600">
                      The Merchant agrees to display authorized UPI QR codes prominently, refrain from collecting funds for prohibited goods or unauthorized financial schemes, maintain customer transaction records for at least twelve (12) months, and promptly notify the Company of any security incidents or device tampering.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#2E5324] mb-1 font-serif">
                      5. Chargebacks, Refunds &amp; Dispute Management
                    </h3>
                    <p className="text-gray-600">
                      The Merchant undertakes to cooperate with the Company in resolving customer payment disputes, providing invoice copies or delivery receipts within forty-eight (48) hours of inquiry. Legitimate chargebacks ruled in customer favor by the acquiring bank shall be debited against pending settlements.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#2E5324] mb-1 font-serif">
                      6. Confidentiality &amp; Information Security
                    </h3>
                    <p className="text-gray-600">
                      Both parties commit to safeguarding customer financial data and adhering to Information Technology Act provisions and RBI data storage mandates. Neither party shall disclose or misuse proprietary system credentials, API tokens, or merchant portal login secrets.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#2E5324] mb-1 font-serif">
                      7. Governing Law &amp; Jurisdiction
                    </h3>
                    <p className="text-gray-600">
                      These Terms and Conditions shall be governed by and interpreted under the laws of India. Any legal proceedings or arbitration arising hereunder shall fall under the exclusive jurisdiction of the competent civil courts at Bengaluru, Karnataka.
                    </p>
                  </div>
                </div>

                {/* Below Terms and Conditions: Checkbox for Acknowledgement */}
                <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300">
                  <div className="bg-[#FAFDF9] border-2 border-[#C8E2BF] rounded-xl p-5 sm:p-6 shadow-xs">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF4E9] flex items-center justify-center text-[#447837] shrink-0 mt-0.5">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2E5324] font-serif">
                          Merchant Acknowledgement &amp; Acceptance
                        </h4>
                        <p className="text-xs text-gray-500">
                          Statutory electronic confirmation and acceptance of the Terms and Conditions
                        </p>
                      </div>
                    </div>

                    {/* Acknowledgement Checkbox */}
                    <label className="flex items-start space-x-3 cursor-pointer select-none bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-[#447837] transition shadow-2xs">
                      <input
                        type="checkbox"
                        checked={acknowledged || isESigned}
                        disabled={isESigned}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded text-[#447837] focus:ring-[#447837] cursor-pointer shrink-0"
                      />
                      <div className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-bold text-gray-900 block mb-0.5 text-[13px]">
                          Acknowledgement of Terms and Conditions
                        </span>
                        I have read, understood, and accept the Terms and Conditions stated above. I hereby acknowledge that I agree to abide by all operational guidelines, fee structures, regulatory directives, and merchant obligations specified herein.
                      </div>
                    </label>

                    {/* Merchant & Acknowledgement Status Details */}
                    <div className="mt-5 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                          Merchant Name
                        </span>
                        <span className="font-bold text-gray-900">Shakti Kumar</span>
                        <span className="text-[11px] text-gray-500 block">ID: TA-MER-9941</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                          Place &amp; Date
                        </span>
                        <span className="font-semibold text-gray-800">Bengaluru, Karnataka</span>
                        <span className="text-[11px] text-gray-500 block">
                          {acknowledgedDate || (isESigned ? "21/09/2026 09:22 AM" : "Today")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                          Acknowledgement Status
                        </span>
                        {acknowledged || isESigned ? (
                          <span className="inline-flex items-center space-x-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Acknowledged &amp; Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs">
                            Pending Acknowledgement
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Acknowledgement Confirmation Panel */}
            <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-bold text-gray-900 text-sm">
                    Terms Acknowledgement
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Review and confirm onboarding terms
                  </p>
                </div>

                {/* Summary Metadata Card */}
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Document:</span>
                    <span className="font-semibold text-gray-800">Terms and Conditions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Merchant:</span>
                    <span className="font-semibold text-gray-800">Shakti Kumar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Merchant ID:</span>
                    <span className="font-mono text-gray-800">TA-MER-9941</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Place:</span>
                    <span className="font-semibold text-gray-800">Bengaluru, Karnataka</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-bold ${acknowledged || isESigned ? "text-emerald-700" : "text-amber-700"}`}>
                      {acknowledged || isESigned ? "Acknowledged" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Acknowledgement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start space-x-2.5 text-xs text-gray-700 cursor-pointer p-3 bg-[#FAFDF9] hover:bg-[#F0F6EE] rounded-xl border border-[#C8E2BF] transition select-none">
                    <input
                      type="checkbox"
                      checked={acknowledged || isESigned}
                      disabled={isESigned}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#447837] focus:ring-[#447837] cursor-pointer shrink-0"
                    />
                    <span className="leading-tight text-gray-800 font-medium">
                      I have read, understood, and agree to the <strong>Terms and Conditions</strong>
                    </span>
                  </label>
                </div>

                {/* Instructions */}
                <p className="text-[11px] text-gray-500 leading-normal">
                  By checking the acknowledgement box above, you confirm your consent to the Terms and Conditions governing merchant acquiring and settlement services.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t space-y-2 mt-4">
                {!isESigned ? (
                  <>
                    <button
                      type="button"
                      disabled={!acknowledged}
                      onClick={handleProceedAcknowledgement}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition cursor-pointer ${
                        acknowledged
                          ? "bg-[#447837] hover:bg-[#36612B] shadow-xs"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Acknowledge &amp; Accept Terms
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewState("dashboard")}
                      className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                    >
                      Cancel &amp; Return
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Terms Acknowledged &amp; Verified</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewState("dashboard")}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#447837] text-white hover:bg-[#36612B] transition cursor-pointer"
                    >
                      Return to Dashboard
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. BULK MERCHANT UPLOAD MODAL                                             */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative text-left border border-gray-100 animate-scaleIn">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FDF0EE] border border-[#F9D7D2] flex items-center justify-center text-[#C24134]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload Merchants</h3>
                <p className="text-xs text-gray-500">Bulk onboard merchants using an Excel sheet</p>
              </div>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-gray-300 hover:border-[#447837] transition rounded-2xl p-6 text-center bg-[#FAFDF9] mb-4">
              <FileSpreadsheet className="w-10 h-10 text-[#447837] mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-800">
                {uploadFile ? uploadFile.name : "Drag and drop your merchant Excel sheet here"}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Supports .xlsx, .xls, .csv up to 10MB
              </p>
              <label className="mt-3 inline-block px-4 py-1.5 bg-white border border-gray-300 text-[#447837] hover:bg-gray-50 text-xs font-bold rounded-lg cursor-pointer shadow-2xs">
                Browse Files
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Template Download & Instructions */}
            <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 mb-5">
              <span>Need the standard onboarding template?</span>
              <button
                type="button"
                onClick={() => alert("Merchant Bulk Template (.xlsx) downloaded.")}
                className="font-bold text-[#447837] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample .xlsx</span>
              </button>
            </div>

            {/* Processing state */}
            {isUploading && (
              <div className="mb-4 text-center">
                <div className="w-6 h-6 border-2 border-[#447837] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-700">Validating &amp; importing merchants...</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Merchants imported successfully! Redirecting to user directory...</span>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!uploadFile || isUploading}
                onClick={handleProcessUpload}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition ${
                  uploadFile && !isUploading
                    ? "bg-[#447837] hover:bg-[#36612B] cursor-pointer shadow-xs"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Upload &amp; Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. INFORMATION MODAL                                                      */}
      {/* ========================================================================= */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-left animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E6E6FA] flex items-center justify-center text-[#2A2374]">
                  <Info className="w-4 h-4 fill-current" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Merchant Management Guide
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <p>
                <strong>Merchant Management</strong> enables distributors, partners, and administrators to orchestrate merchants:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-500">
                <li><strong>Upload Merchants:</strong> Bulk onboard hundreds of stores using the standardized Excel template.</li>
                <li><strong>View Merchants:</strong> Access the user registry to inspect KYC, VPAs, settlement accounts, and onboarding statuses.</li>
                <li><strong>Terms &amp; Conditions:</strong> Review and acknowledge the onboarding Terms and Conditions with instant digital verification.</li>
              </ul>
              <div className="bg-[#F0F6EE] p-3 rounded-lg border border-[#C8E2BF] text-[#2E5324] text-[11px] font-medium mt-3">
                Use the <strong>Status dropdown</strong> to quickly filter between Active, Inactive, and Pending records.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-[#447837] text-white text-xs font-bold rounded-lg hover:bg-[#36612B] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TERMS AND CONDITIONS MODAL                                            */}
      {/* ========================================================================= */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 relative animate-scaleIn border border-gray-100 text-left">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#447837] shrink-0" />
              <h2 className="text-lg font-bold text-gray-900">
                Terms and Conditions
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-3.5 mb-6">
              <p>
                Please review and acknowledge the Terms and Conditions to activate your merchant acquiring services and account features.
              </p>
              <p>
                You can inspect the entire document and verify your acknowledgement using the checkbox provided.
              </p>
            </div>

            <div className="flex flex-col space-y-2.5">
              <button
                onClick={() => {
                  setShowTermsModal(false);
                  setViewState("document");
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white font-bold text-sm transition shadow-xs cursor-pointer text-center"
              >
                Review Terms &amp; Conditions
              </button>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 relative text-center border border-gray-100 animate-scaleIn">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Terms &amp; Conditions Acknowledged!
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Your acknowledgement of the Terms and Conditions has been successfully recorded and verified.
            </p>

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#EBF4E9] border-2 border-[#C8E2BF] flex items-center justify-center text-[#447837]">
              <CheckCircle className="w-12 h-12 stroke-[2.5]" />
            </div>

            <button
              onClick={handlePreviewSuccess}
              className="w-full py-2.5 px-4 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white font-bold text-sm transition shadow-xs cursor-pointer"
            >
              View Document
            </button>
          </div>
        </div>
      )}

      {/* COMPLETE MODAL */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 relative text-center border border-gray-100 animate-scaleIn">
            <button
              onClick={() => setShowCompleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Acknowledgement Completed
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Terms and Conditions accepted. You can now access your merchant dashboard and collection terminals.
            </p>

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#EBF4E9] border-2 border-[#C8E2BF] flex items-center justify-center text-[#447837]">
              <CheckCircle className="w-12 h-12 stroke-[2.5]" />
            </div>

            <button
              onClick={handleCompleteToDashboard}
              className="w-full py-2.5 px-4 rounded-lg bg-[#447837] hover:bg-[#36612B] text-white font-bold text-sm transition shadow-xs cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* STORE QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center relative border border-gray-100 animate-scaleIn">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Store Payment QR
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              shaktiretail@tapay • Shakti Retail &amp; UPI
            </p>

            <div className="bg-[#FAFDF9] border-2 border-[#C8E2BF] rounded-2xl p-6 mb-4 flex flex-col items-center justify-center">
              <div className="w-44 h-44 bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-center shadow-xs">
                <QrCode className="w-36 h-36 text-[#2E5324]" />
              </div>
              <span className="text-[11px] font-bold text-[#447837] mt-3">
                Scan to pay with any UPI App
              </span>
            </div>

            <button
              onClick={() => {
                alert("QR Code downloaded as PNG.");
                setShowQrModal(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#447837] hover:bg-[#36612B] text-white font-bold text-xs transition"
            >
              Download Standee QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
