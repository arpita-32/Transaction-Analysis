import { TransactionAnalyticsIllustration } from "./TransactionAnalyticsIllustration";

interface DashboardViewProps {
  currentRole?: string;
}

export function DashboardView({ currentRole }: DashboardViewProps) {
  return (
    <div className="w-full bg-white flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 py-8 text-center select-none animate-fadeIn">
      {/* Header Title & Subtitle matching TA Green theme */}
      <h1 className="text-3xl sm:text-[36px] font-bold text-[#1F2430] tracking-tight mb-2 font-sans">
        Welcome to TA
      </h1>
      <p className="text-base sm:text-lg text-gray-600 font-medium mb-8 font-sans">
        Banking made easy - Just in a jiffy •
      </p>

      {/* Central Analytics Illustration (matching Image 1) */}
      <div className="w-full max-w-2xl px-2">
        <TransactionAnalyticsIllustration className="w-full max-w-2xl h-auto" />
      </div>
    </div>
  );
}


