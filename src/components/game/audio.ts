/*
 * Áudio 100% sintetizado (Web Audio): sem arquivos. Tom: calmo, melancólico e cristalino (Frieren).
 *  - Trilha generativa suave: acordes em Ré menor (Dm9 – Si♭maj7 – Fá – Sol m7) com pad lento e notas de "caixa de música"
 *    espaçadas, banhadas em reverb. Em combate a trilha fica mais densa e ganha um tambor grave discreto.
 *  - Ambiente: vento (mais forte voando), pássaros de dia, grilos e coruja à noite, água perto do lago/riacho, folhas.
 *  - Efeitos: passos, pulo/aterrissagem, magias (Zoltraak, Vollzanbel, Judradjim, escudo, voo), golpes, dano, inimigos,
 *    itens, nível e interface. Tudo passa por um reverb comum e um compressor para soar coeso.
 */
export type SfxName =
  | 'cast' | 'beamFire' | 'chargeFull' | 'lightCharge' | 'lightning' | 'fireCharge' | 'fireBoom'
  | 'shieldUp' | 'shieldDown' | 'shieldBlock' | 'shieldBreak' | 'flightOn' | 'flightOff'
  | 'dodge' | 'jump' | 'land' | 'step' | 'swing' | 'staffToggle'
  | 'hurt' | 'hitEnemy' | 'enemyDie' | 'wolfAttack' | 'banditAttack' | 'demonAttack'
  | 'pickup' | 'levelUp' | 'ui' | 'uiStart';

type AudioState = { daylight: number; flying: boolean; combat: number; water: number };

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const MIN_GAP: Partial<Record<SfxName, number>> = { step: 0.09, hitEnemy: 0.07, wolfAttack: 0.2, banditAttack: 0.2, demonAttack: 0.3, pickup: 0.05, enemyDie: 0.08, shieldBlock: 0.06 };

// progressão: Dm9 – Si♭maj7 – Fá – Sol m7 (pad = notas sustentadas; pool = notas da melodia)
const CHORDS = [
  { pad: [38, 50, 57, 65, 69], pool: [62, 65, 69, 72, 74, 77, 81] },
  { pad: [34, 46, 53, 62, 69], pool: [62, 65, 69, 70, 74, 77, 81] },
  { pad: [41, 53, 60, 65, 69], pool: [60, 65, 67, 69, 72, 74, 77] },
  { pad: [43, 50, 58, 62, 65], pool: [62, 65, 67, 70, 74, 77, 79] },
];

export class AmbientAudio {
  private ctx: AudioContext | null = null;
  private master!: GainNode; private sfxBus!: GainNode; private musicBus!: GainNode; private ambBus!: GainNode; private revIn!: GainNode;
  private windGain!: GainNode; private windFilter!: BiquadFilterNode; private cricketGain!: GainNode; private waterGain!: GainNode;
  private noiseBuf!: AudioBuffer;
  private muted = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private state: AudioState = { daylight: 0.4, flying: false, combat: 0, water: 0 };
  private combatSmooth = 0;
  private nextNote = 0; private step = 0; private lastIdx = 3; private lastSfx = new Map<string, number>();

