interface TALogoProps {
  className?: string;
  showText?: boolean;
  variant?: "full" | "icon";
}

export function TALogo({ className = "h-10 w-auto", showText = true, variant = "full" }: TALogoProps) {
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 140 140"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="circleTopIcon" d="M 22,70 A 48,48 0 1,1 118,70" fill="none" />
          <path id="circleBottomIcon" d="M 118,70 A 48,48 0 0,1 22,70" fill="none" />
        </defs>

        {/* Outer border ring */}
        <circle cx="70" cy="70" r="66" stroke="#447837" strokeWidth="4" />
        <circle cx="70" cy="70" r="41" stroke="#447837" strokeWidth="2" />

        {/* Circular text */}
        <text fill="#447837" fontSize="9" fontWeight="800" letterSpacing="1.2">
          <textPath href="#circleTopIcon" startOffset="50%" textAnchor="middle">
            TRANSACTION ASSURED
          </textPath>
        </text>

        {/* Dots */}
        <circle cx="16" cy="70" r="3.2" fill="#447837" />
        <circle cx="124" cy="70" r="3.2" fill="#447837" />

        <text fill="#447837" fontSize="9" fontWeight="800" letterSpacing="1.2">
          <textPath href="#circleBottomIcon" startOffset="50%" textAnchor="middle">
            PAYMENT SECURED
          </textPath>
        </text>

        {/* Inner solid circle */}
        <circle cx="70" cy="70" r="39" fill="#447837" />

        {/* Stylized TA glyph in white */}
        <g fill="#FFFFFF">
          {/* Top T bar */}
          <path d="M 44 48 L 73 48 L 71 54 L 46 54 Z" />
          {/* Left slanted leg of A / stem of T */}
          <path d="M 64 54 L 52 88 L 60 88 L 68 64 L 71 54 Z" />
          {/* Right leg of A */}
          <path d="M 68 54 L 88 88 L 79 88 L 65 64 Z" />
          {/* A crossbar */}
          <path d="M 57 73 L 79 73 L 77 78 L 59 78 Z" />
        </g>
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 140"
        className="h-full w-auto max-h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="circleTopFull" d="M 22,70 A 48,48 0 1,1 118,70" fill="none" />
          <path id="circleBottomFull" d="M 118,70 A 48,48 0 0,1 22,70" fill="none" />
        </defs>

        {/* Outer border ring */}
        <circle cx="70" cy="70" r="66" stroke="#447837" strokeWidth="4" />
        <circle cx="70" cy="70" r="41" stroke="#447837" strokeWidth="2" />

        {/* Circular text */}
        <text fill="#447837" fontSize="9" fontWeight="800" letterSpacing="1.2" fontFamily="system-ui, -apple-system, sans-serif">
          <textPath href="#circleTopFull" startOffset="50%" textAnchor="middle">
            TRANSACTION ASSURED
          </textPath>
        </text>

        {/* Dots */}
        <circle cx="16" cy="70" r="3.2" fill="#447837" />
        <circle cx="124" cy="70" r="3.2" fill="#447837" />

        <text fill="#447837" fontSize="9" fontWeight="800" letterSpacing="1.2" fontFamily="system-ui, -apple-system, sans-serif">
          <textPath href="#circleBottomFull" startOffset="50%" textAnchor="middle">
            PAYMENT SECURED
          </textPath>
        </text>

        {/* Inner solid circle */}
        <circle cx="70" cy="70" r="39" fill="#447837" />

        {/* Stylized TA glyph in white */}
        <g fill="#FFFFFF">
          {/* Top T bar */}
          <path d="M 44 48 L 73 48 L 71 54 L 46 54 Z" />
          {/* Left slanted leg of A / stem of T */}
          <path d="M 64 54 L 52 88 L 60 88 L 68 64 L 71 54 Z" />
          {/* Right leg of A */}
          <path d="M 68 54 L 88 88 L 79 88 L 65 64 Z" />
          {/* A crossbar */}
          <path d="M 57 73 L 79 73 L 77 78 L 59 78 Z" />
        </g>

        {/* Text */}
        {showText && (
          <g fill="#447837" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="800">
            <text x="155" y="64" fontSize="48" letterSpacing="-0.5" className="tracking-tight">
              TRANSACTION
            </text>
            <text x="155" y="112" fontSize="48" letterSpacing="-0.5" className="tracking-tight">
              ANALYSTS
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
