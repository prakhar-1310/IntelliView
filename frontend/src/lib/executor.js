import axios from "axios";

const LANGUAGE_VERSIONS = {
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await axios.post("http://localhost:3000/api/execute", {
      language: languageConfig.language,
      version: languageConfig.version,
      files: [
        {
          name: `main.${getFileExtension(language)}`,
          content: code,
        },
      ],
    });

    const data = response.data;

    if (!data || !data.run) {
      return {
        success: false,
        error: "Invalid response from executor",
      };
    }

    const output = data.run.output || "";
    const stderr = data.run.error || "";

    if (!data.run.success) {
      return {
        success: false,
        output: output,
        error: stderr || "Execution failed",
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || `Failed to execute code: ${error.message}`,
    };
  }
}

function getFileExtension(language) {
  const extensions = {
    python: "py",
    java: "java",
    cpp: "cpp",
  };

  return extensions[language] || "txt";
}