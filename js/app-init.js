// ============================================
// APP-INIT.JS - Initialize All Calculations & Event Listeners
// This file handles the main app startup and global functions
// ============================================

// ========== INITIALIZE APP ==========
function initApp() {
    console.log('🚀 Fabrics Consumption App Initialized');
    
    // Set default units
    if (typeof setKnitUnit === 'function') {
        setKnitUnit('cm');
    }
    if (typeof setPantUnit === 'function') {
        setPantUnit('cm');
    }
    
    // Initialize all calculations
    runAllCalculations();
    
    // Setup tab navigation
    setupTabNavigation();
    
    // Setup input listeners for all pages
    setupGlobalInputListeners();
}

// Run all calculations on page load
function runAllCalculations() {
    // Knit Garments
    if (typeof calcKnitGarments === 'function') {
        calcKnitGarments();
    }
    
    // Knit Pant
    if (typeof calcKnitPant === 'function') {
        calcKnitPant();
    }
    
    // Woven Shirt
    if (typeof calcWoven === 'function') {
        calcWoven();
    }
    
    // Booking Sheet
    if (typeof calcBooking === 'function') {
        calcBooking();
    }
    if (typeof calculateAllBookingRows === 'function') {
        calculateAllBookingRows();
    }
    
    // Knit Price
    if (typeof calcKnitPrice === 'function') {
        calcKnitPrice();
    }
    
    // Zipper
    if (typeof calcZipper === 'function') {
        calcZipper();
    }
    
    // Trims
    if (typeof calcThread === 'function') {
        calcThread();
    }
    if (typeof calcButton === 'function') {
        calcButton();
    }
    if (typeof calcInterlining === 'function') {
        calcInterlining();
    }
    
    // FOB
    if (typeof calcFOB === 'function') {
        calcFOB();
    }
    
    // Size Ratio
    if (typeof calcSizeRatio === 'function') {
        calcSizeRatio();
    }
    
    // Converter
    if (typeof calcKgToMeter === 'function') {
        calcKgToMeter();
    }
    
    // My Formulas
    if (typeof loadMyFormulas === 'function') {
        loadMyFormulas();
    }
}

// Setup tab navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId, this);
            }
        });
    });
}

// Setup global input listeners for real-time updates
function setupGlobalInputListeners() {
    // Knit Garments inputs
    setupKnitGarmentsListeners();
    
    // Knit Pant inputs
    setupKnitPantListeners();
    
    // Woven Shirt inputs
    setupWovenListeners();
    
    // Booking Sheet inputs
    setupBookingListeners();
    
    // Knit Price inputs
    setupKnitPriceListeners();
    
    // Zipper inputs
    setupZipperListeners();
    
    // Trims inputs
    setupTrimsListeners();
    
    // FOB inputs
    setupFOBListeners();
    
    // Size Ratio inputs
    setupSizeRatioListeners();
}

function setupKnitGarmentsListeners() {
    const knitInputs = [
        'kg-bl', 'kg-bla', 'kg-sl', 'kg-sla', 'kg-hc', 'kg-hca', 'kg-bgsm',
        'kg-cl', 'kg-cla', 'kg-cw', 'kg-cwa', 'kg-cgsm',
        'kg-cul', 'kg-cula', 'kg-cuw', 'kg-cuwa', 'kg-cugsm',
        'kg-pl', 'kg-pla', 'kg-pw', 'kg-pwa', 'kg-pgsm', 'kg-pqty',
        'kg-hml', 'kg-hmla', 'kg-hmw', 'kg-hmwa', 'kg-hmgsm',
        'kg-waste', 'kg-qty'
    ];
    
    knitInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateKnitTotals === 'function') updateKnitTotals();
            });
        }
    });
    
    // Checkbox listeners
    const checkboxes = ['ck-collar', 'ck-cuff', 'ck-pocket', 'ck-halfmoon'];
    checkboxes.forEach(id => {
        const cb = document.getElementById(id);
        if (cb) {
            cb.addEventListener('change', function() {
                if (typeof toggleOptPanels === 'function') toggleOptPanels();
            });
        }
    });
}

