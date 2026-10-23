/**
 * Retro Pixel Paint Program
 * 16x16 / 24x24 / 32x32 Canvas with retro tools, color palette, and PNG export
 */

class RetroPaint {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 24;
        this.currentTool = 'pencil'; // pencil, eraser, bucket, dropper
        this.currentColor = '#000000';
        this.isDrawing = false;
        this.showGrid = true;
        this.pixels = [];
        this.history = [];

        this.palette = [
            '#000000', '#ffffff', '#7e2553', '#008751',
            '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8',
            '#ff004d', '#ffa300', '#ffec27', '#00e436',
            '#29adff', '#83769c', '#ff77a8', '#ffccaa'
        ];
    }

    init() {
        this.canvas = document.getElementById('paint-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.resetGrid(this.gridSize);
        this.loadSampleDoodle('pizza');
        this.initPalette();
        this.initTools();
        this.initCanvasEvents();
        this.render();
    }

    loadSampleDoodle(type = 'pizza') {
        this.pixels = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill('#ffffff'));

        if (type === 'pizza') {
            // Draw a cozy, delicious 24x24 pixel art pizza slice
            const crust = '#ab5236';
            const cheese = '#ffec27';
            const pep = '#ff004d';
            const outline = '#000000';

            // Crust top
            for (let x = 6; x <= 18; x++) {
                this.pixels[4][x] = outline;
                this.pixels[5][x] = crust;
                this.pixels[6][x] = crust;
            }
            this.pixels[4][5] = outline;
            this.pixels[4][19] = outline;

            // Cheese body
            for (let y = 7; y <= 19; y++) {
                const spread = Math.floor((19 - y) * 0.6);
                const left = 12 - spread;
                const right = 12 + spread;
                for (let x = left; x <= right; x++) {
                    this.pixels[y][x] = cheese;
                }
                this.pixels[y][left - 1] = outline;
                this.pixels[y][right + 1] = outline;
            }
            this.pixels[20][12] = outline;

            // Pepperonis
            const pepCoords = [
                [8, 10], [8, 11], [9, 10], [9, 11],
                [8, 14], [8, 15], [9, 14], [9, 15],
                [12, 11], [12, 12], [13, 11], [13, 12],
                [15, 12], [15, 13], [16, 12], [16, 13]
            ];
            pepCoords.forEach(([py, px]) => {
                if (this.pixels[py] && this.pixels[py][px]) {
                    this.pixels[py][px] = pep;
                }
            });
        }
        this.render();
    }

    resetGrid(size) {
        this.gridSize = size;
        this.pixels = Array(size).fill(null).map(() => Array(size).fill('#ffffff'));
        this.history = [];
        this.render();
    }

    initPalette() {
        const palContainer = document.getElementById('paint-palette');
        if (!palContainer) return;

        palContainer.innerHTML = '';
        this.palette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'paint-swatch retro-bevel-inset';
            swatch.style.backgroundColor = color;
            if (color === this.currentColor) swatch.classList.add('selected');

            swatch.addEventListener('click', () => {
                window.retroSound.click();
                this.currentColor = color;
                document.querySelectorAll('.paint-swatch').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                const curColPreview = document.getElementById('paint-cur-color');
                if (curColPreview) curColPreview.style.backgroundColor = color;
            });

            palContainer.appendChild(swatch);
        });
    }

    initTools() {
        const toolBtns = document.querySelectorAll('[data-paint-tool]');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.retroSound.click();
                toolBtns.forEach(b => b.classList.remove('active-tool'));
                btn.classList.add('active-tool');
                this.currentTool = btn.dataset.paintTool;
            });
        });

        // Grid toggle
        const gridBtn = document.getElementById('paint-toggle-grid');
        if (gridBtn) {
            gridBtn.addEventListener('click', () => {
                window.retroSound.click();
                this.showGrid = !this.showGrid;
                gridBtn.classList.toggle('active-tool', this.showGrid);
                this.render();
            });
        }

        // Clear button
        const clearBtn = document.getElementById('paint-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                window.retroSound.click();
                this.saveHistory();
                this.pixels = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill('#ffffff'));
                this.render();
            });
        }

        // Size selector
        const sizeSelect = document.getElementById('paint-size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', (e) => {
                window.retroSound.click();
                this.resetGrid(parseInt(e.target.value, 10));
            });
        }

        // Undo button
        const undoBtn = document.getElementById('paint-undo-btn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                if (this.history.length > 0) {
                    window.retroSound.click();
                    this.pixels = this.history.pop();
                    this.render();
                }
            });
        }

        // Save / Export button
        const exportBtn = document.getElementById('paint-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                window.retroSound.floppySeek();
                this.exportPNG();
            });
        }
    }

    saveHistory() {
        if (this.history.length > 20) this.history.shift();
        this.history.push(this.pixels.map(row => [...row]));
    }

    initCanvasEvents() {
        const getGridCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const x = Math.floor(((clientX - rect.left) * scaleX) / (this.canvas.width / this.gridSize));
            const y = Math.floor(((clientY - rect.top) * scaleY) / (this.canvas.height / this.gridSize));

            return { x: Math.max(0, Math.min(this.gridSize - 1, x)), y: Math.max(0, Math.min(this.gridSize - 1, y)) };
        };

        const onStart = (e) => {
            e.preventDefault();
            this.saveHistory();
            this.isDrawing = true;
            const coords = getGridCoords(e);
            this.useTool(coords.x, coords.y);
        };

        const onMove = (e) => {
            if (!this.isDrawing) return;
            e.preventDefault();
            const coords = getGridCoords(e);
            this.useTool(coords.x, coords.y);
        };

        const onEnd = () => {
            this.isDrawing = false;
        };

        this.canvas.addEventListener('mousedown', onStart);
        this.canvas.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        this.canvas.addEventListener('touchstart', onStart, { passive: false });
        this.canvas.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
    }

    useTool(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;

        if (this.currentTool === 'pencil') {
            this.pixels[y][x] = this.currentColor;
            this.render();
        } else if (this.currentTool === 'eraser') {
            this.pixels[y][x] = '#ffffff';
            this.render();
        } else if (this.currentTool === 'dropper') {
            const picked = this.pixels[y][x];
            this.currentColor = picked;
            const curColPreview = document.getElementById('paint-cur-color');
            if (curColPreview) curColPreview.style.backgroundColor = picked;
        } else if (this.currentTool === 'bucket') {
            this.floodFill(x, y, this.pixels[y][x], this.currentColor);
            this.render();
        }
    }

    floodFill(startX, startY, targetColor, replaceColor) {
        if (targetColor === replaceColor) return;
        const queue = [[startX, startY]];
        const visited = new Set();

        while (queue.length > 0) {
            const [cx, cy] = queue.pop();
            const key = `${cx},${cy}`;
            if (visited.has(key)) continue;
            visited.add(key);

            if (cx < 0 || cx >= this.gridSize || cy < 0 || cy >= this.gridSize) continue;
            if (this.pixels[cy][cx] !== targetColor) continue;

            this.pixels[cy][cx] = replaceColor;

            queue.push([cx + 1, cy]);
            queue.push([cx - 1, cy]);
            queue.push([cx, cy + 1]);
            queue.push([cx, cy - 1]);
        }
    }

    render() {
        if (!this.ctx || !this.canvas) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const cellW = w / this.gridSize;
        const cellH = h / this.gridSize;

        this.ctx.clearRect(0, 0, w, h);

        // Draw Pixels
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                this.ctx.fillStyle = this.pixels[y][x];
                this.ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
            }
        }

        // Draw Grid Lines
        if (this.showGrid) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
            this.ctx.lineWidth = 1;

            for (let i = 0; i <= this.gridSize; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * cellW, 0);
                this.ctx.lineTo(i * cellW, h);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(0, i * cellH);
                this.ctx.lineTo(w, i * cellH);
                this.ctx.stroke();
            }
        }
    }

    exportPNG() {
        // Render crisp scaled export canvas
        const exportCanvas = document.createElement('canvas');
        const exportSize = 256;
        exportCanvas.width = exportSize;
        exportCanvas.height = exportSize;
        const eCtx = exportCanvas.getContext('2d');
        eCtx.imageSmoothingEnabled = false;

        const cell = exportSize / this.gridSize;
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                eCtx.fillStyle = this.pixels[y][x];
                eCtx.fillRect(x * cell, y * cell, cell, cell);
            }
        }

        const link = document.createElement('a');
        link.download = `pixel_art_${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    }
}

window.retroPaint = new RetroPaint();
