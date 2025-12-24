'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Flame, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Utensils,
  Zap
} from 'lucide-react';

interface CalorieResult {
  bmr: number;
  tdee: number;
  weightLoss: number;
  muscleGain: number;
  maintenance: number;
  macros: {
    protein: { grams: number; calories: number };
    carbs: { grams: number; calories: number };
    fats: { grams: number; calories: number };
  };
}

export default function CalorieCalculator() {
  const [formData, setFormData] = useState({
    age: 25,
    gender: 'male' as 'male' | 'female',
    weight: 70,
    height: 170,
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: 'maintenance' as 'weight_loss' | 'muscle_gain' | 'maintenance',
  });

  const [result, setResult] = useState<CalorieResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateCalories = () => {
    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmr: number;
    if (formData.gender === 'male') {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
    } else {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    }

    // Activity Level Multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = Math.round(bmr * activityMultipliers[formData.activityLevel]);
    const weightLoss = Math.round(tdee - 500); // 500 calorie deficit
    const muscleGain = Math.round(tdee + 300); // 300 calorie surplus
    const maintenance = tdee;

    // Calculate target calories based on goal
    let targetCalories = maintenance;
    if (formData.goal === 'weight_loss') targetCalories = weightLoss;
    if (formData.goal === 'muscle_gain') targetCalories = muscleGain;

    // Macro Calculation (40% carbs, 30% protein, 30% fats)
    const proteinCalories = Math.round(targetCalories * 0.3);
    const carbsCalories = Math.round(targetCalories * 0.4);
    const fatsCalories = Math.round(targetCalories * 0.3);

    const macros = {
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: proteinCalories,
      },
      carbs: {
        grams: Math.round(carbsCalories / 4),
        calories: carbsCalories,
      },
      fats: {
        grams: Math.round(fatsCalories / 9),
        calories: fatsCalories,
      },
    };

    setResult({
      bmr: Math.round(bmr),
      tdee,
      weightLoss,
      muscleGain,
      maintenance,
      macros,
    });

    setShowResults(true);
  };

  const resetCalculator = () => {
    setShowResults(false);
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Flame className="w-8 h-8 text-orange-600" />
            Calorie Calculator
          </CardTitle>
          <CardDescription className="text-base">
            Calculate your daily calorie needs and macronutrient breakdown
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {!showResults ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="calc-age">Age</Label>
                  <Input
                    id="calc-age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    min="15"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calc-gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: 'male' | 'female') => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calc-weight">Weight (kg)</Label>
                  <Input
                    id="calc-weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calc-height">Height (cm)</Label>
                  <Input
                    id="calc-height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                    min="100"
                    max="250"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calc-activity">Activity Level</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value: any) => setFormData({ ...formData, activityLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (Little/no exercise)</SelectItem>
                      <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (Intense daily)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calc-goal">Fitness Goal</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value: any) => setFormData({ ...formData, goal: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">🔥 Weight Loss</SelectItem>
                      <SelectItem value="maintenance">⚖️ Maintenance</SelectItem>
                      <SelectItem value="muscle_gain">💪 Muscle Gain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={calculateCalories}
                className="w-full h-12 text-lg"
                size="lg"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate My Calories
              </Button>
            </motion.div>
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Results Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* BMR */}
                <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-muted-foreground mb-1">BMR</p>
                      <p className="text-3xl font-bold">{result.bmr}</p>
                      <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                    </div>
                  </CardContent>
                </Card>

                {/* TDEE */}
                <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-muted-foreground mb-1">TDEE</p>
                      <p className="text-3xl font-bold">{result.tdee}</p>
                      <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Calories */}
                <Card className="border-2 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <p className="text-sm text-muted-foreground mb-1">Your Goal</p>
                      <p className="text-3xl font-bold">
                        {formData.goal === 'weight_loss' && result.weightLoss}
                        {formData.goal === 'muscle_gain' && result.muscleGain}
                        {formData.goal === 'maintenance' && result.maintenance}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Goal-based Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2">
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <p className="font-semibold mb-1">Weight Loss</p>
                    <p className="text-2xl font-bold">{result.weightLoss}</p>
                    <p className="text-xs text-muted-foreground mt-1">-500 cal/day</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold mb-1">Maintenance</p>
                    <p className="text-2xl font-bold">{result.maintenance}</p>
                    <p className="text-xs text-muted-foreground mt-1">maintain weight</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold mb-1">Muscle Gain</p>
                    <p className="text-2xl font-bold">{result.muscleGain}</p>
                    <p className="text-xs text-muted-foreground mt-1">+300 cal/day</p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Macros Breakdown */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Daily Macronutrient Breakdown</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Protein */}
                  <Card className="border-2 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">🥩 Protein</span>
                          <Badge>30%</Badge>
                        </div>
                        <p className="text-3xl font-bold">{result.macros.protein.grams}g</p>
                        <p className="text-sm text-muted-foreground">
                          {result.macros.protein.calories} calories
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Carbs */}
                  <Card className="border-2 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">🍞 Carbs</span>
                          <Badge>40%</Badge>
                        </div>
                        <p className="text-3xl font-bold">{result.macros.carbs.grams}g</p>
                        <p className="text-sm text-muted-foreground">
                          {result.macros.carbs.calories} calories
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fats */}
                  <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">🥑 Fats</span>
                          <Badge>30%</Badge>
                        </div>
                        <p className="text-3xl font-bold">{result.macros.fats.grams}g</p>
                        <p className="text-sm text-muted-foreground">
                          {result.macros.fats.calories} calories
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button
                onClick={resetCalculator}
                variant="outline"
                className="w-full"
              >
                Calculate Again
              </Button>
            </motion.div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}