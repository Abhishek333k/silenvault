(function() {
    const consentKey = 'silenvault_consent';
    
    // Check if user already consented
    if (localStorage.getItem(consentKey)) return;

    // Create Banner Elements
    const banner = document.createElement('div');
    banner.className = `
        fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-700 
        p-4 md:p-6 z-[100] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl
        transform transition-transform duration-500 translate-y-full
    `;
    banner.id = 'cookie-banner';

    banner.innerHTML = `
        <div class="text-sm text-slate-300 max-w-3xl">
            <strong class="text-white">We value your privacy.</strong>
            We use cookies to enhance your experience, analyze traffic, and serve personalized ads via Google AdSense. 
            By continuing, you agree to our <a href="/policies/privacy.html" class="text-blue-400 hover:underline">Privacy Policy</a>.
        </div>
        <div class="flex gap-3 shrink-0">
            <button id="btn-decline" class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
                Necessary Only
            </button>
            <button id="btn-accept" class="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 transition-all">
                Accept All
            </button>
        </div>
    `;

    document.body.appendChild(banner);

    // Animation: Slide Up
    requestAnimationFrame(() => {
        banner.classList.remove('translate-y-full');
    });

    // Logic
    document.getElementById('btn-accept').onclick = () => {
        localStorage.setItem(consentKey, 'accepted');
        hideBanner();
    };

    document.getElementById('btn-decline').onclick = () => {
        localStorage.setItem(consentKey, 'declined');
        hideBanner();
    };

    function hideBanner() {
        banner.classList.add('translate-y-full');
        setTimeout(() => banner.remove(), 500);
    }
})();
