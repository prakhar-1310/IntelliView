import { getDifficultyBadgeClass } from "../lib/utils";
import { useState, useRef } from "react";
import Popover from "./Popover";
import { fetchYoutubeVideo } from "../api/youtube";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems, isAccepted }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoBtnRef = useRef();

  const handleVideoClick = async (e) => {
    e.preventDefault();
    if (popoverOpen) {
      setPopoverOpen(false);
      return;
    }
    setPopoverOpen(true);
    setLoading(true);
    setError("");
    setVideoUrl("");
    try {
      const url = await fetchYoutubeVideo(problem.title + " programming tutorial");
      if (url) setVideoUrl(url);
      else setError("No video found.");
    } catch (err) {
      setError("Failed to fetch video.");
    }
    setLoading(false);
  };
  return (
    <div className="h-full overflow-y-auto bg-base-200">
      {/* HEADER SECTION */}
      <div className="p-6 bg-base-100 border-b border-base-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="badge badge-primary badge-lg font-bold">#{problem.id}</span>
            <h1 className="text-3xl font-bold text-base-content">{problem.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAccepted && (
              <span className="badge badge-success badge-lg gap-2">
                ✓ Accepted
              </span>
            )}
            <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>{problem.difficulty}</span>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(problem.title + ' programming tutorial')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Search YouTube for help"
              className="ml-2 flex items-center"
            >
              <button
                ref={videoBtnRef}
                className="badge badge-success badge-lg flex items-center justify-center p-0 w-8 h-8 min-w-0 min-h-0"
                style={{ borderRadius: '9999px' }}
                onClick={handleVideoClick}
                title="Show YouTube help video"
              >
                <img
                  src="/play-circle.svg"
                  alt="YouTube Video"
                  className="w-6 h-6"
                  style={{ filter: 'none' }}
                />
              </button>
                  <Popover open={popoverOpen} anchorRef={videoBtnRef} onClose={() => setPopoverOpen(false)}>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base font-bold">YouTube Video</h3>
                      {loading && <span className="loading loading-spinner loading-md"></span>}
                      {error && <span className="text-error">{error}</span>}
                      {videoUrl && (
                        <>
                          <div className="aspect-video w-full">
                            <iframe
                              width="100%"
                              height="180"
                              src={videoUrl.replace("watch?v=", "embed/")}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="link link-primary mt-1">Watch on YouTube</a>
                        </>
                      )}
                    </div>
                  </Popover>
            </a>
          </div>
        </div>
        <p className="text-base-content/60">{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="select select-sm w-full"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} - {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold text-base-content">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-base-content/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-base-content/90">
                {note}
              </p>
            ))}
            {/* Video icon removed from here, now in header */}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-sm">{idx + 1}</span>
                  <p className="font-semibold text-base-content">Example {idx + 1}</p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-[70px]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-base-300 mt-2">
                      <span className="text-base-content/60 font-sans text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
          <ul className="space-y-2 text-base-content/90">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;