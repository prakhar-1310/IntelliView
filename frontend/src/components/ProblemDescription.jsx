import { getDifficultyBadgeClass } from "../lib/utils";
import { useState, useRef } from "react";
import { getHintFromGrok } from "../lib/grok";
import Popover from "./Popover";
import { fetchYoutubeVideo } from "../api/youtube";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems, isAccepted }) {
  // Video popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoBtnRef = useRef();

  // Hint popover
  const [hintPopoverOpen, setHintPopoverOpen] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [hints, setHints] = useState([]);
  const [hintError, setHintError] = useState("");
  const [openHint, setOpenHint] = useState(null);
  const hintBtnRef = useRef();

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

  const handleHintClick = async (e) => {
    e.preventDefault();
    if (hintPopoverOpen) {
      setHintPopoverOpen(false);
      return;
    }
    setHintPopoverOpen(true);
    setHintLoading(true);
    setHintError("");
    setHints([]);
    setOpenHint(null);
    try {
      const desc = problem?.description?.text || "";
      if (!desc) throw new Error("No description available");
      const result = await getHintFromGrok(desc);
      if (Array.isArray(result)) {
        setHints(result);
      } else if (result && result.hints) {
        setHints(result.hints);
      } else if (typeof result === 'string') {
        setHints([result]);
      } else {
        setHints(["No hint available."]);
      }
    } catch (err) {
      setHintError("Failed to fetch hint.");
    }
    setHintLoading(false);
  };
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* HEADER SECTION */}
      <div className="p-6 bg-white border-b border-gray-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-primary text-white rounded-full font-semibold text-sm">#{problem.sequenceNumber || problem.id}</span>
            <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAccepted && (
              <span className="px-3 py-1.5 bg-green-500 text-white rounded-full font-semibold text-sm gap-2">
                ✓ Accepted
              </span>
            )}
            <span className={`px-3 py-1.5 rounded-full font-semibold text-sm ${getDifficultyBadgeClass(problem.difficulty)}`}>{problem.difficulty}</span>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(problem.title + ' programming tutorial')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Search YouTube for help"
              className="ml-2 flex items-center"
            >
              <button
                ref={videoBtnRef}
                className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                onClick={handleVideoClick}
                title="Show YouTube help video"
              >
                <img
                  src="/play-circle.svg"
                  alt="YouTube Video"
                  className="w-5 h-5"
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
            {/* Hint button right of video button */}
            <button
              ref={hintBtnRef}
              className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors ml-2"
              onClick={handleHintClick}
              title="Show a hint for this problem"
            >
              <span role="img" aria-label="Hint">💡</span>
            </button>
            <Popover open={hintPopoverOpen} anchorRef={hintBtnRef} onClose={() => setHintPopoverOpen(false)}>
              <div className="flex flex-col gap-2 w-full min-w-[300px]">
                <h3 className="text-base font-bold">Hints</h3>
                {hintLoading && <span className="loading loading-spinner loading-md"></span>}
                {hintError && <span className="text-error">{hintError}</span>}
                {!hintLoading && !hintError && hints.length > 0 && (
                  <div className="flex flex-col w-full">
                    {hints.map((hint, idx) => (
                      <div key={idx} className="border-b border-gray-300 last:border-b-0">
                        <button
                          className="flex items-center w-full px-2 py-3 text-left gap-2 hover:bg-gray-50 focus:bg-gray-50"
                          onClick={() => setOpenHint(openHint === idx ? null : idx)}
                        >
                          <span role="img" aria-label="Hint">💡</span>
                          <span className="font-medium">Hint {idx + 1}</span>
                          <span className="ml-auto text-lg">{openHint === idx ? '▾' : '▸'}</span>
                        </button>
                        {openHint === idx && (
                          <div className="px-6 pb-3 text-gray-900/90 whitespace-pre-line">
                            {hint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popover>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wider uppercase text-white inline-block ${
          problem.difficulty?.toLowerCase() === 'easy' ? 'bg-[#22c55e]' :
          problem.difficulty?.toLowerCase() === 'medium' ? 'bg-[#eab308]' :
          'bg-[#ef4444]'
        }`}>
          {problem.category}
        </span>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.sequenceNumber || p.id} - {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-300">
          <h2 className="text-xl font-bold text-gray-900">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-gray-900/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-gray-900/90">
                {note}
              </p>
            ))}
            {/* Video icon removed from here, now in header */}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-900 rounded-full">{idx + 1}</span>
                  <p className="font-semibold text-gray-900">Example {idx + 1}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-[70px]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-gray-300 mt-2">
                      <span className="text-gray-900/60 font-sans text-xs">
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
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Constraints</h2>
          <ul className="space-y-2 text-gray-900/90">
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
