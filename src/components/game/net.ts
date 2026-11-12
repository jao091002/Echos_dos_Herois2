/* ============================================================================
 *  REDE — duas formas de montar uma sala, com a mesma interface para o jogo:
 *
 *  • P2P (padrão, sem servidor próprio): os navegadores se conectam direto por WebRTC. O primeiro a
 *    entrar na sala vira o host e o navegador dele faz o papel do servidor de salas (mesmo protocolo
 *    do server/relay.mjs). Para os navegadores se acharem, usa o serviço público e gratuito do PeerJS
 *    (só troca dados de conexão; o jogo passa direto entre os jogadores).
 *  • Servidor próprio (ws:// ou wss://): server/relay.mjs hospedado (Render, rede local…).
 *
 *  O host da sala também simula os inimigos (ver CombatSystem.netRole).
 * ========================================================================== */
import type { DataConnection, Peer as PeerJs } from 'peerjs';

export type NetStatus = 'offline' | 'waking' | 'connecting' | 'online' | 'error';

/** Valor do campo "servidor" que significa conexão direta entre navegadores (sem servidor próprio). */
export const P2P = 'p2p';
/**
 * Servidor oficial do multijogador: variável NEXT_PUBLIC_MP_SERVER no build (ex.: wss://…onrender.com,
 * configurada na Vercel). Sem ela, o padrão é P2P — funciona em qualquer hospedagem estática.
 */
export const OFFICIAL_SERVER = (process.env.NEXT_PUBLIC_MP_SERVER ?? '').trim() || P2P;
export function defaultServer() { return OFFICIAL_SERVER; }
export const isP2P = (server: string) => !server.trim() || server.trim().toLowerCase() === P2P;

/** Endereço HTTP(S) equivalente ao WebSocket (para /health e /rooms). */
export function httpBase(wsUrl: string) {
  try { const u = new URL(wsUrl); if (!/^wss?:$/.test(u.protocol)) return ''; u.protocol = u.protocol === 'wss:' ? 'https:' : 'http:'; u.pathname = u.pathname.replace(/\/+$/, ''); return u.toString().replace(/\/+$/, ''); } catch { return ''; }
}
export type RoomInfo = { room: string; players: number; max: number };
/** Lista as salas públicas do servidor próprio (null se não respondeu ou se é P2P, que não tem lista). */
export async function listRooms(wsUrl: string, timeoutMs = 8000): Promise<RoomInfo[] | null> {
  if (isP2P(wsUrl)) return null;
  const base = httpBase(wsUrl); if (!base) return null;
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  try { const r = await fetch(`${base}/rooms`, { signal: ctl.signal, cache: 'no-store' }); return r.ok ? (await r.json()) as RoomInfo[] : null; }
  catch { return null; } finally { clearTimeout(timer); }
}
export type Peer = { id: string; name: string };
/** Mensagem recebida (sempre com "from" carimbado por quem faz o papel de servidor). */
export type NetMsg = { t: string; from?: string; [k: string]: unknown };

const MAX_PLAYERS = 4;
/** Prefixo dos ids de sala no PeerJS (o id do host é o nome da sala). */
const ROOM_PREFIX = 'ecos-da-era-dos-herois-';
const ICE = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }];
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'aurora';
const clean = (s: unknown, max: number) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);

export class NetClient {
  status: NetStatus = 'offline';
  error = '';
  id = '';
  room = '';
  host = '';
  /** 'relay' = servidor próprio; 'p2p' = direto entre navegadores. */
  mode: 'relay' | 'p2p' = 'p2p';
  readonly peers = new Map<string, Peer>();
  private ws: WebSocket | null = null;
  private listeners = new Set<() => void>();
  /** Mensagens de jogo (o Game liga isto ao montar). */
  onMessage: (m: NetMsg) => void = () => {};
  /** Jogador entrou/saiu ou o host mudou. */
  onRoster: (ev: { type: 'join' | 'leave' | 'host' | 'welcome'; id: string }) => void = () => {};

