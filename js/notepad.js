/**
 * Retro Notepad Text Editor
 */

class RetroNotepad {
    constructor() {
        this.textarea = null;
        this.statusLine = null;
        this.currentFilename = 'Untitled.txt';
        this.titlebarEl = null;
    }

    init() {
        this.textarea = document.getElementById('notepad-textarea');
        this.statusLine = document.getElementById('notepad-status');
        this.titlebarEl = document.querySelector('#win-notepad .window-title-text');

        if (!this.textarea) return;

        this.textarea.addEventListener('input', () => this.updateStatus());
        this.textarea.addEventListener('keyup', () => this.updateStatus());
        this.textarea.addEventListener('click', () => this.updateStatus());

        // Menu items
        const newBtn = document.getElementById('notepad-menu-new');
        const saveBtn = document.getElementById('notepad-menu-save');
        const downloadBtn = document.getElementById('notepad-menu-download');
        const wrapToggle = document.getElementById('notepad-menu-wrap');

        if (newBtn) {
            newBtn.addEventListener('click', () => {
                window.retroSound.click();
                this.newDocument();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                window.retroSound.floppySeek();
                this.saveToStorage();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                window.retroSound.floppySeek();
                this.downloadFile();
            });
        }

        if (wrapToggle) {
            wrapToggle.addEventListener('click', () => {
                window.retroSound.click();
                const isWrap = this.textarea.style.whiteSpace !== 'nowrap';
                this.textarea.style.whiteSpace = isWrap ? 'nowrap' : 'pre-wrap';
                wrapToggle.textContent = isWrap ? 'Word Wrap: OFF' : 'Word Wrap: ON';
            });
        }

        // Default content
        this.loadFile('SUVIN_JOURNAL_OCT98.TXT', `===========================================================
               SUVIN'S PERSONAL DESKTOP (1998)
===========================================================

OCTOBER 24, 1998 - 11:42 PM
-----------------------------------------------------------
I finally got the Sound Blaster 16 working after messing with
the IRQ jumpers on the motherboard for 3 straight hours!

Mom yelled at me around 8 PM because I was tying up the family
phone line downloading a 3MB MP3 from Napster. She picked up the
downstairs receiver to call Aunt Linda right when it hit 94%...
POOF! 45 minutes of download progress gone in a second.

THINGS TO REMEMBER:
-------------------
[ ] Return Titanic VHS tapes to Blockbuster (Be Kind, Rewind!)
[ ] Give Dave the cheat code sheet for Doom II & Warcraft II
[ ] Clean mouse trackball (it's getting linty again)
[ ] Save paper route money for a 3dfx Voodoo2 3D accelerator

Feel free to poke around my computer, draw some pixel art in Paint,
blast some tunes in the Jukebox, or surf my GeoCities homepage in
NetSurf 1.0!

- Suvin (Screen name: xX_CyberSkater98_Xx)
===========================================================`);
    }

    loadFile(filename, content) {
        this.currentFilename = filename;
        if (this.textarea) {
            this.textarea.value = content;
        }
        if (this.titlebarEl) {
            this.titlebarEl.textContent = `Notepad - ${filename}`;
        }
        this.updateStatus();
    }

    newDocument() {
        this.loadFile('Untitled.txt', '');
        if (this.textarea) this.textarea.focus();
    }

    saveToStorage() {
        if (!this.textarea) return;
        localStorage.setItem(`nexus_file_${this.currentFilename}`, this.textarea.value);
        this.showTemporaryStatus('File saved to Nexus virtual disk!');
    }

    downloadFile() {
        if (!this.textarea) return;
        const blob = new Blob([this.textarea.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFilename;
        a.click();
        URL.revokeObjectURL(url);
    }

    showTemporaryStatus(msg) {
        if (!this.statusLine) return;
        const oldText = this.statusLine.textContent;
        this.statusLine.textContent = `[ ${msg} ]`;
        setTimeout(() => {
            this.updateStatus();
        }, 2200);
    }

    updateStatus() {
        if (!this.textarea || !this.statusLine) return;
        const text = this.textarea.value;
        const pos = this.textarea.selectionStart || 0;
        const lines = text.slice(0, pos).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        const totalChars = text.length;

        this.statusLine.textContent = `Ln ${line}, Col ${col} | Total chars: ${totalChars}`;
    }
}

window.retroNotepad = new RetroNotepad();
