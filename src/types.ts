import { Vector3 } from 'three';

export interface User {
  id: string;
  name: string;
  position: Vector3;
  joinedAt: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  users: User[];
  status: 'focus' | 'break';
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