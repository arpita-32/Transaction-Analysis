// Storage utility for Merchants Review and Onboarding
import { MerchantReviewItem } from "../components/CheckerMerchantReviewView";

const STORAGE_KEY = "ta_portal_merchants_v3";

export const initialMerchantsData: MerchantReviewItem[] = [
  {
    id: "MCH-001",
    name: "Ayush Khan",
    username: "ayush_k",
    adminName: "admin_isu",
    mobileNumber: "+91 89879 87211",
    status: "Pending",
    kycStatus: "PENDING AT Maker",
    agreementStatus: "Pending",
    productType: "UPI",
    vpa: "rudransh.panigrahi@okisu",
    merchantId: "MID987211",
    mcc: "5411",
    date: "2026-03-15",
    createdDate: "07/03/2025",
    businessLegalName: "Jai Maa Hotel Pvt Ltd",
    brandName: "Maa Hotel",
    storeName: "Maa Hotel Grand",
    businessAddress: "E-12, Infocity, Patia",
    pincode: "751021",
    state: "Odisha",
    district: "Khurdha",
    city: "Bhubaneswar",
    onboardingType: "Offline",
    businessEntityType: "Company (Pvt/Public/OPC)",
    establishmentYear: "2020",
    businessRegisteredMobile: "+91 89879 87211",
    businessRegisteredEmail: "maahotel.corp@gmail.com",
    businessPan: "AABCM9821F",
    businessRegNumber: "U72900OR2020PTC034567",
    cin: "U72900OR2020PTC034567",
    turnoverYear: "2024-2025",
    turnoverAmount: "₹ 9,29,82,220",
    gstin: "21AABCM9821F1Z5",
    natureOfBusiness: "Retail & Hospitality",
    longitude: "85.8245",
    latitude: "20.2961",
    merchantWebsiteUrl: "www.maahotel.com",
    merchantSystemIp: "192.168.1.146",
    directors: [
      {
        id: 1,
        name: "Ayush Khan",
        din: "08472910",
        address: "E-2, Infocity Residential Enclave",
        pincode: "751021",
        state: "Odisha",
        district: "Khurdha",
        city: "Bhubaneswar",
        mobileNumber: "+91 89879 87211",
        emailId: "ayush.khan@maahotel.com",
        pan: "ABCDE1234F",
        kycDocumentType: "Aadhaar Card",
        kycDocumentNumber: "9876 5432 1098"
      },
      {
        id: 2,
        name: "Rudransh Panigrahi",
        din: "09281726",
        address: "Plot 45, Chandrasekharpur",
        pincode: "751024",
        state: "Odisha",
        district: "Khurdha",
        city: "Bhubaneswar",
        mobileNumber: "+91 94370 12876",
        emailId: "rudransh.p@maahotel.com",
        pan: "FGHIJ5678K",
        kycDocumentType: "Passport",
        kycDocumentNumber: "T9821453"
      }
    ],
    director1: {
      name: "Ayush Khan",
      din: "08472910",
      address: "E-2, Infocity Residential Enclave",
      pincode: "751021",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 89879 87211",
      emailId: "ayush.khan@maahotel.com",
      pan: "ABCDE1234F",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "9876 5432 1098"
    },
    director2: {
      name: "Rudransh Panigrahi",
      din: "09281726",
      address: "Plot 45, Chandrasekharpur",
      pincode: "751024",
      state: "Odisha",
      district: "Khurdha",
      city: "Bhubaneswar",
      mobileNumber: "+91 94370 12876",
      emailId: "rudransh.p@maahotel.com",
      pan: "FGHIJ5678K",
      kycDocumentType: "Passport",
      kycDocumentNumber: "T9821453"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "200000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "100000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Current Account",
      beneficiaryName: "Jai Maa Hotel Pvt Ltd",
      bankAccountNumber: "89273897243001",
      ifscCode: "SBIN0002821",
      bankName: "State Bank of India",
      branchName: "Infocity Branch",
      pincode: "751021",
      state: "Odisha",
      city: "Bhubaneswar"
    },
    createVpa: "maahotel.grand@okisu",
    mappedPlan: "Sample Plan"
  },
  {
    id: "MCH-002",
    name: "Krishna Das",
    username: "krish_das",
    adminName: "admin_isu",
    mobileNumber: "+91 98721 72818",
    status: "Approved",
    kycStatus: "APPROVED BY Checker",
    agreementStatus: "Success",
    productType: "UPI",
    vpa: "krishna.retail@okisu",
    merchantId: "MID987212",
    mcc: "5411",
    date: "2026-03-14",
    createdDate: "07/04/2025",
    businessLegalName: "Krishna Retails India",
    brandName: "Krishna Mart",
    storeName: "Krishna Supermarket",
    businessAddress: "Shop 14, Commercial Market, Bada Bazaar",
    pincode: "753009",
    state: "Odisha",
    district: "Cuttack",
    city: "Cuttack",
    onboardingType: "Online",
    businessEntityType: "Sole Proprietorship",
    establishmentYear: "2018",
    businessRegisteredMobile: "+91 98721 72818",
    businessRegisteredEmail: "krishna.das@retail.com",
    businessPan: "BKLPD4921Q",
    businessRegNumber: "OD/CK/2018/9821",
    cin: "OD/CK/2018/9821",
    turnoverYear: "2024-2025",
    turnoverAmount: "₹ 4,50,00,000",
    gstin: "21BKLPD4921Q1Z8",
    natureOfBusiness: "Retail Supermarket",
    longitude: "85.8792",
    latitude: "20.4625",
    merchantWebsiteUrl: "www.krishnamart.in",
    merchantSystemIp: "192.168.1.189",
    directors: [
      {
        id: 1,
        name: "Krishna Das",
        din: "",
        address: "House 28, Choudhury Bazar",
        pincode: "753009",
        state: "Odisha",
        district: "Cuttack",
        city: "Cuttack",
        mobileNumber: "+91 98721 72818",
        emailId: "krishna.das@retail.com",
        pan: "BKLPD4921Q",
        kycDocumentType: "Aadhaar Card",
        kycDocumentNumber: "5412 8921 7731"
      }
    ],
    director1: {
      name: "Krishna Das",
      din: "",
      address: "House 28, Choudhury Bazar",
      pincode: "753009",
      state: "Odisha",
      district: "Cuttack",
      city: "Cuttack",
      mobileNumber: "+91 98721 72818",
      emailId: "krishna.das@retail.com",
      pan: "BKLPD4921Q",
      kycDocumentType: "Aadhaar Card",
      kycDocumentNumber: "5412 8921 7731"
    },
    productInfo: {
      productType: "UPI",
      dailyMaxAmountUsage: "300000",
      minPerTransactionLimit: "1",
      maxPerTransactionLimit: "50000",
      creditLimitAmount: "5000000"
    },
    bankInfo: {
      verified: true,
      accountType: "Current Account",
      beneficiaryName: "Krishna Retails India",
      bankAccountNumber: "918273645012",
      ifscCode: "HDFC0000123",
      bankName: "HDFC Bank",
      branchName: "Bada Bazaar Branch",
      pincode: "753009",
      state: "Odisha",
      city: "Cuttack"
    },
    createVpa: "krishna.retail@okisu",
    mappedPlan: "Retail Starter Plan"
  }
];

