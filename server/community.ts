import express from "express";
const app = express();


function calculateAStarScore(user: any): number {
  const g = user.stepsTaken || 0; 
  const h = user.goalSteps - user.stepsTaken; 
  return g + h;
}


function assignReward(score: number): string {
  if (score < 5000) return "Bronze";
  if (score < 10000) return "Silver";
  return "Gold";
}

app.get("/api/community-average", async (req, res) => {
  try {
    const location = (req.query.location as string) || "Denver, CO";

    const average = await storage.getCommunityAverageByLocation(location);
    const users = await storage.getUsersByLocation(location);

    if (!average || !users || users.length === 0) {
      return res.status(404).json({ error: "Data not found for this location" });
    }

    // Compute A* scores and rewards
    const leaderboard = users.map(user => {
      const score = calculateAStarScore(user);
      const reward = assignReward(score);
      return {
        userId: user.id,
        name: user.name,
        score,
        reward
      };
    });

    // Sort leaderboard by highest score
    leaderboard.sort((a, b) => b.score - a.score);

    res.json({
      communityAverage: average,
      leaderboard
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
});
