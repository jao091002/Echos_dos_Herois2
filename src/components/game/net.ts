/* ============================================================================
 *  REDE — cliente do servidor de retransmissão (server/relay.mjs)
 *  Uma conexão WebSocket por jogador; o servidor só repassa mensagens dentro da sala.
 *  O primeiro jogador da sala é o host (simula os inimigos); os demais são clientes.
 * ========================================================================== */

export type NetStatus = 'offline' | 'waking' | 'connecting' | 'online' | 'error';

/**
 * Servidor oficial (público) do multijogador. Definido no build pela variável de ambiente
 * NEXT_PUBLIC_MP_SERVER (ex.: wss://ecos-multijogador.onrender.com, configurada na Vercel).
 * Sem ela, em desenvolvimento local o padrão é o servidor da própria máquina.
 */
export const OFFICIAL_SERVER = (process.env.NEXT_PUBLIC_MP_SERVER ?? '').trim();
export function defaultServer() {
  if (OFFICIAL_SERVER) return OFFICIAL_SERVER;
  if (typeof location === 'undefined') return 'ws://localhost:3210';
  return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.hostname || 'localhost'}:3210`;
}
/** Endereço HTTP(S) equivalente ao WebSocket (para /health e /rooms). */
export function httpBase(wsUrl: string) {
  try { const u = new URL(wsUrl); u.protocol = u.protocol === 'wss:' ? 'https:' : 'http:'; u.pathname = u.pathname.replace(/\/+$/, ''); return u.toString().replace(/\/+$/, ''); } catch { return ''; }
}
export type RoomInfo = { room: string; players: number; max: number };
/** Lista as salas públicas do servidor (null se não respondeu). */
export async function listRooms(wsUrl: string, timeoutMs = 8000): Promise<RoomInfo[] | null> {
  const base = httpBase(wsUrl); if (!base) return null;
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  try { const r = await fetch(`${base}/rooms`, { signal: ctl.signal, cache: 'no-store' }); return r.ok ? (await r.json()) as RoomInfo[] : null; }
  catch { return null; } finally { clearTimeout(timer); }
}
export type Peer = { id: string; name: string };
/** Mensagem recebida (sempre com "from" carimbado pelo servidor nas mensagens repassadas). */
export type NetMsg = { t: string; from?: string; [k: string]: unknown };

export class NetClient {
  status: NetStatus = 'offline';
  error = '';
  id = '';
  room = '';
  host = '';
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

  /**
   * Conecta e entra na sala. Antes, "acorda" o servidor: hospedagens gratuitas (Render) dormem sem uso e
   * levam até ~1 minuto para voltar — o /health é chamado até responder.
   */
  async connect(url: string, room: string, name: string, isPrivate = false) {
    this.close();
    if (typeof location !== 'undefined' && location.protocol === 'https:' && url.startsWith('ws://') && !/^ws:\/\/(localhost|127\.)/.test(url)) {
      this.status = 'error'; this.error = 'Esta página está em HTTPS: o servidor precisa ser seguro (wss://…).'; this.changed(); return;
    }
    const attempt = ++this.attempt;
    this.status = 'waking'; this.error = ''; this.changed();
    const base = httpBase(url), deadline = Date.now() + 75000;
    let awake = false;
    while (base && Date.now() < deadline) {
      if (attempt !== this.attempt) return; // cancelado (desconectar / nova tentativa)
      try { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 10000); const r = await fetch(`${base}/health`, { signal: ctl.signal, cache: 'no-store' }); clearTimeout(t); if (r.ok) { awake = true; break; } } catch { /* ainda dormindo / fora do ar */ }
      await new Promise(r => setTimeout(r, 2500));
    }
    if (attempt !== this.attempt) return;
    if (base && !awake) { this.status = 'error'; this.error = 'O servidor não respondeu. Confira o endereço ou tente de novo em instantes.'; this.changed(); return; }
    this.open(url, room, name, isPrivate);
  }
  private attempt = 0;

  private open(url: string, room: string, name: string, isPrivate: boolean) {
    this.status = 'connecting'; this.changed();
    let ws: WebSocket;
    try { ws = new WebSocket(url); } catch { this.status = 'error'; this.error = 'Endereço inválido.'; this.changed(); return; }
    this.ws = ws;
    ws.onopen = () => ws.send(JSON.stringify({ t: 'join', room, name, private: isPrivate }));
    ws.onmessage = ev => {
      let m: NetMsg; try { m = JSON.parse(String(ev.data)); } catch { return; }
      switch (m.t) {
        case 'welcome':
          this.id = String(m.id); this.room = String(m.room); this.host = String(m.host);
          this.peers.clear(); for (const p of (m.peers as Peer[])) this.peers.set(p.id, p);
          this.status = 'online'; this.changed(); this.onRoster({ type: 'welcome', id: this.id }); return;
        case 'join': this.peers.set(String(m.id), { id: String(m.id), name: String(m.name) }); this.changed(); this.onRoster({ type: 'join', id: String(m.id) }); return;
        case 'leave': this.peers.delete(String(m.id)); this.changed(); this.onRoster({ type: 'leave', id: String(m.id) }); return;
        case 'host': this.host = String(m.id); this.changed(); this.onRoster({ type: 'host', id: this.host }); return;
        case 'error': this.error = String(m.msg); this.status = 'error'; this.changed(); return;
        default: this.onMessage(m);
      }
    };
    ws.onerror = () => { if (this.ws !== ws) return; this.status = 'error'; this.error = this.error || 'Não foi possível conectar ao servidor. Ele está rodando (npm run server)?'; this.changed(); };
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      if (this.status === 'online') { this.status = 'offline'; this.error = 'Conexão encerrada.'; }
      else if (this.status === 'connecting') { this.status = 'error'; this.error = this.error || 'Não foi possível conectar ao servidor.'; }
      this.peers.clear(); this.changed(); this.onRoster({ type: 'leave', id: '*' });
    };
  }

  close() {
    this.attempt++; // cancela uma conexão que ainda estava acordando o servidor
    const ws = this.ws; this.ws = null;
    if (ws) { ws.onclose = null; ws.close(); }
    if (this.status !== 'offline') { this.status = 'offline'; this.error = ''; this.peers.clear(); this.id = ''; this.host = ''; this.changed(); this.onRoster({ type: 'leave', id: '*' }); }
  }

  /** Para todos os outros jogadores da sala. */
  send(msg: NetMsg) { if (this.ws && this.online) this.ws.send(JSON.stringify(msg)); }
  /** Para um jogador específico. */
  sendTo(to: string, msg: NetMsg) { if (this.ws && this.online && to) this.ws.send(JSON.stringify({ ...msg, to })); }
}

/** Arredonda para mensagens menores. */
export const r2 = (v: number) => Math.round(v * 100) / 100;
