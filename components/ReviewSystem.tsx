'use client';

import { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Review } from '@/types';

interface ReviewSystemProps {
  projectId?: string; // Optional for general feedback
  isGeneral?: boolean;
  tags?: string[];
}

export function ReviewSystem({ projectId = 'site', isGeneral = false, tags = [] }: ReviewSystemProps) {
  const isEnabled = isGeneral || tags.map(t => t.toLowerCase()).includes('feedback-enabled');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    author: '',
    content: '',
    rating: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, projectId })
      });
      
      if (res.ok) {
        setMessage('SUCCESS: Logged to terminal. Initializing moderation check.');
        setFormData({ author: '', content: '', rating: 5 });
      } else {
        setMessage('ERROR: Upload failed. Try again?');
      }
    } catch {
      setMessage('ERROR: Connection interrupted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="mt-12 mb-12">
      <Terminal title={isGeneral ? "LEAVE_YOUR_MARK" : "SUBMIT_FEEDBACK"} glow>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-green-500/60 text-[10px] uppercase">Identity:</label>
              <Input 
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
                placeholder="User / Alias"
                className="bg-black border-green-500/20 text-green-400 h-8 text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-green-500/60 text-[10px] uppercase">Satisfaction (1-5):</label>
              <Input 
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                className="bg-black border-green-500/20 text-green-400 h-8 text-xs font-mono"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-green-500/60 text-[10px] uppercase">Message Body:</label>
            <Textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="What's on your mind?"
              className="bg-black border-green-500/20 text-green-400 min-h-[80px] text-xs font-mono"
              required
            />
          </div>
          
          <div className="flex justify-between items-center">
            {message && (
              <span className={`text-[10px] font-mono ${message.includes('SUCCESS') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </span>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-900/30 border border-green-500/50 text-green-400 hover:bg-green-800/40 h-8 text-xs px-6 ml-auto"
            >
              {isSubmitting ? '[COMMITTING...]' : '[EXECUTE_SEND]'}
            </Button>
          </div>
        </form>
      </Terminal>
    </div>
  );
}
