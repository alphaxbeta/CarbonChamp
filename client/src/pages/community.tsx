import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CommunityAverage, CarbonFootprint } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { formatNumber, calculatePercentage } from "@/lib/utils";

interface CommunityProps {
  user: User;
}

export default function Community({ user }: CommunityProps) {
  const [showGlobalRanking, setShowGlobalRanking] = useState(false);
  
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
  
  const isLoading = loadingCommunity || loadingFootprints;
  
  // Mock leaderboard data - in a real app, this would come from an API
  const leaderboardData = [
    { rank: 1, name: "Sarah J.", initials: "SJ", points: 2345, footprint: 65 },
    { rank: 2, name: "Michael T.", initials: "MT", points: 2112, footprint: 72 },
    { rank: 3, name: "Priya K.", initials: "PK", points: 1978, footprint: 78 },
    { userRank: true, rank: userRanking, name: user.fullName || user.username, initials: user.avatarInitials || "JS", points: user.points || 350, footprint: latestFootprint?.totalEmissions || 115 },
    { rank: 15, name: "Alex N.", initials: "AN", points: 980, footprint: 125 },
    { rank: 16, name: "Taylor W.", initials: "TW", points: 945, footprint: 131 }
  ].sort((a, b) => a.rank - b.rank);
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold font-heading mb-2 dark:text-white">Community</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          See how your carbon footprint compares to others and get inspired!
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-heading">Carbon Footprint Comparison</CardTitle>
            </CardHeader>
            <CardContent>
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
                        {user.location || "Local"} Average
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
                  
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{comparisonDifference}%</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">Better than average</div>
                    </div>
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-center">
                      <div className="text-2xl font-bold dark:text-white mb-1">Top {userRanking}%</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">Local ranking</div>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">
                        {latestFootprint ? Math.round(latestFootprint.totalEmissions - (communityAverage?.ecoLeadersEmissions || 87)) : 28}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">kg from leaders</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-heading">Emission Breakdown</CardTitle>
                <Button variant="outline" size="sm">See Details</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Your Transport</span>
                      </div>
                      <span className="text-sm font-medium dark:text-white">
                        {latestFootprint?.transportEmissions || 42} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-neutral-400 mr-2"></div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Community Average</span>
                      </div>
                      <span className="text-sm font-medium dark:text-white">
                        {communityAverage?.transportEmissions || 75} kg
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${latestFootprint?.transportEmissions 
                          ? (latestFootprint.transportEmissions / (communityAverage?.transportEmissions || 75)) * 100 
                          : 56}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Your Food</span>
                      </div>
                      <span className="text-sm font-medium dark:text-white">
                        {latestFootprint?.foodEmissions || 20} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-neutral-400 mr-2"></div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Community Average</span>
                      </div>
                      <span className="text-sm font-medium dark:text-white">
                        {communityAverage?.foodEmissions || 45} kg
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-secondary h-2 rounded-full" 
                        style={{ width: `${latestFootprint?.foodEmissions 
                          ? (latestFootprint.foodEmissions / (communityAverage?.foodEmissions || 45)) * 100 
                          : 44}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Your Home</span>
                      </div>
                      <span className="text-sm font-medium dark:text-white">
                        {latestFootprint?.homeEmissions || 53} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-neutral-400 mr-2"></div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Community Average</span>
                      </div>
                      <span className="text-sm font-medium dark:text-white">
                        {communityAverage?.homeEmissions || 56} kg
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-accent h-2 rounded-full" 
                        style={{ width: `${latestFootprint?.homeEmissions 
                          ? (latestFootprint.homeEmissions / (communityAverage?.homeEmissions || 56)) * 100 
                          : 94}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-heading">Leaderboard</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant={showGlobalRanking ? "outline" : "default"} 
                    size="sm"
                    onClick={() => setShowGlobalRanking(false)}
                  >
                    Local
                  </Button>
                  <Button 
                    variant={showGlobalRanking ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setShowGlobalRanking(true)}
                  >
                    Global
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((person, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-3 rounded-lg ${person.userRank 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'bg-neutral-100 dark:bg-neutral-800'}`}
                  >
                    <div className="flex items-center">
                      <div className="w-6 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                        {person.rank}
                      </div>
                      <div className={`w-8 h-8 rounded-full ${person.userRank 
                        ? 'bg-primary-light' 
                        : 'bg-neutral-300 dark:bg-neutral-700'} text-white flex items-center justify-center text-sm`}>
                        {person.initials}
                      </div>
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${person.userRank ? 'font-medium' : ''} dark:text-white`}>
                          {person.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {person.points} pts
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mr-2">
                          {person.footprint} kg CO₂e
                        </div>
                        {person.rank === 1 && (
                          <div className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full flex items-center">
                            <i className="ri-trophy-line mr-0.5 text-[10px]"></i> Top
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                size="sm"
              >
                View Full Leaderboard
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-heading">Community Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatNumber(1345)}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Total kg CO₂e saved by community
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">
                    {formatNumber(237)}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Challenges completed this month
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <h3 className="font-medium text-center mb-3 dark:text-white">Your Impact</h3>
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-light">
                      <i className="ri-leaf-line text-3xl"></i>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      You've helped save <span className="font-medium text-primary-light">
                        {latestFootprint
                          ? formatNumber(Math.round((communityAverage?.totalEmissions || 176) - latestFootprint.totalEmissions))
                          : "61"}
                      </span> kg of CO₂e compared to the average person!
                    </p>
                    <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      That's equivalent to planting {latestFootprint
                        ? Math.round(((communityAverage?.totalEmissions || 176) - latestFootprint.totalEmissions) / 10)
                        : 6} trees!
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
