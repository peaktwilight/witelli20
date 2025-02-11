'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import type { Story } from '@/types/story';
import StoryActions from './StoryActions';
import { useState } from 'react';

interface StoryModalProps {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
  onComment: (storyId: string, text: string) => Promise<void>;
  isLoading?: boolean;
}

export default function StoryModal({ story, isOpen, onClose, onComment, isLoading }: StoryModalProps) {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isLoading) return;

    await onComment(story.id, replyText);
    setReplyText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-4 md:left-1/2 md:right-auto md:top-[10vh] md:-translate-x-1/2 md:translate-y-0
                     w-auto md:w-[42rem] max-h-[90vh] md:max-h-[80vh] overflow-y-auto
                     bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95
                     backdrop-blur-xl rounded-2xl shadow-2xl z-[70]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X size={24} weight="light" />
            </button>

            <div className="p-6 md:p-8">
              {/* Story Content */}
              <div className="prose prose-xl prose-invert max-w-none mb-8">
                {story.content.split('\n').map((paragraph, i) => (
                  paragraph.trim() && (
                    <p key={i} className="text-white/90 text-xl leading-relaxed mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>

              {/* Actions */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between text-sm">
                  <div className="flex flex-wrap items-center gap-4">
                    <StoryActions
                      storyId={story.id}
                      upvotes={story.upvotes}
                      downvotes={story.downvotes}
                      commentCount={story.comments?.length}
                    />
                  </div>
                  <span className="text-white/40">
                    {story.createdAt?.toLocaleDateString()}
                  </span>
                </div>

                {/* Comments Section */}
                <div className="mt-6 space-y-4">
                  {/* Comment Form */}
                  <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full bg-white/5 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                      rows={2}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`
                          w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium
                          ${isLoading
                            ? 'bg-purple-500/50 text-white/50'
                            : 'bg-purple-500 text-white hover:bg-purple-400 transition-colors'
                          }
                        `}
                      >
                        {isLoading ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  {story.comments && story.comments.length > 0 && (
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      {story.comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/90 mb-2">{comment.text}</p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between text-sm">
                            <div className="flex flex-wrap items-center gap-4">
                              <StoryActions
                                storyId={`${story.id}/${comment.id}`}
                                upvotes={comment.upvotes}
                                downvotes={comment.downvotes}
                                showComments={false}
                              />
                            </div>
                            <span className="text-white/40">
                              {comment.createdAt?.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
