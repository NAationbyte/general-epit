/**
 * GenerálÉpít — Chat Widget
 * Orange/dark theme, Hungarian, construction/renovation
 */
(function() {
    'use strict';

    const CONFIG = {
        color: '#E8671A',
        colorDark: '#c45510',
        bg: '#111827',
        bgCard: '#1f2937',
        title: 'GenerálÉpít Asszisztens',
        phone: '+36308735288',
    };

    let isOpen = false;
    let messages = [];

    const style = document.createElement('style');
    style.textContent = `
        #ge-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; }

        #ge-bubble {
            position: fixed; bottom: 5.5rem; right: 1.5rem;
            width: 58px; height: 58px; border-radius: 50%;
            background: ${CONFIG.bg}; border: 2px solid ${CONFIG.color};
            color: white; cursor: pointer; z-index: 998;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.35);
            transition: all 0.3s cubic-bezier(.4,0,.2,1);
            font-size: 1.4rem;
        }
        #ge-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(232,103,26,0.4); }

        .ge-dot {
            position: absolute; top: -2px; right: -2px;
            width: 16px; height: 16px; border-radius: 50%;
            background: #4ade80; border: 2px solid ${CONFIG.bg};
            animation: ge-pulse 2s infinite;
        }
        @keyframes ge-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }

        #ge-chat {
            position: fixed; bottom: 11rem; right: 1.5rem;
            width: 350px; max-width: calc(100vw - 2rem);
            height: 500px; max-height: calc(100vh - 200px);
            background: #fff; border-radius: 18px; z-index: 999;
            display: flex; flex-direction: column; overflow: hidden;
            box-shadow: 0 16px 64px rgba(0,0,0,0.18);
            opacity: 0; visibility: hidden; transform: translateY(16px) scale(0.96);
            transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        #ge-chat.open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }

        .ge-header {
            background: ${CONFIG.bg};
            padding: 14px 16px;
            display: flex; align-items: center; gap: 12px;
            flex-shrink: 0;
        }
        .ge-header-avatar {
            width: 38px; height: 38px; border-radius: 50%;
            background: ${CONFIG.color};
            display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 0.82rem; color: #fff; flex-shrink: 0;
        }
        .ge-header-info { flex: 1; }
        .ge-header-title { font-size: 13px; font-weight: 700; color: #fff; }
        .ge-header-status {
            font-size: 11px; color: #4ade80; margin-top: 2px;
            display: flex; align-items: center; gap: 4px;
        }
        .ge-header-status::before {
            content: ''; width: 6px; height: 6px; border-radius: 50%;
            background: #4ade80; display: inline-block;
        }
        .ge-close {
            background: none; border: 1px solid rgba(255,255,255,0.15);
            color: #9ca3af; cursor: pointer; font-size: 12px;
            padding: 5px 9px; border-radius: 6px; transition: all 0.2s;
        }
        .ge-close:hover { color: #fff; border-color: rgba(255,255,255,0.4); }

        .ge-messages {
            flex: 1; overflow-y: auto; padding: 14px;
            display: flex; flex-direction: column; gap: 8px;
            background: #fff; scroll-behavior: smooth;
        }
        .ge-messages::-webkit-scrollbar { width: 3px; }
        .ge-messages::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

        .ge-msg {
            max-width: 85%; padding: 10px 14px;
            border-radius: 14px; font-size: 13px; line-height: 1.6;
            animation: ge-fadeIn 0.25s ease; word-wrap: break-word;
        }
        @keyframes ge-fadeIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }

        .ge-msg.bot {
            background: #f3f4f6; color: #111827;
            border-bottom-left-radius: 4px; align-self: flex-start;
        }
        .ge-msg.user {
            background: ${CONFIG.color}; color: #fff;
            border-bottom-right-radius: 4px; align-self: flex-end;
        }
        .ge-msg a { color: inherit; font-weight: 700; }

        .ge-typing {
            display: flex; gap: 4px; padding: 10px 14px;
            background: #f3f4f6; border-radius: 14px; border-bottom-left-radius: 4px;
            align-self: flex-start;
        }
        .ge-typing span {
            width: 6px; height: 6px; border-radius: 50%;
            background: #9ca3af; animation: ge-bounce 1.3s infinite;
        }
        .ge-typing span:nth-child(2){animation-delay:.15s}
        .ge-typing span:nth-child(3){animation-delay:.3s}
        @keyframes ge-bounce { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-6px);opacity:1} }

        .ge-qrs { display: flex; flex-wrap: wrap; gap: 5px; padding: 4px 0; }
        .ge-qr {
            padding: 6px 12px; border-radius: 20px;
            background: #fff; color: ${CONFIG.color};
            border: 1.5px solid #e5e7eb;
            font-size: 12px; cursor: pointer; transition: all 0.15s;
            font-family: inherit;
        }
        .ge-qr:hover { background: #fff3ec; border-color: ${CONFIG.color}; }

        .ge-input-area {
            display: flex; gap: 8px;
            padding: 10px 12px;
            border-top: 1px solid #e5e7eb; background: #fff; flex-shrink: 0;
        }
        .ge-input {
            flex: 1; border: 1.5px solid #e5e7eb;
            border-radius: 22px; padding: 9px 14px; font-size: 13px;
            font-family: inherit; outline: none; color: #111827;
            transition: border-color 0.2s;
        }
        .ge-input:focus { border-color: ${CONFIG.color}; }
        .ge-input::placeholder { color: #9ca3af; }

        .ge-send {
            width: 38px; height: 38px; border-radius: 50%;
            background: ${CONFIG.color}; border: none;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 0.95rem; color: #fff; transition: all 0.2s; flex-shrink: 0;
        }
        .ge-send:hover { background: ${CONFIG.colorDark}; transform: scale(1.08); }
        .ge-send:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

        @media (max-width: 480px) {
            #ge-chat { bottom:0; right:0; left:0; top:0; width:100%; max-width:100%; height:100%; max-height:100%; border-radius:0; }
            #ge-bubble { bottom: 5rem; right: 1rem; }
        }
    `;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'ge-widget';
    widget.innerHTML = `
        <button id="ge-bubble" onclick="window.__geToggle()">
            💬
            <span class="ge-dot"></span>
        </button>
        <div id="ge-chat">
            <div class="ge-header">
                <div class="ge-header-avatar">GÉ</div>
                <div class="ge-header-info">
                    <div class="ge-header-title">${CONFIG.title}</div>
                    <div class="ge-header-status">Elérhető most</div>
                </div>
                <button class="ge-close" onclick="window.__geToggle()">✕</button>
            </div>
            <div class="ge-messages" id="ge-messages"></div>
            <div class="ge-input-area">
                <input class="ge-input" id="ge-input" placeholder="Írjon üzenetet..." autocomplete="off">
                <button class="ge-send" id="ge-send" onclick="window.__geSend()">➤</button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    const replies = {
        greeting: [
            { text: 'Szia! 👋 Miben segíthetek? Válasszon az alábbi témák közül, vagy írja le kérdését!', qr: ['💰 Árajánlat', '📏 Ingyenes felmérés', '⏱️ Mikor tudnak jönni?', '🛡️ Garancia', '🔧 Mit vállalnak?'] },
        ],
        ar: [
            { text: '💰 Árajánlathoz ingyenes helyszíni felmérés szükséges. Hívjon minket és megbeszéljük az időpontot!<br><br>📞 <a href="tel:+36308735288">+36 30 873 5288</a>', qr: ['📏 Ingyenes felmérés', '⏱️ Mikor tudnak jönni?'] },
        ],
        felmeres: [
            { text: '📏 A helyszíni felmérés teljesen <b>ingyenes és kötelezettségmentes!</b> Hívjon, és 1-2 napon belül ki tudunk menni Önhöz.<br><br>📞 <a href="tel:+36308735288">+36 30 873 5288</a>', qr: ['💰 Árajánlat', '⏱️ Mikor tudnak jönni?'] },
        ],
        mikor: [
            { text: '⏱️ Általában <b>3–7 munkanapon belül</b> tudunk kezdeni. Sürgős esetben hamarabb is egyeztethetünk!<br><br>📞 <a href="tel:+36308735288">+36 30 873 5288</a>', qr: ['💰 Árajánlat', '📏 Ingyenes felmérés'] },
        ],
        garancia: [
            { text: '🛡️ Minden elvégzett munkára <b>garanciát vállalunk.</b> A garancia részleteit az írásos árajánlatban rögzítjük – nincs meglepetés.<br><br>📞 <a href="tel:+36308735288">+36 30 873 5288</a>', qr: ['💰 Árajánlat', '🔧 Mit vállalnak?'] },
        ],
        tobb: [
            { text: '🔧 <b>Amit vállalunk:</b><br><br>🪟 Ablakcsere & nyílászáró beépítés<br>🎨 Festés & mázolás<br>🔲 Gipszkarton szerkezetek<br>🔷 Burkolás (padló, fal, csempe)<br>⚡ Villanyszerelés<br><br>Komplett felújítást is vállalunk – egyszerre, egy kézből!', qr: ['💰 Árajánlat', '📏 Ingyenes felmérés'] },
        ],
        fallback: [
            { text: 'Köszönöm a kérdést! A legpontosabb választ kollégáink tudják megadni személyesen. Hívjon minket bátran:<br><br>📞 <a href="tel:+36308735288">+36 30 873 5288</a>', qr: ['💰 Árajánlat', '🔧 Mit vállalnak?', '📏 Ingyenes felmérés'] },
        ],
    };

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function getDemoReply(text) {
        const l = text.toLowerCase();
        if (/^(szia|hello|hi|üdv|helló|jó|segítség)/.test(l)) return pick(replies.greeting);
        if (l.includes('ár') || l.includes('árajánlat') || l.includes('mennyibe') || l.includes('költség') || l.includes('ajánlat')) return pick(replies.ar);
        if (l.includes('felmér') || l.includes('ingyenes') || l.includes('kimenn')) return pick(replies.felmeres);
        if (l.includes('mikor') || l.includes('hamar') || l.includes('időpont') || l.includes('jönni') || l.includes('kezd')) return pick(replies.mikor);
        if (l.includes('garancia') || l.includes('garanti') || l.includes('szavatoss')) return pick(replies.garancia);
        if (l.includes('mit') || l.includes('vállal') || l.includes('abla') || l.includes('fest') || l.includes('gipsz') || l.includes('burkol') || l.includes('villany')) return pick(replies.tobb);
        if (l.includes('vissza') || l.includes('főmenü') || l.includes('menu')) return pick(replies.greeting);
        return pick(replies.fallback);
    }

    function addMessage(text, type, qrs) {
        const c = document.getElementById('ge-messages');
        const m = document.createElement('div');
        m.className = `ge-msg ${type}`;
        m.innerHTML = text;
        c.appendChild(m);
        if (qrs?.length) {
            const qrDiv = document.createElement('div');
            qrDiv.className = 'ge-qrs';
            qrs.forEach(q => {
                const b = document.createElement('button');
                b.className = 'ge-qr'; b.textContent = q;
                b.onclick = () => { qrDiv.remove(); sendMessage(q); };
                qrDiv.appendChild(b);
            });
            c.appendChild(qrDiv);
        }
        c.scrollTop = c.scrollHeight;
        messages.push({ role: type, content: text });
    }

    function showTyping() {
        const c = document.getElementById('ge-messages');
        const t = document.createElement('div');
        t.className = 'ge-typing'; t.id = 'ge-typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        c.appendChild(t); c.scrollTop = c.scrollHeight;
    }
    function hideTyping() { const e = document.getElementById('ge-typing'); if(e) e.remove(); }

    async function sendMessage(text) {
        addMessage(text, 'user');
        const input = document.getElementById('ge-input');
        const btn = document.getElementById('ge-send');
        input.value = ''; input.disabled = true; btn.disabled = true;
        showTyping();
        await new Promise(r => setTimeout(r, 400 + Math.random() * 500));
        hideTyping();
        const r = getDemoReply(text);
        addMessage(r.text, 'bot', r.qr);
        input.disabled = false; btn.disabled = false; input.focus();
    }

    window.__geToggle = function() {
        isOpen = !isOpen;
        document.getElementById('ge-chat').classList.toggle('open', isOpen);
        if (isOpen) {
            document.querySelector('.ge-dot').style.display = 'none';
            if (messages.length === 0) {
                setTimeout(() => {
                    showTyping();
                    setTimeout(() => {
                        hideTyping();
                        const g = pick(replies.greeting);
                        addMessage(g.text, 'bot', g.qr);
                    }, 600);
                }, 200);
            }
            setTimeout(() => document.getElementById('ge-input').focus(), 300);
        }
    };

    window.__geSend = function() {
        const input = document.getElementById('ge-input');
        const text = input.value.trim();
        if (text) sendMessage(text);
    };

    document.getElementById('ge-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); window.__geSend(); }
    });
})();
