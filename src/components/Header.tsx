import { useState } from "react";
import { Wallet, ChevronDown, ChevronUp, Lock, LogOut, Eye, HelpCircle, User } from "lucide-react";
import { TALogo } from "./TALogo";

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  walletBalance: number;
  onNavigate: (view: string, subView?: string) => void;
  onChangePasswordClick: () => void;
  onLogout?: () => void;
  onRaiseIssueClick?: () => void;
}

export function Header({
  currentRole,
  onRoleChange,
  walletBalance,
  onNavigate,
  onChangePasswordClick,
  onLogout,
  onRaiseIssueClick,
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Active portal roles: Partner, Merchant, Maker, Checker
  const roles = [
    "Partner",
    "Merchant",
    "Maker",
    "Checker",
  ];

  const isMerchant = currentRole === "Merchant";
  const isMakerOrChecker = currentRole === "Maker" || currentRole === "Checker" || currentRole.startsWith("Checker");

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm relative z-50">
      {/* Top Main Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center space-x-3">
          {!isMerchant && (
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Logo (Transaction Analysts Logo for all portals) */}
          <div
            className="flex items-center select-none cursor-pointer"
            onClick={() => onNavigate(currentRole === "Partner" ? "ShowUser" : currentRole === "Merchant" ? "MerchantPortal" : "Dashboard")}
          >
            <TALogo className="h-9 md:h-10 w-auto max-h-[44px]" />
          </div>
        </div>

        {/* Right Side: Support, Wallet & Profile */}
        <div className="flex items-center space-x-5">
          {/* Raise an Issue Button */}
          {onRaiseIssueClick && (
            <button
              onClick={onRaiseIssueClick}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#447837]/30 bg-[#F0F6EE] hover:bg-[#E4EFE2] text-[#447837] text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#447837]" />
              <span>Raise an Issue</span>
            </button>
          )}

          {/* Wallet (hidden on Merchant portal) */}
          {!isMerchant && (
            <div className="flex items-center space-x-2 select-none mr-1 font-sans">
              <Wallet className="w-5 h-5 text-gray-900" fill="currentColor" />
              <span className="text-[15px] font-bold text-gray-950">Wallet:</span>
              <span className="text-[15px] font-black text-gray-950">₹ {walletBalance}</span>
            </div>
          )}

          {/* User Profile Dropdown matching Screenshot 2 */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center px-2 py-1 rounded-full transition-all duration-150 shadow-xs bg-[#EBF4E9] border-[1.5px] border-black hover:bg-[#E2EFE0] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#3E7431] flex items-center justify-center text-white overflow-hidden select-none shadow-2xs font-bold text-xs shrink-0">
                SK
              </div>
              <div className="flex flex-col text-left ml-2.5 mr-2">
                <span className="text-[13px] font-bold font-sans tracking-tight text-gray-900 leading-tight">
                  {isMerchant || isMakerOrChecker ? "Shakti Kumar" : currentRole === "Internal Risk User" ? "david.inte..." : "Shakti Kumar"}
                </span>
                <span className="text-[10px] text-gray-600 font-normal italic leading-tight">
                  Last Seen:{" "}
                  <span className="font-semibold text-[#2E5324]">
                    02:30 PM...
                  </span>
                </span>
              </div>
              {profileDropdownOpen ? (
                <ChevronUp className="w-4 h-4 shrink-0 text-[#3E7431] stroke-[2.5]" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0 text-[#3E7431] stroke-[2.5]" />
              )}
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-scaleIn text-left">
                  {/* 1. My Profile */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate("MyProfile");
                    }}
                    className="w-full flex items-center px-4 py-2.5 hover:bg-gray-50 text-left transition duration-150 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#EBF4E9] border border-[#C8E2BF] flex items-center justify-center text-sm mr-3 shrink-0 shadow-2xs group-hover:bg-[#E0EEDD]">
                      👨‍💼
                    </div>
                    <span className="font-sans font-bold text-[14px] text-gray-900">
                      My Profile
                    </span>
                  </button>

                  {/* 2. Change Password */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onChangePasswordClick();
                    }}
                    className="w-full flex items-center px-4 py-2.5 hover:bg-gray-50 text-left transition duration-150 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-gray-900 mr-3.5 ml-2 shrink-0 stroke-[2]" />
                    <span className="font-sans font-bold text-[14px] text-gray-900">
                      Change Password
                    </span>
                  </button>

                  {/* 3. Logout */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onLogout) {
                        onLogout();
                      } else {
                        onNavigate("Dashboard");
                      }
                    }}
                    className="w-full flex items-center px-4 py-2.5 hover:bg-gray-50 text-left transition duration-150 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-gray-900 mr-3.5 ml-2 shrink-0 stroke-[2]" />
                    <span className="font-sans font-bold text-[14px] text-gray-900">
                      Logout
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating/Sticky Role Switcher Bar */}
      <div className="bg-gray-50 border-t border-gray-100 px-6 py-2 flex items-center space-x-3 overflow-x-auto scrollbar-thin">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
          Portal Switcher:
        </span>
        <div className="flex items-center space-x-1.5 py-0.5">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-3 py-1 rounded text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap ${
                currentRole === role
                  ? "bg-[#447837] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
