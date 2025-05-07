import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Achievement, UserAchievement } from "@shared/schema";

interface AchievementBadgesProps {
  user: User;
}

interface AchievementWithEarned extends Achievement {
  earned: boolean;
  dateEarned?: Date;
}

export default function AchievementBadges({ user }: AchievementBadgesProps) {
  // Fetch all achievements
  const { data: allAchievements, isLoading: loadingAchievements } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });
  
  // Fetch user's earned achievements
  const { data: userAchievements, isLoading: loadingUserAchievements } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: [`/api/user/${user.id}/achievements`],
    enabled: !!user.id
  });
  
  // Combine and process achievements data
  const processedAchievements: AchievementWithEarned[] = allAchievements 
    ? allAchievements.map(achievement => {
        const earned = userAchievements
          ? userAchievements.some(ua => ua.achievementId === achievement.id)
          : false;
        
        const userAchievement = userAchievements
          ? userAchievements.find(ua => ua.achievementId === achievement.id)
          : undefined;
        
        return {
          ...achievement,
          earned,
          dateEarned: userAchievement ? new Date(userAchievement.dateEarned) : undefined
        };
      })
    : [];
  
  // Take the first 3 achievements for display
  const displayAchievements = processedAchievements.slice(0, 3);
  
  // Calculate progress to next level
  const pointsToNextLevel = 500; // Example: 500 points per level
  const currentLevelProgress = user.points ? user.points % pointsToNextLevel : 0;
  const progressPercentage = (currentLevelProgress / pointsToNextLevel) * 100;
  
  const isLoading = loadingAchievements || loadingUserAchievements;
  
  return (
    <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-heading dark:text-white">Your Achievements</h2>
          <Link href="/profile">
            <a className="text-primary dark:text-primary-light text-sm font-medium flex items-center">
              View All <i className="ri-arrow-right-s-line ml-1"></i>
            </a>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-2"></div>
                <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {displayAchievements.map((achievement, index) => (
              <div key={achievement.id} className="flex flex-col items-center">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                    achievement.earned 
                      ? index === 0 
                        ? 'bg-primary-light text-white badge-glow' 
                        : 'bg-secondary text-white'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 relative'
                  }`}
                >
                  <i className={`${achievement.icon} text-2xl`}></i>
                  {!achievement.earned && (
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-neutral-400 dark:border-neutral-600"></div>
                  )}
                </div>
                <span className={`text-xs text-center ${
                  achievement.earned 
                    ? 'text-neutral-700 dark:text-neutral-300' 
                    : 'text-neutral-500 dark:text-neutral-500'
                }`}>
                  {achievement.title}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-light">
              <i className="ri-trophy-line"></i>
            </div>
            <div className="ml-3 flex-grow">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-white">Level {user.level} Eco-Warrior</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {currentLevelProgress}/{pointsToNextLevel} pts
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-primary-light h-1.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
