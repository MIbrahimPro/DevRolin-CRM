import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.mjs';
import { errorHandler, notFound } from './middlewares/errorHandler.mjs';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.mjs';
import employeeRoutes from './routes/employees.mjs';
import projectRoutes from './routes/projects.mjs';
import taskRoutes from './routes/tasks.mjs';
import documentRoutes from './routes/documents.mjs';
import attendanceRoutes from './routes/attendance.mjs';
import leaveRoutes from './routes/leaves.mjs';
import recruitmentRoutes from './routes/recruitment.mjs';
import meetingRoutes from './routes/meetings.mjs';
import chatRoutes from './routes/chat.mjs';
import reportRoutes from './routes/reports.mjs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.IO for real-time features
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-project', (projectId) => {
        socket.join(`project-${projectId}`);
    });

    socket.on('document-update', (data) => {
        socket.to(`project-${data.projectId}`).emit('document-changed', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };

