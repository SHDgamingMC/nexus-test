/**
 * Retro DOS Terminal (Nexus CLI)
 * Full interactive command-line interface with history, matrix mode, neofetch, and file inspection.
 */

class RetroTerminal {
    constructor() {
        this.container = null;
        this.outputEl = null;
        this.inputEl = null;
        this.history = [];
        this.historyIndex = -1;
        this.matrixInterval = null;

        this.virtualFileSystem = {
            'README.TXT': 'Welcome to Suvin\'s PC!\nA fully-themed interactive retro operating system website running in pure HTML/CSS/JS.\nCheck out my journal, jam on the chiptune jukebox, and don\'t forget to rewind your Blockbuster tapes!',
            'SYSTEM.INI': '[boot]\nshell=nexus.exe\ndrivers=audio_synth.vxd,vga256.drv\nmouse=ps2_trackball.drv\nmodem=us_robotics_56k.drv\nsound=sb16.vxd\ncrush=sarah_english_class.txt',
            'PASSWORD.TXT': 'SECRET_PASSWORDS:\nDoom II: IDDQD\nBlockbuster card: 20491\nAOL Screen Name: xX_CyberSkater98_Xx',
            'BAND_NAMES.TXT': '1. Dial-Up Screams\n2. Flannel Hazard\n3. The 3.5 Inch Floppies\n4. Quantum Toaster\n5. Trapper Keeper Apocalypse',
            'CREDITS.TXT': 'Built with nostalgic love for 90s computing culture.\nDedicated to everyone who remembers the sound of a 56k modem connecting at 2 AM.'
        };
    }

    init() {
        this.container = document.getElementById('terminal-body');
        this.outputEl = document.getElementById('terminal-output');
        this.inputEl = document.getElementById('terminal-input');

        if (!this.inputEl) return;

        this.inputEl.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Auto-focus input when terminal window is clicked
        const termWin = document.getElementById('win-terminal');
        if (termWin) {
            termWin.addEventListener('click', () => {
                this.inputEl.focus();
            });
        }

        this.printBanner();
    }

    printBanner() {
        this.appendOutput(`Nexus MS-DOS [Version 6.22 - Suvin's Personal Rig]
(C) Copyright 1985-1998 Microsoft & Nexus Corp.

Type 'help' for commands, 'dialup' to connect 56k, or 'snack' for brain food.
`);
    }

    appendOutput(text, isCommand = false) {
        if (!this.outputEl) return;

        const line = document.createElement('div');
        line.className = isCommand ? 'term-cmd-line' : 'term-output-line';
        line.textContent = text;
        this.outputEl.appendChild(line);

        if (this.container) {
            this.container.scrollTop = this.container.scrollHeight;
        }
    }

