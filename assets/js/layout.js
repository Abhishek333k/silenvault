class SVHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        // CONFIGURATION: Centralized link management
        const sponsorLink = "https://github.com/sponsors/abhishek333k";

        this.innerHTML = `
            <nav class="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <a href="${basePath}/index.html" class="flex items-center gap-3 transition-transform hover:scale-105">
                        <img src="${basePath}/assets/img/SILENVAULT_CREST.png" alt="SilenVault Crest" class="h-8 w-auto object-contain">
                        <span class="text-xl font-bold tracking-tight text-white hidden md:block">Silen<span class="text-blue-500">Vault</span></span>
                    </a>
                    
                    <div class="flex items-center gap-4">
                        <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <a href="${basePath}/index.html#dev-tools" class="hover:text-white transition-colors">Dev Tools</a>
                            <a href="${basePath}/index.html#business" class="hover:text-white transition-colors">Business</a>
                        </div>
                        
                        <div class="h-6 w-px bg-slate-800 hidden md:block"></div>
                        
                        <a href="${sponsorLink}" target="_blank" class="flex items-center gap-2 text-xs font-bold text-pink-400 border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 rounded-full hover:bg-pink-500 hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
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
        
        this.innerHTML = `
            <footer class="bg-slate-950 border-t border-slate-900 py-12 mt-auto w-full">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid md:grid-cols-4 gap-8">
                        <div class="col-span-2">
                            <span class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                <img src="${basePath}/assets/img/SILENVAULT_CREST.png" alt="SilenVault Crest" class="h-6 w-auto object-contain grayscale opacity-50">
                                SilenVault <span class="text-xs align-top text-slate-500">LLP</span>
                            </span>
                            <p class="text-slate-500 text-sm mt-4 max-w-xs leading-relaxed">
                                The open-standard for local-first operations. Secure, offline-capable, and transparent.
                            </p>
                            <div class="mt-6 flex gap-3">
                                <a href="#" aria-label="Twitter" class="text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                                <a href="https://github.com/abhishek333k" aria-label="GitHub" class="text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-4">Ecosystem</h4>
                            <ul class="space-y-2 text-sm text-slate-500">
                                <li><a href="${basePath}/index.html" class="hover:text-blue-400 transition-colors">All Tools</a></li>
                                <li><a href="https://github.com/sponsors/abhishek333k" class="hover:text-pink-400 transition-colors">Become a Sponsor</a></li>
                                <li><a href="mailto:contact@silenvault.com" class="hover:text-blue-400 transition-colors">Submit a Template</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-4">Legal</h4>
                            <ul class="space-y-2 text-sm text-slate-500">
                                <li><a href="${basePath}/policies/terms.html" class="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                <li><a href="${basePath}/policies/privacy.html" class="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="${basePath}/policies/disclaimer.html" class="hover:text-blue-400 transition-colors">Disclaimer</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-slate-900 mt-12 pt-8 text-center text-xs text-slate-600">
                        &copy; 2026 SilenVault LLP. All rights reserved. 
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('sv-header', SVHeader);
customElements.define('sv-footer', SVFooter);

window.bookmarkSite = function() {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const hotkey = isMac ? 'Cmd + D' : 'Ctrl + D';
    const toast = document.createElement('div');
    toast.className = "fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce";
    toast.innerText = `Press ${hotkey} to bookmark SilenVault`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
};
