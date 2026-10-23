/**
 * Retro Web Browser ("NetSurf 1.0")
 * Simulated 90s Netscape/Mosaic style web browser with bookmarks, search, and guestbook
 */

class RetroBrowser {
    constructor() {
        this.currentUrl = 'http://www.geocities.com/SunsetStrip/SuvinLair98/';
        this.history = [];
        this.historyIndex = -1;
        this.urlInput = null;
        this.viewportEl = null;
        this.statusTextEl = null;

        this.pages = {
            'http://www.geocities.com/SunsetStrip/SuvinLair98/': `
                <div class="retro-webpage">
                    <div style="background: #000080; color: #ffff00; padding: 6px; text-align: center; font-weight: bold; font-family:'Comic Sans MS', Impact, sans-serif; font-size: 14px; margin-bottom: 12px; border: 2px outset #ffffff; letter-spacing: 1px;">
                        ★ ★ ★ SUVIN'S 1998 CYBER LAIR ★ ★ ★
                    </div>

                    <div style="background: yellow; border: 1px dashed red; padding: 4px; text-align: center; font-size: 11px; margin-bottom: 12px; color: black; font-weight: bold;">
                        🚨 ALERT: BEST VIEWED IN 800x600 RESOLUTION WITH NETSCAPE NAVIGATOR 🚨
                    </div>

                    <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <h3 style="color: #c00000; border-bottom: 2px solid #c00000; padding-bottom: 2px; font-size: 13px;">👋 About Me</h3>
                            <p style="font-size: 11px; line-height: 1.4; margin: 6px 0;">
                                Hey there, netizen! I'm Suvin. Welcome to my personal slice of cyberspace!
                                When I'm not skating with Dave or playing Doom II until 1 AM, I'm hacking this site together in Notepad with pure HTML tables.
                            </p>
                            <p style="font-size: 11px; line-height: 1.4; margin: 6px 0;">
                                <b>Current Mood:</b> Eating Pizza Bagels &amp; avoiding algebra homework.<br>
                                <b>Rig Specs:</b> 486DX2-66, 16MB RAM, Sound Blaster 16, 56k US Robotics Faxmodem!
                            </p>

                            <div style="margin: 10px 0;">
                                <button id="btn-trigger-dialup" class="retro-btn" style="font-size: 10px; background: #e0e0ff;">
                                    📞 Listen to 56k Dial-Up Modem Sound
                                </button>
                                <span id="dialup-status-msg" style="font-size: 10px; color: #008000; margin-left: 6px;"></span>
                            </div>
                        </div>

                        <div style="flex: 1; min-width: 200px; background: #f4f4f4; border: 1px inset #808080; padding: 8px;">
                            <h3 style="color: #000080; border-bottom: 1px solid #000080; font-size: 12px;">🎸 Top 5 Albums in Heavy Rotation</h3>
                            <ol style="font-size: 11px; line-height: 1.5; padding-left: 18px; margin-top: 4px;">
                                <li><b>Nirvana</b> - <i>In Utero</i> ("Heart-Shaped Box is legendary")</li>
                                <li><b>Daft Punk</b> - <i>Homework</i> ("Pure cybernetic energy")</li>
                                <li><b>The Offspring</b> - <i>Smash</i> ("Soundtrack to my paper route")</li>
                                <li><b>Green Day</b> - <i>Dookie</i> ("Basslines are so fun on guitar")</li>
                                <li><b>The Prodigy</b> - <i>The Fat of the Land</i> ("Bass rattle!")</li>
                            </ol>
                        </div>
                    </div>

                    <hr style="margin: 15px 0;">

                    <div style="text-align: center; margin: 15px 0;">
                        <span style="font-size: 11px;"><b>EXPLORE MY CYBER NETWORK:</b></span><br>
                        <a href="#" class="web-link" data-url="http://www.retrosearch.net/">RetroSearch Engine</a> | 
                        <a href="#" class="web-link" data-url="http://www.guestbook.org/">Sign My Guestbook</a> | 
                        <a href="#" class="web-link" data-url="http://www.underconstruction.com/">Dave's Construction Site</a>
                    </div>

                    <div style="text-align: center; margin-top: 20px; padding: 10px; background: #000; color: #00ff00; font-family: monospace; border: 2px outset #c0c0c0; display: inline-block; width: calc(100% - 24px);">
                        VISITOR HIT COUNTER: [ 0 0 1 3 3 7 ]<br>
                        <span style="color: #ffff00; font-size: 10px;">★ [ « Previous ] • <b>90s Cyber WebRing</b> • [ Next » ] ★</span>
                    </div>
                </div>
            `,
            'http://www.retrosearch.net/': `
                <div class="retro-webpage">
                    <div style="text-align:center; padding: 20px 10px;">
                        <h1 style="font-family:'Impact', Arial, sans-serif; font-size: 26px; color: #ff0055; margin-bottom: 5px; letter-spacing: 2px;">
                            RETRO SEARCH !
                        </h1>
                        <p style="color: #555; font-size: 11px;">The Premier World Wide Web Directory (Est. 1995)</p>
                        <div style="margin: 15px 0;">
                            <input type="text" id="browser-search-query" class="retro-input" placeholder="Search the web..." style="width: 240px; padding: 4px;">
                            <button id="browser-search-submit" class="retro-btn" style="padding: 3px 8px;">Find It!</button>
                        </div>
                        <div style="font-size: 11px; margin-top: 15px;">
                            <b>Popular Categories:</b><br>
                            <a href="#" class="web-link" data-url="http://www.geocities.com/SunsetStrip/SuvinLair98/">Suvin's Cyber Lair</a> | 
                            <a href="#" class="web-link" data-url="http://www.guestbook.org/">Guestbook Ledger</a> | 
                            <a href="#" class="web-link" data-url="http://www.underconstruction.com/">Dave's Webmaster Site</a>
                        </div>
                        <div id="browser-search-results" style="margin-top: 15px; text-align: left; font-size: 11px;"></div>
                    </div>
                </div>
            `,
            'http://www.guestbook.org/': `
                <div class="retro-webpage">
                    <h2 style="color: #7e2553;">📖 Suvin's Cyber Guestbook (1998)</h2>
                    <p style="font-size: 11px;">Drop a line, say hi from around the world, or leave a cheat code!</p>
                    <div style="background: #e0e0e0; padding: 10px; border: 1px inset #808080; margin-bottom: 15px;">
                        <div style="margin-bottom: 6px;">
                            <label style="font-size:11px;">Handle / Screen Name:</label><br>
                            <input type="text" id="gb-input-name" class="retro-input" style="width: 100%; box-sizing: border-box;" placeholder="e.g. RadSkater99">
                        </div>
                        <div style="margin-bottom: 6px;">
                            <label style="font-size:11px;">Message:</label><br>
                            <textarea id="gb-input-msg" class="retro-input" style="width: 100%; height: 50px; box-sizing: border-box;" placeholder="Yo Suvin, awesome webpage! Don't forget the math homework tomorrow!"></textarea>
                        </div>
                        <button id="gb-submit-btn" class="retro-btn">Sign Guestbook</button>
                    </div>
                    <div id="gb-entries-list" style="font-size: 11px;"></div>
                </div>
            `,
            'http://www.underconstruction.com/': `
                <div class="retro-webpage" style="text-align: center; padding: 25px 10px;">
                    <div style="font-size: 32px; margin-bottom: 10px;">🚧 ⚠️ 🚧</div>
                    <h2 style="color: #c00000; font-family:'Comic Sans MS', sans-serif; font-size: 16px;">DAVE'S GARAGE BAND PAGE</h2>
                    <p style="font-size: 11px; margin: 15px 0;">UNDER HEAVY CONSTRUCTION! Hammering the HTML together right now.</p>
                    <p style="font-size: 11px;">Demo cassette tape coming out as soon as we record in Suvin's basement!</p>
                    <div style="margin-top: 25px; padding: 8px; display: inline-block; background: #000; color: #00ff00; font-family: monospace; border: 2px outset #c0c0c0;">
                        VISITOR HIT COUNTER: [ 0 0 0 0 4 2 ]
                    </div>
                </div>
            `
        };
    }

