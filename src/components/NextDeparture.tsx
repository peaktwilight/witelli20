import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StationBoardEntry, getStationBoard } from '@/lib/transportApi';
import CountdownTimer from './CountdownTimer';
import TransportBadge from './TransportBadge';

export default function NextDeparture() {
  const [nextDeparture, setNextDeparture] = useState<StationBoardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextDeparture = async () => {
      try {
        const data = await getStationBoard('Balgrist', 1);
        if (data.stationboard.length > 0) {
          setNextDeparture(data.stationboard[0]);
        }
      } catch (error) {
        console.error('Failed to fetch next departure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextDeparture();
    const interval = setInterval(fetchNextDeparture, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !nextDeparture || !nextDeparture.stop.departure) {
    return (
      <div className="flex items-center space-x-2 text-white/60">
        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
        <span>Loading...</span>
      </div>
    );
  }

  const departureTime = new Date(nextDeparture.stop.departure);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-4"
    >
      <TransportBadge 
        category={nextDeparture.category} 
        number={nextDeparture.number} 
        size="sm"
      />
      <div className="text-white">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold">
            {departureTime.toLocaleTimeString('de-CH', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
          <span className="text-white/60">→</span>
          <span className="text-sm text-white/80 truncate max-w-[150px]">
            {nextDeparture.to}
          </span>
        </div>
        <div className="text-sm">
          <CountdownTimer targetTime={nextDeparture.stop.departure} mini />
        </div>
      </div>
    </motion.div>
  );
}