    appendHtml(html) {
        if (!this.outputEl) return;

        const container = document.createElement('div');
        container.className = 'term-output-line';
        container.innerHTML = html;
        this.outputEl.appendChild(container);

        if (this.container) {
            this.container.scrollTop = this.container.scrollHeight;
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const rawVal = this.inputEl.value.trim();
            this.appendOutput(`C:\\NEXUS> ${this.inputEl.value}`, true);

            if (rawVal.length > 0) {
                this.history.push(rawVal);
                this.historyIndex = this.history.length;
                this.execute(rawVal);
            }
            this.inputEl.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.inputEl.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.inputEl.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.inputEl.value = '';
            }
        } else if (e.ctrlKey && e.key === 'c') {
            if (this.matrixInterval) {
                clearInterval(this.matrixInterval);
                this.matrixInterval = null;
                this.appendOutput('^C Terminated matrix stream.');
            }
        }
    }

    execute(cmdStr) {
        window.retroSound.click();
        const parts = cmdStr.split(' ').filter(p => p.length > 0);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
            this.matrixInterval = null;
        }

        switch (cmd) {
            case 'help':
                this.appendOutput(`Available Commands:
  help               - Show this list of commands
  dir, ls            - List files in current directory
  cat, type <file>   - Display file contents
  cls, clear         - Clear the screen
  echo <text>        - Print text to screen
  neofetch           - Display retro system specifications
  dialup             - Trigger the 56k dial-up modem connect handshake!
  snack              - Recommend an essential 90s snack
  quote, fortune     - Vintage 90s wisdom and memories
  theme <name>       - Switch OS theme (win95, cyberpunk, matrix, vaporwave, amiga)
  matrix             - Digital phosphor rain stream (Press Ctrl+C to stop)
  calc <expr>        - Calculate mathematical expression (e.g. calc 42 * 8)
  date, time         - Show system date and time
  whoami             - Show current user info
  ver                - Show OS version info
  synth              - Play sound synthesizer test
  bsod               - Trigger Blue Screen of Death
  reboot             - Reboot the operating system
  beep               - Produce terminal alert beep`);
                break;

            case 'bsod':
            case 'crash':
                if (window.triggerBSOD) window.triggerBSOD();
                break;

            case 'whoami':
                this.appendOutput('suvin@bedroom-rig (Sitting in a swivel chair, wearing baggy cargo pants, drinking Mountain Dew, dodging algebra homework)');
                break;

            case 'dialup':
                this.appendOutput('Initializing US Robotics 56K Sportster Faxmodem on COM3...');
                this.appendOutput('ATDT 555-0199 [Dialing Local ISP]...');
                window.retroSound.dialUpConnect(() => {
                    this.appendOutput('CONNECT 57600/V.90/LAPM/COMPRESSION');
                    this.appendOutput('Welcome to Cyberspace! PPP protocol active.');
                });
                break;

            case 'snack':
                const snacks = [
                    '🍕 Bagel Bites ("Pizza in the morning, pizza in the evening, pizza at suppertime!")',
                    '🍪 Dunkaroos (Vanilla cookies with rainbow sprinkle frosting)',
                    '🥤 Surge Soda (Maximum citrus caffeine overload)',
                    '🍬 Fruit Gushers (Mood meter: pure blast)',
                    '🔺 3D Doritos (Jalapeno Cheddar in a futuristic plastic tube)',
                    '🍫 Butterfinger BBs (Bart Simpson approved)'
                ];
                const pick = snacks[Math.floor(Math.random() * snacks.length)];
                this.appendOutput(`SNACK DISPENSER: ${pick}`);
                break;

            case 'quote':
            case 'fortune':
                const quotes = [
                    '"Be Kind, Rewind." - Blockbuster Video store policy',
                    '"Don\'t pick up the phone, I\'m on the internet!" - Every 90s teenager',
                    '"You\'ve got mail!" - AOL',
                    '"There is no spoon." - The Matrix (1999)',
                    '"Whatever!" - The 90s rallying cry',
                    '"All your base are belong to us." - Zero Wing'
                ];
                this.appendOutput(quotes[Math.floor(Math.random() * quotes.length)]);
                break;

            case 'beep':
                window.retroSound.beep();
                this.appendOutput('*BEEP*');
                break;

            case 'synth':
                window.retroSound.fanfare();
                this.appendOutput('Synthesizing 8-bit fanfare arpeggio sequence...');
                break;

            case 'calc':
                if (args.length === 0) {
                    this.appendOutput('Usage: calc <math expression>');
                } else {
                    try {
                        const sanitized = args.join(' ').replace(/[^0-9+\-*/().]/g, '');
                        // eslint-disable-next-line no-eval
                        const result = Function(`'use strict'; return (${sanitized})`)();
                        this.appendOutput(`Result: ${result}`);
                    } catch (err) {
                        this.appendOutput('Calculation error: invalid expression.');
                    }
                }
                break;

            case 'theme':
                if (args.length === 0) {
                    this.appendOutput('Available themes: win95, cyberpunk, matrix, vaporwave, amiga');
                } else {
                    const themeName = args[0].toLowerCase();
                    if (window.retroSettings) {
                        const ok = window.retroSettings.setTheme(themeName);
                        if (ok) {
                            this.appendOutput(`System theme successfully switched to: ${themeName}`);
                        } else {
                            this.appendOutput(`Unknown theme: ${themeName}. Try win95, cyberpunk, matrix, vaporwave, amiga.`);
                        }
                    }
                }
                break;

            case 'neofetch':
                const banner = `
<pre style="margin:0; line-height:1.2; color:var(--win-accent);">
      .----------------.        <span style="color:var(--text-color);">root@nexus-desktop</span>
     /  .-.        .-.  \\       ------------------
    |  /   \\      /   \\  |      <b>OS:</b> Nexus Retro OS 4.20
    | |     |    |     | |      <b>Host:</b> Intel 486DX2 66MHz
    |  \\   /      \\   /  |      <b>Kernel:</b> 4.20-vintage-x86
     \\  \`-'        \`-'  /       <b>Uptime:</b> 42 days, 13 hours
      '----------------'        <b>Resolution:</b> 640x480 256 colors
    [  N E X U S   O S  ]       <b>Theme:</b> Standard VGA Platinum
                                <b>Memory:</b> 16MB / 32MB EDO RAM
                                <b>Sound:</b> Sound Blaster 16 ISA
</pre>`;
                this.appendHtml(banner);
                break;

            case 'matrix':
                this.appendOutput('Initializing Matrix digital rain stream... (Ctrl+C to abort)');
                const chars = '0123456789ABCDEF@#$%&*+-=~';
                this.matrixInterval = setInterval(() => {
                    let stream = '';
                    for (let i = 0; i < 48; i++) {
                        stream += chars[Math.floor(Math.random() * chars.length)] + ' ';
                    }
                    this.appendOutput(stream);
                }, 100);
                break;

            case 'reboot':
                this.appendOutput('System rebooting in 2 seconds...');
                setTimeout(() => {
                    if (window.rebootSystem) window.rebootSystem();
                    else location.reload();
                }, 1800);
                break;

            default:
                window.retroSound.error();
                this.appendOutput(`'${cmd}' is not recognized as an internal or external command,
operable program or batch file. Type 'help' for available commands.`);
                break;
        }
    }
}

window.retroTerminal = new RetroTerminal();
