export type Reservation = {
  id?: string;
  roomNumber: string;
  reserverRoom: string;  // Room number of the person making the reservation
  startTime: string;
  endTime: string;
  description: string;
  createdAt: string;
  status: 'upcoming' | 'past';
  isOpenInvite?: boolean; // Whether the event is open for other residents to join
};

export const ROOM_OPTIONS = {
  'foyer': 'Foyer / Projector Room',
  'party': 'Party Room',
  'rooftop': 'Rooftop Terrace',
  'guest': 'Guest Room (next to entrance)'
} as const;

export type RoomType = keyof typeof ROOM_OPTIONS;
