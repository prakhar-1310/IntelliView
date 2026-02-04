# CodeFolio - Coding Progress Tracker

CodeFolio is a comprehensive section within IntelliView that aggregates your coding progress across multiple platforms including LeetCode, CodeForces, CodeChef, and GeeksforGeeks.

## Features

### 1. **Multi-Platform Integration**
   - **LeetCode**: Track problems solved, contests participated, DSA topic analysis
   - **CodeForces**: Monitor rating, contest history, and ranking
   - **CodeChef**: Track progress and contest participation
   - **GeeksforGeeks**: View learning progress and problem statistics

### 2. **Comprehensive Statistics**
   - **Total Questions**: Aggregate count across all platforms
   - **Active Days**: Streak tracking and daily activity heatmap
   - **Problems Breakdown**: Easy, Medium, and Hard problem statistics
   - **Contest Rankings**: Real-time ranking across platforms

### 3. **Visual Analytics**
   - **Pie Charts**: Problem difficulty distribution
   - **Bar Charts**: DSA topic-wise problem analysis
   - **Stats Cards**: Key metrics at a glance
   - **Heatmap**: Activity calendar for consistency tracking

### 4. **Platform Comparison**
   - Side-by-side comparison of ratings across platforms
   - Contest participation metrics
   - Rank visualization

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   └── CodeFolioPage.jsx          # Main page component
│   ├── components/
│   │   └── CodeFolio/
│   │       ├── CodeFolioStats.jsx     # Top statistics cards
│   │       ├── CodeFolioProblems.jsx  # Problems solved breakdown
│   │       ├── CodeFolioContests.jsx  # Contest rankings
│   │       ├── CodeFolioDSA.jsx       # DSA topic analysis
│   │       └── CodeFolioProfile.jsx   # Platform profile display
│   ├── api/
│   │   └── codefolio.js               # API calls
│   └── hooks/
│       └── useCodeFolio.js            # Data fetching hook

backend/
├── src/
│   ├── controllers/
│   │   └── codefolioController.js     # API handlers
│   ├── routes/
│   │   └── codefolioRoutes.js         # API routes
│   └── lib/
│       └── codingPlatforms.js         # Platform integrations
```

## Color Scheme

The CodeFolio section follows your project's luxury theme:
- **Primary**: `#451a21` (Dark brown)
- **Secondary**: `#d4af37` (Gold)
- **Accent**: `#8b5a3c` (Brown accent)
- **Success**: `#00b894` (Green)
- **Warning**: `#fdcb6e` (Yellow)
- **Error**: `#d63031` (Red)

## API Endpoints

### Get Platform Stats
```
GET /api/codefolio/platform?platform=leetcode&username=prakhar-1330
```

**Query Parameters:**
- `platform`: `leetcode` | `codeforces` | `codechef` | `geeksforgeeks`
- `username`: Platform username

**Response:**
```json
{
  "success": true,
  "platform": "leetcode",
  "data": {
    "username": "prakhar-1330",
    "stats": {
      "totalQuestions": 900,
      "totalActivedays": 269,
      "problemsSolved": 853,
      "easy": 348,
      "medium": 436,
      "hard": 69
    }
  }
}
```

### Get All Platforms Stats
```
POST /api/codefolio/all
```

**Request Body:**
```json
{
  "leetcodeUsername": "prakhar-1330",
  "codeforcesUsername": "prakhar",
  "codechefUsername": "prakhar",
  "geeksforgeeksUsername": "prakhar"
}
```

## Integration Guide

### 1. Connect to Backend
The CodeFolioPage automatically fetches data from the backend when a platform is selected.

### 2. Add User Profiles
Users can add their coding platform usernames in their profile settings (to be implemented):
```javascript
const updateUserProfiles = async (profiles) => {
  // Save user's platform usernames
  await apiClient.post('/user/profiles', profiles);
};
```

### 3. Real-time Updates
Implement periodic polling or WebSocket connections for live stat updates:
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchPlatformStats();
  }, 5 * 60 * 1000); // Update every 5 minutes
  
  return () => clearInterval(interval);
}, []);
```

## Platform APIs Used

### LeetCode
- GraphQL API: `https://leetcode.com/graphql/`
- Queries user profile, problems, contests

### CodeForces
- REST API: `https://codeforces.com/api/`
- Endpoints: `user.info`, `user.rating`

### CodeChef
- REST API: `https://codechef.com/api/`
- Requires authentication token

### GeeksforGeeks
- REST API: `https://auth.geeksforgeeks.org/`
- User profile endpoint

## Dependencies Added

```json
"recharts": "^2.12.7"  // For charts and visualizations
```

## Future Enhancements

1. **User Settings**: Allow users to connect/disconnect platform accounts
2. **Performance Metrics**: Track improvement over time
3. **Notifications**: Alert users of new contests
4. **Export Reports**: Generate PDF/CSV reports
5. **Social Sharing**: Share achievements and progress
6. **Leaderboards**: Compare with friends and community
7. **Goal Setting**: Set targets and track progress
8. **Mobile App**: Dedicated mobile version

## Styling Notes

- Uses Tailwind CSS with custom theme
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Consistent with project's luxury aesthetic
- Accessibility-first approach

## Getting Started

1. Install dependencies: `npm install`
2. Add recharts: Already added to package.json
3. Start the development server: `npm run dev`
4. Navigate to `/codefolio` to view the section
5. Update usernames in CodeFolioPage.jsx with real usernames

## Notes

- Some platform APIs may have rate limits
- Authentication tokens may be required for private data
- Implement caching to reduce API calls
- Add error handling for API failures
- Consider using a service like RapidAPI for aggregated data
