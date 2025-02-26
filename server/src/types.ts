import { Vector3 } from 'three';

export interface User {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  joinedAt: Date;
  lastActive: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  users: Map<string, User>;
  status: 'focus' | 'break';
  focusLength: number; // in minutes
  breakLength: number; // in minutes
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export interface SessionStats {
  activeUsers: number;
  totalFocusMinutes: number;
  topLocations: Array<{
    name: string;
    count: number;
    coordinates: [number, number];
  }>;
}

export interface UserLocation {
  country: string;
  coordinates: [number, number];
}
