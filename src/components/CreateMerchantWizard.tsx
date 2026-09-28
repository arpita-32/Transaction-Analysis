import { useState, useRef, ChangeEvent } from "react";
import {
  ArrowLeft,
  Paperclip,
  Check,
  CheckCircle2,
  Download,
  ChevronDown,
  Edit3,
  FileText,
  AlertCircle,
  X,
  Plus,
  Trash2,
  UserCheck
} from "lucide-react";
import { DirectorInfo } from "../types";
import { getRegisteredEntities, registerNewMerchantEntities } from "../utils/merchantRegistry";
import { MerchantReviewItem } from "./CheckerMerchantReviewView";
import { addStoredMerchant } from "../utils/merchantStorage";

interface CreateMerchantWizardProps {
  onBack: () => void;
  onSaveDraft?: (draftData: any) => void;
  onSubmitSuccess?: (merchantData: any) => void;
  onViewInReview?: (mid: string) => void;
}

export function CreateMerchantWizard({
  onBack,
  onSaveDraft,
  onSubmitSuccess,
  onViewInReview
}: CreateMerchantWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showToast, setShowToast] = useState<string>("");
  const [isBeneVerified, setIsBeneVerified] = useState<boolean>(false);
  const [isVpaVerified, setIsVpaVerified] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedMid, setSubmittedMid] = useState<string>("");

  // Step 1: Onboarding Type
  const [onboardingType, setOnboardingType] = useState<string>("Offline");

  // Step 2: Business Entity Type
  const [entityType, setEntityType] = useState<string>("Company (Pvt/Public/OPC)");

  // Step 3: Business Information
  const [businessInfo, setBusinessInfo] = useState({
    businessLegalName: "",
    brandName: "",
    storeName: "",
    registeredAddress: "",
    pinCode: "",
    state: "",
    district: "",
    city: "",
    establishmentYear: "",
    businessRegisteredMobile: "",
    businessRegisteredEmail: "",
    businessPan: "",
    cin: "",
    turnoverFinancialYear: "",
    turnoverAmount: "",
    gstin: "",
    natureOfBusiness: "",
    mcc: "",
    merchantWebsiteUrl: ""
  });

  const [businessValidationAttempted, setBusinessValidationAttempted] = useState<boolean>(false);

  // Step 3: Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    nameAsPerAadhaar: "",
    din: "",
    address: "",
    pinCode: "",
    state: "",
    district: "",
    city: "",
    mobileNumber: "",
    emailId: "",
    pan: "",
    kycDocumentType: "",
    kycDocumentNumber: ""
  });

  // Step 3 (Sub-Section): Directors Information (Max 5, Director 1 is mandatory, up to 5 allowed)
  const [directors, setDirectors] = useState<DirectorInfo[]>([
    {
      id: 1,
      name: "",
      din: "",
      address: "",
      pinCode: "",
      state: "",
      district: "",
      city: "",
      mobileNumber: "",
      emailId: "",
      pan: "",
      kycDocumentType: "",
      kycDocumentNumber: ""
    }
  ]);

  const [director1ValidationAttempted, setDirector1ValidationAttempted] = useState<boolean>(false);

  const handleAddDirector = () => {
    if (directors.length >= 5) {
      triggerToast("Maximum of 5 directors allowed.");
      return;
    }
    const nextId = directors.length > 0 ? Math.max(...directors.map((d) => d.id)) + 1 : 1;
    const newDirector: DirectorInfo = {
      id: nextId,
      name: "",
      din: "",
      address: "",
      pinCode: "",
      state: "",
      district: "",
      city: "",
      mobileNumber: "",
      emailId: "",
      pan: "",
      kycDocumentType: "",
      kycDocumentNumber: ""
    };
    setDirectors([...directors, newDirector]);
    triggerToast(`Director ${directors.length + 1} added.`);
  };

  const handleRemoveDirector = (indexToRemove: number) => {
    if (indexToRemove === 0) {
      triggerToast("Director 1 is mandatory and cannot be removed.");
      return;
    }
    const dirNumber = indexToRemove + 1;
    setDirectors(directors.filter((_, idx) => idx !== indexToRemove));
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[`individualPanCard_${dirNumber}`];
      delete next[`kycDocFrontPage_${dirNumber}`];
      delete next[`kycDocBackPage_${dirNumber}`];
      delete next[`individualAddressProof_${dirNumber}`];
      delete next[`individualPhoto_${dirNumber}`];
      return next;
    });
    triggerToast(`Director ${dirNumber} removed.`);
  };

  const handleUpdateDirector = (index: number, field: keyof DirectorInfo, value: string) => {
    setDirectors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (index === 0) {
      if (field === "name") setPersonalInfo((prev) => ({ ...prev, nameAsPerAadhaar: value }));
      if (field === "din") setPersonalInfo((prev) => ({ ...prev, din: value }));
      if (field === "address") setPersonalInfo((prev) => ({ ...prev, address: value }));
      if (field === "pinCode") setPersonalInfo((prev) => ({ ...prev, pinCode: value }));
      if (field === "state") setPersonalInfo((prev) => ({ ...prev, state: value }));
      if (field === "district") setPersonalInfo((prev) => ({ ...prev, district: value }));
      if (field === "city") setPersonalInfo((prev) => ({ ...prev, city: value }));
      if (field === "mobileNumber") setPersonalInfo((prev) => ({ ...prev, mobileNumber: value }));
      if (field === "emailId") setPersonalInfo((prev) => ({ ...prev, emailId: value }));
      if (field === "pan") setPersonalInfo((prev) => ({ ...prev, pan: value }));
      if (field === "kycDocumentType") setPersonalInfo((prev) => ({ ...prev, kycDocumentType: value }));
      if (field === "kycDocumentNumber") setPersonalInfo((prev) => ({ ...prev, kycDocumentNumber: value }));
    }
  };

  // Step 4: Product Information
  const [productInfo, setProductInfo] = useState({
    productType: "UPI",
    dailyUsageLimit: "100000",
    minPerTxn: "1",
    maxPerTxn: "25000",
    creditLimitAmount: "50000"
  });

  // Step 5: Bank Information
  const [bankInfo, setBankInfo] = useState({
    accountType: "",
    beneficiaryName: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    bankPinCode: "",
    state: "",
    district: "",
    city: ""
  });

  // Step 6: Create Vpa
  const [vpaInfo, setVpaInfo] = useState({
    merchantVpa: ""
  });

  // Step 7: KYC Documents
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});
  const [additionalDocs, setAdditionalDocs] = useState<Array<{ id: number; key: string }>>([
    { id: 1, key: "additionalDocument" }
  ]);
  const [kycSelects, setKycSelects] = useState<{ [key: string]: string }>({
    businessAddressProofType: "",
    haveFiledItr: "",
    reasonForNotFilingItr: "",
    individualAddressProofType: "",
    individualAddressProofType_1: "",
    individualAddressProofType_2: "",
    individualAddressProofType_3: "",
    individualAddressProofType_4: "",
    individualAddressProofType_5: "",
    utilityBillType: "",
    utilityBillType_1: "",
    utilityBillType_2: "",
    utilityBillType_3: "",
    utilityBillType_4: "",
    utilityBillType_5: "",
    bankAccountProofType: ""
  });

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddAdditionalDoc = () => {
    if (additionalDocs.length < 5) {
      const nextId = (additionalDocs[additionalDocs.length - 1]?.id || 0) + 1;
      setAdditionalDocs((prev) => [...prev, { id: nextId, key: `additionalDocument_${nextId}` }]);
      triggerToast(`Added Additional Document ${additionalDocs.length + 1} of 5`);
    }
  };

  const handleRemoveAdditionalDoc = (id: number, key: string) => {
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    if (additionalDocs.length > 1) {
      setAdditionalDocs((prev) => prev.filter((doc) => doc.id !== id));
      triggerToast("Removed additional document");
    } else {
      triggerToast("Cleared additional document upload");
    }
  };

  const handleFileUpload = (fieldKey: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles((prev) => {
        const next = {
          ...prev,
          [fieldKey]: file.name
        };
        // Keep Person 1 and individualPanCard in sync for backward compatibility
        if (fieldKey === "individualPanCard_1") next["individualPanCard"] = file.name;
        if (fieldKey === "individualPanCard") next["individualPanCard_1"] = file.name;
        if (fieldKey === "kycDocFrontPage_1") next["kycDocFrontPage"] = file.name;
        if (fieldKey === "kycDocFrontPage") next["kycDocFrontPage_1"] = file.name;
        if (fieldKey === "kycDocBackPage_1") next["kycDocBackPage"] = file.name;
        if (fieldKey === "kycDocBackPage") next["kycDocBackPage_1"] = file.name;
        if (fieldKey === "individualAddressProof_1") next["individualAddressProof"] = file.name;
        if (fieldKey === "individualAddressProof") next["individualAddressProof_1"] = file.name;
        if (fieldKey === "individualPhoto_1") next["individualPhoto"] = file.name;
        if (fieldKey === "individualPhoto") next["individualPhoto_1"] = file.name;
        return next;
      });
      triggerToast(`Uploaded: ${file.name}`);
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3500);
  };

  // Real-time conflict & uniqueness validation for Business Information (Step 3)
  const getBusinessInfoErrors = () => {
    const registry = getRegisteredEntities();
    const errs: { [key: string]: string } = {};

    // 1. Business Registered Mobile Number
    const bMobile = businessInfo.businessRegisteredMobile?.trim();
    if (bMobile) {
      if (registry.mobiles.includes(bMobile)) {
        errs.businessRegisteredMobile = "This Mobile Number is already registered in the system and cannot be repeated.";
      } else {
        const matchingDirector = directors.find(
          (d) => d.mobileNumber?.trim() && d.mobileNumber.trim() === bMobile
        );
        if (matchingDirector) {
          errs.businessRegisteredMobile = `Business mobile number cannot be repeated in Director ${matchingDirector.id} information.`;
        }
      }
    }

    // 2. Business Registered Email
    const bEmail = businessInfo.businessRegisteredEmail?.trim().toLowerCase();
    if (bEmail) {
      if (registry.emails.includes(bEmail)) {
        errs.businessRegisteredEmail = "This Email ID is already registered in the system and cannot be repeated.";
      } else {
        const matchingDirector = directors.find(
          (d) => d.emailId?.trim().toLowerCase() === bEmail
        );
        if (matchingDirector) {
          errs.businessRegisteredEmail = `Business email ID cannot be repeated in Director ${matchingDirector.id} information.`;
        }
      }
    }

    // 3. Business PAN
    const bPan = businessInfo.businessPan?.trim().toUpperCase();
    if (bPan) {
      if (registry.pans.includes(bPan)) {
        errs.businessPan = "This Business PAN is already registered in the system and cannot be repeated.";
      } else {
        const matchingDirector = directors.find(
          (d) => d.pan?.trim().toUpperCase() === bPan
        );
        if (matchingDirector) {
          errs.businessPan = `Business PAN cannot be repeated in Director ${matchingDirector.id} information.`;
        }
      }
    }

    // 4. Business Registration Number (CIN)
    const bCin = businessInfo.cin?.trim().toUpperCase();
    if (bCin) {
      if (registry.cins.includes(bCin)) {
        errs.cin = "This Business Registration Number (CIN) is already registered in the system and cannot be repeated.";
      }
    }

    // 5. GSTIN (GST Number)
    const bGst = businessInfo.gstin?.trim().toUpperCase();
    if (bGst) {
      if (registry.gsts.includes(bGst)) {
        errs.gstin = "This GST Number is already registered in the system and cannot be repeated.";
      }
    }

    return errs;
  };

  // Real-time conflict & uniqueness validation for Directors Information (Step 4)
  const getDirectorsErrors = () => {
    const registry = getRegisteredEntities();
    const errs: { [key: string]: string } = {};

    const bMobile = businessInfo.businessRegisteredMobile?.trim();
    const bEmail = businessInfo.businessRegisteredEmail?.trim().toLowerCase();
    const bPan = businessInfo.businessPan?.trim().toUpperCase();

    directors.forEach((dir, idx) => {
      const isCompulsory = idx === 0;

      // 1. DIN Number Validation
      const din = dir.din?.trim();
      if (isCompulsory && director1ValidationAttempted && !din) {
        errs[`director_${idx}_din`] = "DIN number is mandatory for Director 1.";
      } else if (din) {
        if (din.length !== 8) {
          errs[`director_${idx}_din`] = "DIN must be an 8-digit number.";
        } else if (registry.dins.includes(din)) {
          errs[`director_${idx}_din`] = "This DIN number is already registered in the system and cannot be repeated.";
        } else {
          const duplicateDir = directors.find(
            (other, oIdx) => oIdx !== idx && other.din?.trim() === din
          );
          if (duplicateDir) {
            errs[`director_${idx}_din`] = `DIN number cannot be repeated across directors (already used in Director ${duplicateDir.id}).`;
          }
        }
      }

      // 2. Mobile Number Validation
      const mobile = dir.mobileNumber?.trim();
      if (isCompulsory && director1ValidationAttempted && !mobile) {
        errs[`director_${idx}_mobile`] = "Mobile Number is required for Director 1.";
      } else if (mobile) {
        if (bMobile && mobile === bMobile) {
          errs[`director_${idx}_mobile`] = "Director Mobile Number cannot be the same as Business Registered Mobile Number.";
        } else if (registry.mobiles.includes(mobile)) {
          errs[`director_${idx}_mobile`] = "This Mobile Number is already registered in the system and cannot be repeated.";
        } else {
          const duplicateDir = directors.find(
            (other, oIdx) => oIdx !== idx && other.mobileNumber?.trim() === mobile
          );
          if (duplicateDir) {
            errs[`director_${idx}_mobile`] = `Mobile number cannot be repeated across directors (already used in Director ${duplicateDir.id}).`;
          }
        }
      }

      // 3. Email ID Validation
      const email = dir.emailId?.trim().toLowerCase();
      if (isCompulsory && director1ValidationAttempted && !email) {
        errs[`director_${idx}_email`] = "Email Id is required for Director 1.";
      } else if (email) {
        if (bEmail && email === bEmail) {
          errs[`director_${idx}_email`] = "Director Email cannot be the same as Business Registered Email.";
        } else if (registry.emails.includes(email)) {
          errs[`director_${idx}_email`] = "This Email ID is already registered in the system and cannot be repeated.";
        } else {
          const duplicateDir = directors.find(
            (other, oIdx) => oIdx !== idx && other.emailId?.trim().toLowerCase() === email
          );
          if (duplicateDir) {
            errs[`director_${idx}_email`] = `Email ID cannot be repeated across directors (already used in Director ${duplicateDir.id}).`;
          }
        }
      }

      // 4. PAN Validation
      const pan = dir.pan?.trim().toUpperCase();
      if (isCompulsory && director1ValidationAttempted && !pan) {
        errs[`director_${idx}_pan`] = "PAN is required for Director 1.";
      } else if (pan) {
        if (bPan && pan === bPan) {
          errs[`director_${idx}_pan`] = "Director PAN cannot be the same as Business PAN.";
        } else if (registry.pans.includes(pan)) {
          errs[`director_${idx}_pan`] = "This PAN is already registered in the system and cannot be repeated.";
        } else {
          const duplicateDir = directors.find(
            (other, oIdx) => oIdx !== idx && other.pan?.trim().toUpperCase() === pan
          );
          if (duplicateDir) {
            errs[`director_${idx}_pan`] = `PAN cannot be repeated across directors (already used in Director ${duplicateDir.id}).`;
          }
        }
      }
    });

    return errs;
  };

  const businessErrors = getBusinessInfoErrors();
  const directorErrors = getDirectorsErrors();

  const handleDownloadTemplate = (templateName: string) => {
    let sampleContent = `TRANSACTION ANALYSTS - DECLARATION TEMPLATE\nDocument: ${templateName}\nDate: ${new Date().toLocaleDateString()}\n\nThis is an official declaration template for merchant onboarding.`;
    if (templateName === "SBO/UBO Declaration Form") {
      sampleContent = `TRANSACTION ANALYSTS - SBO / UBO DECLARATION FORM
(Under Rule 9 of the Prevention of Money-Laundering Rules, 2005 & Companies Act, 2013)

Date: ${new Date().toLocaleDateString()}
Entity Name: ${businessInfo.businessLegalName || "_______________________"}
PAN: ${businessInfo.businessPan || "_______________________"}

DEFINITIONS & INSTRUCTIONS:
1. SBO (Significant Beneficial Owner): An individual who, acting alone or together with one or more persons, holds beneficial interest of not less than 10% in shares, voting rights, or right to receive not less than 10% dividends, or exercises significant influence or control.
2. UBO (Ultimate Beneficial Owner): The natural person(s) who ultimately owns or controls a client and/or the person on whose behalf a transaction is being conducted.

DECLARATION:
I/We hereby declare and confirm that the particulars given in this document are true, correct, and complete to the best of my/our knowledge and belief.

Authorized Signatory / Director Name: _______________________
Designation: _______________________
Signature: _______________________
Date & Company Seal: _______________________`;
    }
    if (templateName === "Turnover Declaration") {
      sampleContent = `TRANSACTION ANALYSTS - ANNUAL TURNOVER DECLARATION FORM
Date: ${new Date().toLocaleDateString()}
Business Legal Name: ${businessInfo.businessLegalName || "_______________________"}
Business PAN: ${businessInfo.businessPan || "_______________________"}
GSTIN: ${businessInfo.gstin || "_______________________"}
Turnover Financial Year: ${businessInfo.turnoverFinancialYear || "2024-2025"}
Annual Turnover Amount (INR): ${businessInfo.turnoverAmount ? `₹ ${businessInfo.turnoverAmount}` : "_______________________"}

DECLARATION & CERTIFICATION:
I/We hereby solemnly declare and certify that the above declared gross annual business turnover for the aforementioned financial year is true, accurate, and extracted from the statutory books of accounts / audited financial records / GST returns of the entity.

Authorized Signatory / Director Name: _______________________
DIN / PAN: _______________________
Designation: _______________________
Signature: _______________________
Date & Official Seal: _______________________`;
    }
    const blob = new Blob([sampleContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${templateName.replace(/[\s\/]+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded template: ${templateName}`);
  };

  const handleSaveAsDraft = () => {
    const draftData = {
      onboardingType,
      entityType,
      businessInfo,
      personalInfo,
      directors,
      productInfo,
      bankInfo,
      vpaInfo,
      kycSelects,
      uploadedFiles,
      step: currentStep,
      lastUpdated: new Date().toLocaleString()
    };
    if (onSaveDraft) {
      onSaveDraft(draftData);
    }
    triggerToast("Application saved as draft successfully!");
  };

  const handleNext = () => {
    // STEP 3: BUSINESS INFORMATION VALIDATION
    if (currentStep === 3) {
      setBusinessValidationAttempted(true);
      const missingFields: string[] = [];
      if (!businessInfo.businessLegalName.trim()) missingFields.push("Business Legal Name");
      if (!businessInfo.brandName.trim()) missingFields.push("Brand Name");
      if (!businessInfo.storeName.trim()) missingFields.push("Store Name");
      if (!businessInfo.registeredAddress.trim()) missingFields.push("Registered Address");
      if (!businessInfo.pinCode.trim()) missingFields.push("PIN Code");
      if (!businessInfo.state.trim()) missingFields.push("State");
      if (!businessInfo.district.trim()) missingFields.push("District");
      if (!businessInfo.city.trim()) missingFields.push("City");
      if (!businessInfo.businessRegisteredMobile.trim()) missingFields.push("Business Registered Mobile");
      if (!businessInfo.businessRegisteredEmail.trim()) missingFields.push("Business Registered Email");
      if (!businessInfo.businessPan.trim()) missingFields.push("Business PAN");
      if (!businessInfo.cin.trim()) missingFields.push("Business Registration Number (CIN)");
      if (!businessInfo.turnoverFinancialYear.trim()) missingFields.push("Turnover Financial Year");
      if (!businessInfo.turnoverAmount.trim()) missingFields.push("Turnover Amount");
      if (!businessInfo.gstin.trim()) missingFields.push("GSTIN");
      if (!businessInfo.natureOfBusiness.trim()) missingFields.push("Nature of Business");
      if (!businessInfo.mcc.trim()) missingFields.push("MCC");

      if (missingFields.length > 0) {
        triggerToast(
          `Please fill required business fields: ${missingFields.slice(0, 3).join(", ")}${
            missingFields.length > 3 ? "..." : ""
          }`
        );
        return;
      }

      const bErrs = getBusinessInfoErrors();
      if (Object.keys(bErrs).length > 0) {
        const firstErrKey = Object.keys(bErrs)[0];
        triggerToast(bErrs[firstErrKey]);
        return;
      }
    }

    // STEP 4: DIRECTORS INFORMATION VALIDATION
    if (currentStep === 4) {
      setDirector1ValidationAttempted(true);
      const d1 = directors[0];
      const missingFields: string[] = [];
      if (!d1.name.trim()) missingFields.push("Name (As per Aadhaar)");
      if (!d1.din?.trim()) missingFields.push("DIN (Director Identification Number)");
      if (!d1.address.trim()) missingFields.push("Address");
      if (!d1.pinCode.trim()) missingFields.push("PIN Code");
      if (!d1.state.trim()) missingFields.push("State");
      if (!d1.district.trim()) missingFields.push("District");
      if (!d1.city.trim()) missingFields.push("City");
      if (!d1.mobileNumber.trim()) missingFields.push("Mobile Number");
      if (!d1.emailId.trim()) missingFields.push("Email Id");
      if (!d1.pan.trim()) missingFields.push("PAN");
      if (!d1.kycDocumentType.trim()) missingFields.push("KYC document Type");
      if (!d1.kycDocumentNumber.trim()) missingFields.push("KYC document Number");

      if (missingFields.length > 0) {
        triggerToast(
          `Director 1 is mandatory! Please fill required fields: ${missingFields.slice(0, 3).join(", ")}${
            missingFields.length > 3 ? "..." : ""
          }`
        );
        return;
      }

      const dErrs = getDirectorsErrors();
      if (Object.keys(dErrs).length > 0) {
        const firstErrKey = Object.keys(dErrs)[0];
        triggerToast(dErrs[firstErrKey]);
        return;
      }
    }

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final Submit
      const newMid = `MID${Math.floor(100000000 + Math.random() * 900000000)}`;
      setSubmittedMid(newMid);
      setIsSubmitted(true);

      // Register identifiers in persistent system registry to guarantee global uniqueness
      registerNewMerchantEntities({
        mobiles: [businessInfo.businessRegisteredMobile, ...directors.map((d) => d.mobileNumber)].filter(Boolean),
        pans: [businessInfo.businessPan, ...directors.map((d) => d.pan)].filter(Boolean),
        gsts: [businessInfo.gstin].filter(Boolean),
        cins: [businessInfo.cin].filter(Boolean),
        emails: [businessInfo.businessRegisteredEmail, ...directors.map((d) => d.emailId)].filter(Boolean),
        dins: directors.map((d) => d.din).filter(Boolean) as string[]
      });

      const primaryDir = directors[0] || {
        id: 1,
        name: personalInfo.nameAsPerAadhaar || businessInfo.brandName || "Authorized Signatory",
        din: personalInfo.din || "",
        address: personalInfo.address || businessInfo.registeredAddress || "Registered Office",
        pincode: personalInfo.pinCode || businessInfo.pinCode || "110001",
        state: personalInfo.state || businessInfo.state || "Delhi",
        district: personalInfo.district || businessInfo.district || "New Delhi",
        city: personalInfo.city || businessInfo.city || "New Delhi",
        mobileNumber: personalInfo.mobileNumber || businessInfo.businessRegisteredMobile || "+91 98765 43210",
        emailId: personalInfo.emailId || businessInfo.businessRegisteredEmail || "director@merchant.com",
        pan: personalInfo.pan || businessInfo.businessPan || "ABCDE1234F",
        kycDocumentType: personalInfo.kycDocumentType || "Aadhaar Card",
        kycDocumentNumber: personalInfo.kycDocumentNumber || "987654321012"
      };

      const secondDir = directors[1] || primaryDir;

      const fullReviewMerchant: MerchantReviewItem = {
        id: newMid,
        name: primaryDir.name,
        username: (primaryDir.name || "merchant").toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15),
        adminName: "partner_admin",
        mobileNumber: businessInfo.businessRegisteredMobile || primaryDir.mobileNumber,
        status: "Pending",
        kycStatus: "PENDING AT Maker",
        agreementStatus: "Pending",
        productType: productInfo.productType || "UPI",
        vpa: vpaInfo.merchantVpa || `${(businessInfo.brandName || "merchant").toLowerCase().replace(/[^a-z0-9]/g, "")}@okisu`,
        merchantId: newMid,
        mcc: businessInfo.mcc || "5411",
        date: new Date().toISOString().slice(0, 10),
        createdDate: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
        businessLegalName: businessInfo.businessLegalName || "New Merchant Enterprise",
        brandName: businessInfo.brandName || "New Store",
        storeName: businessInfo.storeName || businessInfo.brandName || "Main Store",
        businessAddress: businessInfo.registeredAddress || "Registered Office Address",
        pincode: businessInfo.pinCode || "110001",
        state: businessInfo.state || "Delhi",
        district: businessInfo.district || "New Delhi",
        city: businessInfo.city || "New Delhi",
        onboardingType: onboardingType || "Offline",
        businessEntityType: entityType,
        establishmentYear: businessInfo.establishmentYear || "2024",
        businessRegisteredMobile: businessInfo.businessRegisteredMobile || primaryDir.mobileNumber,
        businessRegisteredEmail: businessInfo.businessRegisteredEmail || primaryDir.emailId,
        businessPan: businessInfo.businessPan || "ABCDE1234F",
        businessRegNumber: businessInfo.cin || "U72900DL2024PTC123456",
        cin: businessInfo.cin,
        turnoverYear: businessInfo.turnoverFinancialYear || "2024-2025",
        turnoverAmount: businessInfo.turnoverAmount || "₹ 1,50,00,000",
        gstin: businessInfo.gstin || "07ABCDE1234F1Z5",
        natureOfBusiness: businessInfo.natureOfBusiness || "Retail",
        longitude: "77.2090",
        latitude: "28.6139",
        merchantWebsiteUrl: businessInfo.merchantWebsiteUrl || `www.${(businessInfo.brandName || "merchant").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        merchantSystemIp: "192.168.1.100",
        directors: directors.map((d, i) => ({ ...d, id: i + 1 })),
        director1: primaryDir,
        director2: secondDir,
        productInfo: {
          productType: productInfo.productType,
          dailyMaxAmountUsage: productInfo.dailyUsageLimit || "200000",
          minPerTransactionLimit: productInfo.minPerTxn || "1",
          maxPerTransactionLimit: productInfo.maxPerTxn || "50000",
          creditLimitAmount: productInfo.creditLimitAmount || "10000000"
        },
        bankInfo: {
          verified: isBeneVerified || true,
          accountType: bankInfo.accountType || "Current Account",
          beneficiaryName: bankInfo.beneficiaryName || businessInfo.businessLegalName || primaryDir.name,
          bankAccountNumber: bankInfo.bankAccountNumber || "918273645012",
          ifscCode: bankInfo.ifscCode || "HDFC0000123",
          bankName: bankInfo.bankName || "HDFC Bank",
          branchName: bankInfo.branchName || "Main Branch",
          pincode: bankInfo.bankPinCode || businessInfo.pinCode,
          state: bankInfo.state || businessInfo.state,
          city: bankInfo.city || businessInfo.city
        },
        createVpa: vpaInfo.merchantVpa || `${(businessInfo.brandName || "merchant").toLowerCase().replace(/[^a-z0-9]/g, "")}@okisu`,
        mappedPlan: "Sample Plan",
        kycSelects,
        uploadedFiles,
        additionalDocs
      };

      // Store in persistent review store
      addStoredMerchant(fullReviewMerchant);

      if (onSubmitSuccess) {
        onSubmitSuccess(fullReviewMerchant);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onBack();
    }
  };

  const stepsList = [
    { num: 1, title: "Onboarding Type" },
    { num: 2, title: "Business Entity Type" },
    { num: 3, title: "Business Information" },
    { num: 4, title: "Personal Information" },
    { num: 5, title: "Product Information" },
    { num: 6, title: "Bank Information" },
    { num: 7, title: "Create Vpa" },
    { num: 8, title: "Kyc Documents" }
  ];

  const onboardingOptions = [
    {
      value: "Offline",
      title: "Offline",
      desc: "Physical documents collection and assisted field verification"
    },
    {
      value: "Online",
      title: "Online",
      desc: "Digital KYC, paperless document upload and online verification"
    }
  ];

  const entityOptions = [
    {
      value: "Company (Pvt/Public/OPC)",
      fullForm: "(Private Limited / Public Limited / One Person Company)"
    },
    {
      value: "Partnership/LLP",
      fullForm: "(Limited Liability Partnership)"
    },
    {
      value: "Trust and Societies",
      fullForm: ""
    },
    {
      value: "HUF",
      fullForm: "(Hindu Undivided Family)"
    },
    {
      value: "Sole Proprietorship",
      fullForm: ""
    },
    {
      value: "NGO",
      fullForm: "(Non-Governmental Organization)"
    }
  ];

  if (isSubmitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-2xl mx-auto my-12 text-center shadow-xs">
        <div className="w-16 h-16 bg-[#EBF4E9] text-[#447837] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Merchant Application Submitted!</h2>
        <p className="text-sm text-gray-600 mb-6">
          The merchant application has been successfully submitted for review and verification.
        </p>
        <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 mb-8 text-left">
          <div className="text-xs text-gray-500 font-semibold uppercase">Generated Merchant ID</div>
          <div className="text-lg font-mono font-bold text-[#447837]">{submittedMid}</div>
          <div className="text-xs text-gray-600 mt-1">Status: Pending Maker/Checker Review</div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (onViewInReview) {
                onViewInReview(submittedMid);
              } else {
                onBack();
              }
            }}
            className="px-6 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            View in Merchant Review
          </button>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
            }}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            Create Another Merchant
          </button>
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{showToast}</span>
        </div>
      )}

      {/* HEADER SECTION WITH BACK BUTTON & PROGRESS LINE */}
      <div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-gray-100 transition cursor-pointer text-gray-800"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Create Merchant</h1>
        </div>

        {/* Small Yellow Accent Progress Bar (Matches Screenshot) */}
        <div className="flex items-center space-x-1 mt-2.5 ml-8">
          <div className="w-10 h-[3.5px] bg-[#EAB308] rounded-full"></div>
          <div className="w-2.5 h-[3.5px] bg-[#EAB308] rounded-full"></div>
          <div className="w-2 h-[3.5px] bg-[#EAB308] rounded-full"></div>
          <div className="w-1.5 h-[3.5px] bg-[#84CC16] rounded-full"></div>
        </div>
      </div>

      {/* 8-STEP HORIZONTAL STEPPER (Matches Screenshot) */}
      <div className="overflow-x-auto py-2">
        <div className="flex items-center justify-between min-w-[1080px] px-2 py-1">
          {stepsList.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                {/* Step Item Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition cursor-pointer text-left ${
                    isCurrent
                      ? "bg-gray-100/90 shadow-2xs border border-gray-200/80"
                      : "hover:bg-gray-50/80"
                  }`}
                >
                  {/* Step Circle Indicator */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition ${
                      isCompleted
                        ? "bg-[#335384] text-white"
                        : isCurrent
                        ? "bg-[#335384] text-white ring-2 ring-[#335384]/20"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {isCompleted ? (
                      <Edit3 className="w-3.5 h-3.5" />
                    ) : (
                      <span>{step.num}</span>
                    )}
                  </div>

                  {/* Step Title Label */}
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      isCurrent
                        ? "text-gray-950 font-bold"
                        : isCompleted
                        ? "text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>

                {/* Connecting Line between steps */}
                {idx < stepsList.length - 1 && (
                  <div className="flex-1 h-[1.5px] bg-gray-200 mx-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN STEP FORM CONTAINER */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-7 shadow-xs">
        {/* ========================================================================= */}
        {/* STEP 1: ONBOARDING TYPE                                                   */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">Onboarding Type</h2>

            <div className="space-y-3.5 pt-1">
              {onboardingOptions.map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => setOnboardingType(opt.value)}
                  className="flex items-center space-x-3 cursor-pointer group select-none"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="onboardingType"
                      checked={onboardingType === opt.value}
                      onChange={() => setOnboardingType(opt.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                        onboardingType === opt.value
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-gray-400 group-hover:border-gray-600"
                      }`}
                    >
                      {onboardingType === opt.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      onboardingType === opt.value ? "text-gray-900 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {opt.title}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    ({opt.desc})
                  </span>
                </label>
              ))}
            </div>

            {/* Step 1 Footer Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="px-8 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save &amp; Proceed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: BUSINESS ENTITY TYPE                                              */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">Business Entity Type</h2>

            <div className="space-y-3.5 pt-1">
              {entityOptions.map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => setEntityType(opt.value)}
                  className="flex items-center space-x-3 cursor-pointer group select-none"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="businessEntityType"
                      checked={entityType === opt.value}
                      onChange={() => setEntityType(opt.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                        entityType === opt.value
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-gray-400 group-hover:border-gray-600"
                      }`}
                    >
                      {entityType === opt.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      entityType === opt.value ? "text-gray-900 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {opt.value}
                    {opt.fullForm && (
                      <span className="text-gray-500 font-normal ml-1.5">
                        {opt.fullForm}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {/* Step 2 Footer Action Buttons */}
            <div className="flex items-center justify-between space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="w-44 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
              >
                Back
              </button>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="px-8 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  Save &amp; Proceed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: BUSINESS INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">Business Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 pt-1">
              {/* Row 1 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Business Legal Name<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Business Legal Name"
                  value={businessInfo.businessLegalName}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, businessLegalName: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Brand Name<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Brand Name"
                  value={businessInfo.brandName}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, brandName: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Store Name<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Store Name"
                  value={businessInfo.storeName}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, storeName: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              {/* Row 2 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Registered Address<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Registered Address"
                  value={businessInfo.registeredAddress}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, registeredAddress: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  PIN Code<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter PIN Code"
                  value={businessInfo.pinCode}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, pinCode: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  State<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter State"
                  value={businessInfo.state}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, state: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  District<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter District"
                  value={businessInfo.district}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, district: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  City<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  value={businessInfo.city}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, city: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Establishment Year
                </label>
                <select
                  value={businessInfo.establishmentYear}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, establishmentYear: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                >
                  <option value="">Select Establishment Year</option>
                  {Array.from({ length: 35 }, (_, i) => 2026 - i).map((yr) => (
                    <option key={yr} value={yr.toString()}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Business Registered Mobile Number<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter Business Registered Mobile Number"
                  value={businessInfo.businessRegisteredMobile}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      businessRegisteredMobile: e.target.value.replace(/\D/g, "").slice(0, 10)
                    })
                  }
                  className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                    businessErrors.businessRegisteredMobile ||
                    (businessValidationAttempted && !businessInfo.businessRegisteredMobile.trim())
                      ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                      : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                  }`}
                />
                {businessValidationAttempted && !businessInfo.businessRegisteredMobile.trim() && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    Business Registered Mobile is required
                  </p>
                )}
                {businessErrors.businessRegisteredMobile && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{businessErrors.businessRegisteredMobile}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Business Registered Email<span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Business Registered Email"
                  value={businessInfo.businessRegisteredEmail}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, businessRegisteredEmail: e.target.value })
                  }
                  className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                    businessErrors.businessRegisteredEmail ||
                    (businessValidationAttempted && !businessInfo.businessRegisteredEmail.trim())
                      ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                      : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                  }`}
                />
                {businessValidationAttempted && !businessInfo.businessRegisteredEmail.trim() && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    Business Registered Email is required
                  </p>
                )}
                {businessErrors.businessRegisteredEmail && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{businessErrors.businessRegisteredEmail}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Business PAN<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter Business PAN"
                  value={businessInfo.businessPan}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, businessPan: e.target.value.toUpperCase() })
                  }
                  className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                    businessErrors.businessPan ||
                    (businessValidationAttempted && !businessInfo.businessPan.trim())
                      ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                      : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                  }`}
                />
                {businessValidationAttempted && !businessInfo.businessPan.trim() && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    Business PAN is required
                  </p>
                )}
                {businessErrors.businessPan && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{businessErrors.businessPan}</span>
                  </p>
                )}
              </div>

              {/* Row 5 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Business Registration Number(CIN)<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  maxLength={21}
                  placeholder="U12345XX2020PTC123456"
                  value={businessInfo.cin}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      cin: e.target.value.toUpperCase()
                    })
                  }
                  className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                    businessErrors.cin ||
                    (businessValidationAttempted && !businessInfo.cin.trim())
                      ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                      : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                  }`}
                />
                {businessValidationAttempted && !businessInfo.cin.trim() && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    Business Registration Number(CIN) is required
                  </p>
                )}
                {businessErrors.cin && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{businessErrors.cin}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Turnover Financial Year<span className="text-rose-600">*</span>
                </label>
                <select
                  value={businessInfo.turnoverFinancialYear}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, turnoverFinancialYear: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                >
                  <option value="">Select Turnover Financial Year</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2021-2022">2021-2022</option>
                </select>
              </div>

              {/* Row 6 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Turnover Amount<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Turnover Amount"
                  value={businessInfo.turnoverAmount}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, turnoverAmount: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  GSTIN<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="Enter GSTIN"
                  value={businessInfo.gstin}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, gstin: e.target.value.toUpperCase() })
                  }
                  className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                    businessErrors.gstin ||
                    (businessValidationAttempted && !businessInfo.gstin.trim())
                      ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                      : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                  }`}
                />
                {businessValidationAttempted && !businessInfo.gstin.trim() && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">GSTIN is required</p>
                )}
                {businessErrors.gstin && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{businessErrors.gstin}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nature of Business<span className="text-rose-600">*</span>
                </label>
                <select
                  value={businessInfo.natureOfBusiness}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, natureOfBusiness: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                >
                  <option value="">Select Nature of Business</option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Services">Services</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Food & Hospitality">Food &amp; Hospitality</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  MCC<span className="text-rose-600">*</span>
                </label>
                <select
                  value={businessInfo.mcc}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, mcc: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                >
                  <option value="">Select MCC</option>
                  <option value="5411">5411 - Grocery Stores &amp; Supermarkets</option>
                  <option value="5812">5812 - Restaurants &amp; Eating Places</option>
                  <option value="5912">5912 - Drug Stores &amp; Pharmacies</option>
                  <option value="5399">5399 - Misc General Merchandise</option>
                  <option value="6012">6012 - Financial Institutions (Cashpoint)</option>
                  <option value="5999">5999 - Miscellaneous Retail</option>
                  <option value="5732">5732 - Electronic Sales</option>
                </select>
              </div>

              {/* Row 7 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Merchant Website URL<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Merchant Website URL"
                  value={businessInfo.merchantWebsiteUrl}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, merchantWebsiteUrl: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>
            </div>

            {/* Step 3 Footer */}
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="w-44 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-44 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-44 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save &amp; Proceed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PERSONAL INFORMATION (DIRECTORS INFORMATION)                      */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Directors Information
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Provide DIN (Director Identification Number) and details for each director (Director 1 mandatory, up to 5 allowed).
              </p>
            </div>

            {/* Directors Cards List */}
            <div className="space-y-6">
              {directors.map((dir, idx) => {
                const isDirector1 = idx === 0;
                const isCompulsory = isDirector1;

                return (
                  <div
                    key={dir.id || idx}
                    className={`rounded-xl border transition-all ${
                      isCompulsory
                        ? "bg-white border-gray-300/90 shadow-2xs"
                        : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                    } p-5`}
                  >
                    {/* Director Card Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-200/80">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-[#335384] text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">
                          Director {idx + 1} Details
                        </h4>
                        {isCompulsory ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Mandatory *
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#447837] border border-emerald-200">
                            Optional
                          </span>
                        )}
                      </div>

                        {/* Top-right card actions */}
                        <div className="flex items-center space-x-2">
                          {!isCompulsory && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDirector(idx)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                              title="Remove this director"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Director</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Director Parameters Grid (3 Columns) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        {/* 1. Name (As per Aadhaar) */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Name(As per Aadhaar){isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Name(As per Aadhaar)"
                            value={dir.name}
                            onChange={(e) => handleUpdateDirector(idx, "name", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.name.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.name.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">Name is required for Director 1</p>
                          )}
                        </div>

                        {/* 2. DIN (Director Identification Number) */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            DIN (Director Identification Number)<span className="text-rose-600">*</span>
                            <span className="text-[#447837] text-[10px] font-semibold ml-1">(8-Digit DIN)</span>
                          </label>
                          <input
                            type="text"
                            maxLength={8}
                            placeholder="Enter 8-digit DIN"
                            value={dir.din || ""}
                            onChange={(e) =>
                              handleUpdateDirector(
                                idx,
                                "din",
                                e.target.value.replace(/\D/g, "").slice(0, 8)
                              )
                            }
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                              directorErrors[`director_${idx}_din`] ||
                              (isCompulsory && director1ValidationAttempted && !dir.din?.trim())
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                                : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.din?.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">
                              DIN number is required for Director 1
                            </p>
                          )}
                          {directorErrors[`director_${idx}_din`] && (
                            <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{directorErrors[`director_${idx}_din`]}</span>
                            </p>
                          )}
                        </div>

                        {/* 3. Address */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Address{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Address"
                            value={dir.address}
                            onChange={(e) => handleUpdateDirector(idx, "address", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.address.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.address.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">Address is required for Director 1</p>
                          )}
                        </div>

                        {/* 4. PIN Code */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            PIN Code{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter PIN Code"
                            value={dir.pinCode}
                            onChange={(e) => handleUpdateDirector(idx, "pinCode", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.pinCode.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.pinCode.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">PIN Code is required for Director 1</p>
                          )}
                        </div>

                        {/* 5. State */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            State{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter State"
                            value={dir.state}
                            onChange={(e) => handleUpdateDirector(idx, "state", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.state.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.state.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">State is required for Director 1</p>
                          )}
                        </div>

                        {/* 6. District */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            District{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter District"
                            value={dir.district}
                            onChange={(e) => handleUpdateDirector(idx, "district", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.district.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.district.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">District is required for Director 1</p>
                          )}
                        </div>

                        {/* 7. City */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            City{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter City"
                            value={dir.city}
                            onChange={(e) => handleUpdateDirector(idx, "city", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.city.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.city.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">City is required for Director 1</p>
                          )}
                        </div>

                        {/* 8. Mobile Number */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Mobile Number{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            maxLength={10}
                            placeholder="Enter Mobile Number"
                            value={dir.mobileNumber}
                            onChange={(e) =>
                              handleUpdateDirector(
                                idx,
                                "mobileNumber",
                                e.target.value.replace(/\D/g, "").slice(0, 10)
                              )
                            }
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                              directorErrors[`director_${idx}_mobile`] ||
                              (isCompulsory && director1ValidationAttempted && !dir.mobileNumber.trim())
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                                : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.mobileNumber.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">
                              Mobile Number is required for Director 1
                            </p>
                          )}
                          {directorErrors[`director_${idx}_mobile`] && (
                            <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{directorErrors[`director_${idx}_mobile`]}</span>
                            </p>
                          )}
                        </div>

                        {/* 9. Email Id */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Email Id{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="email"
                            placeholder="Enter Email Id"
                            value={dir.emailId}
                            onChange={(e) => handleUpdateDirector(idx, "emailId", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                              directorErrors[`director_${idx}_email`] ||
                              (isCompulsory && director1ValidationAttempted && !dir.emailId.trim())
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                                : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.emailId.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">
                              Email Id is required for Director 1
                            </p>
                          )}
                          {directorErrors[`director_${idx}_email`] && (
                            <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{directorErrors[`director_${idx}_email`]}</span>
                            </p>
                          )}
                        </div>

                        {/* 10. PAN */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            PAN{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            maxLength={10}
                            placeholder="Enter PAN"
                            value={dir.pan}
                            onChange={(e) =>
                              handleUpdateDirector(idx, "pan", e.target.value.toUpperCase())
                            }
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none transition shadow-2xs ${
                              directorErrors[`director_${idx}_pan`] ||
                              (isCompulsory && director1ValidationAttempted && !dir.pan.trim())
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10"
                                : "border-gray-300 focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.pan.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">
                              PAN is required for Director 1
                            </p>
                          )}
                          {directorErrors[`director_${idx}_pan`] && (
                            <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{directorErrors[`director_${idx}_pan`]}</span>
                            </p>
                          )}
                        </div>

                        {/* 11. KYC document Type */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            KYC document Type{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <select
                            value={dir.kycDocumentType}
                            onChange={(e) => handleUpdateDirector(idx, "kycDocumentType", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.kycDocumentType.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select KYC document Type</option>
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Voter ID Card">Voter ID Card</option>
                            <option value="Driving License">Driving License</option>
                          </select>
                          {isCompulsory && director1ValidationAttempted && !dir.kycDocumentType.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">KYC Type is required for Director 1</p>
                          )}
                        </div>

                        {/* 12. KYC document Number */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            KYC document Number{isCompulsory && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter KYC document Number"
                            value={dir.kycDocumentNumber}
                            onChange={(e) => handleUpdateDirector(idx, "kycDocumentNumber", e.target.value)}
                            className={`w-full text-xs font-medium px-3.5 py-2.5 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs ${
                              isCompulsory && director1ValidationAttempted && !dir.kycDocumentNumber.trim()
                                ? "border-rose-400 bg-rose-50/20"
                                : "border-gray-300"
                            }`}
                          />
                          {isCompulsory && director1ValidationAttempted && !dir.kycDocumentNumber.trim() && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium">KYC Number is required for Director 1</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Director Button */}
              {directors.length < 5 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddDirector}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#447837] hover:text-[#36602A] hover:bg-[#EBF4E9]/50 border border-[#447837]/40 bg-white transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Director</span>
                  </button>
                </div>
              )}

            {/* Step 4 Footer */}
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="w-44 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-44 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-44 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save &amp; Proceed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: PRODUCT INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">Product Information</h2>

            <div className="max-w-xs pt-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Product Type<span className="text-rose-600">*</span>
              </label>
              <select
                value={productInfo.productType}
                onChange={(e) =>
                  setProductInfo({ ...productInfo, productType: e.target.value })
                }
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
              >
                <option value="UPI">UPI</option>
              </select>
            </div>

            {/* Product Limit Section (Matches Screenshot 4) */}
            <div className="pt-2 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Product Limit</h3>

              <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto shadow-2xs">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    {/* Level 1 Header */}
                    <tr className="border-b border-gray-200 text-gray-600 font-semibold text-[11px] bg-white">
                      <th className="py-2.5 px-4 font-normal text-gray-400"></th>
                      <th className="py-2.5 px-4 font-semibold text-gray-700" colSpan={1}>
                        Maximum Amount Usage
                      </th>
                      <th className="py-2.5 px-4 font-semibold text-gray-700" colSpan={2}>
                        Per Transaction Limit
                      </th>
                      <th className="py-2.5 px-4 font-semibold text-gray-700" colSpan={1}>
                        Credit Limit
                      </th>
                    </tr>

                    {/* Level 2 Sub-Header */}
                    <tr className="border-b border-gray-200 text-gray-600 font-semibold text-[11px] bg-white">
                      <th className="py-2.5 px-4 text-left font-semibold text-gray-800 w-28">Product</th>
                      <th className="py-2.5 px-4 font-semibold text-gray-700">Daily</th>
                      <th className="py-2.5 px-4 font-semibold text-gray-700">Minimum</th>
                      <th className="py-2.5 px-4 font-semibold text-gray-700">Maximum</th>
                      <th className="py-2.5 px-4 font-semibold text-gray-700">Limit Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="py-4 px-4 text-left font-semibold text-gray-900">
                        {productInfo.productType}
                      </td>
                      <td className="py-4 px-3">
                        <input
                          type="text"
                          value={productInfo.dailyUsageLimit}
                          onChange={(e) =>
                            setProductInfo({ ...productInfo, dailyUsageLimit: e.target.value })
                          }
                          className="w-full max-w-[170px] mx-auto text-center px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-[#447837]"
                        />
                      </td>
                      <td className="py-4 px-3">
                        <input
                          type="text"
                          value={productInfo.minPerTxn}
                          onChange={(e) =>
                            setProductInfo({ ...productInfo, minPerTxn: e.target.value })
                          }
                          className="w-full max-w-[170px] mx-auto text-center px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-[#447837]"
                        />
                      </td>
                      <td className="py-4 px-3">
                        <input
                          type="text"
                          value={productInfo.maxPerTxn}
                          onChange={(e) =>
                            setProductInfo({ ...productInfo, maxPerTxn: e.target.value })
                          }
                          className="w-full max-w-[170px] mx-auto text-center px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-[#447837]"
                        />
                      </td>
                      <td className="py-4 px-3">
                        <input
                          type="text"
                          value={productInfo.creditLimitAmount}
                          onChange={(e) =>
                            setProductInfo({ ...productInfo, creditLimitAmount: e.target.value })
                          }
                          className="w-full max-w-[170px] mx-auto text-center px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-[#447837]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 5 Footer */}
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="w-44 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-44 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-44 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save &amp; Proceed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: BANK INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">Bank Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 pt-1">
              {/* Row 1 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Account Type<span className="text-rose-600">*</span>
                </label>
                <select
                  value={bankInfo.accountType}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, accountType: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                >
                  <option value="">Select Account Type</option>
                  <option value="Current">Current</option>
                  <option value="Savings">Savings</option>
                  <option value="Overdraft">Overdraft</option>
                  <option value="Cash Credit">Cash Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Beneficiary Name<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Beneficiary Name"
                  value={bankInfo.beneficiaryName}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, beneficiaryName: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Bank Account Number<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Bank Account Number"
                  value={bankInfo.bankAccountNumber}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              {/* Row 2 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  IFSC Code<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter IFSC Code"
                  value={bankInfo.ifscCode}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, ifscCode: e.target.value.toUpperCase() })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Bank Name<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Bank Name"
                  value={bankInfo.bankName}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bankName: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Branch Name<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Branch Name"
                  value={bankInfo.branchName}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, branchName: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Bank Pin Code<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Bank Pin Code"
                  value={bankInfo.bankPinCode}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bankPinCode: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  State<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter State"
                  value={bankInfo.state}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, state: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  District<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter District"
                  value={bankInfo.district}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, district: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>

              {/* Row 4 */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  City<span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  value={bankInfo.city}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, city: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                />
              </div>
            </div>

            {/* Bene verify Button (Aligned to Right above Footer, per Screenshot 5) */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsBeneVerified(true);
                  triggerToast("Beneficiary Verified Successfully via NPCI Penny-Drop!");
                }}
                className={`px-12 py-2 rounded-lg text-xs font-bold transition shadow-2xs flex items-center space-x-1.5 ${
                  isBeneVerified
                    ? "bg-emerald-600 text-white"
                    : "bg-[#447837] hover:bg-[#36602A] text-white"
                }`}
              >
                {isBeneVerified && <Check className="w-4 h-4" />}
                <span>{isBeneVerified ? "Bene Verified" : "Bene verify"}</span>
              </button>
            </div>

            {/* Step 6 Footer */}
            <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="w-44 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-44 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-44 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save &amp; Proceed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 7: CREATE VPA */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">Create Vpa</h2>

            <div className="max-w-md pt-1 space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Create Merchant VPA<span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Create Merchant VPA"
                value={vpaInfo.merchantVpa}
                onChange={(e) => {
                  setVpaInfo({ ...vpaInfo, merchantVpa: e.target.value });
                  setIsVpaVerified(false);
                }}
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
              />

              {/* Verify Link/Button right underneath (Matches Screenshot 6) */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (vpaInfo.merchantVpa.trim()) {
                      setIsVpaVerified(true);
                      triggerToast(`VPA "${vpaInfo.merchantVpa}" is available!`);
                    } else {
                      triggerToast("Please enter a VPA first");
                    }
                  }}
                  className={`text-xs font-bold hover:underline cursor-pointer transition ${
                    isVpaVerified ? "text-emerald-600 font-bold" : "text-gray-900"
                  }`}
                >
                  {isVpaVerified ? "✓ VPA Verified & Available" : "Verify"}
                </button>
              </div>
            </div>

            {/* Step 7 Footer */}
            <div className="flex items-center justify-center space-x-4 pt-10 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="w-44 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-44 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-44 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save &amp; Proceed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 8: KYC DOCUMENTS */}
        {/* ========================================================================= */}
        {currentStep === 8 && (
          <div className="space-y-8">
            <h2 className="text-base font-bold text-gray-900">Kyc Documents</h2>

            {/* Sub-Section 1: Upload Business Documents */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Upload Business Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Business PAN<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="businessPan"
                    fileName={uploadedFiles["businessPan"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["businessPan"] = el)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Business Address Proof Type<span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={kycSelects.businessAddressProofType}
                    onChange={(e) =>
                      setKycSelects({ ...kycSelects, businessAddressProofType: e.target.value })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                  >
                    <option value="">Select Business Address Proof Type</option>
                    <option value="Electricity Bill">Electricity Bill</option>
                    <option value="Rent Agreement">Rent Agreement</option>
                    <option value="Telephone / Broadband Bill">Telephone / Broadband Bill</option>
                    <option value="Property Tax Receipt">Property Tax Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Business Address Proof<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="businessAddressProof"
                    fileName={uploadedFiles["businessAddressProof"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["businessAddressProof"] = el)}
                  />
                </div>

                {/* Row 2: Certificate of Incorporation, MOA, AOA */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Certificate of Incorporation<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="certificateOfIncorporation"
                    fileName={uploadedFiles["certificateOfIncorporation"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["certificateOfIncorporation"] = el)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Memorandum of Association (MOA)<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="moaDocument"
                    fileName={uploadedFiles["moaDocument"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["moaDocument"] = el)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Signed Attached Copy of AOA (Articles of Association)
                  </label>
                  <UploadField
                    fieldKey="aoaDocument"
                    fileName={uploadedFiles["aoaDocument"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["aoaDocument"] = el)}
                  />
                </div>

                {/* Row 3: MCA Details, Registration Certificate, GST */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    MCA Details (Ministry of Corporate Affairs)
                  </label>
                  <UploadField
                    fieldKey="mcaDetailsDocument"
                    fileName={uploadedFiles["mcaDetailsDocument"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["mcaDetailsDocument"] = el)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Registration Certificate
                  </label>
                  <UploadField
                    fieldKey="registrationCertificate"
                    fileName={uploadedFiles["registrationCertificate"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["registrationCertificate"] = el)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    GST Registration Document<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="gstRegistrationDocument"
                    fileName={uploadedFiles["gstRegistrationDocument"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["gstRegistrationDocument"] = el)}
                  />
                </div>

                {/* Row 4: Licence, Store Images */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Business Licence Document
                  </label>
                  <UploadField
                    fieldKey="businessLicenceDocument"
                    fileName={uploadedFiles["businessLicenceDocument"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["businessLicenceDocument"] = el)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Store Inside Image<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="storeInsideImage"
                    fileName={uploadedFiles["storeInsideImage"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["storeInsideImage"] = el)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Store Outside Image<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="storeOutsideImage"
                    fileName={uploadedFiles["storeOutsideImage"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["storeOutsideImage"] = el)}
                  />
                </div>

                {/* Row 5: Declarations and Board Resolution */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    TA Declaration
                  </label>
                  <UploadField
                    fieldKey="nsdlDeclaration"
                    fileName={uploadedFiles["nsdlDeclaration"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["nsdlDeclaration"] = el)}
                    downloadAction={() => handleDownloadTemplate("TA Declaration")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    TA MA Declaration<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="nsdlMaDeclaration"
                    fileName={uploadedFiles["nsdlMaDeclaration"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["nsdlMaDeclaration"] = el)}
                    downloadAction={() => handleDownloadTemplate("TA MA Declaration")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Board Resolution
                  </label>
                  <UploadField
                    fieldKey="boardResolution"
                    fileName={uploadedFiles["boardResolution"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["boardResolution"] = el)}
                    downloadAction={() => handleDownloadTemplate("Board Resolution")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Turnover Declaration Document
                  </label>
                  <UploadField
                    fieldKey="turnoverDeclarationDocument"
                    fileName={uploadedFiles["turnoverDeclarationDocument"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["turnoverDeclarationDocument"] = el)}
                    downloadAction={() => handleDownloadTemplate("Turnover Declaration")}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Download official declaration template, sign and upload</p>
                </div>

                {/* SBO/UBO Declaration Form - No border, standard format and alignment like other parameters */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    SBO/UBO Declaration Form (Significant / Ultimate Beneficial Owner)<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="sboUboDeclarationForm"
                    fileName={uploadedFiles["sboUboDeclarationForm"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["sboUboDeclarationForm"] = el)}
                    downloadAction={() => handleDownloadTemplate("SBO/UBO Declaration Form")}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Download template, sign and upload</p>
                </div>

                {/* Row 6: ITR filing and Acknowledgement */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Have you filed your Income Tax Return (ITR) ?<span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={kycSelects.haveFiledItr}
                    onChange={(e) =>
                      setKycSelects({ ...kycSelects, haveFiledItr: e.target.value })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                  >
                    <option value="">Select Have you filed your Income Tax Return (ITR) ?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Reason for Not Filing ITR ?<span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Reason for Not Filing ITR ?"
                    value={kycSelects.reasonForNotFilingItr}
                    onChange={(e) =>
                      setKycSelects({ ...kycSelects, reasonForNotFilingItr: e.target.value })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Upload ITR Acknowledgement Form for last Financial Year<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="itrAckForm"
                    fileName={uploadedFiles["itrAckForm"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["itrAckForm"] = el)}
                  />
                </div>

                {/* Additional Document parameters in standard parameter format */}
                {additionalDocs.map((doc, idx) => (
                  <div key={doc.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Additional Document{additionalDocs.length > 1 ? ` ${idx + 1}` : ""}
                      </label>
                      {additionalDocs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalDoc(doc.id, doc.key)}
                          className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-1.5 py-0.5 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <UploadField
                      fieldKey={doc.key}
                      fileName={uploadedFiles[doc.key]}
                      onUpload={handleFileUpload}
                      inputRef={(el) => (fileInputRefs.current[doc.key] = el)}
                    />
                  </div>
                ))}
              </div>

              {/* Add Document Button (styled like Add Director button format per user design) */}
              {additionalDocs.length < 5 && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleAddAdditionalDoc}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#447837] hover:text-[#36602A] hover:bg-[#EBF4E9]/50 border border-[#447837]/40 bg-white transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Document</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sub-Section 2: Person Documents (Person 1 + other 4 directors options) */}
            <div className="space-y-6 pt-2">
              {directors.map((dir, idx) => {
                const isPrimary = idx === 0;
                const personNumber = idx + 1;
                const panKey = isPrimary ? "individualPanCard" : `individualPanCard_${personNumber}`;
                const kycFrontKey = isPrimary ? "kycDocFrontPage" : `kycDocFrontPage_${personNumber}`;
                const kycBackKey = isPrimary ? "kycDocBackPage" : `kycDocBackPage_${personNumber}`;
                const addressTypeKey = isPrimary ? "individualAddressProofType" : `individualAddressProofType_${personNumber}`;
                const utilityBillTypeKey = isPrimary ? "utilityBillType" : `utilityBillType_${personNumber}`;
                const addressProofKey = isPrimary ? "individualAddressProof" : `individualAddressProof_${personNumber}`;
                const photoKey = isPrimary ? "individualPhoto" : `individualPhoto_${personNumber}`;

                return (
                  <div
                    key={dir.id || idx}
                    className="space-y-4 pt-3 border-t border-gray-200/80 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-gray-900">
                          Person {personNumber} Documents
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isPrimary
                              ? "bg-emerald-50 text-[#447837] border border-emerald-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {isPrimary
                            ? "Director 1 (Mandatory)"
                            : `Director ${personNumber} (Optional)`}
                        </span>
                        {dir.name && (
                          <span className="text-xs text-gray-500 font-medium">
                            • {dir.name}
                          </span>
                        )}
                      </div>

                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDirector(idx)}
                          className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Director</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                      {/* Row 1 */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Individual PAN Card{isPrimary && <span className="text-rose-600">*</span>}
                        </label>
                        <UploadField
                          fieldKey={panKey}
                          fileName={uploadedFiles[panKey]}
                          onUpload={handleFileUpload}
                          inputRef={(el) => (fileInputRefs.current[panKey] = el)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Kyc Document Front Page{isPrimary && <span className="text-rose-600">*</span>}
                        </label>
                        <UploadField
                          fieldKey={kycFrontKey}
                          fileName={uploadedFiles[kycFrontKey]}
                          onUpload={handleFileUpload}
                          inputRef={(el) => (fileInputRefs.current[kycFrontKey] = el)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Kyc Document Back Page{isPrimary && <span className="text-rose-600">*</span>}
                        </label>
                        <UploadField
                          fieldKey={kycBackKey}
                          fileName={uploadedFiles[kycBackKey]}
                          onUpload={handleFileUpload}
                          inputRef={(el) => (fileInputRefs.current[kycBackKey] = el)}
                        />
                      </div>

                      {/* Row 2 */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Individual Address Type{isPrimary && <span className="text-rose-600">*</span>}
                        </label>
                        <select
                          value={kycSelects[addressTypeKey] || ""}
                          onChange={(e) =>
                            setKycSelects({ ...kycSelects, [addressTypeKey]: e.target.value })
                          }
                          className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                        >
                          <option value="">Select Address Proof Type</option>
                          <option value="Utility Bill">Utility Bill</option>
                          <option value="Passport (with Address page and Valid Expiry Date)">Passport (with Address page and Valid Expiry Date)</option>
                          <option value="Bank Statement (< 3 Months)">Bank Statement (&lt; 3 Months)</option>
                        </select>
                      </div>

                      {/* Conditional Utility Bill Type Dropdown (Screenshots 2 & 3) */}
                      {kycSelects[addressTypeKey] === "Utility Bill" && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Utility Bill Type{isPrimary && <span className="text-rose-600">*</span>}
                          </label>
                          <select
                            value={kycSelects[utilityBillTypeKey] || ""}
                            onChange={(e) =>
                              setKycSelects({ ...kycSelects, [utilityBillTypeKey]: e.target.value })
                            }
                            className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                          >
                            <option value="">Select Utility Bill Type</option>
                            <option value="Telephone">Telephone</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Gas (not older than 3 months)">Gas (not older than 3 months)</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Individual Address Proof{isPrimary && <span className="text-rose-600">*</span>}
                        </label>
                        <UploadField
                          fieldKey={addressProofKey}
                          fileName={uploadedFiles[addressProofKey]}
                          onUpload={handleFileUpload}
                          inputRef={(el) => (fileInputRefs.current[addressProofKey] = el)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Individual Photo{isPrimary && <span className="text-rose-600">*</span>}
                        </label>
                        <UploadField
                          fieldKey={photoKey}
                          fileName={uploadedFiles[photoKey]}
                          onUpload={handleFileUpload}
                          inputRef={(el) => (fileInputRefs.current[photoKey] = el)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Director Documents Button (per user request) */}
              {directors.length < 5 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddDirector}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#447837] hover:text-[#36602A] hover:bg-[#EBF4E9]/50 border border-[#447837]/40 bg-white transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Director Documents</span>
                  </button>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Click to add documents for other directors (up to 4 other directors, Person 2 to Person 5).
                  </p>
                </div>
              )}
            </div>

            {/* Sub-Section 3: Bank Documents */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-900">Bank Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Bank Account Proof Type<span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={kycSelects.bankAccountProofType}
                    onChange={(e) =>
                      setKycSelects({ ...kycSelects, bankAccountProofType: e.target.value })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] transition shadow-2xs"
                  >
                    <option value="">Select Bank Account Proof Type</option>
                    <option value="Cancelled Cheque">Cancelled Cheque</option>
                    <option value="Bank Statement">Bank Statement</option>
                    <option value="Passbook Front Page">Passbook Front Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Bank Account Proof<span className="text-rose-600">*</span>
                  </label>
                  <UploadField
                    fieldKey="bankAccountProof"
                    fileName={uploadedFiles["bankAccountProof"]}
                    onUpload={handleFileUpload}
                    inputRef={(el) => (fileInputRefs.current["bankAccountProof"] = el)}
                  />
                </div>
              </div>
            </div>

            {/* Step 8 Footer (Submit Button instead of Save & Proceed) */}
            <div className="flex items-center justify-center space-x-4 pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="w-44 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-44 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-44 py-2.5 bg-[#447837] hover:bg-[#36602A] text-white rounded-lg text-xs font-bold transition shadow-2xs flex items-center justify-center space-x-1.5"
              >
                <span>Submit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for File Upload Field with paperclip & download action (Matches Screenshot)
interface UploadFieldProps {
  fieldKey: string;
  fileName?: string;
  onUpload: (key: string, e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  downloadAction?: () => void;
}

function UploadField({ fieldKey, fileName, onUpload, inputRef, downloadAction }: UploadFieldProps) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="relative flex items-center">
      <input
        type="file"
        ref={(el) => {
          hiddenInputRef.current = el;
          inputRef(el);
        }}
        onChange={(e) => onUpload(fieldKey, e)}
        className="hidden"
      />
      <div
        onClick={() => hiddenInputRef.current?.click()}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-[#447837] transition cursor-pointer shadow-2xs text-xs"
      >
        <div className="flex items-center space-x-2 truncate">
          <Paperclip className="w-4 h-4 text-gray-500 shrink-0" />
          <span className={`truncate ${fileName ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
            {fileName || "Upload File"}
          </span>
        </div>

        {downloadAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              downloadAction();
            }}
            className="p-0.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded transition ml-2"
            title="Download Template"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
