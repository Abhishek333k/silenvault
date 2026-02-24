/**
 * SilenVault | Forge Protocol Payload
 * Encapsulates the Terminal, VFX, and Dimension 2 HTML/CSS.
 * Mounts dynamically to keep the index.html source completely clean.
 */

window.ForgeProtocol = (function() {
    
    // --- 1. ENCAPSULATED CSS ---
    const forgeCSS = `
        /* Terminal Styles */
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

        /* Dive VFX Styles */
        #dimensional-dive { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .warp-ring { position: absolute; border-radius: 50%; border: 2px solid #a855f7; box-shadow: 0 0 50px #a855f7, inset 0 0 50px #ec4899; transform: scale(0); opacity: 0; }
        body.tunnel-active .warp-ring { animation: warp-shoot 0.8s cubic-bezier(0.8, 0, 0.2, 1) forwards; }
        body.tunnel-active .warp-ring:nth-child(2) { animation-delay: 0.1s; border-color: #22d3ee; box-shadow: 0 0 50px #22d3ee; border-width: 4px; }
        body.tunnel-active .warp-ring:nth-child(3) { animation-delay: 0.2s; border-color: #ec4899; box-shadow: 0 0 100px #ec4899; border-width: 8px; }
        @keyframes warp-shoot { 0% { transform: scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(12); opacity: 0; } }
        #burnout-flash { position: fixed; inset: 0; background: #fff; z-index: 100000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease-out; }

        /* D2 Styles */
        @keyframes d2-arrive { 0% { opacity: 0; transform: scale(0.5); filter: blur(20px); } 100% { opacity: 1; transform: scale(1); filter: blur(0); } }
    `;

    // --- 2. ENCAPSULATED HTML PAYLOADS ---
    const terminalHTML = `
        <div class="cyber-window">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-[#a855f7]/30">
                <div class="w-2.5 h-2.5 bg-[#ec4899] animate-pulse rounded-sm"></div>
                <span class="text-xs font-mono text-[#ec4899] tracking-[0.2em] font-bold uppercase">System Override</span>
            </div>
            <div class="term-body" id="term-body"></div>
            <div id="term-actions"></div>
        </div>
    `;

    const warpHTML = `
        <div class="warp-ring w-64 h-64"></div>
        <div class="warp-ring w-96 h-96"></div>
        <div class="warp-ring w-[600px] h-[600px]"></div>
    `;

    const d2HTML = `
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
                    <button class="bg-[#a855f7]/10 border border-[#a855f7] text-[#a855f7] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 md:px-6 md:py-3 transition-all hover:bg-[#a855f7] hover:text-[#000] hover:shadow-[0_0_20px_#a855f7]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">Initialize Request</button>
                </div>
                <div class="p-6 md:p-8 bg-[#0a020f]/80 border border-[#a855f7]/40 border-t-[3px] border-t-[#ec4899] relative transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] hover:border-[#ec4899] cursor-pointer backdrop-blur-md" style="clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);">
                    <h3 class="font-mono text-[#ec4899] font-bold text-lg md:text-xl mb-3">> BLACK_MARKET.exe</h3>
                    <p class="text-[#d8b4fe] text-xs md:text-sm leading-relaxed mb-6 font-mono opacity-80">Acquire unlisted UI boilerplates, experimental alpha-stage algorithms, and encrypted data modules.</p>
                    <button class="bg-[#ec4899]/10 border border-[#ec4899] text-[#ec4899] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 md:px-6 md:py-3 transition-all hover:bg-[#ec4899] hover:text-[#000] hover:shadow-[0_0_20px_#ec4899]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">Access Registry</button>
                </div>
            </div>
        </div>
    `;

    // --- 3. MOUNTING & EXECUTION LOGIC ---
    let keyListener;

    function handleInput(e) {
        const key = e.key.toLowerCase();
        if (key === 'y' || key === 'n') {
            window.removeEventListener('keydown', handleInput);
            if (key === 'y') executeWarp();
            else executeAbort();
        }
    }

    function executeWarp() {
        if(keyListener) window.removeEventListener('keydown', keyListener);
        document.getElementById('term-actions').innerHTML = ''; 
        document.querySelector('.cyber-window').style.borderColor = '#22d3ee';
        
        setTimeout(() => {
            document.body.classList.add('tunnel-active');
            
            setTimeout(() => {
                const flash = document.getElementById('burnout-flash');
                flash.style.opacity = '1';
                
                // Alert index.html to clear its memory intervals
                if(window.clearD1GlitchMemory) window.clearD1GlitchMemory();
                
                setTimeout(() => {
                    document.body.innerHTML = d2HTML;
                    document.body.appendChild(flash); 
                    
                    setTimeout(() => {
                        flash.style.opacity = '0';
                        setTimeout(() => flash.remove(), 500);
                    }, 150);
                }, 150);
            }, 700); 
        }, 300); 
    }

    function executeAbort() {
        if(keyListener) window.removeEventListener('keydown', keyListener);
        
        const overlay = document.getElementById('terminal-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => { 
            overlay.remove(); 
            document.body.classList.remove('terminal-active'); 
        }, 300);

        // Tell index.html to run the Magic Builder Reboot
        if(window.triggerD1Reboot) window.triggerD1Reboot();
    }

    return {
        mount: function() {
            // 1. Inject Styles
            if (!document.getElementById('forge-css')) {
                const style = document.createElement('style');
                style.id = 'forge-css';
                style.innerHTML = forgeCSS;
                document.head.appendChild(style);
            }

            // 2. Inject Terminal & VFX Wrappers into body
            const overlay = document.createElement('div');
            overlay.id = 'terminal-overlay';
            overlay.innerHTML = terminalHTML;
            document.body.appendChild(overlay);

            const dive = document.createElement('div');
            dive.id = 'dimensional-dive';
            dive.innerHTML = warpHTML;
            document.body.appendChild(dive);

            const flash = document.createElement('div');
            flash.id = 'burnout-flash';
            document.body.appendChild(flash);

            // 3. Bring Terminal Online
            setTimeout(() => { 
                overlay.style.opacity = '1'; 
                document.body.classList.add('terminal-active');
            }, 50);

            // 4. Typewriter Sequence
            const typingSequence = [
                { text: "> SYSTEM INTEGRITY COMPROMISED", class: "term-highlight" },
                { text: "> UNAUTHORIZED DOM MANIPULATION DETECTED", class: "text-white" },
                { text: "> MEMORY ALLOCATION FAILING...", class: "text-white" },
                { text: "> INITIATING CRYPTO-DISSOLVE PROTOCOL", class: "term-cyan" },
                { text: "> PROCEED TO THE FORGE? [Y/N]", class: "text-[#faf5ff] font-bold mt-4" }
            ];
            
            const termBody = document.getElementById('term-body');
            const termActions = document.getElementById('term-actions');
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
                    document.getElementById('btn-abort').addEventListener('click', executeAbort);
                    keyListener = handleInput;
                    window.addEventListener('keydown', keyListener);
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
    };

})();
