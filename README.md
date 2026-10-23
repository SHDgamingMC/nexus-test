# Nexus OS (1998 Edition) - Authentic Retro Operating System Website

A pixel-for-pixel, authentic recreation of a late-90s personal PC desktop built using **original HTML, CSS, and Vanilla JavaScript only**. No frameworks, no external libraries, and genuine procedural Web Audio synthesis.

---

## 🌟 What Makes This Feel Real & Human-Crafted

### 1. 🔤 Authentic Windows 95 System Typography (No Generic "Arcade NES" Fonts)
- Standard AI retro demos rely on cartoonish arcade fonts like `Press Start 2P`. 
- Real Windows 95/98 used **`MS Sans Serif` (11px, non-antialiased)** and **`Tahoma`** for windows, menus, dialogs, and taskbars, with **`Fixedsys` / `VT323`** for MS-DOS and **`Comic Sans MS` / `Times New Roman`** on GeoCities personal pages.

### 2. 🎨 Handcrafted 32x32 Integer Pixel-Art Icons
- Replaced mathematical vector bezier curves with **true 32x32 pixel-grid bitmap art** using `shape-rendering: crispEdges`:
  - **My Computer**: 3D beige CRT monitor with screen window, stand, and desktop unit with floppy slot and power LED.
  - **Recycle Bin**: Beige wire mesh wastebasket with crumpled papers and green recycle emblem.
  - **MS-DOS Prompt**: Classic black monitor with `C:\>` prompt.
  - **Notepad**: Blue notebook with turned corner, blue ruled lines, and yellow #2 pencil with red eraser.
  - **Paint**: Acrylic palette with paint dollops and wooden brush.
  - **Minesweeper**: Iconic black naval mine with 8 spikes, fuse, and yellow/red spark.
  - **Media Player**: Shiny compact disc with rainbow iridescent sheen and music note.
  - **The Internet**: Iconic 90s blue 'e' with golden orbital swing.
  - **Control Panel**: Classic folder with screwdriver and gear.

### 3. 📏 Authentic Windows 95 Dimensions & Bevels
- **18px Titlebars**: Exactly 18px tall with bold 11px text and 16x14px raised titlebar buttons (`_`, `□`, `✕`).
- **28px Taskbar**: Classic `#c0c0c0` 28px taskbar with authentic 4-color waving Windows pixel flag, 22px taskbar tabs, and a sunken system tray.
- **Classic Selection**: 1px dotted outline focus rectangle around blue desktop labels.

### 4. 💙 Authentic Blue Screen of Death (BSOD)
- Fatal Exception `0E at 0028:C0011E36` screen with white text on `#0000aa` blue background.
- Triggerable via `C:\Programs\DO_NOT_CLICK.EXE`, typing `bsod` in the DOS Prompt, or via console. Any keypress clears it!

### 5. 📞 Procedural 56k Dial-Up Modem Handshake
- Pure Web Audio API simulation of dialing an ISP: dial tone &rarr; touch-tone DTMF beeps &rarr; carrier CED whistle &rarr; V.8 BIS dual-tone warble &rarr; chaotic static & screeching handshake &rarr; connection chime!

### 6. 📌 Draggable Yellow Desktop Post-It Note
- Real yellow sticky note with pushpin right on the desktop:
  - *"Return Titanic VHS tapes to Blockbuster by 7 PM! (BE KIND, REWIND!)"*
  - *"DO NOT pick up phone line: downloading 3MB MP3!"*
  - *"Doom II codes: IDDQD, IDKFA"*
- Fully draggable and editable directly on the desktop!

### 7. 📖 Real 1998 Human Artifacts & GeoCities
- Heartfelt journal entries in Notepad, garage band name brainstorming, cheat codes sheet, grandma's cookie recipe, and a 1998 GeoCities cyber lair with hit counters and guestbook comments from 90s classmates.

### 🔊 Procedural 8-Bit Web Audio Synthesizer
- Zero external MP3/WAV files required; uses the native browser Web Audio API.
- Retro startup chime, floppy drive stepped seek buzz, error and alert beeps, click sounds, window swooshes, and minesweeper explosions.
- Multi-channel procedural 8-bit chiptune tracker in the Jukebox app with real-time frequency visualizer.

### 🪟 Interactive Window Manager
- Draggable titlebars with bounds collision against desktop edges.
- Resizable windows with custom corner resize handles.
- Minimize, Maximize / Restore, and Close buttons.
- Dynamic z-index layering and cascading placement.
- Synchronized taskbar tabs with active state indicators.

### 🕹️ Built-in Retro Applications & Utilities
1. **Pixel Paint Studio**:
   - 16x16, 24x24, and 32x32 pixel canvases.
   - Pencil, Eraser, Fill Bucket, Eye Dropper, and Grid toggle.
   - 16-color VGA/EGA retro palette.
   - Full PNG export download!
2. **Classic Minesweeper**:
   - 9x9 grid with 10 mines.
   - 7-segment style LED mine counter and elapsed timer.
   - Dynamic smiley face button reacting to clicks, wins, and losses.
3. **DOS Prompt (Nexus CLI)**:
   - Interactive commands: `help`, `dir`, `cat <file>`, `cls`, `echo`, `neofetch`, `matrix`, `calc <math>`, `theme <name>`, `synth`, `date`, `ver`, `reboot`.
   - Command history navigation with Up/Down arrow keys.
4. **Retro Chiptune Jukebox**:
   - 3 procedural 8-bit songs.
   - Live canvas frequency visualizer bars.
   - Volume control, play, pause, stop, track switching.
5. **NetSurf 1.0 Web Browser**:
   - Simulated 90s web browser with address bar, back/forward buttons.
   - RetroSearch directory search engine.
   - Interactive guestbook that saves entries to `localStorage`.
   - Classic "Under Construction" page with hit counter.
6. **Notepad Editor**:
   - Text editing, word wrap toggle, real-time line/col status bar.
   - File saving to browser memory and `.txt` file downloading.
7. **Pocket Calculator**:
   - Standard 4-function math, square root, negation, and clear.
8. **File Explorer (NexusDrive C:)**:
   - Folder tree navigation and file details table.
   - Double-clicking documents or applications opens their respective programs.
9. **Settings & Display Properties**:
   - Switch themes, wallpapers, toggle CRT scanline overlay, and mute audio.
10. **BIOS POST Boot & Shutdown**:
    - Authentic BIOS startup RAM count and hardware detection (click to skip).
    - Shutdown modal and "It is now safe to turn off your computer" screen with reboot button.

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser:
- Double click `index.html` on your desktop/file manager, OR
- Serve with any static web server (e.g. `npx serve`, Python `python -m http.server`, or VS Code Live Server).