function setupKnitPantListeners() {
    const pantInputs = ['kp-il', 'kp-ila', 'kp-cfr', 'kp-cfra', 'kp-wbw', 'kp-wbwa', 'kp-htc', 'kp-htca', 'kp-gsm', 'kp-waste'];
    pantInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updatePantTotals === 'function') updatePantTotals();
            });
        }
    });
}

function setupWovenListeners() {
    const wovenInputs = ['ws-bl', 'ws-bla', 'ws-hc', 'ws-hca', 'ws-sl', 'ws-sla', 'ws-ah', 'ws-aha', 'ws-fw'];
    wovenInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateWovenTotals === 'function') updateWovenTotals();
            });
        }
    });
}

function setupBookingListeners() {
    const bookingInputs = ['bs-ml', 'bs-cla', 'bs-mw', 'bs-cwa', 'bs-gsm', 'bs-pcs', 'bs-cwp'];
    bookingInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateBooking === 'function') updateBooking();
            });
        }
    });
}

function setupKnitPriceListeners() {
    const priceInputs = ['kfp-w', 'kfp-gsm', 'kfp-wid', 'kfp-pkg'];
    priceInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateKnitPrice === 'function') updateKnitPrice();
            });
        }
    });
}

function setupZipperListeners() {
    const zipperInputs = ['zp-bl', 'zp-fnd', 'zp-hn', 'zp-shr'];
    zipperInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateZipper === 'function') updateZipper();
            });
        }
    });
}

function setupTrimsListeners() {
    const threadInputs = ['th-seam', 'th-layer', 'th-spi', 'th-tps'];
    threadInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateThread === 'function') updateThread();
            });
        }
    });
    
    const buttonInputs = ['bt-pp', 'bt-ex'];
    buttonInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateButton === 'function') updateButton();
            });
        }
    });
    
    const interliningInputs = ['il-len', 'il-wid', 'il-qty'];
    interliningInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateInterlining === 'function') updateInterlining();
            });
        }
    });
}

function setupFOBListeners() {
    const fobInputs = ['fob-fab', 'fob-tr', 'fob-cm', 'fob-acc', 'fob-oh', 'fob-pr', 'fob-fr', 'fob-ins'];
    fobInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateFOB === 'function') updateFOB();
            });
        }
    });
}

function setupSizeRatioListeners() {
    const ratioInputs = ['sr-total', 'sr-r1', 'sr-r2', 'sr-r3', 'sr-r4', 'sr-r5'];
    ratioInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (typeof updateSizeRatio === 'function') updateSizeRatio();
            });
        }
    });
}

// ========== EXPORT GLOBAL FUNCTIONS ==========
window.showPage = showPage;
window.setKnitUnit = setKnitUnit;
window.setPantUnit = setPantUnit;
window.calcKnitGarments = calcKnitGarments;
window.calcKnitPant = calcKnitPant;
window.calcWoven = calcWoven;
window.calcBooking = calcBooking;
window.calcKnitPrice = calcKnitPrice;
window.calcZipper = calcZipper;
window.calcThread = calcThread;
window.calcButton = calcButton;
window.calcInterlining = calcInterlining;
window.calcFOB = calcFOB;
window.calcSizeRatio = calcSizeRatio;
window.saveMyFormula = saveMyFormula;
window.deleteFormula = deleteFormula;
window.deleteBookingRow = deleteBookingRow;
window.addBookingRow = addBookingRow;
window.calculateAllBookingRows = calculateAllBookingRows;
window.updateKnitTotals = updateKnitTotals;
window.updatePantTotals = updatePantTotals;
window.updateWovenTotals = updateWovenTotals;
window.updateBooking = updateBooking;
window.updateKnitPrice = updateKnitPrice;
window.updateZipper = updateZipper;
window.updateThread = updateThread;
window.updateButton = updateButton;
window.updateInterlining = updateInterlining;
window.updateFOB = updateFOB;
window.updateSizeRatio = updateSizeRatio;
window.toggleOptPanels = toggleOptPanels;

// ========== START APP ==========
document.addEventListener('DOMContentLoaded', initApp);