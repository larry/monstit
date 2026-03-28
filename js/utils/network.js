let ws = null;
let messageHandler = null;

export function connect() {
  return new Promise((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}`);
    ws.onopen = () => resolve();
    ws.onerror = () => reject(new Error('Connection failed'));
    ws.onclose = () => {
      if (messageHandler) messageHandler({ type: 'disconnected' });
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (messageHandler) messageHandler(msg);
      } catch {}
    };
  });
}

export function send(msg) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

export function onMessage(handler) {
  messageHandler = handler;
}

export function disconnect() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

export function isConnected() {
  return ws && ws.readyState === WebSocket.OPEN;
}