export function getStoredMerchants(): MerchantReviewItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("ta_portal_merchants_v2");
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMerchantsData));
      return initialMerchantsData;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Normalize legacy statuses
      const normalized = parsed.map((m: MerchantReviewItem) => {
        let kyc = m.kycStatus;
        if (kyc === "PENDING AT Checker 3") kyc = "PENDING AT Maker";
        else if (kyc === "APPROVED BY Checker 4" || kyc === "APPROVED BY BANK RISK USER") kyc = "APPROVED BY Checker";
        else if (kyc === "PENDING AT Checker 4" || kyc === "PENDING AT BANK RISK USER") kyc = "PENDING AT Checker";
        return { ...m, kycStatus: kyc };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMerchantsData));
    return initialMerchantsData;
  } catch {
    return initialMerchantsData;
  }
}

export function saveStoredMerchants(merchants: MerchantReviewItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merchants));
    window.dispatchEvent(new Event("ta_merchants_updated"));
  } catch (err) {
    console.error("Failed to save merchants", err);
  }
}

export function addStoredMerchant(newMerchant: MerchantReviewItem): void {
  const current = getStoredMerchants();
  // Ensure no duplicate ID
  const filtered = current.filter((m) => m.id !== newMerchant.id && m.merchantId !== newMerchant.merchantId);
  const updated = [newMerchant, ...filtered];
  saveStoredMerchants(updated);
}

export function updateStoredMerchant(updatedMerchant: MerchantReviewItem): void {
  const current = getStoredMerchants();
  const index = current.findIndex((m) => m.id === updatedMerchant.id || m.merchantId === updatedMerchant.merchantId);
  if (index !== -1) {
    current[index] = updatedMerchant;
    saveStoredMerchants([...current]);
  } else {
    saveStoredMerchants([updatedMerchant, ...current]);
  }
}
