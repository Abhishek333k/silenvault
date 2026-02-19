// assets/js/directory.js

const silenVaultTools = [
    // --- BUSINESS OPERATIONS ---
    {
        category: "business",
        id: "invoice_generator",
        title: "Invoice Architect",
        desc: "Generate, edit, and print professional PDF invoices instantly.",
        link: "tools/invoice_generator",
        tag: "",
        iconColors: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`
    },
    {
        category: "business",
        id: "budget_planner",
        title: "Budget Architect",
        desc: "Securely track project costs with auto-save and category breakdowns.",
        link: "tools/budget_planner",
        tag: "",
        iconColors: "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />`
    },
    {
        category: "business",
        id: "loan_calculator",
        title: "Loan Architect",
        desc: "Calculate EMI for Home & Car loans with amortization charts.",
        link: "tools/loan_calculator",
        tag: "",
        iconColors: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },
    {
        category: "business",
        id: "salary_tax_calculator",
        title: "Salary Architect Pro",
        desc: "Calculate take-home pay and compare Old vs New tax regimes securely.",
        link: "tools/salary_tax_calculator",
        tag: "",
        iconColors: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />`
    },
    {
        category: "business",
        id: "gst_calculator",
        title: "GST & Tax Engine",
        desc: "Instant tax breakdown for 50+ countries. RCM supported.",
        link: "tools/gst_calculator",
        tag: "",
        iconColors: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },

    // --- HARDWARE DIAGNOSTICS ---
    {
        category: "hardware",
        id: "keyboard_tester",
        title: "Keyboard Architect",
        desc: "Test hardware keys, analyze ghosting, and extract raw JS event codes.",
        link: "tools/keyboard_tester",
        tag: "Hardware",
        iconColors: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500",
        // Icon of a Keyboard
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M3 14h1m4 0h1m4 0h1m4 0h1m-15-4h1m4 0h1m4 0h1m4 0h1M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />`
    },

    // --- CREATOR TOOLS ---
    {
        category: "creator",
        id: "yt_thumbnail",
        title: "YouTube Thumbnails",
        desc: "Extract 4K/HD thumbnails from any video instantly.",
        link: "tools/yt_thumbnail",
        tag: "",
        iconColors: "bg-red-500/10 text-red-500 group-hover:bg-red-500",
        iconPath: `<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>`
    },
    {
        category: "creator",
        id: "image_converter",
        title: "Image Converter Pro",
        desc: "Convert between WebP, AVIF, PNG, and JPG locally and instantly.",
        link: "tools/image_converter",
        tag: "",
        iconColors: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />`
    },
    {
        category: "creator",
        id: "exif_remover",
        title: "EXIF Shield",
        desc: "Scan & remove GPS location data from your photos.",
        link: "tools/exif_remover",
        tag: "",
        iconColors: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`
    },
    {
        category: "creator",
        id: "image_compressor",
        title: "Smart Compressor",
        desc: "Reduce file size by up to 80% without losing quality.",
        link: "tools/image_compressor",
        tag: "",
        iconColors: "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />`
    },

    // --- DEVELOPER UTILITIES ---
    {
        category: "dev",
        id: "ide",
        title: "Architect Pro IDE",
        desc: "Professional sandboxed HTML/CSS/JS editor with real-time compilation.",
        link: "tools/html_viewer",
        tag: "",
        iconColors: "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />`
    },
    {
        category: "dev",
        id: "markdown_converter",
        title: "Markdown Architect",
        desc: "Real-time Markdown to HTML compiler with syntax highlighting & telemetry.",
        link: "tools/markdown_converter",
        tag: "",
        iconColors: "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`
    },
    {
        category: "dev",
        id: "jwt_architect",
        title: "JWT Architect Pro",
        desc: "Local-first JWT debugger. Encode, decode, and sign tokens with real-time two-way binding.",
        link: "tools/jwt_architect",
        tag: "Security",
        iconColors: "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />`
    },
    {
        category: "dev",
        id: "base64_converter",
        title: "Base64 Engine",
        desc: "Convert images to Data URI strings and back for development.",
        link: "tools/base64_converter",
        tag: "",
        iconColors: "bg-violet-500/10 text-violet-500 group-hover:bg-violet-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />`
    },
    {
        category: "dev",
        id: "json_tool",
        title: "JSON Architect",
        desc: "Clean, format, and validate JSON data locally.",
        link: "tools/json_tool",
        tag: "",
        iconColors: "bg-pink-500/10 text-pink-400 group-hover:bg-pink-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />`
    },
    {
        category: "dev",
        id: "unit_converter",
        title: "Omni-Converter",
        desc: "Length, Weight, and Digital Unit translation.",
        link: "tools/unit_converter",
        tag: "",
        iconColors: "bg-orange-500/10 text-orange-400 group-hover:bg-orange-500",
        iconPath: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />`
    }
];
