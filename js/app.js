/**
 * Retro OS Main Controller & Boot Manager
 */

class NexusOS {
    constructor() {
        this.shutdownScreen = null;
        this.startMenu = null;
        this.startBtn = null;
        this.clockEl = null;
    }

    init() {
        this.shutdownScreen = document.getElementById('shutdown-screen');
        this.startMenu = document.getElementById('start-menu');
        this.startBtn = document.getElementById('taskbar-start-btn');
        this.clockEl = document.getElementById('tray-clock');

        // Initialize subsystem components
        window.retroSettings.init();
        window.windowManager.init();
        window.retroDesktop.init();
        window.retroPaint.init();
        window.retroMinesweeper.init();
        window.retroTerminal.init();
        window.retroCalculator.init();
        window.retroNotepad.init();
        window.retroExplorer.init();
        window.retroMediaPlayer.init();
        window.retroBrowser.init();

        this.initStartMenu();
        this.initClock();
        this.initShutdownDialog();
        this.initBSOD();

        // Boot directly to desktop and open welcome note
        setTimeout(() => {
            window.windowManager.open('win-notepad');
        }, 200);
    }

    initBSOD() {
        const bsodScreen = document.getElementById('bsod-screen');
        if (bsodScreen) {
            bsodScreen.addEventListener('click', () => {
                bsodScreen.style.display = 'none';
            });
            window.addEventListener('keydown', (e) => {
                if (bsodScreen.style.display === 'flex') {
                    bsodScreen.style.display = 'none';
                }
            });
        }

        const trayDialup = document.getElementById('tray-dialup-btn');
        if (trayDialup) {
            trayDialup.addEventListener('click', () => {
                window.retroSound.click();
                alert('US Robotics 56K Sportster: Connected to Local ISP (555-0199) at 57,600 bps.');
            });
        }
    }

    initStartMenu() {
        if (!this.startBtn || !this.startMenu) return;

        this.startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.retroSound.click();
            const isOpen = this.startMenu.style.display === 'flex';
            this.setStartMenuOpen(!isOpen);
        });

        // Close start menu when clicking outside
        window.addEventListener('click', (e) => {
            if (this.startMenu && !this.startMenu.contains(e.target) && e.target !== this.startBtn) {
                this.setStartMenuOpen(false);
            }
        });

        // Start menu items click handler
        const startItems = document.querySelectorAll('.start-menu-item[data-open-window]');
        startItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetWin = item.dataset.openWindow;
                window.retroSound.click();
                this.setStartMenuOpen(false);
                if (targetWin) {
                    window.windowManager.open(targetWin);
                }
            });
        });

        // Submenu hover interactions
        const programsParent = document.getElementById('start-item-programs');
        const programsSubmenu = document.getElementById('start-submenu-programs');
        if (programsParent && programsSubmenu) {
            programsParent.addEventListener('mouseenter', () => {
                programsSubmenu.style.display = 'block';
            });
            programsParent.addEventListener('mouseleave', () => {
                programsSubmenu.style.display = 'none';
            });
        }
    }

    setStartMenuOpen(open) {
        if (!this.startMenu || !this.startBtn) return;
        this.startMenu.style.display = open ? 'flex' : 'none';
        this.startBtn.classList.toggle('active', open);
    }

    initClock() {
        const update = () => {
            if (!this.clockEl) return;
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 12-hour format
            this.clockEl.textContent = `${hours}:${minutes} ${ampm}`;
            this.clockEl.title = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        };
        update();
        setInterval(update, 1000);
    }

    initShutdownDialog() {
        const shutdownBtn = document.getElementById('start-btn-shutdown');
        const dialog = document.getElementById('dialog-shutdown');
        const btnCancel = document.getElementById('shutdown-dialog-cancel');
        const btnConfirm = document.getElementById('shutdown-dialog-ok');

        if (shutdownBtn && dialog) {
            shutdownBtn.addEventListener('click', () => {
                window.retroSound.click();
                this.setStartMenuOpen(false);
                dialog.style.display = 'flex';
            });
        }

        if (btnCancel && dialog) {
            btnCancel.addEventListener('click', () => {
                window.retroSound.click();
                dialog.style.display = 'none';
            });
        }

        if (btnConfirm && dialog) {
            btnConfirm.addEventListener('click', () => {
                window.retroSound.click();
                dialog.style.display = 'none';
                const action = document.querySelector('input[name="shutdown-action"]:checked').value;

                if (action === 'shutdown') {
                    this.triggerShutdown();
                } else if (action === 'restart') {
                    this.triggerRestart();
                } else if (action === 'dos') {
                    window.windowManager.open('win-terminal');
                }
            });
        }

        // Restart button on "Safe to turn off" screen
        const rebootBtn = document.getElementById('shutdown-reboot-btn');
        if (rebootBtn) {
            rebootBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    triggerShutdown() {
        window.retroSound.closeWindow();
        if (this.shutdownScreen) {
            this.shutdownScreen.style.display = 'flex';
        }
    }

    triggerRestart() {
        window.retroSound.floppySeek();
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// Global reboot helper callable from terminal
window.rebootSystem = () => {
    window.location.reload();
};

window.triggerBSOD = () => {
    window.retroSound.error();
    const bsod = document.getElementById('bsod-screen');
    if (bsod) bsod.style.display = 'flex';
};

window.addEventListener('DOMContentLoaded', () => {
    window.nexusOS = new NexusOS();
    window.nexusOS.init();
});
