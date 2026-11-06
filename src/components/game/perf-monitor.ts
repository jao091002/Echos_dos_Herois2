import * as THREE from 'three';

/*
 * Monitor de desempenho (painel de desenvolvedor, F3).
 * Mede por quadro: intervalo entre quadros (frame time real), tempo de CPU da simulação, tempo de CPU para
 * enviar o desenho (composer.render), tempo de GPU (quando o navegador expõe EXT_disjoint_timer_query_webgl2),
 * draw calls e triângulos somados de todas as passagens do pós-processamento, recursos vivos na GPU,
 * compilações de shader durante o jogo (causa clássica de engasgos) e quadros "travados" (hitches).
 */

const N = 600; // ~10 s de histórico a 60 FPS

export type PerfExtra = () => Record<string, number>;

export type PerfReport = {
  frames: number; fpsAvg: number; fpsLow1: number; frameMsAvg: number; frameMsP99: number; frameMsMax: number;
  cpuMsAvg: number; cpuMsP99: number; renderMsAvg: number; gpuMsAvg: number | null;
  calls: number; triangles: number; geometries: number; textures: number; programs: number;
  shaderCompiles: number; compiledNames: string[]; hitches: number; heapMB: number | null; extra: Record<string, number>;
};

export class PerfMonitor {
  private readonly frameMs = new Float32Array(N); private readonly cpuMs = new Float32Array(N); private readonly renderMs = new Float32Array(N);
  private readonly gpuMsBuf = new Float32Array(N); private gpuCount = 0;
  private i = 0; private count = 0; private median = 16; private total = 0;
  private last = 0; private t0 = 0; private tr = 0; private cpuNow = 0; private renderNow = 0;
  private calls = 0; private triangles = 0;
  private lastPrograms = -1;
  /** Programas de shader compilados desde o início da medição (fora o carregamento). */
  shaderCompiles = 0;
  /** Nomes dos programas compilados durante a medição (para achar quem causa engasgo). */
  compiledNames: string[] = [];
  private seenPrograms = new Set<unknown>();
  /** Quadros acima de 50 ms ou 2,5x a mediana. */
  hitches = 0;
  private extra: PerfExtra = () => ({});
  private panel: HTMLElement | null = null; private panelTick = 0;
  // consulta de tempo de GPU (WebGL2)
  private readonly gl: WebGL2RenderingContext | null; private readonly ext: { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null;
  private queries: WebGLQuery[] = []; private pending: WebGLQuery[] = []; private active: WebGLQuery | null = null;

  constructor(private readonly renderer: THREE.WebGLRenderer) {
    renderer.info.autoReset = false; // o composer chama render() várias vezes por quadro: somamos todas
    const ctx = renderer.getContext();
    this.gl = typeof WebGL2RenderingContext !== 'undefined' && ctx instanceof WebGL2RenderingContext ? ctx : null;
    this.ext = this.gl ? this.gl.getExtension('EXT_disjoint_timer_query_webgl2') : null;
  }

  setExtra(fn: PerfExtra) { this.extra = fn; }
  attachPanel(el: HTMLElement | null) { this.panel = el; }

  /** Início do quadro (logo após requestAnimationFrame). */
  begin() {
    const now = performance.now();
    if (this.last) this.push(now - this.last);
    this.last = now; this.t0 = now; this.renderNow = 0;
    this.renderer.info.reset();
  }

  /** Envolve a chamada de desenho para separar CPU de simulação e CPU de desenho. */
  render(draw: () => void) {
    this.tr = performance.now(); this.cpuNow = this.tr - this.t0;
    this.gpuBegin();
    draw();
    this.gpuEnd();
    this.renderNow = performance.now() - this.tr;
    this.calls = this.renderer.info.render.calls; this.triangles = this.renderer.info.render.triangles;
  }

  /** Fim do quadro. */
  end() {
    if (!this.renderNow) this.cpuNow = performance.now() - this.t0; // quadro sem desenho (menus)
    const k = (this.i + N - 1) % N; // os tempos de CPU entram no mesmo índice do último intervalo
    this.cpuMs[k] = this.cpuNow; this.renderMs[k] = this.renderNow;
    const programs = this.renderer.info.programs?.length ?? 0;
    if (programs !== this.lastPrograms) {
      if (this.lastPrograms >= 0 && programs > this.lastPrograms) this.shaderCompiles += programs - this.lastPrograms;
      for (const pr of this.renderer.info.programs ?? []) if (!this.seenPrograms.has(pr)) { this.seenPrograms.add(pr); if (this.lastPrograms >= 0) { const q = pr as unknown as { type: string; cacheKey: string }; this.compiledNames.push(`${q.type}:${q.cacheKey.split(",").slice(0, 2).join(",").slice(0, 40)}`); } }
      this.lastPrograms = programs;
    }
    this.gpuPoll();
    if (this.panel && ++this.panelTick % 15 === 0) this.drawPanel();
  }

  private push(ms: number) {
    this.frameMs[this.i] = ms; this.i = (this.i + 1) % N; this.count = Math.min(N, this.count + 1);
    if (++this.total % 60 === 30) this.median = this.percentile(this.frameMs, 0.5); // ordenar a cada quadro custaria CPU
    if (this.count > 30 && (ms > 50 || ms > this.median * 2.5)) this.hitches++;
  }

  private values(buf: Float32Array) { return Array.from(buf.subarray(0, this.count)); }
  private percentile(buf: Float32Array, p: number) {
    const v = this.values(buf).sort((a, b) => a - b); if (!v.length) return 0;
    return v[Math.min(v.length - 1, Math.floor(p * v.length))];
  }
  private mean(buf: Float32Array) { let s = 0; for (let j = 0; j < this.count; j++) s += buf[j]; return this.count ? s / this.count : 0; }

  /** Zera o histórico (início de um cenário de benchmark). */
  reset() {
    this.i = 0; this.count = 0; this.total = 0; this.last = 0; this.hitches = 0; this.shaderCompiles = 0; this.compiledNames = []; this.gpuCount = 0;
  }

  report(): PerfReport {
    const fm = this.mean(this.frameMs), info = this.renderer.info;
    const sorted = this.values(this.frameMs).sort((a, b) => b - a), worst = sorted.slice(0, Math.max(1, Math.floor(sorted.length * 0.01)));
    const low1 = worst.length ? 1000 / (worst.reduce((a, b) => a + b, 0) / worst.length) : 0;
    let gpu = 0; for (let j = 0; j < Math.min(this.gpuCount, N); j++) gpu += this.gpuMsBuf[j];
    const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    return {
      frames: this.count, fpsAvg: fm ? 1000 / fm : 0, fpsLow1: low1, frameMsAvg: fm, frameMsP99: this.percentile(this.frameMs, 0.99), frameMsMax: sorted[0] ?? 0,
      cpuMsAvg: this.mean(this.cpuMs), cpuMsP99: this.percentile(this.cpuMs, 0.99), renderMsAvg: this.mean(this.renderMs),
      gpuMsAvg: this.gpuCount ? gpu / Math.min(this.gpuCount, N) : null,
      calls: this.calls, triangles: this.triangles, geometries: info.memory.geometries, textures: info.memory.textures, programs: info.programs?.length ?? 0,
      shaderCompiles: this.shaderCompiles, compiledNames: this.compiledNames.slice(0, 40), hitches: this.hitches, heapMB: mem ? mem.usedJSHeapSize / 1048576 : null, extra: this.extra(),
    };
  }

  /* ---------------------------------------------------------- GPU timer */
  private gpuBegin() {
    const gl = this.gl, ext = this.ext; if (!gl || !ext || this.active) return;
    const q = this.queries.pop() ?? gl.createQuery(); if (!q) return;
    gl.beginQuery(ext.TIME_ELAPSED_EXT, q); this.active = q;
  }
  private gpuEnd() {
    const gl = this.gl, ext = this.ext; if (!gl || !ext || !this.active) return;
    gl.endQuery(ext.TIME_ELAPSED_EXT); this.pending.push(this.active); this.active = null;
  }
  private gpuPoll() {
    const gl = this.gl, ext = this.ext; if (!gl || !ext) return;
    const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
    while (this.pending.length) {
      const q = this.pending[0];
      if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
      this.pending.shift();
      if (!disjoint) { this.gpuMsBuf[this.gpuCount % N] = gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6; this.gpuCount++; }
      this.queries.push(q);
    }
  }

  private drawPanel() {
    const r = this.report(), f = (v: number, d = 1) => v.toFixed(d);
    const lines = [
      `FPS ${f(r.fpsAvg, 0)} · 1% low ${f(r.fpsLow1, 0)}`,
      `quadro ${f(r.frameMsAvg)} ms · p99 ${f(r.frameMsP99)} · máx ${f(r.frameMsMax)}`,
      `CPU sim ${f(r.cpuMsAvg)} ms (p99 ${f(r.cpuMsP99)}) · envio ${f(r.renderMsAvg)} ms`,
      `GPU ${r.gpuMsAvg === null ? 'n/d' : `${f(r.gpuMsAvg)} ms`}`,
      `draw calls ${r.calls} · triângulos ${(r.triangles / 1000).toFixed(0)}k`,
      `geometrias ${r.geometries} · texturas ${r.textures} · shaders ${r.programs}`,
      `compilações em jogo ${r.shaderCompiles} · engasgos ${r.hitches}`,
      r.heapMB === null ? '' : `heap JS ${f(r.heapMB, 0)} MB`,
      ...Object.entries(r.extra).map(([k, v]) => `${k} ${Math.round(v)}`),
    ].filter(Boolean);
    this.panel!.textContent = lines.join('\n');
  }

  dispose() {
    const gl = this.gl; if (gl) [...this.queries, ...this.pending].forEach(q => gl.deleteQuery(q));
    this.queries = []; this.pending = []; this.panel = null;
  }
}
