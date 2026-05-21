// ============================================
// KNIT GARMENTS.JS - T-Shirt + Collar + Cuff + Pocket + Half-moon
// ============================================

// Initialize variables
let knitUnit = 'cm';

function setKnitUnit(unit) {
    knitUnit = unit;
    updateUnitLabels();
    convertKnitInputs();
    calcKnitGarments();
}

function updateUnitLabels() {
    document.querySelectorAll('#page-knit .unit-label').forEach(label => {
        label.textContent = '(' + knitUnit + ')';
    });
}

function convertKnitInputs() {
    const isInch = (knitUnit === 'inch');
    
    const inputPairs = [
        { actual: 'kg-bl', allow: 'kg-bla', tot: 'kg-blt' },
        { actual: 'kg-sl', allow: 'kg-sla', tot: 'kg-slt' },
        { actual: 'kg-hc', allow: 'kg-hca', tot: 'kg-hct' },
        { actual: 'kg-cl', allow: 'kg-cla', tot: 'kg-clt' },
        { actual: 'kg-cw', allow: 'kg-cwa', tot: 'kg-cwt' },
        { actual: 'kg-cul', allow: 'kg-cula', tot: 'kg-cul-t' },
        { actual: 'kg-cuw', allow: 'kg-cuwa', tot: 'kg-cuw-t' },
        { actual: 'kg-pl', allow: 'kg-pla', tot: 'kg-pl-t' },
        { actual: 'kg-pw', allow: 'kg-pwa', tot: 'kg-pw-t' },
        { actual: 'kg-hml', allow: 'kg-hmla', tot: 'kg-hml-t' },
        { actual: 'kg-hmw', allow: 'kg-hmwa', tot: 'kg-hmw-t' }
    ];
    
    inputPairs.forEach(pair => {
        const actualEl = el(pair.actual);
        const allowEl = el(pair.allow);
        if (actualEl && allowEl) {
            let actualVal = parseFloat(actualEl.value) || 0;
            let allowVal = parseFloat(allowEl.value) || 0;
            
            if (isInch) {
                actualEl.value = (actualVal / 2.54).toFixed(2);
                allowEl.value = (allowVal / 2.54).toFixed(2);
            } else {
                actualEl.value = (actualVal * 2.54).toFixed(2);
                allowEl.value = (allowVal * 2.54).toFixed(2);
            }
            
            const newActual = parseFloat(actualEl.value) || 0;
            const newAllow = parseFloat(allowEl.value) || 0;
            const totSpan = el(pair.tot);
            if (totSpan) totSpan.innerHTML = (newActual + newAllow).toFixed(1) + ' ' + knitUnit;
        }
    });
}

function toggleOptPanels() {
    const showCollar = el('ck-collar')?.checked || false;
    const showCuff = el('ck-cuff')?.checked || false;
    const showPocket = el('ck-pocket')?.checked || false;
    const showHalfmoon = el('ck-halfmoon')?.checked || false;
    
    const collarPanel = el('panel-collar');
    const cuffPanel = el('panel-cuff');
    const pocketPanel = el('panel-pocket');
    const halfmoonPanel = el('panel-halfmoon');
    
    if (collarPanel) collarPanel.style.display = showCollar ? 'block' : 'none';
    if (cuffPanel) cuffPanel.style.display = showCuff ? 'block' : 'none';
    if (pocketPanel) pocketPanel.style.display = showPocket ? 'block' : 'none';
    if (halfmoonPanel) halfmoonPanel.style.display = showHalfmoon ? 'block' : 'none';
    
    calcKnitGarments();
}

function updateKnitTotals() {
    const pairs = [
        { a: 'kg-bl', b: 'kg-bla', t: 'kg-blt' },
        { a: 'kg-sl', b: 'kg-sla', t: 'kg-slt' },
        { a: 'kg-hc', b: 'kg-hca', t: 'kg-hct' },
        { a: 'kg-cl', b: 'kg-cla', t: 'kg-clt' },
        { a: 'kg-cw', b: 'kg-cwa', t: 'kg-cwt' },
        { a: 'kg-cul', b: 'kg-cula', t: 'kg-cul-t' },
        { a: 'kg-cuw', b: 'kg-cuwa', t: 'kg-cuw-t' },
        { a: 'kg-pl', b: 'kg-pla', t: 'kg-pl-t' },
        { a: 'kg-pw', b: 'kg-pwa', t: 'kg-pw-t' },
        { a: 'kg-hml', b: 'kg-hmla', t: 'kg-hml-t' },
        { a: 'kg-hmw', b: 'kg-hmwa', t: 'kg-hmw-t' }
    ];
    
    pairs.forEach(pair => {
        const total = v(pair.a) + v(pair.b);
        const span = el(pair.t);
        if (span) span.innerHTML = total.toFixed(1) + ' ' + knitUnit;
    });
    
    calcKnitGarments();
}