  get online() { return this.status === 'online'; }
  get isHost() { return this.online && this.host === this.id; }

  /** Assinatura para a interface (useSyncExternalStore). */
  subscribe = (l: () => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  private version = 0;
  getVersion = () => this.version;
  private changed() { this.version++; this.listeners.forEach(l => l()); }
  private fail(msg: string) { this.status = 'error'; this.error = msg; this.changed(); }

  /** Conecta e entra na sala (P2P ou servidor próprio, conforme o endereço). */
  async connect(server: string, room: string, name: string, isPrivate = false) {
    this.close();
    this.myName = clean(name, 16) || 'Viajante';
    // fechar/recarregar a aba avisa a sala (sem isso, os outros só percebem pelo silêncio)
    if (!this.pagehideBound && typeof window !== 'undefined') { this.pagehideBound = true; window.addEventListener('pagehide', () => this.close()); }
    if (isP2P(server)) return this.connectP2P(room, name);
    this.mode = 'relay';
    const url = server.trim();
    if (typeof location !== 'undefined' && location.protocol === 'https:' && url.startsWith('ws://') && !/^ws:\/\/(localhost|127\.)/.test(url)) {
      this.fail('Esta página está em HTTPS: o servidor precisa ser seguro (wss://…).'); return;
    }
    const attempt = ++this.attempt;
    this.status = 'waking'; this.error = ''; this.changed();
    // hospedagens gratuitas (Render) dormem sem uso: chama /health até responder (até ~75 s)
    const base = httpBase(url), deadline = Date.now() + 75000;
    if (!base) { this.fail('Endereço de servidor inválido (use wss://… ou deixe "p2p").'); return; }
    let awake = false;
    while (Date.now() < deadline) {
      if (attempt !== this.attempt) return; // cancelado (desconectar / nova tentativa)
      try { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 10000); const r = await fetch(`${base}/health`, { signal: ctl.signal, cache: 'no-store' }); clearTimeout(t); if (r.ok) { awake = true; break; } } catch { /* ainda dormindo / fora do ar */ }
      await new Promise(r => setTimeout(r, 2500));
    }
    if (attempt !== this.attempt) return;
    if (!awake) { this.fail('O servidor não respondeu. Confira o endereço ou use o modo padrão (p2p).'); return; }
    this.openRelay(url, room, name, isPrivate);
  }
  private attempt = 0;
  private pagehideBound = false;

  /** Mensagens que chegam do "servidor" (WebSocket do relay ou conexão com o host P2P). */
  private incoming(m: NetMsg) {
    switch (m.t) {
      case 'welcome':
        this.id = String(m.id); this.room = String(m.room); this.host = String(m.host);
        this.peers.clear(); for (const p of (m.peers as Peer[])) this.peers.set(p.id, p);
        this.status = 'online'; this.error = ''; this.changed(); this.onRoster({ type: 'welcome', id: this.id });
        if (this.mode === 'p2p') this.startHeartbeat();
        return;
      case 'join': this.peers.set(String(m.id), { id: String(m.id), name: String(m.name) }); this.changed(); this.onRoster({ type: 'join', id: String(m.id) }); return;
      case 'leave': this.peers.delete(String(m.id)); this.changed(); this.onRoster({ type: 'leave', id: String(m.id) }); return;
      case 'host': this.host = String(m.id); this.changed(); this.onRoster({ type: 'host', id: this.host }); return;
      case 'error': this.fail(String(m.msg)); return;
      default: this.onMessage(m);
    }
  }

