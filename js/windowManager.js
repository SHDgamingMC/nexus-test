/**
 * Retro OS Window Manager
 * Handles window dragging, resizing, focus, z-index, minimize, maximize, and taskbar sync.
 */

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.highestZIndex = 100;
        this.cascadeOffset = { x: 30, y: 30 };
        this.nextCascade = 0;
        this.desktopArea = null;
        this.taskbarApps = null;

        // Mouse drag state
        this.draggingWindow = null;
        this.dragOffset = { x: 0, y: 0 };

        // Mouse resize state
        this.resizingWindow = null;
        this.resizeEdge = null;
        this.initialRect = null;
        this.initialMouse = null;
    }

    init() {
        this.desktopArea = document.getElementById('desktop-area');
        this.taskbarApps = document.getElementById('taskbar-running-apps');

        this.initGlobalEvents();
        this.registerAllExistingWindows();
    }

    registerAllExistingWindows() {
        const windowEls = document.querySelectorAll('.retro-window');
        windowEls.forEach(winEl => {
            const id = winEl.id;
            const title = winEl.dataset.title || 'Application';
            const icon = winEl.dataset.icon || 'default';
            this.registerWindow(id, winEl, title, icon);
        });
    }

    registerWindow(id, el, title, icon) {
        const winData = {
            id,
            el,
            title,
            icon,
            isMinimized: false,
            isMaximized: false,
            prevRect: null,
            taskbarBtn: null
        };

        this.windows.set(id, winData);
        this.createTaskbarButton(winData);
        this.bindWindowControls(winData);

        // Header drag
        const header = el.querySelector('.window-titlebar');
        if (header) {
            header.addEventListener('mousedown', (e) => this.startDrag(e, winData));
            header.addEventListener('touchstart', (e) => this.startDrag(e, winData), { passive: false });
            header.addEventListener('dblclick', () => this.toggleMaximize(id));
        }

        // Focus on click inside window
        el.addEventListener('mousedown', () => this.bringToFront(id));
        el.addEventListener('touchstart', () => this.bringToFront(id), { passive: true });

        // Resize handles
        this.attachResizeHandles(winData);
    }

    createTaskbarButton(winData) {
        const btn = document.createElement('button');
        btn.className = 'taskbar-tab retro-bevel-outset';
        btn.id = `taskbar-tab-${winData.id}`;

        // Get emoji/icon from window titlebar if available
        const titleIconEl = winData.el.querySelector('.window-title-left span:first-child');
        const iconSymbol = titleIconEl ? titleIconEl.textContent : '🪟';

        btn.innerHTML = `<span>${iconSymbol}</span> <span class="tab-label">${winData.title}</span>`;
        
        btn.addEventListener('click', () => {
            window.retroSound.click();
            this.handleTaskbarTabClick(winData.id);
        });

        this.taskbarApps.appendChild(btn);
        winData.taskbarBtn = btn;
    }

    handleTaskbarTabClick(id) {
        const win = this.windows.get(id);
        if (!win) return;

        if (win.isMinimized) {
            this.restore(id);
        } else if (this.activeWindow === id) {
            this.minimize(id);
        } else {
            this.bringToFront(id);
        }
    }

    bindWindowControls(winData) {
        const closeBtn = winData.el.querySelector('.btn-close');
        const minBtn = winData.el.querySelector('.btn-minimize');
        const maxBtn = winData.el.querySelector('.btn-maximize');

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.retroSound.closeWindow();
                this.close(winData.id);
            });
        }

        if (minBtn) {
            minBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.retroSound.click();
                this.minimize(winData.id);
            });
        }

        if (maxBtn) {
            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.retroSound.click();
                this.toggleMaximize(winData.id);
            });
        }
    }

    open(id, initialData = null) {
        const win = this.windows.get(id);
        if (!win) return;

        window.retroSound.openWindow();

        win.el.style.display = 'flex';
        win.isMinimized = false;
        win.taskbarBtn.style.display = 'inline-flex';

        if (!win.hasOpenedOnce) {
            // Cascade placement
            const deskRect = this.desktopArea.getBoundingClientRect();
            const cascadeX = Math.min(deskRect.width - 400, 40 + (this.nextCascade * 26) % 240);
            const cascadeY = Math.min(deskRect.height - 300, 30 + (this.nextCascade * 24) % 180);
            this.nextCascade++;

            if (!win.el.style.left) win.el.style.left = `${cascadeX}px`;
            if (!win.el.style.top) win.el.style.top = `${cascadeY}px`;
            win.hasOpenedOnce = true;
        }

        this.bringToFront(id);

        // Fire custom window opened hook
        const event = new CustomEvent('retro:windowOpened', { detail: { id, initialData } });
        window.dispatchEvent(event);
    }

    close(id) {
        const win = this.windows.get(id);
        if (!win) return;

        win.el.style.display = 'none';
        win.taskbarBtn.style.display = 'none';
        win.taskbarBtn.classList.remove('active');

        if (this.activeWindow === id) {
            this.activeWindow = null;
            // Activate the top-most visible window
            let topWin = null;
            let topZ = -1;
            this.windows.forEach(w => {
                if (w.el.style.display !== 'none' && !w.isMinimized) {
                    const z = parseInt(w.el.style.zIndex || 0, 10);
                    if (z > topZ) {
                        topZ = z;
                        topWin = w.id;
                    }
                }
            });
            if (topWin) this.bringToFront(topWin);
        }

        const event = new CustomEvent('retro:windowClosed', { detail: { id } });
        window.dispatchEvent(event);
    }

    minimize(id) {
        const win = this.windows.get(id);
        if (!win) return;

        win.isMinimized = true;
        win.el.style.display = 'none';
        win.taskbarBtn.classList.remove('active');

        if (this.activeWindow === id) {
            this.activeWindow = null;
        }
    }

    restore(id) {
        const win = this.windows.get(id);
        if (!win) return;

        win.isMinimized = false;
        win.el.style.display = 'flex';
        this.bringToFront(id);
    }

    toggleMaximize(id) {
        const win = this.windows.get(id);
        if (!win) return;

        if (win.isMaximized) {
            // Restore original dimensions
            win.el.classList.remove('maximized');
            if (win.prevRect) {
                win.el.style.left = win.prevRect.left;
                win.el.style.top = win.prevRect.top;
                win.el.style.width = win.prevRect.width;
                win.el.style.height = win.prevRect.height;
            }
            win.isMaximized = false;
            const maxBtn = win.el.querySelector('.btn-maximize');
            if (maxBtn) maxBtn.title = "Maximize";
        } else {
            // Maximize
            win.prevRect = {
                left: win.el.style.left,
                top: win.el.style.top,
                width: win.el.style.width,
                height: win.el.style.height
            };
            win.el.classList.add('maximized');
            win.isMaximized = true;
            const maxBtn = win.el.querySelector('.btn-maximize');
            if (maxBtn) maxBtn.title = "Restore";
        }
        this.bringToFront(id);
    }

    bringToFront(id) {
        const win = this.windows.get(id);
        if (!win) return;

        this.highestZIndex += 2;
        win.el.style.zIndex = this.highestZIndex;

        // Highlight titlebar and taskbar button
        this.windows.forEach(w => {
            w.el.classList.remove('active-window');
            w.taskbarBtn.classList.remove('active');
        });

        win.el.classList.add('active-window');
        win.taskbarBtn.classList.add('active');
        this.activeWindow = id;
    }

    startDrag(e, winData) {
        if (winData.isMaximized) return;
        if (e.target.closest('.titlebar-buttons')) return;

        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        this.draggingWindow = winData;
        const rect = winData.el.getBoundingClientRect();
        this.dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };

        this.bringToFront(winData.id);
        e.preventDefault();
    }

    attachResizeHandles(winData) {
        const handle = document.createElement('div');
        handle.className = 'window-resize-handle';
        winData.el.appendChild(handle);

        handle.addEventListener('mousedown', (e) => {
            if (winData.isMaximized) return;
            e.stopPropagation();
            e.preventDefault();
            this.resizingWindow = winData;
            this.initialRect = winData.el.getBoundingClientRect();
            this.initialMouse = { x: e.clientX, y: e.clientY };
            this.bringToFront(winData.id);
        });
    }

    initGlobalEvents() {
        const onMove = (e) => {
            const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

            // Handle Dragging
            if (this.draggingWindow) {
                const deskRect = this.desktopArea.getBoundingClientRect();
                let x = clientX - this.dragOffset.x - deskRect.left;
                let y = clientY - this.dragOffset.y - deskRect.top;

                // Restrict boundaries
                const winW = this.draggingWindow.el.offsetWidth;
                x = Math.max(-winW + 100, Math.min(deskRect.width - 60, x));
                y = Math.max(0, Math.min(deskRect.height - 40, y));

                this.draggingWindow.el.style.left = `${x}px`;
                this.draggingWindow.el.style.top = `${y}px`;
            }

            // Handle Resizing
            if (this.resizingWindow) {
                const dx = clientX - this.initialMouse.x;
                const dy = clientY - this.initialMouse.y;

                const minW = 280;
                const minH = 180;
                const newW = Math.max(minW, this.initialRect.width + dx);
                const newH = Math.max(minH, this.initialRect.height + dy);

                this.resizingWindow.el.style.width = `${newW}px`;
                this.resizingWindow.el.style.height = `${newH}px`;
            }
        };

        const onUp = () => {
            this.draggingWindow = null;
            this.resizingWindow = null;
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);
    }
}

window.windowManager = new WindowManager();
