interface IllustrationProps {
  className?: string;
  onClick?: () => void;
}

export function TransactionAnalyticsIllustration({
  className = "w-full max-w-2xl h-auto",
  onClick,
}: IllustrationProps) {
  return (
    <div
      onClick={onClick}
      className={`relative select-none flex items-center justify-center ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 840 480"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="boardShadowTA" x="-10" y="-5" width="860" height="500" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#1E293B" floodOpacity="0.08" />
          </filter>
          <linearGradient id="screenGradTA" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAF7" />
          </linearGradient>
          <linearGradient id="greenLineGradTA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#447837" />
            <stop offset="100%" stopColor="#2E5324" />
          </linearGradient>
        </defs>

        {/* Faint subtle background decor (analytics wires and geometric circles) */}
        <g stroke="#E6EFE4" strokeWidth="2.5" fill="none" opacity="0.85">
          <circle cx="160" cy="110" r="32" strokeDasharray="6 4" />
          <circle cx="160" cy="110" r="14" />
          <path d="M 160 70 L 160 82 M 160 138 L 160 150 M 120 110 L 132 110 M 188 110 L 200 110" />

          <circle cx="720" cy="120" r="28" />
          <path d="M 720 92 L 720 120 L 740 134" />
          <circle cx="730" cy="240" r="36" strokeDasharray="8 6" />
          <circle cx="730" cy="240" r="16" />
        </g>

        {/* Base ground line */}
        <line x1="80" y1="430" x2="760" y2="430" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

        {/* 1. LEFT SIDE: POTTED PLANT (Matching Screenshot 1) */}
        <g transform="translate(130, 240)">
          {/* Foliage leaves in Transaction Analytics green hues */}
          <path d="M 30 70 C 18 30 4 5 12 -35 C 22 5 32 40 32 70 Z" fill="#447837" />
          <path d="M 32 70 C 38 25 50 -10 44 -50 C 32 -10 24 30 28 70 Z" fill="#2E5324" />
          <path d="M 22 70 C 10 40 -4 15 2 -15 C 10 15 20 45 24 70 Z" fill="#5A9649" />
          <path d="M 38 70 C 48 45 60 20 56 -5 C 46 20 38 45 34 70 Z" fill="#3B6930" />
          <path d="M 26 70 C 28 40 34 15 30 -10 C 24 15 22 40 26 70 Z" fill="#88C076" />

          {/* Plant pot */}
          <polygon points="12,70 48,70 43,150 17,150" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="9" y="66" width="42" height="8" rx="2" fill="#94A3B8" />
          <ellipse cx="30" cy="152" rx="18" ry="4" fill="#0F172A" opacity="0.08" />
        </g>

        {/* 2. CENTER: MAIN ANALYTICS DASHBOARD SCREEN (Matching Screenshot 1) */}
        <g filter="url(#boardShadowTA)">
          {/* Main Board Container */}
          <rect
            x="220"
            y="60"
            width="360"
            height="270"
            rx="12"
            fill="url(#screenGradTA)"
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />

          {/* Board top window bar */}
          <path
            d="M 220 72 C 220 65.5 225.5 60 232 60 L 568 60 C 574.5 60 580 65.5 580 72 L 580 90 L 220 90 Z"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          {/* Window control dots */}
          <circle cx="236" cy="75" r="3.5" fill="#EF4444" />
          <circle cx="248" cy="75" r="3.5" fill="#F59E0B" />
          <circle cx="260" cy="75" r="3.5" fill="#10B981" />

          {/* Left Vertical Rail in TA Green */}
          <rect x="220" y="90" width="30" height="240" fill="#447837" rx="0" />
          <g fill="#FFFFFF" opacity="0.9">
            {/* Nav icons */}
            <rect x="229" y="105" width="12" height="12" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
            <path d="M 229 111 L 241 111 M 235 105 L 235 117" stroke="#FFFFFF" strokeWidth="1" />

            <circle cx="235" cy="135" r="5" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
            <polygon points="235,132 237,135 235,138 233,135" fill="#FFFFFF" />

            <path d="M 231 160 C 231 158 233 156 235 156 C 237 156 239 158 239 160 C 239 163 235 166 235 166 C 235 166 231 163 231 160 Z" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
          </g>

          {/* Top Pill / Metric (Screenshot 1 top left badge) */}
          <rect x="264" y="102" width="58" height="18" rx="4" fill="#F0F6EE" stroke="#C8E2BF" strokeWidth="1" />
          <text x="272" y="114" fill="#447837" fontSize="8" fontWeight="700" fontFamily="sans-serif">
            ₹ 2,54,320
          </text>

          {/* Line Chart Area (Top right of board) */}
          <rect x="332" y="102" width="232" height="66" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="332" y1="124" x2="564" y2="124" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="332" y1="146" x2="564" y2="146" stroke="#F1F5F9" strokeWidth="1" />

          {/* Green primary trendline */}
          <path
            d="M 345 152 Q 375 118 410 135 T 470 114 T 510 130 T 552 110"
            fill="none"
            stroke="url(#greenLineGradTA)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="345" cy="152" r="2.5" fill="#447837" />
          <circle cx="410" cy="135" r="2.5" fill="#447837" />
          <circle cx="470" cy="114" r="2.5" fill="#447837" />
          <circle cx="510" cy="130" r="2.5" fill="#447837" />
          <circle cx="552" cy="110" r="3" fill="#2E5324" />

          {/* Secondary subtle comparison line */}
          <path
            d="M 345 160 Q 380 142 415 150 T 475 138 T 515 145 T 552 135"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Circular donut charts (Middle row) */}
          {/* Donut 1 (Green) */}
          <g transform="translate(295, 202)">
            <circle cx="0" cy="0" r="24" fill="#F8FAF7" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="0" cy="0" r="18" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <circle cx="0" cy="0" r="18" fill="none" stroke="#447837" strokeWidth="8" strokeDasharray="80 113" strokeDashoffset="25" />
            <text x="0" y="4" fill="#2E5324" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              74%
            </text>
          </g>

          {/* Donut 2 (Sage/Neutral) */}
          <g transform="translate(360, 202)">
            <circle cx="0" cy="0" r="24" fill="#F8FAF7" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="0" cy="0" r="18" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <circle cx="0" cy="0" r="18" fill="none" stroke="#64748B" strokeWidth="8" strokeDasharray="50 113" strokeDashoffset="10" />
            <text x="0" y="4" fill="#475569" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              48%
            </text>
          </g>

          {/* Bar Chart (Middle right) */}
          <rect x="405" y="178" width="159" height="50" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <g transform="translate(416, 185)">
            <rect x="0" y="22" width="6" height="18" rx="1" fill="#447837" />
            <rect x="11" y="14" width="6" height="26" rx="1" fill="#94A3B8" />
            <rect x="22" y="8" width="6" height="32" rx="1" fill="#447837" />
            <rect x="33" y="18" width="6" height="22" rx="1" fill="#CBD5E1" />
            <rect x="44" y="6" width="6" height="34" rx="1" fill="#2E5324" />
            <rect x="55" y="12" width="6" height="28" rx="1" fill="#94A3B8" />
            <rect x="66" y="20" width="6" height="20" rx="1" fill="#447837" />
            <rect x="77" y="10" width="6" height="30" rx="1" fill="#2E5324" />
            <rect x="88" y="16" width="6" height="24" rx="1" fill="#CBD5E1" />
            <rect x="99" y="8" width="6" height="32" rx="1" fill="#447837" />
            <rect x="110" y="4" width="6" height="36" rx="1" fill="#2E5324" />
            <rect x="121" y="14" width="6" height="26" rx="1" fill="#94A3B8" />
            <rect x="132" y="8" width="6" height="32" rx="1" fill="#447837" />
          </g>

          {/* Bottom stats row */}
          <g transform="translate(265, 245)">
            {/* Stat 1 */}
            <rect x="0" y="0" width="66" height="42" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <text x="8" y="13" fill="#94A3B8" fontSize="7" fontWeight="600" fontFamily="sans-serif">Daily VPAs</text>
            <text x="8" y="32" fill="#1E293B" fontSize="16" fontWeight="800" fontFamily="sans-serif">30</text>
            <rect x="46" y="16" width="5" height="18" rx="1" fill="#94A3B8" />
            <rect x="53" y="10" width="5" height="24" rx="1" fill="#447837" />

            {/* Stat 2 */}
            <rect x="74" y="0" width="66" height="42" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <text x="82" y="13" fill="#94A3B8" fontSize="7" fontWeight="600" fontFamily="sans-serif">Live Rate</text>
            <text x="82" y="32" fill="#447837" fontSize="16" fontWeight="800" fontFamily="sans-serif">24</text>
            <rect x="120" y="18" width="5" height="16" rx="1" fill="#94A3B8" />
            <rect x="127" y="12" width="5" height="22" rx="1" fill="#447837" />

            {/* Stat 3 */}
            <rect x="148" y="0" width="72" height="42" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <text x="156" y="13" fill="#94A3B8" fontSize="7" fontWeight="600" fontFamily="sans-serif">Direct API</text>
            <text x="156" y="32" fill="#1E293B" fontSize="16" fontWeight="800" fontFamily="sans-serif">50</text>
            <line x1="188" y1="28" x2="212" y2="28" stroke="#447837" strokeWidth="2.5" strokeLinecap="round" />

            {/* Stat 4 */}
            <rect x="228" y="0" width="68" height="42" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <text x="236" y="13" fill="#94A3B8" fontSize="7" fontWeight="600" fontFamily="sans-serif">Success %</text>
            <text x="236" y="32" fill="#2E5324" fontSize="16" fontWeight="800" fontFamily="sans-serif">42</text>
            <circle cx="282" cy="24" r="7" fill="none" stroke="#447837" strokeWidth="2" />
            <path d="M 280 24 L 282 26 L 286 21" stroke="#447837" strokeWidth="1.8" fill="none" />
          </g>
        </g>

        {/* Board Stand / Legs */}
        <g stroke="#94A3B8" strokeWidth="4" strokeLinecap="round">
          <line x1="400" y1="330" x2="400" y2="430" />
          <line x1="360" y1="430" x2="440" y2="430" strokeWidth="5" />
        </g>

        {/* 3. RIGHT SIDE: STANDING MERCHANT PRESENTER (Stebin Ben style - Screenshot 1) */}
        <g transform="translate(605, 175)">
          {/* Shadow under feet */}
          <ellipse cx="40" cy="254" rx="36" ry="6" fill="#0F172A" opacity="0.12" />

          {/* Legs (Dark slate grey trousers) */}
          {/* Left leg */}
          <path d="M 26 128 L 26 244 L 14 246" stroke="#475569" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Right leg */}
          <path d="M 48 128 L 52 244 L 64 246" stroke="#334155" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Shoes */}
          <ellipse cx="14" cy="247" rx="10" ry="5" fill="#1E293B" />
          <ellipse cx="64" cy="247" rx="10" ry="5" fill="#0F172A" />

          {/* Torso (Crisp white shirt) */}
          <path d="M 18 64 L 56 64 L 52 130 L 22 130 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
          {/* Belt */}
          <rect x="20" y="126" width="34" height="6" fill="#1E293B" rx="1" />
          <rect x="34" y="126" width="6" height="6" fill="#F59E0B" rx="1" />

          {/* Tie (Transaction Analytics Green) */}
          <polygon points="37,65 35,115 37,120 39,115 37,65" fill="#447837" />
          <polygon points="35,65 39,65 38,71 36,71" fill="#2E5324" />

          {/* Left Arm holding tablet */}
          <path d="M 20 68 L 2 96 L 14 116" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="14" cy="116" r="4.5" fill="#F8C7B0" />

          {/* Digital Tablet / iPad */}
          <rect x="6" y="104" width="22" height="30" rx="3" fill="#1E293B" />
          <rect x="8" y="106" width="18" height="26" rx="2" fill="#E2E8F0" />
          <rect x="10" y="110" width="14" height="4" rx="1" fill="#447837" />
          <rect x="10" y="116" width="10" height="2" rx="1" fill="#94A3B8" />
          <rect x="10" y="120" width="14" height="2" rx="1" fill="#94A3B8" />

          {/* Right Arm gesturing towards analytics screen */}
          <path d="M 54 68 L 74 88 L -15 84" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Pointing hand */}
          <circle cx="-15" cy="84" r="5" fill="#F8C7B0" />

          {/* Neck */}
          <rect x="32" y="52" width="10" height="13" rx="2" fill="#F8C7B0" />

          {/* Head */}
          <circle cx="37" cy="40" r="16" fill="#F8C7B0" />

          {/* Styled hair (Dark brown/black) */}
          <path d="M 24 38 C 23 24 48 20 50 30 C 51 22 40 18 32 22 C 24 26 23 34 24 38 Z" fill="#1E1612" />
          <path d="M 25 32 C 28 20 48 20 50 32 C 48 25 35 24 25 32 Z" fill="#1E1612" />

          {/* Glasses */}
          <circle cx="32" cy="38" r="4" stroke="#1E293B" strokeWidth="1.4" fill="none" />
          <circle cx="42" cy="38" r="4" stroke="#1E293B" strokeWidth="1.4" fill="none" />
          <line x1="36" y1="38" x2="38" y2="38" stroke="#1E293B" strokeWidth="1.4" />

          {/* Eyes & Eyebrows */}
          <circle cx="32" cy="38" r="1" fill="#1E293B" />
          <circle cx="42" cy="38" r="1" fill="#1E293B" />
          <path d="M 29 33 Q 32 31 35 33" stroke="#1E1612" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 39 33 Q 42 31 45 33" stroke="#1E1612" strokeWidth="1.2" strokeLinecap="round" />

          {/* Smile */}
          <path d="M 34 47 Q 37 51 40 47" stroke="#A84848" strokeWidth="1.6" strokeLinecap="round" fill="none" />

          {/* Stubble / Trimmed beard */}
          <path d="M 26 40 C 26 48 30 55 37 55 C 44 55 48 48 48 40 C 46 44 44 49 40 50 C 37 50 34 50 31 48 C 28 46 26 42 26 40 Z" fill="#1E1612" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
