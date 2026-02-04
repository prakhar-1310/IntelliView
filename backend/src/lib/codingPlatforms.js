import axios from 'axios';

// LeetCode API integration
const getLeetCodeStats = async (username) => {
  try {
    // First query - basic stats
    const statsQuery = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          userCalendar {
            totalActiveDays
            streak
            submissionCalendar
          }
          badges {
            id
            name
            displayName
            icon
            hoverText
            creationDate
            category
          }
          activeBadge {
            id
            name
            displayName
            icon
          }
        }
      }
    `;

    const statsResponse = await axios.post('https://leetcode.com/graphql/', {
      query: statsQuery,
      variables: { username },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      }
    });

    if (!statsResponse.data || !statsResponse.data.data || !statsResponse.data.data.matchedUser) {
      return null;
    }

    const userData = statsResponse.data.data.matchedUser;

    // Second query - contest ranking (may fail for some users)
    let contestData = null;
    try {
      const contestQuery = `
        query getUserContestRanking($username: String!) {
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
          }
        }
      `;

      const contestResponse = await axios.post('https://leetcode.com/graphql/', {
        query: contestQuery,
        variables: { username },
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        }
      });

      if (contestResponse.data && contestResponse.data.data) {
        contestData = contestResponse.data.data.userContestRanking;
      }
    } catch (contestError) {
      console.log('Contest data not available for user:', username);
    }

    // Process badges to ensure icon URLs are complete
    const processedBadges = userData.badges?.map(badge => ({
      ...badge,
      icon: badge.icon?.startsWith('http') ? badge.icon : `https://leetcode.com${badge.icon}`
    })) || [];

    console.log('Processed badges:', processedBadges.length, 'badges found');
    if (processedBadges.length > 0) {
      console.log('First badge:', processedBadges[0]);
    }

    return {
      ...userData,
      badges: processedBadges,
      contestRanking: contestData
    };
    
  } catch (error) {
    console.error('LeetCode API Error:', error.message);
    return null;
  }
};

// CodeForces API integration
const getCodeForcesStats = async (username) => {
  try {
    const userResponse = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    
    const ratingResponse = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    
    const statusResponse = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
    );

    const user = userResponse.data.result[0];
    const contests = ratingResponse.data.result;
    const submissions = statusResponse.data.result;
    
    // Count unique solved problems
    const solvedProblems = new Set();
    // Count unique active days
    const activeDays = new Set();
    
    submissions.forEach(submission => {
      if (submission.verdict === 'OK') {
        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
        solvedProblems.add(problemId);
      }
      // Track active days from submission timestamps
      if (submission.creationTimeSeconds) {
        const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
        activeDays.add(date);
      }
    });

    return {
      username: user.handle,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'Unrated',
      contests: contests.length,
      problemsSolved: solvedProblems.size,
      activeDays: activeDays.size,
    };
  } catch (error) {
    console.error('CodeForces API Error:', error);
    return null;
  }
};

// CodeChef API integration (requires authentication)
const getCodeChefStats = async (username) => {
  try {
    // CodeChef API requires authentication
    // This is a placeholder - actual implementation would need API key
    const response = await axios.get(
      `https://codechef.com/api/contests/${username}`,
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    console.error('CodeChef API Error:', error);
    return null;
  }
};

// GeeksforGeeks API integration
const getGeeksforGeeksStats = async (username) => {
  try {
    const response = await axios.get(
      `https://auth.geeksforgeeks.org/user/${username}/profile`,
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    console.error('GeeksforGeeks API Error:', error);
    return null;
  }
};

export {
  getLeetCodeStats,
  getCodeForcesStats,
  getCodeChefStats,
  getGeeksforGeeksStats,
};
