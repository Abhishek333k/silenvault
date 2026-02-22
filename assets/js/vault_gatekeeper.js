// ==========================================
// SILENVAULT: MAINTENANCE GATEKEEPER BRAIN
// ==========================================

(function enforceGatekeeper() {
    // THE BRAIN: Include the folder path to prevent locking your /bin/ prototypes!
    const lockedVaults = [
        '/tools/budget_planner',       // This locks the LIVE production tool
        '/tools/bin/loan_calculator',  // This locks ONLY the prototype
        '/tools/bin/test_page_example'             
    ];

    // Normalize the current browser URL
    const currentPath = window.location.pathname.toLowerCase();
    
    // The logic will now strictly check for the exact folder path
    const isLocked = lockedVaults.some(lockedPath => currentPath.includes(lockedPath));

    if (isLocked) {
        // The function that annihilates the page and renders the lock screen
        const renderLockScreen = () => {
            // Restore visibility in case it was hidden, lock scrolling
            document.documentElement.style.display = '';
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            
            // Wipe the broken tool's HTML completely
            document.body.innerHTML = '';
            document.body.className = 'bg-slate-950 flex items-center justify-center h-screen w-screen m-0 p-0 overflow-hidden';
            
            // Inject the High-End Glassmorphism Lock Screen
            document.body.innerHTML = `
                <div class="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4">
                    <div class="bg-rose-950/40 p-8 md:p-12 rounded-3xl max-w-lg w-full text-center shadow-[0_0_80px_rgba(225,29,72,0.2)] border border-rose-500/50" style="backdrop-filter: blur(20px);">
                        <div class="w-24 h-24 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/30 shadow-inner">
                            <svg class="w-12 h-12 text-rose-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <h2 class="text-3xl font-black text-white tracking-tight mb-4 uppercase" style="font-family: 'Inter', sans-serif;">Sector Locked</h2>
                        <p class="text-rose-200/70 text-sm leading-relaxed mb-10" style="font-family: 'Inter', sans-serif;">This tool is currently undergoing cryptographic maintenance and architectural upgrades. Access to this vault is temporarily restricted.</p>
                        
                        <a href="/index" class="inline-flex items-center justify-center gap-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl border border-slate-600 transition-all hover:border-slate-400 shadow-lg" style="font-family: 'Inter', sans-serif;">
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Return to Main Hub
                        </a>
                    </div>
                </div>
            `;
        };

        // 3. RACE-CONDITION FIX: Check if DOM is already loaded.
        if (document.readyState === 'loading') {
            // If still loading, hide the document to prevent seeing broken HTML, then wait for load.
            document.documentElement.style.display = 'none';
            document.addEventListener('DOMContentLoaded', renderLockScreen);
        } else {
            // If already loaded (because layout.js was deferred), execute instantly.
            renderLockScreen();
        }
    }
})();
