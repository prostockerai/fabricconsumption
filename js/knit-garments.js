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
        const actualEl = document.getElementById(pair.actual);
        const allowEl = document.getElementById(pair.allow);
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
            const totSpan = document.getElementById(pair.tot);
            if (totSpan) totSpan.innerHTML = (newActual + newAllow).toFixed(1) + ' ' + knitUnit;
        }
    });
}

function toggleOptPanels() {
    const showCollar = document.getElementById('ck-collar')?.checked || false;
    const showCuff = document.getElementById('ck-cuff')?.checked || false;
    const showPocket = document.getElementById('ck-pocket')?.checked || false;
    const showHalfmoon = document.getElementById('ck-halfmoon')?.checked || false;
    
    const collarPanel = document.getElementById('panel-collar');
    const cuffPanel = document.getElementById('panel-cuff');
    const pocketPanel = document.getElementById('panel-pocket');
    const halfmoonPanel = document.getElementById('panel-halfmoon');
    
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
        const aVal = parseFloat(document.getElementById(pair.a)?.value) || 0;
        const bVal = parseFloat(document.getElementById(pair.b)?.value) || 0;
        const total = aVal + bVal;
        const span = document.getElementById(pair.t);
        if (span) span.innerHTML = total.toFixed(1) + ' ' + knitUnit;
    });
    
    calcKnitGarments();
}

function calcKnitGarments() {
    const div = knitUnit === 'inch' ? 1550000 : 10000000;
    const qty = parseFloat(document.getElementById('kg-qty')?.value) || 12;
    const waste = parseFloat(document.getElementById('kg-waste')?.value) || 0;
    
    // Helper function to get value
    function getVal(id) {
        return parseFloat(document.getElementById(id)?.value) || 0;
    }
    
    // BODY
    const BL = getVal('kg-bl') + getVal('kg-bla');
    const SL = getVal('kg-sl') + getVal('kg-sla');
    const HC = getVal('kg-hc') + getVal('kg-hca');
    const bGSM = getVal('kg-bgsm') || 210;
    
    const bodyPerPc = ((BL + SL) * HC * 2 * bGSM) / div;
    const bodyDz = bodyPerPc * 12;
    
    // COLLAR
    let collarPerPc = 0, collarDz = 0;
    if (document.getElementById('ck-collar')?.checked) {
        const CL = getVal('kg-cl') + getVal('kg-cla');
        const CW = getVal('kg-cw') + getVal('kg-cwa');
        const cGSM = getVal('kg-cgsm') || 180;
        collarPerPc = (CL * CW * cGSM) / div;
        collarDz = collarPerPc * 12;
    }
    
    // CUFF
    let cuffPerPc = 0, cuffDz = 0;
    if (document.getElementById('ck-cuff')?.checked) {
        const CL = getVal('kg-cul') + getVal('kg-cula');
        const CW = getVal('kg-cuw') + getVal('kg-cuwa');
        const cuGSM = getVal('kg-cugsm') || 230;
        cuffPerPc = (CL * CW * 2 * cuGSM) / div;
        cuffDz = cuffPerPc * 12;
    }
    
    // POCKET
    let pocketPerPc = 0, pocketDz = 0;
    if (document.getElementById('ck-pocket')?.checked) {
        const PL = getVal('kg-pl') + getVal('kg-pla');
        const PW = getVal('kg-pw') + getVal('kg-pwa');
        const pQty = getVal('kg-pqty') || 1;
        const pGSM = getVal('kg-pgsm') || 160;
        pocketPerPc = (PL * PW * pQty * pGSM) / div;
        pocketDz = pocketPerPc * 12;
    }
    
    // HALF-MOON
    let hmPerPc = 0, hmDz = 0;
    if (document.getElementById('ck-halfmoon')?.checked) {
        const HL = getVal('kg-hml') + getVal('kg-hmla');
        const HW = getVal('kg-hmw') + getVal('kg-hmwa');
        const hmGSM = getVal('kg-hmgsm') || 160;
        hmPerPc = (HL * HW * hmGSM) / div;
        hmDz = hmPerPc * 12;
    }
    
    const totalPerPc = bodyPerPc + collarPerPc + cuffPerPc + pocketPerPc + hmPerPc;
    const totalDz = totalPerPc * 12;
    const totalWithWaste = totalDz * (1 + waste / 100);
    const totalKg = (totalWithWaste / 12) * qty;
    
    // Format number function
    function fmt(n, d) {
        return isNaN(n) ? '—' : n.toFixed(d);
    }
    
    // Update displays
    const bodyDisp = document.getElementById('kg-body-disp');
    if (bodyDisp) bodyDisp.innerText = fmt(bodyDz, 3) + ' kg/dz | ' + fmt(bodyPerPc, 4) + ' kg/pc';
    
    const totalBefore = document.getElementById('kg-total-before');
    if (totalBefore) totalBefore.innerText = fmt(totalDz, 3) + ' kg/dz';
    
    const totalAfter = document.getElementById('kg-total-after');
    if (totalAfter) totalAfter.innerText = fmt(totalWithWaste, 3) + ' kg/dz';
    
    const totalKgElem = document.getElementById('kg-total-kg');
    if (totalKgElem) totalKgElem.innerText = fmt(totalKg, 3) + ' kg';
    
    const perDzLabel = document.getElementById('kg-per-dz-label');
    if (perDzLabel) perDzLabel.innerText = fmt(totalWithWaste, 3) + ' kg/dz';
    
    const perPcLabel = document.getElementById('kg-per-pc-label');
    if (perPcLabel) perPcLabel.innerText = fmt(totalWithWaste / 12, 4) + ' kg/pc';
    
    // Show/hide optional rows
    const collarRow = document.getElementById('kg-collar-row');
    const cuffRow = document.getElementById('kg-cuff-row');
    const pocketRow = document.getElementById('kg-pocket-row');
    const hmRow = document.getElementById('kg-halfmoon-row');
    const collarDispSpan = document.getElementById('kg-collar-disp');
    const cuffDispSpan = document.getElementById('kg-cuff-disp');
    const pocketDispSpan = document.getElementById('kg-pocket-disp');
    const hmDispSpan = document.getElementById('kg-halfmoon-disp');
    
    if (document.getElementById('ck-collar')?.checked) {
        if (collarRow) collarRow.style.display = 'flex';
        if (collarDispSpan) collarDispSpan.innerText = fmt(collarDz, 3) + ' kg/dz | ' + fmt(collarPerPc, 4) + ' kg/pc';
    } else if (collarRow) collarRow.style.display = 'none';
    
    if (document.getElementById('ck-cuff')?.checked) {
        if (cuffRow) cuffRow.style.display = 'flex';
        if (cuffDispSpan) cuffDispSpan.innerText = fmt(cuffDz, 3) + ' kg/dz | ' + fmt(cuffPerPc, 4) + ' kg/pc';
    } else if (cuffRow) cuffRow.style.display = 'none';
    
    if (document.getElementById('ck-pocket')?.checked) {
        if (pocketRow) pocketRow.style.display = 'flex';
        if (pocketDispSpan) pocketDispSpan.innerText = fmt(pocketDz, 3) + ' kg/dz | ' + fmt(pocketPerPc, 4) + ' kg/pc';
    } else if (pocketRow) pocketRow.style.display = 'none';
    
    if (document.getElementById('ck-halfmoon')?.checked) {
        if (hmRow) hmRow.style.display = 'flex';
        if (hmDispSpan) hmDispSpan.innerText = fmt(hmDz, 3) + ' kg/dz | ' + fmt(hmPerPc, 4) + ' kg/pc';
    } else if (hmRow) hmRow.style.display = 'none';
}

