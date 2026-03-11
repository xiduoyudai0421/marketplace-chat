const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// 中间件
app.use(cors());
app.use(express.json());

// 存储活跃的聊天会话
const activeSessions = new Map();

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('新用户连接:', socket.id);

  // 用户加入特定商家的聊天室
  socket.on('join-chat', (data) => {
    const { sellerId, buyerId, productId } = data;
    const chatRoomId = `chat_${sellerId}_${buyerId}_${productId}`;
    
    socket.join(chatRoomId);
    
    activeSessions.set(socket.id, {
      chatRoomId,
      sellerId,
      buyerId,
      productId,
      joinedAt: new Date()
    });

    io.to(chatRoomId).emit('user-joined', {
      message: '用户加入聊天',
      timestamp: new Date()
    });
  });

  // 接收消息
  socket.on('send-message', (data) => {
    const session = activeSessions.get(socket.id);
    if (session) {
      const message = {
        ...data,
        timestamp: new Date(),
        senderId: socket.id
      };
      
      io.to(session.chatRoomId).emit('receive-message', message);
      console.log('消息已发送:', message);
    }
  });

  // 用户离线
  socket.on('disconnect', () => {
    const session = activeSessions.get(socket.id);
    if (session) {
      io.to(session.chatRoomId).emit('user-left', {
        message: '用户离线',
        timestamp: new Date()
      });
      activeSessions.delete(socket.id);
    }
    console.log('用户断开连接:', socket.id);
  });
});

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
