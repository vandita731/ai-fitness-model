'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const quotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The difference between try and triumph is a little umph.",
  "Take care of your body. It's the only place you have to live.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't limit your challenges. Challenge your limits.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "The hard days are what make you stronger.",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
  "Your health is an investment, not an expense.",
  "Progress, not perfection.",
  "Every workout is progress.",
  "Make yourself a priority once in a while. It's not selfish, it's necessary.",
];

export default function MotivationQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const refreshQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <Card className="card-elevated p-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">Daily Motivation</p>
          <blockquote className="text-lg font-medium leading-relaxed text-foreground italic">
            "{quotes[quoteIndex]}"
          </blockquote>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshQuote}
          className="flex-shrink-0"
          aria-label="Get new quote"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}