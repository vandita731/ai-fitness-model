'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface VoicePlayerProps {
  text: string | null;
  onClose: () => void;
}

export default function VoicePlayer({ text, onClose }: VoicePlayerProps) {
  useEffect(() => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

    return () => {
      speechSynthesis.cancel();
    };
  }, [text]);

  if (!text) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="w-72 rounded-xl border bg-card p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Audio Playing</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                speechSynthesis.cancel();
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Reading your plan aloud…
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
