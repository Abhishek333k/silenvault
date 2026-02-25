/**
 * SilenVault Forge | Black Market Module
 * Dynamically mounts the UI, handles product rendering, detailed manifests, and secure routing.
 */

window.ForgeBlackMarket = {
    // 1. YOUR EXPANDED PRODUCT INVENTORY
    products: [
        {
            id: "asset_01",
            name: "Zero-Day UI Boilerplate",
            shortDesc: "Highly illegal, fully responsive glassmorphic framework.",
            longDesc: "A complete frontend architecture designed for absolute anonymity. Includes 25+ pre-built components, custom scrollbars, and advanced WebRTC layout integrations. Bypass standard design constraints and deploy instantly.",
            price: "$49.00",
            // You will upload screenshots to your assets/img folder later
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop", 
            features: [
                "Zero-dependency Vanilla JS & Tailwind",
                "Cryptographic Glassmorphism Theme",
                "Pre-configured WebRTC P2P Layouts",
                "Mobile-First Responsive Grid",
                "Lifetime Local License"
            ],
            checkoutLink: "https://silenvault.lemonsqueezy.com/buy/xxxxxx" 
        },
        {
            id: "asset_02",
            name: "Cryptographic Dashboard",
            shortDesc: "Pre-compiled WebAssembly charting dashboard.",
            longDesc: "Monitor local data nodes without exposing telemetry to external servers. This dashboard utilizes client-side rendering to parse massive JSON datasets into beautiful, interactive data visualizations entirely offline.",
            price: "$89.00",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
            features: [
                "Offline JSON Data Parsing",
                "WebAssembly Accelerated Charting",
                "Dark-Mode Default Constraints",
                "Export to Encrypted PDF"
            ],
            checkoutLink: "#"
        }
    ],

    // 2. THE CORE LAYOUT (Now includes the hidden Manifest Modal)
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
                <div id="bm-product-grid" class="lg:col-span-2 grid sm:grid-cols-2 gap-6 items-start"></div>

                <div class="lg:col-span-1 p-6 bg-[#0a020f]/95 border border-[#ec4899]/30 relative backdrop-blur-xl flex flex-col h-[350px] shadow-[0_0_30px_rgba(236,72,153,0.1)] sticky top-24">
                    <div class="text-[10px] text-[#f472b6] uppercase tracking-widest mb-3 border-b border-[#ec4899]/30 pb-2 flex justify-between">
                        <span>Transaction Log</span>
                        <span class="w-2 h-2 bg-[#ec4899] animate-pulse"></span>
                    </div>
                    <div id="bm-terminal-output" class="flex-1 overflow-y-auto font-mono text-xs text-[#d8b4fe] flex flex-col justify-start space-y-2 custom-scrollbar pr-2">
                        <div class="text-[#22d3ee]">> ESTABLISHING SECURE CONNECTION...</div>
                        <div class="text-[#22d3ee]">> NODE AUTHENTICATED.</div>
                        <div class="text-white">> AWAITING PROCUREMENT SELECTION...</div>
                    </div>
                </div>
            </div>
        </div>

        <div id="bm-manifest-modal" class="fixed inset-0 z-[200] bg-[#020617]/95 backdrop-blur-xl hidden flex-col items-center justify-center p-4 opacity-0 transition-opacity duration-300">
            <button onclick="window.ForgeBlackMarket.closeManifest()" class="absolute top-6 right-6 p-3 bg-[#0a020f] border border-[#ec4899]/50 text-[#ec4899] hover:bg-[#ec4899] hover:text-black rounded transition-all">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div class="max-w-4xl w-full bg-[#0a020f]/90 border border-[#ec4899]/40 border-t-[4px] border-t-[#ec4899] shadow-[0_0_50px_rgba(236,72,153,0.15)] flex flex-col md:flex-row overflow-hidden max-h-[85vh] custom-scrollbar overflow-y-auto">
                
                <div class="md:w-1/2 bg-black border-r border-[#ec4899]/20 relative min-h-[250px]">
                    <img id="manifest-img" src="" class="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0a020f] via-transparent to-transparent pointer-events-none"></div>
                    <div class="absolute bottom-4 left-4 text-[10px] text-[#ec4899] font-mono uppercase tracking-widest border border-[#ec4899]/30 bg-black/50 px-2 py-1 backdrop-blur-sm">Visual Cipher</div>
                </div>

                <div class="md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <h2 id="manifest-title" class="text-2xl font-black text-[#faf5ff] tracking-tight font-mono">ASSET_NAME</h2>
                        <span id="manifest-price" class="text-[#faf5ff] font-bold font-mono bg-[#ec4899]/20 px-3 py-1 text-sm border border-[#ec4899]/50">PRICE</span>
                    </div>
                    
                    <p id="manifest-desc" class="text-[#d8b4fe] text-sm leading-relaxed font-mono opacity-80 mb-6"></p>
                    
                    <div class="mb-8 flex-1">
                        <h3 class="text-xs text-[#ec4899] font-bold uppercase tracking-widest border-b border-[#ec4899]/30 pb-2 mb-3">Technical Specifications</h3>
                        <ul id="manifest-features" class="space-y-2 text-xs text-slate-300 font-mono list-inside">
                            </ul>
                    </div>

                    <button id="manifest-buy-btn" class="w-full bg-[#ec4899] text-black font-black font-mono text-sm uppercase tracking-[0.2em] px-4 py-4 transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] flex justify-center items-center gap-3">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Execute Transaction
                    </button>
                </div>
            </div>
        </div>
    `,

    mount: function() {
        document.body.innerHTML = this.layout;

        const grid = document.getElementById('bm-product-grid');
        grid.innerHTML = ''; 

        // Build the Grid (Now says "Inspect Asset")
        this.products.forEach(product => {
            const cardHTML = `
                <div class="p-6 bg-[#0a020f]/80 border border-[#ec4899]/40 border-t-[3px] border-t-[#ec4899] relative backdrop-blur-md flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(236,72,153,0.15)] group cursor-pointer" onclick="window.ForgeBlackMarket.openManifest('${product.id}')">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-mono text-[#ec4899] font-bold text-lg leading-tight pr-4">${product.name}</h3>
                        <span class="text-[#faf5ff] font-bold font-mono bg-[#ec4899]/20 px-2 py-1 rounded text-[10px] border border-[#ec4899]/50">${product.price}</span>
                    </div>
                    <p class="text-[#d8b4fe] text-xs leading-relaxed mb-6 font-mono opacity-80 flex-1">${product.shortDesc}</p>
                    
                    <button class="w-full bg-[#ec4899]/10 border border-[#ec4899] text-[#ec4899] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 transition-all group-hover:bg-[#ec4899] group-hover:text-[#000] mt-auto">
                        Inspect Asset
                    </button>
                </div>
            `;
            grid.innerHTML += cardHTML;
        });

        document.getElementById('bm-back-btn').addEventListener('click', () => {
            window.navigateD2('home');
        });
    },

    // 3. THE MANIFEST ENGINE (Opens the Dossier)
    openManifest: function(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.logToTerminal(`<span class="text-white">> DOWNLOADING ASSET MANIFEST:</span> <span class="text-[#ec4899]">${product.name}</span>`);

        // Populate Modal Data
        document.getElementById('manifest-title').innerText = product.name;
        document.getElementById('manifest-price').innerText = product.price;
        document.getElementById('manifest-desc').innerText = product.longDesc;
        document.getElementById('manifest-img').src = product.image;

        // Populate Features List
        const featureList = document.getElementById('manifest-features');
        featureList.innerHTML = product.features.map(f => `
            <li class="flex items-start gap-2">
                <span class="text-[#ec4899] mt-0.5">›</span> <span>${f}</span>
            </li>
        `).join('');

        // Bind the actual Purchase action to the Execute button inside the modal
        const buyBtn = document.getElementById('manifest-buy-btn');
        buyBtn.onclick = () => this.initiatePurchase(product.id);

        // Show Modal with Animation
        const modal = document.getElementById('bm-manifest-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        requestAnimationFrame(() => modal.style.opacity = '1');
    },

    closeManifest: function() {
        const modal = document.getElementById('bm-manifest-modal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
        this.logToTerminal(`<span class="text-slate-500">> MANIFEST CLOSED.</span>`);
    },

    // 4. THE PAYMENT GATEWAY ROUTER
    initiatePurchase: function(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Change button state to show loading
        const buyBtn = document.getElementById('manifest-buy-btn');
        buyBtn.innerHTML = `<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ROUTING PAYMENT...`;
        
        this.logToTerminal(`<span class="text-white">> VERIFYING SECURE UPLINK...</span>`);

        setTimeout(() => {
            if (product.checkoutLink === "#") {
                this.logToTerminal(`<span class="text-yellow-400">> ERROR: PAYMENT GATEWAY DISCONNECTED.</span>`);
                buyBtn.innerHTML = `Execute Transaction`; // reset
            } else {
                this.logToTerminal(`<span class="text-[#22c55e]">> UPLINK ESTABLISHED. REDIRECTING...</span>`);
                setTimeout(() => {
                    buyBtn.innerHTML = `Execute Transaction`; // reset
                    window.open(product.checkoutLink, '_blank', 'noopener,noreferrer');
                }, 800);
            }
        }, 600);
    },

    logToTerminal: function(htmlString) {
        const output = document.getElementById('bm-terminal-output');
        const newLog = document.createElement('div');
        newLog.innerHTML = htmlString;
        newLog.style.opacity = '0';
        newLog.style.animation = 'fade-in 0.3s forwards';
        output.appendChild(newLog);
        
        requestAnimationFrame(() => {
            output.scrollTop = output.scrollHeight;
        });
    }
};
