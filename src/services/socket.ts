import { io, Socket } from 'socket.io-client';
import { User, Session, Message } from '../types';

class SocketService {
  private socket: Socket;
  private userId: string | null = null;

  constructor() {
    this.socket = io('http://localhost:3003', {
      withCredentials: true
    });

    this.socket.on('userId', (id: string) => {
      this.userId = id;
      document.cookie = `userId=${id}; path=/; max-age=31536000`; // 1 year
    });
  }

  public joinSession(userName: string, sessionId: string = 'default'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinSession', { sessionId, userName });
      
      this.socket.once('sessionState', ({ session, messages }) => {
        resolve();
      });

      this.socket.once('error', (error) => {
        reject(error);
      });
    });
  }

  public leaveSession() {
    this.socket.emit('leaveSession');
  }

  public updatePosition(position: { x: number, y: number, z: number }) {
    this.socket.emit('updatePosition', position);
  }

  public sendMessage(text: string) {
    this.socket.emit('sendMessage', text);
  }

  public updateLocation(location: { country: string, coordinates: [number, number] }) {
    this.socket.emit('updateLocation', location);
  }

  public onUserJoined(callback: (user: User) => void) {
    this.socket.on('userJoined', callback);
  }

  public onUserLeft(callback: (userId: string) => void) {
    this.socket.on('userLeft', callback);
  }

  public onUserMoved(callback: (data: { userId: string, position: { x: number, y: number, z: number } }) => void) {
    this.socket.on('userMoved', callback);
  }

  public onNewMessage(callback: (message: Message) => void) {
    this.socket.on('newMessage', callback);
  }

  public onSessionUpdated(callback: (session: Session) => void) {
    this.socket.on('sessionUpdated', callback);
  }

  public getUserId(): string | null {
    return this.userId;
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export const socketService = new SocketService(); 