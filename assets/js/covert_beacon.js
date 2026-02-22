// ==========================================
// SILENVAULT: COVERT MICRO-AMPLITUDE BEACON
// ==========================================

(function initGhostBeacon() {
    const PAYLOAD = "PRAISE THE LORD "; 
    
    // FSK Protocol Frequencies
    const FREQ_SYNC = 18000;
    const FREQ_0 = 18200;
    const FREQ_1 = 18400;
    
    const BAUD_MS = 100; // 100ms per bit (Slow, but guarantees perfect parsing)
    const BAUD_SEC = BAUD_MS / 1000;
    const GAIN_LEVEL = 0.03; // 3% Volume. Prevents cheap speakers from screeching/aliasing.

    let audioCtx = null;
    let isPlaying = false;

    function stringToBinary(str) {
        let bits = '';
        for (let i = 0; i < str.length; i++) {
            bits += str.charCodeAt(i).toString(2).padStart(8, '0');
        }
        return bits;
    }

    function startBeacon() {
        if (isPlaying) return;
        isPlaying = true;
        
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Hardware Check: If sample rate is too low, it will screech. Abort covert transmission.
        if (audioCtx.sampleRate < 44100) {
            console.warn("SV-Beacon: Hardware incapable of clean ultrasonic transmission. Aborting to preserve stealth.");
            return;
        }

        function playLoop() {
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
                
                // 1. Start Bit (SYNC)
                osc.frequency.setValueAtTime(FREQ_SYNC, time);
                gain.gain.setValueAtTime(GAIN_LEVEL, time);
                time += BAUD_SEC;

                // 2. Data Bits (8 bits)
                for (let b = 0; b < 8; b++) {
                    const freq = charBits[b] === '1' ? FREQ_1 : FREQ_0;
                    osc.frequency.setValueAtTime(freq, time);
                    time += BAUD_SEC;
                }

                // 3. Stop Bit (Silence)
                gain.gain.setValueAtTime(0, time);
                time += BAUD_SEC; // Pause between characters
            }

            osc.stop(time);

            // Reschedule the entire loop to run again after it finishes
            setTimeout(playLoop, (time - audioCtx.currentTime) * 1000);
        }

        playLoop();
    }

    // Await first interaction to bypass browser Autoplay policies
    document.addEventListener('click', () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        } else {
            startBeacon();
        }
    }, { once: true });
})();
