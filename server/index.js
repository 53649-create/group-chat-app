import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Storage for rooms and users (in production, use a database)
const rooms = new Map();
const users = new Map();

// Routes
app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    isPasswordProtected: !!room.password,
    memberCount: room.members.size,
    createdBy: room.createdBy
  }));
  res.json(roomList);
});

app.post('/api/rooms', (req, res) => {
  const { name, password } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Room name is required' });
  }

  const roomId = uuidv4();
  const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

  const newRoom = {
    id: roomId,
    name: name.trim(),
    password: hashedPassword,
    members: new Map(),
    messages: [],
    createdBy: req.body.createdBy || 'Anonymous',
    createdAt: new Date()
  };

  rooms.set(roomId, newRoom);

  res.json({ 
    id: roomId, 
    name: newRoom.name,
    isPasswordProtected: !!hashedPassword
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins a room
  socket.on('join-room', (data) => {
    const { roomId, username, password } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    // Check password
    if (room.password) {
      if (!password || !bcrypt.compareSync(password, room.password)) {
        socket.emit('error', 'Invalid password');
        return;
      }
    }

    // Join the room
    socket.join(roomId);
    room.members.set(socket.id, {
      username: username || 'Anonymous',
      joinedAt: new Date()
    });

    users.set(socket.id, { roomId, username: username || 'Anonymous' });

    // Notify others
    io.to(roomId).emit('user-joined', {
      username: username || 'Anonymous',
      memberCount: room.members.size,
      message: `${username || 'Anonymous'} joined the chat`
    });

    // Send previous messages
    socket.emit('load-messages', room.messages);

    // Send member list
    const memberList = Array.from(room.members.values()).map(m => m.username);
    io.to(roomId).emit('update-members', memberList);
  });

  // Handle new messages
  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const room = rooms.get(user.roomId);
    if (!room) return;

    const message = {
      id: uuidv4(),
      username: user.username,
      text: data.text,
      image: data.image || null,
      timestamp: new Date(),
      userId: socket.id
    };

    room.messages.push(message);

    // Keep only last 100 messages
    if (room.messages.length > 100) {
      room.messages.shift();
    }

    io.to(user.roomId).emit('new-message', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.members.delete(socket.id);
        io.to(user.roomId).emit('user-left', {
          username: user.username,
          memberCount: room.members.size,
          message: `${user.username} left the chat`
        });

        const memberList = Array.from(room.members.values()).map(m => m.username);
        io.to(user.roomId).emit('update-members', memberList);

        // Delete room if empty
        if (room.members.size === 0) {
          rooms.delete(user.roomId);
        }
      }
      users.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('user-typing', {
        username: user.username,
        isTyping: data.isTyping
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Open your browser and go to http://localhost:${PORT}`);
});
