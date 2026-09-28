import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, X, Check, HelpCircle, Search, ChevronDown, PlusCircle, MoreVertical } from "lucide-react";
import { ServiceItem, PlanItem } from "../types";
import { initialServices, initialPlans } from "../mockData";

interface PlanSettingsViewProps {
  subView: "Services" | "PlanManagement";
}

interface ServiceFormItem {
  id: number;
  feature: string;
  subFeature: string;
  merchantCategory: string;
  merchantCategoryCode: string;
  minAmount: string;
  maxAmount: string;
  featureTouched?: boolean;
  subFeatureTouched?: boolean;
  mccTouched?: boolean;
  minAmountTouched?: boolean;
  maxAmountTouched?: boolean;
}

const FEATURE_OPTIONS = ["UPI_API", "UPI_SDK", "UPI_REFUND"];

const SUB_FEATURE_MAP: Record<string, string[]> = {
  "UPI_API": ["ONLINE_UPI_INTENT", "ONLINE_QR_COLLECT", "OFFLINE_STATIC_QR"],
  "UPI_SDK": ["ONLINE_UPI_INTENT", "ONLINE_QR_COLLECT", "OFFLINE_STATIC_QR"],
  "UPI_REFUND": ["SMART_UPI_REFUND", "STANDARD_UPI_REFUND", "INSTANT_UPI_REFUND"]
};

const MERCHANT_CATEGORIES = [
  { name: "All - Category(0)", code: "0" },
  { name: "Business services(BM69)", code: "BM69" },
  { name: "Retail Outlet Services(ROS08)", code: "ROS08" },
  { name: "Miscellaneous Stores(MS10)", code: "MS10" },
  { name: "Car Rental(CR04)", code: "CR04" },
  { name: "Transportation Services(TS06)", code: "TS06" },
  { name: "Utility Services(US07)", code: "US07" },
  { name: "Clothing Stores(CS09)", code: "CS09" },
  { name: "Professional Services and Membership Organizations(PM012)", code: "PM012" },
  { name: "Government Services(GS11)", code: "GS11" }
];

