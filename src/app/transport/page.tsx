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
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="py-2 sm:py-3 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <House size={24} weight="light" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Transport
              </h1>
            </div>
            <div className="flex items-center justify-start sm:justify-end">
              <NextDeparture />
            </div>
          </div>
        </div>
      </header>

      {/* Background Grid */}
      <div className="fixed inset-x-0 top-[72px] bottom-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Mobile View: Navigation */}
        <div className="block lg:hidden mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsBalgristOpen(true);
                const element = document.getElementById('departures');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-4 py-3 text-sm font-medium"
            >
              From Balgrist
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('destinations');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-4 py-3 text-sm font-medium"
            >
              Student Destinations
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Local Departures */}
          <div id="departures" className="lg:sticky lg:top-28 lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
              <button
                onClick={() => setIsBalgristOpen(!isBalgristOpen)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between group"
              >
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                   <Train size={20} weight="light" />
                  </span>
                  <span>Departures from Balgrist</span>
                </h3>
                <svg
                  className={`w-5 h-5 transition-transform ${isBalgristOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isBalgristOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="divide-y divide-white/10"
                  >
                    <TransportBoard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Student Connections */}
          <div id="destinations" className="lg:col-span-2">
            <StudentConnections />
          </div>
        </div>
      </div>

    </main>
  );
}
