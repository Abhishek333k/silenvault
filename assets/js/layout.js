// assets/js/layout.js

class SVHeader extends HTMLElement {
    connectedCallback() {
        // Allow passing a base-path to resolve relative links from nested directories
        const basePath = this.getAttribute('base-path') || '.';
        
        this.innerHTML = `
            <nav class="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <a href="${basePath}/index.html" class="flex items-center gap-3 transition-transform hover:scale-105">
                        <img src="${basePath}/assets/img/SILENVAULT_CREST.png" alt="SilenVault Crest" class="h-8 w-auto object-contain">
                        <span class="text-xl font-bold tracking-tight text-white">Silen<span class="text-blue-500">Vault</span></span>
                    </a>
                    <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                        <a href="${basePath}/index.html#dev-tools" class="hover:text-white transition-colors">Developers</a>
                        <a href="${basePath}/index.html#business" class="hover:text-white transition-colors">Business</a>
                        <button onclick="bookmarkSite()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                            Save Vault
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
                            <p class="text-slate-500 text-sm mt-4 max-w-xs">
                                Building the digital infrastructure for the modern operational stack. 
                                Secure, reliable, and always online.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-4">Legal Operations</h4>
                            <ul class="space-y-2 text-sm text-slate-500">
                                <li><a href="${basePath}/policies/terms.html" class="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                <li><a href="${basePath}/policies/privacy.html" class="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="${basePath}/policies/disclaimer.html" class="hover:text-blue-400 transition-colors">Disclaimer</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold mb-4">Connect</h4>
                            <ul class="space-y-2 text-sm text-slate-500">
                                <li><a href="mailto:support@silenvault.com" class="hover:text-blue-400 transition-colors">Contact Support</a></li>
                                <li><a href="#" class="hover:text-blue-400 transition-colors">Report Bug</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-slate-900 mt-12 pt-8 text-center text-xs text-slate-600">
                        &copy; 2026 SilenVault LLP. All rights reserved. The "SilenVault" trademark is a property of the Limited Liability Partnership.
                    </div>
                </div>
            </footer>
        `;
    }
}

// Register the custom elements with the browser
customElements.define('sv-header', SVHeader);
customElements.define('sv-footer', SVFooter);

// Global Bookmark Function (Since it's used in the header)
window.bookmarkSite = function() {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const hotkey = isMac ? 'Cmd + D' : 'Ctrl + D';
    
    const toast = document.createElement('div');
    toast.className = "fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce";
    toast.innerText = `Press ${hotkey} to bookmark SilenVault`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.remove(); }, 4000);
};
