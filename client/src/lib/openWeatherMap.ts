import { WEATHER_SUGGESTIONS } from "./constants";
import { WeatherSuggestion } from "@shared/schema";

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
}

export interface WeatherResponse {
  weather: WeatherData;
  suggestions: WeatherSuggestion[];
}

export async function fetchWeatherData(location: string): Promise<WeatherResponse | null> {
  try {
    const response = await fetch(`/api/weather-suggestions?location=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export function getTemperatureCategory(temp: number): 'COLD' | 'MILD' | 'WARM' | 'HOT' {
  if (temp < 45) return 'COLD';
  if (temp < 68) return 'MILD';
  if (temp < 80) return 'WARM';
  return 'HOT';
}

export function getWeatherConditionCategory(condition: string): keyof typeof WEATHER_SUGGESTIONS.CONDITION {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) return 'CLEAR';
  if (conditionLower.includes('cloud')) return 'CLOUDS';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'RAIN';
  if (conditionLower.includes('snow')) return 'SNOW';
  if (conditionLower.includes('thunder')) return 'THUNDERSTORM';
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) return 'FOG';
  
  // Default to CLEAR if unrecognized
  return 'CLEAR';
}

export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'ri-sun-line',
    '01n': 'ri-moon-clear-line',
    '02d': 'ri-sun-cloudy-line',
    '02n': 'ri-moon-cloudy-line',
    '03d': 'ri-cloud-line',
    '03n': 'ri-cloud-line',
    '04d': 'ri-cloudy-line',
    '04n': 'ri-cloudy-line',
    '09d': 'ri-drizzle-line',
    '09n': 'ri-drizzle-line',
    '10d': 'ri-rainy-line',
    '10n': 'ri-rainy-line',
    '11d': 'ri-thunderstorms-line',
    '11n': 'ri-thunderstorms-line',
    '13d': 'ri-snowy-line',
    '13n': 'ri-snowy-line',
    '50d': 'ri-mist-line',
    '50n': 'ri-mist-line',
  };
  
  return iconMap[iconCode] || 'ri-sun-line';
}

export function generateWeatherSuggestions(weather: WeatherData): WeatherSuggestion[] {
  if (!weather) return [];
  
  const tempCategory = getTemperatureCategory(weather.temperature);
  const conditionCategory = getWeatherConditionCategory(weather.condition);
  
  // Get suggestions based on temperature and condition
  const tempSuggestions = WEATHER_SUGGESTIONS.TEMPERATURE[tempCategory] || [];
  const conditionSuggestions = WEATHER_SUGGESTIONS.CONDITION[conditionCategory] || [];
  
  // Combine and shuffle suggestions, then take the first 2
  const combinedSuggestions = [...tempSuggestions, ...conditionSuggestions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);
  
  return combinedSuggestions;
}
