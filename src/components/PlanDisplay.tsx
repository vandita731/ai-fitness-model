'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { FitnessPlan } from '@/lib/types';
import { 
  Dumbbell, 
  UtensilsCrossed, 
  Lightbulb, 
  Heart,
  Download,
  Volume2,
  RefreshCw,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Flame,
  TrendingUp,
  Target
} from 'lucide-react';
import jsPDF from 'jspdf';

interface PlanDisplayProps {
  plan: FitnessPlan;
  onRegenerate: () => void;
  onReadAloud: (text: string, type: 'workout' | 'diet') => void;
  onImageGenerate: (prompt: string) => void;
}

export default function PlanDisplay({ 
  plan, 
  onRegenerate, 
  onReadAloud,
  onImageGenerate 
}: PlanDisplayProps) {
  const [activeTab, setActiveTab] = useState('workout');
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set());

  const toggleWorkoutComplete = (dayIndex: number) => {
    const key = `workout-${dayIndex}`;
    const newSet = new Set(completedWorkouts);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setCompletedWorkouts(newSet);
  };

  const workoutProgress = (completedWorkouts.size / plan.workoutPlan.length) * 100;

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('Your Personalized Fitness Plan', pageWidth / 2, 20, { align: 'center' });
    
    let yPosition = 35;

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Workout Plan', 14, yPosition);
    yPosition += 10;

    plan.workoutPlan.forEach((day) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${day.day} - ${day.focus}`, 14, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      day.exercises.forEach((exercise) => {
        const text = `• ${exercise.name}: ${exercise.sets} sets × ${exercise.reps} (Rest: ${exercise.rest})`;
        const lines = doc.splitTextToSize(text, pageWidth - 30);
        doc.text(lines, 20, yPosition);
        yPosition += 6 * lines.length;
      });
      yPosition += 5;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.text('Diet Plan', 14, yPosition);
    yPosition += 10;

    const meals = [
      { title: 'Breakfast', data: plan.dietPlan.breakfast },
      { title: 'Lunch', data: plan.dietPlan.lunch },
      { title: 'Dinner', data: plan.dietPlan.dinner },
      { title: 'Snacks', data: plan.dietPlan.snacks },
    ];

    meals.forEach((meal) => {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`${meal.title}: ${meal.data.name}`, 14, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      meal.data.items.forEach((item) => {
        doc.text(`• ${item}`, 20, yPosition);
        yPosition += 5;
      });
      if (meal.data.calories) {
        doc.text(`Calories: ${meal.data.calories} | Protein: ${meal.data.protein}`, 20, yPosition);
        yPosition += 6;
      }
      yPosition += 3;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save('fitness-plan.pdf');
  };

  const generateWorkoutText = () => {
    let text = 'Here is your weekly workout plan. ';
    plan.workoutPlan.forEach((day) => {
      text += `${day.day} focuses on ${day.focus}. `;
      day.exercises.forEach((exercise) => {
        text += `Do ${exercise.name}, ${exercise.sets} sets of ${exercise.reps}, with ${exercise.rest} rest. `;
      });
    });
    return text;
  };

  const generateDietText = () => {
    let text = 'Here is your daily diet plan. ';
    text += `For breakfast, have ${plan.dietPlan.breakfast.name}. `;
    text += `For lunch, eat ${plan.dietPlan.lunch.name}. `;
    text += `For dinner, enjoy ${plan.dietPlan.dinner.name}. `;
    text += `For snacks, you can have ${plan.dietPlan.snacks.name}. `;
    return text;
  };

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Progress Card */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 subheading-responsive">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Your Fitness Journey
                  </CardTitle>
                  <CardDescription className="text-responsive">
                    {completedWorkouts.size} of {plan.workoutPlan.length} workouts completed
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={exportToPDF} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={onRegenerate} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Plan
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Weekly Progress</span>
                  <span>{Math.round(workoutProgress)}%</span>
                </div>
                <Progress value={workoutProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="workout">
                <Dumbbell className="w-4 h-4 mr-2 hidden sm:block" />
                Workout
              </TabsTrigger>
              <TabsTrigger value="diet">
                <UtensilsCrossed className="w-4 h-4 mr-2 hidden sm:block" />
                Nutrition
              </TabsTrigger>
              <TabsTrigger value="tips">
                <Lightbulb className="w-4 h-4 mr-2 hidden sm:block" />
                Tips
              </TabsTrigger>
              <TabsTrigger value="motivation">
                <Heart className="w-4 h-4 mr-2 hidden sm:block" />
                Motivation
              </TabsTrigger>
            </TabsList>

            {/* Workout Tab */}
            <TabsContent value="workout" className="space-y-4 mt-6">
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex justify-between items-start md:items-center flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-responsive">Weekly Workout Schedule</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Track your progress by checking off completed sessions
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => onReadAloud(generateWorkoutText(), 'workout')}
                      variant="outline"
                      size="sm"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.workoutPlan.map((day, index) => {
                    const isCompleted = completedWorkouts.has(`workout-${index}`);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border-2 rounded-lg p-5 space-y-4 transition-all ${
                          isCompleted 
                            ? 'bg-primary/5 border-primary' 
                            : 'hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleWorkoutComplete(index)}
                              className="hover:bg-transparent"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground" />
                              )}
                            </Button>
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                {day.day}
                              </h3>
                              <p className="text-sm text-muted-foreground">{day.focus}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{day.exercises.length} exercises</Badge>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3 ml-9">
                          {day.exercises.map((exercise, exIndex) => (
                            <div 
                              key={exIndex}
                              className="p-4 bg-background rounded-lg border hover:border-primary/50 transition-all group cursor-pointer"
                              onClick={() => onImageGenerate(`${exercise.name} exercise demonstration`)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-base mb-2">{exercise.name}</p>
                                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Target className="w-4 h-4" />
                                      {exercise.sets} sets × {exercise.reps}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {exercise.rest}
                                    </span>
                                  </div>
                                  {exercise.notes && (
                                    <p className="text-sm text-primary mt-2">
                                      {exercise.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Diet Tab */}
            <TabsContent value="diet" className="space-y-4 mt-6">
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex justify-between items-start md:items-center flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-responsive">Daily Nutrition Plan</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Click on any meal to generate an AI image
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => onReadAloud(generateDietText(), 'diet')}
                      variant="outline"
                      size="sm"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Breakfast', data: plan.dietPlan.breakfast, time: 'Morning' },
                    { title: 'Lunch', data: plan.dietPlan.lunch, time: 'Afternoon' },
                    { title: 'Dinner', data: plan.dietPlan.dinner, time: 'Evening' },
                    { title: 'Snacks', data: plan.dietPlan.snacks, time: 'Anytime' },
                  ].map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full border-2 hover:border-primary/50 transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{meal.title}</CardTitle>
                            <Badge variant="outline" className="text-xs">{meal.time}</Badge>
                          </div>
                          <CardDescription className="font-medium">
                            {meal.data.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {meal.data.items.map((item, i) => (
                              <li 
                                key={i} 
                                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer transition-colors"
                                onClick={() => onImageGenerate(`${item} food photography, professional, appetizing`)}
                              >
                                <div className="w-1 h-1 rounded-full bg-primary" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                          {meal.data.calories && (
                            <>
                              <Separator />
                              <div className="flex gap-3">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  {meal.data.calories}
                                </Badge>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Dumbbell className="w-3 h-3" />
                                  {meal.data.protein}
                                </Badge>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tips Tab */}
            <TabsContent value="tips" className="mt-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-responsive">Expert Recommendations</CardTitle>
                  <CardDescription className="text-sm">
                    Follow these guidelines to maximize your results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border"
                      >
                        <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Motivation Tab */}
            <TabsContent value="motivation" className="mt-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-responsive">Your Daily Motivation</CardTitle>
                  <CardDescription className="text-sm">
                    Keep this message close to your heart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border-2 border-primary/20"
                  >
                    <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
                    <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic">
                      "{plan.motivation}"
                    </blockquote>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}