  /* ------------------------------------------------------------------ ciclo de vida */
  start() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.build(new AC());
    }
    void this.ctx!.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.15);
    if (!muted) this.start();
  }

  /** Estado do mundo (chamar ~4x por segundo). */
  setState(s: Partial<AudioState>) { Object.assign(this.state, s); }

  dispose() {
    if (this.timer) clearInterval(this.timer); this.timer = null;
    if (this.hum) { this.hum.a.stop(); this.hum.b.stop(); this.hum.lfo.stop(); this.hum = null; }
    if (this.ctx && this.ctx.state !== 'closed') void this.ctx.close();
    this.ctx = null;
  }

  private build(ctx: AudioContext) {
    this.ctx = ctx;
    const g = (v: number) => { const n = ctx.createGain(); n.gain.value = v; return n; };
    this.master = g(this.muted ? 0 : 0.9);
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 3.5; comp.attack.value = 0.004; comp.release.value = 0.25;
    this.master.connect(comp).connect(ctx.destination);
    this.sfxBus = g(0.9); this.musicBus = g(0.5); this.ambBus = g(0.6);
    this.sfxBus.connect(this.master); this.musicBus.connect(this.master); this.ambBus.connect(this.master);
    // reverb comum (impulso gerado: cauda de ruído estéreo de ~2,8 s)
    const conv = ctx.createConvolver(), len = Math.floor(ctx.sampleRate * 2.8), imp = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = imp.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    conv.buffer = imp; this.revIn = g(1);
    const revOut = g(0.55); this.revIn.connect(conv).connect(revOut).connect(this.master);
    const send = (bus: GainNode, amt: number) => bus.connect(g(amt)).connect(this.revIn);
    send(this.sfxBus, 0.24); send(this.musicBus, 0.55);

    const nl = ctx.sampleRate * 2; this.noiseBuf = ctx.createBuffer(1, nl, ctx.sampleRate);
    const nd = this.noiseBuf.getChannelData(0); for (let i = 0; i < nl; i++) nd[i] = Math.random() * 2 - 1;

    // vento (ruído marrom + oscilação lenta)
    const bl = ctx.sampleRate * 6, brown = ctx.createBuffer(1, bl, ctx.sampleRate), bd = brown.getChannelData(0);
    let b = 0; for (let i = 0; i < bl; i++) { b = (b + 0.018 * (Math.random() * 2 - 1)) / 1.018; bd[i] = b * 3.1; }
    const wind = ctx.createBufferSource(); wind.buffer = brown; wind.loop = true;
    this.windFilter = ctx.createBiquadFilter(); this.windFilter.type = 'lowpass'; this.windFilter.frequency.value = 520; this.windFilter.Q.value = 0.55;
    this.windGain = g(0.1);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07; const lfoG = g(0.045); lfo.connect(lfoG).connect(this.windGain.gain); lfo.start();
    wind.connect(this.windFilter).connect(this.windGain).connect(this.ambBus); wind.start();
    // grilos (noite)
    this.cricketGain = g(0);
    for (const [f, rate] of [[4300, 13], [4700, 9.5]] as const) {
      const o = ctx.createOscillator(); o.frequency.value = f; const am = g(0.5), l = ctx.createOscillator(); l.type = 'square'; l.frequency.value = rate;
      const lg = g(0.5); l.connect(lg).connect(am.gain); o.connect(am).connect(this.cricketGain); o.start(); l.start();
    }
    this.cricketGain.connect(this.ambBus);
    // água corrente
    const wn = ctx.createBufferSource(); wn.buffer = this.noiseBuf; wn.loop = true;
    const wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 850; wf.Q.value = 0.45;
    const wlf = ctx.createOscillator(); wlf.frequency.value = 0.3; const wlg = g(120); wlf.connect(wlg).connect(wf.frequency); wlf.start();
    this.waterGain = g(0); wn.connect(wf).connect(this.waterGain).connect(this.ambBus); wn.start();

    this.nextNote = ctx.currentTime + 0.4;
    this.timer = setInterval(() => this.tick(), 200);
  }

  /* ------------------------------------------------------------------ helpers de síntese */
  private tone(o: { f: number; f2?: number; type?: OscillatorType; t: number; a?: number; d: number; g: number; lp?: number; pan?: number; bus?: AudioNode }) {
    const c = this.ctx!, a = o.a ?? 0.005, osc = c.createOscillator(); osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(o.f, o.t); if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), o.t + a + o.d);
    const gn = c.createGain(); gn.gain.setValueAtTime(0.0001, o.t); gn.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.g), o.t + a); gn.gain.exponentialRampToValueAtTime(0.0001, o.t + a + o.d);
    let src: AudioNode = osc;
    if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; osc.connect(f); src = f; }
    src.connect(gn); let out: AudioNode = gn;
    if (o.pan !== undefined) { const p = c.createStereoPanner(); p.pan.value = o.pan; gn.connect(p); out = p; }
    out.connect(o.bus ?? this.sfxBus); osc.start(o.t); osc.stop(o.t + a + o.d + 0.05);
  }
  private noise(o: { t: number; a?: number; d: number; g: number; type?: BiquadFilterType; f: number; f2?: number; q?: number; bus?: AudioNode }) {
    const c = this.ctx!, a = o.a ?? 0.004, src = c.createBufferSource(); src.buffer = this.noiseBuf; src.loop = true;
    const f = c.createBiquadFilter(); f.type = o.type ?? 'bandpass'; f.frequency.setValueAtTime(o.f, o.t); if (o.f2) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), o.t + a + o.d); f.Q.value = o.q ?? 1;
    const gn = c.createGain(); gn.gain.setValueAtTime(0.0001, o.t); gn.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.g), o.t + a); gn.gain.exponentialRampToValueAtTime(0.0001, o.t + a + o.d);
    src.connect(f).connect(gn).connect(o.bus ?? this.sfxBus); src.start(o.t, Math.random() * 1.5); src.stop(o.t + a + o.d + 0.05);
  }
  /** Nota "caixa de música": seno + harmônicos curtos, decaimento longo. */
  private pluck(freq: number, t: number, vel: number, bus?: AudioNode) {
    this.tone({ f: freq, t, a: 0.006, d: 2.4, g: 0.16 * vel, bus: bus ?? this.musicBus });
    this.tone({ f: freq * 2, type: 'triangle', t, a: 0.004, d: 1.1, g: 0.045 * vel, bus: bus ?? this.musicBus });
    this.tone({ f: freq * 3.003, t, a: 0.003, d: 0.45, g: 0.014 * vel, bus: bus ?? this.musicBus });
  }

  /* ------------------------------------------------------------------ agendador (música + ambiente) */
  private tick() {
    const c = this.ctx; if (!c || c.state !== 'running') return;
    const now = c.currentTime, s = this.state;
    this.combatSmooth += (s.combat - this.combatSmooth) * 0.25;
    const stepDur = 0.52 - 0.09 * this.combatSmooth;
    if (this.nextNote < now - 0.2) this.nextNote = now + 0.1; // recuperou de aba em segundo plano
    while (this.nextNote < now + 0.9) { this.scheduleStep(this.nextNote, stepDur); this.nextNote += stepDur; this.step++; }
    // camadas de ambiente
    const night = clamp01((0.38 - s.daylight) / 0.28);
    this.windGain.gain.setTargetAtTime(0.085 + (s.flying ? 0.12 : 0), now, 0.7);
    this.windFilter.frequency.setTargetAtTime(s.flying ? 1500 : 520, now, 0.6);
    this.cricketGain.gain.setTargetAtTime(night * 0.02, now, 1.5);
    this.waterGain.gain.setTargetAtTime(s.water * 0.2, now, 0.8);
    if (s.daylight > 0.4 && Math.random() < 0.05) this.bird(now + rnd(0, 0.15));
    if (night > 0.5 && Math.random() < 0.006) this.owl(now);
    if (Math.random() < 0.03) this.noise({ t: now, a: 0.5, d: 0.9, g: 0.022, type: 'bandpass', f: rnd(2500, 4500), f2: rnd(1800, 3000), q: 0.8, bus: this.ambBus }); // folhas
  }

  private scheduleStep(t: number, stepDur: number) {
    const ci = Math.floor(this.step / 16) % CHORDS.length, ch = CHORDS[ci], pos = this.step % 16, combat = this.combatSmooth;
    if (pos === 0) { // pad do compasso
      const c = this.ctx!;
      ch.pad.forEach((n, i) => {
        const o = c.createOscillator(); o.type = i < 2 ? 'sine' : 'triangle'; o.frequency.value = midi(n) * (1 + (i % 2 ? 0.0012 : -0.0012));
        const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 650 + combat * 500;
        const g = c.createGain(), dur = 16 * stepDur, peak = (i < 2 ? 0.05 : 0.026) * (1 + combat * 0.4);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 2.4); g.gain.setValueAtTime(peak, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 2.2);
        o.connect(f).connect(g).connect(this.musicBus); o.start(t); o.stop(t + dur + 2.4);
      });
      this.pluck(midi(ch.pad[1]), t, 0.8); // baixo suave no início do acorde
    }
    const downbeat = pos % 4 === 0, bar = Math.floor(this.step / 16);
    const rest = bar % 4 === 3 && pos > 6 && Math.random() < 0.55;
    if (!rest && Math.random() < (downbeat ? 0.78 : 0.3) + combat * 0.14) {
      this.lastIdx = Math.min(ch.pool.length - 1, Math.max(0, this.lastIdx + Math.round(rnd(-2.4, 2.4))));
      this.pluck(midi(ch.pool[this.lastIdx]), t + rnd(0, 0.025), rnd(0.55, 1));
      if (Math.random() < 0.1) this.pluck(midi(ch.pool[this.lastIdx]) * 1.5, t + stepDur * 0.5, 0.4); // eco em quinta
    }
    if (combat > 0.5 && pos % 4 === 0) { // tambor grave discreto
      this.tone({ f: 120, f2: 46, t, a: 0.004, d: 0.32, g: pos === 0 ? 0.34 : 0.22, bus: this.musicBus });
      this.noise({ t, d: 0.06, g: 0.04, type: 'lowpass', f: 300, bus: this.musicBus });
    }
  }

  private bird(t: number) {
    const base = rnd(2400, 4200), n = 2 + Math.floor(Math.random() * 3), pan = rnd(-0.8, 0.8);
    for (let i = 0; i < n; i++) this.tone({ f: base * rnd(0.9, 1.15), f2: base * rnd(1.15, 1.5), t: t + i * 0.13, a: 0.008, d: 0.09, g: 0.026, pan, bus: this.ambBus });
  }
  private owl(t: number) {
    this.tone({ f: 400, f2: 360, t, a: 0.08, d: 0.4, g: 0.03, lp: 700, bus: this.ambBus });
    this.tone({ f: 380, f2: 330, t: t + 0.65, a: 0.08, d: 0.55, g: 0.03, lp: 700, bus: this.ambBus });
  }

  /* ------------------------------------------------------------------ efeitos */
  playCast() { this.sfx('cast'); }

  sfx(name: SfxName, v = 1) {
    this.start(); const c = this.ctx; if (!c || this.muted || c.state !== 'running') return;
    const now = c.currentTime, gap = MIN_GAP[name] ?? 0.03, last = this.lastSfx.get(name) ?? -1;
    if (now - last < gap) return; this.lastSfx.set(name, now);
    const t = now + 0.005;
    switch (name) {
      case 'cast':
        this.tone({ f: 659, f2: 988, t, d: 0.5, g: 0.13 }); this.tone({ f: 1318, t: t + 0.05, d: 0.5, g: 0.07 }); break;
      case 'beamFire':
        this.noise({ t, a: 0.02, d: 0.5, g: 0.26 * (0.6 + v * 0.5), type: 'bandpass', f: 2600, f2: 380, q: 0.9 });
        this.tone({ f: 240, f2: 70, t, a: 0.01, d: 0.7, g: 0.32 * (0.6 + v * 0.6) }); this.tone({ f: 988, f2: 1568, t, d: 0.5, g: 0.1 }); break;
      case 'chargeFull':
        [880, 1175, 1760].forEach((f, i) => this.tone({ f, type: 'triangle', t: t + i * 0.07, d: 0.55, g: 0.1 })); break;
      case 'lightCharge':
        this.tone({ f: 300, f2: 1800, type: 'sawtooth', t, a: 0.18, d: 0.07, g: 0.08, lp: 2200 }); this.noise({ t, a: 0.2, d: 0.1, g: 0.12, type: 'highpass', f: 3500 }); break;
      case 'lightning':
        this.noise({ t, a: 0.002, d: 0.07, g: 0.7, type: 'highpass', f: 2800 });
        this.tone({ f: 1900, f2: 90, type: 'sawtooth', t, a: 0.002, d: 0.38, g: 0.22, lp: 5000 });
        this.noise({ t: t + 0.1, a: 0.06, d: 1.5, g: 0.6, type: 'lowpass', f: 220, f2: 60 }); this.tone({ f: 70, f2: 38, t: t + 0.08, d: 1.2, g: 0.45 });
        this.tone({ f: 1046, t: t + 0.2, d: 0.9, g: 0.05 }); break;
      case 'fireCharge':
        this.noise({ t, a: 1.0, d: 0.4, g: 0.3, type: 'bandpass', f: 200, f2: 1900, q: 0.7 }); this.tone({ f: 110, f2: 230, t, a: 1.0, d: 0.4, g: 0.16 });
        [293.7, 440, 698.5].forEach((f, i) => this.tone({ f, type: 'triangle', t: t + i * 0.12, a: 0.9, d: 0.6, g: 0.055 })); break;
      case 'fireBoom': {
        this.tone({ f: 105, f2: 28, t, a: 0.004, d: 2.0, g: 0.9 });
        this.noise({ t, a: 0.004, d: 1.7, g: 0.8, type: 'lowpass', f: 1400, f2: 110, q: 0.6 });
        this.noise({ t, a: 0.004, d: 0.25, g: 0.5, type: 'highpass', f: 1800 });
        for (let i = 0; i < 14; i++) this.noise({ t: t + 0.1 + Math.random() * 1.8, d: rnd(0.02, 0.06), g: rnd(0.08, 0.22), type: 'highpass', f: rnd(2500, 6000) });
        this.tone({ f: 587, t: t + 0.25, d: 1.8, g: 0.045 }); break;
      }
      case 'shieldUp':
        [784, 1175, 1568, 2349].forEach((f, i) => this.tone({ f, t: t + i * 0.045, d: 0.9, g: 0.09 - i * 0.012 }));
        this.noise({ t, a: 0.1, d: 0.3, g: 0.06, type: 'highpass', f: 5000 }); break;
      case 'shieldDown':
        this.tone({ f: 1175, f2: 587, t, d: 0.4, g: 0.12 }); this.noise({ t, d: 0.25, g: 0.05, type: 'highpass', f: 4500 }); break;
      case 'shieldBlock':
        this.tone({ f: 520, f2: 360, type: 'triangle', t, d: 0.2, g: 0.35 }); this.noise({ t, d: 0.09, g: 0.3, f: 3500, q: 1.5 });
        this.tone({ f: 1568, t, d: 0.7, g: 0.12 }); this.tone({ f: 2093, t: t + 0.03, d: 0.5, g: 0.06 }); break;
      case 'shieldBreak':
        for (let i = 0; i < 14; i++) this.noise({ t: t + Math.random() * 0.35, d: rnd(0.04, 0.12), g: rnd(0.1, 0.3), type: 'highpass', f: rnd(3500, 8000) });
        this.tone({ f: 440, f2: 110, t, d: 0.7, g: 0.28 }); this.tone({ f: 1760, f2: 440, t, d: 0.5, g: 0.1 }); break;
      case 'flightOn':
        this.noise({ t, a: 0.35, d: 0.55, g: 0.26, f: 400, f2: 2600, q: 0.8 }); [523, 784, 1047].forEach((f, i) => this.tone({ f, t: t + i * 0.08, d: 0.7, g: 0.08 })); break;
      case 'flightOff':
        this.noise({ t, a: 0.1, d: 0.5, g: 0.18, f: 2200, f2: 350, q: 0.8 }); this.tone({ f: 784, f2: 392, t, d: 0.5, g: 0.07 }); break;
      case 'dodge':
        this.noise({ t, a: 0.02, d: 0.22, g: 0.3, f: 1900, f2: 600, q: 0.9 }); break;
      case 'jump':
        this.noise({ t, a: 0.02, d: 0.12, g: 0.1, f: 500, f2: 950 }); this.tone({ f: 300, f2: 520, t, d: 0.1, g: 0.06 }); break;
      case 'land':
        this.noise({ t, d: 0.16, g: 0.32 * v, type: 'lowpass', f: 450, f2: 150 }); this.tone({ f: 95, f2: 48, t, d: 0.16, g: 0.3 * v }); break;
      case 'step':
        this.noise({ t, a: 0.003, d: 0.07, g: 0.06 * v, f: rnd(900, 1500), q: 1.2 }); this.tone({ f: rnd(100, 135), f2: 65, t, d: 0.05, g: 0.035 * v }); break;
      case 'swing':
        this.noise({ t, a: 0.03, d: 0.2, g: 0.3, f: 900, f2: 1900, q: 0.9 }); this.tone({ f: 170, f2: 110, t: t + 0.1, d: 0.12, g: 0.16 }); break;
      case 'staffToggle':
        this.tone({ f: 230, f2: 165, t, d: 0.09, g: 0.3 }); this.tone({ f: 460, type: 'triangle', t, d: 0.06, g: 0.1 }); this.noise({ t, d: 0.04, g: 0.1, f: 2500 }); break;
      case 'hurt':
        this.tone({ f: 210, f2: 90, t, d: 0.35, g: 0.38 }); this.noise({ t, d: 0.14, g: 0.3, f: 900 }); this.tone({ f: 311, f2: 233, type: 'triangle', t, d: 0.3, g: 0.08 }); break;
      case 'hitEnemy': {
        const k = 0.6 + clamp01(v) * 0.7;
        this.noise({ t, a: 0.002, d: 0.09, g: 0.28 * k, f: 2100, q: 0.9 }); this.tone({ f: 190, f2: 80, t, d: 0.13, g: 0.28 * k }); this.tone({ f: 1318, t, d: 0.25, g: 0.04 }); break;
      }
      case 'enemyDie':
        this.tone({ f: 330, f2: 60, t, d: 0.85, g: 0.22 }); this.noise({ t, d: 0.6, g: 0.28, type: 'lowpass', f: 650, f2: 100 }); this.tone({ f: 659, f2: 440, t: t + 0.1, d: 0.8, g: 0.06 }); break;
      case 'wolfAttack':
        this.tone({ f: 120, f2: 75, type: 'sawtooth', t, a: 0.03, d: 0.4, g: 0.13, lp: 520 }); this.noise({ t, a: 0.05, d: 0.35, g: 0.12, f: 380, q: 1.2 }); break;
      case 'banditAttack':
        this.noise({ t, a: 0.03, d: 0.22, g: 0.22, f: 1300, f2: 500, q: 0.9 }); this.tone({ f: 140, f2: 90, t: t + 0.05, d: 0.15, g: 0.12 }); break;
      case 'demonAttack':
        this.tone({ f: 75, f2: 44, type: 'sawtooth', t, a: 0.1, d: 1.0, g: 0.2, lp: 420 }); this.noise({ t, a: 0.15, d: 0.8, g: 0.14, type: 'lowpass', f: 260 }); break;
      case 'pickup':
        this.tone({ f: 1047, type: 'triangle', t, d: 0.35, g: 0.11 }); this.tone({ f: 1568, type: 'triangle', t: t + 0.08, d: 0.45, g: 0.11 }); break;
      case 'levelUp':
        [587, 698, 880, 1175].forEach((f, i) => { this.tone({ f, t: t + i * 0.1, d: 1.1, g: 0.12, bus: this.musicBus }); this.tone({ f: f * 2, type: 'triangle', t: t + i * 0.1, d: 0.6, g: 0.04, bus: this.musicBus }); });
        [293.7, 440].forEach(f => this.tone({ f, type: 'triangle', t, a: 0.3, d: 1.6, g: 0.05, bus: this.musicBus })); break;
      case 'ui':
        this.tone({ f: 880, t, d: 0.08, g: 0.07 }); break;
      case 'uiStart':
        [587, 880, 1175].forEach((f, i) => this.tone({ f, t: t + i * 0.09, d: 0.9, g: 0.1 })); break;
    }
  }

  /** Zumbido contínuo do Zoltraak: mode 0 = silêncio, 1 = carregando (tom sobe com o nível), 2 = raio disparado. */
  private hum: { a: OscillatorNode; b: OscillatorNode; lfo: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  setBeam(mode: 0 | 1 | 2, level: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (!this.hum) {
      if (mode === 0) return;
      const ctx = this.ctx, gain = ctx.createGain(); gain.gain.value = 0;
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 900; filter.Q.value = 4;
      const a = ctx.createOscillator(); a.type = 'sawtooth'; const b = ctx.createOscillator(); b.type = 'sine';
      const lfo = ctx.createOscillator(); lfo.frequency.value = 7; const lfoGain = ctx.createGain(); lfoGain.gain.value = 40;
      lfo.connect(lfoGain).connect(filter.frequency);
      a.connect(filter); b.connect(filter); filter.connect(gain).connect(this.sfxBus);
      a.start(); b.start(); lfo.start();
      this.hum = { a, b, lfo, gain, filter };
    }
    const h = this.hum, vol = this.muted ? 0 : mode === 0 ? 0 : mode === 1 ? 0.025 + level * 0.05 : 0.07 + level * 0.06;
    h.gain.gain.setTargetAtTime(vol, now, mode === 0 ? 0.08 : 0.04);
    const base = mode === 2 ? 70 + level * 20 : 110 + level * 330;
    h.a.frequency.setTargetAtTime(base, now, 0.05); h.b.frequency.setTargetAtTime(base * (mode === 2 ? 1.5 : 2.01), now, 0.05);
    h.filter.Q.setTargetAtTime(mode === 2 ? 1.2 : 4 + level * 6, now, 0.05);
    h.lfo.frequency.setTargetAtTime(mode === 2 ? 23 : 5 + level * 14, now, 0.05);
  }
}
