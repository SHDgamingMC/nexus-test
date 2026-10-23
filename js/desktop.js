/**
 * Retro Desktop Manager
 * Handles desktop icons, selection, dragging, and desktop context menu.
 */

class RetroDesktop {
    constructor() {
        this.desktopArea = null;
        this.contextMenu = null;
        this.selectedIcon = null;
        this.draggedIcon = null;
        this.dragOffset = { x: 0, y: 0 };
    }

    init() {
        this.desktopArea = document.getElementById('desktop-area');
        this.contextMenu = document.getElementById('desktop-context-menu');

        this.initIcons();
        this.initStickyNote();
        this.initContextMenu();

        // Deselect on desktop click
        this.desktopArea.addEventListener('click', (e) => {
            if (e.target === this.desktopArea) {
                this.clearSelection();
                this.hideContextMenu();
            }
        });
    }

    initStickyNote() {
        const note = document.getElementById('desktop-sticky-note');
        if (!note) return;

        let isDraggingNote = false;
        let noteOffset = { x: 0, y: 0 };

        note.addEventListener('mousedown', (e) => {
            // Only drag when clicking the header, pin, or background, not when editing text
            if (e.target.closest('.sticky-body') && document.activeElement === e.target) return;
            if (e.button !== 0) return;

            isDraggingNote = true;
            const rect = note.getBoundingClientRect();
            const deskRect = this.desktopArea.getBoundingClientRect();
            noteOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            note.style.zIndex = '99';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingNote) return;
            const deskRect = this.desktopArea.getBoundingClientRect();
            let x = e.clientX - deskRect.left - noteOffset.x;
            let y = e.clientY - deskRect.top - noteOffset.y;

            x = Math.max(10, Math.min(deskRect.width - note.offsetWidth - 10, x));
            y = Math.max(10, Math.min(deskRect.height - note.offsetHeight - 10, y));

            note.style.left = `${x}px`;
            note.style.top = `${y}px`;
            note.style.right = 'auto';
        });

        window.addEventListener('mouseup', () => {
            if (isDraggingNote) {
                isDraggingNote = false;
                note.style.zIndex = '10';
            }
        });
    }

    initIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            // Select on click
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                window.retroSound.click();
                this.selectIcon(icon);
                this.hideContextMenu();
            });

            // Launch on double click
            icon.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const targetWin = icon.dataset.window;
                if (targetWin && window.windowManager) {
                    window.windowManager.open(targetWin);
                }
            });

            // Touch support for double-tap or tap
            let lastTap = 0;
            icon.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 400 && tapLength > 0) {
                    e.preventDefault();
                    const targetWin = icon.dataset.window;
                    if (targetWin && window.windowManager) {
                        window.windowManager.open(targetWin);
                    }
                } else {
                    this.selectIcon(icon);
                }
                lastTap = currentTime;
            });

            // Icon Dragging
            icon.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                this.draggedIcon = icon;
                const rect = icon.getBoundingClientRect();
                const deskRect = this.desktopArea.getBoundingClientRect();
                this.dragOffset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            });
        });

        // Global mouse move for icon dragging
        window.addEventListener('mousemove', (e) => {
            if (this.draggedIcon) {
                const deskRect = this.desktopArea.getBoundingClientRect();
                let x = e.clientX - deskRect.left - this.dragOffset.x;
                let y = e.clientY - deskRect.top - this.dragOffset.y;

                x = Math.max(10, Math.min(deskRect.width - 80, x));
                y = Math.max(10, Math.min(deskRect.height - 90, y));

                this.draggedIcon.style.left = `${x}px`;
                this.draggedIcon.style.top = `${y}px`;
                this.draggedIcon.style.position = 'absolute';
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.draggedIcon) {
                // Snap to 75px grid
                const snapX = Math.round(parseInt(this.draggedIcon.style.left, 10) / 75) * 75;
                const snapY = Math.round(parseInt(this.draggedIcon.style.top, 10) / 85) * 85;
                this.draggedIcon.style.left = `${Math.max(10, snapX)}px`;
                this.draggedIcon.style.top = `${Math.max(10, snapY)}px`;
                this.draggedIcon = null;
            }
        });
    }

    selectIcon(icon) {
        this.clearSelection();
        this.selectedIcon = icon;
        icon.classList.add('selected');
    }

    clearSelection() {
        if (this.selectedIcon) {
            this.selectedIcon.classList.remove('selected');
            this.selectedIcon = null;
        }
    }

    initContextMenu() {
        this.desktopArea.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        window.addEventListener('click', (e) => {
            if (!this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });

        // Context menu items
        const menuItems = this.contextMenu.querySelectorAll('.ctx-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                window.retroSound.click();
                this.handleContextAction(action);
                this.hideContextMenu();
            });
        });
    }

    showContextMenu(x, y) {
        if (!this.contextMenu) return;
        this.contextMenu.style.display = 'block';
        const deskRect = this.desktopArea.getBoundingClientRect();

        const menuW = this.contextMenu.offsetWidth || 180;
        const menuH = this.contextMenu.offsetHeight || 150;

        let left = x - deskRect.left;
        let top = y - deskRect.top;

        if (left + menuW > deskRect.width) left -= menuW;
        if (top + menuH > deskRect.height) top -= menuH;

        this.contextMenu.style.left = `${left}px`;
        this.contextMenu.style.top = `${top}px`;
    }

    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.style.display = 'none';
        }
    }

    handleContextAction(action) {
        switch (action) {
            case 'new-txt':
                window.windowManager.open('win-notepad');
                window.retroNotepad.newDocument();
                break;
            case 'open-settings':
                window.windowManager.open('win-settings');
                break;
            case 'open-terminal':
                window.windowManager.open('win-terminal');
                break;
            case 'arrange-icons':
                this.autoArrangeIcons();
                break;
            case 'about':
                window.windowManager.open('win-about');
                break;
        }
    }

    autoArrangeIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        let col = 0;
        let row = 0;
        const colW = 85;
        const rowH = 95;
        const maxRows = Math.floor((this.desktopArea.offsetHeight - 50) / rowH);

        icons.forEach(icon => {
            icon.style.position = 'absolute';
            icon.style.left = `${15 + col * colW}px`;
            icon.style.top = `${15 + row * rowH}px`;

            row++;
            if (row >= maxRows) {
                row = 0;
                col++;
            }
        });
    }
}

window.retroDesktop = new RetroDesktop();
