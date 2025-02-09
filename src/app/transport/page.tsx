'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import TransportBoard from '@/components/TransportBoard';
import StudentConnections from '@/components/StudentConnections';
import NextDeparture from '@/components/NextDeparture';
import { House } from '@phosphor-icons/react';

export default function TransportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/"
                  className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <House size={24} weight="light" />
                </Link>
                <h1 className="text-2xl font-bold text-white">
                  Transport
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <NextDeparture />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Local Departures - Left Column */}
          <div className="lg:sticky lg:top-28 lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">From Balgrist</h2>
            <TransportBoard />
          </div>

          {/* Student Connections - Right Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Student Destinations</h2>
            <StudentConnections />
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} Witellikerstrasse 20</p>
            <p className="text-sm mt-2">
              Built with Next.js & Swiss Transport API
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
