export class AmbientAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;

  start() {
    if (typeof window === 'undefined') return;
    if (!this.context) {
      const AudioContextConstructor = window.AudioContext;
      if (!AudioContextConstructor) return;
      this.context = new AudioContextConstructor();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : .12;
      const filter = this.context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 520; filter.Q.value = .55;
      const length = this.context.sampleRate * 5;
      const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const channel = buffer.getChannelData(0);
      let brown = 0;
      for (let i = 0; i < length; i++) {
        brown = (brown + .018 * (Math.random() * 2 - 1)) / 1.018;
        channel[i] = brown * 3.1;
      }
      const wind = this.context.createBufferSource(); wind.buffer = buffer; wind.loop = true;
      wind.connect(filter).connect(this.master).connect(this.context.destination); wind.start();
    }
    void this.context.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.context) this.master.gain.setTargetAtTime(muted ? 0 : .12, this.context.currentTime, .18);
    if (!muted) this.start();
  }

  playCast() {
    this.start();
    if (!this.context || this.muted) return;
    const now = this.context.currentTime;
    const tone = this.context.createOscillator(); tone.type = 'sine'; tone.frequency.setValueAtTime(660, now); tone.frequency.exponentialRampToValueAtTime(220, now + .24);
    const envelope = this.context.createGain(); envelope.gain.setValueAtTime(.0001, now); envelope.gain.exponentialRampToValueAtTime(.14, now + .025); envelope.gain.exponentialRampToValueAtTime(.0001, now + .34);
    tone.connect(envelope).connect(this.context.destination); tone.start(now); tone.stop(now + .36);
  }

  dispose() {
    if (this.context && this.context.state !== 'closed') void this.context.close();
    this.context = null; this.master = null;
  }
}
