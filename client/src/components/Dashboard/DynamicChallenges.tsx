import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Challenge, UserChallenge } from "@shared/schema";
import { getDaysLeft } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DynamicChallengesProps {
  user: User;
}

interface ChallengeWithProgress extends UserChallenge {
  challenge: Challenge;
}

export default function DynamicChallenges({ user }: DynamicChallengesProps) {
  const { toast } = useToast();
  
  // Fetch user's active challenges
  const { 
    data: userChallenges, 
    isLoading,
    refetch 
  } = useQuery<ChallengeWithProgress[]>({
    queryKey: [`/api/user/${user.id}/challenges`],
    enabled: !!user.id
  });
  
  // Function to log progress for a challenge
  const logChallengeProgress = async (challengeId: number) => {
    try {
      const challenge = userChallenges?.find(uc => uc.id === challengeId);
      
      if (!challenge) return;
      
      // Increment progress
      const newProgress = challenge.progress + 1;
      const isCompleted = newProgress >= challenge.challenge.durationDays;
      
      await apiRequest("PATCH", `/api/user-challenge/${challengeId}`, {
        progress: newProgress,
        completed: isCompleted,
        pointsEarned: isCompleted ? challenge.challenge.pointsAwarded : 0,
        endDate: isCompleted ? new Date().toISOString() : undefined
      });
      
      // Refetch challenges to update UI
      refetch();
      
      toast({
        title: isCompleted ? "Challenge Completed!" : "Progress Logged!",
        description: isCompleted 
          ? `You've earned ${challenge.challenge.pointsAwarded} points!` 
          : `You're making progress on the ${challenge.challenge.title} challenge.`,
        variant: isCompleted ? "success" : "default"
      });
    } catch (error) {
      console.error("Error logging challenge progress:", error);
      toast({
        title: "Couldn't update challenge",
        description: "There was an error updating your challenge progress. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Get the color class based on the challenge category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "transport":
        return "border-primary";
      case "food":
        return "border-secondary";
      case "home":
        return "border-accent";
      default:
        return "border-neutral-400";
    }
  };
  
  // Get the icon background color class based on the challenge category
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "transport":
        return "bg-primary/20 text-primary";
      case "food":
        return "bg-secondary/20 text-secondary";
      case "home":
        return "bg-accent/20 text-accent";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };
  
  return (
    <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-heading dark:text-white">Your Eco-Challenges</h2>
          <Link href="/challenges">
            <a className="text-primary text-sm font-medium flex items-center">
              View All <i className="ri-arrow-right-s-line ml-1"></i>
            </a>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 h-[148px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userChallenges && userChallenges.slice(0, 3).map((userChallenge) => (
              <div 
                key={userChallenge.id} 
                className={`challenge-card bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 transition-all duration-200 border-l-4 ${getCategoryColor(userChallenge.challenge.category)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${getCategoryBgColor(userChallenge.challenge.category)} flex items-center justify-center`}>
                      <i className={`${userChallenge.challenge.icon} text-xl`}></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-neutral-800 dark:text-neutral-100">{userChallenge.challenge.title}</h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{userChallenge.challenge.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end">
                    <span className="text-xs font-medium text-primary dark:text-primary-light">
                      {userChallenge.progress}/{userChallenge.challenge.durationDays} days
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {userChallenge.challenge.pointsAwarded} pts
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        userChallenge.challenge.category === "transport"
                          ? "bg-primary"
                          : userChallenge.challenge.category === "food"
                          ? "bg-secondary"
                          : "bg-accent"
                      }`}
                      style={{ width: `${(userChallenge.progress / userChallenge.challenge.durationDays) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {userChallenge.completed 
                      ? "Completed" 
                      : `${getDaysLeft(new Date(new Date(userChallenge.startDate).getTime() + userChallenge.challenge.durationDays * 24 * 60 * 60 * 1000))} days left`}
                  </span>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="px-3 py-1 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    onClick={() => logChallengeProgress(userChallenge.id)}
                    disabled={userChallenge.completed}
                  >
                    {userChallenge.completed ? "Completed" : "Log Today"}
                  </Button>
                </div>
              </div>
            ))}
            
            <Link href="/challenges">
              <a className="challenge-card bg-neutral-100/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center text-center h-[148px]">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mb-2">
                  <i className="ri-add-line text-xl"></i>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Find a new challenge</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="mt-2 px-3 py-1 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  Browse Challenges
                </Button>
              </a>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
