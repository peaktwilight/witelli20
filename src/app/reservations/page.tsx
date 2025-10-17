'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Reservation, ROOM_OPTIONS, RoomType } from '@/types/reservation';
import { Calendar, House, Warning } from '@phosphor-icons/react';
import Link from 'next/link';
import ReservationCalendar from '@/components/ReservationCalendar';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    roomNumber: '',
    reserverRoom: '',
    startTime: '',
    endTime: '',
    description: '',
    isOpenInvite: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pastPage, setPastPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchReservations();
    // Refresh active reservations every minute
    const interval = setInterval(fetchReservations, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchReservations = async () => {
    try {
      const q = query(collection(db, 'reservations'), orderBy('startTime', 'asc'));
      const querySnapshot = await getDocs(q);
      const reservationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Omit<Reservation, 'status'>[];

      // Split into upcoming and past
      const now = new Date();
      const processed: Reservation[] = reservationsData.map(res => ({
        ...res,
        status: new Date(res.endTime) > now ? 'upcoming' : 'past'
      }));

      setReservations(processed);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.roomNumber || !formData.reserverRoom || !formData.startTime || !formData.endTime || !formData.description) {
      setError('All fields are required');
      return;
    }

    // Validate time range
    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);
    
    if (endDate <= startDate) {
      setError('End time must be after start time');
      return;
    }

    if (startDate < new Date()) {
      setError('Start time cannot be in the past');
      return;
    }
    
    // Check if reservation is longer than 24 hours
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    if (durationHours > 24) {
      setError('Reservations cannot exceed 24 hours');
      return;
    }
    
    // Check for conflicting reservations
    const conflicts = reservations.filter(res => {
      if (res.roomNumber !== formData.roomNumber) return false;
      
      const resStart = new Date(res.startTime);
      const resEnd = new Date(res.endTime);
      
      // Check if the new reservation overlaps with an existing one
      return (
        (startDate <= resEnd && endDate >= resStart) || 
        (resStart <= endDate && resEnd >= startDate)
      );
    });
    
    if (conflicts.length > 0) {
      setError(`This space is already reserved during this time period`);
      return;
    }

    // Validate room number format (only numbers)
    const roomNumberRegex = /^\d+$/;
    if (!roomNumberRegex.test(formData.reserverRoom)) {
      setError('Room number must contain only numbers (e.g., 210)');
      return;
    }

    try {
      const reservationData: Omit<Reservation, 'id' | 'status'> = {
        ...formData,
        createdAt: Timestamp.now().toDate().toISOString()
      };

      await addDoc(collection(db, 'reservations'), reservationData);
      setSuccess('Reservation created successfully!');
      setFormData({ roomNumber: '', reserverRoom: '', startTime: '', endTime: '', description: '', isOpenInvite: false });
      fetchReservations();
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError('Failed to create reservation');
    }
  };
  
  const formatTimeRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    const startDate = start.toLocaleDateString('en-CH', options);
    const endDate = end.toLocaleDateString('en-CH', options);
    
    const timeOptions: Intl.DateTimeFormatOptions = { timeStyle: 'short' };
    const startTime = start.toLocaleTimeString('en-CH', timeOptions);
    const endTime = end.toLocaleTimeString('en-CH', timeOptions);
    
    if (startDate === endDate) {
      return `${startDate} · ${startTime}–${endTime}`;
    } else {
      // For overnight reservations
      // If it's a late night to early morning booking, make it clearer
      if (start.getHours() >= 18 && end.getHours() <= 12 && 
          Math.abs(end.getTime() - start.getTime()) < 24 * 60 * 60 * 1000) {
        return `${startDate} · ${startTime} → ${endTime} next day`;
      } else {
        return `${startDate} · ${startTime} →\n${endDate} · ${endTime}`;
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Reservation filter helpers
  const getCurrentlyActive = () => {
    const now = new Date();
    return reservations.filter(res => {
      const startTime = new Date(res.startTime);
      const endTime = new Date(res.endTime);
      return startTime <= now && endTime > now;
    });
  };

  const getPastReservations = () => {
    return reservations
      .filter(res => res.status === 'past')
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
  };

  const getUpcomingReservations = () => {
    return reservations
      .filter(res => res.status === 'upcoming' && !getCurrentlyActive().find(active => active.id === res.id));
  };

  const activeReservations = getCurrentlyActive();
  const pastReservations = getPastReservations();
  const upcomingReservations = getUpcomingReservations();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-white hover:text-blue-400 transition-colors mb-6 md:mb-8"
        >
          <House size={24} className="mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Calendar size={48} weight="light" className="mx-auto mb-4 text-green-400" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Room Reservations</h1>
            <p className="text-white/80 mb-3 md:mb-4 text-sm md:text-base px-4">
              Reserve the Foyer, Party Room, Guest Room, or Rooftop Terrace for your events. Reservations have priority over spontaneous usage.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-amber-400 text-xs md:text-sm">
              <Warning size={20} weight="fill" />
              <span>Max 24 hours per booking</span>
            </div>
          </div>

          {/* Currently Active Reservations */}
          {activeReservations.length > 0 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-red-500/30 shadow-xl shadow-red-500/10"
            >
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                Currently Active
              </h2>
              <div className="space-y-3 md:space-y-4">
                {activeReservations.map(reservation => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-400/30 transition-all"
                  >
                    <h3 className="text-white font-medium text-base md:text-lg mb-1">
                      {ROOM_OPTIONS[reservation.roomNumber as RoomType]}
                    </h3>
                    <p className="text-white/70 text-sm whitespace-pre-line">
                      {formatTimeRange(reservation.startTime, reservation.endTime)}
                    </p>
                    <p className="text-white/80 mt-2 text-sm">{reservation.description}</p>
                    <div className="flex flex-wrap items-center mt-3 gap-2">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs">
                        Room {reservation.reserverRoom}
                      </span>
                      {reservation.isOpenInvite && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
                          Open Invite
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reservation Form Toggle Button - Mobile */}
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="md:hidden w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl mb-6 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            whileTap={{ scale: 0.98 }}
          >
            <Calendar size={20} weight="bold" />
            {showForm ? 'Hide Reservation Form' : 'Create New Reservation'}
          </motion.button>

          {/* Reservation Form */}
          <motion.div
            className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/20 shadow-xl ${showForm ? 'block' : 'hidden md:block'}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Create New Reservation</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-white/90 mb-2">
                    Select Room to Reserve
                  </label>
                  <select
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                  >
                    <option value="" className="bg-gray-900">Select a room...</option>
                    {Object.entries(ROOM_OPTIONS).map(([value, label]) => (
                      <option key={value} value={value} className="bg-gray-900">{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reserverRoom" className="block text-sm font-medium text-white/90 mb-2">
                    Your Room Number
                  </label>
                  <input
                    type="text"
                    id="reserverRoom"
                    placeholder="e.g., 210"
                    value={formData.reserverRoom}
                    onChange={(e) => setFormData({ ...formData, reserverRoom: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-white/90 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-white/90 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    min={formData.startTime || new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-2">
                  Event Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm resize-none h-24"
                  placeholder="Describe your event & invite other floors etc by writing specifics here :)"
                />
              </div>

              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <input
                  type="checkbox"
                  id="isOpenInvite"
                  checked={formData.isOpenInvite}
                  onChange={(e) => setFormData({ ...formData, isOpenInvite: e.target.checked })}
                  className="w-5 h-5 mt-0.5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isOpenInvite" className="text-sm font-medium text-white/90 cursor-pointer">
                  Open invitation to the building (select this if everyone is welcome to join)
                </label>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3 text-red-400">
                      <Warning size={20} weight="fill" className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                Create Reservation
              </motion.button>
            </form>
          </motion.div>

          {/* Reservation Calendar */}
          <ReservationCalendar reservations={reservations} />

          {/* Reservations List */}
          <div className="space-y-6 md:space-y-8">
            {/* Upcoming Reservations */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl"
            >
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Upcoming Reservations</h2>
              {loading ? (
                <p className="text-white/60">Loading...</p>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <AnimatePresence mode="wait">
                    <div key="upcoming" className="space-y-3">
                      {upcomingReservations.map((reservation, idx) => (
                        <motion.div
                          key={reservation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-white font-semibold text-base md:text-lg mb-1 group-hover:text-blue-400 transition-colors">
                                {ROOM_OPTIONS[reservation.roomNumber as RoomType]}
                              </h3>
                              <p className="text-white/70 text-sm whitespace-pre-line">
                                {formatTimeRange(reservation.startTime, reservation.endTime)}
                              </p>
                              <p className="text-white/80 mt-2 text-sm">{reservation.description}</p>
                              <div className="flex flex-wrap items-center mt-3 gap-2">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs">
                                  Room {reservation.reserverRoom}
                                </span>
                                {reservation.isOpenInvite && (
                                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
                                    Open Invite
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                  {upcomingReservations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-white/60">No upcoming reservations</p>
                    </div>
                  )}
                </div>
                )}
              </motion.div>

              {/* Past Reservations */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl"
              >
                <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Past Reservations</h2>
                {loading ? (
                  <p className="text-white/60">Loading...</p>
                ) : (
                  <>
                    <div className="space-y-3 md:space-y-4">
                      <AnimatePresence mode="wait">
                        <div key={pastPage} className="space-y-3">
                          {pastReservations
                            .slice((pastPage - 1) * ITEMS_PER_PAGE, pastPage * ITEMS_PER_PAGE)
                            .map((reservation, idx) => (
                              <motion.div
                                key={reservation.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/10 opacity-75"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="text-white/90 font-semibold text-base md:text-lg mb-1">
                                      {ROOM_OPTIONS[reservation.roomNumber as RoomType]}
                                    </h3>
                                    <p className="text-white/60 text-sm whitespace-pre-line">
                                      {formatTimeRange(reservation.startTime, reservation.endTime)}
                                    </p>
                                    <p className="text-white/70 mt-2 text-sm">{reservation.description}</p>
                                    <div className="flex flex-wrap items-center mt-3 gap-2">
                                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/60 text-xs">
                                        Room {reservation.reserverRoom}
                                      </span>
                                      {reservation.isOpenInvite && (
                                        <span className="px-3 py-1 bg-green-500/10 text-green-400/70 rounded-full text-xs border border-green-500/20">
                                          Open Invite
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </AnimatePresence>

                      {pastReservations.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-white/60">No past reservations</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Pagination Controls */}
                    {pastReservations.length > ITEMS_PER_PAGE && (
                      <motion.div
                        key={`pagination-${pastPage}`}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center items-center space-x-3 md:space-x-4 mt-6 pt-4 border-t border-white/10"
                      >
                        <motion.button
                          onClick={() => setPastPage(prev => Math.max(prev - 1, 1))}
                          disabled={pastPage === 1}
                          whileHover={{ scale: pastPage === 1 ? 1 : 1.05 }}
                          whileTap={{ scale: pastPage === 1 ? 1 : 0.95 }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            pastPage === 1
                              ? 'bg-white/5 text-white/30 cursor-not-allowed'
                              : 'bg-white/10 text-white hover:bg-white/20 shadow-lg'
                          }`}
                        >
                          Previous
                        </motion.button>

                        <motion.span
                          key={pastPage}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/80 px-2 md:px-4 text-sm font-medium"
                        >
                          Page {pastPage} of {Math.ceil(pastReservations.length / ITEMS_PER_PAGE)}
                        </motion.span>

                        <motion.button
                          onClick={() => setPastPage(prev => Math.min(
                            prev + 1,
                            Math.ceil(pastReservations.length / ITEMS_PER_PAGE)
                          ))}
                          disabled={pastPage >= Math.ceil(pastReservations.length / ITEMS_PER_PAGE)}
                          whileHover={{ scale: pastPage >= Math.ceil(pastReservations.length / ITEMS_PER_PAGE) ? 1 : 1.05 }}
                          whileTap={{ scale: pastPage >= Math.ceil(pastReservations.length / ITEMS_PER_PAGE) ? 1 : 0.95 }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            pastPage >= Math.ceil(pastReservations.length / ITEMS_PER_PAGE)
                              ? 'bg-white/5 text-white/30 cursor-not-allowed'
                              : 'bg-white/10 text-white hover:bg-white/20 shadow-lg'
                          }`}
                        >
                          Next
                        </motion.button>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
              </div>
            </motion.div>
            </div>
                  </main>
            );
}
