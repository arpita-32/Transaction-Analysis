import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { ReportsView } from "./components/ReportsView";
import { UserManagementView } from "./components/UserManagementView";
import { ShowUserView } from "./components/ShowUserView";
import { ProfileView } from "./components/ProfileView";
import { AuditTrailView } from "./components/AuditTrailView";
import { PlanSettingsView } from "./components/PlanSettingsView";
import { DisputeView } from "./components/DisputeView";
import { LimitManagementView } from "./components/LimitManagementView";
import { VpaManagementView } from "./components/VpaManagementView";
import { MerchantOnboardingView } from "./components/MerchantOnboardingView";
import { MerchantReviewView } from "./components/MerchantReviewView";
import { CheckerMerchantReviewView } from "./components/CheckerMerchantReviewView";
import { MerchantPortalView } from "./components/MerchantPortalView";
import { MyProfileView } from "./components/MyProfileView";
import { DraftMerchantView } from "./components/DraftMerchantView";
import { SettlementAccountView, BillingManagementView } from "./components/SettlementAndBillingViews";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { LoginPage } from "./components/LoginPage";
import { User } from "./types";
import { initialUsers } from "./mockData";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>("Partner");
  const [activeView, setActiveView] = useState<string>("ShowUser");
  const [activeSubView, setActiveSubView] = useState<string>("");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [walletBalance] = useState<number>(0);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [merchantESigned, setMerchantESigned] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoadingOverlay(true);
    setIsChangePasswordOpen(true);
    setToast({ show: true, message: "Login successful." });

    setTimeout(() => {
      setIsLoadingOverlay(false);
    }, 2200);

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3500);
  };

  const handlePasswordSuccess = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  // Role switching side effect
  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
    if (role === "Maker") {
      setActiveView("MerchantManagement");
      setActiveSubView("CreateMerchant");
    } else if (role === "Checker") {
      setActiveView("Dashboard");
      setActiveSubView("");
    } else if (role === "Merchant") {
      setActiveView("MerchantPortal");
      setActiveSubView("");
    } else {
      setActiveView("Dashboard");
      setActiveSubView("");
    }
    setSelectedUser(null);
  };

  const handleNavigate = (view: string, subView: string = "") => {
    if (currentRole === "Merchant") {
      if (
        view === "MyProfile" ||
        view === "Reports" ||
        view === "HelpSupport" ||
        view === "Dashboard" ||
        view === "eSign" ||
        view === "ShowUser" ||
        view === "SettlementAccount" ||
        view === "MerchantPortal"
      ) {
        setActiveView("MerchantPortal");
        setActiveSubView(view === "MerchantPortal" ? subView || "Dashboard" : view);
        setSelectedUser(null);
        return;
      }
    }
    setActiveView(view);
    setActiveSubView(subView);
    setSelectedUser(null);
  };

  const handleUserCreated = (newUser: User) => {
    setUsers([newUser, ...users]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Update local users list state
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(updatedUser);
  };

  const handleSelectProfile = (user: User) => {
    setSelectedUser(user);
    setActiveView("Profile");
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB] flex flex-col font-sans select-none antialiased relative">
      {/* Top Header & Role Selector */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        walletBalance={walletBalance}
        onNavigate={handleNavigate}
        onChangePasswordClick={() => setIsChangePasswordOpen(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          currentRole={currentRole}
          activeView={activeView}
          activeSubView={activeSubView}
          onNavigate={handleNavigate}
          onRoleChange={handleRoleChange}
          isMerchantESigned={merchantESigned}
          onMerchantESignToggle={() => setMerchantESigned(!merchantESigned)}
        />

        {/* Main Content Workspace Container */}
        <main className={`flex-1 overflow-y-auto w-full ${currentRole === "Merchant" ? "bg-white p-0" : "p-6 max-w-7xl mx-auto"}`}>
          {(currentRole === "Merchant" || activeView === "MerchantPortal") && (
            <MerchantPortalView
              currentRole={currentRole}
              isESigned={merchantESigned}
              onESignSuccess={() => {
                setMerchantESigned(true);
                setToast({ show: true, message: "Terms and Conditions acknowledged successfully!" });
                setTimeout(() => setToast({ show: false, message: "" }), 3000);
              }}
              onNavigateToDashboard={() => handleNavigate("MerchantPortal", "Dashboard")}
              activeTab={activeSubView || (activeView === "ShowUser" ? "ShowUser" : activeView === "MyProfile" ? "MyProfile" : activeView === "Reports" ? "Reports" : activeView === "HelpSupport" ? "HelpSupport" : "Dashboard")}
              onTabChange={(tab) => handleNavigate("MerchantPortal", tab)}
              onChangePasswordClick={() => setIsChangePasswordOpen(true)}
              users={users}
              onSelectProfile={handleSelectProfile}
              onUpdateUser={handleUpdateUser}
              onCreateUserClick={() => handleNavigate("UserManagement", "CreateUser")}
            />
          )}

          {currentRole !== "Merchant" && activeView === "ReviewMerchant" && (
            <CheckerMerchantReviewView
              currentRole={currentRole}
              onBack={() => handleNavigate("Dashboard")}
            />
          )}

          {currentRole !== "Merchant" && (activeView === "ReviewPartner" || (activeView === "OnboardingHub" && activeSubView !== "MerchantReview")) && (
            <MerchantReviewView
              isCheckerOne={currentRole === "Checker 1"}
              isCheckerTwo={currentRole === "Checker 2"}
              currentRole={currentRole}
              onBack={() => handleNavigate("Dashboard")}
            />
          )}

          {currentRole !== "Merchant" && activeView === "OnboardingHub" && activeSubView === "MerchantReview" && (
            <MerchantOnboardingView
              currentRole={currentRole}
              activeSubView="MerchantReview"
              onBack={() => handleNavigate("Dashboard")}
            />
          )}

          {currentRole !== "Merchant" && activeView === "Dashboard" && (
            <DashboardView currentRole={currentRole} />
          )}
          
          {currentRole !== "Merchant" && activeView === "Reports" && (
            <ReportsView currentRole={currentRole} />
          )}
          
          {activeView === "UserManagement" && (
            <UserManagementView
              currentRole={currentRole}
              activeSubView={activeSubView}
              onUserCreated={handleUserCreated}
              onNavigateToShowUsers={() => handleNavigate("ShowUser")}
            />
          )}

          {activeView === "ShowUser" && (
            <ShowUserView
              users={users}
              onSelectProfile={handleSelectProfile}
              currentRole={currentRole}
            />
          )}

          {activeView === "Profile" && selectedUser && (
            <ProfileView
              user={selectedUser}
              onUpdateUser={handleUpdateUser}
              onBack={() => handleNavigate("ShowUser")}
              currentRole={currentRole}
              allUsers={users}
            />
          )}

          {activeView === "MyProfile" && (
            <MyProfileView
              currentRole={currentRole}
              onChangePasswordClick={() => setIsChangePasswordOpen(true)}
            />
          )}

          {activeView === "AuditTrail" && <AuditTrailView />}

          {activeView === "LimitManagement" && (
            <LimitManagementView />
          )}

          {activeView === "VpaManagement" && (
            <VpaManagementView
              currentRole={currentRole}
              activeSubView={activeSubView}
              onNavigateSubView={(sub) => handleNavigate("VpaManagement", sub)}
            />
          )}

          {activeView === "DraftMerchant" && (
            <DraftMerchantView
              onBack={() => handleNavigate("Dashboard")}
              onNavigateToCreate={() => handleNavigate("ReviewMerchant")}
            />
          )}

          {activeView === "PlanSettings" && (
            <PlanSettingsView subView={activeSubView as "Services" | "PlanManagement"} />
          )}

          {(activeView === "MerchantOnboarding" || activeView === "MerchantManagement") && (
            <MerchantOnboardingView
              currentRole={currentRole}
              activeSubView={activeSubView}
              onBack={() => handleNavigate("Dashboard")}
            />
          )}

          {activeView === "DisputeManagement" && (
            <DisputeView currentRole={currentRole} />
          )}

          {activeView === "SettlementAccount" && (
            <SettlementAccountView onBack={() => handleNavigate("Dashboard")} />
          )}

          {activeView === "BillingManagement" && (
            <BillingManagementView onBack={() => handleNavigate("Dashboard")} />
          )}
        </main>
      </div>

      {/* Loading Overlay with Red Pixel Grid (from screenshot) */}
      <AnimatePresence>
        {isLoadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-[100000] p-4 select-none"
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              {/* TA Green Pixel Block Animation */}
              <div className="grid grid-cols-3 gap-1 w-10 h-10">
                <div className="w-3 h-3 bg-[#447837] rounded-[1px] animate-pulse"></div>
                <div className="w-3 h-3 bg-[#447837] rounded-[1px] animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-transparent"></div>
                <div className="w-3 h-3 bg-[#447837] rounded-[1px] animate-pulse delay-75"></div>
                <div className="w-3 h-3 bg-[#447837] rounded-[1px] animate-pulse delay-150"></div>
                <div className="w-3 h-3 bg-[#447837] rounded-[1px] animate-pulse delay-200"></div>
                <div className="w-3 h-3 bg-transparent"></div>
                <div className="w-3 h-3 bg-[#447837] rounded-[1px] animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-transparent"></div>
              </div>
              <span className="text-white font-medium text-sm tracking-wide">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Modals & Notifications */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-4 right-6 z-[100001] flex items-center space-x-2.5 bg-[#143B28]/90 border border-emerald-500/30 text-[#4ADE80] rounded-lg py-2.5 px-4 shadow-2xl font-sans text-xs font-semibold backdrop-blur-md"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/40 shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-[#4ADE80]" />
            </div>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
}
