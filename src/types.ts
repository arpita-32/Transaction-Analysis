export interface User {
  id: string;
  username: string;
  role: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  outstandingBalance: number;
  planName: string;
  createDate: string;
  makerUsername: string;
  parentUsername: string;
  
  // Extra detailed profile info
  businessType?: string;
  businessLegalName?: string;
  brandName?: string;
  businessPan?: string;
  businessAddress?: string;
  pin?: string;
  city?: string;
  state?: string;
  aadhaarNumber?: string;
  accountType?: string;
  ifscCode?: string;
  bankName?: string;
  bankAccountNumber?: string;
  branchName?: string;
  uatCallbackUrl?: string;
  productionCallbackUrl?: string;
  callbackType?: string;
  callbackUrl?: string;
  ipAddresses?: string[];
  ips?: string;
  onboardingStatus?: string;
  kycStatus?: string;
  vpa?: string;
  payerAccountTypes?: { [key: string]: boolean };
  features?: { [key: string]: boolean };
}

export interface PayerAccountTypeConfig {
  label: string;
  code: string;
  value: string;
  description: string;
}

export const PAYER_ACCOUNT_TYPES: PayerAccountTypeConfig[] = [
  { label: "Savings", code: "00", value: "SAVINGS", description: "Standard savings bank account" },
  { label: "Current", code: "01", value: "CURRENT", description: "Business current account" },
  { label: "Default", code: "02", value: "DEFAULT", description: "Default mapped bank account" },
  { label: "NRE", code: "03", value: "NRE", description: "Non-Resident External account" },
  { label: "NRO", code: "04", value: "NRO", description: "Non-Resident Ordinary account" },
  { label: "Credit Card", code: "05", value: "CREDIT CARD", description: "Credit card linked account" },
  { label: "PPI Wallet", code: "06", value: "PPI WALLET", description: "Prepaid Payment Instrument wallet" },
  { label: "Credit Line", code: "07", value: "CREDIT LINE", description: "Pre-approved credit line" },
  { label: "SOD", code: "08", value: "SOD", description: "Secured Overdraft account" },
  { label: "UOD", code: "09", value: "UOD", description: "Unsecured Overdraft account" },
  { label: "UPI Credit", code: "31", value: "UPI CREDIT", description: "UPI credit rail payment" },
  { label: "Credit on Fixed Deposits", code: "48", value: "CREDIT ON FIXED DEPOSITS", description: "Overdraft against fixed deposits" },
  { label: "Personal Loan", code: "52", value: "PERSONAL LOAN", description: "Personal loan account rail" },
  { label: "Business Loan", code: "53", value: "BUSINESS LOAN", description: "Business loan account rail" }
];

export function getDefaultPayerAccountTypes(role: string): { [key: string]: boolean } {
  const roleUpper = (role || "").toUpperCase();
  const isPartner = roleUpper.includes("PARTNER") || roleUpper.includes("AGGREGATOR");
  
  const defaults: { [key: string]: boolean } = {};
  PAYER_ACCOUNT_TYPES.forEach((type) => {
    if (isPartner) {
      defaults[type.label] = true;
    } else {
      defaults[type.label] = type.label === "Savings" || type.label === "Current";
    }
  });
  return defaults;
}

export interface Transaction {
  id: string;
  previousAmount?: number | string;
  amountTransacted: number | string;
  currentBalance?: number | string;
  createdDate: string;
  updatedDate: string;
  transactionType: string;
  apiTid: string;
  status: string;
  apiComment: string;
  operationPerformed: string;
  referenceNo: string;
  param_b: string;
  partnerName: string;
  param_c: string;
  payerVpa: string;
  payer_vpa?: string;
  payer_psp_app: string;
  payerPspApp?: string;
  merchantName: string;
  payer_ifsc: string;
  payerIfsc?: string;
  accountDetails: string;
  param_a: string;
  payer_name: string;
  payerName?: string;
  payerMobileNumber: string;
  statusCode: string;
  status_code: string;
  status_desc: string;
  payeeVpa: string;
  payee_vpa?: string;
  tid: string;
  mid: string;
  agentId: string;
  latitudeLongitude: string;
  deviceType: string;
  operatingSystem: string;
  otherDeviceDetails: string;
  creditAmount: number;
  debitAmount: number;
  relationalId: string;
  rrn: string;
  adminName: string;
  type: string;
  inUsOfUs?: boolean;
  isOnUs?: boolean;
  is_on_us?: boolean | string;
  username?: string;
  userName?: string;
  retailerUsername?: string;
  retailer_username?: string;
  masterName?: string;
  master_name?: string;
  distributorName?: string;
  distributer_name?: string;
  payerAccountType?: string;
  payer_account_type?: string;
  payerAccountNumber?: string;
  payer_account_number?: string;
  clientReferenceId?: string;
  client_ref_id?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actionPerformed: string;
  forUser: string;
  forUserId: string;
  byUser: string;
  byUserId: string;
  rejectedCase: string;
  fieldModified: string;
  specificValue: string;
  oldValue: string;
  newValue: string;
  