function calcKnitGarments() {
    const div = knitUnit === 'inch' ? 1550000 : 10000000;
    const qty = v('kg-qty') || 12;
    const waste = v('kg-waste') || 0;
    
    // BODY
    const BL = v('kg-bl') + v('kg-bla');
    const SL = v('kg-sl') + v('kg-sla');
    const HC = v('kg-hc') + v('kg-hca');
    const bGSM = v('kg-bgsm');
    
    const bodyPerPc = ((BL + SL) * HC * 2 * bGSM) / div;
    const bodyDz = bodyPerPc * 12;
    
    // COLLAR
    let collarPerPc = 0, collarDz = 0;
    if (el('ck-collar')?.checked) {
        const CL = v('kg-cl') + v('kg-cla');
        const CW = v('kg-cw') + v('kg-cwa');
        const cGSM = v('kg-cgsm');
        collarPerPc = (CL * CW * cGSM) / div;
        collarDz = collarPerPc * 12;
    }
    
    // CUFF
    let cuffPerPc = 0, cuffDz = 0;
    if (el('ck-cuff')?.checked) {
        const CL = v('kg-cul') + v('kg-cula');
        const CW = v('kg-cuw') + v('kg-cuwa');
        const cuGSM = v('kg-cugsm');
        cuffPerPc = (CL * CW * 2 * cuGSM) / div;
        cuffDz = cuffPerPc * 12;
    }
    
    // POCKET
    let pocketPerPc = 0, pocketDz = 0;
    if (el('ck-pocket')?.checked) {
        const PL = v('kg-pl') + v('kg-pla');
        const PW = v('kg-pw') + v('kg-pwa');
        const pQty = v('kg-pqty') || 1;
        const pGSM = v('kg-pgsm');
        pocketPerPc = (PL * PW * pQty * pGSM) / div;
        pocketDz = pocketPerPc * 12;
    }
    
    // HALF-MOON
    let hmPerPc = 0, hmDz = 0;
    if (el('ck-halfmoon')?.checked) {
        const HL = v('kg-hml') + v('kg-hmla');
        const HW = v('kg-hmw') + v('kg-hmwa');
        const hmGSM = v('kg-hmgsm');
        hmPerPc = (HL * HW * hmGSM) / div;
        hmDz = hmPerPc * 12;
    }
    
    const totalPerPc = bodyPerPc + collarPerPc + cuffPerPc + pocketPerPc + hmPerPc;
    const totalDz = totalPerPc * 12;
    const totalWithWaste = totalDz * (1 + waste / 100);
    const totalKg = (totalWithWaste / 12) * qty;
    
    // Update displays
    set('kg-body-disp', fmt(bodyDz, 3) + ' kg/dz | ' + fmt(bodyPerPc, 4) + ' kg/pc');
    set('kg-total-before', fmt(totalDz, 3) + ' kg/dz');
    set('kg-total-after', fmt(totalWithWaste, 3) + ' kg/dz');
    set('kg-total-kg', fmt(totalKg, 3) + ' kg');
    set('kg-per-dz-label', fmt(totalWithWaste, 3) + ' kg/dz');
    set('kg-per-pc-label', fmt(totalWithWaste / 12, 4) + ' kg/pc');
    
    // Show/hide optional rows
    const collarRow = el('kg-collar-row');
    const cuffRow = el('kg-cuff-row');
    const pocketRow = el('kg-pocket-row');
    const hmRow = el('kg-halfmoon-row');
    
    if (el('ck-collar')?.checked) {
        if (collarRow) collarRow.style.display = 'flex';
        set('kg-collar-disp', fmt(collarDz, 3) + ' kg/dz | ' + fmt(collarPerPc, 4) + ' kg/pc');
    } else if (collarRow) collarRow.style.display = 'none';
    
    if (el('ck-cuff')?.checked) {
        if (cuffRow) cuffRow.style.display = 'flex';
        set('kg-cuff-disp', fmt(cuffDz, 3) + ' kg/dz | ' + fmt(cuffPerPc, 4) + ' kg/pc');
    } else if (cuffRow) cuffRow.style.display = 'none';
    
    if (el('ck-pocket')?.checked) {
        if (pocketRow) pocketRow.style.display = 'flex';
        set('kg-pocket-disp', fmt(pocketDz, 3) + ' kg/dz | ' + fmt(pocketPerPc, 4) + ' kg/pc');
    } else if (pocketRow) pocketRow.style.display = 'none';
    
    if (el('ck-halfmoon')?.checked) {
        if (hmRow) hmRow.style.display = 'flex';
        set('kg-halfmoon-disp', fmt(hmDz, 3) + ' kg/dz | ' + fmt(hmPerPc, 4) + ' kg/pc');
    } else if (hmRow) hmRow.style.display = 'none';
}

