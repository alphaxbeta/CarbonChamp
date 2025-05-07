import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for storing basic user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  location: text("location"),
  avatarInitials: text("avatar_initials"),
  level: integer("level").default(1),
  points: integer("points").default(0),
});

// Carbon footprint data
export const carbonFootprints = pgTable("carbon_footprints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull().defaultNow(),
  transportEmissions: real("transport_emissions").notNull(),
  foodEmissions: real("food_emissions").notNull(),
  homeEmissions: real("home_emissions").notNull(),
  totalEmissions: real("total_emissions").notNull(),
  targetEmissions: real("target_emissions"),
});

// Challenge definitions
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // transport, food, home, etc.
  icon: text("icon").notNull(),
  durationDays: integer("duration_days").notNull(),
  pointsAwarded: integer("points_awarded").notNull(),
  emissionReduction: real("emission_reduction"),
});

// User challenge participations
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  progress: integer("progress").default(0), // e.g., 3 out of 5 days
  completed: boolean("completed").default(false),
  pointsEarned: integer("points_earned").default(0),
});

// Achievements/badges
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  pointsRequired: integer("points_required").notNull(),
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  dateEarned: timestamp("date_earned").notNull().defaultNow(),
});

// User onboarding info
export const userOnboarding = pgTable("user_onboarding", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  transportationMode: text("transportation_mode"),
  homeEnergyUsage: text("home_energy_usage"),
  dietType: text("diet_type"),
  lifestyleHabits: json("lifestyle_habits"),
  completed: boolean("completed").default(false),
});

// Tips database
export const ecoTips = pgTable("eco_tips", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // transport, food, home, etc.
  tip: text("tip").notNull(),
  icon: text("icon").notNull(),
});

// Community average data (for comparisons)
export const communityAverages = pgTable("community_averages", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  transportEmissions: real("transport_emissions").notNull(),
  foodEmissions: real("food_emissions").notNull(),
  homeEmissions: real("home_emissions").notNull(),
  totalEmissions: real("total_emissions").notNull(),
  ecoLeadersEmissions: real("eco_leaders_emissions"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCarbonFootprintSchema = createInsertSchema(carbonFootprints).omit({ id: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true });
export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({ id: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true });
export const insertUserOnboardingSchema = createInsertSchema(userOnboarding).omit({ id: true });
export const insertEcoTipSchema = createInsertSchema(ecoTips).omit({ id: true });
export const insertCommunityAverageSchema = createInsertSchema(communityAverages).omit({ id: true });

// Create types for insert and select
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCarbonFootprint = z.infer<typeof insertCarbonFootprintSchema>;
export type CarbonFootprint = typeof carbonFootprints.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertUserOnboarding = z.infer<typeof insertUserOnboardingSchema>;
export type UserOnboarding = typeof userOnboarding.$inferSelect;

export type InsertEcoTip = z.infer<typeof insertEcoTipSchema>;
export type EcoTip = typeof ecoTips.$inferSelect;

export type InsertCommunityAverage = z.infer<typeof insertCommunityAverageSchema>;
export type CommunityAverage = typeof communityAverages.$inferSelect;

// Onboarding schemas for validation
export const transportationSchema = z.object({
  transportationMode: z.enum(['car', 'carpool', 'public', 'bike', 'mixed']),
});

export const housingSchema = z.object({
  homeEnergyUsage: z.enum(['low', 'medium', 'high', 'very_high']),
});

export const dietSchema = z.object({
  dietType: z.enum(['vegan', 'vegetarian', 'pescatarian', 'low_meat', 'regular']),
});

export const lifestyleSchema = z.object({
  lifestyleHabits: z.array(z.string()),
});

export const completeOnboardingSchema = transportationSchema
  .merge(housingSchema)
  .merge(dietSchema)
  .merge(lifestyleSchema);

export type TransportationData = z.infer<typeof transportationSchema>;
export type HousingData = z.infer<typeof housingSchema>;
export type DietData = z.infer<typeof dietSchema>;
export type LifestyleData = z.infer<typeof lifestyleSchema>;
export type CompleteOnboardingData = z.infer<typeof completeOnboardingSchema>;

// Weather-based suggestion type
export type WeatherSuggestion = {
  icon: string;
  text: string;
  color: 'primary' | 'secondary' | 'accent';
  actionText?: string;
  actionUrl?: string;
};
