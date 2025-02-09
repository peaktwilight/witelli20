import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDailyStory } from '@/lib/storyGenerator';

export default function DailyStory() {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStory = async () => {
    setRefreshing(true);
    const newStory = await generateDailyStory();
    setStory(newStory);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStory();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Today at Witelli20</span>
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchStory}
          disabled={refreshing}
          className="text-white bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={story}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              {story.split('\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="mb-4 text-white/80 leading-relaxed last:mb-0"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
