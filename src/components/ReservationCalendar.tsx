import { useState } from 'react';
import { motion } from 'framer-motion';
import { addDays, format, startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';
import { Reservation, ROOM_OPTIONS, RoomType } from '@/types/reservation';

type ReservationCalendarProps = {
  reservations: Reservation[];
};

export default function ReservationCalendar({ reservations }: ReservationCalendarProps) {
  const [startDate, setStartDate] = useState(new Date());
  
  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Map of room types to their reservations
  const roomTypeReservations = Object.keys(ROOM_OPTIONS).map((roomType) => {
    const filteredReservations = reservations.filter(
      (res) => res.roomNumber === roomType
    );
    return {
      roomType: roomType as RoomType,
      reservations: filteredReservations,
    };
  });

  const getReservationsForDay = (day: Date, roomType: RoomType) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    return roomTypeReservations
      .find((r) => r.roomType === roomType)
      ?.reservations.filter((res) => {
        const resStart = new Date(res.startTime);
        const resEnd = new Date(res.endTime);
        
        return isWithinInterval(resStart, { start: dayStart, end: dayEnd }) || 
               isWithinInterval(resEnd, { start: dayStart, end: dayEnd }) ||
               (resStart <= dayStart && resEnd >= dayEnd);
      });
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const formatReservationTime = (res: Reservation, day: Date) => {
    const start = new Date(res.startTime);
    const end = new Date(res.endTime);
    const startDay = format(start, 'yyyyMMdd');
    const endDay = format(end, 'yyyyMMdd');
    const cellDay = format(day, 'yyyyMMdd');
    
    if (startDay === endDay) {
      // Same day reservation
      return `${format(start, 'HH:mm')}–${format(end, 'HH:mm')}`;
    } else {
      // Overnight reservation - show appropriate part for this day
      if (cellDay === startDay) {
        // This is the start day
        return `${format(start, 'HH:mm')} →`;
      } else if (cellDay === endDay) {
        // This is the end day
        return `→ ${format(end, 'HH:mm')}`;
      } else if (new Date(cellDay) > new Date(startDay) && new Date(cellDay) < new Date(endDay)) {
        // This is a middle day in a multi-day reservation
        return 'All day';
      }
      
      // Fallback - should not happen
      return `${format(start, 'HH:mm')}–${format(end, 'HH:mm')}`;
    }
  };

  const moveCalendar = (days: number) => {
    setStartDate(addDays(startDate, days));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Reservation Calendar</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => moveCalendar(-7)}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
          >
            &larr;
          </button>
          <button
            onClick={() => setStartDate(new Date())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => moveCalendar(7)}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Calendar Header */}
          <div className="grid grid-cols-8 gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center justify-center">
              <span className="text-white/60 text-sm">Rooms</span>
            </div>
            {days.map((day, i) => (
              <div key={i} className="text-center">
                <div className={`font-medium ${isToday(day) ? 'text-blue-400' : 'text-white'}`}>
                  {format(day, 'EEE')}
                </div>
                <div className={`text-sm ${isToday(day) ? 'text-blue-400' : 'text-white/60'}`}>
                  {format(day, 'MMM d')}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="mt-4">
            {roomTypeReservations.map(({ roomType }) => (
              <div key={roomType} className="grid grid-cols-8 gap-2 mb-4">
                <div className="flex items-center">
                  <span className="text-white font-medium">{ROOM_OPTIONS[roomType]}</span>
                </div>
                {days.map((day, i) => {
                  const dayReservations = getReservationsForDay(day, roomType) || [];
                  const hasReservations = dayReservations.length > 0;
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-[50px] rounded-lg p-1 text-xs ${
                        hasReservations
                          ? 'bg-red-400/20 border border-red-400/30'
                          : 'bg-green-400/10 border border-green-400/20'
                      }`}
                    >
                      {dayReservations.map((res, idx) => (
                        <div key={idx} className="text-white mb-1 truncate">
                          {formatReservationTime(res, day)}
                        </div>
                      ))}
                      {!hasReservations && (
                        <div className="text-green-400/70 text-center h-full flex items-center justify-center">
                          Free
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}