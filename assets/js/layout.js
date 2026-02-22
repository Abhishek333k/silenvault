// ARCHITECT: Mount the external Gatekeeper Brain
(function mountGatekeeper() {
    if (document.getElementById('sv-gatekeeper')) return;
    
    let jsPath = '../assets/js/vault_gatekeeper.js'; // Fallback
    const scripts = document.getElementsByTagName('script');
    
    // Intelligently find the base path by looking at where layout.js was loaded from
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('layout.js')) {
            jsPath = scripts[i].src.replace('layout.js', 'vault_gatekeeper.js');
            break;
        }
    }

    const script = document.createElement('script');
    script.id = 'sv-gatekeeper';
    script.src = jsPath;
    script.async = false; // Forces it to execute immediately to block the page render
    document.head.appendChild(script);
})();

// ARCHITECT: Universal Google Analytics Injection
function injectAnalytics() {
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
}
injectAnalytics();

class SVHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        const sponsorLink = `${basePath}/donate`; 

        // ARCHITECT FIX: Favicon Injection Engine
        // 1. Remove any existing favicons to force the browser to redraw the tab
        document.querySelectorAll("link[rel~='icon']").forEach(el => el.remove());
        
        // 2. Create a fresh link element using a universally supported format (.png)
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png'; // Explicitly define type
        favicon.href = `${basePath}/assets/img/SILENVAULT_CREST.png`; // Switched from .webp to .png
        document.head.appendChild(favicon);

        if (!document.getElementById('sv-adsense')) {
            const adScript = document.createElement('script');
            adScript.id = 'sv-adsense';
            adScript.async = true;
            adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5449371042798610";
            adScript.crossOrigin = "anonymous";
            document.head.appendChild(adScript);
        }

        this.innerHTML = `
            <nav class="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <a href="${basePath}/index" class="flex items-center gap-3 transition-transform hover:scale-105">
                        <img src="${basePath}/assets/img/Banner_with_CREST.webp" alt="SilenVault" class="h-10 w-auto object-contain">
                    </a>
                    
                    <div class="flex items-center gap-4">
                        <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <a href="${basePath}/about" class="hover:text-white transition-colors">About</a>
                            <a href="${basePath}/index#sec-dev" class="hover:text-white transition-colors">Dev Tools</a>
                            <a href="${basePath}/index#sec-business" class="hover:text-white transition-colors">Business</a>
                        </div>
                        
                        <div class="h-6 w-px bg-slate-800 hidden md:block mx-2"></div>
                        
                        <a href="${sponsorLink}" class="flex items-center gap-2 text-xs font-bold text-pink-400 border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            Sponsor
                        </a>

                        <button onclick="bookmarkSite()" class="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full border border-slate-700 transition-all" title="Bookmark Vault">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
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
        const sponsorLink = `${basePath}/donate`;
        
        this.innerHTML = `
            <footer class="bg-slate-950 border-t border-slate-900 py-12 mt-auto w-full">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid md:grid-cols-4 gap-8">
                        <div class="col-span-2">
                            <span class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                <img src="${basePath}/assets/img/SILENVAULT_CREST.webp" alt="SilenVault Crest" class="h-6 w-auto object-contain grayscale opacity-50">
                                SilenVault <span class="text-[10px] align-top text-slate-500 uppercase tracking-widest mt-1">Initiative</span>
                            </span>
                            <p class="text-slate-500 text-sm mt-4 max-w-xs leading-relaxed">
                                The open-standard for local-first operations. Secure, offline-capable, and transparent. Encrypted in Style.
                            </p>
                            <div class="mt-6 flex gap-4">
                                <a href="https://x.com/silenvault" target="_blank" aria-label="X (Twitter)" class="text-slate-500 hover:text-white transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.072zM16.89 20.25h-1.63L6.84 4.07H8.47l8.42 16.18z"/></svg>
                                </a>
                                <a href="https://github.com/abhishek333k" target="_blank" aria-label="GitHub" class="text-slate-500 hover:text-white transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-4">Ecosystem</h4>
                            <ul class="space-y-2 text-sm text-slate-500">
                                <li><a href="${basePath}/about" class="hover:text-blue-400 transition-colors">About SilenVault</a></li>
                                <li><a href="${basePath}/index" class="hover:text-blue-400 transition-colors">All Tools</a></li>
                                <li><a href="${sponsorLink}" class="hover:text-pink-400 transition-colors">Become a Sponsor</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-4">Legal</h4>
                            <ul class="space-y-2 text-sm text-slate-500">
                                <li><a href="${basePath}/policies/terms" class="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                <li><a href="${basePath}/policies/privacy" class="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="${basePath}/policies/disclaimer" class="hover:text-blue-400 transition-colors">Disclaimer</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
                        <p>&copy; ${new Date().getFullYear()} SilenVault Initiative. All rights reserved.</p>
                        <p class="mt-2 md:mt-0 italic font-serif">"Simplicity is the ultimate sophistication." — Leonardo da Vinci</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('sv-header', SVHeader);
customElements.define('sv-footer', SVFooter);

window.bookmarkSite = function() {
    const isMac = /Mac/i.test(navigator.userAgent);
    const hotkey = isMac ? 'Cmd + D' : 'Ctrl + D';
    
    if (document.getElementById('sv-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'sv-toast';
    toast.className = "fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-4 animate-bounce border border-slate-700 cursor-pointer";
    toast.style.animation = "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    toast.innerHTML = `
        <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        </div>
        <div>
            <p class="text-sm font-bold text-white">Save to Bookmarks</p>
            <p class="text-xs text-slate-400">Press <code class="bg-slate-900 px-1 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">${hotkey}</code> to secure this vault.</p>
        </div>
    `;
    
    const removeToast = () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    };

    toast.onclick = removeToast;
    document.body.appendChild(toast);
    setTimeout(removeToast, 5000);
};

// Universal Smart Ad-Sensing Engine
document.addEventListener("DOMContentLoaded", () => {
    const adObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "data-ad-status") {
                const ins = mutation.target;
                if (ins.getAttribute("data-ad-status") === "filled" || ins.innerHTML.includes('iframe')) {
                    const container = ins.closest('#sidebar-ad-wrapper') || ins.closest('.smart-ad-unit');
                    if (container) {
                        container.classList.remove('hidden');
                        setTimeout(() => container.classList.add('opacity-100'), 100);
                    }
                }
            }
        });
    });

    document.querySelectorAll('ins.adsbygoogle').forEach((ins) => {
        const container = ins.closest('#sidebar-ad-wrapper') || ins.closest('.smart-ad-unit');
        if (container && !container.classList.contains('smart-ad-unit-initialized')) {
            container.classList.add('hidden', 'opacity-0', 'transition-opacity', 'duration-1000', 'smart-ad-unit-initialized');
        }
        adObserver.observe(ins, { attributes: true, childList: true });
    });
});
