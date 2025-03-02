const next = require('next');
const { createServer } = require('http');
const express = require('express');
const WebSocket = require('ws');

// =============================================
// 1. Setup Next.js and Express
// =============================================


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handler = app.getRequestHandler();

const server = express();
const httpServer = createServer(server);

// =============================================
// 2. Setup Web Socket Server
// =============================================


// =============================================
// 3. Handle Next.js Routing
// =============================================
server.all('*', (req, res) => {
  return handler(req, res);
});

// =============================================
// 3. Start the Server
// =============================================
httpServer.listen(4000, () => {
  console.log('Server listening on http://localhost:4000');
});