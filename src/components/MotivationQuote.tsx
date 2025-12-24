'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success starts with self-discipline.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't limit your challenges. Challenge your limits.",
  "Push yourself because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Believe it. Build it.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The difference between try and triumph is a little umph.",
  "Your health is an investment, not an expense.",
  "Take care of your body. It's the only place you have to live.",
  "The body achieves what the mind believes.",
  "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
  "Every workout counts. Every meal matters. Every day is a chance to improve.",
];

export default function MotivationQuote() {
  const [quote, setQuote] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  };

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="card-elevated border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <motion.p
                key={quote}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-xl font-medium text-foreground italic"
              >
                "{quote}"
              </motion.p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-shrink-0 hover:bg-primary/10"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}