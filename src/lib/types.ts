export interface UserData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutLocation: 'home' | 'gym' | 'outdoor';
  dietaryPreference: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'keto';
  medicalHistory?: string;
  stressLevel?: 'low' | 'medium' | 'high';
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
}

export interface Meal {
  name: string;
  items: string[];
  calories?: string;
  protein?: string;
}

export interface DietPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
}

export interface FitnessPlan {
  workoutPlan: WorkoutDay[];
  dietPlan: DietPlan;
  tips: string[];
  motivation: string;
}