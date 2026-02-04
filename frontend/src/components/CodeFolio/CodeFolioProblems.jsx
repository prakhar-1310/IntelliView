import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

function CodeFolioProblems({ stats }) {
  const easy = stats.easy || 0;
  const medium = stats.medium || 0;
  const hard = stats.hard || 0;
  const totalSolved = easy + medium + hard;
  
  const problemsData = [
    {
      name: "Easy",
      value: easy,
      color: "#00b894",
      label: "Easy",
    },
    {
      name: "Medium",
      value: medium,
      color: "#fdcb6e",
      label: "Medium",
    },
    {
      name: "Hard",
      value: hard,
      color: "#d63031",
      label: "Hard",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
      <h2 className="text-xl font-bold text-neutral mb-2">Problems Solved</h2>
      <p className="text-sm text-neutral/60 mb-4">DSA</p>

      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={problemsData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {problemsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-neutral">
                {totalSolved}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 w-full">
          {problemsData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-neutral">
                  {item.label}
                </span>
              </div>
              <span className="text-lg font-bold text-neutral">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CodeFolioProblems;
