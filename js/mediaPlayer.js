/**
 * Retro Chiptune Media Player
 * Plays procedurally synthesized 8-bit tracks with real-time frequency visualizer
 */

class RetroMediaPlayer {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.canvas = null;
        this.ctx = null;
        this.animFrame = null;
        this.trackNameEl = null;
        this.timeDisplayEl = null;
        this.trackListEl = null;
        this.elapsedSeconds = 0;
        this.timerInterval = null;
    }

    init() {
        this.canvas = document.getElementById('player-visualizer');
        this.trackNameEl = document.getElementById('player-track-name');
        this.timeDisplayEl = document.getElementById('player-time');
        this.trackListEl = document.getElementById('player-tracklist');

        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }

        const btnPlay = document.getElementById('player-btn-play');
        const btnStop = document.getElementById('player-btn-stop');
        const btnPrev = document.getElementById('player-btn-prev');
        const btnNext = document.getElementById('player-btn-next');
        const volSlider = document.getElementById('player-volume');

        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                window.retroSound.click();
                this.togglePlay();
            });
        }

        if (btnStop) {
            btnStop.addEventListener('click', () => {
                window.retroSound.click();
                this.stop();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                window.retroSound.click();
                this.prevTrack();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                window.retroSound.click();
                this.nextTrack();
            });
        }

        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                window.retroSound.setVolume(vol);
            });
        }

        this.renderTrackList();
        this.updateDisplay();
    }

    renderTrackList() {
        if (!this.trackListEl) return;
        this.trackListEl.innerHTML = '';

        window.retroSound.tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'player-track-item';
            if (index === this.currentTrackIndex) item.classList.add('selected');
            item.innerHTML = `<span>${index + 1}. ${track.title}</span> <span class="track-bpm">${track.bpm} BPM</span>`;

            item.addEventListener('click', () => {
                window.retroSound.click();
                this.currentTrackIndex = index;
                this.renderTrackList();
                this.updateDisplay();
                if (this.isPlaying) {
                    this.play();
                }
            });

            this.trackListEl.appendChild(item);
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        const playBtn = document.getElementById('player-btn-play');
        if (playBtn) playBtn.textContent = '⏸ Pause';

        window.retroSound.startBgm(this.currentTrackIndex, (step, track) => {
            // Step callback if needed
        });

        this.startTimer();
        this.startVisualizer();
        this.updateDisplay();
        this.renderTrackList();
    }

    pause() {
        this.isPlaying = false;
        const playBtn = document.getElementById('player-btn-play');
        if (playBtn) playBtn.textContent = '▶ Play';

        window.retroSound.stopBgm();
        clearInterval(this.timerInterval);
    }

    stop() {
        this.isPlaying = false;
        const playBtn = document.getElementById('player-btn-play');
        if (playBtn) playBtn.textContent = '▶ Play';

        window.retroSound.stopBgm();
        clearInterval(this.timerInterval);
        this.elapsedSeconds = 0;
        this.updateTimeDisplay();
        this.clearVisualizer();
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % window.retroSound.tracks.length;
        this.elapsedSeconds = 0;
        this.renderTrackList();
        this.updateDisplay();
        if (this.isPlaying) this.play();
    }

    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + window.retroSound.tracks.length) % window.retroSound.tracks.length;
        this.elapsedSeconds = 0;
        this.renderTrackList();
        this.updateDisplay();
        if (this.isPlaying) this.play();
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.isPlaying) {
                this.elapsedSeconds++;
                this.updateTimeDisplay();
            }
        }, 1000);
    }

    updateTimeDisplay() {
        if (!this.timeDisplayEl) return;
        const m = Math.floor(this.elapsedSeconds / 60);
        const s = this.elapsedSeconds % 60;
        this.timeDisplayEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    updateDisplay() {
        const track = window.retroSound.tracks[this.currentTrackIndex];
        if (this.trackNameEl && track) {
            this.trackNameEl.textContent = `${this.currentTrackIndex + 1}. ${track.title}`;
        }
    }

    startVisualizer() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);

        const draw = () => {
            if (!this.isPlaying) return;

            if (this.ctx && this.canvas && window.retroSound.analyser) {
                const w = this.canvas.width;
                const h = this.canvas.height;
                const bufferLength = window.retroSound.analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                window.retroSound.analyser.getByteFrequencyData(dataArray);

                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(0, 0, w, h);

                const numBars = 16;
                const barWidth = Math.floor(w / numBars) - 2;

                for (let i = 0; i < numBars; i++) {
                    const val = dataArray[i * 2] || 0;
                    const percent = val / 255;
                    const barHeight = Math.max(3, percent * (h - 6));

                    // Retro color gradient: green to yellow to red
                    let col = '#00ff00';
                    if (percent > 0.7) col = '#ff3333';
                    else if (percent > 0.4) col = '#ffff00';

                    this.ctx.fillStyle = col;
                    this.ctx.fillRect(i * (barWidth + 2) + 1, h - barHeight - 2, barWidth, barHeight);

                    // Peak line
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.fillRect(i * (barWidth + 2) + 1, h - barHeight - 4, barWidth, 1);
                }
            }

            this.animFrame = requestAnimationFrame(draw);
        };

        draw();
    }

    clearVisualizer() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.retroMediaPlayer = new RetroMediaPlayer();