export function PlanSettingsView({ subView: propSubView }: PlanSettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"Services" | "PlanManagement">(propSubView || "Services");

  useEffect(() => {
    if (propSubView) {
      setActiveTab(propSubView);
    }
  }, [propSubView]);

  // Services state
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [showServicesList, setShowServicesList] = useState(false); // Default false to show Add Service form as in screenshot
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Multiple service blocks form state
  const [formServices, setFormServices] = useState<ServiceFormItem[]>([
    {
      id: 1,
      feature: "",
      subFeature: "",
      merchantCategory: "",
      merchantCategoryCode: "",
      minAmount: "",
      maxAmount: "",
      featureTouched: false,
      subFeatureTouched: false,
      mccTouched: false,
      minAmountTouched: false,
      maxAmountTouched: false
    }
  ]);

  // Dropdown open states for each block ID
  const [openFeatureDropdown, setOpenFeatureDropdown] = useState<number | null>(null);
  const [openSubFeatureDropdown, setOpenSubFeatureDropdown] = useState<number | null>(null);
  const [openMccDropdown, setOpenMccDropdown] = useState<number | null>(null);
  const [openMccCodeDropdown, setOpenMccCodeDropdown] = useState<number | null>(null);
  const [mccSearchQuery, setMccSearchQuery] = useState("");

  // Plans state
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newAssignType, setNewAssignType] = useState("");
  const [planError, setPlanError] = useState("");

  const updateServiceField = (id: number, field: keyof ServiceFormItem, value: any) => {
    setFormServices(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Mark as touched when selected
        if (field === "feature") {
          updated.featureTouched = true;
          // Clear sub feature and reset touch state if feature changes
          updated.subFeature = "";
          updated.subFeatureTouched = false;
        }
        if (field === "subFeature") updated.subFeatureTouched = true;
        if (field === "merchantCategory") updated.mccTouched = true;
        if (field === "minAmount") updated.minAmountTouched = true;
        if (field === "maxAmount") updated.maxAmountTouched = true;
        return updated;
      }
      return item;
    }));
  };

  const handleAddFormServiceBlock = () => {
    const nextId = formServices.length > 0 ? Math.max(...formServices.map(s => s.id)) + 1 : 1;
    setFormServices(prev => [
      ...prev,
      {
        id: nextId,
        feature: "",
        subFeature: "",
        merchantCategory: "",
        merchantCategoryCode: "",
        minAmount: "",
        maxAmount: "",
        featureTouched: false,
        subFeatureTouched: false,
        mccTouched: false,
        minAmountTouched: false,
        maxAmountTouched: false
      }
    ]);
  };

  const handleRemoveFormService = (id: number) => {
    if (formServices.length > 1) {
      setFormServices(prev => prev.filter(item => item.id !== id));
    } else {
      setFormServices([
        {
          id: 1,
          feature: "",
          subFeature: "",
          merchantCategory: "",
          merchantCategoryCode: "",
          minAmount: "",
          maxAmount: "",
          featureTouched: false,
          subFeatureTouched: false,
          mccTouched: false,
          minAmountTouched: false,
          maxAmountTouched: false
        }
      ]);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched to trigger validation displays
    setFormServices(prev => prev.map(item => ({
      ...item,
      featureTouched: true,
      subFeatureTouched: true,
      mccTouched: true,
      minAmountTouched: true,
      maxAmountTouched: true
    })));

    // Validate presence
    const missingFields = formServices.some(s => !s.feature || !s.subFeature || !s.merchantCategory || !s.minAmount || !s.maxAmount);
    if (missingFields) {
      setToastMessage("Please fill in all required fields.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Validate values (Min amount <= Max amount)
    const invalidRanges = formServices.some(s => Number(s.minAmount) > Number(s.maxAmount));
    if (invalidRanges) {
      setToastMessage("Minimum Amount cannot be greater than Maximum Amount.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Convert and add
    const newItems: ServiceItem[] = formServices.map(s => ({
      id: "SRV-" + Math.floor(100 + Math.random() * 900),
      feature: s.feature,
      subFeature: s.subFeature,
      merchantCategory: s.merchantCategory,
      merchantCategoryCode: s.merchantCategoryCode || "0",
      minAmount: Number(s.minAmount) || 0,
      maxAmount: Number(s.maxAmount) || 0
    }));

    setServices(prev => [...prev, ...newItems]);
    
    // Reset form
    setFormServices([
      {
        id: 1,
        feature: "",
        subFeature: "",
        merchantCategory: "",
        merchantCategoryCode: "",
        minAmount: "",
        maxAmount: "",
        featureTouched: false,
        subFeatureTouched: false,
        mccTouched: false,
        minAmountTouched: false,
        maxAmountTouched: false
      }
    ]);

    setToastMessage("Service configurations added successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowServicesList(true); // Switch to list view to show what's added
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleCreatePlanSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) {
      setPlanError("Plan Name is required");
      return;
    }
    if (!newAssignType) {
      setPlanError("Assign Type is required");
      return;
    }
    const newPlan: PlanItem = {
      id: String(plans.length + 1),
      planName: newPlanName,
      assignType: newAssignType,
      createdDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    };
    setPlans([newPlan, ...plans]);
    setIsModalOpen(false);
    setNewPlanName("");
    setPlanError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 relative text-left"
    >
      {/* Title & Accent Divider */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h2 className="text-[22px] font-black text-[#1A253C] font-sans tracking-tight flex items-center">
            {activeTab === "Services" ? (
              showServicesList ? "← Configured Services" : "← Add Service"
            ) : (
              "← Plans"
            )}
          </h2>
          {/* Custom progress stepper matching the yellow/green/orange look */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="h-1 w-12 bg-[#EAB308] rounded-full"></div>
            <div className="h-1 w-3 bg-[#22C55E] rounded-full"></div>
            <div className="h-1 w-1.5 bg-[#EAB308] rounded-full"></div>
            <div className="h-1 w-1 bg-[#EAB308] rounded-full"></div>
          </div>
        </div>
        {activeTab === "Services" && (
          <button
            onClick={() => {
              setShowServicesList(!showServicesList);
            }}
            className="px-5 py-2.5 bg-[#447837] hover:bg-[#6c1611] text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-150"
          >
            {showServicesList ? "+ Add Service" : "View Services"}
          </button>
        )}
        {activeTab === "PlanManagement" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-[#447837] hover:bg-[#6c1611] text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-150"
          >
            + Create Plan
          </button>
        )}
      </div>

      {/* Segmented Tab Bar inside the Page */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg max-w-sm select-none border border-gray-200/40">
        <button
          type="button"
          onClick={() => setActiveTab("Services")}
          className={`flex-1 py-2 text-xs font-bold rounded transition-all duration-150 ${
            activeTab === "Services"
              ? "bg-[#447837] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-950 hover:bg-white/50"
          }`}
        >
          Services
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PlanManagement")}
          className={`flex-1 py-2 text-xs font-bold rounded transition-all duration-150 ${
            activeTab === "PlanManagement"
              ? "bg-[#447837] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-950 hover:bg-white/50"
          }`}
        >
          Plan Management
        </button>
      </div>

      {/* VIEW 1: SERVICES CONFIGURATION */}
      {activeTab === "Services" && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          {!showServicesList ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formServices.map((s, index) => (
                <div
                  key={s.id}
                  className="bg-white border border-gray-200/80 rounded-xl p-6 relative shadow-xs"
                >
                  <div className="border-b border-gray-100 pb-3 mb-6 flex items-center justify-between">
                    <h3 className="text-[17px] font-bold text-gray-800">
                      Service {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveFormService(s.id)}
                      className="text-[17px] font-bold text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Feature */}
                    <div>
                      <label className="block text-[14px] font-medium text-gray-500 mb-1.5">
                        Feature <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenFeatureDropdown(openFeatureDropdown === s.id ? null : s.id)}
                          className={`w-full border ${s.featureTouched && !s.feature ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#447837]"} rounded-[8px] px-4 py-3 bg-white text-left text-[15px] flex items-center justify-between focus:outline-none focus:ring-1 h-[48px]`}
                        >
                          <span className={s.feature ? "text-[#1A253C] font-semibold" : "text-gray-400"}>
                            {s.feature || "Select Feature"}
                          </span>
                          <span className="text-gray-400 select-none text-xs">▼</span>
                        </button>
                        {openFeatureDropdown === s.id && (
                          <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {FEATURE_OPTIONS.map((opt) => (
                              <div
                                key={opt}
                                onClick={() => {
                                  updateServiceField(s.id, "feature", opt);
                                  setOpenFeatureDropdown(null);
                                }}
                                className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer text-[15px] font-semibold"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {s.featureTouched && !s.feature && (
                        <p className="text-red-500 text-[13px] mt-1.5 select-none">Feature is required.</p>
                      )}
                    </div>

                    {/* Sub Feature */}
                    <div>
                      <label className="block text-[14px] font-medium text-gray-500 mb-1.5">
                        Sub Feature <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          disabled={!s.feature}
                          onClick={() => setOpenSubFeatureDropdown(openSubFeatureDropdown === s.id ? null : s.id)}
                          className={`w-full border ${s.subFeatureTouched && !s.subFeature ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#447837]"} ${!s.feature ? "bg-gray-50 cursor-not-allowed" : "bg-white"} rounded-[8px] px-4 py-3 text-left text-[15px] flex items-center justify-between focus:outline-none focus:ring-1 h-[48px]`}
                        >
                          <span className={s.subFeature ? "text-[#1A253C] font-semibold" : "text-gray-400"}>
                            {s.subFeature || "Select Sub Feature"}
                          </span>
                          <span className="text-gray-400 select-none text-xs">▼</span>
                        </button>
                        {openSubFeatureDropdown === s.id && s.feature && (
                          <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {(SUB_FEATURE_MAP[s.feature] || ["ONLINE_UPI_INTENT", "UPI_SDK_COLLECT", "DYNAMIC_QR"]).map((opt) => (
                              <div
                                key={opt}
                                onClick={() => {
                                  updateServiceField(s.id, "subFeature", opt);
                                  setOpenSubFeatureDropdown(null);
                                }}
                                className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer text-[15px] font-semibold"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {s.subFeatureTouched && !s.subFeature && (
                        <p className="text-red-500 text-[13px] mt-1.5 select-none">Sub Feature is required.</p>
                      )}
                    </div>

                    {/* Merchant Category */}
                    <div>
                      <label className="block text-[14px] font-medium text-gray-500 mb-1.5">
                        Merchant Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMccDropdown(openMccDropdown === s.id ? null : s.id);
                            setMccSearchQuery("");
                          }}
                          className={`w-full border ${s.mccTouched && !s.merchantCategory ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#447837]"} rounded-[8px] px-4 py-3 bg-white text-left text-[15px] flex items-center justify-between focus:outline-none focus:ring-1 h-[48px]`}
                        >
                          <span className={s.merchantCategory ? "text-[#1A253C] font-semibold" : "text-gray-400"}>
                            {s.merchantCategory || "Select Merchant Categories"}
                          </span>
                          <span className="text-gray-400 select-none text-xs">▼</span>
                        </button>
                        {openMccDropdown === s.id && (
                          <div className="absolute z-35 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto flex flex-col">
                            <div className="p-2 border-b border-gray-100 bg-white sticky top-0">
                              <div className="relative flex items-center">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  value={mccSearchQuery}
                                  onChange={(e) => setMccSearchQuery(e.target.value)}
                                  className="w-full text-sm border border-gray-200 rounded px-9 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#447837]"
                                />
                              </div>
                            </div>
                            <div className="overflow-y-auto max-h-48 divide-y divide-gray-50">
                              {MERCHANT_CATEGORIES.filter(cat =>
                                cat.name.toLowerCase().includes(mccSearchQuery.toLowerCase()) ||
                                cat.code.toLowerCase().includes(mccSearchQuery.toLowerCase())
                              ).map((cat) => (
                                <div
                                  key={cat.code}
                                  onClick={() => {
                                    updateServiceField(s.id, "merchantCategory", cat.name);
                                    updateServiceField(s.id, "merchantCategoryCode", cat.code);
                                    setOpenMccDropdown(null);
                                  }}
                                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer text-[15px] font-semibold"
                                >
                                  {cat.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {s.mccTouched && !s.merchantCategory && (
                        <p className="text-red-500 text-[13px] mt-1.5 select-none font-medium">Merchant Category is required.</p>
                      )}
                    </div>

                    {/* Merchant Category Code */}
                    <div>
                      <label className="block text-[14px] font-medium text-gray-500 mb-1.5">
                        Merchant Category Code <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMccCodeDropdown(openMccCodeDropdown === s.id ? null : s.id)}
                          className="w-full border border-gray-300 rounded-[8px] px-4 py-3 bg-white text-left text-[15px] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[#447837] h-[48px]"
                        >
                          <span className={s.merchantCategoryCode ? "text-[#1A253C] font-semibold" : "text-gray-400"}>
                            {s.merchantCategoryCode || "Select Merchant Category Code"}
                          </span>
                          <span className="text-gray-400 select-none text-xs">▼</span>
                        </button>
                        {openMccCodeDropdown === s.id && (
                          <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {MERCHANT_CATEGORIES.map((cat) => (
                              <div
                                key={cat.code}
                                onClick={() => {
                                  updateServiceField(s.id, "merchantCategoryCode", cat.code);
                                  updateServiceField(s.id, "merchantCategory", cat.name);
                                  setOpenMccCodeDropdown(null);
                                }}
                                className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer text-[15px] font-semibold"
                              >
                                {cat.code} ({cat.name.split('(')[0]})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Minimum Amount */}
                    <div>
                      <label className="block text-[14px] font-medium text-gray-500 mb-1.5">
                        Minimum Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Enter Min Amount"
                        value={s.minAmount}
                        onChange={(e) => updateServiceField(s.id, "minAmount", e.target.value)}
                        className={`w-full border ${s.minAmountTouched && !s.minAmount ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-1 focus:ring-[#447837]"} rounded-[8px] px-4 py-3 bg-white text-[#1A253C] font-semibold text-[15px] focus:outline-none h-[48px] placeholder-gray-400`}
                      />
                      {s.minAmountTouched && !s.minAmount && (
                        <p className="text-red-500 text-[13px] mt-1.5 select-none font-medium">Minimum Amount is required.</p>
                      )}
                    </div>

                    {/* Maximum Amount */}
                    <div>
                      <label className="block text-[14px] font-medium text-gray-500 mb-1.5">
                        Maximum Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Enter Max Amount"
                        value={s.maxAmount}
                        onChange={(e) => updateServiceField(s.id, "maxAmount", e.target.value)}
                        className={`w-full border ${s.maxAmountTouched && !s.maxAmount ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-1 focus:ring-[#447837]"} rounded-[8px] px-4 py-3 bg-white text-[#1A253C] font-semibold text-[15px] focus:outline-none h-[48px] placeholder-gray-400`}
                      />
                      {s.maxAmountTouched && !s.maxAmount && (
                        <p className="text-red-500 text-[13px] mt-1.5 select-none font-medium">Maximum Amount is required.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add form block button */}
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={handleAddFormServiceBlock}
                  className="flex items-center space-x-2 text-[15px] font-bold text-[#1A253C] hover:text-[#447837] transition"
                >
                  <span className="w-5 h-5 bg-[#1A253C] text-white rounded-full flex items-center justify-center text-xs font-black">+</span>
                  <span>Add</span>
                </button>
              </div>

              {/* Form Action buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-10 py-3.5 bg-[#AC6B66] hover:bg-[#965A55] text-white rounded-lg text-[15px] font-bold shadow-xs transition duration-150"
                >
                  ADD
                </button>
                <button
                  type="button"
                  onClick={() => setShowServicesList(true)}
                  className="px-10 py-3.5 border border-gray-300 bg-white hover:bg-gray-50 text-[#1A253C] rounded-lg text-[15px] font-bold transition duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* LIST OF CONFIGURATIONS VIEW */
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#447837]/5 text-[#447837] font-bold border-b border-gray-100">
                      <th className="px-5 py-3 text-[13px]">Feature</th>
                      <th className="px-5 py-3 text-[13px]">Sub Feature</th>
                      <th className="px-5 py-3 text-[13px]">Category</th>
                      <th className="px-5 py-3 text-[13px]">MCC</th>
                      <th className="px-5 py-3 text-[13px] text-right">Min Amount</th>
                      <th className="px-5 py-3 text-[13px] text-right">Max Amount</th>
                      <th className="px-5 py-3 text-[13px] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                          No service configurations found. Click "+ Add Service" to configure.
                        </td>
                      </tr>
                    ) : (
                      services.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3.5 font-bold text-[#1A253C] text-[13px]">{s.feature}</td>
                          <td className="px-5 py-3.5 font-mono text-gray-600 text-[11px]">{s.subFeature}</td>
                          <td className="px-5 py-3.5 text-gray-500 text-[13px]">{s.merchantCategory}</td>
                          <td className="px-5 py-3.5 font-mono text-[13px]">{s.merchantCategoryCode}</td>
                          <td className="px-5 py-3.5 text-right font-mono text-[13px] font-semibold text-gray-600">₹ {(s.minAmount || 0).toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-right font-mono text-[13px] font-semibold">₹ {(s.maxAmount || 0).toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveService(s.id)}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PLAN MANAGEMENT LIST */}
      {activeTab === "PlanManagement" && (
        <div className="space-y-6">
          {plans.map((p, index) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200/50 rounded-xl p-6 md:py-6 md:px-8 shadow-sm hover:shadow-md transition-shadow relative text-left"
            >
              {/* Header inside Card */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[16px] font-semibold text-slate-700 font-sans tracking-tight select-none">
                  {index + 1}. Plan Details
                </span>
                <button className="p-1 rounded-full text-slate-800 hover:bg-slate-100 transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Grid Layout of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {/* Plan Name */}
                <div className="flex items-center">
                  <span className="text-slate-400 text-[14px] font-medium w-28 shrink-0 select-none">Plan Name</span>
                  <span className="text-[#1A253C] text-[14px] font-bold tracking-tight">{p.planName}</span>
                </div>

                {/* Created Date */}
                <div className="flex items-center md:col-start-2 md:row-start-1">
                  <span className="text-slate-400 text-[14px] font-medium w-28 shrink-0 select-none">Created Date</span>
                  <span className="text-[#1A253C] text-[14px] font-bold tracking-tight">{p.createdDate}</span>
                </div>

                {/* Assign Type */}
                <div className="flex items-center md:col-start-1 md:row-start-2">
                  <span className="text-slate-400 text-[14px] font-medium w-28 shrink-0 select-none">Assign Type</span>
                  <span className="text-[#1A253C] text-[14px] font-bold tracking-tight">{p.assignType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL WINDOW FOR CREATE NEW PLAN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl p-6"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#447837] uppercase tracking-wider">
                Create New Plan
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlanSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Plan Name *</label>
                <input
                  type="text"
                  placeholder="Enter Plan Name"
                  value={newPlanName}
                  onChange={(e) => {
                    setNewPlanName(e.target.value);
                    if (e.target.value.trim()) setPlanError("");
                  }}
                  className={`w-full text-xs border rounded px-3 py-2 bg-white focus:outline-none ${
                    planError ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:ring-1 focus:ring-[#447837]"
                  }`}
                />
                {planError && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {planError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Assign Type *</label>
                <select
                  value={newAssignType}
                  onChange={(e) => setNewAssignType(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none"
                >
                  <option value="">Select Assign Type</option>
                  <option value="Aggregator">Aggregator</option>
                  <option value="Merchant">Merchant</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#6c1611] transition shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Floating alert toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl text-xs font-bold flex items-center space-x-2 z-50 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </motion.div>
  );
}
