import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import WelcomeHero from "@/components/Dashboard/WelcomeHero";
import CarbonFootprintSummary from "@/components/Dashboard/CarbonFootprintSummary";
import DynamicChallenges from "@/components/Dashboard/DynamicChallenges";
import CommunityComparisons from "@/components/Dashboard/CommunityComparisons";
import WeatherBasedSuggestions from "@/components/Dashboard/WeatherBasedSuggestions";
import AchievementBadges from "@/components/Dashboard/AchievementBadges";
import EcoTips from "@/components/Dashboard/EcoTips";
import DashboardSkeleton from "@/components/Dashboard/DashboardSkeleton";
import { useQuery } from "@tanstack/react-query";

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulating initial load time for dashboard components
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Check if user has completed onboarding
  const { data: onboardingData } = useQuery({
    queryKey: [`/api/user/${user.id}/onboarding`],
    enabled: !!user.id
  });
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WelcomeHero user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CarbonFootprintSummary user={user} />
          <DynamicChallenges user={user} />
          <CommunityComparisons user={user} />
        </div>
        
        <div>
          <WeatherBasedSuggestions user={user} />
          <AchievementBadges user={user} />
          <EcoTips />
        </div>
      </div>
    </div>
  );
}
