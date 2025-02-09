import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetTime: string;
  mini?: boolean;
}

export default function CountdownTimer({ targetTime, mini = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    text: '',
    urgent: false,
    soon: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(targetTime);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        return {
          text: 'Departing',
          urgent: true,
          soon: false,
        };
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const urgent = minutes <= 5;
      const soon = minutes <= 15;

      if (minutes < 60) {
        return {
          text: `${minutes}min`,
          urgent,
          soon,
        };
      }
      
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return {
        text: `${hours}h ${remainingMinutes}min`,
        urgent,
        soon,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const bgColor = timeLeft.urgent ? 'bg-red-500' : timeLeft.soon ? 'bg-yellow-500' : 'bg-green-500';
  const textColor = timeLeft.urgent ? 'text-red-200' : timeLeft.soon ? 'text-yellow-200' : 'text-green-200';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`inline-flex items-center space-x-2 ${mini ? 'text-sm' : 'text-base'}`}
    >
      <motion.div
        className={`h-2 w-2 rounded-full ${bgColor} animate-pulse`}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className={`font-mono ${textColor}`}>
        {timeLeft.text}
      </span>
    </motion.div>
  );
}
