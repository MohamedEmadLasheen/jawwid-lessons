// Sound effects using Web Audio API - no external files needed

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

function ensureContext() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/** Play a cheerful "correct answer" sound (ascending chime + applause-like noise) */
export function playCorrectSound() {
  if (!audioCtx) return;
  ensureContext();

  // Ascending chime notes
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + i * 0.12);
    osc.stop(audioCtx.currentTime + i * 0.12 + 0.4);
  });

  // Sparkle/applause-like burst using noise
  const bufferSize = audioCtx.sampleRate * 0.5;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.08));
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseGain = audioCtx.createGain();
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(3000, audioCtx.currentTime);
  noiseGain.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.3);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(audioCtx.currentTime + 0.3);
  noise.stop(audioCtx.currentTime + 0.8);
}

/** Play a gentle "wrong answer" buzzer sound */
export function playWrongSound() {
  if (!audioCtx) return;
  ensureContext();

  // Low descending buzz
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);

  osc2.type = 'square';
  osc2.frequency.setValueAtTime(205, audioCtx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(98, audioCtx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);

  osc1.start(audioCtx.currentTime);
  osc2.start(audioCtx.currentTime);
  osc1.stop(audioCtx.currentTime + 0.35);
  osc2.stop(audioCtx.currentTime + 0.35);
}

/** Play a success fanfare for completing a section */
export function playSuccessSound() {
  if (!audioCtx) return;
  ensureContext();

  const melody = [
    { freq: 523.25, time: 0, dur: 0.15 },     // C5
    { freq: 659.25, time: 0.15, dur: 0.15 },   // E5
    { freq: 783.99, time: 0.3, dur: 0.15 },    // G5
    { freq: 1046.5, time: 0.45, dur: 0.3 },    // C6
    { freq: 783.99, time: 0.6, dur: 0.1 },     // G5
    { freq: 1046.5, time: 0.7, dur: 0.5 },     // C6 (held)
  ];

  melody.forEach(({ freq, time, dur }) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + time);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime + time);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + time + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + time);
    osc.stop(audioCtx.currentTime + time + dur);
  });
}