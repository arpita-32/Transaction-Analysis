import React, { useState, useMemo, FormEvent } from "react";
import {
  Search,
  Plus,
  Eye,
  Check,
  ArrowLeft,
  ChevronDown,
  X,
  AlertTriangle
} from "lucide-react";

export interface UserBankAccount {
  id: string;
  userType: "Merchant" | "Partner";
  userId: string;
  userName: string;
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  isSettlementAccount: boolean;
  isVerified: boolean;
}

// Backward-compatibility alias
export type SettlementAccount = UserBankAccount;

const INITIAL_USER_BANK_ACCOUNTS: UserBankAccount[] = [
  {
    id: "UBA-01",
    userType: "Merchant",
    userId: "NSDLM000000088",
    userName: "Ayush Acharya",
    beneficiaryName: "Ayush Acharya",
    accountNumber: "111111111115",
    ifscCode: "SBIN0001266",
    bankName: "STATE BANK OF INDIA",
    isSettlementAccount: true,
    isVerified: true
  },
  {
    id: "UBA-02",
    userType: "Merchant",
    userId: "NSDLM000000088",
    userName: "Ayush Acharya",
    beneficiaryName: "Ayush Acharya",
    accountNumber: "111111111118",
    ifscCode: "SBIN0001266",
    bankName: "STATE BANK OF INDIA",
    isSettlementAccount: true,
    isVerified: true
  },
  {
    id: "UBA-03",
    userType: "Partner",
    userId: "NSDLM000000088",
    userName: "Ayush Acharya",
    beneficiaryName: "Ayush Acharya",
    accountNumber: "111111111115",
    ifscCode: "SBIN0001266",
    bankName: "STATE BANK OF INDIA",
    isSettlementAccount: true,
    isVerified: true
  },
  {
    id: "UBA-04",
    userType: "Partner",
    userId: "NSDLM000000088",
    userName: "Ayush Acharya",
    beneficiaryName: "Ayush Acharya",
    accountNumber: "111111111118",
    ifscCode: "SBIN0001266",
    bankName: "STATE BANK OF INDIA",
    isSettlementAccount: true,
    isVerified: true
  }
];

export interface SettlementAccountViewProps {
  onBack?: () => void;
  isMerchantView?: boolean;
}

