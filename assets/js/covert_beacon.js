// ==========================================
// SILENVAULT: HARDWARE-AWARE COVERT BEACON
// ==========================================

(function initHardwareBeacon() {
    const PAYLOAD = "JESUS IS OUR SAVIOR "; 
    
    // FSK Protocol Frequencies (Ultrasonic)
    const FREQ_SYNC = 18000;
    const FREQ_0 = 18200;
    const FREQ_1 = 18400;
    
    const BAUD_MS = 100; // 100ms per bit
    const BAUD_SEC = BAUD_MS / 1000;
    const GAIN_LEVEL = 0.03; // 3% Volume. Highly covert.

    let audioCtx = null;
    let isPlaying = false;

    function bootBeacon() {
        if (isPlaying) return;

        // Initialize Audio Engine
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // 1. HARDWARE CAPABILITY CHECK (The Nyquist Filter)
        // High-end hardware runs at 44.1kHz or 48kHz. Low-end runs at 22kHz or lower.
        // If the sample rate is less than 44100, the hardware cannot physically 
        // handle 18kHz frequencies without aliasing (screeching). 
        if (audioCtx.sampleRate < 44100) {
            console.warn("SV-Beacon: Low-end acoustic hardware detected. Covert array aborted to maintain stealth.");
            return; 
        }

        isPlaying = true;

        function playLoop() {
            // We create a master envelope for the character to ensure clean cuts
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            gain.gain.value = 0;
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            let time = audioCtx.currentTime + 0.1;
            osc.start(time);

            for (let c = 0; c < PAYLOAD.length; c++) {
                const charBits = PAYLOAD.charCodeAt(c).toString(2).padStart(8, '0');
                
                // 1. Sync / Start Tone
                osc.frequency.setValueAtTime(FREQ_SYNC, time);
                gain.gain.setValueAtTime(GAIN_LEVEL, time);
                time += BAUD_SEC;

                // 2. Data Payload
                for (let b = 0; b < 8; b++) {
                    const freq = charBits[b] === '1' ? FREQ_1 : FREQ_0;
                    osc.frequency.setValueAtTime(freq, time);
                    time += BAUD_SEC;
                }

                // 3. Pause
                gain.gain.setValueAtTime(0, time);
                time += BAUD_SEC; 
            }

            osc.stop(time);

            // Recursively schedule the next loop to keep memory usage flat
            setTimeout(playLoop, (time - audioCtx.currentTime) * 1000);
        }

        playLoop();
    }

    // 2. THE AUTOPLAY INJECTION
    window.addEventListener('load', () => {
        // We attempt to boot immediately.
        try {
            bootBeacon();
            
            // If the browser suspends the audio context due to Autoplay policies,
            // we attach a stealth trap. The instant the user scrolls, types, or clicks,
            // the context resumes.
            if (audioCtx && audioCtx.state === 'suspended') {
                const stealthResume = () => {
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                    // Remove listeners once activated
                    ['click', 'scroll', 'keydown', 'touchstart'].forEach(evt => {
                        document.removeEventListener(evt, stealthResume);
                    });
                };
                
                ['click', 'scroll', 'keydown', 'touchstart'].forEach(evt => {
                    document.addEventListener(evt, stealthResume, { once: true });
                });
            }
        } catch (e) {
            // Fails silently if AudioContext is completely blocked by device
        }
    });

})();
