/**
 * SilenVault | Core Layout & Dependency Manager
 * Handles DOM injection of global navigation, footers, security modules, favicons, and telemetry.
 */

const CoreManager = {
    getAssetPath() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.includes('layout.js')) {
                return script.src.substring(0, script.src.lastIndexOf('/'));
            }
        }
        return '../assets/js'; 
    },

    injectDependency(filename, id, target = document.head) {
        if (document.getElementById(id)) return;
        const script = document.createElement('script');
        script.id = id;
        script.src = `${this.getAssetPath()}/${filename}`;
        script.defer = true;
        target.appendChild(script);
    },

    // Dynamically injects/updates the Favicon across all pages
    initializeFavicon() {
        const imgPath = this.getAssetPath().replace('/js', '/img');
        let icon = document.querySelector("link[rel*='icon']");
        
        if (!icon) {
            icon = document.createElement('link');
            icon.rel = 'icon';
            document.head.appendChild(icon);
        }
        icon.type = 'image/webp';
        icon.href = `${imgPath}/SILENVAULT_CREST.png`;
    },

    initializeAnalytics() {
        if (document.getElementById('ga-script')) return;
        const gtagScript = document.createElement('script');
        gtagScript.id = 'ga-script';
        gtagScript.async = true;
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-VQL2F8H2R9';
        document.head.appendChild(gtagScript);

        const configScript = document.createElement('script');
        configScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VQL2F8H2R9');
        `;
        document.head.appendChild(configScript);
    },

    initializeAdNetwork() {
        if (!document.getElementById('sv-adsense')) {
            const adScript = document.createElement('script');
            adScript.id = 'sv-adsense';
            adScript.async = true;
            adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5449371042798610";
            adScript.crossOrigin = "anonymous";
            document.head.appendChild(adScript);
        }
    }
};

// Execute Boot Sequence
CoreManager.initializeFavicon();
CoreManager.initializeAnalytics();
CoreManager.injectDependency('vault_gatekeeper.js', 'sv-security-module');


/* ==========================================================================
   WEB COMPONENTS (HEADER & FOOTER)
   ========================================================================== */

class SVHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        const sponsorLink = `${basePath}/donate.html`; 

        CoreManager.initializeAdNetwork();

        this.innerHTML = `
            <nav class="border-b border-slate-800/80 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-500">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 lg:h-24 flex items-center justify-between transition-all duration-500">
                    
                    <a href="${basePath}/index.html" class="flex items-center gap-3 transition-transform hover:scale-105 shrink-0 z-50" title="Return to Directory">
                        <img src="${basePath}/assets/img/Banner_with_CREST.webp" alt="SilenVault" class="h-8 md:h-10 lg:h-12 w-auto object-contain transition-all duration-500">
                    </a>
                    
                    <div class="flex items-center gap-3 md:gap-5">
                        <a href="${sponsorLink}" class="flex items-center gap-2 text-xs md:text-sm font-bold text-blue-400 border border-blue-500/30 bg-blue-500/10 px-4 py-2 md:px-5 md:py-2.5 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                            Donate
                        </a>

                        <button onclick="bookmarkSite()" class="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white p-2.5 md:p-3 rounded-xl border border-slate-700 transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50" title="Bookmark Application">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }
}

class SVFooter extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        const sponsorLink = `${basePath}/donate.html`;
        
        this.innerHTML = `
            <footer class="bg-[#020617] border-t border-slate-800/80 pt-16 pb-8 mt-auto w-full z-10 relative">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                        
                        <div class="md:col-span-2">
                            <span class="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                                <img src="${basePath}/assets/img/SILENVAULT_CREST.webp" alt="SilenVault Crest" class="h-7 w-auto object-contain grayscale opacity-60">
                                SilenVault
                            </span>
                            <p class="text-slate-500 text-sm mt-4 max-w-sm leading-relaxed">
                                Local-first digital utilities. Execute data processing, format conversion, and cryptographic generation strictly within client-side memory.
                            </p>
                            
                            <div class="mt-6 flex gap-4">
                                <a href="https://x.com/silenvault" target="_blank" aria-label="X Profile" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-all">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.072zM16.89 20.25h-1.63L6.84 4.07H8.47l8.42 16.18z"/></svg>
                                </a>
                                <a href="https://github.com/abhishek333k" target="_blank" aria-label="GitHub Profile" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-all">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="text-white font-bold mb-5 text-sm uppercase tracking-wider">Links</h4>
                            <ul class="space-y-3 text-sm text-slate-500 font-medium">
                                <li><a href="${basePath}/index.html" class="hover:text-white transition-colors">Directory</a></li>
                                <li><a href="${basePath}/about.html" class="hover:text-white transition-colors">About</a></li>
                                <li><a href="${sponsorLink}" class="hover:text-white transition-colors">Donate</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="text-white font-bold mb-5 text-sm uppercase tracking-wider">Legal</h4>
                            <ul class="space-y-3 text-sm text-slate-500 font-medium">
                                <li><a href="${basePath}/policies/privacy.html" class="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="${basePath}/policies/terms.html" class="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="${basePath}/policies/disclaimer.html" class="hover:text-white transition-colors">Disclaimer</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="border-t border-slate-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p class="text-slate-500 font-medium">&copy; ${new Date().getFullYear()} SilenVault. All rights reserved.</p>
                        
                        <div class="flex items-center gap-2 text-slate-500 font-mono tracking-tight">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
                            Client-Side Execution Only
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('sv-header', SVHeader);
customElements.define('sv-footer', SVFooter);

/* ==========================================================================
   GLOBAL UTILITIES
   ========================================================================== */

window.bookmarkSite = function() {
    const isMac = /Mac/i.test(navigator.userAgent);
    const hotkey = isMac ? 'Cmd + D' : 'Ctrl + D';
    
    if (document.getElementById('sv-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'sv-toast';
    toast.className = "fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white px-5 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-4 cursor-pointer";
    toast.style.transform = "translateY(100px)";
    toast.style.opacity = "0";
    toast.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    
    toast.innerHTML = `
        <div class="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        </div>
        <div>
            <p class="text-sm font-bold text-white mb-0.5">Save Application State</p>
            <p class="text-xs text-slate-400">Press <code class="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-blue-400 font-mono text-xs shadow-inner mx-1">${hotkey}</code></p>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
    });
    
    const removeToast = () => {
        toast.style.transform = 'translateY(20px) scale(0.95)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    };

    toast.onclick = removeToast;
    setTimeout(removeToast, 5000);
};

document.addEventListener("DOMContentLoaded", () => {
    const adObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "data-ad-status") {
                const ins = mutation.target;
                if (ins.getAttribute("data-ad-status") === "filled" || ins.innerHTML.includes('iframe')) {
                    const container = ins.closest('.smart-ad-unit');
                    if (container) {
                        container.classList.remove('hidden');
                        setTimeout(() => container.classList.add('opacity-100'), 100);
                    }
                }
            }
        });
    });

    document.querySelectorAll('ins.adsbygoogle').forEach((ins) => {
        const container = ins.closest('.smart-ad-unit');
        if (container && !container.classList.contains('smart-ad-unit-initialized')) {
            container.classList.add('hidden', 'opacity-0', 'transition-opacity', 'duration-1000', 'smart-ad-unit-initialized');
        }
        adObserver.observe(ins, { attributes: true, childList: true });
    });
});
