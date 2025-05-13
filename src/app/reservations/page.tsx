'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Reservation, ROOM_OPTIONS, RoomType } from '@/types/reservation';
import { Calendar, House } from '@phosphor-icons/react';
import Link from 'next/link';

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

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-CH', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Get currently active reservations
  const getCurrentlyActive = () => {
    const now = new Date();
    return reservations.filter(res => {
      const startTime = new Date(res.startTime);
      const endTime = new Date(res.endTime);
      return startTime <= now && endTime > now;
    });
  };

  const activeReservations = getCurrentlyActive();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative container mx-auto px-4 py-12">
        <Link 
          href="/"
          className="inline-flex items-center text-white hover:text-blue-400 transition-colors mb-8"
        >
          <House size={24} className="mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <Calendar size={48} weight="light" className="mx-auto mb-4 text-green-400" />
            <h1 className="text-3xl font-bold text-white mb-4">Room Reservations</h1>
            <p className="text-white/80">
              Reserve the Foyer, Party Room, or Rooftop Terrace for your events. Reservations have priority over spontaneous usage.
            </p>
          </div>

          {/* Currently Active Reservations */}
          {activeReservations.length > 0 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-red-500/20 backdrop-blur-sm rounded-xl p-6 mb-8 border-2 border-red-500/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4">🔴 Currently Active Reservations</h2>
              <div className="space-y-4">
                {activeReservations.map(reservation => (
                  <div
                    key={reservation.id}
                    className="bg-black/20 rounded-lg p-4"
                  >
                    <h3 className="text-white font-medium">
                      {ROOM_OPTIONS[reservation.roomNumber as RoomType]} is currently reserved
                    </h3>
                    <p className="text-white/80">
                      Until: {formatDateTime(reservation.endTime)}
                    </p>
                    <p className="text-white/60 text-sm mt-2">
                      Reserved by: Room {reservation.reserverRoom}
                    </p>
                    <p className="text-white/80 mt-2">{reservation.description}</p>
                    {reservation.isOpenInvite && (
                      <p className="text-green-400 text-sm mt-2">
                        👋 Open invitation - Everyone is welcome to join!
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reservation Form */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Create New Reservation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-white/80 mb-2">
                    Select Room to Reserve
                  </label>
                  <select
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a room...</option>
                    {Object.entries(ROOM_OPTIONS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reserverRoom" className="block text-sm font-medium text-white/80 mb-2">
                    Your Room Number
                  </label>
                  <input
                    type="text"
                    id="reserverRoom"
                    placeholder="e.g., 210"
                    value={formData.reserverRoom}
                    onChange={(e) => setFormData({ ...formData, reserverRoom: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-white/80 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-white/80 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={formData.startTime || new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
                  Event Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Describe your event & invite other floors etc by writing specifics here :)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOpenInvite"
                  checked={formData.isOpenInvite}
                  onChange={(e) => setFormData({ ...formData, isOpenInvite: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
                />
                <label htmlFor="isOpenInvite" className="ml-2 text-sm font-medium text-white/80">
                  Open invitation to the building (select this if everyone is welcome to join)
                </label>
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
              {success && (
                <div className="text-green-400 text-sm">{success}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Create Reservation
              </button>
            </form>
          </motion.div>

          {/* Reservations List */}
          <div className="space-y-8">
            {/* Upcoming Reservations */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Upcoming Reservations</h2>
              {loading ? (
                <p className="text-white/60">Loading...</p>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {reservations
                      .filter(res => res.status === 'upcoming' && !getCurrentlyActive().find(active => active.id === res.id))
                      .map(reservation => (
                        <motion.div
                          key={reservation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-white/5 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-white font-medium">
                                {ROOM_OPTIONS[reservation.roomNumber as RoomType]}
                              </h3>
                              <p className="text-white/60 text-sm">
                                From: {formatDateTime(reservation.startTime)}
                              </p>
                              <p className="text-white/60 text-sm">
                                To: {formatDateTime(reservation.endTime)}
                              </p>
                              <p className="text-white/80 mt-2">{reservation.description}</p>
                              <p className="text-white/60 text-sm mt-2">
                                Reserved by: Room {reservation.reserverRoom}
                              </p>
                              {reservation.isOpenInvite && (
                                <p className="text-green-400 text-sm mt-2">
                                  👋 Open invitation - Everyone is welcome to join!
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                  {reservations.filter(res => res.status === 'upcoming' && !getCurrentlyActive().find(active => active.id === res.id)).length === 0 && (
                    <p className="text-white/60">No upcoming reservations</p>
                  )}
                </div>
                )}
              </motion.div>

              {/* Past Reservations */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Past Reservations</h2>
                {loading ? (
                <p className="text-white/60">Loading...</p>
                ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                  {reservations
                    .filter(res => res.status === 'past')
                    .map(reservation => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-medium">
                        {ROOM_OPTIONS[reservation.roomNumber as RoomType]}
                        </h3>
                        <p className="text-white/60 text-sm">
                        From: {formatDateTime(reservation.startTime)}
                        </p>
                        <p className="text-white/60 text-sm">
                        To: {formatDateTime(reservation.endTime)}
                        </p>
                        <p className="text-white/80 mt-2">{reservation.description}</p>
                        <p className="text-white/60 text-sm mt-2">
                        Reserved by: Room {reservation.reserverRoom}
                        </p>
                        {reservation.isOpenInvite && (
                          <p className="text-green-400 text-sm mt-2">
                            👋 Open invitation - Everyone is welcome to join!
                          </p>
                        )}
                      </div>
                      </div>
                    </motion.div>
                    ))}
                  </AnimatePresence>
                  {reservations.filter(res => res.status === 'past').length === 0 && (
                  <p className="text-white/60">No past reservations</p>
                  )}
                </div>
                )}
              </motion.div>
              </div>
            </motion.div>
            </div>
                  </main>
            );
}
