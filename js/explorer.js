/**
 * Retro File Explorer (NexusDrive C:)
 */

class RetroExplorer {
    constructor() {
        this.currentPath = 'C:\\';
        this.treeEl = null;
        this.listEl = null;
        this.pathInput = null;
        this.statusEl = null;

        this.fileSystem = {
            'C:\\': {
                folders: ['Documents', 'Programs', 'System', 'Media'],
                files: [
                    { name: 'AUTOEXEC.BAT', size: '128 B', type: 'MS-DOS Batch', modified: '01/15/1995', target: 'notepad', content: '@ECHO OFF\nPROMPT $P$G\nPATH C:\\NEXUS;C:\\DOS\nSET SOUND=SB16\nNEXUS.EXE' },
                    { name: 'CONFIG.SYS', size: '94 B', type: 'System Config', modified: '01/15/1995', target: 'notepad', content: 'DEVICE=HIMEM.SYS\nDOS=HIGH,UMB\nBUFFERS=30\nFILES=40' }
                ]
            },
            'C:\\Documents': {
                folders: [],
                files: [
                    { name: 'SUVIN_JOURNAL_OCT98.TXT', size: '1.2 KB', type: 'Personal Diary', modified: '10/24/1998', target: 'notepad', content: `OCTOBER 24, 1998 - 11:42 PM
------------------------------------------------
I finally got the Sound Blaster working after messing with the IRQ jumpers for 3 straight hours! 

Mom yelled at me around 8 PM because I was tying up the landline phone downloading a 3MB MP3 from Napster. She picked up the downstairs phone to call Aunt Linda right when it was at 94%... GONE. 45 minutes of download time down the drain! 

In other news:
* Sarah smiled at me in 4th period English class when I dropped my Trapper Keeper. I think my face turned as red as a cherry Jolly Rancher.
* Dave and I are starting a garage band called 'Dial-Up Screams'. He plays drums (well, overturned cardboard boxes), and I play guitar.
* If I save my paper route money until Christmas, I might afford that 3dfx Voodoo2 graphics card. Quake II at 800x600... a guy can dream.

Signing off, gotta be up for school at 7:00 AM.
- Suvin` },
                    { name: 'BAND_NAME_IDEAS.TXT', size: '420 B', type: 'Text Document', modified: '10/18/1998', target: 'notepad', content: `BAND NAMES WE MIGHT USE (DO NOT SHOW DAVE'S SISTER):
1. Dial-Up Screams (sounds pretty hardcore)
2. Flannel Hazard (very grunge, Dave thinks it's dumb)
3. The 3.5 Inch Floppies (Dad laughed when I said this one)
4. Y2K Survivors (very timely)
5. Quantum Toaster (more of an indie vibe)
6. Trapper Keeper Apocalypse
7. Screaming Motherboards

Current rehearsal location: Dave's garage (until his dad comes home and wants to park the Honda).` },
                    { name: 'ULTIMATE_CHEAT_CODES.TXT', size: '890 B', type: 'Game Cheats', modified: '09/12/1998', target: 'notepad', content: `GAMES CHEATS & CODES - DO NOT LOSE THIS!

[ DOOM II ]
IDDQD - God Mode (invincibility)
IDKFA - Full weapons, armor & all color keys
IDCLIP - Walk through walls
IDBEHOLDS - Light amplification visor

[ WARCRAFT II ]
glittering prizes - +10,000 Gold, 4,000 Lumber, 4,000 Oil
it is a good day to die - Invincible god units
deck me out - All technology upgrades researched
every little thing she does - All spell upgrades
tigerlily - Level warp

[ MORTAL KOMBAT - SEGA GENESIS ]
Blood Code at code screen: A, B, A, C, A, B, B (Get over here!)

[ SIMCITY 2000 ]
Type 'fund' during gameplay to borrow $10,000 (watch out for the interest!)

[ BLOCKBUSTER VIDEO CARD ]
Member ID: 20491-8849-002
Late fee balance: $2.50 (Return Titanic VHS tapes by 7 PM!!)` },
                    { name: 'SCI_FI_NOVEL_CH1.TXT', size: '750 B', type: 'Story Draft', modified: '09/30/1998', target: 'notepad', content: `THE CHRONICLES OF CYBER-NEO: CHAPTER 1
By: Suvin Vance (Copyright 1998 - All Rights Reserved)

The year was 2024. The world was completely made of fiber optic lasers and holographic televisions. Jax Stone leaned against his hover-motorcycle outside the digital pizza parlour. His cybernetic eye flickered with a 14.4k modem signal.

'Looks like rain,' Jax whispered into his jacket collar, which was made of black synthetic leather with lots of zippers. 'Acid rain.'

Suddenly, a cyber-droid stepped out from the neon fog, holding an encrypted floppy disk...

[To be continued as soon as I finish my algebra homework...]` },
                    { name: 'GRANDMAS_COOKIE_RECIPE.TXT', size: '540 B', type: 'Family Recipe', modified: '08/04/1998', target: 'notepad', content: `GRANDMA EVELYN'S OATMEAL CHOCOLATE CHIP COOKIES:
- 2 cups rolled oats
- 1 cup brown sugar (pack it down firmly!)
- 1 cup real butter (NOT margarine!)
- 1 tsp pure vanilla extract
- 2 eggs from Mrs. Higgins down the road
- 1 bag semi-sweet chocolate chips (eat a handful while baking, it's tradition!)
- 1 pinch of cinnamon

Bake at 350°F for 10-12 mins until edges are golden brown.
Always bring two warm cookies to Grandpa in the workshop.` },
                    { name: 'MOM_CHORES.TXT', size: '310 B', type: 'Notes', modified: '10/22/1998', target: 'notepad', content: `SUVIN:
1. Take the trash cans out to the curb BEFORE the truck comes tomorrow morning.
2. Feed Buster (dog food is in the laundry room).
3. Wipe the greasy fingerprints off the computer monitor.
4. DO NOT stay up until 2 AM in those AOL chat rooms. School starts at 8!
- Love, Mom` }
                ]
            },
            'C:\\Programs': {
                folders: [],
                files: [
                    { name: 'MINESWEEPER.EXE', size: '48 KB', type: 'Application', modified: '08/11/1995', target: 'app:win-minesweeper' },
                    { name: 'PAINT.EXE', size: '124 KB', type: 'Application', modified: '07/20/1995', target: 'app:win-paint' },
                    { name: 'TERMINAL.EXE', size: '64 KB', type: 'Application', modified: '09/01/1995', target: 'app:win-terminal' },
                    { name: 'CALCULATOR.EXE', size: '32 KB', type: 'Application', modified: '06/15/1995', target: 'app:win-calc' },
                    { name: 'JUKEBOX.EXE', size: '86 KB', type: 'Application', modified: '08/30/1995', target: 'app:win-player' },
                    { name: 'SETTINGS.EXE', size: '52 KB', type: 'Application', modified: '10/01/1995', target: 'app:win-settings' },
                    { name: 'NETSURF.EXE', size: '150 KB', type: 'Application', modified: '09/18/1995', target: 'app:win-browser' },
                    { name: 'DO_NOT_CLICK.EXE', size: '13 KB', type: 'Application', modified: '10/24/1998', target: 'bsod' }
                ]
            },
            'C:\\System': {
                folders: [],
                files: [
                    { name: 'KERNEL.SYS', size: '256 KB', type: 'System File', modified: '01/01/1995', target: 'notepad', content: 'BINARY KERNEL DATA [PROTECTED]' },
                    { name: 'SOUND.DRV', size: '18 KB', type: 'Device Driver', modified: '03/14/1995', target: 'notepad', content: 'SOUND BLASTER 16 / ADLIB DRIVER v2.1' },
                    { name: 'VGA256.DRV', size: '24 KB', type: 'Display Driver', modified: '04/02/1995', target: 'notepad', content: 'VGA 256 COLOR BIOS EXTENSION' }
                ]
            },
            'C:\\Media': {
                folders: [],
                files: [
                    { name: 'CHIPTUNE1.MID', size: '4.2 KB', type: 'MIDI Track', modified: '09/10/1995', target: 'app:win-player' },
                    { name: 'CHIPTUNE2.MID', size: '5.8 KB', type: 'MIDI Track', modified: '09/14/1995', target: 'app:win-player' },
                    { name: 'AVATAR.BMP', size: '1.2 KB', type: 'Bitmap Image', modified: '10/05/1995', target: 'app:win-paint' }
                ]
            }
        };
    }

