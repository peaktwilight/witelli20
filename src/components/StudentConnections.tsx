import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Connection, getAllStudentConnections, formatDuration } from '@/lib/transportApi';
import CountdownTimer from './CountdownTimer';
import StudentDestinationIcon from './StudentDestinationIcon';
import TransportBadge from './TransportBadge';
import TransportIcon from './TransportIcon';

export default function StudentConnections() {
  const [connections, setConnections] = useState<Record<string, Connection[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const data = await getAllStudentConnections();
        setConnections(data);
        setError(null);
      } catch (err) {
        setError('Failed to load connections');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
    const interval = setInterval(fetchConnections, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              <div className="h-20 bg-white/10 rounded"></div>
              <div className="h-20 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
      >
        <div className="text-red-400 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      </motion.div>
    );
  }

  const renderJourneyStep = (section: Connection['sections'][0], index: number, isLast: boolean) => {
    if (!section.departure.departure || !section.arrival.arrival) return null;

    const departureTime = new Date(section.departure.departure);
    const arrivalTime = new Date(section.arrival.arrival);

    return (
      <div key={index} className="relative flex items-start pb-8 last:pb-0">
        {!isLast && (
          <div className="absolute left-3.5 top-5 bottom-0 w-px bg-white/10"></div>
        )}
        <div className="relative flex h-7 w-7 flex-none items-center justify-center">
          <div className={`h-2 w-2 rounded-full ${section.journey ? 'bg-white/40' : 'bg-white/20'}`}></div>
        </div>
        <div className="ml-4 w-full">
          <div className="flex items-baseline justify-between">
            <div className="flex-1">
              <div className="font-mono text-white/90">
                {departureTime.toLocaleTimeString('de-CH', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </div>
              <div className="text-sm text-white/60">{section.departure.station.name}</div>
            </div>
            {section.journey ? (
              <div className="ml-4">
                <TransportBadge 
                  category={section.journey.category} 
                  number={section.journey.number} 
                  size="sm"
                />
              </div>
            ) : section.walk ? (
              <div className="ml-4 text-xs text-white/40 flex items-center space-x-1.5 bg-white/5 px-2 py-1 rounded">
                <TransportIcon type="WALK" />
                <span>{formatDuration(section.walk.duration)}</span>
              </div>
            ) : null}
          </div>
          {isLast && (
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <div className="font-mono text-white/90">
                  {arrivalTime.toLocaleTimeString('de-CH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>
                <div className="text-sm text-white/60">{section.arrival.station.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {Object.entries(connections).map(([destination, connectionList]) => (
        <motion.div
          key={destination}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <StudentDestinationIcon destination={destination} />
              </span>
              <span>{destination}</span>
            </h3>
          </div>
          <div className="divide-y divide-white/10">
            {connectionList.slice(0, 2).map((connection, idx) => connection.from.departure && (
              <div key={idx} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <CountdownTimer targetTime={connection.from.departure} />
                  <div className="text-white/60 text-sm">
                    {formatDuration(connection.duration)} • {connection.transfers} transfer{connection.transfers !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="space-y-2">
                  {connection.sections.map((section, index) => 
                    renderJourneyStep(section, index, index === connection.sections.length - 1)
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
