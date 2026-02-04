import {
  getLeetCodeStats,
  getCodeForcesStats,
  getCodeChefStats,
  getGeeksforGeeksStats,
} from '../lib/codingPlatforms.js';
import User from '../models/User.js';

const getPlatformStats = async (req, res) => {
  try {
    const { platform, username } = req.query;

    if (!platform || !username) {
      return res.status(400).json({
        success: false,
        message: 'Platform and username are required',
      });
    }

    let stats;

    switch (platform.toLowerCase()) {
      case 'leetcode':
        stats = await getLeetCodeStats(username);
        if (stats && stats.submitStats) {
          const submissions = stats.submitStats.acSubmissionNum;
          const easy = submissions.find(s => s.difficulty === 'Easy')?.count || 0;
          const medium = submissions.find(s => s.difficulty === 'Medium')?.count || 0;
          const hard = submissions.find(s => s.difficulty === 'Hard')?.count || 0;
          
          console.log('LeetCode Raw Data:', {
            contestRanking: stats.contestRanking,
            badges: stats.badges?.length || 0,
            profile: stats.profile
          });
          
          stats = {
            username: stats.username,
            totalQuestions: easy + medium + hard,
            easy,
            medium,
            hard,
            activeDays: stats.userCalendar?.totalActiveDays || 0,
            streak: stats.userCalendar?.streak || 0,
            submissionCalendar: stats.userCalendar?.submissionCalendar || null,
            ranking: stats.profile?.ranking || 0,
            reputation: stats.profile?.reputation || 0,
            contestRating: stats.contestRanking?.rating ? Math.round(stats.contestRanking.rating) : 0,
            contestRanking: stats.contestRanking?.globalRanking || 0,
            contestsAttended: stats.contestRanking?.attendedContestsCount || 0,
            badges: Array.isArray(stats.badges) ? stats.badges : [],
            upcomingBadges: Array.isArray(stats.upcomingBadges) ? stats.upcomingBadges : [],
          };
          
          console.log('LeetCode Processed Data:', {
            contestRating: stats.contestRating,
            contestRanking: stats.contestRanking,
            contestsAttended: stats.contestsAttended,
            badgesCount: stats.badges.length
          });
        }
        break;
      case 'codeforces':
        stats = await getCodeForcesStats(username);
        if (stats) {
          stats = {
            username: stats.username,
            rating: stats.rating,
            maxRating: stats.maxRating,
            rank: stats.rank,
            contests: stats.contests,
            problemsSolved: stats.problemsSolved || 0,
            activeDays: stats.activeDays || 0,
          };
        }
        break;
      case 'codechef':
        stats = await getCodeChefStats(username);
        break;
      case 'geeksforgeeks':
        stats = await getGeeksforGeeksStats(username);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid platform',
        });
    }

    if (!stats) {
      return res.status(200).json({
        success: false,
        message: `User '${username}' not found on ${platform}. Please verify the username is correct.`,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      platform,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform stats',
      error: error.message,
    });
  }
};

const getAllPlatformStats = async (req, res) => {
  try {
    const { leetcodeUsername, codeforcesUsername, codechefUsername, geeksforgeeksUsername } = req.body;

    const stats = {};

    if (leetcodeUsername) {
      stats.leetcode = await getLeetCodeStats(leetcodeUsername);
    }

    if (codeforcesUsername) {
      stats.codeforces = await getCodeForcesStats(codeforcesUsername);
    }

    if (codechefUsername) {
      stats.codechef = await getCodeChefStats(codechefUsername);
    }

    if (geeksforgeeksUsername) {
      stats.geeksforgeeks = await getGeeksforGeeksStats(geeksforgeeksUsername);
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching all platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform stats',
      error: error.message,
    });
  }
};

export {
  getPlatformStats,
  getAllPlatformStats,
  saveUsernames,
  getUsernames,
};

// Save CodeFolio usernames
const saveUsernames = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { leetcode, codeforces, codechef, location, university, about } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated',
      });
    }

    // Find user by clerkId and update codefolioUsernames
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          codefolioUsernames: {
            leetcode: leetcode || '',
            codeforces: codeforces || '',
            codechef: codechef || '',
            location: location || '',
            university: university || '',
            about: about || ''
          }
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'CodeFolio usernames saved successfully',
      data: user.codefolioUsernames
    });
  } catch (error) {
    console.error('Error saving usernames:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving usernames',
      error: error.message,
    });
  }
};

// Get CodeFolio usernames
const getUsernames = async (req, res) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated',
      });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.codefolioUsernames || {
        leetcode: '',
        codeforces: '',
        codechef: '',
        location: '',
        university: '',
        about: ''
      }
    });
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching usernames',
      error: error.message,
    });
  }
};
