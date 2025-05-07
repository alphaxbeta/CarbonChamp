import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, UserAchievement, Achievement } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  // Fetch user's achievements
  const { data: userAchievements, isLoading: loadingAchievements } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: [`/api/user/${user.id}/achievements`],
    enabled: !!user.id
  });
  
  // Fetch user's carbon footprint history
  const { data: footprintHistory, isLoading: loadingFootprints } = useQuery({
    queryKey: [`/api/user/${user.id}/carbon-footprint`],
    enabled: !!user.id
  });
  
  // Calculate total emissions saved
  const totalEmissionsSaved = footprintHistory && footprintHistory.length > 1
    ? footprintHistory[0].totalEmissions - footprintHistory[footprintHistory.length - 1].totalEmissions
    : 0;
  
  // Calculate stats
  const completedChallenges = 5; // This would come from an API in a real app
  const streak = 12; // Days - this would come from an API in a real app
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading mb-2 dark:text-white">My Profile</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Track your progress and achievements
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <i className="ri-settings-4-line mr-1"></i> Settings
          </Button>
          <Button variant="default">
            <i className="ri-share-line mr-1"></i> Share Progress
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardHeader className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center text-white text-3xl">
                {user.avatarInitials}
              </div>
              <div>
                <CardTitle className="text-2xl font-heading dark:text-white">{user.fullName || user.username}</CardTitle>
                <div className="text-neutral-600 dark:text-neutral-400 mt-1">
                  <div className="flex items-center">
                    <i className="ri-map-pin-line mr-1"></i> {user.location || "Denver, CO"}
                  </div>
                  <div className="flex items-center mt-1">
                    <i className="ri-award-line mr-1"></i> Level {user.level} Eco-Warrior
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <div className="bg-primary-light/10 px-3 py-1 rounded-full text-primary-light font-medium text-sm flex items-center">
                    <i className="ri-copper-coin-line mr-1"></i> {user.points || 350} points
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold dark:text-white">{formatNumber(totalEmissionsSaved || 61)}</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">kg CO₂e saved</div>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold dark:text-white">{completedChallenges}</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Challenges completed</div>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold dark:text-white">{streak}</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Day streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Carbon Footprint History</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFootprints ? (
                <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
              ) : (
                <div className="space-y-6">
                  <div className="h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center text-neutral-500">
                      {footprintHistory && footprintHistory.length > 0 ? (
                        <span>Chart with historical data would be displayed here</span>
                      ) : (
                        <span>No historical data available yet</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <i className="ri-download-line mr-1"></i> Export Data
                    </Button>
                    <Button className="w-full">
                      <i className="ri-line-chart-line mr-1"></i> Detailed Analysis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-heading">My Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAchievements ? (
                <div className="grid grid-cols-2 gap-4 animate-pulse">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-2"></div>
                      <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : userAchievements && userAchievements.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {userAchievements.map(ua => (
                    <div key={ua.id} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary-light text-white flex items-center justify-center mb-2">
                        <i className={`${ua.achievement.icon} text-2xl`}></i>
                      </div>
                      <span className="text-xs text-center text-neutral-700 dark:text-neutral-300">
                        {ua.achievement.title}
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                        {new Date(ua.dateEarned).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                    <i className="ri-trophy-line text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2 dark:text-white">No achievements yet</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Complete challenges to earn your first achievement!
                  </p>
                  <Button className="mt-4">Browse Challenges</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center mr-3">
                        <span className="text-lg">{user.level}</span>
                      </div>
                      <div>
                        <div className="font-medium dark:text-white">Level {user.level}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Eco Warrior</div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {user.points || 350}/500 pts
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-primary-light h-2 rounded-full" 
                      style={{ width: `${user.points ? (user.points % 500) / 5 : 70}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <div>Level {user.level}</div>
                    <div>Level {user.level + 1}</div>
                  </div>
                </div>
                
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                  <h3 className="font-medium mb-3 dark:text-white">Next Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-light mr-3">
                        <i className="ri-trophy-line"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium dark:text-white">Special Badge</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Level {user.level + 1}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-light mr-3">
                        <i className="ri-award-line"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium dark:text-white">New Challenge Types</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Level {user.level + 1}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <i className="ri-question-line mr-1"></i> How to Level Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
