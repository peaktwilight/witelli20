'use client';

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

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Mobile View: Tabs */}
        <div className="block lg:hidden mb-4">
          <div className="relative">
            <select
              onChange={(e) => {
                const element = document.getElementById(e.target.value);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full appearance-none bg-white/10 text-white border border-white/20 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              style={{ WebkitAppearance: 'none' }}
            >
              <option value="departures" style={{ backgroundColor: '#1e3a8a' }}>From Balgrist</option>
              <option value="destinations" style={{ backgroundColor: '#1e3a8a' }}>Student Destinations</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/60">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Local Departures */}
          <div id="departures" className="lg:sticky lg:top-28 lg:col-span-1 space-y-3 sm:space-y-4 bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">From Balgrist</h2>
            <TransportBoard />
          </div>

          {/* Student Connections */}
          <div id="destinations" className="lg:col-span-2 space-y-3 sm:space-y-4 bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Student Destinations</h2>
            <StudentConnections />
          </div>
        </div>
      </div>

    </main>
  );
}
