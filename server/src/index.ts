import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import { SessionManager } from './sessionManager';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"],
    credentials: true
  }
});

const sessionManager = new SessionManager();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/api/session/:sessionId/stats', (req, res) => {
  try {
    const stats = sessionManager.getSessionStats(req.params.sessionId);
    res.json(stats);
  } catch (error) {
    res.status(404).json({ error: 'Session not found' });
  }
});

app.get('/api/session/:sessionId', (req, res) => {
  const session = sessionManager.getSession(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  let userId: string;
  let sessionId: string;

  // Get or create userId from cookie
  const userIdFromCookie = socket.handshake.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('userId='))?.split('=')[1];
  
  userId = userIdFromCookie || uuidv4();
  socket.emit('userId', userId);

  // Join session
  socket.on('joinSession', ({ sessionId: sId, userName }) => {
    try {
      sessionId = sId;
      const user = sessionManager.joinSession(sessionId, userName, userId);
      socket.join(sessionId);
      
      // Emit join event to all users in session
      io.to(sessionId).emit('userJoined', user);
      
      // Send current session state to the joining user
      const session = sessionManager.getSession(sessionId);
      const messages = sessionManager.getMessages(sessionId);
      socket.emit('sessionState', { session, messages });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join session' });
    }
  });

  // Leave session
  socket.on('leaveSession', () => {
    if (sessionId && userId) {
      sessionManager.leaveSession(sessionId, userId);
      socket.leave(sessionId);
      io.to(sessionId).emit('userLeft', userId);
    }
  });

  // Update user position
  socket.on('updatePosition', (position) => {
    if (sessionId && userId) {
      sessionManager.updateUserPosition(sessionId, userId, position);
      socket.to(sessionId).emit('userMoved', { userId, position });
    }
  });

  // Chat message
  socket.on('sendMessage', (text) => {
    if (sessionId && userId) {
      const message = sessionManager.addMessage(sessionId, userId, text);
      io.to(sessionId).emit('newMessage', message);
    }
  });

  // Update user location
  socket.on('updateLocation', (location) => {
    if (userId) {
      sessionManager.setUserLocation(userId, location);
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    if (sessionId && userId) {
      sessionManager.leaveSession(sessionId, userId);
      io.to(sessionId).emit('userLeft', userId);
    }
  });
});

// Session status update interval
setInterval(() => {
  sessionManager.updateSessionStatus('default');
  const session = sessionManager.getSession('default');
  if (session) {
    io.to('default').emit('sessionUpdated', session);
  }
}, 1000);

// Cleanup inactive users interval
setInterval(() => {
  sessionManager.cleanupInactiveUsers();
}, 60000);

// Start server
const PORT = process.env.PORT || 3003;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
