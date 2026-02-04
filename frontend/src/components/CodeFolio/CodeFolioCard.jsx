import { X, Download, Share2 } from "lucide-react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";
import { useRef } from "react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

function CodeFolioCard({ isOpen, onClose, user, usernames, stats }) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    console.log("Download button clicked");
    console.log("cardRef.current:", cardRef.current);
    
    if (!cardRef.current) {
      toast.error("Card not ready");
      return;
    }
    
    try {
      toast.loading("Generating image...", { id: "download-card" });
      
      console.log("Starting html2canvas...");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#6366f1',
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
      });
      
      console.log("Canvas created:", canvas);
      
      const dataUrl = canvas.toDataURL("image/png");
      console.log("Data URL created");
      
      const link = document.createElement("a");
      link.download = `codefolio-${user?.username || 'card'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Download triggered");
      toast.success("Card downloaded successfully!", { id: "download-card" });
    } catch (error) {
      console.error("Error downloading card:", error);
      toast.error(`Failed to download: ${error.message}`, { id: "download-card" });
    }
  };

  const handleShare = async () => {
    console.log("Share button clicked");
    console.log("cardRef.current:", cardRef.current);
    
    if (!cardRef.current) {
      toast.error("Card not ready");
      return;
    }
    
    try {
      toast.loading("Preparing to share...", { id: "share-card" });
      
      console.log("Starting html2canvas for share...");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#6366f1',
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
      });
      
      console.log("Canvas created for share");
      
      canvas.toBlob(async (blob) => {
        console.log("Blob created:", blob);
        
        if (!blob) {
          toast.error("Failed to generate image", { id: "share-card" });
          return;
        }

        const file = new File([blob], `codefolio-${user?.username || 'card'}.png`, { type: "image/png" });
        console.log("File created:", file);
        
        // Check if Web Share API is available
        if (navigator.share) {
          console.log("Web Share API available");
          try {
            await navigator.share({
              files: [file],
              title: "My CodeFolio Card",
              text: "Check out my coding stats!",
            });
            toast.success("Shared successfully!", { id: "share-card" });
          } catch (shareError) {
            if (shareError.name === 'AbortError') {
              console.log("User cancelled share");
              toast.dismiss("share-card");
            } else {
              console.error("Share error:", shareError);
              // Try clipboard fallback
              tryClipboard(blob);
            }
          }
        } else {
          console.log("Web Share API not available, using clipboard");
          tryClipboard(blob);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error in share function:", error);
      toast.error(`Failed to share: ${error.message}`, { id: "share-card" });
    }
  };

  const tryClipboard = async (blob) => {
    try {
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      toast.success("Card copied to clipboard!", { id: "share-card" });
    } catch (clipError) {
      console.error("Clipboard error:", clipError);
      toast.error("Unable to copy. Please try download instead.", { id: "share-card" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="max-w-6xl w-full">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        {/* CodeFolio Card - 16:9 Aspect Ratio */}
        <div
          ref={cardRef}
          className="w-full aspect-video rounded-2xl shadow-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(to bottom right, #4f46e5, #9333ea, #ec4899)'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Content Container */}
          <div className="relative h-full p-4 flex flex-col">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <img
                  src={user?.imageUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-3xl font-bold mb-1" style={{ color: '#ffffff' }}>
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    @{user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "user"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-1" style={{ color: '#ffffff' }}>CodeFolio</div>
                <div className="text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Coding Stats Card</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* Left: Quick Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Total Questions */}
                <div className="backdrop-blur-lg rounded-xl p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <div className="text-base mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Total Questions</div>
                  <div className="text-5xl font-bold" style={{ color: '#ffffff' }}>{stats?.totalQuestions || 0}</div>
                </div>

                {/* Active Days */}
                <div className="backdrop-blur-lg rounded-xl p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <div className="text-base mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Active Days</div>
                  <div className="text-5xl font-bold" style={{ color: '#ffffff' }}>{stats?.totalActivedays || 0}</div>
                </div>

                {/* Contests Attended */}
                <div className="backdrop-blur-lg rounded-xl p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <div className="text-base mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Contests</div>
                  <div className="text-5xl font-bold" style={{ color: '#ffffff' }}>
                    {(stats?.leetcodeContests || 0) + (stats?.codeforcesContests || 0)}
                  </div>
                </div>
              </div>

              {/* Right: Difficulty Breakdown */}
              <div className="backdrop-blur-lg rounded-xl p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                <div className="font-bold text-base mb-2" style={{ color: '#ffffff' }}>Question Difficulty</div>
                <div className="space-y-2">
                  {/* Easy */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-medium text-base" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Easy</span>
                      <span className="font-bold text-xl" style={{ color: '#ffffff' }}>{stats?.easy || 0}</span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                      <div 
                        className="h-2.5 rounded-full transition-all duration-500 shadow-lg"
                        style={{ 
                          width: `${Math.min((stats?.easy || 0) / Math.max(stats?.totalQuestions || 1, 1) * 100, 100)}%`,
                          backgroundColor: '#4ade80'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Medium */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-medium text-base" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Medium</span>
                      <span className="font-bold text-xl" style={{ color: '#ffffff' }}>{stats?.medium || 0}</span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                      <div 
                        className="h-2.5 rounded-full transition-all duration-500 shadow-lg"
                        style={{ 
                          width: `${Math.min((stats?.medium || 0) / Math.max(stats?.totalQuestions || 1, 1) * 100, 100)}%`,
                          backgroundColor: '#facc15'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Hard */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-medium text-base" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Hard</span>
                      <span className="font-bold text-xl" style={{ color: '#ffffff' }}>{stats?.hard || 0}</span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                      <div 
                        className="h-2.5 rounded-full transition-all duration-500 shadow-lg"
                        style={{ 
                          width: `${Math.min((stats?.hard || 0) / Math.max(stats?.totalQuestions || 1, 1) * 100, 100)}%`,
                          backgroundColor: '#f87171'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Platform Stats with Graphs */}
            <div className="grid grid-cols-2 gap-4">
              {/* LeetCode */}
              {usernames?.leetcode && (
                <div className="backdrop-blur-lg rounded-xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                      <SiLeetcode className="text-xl" style={{ color: '#ffffff' }} />
                    </div>
                    <span className="font-bold text-lg" style={{ color: '#ffffff' }}>LeetCode</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Rating</span>
                        <span className="font-bold text-base" style={{ color: '#ffffff' }}>{stats?.leetcodeRating || 0}</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((stats?.leetcodeRating || 0) / 3000 * 100, 100)}%`,
                            backgroundColor: '#fb923c'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Problems Solved</span>
                        <span className="font-bold text-base" style={{ color: '#ffffff' }}>{stats?.leetcodeProblems || 0}</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((stats?.leetcodeProblems || 0) / 3000 * 100, 100)}%`,
                            backgroundColor: '#4ade80'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Badges</span>
                        <span className="font-bold text-base" style={{ color: '#ffffff' }}>{stats?.badges?.length || 0}</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((stats?.badges?.length || 0) / 20 * 100, 100)}%`,
                            backgroundColor: '#facc15'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CodeForces */}
              {usernames?.codeforces && (
                <div className="backdrop-blur-lg rounded-xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
                      <SiCodeforces className="text-xl" style={{ color: '#ffffff' }} />
                    </div>
                    <span className="font-bold text-lg" style={{ color: '#ffffff' }}>CodeForces</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Rating</span>
                        <span className="font-bold text-base" style={{ color: '#ffffff' }}>{stats?.codeforcesRating || 0}</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((stats?.codeforcesRating || 0) / 3000 * 100, 100)}%`,
                            backgroundColor: '#60a5fa'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Problems Solved</span>
                        <span className="font-bold text-base" style={{ color: '#ffffff' }}>{stats?.codeforcesProblems || 0}</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((stats?.codeforcesProblems || 0) / 3000 * 100, 100)}%`,
                            backgroundColor: '#4ade80'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Rank</span>
                        <span className="font-bold text-base capitalize" style={{ color: '#ffffff' }}>{stats?.codeforcesRank || 'N/A'}</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: '67%', backgroundColor: '#c084fc' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CodeChef - if exists and only one platform */}
              {usernames?.codechef && (!usernames?.leetcode || !usernames?.codeforces) && (
                <div className="backdrop-blur-lg rounded-xl p-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#92400e' }}>
                      <span className="font-bold text-sm" style={{ color: '#ffffff' }}>CC</span>
                    </div>
                    <span className="font-bold text-lg" style={{ color: '#ffffff' }}>CodeChef</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Username:</span>
                      <span className="font-bold" style={{ color: '#ffffff' }}>{usernames.codechef}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div className="text-base font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Generated from IntelliView • {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeFolioCard;
