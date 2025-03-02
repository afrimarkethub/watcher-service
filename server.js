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
const wss = new WebSocket.Server({ server: httpServer });
const watchers = new Map();

wss.on('connection', (ws) => {
  const productId = req.url && req.url.split('/').pop();
  if (!productId) return;

  // Increment count
  const currentCount = (watchers.get(productId) || 0) + 1
  watchers.set(productId, currentCount);
  console.log(`New connection for ${productId}: ${currentCount} watchers`);

  // Notify all connected clients about the watcher count
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ productId, count: currentCount }));
    }
  });

  // handle disconnection
  ws.on('close', () => {
    const updatedCount = Math.max((watchers.get(productId) || 0) - 1, 0);
    if (updatedCount === 0) {
      console.log(`No more watchers for ${productId}`);
      watchers.delete(productId);
    } else {
      watchers.set(productId, updatedCount);
    }
  });

  // Send initial message
  ws.send(JSON.stringify({
    message: "Connected to the watcher service",
    productId,
    count: currentCount
  }));
});


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