'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { House, Clock, ChatCircle, ArrowsDownUp } from '@phosphor-icons/react';
import { db } from '@/lib/firebase';
import type { Message, TimePeriod, SortOption, Reply } from '@/types/message';
import MessageActions from '@/components/MessageActions';

const calculateScore = (message: Message) => {
  const now = new Date().getTime();
  const age = now - message.createdAt.getTime();
  const ageInHours = age / (1000 * 60 * 60);
  
  // Base score decays logarithmically with age
  const baseScore = 1 / Math.log2(ageInHours + 2);
  
  // Vote score ranges from -1 to 1
  const totalVotes = message.upvotes + message.downvotes;
  const voteScore = totalVotes > 0 ? (message.upvotes - message.downvotes) / totalVotes : 0;
  
  // Reply bonus (if replies exist)
  const replyBonus = message.replies ? Math.min(message.replies.length / 5, 1) : 0;
  
  return baseScore * (1 + voteScore + replyBonus);
};

export default function BoardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [sortOption, setSortOption] = useState<SortOption>('smart');
  const [error, setError] = useState<string | null>(null);

  // Set up message listeners
  useEffect(() => {
    try {
      console.log('Setting up Firestore listeners...');
      
      // Listen for top-level messages
      const messagesQuery = query(
        collection(db, 'messages'),
        where('parentId', '==', null),
        orderBy('createdAt', 'desc')
      );

      // Create a map to store reply unsubscribe functions
      const replyUnsubscribes = new Map();

      const unsubscribeMessages = onSnapshot(messagesQuery, 
        (snapshot) => {
          console.log('Received messages snapshot:', snapshot.size, 'documents');
          
          // Process messages and set up reply listeners
          const processedMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            const message = {
              id: doc.id,
              text: data.text,
              createdAt: data.createdAt?.toDate(),
              upvotes: data.upvotes || 0,
              downvotes: data.downvotes || 0,
              replies: [],
            } as Message;

            // Set up reply listener for this message
            if (replyUnsubscribes.has(doc.id)) {
              replyUnsubscribes.get(doc.id)();
            }

            const repliesQuery = query(
              collection(db, 'messages'),
              where('parentId', '==', doc.id),
              orderBy('createdAt', 'asc')
            );

            const unsubscribeReplies = onSnapshot(repliesQuery, (repliesSnapshot) => {
              const replies = repliesSnapshot.docs.map(replyDoc => ({
                id: replyDoc.id,
                text: replyDoc.data().text,
                createdAt: replyDoc.data().createdAt?.toDate(),
                upvotes: replyDoc.data().upvotes || 0,
                downvotes: replyDoc.data().downvotes || 0,
              }));

              setMessages(currentMessages => {
                const messageIndex = currentMessages.findIndex(m => m.id === doc.id);
                if (messageIndex === -1) return currentMessages;

                const updatedMessages = [...currentMessages];
                updatedMessages[messageIndex] = {
                  ...updatedMessages[messageIndex],
                  replies,
                };
                return applySort(updatedMessages, sortOption);
              });
            });

            replyUnsubscribes.set(doc.id, unsubscribeReplies);
            return message;
          });

          setMessages(applySort(processedMessages, sortOption));
          setError(null);
        },
        (error) => {
          console.error('Firestore error:', error);
          setError('Failed to load messages. Please try again later.');
        }
      );

      return () => {
        console.log('Cleaning up Firestore listeners...');
        unsubscribeMessages();
        replyUnsubscribes.forEach(unsubscribe => unsubscribe());
      };
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to set up message loading. Please try again later.');
    }
  }, [timePeriod, sortOption]);

  const applySort = (messages: Message[], sort: SortOption) => {
    return [...messages].sort((a, b) => {
      if (sort === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sort === 'popular') {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      } else {
        // 'smart' sorting using calculated score
        const scoreA = calculateScore(a);
        const scoreB = calculateScore(b);
        return scoreB - scoreA;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const text = parentId ? replyText[parentId] : newMessage;
    if (!text.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log('Adding new message...');
      
      await addDoc(collection(db, 'messages'), {
        text: text.trim(),
        parentId: parentId || null,
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });

      console.log('Message added successfully');
      
      if (parentId) {
        setReplyText(prev => ({ ...prev, [parentId]: '' }));
        setReplyingTo(null);
      } else {
        setNewMessage('');
      }
      
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

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'smart', label: 'Most Relevant' },
    { value: 'newest', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
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

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowsDownUp size={20} weight="light" className="text-white/60" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-blue-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
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

          {/* New Message Form */}
          <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
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
                  <div className="flex items-center gap-4">
                    <MessageActions 
                      messageId={message.id}
                      upvotes={message.upvotes}
                      downvotes={message.downvotes}
                    />
                    <button
                      onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                      className={`text-purple-400 hover:text-purple-300 ${replyingTo === message.id ? 'font-medium' : ''}`}
                    >
                      {replyingTo === message.id ? 'Cancel' : 'Reply'}
                    </button>
                  </div>
                  <span className="text-white/40">
                    {message.createdAt?.toLocaleDateString()}
                  </span>
                </div>

                {/* Reply Form */}
                {replyingTo === message.id && (
                  <form 
                    onSubmit={(e) => handleSubmit(e, message.id)}
                    className="mt-4 ml-4 border-l-2 border-white/10 pl-4"
                  >
                    <div className="bg-white/5 rounded-lg p-3">
                      <textarea
                        value={replyText[message.id] || ''}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [message.id]: e.target.value }))}
                        placeholder="Write a reply..."
                        className="w-full bg-white/5 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        rows={2}
                      />
                      <div className="mt-3 flex justify-end">
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
                          {isSubmitting ? 'Replying...' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {message.replies && message.replies.length > 0 && (
                  <div className="mt-4 ml-4 border-l-2 border-white/10 pl-4 space-y-3">
                    {message.replies.map((reply: Reply) => (
                      <div key={reply.id} className="bg-white/5 rounded-lg p-3">
                        <p className="text-white/90 mb-2">{reply.text}</p>
                        <div className="flex items-center justify-between text-sm">
                          <MessageActions
                            messageId={reply.id}
                            upvotes={reply.upvotes}
                            downvotes={reply.downvotes}
                          />
                          <span className="text-white/40">
                            {reply.createdAt?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