    init() {
        this.urlInput = document.getElementById('browser-url');
        this.viewportEl = document.getElementById('browser-viewport');
        this.statusTextEl = document.getElementById('browser-status-text');

        const btnBack = document.getElementById('browser-btn-back');
        const btnFwd = document.getElementById('browser-btn-forward');
        const btnHome = document.getElementById('browser-btn-home');
        const btnGo = document.getElementById('browser-btn-go');

        if (btnBack) {
            btnBack.addEventListener('click', () => {
                window.retroSound.click();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.loadUrl(this.history[this.historyIndex], false);
                }
            });
        }

        if (btnFwd) {
            btnFwd.addEventListener('click', () => {
                window.retroSound.click();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.loadUrl(this.history[this.historyIndex], false);
                }
            });
        }

        if (btnHome) {
            btnHome.addEventListener('click', () => {
                window.retroSound.click();
                this.loadUrl('http://www.retrosearch.net/');
            });
        }

        if (btnGo && this.urlInput) {
            btnGo.addEventListener('click', () => {
                window.retroSound.click();
                this.loadUrl(this.urlInput.value);
            });
            this.urlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    window.retroSound.click();
                    this.loadUrl(this.urlInput.value);
                }
            });
        }

        this.loadUrl(this.currentUrl);
    }

    loadUrl(url, addToHistory = true) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }

        this.currentUrl = url;
        if (this.urlInput) this.urlInput.value = url;

        if (addToHistory) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(url);
            this.historyIndex = this.history.length - 1;
        }

        if (this.statusTextEl) {
            this.statusTextEl.textContent = `Connecting to ${url}...`;
        }

        // Show page content
        setTimeout(() => {
            if (!this.viewportEl) return;
            const content = this.pages[url] || `
                <div class="retro-webpage">
                    <h2 style="color: #c00000;">404 Not Found</h2>
                    <p>The server could not locate URL: <code>${url}</code></p>
                    <p><a href="#" class="web-link" data-url="http://www.retrosearch.net/">Return to RetroSearch Directory</a></p>
                </div>
            `;

            this.viewportEl.innerHTML = content;
            if (this.statusTextEl) this.statusTextEl.textContent = 'Document: Done';

            this.bindPageLinks();
            this.bindPageActions(url);
        }, 150);
    }

    bindPageLinks() {
        if (!this.viewportEl) return;
        const links = this.viewportEl.querySelectorAll('.web-link');
        links.forEach(l => {
            l.addEventListener('click', (e) => {
                e.preventDefault();
                window.retroSound.click();
                this.loadUrl(l.dataset.url);
            });
        });
    }

    bindPageActions(url) {
        if (url.includes('SuvinLair98')) {
            const dialupBtn = document.getElementById('btn-trigger-dialup');
            const statusMsg = document.getElementById('dialup-status-msg');
            if (dialupBtn) {
                dialupBtn.addEventListener('click', () => {
                    dialupBtn.disabled = true;
                    if (statusMsg) statusMsg.textContent = 'Dialing ISP (555-0199)...';
                    window.retroSound.dialUpConnect(() => {
                        if (statusMsg) statusMsg.textContent = 'CONNECTED AT 57,600 BPS!';
                        dialupBtn.disabled = false;
                    });
                });
            }
        } else if (url === 'http://www.retrosearch.net/') {
            const searchInput = document.getElementById('browser-search-query');
            const searchBtn = document.getElementById('browser-search-submit');
            const resultsEl = document.getElementById('browser-search-results');

            const doSearch = () => {
                const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
                if (!resultsEl) return;
                window.retroSound.click();

                if (!q) {
                    resultsEl.innerHTML = '<p style="color:red;">Please enter a search term.</p>';
                    return;
                }

                resultsEl.innerHTML = `
                    <div style="border-top: 1px solid #ccc; padding-top: 8px;">
                        <b>Search results for: "${q}"</b> (3 items found)
                        <div style="margin: 8px 0;">
                            <a href="#" class="web-link" data-url="http://www.geocities.com/SunsetStrip/SuvinLair98/"><b>Suvin's Cyber Lair 1998</b></a><br>
                            <span>Personal homepage with band recommendations, 56k dial-up sounds, and specs.</span>
                        </div>
                        <div style="margin: 8px 0;">
                            <a href="#" class="web-link" data-url="http://www.guestbook.org/"><b>Suvin's Cyber Guestbook</b></a><br>
                            <span>Leave a message for fellow retro explorers across cyberspace.</span>
                        </div>
                        <div style="margin: 8px 0;">
                            <a href="#" class="web-link" data-url="http://www.underconstruction.com/"><b>Dave's Garage Band Page</b></a><br>
                            <span>Demo cassette tape announcements and animated construction GIFs.</span>
                        </div>
                    </div>
                `;
                this.bindPageLinks();
            };

            if (searchBtn) searchBtn.addEventListener('click', doSearch);
            if (searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') doSearch();
                });
            }
        } else if (url === 'http://www.guestbook.org/') {
            this.renderGuestbookEntries();
            const submitBtn = document.getElementById('gb-submit-btn');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    const nameInput = document.getElementById('gb-input-name');
                    const msgInput = document.getElementById('gb-input-msg');
                    const name = nameInput.value.trim() || 'Anonymous Netizen';
                    const msg = msgInput.value.trim();

                    if (!msg) {
                        alert('Please enter a message!');
                        return;
                    }

                    window.retroSound.floppySeek();
                    this.saveGuestbookEntry(name, msg);
                    msgInput.value = '';
                    this.renderGuestbookEntries();
                });
            }
        }
    }

    getGuestbookEntries() {
        const stored = localStorage.getItem('nexus_guestbook');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        return [
            { name: 'Dave (4th Period Gym)', msg: 'Yo Suvin! Sick webpage man. Don\'t forget to bring the Doom II floppy to school tomorrow!', date: '10/24/1998 16:32' },
            { name: 'Sarah_K98', msg: 'Hey Suvin :) Cool site! Did you figure out question 5 on the social studies worksheet?', date: '10/23/1998 18:04' },
            { name: 'xX_ShadowNinja_Xx', msg: 'A/S/L??? Just kidding! Love the 8-bit tunes. Dial-Up Screams is a rad band name.', date: '10/22/1998 21:15' },
            { name: 'CyberSurfer99', msg: 'Gotta log off, my sister is screaming that she needs the phone line. 10/10 GeoCities lair!', date: '10/20/1998 19:40' }
        ];
    }

    saveGuestbookEntry(name, msg) {
        const entries = this.getGuestbookEntries();
        const dateStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        entries.unshift({ name, msg, date: dateStr });
        localStorage.setItem('nexus_guestbook', JSON.stringify(entries.slice(0, 15)));
    }

    renderGuestbookEntries() {
        const listEl = document.getElementById('gb-entries-list');
        if (!listEl) return;

        const entries = this.getGuestbookEntries();
        listEl.innerHTML = entries.map(e => `
            <div style="border-left: 3px solid #000080; padding-left: 8px; margin-bottom: 10px; background: #f0f0f0; padding: 6px;">
                <b>${this.escapeHtml(e.name)}</b> <span style="color:#777; font-size:10px;">on ${e.date}</span><br>
                <span>${this.escapeHtml(e.msg)}</span>
            </div>
        `).join('');
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

window.retroBrowser = new RetroBrowser();
