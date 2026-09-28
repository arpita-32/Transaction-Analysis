interface AvatarProps {
  avatarId: string;
  className?: string;
}

export const AVATAR_LIST = [
  { id: "avatar-glasses-beard", label: "Glasses with Trimmed Beard" },
  { id: "avatar-girl-glasses", label: "Girl with Glasses & Braids" },
  { id: "avatar-bald-beard", label: "Bald with Full Beard" },
  { id: "avatar-curly-clean", label: "Curly Hair Clean-Shaven" },
  { id: "avatar-turban-beard", label: "Red Turban with Beard" },
  { id: "avatar-cap-girl", label: "Girl with Backwards Cap" },
];

export function MerchantAvatar({ avatarId, className = "w-full h-full" }: AvatarProps) {
  switch (avatarId) {
    case "avatar-girl-glasses":
      // Matching Screenshot 2 (Girl with glasses, parted brown hair, braids)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#FCECE6" />
          {/* Braids / Hair sides */}
          <path d="M 28 45 C 24 55 24 72 27 82 C 30 84 34 84 33 80 C 31 70 32 58 35 48 Z" fill="#6B4434" />
          <path d="M 72 45 C 76 55 76 72 73 82 C 70 84 66 84 67 80 C 69 70 68 58 65 48 Z" fill="#6B4434" />
          {/* Shoulders */}
          <path d="M 24 94 C 28 78 72 78 76 94 Z" fill="#B34B4B" />
          {/* Neck */}
          <rect x="44" y="65" width="12" height="15" rx="4" fill="#F3C3A8" />
          {/* Face */}
          <path d="M 32 46 C 32 32 68 32 68 46 C 68 64 58 72 50 72 C 42 72 32 64 32 46 Z" fill="#FED8C1" />
          {/* Ears */}
          <circle cx="31" cy="50" r="4.5" fill="#F3C3A8" />
          <circle cx="69" cy="50" r="4.5" fill="#F3C3A8" />
          {/* Hair top parted */}
          <path d="M 30 44 C 30 26 46 22 50 25 C 54 22 70 26 70 44 C 67 36 57 32 50 33 C 43 32 33 36 30 44 Z" fill="#6B4434" />
          {/* Eyes */}
          <ellipse cx="42" cy="48" rx="2.5" ry="3" fill="#2E1B15" />
          <ellipse cx="58" cy="48" rx="2.5" ry="3" fill="#2E1B15" />
          <circle cx="43" cy="47" r="0.8" fill="#FFFFFF" />
          <circle cx="59" cy="47" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 38 43 Q 42 41 46 43" stroke="#4A2D23" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 54 43 Q 58 41 62 43" stroke="#4A2D23" strokeWidth="1.8" strokeLinecap="round" />
          {/* Glasses */}
          <circle cx="42" cy="49" r="7.5" stroke="#2A2421" strokeWidth="1.8" fill="none" />
          <circle cx="58" cy="49" r="7.5" stroke="#2A2421" strokeWidth="1.8" fill="none" />
          <path d="M 49.5 49 L 50.5 49" stroke="#2A2421" strokeWidth="2" strokeLinecap="round" />
          <path d="M 34.5 49 L 31 49" stroke="#2A2421" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 65.5 49 L 69 49" stroke="#2A2421" strokeWidth="1.8" strokeLinecap="round" />
          {/* Nose */}
          <path d="M 50 52 L 50 56 L 48 57" stroke="#E5A686" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Smile */}
          <path d="M 44 61 Q 50 67 56 61" stroke="#A94848" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case "avatar-bald-beard":
      // Avatar 2: Bald / buzz cut with full beard
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#FCEEE8" />
          {/* Shoulders */}
          <path d="M 22 96 C 26 80 74 80 78 96 Z" fill="#2E3A4B" />
          {/* Neck */}
          <rect x="43" y="65" width="14" height="15" rx="3" fill="#E8B093" />
          {/* Head */}
          <path d="M 31 44 C 31 24 69 24 69 44 C 69 66 58 72 50 72 C 42 72 31 66 31 44 Z" fill="#F7C4AB" />
          {/* Ears */}
          <circle cx="30" cy="47" r="4.5" fill="#E8B093" />
          <circle cx="70" cy="47" r="4.5" fill="#E8B093" />
          {/* Eyebrows */}
          <path d="M 37 39 Q 42 36 46 39" stroke="#3A2820" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 54 39 Q 58 36 63 39" stroke="#3A2820" strokeWidth="2.4" strokeLinecap="round" />
          {/* Eyes with smile curve */}
          <path d="M 39 45 Q 43 42 46 45" stroke="#2B1D16" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 54 45 Q 57 42 61 45" stroke="#2B1D16" strokeWidth="2.2" strokeLinecap="round" />
          {/* Nose */}
          <path d="M 50 45 L 50 53 L 47 54" stroke="#D99B7C" strokeWidth="1.8" strokeLinecap="round" />
          {/* Full Beard */}
          <path d="M 32 46 C 32 50 35 76 50 76 C 65 76 68 50 68 46 C 66 55 64 61 58 63 C 55 63 53 58 50 58 C 47 58 45 63 42 63 C 36 61 34 55 32 46 Z" fill="#42291F" />
          {/* Smile inside beard */}
          <path d="M 45 57 Q 50 62 55 57" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case "avatar-curly-clean":
      // Avatar 3: Curly dark hair, clean-shaven
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#FCEFEA" />
          {/* Shoulders */}
          <path d="M 22 96 C 26 80 74 80 78 96 Z" fill="#3B7A57" />
          {/* Neck */}
          <rect x="44" y="65" width="12" height="14" rx="3" fill="#E8B093" />
          {/* Curly hair outline behind */}
          <circle cx="34" cy="30" r="9" fill="#2A1B14" />
          <circle cx="44" cy="24" r="9" fill="#2A1B14" />
          <circle cx="56" cy="24" r="9" fill="#2A1B14" />
          <circle cx="66" cy="30" r="9" fill="#2A1B14" />
          <circle cx="30" cy="40" r="7" fill="#2A1B14" />
          <circle cx="70" cy="40" r="7" fill="#2A1B14" />
          {/* Face */}
          <path d="M 33 45 C 33 30 67 30 67 45 C 67 65 58 71 50 71 C 42 71 33 65 33 45 Z" fill="#F9CBB5" />
          {/* Ears */}
          <circle cx="31" cy="48" r="4.5" fill="#E8B093" />
          <circle cx="69" cy="48" r="4.5" fill="#E8B093" />
          {/* Forehead curls */}
          <path d="M 34 36 C 37 32 43 36 47 33 C 51 30 55 35 59 32 C 63 35 67 33 66 38 C 62 36 57 37 53 38 C 47 37 41 38 34 36 Z" fill="#2A1B14" />
          {/* Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="3" fill="#221812" />
          <ellipse cx="58" cy="47" rx="2.5" ry="3" fill="#221812" />
          <circle cx="43" cy="46" r="0.8" fill="#FFFFFF" />
          <circle cx="59" cy="46" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 38 42 Q 42 39 46 41" stroke="#2A1B14" strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 41 Q 58 39 62 42" stroke="#2A1B14" strokeWidth="2" strokeLinecap="round" />
          {/* Nose */}
          <path d="M 50 47 L 50 54 L 48 55" stroke="#E5A686" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Smile */}
          <path d="M 44 60 Q 50 66 56 60" stroke="#C45A5A" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case "avatar-turban-beard":
      // Avatar 4: Red/maroon turban with full beard
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#FBEFEA" />
          {/* Shoulders */}
          <path d="M 22 96 C 26 80 74 80 78 96 Z" fill="#1C3F30" />
          {/* Turban folds */}
          <ellipse cx="50" cy="34" rx="24" ry="18" fill="#C52B2B" />
          <path d="M 28 35 C 34 22 66 22 72 35 C 68 44 32 44 28 35 Z" fill="#B32020" />
          <path d="M 32 30 C 42 22 58 22 68 30 C 64 36 36 36 32 30 Z" fill="#8F1515" />
          <circle cx="50" cy="20" r="6" fill="#A81D1D" />
          {/* Face */}
          <path d="M 34 44 C 34 38 66 38 66 44 C 66 65 58 72 50 72 C 42 72 34 65 34 44 Z" fill="#EDB699" />
          {/* Ears */}
          <circle cx="32" cy="48" r="4" fill="#DF9F7E" />
          <circle cx="68" cy="48" r="4" fill="#DF9F7E" />
          {/* Eyebrows */}
          <path d="M 39 42 Q 43 39 47 41" stroke="#221812" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 53 41 Q 57 39 61 42" stroke="#221812" strokeWidth="2.2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="43" cy="46" rx="2.5" ry="3" fill="#1F150F" />
          <ellipse cx="57" cy="46" rx="2.5" ry="3" fill="#1F150F" />
          <circle cx="44" cy="45" r="0.8" fill="#FFFFFF" />
          <circle cx="58" cy="45" r="0.8" fill="#FFFFFF" />
          {/* Nose */}
          <path d="M 50 46 L 50 53 L 48 54" stroke="#D18F6E" strokeWidth="1.8" strokeLinecap="round" />
          {/* Beard and Mustache */}
          <path d="M 34 46 C 34 52 38 74 50 74 C 62 74 66 52 66 46 C 64 53 62 60 56 61 C 54 61 52 56 50 56 C 48 56 46 61 44 61 C 38 60 36 53 34 46 Z" fill="#221812" />
          {/* Smile */}
          <path d="M 45 56 Q 50 61 55 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "avatar-cap-girl":
      // Avatar 5: Girl with backwards pink cap & hoop earrings
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#FCEEEA" />
          {/* Shoulders */}
          <path d="M 22 96 C 26 80 74 80 78 96 Z" fill="#4B3A5A" />
          {/* Hair back */}
          <path d="M 28 44 C 24 58 24 74 27 84 C 31 74 34 60 36 48 Z" fill="#42291F" />
          <path d="M 72 44 C 76 58 76 74 73 84 C 69 74 66 60 64 48 Z" fill="#42291F" />
          {/* Neck */}
          <rect x="44" y="65" width="12" height="14" rx="3" fill="#E8B093" />
          {/* Face */}
          <path d="M 33 46 C 33 32 67 32 67 46 C 67 65 58 71 50 71 C 42 71 33 65 33 46 Z" fill="#F9CBB5" />
          {/* Ears with hoop earrings */}
          <circle cx="31" cy="49" r="4.5" fill="#E8B093" />
          <circle cx="69" cy="49" r="4.5" fill="#E8B093" />
          <circle cx="31" cy="54" r="3.5" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
          <circle cx="69" cy="54" r="3.5" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
          {/* Backwards Pink Cap */}
          <path d="M 30 36 C 30 22 70 22 70 36 C 70 39 30 39 30 36 Z" fill="#C95484" />
          {/* Cap strap/snapback */}
          <rect x="42" y="34" width="16" height="5" rx="2.5" fill="#8F3158" />
          <circle cx="50" cy="36.5" r="1.5" fill="#FCEEEA" />
          {/* Hair bangs */}
          <path d="M 32 40 C 37 38 43 40 46 42 C 40 40 35 44 33 46 Z" fill="#42291F" />
          <path d="M 68 40 C 63 38 57 40 54 42 C 60 40 65 44 67 46 Z" fill="#42291F" />
          {/* Eyes */}
          <ellipse cx="42" cy="48" rx="2.5" ry="3" fill="#221812" />
          <ellipse cx="58" cy="48" rx="2.5" ry="3" fill="#221812" />
          <circle cx="43" cy="47" r="0.8" fill="#FFFFFF" />
          <circle cx="59" cy="47" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 38 43 Q 42 41 46 43" stroke="#3A2820" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 54 43 Q 58 41 62 43" stroke="#3A2820" strokeWidth="1.8" strokeLinecap="round" />
          {/* Nose */}
          <path d="M 50 49 L 50 55 L 48 56" stroke="#E5A686" strokeWidth="1.6" strokeLinecap="round" />
          {/* Smile */}
          <path d="M 44 61 Q 50 67 56 61" stroke="#B83A58" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case "avatar-glasses-beard":
    default:
      // Stebin Ben (Default: Dark hair, styled beard, round glasses - matches Screenshot 1)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#FDEFEA" />
          {/* Shoulders with green / dark jacket */}
          <path d="M 22 96 C 26 80 74 80 78 96 Z" fill="#2E5324" />
          {/* Shirt collar */}
          <polygon points="50,78 44,70 56,70" fill="#FFFFFF" />
          {/* Neck */}
          <rect x="44" y="64" width="12" height="12" rx="3" fill="#E8B093" />
          {/* Hair base */}
          <path d="M 28 42 C 28 22 72 22 72 42 C 72 46 28 46 28 42 Z" fill="#221814" />
          {/* Face */}
          <path d="M 32 44 C 32 28 68 28 68 44 C 68 64 58 71 50 71 C 42 71 32 64 32 44 Z" fill="#F8C7B0" />
          {/* Ears */}
          <circle cx="30" cy="48" r="4.5" fill="#E8B093" />
          <circle cx="70" cy="48" r="4.5" fill="#E8B093" />
          {/* Styled hair on top with volume */}
          <path d="M 30 38 C 30 22 46 16 54 18 C 66 18 72 26 71 38 C 67 30 58 26 49 27 C 41 28 34 32 30 38 Z" fill="#221814" />
          {/* Eyebrows */}
          <path d="M 37 41 Q 42 38 46 41" stroke="#221814" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 54 41 Q 58 38 63 41" stroke="#221814" strokeWidth="2.2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="3" fill="#1C1410" />
          <ellipse cx="58" cy="47" rx="2.5" ry="3" fill="#1C1410" />
          <circle cx="43" cy="46" r="0.8" fill="#FFFFFF" />
          <circle cx="59" cy="46" r="0.8" fill="#FFFFFF" />
          {/* Glasses */}
          <circle cx="42" cy="47" r="7.5" stroke="#1F2937" strokeWidth="1.8" fill="none" />
          <circle cx="58" cy="47" r="7.5" stroke="#1F2937" strokeWidth="1.8" fill="none" />
          <path d="M 49.5 47 L 50.5 47" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
          <path d="M 34.5 47 L 30.5 47" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 65.5 47 L 69.5 47" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
          {/* Nose */}
          <path d="M 50 46 L 50 54 L 48 55" stroke="#DF9978" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Trimmed beard & mustache */}
          <path d="M 33 46 C 33 52 36 71 50 71 C 64 71 67 52 67 46 C 65 52 63 58 58 60 C 56 60 54 57 50 57 C 46 57 44 60 42 60 C 37 58 35 52 33 46 Z" fill="#221814" opacity="0.9" />
          {/* Smile */}
          <path d="M 45 59 Q 50 64 55 59" stroke="#E26D6D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
