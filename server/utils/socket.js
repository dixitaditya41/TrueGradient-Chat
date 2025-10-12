import { Server } from "socket.io";
import Notification from "../models/Notification.js";

let ioInstance = null;

export function initSocket(server) {
  if (ioInstance) return ioInstance;

  const io = new Server(server, {
    cors: { 
      origin: ['http://localhost:5173'],
      methods: ['GET','POST'],
      credentials: true
    },
    allowEIO3: true
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    // Register user to their personal room
    socket.on('register', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      // Handle disconnect if needed
    });
  });

  return io;
}

export function getIO() {
  if (!ioInstance) throw new Error('Socket.io not initialized!');
  return ioInstance;
}

// Send targeted notification
export async function sendTargetNotification(userId, message) {
  const io = getIO();

  const notification = await Notification.create({
    user: userId,
    message,
    type: 'target'
  });

  const userRoom = `user_${userId}`;
  io.to(userRoom).emit('notification', notification);
}

// Send global notification
export async function sendGlobalNotification(message) {
  const io = getIO();

  const notification = await Notification.create({
    user: null,
    message,
    type: 'global'
  });

  io.emit('notification', notification);
}