function downloadKnitReport() {
    const qty = v('kg-qty') || 12;
    const waste = v('kg-waste') || 0;
    const totalKg = document.getElementById('kg-total-kg')?.innerText || '—';
    const totalAfter = document.getElementById('kg-total-after')?.innerText || '—';
    const totalBefore = document.getElementById('kg-total-before')?.innerText || '—';
    const bodyDisp = document.getElementById('kg-body-disp')?.innerText || '—';
    
    let collarHtml = '';
    let cuffHtml = '';
    let pocketHtml = '';
    let hmHtml = '';
    
    if (el('ck-collar')?.checked) {
        const collarDisp = document.getElementById('kg-collar-disp')?.innerText || '—';
        collarHtml = `<tr><td>🧣 Collar</td><td>${collarDisp.split('|')[0] || '—'}</td><td>${collarDisp.split('|')[1] || '—'}</td></tr>`;
    }
    if (el('ck-cuff')?.checked) {
        const cuffDisp = document.getElementById('kg-cuff-disp')?.innerText || '—';
        cuffHtml = `<tr><td>🧤 Cuff</td><td>${cuffDisp.split('|')[0] || '—'}</td><td>${cuffDisp.split('|')[1] || '—'}</td></tr>`;
    }
    if (el('ck-pocket')?.checked) {
        const pocketDisp = document.getElementById('kg-pocket-disp')?.innerText || '—';
        pocketHtml = `<tr><td>🪡 Pocket</td><td>${pocketDisp.split('|')[0] || '—'}</td><td>${pocketDisp.split('|')[1] || '—'}</td></tr>`;
    }
    if (el('ck-halfmoon')?.checked) {
        const hmDisp = document.getElementById('kg-halfmoon-disp')?.innerText || '—';
        hmHtml = `<tr><td>🌙 Half-moon</td><td>${hmDisp.split('|')[0] || '—'}</td><td>${hmDisp.split('|')[1] || '—'}</td></tr>`;
    }
    
    const reportHtml = `
        <div class="header">
            <h1>🧵 Knit Garments Consumption Report</h1>
            <div class="date">Generated: ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="box">
            <div>Total Fabric Consumption</div>
            <div class="box-value">${totalKg}</div>
            <div>with ${waste}% wastage for ${qty} pcs</div>
            <div style="font-size: 12px; margin-top: 8px;">${totalAfter} (per dozen)</div>
        </div>
        
        <table>
            <thead>
                <tr><th>Component</th><th>Per Dozen (kg/dz)</th><th>Per Piece (kg/pc)</th></tr>
            </thead>
            <tbody>
                <tr><td>👕 Body</td><td>${bodyDisp.split('|')[0] || '—'}</td><td>${bodyDisp.split('|')[1] || '—'}</td></tr>
                ${collarHtml}
                ${cuffHtml}
                ${pocketHtml}
                ${hmHtml}
                <tr class="total-row"><td>📦 Total (before wastage)</td><td colspan="2">${totalBefore}</td></tr>
                <tr class="total-row"><td>⚠️ Total (after ${waste}% wastage)</td><td colspan="2">${totalAfter}</td></tr>
            </tbody>
        </table>
        
        <div style="margin-top: 20px; padding: 12px; background: #f8fafc; border-radius: 8px;">
            <strong>📐 Input Summary:</strong><br>
            Unit: ${knitUnit.toUpperCase()} | Body GSM: ${v('kg-bgsm') || '—'} | Wastage: ${waste}% | Quantity: ${qty} pcs
        </div>
    `;
    
    generatePDF('Knit Garments Report', reportHtml);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Unit buttons
    document.querySelectorAll('#page-knit .unit-bar .u-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const unit = this.getAttribute('data-unit');
            setKnitUnit(unit);
            document.querySelectorAll('#page-knit .unit-bar .u-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Checkbox listeners
    const checkboxes = ['ck-collar', 'ck-cuff', 'ck-pocket', 'ck-halfmoon'];
    checkboxes.forEach(id => {
        const cb = el(id);
        if (cb) cb.addEventListener('change', toggleOptPanels);
    });
    
    // Input listeners
    const inputs = ['kg-bl', 'kg-bla', 'kg-sl', 'kg-sla', 'kg-hc', 'kg-hca', 'kg-bgsm',
                    'kg-cl', 'kg-cla', 'kg-cw', 'kg-cwa', 'kg-cgsm',
                    'kg-cul', 'kg-cula', 'kg-cuw', 'kg-cuwa', 'kg-cugsm',
                    'kg-pl', 'kg-pla', 'kg-pw', 'kg-pwa', 'kg-pgsm', 'kg-pqty',
                    'kg-hml', 'kg-hmla', 'kg-hmw', 'kg-hmwa', 'kg-hmgsm',
                    'kg-waste', 'kg-qty'];
    inputs.forEach(id => {
        const input = el(id);
        if (input) input.addEventListener('input', updateKnitTotals);
    });
    
    // Calculate button
    const calcBtn = el('btn-calc-knit');
    if (calcBtn) calcBtn.addEventListener('click', calcKnitGarments);
    
    // PDF button
    const pdfBtn = el('btn-pdf-knit');
    if (pdfBtn) pdfBtn.addEventListener('click', downloadKnitReport);
    
    // Initial calculation
    calcKnitGarments();
});