'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FitnessForm from '@/components/FitnessForm';
import PlanDisplay from '@/components/PlanDisplay';
import VoicePlayer from '@/components/VoicePlayer';
import ImageModal from '@/components/ImageModal';
import CalorieCalculator from '@/components/CalorieCalculator';
import { FitnessPlan, UserData } from '@/lib/types';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceText, setVoiceText] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<'form' | 'plan'>('form');

  useEffect(() => {
    setMounted(true);
    const savedPlan = localStorage.getItem('fitnessPlan');
    if (savedPlan) {
      try {
        const parsedPlan = JSON.parse(savedPlan);
        setPlan(parsedPlan);
        setActiveView('plan');
      } catch (err) {
        console.error('Failed to parse saved plan:', err);
        localStorage.removeItem('fitnessPlan');
      }
    }
  }, []);

  const generatePlan = async (userData: UserData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const data: FitnessPlan = await response.json();
      setPlan(data);
      setActiveView('plan');
      localStorage.setItem('fitnessPlan', JSON.stringify(data));

      toast.success('🎉 Success!', {
        description: 'Your personalized fitness plan is ready!',
      });
    } catch (error) {
      console.error('Plan generation error:', error);
      toast.error('❌ Error', {
        description: error instanceof Error ? error.message : 'Failed to generate fitness plan.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = (text: string, type: 'workout' | 'diet') => {
    setVoiceText(text);
    toast.info('🔊 Playing Audio', {
      description: `Your ${type} plan is being read aloud.`,
    });
  };

  const handleImageGenerate = async (prompt: string) => {
    setImagePrompt(prompt);
    setShowImageModal(true);
    setImageLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);

      toast.success('✨ Image Generated', {
        description: 'Your AI image is ready to view.',
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error('❌ Error', {
        description: 'Failed to generate image. Please try again.',
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleRegenerate = () => {
    setPlan(null);
    setActiveView('form');
    localStorage.removeItem('fitnessPlan');
    toast.info('🔄 Plan Cleared', {
      description: 'Create a new personalized plan below.',
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <p className="text-lg font-medium text-muted-foreground">
              Loading your fitness journey...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeView === 'form' ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Tabs defaultValue="fitness-plan" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 h-12 card-elevated">
                  <TabsTrigger value="fitness-plan" className="text-base font-medium">
                     Fitness Plan Generator
                  </TabsTrigger>
                  <TabsTrigger value="calorie-calc" className="text-base font-medium">
                     Calorie Calculator
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fitness-plan" className="animate-fade-in">
                  <FitnessForm onSubmit={generatePlan} loading={loading} />
                </TabsContent>

                <TabsContent value="calorie-calc" className="animate-fade-in">
                  <CalorieCalculator />
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="plan-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {plan && (
                <PlanDisplay
                  plan={plan}
                  onRegenerate={handleRegenerate}
                  onReadAloud={handleReadAloud}
                  onImageGenerate={handleImageGenerate}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <VoicePlayer text={voiceText} onClose={() => setVoiceText(null)} />

      <ImageModal
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setImageUrl(null);
        }}
        imageUrl={imageUrl}
        isLoading={imageLoading}
        prompt={imagePrompt}
      />
    </div>
  );
}