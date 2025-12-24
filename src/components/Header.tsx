'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="border-b-2 bg-card/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground flex items-center gap-2 justify-center">
              FitCoach AI
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent animate-pulse" />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Your Personal AI-Powered Fitness & Nutrition Guide
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}