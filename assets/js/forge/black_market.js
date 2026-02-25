/**
 * SilenVault Forge | Black Market Module
 * Dynamically mounts the UI and attaches secure event listeners.
 */

window.ForgeBlackMarket = {
    // The HTML layout for the Black Market
    layout: `
        <div class="fixed inset-0 z-[-10]" style="background-color: #06010a; background-image: radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 80%), linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px); background-size: 100% 100%, 50px 50px, 50px 50px; background-position: center top, center center, center center;"></div>
        
        <div class="absolute inset-0 w-full min-h-screen z-50 flex flex-col items-center justify-center px-4" style="animation: d2-arrive 0.5s ease-out forwards;">
            <button id="bm-back-btn" class="absolute top-8 left-8 text-xs font-mono text-[#ec4899] border border-[#ec4899]/50 bg-[#15020a]/70 px-4 py-2 hover:bg-[#ec4899]/20 transition-all uppercase tracking-widest backdrop-blur-md" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">&lt; Return to Forge</button>
            
            <div class="text-center mb-10 w-full max-w-4xl px-4">
                <h1 class="text-4xl md:text-6xl font-black tracking-tighter text-[#faf5ff] drop-shadow-[0_0_15px_rgba(236,72,153,0.4)] mb-2">> BLACK_MARKET.exe</h1>
                <p class="text-[#f472b6] font-mono text-sm uppercase tracking-[0.2em]">Encrypted Asset Procurement</p>
            </div>

            <div class="grid md:grid-cols-2 gap-6 max-w-4xl w-full px-4">
                <div class="p-6 bg-[#0a020f]/80 border border-[#ec4899]/40 border-t-[3px] border-t-[#ec4899] relative backdrop-blur-md">
                    <h3 class="font-mono text-[#ec4899] font-bold text-lg mb-2">Zero-Day UI Boilerplate</h3>
                    <p class="text-[#d8b4fe] text-xs leading-relaxed mb-6 font-mono opacity-80">Highly illegal, fully responsive glassmorphic framework.</p>
                    <button id="buy-item-1" class="w-full bg-[#ec4899]/10 border border-[#ec4899] text-[#ec4899] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 transition-all hover:bg-[#ec4899] hover:text-[#000]">Procure Asset</button>
                </div>

                <div class="p-6 bg-[#0a020f]/90 border border-[#333] flex flex-col justify-end min-h-[200px] font-mono text-xs">
                    <div id="bm-terminal-output" class="text-[#22d3ee] mb-2">> WAITING FOR TRANSACTION...</div>
                    <span class="w-2 h-4 bg-[#ec4899] animate-pulse"></span>
                </div>
            </div>
        </div>
    `,

    // The function that runs when the user enters the Black Market
    mount: function() {
        // 1. Inject the HTML into the DOM
        document.body.innerHTML = this.layout;

        // 2. Attach Event Listeners to the buttons
        document.getElementById('bm-back-btn').addEventListener('click', () => {
            window.navigateD2('home'); // Send them back to the main D2 menu
        });

        document.getElementById('buy-item-1').addEventListener('click', () => {
            this.runPurchaseLogic();
        });
    },

    // A custom function strictly for this module
    runPurchaseLogic: function() {
        const output = document.getElementById('bm-terminal-output');
        output.innerHTML += `<br><span class="text-yellow-400">> INSUFFICIENT CLEARANCE. TRANSACTION DENIED.</span>`;
    }
};
