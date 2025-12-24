'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
}

export default function ImageModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  isLoading,
  prompt 
}: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Generated Image</DialogTitle>
          <DialogDescription>{prompt}</DialogDescription>
        </DialogHeader>
        
        <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating image...</p>
            </div>
          ) : imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={prompt}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <p className="text-muted-foreground">No image available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}