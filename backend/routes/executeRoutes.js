import express from "express";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

const router = express.Router();

// Helper to execute commands with a timeout
const runCommand = (command, timeout = 15000) => {
  return new Promise((resolve) => {
    exec(command, { timeout }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          resolve({ success: false, error: "Execution Timed Out (15s limit exceeded)" });
        } else {
          resolve({ success: false, error: stderr || error.message });
        }
      } else {
        resolve({ success: true, output: stdout, error: stderr });
      }
    });
  });
};

router.get("/compilers", async (req, res) => {
  const checkCompiler = async (command) => {
    const result = await runCommand(command, 2000);
    return result.success;
  };

  const [python, java, cpp] = await Promise.all([
    checkCompiler("python --version"),
    checkCompiler("javac -version"),
    checkCompiler("g++ --version")
  ]);

  res.json({
    python,
    java,
    cpp
  });
});

router.post("/", async (req, res) => {
  const { language, files } = req.body;
  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, error: "No code provided" });
  }

  const code = files[0].content;
  const tempId = crypto.randomUUID();
  const tempDir = path.join(os.tmpdir(), "intelliview_exec", tempId);

  try {
    await fs.mkdir(tempDir, { recursive: true });

    if (language === "python") {
      const filePath = path.join(tempDir, "main.py");
      await fs.writeFile(filePath, code);
      const result = await runCommand(`python "${filePath}"`);
      return res.json({ run: result });
    } 
    else if (language === "java") {
      // Find class name or default to Main
      const classMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = classMatch ? classMatch[1] : "Main";
      const filePath = path.join(tempDir, `${className}.java`);
      
      await fs.writeFile(filePath, code);
      const compileResult = await runCommand(`javac "${filePath}"`);
      if (!compileResult.success) {
        return res.json({ run: compileResult }); // Compilation error
      }
      
      const result = await runCommand(`java -cp "${tempDir}" ${className}`);
      return res.json({ run: result });
    }
    else if (language === "cpp" || language === "c++") {
      const filePath = path.join(tempDir, "main.cpp");
      const outPath = path.join(tempDir, "main.exe");
      await fs.writeFile(filePath, code);
      
      const compileResult = await runCommand(`g++ "${filePath}" -o "${outPath}"`);
      if (!compileResult.success) {
        return res.json({ run: compileResult });
      }
      
      const result = await runCommand(`"${outPath}"`);
      return res.json({ run: result });
    }
    else {
      return res.json({ run: { success: false, error: `Language ${language} not supported by local executor` } });
    }
  } catch (err) {
    console.error("Execution error:", err);
    return res.status(500).json({ success: false, error: "Internal server error during execution" });
  } finally {
    // Cleanup
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
  }
});

export default router;
