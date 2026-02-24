// assets/js/directory.js

const silenVaultTools = [
    // --- ADMINISTRATIVE OPERATIONS (business) ---
    {
        category: "business", id: "invoice_generator",
        title: "Invoice Compiler", desc: "Compile structured financial data into downloadable PDF documents locally.",
        link: "tools/invoice_generatorl", tag: "Finance",
        iconColors: "bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`
    },
    {
        category: "business", id: "budget_planner",
        title: "Expense Tracker", desc: "Local state budget allocation tracking and expense logging system.",
        link: "tools/budget_plannerl", tag: "Finance",
        iconColors: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />`
    },
    {
        category: "business", id: "loan_calculator",
        title: "Amortization Calculator", desc: "Compute EMI schedules and generate visual amortization charts via Canvas API.",
        link: "tools/loan_calculatorl", tag: "Finance",
        iconColors: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },
    {
        category: "business", id: "salary_tax_calculator",
        title: "Tax & Income Modeler", desc: "Calculate regional tax regime deductions and compute net income trajectories.",
        link: "tools/salary_tax_calculatorl", tag: "Finance",
        iconColors: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />`
    },
    {
        category: "business", id: "gst_calculator",
        title: "VAT/GST Calculator", desc: "Apply percentage modifiers to structured pricing data. Supports Reverse Charge Mechanisms.",
        link: "tools/gst_calculatorl", tag: "Finance",
        iconColors: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },
    {
        category: "business", id: "qr_generator",
        title: "Data Matrix Engine", desc: "Construct static QR protocols, URI routing arrays, and composite visual frames locally.",
        link: "tools/qr_generatorl", tag: "Utility",
        iconColors: "bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />`
    },

    // --- DEVELOPER UTILITIES (dev) ---
    {
        category: "dev", id: "ide",
        title: "Web DOM Sandbox", desc: "Isolated environment for evaluating HTML, CSS, and JS execution in real-time.",
        link: "tools/web_idel", tag: "Code",
        iconColors: "bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />`
    },
    {
        category: "dev", id: "markdown_converter",
        title: "Markdown Parser", desc: "Parse raw Markdown strings and compile them to formatted HTML DOM nodes.",
        link: "tools/markdown_converterl", tag: "Code",
        iconColors: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`
    },
    {
        category: "dev", id: "jwt_architect",
        title: "JWT Debugger", desc: "Decode, verify, and trace JSON Web Token signatures without transmission.",
        link: "tools/jwt_architectl", tag: "Security",
        iconColors: "bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />`
    },
    {
        category: "dev", id: "base64_converter",
        title: "Base64 Codec", desc: "Execute Base64 string encoding and decoding algorithms on file buffers.",
        link: "tools/base64_converterl", tag: "Code",
        iconColors: "bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:bg-violet-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />`
    },
    {
        category: "dev", id: "json_tool",
        title: "JSON Parser", desc: "Lint, validate, and structure raw JSON data payloads locally.",
        link: "tools/json_tooll", tag: "Data",
        iconColors: "bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:bg-pink-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />`
    },
    {
        category: "dev", id: "unit_converter",
        title: "Unit Converter", desc: "Calculate conversions between physical measurement strings and cryptographic byte sets.",
        link: "tools/unit_converterl", tag: "Math",
        iconColors: "bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:bg-orange-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />`
    },
    {
        category: "dev", id: "hash_generator",
        title: "Cryptographic Hash Engine", desc: "Compute MD5, SHA-256, and SHA-512 checksums using the native WebCrypto API.",
        link: "tools/hash_generatorl", tag: "Security",
        iconColors: "bg-slate-500/10 text-slate-400 border border-slate-500/20 group-hover:bg-slate-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />`
    },

    // --- HARDWARE DIAGNOSTICS (hardware) ---
    {
        category: "hardware", id: "keyboard_tester",
        title: "Input Event Listener", desc: "Monitor raw DOM keycode events and analyze hardware input ghosting limits.",
        link: "tools/keyboard_testerl", tag: "Hardware",
        iconColors: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M3 14h1m4 0h1m4 0h1m4 0h1m-15-4h1m4 0h1m4 0h1m4 0h1M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />`
    },
    {
        category: "hardware", id: "pixel_tester",
        title: "Display Diagnostics", desc: "Render pure RGB matrices to identify inactive or defective physical display pixels.",
        link: "tools/pixel_testerl", tag: "Display",
        iconColors: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`
    },
    {
        category: "hardware", id: "mic_tester",
        title: "Audio Input Diagnostics", desc: "Poll local microphone hardware via WebRTC to verify amplitude and signal clarity.",
        link: "tools/mic_testerl", tag: "Audio",
        iconColors: "bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />`
    },
    {
        category: "hardware", id: "touch_tester",
        title: "Multi-Touch Mapping", desc: "Analyze coordinate tracking arrays and trace hardware dead zones on touch panels.",
        link: "tools/touch_testerl", tag: "Mobile",
        iconColors: "bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:bg-pink-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />`
    },
    {
        category: "hardware", id: "pitch_detector",
        title: "Frequency Analyzer", desc: "Process audio buffer streams via Fast Fourier Transform (FFT) to detect spectral pitch.",
        link: "tools/tone_generatorl", tag: "Audio",
        iconColors: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />`
    },
    {
        category: "hardware", id: "webcam_tester",
        title: "Video Stream Diagnostics", desc: "Intercept client camera hardware parameters to assess resolution and capture framerate.",
        link: "tools/webcam_testerl", tag: "Video",
        iconColors: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />`
    },
    {
        category: "hardware", id: "sensor_tester",
        title: "IMU Sensor Extraction", desc: "Poll raw telemetry data from physical device accelerometers and gyroscopes.",
        link: "tools/sensor_testerl", tag: "Mobile",
        iconColors: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },
    {
        category: "hardware", id: "controller_tester",
        title: "Gamepad API Diagnostic", desc: "Analyze analog axis arrays and binary trigger states utilizing the native Gamepad API.",
        link: "tools/controller_testerl", tag: "Hardware",
        iconColors: "bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1z" />`
    },
    {
        category: "hardware", id: "vibration_tester",
        title: "Haptic Actuator Tester", desc: "Invoke and manipulate physical haptic feedback engines via the Navigator Vibration API.",
        link: "tools/vibration_testerl", tag: "Mobile",
        iconColors: "bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />`
    },

    // --- MEDIA OPERATIONS (creator) ---
    {
        category: "creator", id: "yt_thumbnail",
        title: "Metadata Extractor", desc: "Parse video URI strings to extract raw graphical metadata and thumbnail arrays.",
        link: "tools/yt_thumbnaill", tag: "Media",
        iconColors: "bg-red-500/10 text-red-400 border border-red-500/20 group-hover:bg-red-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>`
    },
    {
        category: "creator", id: "speech_engine",
        title: "Speech Synthesis API", 
        desc: "Execute Web Speech API logic for local browser-based text dictation and synthesis.",
        link: "tools/speech_enginel", tag: "Audio",
        iconColors: "bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:bg-teal-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />`
    },
    {
        category: "creator", id: "image_converter",
        title: "Image Format Codec", desc: "Transcode graphical buffers across native browser APIs (WebP, AVIF, PNG, JPG).",
        link: "tools/image_converterl", tag: "Media",
        iconColors: "bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />`
    },
    {
        category: "creator", id: "exif_remover",
        title: "EXIF Metadata Purger", desc: "Parse hardware buffers to identify and strip embedded Exchangeable Image File Format parameters.",
        link: "tools/exif_removerl", tag: "Security",
        iconColors: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`
    },
    {
        category: "creator", id: "image_compressor",
        title: "Graphical Compression Engine", desc: "Execute local dimension scaling and lossy compression arrays on image objects.",
        link: "tools/image_compressorl", tag: "Media",
        iconColors: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-400 group-hover:text-[#020617] group-hover:border-transparent transition-all",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />`
    }
];
