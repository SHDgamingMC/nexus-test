/**
 * Retro Minesweeper
 * Authentic 90s OS style with LED counters, smiley states, and audio cues.
 */

class RetroMinesweeper {
    constructor() {
        this.rows = 9;
        this.cols = 9;
        this.totalMines = 10;
        this.grid = [];
        this.gameOver = false;
        this.gameWon = false;
        this.started = false;
        this.flagsLeft = 10;
        this.timer = 0;
        this.timerInterval = null;

        this.gridEl = null;
        this.mineCountEl = null;
        this.timerEl = null;
        this.faceBtn = null;
    }

    init() {
        this.gridEl = document.getElementById('minesweeper-grid');
        this.mineCountEl = document.getElementById('minesweeper-mines-left');
        this.timerEl = document.getElementById('minesweeper-timer');
        this.faceBtn = document.getElementById('minesweeper-face-btn');

        if (!this.gridEl) return;

        if (this.faceBtn) {
            this.faceBtn.addEventListener('click', () => {
                window.retroSound.click();
                this.resetGame();
            });
        }

        this.resetGame();
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.timer = 0;
        this.started = false;
        this.gameOver = false;
        this.gameWon = false;
        this.flagsLeft = this.totalMines;

        this.updateLed(this.mineCountEl, this.flagsLeft);
        this.updateLed(this.timerEl, 0);
        this.setFace('normal');

        this.initGrid();
        this.renderGrid();
    }

    setFace(state) {
        if (!this.faceBtn) return;
        this.faceBtn.className = 'retro-face-btn retro-bevel-outset ' + state;
        const faceMap = {
            normal: '🙂',
            scared: '😮',
            dead: '😵',
            win: '😎'
        };
        this.faceBtn.textContent = faceMap[state] || '🙂';
    }

    updateLed(el, num) {
        if (!el) return;
        const clamped = Math.max(-99, Math.min(999, num));
        const formatted = clamped < 0 
            ? '-' + String(Math.abs(clamped)).padStart(2, '0')
            : String(clamped).padStart(3, '0');
        el.textContent = formatted;
    }

    initGrid() {
        this.grid = [];
        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push({
                    r, c,
                    mine: false,
                    revealed: false,
                    flagged: false,
                    count: 0
                });
            }
            this.grid.push(row);
        }
    }

    plantMines(safeR, safeC) {
        let planted = 0;
        while (planted < this.totalMines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);

            // Avoid planting on first clicked cell or already mined cell
            if ((r === safeR && c === safeC) || this.grid[r][c].mine) continue;

            this.grid[r][c].mine = true;
            planted++;
        }

        // Calculate neighbor numbers
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].mine) continue;
                let count = 0;
                this.forEachNeighbor(r, c, (nr, nc) => {
                    if (this.grid[nr][nc].mine) count++;
                });
                this.grid[r][c].count = count;
            }
        }
    }

    forEachNeighbor(r, c, cb) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    cb(nr, nc);
                }
            }
        }
    }

    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateLed(this.timerEl, this.timer);
            if (this.timer >= 999) clearInterval(this.timerInterval);
        }, 1000);
    }

    reveal(r, c) {
        if (this.gameOver || this.gameWon) return;
        const cell = this.grid[r][c];
        if (cell.revealed || cell.flagged) return;

        if (!this.started) {
            this.started = true;
            this.plantMines(r, c);
            this.startTimer();
        }

        cell.revealed = true;

        if (cell.mine) {
            this.triggerGameOver(cell);
            return;
        }

        window.retroSound.click();

        // If 0, cascade reveal neighbors
        if (cell.count === 0) {
            this.forEachNeighbor(r, c, (nr, nc) => {
                this.reveal(nr, nc);
            });
        }

        this.checkWinCondition();
        this.renderGrid();
    }

    toggleFlag(r, c) {
        if (this.gameOver || this.gameWon) return;
        const cell = this.grid[r][c];
        if (cell.revealed) return;

        window.retroSound.mineFlag();
        cell.flagged = !cell.flagged;
        this.flagsLeft += cell.flagged ? -1 : 1;
        this.updateLed(this.mineCountEl, this.flagsLeft);
        this.renderGrid();
    }

    triggerGameOver(explodedCell) {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        this.setFace('dead');
        window.retroSound.mineExplode();

        // Reveal all mines
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.grid[r][c];
                if (cell.mine) cell.revealed = true;
                if (!cell.mine && cell.flagged) cell.falseFlag = true;
            }
        }
        explodedCell.exploded = true;
        this.renderGrid();
    }

    checkWinCondition() {
        let unrevealedSafe = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.grid[r][c];
                if (!cell.mine && !cell.revealed) {
                    unrevealedSafe++;
                }
            }
        }

        if (unrevealedSafe === 0) {
            this.gameWon = true;
            clearInterval(this.timerInterval);
            this.setFace('win');
            this.flagsLeft = 0;
            this.updateLed(this.mineCountEl, 0);
            window.retroSound.fanfare();
        }
    }

    renderGrid() {
        if (!this.gridEl) return;
        this.gridEl.innerHTML = '';

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.grid[r][c];
                const btn = document.createElement('button');
                btn.className = 'mine-cell';

                if (!cell.revealed) {
                    btn.classList.add('retro-bevel-outset');
                    if (cell.flagged) {
                        btn.innerHTML = '🚩';
                    }
                } else {
                    btn.classList.add('retro-bevel-inset', 'revealed');
                    if (cell.mine) {
                        btn.innerHTML = '💣';
                        if (cell.exploded) btn.classList.add('exploded');
                    } else if (cell.count > 0) {
                        btn.textContent = cell.count;
                        btn.dataset.count = cell.count;
                    }
                }

                if (cell.falseFlag) {
                    btn.innerHTML = '❌';
                }

                btn.addEventListener('mousedown', (e) => {
                    if (e.button === 0 && !cell.revealed && !this.gameOver && !this.gameWon) {
                        this.setFace('scared');
                    }
                });

                btn.addEventListener('click', () => {
                    if (!this.gameOver && !this.gameWon) {
                        this.setFace('normal');
                    }
                    this.reveal(r, c);
                });

                btn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.toggleFlag(r, c);
                });

                this.gridEl.appendChild(btn);
            }
        }
    }
}

window.retroMinesweeper = new RetroMinesweeper();
