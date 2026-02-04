function CodeFolioStats({ stats }) {
  const statCards = [
    {
      label: "Total Questions",
      value: stats.totalQuestions || 1041,
    },
    {
      label: "Total Active Days",
      value: stats.totalActivedays || 300,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-8 border border-gray-300"
        >
          <p className="text-base text-neutral/60 mb-2 font-medium">
            {card.label}
          </p>
          <p className="text-6xl font-bold text-neutral">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default CodeFolioStats;
