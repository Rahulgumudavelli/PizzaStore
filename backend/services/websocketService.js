const jwt = require('jsonwebtoken');

// Map of userId (string) -> WebSocket instance
const clients = new Map();

/**
 * Attach the WebSocketServer to an existing http.Server.
 * Each client must send { type: 'auth', token: '<JWT>' } as its first
 * message to be registered.  Unauthenticated sockets are closed after 10 s.
 */
function initWebSocket(wss) {
  wss.on('connection', (ws) => {
    let userId = null;

    // Auto-close if the client never authenticates
    const authTimeout = setTimeout(() => {
      if (!userId) {
        console.warn('[WS] Unauthenticated connection closed');
        ws.close(4001, 'Authentication timeout');
      }
    }, 10000);

    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw);

        // ── Authentication handshake ─────────────────────────────────────
        if (data.type === 'auth') {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          userId = decoded.id;
          clearTimeout(authTimeout);

          // Replace any stale socket for this user
          clients.set(userId, ws);
          console.log(`[WS] Client authenticated: userId=${userId}`);

          ws.send(JSON.stringify({ type: 'auth_success', message: 'Connected' }));
        }
      } catch (err) {
        console.error('[WS] Message error:', err.message);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
      }
    });

    ws.on('close', () => {
      if (userId && clients.get(userId) === ws) {
        clients.delete(userId);
        console.log(`[WS] Client disconnected: userId=${userId}`);
      }
      clearTimeout(authTimeout);
    });

    ws.on('error', (err) => {
      console.error('[WS] Socket error:', err.message);
    });
  });
}

/**
 * Send a JSON payload to a specific user.
 * Silently drops if the user is not connected.
 */
function sendToUser(userId, payload) {
  const ws = clients.get(String(userId));
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

/**
 * Broadcast a JSON payload to ALL connected clients.
 */
function broadcast(payload) {
  const message = JSON.stringify(payload);
  clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  });
}

module.exports = { initWebSocket, sendToUser, broadcast };
