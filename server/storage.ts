import {
  users,
  User,
  InsertUser,
  carbonFootprints,
  CarbonFootprint,
  InsertCarbonFootprint,
  challenges,
  Challenge,
  InsertChallenge,
  userChallenges,
  UserChallenge,
  InsertUserChallenge,
  achievements,
  Achievement,
  InsertAchievement,
  userAchievements,
  UserAchievement,
  InsertUserAchievement,
  userOnboarding,
  UserOnboarding,
  InsertUserOnboarding,
  ecoTips,
  EcoTip,
  InsertEcoTip,
  communityAverages,
  CommunityAverage,
  InsertCommunityAverage,
  CompleteOnboardingData
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Carbon footprint methods
  createCarbonFootprint(data: InsertCarbonFootprint): Promise<CarbonFootprint>;
  getCarbonFootprintsByUserId(userId: number): Promise<CarbonFootprint[]>;
  getCarbonFootprintForDateRange(userId: number, startDate: Date, endDate: Date): Promise<CarbonFootprint[]>;

  // Challenge methods
  getAllChallenges(): Promise<Challenge[]>;
  getChallengeById(id: number): Promise<Challenge | undefined>;
  createChallenge(data: InsertChallenge): Promise<Challenge>;
  getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]>;
  startUserChallenge(data: InsertUserChallenge): Promise<UserChallenge>;
  updateUserChallenge(id: number, data: Partial<UserChallenge>): Promise<UserChallenge | undefined>;

  // Achievement methods
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(data: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  awardAchievement(data: InsertUserAchievement): Promise<UserAchievement>;

  // Onboarding methods
  getUserOnboarding(userId: number): Promise<UserOnboarding | undefined>;
  createUserOnboarding(data: InsertUserOnboarding): Promise<UserOnboarding>;
  completeUserOnboarding(userId: number, data: CompleteOnboardingData): Promise<UserOnboarding>;

  // Eco tips methods
  getAllEcoTips(): Promise<EcoTip[]>;
  getRandomEcoTips(count: number): Promise<EcoTip[]>;
  createEcoTip(data: InsertEcoTip): Promise<EcoTip>;

  // Community data methods
  getCommunityAverageByLocation(location: string): Promise<CommunityAverage | undefined>;
  createCommunityAverage(data: InsertCommunityAverage): Promise<CommunityAverage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private carbonFootprints: Map<number, CarbonFootprint>;
  private challenges: Map<number, Challenge>;
  private userChallenges: Map<number, UserChallenge>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private userOnboardings: Map<number, UserOnboarding>;
  private ecoTips: Map<number, EcoTip>;
  private communityAverages: Map<number, CommunityAverage>;
  
  private currentUserId: number;
  private currentCarbonFootprintId: number;
  private currentChallengeId: number;
  private currentUserChallengeId: number;
  private currentAchievementId: number;
  private currentUserAchievementId: number;
  private currentUserOnboardingId: number;
  private currentEcoTipId: number;
  private currentCommunityAverageId: number;

  constructor() {
    this.users = new Map();
    this.carbonFootprints = new Map();
    this.challenges = new Map();
    this.userChallenges = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.userOnboardings = new Map();
    this.ecoTips = new Map();
    this.communityAverages = new Map();
    
    this.currentUserId = 1;
    this.currentCarbonFootprintId = 1;
    this.currentChallengeId = 1;
    this.currentUserChallengeId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    this.currentUserOnboardingId = 1;
    this.currentEcoTipId = 1;
    this.currentCommunityAverageId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed challenges
    const defaultChallenges: InsertChallenge[] = [
      {
        title: "Bike to Work Week",
        description: "Commute by bicycle for 5 days",
        category: "transport",
        icon: "ri-bike-line",
        durationDays: 7,
        pointsAwarded: 120,
        emissionReduction: 15.5
      },
      {
        title: "Plant-Based Diet",
        description: "Eat vegetarian for 3 days",
        category: "food",
        icon: "ri-restaurant-line",
        durationDays: 7,
        pointsAwarded: 80,
        emissionReduction: 10.2
      },
      {
        title: "Energy Saver",
        description: "Reduce electricity usage by 15%",
        category: "home",
        icon: "ri-plug-line",
        durationDays: 7,
        pointsAwarded: 150,
        emissionReduction: 20.0
      }
    ];
    
    defaultChallenges.forEach(challenge => this.createChallenge(challenge));
    
    // Seed achievements
    const defaultAchievements: InsertAchievement[] = [
      {
        title: "First Steps",
        description: "Complete your first eco-challenge",
        icon: "ri-seedling-line",
        pointsRequired: 50
      },
      {
        title: "Cycle Hero",
        description: "Complete 3 cycling challenges",
        icon: "ri-bike-line",
        pointsRequired: 300
      }
    ];
    
    defaultAchievements.forEach(achievement => this.createAchievement(achievement));
    
    // Seed eco tips
    const defaultEcoTips: InsertEcoTip[] = [
      {
        category: "home",
        tip: "Unplug electronics when not in use - they still consume power in standby mode!",
        icon: "ri-lightbulb-line"
      },
      {
        category: "home",
        tip: "Washing clothes in cold water saves energy and is gentler on fabrics.",
        icon: "ri-lightbulb-line"
      },
      {
        category: "transport",
        tip: "Properly inflated tires can improve your gas mileage by up to 3%.",
        icon: "ri-car-line"
      },
      {
        category: "food",
        tip: "Eating locally grown food reduces transportation emissions.",
        icon: "ri-restaurant-line"
      }
    ];
    
    defaultEcoTips.forEach(tip => this.createEcoTip(tip));
    
    // Seed community averages
    const defaultCommunityAverage: InsertCommunityAverage = {
      location: "Denver, CO",
      transportEmissions: 75.0,
      foodEmissions: 45.0,
      homeEmissions: 56.0,
      totalEmissions: 176.0,
      ecoLeadersEmissions: 87.0
    };
    
    this.createCommunityAverage(defaultCommunityAverage);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Carbon footprint methods
  async createCarbonFootprint(data: InsertCarbonFootprint): Promise<CarbonFootprint> {
    const id = this.currentCarbonFootprintId++;
    const footprint: CarbonFootprint = { ...data, id };
    this.carbonFootprints.set(id, footprint);
    return footprint;
  }

  async getCarbonFootprintsByUserId(userId: number): Promise<CarbonFootprint[]> {
    return Array.from(this.carbonFootprints.values()).filter(
      footprint => footprint.userId === userId
    );
  }

  async getCarbonFootprintForDateRange(userId: number, startDate: Date, endDate: Date): Promise<CarbonFootprint[]> {
    return Array.from(this.carbonFootprints.values()).filter(
      footprint => {
        const footprintDate = new Date(footprint.date);
        return footprint.userId === userId && 
               footprintDate >= startDate && 
               footprintDate <= endDate;
      }
    );
  }

  // Challenge methods
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(data: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const challenge: Challenge = { ...data, id };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]> {
    const userChallenges = Array.from(this.userChallenges.values()).filter(
      uc => uc.userId === userId
    );
    
    return userChallenges.map(uc => {
      const challenge = this.challenges.get(uc.challengeId)!;
      return { ...uc, challenge };
    });
  }

  async startUserChallenge(data: InsertUserChallenge): Promise<UserChallenge> {
    const id = this.currentUserChallengeId++;
    const userChallenge: UserChallenge = { ...data, id };
    this.userChallenges.set(id, userChallenge);
    return userChallenge;
  }

  async updateUserChallenge(id: number, data: Partial<UserChallenge>): Promise<UserChallenge | undefined> {
    const userChallenge = this.userChallenges.get(id);
    if (!userChallenge) return undefined;
    
    const updatedUserChallenge = { ...userChallenge, ...data };
    this.userChallenges.set(id, updatedUserChallenge);
    return updatedUserChallenge;
  }

  // Achievement methods
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async createAchievement(data: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...data, id };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievements.values()).filter(
      ua => ua.userId === userId
    );
    
    return userAchievements.map(ua => {
      const achievement = this.achievements.get(ua.achievementId)!;
      return { ...ua, achievement };
    });
  }

  async awardAchievement(data: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const userAchievement: UserAchievement = { ...data, id };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Onboarding methods
  async getUserOnboarding(userId: number): Promise<UserOnboarding | undefined> {
    return Array.from(this.userOnboardings.values()).find(
      onboarding => onboarding.userId === userId
    );
  }

  async createUserOnboarding(data: InsertUserOnboarding): Promise<UserOnboarding> {
    const id = this.currentUserOnboardingId++;
    const userOnboarding: UserOnboarding = { ...data, id };
    this.userOnboardings.set(id, userOnboarding);
    return userOnboarding;
  }

  async completeUserOnboarding(userId: number, data: CompleteOnboardingData): Promise<UserOnboarding> {
    const existingOnboarding = await this.getUserOnboarding(userId);
    let onboarding: UserOnboarding;
    
    if (existingOnboarding) {
      onboarding = {
        ...existingOnboarding,
        ...data,
        completed: true
      };
      this.userOnboardings.set(existingOnboarding.id, onboarding);
    } else {
      const id = this.currentUserOnboardingId++;
      onboarding = {
        id,
        userId,
        ...data,
        completed: true
      };
      this.userOnboardings.set(id, onboarding);
    }
    
    return onboarding;
  }

  // Eco tips methods
  async getAllEcoTips(): Promise<EcoTip[]> {
    return Array.from(this.ecoTips.values());
  }

  async getRandomEcoTips(count: number): Promise<EcoTip[]> {
    const allTips = Array.from(this.ecoTips.values());
    const shuffled = [...allTips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async createEcoTip(data: InsertEcoTip): Promise<EcoTip> {
    const id = this.currentEcoTipId++;
    const ecoTip: EcoTip = { ...data, id };
    this.ecoTips.set(id, ecoTip);
    return ecoTip;
  }

  // Community data methods
  async getCommunityAverageByLocation(location: string): Promise<CommunityAverage | undefined> {
    return Array.from(this.communityAverages.values()).find(
      average => average.location === location
    );
  }

  async createCommunityAverage(data: InsertCommunityAverage): Promise<CommunityAverage> {
    const id = this.currentCommunityAverageId++;
    const communityAverage: CommunityAverage = { ...data, id };
    this.communityAverages.set(id, communityAverage);
    return communityAverage;
  }
}

export const storage = new MemStorage();
