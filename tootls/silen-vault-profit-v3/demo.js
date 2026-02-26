const DemoData = {
    mangalagiri: [
        {name:"Redmi Note 13 Pro 5G", hsn:"8517", cost:14999, qty:5, target:22},
        {name:"Boat Airdopes 141", hsn:"8518", cost:899, qty:20, target:35},
        {name:"Ambrane 20000mAh Powerbank", hsn:"8504", cost:799, qty:15, target:28},
        {name:"Type-C Fast Charger", hsn:"8504", cost:149, qty:50, target:40}
    ],
    meesho: [
        {name:"Women Cotton Anarkali Kurti", hsn:"6204", cost:249, qty:30, target:45},
        {name:"Wireless Gaming Mouse", hsn:"8471", cost:179, qty:25, target:38},
        {name:"LED Rechargeable Table Lamp", hsn:"9405", cost:139, qty:40, target:52},
        {name:"Stainless Steel Water Bottle 1L", hsn:"7323", cost:89, qty:60, target:48}
    ],
    amazon: [
        {name:"Samsung Galaxy M34 5G", hsn:"8517", cost:12499, qty:3, target:18},
        {name:"Noise ColorFit Pulse 3", hsn:"8518", cost:1099, qty:12, target:30},
        {name:"Philips Trimmer BT3101", hsn:"8510", cost:699, qty:8, target:25}
    ]
};

function populateDemo(type) {
    Engine.products = DemoData[type].map(p => ({...p}));
    Engine.renderTable();
    Engine.calculateAll();
    Engine.hideDemoModal();
    Engine.showToast(`Loaded ${type.toUpperCase()} demo — ready for Mangalagiri market pricing`);
}

// Render demo options in modal
window.addEventListener('load', () => {
    const container = document.getElementById('demo-options');
    const options = [
        {key:'mangalagiri', label:'Mangalagiri Electronics', emoji:'📱'},
        {key:'meesho', label:'Meesho Dropship', emoji:'👗'},
        {key:'amazon', label:'Amazon.in GST Ready', emoji:'🛒'}
    ];
    
    let html = '';
    options.forEach(o => {
        html += `
            <button onclick="populateDemo('${o.key}')" 
                    class="glass hover:border-blue-500 transition-all p-6 rounded-3xl text-center">
                <div class="text-4xl mb-3">${o.emoji}</div>
                <div class="font-bold">${o.label}</div>
            </button>`;
    });
    container.innerHTML = html;
});
