'use client';

import Link from 'next/link';
import TransportBoard from '@/components/TransportBoard';
import StudentConnections from '@/components/StudentConnections';
import NextDeparture from '@/components/NextDeparture';
import { House, Train } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function TransportPage() {
  const [isBalgristOpen, setIsBalgristOpen] = useState(true);
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-indigo-900/90 border-b border-white/20 shadow-xl"
      >
        <div className="container mx-auto px-4">
          <div className="py-3 md:py-4 space-y-2 md:space-y-0 md:flex md:items-center md:justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 text-white/70 hover:text-white transition-all rounded-xl hover:bg-white/10"
              >
                <House size={24} weight="light" />
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Train size={28} weight="light" className="text-blue-400" />
                Transport
              </h1>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <NextDeparture />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Background Grid */}
      <div className="fixed inset-x-0 top-[72px] bottom-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Mobile View: Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="block lg:hidden mb-6"
        >
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsBalgristOpen(true);
                const element = document.getElementById('departures');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-4 py-3.5 text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all"
            >
              From Balgrist
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const element = document.getElementById('destinations');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-4 py-3.5 text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all"
            >
              Student Destinations
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Local Departures */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            id="departures"
            className="lg:sticky lg:top-28 lg:col-span-1 h-fit"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-xl">
              <button
                onClick={() => setIsBalgristOpen(!isBalgristOpen)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-5 flex items-center justify-between group transition-all"
              >
                <h3 className="text-base md:text-lg font-semibold flex items-center space-x-3">
                  <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                   <Train size={22} weight="light" />
                  </span>
                  <span>Departures from Balgrist</span>
                </h3>
                <motion.svg
                  animate={{ rotate: isBalgristOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {isBalgristOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="divide-y divide-white/10"
                  >
                    <TransportBoard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Student Connections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            id="destinations"
            className="lg:col-span-2"
          >
            <StudentConnections />
          </motion.div>
        </div>
      </div>

    </main>
  );
}
