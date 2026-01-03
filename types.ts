export interface User {
  id: string;
  email: string;
}

export enum FreshnessLevel {
  FRESH = 'Fresh',
  ACCEPTABLE = 'Acceptable',
  SPOILED = 'Spoiled',
  UNKNOWN = 'Unknown'
}

export interface DetectedFoodItem {
  name: string;
  confidence: number;
  estimatedWeightGrams: number;
  caloriesPer100g: number;
  totalCalories: number;
  freshness: FreshnessLevel;
  freshnessScore: number; // 0 to 1
  reasoning?: string;
}

export interface AnalysisResult {
  items: DetectedFoodItem[];
  totalCalories: number;
  summary: string;
  imageUrl?: string;
}

export interface MealLog {
  id: string;
  created_at: string;
  items: DetectedFoodItem[];
  total_calories: number;
  image_url?: string;
  user_id: string;
}

export type AppView = 'SPLASH' | 'ONBOARDING' | 'AUTH' | 'SETUP' | 'DASHBOARD' | 'TRACKER' | 'CAMERA' | 'ANALYSIS' | 'INSIGHTS' | 'ACCOUNT' | 'CHAT' | 'VIDEO';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingUrls?: Array<{title: string, uri: string}>;
}

export interface VideoAnalysisResult {
  summary: string;
  calories: number;
  items: string[];
}

export interface UserProfileData {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthDate: string;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  goals: string[];
  activityLevel: string;
  dietType: string;
  breakfastTime: string;
  dinnerTime: string;
}