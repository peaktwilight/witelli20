'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { House, ArrowClockwise, Robot, ArrowsDownUp } from '@phosphor-icons/react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { generateFunContent } from '@/lib/funGenerator';
import { db } from '@/lib/firebase';
import type { Story } from '@/types/story';
import StoryActions from '@/components/StoryActions';
import StoryModal from '@/components/StoryModal';

type SortOption = 'newest' | 'popular' | 'smart';

const getExcerpt = (content: string, maxLength: number = 300) => {
  const firstParagraph = content.split('\n')[0];
  if (firstParagraph.length <= maxLength) return firstParagraph;
  return firstParagraph.slice(0, maxLength) + '...';
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <p className="text-white/60 text-lg mb-4">No stories generated yet</p>
    <p className="text-white/40">Click the button above to create the first story!</p>
  </motion.div>
);

export default function GeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('smart');
  const [setError] = useState<string | null>(null);

  // Load stories
  useEffect(() => {
    console.log('Setting up Firestore listener...');
    
    const q = query(
      collection(db, 'stories'),
      orderBy('createdAt', 'desc')
    );

    // Keep track of comment subscriptions
    const commentUnsubscribes = new Map();

    const unsubscribe = onSnapshot(q,
      async (snapshot) => {
        console.log('Received stories snapshot:', snapshot.size);
        
        const storiesData = await Promise.all(snapshot.docs.map(async doc => {
          const data = doc.data();
          
          // Clean up previous comment listener for this story if it exists
          if (commentUnsubscribes.has(doc.id)) {
            commentUnsubscribes.get(doc.id)();
            commentUnsubscribes.delete(doc.id);
          }
          
          // Set up new comment listener
          const commentsQuery = query(
            collection(db, 'stories', doc.id, 'comments'),
            orderBy('createdAt', 'asc')
          );
          
          const commentUnsubscribe = onSnapshot(commentsQuery, (commentsSnapshot) => {
            const comments = commentsSnapshot.docs.map(commentDoc => ({
              id: commentDoc.id,
              text: commentDoc.data().text,
              createdAt: commentDoc.data().createdAt?.toDate(),
              upvotes: commentDoc.data().upvotes || 0,
              downvotes: commentDoc.data().downvotes || 0,
            }));

            setStories(currentStories => {
              const storyIndex = currentStories.findIndex(s => s.id === doc.id);
              if (storyIndex === -1) return currentStories;

              const updatedStories = [...currentStories];
              updatedStories[storyIndex] = {
                ...updatedStories[storyIndex],
                comments,
              };
              return applySort(updatedStories, sortOption);
            });
          });

          commentUnsubscribes.set(doc.id, commentUnsubscribe);

          const story: Story = {
            id: doc.id,
            content: data.content,
            createdAt: data.createdAt?.toDate(),
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
            comments: [],
          };
          
          return story;
        }));

        setStories(applySort(storiesData, sortOption));
      },
      (error) => {
        console.error('Firestore error:', error);
        setError('Failed to load stories');
      }
    );

    return () => {
      // Clean up all comment listeners
      commentUnsubscribes.forEach(unsubscribe => unsubscribe());
      unsubscribe();
    };
  }, [sortOption]);

  const applySort = (items: Story[], sort: SortOption) => {
    return [...items].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      
      if (sort === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sort === 'popular') {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      } else { // 'smart' - combines recency and popularity
        const now = new Date().getTime();
        const hoursOldA = (now - a.createdAt.getTime()) / (1000 * 60 * 60);
        const hoursOldB = (now - b.createdAt.getTime()) / (1000 * 60 * 60);
        const scoreA = (a.upvotes - a.downvotes) / (hoursOldA + 2); // +2 to avoid division by zero and reduce the impact of very new posts
        const scoreB = (b.upvotes - b.downvotes) / (hoursOldB + 2);
        return scoreB - scoreA;
      }
    });
  };

  const generateNew = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const content = await generateFunContent();
      if (!content) throw new Error('Failed to generate content');

      await addDoc(collection(db, 'stories'), {
        content,
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate story');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleComment = async (storyId: string, text: string) => {
    try {
      setIsLoading(true);
      await addDoc(collection(db, 'stories', storyId, 'comments'), {
        text: text.trim(),
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'smart', label: 'Most Relevant' },
    { value: 'newest', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
  ];

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none -z-10"></div>

        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-40 backdrop-blur-lg bg-blue-900/80 border-b border-white/10"
        >
          <div className="container mx-auto px-4">
            <div className="py-3 flex flex-col md:flex-row md:items-center gap-4 md:gap-0 md:justify-between">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <Link 
                  href="/"
                  className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <House size={24} weight="light" />
                </Link>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">AI Story Generator</h1>
                  <Robot size={24} weight="light" className="text-yellow-400" />
                </div>
              </motion.div>

              {/* Sort Options */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <ArrowsDownUp size={20} weight="light" className="text-white/60 shrink-0" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full md:w-auto bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-blue-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-4xl mx-auto">
            {/* Generate Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <p className="text-white/60 text-lg mb-6">
                Powered by Google Gemini AI
              </p>
              <button
                onClick={() => void generateNew()}
                disabled={isLoading}
                className={`
                  inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xl font-medium
                  transition-all duration-200
                  ${isLoading
                    ? 'bg-purple-500/50 text-white/50 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-400 hover:scale-105 active:scale-95'
                  }
                `}
              >
                <ArrowClockwise 
                  size={28} 
                  weight="light"
                  className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : ''}`}
                />
                {isLoading ? 'AI is writing...' : 'Generate AI Story'}
              </button>
            </motion.div>

            {/* Story Feed */}
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedStory(story)}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl cursor-pointer
                              hover:bg-white/20 transition-colors hover:shadow-2xl group"
                  >
                    <div className="prose prose-lg prose-invert max-w-none mb-4">
                      <p className="text-white/90 text-lg leading-relaxed line-clamp-4 group-hover:text-white transition-colors">
                        {getExcerpt(story.content)}
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-4">
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
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </motion.div>
      </motion.main>
      
      {/* Story Modal - Fixed positioning */}
      {selectedStory && (
        <StoryModal
          story={stories.find(s => s.id === selectedStory.id) || selectedStory}
          isOpen={!!selectedStory}
          onClose={() => setSelectedStory(null)}
          onComment={handleComment}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