export function SettlementAccountView({ onBack, isMerchantView = false }: SettlementAccountViewProps) {
  // Filter form state (Image 1 defaults; requires data selection and pressing Search/Submit)
  const [userType, setUserType] = useState<"Merchant" | "Partner" | "">(
    isMerchantView ? "Merchant" : ""
  );
  const [searchUserBy, setSearchUserBy] = useState<string>(
    isMerchantView ? "Merchant ID" : ""
  );
  const [searchUser, setSearchUser] = useState<string>(
    isMerchantView ? "NSDLM000000088" : ""
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Accounts state
  const [accounts, setAccounts] = useState<UserBankAccount[]>(INITIAL_USER_BANK_ACCOUNTS);

  // Detail view state (Exact match to Image 4)
  const [currentDetailAccount, setCurrentDetailAccount] = useState<UserBankAccount | null>(null);

  // Modals & toast notifications
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Account form state
  const [newAccountForm, setNewAccountForm] = useState({
    beneficiaryName: "Ayush Acharya",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "SBIN0001266",
    bankName: "STATE BANK OF INDIA",
    isSettlementAccount: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSearchSubmit = () => {
    if (!userType) {
      showToast("Please select a User Type first");
      return;
    }
    if (userType === "Merchant") {
      if (!searchUserBy) {
        showToast("Please select Search User By");
        return;
      }
      if (!searchUser.trim()) {
        showToast("Please enter Search User details");
        return;
      }
    } else if (userType === "Partner") {
      if (!searchUser.trim()) {
        showToast("Please enter Partner User details");
        return;
      }
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserType(isMerchantView ? "Merchant" : "");
    setSearchUserBy(isMerchantView ? "Merchant ID" : "");
    setSearchUser("");
    setIsSubmitted(false);
    setCurrentDetailAccount(null);
  };

  const handleToggleSettlement = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, isSettlementAccount: !acc.isSettlementAccount } : acc
      )
    );
    showToast("Settlement account status updated");
  };

  const handleConfirmDelete = () => {
    if (!currentDetailAccount) return;
    const deletedId = currentDetailAccount.id;
    setAccounts((prev) => prev.filter((acc) => acc.id !== deletedId));
    setIsDeleteModalOpen(false);
    setCurrentDetailAccount(null);
    showToast("Bank account deleted successfully");
  };

  const handleAddAccountSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAccountForm.accountNumber || !newAccountForm.beneficiaryName || !newAccountForm.ifscCode) {
      showToast("Please fill in all required fields");
      return;
    }
    if (newAccountForm.accountNumber !== newAccountForm.confirmAccountNumber) {
      showToast("Account numbers do not match");
      return;
    }

    const newAcc: UserBankAccount = {
      id: `UBA-${Date.now()}`,
      userType: userType === "Partner" ? "Partner" : "Merchant",
      userId: searchUser || "NSDLM000000088",
      userName: newAccountForm.beneficiaryName,
      beneficiaryName: newAccountForm.beneficiaryName,
      accountNumber: newAccountForm.accountNumber,
      ifscCode: newAccountForm.ifscCode.toUpperCase(),
      bankName: newAccountForm.bankName || "STATE BANK OF INDIA",
      isSettlementAccount: newAccountForm.isSettlementAccount,
      isVerified: true
    };

    setAccounts((prev) => [newAcc, ...prev]);
    setIsAddAccountModalOpen(false);
    setNewAccountForm({
      beneficiaryName: "Ayush Acharya",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "SBIN0001266",
      bankName: "STATE BANK OF INDIA",
      isSettlementAccount: true
    });
    showToast("Bank account added successfully");
  };

  // Filter accounts to display
  const displayedAccounts = useMemo(() => {
    if (!isSubmitted || !userType) return [];

    return accounts.filter((acc) => {
      // Match user type
      if (acc.userType !== userType) return false;

      // Match search term if provided
      if (searchUser.trim()) {
        const query = searchUser.trim().toLowerCase();
        if (searchUserBy === "Merchant ID") {
          return acc.userId.toLowerCase().includes(query);
        }
        if (searchUserBy === "Merchant Name/Business Legal Name") {
          return (
            acc.userName.toLowerCase().includes(query) ||
            acc.beneficiaryName.toLowerCase().includes(query)
          );
        }
        return (
          acc.userId.toLowerCase().includes(query) ||
          acc.userName.toLowerCase().includes(query) ||
          acc.beneficiaryName.toLowerCase().includes(query) ||
          acc.accountNumber.includes(query)
        );
      }

      return true;
    });
  }, [accounts, isSubmitted, userType, searchUser, searchUserBy]);

  // =========================================================================
  // VIEW 2: USER BANK DETAILS (Exact Match to Image 4)
  // =========================================================================
  if (currentDetailAccount) {
    return (
      <div className="bg-white min-h-[600px] p-6 sm:p-8 rounded-lg">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[#447837] text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Top Header with Back Arrow (Image 4) */}
        <div className="flex items-center gap-2.5 mb-6">
          <button
            type="button"
            onClick={() => setCurrentDetailAccount(null)}
            className="text-[#447837] hover:opacity-80 transition cursor-pointer p-0.5 rounded"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-[#447837] stroke-[2.5]" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">User Bank Details</h1>
        </div>

        {/* Bank Info Card (Image 4) */}
        <div className="border border-gray-200 rounded-lg p-7 bg-white shadow-xs max-w-5xl">
          {/* Top Header of Card */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Bank Info</h3>
            <div className="bg-[#447837] text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Verified</span>
            </div>
          </div>

          {/* 2-Column Grid (Image 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-16 py-6">
            <div>
              <p className="text-xs font-normal text-gray-500">Beneficiary Name</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{currentDetailAccount.beneficiaryName}</p>
            </div>
            <div>
              <p className="text-xs font-normal text-gray-500">Bank Account Number</p>
              <p className="text-sm font-bold text-gray-900 mt-1 tracking-wider">{currentDetailAccount.accountNumber}</p>
            </div>
            <div>
              <p className="text-xs font-normal text-gray-500">IFSC Code</p>
              <p className="text-sm font-bold text-gray-900 mt-1 font-mono">{currentDetailAccount.ifscCode}</p>
            </div>
            <div>
              <p className="text-xs font-normal text-gray-500">Bank Name</p>
              <p className="text-sm font-bold text-gray-900 mt-1 uppercase">{currentDetailAccount.bankName}</p>
            </div>
          </div>

          {/* Card Footer with Delete Button (Image 4) */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb] hover:bg-[#f1b0b7] px-5 py-2 rounded-md font-medium text-sm transition cursor-pointer"
            >
              Delete Bank Account
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md p-6">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold text-gray-900">Delete Bank Account</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this bank account? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-3.5 rounded border border-gray-200 text-xs text-gray-700 mb-6 space-y-1">
                <p><span className="font-semibold">Beneficiary:</span> {currentDetailAccount.beneficiaryName}</p>
                <p><span className="font-semibold">Account Number:</span> {currentDetailAccount.accountNumber}</p>
                <p><span className="font-semibold">Bank:</span> {currentDetailAccount.bankName}</p>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 text-white rounded-md text-sm font-medium hover:bg-rose-700 transition cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: SETTLEMENT ACCOUNT LIST & SEARCH (Exact Match to Images 1, 2, 3, 5, 6)
  // =========================================================================
  return (
    <div className="bg-white min-h-[600px] p-6 sm:p-8 rounded-lg">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#447837] text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Top Heading (Images 1, 2, 3, 5, 6) */}
      <div className="flex items-center gap-2.5 mb-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-[#447837] p-1 -ml-1 rounded transition cursor-pointer"
            title="Back to User Management"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settlement Account</h1>
      </div>

      {/* Top Filter & Search Bar */}
      <div className="flex flex-wrap items-end gap-4 mb-8">
        {/* Field 1: User Type * */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-800 mb-1.5 flex items-center gap-0.5">
            User Type <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={userType}
              onChange={(e) => {
                const val = e.target.value as "Merchant" | "Partner" | "";
                setUserType(val);
                setSearchUserBy(val === "Merchant" ? "Merchant ID" : "");
                setIsSubmitted(false);
                // Pre-fill search with sample ID for immediate matching convenience
                if (val) {
                  setSearchUser("NSDLM000000088");
                } else {
                  setSearchUser("");
                }
              }}
              className="w-48 appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 pr-8 focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837] cursor-pointer"
            >
              <option value="">Select User Type</option>
              <option value="Merchant">Merchant</option>
              <option value="Partner">Partner</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 2: Search User By * (ONLY shown when User Type is Merchant, Images 2 & 3) */}
        {userType === "Merchant" && (
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-800 mb-1.5 flex items-center gap-0.5">
              Search User By <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={searchUserBy}
                onChange={(e) => setSearchUserBy(e.target.value)}
                className="w-56 appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 pr-8 focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837] cursor-pointer"
              >
                <option value="">Select Search Type</option>
                <option value="Merchant ID">Merchant ID</option>
                <option value="Merchant Name/Business Legal Name">Merchant Name/Business Legal Name</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Field 3: Search User (Text input with search icon button) */}
        <div className="flex flex-col flex-1 min-w-[220px] max-w-sm">
          <label className="text-xs font-semibold text-gray-800 mb-1.5">
            Search User
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Enter Username"
              className="flex-1 bg-white border border-gray-300 border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837]"
            />
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="border border-gray-300 border-l-0 rounded-r-md px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons: Submit & Reset in TA Green Theme */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="bg-[#447837] hover:bg-[#36602c] text-white px-6 py-2 rounded-md font-medium text-sm transition shadow-xs cursor-pointer"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border border-[#447837] text-[#447837] hover:bg-[#447837]/5 px-6 py-2 rounded-md font-medium text-sm transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Section: List of User Bank Accounts */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">List of User Bank Accounts</h2>
        {isSubmitted && displayedAccounts.length > 0 && (
          <button
            type="button"
            onClick={() => setIsAddAccountModalOpen(true)}
            className="bg-[#f0f6ee] text-[#447837] border border-[#c4dcbe] hover:bg-[#447837] hover:text-white px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Account</span>
          </button>
        )}
      </div>

      {/* When NOT submitted or no accounts found: "No Accounts Found!!!" (Images 1, 2, 5) */}
      {(!isSubmitted || displayedAccounts.length === 0) ? (
        <div className="py-24 text-center text-gray-700 text-sm font-medium tracking-wide">
          No Accounts Found!!!
        </div>
      ) : (
        /* Table View (Exact match to Images 3 & 6) */
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-800 text-xs font-bold bg-transparent">
                <th className="py-3 px-4 w-16">Sl no.</th>
                <th className="py-3 px-4">Beneficiary Name</th>
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">IFSC Code</th>
                <th className="py-3 px-4">Bank Name</th>
                <th className="py-3 px-4 text-center w-36">Settlement Account</th>
                <th className="py-3 px-4 text-center w-20">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800 text-sm">
              {displayedAccounts.map((account, index) => (
                <tr key={account.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4 text-gray-700">{index + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">{account.beneficiaryName}</td>
                  <td className="py-3.5 px-4 text-gray-800 tracking-wider">{account.accountNumber}</td>
                  <td className="py-3.5 px-4 text-gray-800 font-mono text-xs">{account.ifscCode}</td>
                  <td className="py-3.5 px-4 text-gray-800 uppercase text-xs">{account.bankName}</td>
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={account.isSettlementAccount}
                      onChange={() => handleToggleSettlement(account.id)}
                      className="w-4 h-4 text-[#447837] rounded accent-[#447837] cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentDetailAccount(account)}
                      className="text-gray-500 hover:text-[#447837] p-1 rounded transition cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Bank Account</h3>
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Beneficiary Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAccountForm.beneficiaryName}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, beneficiaryName: e.target.value })}
                  placeholder="e.g. Ayush Acharya"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccountForm.accountNumber}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Confirm Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccountForm.confirmAccountNumber}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, confirmAccountNumber: e.target.value })}
                    placeholder="Re-enter account number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    IFSC Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccountForm.ifscCode}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      let detectedBank = newAccountForm.bankName;
                      if (val.startsWith("SBIN")) detectedBank = "STATE BANK OF INDIA";
                      else if (val.startsWith("HDFC")) detectedBank = "HDFC BANK";
                      else if (val.startsWith("ICIC")) detectedBank = "ICICI BANK";
                      else if (val.startsWith("PUNB")) detectedBank = "PUNJAB NATIONAL BANK";
                      setNewAccountForm({ ...newAccountForm, ifscCode: val, bankName: detectedBank });
                    }}
                    placeholder="e.g. SBIN0001266"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccountForm.bankName}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, bankName: e.target.value })}
                    placeholder="e.g. STATE BANK OF INDIA"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#447837] focus:border-[#447837]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPrimarySettlement"
                  checked={newAccountForm.isSettlementAccount}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, isSettlementAccount: e.target.checked })}
                  className="w-4 h-4 text-[#447837] rounded accent-[#447837] cursor-pointer"
                />
                <label htmlFor="isPrimarySettlement" className="text-xs text-gray-700 cursor-pointer">
                  Set as Primary Settlement Account
                </label>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#447837] text-white rounded-md text-sm font-semibold hover:bg-[#36602c] transition shadow-xs cursor-pointer"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
