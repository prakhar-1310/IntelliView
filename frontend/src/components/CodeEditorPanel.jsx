import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, BugIcon, InfoIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import { useState } from "react";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onDebugCode,
  debugBtnRef,
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="h-full bg-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-300 relative">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key} disabled={!lang.installed} className={!lang.installed ? "text-gray-400" : "text-gray-900"}>
                {lang.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              title="Compiler Info"
            >
              <InfoIcon className="size-4" />
            </button>
            {showInfo && (
              <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10 text-xs text-gray-600">
                Options depend on your locally installed compilers.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            ref={debugBtnRef}
            className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isRunning}
            onClick={onDebugCode}
          >
            <BugIcon className="size-4" />
            Debug
          </button>
          <button className="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isRunning} onClick={onRunCode}>
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={(value) => onCodeChange(value)}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
