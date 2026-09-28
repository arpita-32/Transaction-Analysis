import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Eye,
  Download,
  Plus,
  Info,
  ChevronDown,
  Filter,
  CheckCircle2,
  MoreVertical,
  X,
  UserCheck,
  Building2,
  Mail,
  Phone
} from "lucide-react";
import { User } from "../types";

interface ShowUserViewProps {
  users: User[];
  onSelectProfile: (user: User) => void;
  currentRole?: string;
  onCreateUserClick?: () => void;
}

export function ShowUserView({
  users,
  onSelectProfile,
  currentRole,
  onCreateUserClick
}: ShowUserViewProps) {
  const isAggregator =
    currentRole?.toLowerCase() === "aggregator" ||
    currentRole?.toLowerCase() === "partner";

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Advanced / Quick Search Form States
  const [activeTab, setActiveTab] = useState<"Quick" | "Advanced">("Quick");
  const [userType, setUserType] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState({
    userType: "",
    searchBy: "",
    val: ""
  });
  const [hasSubmittedCustomSearch, setHasSubmittedCustomSearch] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [advStatus, setAdvStatus] = useState("Active");
  const [advUserType, setAdvUserType] = useState("MERCHANT");
  const [submittedAdvancedQuery, setSubmittedAdvancedQuery] = useState({
    status: "Active",
    userType: "MERCHANT"
  });

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [excelToast, setExcelToast] = useState(false);
  const [activeRowActionMenu, setActiveRowActionMenu] = useState<string | null>(null);

  const isQuickFormValid = Boolean(userType.trim() && searchBy.trim() && searchVal.trim());
  const isAdvancedFormValid = Boolean(advStatus.trim() && advUserType.trim());

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isQuickFormValid) return;
    setValidationError("");

    const q = searchVal.trim();
    if (searchBy === "Mobile Number" && !/^\d{10}$/.test(q)) {
      setValidationError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (searchBy === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    setSubmittedQuery({ userType, searchBy, val: q });
    setHasSubmittedCustomSearch(true);
    setCurrentPage(1);
  };

  const handleAdvancedSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedAdvancedQuery({ status: advStatus, userType: advUserType });
    setHasSubmittedCustomSearch(true);
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setHasSubmittedCustomSearch(false);
    setUserType("");
    setSearchBy("");
    setSearchVal("");
    setCurrentPage(1);
  };

  // Filter users based on real-time search, status filter, and custom search
  const filteredUsers = (() => {
    let list = [...users];

    // Status filter dropdown (matching Screenshot 2026-07-16)
    if (statusFilter !== "All") {
      list = list.filter((u) => {
        if (statusFilter === "Active") {
          return (
            u.status.toLowerCase().includes("active") ||
            u.status.toLowerCase().includes("approved")
          );
        }
        if (statusFilter === "Inactive") {
          return u.status.toLowerCase().includes("inactive");
        }
        if (statusFilter === "Pending") {
          return (
            u.status.toLowerCase().includes("pending") ||
            u.status.toLowerCase().includes("draft")
          );
        }
        return u.status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Quick instant search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.mobileNumber.includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }

    // Custom quick/advanced form search if executed
    if (hasSubmittedCustomSearch) {
      if (activeTab === "Advanced") {
        list = list.filter((u) => {
          const userRoleUpper = u.role.toUpperCase();
          const targetUserType = submittedAdvancedQuery.userType.toUpperCase();
          if (targetUserType !== "ALL") {
            if (targetUserType === "AGENT") {
              if (
                userRoleUpper !== "AGENT" &&
                userRoleUpper !== "AGGREGATOR" &&
                userRoleUpper !== "PARTNER"
              )
                return false;
            } else if (targetUserType === "PARTNER") {
              if (userRoleUpper !== "PARTNER" && userRoleUpper !== "AGGREGATOR")
                return false;
            } else if (userRoleUpper !== targetUserType) {
              return false;
            }
          }
          const isActive =
            u.status.toLowerCase().includes("active") ||
            u.status.toLowerCase().includes("approved");
          if (submittedAdvancedQuery.status === "Active" && !isActive) {
            return false;
          }
          if (submittedAdvancedQuery.status === "Inactive" && isActive) {
            return false;
          }
          return true;
        });
      } else if (submittedQuery.val) {
        const q = submittedQuery.val.toLowerCase();
        list = list.filter((u) => {
          if (submittedQuery.searchBy === "Username") {
            return u.username.toLowerCase().includes(q);
          }
          if (submittedQuery.searchBy === "Email") {
            return u.email.toLowerCase().includes(q);
          }
          if (submittedQuery.searchBy === "Mobile Number") {
            return u.mobileNumber.includes(q);
          }
          if (submittedQuery.searchBy === "Name") {
            return `${u.firstName} ${u.lastName}`.toLowerCase().includes(q);
          }
          return (
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.mobileNumber.includes(q)
          );
        });
      }
    }

    return list;
  })();

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleExportExcel = () => {
    const headers = [
      "User ID",
      "Username",
      "Role",
      "Status",
      "First Name",
      "Last Name",
      "Email ID",
      "Mobile Number",
      "Outstanding Balance",
      "Plan Name",
      "Create Date",
      "Maker Username",
      "Parent Username"
    ];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.username,
      u.role,
      u.status,
      u.firstName,
      u.lastName,
      u.email,
      u.mobileNumber,
      u.outstandingBalance,
      u.planName,
      u.createDate,
      u.makerUsername,
      u.parentUsername
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Transaction_Analysts_Users_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExcelToast(true);
    setTimeout(() => setExcelToast(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 text-left font-sans"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMBS (Matching Screenshot 2026-07-16 121245.png)     */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        {/* Left: Title & Breadcrumbs */}
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#1E293B] tracking-tight">
            Show User
          </h1>
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium mt-1">
            <span className="hover:text-gray-800 transition cursor-pointer">Home</span>
            <span className="text-gray-400">/</span>
            <span className="hover:text-gray-800 transition cursor-pointer">User Management</span>
            <span className="text-gray-400">/</span>
            <span className="text-[#1E293B] font-semibold">Show User</span>
          </div>
        </div>

        {/* Right: Action Toolbar (Status Dropdown, + Create User, Info Button) */}
        <div className="flex items-center space-x-3">
          {/* Status Dropdown Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs cursor-pointer"
            >
              <span>{statusFilter === "All" ? "Status" : `Status: ${statusFilter}`}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 z-50 text-xs font-medium text-gray-700">
                {["All", "Active", "Inactive", "Pending"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-[#F0F6EE] hover:text-[#447837] transition flex items-center justify-between ${
                      statusFilter === status ? "bg-[#F0F6EE] text-[#447837] font-bold" : ""
                    }`}
                  >
                    <span>{status === "All" ? "All Status" : status}</span>
                    {statusFilter === status && <CheckCircle2 className="w-3.5 h-3.5 text-[#447837]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + Create User Primary Button (Forest Green #447837) */}
          <button
            type="button"
            onClick={() => {
              if (onCreateUserClick) {
                onCreateUserClick();
              } else {
                setShowAdvancedSearch(true);
              }
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#447837] hover:bg-[#36612B] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Create User</span>
          </button>

          {/* Information Icon Button (Lavender/Periwinkle Square with Navy Icon) */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="w-8 h-8 rounded-lg bg-[#E6E6FA] hover:bg-[#DCDCF5] border border-[#D5D5F0] flex items-center justify-center text-[#2A2374] transition shadow-2xs cursor-pointer"
            title="User Management Information"
          >
            <Info className="w-4 h-4 fill-current text-[#2A2374]" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & CONTROLS BAR                                                  */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Instant Real-Time Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by username, name, email, or role..."
            className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#447837] focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Toggle Advanced Search & Export */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
              showAdvancedSearch
                ? "bg-[#EBF4E9] border-[#447837] text-[#447837]"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showAdvancedSearch ? "Hide Filters" : "Advanced Search"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#447837]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. COLLAPSIBLE ADVANCED SEARCH PANEL                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAdvancedSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              {/* Tab Selector */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("Quick")}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
                    activeTab === "Quick"
                      ? "border-[#447837] text-[#447837]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Quick Parameter Search
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("Advanced")}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
                    activeTab === "Advanced"
                      ? "border-[#447837] text-[#447837]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Role & Status Query
                </button>
              </div>

              {activeTab === "Quick" ? (
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">
                        User Type
                      </label>
                      <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full text-xs font-medium border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-[#447837]"
                      >
                        <option value="">Select User Type</option>
                        <option value="MERCHANT">MERCHANT</option>
                        <option value="AGENT">AGENT</option>
                        <option value="PARTNER">PARTNER</option>
                        <option value="MAKER">MAKER</option>
                        <option value="CHECKER">CHECKER</option>
                        <option value="ALL">ALL USERS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">
                        Search User By
                      </label>
                      <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="w-full text-xs font-medium border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-[#447837]"
                      >
                        <option value="">Select Parameter</option>
                        <option value="Username">Username</option>
                        <option value="Email">Email</option>
                        <option value="Mobile Number">Mobile Number</option>
                        <option value="Name">Name</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">
                        Search Value
                      </label>
                      <input
                        type="text"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Enter search keyword"
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-[#447837]"
                      />
                    </div>
                  </div>

                  {validationError && (
                    <p className="text-xs text-rose-600 font-semibold">{validationError}</p>
                  )}

                  <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={!isQuickFormValid}
                      className={`px-5 py-1.5 rounded-lg text-xs font-bold text-white transition ${
                        isQuickFormValid
                          ? "bg-[#447837] hover:bg-[#36612B] cursor-pointer"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Apply Search
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdvancedSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">
                        Status
                      </label>
                      <select
                        value={advStatus}
                        onChange={(e) => setAdvStatus(e.target.value)}
                        className="w-full text-xs font-medium border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-[#447837]"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">
                        Role Type
                      </label>
                      <select
                        value={advUserType}
                        onChange={(e) => setAdvUserType(e.target.value)}
                        className="w-full text-xs font-medium border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-[#447837]"
                      >
                        <option value="MERCHANT">MERCHANT</option>
                        <option value="PARTNER">PARTNER</option>
                        <option value="MAKER">MAKER</option>
                        <option value="CHECKER">CHECKER</option>
                        <option value="ALL">ALL USERS</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={!isAdvancedFormValid}
                      className={`px-5 py-1.5 rounded-lg text-xs font-bold text-white transition ${
                        isAdvancedFormValid
                          ? "bg-[#447837] hover:bg-[#36612B] cursor-pointer"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Apply Filter
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. MAIN DATA TABLE (Matching Screenshot 2026-07-29 153423.png)            */}
      {/* ========================================================================= */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto select-text scrollbar-thin">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-600 text-xs font-bold">
                <th scope="col" className="py-3.5 px-4">
                  User Name
                </th>
                <th scope="col" className="py-3.5 px-4">
                  First Name
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Last Name
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Email Id
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Mobile Number
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Role
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Status
                </th>
                <th scope="col" className="py-3.5 px-4 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-800 font-medium">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => {
                  const isActive =
                    user.status.toLowerCase().includes("active") ||
                    user.status.toLowerCase().includes("approved");

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/80 transition-colors duration-100"
                    >
                      {/* User Name */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                        {user.username}
                      </td>

                      {/* First Name */}
                      <td className="py-3.5 px-4 text-gray-700">
                        {user.firstName}
                      </td>

                      {/* Last Name */}
                      <td className="py-3.5 px-4 text-gray-700">
                        {user.lastName}
                      </td>

                      {/* Email Id */}
                      <td className="py-3.5 px-4 text-gray-600">
                        {user.email}
                      </td>

                      {/* Mobile Number */}
                      <td className="py-3.5 px-4 text-gray-700 font-mono">
                        {user.mobileNumber}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-700 capitalize">
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              isActive ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {isActive ? "Active" : user.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2 relative">
                          {/* View Profile Action Button (Eye Icon) */}
                          <button
                            type="button"
                            onClick={() => onSelectProfile(user)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#447837] hover:bg-[#EBF4E9] transition cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Options Menu Toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              setActiveRowActionMenu(
                                activeRowActionMenu === user.id ? null : user.id
                              )
                            }
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {activeRowActionMenu === user.id && (
                            <div className="absolute right-0 top-8 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-40 text-left text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRowActionMenu(null);
                                  onSelectProfile(user);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium flex items-center space-x-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#447837]" />
                                <span>View Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRowActionMenu(null);
                                  handleExportExcel();
                                }}
                                className="w-full px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium flex items-center space-x-2"
                              >
                                <Download className="w-3.5 h-3.5 text-gray-500" />
                                <span>Download</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <p className="text-sm font-semibold">No users found matching criteria</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms or filters</p>
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="mt-3 px-4 py-1.5 bg-[#447837] text-white rounded-lg text-xs font-bold hover:bg-[#36612B] transition"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Entries count & Pagination (Screenshot 2026-07-29) */}
        <div className="px-5 py-3.5 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 font-medium">
          <div>
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredUsers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * rowsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-bold text-gray-900">{filteredUsers.length}</span> entries
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                currentPage <= 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  currentPage === page
                    ? "bg-[#447837] text-white shadow-2xs"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                currentPage >= totalPages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. USER MANAGEMENT INFO MODAL (Triggered by Lavender ℹ button)            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E6E6FA] flex items-center justify-center text-[#2A2374]">
                    <Info className="w-4 h-4 fill-current" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    User Management Guide
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
                  <strong>Show User</strong> allows administrative staff and merchants to view registered system participants across roles:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-gray-500">
                  <li><strong>Admin:</strong> Complete system and security management.</li>
                  <li><strong>Partner / Aggregator:</strong> Onboarding and acquiring oversight.</li>
                  <li><strong>Maker:</strong> Initiates merchant creation and KYC uploads.</li>
                  <li><strong>Checker:</strong> Verifies and signs off on applications.</li>
                  <li><strong>Merchant:</strong> Sub-merchant and terminal operational accounts.</li>
                </ul>
                <div className="bg-[#F0F6EE] p-3 rounded-lg border border-[#C8E2BF] text-[#2E5324] text-[11px] font-medium mt-3">
                  Click the <strong>Eye icon</strong> on any row to open the complete user profile card.
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 bg-[#447837] text-white text-xs font-bold rounded-lg hover:bg-[#36612B] transition"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSV Export Success Toast */}
      {excelToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>User data exported to CSV successfully</span>
        </div>
      )}
    </motion.div>
  );
}
