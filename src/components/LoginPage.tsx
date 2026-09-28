import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TALogo } from "./TALogo";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("taadmin");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center p-4 md:p-8 font-sans select-none">
      <div className="w-full max-w-md bg-white border border-[#D5E3D2] rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <TALogo className="h-12 w-auto mb-5" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
            Welcome Back!
          </h1>
          <p className="text-sm font-semibold text-[#447837] mt-1.5">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5 text-left">
              Username<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-[#F8FAF7] border border-[#D5E3D2] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#447837]/30 focus:border-[#447837] transition"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5 text-left">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#F8FAF7] border border-[#D5E3D2] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#447837]/30 focus:border-[#447837] transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#447837] hover:text-[#36602A] transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-[#447837] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#447837] focus:ring-[#447837] accent-[#447837]"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              className="text-[#447837] font-semibold hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Log in Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#447837] hover:bg-[#36602A] active:bg-[#2D5223] text-white font-bold text-sm py-3 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
