// ==========================================
// SILENVAULT: COVERT MORSE BEACON
// ==========================================

(function initMorseBeacon() {
    const PAYLOAD = "JESUS IS OUR SAVIOR";
    const FREQUENCY = 17500; // 17.5kHz - High enough to be covert, low enough to reduce hardware screeching
    const WPM = 15; // 15 Words Per Minute (Slow and reliable)
    
    // Morse Math (Standard International Timing)
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
                if (i < morse.length - 1) sequence.push({ on: false, duration: SYMBOL_SPACE });
            }
            if (index < chars.length - 1 && chars[index + 1] !== ' ') {
                sequence.push({ on: false, duration: LETTER_SPACE });
            }
        });
        sequence.push({ on: false, duration: WORD_SPACE * 2 }); // Loop delay
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
                    
                    // Soft attack/release to prevent audio clicking
                    gain.gain.setValueAtTime(0, time);
                    gain.gain.setTargetAtTime(0.05, time, 0.01); // 5% Volume
                    gain.gain.setTargetAtTime(0, time + (step.duration / 1000) - 0.015, 0.01);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.start(time);
                    osc.stop(time + (step.duration / 1000));
                }
                time += (step.duration / 1000);
            });

            setTimeout(playLoop, (time - audioCtx.currentTime) * 1000);
        }

        playLoop();
    }

    // Stealth Boot
    window.addEventListener('load', () => {
        try {
            startBeacon();
            if (audioCtx && audioCtx.state === 'suspended') {
                const stealthResume = () => {
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                    ['click', 'scroll', 'keydown', 'touchstart'].forEach(evt => document.removeEventListener(evt, stealthResume));
                };
                ['click', 'scroll', 'keydown', 'touchstart'].forEach(evt => document.addEventListener(evt, stealthResume, { once: true }));
            }
        } catch (e) {}
    });

})();
