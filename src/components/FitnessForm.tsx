'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Loader2, User, Target, Settings } from 'lucide-react';
import { UserData } from '@/lib/types';
import MotivationQuote from '@/components/MotivationQuote';

interface FitnessFormProps {
  onSubmit: (data: UserData) => Promise<void>;
  loading: boolean;
}

export default function FitnessForm({ onSubmit, loading }: FitnessFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    fitnessGoal: 'weight_loss',
    fitnessLevel: 'beginner',
    workoutLocation: 'home',
    dietaryPreference: 'vegetarian',
    medicalHistory: '',
    stressLevel: 'low',
  });

  const updateField = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && !loading) {
      onSubmit(formData);
    }
  };

  const bmi = (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);
  const bmiCategory =
    +bmi < 18.5 ? 'Underweight'
    : +bmi < 25 ? 'Normal'
    : +bmi < 30 ? 'Overweight'
    : 'Obese';

  const steps = [
    { num: 1, title: 'Personal', icon: User },
    { num: 2, title: 'Goals', icon: Target },
    { num: 3, title: 'Preferences', icon: Settings },
  ];

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <MotivationQuote />

        <Card className="card-elevated">
          <CardHeader className="space-y-3 pb-4">
            <div className="text-center space-y-1">
              <CardTitle className="text-2xl">Build Your Fitness Plan</CardTitle>
              <CardDescription className="text-sm">
                AI-powered workout and nutrition guidance
              </CardDescription>
            </div>

            {/* Compact Progress Steps */}
            <div className="flex justify-center items-center gap-2 pt-2">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.num} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                          step === s.num
                            ? 'border-primary bg-primary text-primary-foreground'
                            : step > s.num
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-muted bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">{s.title}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <Separator
                        className={`w-8 mx-1 ${step > s.num ? 'bg-primary' : 'bg-muted'}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="name" className="text-sm">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="Enter your name"
                        className="h-9"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="age" className="text-sm">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="15"
                        max="100"
                        value={formData.age}
                        onChange={e => updateField('age', +e.target.value)}
                        className="h-9"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="gender" className="text-sm">Gender</Label>
                      <Select value={formData.gender} onValueChange={v => updateField('gender', v)}>
                        <SelectTrigger id="gender" className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="height" className="text-sm">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={e => updateField('height', +e.target.value)}
                        className="h-9"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="weight" className="text-sm">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={e => updateField('weight', +e.target.value)}
                        className="h-9"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm">BMI</Label>
                      <div className="flex items-center justify-between h-9 px-3 border border-input bg-background rounded-md">
                        <span className="text-sm font-medium">{bmi}</span>
                        <Badge variant="secondary" className="text-xs">{bmiCategory}</Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Fitness Goals */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-sm">Primary Fitness Goal</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'weight_loss', label: 'Weight Loss' },
                        { value: 'muscle_gain', label: 'Muscle Gain' },
                        { value: 'endurance', label: 'Endurance' },
                        { value: 'maintenance', label: 'Maintenance' },
                      ].map(goal => (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateField('fitnessGoal', goal.value);
                          }}
                          className={`h-10 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.fitnessGoal === goal.value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted bg-background hover:border-primary/50'
                          }`}
                        >
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="fitness-level" className="text-sm">Fitness Level</Label>
                    <Select value={formData.fitnessLevel} onValueChange={v => updateField('fitnessLevel', v)}>
                      <SelectTrigger id="fitness-level" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="stress-level" className="text-sm">Stress Level</Label>
                    <Select value={formData.stressLevel} onValueChange={v => updateField('stressLevel', v)}>
                      <SelectTrigger id="stress-level" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-sm">Workout Location</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'gym', label: 'Gym' },
                        { value: 'home', label: 'Home' },
                        { value: 'outdoor', label: 'Outdoor' },
                      ].map(loc => (
                        <button
                          key={loc.value}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateField('workoutLocation', loc.value);
                          }}
                          className={`h-10 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.workoutLocation === loc.value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted bg-background hover:border-primary/50'
                          }`}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="diet" className="text-sm">Dietary Preference</Label>
                    <Select value={formData.dietaryPreference} onValueChange={v => updateField('dietaryPreference', v)}>
                      <SelectTrigger id="diet" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="medical" className="text-sm">Medical History (Optional)</Label>
                    <Textarea
                      id="medical"
                      rows={3}
                      value={formData.medicalHistory}
                      onChange={e => updateField('medicalHistory', e.target.value)}
                      placeholder="Any injuries, conditions, or medications..."
                      className="text-sm resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-5 border-t mt-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 1}
                  className="gap-1.5 h-9"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    className="gap-1.5 h-9"
                    size="sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="gap-1.5 h-9"
                    size="sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Plan'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}