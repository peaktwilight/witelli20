'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { House, Clock, ChatCircle } from '@phosphor-icons/react';
import { db } from '@/lib/firebase';
import type { Message, TimePeriod } from '@/types/message';
import MessageActions from '@/components/MessageActions';

export default function BoardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('Setting up Firestore listener...');
      
      const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('Received Firestore snapshot:', snapshot.size, 'documents');
          const newMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              text: data.text,
              createdAt: data.createdAt?.toDate(),
              upvotes: data.upvotes || 0,
              downvotes: data.downvotes || 0,
            } as Message;
          });
          setMessages(newMessages);
          setError(null);
        },
        (error) => {
          console.error('Firestore error:', error);
          setError('Failed to load messages. Please try again later.');
        }
      );

      return () => {
        console.log('Cleaning up Firestore listener...');
        unsubscribe();
      };
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to set up message loading. Please try again later.');
    }
  }, [timePeriod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log('Adding new message...');
      
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });

      console.log('Message added successfully');
      setNewMessage('');
      setError(null);
    } catch (error) {
      console.error('Error adding message:', error);
      setError('Failed to post message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeFilters: { value: TimePeriod; label: string }[] = [
    { value: 'day', label: 'Last 24h' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <House size={24} weight="light" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ChatCircle size={24} weight="light" className="text-purple-400" />
                  Witelli Confessions
                </h1>
                <p className="text-sm text-white/60">Anonymous messages for Witelli residents</p>
              </div>
            </div>

            {/* Time Period Filter */}
            <div className="flex items-center gap-2">
              <Clock size={20} weight="light" className="text-white/60" />
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {timeFilters.map((filter) => (
                  <option key={filter.value} value={filter.value} className="bg-blue-900">
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Post Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your anonymous confession or message..."
                className="w-full bg-white/5 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                rows={3}
              />
              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-white/40">
                  Your message will be posted anonymously
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    ${isSubmitting
                      ? 'bg-purple-500/50 text-white/50'
                      : 'bg-purple-500 text-white hover:bg-purple-400 transition-colors'
                    }
                  `}
                >
                  {isSubmitting ? 'Posting...' : 'Post Anonymously'}
                </button>
              </div>
            </div>
          </form>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <p className="text-white/90 mb-3">{message.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <MessageActions 
                    messageId={message.id}
                    upvotes={message.upvotes}
                    downvotes={message.downvotes}
                  />
                  <span className="text-white/40">
                    {message.createdAt?.toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}

            {messages.length === 0 && !error && (
              <div className="text-center py-12 text-white/40">
                No confessions yet. Be the first to share anonymously!
              </div>
            )}
          </div>
        </div>
      </div>

    </main>
  );
}