  // Detailed report format fields
  loginTime: string;
  logoutTime: string;
  status: string;
  loginId: string;
  userName: string;
  firstName: string;
  lastName: string;
  activity: string;
  requestingUserName: string;
  updatedBy: string;
  mobileNumber: string;
  email: string;
  updatedTime: string;
  userRole: string;
  statusDescription: string;
  ipAddress: string;
  latLong: string;
}

export interface ServiceItem {
  id: string;
  feature: string;
  subFeature: string;
  merchantCategory: string;
  merchantCategoryCode: string;
  minAmount: number;
  maxAmount: number;
}

export interface PlanItem {
  id: string;
  planName: string;
  assignType: string;
  createdDate: string;
}

export interface SettlementSummaryReportItem {
  id?: string;
  aggregatorId: string;
  aggregatorName: string;
  merchantId: string;
  merchantName: string;
  grossSales: string;
  noOfTxns: number;
  refunds: string;
  noOfRefunds: number;
  chargebacks: string;
  noOfChargebacks: number;
  lienAmount: string;
  noOfLiens: number;
  processingFee: string;
  gstOnFee: string;
  netSettlement: string;
  createdDate?: string;
}

export interface WalletReportItem {
  id: string;
  previousAmount: string;
  amountTransacted: string;
  currentBalance: string;
  operationPerformed: string;
  status: string;
  relationalId: string;
  transactionMode: string;
  createdDate: string;
  updatedDate: string;
  username: string;
  retailerUsername: string;
  retailerUserId: string;
  distributorName: string;
  masterName: string;
  adminName: string;
  apiUser: string;
  apiTid: string;
  apiComment: string;
  referenceNo: string;
  type: string;
  gateway: string;
  gatewayName: string;
  valueDate: string;
}

export interface CommissionReportItem {
  id: string;
  previousAmount: string;
  amountTransacted: string;
  balanceAmount: string;
  createdDate: string;
  updatedDate: string;
  transactionType: string;
  relationalId: string;
  status: string;
  relationalOperation: string;
  tds: string;
  statusCode: string;
  relationalAmount: string;
  walletStatusDescription: string;
  invoiceValue: string;
  planName: string;
  gst: string;
  type: string;
  merchantName: string;
  serviceProviderCount: string | number;
  authType: string;
  planType: string;
  taxable: string;
  partnerName: string;
  adminName: string;
  statusDescription: string;
  creditedUser: string;
  walletStatus: string;
}

export interface RefundReportItem {
  upiTransactionDate: string;
  upiTransactionRrn: string;
  upiTransactionBankId: string;
  upiTransactionId: string;
  refundId: string;
  amount: string;
  createdDate: string;
  updatedDate: string;
  status: string;
  statusCode: string;
  remark: string;
  clientReferenceId: string;
  bankRefundId: string;
  transactionType: string;
  refundRequestedSpeed: string;
  refundRrn: string;
  merchantId: string;
  partnerId: string;
  statusDescription: string;
  paramA: string;
  paramB: string;
  paramC: string;
}

export interface CashpointReportItem {
  transactionId: string;
  previousBalance: string;
  transactedAmount: string;
  currentBalance: string;
  createdDate: string;
  updatedDate: string;
  rrn: string;
  transactionType: string;
  status: string;
  statusCode: string;
  statusDescription: string;
  operationPerformed: string;
  clientReferenceId: string;
  payerVpa: string;
  payerAccountNumber: string;
  payerIfsc: string;
  payerName: string;
  payerMobileNumber: string;
  payerPaymentApp: string;
  merchantId: string;
  parentId: string;
  paramA: string;
  paramB: string;
  paramC: string;
}

export interface ChargebackReportItem {
  aggregatorId: string;
  aggregatorName: string;
  adjustmentDate: string;
  adjustmentType: string;
  transactionDate: string;
  transactionTime: string;
  rrn: string;
  amount: string;
  merchantCode: string;
  paPgName: string;
  transactionId: string;
  cycle: string;
  transactionUser: string;
  clientReferenceId: string;
}

export interface DirectorInfo {
  id: number;
  name: string;
  din?: string;
  address: string;
  pinCode: string;
  state: string;
  district: string;
  city: string;
  mobileNumber: string;
  emailId: string;
  pan: string;
  kycDocumentType: string;
  kycDocumentNumber: string;
}

export interface PersonDocInfo {
  id: number;
  name: string;
  individualPanCard?: string;
  kycDocFrontPage?: string;
  kycDocBackPage?: string;
  individualAddressProofType: string;
  individualAddressProof?: string;
  individualPhoto?: string;
}

