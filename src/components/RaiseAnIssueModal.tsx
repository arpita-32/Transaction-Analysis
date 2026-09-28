import { useState, FormEvent } from "react";
import { X, Upload, CheckCircle2, Search, ArrowLeft } from "lucide-react";
import { TALogo } from "./TALogo";

interface RaiseAnIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RaiseAnIssueModal({ isOpen, onClose }: RaiseAnIssueModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [productService, setProductService] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingMode, setTrackingMode] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [trackResult, setTrackResult] = useState<{
    id: string;
    status: string;
    date: string;
    product: string;
    desc: string;
  } | null>(null);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `TA-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicketId(generatedId);
    }, 600);
  };

  const handleTrackSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    setTrackResult({
      id: trackingId.toUpperCase(),
      status: "In Progress with Risk & Operations",
      date: new Date().toLocaleDateString("en-IN"),
      product: "UPI & VPA Services",
      desc: "Dispute investigation acknowledged and routed to primary resolution team.",
    });
  };

  const handleResetForm = () => {
    setSubmittedTicketId(null);
    setPhone("");
    setName("");
    setEmail("");
    setRefNumber("");
    setProductService("");
    setIssueDescription("");
    setUploadedFile(null);
    setTrackingMode(false);
    setTrackResult(null);
  };

  return (
    <div className="fixed inset-0 z-[100050] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 flex flex-col md:flex-row relative max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white bg-[#447837] hover:bg-[#36602A] p-1.5 rounded-full shadow-md transition cursor-pointer flex items-center justify-center"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Graphic Illustration with TA Logo matching Image 2 */}
        <div className="md:w-5/12 bg-[#EDF4FB] p-8 flex flex-col justify-between relative overflow-hidden border-r border-blue-50">
          {/* TA Logo Top Left */}
          <div>
            <TALogo className="h-9 w-auto" />
          </div>

          {/* SVG Illustration: Analysts with documents matching Image 2 */}
          <div className="my-auto py-6 flex items-center justify-center">
            <svg viewBox="0 0 400 320" className="w-full h-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background soft cloud / glow */}
              <ellipse cx="200" cy="140" rx="160" ry="110" fill="#E2EDF9" opacity="0.6" />

              {/* Big central document with blue top banner and seal */}
              <rect x="130" y="30" width="140" height="170" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="145" y="45" width="60" height="14" rx="2" fill="#4B6BFB" />
              {/* Document horizontal lines */}
              <line x1="145" y1="75" x2="215" y2="75" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              <line x1="145" y1="90" x2="215" y2="90" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              <line x1="145" y1="105" x2="215" y2="105" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              <line x1="145" y1="120" x2="215" y2="120" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              <line x1="145" y1="135" x2="190" y2="135" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              
              {/* Seal with blue circle and signature */}
              <circle cx="235" cy="160" r="14" stroke="#4B6BFB" strokeWidth="6" fill="#FFFFFF" />
              <path d="M 195 170 Q 215 160 225 170" stroke="#334155" strokeWidth="2" fill="none" />

              {/* Floating papers */}
              <g transform="rotate(-15 70 70)">
                <rect x="60" y="50" width="40" height="50" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="68" y1="62" x2="92" y2="62" stroke="#22C55E" strokeWidth="2" />
                <line x1="68" y1="70" x2="92" y2="70" stroke="#22C55E" strokeWidth="2" />
                <line x1="68" y1="78" x2="84" y2="78" stroke="#22C55E" strokeWidth="2" />
              </g>
              <g transform="rotate(20 100 130)">
                <rect x="90" y="115" width="40" height="50" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="98" y1="127" x2="122" y2="127" stroke="#4B6BFB" strokeWidth="2" />
                <line x1="98" y1="135" x2="122" y2="135" stroke="#4B6BFB" strokeWidth="2" />
              </g>

              {/* Business analysts / team illustration figures */}
              {/* Figure 1 - Left purple woman */}
              <circle cx="50" cy="205" r="10" fill="#2E2A47" />
              <path d="M 40 220 C 40 215 60 215 60 220 L 68 280 L 32 280 Z" fill="#6366F1" />
              <line x1="40" y1="280" x2="40" y2="310" stroke="#1E1B4B" strokeWidth="4" />
              <line x1="58" y1="280" x2="62" y2="310" stroke="#1E1B4B" strokeWidth="4" />

              {/* Figure 2 - Man with beard */}
              <circle cx="95" cy="195" r="11" fill="#1E293B" />
              <path d="M 85 210 L 105 210 L 110 265 L 80 265 Z" fill="#64748B" />
              <line x1="88" y1="265" x2="82" y2="310" stroke="#1E293B" strokeWidth="4" />
              <line x1="102" y1="265" x2="108" y2="310" stroke="#1E293B" strokeWidth="4" />

              {/* Figure 3 - Center man celebrating with tie */}
              <circle cx="150" cy="190" r="11" fill="#1E293B" />
              <path d="M 140 205 L 160 205 L 165 255 L 135 255 Z" fill="#2563EB" />
              <line x1="142" y1="255" x2="135" y2="310" stroke="#1E293B" strokeWidth="4" />
              <line x1="158" y1="255" x2="168" y2="310" stroke="#1E293B" strokeWidth="4" />
              <path d="M 160 205 L 180 180" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

              {/* Center checkmark card handed over */}
              <rect x="180" y="210" width="24" height="24" rx="3" fill="#22C55E" />
              <path d="M 185 222 L 190 227 L 199 217" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Figure 4 - Right professional woman holding check */}
              <circle cx="230" cy="195" r="12" fill="#1E293B" />
              <path d="M 215 210 C 215 205 245 205 245 210 L 255 285 L 205 285 Z" fill="#818CF8" />
              <line x1="220" y1="285" x2="218" y2="310" stroke="#1E1B4B" strokeWidth="4" />
              <line x1="240" y1="285" x2="245" y2="310" stroke="#1E1B4B" strokeWidth="4" />

              {/* Figure 5 - Far right man with clipboard */}
              <circle cx="280" cy="195" r="11" fill="#2563EB" />
              <path d="M 270 210 L 290 210 L 295 260 L 265 260 Z" fill="#93C5FD" />
              <line x1="272" y1="260" x2="270" y2="310" stroke="#1E293B" strokeWidth="4" />
              <line x1="288" y1="260" x2="292" y2="310" stroke="#1E293B" strokeWidth="4" />
            </svg>
          </div>

          {/* Footer assurance */}
          <div className="text-[11px] font-semibold text-gray-500 text-center tracking-wide">
            Transaction Assured • Payment Secured
          </div>
        </div>

        {/* RIGHT COLUMN: Raise an Issue / Track Complaint Form */}
        <div className="md:w-7/12 p-8 overflow-y-auto">
          {!trackingMode ? (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6 font-sans">
                Raise an Issue
              </h2>

              {submittedTicketId ? (
                <div className="py-8 px-4 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Issue Registered Successfully</h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    Your complaint has been logged with Transaction Analysts support desk. Your ticket reference ID is:
                  </p>
                  <div className="inline-block bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg font-mono font-bold text-base text-[#447837]">
                    {submittedTicketId}
                  </div>
                  <div className="pt-4 flex justify-center space-x-3">
                    <button
                      onClick={handleResetForm}
                      className="px-5 py-2 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#36602A] transition"
                    >
                      Raise Another Issue
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#36602A] shadow-xs transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Phone Number & Name row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number *"
                        className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-xs text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name *"
                        className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-xs text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email *"
                      className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-xs text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                    />
                  </div>

                  {/* Reference Number */}
                  <div>
                    <input
                      type="text"
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      placeholder="Reference Number"
                      className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-xs text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                    />
                  </div>

                  {/* Products | Services * */}
                  <div>
                    <select
                      required
                      value={productService}
                      onChange={(e) => setProductService(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] bg-white cursor-pointer"
                    >
                      <option value="">Products | Services *</option>
                      <option value="UPI Payee Services">UPI Payee Services</option>
                      <option value="UPI Payer Services">UPI Payer Services</option>
                      <option value="Chargeback & Disputes">Chargeback & Disputes</option>
                      <option value="Merchant Onboarding">Merchant Onboarding</option>
                      <option value="Wallet & Settlement">Wallet & Settlement</option>
                      <option value="Account & KYC">Account & KYC</option>
                    </select>
                  </div>

                  {/* Upload File */}
                  <div>
                    <input
                      type="file"
                      id="issue-file-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFile(e.target.files[0]);
                        }
                      }}
                    />
                    <label
                      htmlFor="issue-file-upload"
                      className="inline-flex items-center space-x-2 px-4 py-2 border border-blue-400 text-blue-600 rounded text-xs font-semibold hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadedFile ? uploadedFile.name : "Upload File"}</span>
                    </label>
                  </div>

                  {/* Issue Description */}
                  <div>
                    <textarea
                      required
                      rows={4}
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Issue Description *"
                      className="w-full border border-gray-300 rounded p-3 text-xs text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-md shadow-md transition cursor-pointer flex items-center justify-center min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </div>

                  {/* Complaint submitted? Track Your Complaint */}
                  <div className="text-center text-xs text-gray-600 pt-3">
                    Complaint submitted?{" "}
                    <button
                      type="button"
                      onClick={() => setTrackingMode(true)}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Track Your Complaint
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setTrackingMode(false);
                    setTrackResult(null);
                  }}
                  className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Raise Issue</span>
                </button>
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6 font-sans">
                Track Your Complaint
              </h2>

              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Enter Complaint / Ticket Reference Number
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="e.g. TA-849201"
                      className="flex-1 border border-gray-300 rounded px-3.5 py-2.5 text-xs text-gray-900 font-mono uppercase focus:outline-none focus:border-[#447837] focus:ring-1 focus:ring-[#447837]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#447837] text-white rounded text-xs font-bold hover:bg-[#36602A] transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>
                  </div>
                </div>
              </form>

              {trackResult && (
                <div className="mt-6 border border-emerald-200 bg-emerald-50/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-bold text-emerald-900 font-mono">{trackResult.id}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                      {trackResult.status}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p><span className="font-semibold text-gray-900">Service:</span> {trackResult.product}</p>
                    <p><span className="font-semibold text-gray-900">Registered Date:</span> {trackResult.date}</p>
                    <p><span className="font-semibold text-gray-900">Latest Update:</span> {trackResult.desc}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
