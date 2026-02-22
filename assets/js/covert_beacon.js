// ==========================================
// SILENVAULT: COVERT VOID STREAM BEACON
// ==========================================

(function initVoidStream() {
    const PAYLOAD = "JESUS IS OUR SAVIOR ";
    const INTERVAL_MS = 300; // Speed of the invisible typing

    // Create a mathematically invisible container (Accessible only via DOM Inspector)
    const voidElement = document.createElement('div');
    voidElement.id = 'sv-void-stream';
    voidElement.style.cssText = 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; opacity:0; pointer-events:none;';
    voidElement.setAttribute('aria-hidden', 'true');
    
    let charIndex = 0;
    let streamBuffer = "";

    function streamToVoid() {
        streamBuffer += PAYLOAD[charIndex];
        charIndex++;

        // Loop the payload
        if (charIndex >= PAYLOAD.length) {
            charIndex = 0;
            streamBuffer += " | "; // Add a visual separator between loops
        }

        // Prevent memory leaks by capping the string length in the DOM
        if (streamBuffer.length > 200) {
            streamBuffer = streamBuffer.substring(50); 
        }

        voidElement.innerText = streamBuffer;
    }

    // Mount to DOM securely without blocking page load
    const mountVoid = () => {
        document.body.appendChild(voidElement);
        setInterval(streamToVoid, INTERVAL_MS);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountVoid);
    } else {
        mountVoid();
    }
})();
