import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useQuery } from "@tanstack/react-query";
import { User, CarbonFootprint } from "@shared/schema";
import { formatNumber, getWeekDays } from "@/lib/utils";

interface CarbonFootprintSummaryProps {
  user: User;
}

type Period = "week" | "month" | "year";

export default function CarbonFootprintSummary({ user }: CarbonFootprintSummaryProps) {
  const [period, setPeriod] = useState<Period>("week");
  
  // Fetch carbon footprint data
  const { data: carbonFootprints, isLoading } = useQuery<CarbonFootprint[]>({
    queryKey: [`/api/user/${user.id}/carbon-footprint`, { period }],
    enabled: !!user.id
  });
  
  // Get the most recent carbon footprint
  const latestFootprint = carbonFootprints && carbonFootprints.length > 0 
    ? carbonFootprints[carbonFootprints.length - 1] 
    : null;
  
  // Calculate progress percentage
  const progressPercentage = latestFootprint && latestFootprint.targetEmissions
    ? Math.min(100, Math.round((latestFootprint.targetEmissions / latestFootprint.totalEmissions) * 100))
    : 68; // Default fallback value
  
  // Get week days for the x-axis
  const weekDays = getWeekDays();
  
  // Mock data for the chart - in a real app, this would come from the API
  // and we would have actual values for each day
  const chartData = carbonFootprints 
    ? carbonFootprints.map((footprint, index) => ({
        day: weekDays[index % 7], 
        value: footprint.totalEmissions, 
        target: footprint.targetEmissions || (footprint.totalEmissions * 0.8)
      }))
    : weekDays.map((day, index) => ({ 
        day, 
        value: 100 - (index * 5) + Math.random() * 20, 
        target: 70 - (index * 2) + Math.random() * 10
      }));
  
  // Function to handle period change
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };
  
  return (
    <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-heading dark:text-white">Your Carbon Footprint</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className={`px-3 py-1 text-xs rounded-full ${period === 'week' 
                ? 'bg-primary-light text-white' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              onClick={() => handlePeriodChange('week')}
            >
              Week
            </Button>
            <Button 
              size="sm"
              className={`px-3 py-1 text-xs rounded-full ${period === 'month' 
                ? 'bg-primary-light text-white' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              onClick={() => handlePeriodChange('month')}
            >
              Month
            </Button>
            <Button 
              size="sm"
              className={`px-3 py-1 text-xs rounded-full ${period === 'year' 
                ? 'bg-primary-light text-white' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              onClick={() => handlePeriodChange('year')}
            >
              Year
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <div className="flex-shrink-0 mb-6 md:mb-0">
            {isLoading ? (
              <div className="w-36 h-36 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
            ) : (
              <ProgressRing 
                progress={progressPercentage} 
                size={150}
                backgroundColor="hsl(var(--muted))"
                progressColor="hsl(var(--primary))"
              >
                <span className="text-3xl font-bold text-primary">{progressPercentage}%</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">of target</span>
              </ProgressRing>
            )}
            <div className="text-center mt-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {latestFootprint ? `${formatNumber(latestFootprint.totalEmissions)} kg CO₂e this ${period}` : `Loading ${period} data...`}
              </span>
            </div>
          </div>
          
          <div className="flex-grow w-full">
            <div className="h-64 w-full">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse text-neutral-400">Loading chart data...</div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  <div className="flex-grow relative">
                    {/* Visual chart bars */}
                    <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-2">
                      {chartData.map((item, index) => (
                        <div 
                          key={index} 
                          className="w-[10%] bg-neutral-200 dark:bg-neutral-800 rounded-t-sm h-[80%] relative group"
                        >
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm" 
                            style={{ height: `${Math.min(100, (item.value / 200) * 100)}%` }}
                          ></div>
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                            {formatNumber(item.value)} kg CO₂e
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3].map((_, index) => (
                        <div key={index} className="border-b border-neutral-100 dark:border-neutral-800 h-0"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between px-2 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {weekDays.map((day, index) => (
                      <div key={index}>{day}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {latestFootprint && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="ri-car-line text-xl text-primary"></i>
                  <span className="ml-2 text-sm font-medium dark:text-white">Transport</span>
                </div>
                <span className="text-sm font-bold dark:text-white">{formatNumber(latestFootprint.transportEmissions)}kg</span>
              </div>
            </div>
            
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="ri-home-line text-xl text-primary"></i>
                  <span className="ml-2 text-sm font-medium dark:text-white">Home</span>
                </div>
                <span className="text-sm font-bold dark:text-white">{formatNumber(latestFootprint.homeEmissions)}kg</span>
              </div>
            </div>
            
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="ri-restaurant-line text-xl text-primary"></i>
                  <span className="ml-2 text-sm font-medium dark:text-white">Food</span>
                </div>
                <span className="text-sm font-bold dark:text-white">{formatNumber(latestFootprint.foodEmissions)}kg</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
