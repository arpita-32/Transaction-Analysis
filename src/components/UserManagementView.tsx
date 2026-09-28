import { useState, useEffect, useMemo, FormEvent } from "react";
import { motion } from "motion/react";
import { User } from "../types";
import { suggestStateBankIFSC } from "../mockData";
import { Check, AlertCircle, ChevronDown, Plus, Trash2 } from "lucide-react";
import { MerchantOnboardingView } from "./MerchantOnboardingView";
import { CreateMakerUserView } from "./CreateMakerUserView";
import { SettlementAccountView, BillingManagementView } from "./SettlementAndBillingViews";

interface UserManagementViewProps {
  currentRole?: string;
  activeSubView?: string;
  onUserCreated: (user: User) => void;
  onNavigateToShowUsers: () => void;
}

export function UserManagementView({ currentRole, activeSubView, onUserCreated, onNavigateToShowUsers }: UserManagementViewProps) {
  const [onboardingType, setOnboardingType] = useState<string>("Select");
  const [showForm, setShowForm] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const validateAlphanumeric = (value: string, setter: (val: string) => void) => {
    setter(value);
    if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
      setUsernameError("Username can contain only letters and numbers. Spaces and special characters are not allowed.");
    } else {
      setUsernameError("");
    }
  };

  const roleOptions = [
    "Select Role",
    "Maker",
    "Checker",
    "Partner",
  ];

  // Form states - Admin User
  const [adminForm, setAdminForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    username: "",
    role: "Select Role",
  });

  // Form states - Partner
  const [partnerForm, setPartnerForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    username: "",
  });

  // Form states - Aggregator
  const [businessType, setBusinessType] = useState("");
  const [businessLegalName, setBusinessLegalName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [businessPan, setBusinessPan] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [personalFirstName, setPersonalFirstName] = useState("");
  const [personalLastName, setPersonalLastName] = useState("");
  const [personalMobile, setPersonalMobile] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");

  const [accountType, setAccountType] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");

  const [aggregatorUsername, setAggregatorUsername] = useState("");
  const [callbackType, setCallbackType] = useState<"UPI" | "UPI Cashpoint">("UPI");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [ipAddresses, setIpAddresses] = useState<string[]>([""]);

  const [ifscSuggestions, setIfscSuggestions] = useState<{ ifsc: string; bank: string; branch: string }[]>([]);
  const [usernameError, setUsernameError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createdAggregatorInfo, setCreatedAggregatorInfo] = useState<{ username: string; password: string; email: string; legalName: string } | null>(null);

  const isAdmin = currentRole === "Admin";
  const isPartner = currentRole === "Partner" || currentRole === "Aggregator";
  const isInternalRisk = currentRole === "Internal Risk User";
  const isCreatingMakerUser = !isInternalRisk && (activeSubView === "CreateMakerUser" || (isPartner && activeSubView !== "CreateUser"));
  const isCreatingAdminUser = !isInternalRisk && !isCreatingMakerUser && (activeSubView === "CreateAdminUser" || (isAdmin && activeSubView !== "CreateUser"));

  // Maker form state for Partner Portal
  const [makerForm, setMakerForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    username: "",
    modules: {
      merchantOnboarding: true,
      reports: true,
      disputes: true,
      showUser: true,
    }
  });
  const [makerErrors, setMakerErrors] = useState<Record<string, string>>({});
  const [makerSubmitted, setMakerSubmitted] = useState(false);

  const handleMakerSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMakerSubmitted(true);
    const errors: Record<string, string> = {};

    if (!makerForm.firstName.trim()) errors.firstName = "First Name is required";
    if (!makerForm.lastName.trim()) errors.lastName = "Last Name is required";
    if (!makerForm.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile Number is required";
    } else if (!/^[6-9]\d{9}$/.test(makerForm.mobileNumber.trim())) {
      errors.mobileNumber = "Enter a valid 10-digit Indian mobile number";
    }
    if (!makerForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(makerForm.email.trim())) {
      errors.email = "Enter a valid email address";
    }
    if (!makerForm.username.trim()) {
      errors.username = "Username is required";
    } else if (makerForm.username.trim().length < 4) {
      errors.username = "Username must be at least 4 characters";
    }

    if (Object.keys(errors).length > 0) {
      setMakerErrors(errors);
      return;
    }

    const tempPassword = `Maker@${Math.floor(1000 + Math.random() * 9000)}`;
    const randomId = `MKR${Math.floor(100000 + Math.random() * 900000)}`;

    const newUser: User = {
      id: randomId,
      username: makerForm.username.trim(),
      role: "Partner Maker",
      status: "Active",
      firstName: makerForm.firstName.trim(),
      lastName: makerForm.lastName.trim(),
      mobileNumber: makerForm.mobileNumber.trim(),
      email: makerForm.email.trim(),
      outstandingBalance: 0,
      createDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      makerUsername: "ta_partner",
      parentUsername: "ta_partner",
      planName: "Partner Maker Operations Plan",
      bankAccountNumber: "91" + makerForm.mobileNumber.trim(),
      bankName: "State Bank of India",
      ifscCode: "SBIN0001234",
      vpa: `${makerForm.username.trim().toLowerCase()}@ta`,
      payerAccountTypes: {
        Savings: true,
        Current: true
      }
    };

    setCreatedAggregatorInfo({
      username: makerForm.username.trim(),
      password: tempPassword,
      email: makerForm.email.trim(),
      legalName: `${makerForm.firstName.trim()} ${makerForm.lastName.trim()} (Partner Maker)`
    });
    setShowCredentialsModal(true);
    onUserCreated(newUser);
  };

  const handleMakerReset = () => {
    setMakerForm({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      username: "",
      modules: {
        merchantOnboarding: true,
        reports: true,
        disputes: true,
        showUser: true,
      }
    });
    setMakerErrors({});
    setMakerSubmitted(false);
  };

  // Helper validation for IPv4
  const isValidPublicIPv4 = (ip: string) => {
    const trimmed = ip.trim();
    if (!/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(trimmed)) return false;
    const parts = trimmed.split(".");
    if (parts.length !== 4) return false;
    for (const part of parts) {
      if (part.length > 1 && part.startsWith("0")) return false; // Reject leading zeroes
      const num = Number(part);
      if (num < 0 || num > 255) return false;
    }
    const p0 = Number(parts[0]);
    const p1 = Number(parts[1]);
    // 0.0.0.0/8
    if (p0 === 0) return false;
    // Loopback 127.0.0.0/8
    if (p0 === 127) return false;
    // Class A private: 10.0.0.0/8
    if (p0 === 10) return false;
    // Class B private: 172.16.0.0/12
    if (p0 === 172 && p1 >= 16 && p1 <= 31) return false;
    // Class C private: 192.168.0.0/16
    if (p0 === 192 && p1 === 168) return false;
    // Link-local: 169.254.0.0/16
    if (p0 === 169 && p1 === 254) return false;
    // Multicast & Reserved: >= 224
    if (p0 >= 224) return false;
    // Broadcast
    if (trimmed === "255.255.255.255") return false;
    return true;
  };

  // Helper validation for Emoji
  const containsEmoji = (str: string) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(str);
  };

  // Pincode Lookup logic
  const handlePincodeChange = (pincodeVal: string) => {
    const val = pincodeVal.trim();
    setPin(val);
    if (/^[1-9][0-9]{5}$/.test(val)) {
      if (val === "999999") {
        setCity("");
        setState("");
      } else if (val.startsWith("40")) {
        setCity("Mumbai");
        setState("Maharashtra");
      } else if (val.startsWith("11")) {
        setCity("New Delhi");
        setState("Delhi");
      } else if (val.startsWith("56")) {
        setCity("Bengaluru");
        setState("Karnataka");
      } else if (val.startsWith("70")) {
        setCity("Kolkata");
        setState("West Bengal");
      } else if (val.startsWith("60")) {
        setCity("Chennai");
        setState("Tamil Nadu");
      } else if (val.startsWith("50")) {
        setCity("Hyderabad");
        setState("Telangana");
      } else {
        setCity("Mumbai");
        setState("Maharashtra");
      }
    } else {
      setCity("");
      setState("");
    }
  };

  useEffect(() => {
    setShowForm(false);
    setOnboardingType("Select");
    setAdminForm({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      username: "",
      role: "Select Role",
    });
  }, [activeSubView]);

  const handleRoleSelect = (role: string) => {
    setAdminForm({ ...adminForm, role });
    if (role === "Partner" || role === "Aggregator") {
      setOnboardingType("Partner");
      setShowForm(true);
    }
  };

  const handleNextStep = () => {
    if (onboardingType !== "Select") {
      setShowForm(true);
    }
  };

  const handleBackToSelection = () => {
    setShowForm(false);
    setAdminForm(prev => ({ ...prev, role: "Select Role" }));
    setOnboardingType("Select");
  };

  // IFSC Suggestion Handler
  const handleIfscChange = (val: string) => {
    setIfscCode(val);
    if (val.trim().length >= 2) {
      const sug = suggestStateBankIFSC(val);
      setIfscSuggestions(sug);
      // Auto fetch if exact matches SBIN
      const exact = sug.find((s) => s.ifsc.toUpperCase() === val.toUpperCase());
      if (exact) {
        setBankName(exact.bank);
        setBranchName(exact.branch);
      }
    } else {
      setIfscSuggestions([]);
    }
  };

  const handleSelectIfsc = (item: { ifsc: string; bank: string; branch: string }) => {
    setIfscCode(item.ifsc);
    setBankName(item.bank);
    setBranchName(item.branch);
    setIfscSuggestions([]);
  };

  const handleAdminSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!adminForm.firstName || !adminForm.lastName || !adminForm.mobileNumber || !adminForm.email || !adminForm.username || adminForm.role === "Select Role") {
      alert("Please fill in all required fields.");
      return;
    }

    const newUser: User = {
      id: "TA" + Math.floor(100000 + Math.random() * 900000),
      username: adminForm.username,
      role: adminForm.role,
      status: "Approved by Bank Checker",
      firstName: adminForm.firstName,
      lastName: adminForm.lastName,
      email: adminForm.email,
      mobileNumber: adminForm.mobileNumber,
      outstandingBalance: 0,
      planName: adminForm.role + " Plan",
      createDate: new Date().toLocaleString(),
      makerUsername: "saswatpnai",
      parentUsername: "saswatpnai",
      onboardingStatus: "Onboarding Completed",
      kycStatus: "Verified",
      vpa: adminForm.username.toLowerCase() + "@ta",
      features: {
        "UPI API": true,
        "UPI SDK": true,
      }
    };

    onUserCreated(newUser);
    onNavigateToShowUsers();
  };

  const handlePartnerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!partnerForm.firstName || !partnerForm.lastName || !partnerForm.mobileNumber || !partnerForm.email || !partnerForm.username) {
      alert("Please fill in all required fields.");
      return;
    }

    const newUser: User = {
      id: "TA" + Math.floor(100000 + Math.random() * 900000),
      username: partnerForm.username,
      role: "Partner",
      status: "Active",
      firstName: partnerForm.firstName,
      lastName: partnerForm.lastName,
      email: partnerForm.email,
      mobileNumber: partnerForm.mobileNumber,
      outstandingBalance: 0,
      planName: "—",
      createDate: new Date().toLocaleString(),
      makerUsername: "saswatpnai",
      parentUsername: "oxymoney",
      uatCallbackUrl: "",
      productionCallbackUrl: "",
      onboardingStatus: "Onboarding Completed",
      kycStatus: "Pending Approval",
      vpa: partnerForm.username.toLowerCase() + "@ta",
      features: { "UPI API": true, "UPI SDK": true }
    };

    onUserCreated(newUser);
    onNavigateToShowUsers();
  };

  const validateAggregatorForm = () => {
    const errors: Record<string, string> = {};

    // Business Type
    if (!businessType) {
      errors.businessType = "Please select a Business Type.";
    }

    // Business Legal Name
    const trimmedLegalName = businessLegalName.trim();
    if (!trimmedLegalName) {
      errors.businessLegalName = "Business Legal Name is required.";
    } else if (trimmedLegalName.length < 3 || trimmedLegalName.length > 100 || containsEmoji(businessLegalName)) {
      errors.businessLegalName = "Business Legal Name must be between 3 and 100 characters.";
    }

    // Brand Name
    const trimmedBrandName = brandName.trim();
    if (!trimmedBrandName) {
      errors.brandName = "Brand Name is required.";
    } else if (trimmedBrandName.length < 2 || trimmedBrandName.length > 100 || containsEmoji(brandName)) {
      errors.brandName = "Brand Name must be between 2 and 100 characters.";
    }

    // Business PAN
    const trimmedPan = businessPan.trim().toUpperCase();
    if (!trimmedPan) {
      errors.businessPan = "Business PAN is required.";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmedPan)) {
      errors.businessPan = "Value must follow the format AAAAA9999A (5 letters, 4 digits, and 1 letter). Special characters are not allowed.";
    }

    // Business Address
    const trimmedAddress = businessAddress.trim();
    if (!trimmedAddress) {
      errors.businessAddress = "Business Registered Address is required.";
    } else if (businessAddress.startsWith(" ") || businessAddress.endsWith(" ") || trimmedAddress.length < 10 || trimmedAddress.length > 250 || !/^[a-zA-Z0-9.,/# -]+$/.test(trimmedAddress)) {
      errors.businessAddress = "Only letters, numbers, commas, dots, slashes, hyphens, hash (#), and spaces are allowed. The value must not start or end with a space.";
    }

    // Pincode
    const trimmedPin = pin.trim();
    if (!trimmedPin) {
      errors.pin = "Pincode is required.";
    } else if (!/^[1-9][0-9]{5}$/.test(trimmedPin)) {
      errors.pin = "Pincode must be a 6-digit numeric value starting with 1–9. Spaces, letters, special characters, and negative values are not allowed.";
    }

    // First Name
    const trimmedFirstName = personalFirstName.trim();
    if (!trimmedFirstName) {
      errors.personalFirstName = "First Name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(trimmedFirstName)) {
      errors.personalFirstName = "Only letters and spaces are allowed.";
    }

    // Last Name
    const trimmedLastName = personalLastName.trim();
    if (!trimmedLastName) {
      errors.personalLastName = "Last Name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(trimmedLastName)) {
      errors.personalLastName = "Only letters and spaces are allowed.";
    }

    // Mobile Number
    const trimmedMobile = personalMobile.trim();
    if (!trimmedMobile) {
      errors.personalMobile = "Mobile Number is required.";
    } else if (!/^[0-9]{10}$/.test(trimmedMobile)) {
      errors.personalMobile = "Mobile number must be a valid 10-digit numeric value. Letters, spaces, special characters, decimals, and negative values are not allowed.";
    }

    // Email ID
    const trimmedEmail = personalEmail.trim();
    if (!trimmedEmail) {
      errors.personalEmail = "Email ID is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail) || trimmedEmail.length < 5 || trimmedEmail.length > 100) {
      errors.personalEmail = "Please enter a valid email address (example: name@domain.com). Only valid alphanumeric and standard email special characters are allowed.";
    }

    // Aadhaar Number (Optional)
    if (aadhaarNumber.trim() && !/^[0-9]{12}$/.test(aadhaarNumber.trim())) {
      errors.aadhaarNumber = "Aadhaar number must be a valid 12-digit numeric value. Letters, spaces, special characters, decimals, and negative values are not allowed.";
    }

    // Account Type
    if (!accountType) {
      errors.accountType = "Please select an Account Type.";
    }

    // IFSC Code
    const trimmedIfsc = ifscCode.trim().toUpperCase();
    if (!trimmedIfsc) {
      errors.ifscCode = "IFSC Code is required.";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmedIfsc)) {
      errors.ifscCode = "IFSC Code must follow the format AAAA0XXXXXX: 4 letters, followed by a fixed 0, followed by 6 letters and/or digits in any combination. Spaces and special characters are not allowed.";
    }

    // Bank Account Number
    const trimmedAcc = bankAccountNumber.trim();
    if (!trimmedAcc) {
      errors.bankAccountNumber = "Bank Account Number is required.";
    } else if (!/^[a-zA-Z0-9]{9,18}$/.test(trimmedAcc)) {
      errors.bankAccountNumber = "Bank Account Number must be 9 to 18 characters. It may be numeric (a traditional bank account number) or alphanumeric (a virtual account number, such as one allocated for a PA Escrow account). Spaces and special characters are not allowed.";
    }

    // Branch Name
    const trimmedBranch = branchName.trim();
    if (!trimmedBranch) {
      errors.branchName = "Branch Name is required.";
    } else if (!/^[a-zA-Z0-9 ./-]{3,100}$/.test(trimmedBranch)) {
      errors.branchName = "Only letters, numbers, spaces, hyphens (-), dots (.), and slashes (/) are allowed.";
    }

    // Username
    const trimmedUsername = aggregatorUsername.trim();
    if (!trimmedUsername) {
      errors.aggregatorUsername = "Username is required.";
    } else if (!/^[a-zA-Z0-9]{5,30}$/.test(aggregatorUsername)) {
      errors.aggregatorUsername = "Username can contain only letters and numbers. Spaces and special characters are not allowed.";
    } else if (trimmedUsername.toLowerCase() === "testagg01" || trimmedUsername.toLowerCase() === "existinguser") {
      errors.aggregatorUsername = "This username is already taken. Please choose a different one.";
    }

    // Callback Type
    if (!callbackType) {
      errors.callbackType = "Please select a Callback Type.";
    }

    // Callback URL
    const trimmedCbUrl = callbackUrl.trim();
    if (!trimmedCbUrl) {
      errors.callbackUrl = "Callback URL is required.";
    } else if (!/^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/i.test(trimmedCbUrl) || trimmedCbUrl.length < 11 || trimmedCbUrl.length > 2048) {
      errors.callbackUrl = "Please enter a valid Callback URL (example: https://example.com/callback).";
    }

    // IP Address
    const validIps = ipAddresses.map(ip => ip.trim()).filter(ip => ip !== "");
    if (validIps.length === 0) {
      errors.ipAddresses = "At least one IP Address is required.";
    } else if (validIps.length > 5) {
      errors.ipAddresses = "a maximum of 5 IP Addresses is allowed";
    } else {
      const hasDuplicates = new Set(validIps).size !== validIps.length;
      const hasInvalid = validIps.some(ip => !isValidPublicIPv4(ip));
      if (hasDuplicates || hasInvalid) {
        errors.ipAddresses = "Please enter a valid Indian Public IPv4 Address. Private, duplicate, IPv6, and non-Indian IP Addresses are not allowed.";
      }
    }

    return errors;
  };

  const currentValidationErrors = useMemo(() => {
    return validateAggregatorForm();
  }, [
    businessType,
    businessLegalName,
    brandName,
    businessPan,
    businessAddress,
    pin,
    personalFirstName,
    personalLastName,
    personalMobile,
    personalEmail,
    aadhaarNumber,
    accountType,
    ifscCode,
    bankAccountNumber,
    branchName,
    aggregatorUsername,
    callbackType,
    callbackUrl,
    ipAddresses,
  ]);

  const isAggregatorFormValid = Object.keys(currentValidationErrors).length === 0;

  const isFormInteracted = useMemo(() => {
    if (Object.keys(touchedFields).length > 0) return true;
    if (
      businessType ||
      businessLegalName ||
      brandName ||
      businessPan ||
      businessAddress ||
      pin ||
      personalFirstName ||
      personalLastName ||
      personalMobile ||
      personalEmail ||
      aadhaarNumber ||
      accountType ||
      ifscCode ||
      bankAccountNumber ||
      branchName ||
      aggregatorUsername ||
      callbackUrl ||
      ipAddresses.some(ip => ip.trim() !== "")
    ) {
      return true;
    }
    return false;
  }, [
    touchedFields,
    businessType,
    businessLegalName,
    brandName,
    businessPan,
    businessAddress,
    pin,
    personalFirstName,
    personalLastName,
    personalMobile,
    personalEmail,
    aadhaarNumber,
    accountType,
    ifscCode,
    bankAccountNumber,
    branchName,
    aggregatorUsername,
    callbackUrl,
    ipAddresses,
  ]);

  const getFieldError = (fieldName: string) => {
    const errorMsg = currentValidationErrors[fieldName];
    if (!errorMsg) return "";

    if (fieldErrors[fieldName]) return fieldErrors[fieldName];
    if (touchedFields[fieldName]) return errorMsg;

    let hasValue = false;
    switch (fieldName) {
      case "businessType": hasValue = Boolean(businessType); break;
      case "businessLegalName": hasValue = Boolean(businessLegalName.trim()); break;
      case "brandName": hasValue = Boolean(brandName.trim()); break;
      case "businessPan": hasValue = Boolean(businessPan.trim()); break;
      case "businessAddress": hasValue = Boolean(businessAddress.trim()); break;
      case "pin": hasValue = Boolean(pin.trim()); break;
      case "personalFirstName": hasValue = Boolean(personalFirstName.trim()); break;
      case "personalLastName": hasValue = Boolean(personalLastName.trim()); break;
      case "personalMobile": hasValue = Boolean(personalMobile.trim()); break;
      case "personalEmail": hasValue = Boolean(personalEmail.trim()); break;
      case "aadhaarNumber": hasValue = Boolean(aadhaarNumber.trim()); break;
      case "accountType": hasValue = Boolean(accountType); break;
      case "ifscCode": hasValue = Boolean(ifscCode.trim()); break;
      case "bankAccountNumber": hasValue = Boolean(bankAccountNumber.trim()); break;
      case "branchName": hasValue = Boolean(branchName.trim()); break;
      case "aggregatorUsername": hasValue = Boolean(aggregatorUsername.trim()); break;
      case "callbackType": hasValue = Boolean(callbackType); break;
      case "callbackUrl": hasValue = Boolean(callbackUrl.trim()); break;
      case "ipAddresses": hasValue = ipAddresses.some(ip => ip.trim() !== ""); break;
    }

    if (hasValue) return errorMsg;
    if (isFormInteracted) return errorMsg;

    return "";
  };

  const handleAggregatorSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validateAggregatorForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const tempPassword = "TempPass" + Math.floor(100 + Math.random() * 900) + "!";
    const isAgg = onboardingType === "Aggregator";
    const newUser: User = {
      id: "TA" + Math.floor(100000 + Math.random() * 900000),
      username: aggregatorUsername.trim(),
      role: isAgg ? "Aggregator" : "Partner",
      status: "Active",
      firstName: personalFirstName.trim(),
      lastName: personalLastName.trim(),
      email: personalEmail.trim(),
      mobileNumber: personalMobile.trim(),
      outstandingBalance: 0,
      planName: isAgg ? "Aggregator Premium Plan" : "Partner Premium Plan",
      createDate: new Date().toLocaleString(),
      makerUsername: "saswatpnai",
      parentUsername: "saswatpnai",
      businessType,
      businessLegalName: businessLegalName.trim(),
      brandName: brandName.trim(),
      businessPan: businessPan.trim(),
      businessAddress: businessAddress.trim(),
      pin: pin.trim(),
      city: city || "Mumbai",
      state: state || "Maharashtra",
      aadhaarNumber: aadhaarNumber.trim(),
      accountType,
      ifscCode: ifscCode.trim(),
      bankName: bankName || "State Bank of India",
      bankAccountNumber: bankAccountNumber.trim(),
      branchName: branchName.trim(),
      uatCallbackUrl: callbackUrl.trim(),
      productionCallbackUrl: callbackUrl.trim(),
      callbackType,
      callbackUrl: callbackUrl.trim(),
      ipAddresses: ipAddresses.filter((ip) => ip.trim() !== ""),
      onboardingStatus: "Onboarding Completed",
      kycStatus: "Verified",
      vpa: brandName.toLowerCase().replace(/\s+/g, "") + "@ta",
      features: {
        "UPI API": true,
        "UPI SDK": true,
        "UPI REFUND": true,
        "ONLINE UPI INTENT": true,
        "ONLINE QR COLLECT": true,
        "OFFLINE STATIC QR": false,
        "ONLINE UPI CASHPOINT": false
      }
    };

    setCreatedAggregatorInfo({
      username: aggregatorUsername.trim(),
      password: tempPassword,
      email: personalEmail.trim(),
      legalName: businessLegalName.trim()
    });
    setShowCredentialsModal(true);
    onUserCreated(newUser);
  };

  if (activeSubView === "SettlementAccount" || (isInternalRisk && activeSubView !== "BillingManagement")) {
    return (
      <SettlementAccountView
        onBack={onNavigateToShowUsers}
      />
    );
  }

  if (activeSubView === "BillingManagement") {
    return (
      <BillingManagementView
        onBack={onNavigateToShowUsers}
      />
    );
  }

  if (isCreatingMakerUser) {
    return (
      <CreateMakerUserView
        onBack={onNavigateToShowUsers}
        onUserCreated={onUserCreated}
      />
    );
  }

  if ((activeSubView === "MerchantOnboarding" || (showForm && onboardingType === "Merchant Onboarding")) && isAdmin) {
    return (
      <MerchantOnboardingView
        onBack={() => {
          setShowForm(false);
          setOnboardingType("Select");
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
    >
      {/* Title & Accent Divider */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => {
              if (showForm) {
                handleBackToSelection();
              } else {
                onNavigateToShowUsers();
              }
            }}
            className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
          >
            <span className="text-xl font-bold text-gray-800 group-hover:text-[#447837] transition-colors">
              ←
            </span>
            <h2 className="text-xl font-bold text-gray-800 font-sans tracking-tight group-hover:text-[#447837] transition-colors">
              {showForm ? `Create ${onboardingType}` : isCreatingMakerUser ? "Create Maker User" : isCreatingAdminUser ? "Create Admin User" : "Create User"}
            </h2>
          </button>
          <div className="flex h-1.5 w-32 mt-2 rounded-full overflow-hidden ml-6">
            <div className="bg-[#447837] w-2/3"></div>
            <div className="bg-yellow-500 w-1/3"></div>
          </div>
        </div>
        {showForm && (
          <button
            type="button"
            onClick={handleBackToSelection}
            className="text-xs font-bold text-[#447837] hover:underline bg-red-50 px-3 py-1.5 rounded transition cursor-pointer"
          >
            {isCreatingAdminUser ? "Back to Create Admin User" : "Change Onboarding Type"}
          </button>
        )}
      </div>

      {!showForm ? (
        isCreatingMakerUser ? (
          /* CREATE MAKER USER FORM (For Partner Portal) */
          <div className="max-w-4xl mx-auto py-2">
            <p className="text-xs text-gray-500 font-medium mb-6">
              Please enter all details to create a maker user under your Partner account.
            </p>

            <form onSubmit={handleMakerSubmit} className="bg-white border border-gray-200 p-8 rounded-xl shadow-2xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={makerForm.firstName}
                    onChange={(e) => setMakerForm({ ...makerForm, firstName: e.target.value })}
                    placeholder="e.g. Rahul"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#447837] focus:border-[#447837] outline-none"
                  />
                  {makerSubmitted && makerErrors.firstName && (
                    <span className="text-red-500 text-[10px] mt-1 block">{makerErrors.firstName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={makerForm.lastName}
                    onChange={(e) => setMakerForm({ ...makerForm, lastName: e.target.value })}
                    placeholder="e.g. Verma"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#447837] focus:border-[#447837] outline-none"
                  />
                  {makerSubmitted && makerErrors.lastName && (
                    <span className="text-red-500 text-[10px] mt-1 block">{makerErrors.lastName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Mobile Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={makerForm.mobileNumber}
                    onChange={(e) => setMakerForm({ ...makerForm, mobileNumber: e.target.value.replace(/\D/g, "") })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#447837] focus:border-[#447837] outline-none"
                  />
                  {makerSubmitted && makerErrors.mobileNumber && (
                    <span className="text-red-500 text-[10px] mt-1 block">{makerErrors.mobileNumber}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email ID<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={makerForm.email}
                    onChange={(e) => setMakerForm({ ...makerForm, email: e.target.value })}
                    placeholder="maker@partner.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#447837] focus:border-[#447837] outline-none"
                  />
                  {makerSubmitted && makerErrors.email && (
                    <span className="text-red-500 text-[10px] mt-1 block">{makerErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Username<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={makerForm.username}
                    onChange={(e) => setMakerForm({ ...makerForm, username: e.target.value })}
                    placeholder="e.g. rahul_mkr"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#447837] focus:border-[#447837] outline-none"
                  />
                  {makerSubmitted && makerErrors.username && (
                    <span className="text-red-500 text-[10px] mt-1 block">{makerErrors.username}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Role Assigned
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 flex items-center justify-between">
                    <span>Partner Maker User</span>
                    <span className="text-[10px] bg-[#EBF4E9] text-[#447837] px-2 py-0.5 rounded font-bold">Standard</span>
                  </div>
                </div>
              </div>

              {/* Module Access Rights */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Module Permissions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makerForm.modules.merchantOnboarding}
                      onChange={(e) => setMakerForm({
                        ...makerForm,
                        modules: { ...makerForm.modules, merchantOnboarding: e.target.checked }
                      })}
                      className="accent-[#447837]"
                    />
                    <span>Merchant Onboard</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makerForm.modules.reports}
                      onChange={(e) => setMakerForm({
                        ...makerForm,
                        modules: { ...makerForm.modules, reports: e.target.checked }
                      })}
                      className="accent-[#447837]"
                    />
                    <span>View Reports</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makerForm.modules.disputes}
                      onChange={(e) => setMakerForm({
                        ...makerForm,
                        modules: { ...makerForm.modules, disputes: e.target.checked }
                      })}
                      className="accent-[#447837]"
                    />
                    <span>Disputes</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makerForm.modules.showUser}
                      onChange={(e) => setMakerForm({
                        ...makerForm,
                        modules: { ...makerForm.modules, showUser: e.target.checked }
                      })}
                      className="accent-[#447837]"
                    />
                    <span>Merchant List</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleMakerReset}
                  className="px-5 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-[#447837] hover:bg-[#38642e] rounded-md transition shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : isCreatingAdminUser ? (
          /* CREATE ADMIN USER FORM (For Admin Role) */
          <div className="max-w-4xl mx-auto py-2">
            <p className="text-xs text-gray-500 font-medium mb-6">
              Please enter all the details.
            </p>

            <form onSubmit={handleAdminSubmit} className="bg-white border border-gray-200 p-8 rounded-xl shadow-2xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    required
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                    className="w-full text-xs font-medium border border-gray-300 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    required
                    value={adminForm.lastName}
                    onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                    className="w-full text-xs font-medium border border-gray-300 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Mobile Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Mobile Number"
                    required
                    value={adminForm.mobileNumber}
                    onChange={(e) => setAdminForm({ ...adminForm, mobileNumber: e.target.value })}
                    className="w-full text-xs font-medium border border-gray-300 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email ID<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email ID"
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="w-full text-xs font-medium border border-gray-300 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    User Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter User Name"
                    required
                    value={adminForm.username}
                    onChange={(e) => validateAlphanumeric(e.target.value, (val) => setAdminForm({ ...adminForm, username: val }))}
                    className="w-full text-xs font-medium border border-gray-300 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none"
                  />
                  {usernameError && <p className="text-[10px] text-red-500 mt-1">{usernameError}</p>}
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Select Role ID
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="w-full flex items-center justify-between text-xs font-medium border border-gray-300 rounded px-3.5 py-2.5 bg-white focus:ring-1 focus:ring-[#447837] focus:border-[#447837] focus:outline-none text-left cursor-pointer"
                  >
                    <span className={adminForm.role === "Select Role" ? "text-gray-600" : "text-gray-900 font-semibold"}>
                      {adminForm.role}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isRoleDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsRoleDropdownOpen(false)}
                      />
                      <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto py-1">
                        {roleOptions.map((role) => (
                          <div
                            key={role}
                            onClick={() => {
                              setIsRoleDropdownOpen(false);
                              handleRoleSelect(role);
                            }}
                            className={`px-3.5 py-2 text-xs cursor-pointer transition-colors ${
                              adminForm.role === role
                                ? "bg-blue-600 text-white font-semibold"
                                : "text-gray-800 hover:bg-blue-500 hover:text-white"
                            }`}
                          >
                            {role}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-[#447837] hover:bg-[#6b2126] text-white font-bold text-xs px-10 py-2.5 rounded shadow-xs transition cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STEP 1: Onboarding Type Selection (For Admin Maker / Other Roles) */
          <div className="max-w-md mx-auto py-10">
            <p className="text-xs text-gray-500 font-medium mb-6 text-center">
              Please select the onboarding type to continue.
            </p>

            <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg shadow-2xs">
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Onboarding Type *
                </label>
                <div className="relative">
                  <select
                    value={onboardingType}
                    onChange={(e) => setOnboardingType(e.target.value)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-800 focus:ring-1 focus:ring-[#447837] focus:outline-none appearance-none pr-8 cursor-pointer"
                  >
                    <option value="Select">Select Onboarding Type</option>
                    <option value="Partner">Partner</option>
                    <option value="Aggregator">Aggregator (Legacy)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={onboardingType === "Select"}
                className={`w-full py-2.5 rounded text-xs font-bold text-white transition-all duration-200 cursor-pointer ${
                  onboardingType === "Select"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#447837] hover:bg-[#38642e] shadow-xs"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )
      ) : (
        /* COMPREHENSIVE PARTNER & AGGREGATOR ONBOARDING FORM */
        <>
          <form id="aggregatorOnboardingForm" onSubmit={handleAggregatorSubmit} className="max-w-4xl mx-auto space-y-8 bg-gray-50 p-6 rounded-lg border border-gray-100 text-left">
            {/* Section 1: Business Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#447837] uppercase tracking-wider border-b border-gray-200 pb-1.5 flex items-center justify-between">
                <span>Business Information ({onboardingType === "Aggregator" ? "Aggregator" : "Partner"})</span>
                <span className="text-[11px] font-semibold text-gray-400 normal-case">All attributes preserved</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="businessType" className="block text-xs font-bold text-gray-500 mb-1">Business Type *</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={businessType}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, businessType: true }))}
                    onChange={(e) => {
                      setBusinessType(e.target.value);
                      setTouchedFields(prev => ({ ...prev, businessType: true }));
                      if (fieldErrors.businessType) setFieldErrors(prev => ({ ...prev, businessType: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("businessType") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  >
                    <option value="">Select Business Type</option>
                    <option value="SOLE PROPRIETORSHIP">SOLE PROPRIETORSHIP</option>
                    <option value="PARTNERSHIP FIRM">PARTNERSHIP FIRM</option>
                    <option value="LIMITED LIABILITY PARTNERSHIP (LLP)">LIMITED LIABILITY PARTNERSHIP (LLP)</option>
                    <option value="HINDU UNDIVIDED FAMILY">HINDU UNDIVIDED FAMILY</option>
                    <option value="TRUST">TRUST</option>
                    <option value="SOCIETY">SOCIETY</option>
                    <option value="ASSOCIATION OF PERSONS (AOP) / BODY OF INDIVIDUALS (BOI)">ASSOCIATION OF PERSONS (AOP) / BODY OF INDIVIDUALS (BOI)</option>
                    <option value="PRIVATE LIMITED">PRIVATE LIMITED</option>
                    <option value="PUBLIC LIMITED">PUBLIC LIMITED</option>
                  </select>
                  {getFieldError("businessType") && (
                    <p id="businessType-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("businessType")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessLegalName" className="block text-xs font-bold text-gray-500 mb-1">Business Legal Name *</label>
                  <input
                    id="businessLegalName"
                    name="businessLegalName"
                    type="text"
                    placeholder="Enter Business Legal Name"
                    value={businessLegalName}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, businessLegalName: true }))}
                    onChange={(e) => {
                      setBusinessLegalName(e.target.value);
                      setTouchedFields(prev => ({ ...prev, businessLegalName: true }));
                      if (fieldErrors.businessLegalName) setFieldErrors(prev => ({ ...prev, businessLegalName: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("businessLegalName") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("businessLegalName") && (
                    <p id="businessLegalName-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("businessLegalName")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="brandName" className="block text-xs font-bold text-gray-500 mb-1">Brand Name *</label>
                  <input
                    id="brandName"
                    name="brandName"
                    type="text"
                    placeholder="Enter Brand Name"
                    value={brandName}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, brandName: true }))}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                      setTouchedFields(prev => ({ ...prev, brandName: true }));
                      if (fieldErrors.brandName) setFieldErrors(prev => ({ ...prev, brandName: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("brandName") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("brandName") && (
                    <p id="brandName-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("brandName")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessPan" className="block text-xs font-bold text-gray-500 mb-1">Business PAN *</label>
                  <input
                    id="businessPan"
                    name="businessPan"
                    type="text"
                    placeholder="Enter Business PAN"
                    value={businessPan}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, businessPan: true }))}
                    onChange={(e) => {
                      setBusinessPan(e.target.value.toUpperCase());
                      setTouchedFields(prev => ({ ...prev, businessPan: true }));
                      if (fieldErrors.businessPan) setFieldErrors(prev => ({ ...prev, businessPan: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("businessPan") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none font-mono uppercase`}
                  />
                  {getFieldError("businessPan") && (
                    <p id="businessPan-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("businessPan")}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="businessAddress" className="block text-xs font-bold text-gray-500 mb-1">Business Registered Address *</label>
                  <input
                    id="businessAddress"
                    name="businessAddress"
                    type="text"
                    placeholder="Enter Business Registered Address"
                    value={businessAddress}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, businessAddress: true }))}
                    onChange={(e) => {
                      setBusinessAddress(e.target.value);
                      setTouchedFields(prev => ({ ...prev, businessAddress: true }));
                      if (fieldErrors.businessAddress) setFieldErrors(prev => ({ ...prev, businessAddress: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("businessAddress") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("businessAddress") && (
                    <p id="businessAddress-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("businessAddress")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="pin" className="block text-xs font-bold text-gray-500 mb-1">Pincode *</label>
                  <input
                    id="pin"
                    name="pincode"
                    type="text"
                    placeholder="Enter Pincode"
                    value={pin}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, pin: true }))}
                    onChange={(e) => {
                      handlePincodeChange(e.target.value);
                      setTouchedFields(prev => ({ ...prev, pin: true }));
                      if (fieldErrors.pin) setFieldErrors(prev => ({ ...prev, pin: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("pin") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("pin") && (
                    <p id="pincode-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("pin")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-gray-500 mb-1">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City"
                    readOnly
                    disabled
                    value={city}
                    className="w-full text-xs border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-bold text-gray-500 mb-1">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="State"
                    readOnly
                    disabled
                    value={state}
                    className="w-full text-xs border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#447837] uppercase tracking-wider border-b border-gray-200 pb-1.5">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-gray-500 mb-1">First Name *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter First Name"
                    value={personalFirstName}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, personalFirstName: true }))}
                    onChange={(e) => {
                      setPersonalFirstName(e.target.value);
                      setTouchedFields(prev => ({ ...prev, personalFirstName: true }));
                      if (fieldErrors.personalFirstName) setFieldErrors(prev => ({ ...prev, personalFirstName: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("personalFirstName") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("personalFirstName") && (
                    <p id="firstName-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("personalFirstName")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-gray-500 mb-1">Last Name *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter Last Name"
                    value={personalLastName}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, personalLastName: true }))}
                    onChange={(e) => {
                      setPersonalLastName(e.target.value);
                      setTouchedFields(prev => ({ ...prev, personalLastName: true }));
                      if (fieldErrors.personalLastName) setFieldErrors(prev => ({ ...prev, personalLastName: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("personalLastName") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("personalLastName") && (
                    <p id="lastName-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("personalLastName")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-xs font-bold text-gray-500 mb-1">Mobile Number *</label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={personalMobile}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, personalMobile: true }))}
                    onChange={(e) => {
                      setPersonalMobile(e.target.value);
                      setTouchedFields(prev => ({ ...prev, personalMobile: true }));
                      if (fieldErrors.personalMobile) setFieldErrors(prev => ({ ...prev, personalMobile: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("personalMobile") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("personalMobile") && (
                    <p id="mobileNumber-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("personalMobile")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="emailId" className="block text-xs font-bold text-gray-500 mb-1">Email ID *</label>
                  <input
                    id="emailId"
                    name="emailId"
                    type="email"
                    placeholder="Enter Email ID"
                    value={personalEmail}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, personalEmail: true }))}
                    onChange={(e) => {
                      setPersonalEmail(e.target.value);
                      setTouchedFields(prev => ({ ...prev, personalEmail: true }));
                      if (fieldErrors.personalEmail) setFieldErrors(prev => ({ ...prev, personalEmail: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("personalEmail") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("personalEmail") && (
                    <p id="emailId-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("personalEmail")}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="aadhaarNumber" className="block text-xs font-bold text-gray-500 mb-1">Aadhaar Number (Optional)</label>
                  <input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    type="text"
                    placeholder="Enter Aadhaar Number"
                    value={aadhaarNumber}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, aadhaarNumber: true }))}
                    onChange={(e) => {
                      setAadhaarNumber(e.target.value);
                      setTouchedFields(prev => ({ ...prev, aadhaarNumber: true }));
                      if (fieldErrors.aadhaarNumber) setFieldErrors(prev => ({ ...prev, aadhaarNumber: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("aadhaarNumber") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("aadhaarNumber") && (
                    <p id="aadhaarNumber-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("aadhaarNumber")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Bank Information */}
            <div className="space-y-4 relative">
              <h3 className="text-xs font-bold text-[#447837] uppercase tracking-wider border-b border-gray-200 pb-1.5">
                Bank Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="accountType" className="block text-xs font-bold text-gray-500 mb-1">Account Type *</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={accountType}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, accountType: true }))}
                    onChange={(e) => {
                      setAccountType(e.target.value);
                      setTouchedFields(prev => ({ ...prev, accountType: true }));
                      if (fieldErrors.accountType) setFieldErrors(prev => ({ ...prev, accountType: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("accountType") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  >
                    <option value="">Select Account Type</option>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                    <option value="Escrow">Escrow</option>
                  </select>
                  {getFieldError("accountType") && (
                    <p id="accountType-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("accountType")}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="ifscCode" className="block text-xs font-bold text-gray-500 mb-1">IFSC Code *</label>
                  <input
                    id="ifscCode"
                    name="ifscCode"
                    type="text"
                    placeholder="Enter IFSC Code"
                    value={ifscCode}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, ifscCode: true }))}
                    onChange={(e) => {
                      handleIfscChange(e.target.value);
                      setTouchedFields(prev => ({ ...prev, ifscCode: true }));
                      if (fieldErrors.ifscCode) setFieldErrors(prev => ({ ...prev, ifscCode: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("ifscCode") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none font-mono uppercase`}
                  />
                  {getFieldError("ifscCode") && (
                    <p id="ifscCode-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("ifscCode")}
                    </p>
                  )}

                  {/* Auto Suggestions dropdown */}
                  {ifscSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto z-40">
                      <p className="px-3 py-1 bg-gray-50 text-[10px] text-gray-400 font-bold uppercase">IFSC Bank Suggestions</p>
                      {ifscSuggestions.map((item) => (
                        <button
                          key={item.ifsc}
                          type="button"
                          onClick={() => handleSelectIfsc(item)}
                          className="w-full text-left px-3 py-2 text-xs font-mono hover:bg-gray-50 text-gray-700 flex flex-col border-b border-gray-50 cursor-pointer"
                        >
                          <span className="font-bold text-[#447837]">{item.ifsc}</span>
                          <span className="text-[10px] text-gray-400 font-sans">{item.bank} - {item.branch}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="bankName" className="block text-xs font-bold text-gray-500 mb-1">Bank Name</label>
                  <input
                    id="bankName"
                    name="bankName"
                    type="text"
                    placeholder="Select Bank (Auto fetched from IFSC)"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none text-gray-800 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="bankAccountNumber" className="block text-xs font-bold text-gray-500 mb-1">Bank Account Number *</label>
                  <input
                    id="bankAccountNumber"
                    name="bankAccountNumber"
                    type="text"
                    placeholder="Enter Account Number"
                    value={bankAccountNumber}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, bankAccountNumber: true }))}
                    onChange={(e) => {
                      setBankAccountNumber(e.target.value);
                      setTouchedFields(prev => ({ ...prev, bankAccountNumber: true }));
                      if (fieldErrors.bankAccountNumber) setFieldErrors(prev => ({ ...prev, bankAccountNumber: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("bankAccountNumber") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none font-mono`}
                  />
                  {getFieldError("bankAccountNumber") && (
                    <p id="bankAccountNumber-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("bankAccountNumber")}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="branchName" className="block text-xs font-bold text-gray-500 mb-1">Branch Name *</label>
                  <input
                    id="branchName"
                    name="branchName"
                    type="text"
                    placeholder="Enter Branch Name"
                    value={branchName}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, branchName: true }))}
                    onChange={(e) => {
                      setBranchName(e.target.value);
                      setTouchedFields(prev => ({ ...prev, branchName: true }));
                      if (fieldErrors.branchName) setFieldErrors(prev => ({ ...prev, branchName: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("branchName") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none`}
                  />
                  {getFieldError("branchName") && (
                    <p id="branchName-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("branchName")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: User Detail */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#447837] uppercase tracking-wider border-b border-gray-200 pb-1.5">
                User Detail
              </h3>
              <div>
                <label htmlFor="username" className="block text-xs font-bold text-gray-500 mb-1">Username *</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter Username"
                  value={aggregatorUsername}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, aggregatorUsername: true }))}
                  onChange={(e) => {
                    setAggregatorUsername(e.target.value);
                    setTouchedFields(prev => ({ ...prev, aggregatorUsername: true }));
                    if (fieldErrors.aggregatorUsername) setFieldErrors(prev => ({ ...prev, aggregatorUsername: "" }));
                  }}
                  className={`w-full text-xs border ${getFieldError("aggregatorUsername") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none font-semibold`}
                />
                {getFieldError("aggregatorUsername") && (
                  <p id="username-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {getFieldError("aggregatorUsername")}
                  </p>
                )}
              </div>
            </div>

            {/* Section 5: Callback URL */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#447837] uppercase tracking-wider border-b border-gray-200 pb-1.5">
                Callback URL
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="callbackType" className="block text-xs font-bold text-gray-500 mb-1">Callback Type *</label>
                  <div className="relative">
                    <select
                      id="callbackType"
                      name="callbackType"
                      value={callbackType}
                      onBlur={() => setTouchedFields(prev => ({ ...prev, callbackType: true }))}
                      onChange={(e) => {
                        setCallbackType(e.target.value as "UPI" | "UPI Cashpoint");
                        setTouchedFields(prev => ({ ...prev, callbackType: true }));
                        if (fieldErrors.callbackType) setFieldErrors(prev => ({ ...prev, callbackType: "" }));
                      }}
                      className={`w-full text-xs border ${getFieldError("callbackType") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none font-semibold appearance-none cursor-pointer`}
                    >
                      <option value="UPI">UPI</option>
                      <option value="UPI Cashpoint">UPI Cashpoint</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {getFieldError("callbackType") && (
                    <p id="callbackType-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("callbackType")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="callbackUrl" className="block text-xs font-bold text-gray-500 mb-1">Callback URL *</label>
                  <input
                    id="callbackUrl"
                    name="callbackUrl"
                    type="text"
                    placeholder="Enter Callback URL (e.g. https://example.com/callback)"
                    value={callbackUrl}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, callbackUrl: true }))}
                    onChange={(e) => {
                      setCallbackUrl(e.target.value);
                      setTouchedFields(prev => ({ ...prev, callbackUrl: true }));
                      if (fieldErrors.callbackUrl) setFieldErrors(prev => ({ ...prev, callbackUrl: "" }));
                    }}
                    className={`w-full text-xs border ${getFieldError("callbackUrl") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none font-mono`}
                  />
                  {getFieldError("callbackUrl") && (
                    <p id="callbackUrl-error" role="alert" className="text-[10px] text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {getFieldError("callbackUrl")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 6: IP Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <h3 className="text-xs font-bold text-[#447837] uppercase tracking-wider">
                  IP Address <span className="text-gray-400 font-normal">({ipAddresses.length}/5)</span>
                </h3>
                {ipAddresses.length < 5 && (
                  <button
                    id="addIpAddressButton"
                    type="button"
                    onClick={() => {
                      if (ipAddresses.length < 5) {
                        setIpAddresses([...ipAddresses, ""]);
                      } else {
                        setFieldErrors(prev => ({ ...prev, ipAddresses: "a maximum of 5 IP Addresses is allowed" }));
                      }
                    }}
                    className="flex items-center space-x-1.5 text-xs font-bold text-[#447837] hover:text-white hover:bg-[#447837] px-2.5 py-1 rounded bg-[#447837]/10 border border-[#447837]/20 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add IP Address</span>
                  </button>
                )}
              </div>

              {getFieldError("ipAddresses") && (
                <p id="ipAddress-error" role="alert" className="text-[10px] text-red-600 font-medium flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                  {getFieldError("ipAddresses")}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {ipAddresses.map((ip, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor={`ipAddress-${idx}`} className="block text-[11px] font-semibold text-gray-600">
                        IP Address {idx + 1} *
                      </label>
                      {ipAddresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setIpAddresses(ipAddresses.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-600 transition p-0.5 cursor-pointer"
                          title="Remove IP Address"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <input
                      id={idx === 0 ? "ipAddress" : `ipAddress-${idx}`}
                      name={`ipAddress-${idx}`}
                      type="text"
                      placeholder={`Enter IP Address ${idx + 1}`}
                      value={ip}
                      onBlur={() => setTouchedFields(prev => ({ ...prev, ipAddresses: true }))}
                      onChange={(e) => {
                        const updated = [...ipAddresses];
                        updated[idx] = e.target.value;
                        setIpAddresses(updated);
                        setTouchedFields(prev => ({ ...prev, ipAddresses: true }));
                        if (fieldErrors.ipAddresses) setFieldErrors(prev => ({ ...prev, ipAddresses: "" }));
                      }}
                      className="w-full text-xs border border-gray-300 rounded px-2.5 py-2 bg-white focus:ring-1 focus:ring-[#447837] focus:outline-none font-mono placeholder:text-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              id="submitButton"
              type="submit"
              disabled={!isAggregatorFormValid}
              className={`w-full mt-8 py-2.5 text-xs font-bold rounded shadow-sm transition ${
                isAggregatorFormValid
                  ? "bg-[#447837] hover:bg-[#447837] text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
              }`}
            >
              Submit
            </button>
          </form>

          {/* Partner / Aggregator Credentials Modal */}
          {showCredentialsModal && createdAggregatorInfo && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full p-6 text-left"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#EBF4E9] flex items-center justify-center text-[#447837] font-bold">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        {onboardingType === "Aggregator" ? "Aggregator" : "Partner"} Account Created
                      </h3>
                      <p className="text-[11px] text-gray-500">Auto-Approved & Portal Credentials Generated</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200/80 text-xs text-gray-700">
                  <div className="border-b border-gray-200 pb-2">
                    <p className="font-bold text-[#447837] text-[11px] uppercase tracking-wider mb-1">
                      Email Sent to {onboardingType === "Aggregator" ? "Aggregator" : "Partner"} ({createdAggregatorInfo.email}):
                    </p>
                    <p className="font-semibold text-gray-800">
                      Subject: Your Transaction Analysts {onboardingType === "Aggregator" ? "Aggregator" : "Partner"} Portal Access is Ready
                    </p>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] bg-white p-3 rounded border border-gray-200">
                    <p><span className="font-bold font-sans text-gray-500">Portal URL:</span> https://portal.transactionanalysts.com/{onboardingType === "Aggregator" ? "aggregator" : "partner"}</p>
                    <p><span className="font-bold font-sans text-gray-500">Username:</span> {createdAggregatorInfo.username}</p>
                    <p><span className="font-bold font-sans text-gray-500">Temporary Password:</span> {createdAggregatorInfo.password}</p>
                  </div>

                  <p className="text-[10px] text-gray-500 italic">
                    Note: A confirmation audit email has also been sent to the Operations Admin ("{onboardingType === "Aggregator" ? "Aggregator" : "Partner"} Onboarding Successful — {createdAggregatorInfo.legalName}").
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCredentialsModal(false);
                      onNavigateToShowUsers();
                    }}
                    className="px-5 py-2.5 bg-[#447837] hover:bg-[#38642e] text-white text-xs font-bold rounded shadow-sm transition cursor-pointer"
                  >
                    Continue to Show Users
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
