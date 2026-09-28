interface NSDLLogoProps {
  className?: string;
}

export function NSDLLogo({ className = "h-9 w-auto" }: NSDLLogoProps) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 380 70"
        className="h-full w-auto max-h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* NSDL stylized ribbon swirl logo mark in rust/amber/orange */}
        <g transform="translate(5, 5)">
          {/* Outer ribbon swoosh 1 */}
          <path
            d="M 28 8 C 16 8 8 18 8 30 C 8 44 20 54 34 54 C 44 54 52 48 55 40 C 51 40 45 42 38 42 C 24 42 18 34 18 28 C 18 20 24 16 32 16 C 40 16 46 21 48 26 L 56 22 C 52 13 41 8 28 8 Z"
            fill="#B93815"
          />
          {/* Inner accent swirl */}
          <path
            d="M 32 22 C 26 22 22 26 22 30 C 22 36 28 40 36 40 C 42 40 47 36 49 31 C 45 32 41 33 36 33 C 31 33 28 31 28 28 C 28 25 30 24 33 24 C 36 24 39 26 40 28 L 47 24 C 44 23 38 22 32 22 Z"
            fill="#D95724"
          />
          {/* Central dynamic dot / curl */}
          <circle cx="34" cy="30" r="4.5" fill="#E06D3B" />
        </g>

        {/* Text: NSDL Payments Bank */}
        <g fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          {/* NSDL */}
          <text
            x="72"
            y="43"
            fontSize="34"
            fontWeight="900"
            fill="#7A0C13"
            letterSpacing="-0.5"
          >
            NSDL
          </text>

          {/* Payments Bank */}
          <text
            x="172"
            y="43"
            fontSize="30"
            fontWeight="700"
            fill="#8B141B"
            letterSpacing="-0.2"
          >
            Payments Bank
          </text>
        </g>
      </svg>
    </div>
  );
}
