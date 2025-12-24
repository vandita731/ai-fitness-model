import { UserData } from './types';

export function generateFitnessPrompt(userData: UserData): string {
  return `You are an expert fitness coach and nutritionist. Generate a personalized fitness plan based on the following user data:

**User Profile:**
- Name: ${userData.name}
- Age: ${userData.age} years
- Gender: ${userData.gender}
- Height: ${userData.height} cm
- Weight: ${userData.weight} kg
- Fitness Goal: ${userData.fitnessGoal.replace('_', ' ')}
- Current Fitness Level: ${userData.fitnessLevel}
- Workout Location: ${userData.workoutLocation}
- Dietary Preference: ${userData.dietaryPreference.replace('_', ' ')}
${userData.medicalHistory ? `- Medical History: ${userData.medicalHistory}` : ''}
${userData.stressLevel ? `- Stress Level: ${userData.stressLevel}` : ''}

Generate a comprehensive fitness plan in the following JSON format (respond ONLY with valid JSON, no markdown):

{
  "workoutPlan": [
    {
      "day": "Monday",
      "focus": "Chest and Triceps",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": "12-15",
          "rest": "60 seconds",
          "notes": "Keep your core tight"
        }
      ]
    }
  ],
  "dietPlan": {
    "breakfast": {
      "name": "High Protein Breakfast",
      "items": ["Scrambled eggs", "Whole wheat toast", "Avocado"],
      "calories": "450",
      "protein": "30g"
    },
    "lunch": {
      "name": "Balanced Lunch",
      "items": ["Grilled chicken breast", "Brown rice", "Steamed vegetables"],
      "calories": "550",
      "protein": "45g"
    },
    "dinner": {
      "name": "Light Dinner",
      "items": ["Salmon fillet", "Quinoa", "Mixed salad"],
      "calories": "500",
      "protein": "40g"
    },
    "snacks": {
      "name": "Healthy Snacks",
      "items": ["Greek yogurt", "Almonds", "Apple"],
      "calories": "300",
      "protein": "15g"
    }
  },
  "tips": [
    "Stay hydrated - drink at least 3 liters of water daily",
    "Get 7-8 hours of quality sleep",
    "Warm up for 5-10 minutes before workouts"
  ],
  "motivation": "Remember: Progress is progress, no matter how small. Stay consistent and trust the process!"
}

**Important Guidelines:**
1. Create a 5-day workout plan appropriate for ${userData.fitnessLevel} level
2. Adjust exercises based on ${userData.workoutLocation} availability
3. Ensure diet plan matches ${userData.dietaryPreference} preference
4. Consider the ${userData.fitnessGoal.replace('_', ' ')} goal
5. Provide practical, safe, and effective recommendations
6. Include proper rest days
7. Return ONLY valid JSON, no extra text or markdown`;
}