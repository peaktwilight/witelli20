'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, Timestamp } from 'firebase/firestore';
import { House, Clock } from '@phosphor-icons/react';
import { db } from '@/lib/firebase';
import type { Message, TimePeriod } from '@/types/message';
import MessageActions from '@/components/MessageActions';

export default function BoardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  useEffect(() => {
    // Calculate the timestamp for the selected time period
    const now = new Date();
    let filterDate = new Date();
    
    switch (timePeriod) {
      case 'day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        filterDate = new Date(0); // Beginning of time
        break;
    }

    const q = query(
      collection(db, 'messages'),
      where('createdAt', '>=', Timestamp.fromDate(filterDate)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate(),
          upvotes: data.upvotes,
          downvotes: data.downvotes,
        } as Message;
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [timePeriod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
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
              <h1 className="text-2xl font-bold text-white">
                Message Board
              </h1>
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
          {/* Post Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-white/5 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                rows={3}
              />
              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-white/40">
                  Anonymous posting enabled
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
                  {isSubmitting ? 'Posting...' : 'Post'}
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

            {messages.length === 0 && (
              <div className="text-center py-12 text-white/40">
                No messages in this time period. Be the first to post!
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} Witellikerstrasse 20</p>
            <p className="text-sm mt-2">
              Built with Next.js & Firebase
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
