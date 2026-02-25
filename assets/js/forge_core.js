/**
 * SilenVault | Forge Core Engine
 * Handled via dynamic script injection. Contains Virus Decay, Terminal, Reboot, and D2 SPA Router.
 */

(function initForgeCore() {
    if(window.ForgeCoreInitialized) return;
    window.ForgeCoreInitialized = true;

    let isTerminalActive = true;
    let glitchCssIntervals = [];

    // --- 1. D2 SPA ROUTER & PAYLOADS ---
    // Here is where you add more pages. Just write the HTML locally, base64 it, and add it here.
    const D2_ROUTES = {
        "home": btoa(encodeURIComponent(`
            <div class="fixed inset-0 z-[-10]" style="background-color: #06010a; background-image: radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.2) 0%, transparent 80%), linear-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px); background-size: 100% 100%, 50px 50px, 50px 50px; background-position: center top, center center, center center;"></div>
            <div class="absolute inset-0 w-full min-h-screen z-50 flex flex-col items-center justify-center px-4" style="animation: d2-arrive 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                <button onclick="window.location.reload()" class="absolute top-8 left-8 text-xs font-mono text-[#d8b4fe] border border-[#a855f7]/50 bg-[#140523]/70 px-4 py-2 hover:bg-[#a855f7]/20 transition-all uppercase tracking-widest backdrop-blur-md" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">&lt; System Reboot</button>
                <div class="text-center mb-10 w-full max-w-5xl px-4 md:px-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mt-16 md:mt-0">
                    <div class="text-center md:text-left">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ec4899]/20 border border-[#ec4899] text-[#ec4899] text-[10px] font-mono tracking-widest uppercase mb-4" style="clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);">
                            <span class="w-1.5 h-1.5 bg-[#ec4899] animate-ping"></span> Live Schematic
                        </div>
                        <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-[#faf5ff] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">THE FORGE</h1>
                    </div>
                    <div class="text-center md:text-right font-mono text-[#a855f7] text-[10px] md:text-xs opacity-60 leading-relaxed border border-[#a855f7]/30 p-2 bg-[#a855f7]/5">
                        STATUS: ENCRYPTED<br>UPLINK: SEVERED<br>AUTH: FORGE_SMITH
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-6 max-w-5xl w-full px-4 md:px-8">
                    <div class="p-6 md:p-8 bg-[#0a020f]/80 border border-[#a855f7]/40 border-t-[3px] border-t-[#22d3ee] relative transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)] hover:border-[#22d3ee] cursor-pointer backdrop-blur-md" style="clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));">
                        <h3 class="font-mono text-[#22d3ee] font-bold text-lg md:text-xl mb-3">> HIRE_ARCHITECT.sh</h3>
                        <p class="text-[#d8b4fe] text-xs md:text-sm leading-relaxed mb-6 font-mono opacity-80">Execute bespoke local-first software engineering protocols. Deploy isolated WebAssembly components.</p>
                        <button onclick="window.navigateD2('architect')" class="bg-[#a855f7]/10 border border-[#a855f7] text-[#a855f7] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 md:px-6 md:py-3 transition-all hover:bg-[#a855f7] hover:text-[#000] hover:shadow-[0_0_20px_#a855f7]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">Initialize Request</button>
                    </div>
                    <div class="p-6 md:p-8 bg-[#0a020f]/80 border border-[#a855f7]/40 border-t-[3px] border-t-[#ec4899] relative transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] hover:border-[#ec4899] cursor-pointer backdrop-blur-md" style="clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);">
                        <h3 class="font-mono text-[#ec4899] font-bold text-lg md:text-xl mb-3">> BLACK_MARKET.exe</h3>
                        <p class="text-[#d8b4fe] text-xs md:text-sm leading-relaxed mb-6 font-mono opacity-80">Acquire unlisted UI boilerplates, experimental alpha-stage algorithms, and encrypted data modules.</p>
                        <button onclick="window.navigateD2('market')" class="bg-[#ec4899]/10 border border-[#ec4899] text-[#ec4899] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 md:px-6 md:py-3 transition-all hover:bg-[#ec4899] hover:text-[#000] hover:shadow-[0_0_20px_#ec4899]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">Access Registry</button>
                    </div>
                </div>
            </div>
            <style>@keyframes d2-arrive { 0% { opacity: 0; transform: scale(0.5); filter: blur(20px); } 100% { opacity: 1; transform: scale(1); filter: blur(0); } }</style>
        `)),

        "architect": btoa(encodeURIComponent(`
            <div class="fixed inset-0 z-[-10]" style="background-color: #06010a; background-image: radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.15) 0%, transparent 80%), linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px); background-size: 100% 100%, 50px 50px, 50px 50px; background-position: center top, center center, center center;"></div>
            <div class="absolute inset-0 w-full min-h-screen z-50 flex flex-col items-center justify-center px-4">
                <button onclick="window.navigateD2('home')" class="absolute top-8 left-8 text-xs font-mono text-[#22d3ee] border border-[#22d3ee]/50 bg-[#021015]/70 px-4 py-2 hover:bg-[#22d3ee]/20 transition-all uppercase tracking-widest backdrop-blur-md" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">&lt; Back</button>
                <h1 class="text-4xl font-black text-[#22d3ee] font-mono mb-4">> ARCHITECT_TERMINAL</h1>
                <p class="text-[#d8b4fe] font-mono">Development Sandbox Under Construction.</p>
            </div>
        `)),

        "market": btoa(encodeURIComponent(`
            <div class="fixed inset-0 z-[-10]" style="background-color: #06010a; background-image: radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 80%), linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px); background-size: 100% 100%, 50px 50px, 50px 50px; background-position: center top, center center, center center;"></div>
            <div class="absolute inset-0 w-full min-h-screen z-50 flex flex-col items-center justify-center px-4">
                <button onclick="window.navigateD2('home')" class="absolute top-8 left-8 text-xs font-mono text-[#ec4899] border border-[#ec4899]/50 bg-[#15020a]/70 px-4 py-2 hover:bg-[#ec4899]/20 transition-all uppercase tracking-widest backdrop-blur-md" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">&lt; Back</button>
                <h1 class="text-4xl font-black text-[#ec4899] font-mono mb-4">> ASSET_MARKETPLACE</h1>
                <p class="text-[#d8b4fe] font-mono">Marketplace Under Construction.</p>
            </div>
        `))
    };

    // Global router function available to buttons inside D2
    window.navigateD2 = function(route) {
        if (route === 'home') {
            // Load the Base64 Main Menu
            document.body.innerHTML = decodeURIComponent(atob(D2_ROUTES['home']));
        } 
        else if (route === 'market') {
            // JS MODULE METHOD: Dynamically fetch the script, then execute it
            document.body.innerHTML = `<div class="fixed inset-0 bg-[#06010a] flex items-center justify-center text-[#ec4899] font-mono text-sm uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</div>`;
            
            if (!document.getElementById('forge-market-script')) {
                const script = document.createElement('script');
                script.id = 'forge-market-script';
                script.src = 'assets/js/forge/black_market.js';
                script.onload = () => window.ForgeBlackMarket.mount(); // Run it once loaded
                document.head.appendChild(script);
            } else {
                // If it was already loaded previously, just mount it instantly
                window.ForgeBlackMarket.mount();
            }
        }
        else if (route === 'architect') {
            // You will build architect.js exactly like black_market.js later!
            document.body.innerHTML = `<div class="fixed inset-0 bg-[#06010a] flex items-center justify-center text-[#22d3ee] font-mono">> ARCHITECT OFFLINE.</div><button class="fixed top-8 left-8 text-white font-mono border p-2" onclick="window.navigateD2('home')">Back</button>`;
        }
    };


    // --- 2. MOUNT DYNAMIC VFX CSS ---
    const forgeStyles = document.createElement('style');
    forgeStyles.innerHTML = `
        body.system-virus .fixed-bg { filter: hue-rotate(240deg) contrast(1.8) saturate(1.5); }
        body.system-virus .blob-1 { background: rgba(168, 85, 247, 0.4); transform: scale(1.5); }
        body.system-virus .blob-2 { background: rgba(236, 72, 153, 0.4); transform: scale(1.5); }
        body.system-virus .bg-crest { opacity: 0; transform: scale(1.5) rotate(15deg); filter: blur(10px); }
        body.system-virus .glitch-target { transition: color 0.5s; }
        
        #terminal-overlay { position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index: 50; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); padding: 16px; }
        .cyber-window { background: rgba(10, 2, 15, 0.8); backdrop-filter: blur(20px); border: 1px solid #a855f7; border-top: 3px solid #ec4899; box-shadow: 0 0 50px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1); width: 100%; max-width: 600px; display: flex; flex-direction: column; padding: 30px; transform: scale(0.95) translateY(20px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px)); }
        body.terminal-active .cyber-window { transform: scale(1) translateY(0); pointer-events: auto; }
        .term-body { font-family: 'Fira Code', monospace; font-size: 14px; line-height: 1.8; color: #d8b4fe; min-height: 120px; text-align: left; }
        .term-highlight { color: #ec4899; font-weight: bold; text-shadow: 0 0 8px rgba(236,72,153,0.5); }
        .term-cyan { color: #22d3ee; }
        .term-input-line { display: flex; align-items: center; gap: 12px; margin-top: 16px; animation: fade-in 0.5s forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .term-action-btn { background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7; color: #a855f7; font-family: 'Fira Code', monospace; font-size: 12px; font-weight: bold; cursor: pointer; transition: all 0.3s; padding: 8px 16px; text-transform: uppercase; letter-spacing: 2px; }
        .term-action-btn:hover { background: #a855f7; color: #000; box-shadow: 0 0 15px rgba(168, 85, 247, 0.5); transform: translateY(-2px); }
        .term-action-btn.abort { border-color: #ec4899; color: #ec4899; background: transparent; }
        .term-action-btn.abort:hover { background: rgba(236, 72, 153, 0.2); box-shadow: none; color: #ec4899; }
        
        body.terminal-warp .cyber-window { animation: terminal-dive 0.8s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
        @keyframes terminal-dive { 0% { transform: scale(1); opacity: 1; filter: blur(0); } 100% { transform: scale(3) translateZ(500px); opacity: 0; filter: blur(20px); } }

        body.crt-snap { animation: crt-off 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes crt-off { 0% { transform: scale(1, 1); filter: brightness(1); } 40% { transform: scale(1, 0.005); filter: brightness(5); background: #fff; } 100% { transform: scale(0, 0.005); filter: brightness(10); background: #000; } }
        body.crt-on { animation: crt-on 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes crt-on { 0% { transform: scale(0, 0.005); filter: brightness(10); } 40% { transform: scale(1, 0.005); filter: brightness(5); } 100% { transform: scale(1, 1); filter: brightness(1); } }
        body.magic-build .tool-card { animation: block-assemble 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        body.magic-build .tool-card:nth-child(1n) { animation-delay: 0.05s; }
        body.magic-build .tool-card:nth-child(2n) { animation-delay: 0.15s; }
        body.magic-build .tool-card:nth-child(3n) { animation-delay: 0.1s; }
        @keyframes block-assemble { 0% { transform: translate3d(0, -100px, 400px) rotateX(45deg); opacity: 0; filter: blur(10px); border-color: #00ff41; box-shadow: 0 0 20px rgba(0,255,65,0.4); } 100% { transform: translate3d(0, 0, 0) rotateX(0); opacity: 1; filter: blur(0); } }

        #dimensional-dive { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .warp-ring { position: absolute; border-radius: 50%; border: 2px solid #a855f7; box-shadow: 0 0 50px #a855f7, inset 0 0 50px #ec4899; transform: scale(0); opacity: 0; }
        body.tunnel-active .warp-ring { animation: warp-shoot 0.8s cubic-bezier(0.8, 0, 0.2, 1) forwards; }
        body.tunnel-active .warp-ring:nth-child(2) { animation-delay: 0.1s; border-color: #22d3ee; box-shadow: 0 0 50px #22d3ee; border-width: 4px; }
        body.tunnel-active .warp-ring:nth-child(3) { animation-delay: 0.2s; border-color: #ec4899; box-shadow: 0 0 100px #ec4899; border-width: 8px; }
        @keyframes warp-shoot { 0% { transform: scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(12); opacity: 0; } }
        #burnout-flash { position: fixed; inset: 0; background: #fff; z-index: 100000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease-out; }
    `;
    document.head.appendChild(forgeStyles);

    // --- 3. MOUNT TERMINAL HTML ---
    const termDiv = document.createElement('div');
    termDiv.id = 'terminal-overlay';
    termDiv.innerHTML = `
        <div class="cyber-window">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-[#a855f7]/30">
                <div class="w-2.5 h-2.5 bg-[#ec4899] animate-pulse rounded-sm"></div>
                <span class="text-xs font-mono text-[#ec4899] tracking-[0.2em] font-bold uppercase">System Override</span>
            </div>
            <div class="term-body" id="term-body"></div>
            <div id="term-actions"></div>
        </div>
    `;
    document.body.appendChild(termDiv);

    const diveDiv = document.createElement('div');
    diveDiv.id = 'dimensional-dive';
    diveDiv.innerHTML = `<div class="warp-ring w-64 h-64"></div><div class="warp-ring w-96 h-96"></div><div class="warp-ring w-[600px] h-[600px]"></div>`;
    document.body.appendChild(diveDiv);

    const flashDiv = document.createElement('div');
    flashDiv.id = 'burnout-flash';
    document.body.appendChild(flashDiv);

    // --- 4. VIRUS EXECUTION LOGIC ---
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        document.body.classList.add('system-virus');
        
        ['seo-article', 'main-footer', 'marquee-section', 'hero-search'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.opacity = '0';
        });

        const elements = document.querySelectorAll('.glitch-target');
        elements.forEach((el) => {
            const transX = Math.random() * 200 - 100;
            const transY = Math.random() * 600 + 200;
            const rotZ = Math.random() * 90 - 45;
            const delay = Math.random() * 1.5;
            const duration = 1.5 + Math.random() * 2;
            
            el.style.transition = `all ${duration}s cubic-bezier(0.55, 0.085, 0.68, 0.53) ${delay}s`;
            
            if(el.children.length === 0 || el.tagName === 'H1' || el.tagName === 'P' || el.tagName === 'H3' || el.tagName === 'H2') {
                scrambleTextRandomly(el);
            }
            if (el.classList.contains('tool-card')) {
                setTimeout(() => {
                    el.style.transform = `translate(${transX}px, ${transY}px) rotate(${rotZ}deg) scale(0.6)`;
                    el.style.opacity = '0';
                    el.style.filter = `blur(${Math.random() * 10 + 5}px)`;
                }, 50);
            }
        });

        setTimeout(triggerTerminal, 2000);
    }, 800);

    function scrambleTextRandomly(element) {
        if(!element) return;
        const originalText = element.innerText;
        if(!originalText.trim()) return;
        element.dataset.original = originalText;
        const chars = "!<>-_\\\\/[]{}—=+*^?#_01X";
        let textArr = originalText.split('');
        let corrupted = [...textArr];
        let glitchId = setInterval(() => {
            for(let i=0; i<2; i++) {
                let idx = Math.floor(Math.random() * corrupted.length);
                if(corrupted[idx] !== ' ' && corrupted[idx] !== '\n') corrupted[idx] = chars[Math.floor(Math.random() * chars.length)];
            }
            element.innerText = corrupted.join('');
        }, 50);
        glitchCssIntervals.push({id: glitchId, el: element});
    }

    function triggerTerminal() {
        const overlay = document.getElementById('terminal-overlay');
        const termBody = document.getElementById('term-body');
        const termActions = document.getElementById('term-actions');
        
        overlay.style.opacity = '1'; 
        document.body.classList.add('terminal-active');
        document.body.style.overflow = 'hidden';
        
        const typingSequence = [
            { text: "> SYSTEM INTEGRITY COMPROMISED", class: "term-highlight" },
            { text: "> UNAUTHORIZED DOM MANIPULATION DETECTED", class: "text-white" },
            { text: "> MEMORY ALLOCATION FAILING...", class: "text-white" },
            { text: "> INITIATING CRYPTO-DISSOLVE PROTOCOL", class: "term-cyan" },
            { text: "> PROCEED TO THE FORGE? [Y/N]", class: "text-[#faf5ff] font-bold mt-4" }
        ];
        
        let lineIdx = 0;
        function processNextLine() {
            if(lineIdx >= typingSequence.length) {
                termActions.innerHTML = `
                    <div class="term-input-line">
                        <button class="term-action-btn" id="btn-auth">Authorize [Y]</button>
                        <button class="term-action-btn abort" id="btn-abort">Reboot [N]</button>
                    </div>
                `;
                document.getElementById('btn-auth').addEventListener('click', executeWarp);
                document.getElementById('btn-abort').addEventListener('click', executeReboot);
                window.addEventListener('keydown', handleTerminalInput);
                return;
            }
            let lineData = typingSequence[lineIdx];
            let div = document.createElement('div');
            div.className = lineData.class || '';
            termBody.appendChild(div);
            
            let charIdx = 0;
            function typeChar() {
                if(charIdx < lineData.text.length) {
                    div.innerHTML += lineData.text.charAt(charIdx);
                    charIdx++;
                    setTimeout(typeChar, 10 + Math.random() * 20); 
                } else {
                    lineIdx++;
                    setTimeout(processNextLine, 200); 
                }
            }
            typeChar();
        }
        setTimeout(processNextLine, 600);
    }

    function handleTerminalInput(e) {
        const key = e.key.toLowerCase();
        if (key === 'y' || key === 'n') {
            window.removeEventListener('keydown', handleTerminalInput);
            if (key === 'y') executeWarp();
            else executeReboot();
        }
    }

    function executeReboot() {
        window.removeEventListener('keydown', handleTerminalInput);
        glitchCssIntervals.forEach(obj => clearInterval(obj.id));
        glitchCssIntervals = [];

        const overlay = document.getElementById('terminal-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.classList.add('hidden'); document.body.classList.remove('terminal-active'); }, 300);

        document.body.classList.add('crt-snap');
        
        setTimeout(() => {
            document.body.classList.remove('system-virus', 'crt-snap');
            
            ['seo-article', 'main-footer', 'marquee-section', 'hero-search'].forEach(id => {
                const el = document.getElementById(id);
                if(el) el.style.opacity = '1';
            });

            const elements = document.querySelectorAll('.glitch-target');
            elements.forEach((el) => {
                el.style.transition = 'none'; 
                el.style.transform = ''; 
                el.style.opacity = '1';
                el.style.filter = '';
                if (el.classList.contains('tool-card')) el.style.borderColor = '';
                if(el.dataset.original) el.innerText = el.dataset.original;
            });

            document.getElementById('tomb-s').style.color = ''; 
            document.getElementById('tomb-v').style.color = '';
            document.body.style.overflow = '';
            window.ForgeCoreInitialized = false;

            document.body.classList.add('crt-on', 'magic-build');
            setTimeout(() => document.body.classList.remove('crt-on', 'magic-build'), 1500);

        }, 300); 
    }

    function executeWarp() {
        window.removeEventListener('keydown', handleTerminalInput);
        document.getElementById('term-actions').innerHTML = ''; 
        document.querySelector('.cyber-window').style.borderColor = '#22d3ee';
        
        setTimeout(() => {
            document.body.classList.add('tunnel-active');
            setTimeout(() => {
                const flash = document.getElementById('burnout-flash');
                flash.style.opacity = '1';
                glitchCssIntervals.forEach(obj => clearInterval(obj.id));
                
                setTimeout(() => {
                    window.navigateD2('home');
                    document.body.appendChild(flash); 
                    setTimeout(() => {
                        flash.style.opacity = '0';
                        setTimeout(() => flash.remove(), 500);
                    }, 150);
                }, 150);
            }, 700); 
        }, 300); 
    }
})();
