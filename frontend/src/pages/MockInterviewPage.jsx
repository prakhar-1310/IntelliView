import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { interviewApi } from "../api/interview";
import toast from "react-hot-toast";
import {
  BrainCircuitIcon,
  MicIcon,
  MicOffIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrophyIcon,
  RefreshCcwIcon,
  Volume2Icon,
  VolumeXIcon,
  StarIcon,
  Loader2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  SparklesIcon,
  ZapIcon,
  ClipboardListIcon,
  ChevronRightIcon,
  SendIcon,
  PencilIcon,
  XIcon,
  BarChart2Icon,
  MessageSquareIcon,
  DownloadIcon,
  CameraIcon,
} from "lucide-react";

// ─── Static Config ────────────────────────────────────────────────────────────
const TOPICS = [
  { id: "dsa",           label: "Data Structures & Algorithms", icon: "🧮", desc: "Arrays, Trees, DP, Graphs" },
  { id: "system-design", label: "System Design",                icon: "🏗️", desc: "Architecture & Scalability" },
  { id: "os",            label: "Operating Systems",            icon: "💻", desc: "Processes, Memory, I/O" },
  { id: "dbms",          label: "DBMS & SQL",                   icon: "🗄️", desc: "Queries, ACID, Indexes" },
  { id: "oop",           label: "OOP & Design Patterns",        icon: "🎯", desc: "SOLID, Patterns, Principles" },
  { id: "cn",            label: "Computer Networks",            icon: "🌐", desc: "TCP/IP, HTTP, DNS" },
  { id: "javascript",    label: "JavaScript",                   icon: "⚡", desc: "ES6+, Async, Closures" },
  { id: "react",         label: "React & Frontend",             icon: "⚛️", desc: "Hooks, State, Virtual DOM" },
  { id: "hr",            label: "HR & Behavioural",             icon: "🤝", desc: "Leadership, Teamwork, STAR" },
];

const DIFFICULTIES = [
  { id: "Easy",   label: "Easy",   desc: "Fundamentals & basics",     color: "#00b894" },
  { id: "Medium", label: "Medium", desc: "Intermediate concepts",     color: "#d4af37" },
  { id: "Hard",   label: "Hard",   desc: "Advanced & complex topics", color: "#d63031" },
];

const QUESTION_COUNTS = [3, 5, 10];

