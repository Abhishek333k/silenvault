// ==========================================
// SILENVAULT: COVERT ULTRASONIC BEACON
// ==========================================

(function initCovertBeacon() {
    // The Secret Payload
    const PAYLOAD = "JESUS IS OUR SAVIOR";
    const FREQUENCY = 18500; // 18.5kHz - Completely silent to humans, highly visible to machines
    const WPM = 20; // Speed of transmission
    
    // Morse Math
    const DOT_MS = 1200 / WPM; 
    const DASH_MS = DOT_MS * 3;
    const SYMBOL_SPACE = DOT_MS;
    const LETTER_SPACE = DOT_MS * 3;
    const WORD_SPACE = DOT_MS * 7;

    const MORSE_MAP = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', ' ': ' '
    };

    let audioCtx = null;
    let isPlaying = false;

    // Convert string to timing array [duration_on, duration_off, duration_on...]
    function buildTimingSequence(text) {
        const sequence = [];
        const chars = text.toUpperCase().split('');
        
        chars.forEach((char, index) => {
            if (char === ' ') {
                sequence.push({ on: false, duration: WORD_SPACE });
                return;
            }
            
            const morse = MORSE_MAP[char];
            if (!morse) return;

            for (let i = 0; i < morse.length; i++) {
                sequence.push({ on: true, duration: morse[i] === '.' ? DOT_MS : DASH_MS });
                // Space between symbols, unless it's the last symbol of the letter
                if (i < morse.length - 1) {
                    sequence.push({ on: false, duration: SYMBOL_SPACE });
                }
            }
            
            // Space between letters, unless it's the last character
            if (index < chars.length - 1 && chars[index + 1] !== ' ') {
                sequence.push({ on: false, duration: LETTER_SPACE });
            }
        });
        
        // Loop delay
        sequence.push({ on: false, duration: WORD_SPACE * 2 });
        return sequence;
    }

    function startBeacon() {
        if (isPlaying) return;
        isPlaying = true;

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const sequence = buildTimingSequence(PAYLOAD);
        
        function playLoop() {
            let time = audioCtx.currentTime;
            
            sequence.forEach(step => {
                if (step.on) {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.value = FREQUENCY;
                    
                    // Soft envelope to prevent "clicking" noises in lower frequencies
                    gain.gain.setValueAtTime(0, time);
                    gain.gain.setTargetAtTime(1, time, 0.005);
                    gain.gain.setTargetAtTime(0, time + (step.duration / 1000) - 0.01, 0.005);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.start(time);
                    osc.stop(time + (step.duration / 1000));
                }
                time += (step.duration / 1000);
            });

            // Schedule the next loop exactly when this one finishes
            setTimeout(playLoop, (time - audioCtx.currentTime) * 1000);
        }

        playLoop();
    }

    // BROWSER POLICY BYPASS: 
    // Browsers forbid audio from playing until the user interacts with the document.
    // We attach a stealth listener to the whole document. The very first time they click ANYWHERE, the beacon ignites.
    document.addEventListener('click', () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        } else {
            startBeacon();
        }
    }, { once: true });

})();
