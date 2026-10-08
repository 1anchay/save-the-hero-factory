/**
 * Save the Hero Factory — original procedural adventure score and SFX.
 *
 * All notes, arrangement, synthesized timbres and effects are authored in
 * this repository. No third-party samples, downloaded songs or APIs used.
 * Deterministic: identical WAV output on each build.
 *
 * Distribution: project creators may use/modify/export this composition in
 * their own videos, without attribution. This cannot guarantee automated
 * platform copyright filters never produce false positives.
 */
import fs from 'node:fs';
import path from 'node:path';

const RATE = 44100;
const TAU = Math.PI * 2;
const BARS = 12;
const BEAT = .5; // 120 BPM, 4/4
const MUSIC_DURATION = BARS * 4 * BEAT;

function rng(seed = 0x51f9b2a) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}
const random = rng();
const pitch = note => 440 * Math.pow(2, (note - 69) / 12);
const fade = (age, attack, decay) => (1 - Math.exp(-age / attack)) * Math.exp(-age / decay);
function buffer(seconds) { return new Float32Array(Math.ceil(seconds * RATE)); }

function addNote(dest, start, duration, midi, gain, kind = 'pluck') {
  const begin = Math.round(start * RATE);
  const count = Math.min(Math.ceil(duration * RATE), dest.length - begin);
  const frequency = pitch(midi);
  if (begin < 0 || count <= 0) return;
  for (let n = 0; n < count; n++) {
    const t = n / RATE;
    const phase = TAU * frequency * t;
    let v = 0;
    let env = 0;
    if (kind === 'bell') {
      v = Math.sin(phase) + .32 * Math.sin(2.003 * phase) + .12 * Math.sin(4.17 * phase);
      env = fade(t, .008, .23);
    } else if (kind === 'bass') {
      v = Math.sin(phase) + .28 * Math.sin(2 * phase);
      env = fade(t, .012, .42);
    } else if (kind === 'pad') {
      v = .7 * Math.sin(phase) + .21 * Math.sin(2 * phase) + .08 * Math.sin(3 * phase);
      env = Math.min(1, t / .28) * Math.min(1, (duration - t) / .3);
    } else { // warm muted marimba
      v = Math.sin(phase) + .2 * Math.sin(2.01 * phase) + .05 * Math.sin(3.1 * phase);
      env = fade(t, .006, .24);
    }
    dest[begin + n] += v * env * gain;
  }
}

function addSoftKick(dest, start, gain = .13) {
  const begin = Math.round(start * RATE);
  const count = Math.min(Math.round(.25 * RATE), dest.length - begin);
  let phase = 0;
  for (let n = 0; n < count; n++) {
    const t = n / RATE;
    phase += TAU * (66 + 105 * Math.exp(-t * 28)) / RATE;
    dest[begin + n] += Math.sin(phase) * Math.exp(-t * 21) * gain;
  }
}

function addBrush(dest, start, gain = .038) {
  const begin = Math.round(start * RATE);
  const count = Math.min(Math.round(.072 * RATE), dest.length - begin);
  let low = 0;
  for (let n = 0; n < count; n++) {
    const t = n / RATE;
    const v = random() * 2 - 1;
    low += .04 * (v - low);
    dest[begin + n] += (v - low) * Math.exp(-t * 54) * gain;
  }
}

function normalizeAndWav(dest, outfile, options = {}) {
  const peak = dest.reduce((a, v) => Math.max(a, Math.abs(v)), .0001);
  const gain = Math.min(options.target ?? .74, (options.maxPeak ?? .82) / peak);
  const fadeEdges = options.fadeEdges ?? .07;
  const wave = Buffer.alloc(44 + dest.length * 2);
  wave.write('RIFF',0); wave.writeUInt32LE(wave.length-8,4);
  wave.write('WAVEfmt ',8); wave.writeUInt32LE(16,16);
  wave.writeUInt16LE(1,20); wave.writeUInt16LE(1,22); // PCM mono
  wave.writeUInt32LE(RATE,24); wave.writeUInt32LE(RATE*2,28);
  wave.writeUInt16LE(2,32); wave.writeUInt16LE(16,34);
  wave.write('data',36); wave.writeUInt32LE(dest.length*2,40);
  for (let i = 0; i < dest.length; i++) {
    const fadeIn = Math.min(1, i / (RATE * fadeEdges));
    const fadeOut = Math.min(1, (dest.length - i) / (RATE * fadeEdges));
    const v = Math.max(-1, Math.min(1, dest[i] * gain * fadeIn * fadeOut));
    wave.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(outfile), {recursive: true});
  fs.writeFileSync(outfile, wave);
  console.log('Original synthesized audio:', outfile, (wave.length / 1024 / 1024).toFixed(2), 'MiB');
}

const out = path.resolve('assets');
const score = buffer(MUSIC_DURATION);
const chords = [
  {root: 45, notes: [57, 60, 64, 67]}, // Am7
  {root: 41, notes: [53, 57, 60, 64]}, // Fmaj7
  {root: 48, notes: [60, 64, 67, 71]}, // Cmaj7
  {root: 43, notes: [55, 59, 62, 67]}, // G
  {root: 41, notes: [53, 57, 60, 64]},
  {root: 43, notes: [55, 59, 62, 65]},
];
// Original two-part playful melodic movement, deliberately not taken from any song.
const patterns = [
  [0, 2, 1, 3, 2, 1, 0, 2],
  [1, 0, 2, 1, 3, 2, 0, 1],
  [2, 0, 1, 3, 1, 2, 0, 3],
  [1, 2, 3, 1, 2, 0, 1, 2],
];
for (let bar = 0; bar < BARS; bar++) {
  const start = bar * 4 * BEAT;
  const chord = chords[bar % chords.length];
  for (const note of chord.notes) addNote(score, start, 1.85, note, .028, 'pad');
  for (let beat = 0; beat < 4; beat++) {
    addNote(score, start + beat * BEAT, .47, chord.root, .1, 'bass');
    addSoftKick(score, start + beat * BEAT, beat === 0 ? .125 : .085);
    addBrush(score, start + beat * BEAT + .25, .023);
  }
  const pattern = patterns[bar % patterns.length];
  pattern.forEach((idx, step) => {
    const t = start + step * .25;
    const top = chord.notes[idx] + (step === 7 ? 0 : 12);
    addNote(score, t, .28, top, step % 2 ? .075 : .1, step === 7 ? 'bell' : 'pluck');
  });
}
normalizeAndWav(score, path.join(out,'music/original-hero-adventure.wav'), {target:.88, maxPeak:.78});

const tick = buffer(.2);
addNote(tick, 0, .15, 88, .38, 'bell');
normalizeAndWav(tick, path.join(out,'sfx/original-tick.wav'),{target:1,maxPeak:.76,fadeEdges:.005});

const rescue = buffer(1.15);
[72,76,79,84,88].forEach((note,i)=>addNote(rescue,i*.13,.57,note,.24,'bell'));
normalizeAndWav(rescue,path.join(out,'sfx/original-rescue.wav'),{target:1,maxPeak:.77,fadeEdges:.01});

const crack = buffer(.6);
for (let i=0;i<crack.length;i++) {
  const t=i/RATE;
  if (t<.4) crack[i]+=(random()*2-1)*.24*Math.exp(-t*10)*(0.45+0.55*Math.sin(TAU*t*45)**2);
}
normalizeAndWav(crack,path.join(out,'sfx/original-bridge-crack.wav'),{target:1,maxPeak:.72,fadeEdges:.01});
