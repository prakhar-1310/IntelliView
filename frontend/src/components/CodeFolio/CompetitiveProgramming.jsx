import { SiCodeforces } from "react-icons/si";

function CompetitiveProgramming({ codeforcesProblems }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-base-300">
      <h2 className="text-xl font-bold text-neutral mb-4">Competitive Programming</h2>
      
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          <div className="w-32 h-32 rounded-full border-8 border-yellow-400 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-neutral">{codeforcesProblems || 59}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <SiCodeforces className="text-blue-500 text-xl" />
          <span className="text-base font-medium text-yellow-600">Codeforces</span>
          <span className="text-lg font-bold text-neutral ml-auto">{codeforcesProblems || 59}</span>
        </div>
      </div>
    </div>
  );
}

export default CompetitiveProgramming;
