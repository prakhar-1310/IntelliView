import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  getLeetCodeStats,
  getCodeForcesStats,
  getCodeChefStats,
  getGeeksforGeeksStats,
} from "../api/codefolio";

export const useCodeFolio = (usernames) => {
  const [platformData, setPlatformData] = useState({
    leetcode: null,
    codeforces: null,
    codechef: null,
    geeksforgeeks: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = { ...platformData };

        if (usernames.leetcode) {
          try {
            const response = await getLeetCodeStats(usernames.leetcode);
            data.leetcode = response.data;
          } catch (err) {
            console.error("LeetCode fetch error:", err);
          }
        }

        if (usernames.codeforces) {
          try {
            const response = await getCodeForcesStats(usernames.codeforces);
            data.codeforces = response.data;
          } catch (err) {
            console.error("CodeForces fetch error:", err);
          }
        }

        if (usernames.codechef) {
          try {
            const response = await getCodeChefStats(usernames.codechef);
            data.codechef = response.data;
          } catch (err) {
            console.error("CodeChef fetch error:", err);
          }
        }

        if (usernames.geeksforgeeks) {
          try {
            const response = await getGeeksforGeeksStats(
              usernames.geeksforgeeks
            );
            data.geeksforgeeks = response.data;
          } catch (err) {
            console.error("GeeksforGeeks fetch error:", err);
          }
        }

        setPlatformData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching CodeFolio data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (Object.values(usernames).some((u) => u)) {
      fetchAllStats();
    } else {
      setLoading(false);
    }
  }, [usernames]);

  return { platformData, loading, error };
};
