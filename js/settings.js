/**
 * Retro Settings, Themes, Wallpapers, and CRT Display Shader Controls
 */

class RetroSettings {
    constructor() {
        this.currentTheme = 'theme-win95';
        this.currentWallpaper = 'classic-teal';
        this.crtEnabled = true;
    }

    init() {
        this.loadSavedPreferences();
        this.bindEvents();
        this.applyTheme(this.currentTheme);
        this.applyWallpaper(this.currentWallpaper);
        this.applyCrt(this.crtEnabled);
    }

    loadSavedPreferences() {
        const savedTheme = localStorage.getItem('nexus_theme');
        if (savedTheme) this.currentTheme = savedTheme;

        const savedWp = localStorage.getItem('nexus_wallpaper');
        if (savedWp) {
            this.currentWallpaper = savedWp === 'starfield' ? 'classic-teal' : savedWp;
        }

        const savedCrt = localStorage.getItem('nexus_crt');
        if (savedCrt !== null) this.crtEnabled = savedCrt === 'true';
    }

    bindEvents() {
        // Theme buttons in Settings window
        const themeRadios = document.querySelectorAll('input[name="setting-theme"]');
        themeRadios.forEach(radio => {
            if (radio.value === this.currentTheme) radio.checked = true;
            radio.addEventListener('change', () => {
                window.retroSound.click();
                this.setTheme(radio.value);
            });
        });

        // Wallpaper selector
        const wpSelect = document.getElementById('setting-wallpaper-select');
        if (wpSelect) {
            wpSelect.value = this.currentWallpaper;
            wpSelect.addEventListener('change', (e) => {
                window.retroSound.click();
                this.setWallpaper(e.target.value);
            });
        }

        // CRT Scanline Toggle
        const crtCheck = document.getElementById('setting-crt-toggle');
        if (crtCheck) {
            crtCheck.checked = this.crtEnabled;
            crtCheck.addEventListener('change', (e) => {
                window.retroSound.click();
                this.setCrt(e.target.checked);
            });
        }

        // CRT quick toggle button in taskbar tray
        const trayCrtBtn = document.getElementById('tray-crt-btn');
        if (trayCrtBtn) {
            trayCrtBtn.addEventListener('click', () => {
                window.retroSound.click();
                this.setCrt(!this.crtEnabled);
                if (crtCheck) crtCheck.checked = this.crtEnabled;
            });
        }

        // Sound Mute Toggle
        const muteCheck = document.getElementById('setting-sound-mute');
        const traySoundBtn = document.getElementById('tray-sound-btn');

        if (muteCheck) {
            muteCheck.addEventListener('change', (e) => {
                const enabled = !e.target.checked;
                window.retroSound.enabled = enabled;
                if (traySoundBtn) traySoundBtn.textContent = enabled ? '🔊' : '🔇';
            });
        }

        if (traySoundBtn) {
            traySoundBtn.addEventListener('click', () => {
                const nowEnabled = window.retroSound.toggleMute();
                traySoundBtn.textContent = nowEnabled ? '🔊' : '🔇';
                if (muteCheck) muteCheck.checked = !nowEnabled;
                if (nowEnabled) window.retroSound.click();
            });
        }
    }

    setTheme(themeName) {
        if (!themeName.startsWith('theme-')) {
            themeName = 'theme-' + themeName;
        }

        const validThemes = ['theme-win95', 'theme-cyberpunk', 'theme-matrix', 'theme-vaporwave', 'theme-amiga'];
        if (!validThemes.includes(themeName)) return false;

        this.currentTheme = themeName;
        localStorage.setItem('nexus_theme', themeName);
        this.applyTheme(themeName);

        // Update radio in settings if present
        const radio = document.querySelector(`input[name="setting-theme"][value="${themeName}"]`);
        if (radio) radio.checked = true;

        return true;
    }

    applyTheme(themeClass) {
        const body = document.body;
        body.classList.remove('theme-win95', 'theme-cyberpunk', 'theme-matrix', 'theme-vaporwave', 'theme-amiga');
        body.classList.add(themeClass);
    }

    setWallpaper(wpName) {
        this.currentWallpaper = wpName;
        localStorage.setItem('nexus_wallpaper', wpName);
        this.applyWallpaper(wpName);
    }

    applyWallpaper(wpName) {
        const desktop = document.getElementById('desktop-area');
        if (!desktop) return;

        desktop.classList.remove('wp-classic-teal', 'wp-retro-grid', 'wp-pixel-clouds');
        desktop.classList.add(`wp-${wpName}`);
    }

    setCrt(enabled) {
        this.crtEnabled = enabled;
        localStorage.setItem('nexus_crt', String(enabled));
        this.applyCrt(enabled);
    }

    applyCrt(enabled) {
        const overlay = document.getElementById('crt-overlay');
        const trayCrtBtn = document.getElementById('tray-crt-btn');

        if (overlay) {
            overlay.style.display = enabled ? 'block' : 'none';
        }
        if (trayCrtBtn) {
            trayCrtBtn.classList.toggle('active-tray-item', enabled);
        }
    }
}

window.retroSettings = new RetroSettings();
