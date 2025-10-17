'use client';

import { Question, CaretDown } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FAQItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FAQItem = ({ title, children, defaultOpen = false }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 md:p-6 text-left flex items-center justify-between group hover:bg-white/5 transition-colors"
      >
        <h3 className="font-semibold text-white text-sm md:text-base">{title}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretDown className="text-white/60 group-hover:text-white/80 transition-colors" size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 text-white/80 space-y-4 text-sm md:text-base">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = ({ title, children, defaultOpen = false }: FAQSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between group"
      >
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <Question weight="light" className="mr-2" /> {title}
        </h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretDown className="text-white/60 group-hover:text-white/80 transition-colors" size={24} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
  return (
    <div className="space-y-8">
      <FAQSection title="Emergency Procedures" defaultOpen={true}>
        <FAQItem title="What counts as an emergency?" defaultOpen={true}>
          <ul className="list-disc list-inside space-y-1">
            <li>Water pipe rupture and flooding</li>
            <li>Water backflow from toilets and showers</li>
            <li>No water supply</li>
            <li>Heating failure</li>
            <li>No electricity in the apartment (check fuses first)</li>
            <li>Break-in (contact police first)</li>
            <li>Window or door glass damage</li>
          </ul>
        </FAQItem>

        <FAQItem title="What is NOT an emergency?">
          <ul className="list-disc list-inside space-y-1">
            <li>Water tap dripping or toilet flush running</li>
            <li>Washing machine or washing card defective</li>
            <li>Refrigerator, stove, dishwasher defects</li>
            <li>Problems with neighbours</li>
          </ul>
        </FAQItem>

        <FAQItem title="Technical Emergency Procedures">
          <div className="space-y-4">
            <div>
              <p className="font-medium">During Office Hours (Mon-Fri 07:00-16:00):</p>
              <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                <li>Contact house representative for urgent technical problems</li>
                <li>They will contact the janitor by phone</li>
                <li>If house representative unavailable, contact janitor directly</li>
              </ol>
            </div>

            <div>
              <p className="font-medium">Outside Office Hours (Mon-Fri 16:00-07:00, Sat/Sun & holidays):</p>
              <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                <li>Inform house representative first</li>
                <li>They will contact appropriate emergency service</li>
                <li>If unreachable, contact emergency services directly</li>
                <li>Inform WOKO on next working day via contact form</li>
              </ol>
            </div>

            <p className="text-yellow-400 text-sm">
              Important: Unauthorized emergency calls or non-emergency calls will be charged to the tenant
            </p>
          </div>
        </FAQItem>

        <FAQItem title="Fire Emergency Procedures">
          <div className="space-y-4">
            <p className="font-medium">If you discover a fire:</p>
            
            <div>
              <p className="font-medium">1. Call Fire Department (118)</p>
              <p className="ml-4">Provide:</p>
              <ul className="list-disc list-inside ml-8">
                <li>Location of fire</li>
                <li>What is burning</li>
                <li>Your name</li>
              </ul>
            </div>

            <div>
              <p className="font-medium">2. Help Others</p>
              <ul className="list-disc list-inside ml-4">
                <li>Alert and help others evacuate</li>
                <li>DO NOT use elevators</li>
              </ul>
            </div>

            <div>
              <p className="font-medium">3. Contain Fire</p>
              <ul className="list-disc list-inside ml-4">
                <li>Leave room/apartment</li>
                <li>Close all doors and windows</li>
                <li>Stay calm</li>
              </ul>
            </div>

            <div>
              <p className="font-medium">4. If Safe to Do So</p>
              <p className="ml-4">Use fire extinguisher or fire hose to fight the fire</p>
            </div>
          </div>
        </FAQItem>
      </FAQSection>

      <FAQSection title="Damage Reports">
        <FAQItem title="How to report non-emergency damage?">
          <div className="space-y-2">
            <p>Submit your damage report through:</p>
            <a 
              href="http://www.woko.ch/schadenformular/?property=6001" 
              className="text-blue-400 hover:underline block"
            >
              www.woko.ch/schadenformular
            </a>
            <p className="text-sm mt-2">
              For maintenance issues, submit written notifications to the janitor&apos;s letterbox
            </p>
          </div>
        </FAQItem>
      </FAQSection>

      <FAQSection title="House Rules">
        <FAQItem title="General Rules">
          <div className="space-y-2">
            <p>All residents must:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Show mutual consideration</li>
              <li>Participate in community tasks (cleaning, maintenance)</li>
              <li>Share costs for common areas</li>
              <li>Report damages immediately</li>
            </ul>
          </div>
        </FAQItem>

        <FAQItem title="Guests & Double Occupancy">
          <div className="space-y-2">
            <p>For guests staying longer than 14 days:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Must inform WOKO (considered double occupancy)</li>
              <li>Requires majority approval from flatmates</li>
              <li>Additional fee of CHF 100 per month</li>
              <li>Guest must register with local authorities</li>
            </ul>
          </div>
        </FAQItem>

        <FAQItem title="Property Rules">
          <ul className="list-disc list-inside space-y-1">
            <li>Smoking is forbidden in the entire building</li>
            <li>No pets allowed</li>
            <li>No personal appliances in common areas</li>
            <li>No structural modifications</li>
            <li>No personal refrigerators, rice cookers, or water kettles in rooms</li>
          </ul>
        </FAQItem>
      </FAQSection>
    </div>
  );
}
