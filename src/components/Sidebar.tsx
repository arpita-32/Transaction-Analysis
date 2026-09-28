import { useState } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LayoutGrid,
  UserCircle,
  Sliders,
  Building2,
  CreditCard,
  ClipboardList,
  FileText,
  User,
  UserPlus,
  MessageSquarePlus,
  Mail,
  Inbox,
  Cloud,
  List,
  AlertTriangle,
  PlusSquare,
  Banknote,
  HelpCircle
} from "lucide-react";

export function ShowUserIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 15l5.5 5.5" />
      <path d="M6.5 9.5 A 6.5 6.5 0 1 1 12.5 5.5" />
      <path d="M2.5 9.5 h 4 v -4" />
    </svg>
  );
}

// Active roles: Partner, Merchant, Maker, Checker
const ALL_ROLES = [
  "Partner",
  "Merchant",
  "Maker",
  "Checker",
];

interface SidebarProps {
  currentRole: string;
  activeView: string;
  activeSubView: string;
  onNavigate: (view: string, subView?: string) => void;
  onRoleChange?: (role: string) => void;
  isMerchantESigned?: boolean;
  onMerchantESignToggle?: () => void;
}

export function Sidebar({
  currentRole,
  activeView,
  activeSubView,
  onNavigate,
  onRoleChange,
  isMerchantESigned = false,
  onMerchantESignToggle,
}: SidebarProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [makerUserMgmtOpen, setMakerUserMgmtOpen] = useState(true);
  const [partnerMerchantMenuOpen, setPartnerMerchantMenuOpen] = useState(true);
  const [partnerDisputeMenuOpen, setPartnerDisputeMenuOpen] = useState(false);
  const [bankUserMgmtOpen, setBankUserMgmtOpen] = useState(true);
  const [riskMerchantMgmtOpen, setRiskMerchantMgmtOpen] = useState(
    activeView === "ReviewMerchant" || activeView === "MerchantOnboarding" || activeView === "DraftMerchant"
  );
  const [riskPaMgmtOpen, setRiskPaMgmtOpen] = useState(
    activeView === "ReviewPartner" || activeView === "OnboardingHub"
  );
  const [riskUserMgmtOpen, setRiskUserMgmtOpen] = useState(
    activeView === "UserManagement"
  );
  const [riskLimitMgmtOpen, setRiskLimitMgmtOpen] = useState(
    activeView === "LimitManagement"
  );
  const [riskVpaMgmtOpen, setRiskVpaMgmtOpen] = useState(
    activeView === "VpaManagement"
  );

  const isMerchant = currentRole === "Merchant";
  const isMaker = currentRole === "Maker" || currentRole === "Checker 3";
  const isChecker = currentRole === "Checker" || currentRole === "Checker 4";
  const isMakerOrChecker = isMaker || isChecker;
  const isInternalRiskUser = currentRole === "Internal Risk User";
  const isPartner = currentRole === "Partner" || currentRole === "Aggregator";

  // Dedicated Merchant Portal Sidebar (TA Green Theme)
  if (isMerchant) {
    return (
      <div className="w-64 bg-[#F8FAF7] h-[calc(100vh-100px)] border-r border-[#E2EDE0] flex flex-col justify-between py-5 select-none shrink-0">
        <div className="flex flex-col">
          {/* Welcome User Section */}
          <div className="px-5 pt-2 pb-4">
            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight font-sans">
              Welcome User
            </h2>
          </div>

          {/* Role Switcher Pill Dropdown */}
          <div className="px-4 pb-4 relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-[#C8E2BF] rounded-full shadow-2xs text-[11px] font-semibold text-gray-700 transition cursor-pointer"
            >
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#447837]" />
                <span>Role: <strong className="text-[#447837] font-bold">Merchant</strong></span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#447837] transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
                    Switch Portal Role
                  </div>
                  {ALL_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        if (onRoleChange) onRoleChange(role);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition flex items-center justify-between ${
                        currentRole === role
                          ? "bg-[#447837] text-white font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="px-4 space-y-2">
            {!isMerchantESigned ? (
              /* State 1: Un-signed - TA Green e-Sign button + Navigation tabs */
              <>
                <button
                  onClick={() => onNavigate("MerchantPortal", "eSign")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-sm cursor-pointer ${
                    activeSubView === "eSign"
                      ? "bg-[#36612B] text-white"
                      : "bg-[#447837] hover:bg-[#36612B] text-white"
                  }`}
                >
                  <div className="w-5 h-5 mr-3 shrink-0 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-sans font-medium">Terms &amp; Conditions</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "Dashboard")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "Dashboard" || activeSubView === ""
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <LayoutGrid className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "Dashboard" || activeSubView === "" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Dashboard</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "ShowUser")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "ShowUser" || activeSubView === "UserManagement"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <Users className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "ShowUser" || activeSubView === "UserManagement" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Show User</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "Reports")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "Reports"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "Reports" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Reports</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "SettlementAccount")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "SettlementAccount"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <CreditCard className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "SettlementAccount" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Settlement Account</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "HelpSupport")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "HelpSupport"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <HelpCircle className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "HelpSupport" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Help & Support</span>
                </button>
              </>
            ) : (
              /* State 2: E-Signed - Unlocks Dashboard, Reports, Help & Support */
              <>
                <button
                  onClick={() => onNavigate("MerchantPortal", "Dashboard")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "Dashboard" || activeSubView === ""
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <LayoutGrid className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "Dashboard" || activeSubView === "" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Dashboard</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "ShowUser")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "ShowUser" || activeSubView === "UserManagement"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <Users className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "ShowUser" || activeSubView === "UserManagement" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Show User</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "Reports")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "Reports"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "Reports" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Reports</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "SettlementAccount")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "SettlementAccount"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <CreditCard className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "SettlementAccount" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Settlement Account</span>
                </button>

                <button
                  onClick={() => onNavigate("MerchantPortal", "HelpSupport")}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs cursor-pointer ${
                    activeSubView === "HelpSupport"
                      ? "bg-[#447837] text-white"
                      : "text-gray-700 hover:bg-[#EBF4E9] hover:text-[#2E5324]"
                  }`}
                >
                  <HelpCircle className={`w-4 h-4 shrink-0 mr-3 ${activeSubView === "HelpSupport" ? "text-white" : "text-[#447837]"}`} />
                  <span className="font-sans">Help & Support</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    );
  }

  // Dedicated Internal Risk User Sidebar (matches user's screenshot Image 1)
  if (isInternalRiskUser) {
    return (
      <div className="w-64 bg-[#ECEAF3] h-[calc(100vh-100px)] border-r border-gray-200/50 flex flex-col justify-between py-5 select-none shrink-0 overflow-y-auto">
        <div className="flex flex-col">
          {/* Welcome Section (matching Image 1) */}
          <div className="px-5 pt-1 pb-3">
            <h2 className="text-[17px] font-bold text-gray-800 tracking-tight font-sans">
              Welcome, RISK USER
            </h2>
          </div>

          {/* Role Switcher Pill Dropdown */}
          <div className="px-5 pb-4 relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-white/90 hover:bg-white border border-gray-300/80 rounded-full shadow-2xs text-xs font-medium text-gray-700 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span>Role: <strong className="text-gray-900 font-semibold">Internal Risk User</strong></span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute left-5 right-5 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
                    Switch Portal Role
                  </div>
                  {ALL_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        if (onRoleChange) onRoleChange(role);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition flex items-center justify-between ${
                        currentRole === role
                          ? "bg-[#447837] text-white font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Items (Dashboard, Merchant Management, PA Management, User Management, Limit Management, Show User, Audit Trail, VPA Management) */}
          <nav className="px-3 space-y-1">
            {/* 1. Dashboard */}
            <button
              onClick={() => onNavigate("Dashboard")}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs ${
                activeView === "Dashboard"
                  ? "bg-[#447837] text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
              }`}
            >
              <LayoutGrid className={`w-4 h-4 shrink-0 mr-3 ${activeView === "Dashboard" ? "text-white" : "text-gray-600"}`} />
              <span className="font-sans">Dashboard</span>
            </button>

            {/* 2. Merchant Management (Collapsible) */}
            <div>
              <button
                onClick={() => setRiskMerchantMgmtOpen(!riskMerchantMgmtOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left ${
                  activeView === "ReviewMerchant" || (activeView === "OnboardingHub" && activeSubView === "MerchantReview") || activeView === "DraftMerchant"
                    ? "text-[#447837] bg-white/70"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                }`}
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 shrink-0 mr-3 text-gray-600" />
                  <span className="font-sans">Merchant Management</span>
                </div>
                {riskMerchantMgmtOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {riskMerchantMgmtOpen && (
                <div className="mt-1 pl-3 pr-1 space-y-1">
                  <button
                    onClick={() => onNavigate("ReviewMerchant")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "ReviewMerchant"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <Building2 className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "ReviewMerchant" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Review Merchant</span>
                  </button>

                  <button
                    onClick={() => onNavigate("OnboardingHub", "MerchantReview")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "OnboardingHub" && activeSubView === "MerchantReview"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <PlusSquare className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "OnboardingHub" && activeSubView === "MerchantReview" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Merchant Review</span>
                  </button>

                  <button
                    onClick={() => onNavigate("DraftMerchant")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "DraftMerchant"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <FileText className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "DraftMerchant" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Draft Merchant</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. PA Management (Collapsible) */}
            <div>
              <button
                onClick={() => setRiskPaMgmtOpen(!riskPaMgmtOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left ${
                  activeView === "ReviewPartner" || (activeView === "OnboardingHub" && activeSubView !== "MerchantReview")
                    ? "text-[#447837] bg-white/70"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                }`}
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 shrink-0 mr-3 text-gray-600" />
                  <span className="font-sans">PA Management</span>
                </div>
                {riskPaMgmtOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {riskPaMgmtOpen && (
                <div className="mt-1 pl-3 pr-1 space-y-1">
                  <button
                    onClick={() => onNavigate("OnboardingHub", "PaAdminReview")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "OnboardingHub" && activeSubView === "PaAdminReview"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <PlusSquare className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "OnboardingHub" && activeSubView === "PaAdminReview" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">PA Admin Review</span>
                  </button>

                  <button
                    onClick={() => onNavigate("ReviewPartner")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "ReviewPartner"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <Building2 className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "ReviewPartner" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Partner Review</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. User Management (Collapsible) */}
            <div>
              <button
                onClick={() => setRiskUserMgmtOpen(!riskUserMgmtOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left ${
                  activeView === "UserManagement"
                    ? "text-[#447837] bg-white/70"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 shrink-0 mr-3 text-gray-600" />
                  <span className="font-sans">User Management</span>
                </div>
                {riskUserMgmtOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {riskUserMgmtOpen && (
                <div className="mt-1 pl-3 pr-1 space-y-1">
                  <button
                    onClick={() => onNavigate("UserManagement", "SettlementAccount")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "UserManagement" && activeSubView === "SettlementAccount"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <CreditCard className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "UserManagement" && activeSubView === "SettlementAccount" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Settlement Account</span>
                  </button>

                  <button
                    onClick={() => onNavigate("UserManagement", "BillingManagement")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "UserManagement" && activeSubView === "BillingManagement"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <Banknote className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "UserManagement" && activeSubView === "BillingManagement" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Billing Management</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Limit Management (Collapsible) */}
            <div>
              <button
                onClick={() => setRiskLimitMgmtOpen(!riskLimitMgmtOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left ${
                  activeView === "LimitManagement"
                    ? "text-[#447837] bg-white/70"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                }`}
              >
                <div className="flex items-center">
                  <Sliders className="w-4 h-4 shrink-0 mr-3 text-gray-600" />
                  <span className="font-sans">Limit Management</span>
                </div>
                {riskLimitMgmtOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {riskLimitMgmtOpen && (
                <div className="mt-1 pl-3 pr-1 space-y-1">
                  <button
                    onClick={() => onNavigate("LimitManagement")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "LimitManagement"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <Sliders className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "LimitManagement" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Manage Limit</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6. Show User */}
            <button
              onClick={() => onNavigate("ShowUser")}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs ${
                activeView === "ShowUser" || activeView === "Profile"
                  ? "bg-[#447837] text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
              }`}
            >
              <ShowUserIcon className={`w-4 h-4 shrink-0 mr-3 ${activeView === "ShowUser" || activeView === "Profile" ? "text-white" : "text-gray-600"}`} />
              <span className="font-sans">Show User</span>
            </button>

            {/* 7. Audit Trail */}
            <button
              onClick={() => onNavigate("AuditTrail")}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left shadow-xs ${
                activeView === "AuditTrail"
                  ? "bg-[#447837] text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
              }`}
            >
              <ClipboardList className={`w-4 h-4 shrink-0 mr-3 ${activeView === "AuditTrail" ? "text-white" : "text-gray-600"}`} />
              <span className="font-sans">Audit Trail</span>
            </button>

            {/* 8. VPA Management (Collapsible) */}
            <div>
              <button
                onClick={() => setRiskVpaMgmtOpen(!riskVpaMgmtOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition text-left ${
                  activeView === "VpaManagement"
                    ? "text-[#447837] bg-white/70"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                }`}
              >
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 shrink-0 mr-3 text-gray-600" />
                  <span className="font-sans">VPA Management</span>
                </div>
                {riskVpaMgmtOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {riskVpaMgmtOpen && (
                <div className="mt-1 pl-3 pr-1 space-y-1">
                  <button
                    onClick={() => onNavigate("VpaManagement")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "VpaManagement" && activeSubView === ""
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <CreditCard className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "VpaManagement" && activeSubView === "" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Manage VPA</span>
                  </button>

                  <button
                    onClick={() => onNavigate("VpaManagement", "BlockUnblock")}
                    className={`w-full flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition text-left ${
                      activeView === "VpaManagement" && activeSubView === "BlockUnblock"
                        ? "bg-[#447837] text-white shadow-xs"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-950"
                    }`}
                  >
                    <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mr-2.5 ${activeView === "VpaManagement" && activeSubView === "BlockUnblock" ? "text-white" : "text-gray-600"}`} />
                    <span className="font-sans">Block / Unblock VPA</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // Dedicated Maker Portal Sidebar (matches user's screenshot image exactly)
  if (isMaker) {
    const isCreateMerchantActive =
      (activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
      (activeSubView === "CreateMerchant" || activeSubView === "" || !activeSubView);

    const isMerchantReviewActive =
      activeView === "ReviewMerchant" ||
      ((activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
        activeSubView === "MerchantReview");

    const isDraftMerchantActive =
      activeView === "DraftMerchant" ||
      ((activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
        activeSubView === "DraftMerchant");

    return (
      <div className="w-[270px] bg-[#F8FAF7] h-[calc(100vh-80px)] border-r border-[#D5E3D2] flex flex-col justify-between py-5 select-none shrink-0 overflow-y-auto">
        <div className="flex flex-col">
          {/* Welcome Header */}
          <div className="px-5 pb-3">
            <h2 className="text-[20px] font-black text-gray-900 tracking-tight font-sans">
              Welcome Maker
            </h2>
          </div>

          {/* Role Switcher Pill Dropdown */}
          <div className="px-5 pb-4 relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-[#C8E2BF] rounded-full shadow-2xs text-[11px] font-semibold text-gray-700 transition cursor-pointer"
            >
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#447837]" />
                <span>Role: <strong className="text-[#447837] font-bold">Maker</strong></span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#447837] transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
                    Switch Portal Role
                  </div>
                  {ALL_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        if (onRoleChange) onRoleChange(role);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                        currentRole === role
                          ? "bg-[#447837] text-white font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Items: Dashboard, Show User (like Merchant Portal), Reports, User Management */}
          <nav className="flex-1 px-3 space-y-1">
            {/* 1. Dashboard */}
            <button
              onClick={() => onNavigate("Dashboard")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                activeView === "Dashboard"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <LayoutGrid
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "Dashboard" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Dashboard</span>
            </button>

            {/* 2. Show User (like Merchant Portal) */}
            <button
              onClick={() => onNavigate("ShowUser")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                activeView === "ShowUser"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <Users
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "ShowUser" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Show User</span>
            </button>

            {/* 3. Reports */}
            <button
              onClick={() => onNavigate("Reports")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                activeView === "Reports"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <FileText
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "Reports" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Reports</span>
            </button>

            {/* 4. User Management (Collapsible, defaults to open) */}
            <div>
              <button
                onClick={() => setMakerUserMgmtOpen(!makerUserMgmtOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                  activeView === "MerchantManagement" || activeView === "ReviewMerchant" || activeView === "DraftMerchant"
                    ? "text-[#447837] bg-[#EBF4E9]"
                    : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
                }`}
              >
                <div className="flex items-center">
                  <UserPlus
                    className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                      activeView === "MerchantManagement" || activeView === "ReviewMerchant" || activeView === "DraftMerchant"
                        ? "text-[#447837]"
                        : "text-gray-900"
                    }`}
                  />
                  <span className="font-sans leading-none">User Management</span>
                </div>
                {makerUserMgmtOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {makerUserMgmtOpen && (
                <div className="mt-1 space-y-1">
                  {/* Create Merchant */}
                  <button
                    onClick={() => onNavigate("MerchantManagement", "CreateMerchant")}
                    className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 text-left cursor-pointer ${
                      isCreateMerchantActive
                        ? "bg-[#447837] text-white font-semibold"
                        : "text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837]"
                    }`}
                  >
                    <UserPlus className={`w-4 h-4 shrink-0 mr-3 ${isCreateMerchantActive ? "text-white" : "text-[#447837]"}`} />
                    <span className="font-sans leading-none">Create Merchant</span>
                  </button>

                  {/* Merchant Review */}
                  <button
                    onClick={() => onNavigate("ReviewMerchant")}
                    className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 text-left cursor-pointer ${
                      isMerchantReviewActive
                        ? "bg-[#447837] text-white font-semibold"
                        : "text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837]"
                    }`}
                  >
                    <Building2 className={`w-4 h-4 shrink-0 mr-3 ${isMerchantReviewActive ? "text-white" : "text-[#447837]"}`} />
                    <span className="font-sans leading-none">Merchant Review</span>
                  </button>

                  {/* Draft Merchant */}
                  <button
                    onClick={() => onNavigate("DraftMerchant")}
                    className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 text-left cursor-pointer ${
                      isDraftMerchantActive
                        ? "bg-[#447837] text-white font-semibold"
                        : "text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837]"
                    }`}
                  >
                    <ClipboardList className={`w-4 h-4 shrink-0 mr-3 ${isDraftMerchantActive ? "text-white" : "text-[#447837]"}`} />
                    <span className="font-sans leading-none">Draft Merchant</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // Dedicated Checker Sidebar (matches Partner Portal TA green branding and layout)
  if (isChecker) {
    return (
      <div className="w-[270px] bg-[#F8FAF7] h-[calc(100vh-80px)] border-r border-[#D5E3D2] flex flex-col justify-between py-5 select-none shrink-0 overflow-y-auto">
        <div className="flex flex-col">
          {/* Welcome Section */}
          <div className="px-5 pb-3">
            <h2 className="text-[20px] font-black text-gray-900 tracking-tight font-sans">
              Welcome Checker
            </h2>
          </div>

          {/* Role Switcher Pill Dropdown */}
          <div className="px-5 pb-4 relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-[#C8E2BF] rounded-full shadow-2xs text-[11px] font-semibold text-gray-700 transition cursor-pointer"
            >
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#447837]" />
                <span>Role: <strong className="text-[#447837] font-bold">{currentRole}</strong></span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#447837] transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
                    Switch Portal Role
                  </div>
                  {ALL_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        if (onRoleChange) onRoleChange(role);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                        currentRole === role
                          ? "bg-[#447837] text-white font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Items (Matches Partner Portal design exactly) */}
          <nav className="flex-1 px-3 space-y-1">
            {/* Checker: Dashboard */}
            <button
              onClick={() => onNavigate("Dashboard")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                activeView === "Dashboard"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <LayoutGrid
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "Dashboard" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Dashboard</span>
            </button>

            {/* Checker: Review Merchant */}
            <button
              onClick={() => onNavigate("ReviewMerchant")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                activeView === "ReviewMerchant"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <Building2
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "ReviewMerchant" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Review Merchant</span>
            </button>

            {/* Checker: Reports */}
            <button
              onClick={() => onNavigate("Reports")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                activeView === "Reports"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <FileText
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "Reports" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Reports</span>
            </button>

            {/* Checker: Audit Trail */}
            <button
              onClick={() => onNavigate("AuditTrail")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                activeView === "AuditTrail"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <ClipboardList
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "AuditTrail" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Audit Trail</span>
            </button>
          </nav>
        </div>
      </div>
    );
  }

  // Helper to format role names
  const formatRoleName = (role: string) => {
    if (!role) return "";
    return role.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Dedicated Partner Portal Sidebar (matches user's screenshots exactly)
  return (
    <div className="w-[270px] bg-[#F8FAF7] h-[calc(100vh-80px)] border-r border-[#D5E3D2] flex flex-col justify-between py-5 select-none shrink-0 overflow-y-auto">
      <div className="flex flex-col">
        {/* Welcome Section */}
        <div className="px-5 pb-3">
          <h2 className="text-[20px] font-black text-gray-900 tracking-tight font-sans">
            Welcome PA
          </h2>
        </div>

        {/* Role Switcher Pill Dropdown */}
        <div className="px-5 pb-4 relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-[#C8E2BF] rounded-full shadow-2xs text-[11px] font-semibold text-gray-700 transition cursor-pointer"
          >
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-[#447837]" />
              <span>Role: <strong className="text-[#447837] font-bold">{currentRole}</strong></span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#447837] transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {roleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleDropdownOpen(false)}
              />
              <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
                  Switch Portal Role
                </div>
                {ALL_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onRoleChange) onRoleChange(role);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium transition flex items-center justify-between ${
                      currentRole === role
                        ? "bg-[#447837] text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Active</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => onNavigate("Dashboard")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left ${
                activeView === "Dashboard"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <LayoutGrid
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "Dashboard" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Dashboard</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => onNavigate("Reports")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left ${
                activeView === "Reports"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <ClipboardList
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "Reports" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Reports</span>
            </button>

            {/* Show User */}
            <button
              onClick={() => onNavigate("ShowUser")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left ${
                activeView === "ShowUser"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <ClipboardList
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "ShowUser" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Show User</span>
            </button>

            {/* Merchant Management (Collapsible) */}
            <div>
              <button
                onClick={() => setPartnerMerchantMenuOpen(!partnerMerchantMenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left ${
                  activeView === "MerchantManagement" || activeView === "MerchantOnboarding"
                    ? "text-[#447837] bg-[#EBF4E9]"
                    : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
                }`}
              >
                <div className="flex items-center">
                  <User
                    className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                      activeView === "MerchantManagement" || activeView === "MerchantOnboarding"
                        ? "text-[#447837]"
                        : "text-gray-900"
                    }`}
                  />
                  <span className="font-sans leading-none">Merchant Management</span>
                </div>
                {partnerMerchantMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {partnerMerchantMenuOpen && (
                <div className="mt-1 space-y-1">
                  {/* Create Merchant */}
                  <button
                    onClick={() => onNavigate("MerchantManagement", "CreateMerchant")}
                    className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 text-left ${
                      (activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
                      (activeSubView === "CreateMerchant" || activeSubView === "")
                        ? "bg-[#447837] text-white font-semibold"
                        : "text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837]"
                    }`}
                  >
                    <UserPlus
                      className={`w-4 h-4 shrink-0 mr-3 ${
                        (activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
                        (activeSubView === "CreateMerchant" || activeSubView === "")
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    />
                    <span className="font-sans leading-none">Create Merchant</span>
                  </button>

                  {/* Merchant Review */}
                  <button
                    onClick={() => onNavigate("MerchantManagement", "MerchantReview")}
                    className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 text-left ${
                      (activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
                      activeSubView === "MerchantReview"
                        ? "bg-[#447837] text-white font-semibold shadow-xs"
                        : "text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837]"
                    }`}
                  >
                    <MessageSquarePlus
                      className={`w-4 h-4 shrink-0 mr-3 ${
                        (activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
                        activeSubView === "MerchantReview"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    />
                    <span className="font-sans leading-none">Merchant Review</span>
                  </button>

                  {/* Draft Merchant ... */}
                  <button
                    onClick={() => onNavigate("MerchantManagement", "DraftMerchant")}
                    className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 text-left ${
                      (activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
                      activeSubView === "DraftMerchant"
                        ? "bg-[#447837] text-white font-semibold shadow-xs"
                        : "text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837]"
                    }`}
                  >
                    <Inbox
                      className={`w-4 h-4 shrink-0 mr-3 ${
                        (activeView === "MerchantManagement" || activeView === "MerchantOnboarding") &&
                        activeSubView === "DraftMerchant"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    />
                    <span className="font-sans leading-none">Draft Merchant ...</span>
                  </button>
                </div>
              )}
            </div>

            {/* Create Maker User */}
            <button
              onClick={() => onNavigate("UserManagement", "CreateMakerUser")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left ${
                activeView === "UserManagement" && activeSubView === "CreateMakerUser"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <Users
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "UserManagement" && activeSubView === "CreateMakerUser"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Create Maker User</span>
            </button>

            {/* Dispute Management (Collapsible) */}
            <div>
              <button
                onClick={() => setPartnerDisputeMenuOpen(!partnerDisputeMenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left ${
                  activeView === "DisputeManagement"
                    ? "text-[#447837] bg-[#EBF4E9]"
                    : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
                }`}
              >
                <div className="flex items-center">
                  <User
                    className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                      activeView === "DisputeManagement" ? "text-[#447837]" : "text-gray-900"
                    }`}
                  />
                  <span className="font-sans leading-none">Dispute Management</span>
                </div>
                {partnerDisputeMenuOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {partnerDisputeMenuOpen && (
                <div className="mt-1 space-y-1">
                  {/* Chargeback */}
                  <button
                    onClick={() => onNavigate("DisputeManagement", "ChargeBack")}
                    className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 text-left ${
                      activeView === "DisputeManagement" && activeSubView === "ChargeBack"
                        ? "bg-[#447837] text-white font-semibold"
                        : "text-gray-800 hover:bg-[#EBF4E9] hover:text-[#447837]"
                    }`}
                  >
                    <MessageSquarePlus
                      className={`w-4 h-4 shrink-0 mr-3 ${
                        activeView === "DisputeManagement" && activeSubView === "ChargeBack"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    />
                    <span className="font-sans leading-none">Chargeback</span>
                  </button>
                </div>
              )}
            </div>

            {/* Audit Trail */}
            <button
              onClick={() => onNavigate("AuditTrail")}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-150 text-left ${
                activeView === "AuditTrail"
                  ? "bg-[#447837] text-white shadow-xs"
                  : "text-gray-900 hover:bg-[#EBF4E9] hover:text-[#447837]"
              }`}
            >
              <Users
                className={`w-[18px] h-[18px] shrink-0 mr-3.5 ${
                  activeView === "AuditTrail" ? "text-white" : "text-gray-900"
                }`}
              />
              <span className="font-sans leading-none">Audit Trail</span>
            </button>
          </nav>
        </div>

        {/* Bottom Copyright Widget */}
        <div className="px-5 pt-4">
          <div className="text-[10px] text-gray-400 font-mono select-none">
            Transaction Analytics • 2026
          </div>
        </div>
      </div>
    );
}