    init() {
        this.treeEl = document.getElementById('explorer-tree');
        this.listEl = document.getElementById('explorer-file-list');
        this.pathInput = document.getElementById('explorer-path');
        this.statusEl = document.getElementById('explorer-status');

        const upBtn = document.getElementById('explorer-btn-up');
        if (upBtn) {
            upBtn.addEventListener('click', () => {
                window.retroSound.click();
                this.navigateUp();
            });
        }

        this.renderTree();
        this.navigateTo('C:\\');
    }

    navigateTo(path) {
        if (!this.fileSystem[path]) return;
        this.currentPath = path;
        if (this.pathInput) this.pathInput.value = path;
        this.renderFileList();
        this.highlightTreeNode();
        window.retroSound.floppySeek();
    }

    navigateUp() {
        if (this.currentPath === 'C:\\') return;
        const parts = this.currentPath.split('\\').filter(Boolean);
        if (parts.length <= 1) {
            this.navigateTo('C:\\');
        } else {
            parts.pop();
            this.navigateTo(parts.join('\\') + (parts.length === 1 ? '\\' : ''));
        }
    }

    renderTree() {
        if (!this.treeEl) return;
        this.treeEl.innerHTML = '';

        const rootItem = document.createElement('div');
        rootItem.className = 'tree-node active-node';
        rootItem.dataset.path = 'C:\\';
        rootItem.innerHTML = `<span class="icon-small icon-drive"></span> NexusDrive (C:)`;
        rootItem.addEventListener('click', () => this.navigateTo('C:\\'));
        this.treeEl.appendChild(rootItem);

        const subContainer = document.createElement('div');
        subContainer.className = 'tree-subfolder-group';

        const rootFolders = this.fileSystem['C:\\'].folders;
        rootFolders.forEach(folder => {
            const folderPath = `C:\\${folder}`;
            const fItem = document.createElement('div');
            fItem.className = 'tree-node';
            fItem.dataset.path = folderPath;
            fItem.innerHTML = `<span class="icon-small icon-folder"></span> ${folder}`;
            fItem.addEventListener('click', () => this.navigateTo(folderPath));
            subContainer.appendChild(fItem);
        });

        this.treeEl.appendChild(subContainer);
    }

