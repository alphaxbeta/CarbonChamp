import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User, CommunityAverage, CarbonFootprint } from "@shared/schema";
import { formatNumber, calculatePercentage } from "@/lib/utils";

interface CommunityComparisonsProps {
  user: User;
}

type ComparisonType = "local" | "friends" | "global";

export default function CommunityComparisons({ user }: CommunityComparisonsProps) {
  const [comparisonType, setComparisonType] = useState<ComparisonType>("local");
  
  // Fetch community average data
  const { data: communityAverage, isLoading: loadingCommunity } = useQuery<CommunityAverage>({
    queryKey: [`/api/community-average`, { location: user.location || "Denver, CO" }],
    enabled: !!user.location
  });
  
  // Fetch user's carbon footprint data
  const { data: userFootprints, isLoading: loadingFootprints } = useQuery<CarbonFootprint[]>({
    queryKey: [`/api/user/${user.id}/carbon-footprint`],
    enabled: !!user.id
  });
  
  // Get the most recent user footprint
  const latestFootprint = userFootprints && userFootprints.length > 0 
    ? userFootprints[userFootprints.length - 1] 
    : null;
  
  // Calculate comparison percentages
  const userPercentage = latestFootprint && communityAverage 
    ? Math.round((latestFootprint.totalEmissions / communityAverage.totalEmissions) * 100)
    : 65;
  
  const comparisonDifference = latestFootprint && communityAverage 
    ? Math.round(((communityAverage.totalEmissions - latestFootprint.totalEmissions) / communityAverage.totalEmissions) * 100)
    : 35;
  
  const userRanking = comparisonDifference > 0 ? Math.round(100 - (comparisonDifference / 2)) : 50;
  
  // Function to handle comparison type change
  const handleComparisonTypeChange = (type: ComparisonType) => {
    setComparisonType(type);
  };
  
  const isLoading = loadingCommunity || loadingFootprints;
  
  return (
    <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-heading dark:text-white">Community Comparison</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm"
              className={`px-3 py-1 text-xs rounded-full ${comparisonType === 'local' 
                ? 'bg-primary-light text-white' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              onClick={() => handleComparisonTypeChange('local')}
            >
              Local
            </Button>
            <Button 
              size="sm"
              className={`px-3 py-1 text-xs rounded-full ${comparisonType === 'friends' 
                ? 'bg-primary-light text-white' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              onClick={() => handleComparisonTypeChange('friends')}
            >
              Friends
            </Button>
            <Button 
              size="sm"
              className={`px-3 py-1 text-xs rounded-full ${comparisonType === 'global' 
                ? 'bg-primary-light text-white' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              onClick={() => handleComparisonTypeChange('global')}
            >
              Global
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Your Footprint</span>
                <span className="text-sm font-medium dark:text-white">
                  {latestFootprint ? formatNumber(latestFootprint.totalEmissions) : "115"} kg CO₂e
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full" 
                  style={{ width: `${userPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {comparisonType === 'local' 
                    ? 'Local Average' 
                    : comparisonType === 'friends' 
                    ? 'Friends Average' 
                    : 'Global Average'}
                </span>
                <span className="text-sm font-medium dark:text-white">
                  {communityAverage ? formatNumber(communityAverage.totalEmissions) : "176"} kg CO₂e
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                <div 
                  className="bg-neutral-500 dark:bg-neutral-600 h-3 rounded-full" 
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Eco-Leaders Average</span>
                <span className="text-sm font-medium dark:text-white">
                  {communityAverage?.ecoLeadersEmissions 
                    ? formatNumber(communityAverage.ecoLeadersEmissions)
                    : "87"} kg CO₂e
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                <div 
                  className="bg-success h-3 rounded-full" 
                  style={{ width: `${communityAverage?.ecoLeadersEmissions 
                    ? calculatePercentage(communityAverage.ecoLeadersEmissions, communityAverage.totalEmissions) 
                    : 49}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <span className="font-medium text-primary dark:text-primary-light">Great job!</span> Your carbon footprint is{' '}
                <span className="font-medium">{comparisonDifference}% lower</span> than the local average. 
                You're in the top {userRanking}% of eco-friendly people in your area.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
