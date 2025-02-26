import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vector3 } from 'three';
import { socketService } from '../services/socket';

interface User {
  id: string;
  name: string;
  position: Vector3;
  joinedAt: Date;
}

interface FocusSession {
  id: string;
  startTime: Date;
  endTime: Date;
  users: User[];
  status: 'focus' | 'break';
}

interface FocusSessionContextType {
  currentUser: User | null;
  currentSession: FocusSession | null;
  users: User[];
  joinSession: (userName: string) => Promise<void>;
  leaveSession: () => void;
  updateUserPosition: (userId: string, position: Vector3) => void;
}

const FocusSessionContext = createContext<FocusSessionContextType | null>(null);

export function FocusSessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Set up socket event listeners
    socketService.onUserJoined((user) => {
      setUsers(prev => {
        const exists = prev.find(u => u.id === user.id);
        if (exists) {
          return prev.map(u => u.id === user.id ? user : u);
        }
        return [...prev, user];
      });

      if (socketService.getUserId() === user.id) {
        setCurrentUser(user);
      }
    });

    socketService.onUserLeft((userId) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
    });

    socketService.onUserMoved(({ userId, position }) => {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, position: new Vector3(position.x, position.y, position.z) }
          : user
      ));
    });

    socketService.onSessionUpdated((session) => {
      setCurrentSession({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        users: Array.from(session.users.values()).map(user => ({
          ...user,
          position: new Vector3(user.position.x, user.position.y, user.position.z),
          joinedAt: new Date(user.joinedAt)
        }))
      });
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const joinSession = async (userName: string) => {
    try {
      await socketService.joinSession(userName);
      // The user and session state will be updated through socket events
    } catch (error) {
      console.error('Failed to join session:', error);
      throw error;
    }
  };

  const leaveSession = () => {
    socketService.leaveSession();
    setCurrentUser(null);
    setUsers([]);
  };

  const updateUserPosition = (userId: string, position: Vector3) => {
    socketService.updatePosition({
      x: position.x,
      y: position.y,
      z: position.z
    });
  };

  return (
    <FocusSessionContext.Provider
      value={{
        currentUser,
        currentSession,
        users,
        joinSession,
        leaveSession,
        updateUserPosition
      }}
    >
      {children}
    </FocusSessionContext.Provider>
  );
}

export function useFocusSession() {
  const context = useContext(FocusSessionContext);
  if (!context) {
    throw new Error('useFocusSession must be used within a FocusSessionProvider');
  }
  return context;
} 