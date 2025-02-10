import axios from 'axios';

const TRANSPORT_API_BASE_URL = 'https://transport.opendata.ch/v1';

export const STUDENT_DESTINATIONS = {
  'ETH Zentrum': 'Zürich, ETH/Universitätsspital',
  'ETH Hönggerberg': 'Zürich, ETH Hönggerberg',
  'UZH Zentrum': 'Zürich, ETH/Universitätsspital',
  'UZH Irchel': 'Zürich, Irchel',
  'ASVZ Fluntern': 'Zürich, Fluntern',
  'ZHDK': 'Zürich, Toni-Areal',
  'ZHAW Winterthur': 'Winterthur',
  'FHNW Brugg': 'Brugg AG'
};

export interface Coordinates {
  type: string;
  x: number;  // latitude
  y: number;  // longitude
}

export interface Station {
  id: string;
  name: string;
  score?: number;
  coordinate: Coordinates;
  distance?: number;
}

export interface Stop {
  station: Station;
  arrival?: string;
  arrivalTimestamp?: number;
  departure?: string;
  departureTimestamp?: number;
  delay?: number;
  platform?: string;
  prognosis: {
    platform?: string;
    arrival?: string;
    departure?: string;
    capacity1st?: string;
    capacity2nd?: string;
  };
}

export interface Journey {
  name: string;
  category: string;
  categoryCode?: string;
  number: string;
  operator: string;
  to: string;
  passList?: Stop[];
  capacity1st?: string;
  capacity2nd?: string;
}

export interface Section {
  journey?: Journey;
  walk?: {
    duration: number;
  };
  departure: Stop;
  arrival: Stop;
}

export interface Connection {
  from: Stop;
  to: Stop;
  duration: string;
  transfers: number;
  service?: {
    regular: string;
    irregular?: string;
  };
  products?: string[];
  capacity1st?: string;
  capacity2nd?: string;
  sections: Section[];
}

export interface ConnectionsResponse {
  connections: Connection[];
  from: Station;
  to: Station;
}

export interface StationBoardEntry {
  stop: Stop;
  name: string;
  category: string;
  number: string;
  operator: string;
  to: string;
}

export interface StationBoardResponse {
  station: Station;
  stationboard: StationBoardEntry[];
}

export async function getStationBoard(station: string, limit: number = 10): Promise<StationBoardResponse> {
  try {
    const response = await axios.get(`${TRANSPORT_API_BASE_URL}/stationboard`, {
      params: {
        station,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching station board:', error);
    throw error;
  }
}

export async function getDetailedConnection(from: string, to: string): Promise<Connection[]> {
  try {
    const response = await axios.get(`${TRANSPORT_API_BASE_URL}/connections`, {
      params: {
        from,
        to,
        limit: 3,
        fields: [
          'connections/from',
          'connections/to',
          'connections/duration',
          'connections/transfers',
          'connections/sections',
          'connections/sections/journey',
          'connections/sections/walk',
          'connections/sections/departure',
          'connections/sections/arrival'
        ]
      },
    });
    return response.data.connections;
  } catch (error) {
    console.error('Error fetching connection:', error);
    throw error;
  }
}

export async function getAllStudentConnections(from: string = 'Balgrist'): Promise<Record<string, Connection[]>> {
  try {
    const connections: Record<string, Connection[]> = {};
    
    for (const [label, destination] of Object.entries(STUDENT_DESTINATIONS)) {
      const conns = await getDetailedConnection(from, destination);
      connections[label] = conns;
    }
    
    return connections;
  } catch (error) {
    console.error('Error fetching student connections:', error);
    throw error;
  }
}

export function formatDuration(duration: string | number): string {
  if (typeof duration === 'number') {
    const minutes = Math.floor(duration / 60);
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  try {
    // Handle "00d00:30:00" format
    if (duration.includes('d')) {
      const [, time] = duration.split('d');
      const [hours, minutes] = time.split(':');
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
      return formatDuration(totalMinutes * 60); // Convert to seconds
    }
    
    // Handle "00:30" format
    const [hours, minutes] = duration.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return formatDuration(totalMinutes * 60); // Convert to seconds
  } catch {
    return duration; // Return as-is if parsing fails
  }
}

export function getTransportColor(category: string): string {
  switch (category) {
    case 'T':
    case 'Tram':
      return 'red';
    case 'B':
    case 'Bus':
      return 'blue';
    case 'S':
    case 'IR':
    case 'IC':
      return 'purple';
    default:
      return 'gray';
  }
}
