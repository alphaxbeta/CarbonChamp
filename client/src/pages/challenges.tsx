import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Challenge, UserChallenge } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getDaysLeft } from "@/lib/utils";

interface ChallengesProps {
  user: User;
}

interface ChallengeWithProgress extends UserChallenge {
  challenge: Challenge;
}

type ChallengeCategory = 'all' | 'transport' | 'food' | 'home' | 'active' | 'completed';

export default function Challenges({ user }: ChallengesProps) {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('all');
  const { toast } = useToast();
  
  // Fetch all challenges
  const { data: allChallenges, isLoading: loadingChallenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });
  
  // Fetch user's challenges
  const { 
    data: userChallenges, 
    isLoading: loadingUserChallenges,
    refetch: refetchUserChallenges
  } = useQuery<ChallengeWithProgress[]>({
    queryKey: [`/api/user/${user.id}/challenges`],
    enabled: !!user.id
  });
  
  const isLoading = loadingChallenges || loadingUserChallenges;
  
  // Filter challenges based on selected category
  const filteredChallenges = allChallenges ? allChallenges.filter(challenge => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'transport' || selectedCategory === 'food' || selectedCategory === 'home') {
      return challenge.category === selectedCategory;
    }
    return true;
  }) : [];
  
  // Join user challenges with all challenges
  const processedChallenges = filteredChallenges.map(challenge => {
    // Check if this challenge is already taken by the user
    const userChallenge = userChallenges?.find(uc => uc.challengeId === challenge.id);
    
    // Filter based on active/completed status if those categories are selected
    if (selectedCategory === 'active' && (!userChallenge || userChallenge.completed)) return null;
    if (selectedCategory === 'completed' && (!userChallenge || !userChallenge.completed)) return null;
    
    return {
      ...challenge,
      userChallenge
    };
  }).filter(Boolean); // Remove null items
  
  // Function to start a new challenge
  const startChallenge = async (challengeId: number) => {
    try {
      await apiRequest("POST", "/api/user-challenge", {
        userId: user.id,
        challengeId,
        startDate: new Date(),
        progress: 0,
        completed: false,
        pointsEarned: 0
      });
      
      // Refetch user challenges after starting a new one
      refetchUserChallenges();
      
      toast({
        title: "Challenge Started!",
        description: "Your new eco-challenge has been added to your dashboard.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error starting challenge:", error);
      toast({
        title: "Couldn't Start Challenge",
        description: "There was an error starting this challenge. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Function to log progress for a challenge
  const logChallengeProgress = async (userChallengeId: number, challenge: Challenge, currentProgress: number) => {
    try {
      // Increment progress
      const newProgress = currentProgress + 1;
      const isCompleted = newProgress >= challenge.durationDays;
      
      await apiRequest("PATCH", `/api/user-challenge/${userChallengeId}`, {
        progress: newProgress,
        completed: isCompleted,
        pointsEarned: isCompleted ? challenge.pointsAwarded : 0,
        endDate: isCompleted ? new Date().toISOString() : undefined
      });
      
      // Refetch user challenges to update UI
      refetchUserChallenges();
      
      toast({
        title: isCompleted ? "Challenge Completed!" : "Progress Logged!",
        description: isCompleted 
          ? `You've earned ${challenge.pointsAwarded} points!` 
          : `You're making progress on the ${challenge.title} challenge.`,
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
  
  // Get the color for challenge category
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
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "transport":
        return "ri-bike-line";
      case "food":
        return "ri-restaurant-line";
      case "home":
        return "ri-home-line";
      default:
        return "ri-leaf-line";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold font-heading mb-2 dark:text-white">Eco-Challenges</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Complete challenges to reduce your carbon footprint and earn points!
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <Button 
          onClick={() => setSelectedCategory('all')}
          className={selectedCategory === 'all' 
            ? 'bg-primary text-white' 
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }
          size="sm"
        >
          All
        </Button>
        <Button 
          onClick={() => setSelectedCategory('active')}
          className={selectedCategory === 'active' 
            ? 'bg-primary text-white' 
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }
          size="sm"
        >
          My Active Challenges
        </Button>
        <Button 
          onClick={() => setSelectedCategory('completed')}
          className={selectedCategory === 'completed' 
            ? 'bg-primary text-white' 
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }
          size="sm"
        >
          Completed
        </Button>
        <Button 
          onClick={() => setSelectedCategory('transport')}
          className={selectedCategory === 'transport' 
            ? 'bg-primary text-white' 
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }
          size="sm"
        >
          <i className="ri-bike-line mr-1"></i> Transportation
        </Button>
        <Button 
          onClick={() => setSelectedCategory('food')}
          className={selectedCategory === 'food' 
            ? 'bg-primary text-white' 
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }
          size="sm"
        >
          <i className="ri-restaurant-line mr-1"></i> Food
        </Button>
        <Button 
          onClick={() => setSelectedCategory('home')}
          className={selectedCategory === 'home' 
            ? 'bg-primary text-white' 
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }
          size="sm"
        >
          <i className="ri-home-line mr-1"></i> Home
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl shadow-md">
              <CardContent className="p-0">
                <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-t-xl"></div>
                <div className="p-5">
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full mb-4"></div>
                  <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : processedChallenges.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl shadow-md">
          <div className="flex justify-center mb-4">
            <i className="ri-search-line text-6xl text-neutral-300 dark:text-neutral-700"></i>
          </div>
          <h3 className="text-xl font-medium mb-2 dark:text-white">No challenges found</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {selectedCategory === 'active' 
              ? "You don't have any active challenges yet. Start one to begin tracking your progress!" 
              : selectedCategory === 'completed' 
              ? "You haven't completed any challenges yet. Keep up the good work and come back later!"
              : "No challenges available for this category. Check back later for new challenges."}
          </p>
          {selectedCategory !== 'all' && (
            <Button 
              onClick={() => setSelectedCategory('all')}
              className="mt-4 bg-primary text-white"
            >
              View All Challenges
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedChallenges.map((challengeData: any) => (
            <Card 
              key={challengeData.id} 
              className={`challenge-card bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden border-t-4 ${getCategoryColor(challengeData.category)}`}
            >
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${getCategoryBgColor(challengeData.category)} flex items-center justify-center`}>
                        <i className={`${challengeData.icon || getCategoryIcon(challengeData.category)} text-xl`}></i>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-neutral-800 dark:text-neutral-100">{challengeData.title}</h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{challengeData.description}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        {challengeData.pointsAwarded} pts
                      </span>
                    </div>
                  </div>
                  
                  {challengeData.userChallenge && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-primary dark:text-primary-light">
                          {challengeData.userChallenge.progress}/{challengeData.durationDays} days
                        </span>
                        {challengeData.userChallenge.completed && (
                          <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                            Completed!
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            challengeData.category === "transport"
                              ? "bg-primary"
                              : challengeData.category === "food"
                              ? "bg-secondary"
                              : "bg-accent"
                          }`}
                          style={{ width: `${(challengeData.userChallenge.progress / challengeData.durationDays) * 100}%` }}
                        ></div>
                      </div>
                      
                      {!challengeData.userChallenge.completed && (
                        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {getDaysLeft(new Date(new Date(challengeData.userChallenge.startDate).getTime() + challengeData.durationDays * 24 * 60 * 60 * 1000))} days left
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      <i className="ri-time-line mr-1"></i> {challengeData.durationDays} days
                    </div>
                    
                    {!challengeData.userChallenge ? (
                      <Button 
                        onClick={() => startChallenge(challengeData.id)}
                        className="px-3 py-1 bg-primary text-white text-xs rounded-lg"
                        size="sm"
                      >
                        Start Challenge
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => logChallengeProgress(
                          challengeData.userChallenge.id, 
                          challengeData,
                          challengeData.userChallenge.progress
                        )}
                        className="px-3 py-1 text-xs rounded-lg"
                        variant={challengeData.userChallenge.completed ? "outline" : "default"}
                        size="sm"
                        disabled={challengeData.userChallenge.completed}
                      >
                        {challengeData.userChallenge.completed ? "Completed" : "Log Progress"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
