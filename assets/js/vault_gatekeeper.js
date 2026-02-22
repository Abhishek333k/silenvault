// ==========================================
// SILENVAULT: MAINTENANCE GATEKEEPER BRAIN
// ==========================================

(function enforceGatekeeper() {
    const lockedVaults = [
        '/tools/bin/' // MASTER LOCK
    ];

    const currentPath = window.location.pathname.toLowerCase();
    const isLocked = lockedVaults.some(lockedPath => currentPath.includes(lockedPath));

    // THE BYPASS: Automatically unlock for localhost, OR if the secret URL parameter is used
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isDevOverride = window.location.search.includes('dev=true');

    if (isLocked && !isLocalhost && !isDevOverride) {
        const renderLockScreen = () => {
            document.documentElement.style.display = '';
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            
            document.body.innerHTML = '';
            document.body.className = 'bg-slate-950 flex items-center justify-center h-screen w-screen m-0 p-0 overflow-hidden';
            
            document.body.innerHTML = `
                <div class="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4" style="background-image: radial-gradient(circle at center, transparent 0%, #020617 100%), linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px); background-size: 100% 100%, 30px 30px, 30px 30px;">
                    <div class="relative p-10 md:p-12 max-w-lg w-full bg-slate-900/80 border border-slate-700 shadow-2xl backdrop-blur-xl">
                        
                        <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                        <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                        <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                        <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                        
                        <div class="flex items-start gap-5">
                            <div class="mt-1 w-12 h-12 bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            </div>
                            <div class="text-left">
                                <h2 class="text-xl font-bold text-white tracking-wide mb-1 uppercase font-mono">System Maintenance</h2>
                                <div class="w-full h-px bg-slate-700 mb-4"></div>
                                <p class="text-slate-400 text-sm leading-relaxed mb-8 font-sans">
                                    This module is currently offline for scheduled architectural upgrades. Access is temporarily restricted to ensure stability.
                                </p>
                            </div>
                        </div>
                        
                        <a href="/index.html" class="block w-full text-center bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-mono font-bold uppercase tracking-widest py-4 border border-slate-600 transition-all duration-300 text-xs shadow-lg">
                            Return to Dashboard
                        </a>
                    </div>
                </div>
            `;
        };

        if (document.readyState === 'loading') {
            document.documentElement.style.display = 'none';
            document.addEventListener('DOMContentLoaded', renderLockScreen);
        } else {
            renderLockScreen();
        }
    }
})();
