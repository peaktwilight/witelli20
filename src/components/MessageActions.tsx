'use client';

import { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { ThumbsUp, ThumbsDown } from '@phosphor-icons/react';
import { db } from '@/lib/firebase';

interface MessageActionsProps {
  messageId: string;
  upvotes: number;
  downvotes: number;
}

export default function MessageActions({ messageId, upvotes, downvotes }: MessageActionsProps) {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      const messageRef = doc(db, 'messages', messageId);
      
      // Store the vote in localStorage to prevent multiple votes
      const votes = JSON.parse(localStorage.getItem('message-votes') || '{}');
      if (votes[messageId]) {
        // If user already voted on this message, return
        return;
      }

      await updateDoc(messageRef, {
        [type === 'up' ? 'upvotes' : 'downvotes']: increment(1)
      });

      // Save the vote in localStorage
      votes[messageId] = type;
      localStorage.setItem('message-votes', JSON.stringify(votes));

    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  // Check if user has already voted on this message
  const userVote = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('message-votes') || '{}')[messageId]
    : null;

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => handleVote('up')}
        disabled={isVoting || userVote !== undefined}
        className={`
          flex items-center gap-1.5 transition-colors
          ${userVote === 'up'
            ? 'text-green-400'
            : 'text-white/60 hover:text-green-400'
          }
          ${isVoting || userVote ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <ThumbsUp 
          size={16} 
          weight={userVote === 'up' ? 'fill' : 'light'} 
        />
        <span>{upvotes}</span>
      </button>
      
      <button 
        onClick={() => handleVote('down')}
        disabled={isVoting || userVote !== undefined}
        className={`
          flex items-center gap-1.5 transition-colors
          ${userVote === 'down'
            ? 'text-red-400'
            : 'text-white/60 hover:text-red-400'
          }
          ${isVoting || userVote ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <ThumbsDown 
          size={16} 
          weight={userVote === 'down' ? 'fill' : 'light'} 
        />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
