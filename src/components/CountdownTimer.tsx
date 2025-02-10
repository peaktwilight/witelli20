import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  targetTime: string;
  mini?: boolean;
}

export default function CountdownTimer({ targetTime, mini = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
   text: '',
   parts: [''],
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
         parts: ['Departing'],
         urgent: true,
         soon: false,
       };
     }

      const minutes = Math.floor(diff / 1000 / 60);
      const urgent = minutes <= 5;
      const soon = minutes <= 15;

      if (minutes < 60) {
       const seconds = Math.floor((diff / 1000) % 60);
       if (minutes === 1) {
         return {
           text: `in 1m ${seconds}s`,
           parts: ['in  ', '1', 'm  ', seconds.toString(), 's'],
           urgent,
           soon,
         };
       }
       if (minutes === 0) {
         return {
           text: `in ${seconds}s`,
           parts: ['in  ', seconds.toString(), 's'],
           urgent,
           soon,
         };
       }
       return {
         text: `in ${minutes}m ${seconds}s`,
         parts: ['in  ', minutes.toString(), 'm  ', seconds.toString().padStart(2, '0'), 's'],
         urgent,
         soon,
       };
     }
     
     const hours = Math.floor(minutes / 60);
     const remainingMinutes = minutes % 60;
     return {
       text: `in ${hours}h ${remainingMinutes}m`,
       parts: ['in  ', hours.toString(), 'h  ', remainingMinutes.toString(), 'm'],
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
      <div className={`font-mono ${textColor} flex items-center space-x-1`}>
        <AnimatePresence mode="popLayout">
          {timeLeft.parts.map((part, index) => (
            <motion.span
              key={index + part}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {part}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
