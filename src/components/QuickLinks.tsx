'use client';

import { Phone, CaretDown } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ContactSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ContactSection = ({ title, children, defaultOpen = false }: ContactSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between group"
      >
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <Phone weight="light" className="mr-2" /> {title}
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
          >
            <div className="grid gap-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function QuickLinks() {
  return (
    <ContactSection title="Important Contacts" defaultOpen={true}>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="font-semibold text-white mb-2">Janitor - Juan Vazquez</h3>
        <div className="text-white/80">
          <p>Available: Monday - Friday, 7:00 - 16:00</p>
          <p>Phone: 079 313 90 11</p>
          <p>Email: juan.vazquez@woko.ch</p>
          <div className="mt-2">
            <p>Responsible for:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Repairs</li>
              <li>Technical installations maintenance</li>
            </ul>
          </div>
          <p className="text-sm text-yellow-400 mt-2">
            Note: WhatsApp messages and SMS are not processed
          </p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="font-semibold text-white mb-2">House Representative - Luca Gschwind</h3>
        <div className="text-white/80">
          <p>First WOKO contact for students on-site</p>
          <div className="mt-2">
            <p>Contact for:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Key management</li>
              <li>Laundry badge management</li>
              <li>Internet issues</li>
              <li>Noise complaints</li>
            </ul>
          </div>
          <div className="mt-4 space-y-1">
            <p>General inquiries: <a href="http://woko.ch/contact" className="text-blue-400 hover:underline">woko.ch/contact</a></p>
            <p>Direct contact: <span className="text-blue-400">hr.wit20@woko.ch</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="font-semibold text-white mb-2">Emergency Services</h3>
        <div className="space-y-4 text-white/80">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Emergency Numbers:</p>
              <ul className="mt-1 space-y-1">
                <li>Police: 117</li>
                <li>Fire Department: 118</li>
                <li>Ambulance: 144</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">WOKO Administration:</p>
              <p>T: +41 44 256 68 00</p>
              <p>Stauffacherstrasse 101</p>
              <p>8004 Zürich</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="font-medium mb-2">Technical Emergency Contacts (Outside office hours: Mon-Fri 16:00-07:00, Sat/Sun & holidays)</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Electrician:</p>
                <p>Elektro Team Marques GmbH</p>
                <p>044 747 02 20</p>
                <p className="text-sm text-white/60">For power failures</p>
              </div>
              <div>
                <p className="font-medium">Plumber:</p>
                <p>Künzler Haustechnik GmbH</p>
                <p>044 593 23 22</p>
                <p className="text-sm text-white/60">For heating, water issues</p>
              </div>
              <div>
                <p className="font-medium">Locksmith:</p>
                <p>Master Key</p>
                <p>044 312 12 32</p>
                <p className="text-sm text-white/60">For key loss, emergency door opening</p>
              </div>
              <div>
                <p className="font-medium">Carpenter:</p>
                <p>Schreiner 48</p>
                <p>0800 55 48 48</p>
                <p className="text-sm text-white/60">For window/door glass damage</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-sm">Important: For technical emergencies during office hours (Mon-Fri 07:00-16:00), contact the house representative first. They will contact the janitor. If unreachable, you may contact the janitor directly.</p>
            <p className="text-sm text-yellow-400 mt-2">After any emergency service outside office hours, you must inform WOKO on the next working day via their website contact form.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="font-semibold text-white mb-2">Report Non-Emergency Damage</h3>
        <div className="text-white/80">
          <p>Submit damage reports through:</p>
          <a 
            href="http://www.woko.ch/schadenformular/?property=6001" 
            className="text-blue-400 hover:underline block mt-2"
          >
            www.woko.ch/schadenformular
          </a>
          <p className="text-sm text-yellow-400 mt-2">
            Note: Emergency calls that were not actual emergencies or used unauthorized companies will be charged to the tenant
          </p>
        </div>
      </div>
    </ContactSection>
  );
}
