// ==========================================
// SILENVAULT: ULTRASONIC DUAL-TONE BEACON
// ==========================================

(function initGhostBeacon() {
    const PAYLOAD = "JESUS IS OUR SAVIOR "; // The trailing space separates the loop
    const BASE_FREQ = 18000;
    const FREQ_STEP = 100; // 100Hz separation between hexadecimal nibbles
    const CHAR_DUR = 0.2; // 200ms per character
    const PAUSE_DUR = 0.05; // 50ms silence between characters
    
    let audioCtx = null;
    let isPlaying = false;

    // Converts a character into two distinct ultrasonic frequencies
    function getFrequencies(char) {
        const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
        const highNibble = parseInt(hex[0], 16);
        const lowNibble = parseInt(hex[1], 16);
        return [BASE_FREQ + (highNibble * FREQ_STEP), BASE_FREQ + (lowNibble * FREQ_STEP)];
    }

    function startBeacon() {
        if (isPlaying) return;
        isPlaying = true;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function scheduleLoop() {
            let time = audioCtx.currentTime + 0.1;
            
            for (let i = 0; i < PAYLOAD.length; i++) {
                const freqs = getFrequencies(PAYLOAD[i]);
                
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc1.frequency.value = freqs[0];
                osc2.frequency.value = freqs[1];
                
                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(audioCtx.destination);
                
                // Smooth envelope creates a "Clear Sound" with no harsh clicking
                gain.gain.setValueAtTime(0, time);
                gain.gain.setTargetAtTime(0.5, time, 0.01);
                gain.gain.setTargetAtTime(0, time + CHAR_DUR - 0.02, 0.01);
                
                osc1.start(time);
                osc2.start(time);
                osc1.stop(time + CHAR_DUR);
                osc2.stop(time + CHAR_DUR);
                
                time += CHAR_DUR + PAUSE_DUR;
            }
            
            // Loop the beacon forever
            setTimeout(scheduleLoop, (time - audioCtx.currentTime) * 1000);
        }
        scheduleLoop();
    }

    // BROWSER BYPASS: Audio cannot play until the user interacts with the page.
    // We wait for their very first click anywhere on the website to ignite the beacon.
    document.addEventListener('click', () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        } else {
            startBeacon();
        }
    }, { once: true });
})();
