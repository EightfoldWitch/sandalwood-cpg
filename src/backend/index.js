const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser'); // <-- NEW
const { actionManager, setIo } = require('./ActionManager');
const actionsRouter = require('./routes/actions'); // <-- NEW

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/actions', actionsRouter); // <-- Mount API routes

// WebSocket
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.emit('actions_update', {
    live: actionManager.getLiveActions(),
    history: actionManager.getHistory()
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

setIo(io);

module.exports = app;

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});