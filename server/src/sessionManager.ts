import { Session, User, Message, SessionStats, UserLocation } from './types';
import { v4 as uuidv4 } from 'uuid';

export class SessionManager {
  private sessions: Map<string, Session>;
  private messages: Map<string, Message[]>;
  private userLocations: Map<string, UserLocation>;

  constructor() {
    this.sessions = new Map();
    this.messages = new Map();
    this.userLocations = new Map();
    this.createDefaultSession();
  }

  private createDefaultSession() {
    const sessionId = 'default';
    const session: Session = {
      id: sessionId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
      users: new Map(),
      status: 'focus',
      focusLength: 20,
      breakLength: 5
    };
    this.sessions.set(sessionId, session);
    this.messages.set(sessionId, []);
  }

  public joinSession(sessionId: string, userName: string, userId?: string): User {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const newUser: User = {
      id: userId || uuidv4(),
      name: userName,
      position: { x: Math.random() * 6 - 3, y: 0, z: Math.random() * 6 - 3 },
      joinedAt: new Date(),
      lastActive: new Date()
    };

    session.users.set(newUser.id, newUser);
    return newUser;
  }

  public leaveSession(sessionId: string, userId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    session.users.delete(userId);
  }

  public updateUserPosition(sessionId: string, userId: string, position: { x: number, y: number, z: number }) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const user = session.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.position = position;
    user.lastActive = new Date();
  }

  public addMessage(sessionId: string, userId: string, text: string): Message {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const user = session.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const message: Message = {
      id: uuidv4(),
      userId,
      userName: user.name,
      text,
      timestamp: new Date()
    };

    const sessionMessages = this.messages.get(sessionId) || [];
    sessionMessages.push(message);
    this.messages.set(sessionId, sessionMessages);

    return message;
  }

  public getMessages(sessionId: string): Message[] {
    return this.messages.get(sessionId) || [];
  }

  public getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  public setUserLocation(userId: string, location: UserLocation) {
    this.userLocations.set(userId, location);
  }

  public getSessionStats(sessionId: string): SessionStats {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Count users by location
    const locationCounts = new Map<string, number>();
    session.users.forEach(user => {
      const location = this.userLocations.get(user.id);
      if (location) {
        const count = locationCounts.get(location.country) || 0;
        locationCounts.set(location.country, count + 1);
      }
    });

    // Convert to array and sort by count
    const topLocations = Array.from(locationCounts.entries())
      .map(([country, count]) => {
        const location = Array.from(this.userLocations.values())
          .find(loc => loc.country === country);
        return {
          name: country,
          count,
          coordinates: location?.coordinates || [0, 0]
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      activeUsers: session.users.size,
      totalFocusMinutes: this.calculateTotalFocusMinutes(session),
      topLocations
    };
  }

  private calculateTotalFocusMinutes(session: Session): number {
    let totalMinutes = 0;
    session.users.forEach(user => {
      const activeTime = (new Date().getTime() - user.joinedAt.getTime()) / 1000 / 60;
      totalMinutes += Math.floor(activeTime);
    });
    return totalMinutes;
  }

  public updateSessionStatus(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const now = new Date();
    if (now >= session.endTime) {
      // Toggle between focus and break
      session.status = session.status === 'focus' ? 'break' : 'focus';
      session.startTime = now;
      session.endTime = new Date(now.getTime() + 
        (session.status === 'focus' ? session.focusLength : session.breakLength) * 60 * 1000);
    }
  }

  // Clean up inactive users (called periodically)
  public cleanupInactiveUsers() {
    const inactivityThreshold = 5 * 60 * 1000; // 5 minutes
    this.sessions.forEach(session => {
      session.users.forEach((user, userId) => {
        if (new Date().getTime() - user.lastActive.getTime() > inactivityThreshold) {
          session.users.delete(userId);
        }
      });
    });
  }
}
