// Central registry of registered merchant identifiers to enforce strict uniqueness:
// Unique Mobile, PAN, GST number, CIN number, Email Id, and DIN number

const STORAGE_KEY = "ta_onboarded_merchants_registry_v1";

export interface RegisteredEntities {
  mobiles: string[];
  pans: string[];
  gsts: string[];
  cins: string[];
  emails: string[];
  dins: string[];
}

export const INITIAL_REGISTERED_ENTITIES: RegisteredEntities = {
  mobiles: [
    "9876543210",
    "9876543211",
    "9811223344",
    "9861987345",
    "0987654",
    "9823456789",
    "9988776655"
  ],
  pans: [
    "ABCDE1234F",
    "FGHIJ5678K",
    "KLMNO9012P",
    "APPK1234D",
    "FPSPP3433H",
    "BCDEF5678G",
    "CDEFG6789H"
  ],
  gsts: [
    "27ABCDE1234F1Z5",
    "29FGHIJ5678K1Z2",
    "06KLMNO9012P1Z8",
    "19APPK1234D1Z9",
    "21FPSPP3433H1Z4",
    "27AAACT2727Q1ZW"
  ],
  cins: [
    "U72900MH2018PTC312456",
    "U74999KA2019PTC125890",
    "U51909DL2021PTC384521",
    "U65999HR2020PTC089123",
    "L17110MH1973PLC019786"
  ],
  emails: [
    "ravikumar@yopmail.com",
    "arjun.mishra@yopmail.com",
    "rajesh.store@airpay.in",
    "anand.traders@oxymoney.com",
    "contact@khatapay.in",
    "partner_maker@ta.in"
  ],
  dins: [
    "08123456",
    "07654321",
    "09234567",
    "01456789",
    "02345678",
    "03456789"
  ]
};

export function getRegisteredEntities(): RegisteredEntities {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_ENTITIES));
      return INITIAL_REGISTERED_ENTITIES;
    }
    const parsed = JSON.parse(raw);
    return {
      mobiles: Array.from(new Set([...INITIAL_REGISTERED_ENTITIES.mobiles, ...(parsed.mobiles || [])])),
      pans: Array.from(new Set([...INITIAL_REGISTERED_ENTITIES.pans, ...(parsed.pans || [])].map((p: string) => p.toUpperCase()))),
      gsts: Array.from(new Set([...INITIAL_REGISTERED_ENTITIES.gsts, ...(parsed.gsts || [])].map((g: string) => g.toUpperCase()))),
      cins: Array.from(new Set([...INITIAL_REGISTERED_ENTITIES.cins, ...(parsed.cins || [])].map((c: string) => c.toUpperCase()))),
      emails: Array.from(new Set([...INITIAL_REGISTERED_ENTITIES.emails, ...(parsed.emails || [])].map((e: string) => e.toLowerCase()))),
      dins: Array.from(new Set([...INITIAL_REGISTERED_ENTITIES.dins, ...(parsed.dins || [])]))
    };
  } catch {
    return INITIAL_REGISTERED_ENTITIES;
  }
}

export function registerNewMerchantEntities(newRecords: {
  mobiles?: string[];
  pans?: string[];
  gsts?: string[];
  cins?: string[];
  emails?: string[];
  dins?: string[];
}) {
  try {
    const current = getRegisteredEntities();
    const updated: RegisteredEntities = {
      mobiles: Array.from(new Set([...current.mobiles, ...(newRecords.mobiles || []).filter(Boolean)])),
      pans: Array.from(new Set([...current.pans, ...(newRecords.pans || []).filter(Boolean).map(p => p.toUpperCase())])),
      gsts: Array.from(new Set([...current.gsts, ...(newRecords.gsts || []).filter(Boolean).map(g => g.toUpperCase())])),
      cins: Array.from(new Set([...current.cins, ...(newRecords.cins || []).filter(Boolean).map(c => c.toUpperCase())])),
      emails: Array.from(new Set([...current.emails, ...(newRecords.emails || []).filter(Boolean).map(e => e.toLowerCase())])),
      dins: Array.from(new Set([...current.dins, ...(newRecords.dins || []).filter(Boolean)]))
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving to merchant registry:", err);
  }
}
