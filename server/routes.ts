import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCarbonFootprintSchema, 
  insertUserChallengeSchema,
  insertUserAchievementSchema,
  transportationSchema,
  housingSchema,
  dietSchema,
  lifestyleSchema,
  completeOnboardingSchema,
  WeatherSuggestion
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

// API to fetch weather data from OpenWeatherMap
async function getWeatherData(location: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY || "demo_key";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

// Generate weather-based suggestions based on current weather
function generateWeatherSuggestions(weatherData: any): WeatherSuggestion[] {
  const suggestions: WeatherSuggestion[] = [];
  
  if (!weatherData) return suggestions;
  
  const temp = weatherData.main.temp; // Temperature in Fahrenheit
  const weatherCondition = weatherData.weather[0]?.main?.toLowerCase();
  
  // Temperature-based suggestions
  if (temp > 60 && temp < 85) {
    suggestions.push({
      icon: "ri-bike-line",
      text: "Perfect biking weather! Leave your car at home today.",
      color: "primary",
      actionText: "View Route"
    });
  }
  
  if (temp > 68 && temp < 78) {
    suggestions.push({
      icon: "ri-windy-line",
      text: "Open windows instead of using A/C - save energy!",
      color: "secondary"
    });
  }
  
  // Weather condition-based suggestions
  if (weatherCondition === "sunny" || weatherCondition === "clear") {
    suggestions.push({
      icon: "ri-sun-line",
      text: "Great day to dry clothes outside instead of using the dryer.",
      color: "accent"
    });
  }
  
  if (weatherCondition === "rain") {
    suggestions.push({
      icon: "ri-water-flash-line",
      text: "Remember to collect rainwater for your plants!",
      color: "secondary"
    });
  }
  
  return suggestions;
}

// Calculate carbon footprint based on user inputs
function calculateCarbonFootprint(
  transportMode: string,
  homeEnergyUsage: string,
  dietType: string
) {
  let transportEmissions = 0;
  let homeEmissions = 0;
  let foodEmissions = 0;
  
  // Transport emissions (kg CO2e per day)
  switch (transportMode) {
    case 'car': transportEmissions = 12.0; break;
    case 'carpool': transportEmissions = 6.0; break;
    case 'public': transportEmissions = 4.0; break;
    case 'bike': transportEmissions = 0.5; break;
    case 'mixed': transportEmissions = 5.0; break;
    default: transportEmissions = 8.0;
  }
  
  // Home energy emissions (kg CO2e per day)
  switch (homeEnergyUsage) {
    case 'low': homeEmissions = 5.0; break;
    case 'medium': homeEmissions = 8.0; break;
    case 'high': homeEmissions = 12.0; break;
    case 'very_high': homeEmissions = 18.0; break;
    default: homeEmissions = 10.0;
  }
  
  // Food emissions (kg CO2e per day)
  switch (dietType) {
    case 'vegan': foodEmissions = 3.0; break;
    case 'vegetarian': foodEmissions = 4.0; break;
    case 'pescatarian': foodEmissions = 5.0; break;
    case 'low_meat': foodEmissions = 7.0; break;
    case 'regular': foodEmissions = 10.0; break;
    default: foodEmissions = 8.0;
  }
  
  const totalEmissions = transportEmissions + homeEmissions + foodEmissions;
  return {
    transportEmissions,
    homeEmissions,
    foodEmissions,
    totalEmissions,
    targetEmissions: totalEmissions * 0.8 // 20% reduction target
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API error handler middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);
    
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        error: "Validation Error", 
        message: validationError.message 
      });
    }
    
    res.status(500).json({ 
      error: "Server Error", 
      message: err.message || "An unexpected error occurred" 
    });
  };
  
  // User routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
      
      // Generate avatar initials from username
      const avatarInitials = userData.fullName 
        ? userData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : userData.username.substring(0, 2).toUpperCase();
      
      const user = await storage.createUser({
        ...userData,
        avatarInitials
      });
      
      res.status(201).json({ 
        id: user.id, 
        username: user.username,
        avatarInitials: user.avatarInitials
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ 
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        location: user.location,
        avatarInitials: user.avatarInitials,
        level: user.level,
        points: user.points
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Onboarding routes
  app.post("/api/onboarding/transportation", async (req, res) => {
    try {
      const { userId } = z.object({
        userId: z.number()
      }).parse(req.body);
      
      const transportData = transportationSchema.parse(req.body);
      
      let onboarding = await storage.getUserOnboarding(userId);
      
      if (onboarding) {
        onboarding = await storage.completeUserOnboarding(userId, {
          ...onboarding,
          ...transportData,
          lifestyleHabits: onboarding.lifestyleHabits || []
        });
      } else {
        onboarding = await storage.createUserOnboarding({
          userId,
          ...transportData,
          lifestyleHabits: [],
          completed: false
        });
      }
      
      res.json(onboarding);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/onboarding/housing", async (req, res) => {
    try {
      const { userId } = z.object({
        userId: z.number()
      }).parse(req.body);
      
      const housingData = housingSchema.parse(req.body);
      
      let onboarding = await storage.getUserOnboarding(userId);
      
      if (onboarding) {
        onboarding = await storage.completeUserOnboarding(userId, {
          ...onboarding,
          ...housingData,
          lifestyleHabits: onboarding.lifestyleHabits || []
        });
      } else {
        onboarding = await storage.createUserOnboarding({
          userId,
          ...housingData,
          lifestyleHabits: [],
          completed: false
        });
      }
      
      res.json(onboarding);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/onboarding/diet", async (req, res) => {
    try {
      const { userId } = z.object({
        userId: z.number()
      }).parse(req.body);
      
      const dietData = dietSchema.parse(req.body);
      
      let onboarding = await storage.getUserOnboarding(userId);
      
      if (onboarding) {
        onboarding = await storage.completeUserOnboarding(userId, {
          ...onboarding,
          ...dietData,
          lifestyleHabits: onboarding.lifestyleHabits || []
        });
      } else {
        onboarding = await storage.createUserOnboarding({
          userId,
          ...dietData,
          lifestyleHabits: [],
          completed: false
        });
      }
      
      res.json(onboarding);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/onboarding/lifestyle", async (req, res) => {
    try {
      const { userId } = z.object({
        userId: z.number()
      }).parse(req.body);
      
      const lifestyleData = lifestyleSchema.parse(req.body);
      
      let onboarding = await storage.getUserOnboarding(userId);
      
      if (onboarding) {
        onboarding = await storage.completeUserOnboarding(userId, {
          ...onboarding,
          ...lifestyleData
        });
      } else {
        onboarding = await storage.createUserOnboarding({
          userId,
          ...lifestyleData,
          completed: false
        });
      }
      
      res.json(onboarding);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/onboarding/complete", async (req, res) => {
    try {
      const { userId } = z.object({
        userId: z.number()
      }).parse(req.body);
      
      const onboardingData = completeOnboardingSchema.parse(req.body);
      
      // Complete onboarding
      const onboarding = await storage.completeUserOnboarding(userId, {
        ...onboardingData
      });
      
      // Calculate initial carbon footprint based on onboarding data
      const footprintData = calculateCarbonFootprint(
        onboardingData.transportationMode,
        onboardingData.homeEnergyUsage,
        onboardingData.dietType
      );
      
      // Insert initial carbon footprint
      const carbonFootprint = await storage.createCarbonFootprint({
        userId,
        date: new Date(),
        ...footprintData
      });
      
      res.json({
        onboarding,
        carbonFootprint
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Carbon footprint routes
  app.get("/api/user/:userId/carbon-footprint", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      // Get period from query params (default to 'week')
      const period = (req.query.period as string) || 'week';
      
      const now = new Date();
      let startDate = new Date();
      
      // Calculate date range based on period
      switch (period) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 7); // Default to week
      }
      
      const footprints = await storage.getCarbonFootprintForDateRange(userId, startDate, now);
      
      if (footprints.length === 0) {
        // If no data, create a default footprint
        const onboarding = await storage.getUserOnboarding(userId);
        
        if (onboarding) {
          const footprintData = calculateCarbonFootprint(
            onboarding.transportationMode || 'mixed',
            onboarding.homeEnergyUsage || 'medium',
            onboarding.dietType || 'regular'
          );
          
          const carbonFootprint = await storage.createCarbonFootprint({
            userId,
            date: new Date(),
            ...footprintData
          });
          
          res.json([carbonFootprint]);
        } else {
          res.json([]);
        }
      } else {
        res.json(footprints);
      }
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/carbon-footprint", async (req, res) => {
    try {
      const footprintData = insertCarbonFootprintSchema.parse(req.body);
      const carbonFootprint = await storage.createCarbonFootprint(footprintData);
      res.status(201).json(carbonFootprint);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Challenge routes
  app.get("/api/challenges", async (_req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/user/:userId/challenges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const userChallenges = await storage.getUserChallenges(userId);
      res.json(userChallenges);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/user-challenge", async (req, res) => {
    try {
      const userChallengeData = insertUserChallengeSchema.parse(req.body);
      
      // Check if user already has this challenge
      const userChallenges = await storage.getUserChallenges(userChallengeData.userId);
      const existingChallenge = userChallenges.find(uc => 
        uc.challengeId === userChallengeData.challengeId && !uc.completed
      );
      
      if (existingChallenge) {
        return res.status(409).json({ 
          error: "Challenge already active", 
          userChallenge: existingChallenge 
        });
      }
      
      const userChallenge = await storage.startUserChallenge(userChallengeData);
      const challenge = await storage.getChallengeById(userChallengeData.challengeId);
      
      res.status(201).json({ ...userChallenge, challenge });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.patch("/api/user-challenge/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid challenge ID" });
      }
      
      const updateData = z.object({
        progress: z.number().optional(),
        completed: z.boolean().optional(),
        pointsEarned: z.number().optional(),
        endDate: z.string().optional().transform(val => new Date(val))
      }).parse(req.body);
      
      const updatedChallenge = await storage.updateUserChallenge(id, updateData);
      
      if (!updatedChallenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      // If challenge was completed, update user points
      if (updateData.completed && updateData.pointsEarned) {
        const user = await storage.getUser(updatedChallenge.userId);
        if (user) {
          const updatedUser = await storage.updateUser(user.id, {
            points: (user.points || 0) + updateData.pointsEarned
          });
          
          // Check for achievements
          if (updatedUser) {
            const totalPoints = updatedUser.points || 0;
            const achievements = await storage.getAllAchievements();
            
            for (const achievement of achievements) {
              if (totalPoints >= achievement.pointsRequired) {
                // Check if user already has this achievement
                const userAchievements = await storage.getUserAchievements(user.id);
                const hasAchievement = userAchievements.some(ua => 
                  ua.achievementId === achievement.id
                );
                
                if (!hasAchievement) {
                  await storage.awardAchievement({
                    userId: user.id,
                    achievementId: achievement.id,
                    dateEarned: new Date()
                  });
                }
              }
            }
          }
        }
      }
      
      const challenge = await storage.getChallengeById(updatedChallenge.challengeId);
      res.json({ ...updatedChallenge, challenge });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Achievement routes
  app.get("/api/achievements", async (_req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/user/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/user-achievement", async (req, res) => {
    try {
      const userAchievementData = insertUserAchievementSchema.parse(req.body);
      const userAchievement = await storage.awardAchievement(userAchievementData);
      const achievement = await storage.getAllAchievements().then(
        all => all.find(a => a.id === userAchievementData.achievementId)
      );
      
      res.status(201).json({ ...userAchievement, achievement });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Eco tips routes
  app.get("/api/eco-tips", async (req, res) => {
    try {
      const count = req.query.count ? parseInt(req.query.count as string) : 2;
      const randomTips = await storage.getRandomEcoTips(count);
      res.json(randomTips);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Community comparison routes
  app.get("/api/community-average", async (req, res) => {
    try {
      const location = (req.query.location as string) || "Denver, CO";
      const average = await storage.getCommunityAverageByLocation(location);
      
      if (!average) {
        return res.status(404).json({ error: "Data not found for this location" });
      }
      
      res.json(average);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Weather-based suggestions route
  app.get("/api/weather-suggestions", async (req, res) => {
    try {
      const location = (req.query.location as string) || "Denver, CO";
      const weatherData = await getWeatherData(location);
      
      if (!weatherData) {
        return res.status(503).json({ 
          error: "Weather data unavailable", 
          suggestions: [] 
        });
      }
      
      const suggestions = generateWeatherSuggestions(weatherData);
      
      res.json({
        weather: {
          location,
          temperature: weatherData.main.temp,
          condition: weatherData.weather[0]?.main || "Unknown",
          description: weatherData.weather[0]?.description || "Unknown weather",
          icon: weatherData.weather[0]?.icon || "01d"
        },
        suggestions
      });
    } catch (err) {
      handleError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