function downloadKnitReport() {
    function getVal(id) {
        return parseFloat(document.getElementById(id)?.value) || 0;
    }
    
    function getElemText(id) {
        return document.getElementById(id)?.innerText || '—';
    }
    
    const qty = getVal('kg-qty') || 12;
    const waste = getVal('kg-waste') || 0;
    const totalKg = getElemText('kg-total-kg');
    const totalAfter = getElemText('kg-total-after');
    const totalBefore = getElemText('kg-total-before');
    const bodyDisp = getElemText('kg-body-disp');
    
    let collarHtml = '', cuffHtml = '', pocketHtml = '', hmHtml = '';
    
    if (document.getElementById('ck-collar')?.checked) {
        const collarDisp = getElemText('kg-collar-disp');
        collarHtml = `<tr><td>🧣 Collar</td><td>${collarDisp.split('|')[0] || '—'}</td><td>${collarDisp.split('|')[1] || '—'}</td></tr>`;
    }
    if (document.getElementById('ck-cuff')?.checked) {
        const cuffDisp = getElemText('kg-cuff-disp');
        cuffHtml = `<tr><td>🧤 Cuff</td><td>${cuffDisp.split('|')[0] || '—'}</td><td>${cuffDisp.split('|')[1] || '—'}</td></tr>`;
    }
    if (document.getElementById('ck-pocket')?.checked) {
        const pocketDisp = getElemText('kg-pocket-disp');
        pocketHtml = `<tr><td>🪡 Pocket</td><td>${pocketDisp.split('|')[0] || '—'}</td><td>${pocketDisp.split('|')[1] || '—'}</td></tr>`;
    }
    if (document.getElementById('ck-halfmoon')?.checked) {
        const hmDisp = getElemText('kg-halfmoon-disp');
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
            <thead><tr><th>Component</th><th>Per Dozen (kg/dz)</th><th>Per Piece (kg/pc)</th></tr></thead>
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
            Unit: ${knitUnit.toUpperCase()} | Body GSM: ${getVal('kg-bgsm') || '—'} | Wastage: ${waste}% | Quantity: ${qty} pcs
        </div>
    `;
    
    if (typeof generatePDF === 'function') {
        generatePDF('Knit Garments Report', reportHtml);
    } else {
        alert('PDF generation function not available');
    }
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
        const cb = document.getElementById(id);
        if (cb) cb.addEventListener('change', toggleOptPanels);
    });
    
    // Input listeners
    const inputs = [
        'kg-bl', 'kg-bla', 'kg-sl', 'kg-sla', 'kg-hc', 'kg-hca', 'kg-bgsm',
        'kg-cl', 'kg-cla', 'kg-cw', 'kg-cwa', 'kg-cgsm',
        'kg-cul', 'kg-cula', 'kg-cuw', 'kg-cuwa', 'kg-cugsm',
        'kg-pl', 'kg-pla', 'kg-pw', 'kg-pwa', 'kg-pgsm', 'kg-pqty',
        'kg-hml', 'kg-hmla', 'kg-hmw', 'kg-hmwa', 'kg-hmgsm',
        'kg-waste', 'kg-qty'
    ];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', updateKnitTotals);
    });
    
    // Calculate button
    const calcBtn = document.getElementById('btn-calc-knit');
    if (calcBtn) calcBtn.addEventListener('click', calcKnitGarments);
    
    // PDF button
    const pdfBtn = document.getElementById('btn-pdf-knit');
    if (pdfBtn) pdfBtn.addEventListener('click', downloadKnitReport);
    
    // Set default unit button active
    const defaultBtn = document.querySelector('#page-knit .unit-bar .u-btn[data-unit="cm"]');
    if (defaultBtn) defaultBtn.classList.add('active');
    
    // Initial calculation
    setTimeout(() => {
        calcKnitGarments();
    }, 100);
});
