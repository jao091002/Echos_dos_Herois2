/*
 * Servidor de salas do multijogador de "Ecos da Era dos Heróis".
 *
 * Só repassa mensagens entre os jogadores de uma mesma sala; a lógica do jogo fica nos navegadores
 * (o primeiro jogador da sala é o "host" e simula os inimigos; se ele sair, o mais antigo que restar assume).
 *
 * Pode rodar na rede local (npm run server) ou hospedado publicamente (Render, Railway, Fly.io, Docker…):
 *   PORT              porta HTTP/WebSocket (o serviço de hospedagem define; padrão 3210)
 *   ALLOWED_ORIGINS   origens que podem conectar, separadas por vírgula, com curinga de um nível
 *                     (ex.: "ecos.vercel.app,*.vercel.app,localhost"). Vazio = qualquer origem.
 *   MAX_CONNECTIONS   limite de conexões simultâneas (padrão 400)
 *
 * HTTP:  GET /health → "ok"     GET /rooms → [{ room, players, max }] (salas públicas, para a lista no jogo)
 *
 * Protocolo WebSocket (JSON):
 *   cliente → servidor: { t: 'join', room, name, private? }  entra numa sala (máx. 4 jogadores)
 *                       { ..., to: id }                       mensagem direta para um jogador
 *                       { ... }                               mensagem para todos os outros da sala
 *   servidor → cliente: { t: 'welcome', id, room, host, peers: [{ id, name }] }
 *                       { t: 'join', id, name } · { t: 'leave', id } · { t: 'host', id } · { t: 'error', msg }
 *                       qualquer mensagem repassada recebe "from" (carimbado pelo servidor, não pelo remetente)
 */
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT || 3210);
const MAX_PLAYERS = 4;
const MAX_MESSAGE = 16 * 1024;                       // bytes por mensagem
const MAX_CONNECTIONS = Number(process.env.MAX_CONNECTIONS || 400);
const RATE_LIMIT = 150;                              // mensagens por segundo por jogador (o Agarrão manda ~60/s)
const ORIGINS = String(process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

/** @type {Map<string, { players: Map<string, { ws: import('ws').WebSocket, name: string, since: number }>, private: boolean }>} */
const rooms = new Map();
let nextId = 1;

const clean = (s, max) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);
const send = (ws, msg) => { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); };
const hostOf = players => { let best = null; for (const [id, p] of players) if (!best || p.since < players.get(best).since) best = id; return best; };

/** Origem permitida? Aceita o host exato ou curinga de um nível ("*.vercel.app"). */
function originAllowed(origin) {
  if (!ORIGINS.length) return true;
  let host = '';
  try { host = new URL(origin).hostname.toLowerCase(); } catch { return false; }
  return ORIGINS.some(o => o === host || (o.startsWith('*.') && host.endsWith(o.slice(1)) && host.split('.').length === o.split('.').length));
}

/* ---------------------------------------------------------------- HTTP (saúde e lista de salas) */
const http = createServer((req, res) => {
  const path = (req.url || '/').split('?')[0];
  res.setHeader('Access-Control-Allow-Origin', '*'); // só leitura: a lista de salas públicas
  if (path === '/health' || path === '/') { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('ok'); return; }
  if (path === '/rooms') {
    const list = [...rooms].filter(([, r]) => !r.private).map(([room, r]) => ({ room, players: r.players.size, max: MAX_PLAYERS }))
      .sort((a, b) => b.players - a.players).slice(0, 50);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(list)); return;
  }
  res.writeHead(404); res.end();
});

/* ---------------------------------------------------------------- WebSocket */
const wss = new WebSocketServer({
  server: http, maxPayload: MAX_MESSAGE,
  verifyClient: (info, done) => {
    if (wss.clients.size >= MAX_CONNECTIONS) return done(false, 503, 'Servidor cheio');
    if (!originAllowed(info.origin)) return done(false, 403, 'Origem não permitida');
    done(true);
  },
});

wss.on('connection', ws => {
  let roomCode = null, id = null;
  let windowStart = Date.now(), count = 0;
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', raw => {
    // limite de mensagens: excesso é descartado; abuso grosseiro derruba a conexão
    const now = Date.now();
    if (now - windowStart >= 1000) { windowStart = now; count = 0; }
    if (++count > RATE_LIMIT) { if (count > RATE_LIMIT * 3) ws.terminate(); return; }
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if (!msg || typeof msg !== 'object' || Array.isArray(msg)) return;

    if (msg.t === 'join') {
      if (roomCode) return;
      const code = clean(msg.room, 24).toLowerCase().replace(/\s+/g, '-') || 'aurora';
      const room = rooms.get(code) ?? { players: new Map(), private: !!msg.private };
      if (room.players.size >= MAX_PLAYERS) { send(ws, { t: 'error', msg: `A sala "${code}" está cheia (${MAX_PLAYERS} jogadores).` }); ws.close(); return; }
      id = `p${nextId++}`; roomCode = code;
      const name = clean(msg.name, 16) || `Viajante ${id.slice(1)}`;
      room.players.set(id, { ws, name, since: Date.now() + Math.random() });
      rooms.set(code, room);
      send(ws, { t: 'welcome', id, room: code, host: hostOf(room.players), peers: [...room.players].filter(([pid]) => pid !== id).map(([pid, p]) => ({ id: pid, name: p.name })) });
      for (const [pid, p] of room.players) if (pid !== id) send(p.ws, { t: 'join', id, name });
      console.log(`[${new Date().toISOString()}] sala ${code}: entrou ${id} · ${room.players.size}/${MAX_PLAYERS} · ${rooms.size} salas`);
      return;
    }
    if (!roomCode) return;
    const room = rooms.get(roomCode); if (!room) return;
    const out = { ...msg, from: id }; delete out.to;
    if (typeof msg.to === 'string') { const peer = room.players.get(msg.to); if (peer) send(peer.ws, out); return; }
    for (const [pid, p] of room.players) if (pid !== id) send(p.ws, out);
  });

  ws.on('close', () => {
    if (!roomCode) return;
    const room = rooms.get(roomCode); if (!room) return;
    const wasHost = hostOf(room.players) === id;
    room.players.delete(id);
    if (room.players.size === 0) { rooms.delete(roomCode); return; }
    for (const [, p] of room.players) send(p.ws, { t: 'leave', id });
    if (wasHost) { const h = hostOf(room.players); for (const [, p] of room.players) send(p.ws, { t: 'host', id: h }); }
  });
});

// conexões mortas (Wi-Fi caiu, aba suspensa): ping a cada 25 s, derruba quem não respondeu ao anterior
const heartbeat = setInterval(() => {
  for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; ws.ping(); }
}, 25000);
wss.on('close', () => clearInterval(heartbeat));

http.listen(PORT, () => {
  console.log(`Servidor multijogador ouvindo na porta ${PORT}${ORIGINS.length ? ` · origens: ${ORIGINS.join(', ')}` : ' · qualquer origem'}`);
});
