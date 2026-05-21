// ============================================
// UTILITIES.JS - Common Functions
// ============================================

// Get element value as number
function v(id) {
    return parseFloat(document.getElementById(id)?.value) || 0;
}

// Get element by ID
function el(id) {
    return document.getElementById(id);
}

// Set text content of an element
function set(id, val) {
    const e = el(id);
    if (e) e.textContent = val;
}

// Format number with decimal places
function fmt(n, d = 3) {
    return isNaN(n) ? '—' : n.toFixed(d);
}

// Get total of two inputs (actual + allowance)
function tot(aId, bId) {
    return v(aId) + v(bId);
}

// Update seam allowance total display
function saUpdate(aId, bId, tId, unit = 'cm') {
    const total = v(aId) + v(bId);
    const span = el(tId);
    if (span) span.innerHTML = total.toFixed(1) + ' ' + unit;
}

// Convert cm to inch
function cmToInch(cm) {
    return cm / 2.54;
}

// Convert inch to cm
function inchToCm(inch) {
    return inch * 2.54;
}

// Get current unit for a specific page (kg = knit garments, kp = knit pant)
let knitUnit = 'cm';
let pantUnit = 'cm';

function getKnitUnit() {
    return knitUnit;
}

function setKnitUnit(unit) {
    knitUnit = unit;
}

function getPantUnit() {
    return pantUnit;
}

function setPantUnit(unit) {
    pantUnit = unit;
}

// Page navigation
function showPage(pageId, btn) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    if (btn) btn.classList.add('active');
    
    // Recalculate based on page
    if (pageId === 'knit' && typeof calcKnitGarments === 'function') {
        calcKnitGarments();
    } else if (pageId === 'knitpant' && typeof calcKnitPant === 'function') {
        calcKnitPant();
    } else if (pageId === 'woven' && typeof calcWoven === 'function') {
        calcWoven();
    } else if (pageId === 'booking' && typeof calcBooking === 'function') {
        calcBooking();
    } else if (pageId === 'knitprice' && typeof calcKnitPrice === 'function') {
        calcKnitPrice();
    } else if (pageId === 'zipper' && typeof calcZipper === 'function') {
        calcZipper();
    } else if (pageId === 'fob' && typeof calcFOB === 'function') {
        calcFOB();
    } else if (pageId === 'sizeratio' && typeof calcSizeRatio === 'function') {
        calcSizeRatio();
    }
}

// Generate PDF (base function - each page can override)
function generatePDF(title, contentHtml) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Inter', sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; }
                h1 { color: #0f172a; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; margin-bottom: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .date { color: #64748b; font-size: 12px; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
                th { background: #f8fafc; font-weight: 600; }
                .total-row { background: #dbeafe; font-weight: bold; }
                .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                .box { background: linear-gradient(135deg, #0f172a, #1e3a5f); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
                .box-value { font-size: 32px; font-weight: 800; }
                .highlight { color: #0ea5e9; }
            </style>
        </head>
        <body>
            ${contentHtml}
            <div class="footer">
                © 2026 Mostafizar Rahman | TG: @mostafizarfiz
            </div>
            <script>
                window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}