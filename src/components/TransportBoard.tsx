import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StationBoardEntry, getStationBoard } from '@/lib/transportApi';
import CountdownTimer from './CountdownTimer';
import TransportBadge from './TransportBadge';

export default function TransportBoard() {
  const [departures, setDepartures] = useState<StationBoardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartures = async () => {
      try {
        setLoading(true);
        const data = await getStationBoard('Balgrist');
        setDepartures(data.stationboard);
        setError(null);
      } catch (err) {
        setError('Failed to load transport information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartures();
    const interval = setInterval(fetchDepartures, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-8 flex items-center justify-center"
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="divide-y divide-white/10"
        >
          {departures.map((departure, index) => {
            if (!departure.stop.departure) return null;

            const departureTime = new Date(departure.stop.departure);

            return (
              <motion.div
                key={`${departure.name}-${departure.stop.departure}-${index}`}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
                className="p-4 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <TransportBadge category={departure.category} number={departure.number} />
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-white/90 truncate max-w-[200px]">{departure.to}</span>
                      </div>
                      <div className="mt-1">
                        <CountdownTimer targetTime={departure.stop.departure} mini />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-cyan-300">
                      {departureTime.toLocaleTimeString('de-CH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </div>
                    {departure.stop.platform && (
                      <div className="text-sm text-cyan-300/70 mt-1">
                        Platform {departure.stop.platform}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
