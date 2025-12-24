'use client';

import { useState, useEffect } from 'react';
import FitnessForm from '@/components/FitnessForm';
import PlanDisplay from '@/components/PlanDisplay';
import VoicePlayer from '@/components/VoicePlayer';
import ImageModal from '@/components/ImageModal';
import { FitnessPlan, UserData } from '@/lib/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceText, setVoiceText] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPlan = localStorage.getItem('fitnessPlan');
    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan));
      } catch (err) {
        console.error('Failed to parse saved plan', err);
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
        throw new Error('Failed to generate plan');
      }

      const data: FitnessPlan = await response.json();
      setPlan(data);
      localStorage.setItem('fitnessPlan', JSON.stringify(data));

      toast.success('Your personalized fitness plan is ready');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = (text: string, type: 'workout' | 'diet') => {
    setVoiceText(text);
    toast.info(`Playing your ${type} plan`);
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
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);

      toast.success('Image generated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleRegenerate = () => {
    setPlan(null);
    localStorage.removeItem('fitnessPlan');
    toast.info('Plan cleared. Generate a new one');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your fitness journey...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!plan ? (
        <FitnessForm onSubmit={generatePlan} loading={loading} />
      ) : (
        <PlanDisplay
          plan={plan}
          onRegenerate={handleRegenerate}
          onReadAloud={handleReadAloud}
          onImageGenerate={handleImageGenerate}
        />
      )}

      <VoicePlayer text={voiceText} onClose={() => setVoiceText(null)} />

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={imageUrl}
        isLoading={imageLoading}
        prompt={imagePrompt}
      />
    </>
  );
}