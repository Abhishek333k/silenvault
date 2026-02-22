// ==========================================
// SILENVAULT: MAINTENANCE GATEKEEPER BRAIN
// ==========================================

(function enforceGatekeeper() {
    // 1. THE BRAIN: Add the file names of any tools that are broken or under construction.
    const lockedVaults = [
        'test_page_example' // Note: You don't need the .html extension here
    ];

    const currentPath = window.location.pathname.toLowerCase();
    
    // 2. Check if the current URL contains any of the locked paths
    const isLocked = lockedVaults.some(path => currentPath.includes(path));

    if (isLocked) {
        // Instantly hide the body to prevent FOUC (Flash of Unstyled Content) before the DOM loads
        document.documentElement.style.display = 'none'; 
        
        // Wait for the DOM to be ready, then wipe it and inject the Lock Screen
        document.addEventListener("DOMContentLoaded", () => {
            document.documentElement.style.display = ''; // Restore visibility
            document.body.style.overflow = 'hidden'; // Kill scrolling
            document.body.style.height = '100vh';
            
            const gatekeeper = document.createElement('div');
            gatekeeper.className = "fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl";
            
            // Build the High-End Glassmorphism Lock Screen
            gatekeeper.innerHTML = `
                <div class="glass-panel border-rose-500/50 bg-rose-950/40 p-8 md:p-12 rounded-3xl max-w-lg w-[90%] text-center shadow-[0_0_80px_rgba(225,29,72,0.2)]" style="border: 1px solid rgba(244, 63, 94, 0.5); background: rgba(30, 5, 15, 0.85); backdrop-filter: blur(20px);">
                    <div class="w-24 h-24 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/30 shadow-inner">
                        <svg class="w-12 h-12 text-rose-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <h2 class="text-3xl font-black text-white tracking-tight mb-4 uppercase" style="font-family: 'Inter', sans-serif;">Sector Locked</h2>
                    <p class="text-rose-200/70 text-sm leading-relaxed mb-10" style="font-family: 'Inter', sans-serif;">This tool is currently undergoing cryptographic maintenance and architectural upgrades. Access to this vault is temporarily restricted.</p>
                    
                    <a href="../index.html" class="inline-flex items-center justify-center gap-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl border border-slate-600 transition-all hover:border-slate-400 shadow-lg" style="font-family: 'Inter', sans-serif;">
                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        Return to Main Hub
                    </a>
                </div>
            `;
            
            // Wipe the broken tool's HTML and mount the lock screen
            document.body.innerHTML = ''; 
            document.body.appendChild(gatekeeper);
        });
    }
})();
