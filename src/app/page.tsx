'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bus, ChatTeardrop, WarningOctagon, Calendar } from '@phosphor-icons/react';
import FAQ from '@/components/FAQ';
import QuickLinks from '@/components/QuickLinks';
import WeatherWidget from '@/components/WeatherWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative container mx-auto px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">🏠</div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Witelli<span className="text-blue-400">20</span>
            </h1>
            <p className="text-xl text-white/80">
              Welcome to the Witellikerstrasse 20 student community dashboard!
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Weather widget (first on mobile, right side on md screens) */}
            <div className="order-first md:order-last md:row-span-1">
              <WeatherWidget />
            </div>
            
            {/* Large cards (take up 2 columns on md screens) */}
            <div className="order-last md:order-first md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link
                href="/reservations"
                className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 rounded-xl p-6 text-white"
              >
                <Calendar
                  size={32}
                  weight="light"
                  className="mb-3 text-green-400 group-hover:scale-110 transition-transform duration-200"
                />
                <h2 className="text-lg font-semibold mb-2">Room Reservations</h2>
                <p className="text-sm text-white/60">
                  Book common spaces in advance
                </p>
              </Link>
              
              <Link 
                href="/transport"
                className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 rounded-xl p-6 text-white"
              >
                <Bus 
                  size={32}
                  weight="light"
                  className="mb-3 text-blue-400 group-hover:scale-110 transition-transform duration-200"
                />
                <h2 className="text-lg font-semibold mb-2">Transport</h2>
                <p className="text-sm text-white/60">
                  Live departures and connections
                </p>
              </Link>

              <Link
                href="/stolen"
                className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 rounded-xl p-6 text-white"
              >
                <WarningOctagon
                  size={32}
                  weight="light"
                  className="mb-3 text-red-400 group-hover:scale-110 transition-transform duration-200"
                />
                <h2 className="text-lg font-semibold mb-2">Lost & Found</h2>
                <p className="text-sm text-white/60">
                  Track missing items & packages
                </p>
              </Link>

              <Link 
                href="/board"
                className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 rounded-xl p-6 text-white"
              >
                <ChatTeardrop 
                  size={32}
                  weight="light"
                  className="mb-3 text-purple-400 group-hover:scale-110 transition-transform duration-200"
                />
                <h2 className="text-lg font-semibold mb-2">Confessions</h2>
                <p className="text-sm text-white/60">
                  Anonymous community posts
                </p>
              </Link>
            </div>
          </div>

          {/* Quick Links and FAQ Sections */}
          <div className="space-y-16">
            <QuickLinks />
            <FAQ />
          </div>
          
        </motion.div>
      </div>
    </main>
  );
}
