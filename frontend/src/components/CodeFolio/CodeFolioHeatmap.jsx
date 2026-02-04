import { Calendar } from "lucide-react";

function CodeFolioHeatmap({ submissionCalendar }) {
  // Parse LeetCode submission calendar (comes as JSON string with timestamp: count)
  const parseSubmissionCalendar = () => {
    if (!submissionCalendar) return {};
    
    try {
      // LeetCode returns submissionCalendar as a JSON string
      const calendar = typeof submissionCalendar === 'string' 
        ? JSON.parse(submissionCalendar) 
        : submissionCalendar;
      return calendar;
    } catch (error) {
      console.error('Error parsing submission calendar:', error);
      return {};
    }
  };

  const calendarData = parseSubmissionCalendar();

  // Generate activity level based on submission count
  const getActivityLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  // Get activity color based on level
  const getActivityColor = (level) => {
    const colors = ["bg-gray-50", "bg-success/20", "bg-success/40", "bg-success/60", "bg-success"];
    return colors[level];
  };

  // Generate heatmap data for the past year
  const generateYearData = () => {
    const weeks = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    let currentDate = new Date(oneYearAgo);
    // Start from Sunday of that week
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    while (currentDate <= today) {
      const week = [];
      for (let day = 0; day < 7; day++) {
        const timestamp = Math.floor(currentDate.getTime() / 1000).toString();
        const count = calendarData[timestamp] || 0;
        const level = getActivityLevel(count);
        
        week.push({
          date: new Date(currentDate),
          count,
          level,
          timestamp
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  const weekData = generateYearData();

  // Generate month labels
  const getMonthLabels = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    
    return months;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-neutral flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Activity Calendar
        </h2>
        <div className="flex items-center gap-2 text-xs text-neutral/60">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
              ></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weekData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getActivityColor(day.level)} hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer`}
                  title={`${day.date.toLocaleDateString()}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4 text-xs text-neutral/60">
        {monthLabels.map((month, index) => (
          <span key={index}>{month}</span>
        ))}
      </div>
    </div>
  );
}

export default CodeFolioHeatmap;
