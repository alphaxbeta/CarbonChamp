import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { EcoTip } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { ECO_TIPS } from "@/lib/constants";
import { getRandomItem } from "@/lib/utils";

interface EcoTipsProps {}

export default function EcoTips({}: EcoTipsProps) {
  // Fetch random eco tips
  const { data: tips, isLoading, refetch } = useQuery<EcoTip[]>({
    queryKey: ['/api/eco-tips', { count: 2 }],
  });
  
  // Function to get new random tips
  const handleRefreshTips = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/eco-tips'] });
  };
  
  // Fallback to local tips if API request fails
  const getFallbackTips = () => {
    const categories = Object.keys(ECO_TIPS) as Array<keyof typeof ECO_TIPS>;
    const randomCategory1 = categories[Math.floor(Math.random() * categories.length)];
    const randomCategory2 = categories[Math.floor(Math.random() * categories.length)];
    
    return [
      getRandomItem(ECO_TIPS[randomCategory1]),
      getRandomItem(ECO_TIPS[randomCategory2])
    ];
  };
  
  const displayTips = tips && tips.length > 0 ? tips : getFallbackTips();
  
  return (
    <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold font-heading dark:text-white">Eco Tips</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshTips}
            className="text-primary dark:text-primary-light text-sm font-medium flex items-center p-0 h-auto"
          >
            Refresh <i className="ri-refresh-line ml-1"></i>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="p-3 bg-neutral-200 dark:bg-neutral-800 rounded-lg h-20"></div>
            <div className="p-3 bg-neutral-200 dark:bg-neutral-800 rounded-lg h-20"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTips.map((tip, index) => (
              <div key={index} className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-primary dark:text-primary-light mt-1">
                    <i className={tip.icon}></i>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 ml-3">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 flex">
          <Button 
            className="w-full py-2 text-center text-sm bg-primary-light/10 text-primary-light hover:bg-primary-light/20 flex items-center justify-center"
          >
            <i className="ri-chat-1-line mr-1"></i> Ask Eco Assistant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
