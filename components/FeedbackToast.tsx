'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import Link from 'next/link';

export function FeedbackToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 5 seconds
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('feedback-toast-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem('feedback-toast-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: 20 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 w-72"
        >
          <div className="bg-black/90 border border-green-500/50 rounded shadow-[0_0_20px_rgba(34,197,94,0.2)] overflow-hidden font-mono">
            {/* Header bar */}
            <div className="bg-green-950/40 border-b border-green-500/30 px-3 py-1.5 flex justify-between items-center">
              <span className="text-green-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                System_Alert
              </span>
              <button 
                onClick={dismiss}
                className="text-green-500/50 hover:text-green-400 p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-green-300/80 text-[11px] leading-relaxed">
                <span className="text-green-500">{'>'}</span> We value your biological input. Submit suggestions to enhance this terminal.
              </p>
              
              <Link
                href="/feedback"
                onClick={dismiss}
                className="block text-center py-2 bg-green-900/30 border border-green-500/40 text-green-400 text-[10px] uppercase hover:bg-green-800/40 transition-all font-bold animate-terminal-pulse"
              >
                [INIT_FEEDBACK_TRANS]
              </Link>
            </div>
            
            {/* Decorative scanline effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.02)_100%)] bg-[length:100%_4px]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
