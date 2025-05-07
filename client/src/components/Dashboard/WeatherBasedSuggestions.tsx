import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { fetchWeatherData, getWeatherIcon } from "@/lib/openWeatherMap";

interface WeatherBasedSuggestionsProps {
  user: User;
}

export default function WeatherBasedSuggestions({ user }: WeatherBasedSuggestionsProps) {
  // Use user's location or fallback to Denver, CO
  const location = user.location || "Denver, CO";
  
  // Fetch weather data and suggestions
  const { data: weatherResponse, isLoading, error } = useQuery({
    queryKey: [`/api/weather-suggestions`, { location }],
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!location
  });
  
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading dark:text-white">Today's Weather</h2>
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">{location}</span>
          </div>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-neutral-400">Loading weather data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !weatherResponse) {
    return (
      <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading dark:text-white">Today's Weather</h2>
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">{location}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <i className="ri-cloudy-line text-4xl text-neutral-400 mb-2"></i>
            <p className="text-neutral-600 dark:text-neutral-400">
              Weather data unavailable at the moment.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3" 
              onClick={() => window.location.reload()}
            >
              <i className="ri-refresh-line mr-1"></i> Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { weather, suggestions } = weatherResponse;
  
  return (
    <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-heading dark:text-white">Today's Weather</h2>
          <span className="text-neutral-500 dark:text-neutral-400 text-sm">{weather.location}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <i className={`${getWeatherIcon(weather.icon)} text-4xl text-accent dark:text-accent-light`}></i>
          </div>
          <div className="ml-2">
            <div className="text-3xl font-semibold dark:text-white">{Math.round(weather.temperature)}°F</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {weather.condition}, {weather.description}
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-2">
          <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">Eco Suggestions</h3>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`flex items-start p-3 bg-${suggestion.color}/10 rounded-lg`}
              >
                <div className={`flex-shrink-0 text-${suggestion.color}`}>
                  <i className={`${suggestion.icon} text-xl`}></i>
                </div>
                <div className="ml-3">
                  <p className="text-neutral-800 dark:text-neutral-200 text-sm">{suggestion.text}</p>
                  {suggestion.actionText && (
                    <div className="mt-1 flex">
                      <button className={`text-xs text-${suggestion.color} font-medium`}>
                        {suggestion.actionText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* If no suggestions are available */}
            {suggestions.length === 0 && (
              <div className="flex items-start p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <div className="flex-shrink-0 text-neutral-500">
                  <i className="ri-information-line text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-neutral-800 dark:text-neutral-200 text-sm">
                    No weather-based suggestions available at the moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
