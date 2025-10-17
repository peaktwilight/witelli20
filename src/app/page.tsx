'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bus, ChatTeardrop, WarningOctagon, Calendar } from '@phosphor-icons/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import FAQ from '@/components/FAQ';
import QuickLinks from '@/components/QuickLinks';
import WeatherWidget from '@/components/WeatherWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative container mx-auto px-4 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12 md:mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white"
            >
              Witelli<span className="text-blue-400">20</span>
            </motion.h1>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center -my-8 md:-my-12"
            >
              <div className="w-96 h-96 md:w-[32rem] md:h-[32rem]">
                <DotLottieReact
                  src="/students_speaking.lottie"
                  loop
                  autoplay
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/80 px-4"
            >
              Welcome to the Witellikerstrasse 20 student community dashboard!
            </motion.p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            {/* Weather widget (first on mobile, right side on md screens) */}
            <div className="order-first md:order-last md:row-span-1">
              <WeatherWidget />
            </div>

            {/* Large cards (take up 2 columns on md screens) */}
            <div className="order-last md:order-first md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/reservations"
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:from-white/20 hover:to-white/10 transition-all duration-300 rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-400/30 block h-full"
                >
                  <Calendar
                    size={36}
                    weight="light"
                    className="mb-3 text-green-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  />
                  <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">Room Reservations</h2>
                  <p className="text-sm text-white/70">
                    Book common spaces in advance
                  </p>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/transport"
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:from-white/20 hover:to-white/10 transition-all duration-300 rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30 block h-full"
                >
                  <Bus
                    size={36}
                    weight="light"
                    className="mb-3 text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  />
                  <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">Transport</h2>
                  <p className="text-sm text-white/70">
                    Live departures and connections
                  </p>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/stolen"
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:from-white/20 hover:to-white/10 transition-all duration-300 rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-400/30 block h-full"
                >
                  <WarningOctagon
                    size={36}
                    weight="light"
                    className="mb-3 text-red-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  />
                  <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors">Lost & Found</h2>
                  <p className="text-sm text-white/70">
                    Track missing items & packages
                  </p>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  href="/board"
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:from-white/20 hover:to-white/10 transition-all duration-300 rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-400/30 block h-full"
                >
                  <ChatTeardrop
                    size={36}
                    weight="light"
                    className="mb-3 text-purple-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  />
                  <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Confessions</h2>
                  <p className="text-sm text-white/70">
                    Anonymous community posts
                  </p>
                </Link>
              </motion.div>
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
