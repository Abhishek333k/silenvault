/**
 * SilenVault Forge | Black Market Module
 * Dynamically mounts the UI, handles product rendering, and securely routes to payment gateways.
 */

window.ForgeBlackMarket = {
    // 1. YOUR PRODUCT INVENTORY
    // Just add new objects here to instantly update your store.
    products: [
        {
            id: "asset_01",
            name: "Zero-Day UI Boilerplate",
            desc: "Highly illegal, fully responsive glassmorphic framework. Ready for immediate local deployment.",
            price: "$49.00",
            // Replace this with your actual Gumroad or Lemon Squeezy checkout link
            checkoutLink: "#" 
        },
        {
            id: "asset_02",
            name: "Cryptographic Dashboard",
            desc: "Pre-compiled WebAssembly charting dashboard for tracking local data nodes.",
            price: "$89.00",
            checkoutLink: "#"
        }
    ],

    // 2. THE CORE LAYOUT
    layout: `
        <div class="fixed inset-0 z-[-10]" style="background-color: #06010a; background-image: radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 80%), linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px); background-size: 100% 100%, 50px 50px, 50px 50px; background-position: center top, center center, center center;"></div>
        
        <div class="absolute inset-0 w-full min-h-screen z-50 flex flex-col items-center pt-20 pb-10 px-4 overflow-y-auto custom-scrollbar" style="animation: d2-arrive 0.5s ease-out forwards;">
            <button id="bm-back-btn" class="fixed top-8 left-8 text-xs font-mono text-[#ec4899] border border-[#ec4899]/50 bg-[#15020a]/90 px-4 py-2 hover:bg-[#ec4899]/20 transition-all uppercase tracking-widest backdrop-blur-md z-[100]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">&lt; Return to Forge</button>
            
            <div class="text-center mb-10 w-full max-w-5xl">
                <h1 class="text-4xl md:text-6xl font-black tracking-tighter text-[#faf5ff] drop-shadow-[0_0_15px_rgba(236,72,153,0.4)] mb-2">> BLACK_MARKET.exe</h1>
                <p class="text-[#f472b6] font-mono text-sm md:text-base uppercase tracking-[0.2em] mb-4">Encrypted Asset Procurement</p>
                <div class="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-[#ec4899] to-transparent opacity-50"></div>
            </div>

            <div class="grid lg:grid-cols-3 gap-6 max-w-5xl w-full mb-8">
                <div id="bm-product-grid" class="lg:col-span-2 grid sm:grid-cols-2 gap-6"></div>

                <div class="lg:col-span-1 p-6 bg-[#0a020f]/95 border border-[#ec4899]/30 relative backdrop-blur-xl flex flex-col h-[350px] shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                    <div class="text-[10px] text-[#f472b6] uppercase tracking-widest mb-3 border-b border-[#ec4899]/30 pb-2">Transaction Log</div>
                    
                    <div id="bm-terminal-output" class="flex-1 overflow-y-auto font-mono text-xs text-[#d8b4fe] flex flex-col justify-start space-y-2 custom-scrollbar pr-2">
                        <div class="text-[#22d3ee]">> ESTABLISHING SECURE CONNECTION...</div>
                        <div class="text-[#22d3ee]">> NODE AUTHENTICATED.</div>
                        <div class="text-white">> AWAITING PROCUREMENT SELECTION...</div>
                    </div>
                </div>
            </div>
        </div>
    `,

    mount: function() {
        document.body.innerHTML = this.layout;

        // Render the product inventory dynamically
        const grid = document.getElementById('bm-product-grid');
        grid.innerHTML = ''; // Clear container

        this.products.forEach(product => {
            const cardHTML = `
                <div class="p-6 bg-[#0a020f]/80 border border-[#ec4899]/40 border-t-[3px] border-t-[#ec4899] relative backdrop-blur-md flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(236,72,153,0.15)]">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-mono text-[#ec4899] font-bold text-lg leading-tight pr-4">${product.name}</h3>
                        <span class="text-[#faf5ff] font-bold font-mono bg-[#ec4899]/20 px-2 py-1 rounded text-xs border border-[#ec4899]/50">${product.price}</span>
                    </div>
                    <p class="text-[#d8b4fe] text-xs leading-relaxed mb-6 font-mono opacity-80 flex-1">${product.desc}</p>
                    
                    <button onclick="window.ForgeBlackMarket.initiatePurchase('${product.id}')" class="w-full bg-[#ec4899]/10 border border-[#ec4899] text-[#ec4899] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 transition-all hover:bg-[#ec4899] hover:text-[#000] mt-auto">
                        Procure Asset
                    </button>
                </div>
            `;
            grid.innerHTML += cardHTML;
        });

        // Back button logic
        document.getElementById('bm-back-btn').addEventListener('click', () => {
            window.navigateD2('home');
        });
    },

    // Handles the UI logic when a user clicks "Procure"
    initiatePurchase: function(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.logToTerminal(`<span class="text-white">> REQUESTING:</span> <span class="text-[#ec4899]">${product.name}</span>`);
        this.logToTerminal(`<span class="text-white">> VERIFYING UPLINK...</span>`);

        // Simulate network delay for UI effect
        setTimeout(() => {
            if (product.checkoutLink === "#") {
                // If you haven't put a real link in yet
                this.logToTerminal(`<span class="text-yellow-400">> ERROR: PAYMENT GATEWAY DISCONNECTED.</span>`);
            } else {
                // If real link exists, open the checkout in a new tab securely
                this.logToTerminal(`<span class="text-[#22c55e]">> UPLINK ESTABLISHED. ROUTING TO GATEWAY...</span>`);
                setTimeout(() => {
                    window.open(product.checkoutLink, '_blank', 'noopener,noreferrer');
                }, 800);
            }
        }, 600);
    },

    // Utility function to inject text and auto-scroll the terminal safely
    logToTerminal: function(htmlString) {
        const output = document.getElementById('bm-terminal-output');
        const newLog = document.createElement('div');
        newLog.innerHTML = htmlString;
        
        // Add fade-in animation
        newLog.style.opacity = '0';
        newLog.style.animation = 'fade-in 0.3s forwards';
        
        output.appendChild(newLog);
        
        // Force scroll to the very bottom
        requestAnimationFrame(() => {
            output.scrollTop = output.scrollHeight;
        });
    }
};
