
import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession, hasActiveSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden border-b border-black/5">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-[#451a21] rounded-full flex items-center justify-center border border-white/20 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="size-7 object-contain"
                />
              </div>

              <h1 className="text-5xl font-serif font-light text-[#451a21] tracking-tight">
                Welcome back, <span className="font-medium">{user?.firstName || "there"}</span>!
              </h1>
            </div>
            <p className="text-lg text-black/60 ml-16 font-light">
              Ready to elevate your technical mastery?
            </p>
          </div>
          <div className="text-right">
            <div className="flex gap-3">
              <button
                onClick={() => {}}
                className="group px-8 py-4 bg-[#d4af37] text-white font-bold text-[10px] tracking-wider uppercase hover:bg-[#451a21] transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <SparklesIcon className="size-5" />
                  <span>Mock Interview</span>
                  <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={onCreateSession}
                disabled={hasActiveSession}
                className={`group px-8 py-4 font-bold text-[10px] tracking-wider uppercase transition-all duration-300 shadow-lg ${
                  hasActiveSession 
                    ? 'bg-black/10 text-black/40 cursor-not-allowed'
                    : 'bg-[#451a21] text-white hover:bg-[#d4af37]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ZapIcon className="size-5" />
                  <span>{hasActiveSession ? 'Session Active' : 'Create Session'}</span>
                  {!hasActiveSession && (
                    <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </button>
            </div>
            {hasActiveSession && (
              <p className="text-sm text-base-content/60 mt-2">
                End your current session to create a new one
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