    highlightTreeNode() {
        if (!this.treeEl) return;
        const nodes = this.treeEl.querySelectorAll('.tree-node');
        nodes.forEach(n => {
            n.classList.toggle('active-node', n.dataset.path === this.currentPath);
        });
    }

    renderFileList() {
        if (!this.listEl) return;
        this.listEl.innerHTML = '';

        const data = this.fileSystem[this.currentPath];
        if (!data) return;

        let totalItems = 0;

        // Render subfolders
        data.folders.forEach(folder => {
            totalItems++;
            const row = document.createElement('tr');
            row.className = 'file-row';
            row.innerHTML = `
                <td><span class="icon-small icon-folder"></span> ${folder}</td>
                <td>--</td>
                <td>Folder</td>
                <td>01/15/1995</td>
            `;
            row.addEventListener('dblclick', () => {
                const newPath = this.currentPath.endsWith('\\') ? `${this.currentPath}${folder}` : `${this.currentPath}\\${folder}`;
                this.navigateTo(newPath);
            });
            this.listEl.appendChild(row);
        });

        // Render files
        data.files.forEach(file => {
            totalItems++;
            const row = document.createElement('tr');
            row.className = 'file-row';
            const iconClass = file.type.includes('Application') ? 'icon-exe' : (file.type.includes('Text') ? 'icon-txt' : 'icon-file');
            row.innerHTML = `
                <td><span class="icon-small ${iconClass}"></span> ${file.name}</td>
                <td>${file.size}</td>
                <td>${file.type}</td>
                <td>${file.modified}</td>
            `;

            row.addEventListener('dblclick', () => {
                this.openFile(file);
            });

            this.listEl.appendChild(row);
        });

        if (this.statusEl) {
            this.statusEl.textContent = `${totalItems} object(s) | 1,457,664 bytes free`;
        }
    }

    openFile(file) {
        window.retroSound.click();
        if (file.target === 'bsod') {
            if (window.triggerBSOD) window.triggerBSOD();
        } else if (file.target.startsWith('app:')) {
            const winId = file.target.replace('app:', '');
            window.windowManager.open(winId);
        } else if (file.target === 'notepad') {
            window.windowManager.open('win-notepad');
            if (file.content) {
                window.retroNotepad.loadFile(file.name, file.content);
            }
        }
    }
}

window.retroExplorer = new RetroExplorer();
