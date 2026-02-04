import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function CodeFolioDSA() {
  const dsaData = [
    { name: "Arrays", value: 480, max: 500 },
    { name: "Strings", value: 320, max: 400 },
    { name: "HashMaps", value: 280, max: 350 },
    { name: "Sorting", value: 245, max: 300 },
    { name: "Math", value: 198, max: 250 },
    { name: "Greedy", value: 156, max: 200 },
    { name: "Dynamic Prog", value: 124, max: 200 },
    { name: "Binary Search", value: 98, max: 150 },
    { name: "DFS", value: 87, max: 150 },
    { name: "BFS", value: 76, max: 150 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
      <h2 className="text-2xl font-bold text-neutral mb-6">DSA Topic Analysis</h2>

      <div className="w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height={400} minWidth={600}>
          <BarChart
            data={dsaData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fdfcfb",
                border: "1px solid #d4af37",
                borderRadius: "8px",
              }}
              formatter={(value) => `${value} problems`}
            />
            <Bar
              dataKey="value"
              fill="#451a21"
              radius={[8, 8, 0, 0]}
              name="Solved"
            />
            <Bar
              dataKey="max"
              fill="#d4af37"
              radius={[8, 8, 0, 0]}
              opacity={0.3}
              name="Target"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {dsaData.slice(0, 5).map((topic, index) => (
          <div
            key={index}
            className="text-center p-4 bg-white rounded-lg border border-gray-300"
          >
            <p className="text-sm font-semibold text-neutral mb-2">
              {topic.name}
            </p>
            <p className="text-2xl font-bold text-primary">{topic.value}</p>
            <p className="text-xs text-neutral/60">of {topic.max}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeFolioDSA;
