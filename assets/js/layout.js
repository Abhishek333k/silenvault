class SVHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        const sponsorLink = "https://buymeacoffee.com/Abhishek333k";

        // ARCHITECT LOGIC: Automated Favicon Injection
        let favicon = document.querySelector("link[rel~='icon']");
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = `${basePath}/assets/img/SILENVAULT_CREST.png`;

        this.innerHTML = `
            <nav class="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <a href="${basePath}/index" class="flex items-center transition-transform hover:scale-105">
                        <img src="${basePath}/assets/img/Banner_with_CREST.png" alt="SilenVault" class="h-10 w-auto object-contain">
                    </a>
                    
                    <div class="flex items-center gap-4">
                        <div class="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <a href="${basePath}/index#dev-tools" class="hover:text-white transition-colors">Utilities</a>
                            <a href="${basePath}/index#business" class="hover:text-white transition-colors">Operations</a>
                        </div>
                        
                        <div class="h-6 w-px bg-zinc-800 hidden md:block"></div>
                        
                        <a href="${sponsorLink}" target="_blank" class="text-[10px] font-black uppercase tracking-tighter text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition-all">
                            Sponsor Project
                        </a>

                        <button onclick="bookmarkSite()" class="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 p-2 rounded-lg border border-zinc-800 transition-all" title="Bookmark Vault">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                        </button>
                    </div>
                </div>
            </nav>
        `;

        if (!document.getElementById('sv-consent-script')) {
            const script = document.createElement('script');
            script.id = 'sv-consent-script';
            script.src = `${basePath}/assets/js/consent.js`;
            script.defer = true;
            document.body.appendChild(script);
        }
    }
}

class SVFooter extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        const sponsorLink = "https://buymeacoffee.com/Abhishek333k";
        
        this.innerHTML = `
            <footer class="bg-zinc-950 border-t border-zinc-900 py-16 mt-auto w-full">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="grid md:grid-cols-4 gap-12">
                        <div class="col-span-2">
                            <span class="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
                                <img src="${basePath}/assets/img/SILENVAULT_CREST.png" alt="" class="h-6 w-auto grayscale opacity-50">
                                SILENVAULT
                            </span>
                            <p class="text-zinc-500 text-sm mt-4 max-w-xs leading-relaxed font-medium">
                                Professional digital infrastructure for local-first operations. No tracking, just performance.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-zinc-300 text-xs font-bold uppercase tracking-widest mb-6">Directory</h4>
                            <ul class="space-y-3 text-sm font-medium text-zinc-500">
                                <li><a href="${basePath}/index" class="hover:text-indigo-400 transition-colors">Global Hub</a></li>
                                <li><a href="${sponsorLink}" target="_blank" class="hover:text-indigo-400 transition-colors">Support Development</a></li>
                                <li><a href="mailto:contact@silenvault.com" class="hover:text-indigo-400 transition-colors">Submit Request</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-zinc-300 text-xs font-bold uppercase tracking-widest mb-6">Legal</h4>
                            <ul class="space-y-3 text-sm font-medium text-zinc-500">
                                <li><a href="${basePath}/policies/terms" class="hover:text-indigo-400 transition-colors">Terms</a></li>
                                <li><a href="${basePath}/policies/privacy" class="hover:text-indigo-400 transition-colors">Privacy</a></li>
                                <li><a href="${basePath}/policies/disclaimer" class="hover:text-indigo-400 transition-colors">Disclaimer</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-zinc-900 mt-16 pt-8 text-center">
                        <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700">
                            &copy; 2026 SILENVAULT INITIATIVE // LOCAL-FIRST STANDARD
                        </p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Register Components
customElements.define('sv-header', SVHeader);
customElements.define('sv-footer', SVFooter);

// Global Bookmark Logic
window.bookmarkSite = function() {
    const isMac = /Mac/i.test(navigator.userAgent);
    const hotkey = isMac ? 'Cmd + D' : 'Ctrl + D';
    
    if (document.getElementById('sv-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'sv-toast';
    toast.className = "fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3 animate-bounce cursor-pointer";
    toast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        <span class="text-xs font-bold uppercase tracking-widest">Press <strong>${hotkey}</strong> to bookmark</span>
    `;
    
    toast.onclick = () => toast.remove();
    document.body.appendChild(toast);
    setTimeout(() => { if(toast) toast.remove(); }, 4000);
};
