'use client';

import { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { ThumbsUp, ThumbsDown, ChatCircle } from '@phosphor-icons/react';
import { db } from '@/lib/firebase';

interface StoryActionsProps {
  storyId: string;
  upvotes: number;
  downvotes: number;
  commentCount?: number;
  onCommentClick?: () => void;
  showComments?: boolean;
}

export default function StoryActions({ 
  storyId, 
  upvotes, 
  downvotes, 
  commentCount, 
  onCommentClick,
  showComments = true
}: StoryActionsProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      setError(null);

      // Get parent story ID and check if this is a comment
      const parentStoryId = storyId.includes('/') ? storyId.split('/')[0] : storyId;
      const isComment = storyId.includes('/');

      // Handle localStorage key based on whether it's a story or comment
      const storageKey = isComment ? 'comment-votes' : 'story-votes';
      const votes = JSON.parse(localStorage.getItem(storageKey) || '{}');
      
      if (votes[storyId]) {
        console.log('User already voted on this item');
        return;
      }

      // Create the document reference based on the path
      const docRef = isComment
        ? doc(db, 'stories', parentStoryId, 'comments', storyId.split('/')[1])
        : doc(db, 'stories', storyId);

      await updateDoc(docRef, {
        [type === 'up' ? 'upvotes' : 'downvotes']: increment(1)
      });

      // Save the vote in localStorage
      votes[storyId] = type;
      localStorage.setItem(storageKey, JSON.stringify(votes));

      console.log('Vote registered successfully');
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to register vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  // Check if user has already voted on this item
  const userVote = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem(storyId.includes('/') ? 'comment-votes' : 'story-votes') || '{}')[storyId]
    : null;

  return (
    <div className="flex items-center gap-4">
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
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

      {showComments && (
        <button
          onClick={onCommentClick}
          className="flex items-center gap-1.5 text-white/60 hover:text-purple-400 transition-colors"
        >
          <ChatCircle size={16} weight="light" />
          <span>{commentCount || 0}</span>
        </button>
      )}
    </div>
  );
}
