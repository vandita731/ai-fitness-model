'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, Download, ZoomIn, ZoomOut, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
  const [isZoomed, setIsZoomed] = useState(false);
  
  const handleDownload = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fitcoach-${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl max-h-[90vh] overflow-hidden card-elevated rounded-lg focus:outline-none">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Dialog.Title className="text-2xl font-semibold text-foreground">
                  AI Generated Image
                </Dialog.Title>
                <Dialog.Description className="text-base text-muted-foreground mt-1">
                  {prompt}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </Dialog.Close>
            </div>
          </div>
          
          {/* Image Container */}
          <div className="relative w-full max-h-[calc(90vh-140px)] bg-muted flex items-center justify-center overflow-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 p-8">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <div className="text-center space-y-2">
                  <p className="font-medium text-foreground">Generating your image...</p>
                  <p className="text-sm text-muted-foreground">This may take 20-30 seconds</p>
                </div>
              </div>
            ) : imageUrl ? (
              <div className="relative w-full h-full group p-4">
                <motion.img
                  src={imageUrl}
                  alt={prompt}
                  className={`w-full h-full transition-all duration-300 ${
                    isZoomed ? 'object-contain cursor-zoom-out' : 'object-contain cursor-zoom-in'
                  }`}
                  style={{
                    maxHeight: isZoomed ? 'none' : 'calc(90vh - 180px)',
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                
                {/* Hover Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border-2">
                    <Button
                      onClick={() => setIsZoomed(!isZoomed)}
                      variant="secondary"
                      size="sm"
                    >
                      {isZoomed ? (
                        <>
                          <ZoomOut className="w-4 h-4 mr-2" />
                          Zoom Out
                        </>
                      ) : (
                        <>
                          <ZoomIn className="w-4 h-4 mr-2" />
                          Zoom In
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="default"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 p-8">
                <p className="text-muted-foreground">No image available</p>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}