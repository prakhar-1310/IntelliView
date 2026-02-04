export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-500 text-white";
    case "medium":
      return "bg-yellow-500 text-white";
    case "hard":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-300 text-gray-900";
  }
};