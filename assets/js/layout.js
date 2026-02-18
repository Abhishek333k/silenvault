class SVHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        const sponsorLink = "https://buymeacoffee.com/Abhishek333k";

        // Automated Favicon Injection
        let favicon = document.querySelector("link[rel~='icon']");
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = `${basePath}/assets/img/SILENVAULT_CREST.png`;

        this.innerHTML = `
            <nav class="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <a href="${basePath}/index" class="flex items-center transition-transform hover:scale-105">
                        <img src="${basePath}/assets/img/Banner_with_CREST.png" alt="SilenVault" class="h-10 w-auto object-contain">
                    </a>
                    
                    <div class="flex items-center gap-4">
                        <div class="hidden md:flex items-center gap-6 text-xs font-semibold tracking-tight text-slate-400">
                            <a href="${basePath}/index#dev-tools" class="hover:text-blue-400 transition-colors">Utilities</a>
                            <a href="${basePath}/index#business" class="hover:text-emerald-400 transition-colors">Operations</a>
                        </div>
                        
                        <div class="h-6 w-px bg-slate-800 hidden md:block"></div>
                        
                        <a href="${sponsorLink}" target="_blank" class="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                            Sponsor
                        </a>

                        <button onclick="bookmarkSite()" class="bg-slate-900 hover:bg-slate-800 text-slate-400 p-2 rounded-lg border border-slate-800 transition-all">
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
        const sponsorLink = "https://buymeacoffee.com/Abhishek333k";
        
        this.innerHTML = `
            <footer class="bg-slate-950 border-t border-slate-900 py-16 mt-auto">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="grid md:grid-cols-4 gap-12">
                        <div class="col-span-2">
                            <span class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                <img src="${basePath}/assets/img/SILENVAULT_CREST.png" alt="" class="h-6 w-auto grayscale opacity-50">
                                SilenVault
                            </span>
                            <p class="text-slate-500 text-sm mt-4 max-w-xs leading-relaxed">
                                The open-standard for local-first business operations. Secure, offline-capable, and transparent.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-6">Directory</h4>
                            <ul class="space-y-3 text-sm text-slate-500">
                                <li><a href="${basePath}/index" class="hover:text-blue-400 transition-colors">Global Hub</a></li>
                                <li><a href="${sponsorLink}" target="_blank" class="hover:text-blue-400 transition-colors">Become a Sponsor</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-6">Legal</h4>
                            <ul class="space-y-3 text-sm text-slate-500">
                                <li><a href="${basePath}/policies/terms" class="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                <li><a href="${basePath}/policies/privacy" class="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-slate-900 mt-16 pt-8 text-center">
                        <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-700">
                            &copy; 2026 SILENVAULT INITIATIVE // AN OPEN-STANDARD UTILITY
                        </p>
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
    alert(`Press ${hotkey} to save the Vault.`);
};
