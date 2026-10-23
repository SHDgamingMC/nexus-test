/**
 * Retro OS Audio Synthesizer Engine
 * Pure Web Audio API - zero external audio dependencies
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.masterVolume = 0.3;
        this.isPlayingBgm = false;
        this.bgmTimer = null;
        this.currentTrack = 0;
        this.analyser = null;

        // Auto initialize on first user interaction
        this.initOnInteraction = () => {
            this.ensureAudioContext();
            window.removeEventListener('click', this.initOnInteraction);
            window.removeEventListener('keydown', this.initOnInteraction);
        };
        window.addEventListener('click', this.initOnInteraction);
        window.addEventListener('keydown', this.initOnInteraction);
    }

    ensureAudioContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
                
                this.analyser = this.ctx.createAnalyser();
                this.analyser.fftSize = 64;
                
                this.masterGain.connect(this.analyser);
                this.analyser.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(vol) {
        this.masterVolume = Math.max(0, Math.min(1, vol));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playTone(freq, type = 'square', duration = 0.1, delay = 0, vol = 0.2) {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const startTime = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
    }

    playNoise(duration = 0.1, delay = 0, vol = 0.15) {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + delay;
        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(startTime);
        noise.stop(startTime + duration + 0.05);
    }

    // Sound effects
    click() {
        this.playTone(800, 'triangle', 0.03, 0, 0.15);
    }

    beep() {
        this.playTone(440, 'square', 0.15, 0, 0.25);
    }

    error() {
        this.playTone(180, 'sawtooth', 0.15, 0, 0.3);
        this.playTone(130, 'sawtooth', 0.25, 0.12, 0.3);
    }

    openWindow() {
        this.playTone(320, 'square', 0.05, 0, 0.15);
        this.playTone(480, 'square', 0.05, 0.04, 0.15);
        this.playTone(640, 'triangle', 0.08, 0.08, 0.15);
    }

    closeWindow() {
        this.playTone(540, 'square', 0.04, 0, 0.12);
        this.playTone(380, 'square', 0.04, 0.04, 0.12);
        this.playTone(260, 'triangle', 0.06, 0.08, 0.12);
    }

    floppySeek() {
        // Authentic retro floppy stepped seek noise
        for (let i = 0; i < 5; i++) {
            this.playTone(150 + Math.random() * 80, 'sawtooth', 0.02, i * 0.04, 0.1);
            this.playNoise(0.015, i * 0.04 + 0.01, 0.08);
        }
    }

    startup() {
        // Iconic 90s style chord chime
        const notes = [
            { f: 261.63, d: 0.0, l: 0.8 }, // C4
            { f: 329.63, d: 0.15, l: 0.8 }, // E4
            { f: 392.00, d: 0.3, l: 0.9 }, // G4
            { f: 523.25, d: 0.45, l: 1.4 }, // C5
            { f: 659.25, d: 0.6, l: 1.5 }, // E5
            { f: 1046.50, d: 0.8, l: 1.8 } // C6 chime
        ];

        notes.forEach(n => {
            this.playTone(n.f, 'triangle', n.l, n.d, 0.22);
            this.playTone(n.f * 1.002, 'sine', n.l, n.d, 0.15);
        });
    }

    mineExplode() {
        this.playNoise(0.4, 0, 0.4);
        this.playTone(100, 'sawtooth', 0.4, 0, 0.3);
    }

    mineFlag() {
        this.playTone(600, 'square', 0.05, 0, 0.15);
        this.playTone(900, 'square', 0.07, 0.05, 0.15);
    }

    // Iconic 56k Dial-Up Modem Handshake procedural sound
    dialUpConnect(onConnected = null) {
        if (!this.enabled) {
            if (onConnected) onConnected();
            return;
        }
        this.ensureAudioContext();
        if (!this.ctx) {
            if (onConnected) onConnected();
            return;
        }

        // 1. Dial tone (350Hz + 440Hz standard North American dial tone)
        this.playTone(350, 'sine', 1.0, 0, 0.12);
        this.playTone(440, 'sine', 1.0, 0, 0.12);

        // 2. DTMF Rotary / Touch tone dialing beeps
        const touchTones = [
            [697, 1209], // 1
            [770, 1336], // 5
            [852, 1477], // 9
            [697, 1336], // 2
            [770, 1209], // 4
            [852, 1336], // 8
            [941, 1336]  // 0
        ];
        touchTones.forEach((pair, idx) => {
            const start = 1.1 + idx * 0.14;
            this.playTone(pair[0], 'sine', 0.09, start, 0.15);
            this.playTone(pair[1], 'sine', 0.09, start, 0.15);
        });

        // 3. Ringing tone (around 2.3s)
        this.playTone(440, 'sine', 1.2, 2.3, 0.1);
        this.playTone(480, 'sine', 1.2, 2.3, 0.1);

        // 4. Remote modem pickup & carrier answer tone (2100Hz CED tone)
        this.playTone(2100, 'sine', 1.4, 3.8, 0.18);

        // 5. Dual tone / modulation warble (V.8 BIS handshake)
        for (let i = 0; i < 8; i++) {
            const f1 = 1300 + (i % 2 === 0 ? 300 : -200);
            this.playTone(f1, 'sawtooth', 0.09, 5.3 + i * 0.1, 0.1);
        }

        // 6. The classic chaotic screech & white noise hiss negotiation
        this.playNoise(1.8, 6.2, 0.16);
        for (let j = 0; j < 12; j++) {
            const freq = 1200 + Math.sin(j) * 800;
            this.playTone(freq, 'sawtooth', 0.12, 6.2 + j * 0.14, 0.08);
        }

        // 7. Equalizer training whoosh & low scrambled rumble
        this.playNoise(1.2, 8.0, 0.12);
        this.playTone(600, 'triangle', 1.0, 8.0, 0.15);

        // 8. Final pleasant BONG of connection!
        setTimeout(() => {
            this.playTone(587.33, 'triangle', 0.4, 0, 0.2); // D5
            this.playTone(880.00, 'sine', 0.6, 0.15, 0.22); // A5
            if (onConnected) onConnected();
        }, 9200);
    }

    fanfare() {
        const arpeggio = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
        arpeggio.forEach((freq, idx) => {
            this.playTone(freq, 'square', 0.12, idx * 0.09, 0.2);
        });
    }

    /* ---- Retro Chiptune Music Tracker Engine ---- */
    tracks = [
        {
            title: "Bit Runner (8-bit Synthwave)",
            bpm: 135,
            lead: [
                60, 60, 67, 67, 69, 69, 67, 0,
                65, 65, 64, 64, 62, 62, 60, 0,
                67, 67, 65, 65, 64, 64, 62, 0,
                67, 67, 65, 65, 64, 64, 62, 0,
                60, 60, 67, 67, 69, 69, 67, 0,
                65, 65, 64, 64, 62, 62, 60, 0
            ],
            bass: [
                36, 36, 43, 43, 45, 45, 43, 43,
                41, 41, 40, 40, 38, 38, 36, 36
            ]
        },
        {
            title: "Cyber Dungeon (Chiptune RPG)",
            bpm: 120,
            lead: [
                57, 60, 64, 69, 67, 64, 60, 57,
                55, 59, 62, 67, 65, 62, 59, 55,
                53, 57, 60, 65, 64, 60, 57, 53,
                52, 55, 59, 64, 62, 59, 55, 52
            ],
            bass: [
                33, 0, 33, 0, 31, 0, 31, 0,
                29, 0, 29, 0, 28, 0, 28, 0
            ]
        },
        {
            title: "Neon Starlight (Space Cruiser)",
            bpm: 140,
            lead: [
                72, 71, 69, 67, 69, 71, 72, 0,
                76, 74, 72, 71, 72, 74, 76, 0,
                79, 77, 76, 74, 76, 77, 79, 0,
                81, 79, 77, 76, 74, 72, 71, 0
            ],
            bass: [
                48, 48, 55, 55, 52, 52, 55, 55,
                45, 45, 52, 52, 48, 48, 52, 52
            ]
        }
    ];

    midiToFreq(midi) {
        if (!midi) return 0;
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    startBgm(trackIdx = 0, onStepCallback = null) {
        this.stopBgm();
        this.ensureAudioContext();
        this.currentTrack = trackIdx % this.tracks.length;
        const track = this.tracks[this.currentTrack];
        this.isPlayingBgm = true;

        let step = 0;
        const stepTimeMs = (60 / track.bpm / 2) * 1000;

        const tick = () => {
            if (!this.isPlayingBgm) return;

            const leadNote = track.lead[step % track.lead.length];
            const bassNote = track.bass[step % track.bass.length];

            if (leadNote > 0) {
                const freq = this.midiToFreq(leadNote);
                this.playTone(freq, 'square', stepTimeMs / 1000 * 0.85, 0, 0.12);
                this.playTone(freq * 1.003, 'square', stepTimeMs / 1000 * 0.85, 0, 0.08); // Slight detune for fat 8-bit sound
            }

            if (bassNote > 0) {
                const bFreq = this.midiToFreq(bassNote);
                this.playTone(bFreq, 'triangle', stepTimeMs / 1000 * 0.9, 0, 0.2);
            }

            // 8-bit drum beat
            if (step % 4 === 0) {
                // Bass kick
                this.playTone(90, 'sine', 0.07, 0, 0.2);
            } else if (step % 4 === 2) {
                // Snare noise
                this.playNoise(0.04, 0, 0.12);
            } else {
                // Hi-hat
                this.playNoise(0.015, 0, 0.05);
            }

            if (onStepCallback) {
                onStepCallback(step, track);
            }

            step++;
            this.bgmTimer = setTimeout(tick, stepTimeMs);
        };

        tick();
    }

    stopBgm() {
        this.isPlayingBgm = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

// Global Sound Instance
window.retroSound = new SoundEngine();