  /* ------------------------------------------------------------------ servidor próprio (WebSocket) */
  private openRelay(url: string, room: string, name: string, isPrivate: boolean) {
    this.status = 'connecting'; this.changed();
    let ws: WebSocket;
    try { ws = new WebSocket(url); } catch { this.fail('Endereço inválido.'); return; }
    this.ws = ws;
    ws.onopen = () => ws.send(JSON.stringify({ t: 'join', room, name, private: isPrivate }));
    ws.onmessage = ev => { let m: NetMsg; try { m = JSON.parse(String(ev.data)); } catch { return; } this.incoming(m); };
    ws.onerror = () => { if (this.ws !== ws) return; this.fail(this.error || 'Não foi possível conectar ao servidor.'); };
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      if (this.status === 'online') { this.status = 'offline'; this.error = 'Conexão encerrada.'; }
      else if (this.status === 'connecting') { this.status = 'error'; this.error = this.error || 'Não foi possível conectar ao servidor.'; }
      this.peers.clear(); this.changed(); this.onRoster({ type: 'leave', id: '*' });
    };
  }

  /* ------------------------------------------------------------------ P2P (WebRTC + PeerJS) */
  private peer: PeerJs | null = null;
  /** Cliente: conexão com o host. */
  private hostConn: DataConnection | null = null;
  /** Host: jogadores conectados (id do jogador → conexão). */
  private players = new Map<string, { conn: DataConnection; name: string; seen: number }>();
  private nextPlayer = 2;
  private p2pArgs: { room: string; name: string; tries: number } | null = null;

  private async connectP2P(room: string, name: string, tries = 0) {
    this.mode = 'p2p';
    const attempt = ++this.attempt;
    this.status = 'connecting'; this.error = tries ? 'Reorganizando a sala…' : ''; this.changed();
    this.p2pArgs = { room, name, tries };
    let PeerCtor: typeof import('peerjs').Peer;
    try { PeerCtor = (await import('peerjs')).Peer; } catch { this.fail('Não foi possível carregar o módulo de conexão.'); return; }
    if (attempt !== this.attempt) return;
    const code = slug(room), roomId = ROOM_PREFIX + code;
    // 1) tenta ser o host: registrar o id da sala. Se já existe alguém com ele, entra como cliente.
    const peer = new PeerCtor(roomId, { config: { iceServers: ICE }, debug: 0 });
    this.peer = peer;
    peer.on('open', () => { if (attempt === this.attempt) this.becomeHost(code, name); });
    peer.on('connection', conn => this.acceptPlayer(conn));
    peer.on('error', err => {
      if (attempt !== this.attempt) return;
      const type = (err as { type?: string }).type;
      if (type === 'unavailable-id') { peer.destroy(); if (this.peer === peer) this.peer = null; void this.joinP2P(roomId, code, name, attempt); return; }
      if (type === 'network' || type === 'server-error' || type === 'socket-error' || type === 'socket-closed') {
        if (this.status !== 'online') this.fail('Sem conexão com o serviço de salas (PeerJS). Verifique a internet e tente de novo.');
        return;
      }
      if (type === 'browser-incompatible') { this.fail('Este navegador não suporta conexão direta (WebRTC).'); return; }
    });
  }

  /** Cliente: conecta no host da sala (id = nome da sala). */
  private async joinP2P(roomId: string, code: string, name: string, attempt: number) {
    const { Peer: PeerCtor } = await import('peerjs');
    if (attempt !== this.attempt) return;
    const peer = new PeerCtor({ config: { iceServers: ICE }, debug: 0 });
    this.peer = peer;
    let opened = false;
    const retry = () => {
      // host acabou de sair (o id da sala ainda não foi liberado) ou falha passageira: tenta de novo
      if (attempt !== this.attempt) return;
      const a = this.p2pArgs; if (!a) return;
      if (a.tries >= 12) { this.fail('Não foi possível entrar na sala. Tente de novo ou use outro nome de sala.'); return; }
      peer.destroy();
      setTimeout(() => { if (attempt === this.attempt) void this.connectP2P(a.room, a.name, a.tries + 1); }, 1500 + Math.random() * 1500);
    };
    const timer = setTimeout(() => { if (!opened) retry(); }, 30000);
    peer.on('open', () => {
      if (attempt !== this.attempt) return;
      const conn = peer.connect(roomId, { reliable: true, serialization: 'json' });
      this.hostConn = conn;
      conn.on('open', () => { opened = true; clearTimeout(timer); conn.send({ t: 'join', room: code, name }); });
      conn.on('data', d => {
        if (attempt !== this.attempt || !d || typeof d !== 'object') return;
        this.lastFromHost = Date.now();
        const m = d as NetMsg;
        if (m.t === 'hb') return;
        if (m.t === 'hostbye') { this.hostLost(attempt, conn); return; }
        this.incoming(m);
      });
      conn.on('close', () => this.hostLost(attempt, conn));
      conn.on('error', () => { if (!opened) retry(); });
    });
    peer.on('error', err => {
      if (attempt !== this.attempt) return;
      const type = (err as { type?: string }).type;
      if (type === 'peer-unavailable') { clearTimeout(timer); retry(); return; }
      if (!opened && (type === 'network' || type === 'server-error' || type === 'socket-error')) this.fail('Sem conexão com o serviço de salas (PeerJS). Verifique a internet e tente de novo.');
    });
  }

  /**
   * Cliente: o host saiu (aviso de saída, conexão fechada ou silêncio > 15 s). Limpa a sala local e reorganiza:
   * todos tentam assumir o nome da sala de novo — o primeiro vira o novo host e os outros entram nele.
   */
  private hostLost(attempt: number, conn: DataConnection) {
    if (attempt !== this.attempt || this.hostConn !== conn) return;
    this.hostConn = null;
    if (this.status !== 'online') return;
    this.peers.clear(); this.id = ''; this.host = ''; this.status = 'connecting'; this.error = 'O host saiu · reorganizando a sala…'; this.changed();
    this.onRoster({ type: 'leave', id: '*' });
    const a = this.p2pArgs; this.peer?.destroy(); this.peer = null;
    setTimeout(() => { if (attempt === this.attempt && a) void this.connectP2P(a.room, a.name, 1); }, 300 + Math.random() * 1500);
  }
  /** Sinal de presença (P2P): a cada 2 s; quem ficar mudo some da sala. */
  private lastFromHost = 0;
  private hbTimer: ReturnType<typeof setInterval> | null = null;
  private startHeartbeat() {
    if (this.hbTimer) clearInterval(this.hbTimer);
    const attempt = this.attempt; let tick = 0;
    this.lastFromHost = Date.now();
    this.hbTimer = setInterval(() => {
      if (attempt !== this.attempt || this.mode !== 'p2p' || !this.online) return;
      const now = Date.now(), beat = (++tick % 2) === 0;
      if (this.isHost) {
        for (const [pid, p] of this.players) {
          if (beat && p.conn.open) p.conn.send({ t: 'hb' });
          if (now - p.seen > 20000) { p.conn.close(); this.dropPlayer(pid); }
        }
      } else if (this.hostConn) {
        if (beat && this.hostConn.open) this.hostConn.send({ t: 'hb' });
        if (now - this.lastFromHost > 15000) this.hostLost(attempt, this.hostConn);
      }
    }, 1000);
  }
  private dropPlayer(pid: string) {
    if (!this.players.has(pid)) return;
    this.players.delete(pid);
    for (const [, p] of this.players) if (p.conn.open) p.conn.send({ t: 'leave', id: pid });
    this.incoming({ t: 'leave', id: pid });
  }

  /** Host P2P: este navegador passa a ser o "servidor" da sala. */
  private becomeHost(code: string, name: string) {
    this.players.clear(); this.nextPlayer = 2;
    this.id = 'p1'; this.host = 'p1'; this.room = code; this.peers.clear();
    this.myName = clean(name, 16) || 'Viajante';
    this.status = 'online'; this.error = ''; this.changed();
    this.onRoster({ type: 'welcome', id: this.id });
    this.startHeartbeat();
  }
  private acceptPlayer(conn: DataConnection) {
    let pid = '';
    conn.on('data', raw => {
      const m = raw as NetMsg; if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
      if (pid) { const pl = this.players.get(pid); if (pl) pl.seen = Date.now(); if (m.t === 'hb') return; if (m.t === 'bye') { conn.close(); this.dropPlayer(pid); return; } }
      if (!pid) {
        if (m.t !== 'join') return;
        if (this.players.size + 1 >= MAX_PLAYERS) { conn.send({ t: 'error', msg: `A sala "${this.room}" está cheia (${MAX_PLAYERS} jogadores).` }); setTimeout(() => conn.close(), 300); return; }
        pid = `p${this.nextPlayer++}`;
        const pname = clean(m.name, 16) || `Viajante ${pid.slice(1)}`;
        const peers = [{ id: this.id, name: this.myName }, ...[...this.players].map(([id, p]) => ({ id, name: p.name }))];
        this.players.set(pid, { conn, name: pname, seen: Date.now() });
        conn.send({ t: 'welcome', id: pid, room: this.room, host: this.id, peers });
        for (const [id, p] of this.players) if (id !== pid) p.conn.send({ t: 'join', id: pid, name: pname });
        this.incoming({ t: 'join', id: pid, name: pname }); // o próprio host também "vê" a entrada
        return;
      }
      // repasse (o host carimba o remetente, como o servidor faria)
      const out: NetMsg = { ...m, from: pid }; delete out.to;
      if (typeof m.to === 'string') {
        if (m.to === this.id) this.incoming(out);
        else this.players.get(m.to)?.conn.send(out);
        return;
      }
      this.incoming(out);
      for (const [id, p] of this.players) if (id !== pid) p.conn.send(out);
    });
    conn.on('close', () => { if (pid) this.dropPlayer(pid); });
  }
  /** Nome deste jogador na sala (o que os outros veem). */
  myName = 'Viajante';

  close() {
    // avisa a sala antes de sair (P2P): o host avisa os clientes; o cliente avisa o host
    try {
      if (this.mode === 'p2p' && this.online) {
        if (this.isHost) { for (const [, p] of this.players) if (p.conn.open) p.conn.send({ t: 'hostbye' }); }
        else if (this.hostConn?.open) this.hostConn.send({ t: 'bye' });
      }
    } catch { /* conexão já caiu */ }
    if (this.hbTimer) { clearInterval(this.hbTimer); this.hbTimer = null; }
    this.attempt++; // cancela tentativas pendentes
    const ws = this.ws; this.ws = null;
    if (ws) { ws.onclose = null; ws.close(); }
    this.hostConn = null; this.players.clear(); this.p2pArgs = null;
    if (this.peer) { this.peer.destroy(); this.peer = null; }
    if (this.status !== 'offline') { this.status = 'offline'; this.error = ''; this.peers.clear(); this.id = ''; this.host = ''; this.changed(); this.onRoster({ type: 'leave', id: '*' }); }
  }

  /** Para todos os outros jogadores da sala. */
  send(msg: NetMsg) {
    if (!this.online) return;
    if (this.mode === 'relay') { this.ws?.send(JSON.stringify(msg)); return; }
    if (this.isHost) { const out = { ...msg, from: this.id }; for (const [, p] of this.players) if (p.conn.open) p.conn.send(out); }
    else if (this.hostConn?.open) this.hostConn.send(msg);
  }
  /** Para um jogador específico. */
  sendTo(to: string, msg: NetMsg) {
    if (!this.online || !to) return;
    if (this.mode === 'relay') { this.ws?.send(JSON.stringify({ ...msg, to })); return; }
    if (this.isHost) { const p = this.players.get(to); if (p?.conn.open) p.conn.send({ ...msg, from: this.id }); }
    else if (this.hostConn?.open) this.hostConn.send({ ...msg, to });
  }
}

/** Arredonda para mensagens menores. */
export const r2 = (v: number) => Math.round(v * 100) / 100;
