'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { House, ArrowClockwise, Robot } from '@phosphor-icons/react';
import { generateFunContent } from '@/lib/funGenerator';

export default function GeneratorPage() {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateNew = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newContent = await generateFunContent();
      setContent(newContent);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!content) {
      void generateNew();
    }
  }, [content, generateNew]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="py-3 flex items-center justify-between">
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
        <div className="max-w-2xl mx-auto">
          {/* Generate Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
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

          {/* Content Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {content && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
              >
                <div className="prose prose-xl prose-invert max-w-none">
                  {content.split('\n').map((paragraph, i) => (
                    paragraph.trim() && (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-white/90 text-xl leading-relaxed mb-6 last:mb-0"
                      >
                        {paragraph}
                      </motion.p>
                    )
                  ))}
                </div>
              </motion.div>
            )}

            {!content && !isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-white/60 py-12"
              >
                <p className="text-xl mb-4">Oops! Something went wrong 😅</p>
                <p>Try clicking the button again!</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.main>
  );
}