const GRADE_META = {
  "A+": { color: "#00b894", label: "Outstanding" },
  "A":  { color: "#00b894", label: "Excellent" },
  "B+": { color: "#d4af37", label: "Very Good" },
  "B":  { color: "#d4af37", label: "Good" },
  "C+": { color: "#d4af37", label: "Above Average" },
  "C":  { color: "#e17055", label: "Average" },
  "D":  { color: "#d63031", label: "Below Average" },
  "F":  { color: "#636e72", label: "Needs Work" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** AI speaking waveform bars */
function WaveForm({ isActive }) {
  const heights = [0.35, 0.6, 0.9, 1, 0.8, 0.55, 0.75, 0.45, 0.7, 0.5, 0.85, 0.4, 0.65, 0.3];
  return (
    <div className="flex items-center gap-[3px] h-8">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full origin-bottom"
          style={{
            height: isActive ? `${h * 28}px` : "3px",
            backgroundColor: isActive ? "#d4af37" : "#451a2133",
            transition: "height 0.15s ease",
            animationName: isActive ? "waveBar" : "none",
            animationDuration: `${0.5 + i * 0.07}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Circular score ring */
function ScoreRing({ score, size = 140 }) {
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "#00b894" : score >= 60 ? "#d4af37" : "#d63031";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#451a2115" strokeWidth="10" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#451a21]">{score}</span>
        <span className="text-xs text-black/40 font-medium">/ 100</span>
      </div>
    </div>
  );
}

/** Per-question accordion */
function QuestionAccordion({ qa, index, isOpen, onToggle }) {
  const scoreColor = qa.score >= 8 ? "#00b894" : qa.score >= 6 ? "#d4af37" : qa.score >= 4 ? "#e17055" : "#d63031";
  return (
    <div className="bg-white border border-[#451a21]/10 hover:border-[#451a21]/20 transition-all shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#fdfcfb] transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: scoreColor }}
          >
            Q{index + 1}
          </div>
          <p className="text-[#451a21] text-sm font-medium line-clamp-1">{qa.question}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <div className="flex items-center gap-1.5">
            <StarIcon className="size-4" style={{ color: scoreColor, fill: scoreColor }} />
            <span className="text-sm font-bold" style={{ color: scoreColor }}>{qa.score}/10</span>
          </div>
          {isOpen
            ? <ChevronUpIcon className="size-4 text-black/30" />
            : <ChevronDownIcon className="size-4 text-black/30" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 space-y-4 border-t border-black/5">
          {/* Score bar */}
          <div className="pt-4">
            <div className="flex justify-between text-xs text-black/40 mb-2">
              <span>Score</span>
              <span style={{ color: scoreColor }}>{qa.score} / 10</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(qa.score / 10) * 100}%`, backgroundColor: scoreColor, transition: "width 1s ease" }} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Your answer */}
            <div className="bg-[#fdfcfb] border border-black/8 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="size-5 bg-[#451a21]/8 rounded-full flex items-center justify-center">
                  <MicIcon className="size-3 text-[#451a21]" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-black/30">Your Answer</span>
              </div>
              <p className="text-black/60 text-sm leading-relaxed">
                {qa.candidateAnswer || <span className="italic text-black/30">No answer provided</span>}
              </p>
            </div>

            {/* Ideal answer */}
            <div className="bg-[#00b894]/5 border border-[#00b894]/15 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <CheckCircleIcon className="size-4 text-[#00b894]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#00b894]/60">Ideal Answer</span>
              </div>
              <p className="text-black/70 text-sm leading-relaxed">{qa.correctAnswer || qa.idealAnswer}</p>
            </div>
          </div>

          {/* Good / Improve */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {qa.whatWasGood && (
              <div className="flex gap-3 bg-[#00b894]/5 border border-[#00b894]/12 rounded-lg p-3.5">
                <CheckCircleIcon className="size-4 text-[#00b894] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#00b894]/60 mb-1">What Was Good</p>
                  <p className="text-black/55 text-xs leading-relaxed">{qa.whatWasGood}</p>
                </div>
              </div>
            )}
            {qa.whatToImprove && (
              <div className="flex gap-3 bg-[#d4af37]/5 border border-[#d4af37]/12 rounded-lg p-3.5">
                <AlertCircleIcon className="size-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]/60 mb-1">To Improve</p>
                  <p className="text-black/55 text-xs leading-relaxed">{qa.whatToImprove}</p>
                </div>
              </div>
            )}
          </div>

          {qa.feedback && (
            <p className="text-black/40 text-xs italic border-l-2 border-[#451a21]/15 pl-3 leading-relaxed">{qa.feedback}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
function MockInterviewPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [stage, setStage] = useState("setup");

  // Setup
  const [selectedTopic, setSelectedTopic]       = useState(null);
  const [difficulty, setDifficulty]             = useState("Medium");
  const [questionCount, setQuestionCount]       = useState(5);
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [showCustomInput, setShowCustomInput]   = useState(false);

  // Interview
  const [questions, setQuestions]               = useState([]);
  const [currentQIndex, setCurrentQIndex]       = useState(0);
  const [answers, setAnswers]                   = useState([]);
  const [currentAnswer, setCurrentAnswer]       = useState("");
  const [manualText, setManualText]             = useState("");
  const [isListening, setIsListening]           = useState(false);
  const [isSpeaking, setIsSpeaking]             = useState(false);
  const [voiceEnabled, setVoiceEnabled]         = useState(true);
  const [answerSubmitted, setAnswerSubmitted]   = useState(false);
  const [startTime, setStartTime]               = useState(null);

  // Report
  const [report, setReport]   = useState(null);
  const [expandedQ, setExpandedQ] = useState(0);
  const [savedId, setSavedId] = useState(null);

  // History
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await interviewApi.getHistory();
        if (res.success) setHistory(res.interviews || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const recognitionRef  = useRef(null);
  const voicesRef       = useRef([]);
  const customInputRef  = useRef(null);
  const currentAnswerRef = useRef("");
  const isIntentionallyStopped = useRef(true);

  // Video Recording Refs & State
  const liveVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoStreamRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [videoUrl, setVideoUrl] = useState(null);

  // Frame Capture for AI Visual Analysis
  const framesRef = useRef([]);
  const frameIntervalRef = useRef(null);

  useEffect(() => {
    currentAnswerRef.current = currentAnswer;
  }, [currentAnswer]);

  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis?.getVoices() || []; };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  const speak = useCallback((text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.88; u.pitch = 1.05;
    const voice = voicesRef.current.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
      || voicesRef.current.find((v) => v.lang.startsWith("en"))
      || voicesRef.current[0];
    if (voice) u.voice = voice;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [voiceEnabled]);

  const startCameraAndRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };
      
      mediaRecorder.start();
    } catch (err) {
      console.error("Camera access denied or failed:", err);
      toast.error("Camera access denied. Cannot record video.");
    }
  };

  const stopCameraAndRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
  };

  const stopListening = useCallback(() => {
    isIntentionallyStopped.current = true;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition not supported in this browser. Please type.");
      return;
    }
    
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    
    isIntentionallyStopped.current = false;
    const baseText = currentAnswerRef.current;
    
    const r = new SR();
    r.continuous = true; 
    r.interimResults = true; 
    r.lang = "en-US";
    
    r.onresult = (e) => {
      let fullSpoken = "";
      for (let i = 0; i < e.results.length; i++) {
        fullSpoken += e.results[i][0].transcript;
      }
      
      const newAnswer = baseText ? `${baseText} ${fullSpoken}`.trim() : fullSpoken;
      setCurrentAnswer(newAnswer);
    };
    
    r.onerror = (e) => {
      console.error("Speech API Error:", e.error);
      if (e.error === "network") {
        toast.error("Browser speech engine network error. Try Chrome/Edge or check connection.");
        isIntentionallyStopped.current = true;
      } else if (e.error !== "aborted" && e.error !== "no-speech") {
        toast.error("Mic error: " + e.error);
        isIntentionallyStopped.current = true;
      }
    };
    
    r.onend = () => {
      if (!isIntentionallyStopped.current) {
        startListening();
      } else {
        setIsListening(false);
      }
    };
    
    recognitionRef.current = r;
    try {
      r.start();
      setIsListening(true);
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (liveVideoRef.current && framesRef.current.length < 5) {
      const canvas = document.createElement("canvas");
      canvas.width = liveVideoRef.current.videoWidth || 640;
      canvas.height = liveVideoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx && canvas.width > 0) {
        ctx.drawImage(liveVideoRef.current, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 0.5);
        if (base64.length > 50) {
          framesRef.current.push(base64);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (stage === "interview") {
      setTimeout(() => captureFrame(), 2000); // Initial frame
      frameIntervalRef.current = setInterval(() => {
        captureFrame();
      }, 8000); // capture a frame every 8 seconds
    } else {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    }
    return () => {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, [stage, captureFrame]);

  useEffect(() => {
    return () => { stopListening(); window.speechSynthesis?.cancel(); stopCameraAndRecording(); };
  }, [stopListening]);

  useEffect(() => {
    if (stage === "interview" && questions.length > 0) {
      const q = questions[currentQIndex];
      if (q) {
        const intro = currentQIndex === 0
          ? `Interview starting. Question ${currentQIndex + 1}. ${q.question}`
          : `Question ${currentQIndex + 1}. ${q.question}`;
        setTimeout(() => speak(intro), 600);
      }
    }
  }, [currentQIndex, stage, questions, speak]);

  useEffect(() => {
    if (showCustomInput) customInputRef.current?.focus();
  }, [showCustomInput]);

  const getTopicObj = useCallback(() => {
    if (selectedTopic === "custom") {
      return { id: "custom", label: customTopicInput.trim() || "Custom Topic", icon: "✏️", desc: "Custom topic" };
    }
    return TOPICS.find((t) => t.id === selectedTopic) || null;
  }, [selectedTopic, customTopicInput]);

  const handleStartInterview = async () => {
    const topicObj = getTopicObj();
    if (!topicObj) return toast.error("Please select a topic");
    if (topicObj.id === "custom" && !customTopicInput.trim()) return toast.error("Please enter a custom topic");
    setStage("loading");
    try {
      const data = await interviewApi.generateQuestions({ topic: topicObj.label, difficulty, count: questionCount });
      if (!data.questions?.length) throw new Error("No questions returned");
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(""));
      setCurrentQIndex(0);
      setCurrentAnswer("");
      setManualText("");
      setAnswerSubmitted(false);
      setStartTime(Date.now());
      setVideoUrl(null);
      setStage("interview");
      startCameraAndRecording();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate questions. Please try again.");
      setStage("setup");
    }
  };

  const handleSubmitAnswer = async () => {
    stopListening();
    window.speechSynthesis?.cancel();
    const updated = [...answers];
    updated[currentQIndex] = currentAnswer.trim();
    setAnswers(updated);
    setAnswerSubmitted(true);
    await new Promise((r) => setTimeout(r, 500));
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setCurrentAnswer("");
      setManualText("");
      setAnswerSubmitted(false);
    } else {
      stopCameraAndRecording();
      await handleEvaluate(updated);
    }
  };

  const handleEvaluate = async (finalAnswers, finalQs = questions) => {
    setStage("evaluating");
    const topicObj = getTopicObj();
    const durationMinutes = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;
    const questionsAndAnswers = finalQs.map((q, i) => ({
      id: q.id, question: q.question, idealAnswer: q.idealAnswer,
      candidateAnswer: finalAnswers[i] || "",
    }));
    try {
      const data = await interviewApi.evaluateAnswers({
        topic: topicObj.label,
        difficulty,
        questionsAndAnswers,
        videoFrames: framesRef.current
      });
      if (!data.evaluation) throw new Error("No evaluation returned");
      setReport(data.evaluation);
      setExpandedQ(0);
      try {
        const saved = await interviewApi.saveReport({
          topic: selectedTopic, topicLabel: topicObj.label, difficulty,
          questionCount: finalQs.length, questions: finalQs, answers: finalAnswers,
          report: data.evaluation, durationMinutes,
        });
        setSavedId(saved.interviewId);
        
        // Refresh history
        const histRes = await interviewApi.getHistory();
        if (histRes.success) setHistory(histRes.interviews || []);
      } catch (_) {}
      setStage("report");
      speak(`Interview complete! Your score is ${data.evaluation.overallScore} out of 100. Grade: ${data.evaluation.grade}.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to evaluate. Please try again.");
      setStage("interview");
    }
  };

  const handleEndEarly = async () => {
    stopListening();
    stopCameraAndRecording();
    window.speechSynthesis?.cancel();
    
    if (currentQIndex === 0 && !currentAnswer.trim()) {
      handleReset();
      return;
    }

    const qsToEvaluate = currentAnswer.trim() ? currentQIndex + 1 : currentQIndex;
    const finalQs = questions.slice(0, qsToEvaluate);
    
    const updated = [...answers];
    if (currentAnswer.trim()) updated[currentQIndex] = currentAnswer.trim();
    const finalAns = updated.slice(0, qsToEvaluate);
    
    setQuestions(finalQs);
    setAnswers(finalAns);
    await handleEvaluate(finalAns, finalQs);
  };

  const handleViewPastReport = async (id) => {
    setStage("loading");
    try {
      const res = await interviewApi.getById(id);
      if (res.success && res.interview) {
        setQuestions(res.interview.questions || []);
        setAnswers(res.interview.answers || []);
        setReport({
          overallScore: res.interview.overallScore,
          grade: res.interview.grade,
          summary: res.interview.summary,
          strengths: res.interview.strengths,
          areasToImprove: res.interview.areasToImprove,
          questionAnalysis: res.interview.questionAnalysis
        });
        setSelectedTopic(res.interview.topic);
        setDifficulty(res.interview.difficulty);
        setQuestionCount(res.interview.questionCount);
        setStage("report");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load past report.");
      setStage("setup");
    }
  };

  const handleReset = () => {
    stopListening();
    stopCameraAndRecording();
    window.speechSynthesis?.cancel();
    setStage("setup");
    setSelectedTopic(null);
    setDifficulty("Medium");
    setQuestionCount(5);
    setCustomTopicInput("");
    setShowCustomInput(false);
    setQuestions([]);
    setAnswers([]);
    setCurrentQIndex(0);
    setCurrentAnswer("");
    setManualText("");
    setIsListening(false);
    setIsSpeaking(false);
    setReport(null);
    setExpandedQ(0);
    setSavedId(null);
    setVideoUrl(null);
    recordedChunksRef.current = [];
    framesRef.current = [];
  };

  const currentQuestion = questions[currentQIndex];
  const progress        = questions.length ? ((currentQIndex + 1) / questions.length) * 100 : 0;
  const topicObj        = getTopicObj();
  const diffObj         = DIFFICULTIES.find((d) => d.id === difficulty);
  const gradeMeta       = report ? (GRADE_META[report.grade] || GRADE_META["C"]) : null;

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="h-screen flex flex-col bg-[#fdfcfb] overflow-hidden text-black">
      {(stage === "setup" || stage === "report") && <Navbar />}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">

      {/* ── SETUP STAGE ─────────────────────────────────────────────────────── */}
      {stage === "setup" && (
        <>
          {/* Header — matches WelcomeSection style */}
          <div className="relative overflow-hidden border-b border-black/5 shrink-0">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 bg-[#451a21] rounded-full flex items-center justify-center shadow-lg">
                      <BrainCircuitIcon className="size-6 text-white" />
                    </div>
                    <h1 className="text-5xl font-serif font-light text-[#451a21] tracking-tight">
                      AI Mock <span className="font-medium">Interview</span>
                    </h1>
                  </div>
                  <p className="text-lg text-black/50 ml-16 font-light">
                    AI-generated questions · Voice or text answers · Instant detailed report
                  </p>
                </div>
                {selectedTopic && (
                  <div className="hidden lg:flex items-center gap-3 px-5 py-3 bg-white border border-[#451a21]/10 shadow-sm">
                    <span className="text-2xl">{topicObj?.icon}</span>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-black/30 mb-0.5">Selected</p>
                      <p className="text-[#451a21] font-semibold text-sm">{topicObj?.label}</p>
                      <p className="text-black/40 text-xs">{difficulty} · {questionCount} Questions</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content — matches dashboard container */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT: Topic Selection (2 cols) */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-[#451a21]/10 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="size-8 bg-[#451a21] rounded-full flex items-center justify-center text-xs font-black text-white">1</div>
                    <h2 className="text-xl font-serif font-light text-[#451a21]">Choose a Topic</h2>
                  </div>

                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {TOPICS.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => { setSelectedTopic(topic.id); setShowCustomInput(false); }}
                        className={`group relative p-4 text-left border transition-all duration-200 hover:shadow-md ${
                          selectedTopic === topic.id
                            ? "border-[#451a21] bg-[#451a21]/5 shadow-sm"
                            : "border-black/8 bg-[#fdfcfb] hover:border-[#451a21]/40 hover:bg-white"
                        }`}
                      >
                        {selectedTopic === topic.id && (
                          <div className="absolute top-2 right-2 size-5 bg-[#451a21] rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="size-3 text-white" />
                          </div>
                        )}
                        <span className="text-xl mb-2 block">{topic.icon}</span>
                        <p className={`font-semibold text-sm leading-tight mb-1 ${selectedTopic === topic.id ? "text-[#451a21]" : "text-black/70"}`}>
                          {topic.label}
                        </p>
                        <p className="text-xs text-black/35">{topic.desc}</p>
                      </button>
                    ))}

                    {/* Custom Topic Card */}
                    {!showCustomInput ? (
                      <button
                        onClick={() => { setSelectedTopic("custom"); setShowCustomInput(true); }}
                        className={`group relative p-4 text-left border border-dashed transition-all duration-200 hover:shadow-md ${
                          selectedTopic === "custom"
                            ? "border-[#d4af37] bg-[#d4af37]/5"
                            : "border-black/15 bg-[#fdfcfb] hover:border-[#d4af37]/60"
                        }`}
                      >
                        {selectedTopic === "custom" && (
                          <div className="absolute top-2 right-2 size-5 bg-[#d4af37] rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="size-3 text-white" />
                          </div>
                        )}
                        <div className="size-8 bg-[#d4af37]/15 border border-[#d4af37]/25 flex items-center justify-center mb-2">
                          <PencilIcon className="size-4 text-[#d4af37]" />
                        </div>
                        <p className={`font-semibold text-sm mb-1 ${selectedTopic === "custom" ? "text-[#d4af37]" : "text-black/50"}`}>
                          Custom Topic
                        </p>
                        <p className="text-xs text-black/30">Type your own topic</p>
                      </button>
                    ) : (
                      <div className={`relative p-4 border border-dashed ${
                        selectedTopic === "custom" ? "border-[#d4af37] bg-[#d4af37]/5" : "border-black/15 bg-[#fdfcfb]"
                      }`}>
                        <button
                          onClick={() => { setShowCustomInput(false); if (selectedTopic === "custom") setSelectedTopic(null); }}
                          className="absolute top-2 right-2 size-5 bg-black/8 hover:bg-black/15 rounded-full flex items-center justify-center transition-colors"
                        >
                          <XIcon className="size-3 text-black/50" />
                        </button>
                        <div className="size-8 bg-[#d4af37]/15 border border-[#d4af37]/25 flex items-center justify-center mb-2">
                          <PencilIcon className="size-4 text-[#d4af37]" />
                        </div>
                        <p className="text-xs font-bold tracking-widest uppercase text-black/30 mb-2">Custom Topic</p>
                        <input
                          ref={customInputRef}
                          type="text"
                          value={customTopicInput}
                          onChange={(e) => { setCustomTopicInput(e.target.value); setSelectedTopic("custom"); }}
                          onFocus={() => setSelectedTopic("custom")}
                          placeholder="e.g. Machine Learning, Rust..."
                          className="w-full bg-white border border-black/15 px-3 py-2 text-xs text-black/70 placeholder-black/25 outline-none focus:border-[#d4af37]/60 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Past Interviews */}
                <div className="bg-white border border-[#451a21]/10 shadow-sm p-6 mt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="size-8 bg-[#d4af37] rounded-full flex items-center justify-center">
                      <TrophyIcon className="size-4 text-white" />
                    </div>
                    <h2 className="text-xl font-serif font-light text-[#451a21]">Past Interviews</h2>
                  </div>

                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2Icon className="size-6 text-[#d4af37] animate-spin" />
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-black/10">
                      <p className="text-sm text-black/40">No past interviews yet.</p>
                      <p className="text-xs text-black/30 mt-1">Complete one to see your reports here!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {history.slice(0, 6).map((h) => (
                        <button
                          key={h._id}
                          onClick={() => handleViewPastReport(h._id)}
                          className="group relative flex flex-col p-4 text-left border border-black/8 bg-[#fdfcfb] hover:border-[#451a21]/40 hover:bg-white transition-all hover:shadow-md"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-black/30">
                              {new Date(h.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider bg-[#d4af37]/10 text-[#d4af37]">
                              {h.difficulty}
                            </span>
                          </div>
                          <p className="font-semibold text-sm text-[#451a21] mb-1 line-clamp-1">
                            {h.topicLabel}
                          </p>
                          <div className="flex items-center gap-4 text-xs mt-auto pt-3 border-t border-black/5">
                            <span className="text-black/60">Score: <strong className="text-[#451a21]">{h.overallScore}</strong></span>
                            <span className="text-black/60">Grade: <strong className="text-[#d4af37]">{h.grade}</strong></span>
                          </div>
                          <ArrowRightIcon className="absolute bottom-4 right-4 size-4 text-black/20 group-hover:text-[#451a21] group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Config + Start (1 col) */}
              <div className="lg:col-span-1 flex flex-col gap-5">

                {/* Difficulty */}
                <div className="bg-white border border-[#451a21]/10 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-8 bg-[#451a21] rounded-full flex items-center justify-center text-xs font-black text-white">2</div>
                    <h2 className="text-xl font-serif font-light text-[#451a21]">Difficulty</h2>
                  </div>
                  <div className="flex flex-col gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id)}
                        className={`flex items-center justify-between py-3 px-4 border transition-all duration-200 ${
                          difficulty === d.id
                            ? "border-[#451a21] bg-[#451a21]/5"
                            : "border-black/8 bg-[#fdfcfb] hover:border-[#451a21]/30 hover:bg-white"
                        }`}
                      >
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${difficulty === d.id ? "text-[#451a21]" : "text-black/60"}`}>{d.label}</p>
                          <p className="text-xs text-black/35">{d.desc}</p>
                        </div>
                        {difficulty === d.id ? (
                          <div className="size-5 bg-[#451a21] rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="size-3 text-white" />
                          </div>
                        ) : (
                          <div className="size-3 rounded-full border border-black/20" style={{ backgroundColor: d.color + "50" }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div className="bg-white border border-[#451a21]/10 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-8 bg-[#451a21] rounded-full flex items-center justify-center text-xs font-black text-white">3</div>
                    <h2 className="text-xl font-serif font-light text-[#451a21]">Questions</h2>
                  </div>
                  <div className="flex gap-3">
                    {QUESTION_COUNTS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setQuestionCount(n)}
                        className={`flex-1 py-4 border text-center font-black text-2xl font-serif transition-all duration-200 ${
                          questionCount === n
                            ? "border-[#451a21] bg-[#451a21] text-white shadow-sm"
                            : "border-black/10 bg-[#fdfcfb] text-black/40 hover:border-[#451a21]/40 hover:text-[#451a21]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-black/30 mt-2 text-center">
                    ~{questionCount * 2}–{questionCount * 4} minutes
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-white border border-[#d4af37]/20 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="size-6 bg-[#d4af37]/15 rounded-full flex items-center justify-center">
                      <SparklesIcon className="size-3.5 text-[#d4af37]" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-black/30">Summary</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-black/40">Topic</span>
                      <span className="text-xs font-semibold text-[#451a21] text-right max-w-[60%] truncate">
                        {selectedTopic ? (selectedTopic === "custom" ? (customTopicInput.trim() || "Custom…") : topicObj?.label) : "—"}
                      </span>
                    </div>
                    <div className="h-px bg-black/5" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-black/40">Difficulty</span>
                      <span className="text-xs font-bold" style={{ color: diffObj?.color }}>{difficulty}</span>
                    </div>
                    <div className="h-px bg-black/5" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-black/40">Questions</span>
                      <span className="text-xs font-semibold text-[#451a21]">{questionCount}</span>
                    </div>
                  </div>
                </div>

                {/* Start button — matches dashboard button style */}
                <button
                  onClick={handleStartInterview}
                  disabled={!selectedTopic || (selectedTopic === "custom" && !customTopicInput.trim())}
                  className={`group w-full flex items-center justify-center gap-3 px-6 py-4 font-bold text-[10px] tracking-wider uppercase transition-all duration-300 shadow-lg ${
                    selectedTopic && !(selectedTopic === "custom" && !customTopicInput.trim())
                      ? "bg-[#451a21] text-white hover:bg-[#d4af37]"
                      : "bg-black/8 text-black/25 cursor-not-allowed"
                  }`}
                >
                  <BrainCircuitIcon className="size-5" />
                  <span>Start Interview</span>
                  {selectedTopic && !(selectedTopic === "custom" && !customTopicInput.trim()) && (
                    <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── LOADING STAGE ─────────────────────────────────────────────────────── */}
      {stage === "loading" && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="relative">
              <div className="size-24 bg-[#451a21] rounded-full flex items-center justify-center shadow-2xl">
                <BrainCircuitIcon className="size-10 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#d4af37] border-[#451a21]/20 animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-serif font-light text-[#451a21] mb-3">Preparing Your Interview</h2>
              <p className="text-black/50 text-base">
                AI is crafting <strong className="text-[#451a21]">{questionCount} {difficulty}</strong> questions on{" "}
                <strong className="text-[#451a21]">{topicObj?.label}</strong>…
              </p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="size-2 rounded-full bg-[#d4af37]"
                  style={{ animation: `waveBar 0.8s ease-in-out ${i * 0.18}s infinite alternate`, opacity: 0.7 }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── INTERVIEW STAGE ───────────────────────────────────────────────────── */}
      {/* ── INTERVIEW STAGE ───────────────────────────────────────────────────── */}
      {stage === "interview" && currentQuestion && (
        <div className="flex flex-col flex-1 overflow-hidden bg-[#fdfcfb]">
          {/* Progress header */}
          <div className="border-b border-black/5 bg-white px-6 py-4 shrink-0 shadow-sm z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-serif font-black text-[#451a21]">{currentQIndex + 1}</span>
                    <span className="text-black/30 text-sm font-light">/ {questions.length} questions</span>
                  </div>
                  <div className="h-4 w-px bg-black/10" />
                  <span className="text-sm text-black/50">{topicObj?.icon} {topicObj?.label}</span>
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider"
                    style={{ backgroundColor: `${diffObj?.color}18`, color: diffObj?.color }}
                  >
                    {difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-black/25">{Math.round(progress)}% complete</span>
                  <button
                    onClick={() => { setVoiceEnabled((v) => !v); window.speechSynthesis?.cancel(); setIsSpeaking(false); }}
                    className="p-2 border border-black/10 hover:border-[#451a21]/30 bg-[#fdfcfb] hover:bg-white transition-all"
                    title={voiceEnabled ? "Mute AI" : "Enable AI voice"}
                  >
                    {voiceEnabled
                      ? <Volume2Icon className="size-4 text-[#d4af37]" />
                      : <VolumeXIcon className="size-4 text-black/25" />}
                  </button>
                </div>
              </div>
              <div className="h-1.5 bg-black/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#451a21] to-[#d4af37] transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Split panel */}
          <div className="max-w-7xl w-full mx-auto px-6 py-6 flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">

              {/* LEFT: Question Column */}
              <div className="flex flex-col gap-5 overflow-y-auto pr-2 pb-4 scrollbar-thin">
                {/* AI avatar row */}
                <div className="bg-white border border-[#451a21]/10 shadow-sm p-6 flex items-center gap-5 shrink-0">
                  <div className={`relative size-16 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isSpeaking ? "bg-gradient-to-br from-[#451a21] to-[#6b2d3e] shadow-[#451a21]/30 shadow-lg scale-105" : "bg-[#451a21]"
                  }`}>
                    <BrainCircuitIcon className="size-8 text-white" />
                    {isSpeaking && (
                      <div className="absolute -top-0.5 -right-0.5 size-4 bg-[#d4af37] rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-black/30 mb-2">
                      {isSpeaking ? "AI Interviewer Speaking…" : "AI Interviewer · Ready"}
                    </p>
                    <WaveForm isActive={isSpeaking} />
                  </div>
                  {voiceEnabled && (
                    <button
                      onClick={() => speak(currentQuestion.question)}
                      className="ml-auto flex items-center gap-2 px-4 py-2 border border-black/10 hover:border-[#451a21]/30 text-[#451a21] text-xs font-bold uppercase tracking-wider transition-all bg-white shadow-sm hover:shadow"
                    >
                      <Volume2Icon className="size-4" />
                      Read Aloud
                    </button>
                  )}
                </div>

                {/* Question card */}
                <div className="bg-white border border-[#451a21]/10 shadow-sm p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="shrink-0 size-10 bg-[#451a21]/5 text-[#451a21] rounded flex items-center justify-center">
                      <ClipboardListIcon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold tracking-widest uppercase text-[#451a21]">Question {currentQIndex + 1}</h3>
                    </div>
                  </div>
                  
                  <p className="text-[#451a21] text-2xl font-serif font-light leading-relaxed tracking-tight flex-1">
                    {currentQuestion.question}
                  </p>
                  
                  {/* Question dot tracker */}
                  <div className="flex gap-2 items-center mt-8 pt-6 border-t border-black/5">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: i < currentQIndex ? "#451a21"
                            : i === currentQIndex ? "#d4af37"
                            : "#451a2115"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Answer Column */}
              <div className="flex flex-col gap-4 overflow-y-auto pb-4 scrollbar-thin">
                
                {/* Combined Answer & Camera card */}
                <div className="bg-white border border-[#451a21]/10 shadow-sm p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex items-start justify-between mb-5 gap-4">
                    {/* Left: Title & Mic */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-[#451a21]/5 text-[#451a21] rounded flex items-center justify-center shrink-0">
                          <MessageSquareIcon className="size-5" />
                        </div>
                        <span className="text-lg font-serif font-light text-[#451a21]">Your Answer</span>
                      </div>
                      <button
                        onClick={() => (isListening ? stopListening() : startListening())}
                        className={`flex items-center w-max gap-2 px-5 py-2.5 font-bold text-[10px] tracking-widest uppercase transition-all duration-200 rounded ${
                          isListening
                            ? "bg-[#d4af37] text-white shadow-md animate-mic-pulse scale-105"
                            : "bg-white border border-[#451a21]/20 text-[#451a21] hover:bg-[#451a21]/5 hover:border-[#451a21]/40 shadow-sm"
                        }`}
                      >
                        {isListening ? <MicIcon className="size-4" /> : <MicOffIcon className="size-4" />}
                        {isListening ? "Listening…" : "Use Mic"}
                      </button>
                    </div>

                    {/* Right: Compact Camera */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center justify-between w-full px-1">
                        <span className="text-[9px] font-bold tracking-widest uppercase text-[#451a21]/50">Camera</span>
                        {videoStreamRef.current && (
                          <div className="flex items-center gap-1.5">
                            <div className="size-1.5 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold tracking-wider uppercase text-red-500">Rec</span>
                          </div>
                        )}
                      </div>
                      <div className="relative w-36 md:w-48 aspect-video rounded-sm overflow-hidden bg-[#fdfcfb] border border-black/10 shadow-inner">
                        <video
                          ref={liveVideoRef}
                          autoPlay
                          muted
                          className="w-full h-full object-cover transform -scale-x-100"
                        />
                        {!videoStreamRef.current && (
                          <div className="absolute inset-0 flex items-center justify-center text-black/30 text-[9px] uppercase tracking-wider font-bold">
                            Starting…
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Speak using the mic, or type your answer here…"
                    className="w-full flex-1 bg-[#fdfcfb] border border-black/10 px-5 py-4 text-black/80 placeholder-black/30 resize-none outline-none focus:border-[#451a21]/40 focus:bg-white text-base leading-relaxed transition-all shadow-inner rounded-sm min-h-[120px]"
                  />

                  {currentAnswer && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-black/5">
                      <button
                        onClick={() => { setCurrentAnswer(""); setManualText(""); stopListening(); }}
                        className="text-xs font-medium text-black/40 hover:text-red-500 transition-colors uppercase tracking-wider"
                      >
                        Clear Answer
                      </button>
                      <span className="text-xs font-bold text-black/30 uppercase tracking-widest">
                        {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                  )}
                </div>

                {/* Pro tip card */}
                <div className="shrink-0 text-xs text-black/50 p-4 bg-blue-50/50 border border-blue-900/10 rounded-sm">
                  <span className="text-[#d4af37] font-bold text-sm mr-2">💡</span>
                  <strong className="text-[#451a21] font-semibold uppercase tracking-wider text-[10px]">Pro Tip:</strong>{" "}
                  {currentQIndex === 0
                    ? "Structure your answer clearly — use examples and explain your reasoning."
                    : "Reference specific scenarios and walk through your thought process step by step."}
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 shrink-0 mt-2">
                  <button
                    onClick={handleEndEarly}
                    disabled={answerSubmitted}
                    title="End interview early and evaluate current progress"
                    className="flex items-center justify-center gap-2 px-6 py-4 font-bold text-[11px] tracking-widest uppercase transition-all duration-300 shadow-sm bg-white border border-[#451a21]/20 text-[#451a21] hover:bg-[#451a21]/5 hover:border-[#451a21]/40 rounded-sm"
                  >
                    <XIcon className="size-4" />
                    End
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={answerSubmitted}
                    className={`group flex-1 flex items-center justify-center gap-3 px-8 py-4 font-bold text-[11px] tracking-widest uppercase transition-all duration-300 shadow-lg rounded-sm ${
                      answerSubmitted
                        ? "bg-black/10 text-black/30 cursor-not-allowed"
                        : currentQIndex < questions.length - 1
                          ? "bg-[#451a21] text-white hover:bg-[#6b2d3e] hover:-translate-y-0.5"
                          : "bg-[#d4af37] text-white hover:bg-[#e0be5a] hover:-translate-y-0.5"
                    }`}
                  >
                    {answerSubmitted ? (
                      <><Loader2Icon className="size-4 animate-spin" /><span>Saving…</span></>
                    ) : currentQIndex < questions.length - 1 ? (
                      <><SendIcon className="size-4" /><span>Submit & Next</span><ChevronRightIcon className="size-4 group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      <><TrophyIcon className="size-4" /><span>Submit & Finish</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EVALUATING STAGE ──────────────────────────────────────────────────── */}
      {stage === "evaluating" && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="relative">
              <div className="size-24 bg-[#451a21] rounded-full flex items-center justify-center shadow-2xl">
                <SparklesIcon className="size-10 text-[#d4af37]" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#d4af37] border-[#451a21]/20 animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-serif font-light text-[#451a21] mb-3">Analysing Your Performance</h2>
              <p className="text-black/50">
                AI is reviewing all <strong className="text-[#451a21]">{questions.length} answers</strong> and generating your report…
              </p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="size-2 rounded-full bg-[#d4af37]"
                  style={{ animation: `waveBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`, opacity: 0.7 }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT STAGE ──────────────────────────────────────────────────────── */}
      {stage === "report" && report && (
        <>
          {/* Report header — WelcomeSection style */}
          <div className="border-b border-black/5 shrink-0">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="size-12 bg-[#451a21] rounded-full flex items-center justify-center shadow-lg">
                      <TrophyIcon className="size-6 text-white" />
                    </div>
                    <h1 className="text-5xl font-serif font-light text-[#451a21] tracking-tight">
                      Performance <span className="font-medium">Report</span>
                    </h1>
                  </div>
                  <p className="text-black/50 ml-16 font-light">
                    {topicObj?.icon} {topicObj?.label} · {difficulty} · {questions.length} Questions
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="group flex items-center gap-3 px-8 py-4 bg-[#d4af37] text-white font-bold text-[10px] tracking-wider uppercase hover:bg-[#451a21] transition-all duration-300 shadow-lg"
                  >
                    <RefreshCcwIcon className="size-4" />
                    New Interview
                    <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-3 px-8 py-4 bg-[#451a21] text-white font-bold text-[10px] tracking-wider uppercase hover:bg-[#d4af37] transition-all duration-300 shadow-lg"
                  >
                    <HomeIcon className="size-4" />
                    Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pb-16 py-6">

            {/* Top row: Score + Grade + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Score */}
              <div className="bg-white border border-[#451a21]/10 shadow-sm p-7 flex flex-col items-center gap-4">
                <ScoreRing score={report.overallScore} size={140} />
                <p className="text-xs font-bold tracking-widest uppercase text-black/30">Overall Score</p>
              </div>

              {/* Grade */}
              <div className="bg-white border shadow-sm p-7 flex flex-col items-center justify-center gap-3"
                style={{ borderColor: `${gradeMeta.color}30` }}>
                <div className="text-8xl font-serif font-black leading-none" style={{ color: gradeMeta.color }}>
                  {report.grade}
                </div>
                <div className="text-sm font-bold tracking-wide" style={{ color: gradeMeta.color }}>{gradeMeta.label}</div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < Math.round((report.overallScore / 100) * 5);
                    return <StarIcon key={i} className="size-4"
                      style={{ color: filled ? gradeMeta.color : "#00000015", fill: filled ? gradeMeta.color : "transparent" }} />;
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white border border-[#451a21]/10 shadow-sm p-7">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-8 bg-[#451a21] rounded-full flex items-center justify-center">
                    <BarChart2Icon className="size-4 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-light text-[#451a21]">AI Summary</h3>
                </div>
                <p className="text-black/60 text-sm leading-relaxed font-light">{report.summary}</p>
              </div>
            </div>

            {/* Strengths + Improvements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <div className="bg-white border border-[#00b894]/15 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="size-8 bg-[#00b894] rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="size-4 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-light text-[#451a21]">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {(report.strengths || []).map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 size-1.5 rounded-full bg-[#00b894] shrink-0" />
                      <span className="text-sm text-black/60 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-[#d4af37]/15 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="size-8 bg-[#d4af37] rounded-full flex items-center justify-center">
                    <AlertCircleIcon className="size-4 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-light text-[#451a21]">Areas to Improve</h3>
                </div>
                <ul className="space-y-3">
                  {(report.areasToImprove || []).map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 size-1.5 rounded-full bg-[#d4af37] shrink-0" />
                      <span className="text-sm text-black/60 leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Video Recording Section */}
            {videoUrl && (
              <div className="bg-white border border-[#451a21]/10 shadow-sm p-6 mb-8 flex flex-col gap-5">
                <div className="flex items-center gap-3 w-full">
                  <div className="size-8 bg-[#451a21] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">🎥</span>
                  </div>
                  <h3 className="text-xl font-serif font-light text-[#451a21]">Your Interview Recording</h3>
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-[#fdfcfb] p-5 rounded-sm border border-black/5">
                  <video src={videoUrl} controls className="w-full md:w-80 aspect-video rounded border border-black/10 shadow-sm bg-black object-contain shrink-0" />
                  <div className="flex flex-col gap-4 py-2">
                    <p className="text-sm text-black/60 font-light leading-relaxed">
                      Review your interview recording to evaluate your body language, tone, and pacing. 
                      You can download this video for your personal records.
                    </p>
                    <a
                      href={videoUrl}
                      download="mock_interview_recording.webm"
                      className="flex items-center justify-center gap-3 px-6 py-3.5 bg-[#d4af37] text-white font-bold text-[10px] tracking-wider uppercase hover:bg-[#451a21] transition-all duration-300 shadow-sm w-max mt-2"
                    >
                      <DownloadIcon className="size-4" />
                      Download Recording
                    </a>
                  </div>
                </div>

                {report.visualAnalysis && (
                  <div className="w-full bg-white border border-[#451a21]/10 rounded-sm shadow-sm p-6 mt-2">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="size-8 bg-[#451a21] rounded-full flex items-center justify-center shrink-0">
                        <CameraIcon className="size-4 text-white" />
                      </div>
                      <h4 className="font-serif text-[#451a21] text-xl font-light">AI Visual Analysis</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-[#fdfcfb] p-4 border border-black/5 rounded-sm flex flex-col gap-1.5 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Nervousness</span>
                        <span className="text-base font-medium text-[#451a21]">{report.visualAnalysis.nervousness || "N/A"}</span>
                      </div>
                      <div className="bg-[#fdfcfb] p-4 border border-black/5 rounded-sm flex flex-col gap-1.5 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Eye Contact</span>
                        <span className="text-base font-medium text-[#451a21]">{report.visualAnalysis.eyeContact || "N/A"}</span>
                      </div>
                      <div className="bg-[#fdfcfb] p-4 border border-black/5 rounded-sm flex flex-col gap-1.5 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Attire</span>
                        <span className="text-base font-medium text-[#451a21]">{report.visualAnalysis.attire || "N/A"}</span>
                      </div>
                    </div>
                    <div className="bg-black/5 p-4 rounded-sm border-l-4 border-[#d4af37]">
                      <p className="text-sm text-black/70 leading-relaxed italic">
                        "{report.visualAnalysis.feedback}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question breakdown */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-8 bg-[#451a21] rounded-full flex items-center justify-center">
                  <ClipboardListIcon className="size-4 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-light text-[#451a21]">Question-by-Question Breakdown</h3>
              </div>
              <div className="space-y-3">
                {(report.questionAnalysis || []).map((qa, i) => (
                  <QuestionAccordion
                    key={i}
                    qa={{
                      ...qa,
                      question: questions[i]?.question || qa.question || `Question ${i + 1}`,
                      candidateAnswer: answers[i] || "",
                      idealAnswer: questions[i]?.idealAnswer || "",
                    }}
                    index={i}
                    isOpen={expandedQ === i}
                    onToggle={() => setExpandedQ(expandedQ === i ? -1 : i)}
                  />
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-black/5">
              <button
                onClick={handleReset}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#d4af37] text-white font-bold text-[10px] tracking-wider uppercase hover:bg-[#451a21] transition-all duration-300 shadow-lg"
              >
                <RefreshCcwIcon className="size-4" />
                Try Another Topic
                <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={async () => {
                  const t = selectedTopic; const d = difficulty; const q = questionCount;
                  handleReset();
                  await new Promise((r) => setTimeout(r, 50));
                  setSelectedTopic(t); setDifficulty(d); setQuestionCount(q);
                }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-[#451a21] text-white font-bold text-[10px] tracking-wider uppercase hover:bg-[#d4af37] transition-all duration-300 shadow-lg"
              >
                <ZapIcon className="size-4" />
                Retake Same Topic
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-3 px-8 py-4 border border-black/15 text-black/50 hover:text-[#451a21] hover:border-[#451a21]/30 font-bold text-[10px] tracking-wider uppercase transition-all"
              >
                <HomeIcon className="size-4" />
                Dashboard
              </button>
            </div>

            {savedId && (
              <p className="text-center text-xs text-black/20 mt-5">
                ✓ Report saved to your history · ID: {savedId}
              </p>
            )}
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export default MockInterviewPage;
