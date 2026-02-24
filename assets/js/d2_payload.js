/**
 * SilenVault | Encrypted Deep Vault Payload
 * To protect the structural integrity of Dimension 2 from casual DOM inspection,
 * the layout is stored as a Base64-Encoded URI Component.
 */

const rawD2HTML = `
<div class="fixed inset-0 z-[-10]" style="background-color: #06010a; background-image: radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.2) 0%, transparent 80%), linear-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px); background-size: 100% 100%, 50px 50px, 50px 50px; background-position: center top, center center, center center;"></div>
<div class="absolute inset-0 w-full min-h-screen z-50 flex flex-col items-center justify-center px-4" style="animation: d2-arrive 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
    <button onclick="window.location.reload()" class="absolute top-8 left-8 text-xs font-mono text-[#d8b4fe] border border-[#a855f7]/50 bg-[#140523]/70 px-4 py-2 hover:bg-[#a855f7]/20 transition-all uppercase tracking-widest backdrop-blur-md" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">&lt; System Reboot</button>
    <div class="text-center mb-10 w-full max-w-5xl px-4 md:px-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mt-16 md:mt-0">
        <div class="text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ec4899]/20 border border-[#ec4899] text-[#ec4899] text-[10px] font-mono tracking-widest uppercase mb-4" style="clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);">
                <span class="w-1.5 h-1.5 bg-[#ec4899] animate-ping"></span> Live Schematic
            </div>
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-[#faf5ff] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">THE FORGE</h1>
        </div>
        <div class="text-center md:text-right font-mono text-[#a855f7] text-[10px] md:text-xs opacity-60 leading-relaxed border border-[#a855f7]/30 p-2 bg-[#a855f7]/5">
            STATUS: ENCRYPTED<br>UPLINK: SEVERED<br>AUTH: FORGE_SMITH
        </div>
    </div>
    <div class="grid md:grid-cols-2 gap-6 max-w-5xl w-full px-4 md:px-8">
        <div class="p-6 md:p-8 bg-[#0a020f]/80 border border-[#a855f7]/40 border-t-[3px] border-t-[#22d3ee] relative transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)] hover:border-[#22d3ee] cursor-pointer backdrop-blur-md" style="clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));">
            <h3 class="font-mono text-[#22d3ee] font-bold text-lg md:text-xl mb-3">> HIRE_ARCHITECT.sh</h3>
            <p class="text-[#d8b4fe] text-xs md:text-sm leading-relaxed mb-6 font-mono opacity-80">Execute bespoke local-first software engineering protocols. Deploy isolated WebAssembly components.</p>
            <button class="bg-[#a855f7]/10 border border-[#a855f7] text-[#a855f7] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 md:px-6 md:py-3 transition-all hover:bg-[#a855f7] hover:text-[#000] hover:shadow-[0_0_20px_#a855f7]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">Initialize Request</button>
        </div>
        <div class="p-6 md:p-8 bg-[#0a020f]/80 border border-[#a855f7]/40 border-t-[3px] border-t-[#ec4899] relative transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] hover:border-[#ec4899] cursor-pointer backdrop-blur-md" style="clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);">
            <h3 class="font-mono text-[#ec4899] font-bold text-lg md:text-xl mb-3">> BLACK_MARKET.exe</h3>
            <p class="text-[#d8b4fe] text-xs md:text-sm leading-relaxed mb-6 font-mono opacity-80">Acquire unlisted UI boilerplates, experimental alpha-stage algorithms, and encrypted data modules.</p>
            <button class="bg-[#ec4899]/10 border border-[#ec4899] text-[#ec4899] font-mono text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-3 md:px-6 md:py-3 transition-all hover:bg-[#ec4899] hover:text-[#000] hover:shadow-[0_0_20px_#ec4899]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">Access Registry</button>
        </div>
    </div>
</div>
<style>@keyframes d2-arrive { 0% { opacity: 0; transform: scale(0.5); filter: blur(20px); } 100% { opacity: 1; transform: scale(1); filter: blur(0); } }</style>
`;

// Export the encrypted payload globally
window.D2_ENCRYPTED_PAYLOAD = btoa(encodeURIComponent(rawD2HTML));
