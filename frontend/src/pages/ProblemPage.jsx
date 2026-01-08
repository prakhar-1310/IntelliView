import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { problemApi } from "../api/problems";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblem, setCurrentProblem] = useState(null);
  const [allProblems, setAllProblems] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  // Fetch problems from database
  const { data: dbProblems } = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });

  // Combine static and database problems
  useEffect(() => {
    const staticProblems = Object.values(PROBLEMS);
    const dynamicProblems = dbProblems?.problems || [];
    const combined = [...staticProblems, ...dynamicProblems];
    setAllProblems(combined);
    
    // Find current problem by ID
    const problem = combined.find(p => p.id === id);
    if (problem) {
      setCurrentProblem(problem);
      setCode(problem.starterCode?.[selectedLanguage] || "");
    }
  }, [id, selectedLanguage, dbProblems]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (currentProblem?.starterCode?.[newLang]) {
      setCode(currentProblem.starterCode[newLang]);
    }
    setOutput(null);
    setIsAccepted(false);
  };

  const handleProblemChange = (newProblemId) => {
    setIsAccepted(false);
    navigate(`/problem/${newProblemId}`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setIsAccepted(false);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    // check if code executed successfully and matches expected output

    if (result.success) {
      const expectedOutput = currentProblem?.expectedOutput?.[selectedLanguage];
      if (expectedOutput) {
        const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
        
        if (testsPassed) {
          setIsAccepted(true);
          triggerConfetti();
          toast.success("All tests passed! Great job!");
        } else {
          toast.error("Tests failed. Check your output!");
        }
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      {!currentProblem ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Problem not found</h2>
            <p className="text-base-content/60">The problem you're looking for doesn't exist.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblem?.id}
              onProblemChange={handleProblemChange}
              allProblems={allProblems}
              isAccepted={isAccepted}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
        </div>
      )}
    </div>
  );
}

export default ProblemPage;