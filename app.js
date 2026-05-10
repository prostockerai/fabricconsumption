/* ============================================================
   GarmentsCalc BD — app.js
   UI wiring only. All math lives in formulas.js.
   To add a new calculator: add HTML page + wire it here.
   ============================================================ */

import {
  tshirtConsumption, rectConsumption, pantConsumption_yard,
  markerConsumption, knitFabricPrice, threadConsumption,
  buttonConsumption, laceConsumption, interlingConsumption,
  sizeRatioCalc, fobCosting, convert, round, fmt
} from './formulas.js';

// ── HELPERS ───────────────────────────────────────────────
const g  = id => document.getElementById(id);
const gv = id => parseFloat(g(id)?.value) || 0;
const gs = id => g(id)?.value || '';
const set = (id, v) => { if (g(id)) g(id).textContent = (v === null || v === undefined) ? '—' : v; };

function oninput(ids, fn) {
  ids.forEach(id => { const el = g(id); if (el) el.addEventListener('input', fn); });
}

// ── NAV ───────────────────────────────────────────────────
export function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const pg = g('page-' + name);
  if (pg) pg.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── UNIT STATE ────────────────────────────────────────────
const unitOf = { tshirt: 'cm', collar: 'cm', cuff: 'cm', pant: 'inch', pocket: 'cm' };

function setUnitBadges(prefix, ids, unit) {
  ids.forEach(id => { const el = g(id); if (el) el.textContent = unit; });
}

export function toggleUnit(page, unit, btn) {
  unitOf[page] = unit;
  btn.closest('.toggle').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const u = unit;
  if (page === 'tshirt')  { setUnitBadges(page, ['ts-u1','ts-u2','ts-u3'], u); calcTshirt(); }
  if (page === 'collar')  { setUnitBadges(page, ['cl-u1','cl-u2'], u); calcCollar(); }
  if (page === 'cuff')    { setUnitBadges(page, ['cu-u1','cu-u2'], u); calcCuff(); }
  if (page === 'pant')    { setUnitBadges(page, ['pt-u1','pt-u2','pt-u3','pt-u4'], u); calcPant(); }
  if (page === 'pocket')  { setUnitBadges(page, ['pk-u1','pk-u2'], u); calcPocket(); }
}

// ── DISPLAY RESULT ────────────────────────────────────────
function setResult(ids, res) {
  Object.entries(ids).forEach(([id, key]) => set(id, res[key] !== null ? res[key] : '—'));
}

// ═══════════════════════════════════════════════════════════
//  CALCULATORS
// ═══════════════════════════════════════════════════════════

// 1. T-SHIRT ───────────────────────────────────────────────
function calcTshirt() {
  const res = tshirtConsumption({
    body_len:   gv('ts-body'),  sleeve_len: gv('ts-sleeve'),
    half_chest: gv('ts-chest'), gsm:        gv('ts-gsm'),
    qty:        gv('ts-qty'),   wastage_pct: gv('ts-waste'),
    unit: unitOf.tshirt,
  });
  set('ts-r-total', res.total_kg !== null ? res.total_kg.toFixed(4) : '—');
  set('ts-r-per',   res.per_pc_kg !== null ? res.per_pc_kg.toFixed(6) : '—');
  set('ts-r-area',  res.area_m2 !== null ? res.area_m2.toFixed(6) : '—');
}

// 2. COLLAR ────────────────────────────────────────────────
function calcCollar() {
  const res = rectConsumption({
    length: gv('cl-len'), width: gv('cl-wid'),
    gsm: gv('cl-gsm'), qty: gv('cl-qty'), wastage_pct: gv('cl-waste'),
    unit: unitOf.collar,
  });
  set('cl-r-total', res.total_kg?.toFixed(6) ?? '—');
  set('cl-r-per',   res.per_pc_kg?.toFixed(6) ?? '—');
}

// 3. CUFF ──────────────────────────────────────────────────
function calcCuff() {
  const res = rectConsumption({
    length: gv('cu-len'), width: gv('cu-wid'),
    gsm: gv('cu-gsm'), qty: gv('cu-qty'), wastage_pct: gv('cu-waste'),
    unit: unitOf.cuff,
  });
  set('cu-r-total', res.total_kg?.toFixed(6) ?? '—');
  set('cu-r-per',   res.per_pc_kg?.toFixed(6) ?? '—');
}

// 4. PANT ──────────────────────────────────────────────────
function calcPant() {
  const res = pantConsumption_yard({
    inseam:         gv('pt-inseam'),
    front_rise:     gv('pt-rise'),
    waistband_h:    gv('pt-waist'),
    half_thigh:     gv('pt-thigh'),
    fabric_width_in: gv('pt-fabwid'),
    wastage_pct:    gv('pt-waste'),
    qty:            gv('pt-qty'),
    unit:           unitOf.pant,
  });
  set('pt-r-yds',   res.yards_pc?.toFixed(4) ?? '—');
  set('pt-r-total', res.total_yds?.toFixed(4) ?? '—');
  set('pt-r-dz',    res.yds_per_dz?.toFixed(4) ?? '—');
  set('pt-r-m',     res.meters_pc?.toFixed(4) ?? '—');
}

// 5. POCKET ────────────────────────────────────────────────
function calcPocket() {
  const res = rectConsumption({
    length: gv('pk-len'), width: gv('pk-wid'),
    gsm: gv('pk-gsm'), qty: gv('pk-qty'), wastage_pct: gv('pk-waste'),
    unit: unitOf.pocket,
  });
  set('pk-r-total', res.total_kg?.toFixed(6) ?? '—');
  set('pk-r-per',   res.per_pc_kg?.toFixed(6) ?? '—');
}

// 6. BOOKING SHEET ─────────────────────────────────────────
function calcBooking() {
  const res = markerConsumption({
    marker_len:     gv('bk-mlen'),
    cut_allow_len:  gv('bk-calen'),
    marker_wid:     gv('bk-mwid'),
    cut_allow_wid:  gv('bk-cawid'),
    gsm:            gv('bk-gsm'),
    pcs_in_marker:  gv('bk-pcs'),
    cutting_pct:    gv('bk-cutpct'),
    unit:           'inch',
  });
  set('bk-r-net',    res.net_kg_per_marker?.toFixed(4) ?? '—');
  set('bk-r-dz',     res.con_per_dz?.toFixed(4) ?? '—');
  set('bk-r-dz-cut', res.con_with_cut?.toFixed(4) ?? '—');
  set('bk-r-dia',    res.req_dia_inch ?? '—');
}

// 7. KNIT PRICE ────────────────────────────────────────────
function calcKnitPrice() {
  const res = knitFabricPrice({
    weight_kg:    gv('kp-wt'), gsm:          gv('kp-gsm'),
    width_m:      gv('kp-wid'), price_per_kg: gv('kp-ppkg'),
  });
  set('kp-r-len',   res.fab_len_m?.toFixed(4) ?? '—');
  set('kp-r-pm',    res.price_per_m?.toFixed(4) ?? '—');
  set('kp-r-total', res.total_price?.toFixed(2) ?? '—');
}

// 8. THREAD ────────────────────────────────────────────────
function calcThread() {
  const spec = gs('th-spec');
  const res  = threadConsumption({
    cons_per_garment_m: gv('th-cons'),
    qty:                gv('th-qty'),
    thread_spec:        spec,
    wastage_pct:        gv('th-waste'),
  });
  set('th-r-cones',  res.cones ?? '—');
  set('th-r-exact',  res.exact?.toFixed(2) ?? '—');
  set('th-r-mcone',  res.m_per_cone ?? '—');
}

// 9. BUTTON ────────────────────────────────────────────────
function calcButton() {
  const type = gs('bt-type');
  const res  = buttonConsumption({
    pcs_per_garment: gv('bt-pcs'),
    qty:             gv('bt-qty'),
    button_type:     type,
    wastage_pct:     gv('bt-waste'),
  });
  set('bt-r-total', res.total?.toFixed(2) ?? '—');
  set('bt-r-unit',  res.unit ?? '—');
  set('bt-r-raw',   res.raw?.toFixed(4) ?? '—');
}

// 10. LACE ─────────────────────────────────────────────────
function calcLace() {
  const res = laceConsumption({
    cons_per_garment_in: gv('lc-cons'),
    qty:                 gv('lc-qty'),
    wastage_pct:         gv('lc-waste'),
  });
  set('lc-r-total', res.total_yds ?? '—');
  set('lc-r-exact', res.exact_yds?.toFixed(2) ?? '—');
}

// 11. INTERLINING ──────────────────────────────────────────
function calcInterling() {
  const res = interlingConsumption({
    cons_per_dz_yds: gv('il-cons'),
    qty:             gv('il-qty'),
    wastage_pct:     gv('il-waste'),
  });
  set('il-r-total', res.total_yds?.toFixed(2) ?? '—');
}

// 12. SIZE RATIO ───────────────────────────────────────────
function calcSizeRatio() {
  const qty       = gv('sr-qty');
  const wastage   = gv('sr-waste');
  const sizeNames = ['S','M','L','XL','XXL','3XL'];
  const sizes = sizeNames
    .map(n => ({ name: n, ratio: gv('sr-' + n) }))
    .filter(x => x.ratio > 0);
  if (!sizes.length) return;
  const results = sizeRatioCalc({ qty, sizes, wastage_pct: wastage });
  let html = '<table class="ctable"><tr>';
  results.forEach(r => { html += `<th>${r.name} (ratio:${r.ratio})</th>`; });
  html += '</tr><tr>';
  results.forEach(r => { html += `<td class="cv">${r.qty} pcs</td>`; });
  html += '</tr></table>';
  const el = g('sr-result');
  if (el) el.innerHTML = html;
}

// 13. FOB COSTING ──────────────────────────────────────────
function calcFob() {
  const res = fobCosting({
    fabric_cost_dz:      gv('fob-fab'),
    accessories_cost_dz: gv('fob-acc'),
    cm_per_dz:           gv('fob-cm'),
    transport_pct:       gv('fob-transport'),
    cf_pct:              gv('fob-cf'),
    overhead_pct:        gv('fob-overhead'),
    profit_pct:          gv('fob-profit'),
    freight_pct:         gv('fob-freight'),
    insurance_pct:       gv('fob-insurance'),
  });
  set('fob-r-sub',    res.subtotal ?? '—');
  set('fob-r-net',    res.net_cost ?? '—');
  set('fob-r-fob-dz', res.net_fob_dz ?? '—');
  set('fob-r-fob-pc', res.net_fob_pc ?? '—');
  set('fob-r-cf',     res.net_cf_dz ?? '—');
  set('fob-r-cif',    res.net_cif_dz ?? '—');
}

// 14. CONVERTERS ───────────────────────────────────────────
function wireConverters() {
  oninput(['cv-inch'],   () => set('cv-r-inch2cm',  convert.inchToCm(gv('cv-inch'))));
  oninput(['cv-cm'],     () => set('cv-r-cm2inch',  convert.cmToInch(gv('cv-cm'))));
  oninput(['cv-meter'],  () => set('cv-r-m2yd',     convert.meterToYard(gv('cv-meter'))));
  oninput(['cv-yard'],   () => set('cv-r-yd2m',     convert.yardToMeter(gv('cv-yard'))));
  oninput(['cv-gsm'],    () => set('cv-r-gsm2oz',   convert.gsmToOz(gv('cv-gsm'))));
  oninput(['cv-oz'],     () => set('cv-r-oz2gsm',   convert.ozToGsm(gv('cv-oz'))));
  oninput(['cv-btn-mm'], () => set('cv-r-btn',      convert.mmToLigne(gv('cv-btn-mm'))));
  oninput(['cv-btn-lg'], () => set('cv-r-btn-mm',   convert.ligneToMm(gv('cv-btn-lg'))));
  oninput(['cv-mlen','cv-mwid','cv-mgsm'], () => {
    set('cv-r-m2kg', convert.mToKg(gv('cv-mlen'), gv('cv-mwid'), gv('cv-mgsm')));
  });
  oninput(['cv-kgwt','cv-kgwid','cv-kggsm'], () => {
    set('cv-r-kg2m', convert.kgToM(gv('cv-kgwt'), gv('cv-kgwid'), gv('cv-kggsm')));
  });
}

// ── FORMULA LIBRARY ───────────────────────────────────────
let customFormulas = [];
try { customFormulas = JSON.parse(localStorage.getItem('gmt-formulas-v2') || '[]'); } catch(e){}

export function openAddModal()  { g('addModal').classList.add('open'); g('nf-name').focus(); }
export function closeAddModal() {
  g('addModal').classList.remove('open');
  ['nf-name','nf-cat','nf-body','nf-notes'].forEach(id => { if(g(id)) g(id).value=''; });
}
export function saveFormula() {
  const name = g('nf-name').value.trim();
  const cat  = g('nf-cat').value.trim() || 'Custom';
  const body = g('nf-body').value.trim();
  const notes= g('nf-notes').value.trim();
  if (!name || !body) { alert('Formula name and body are required.'); return; }
  customFormulas.push({ id: Date.now(), name, cat, body, notes });
  localStorage.setItem('gmt-formulas-v2', JSON.stringify(customFormulas));
  renderCustomFormulas();
  closeAddModal();
}
function deleteFormula(id) {
  customFormulas = customFormulas.filter(f => f.id !== id);
  localStorage.setItem('gmt-formulas-v2', JSON.stringify(customFormulas));
  renderCustomFormulas();
}
function renderCustomFormulas() {
  const c = g('custom-fl');
  if (!c) return;
  c.innerHTML = '';
  customFormulas.forEach(f => {
    const d = document.createElement('div');
    d.className = 'f-card';
    d.style.borderColor = '#6ee7b7';
    d.innerHTML = `
      <div class="f-card-head" onclick="this.nextElementSibling.classList.toggle('open')">
        <div><div class="f-name">${f.name}</div><div class="f-sub">${f.cat}</div></div>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="f-tag custom">Custom</span>
          <button class="btn btn-outline btn-sm" style="color:var(--red);border-color:var(--red)" onclick="event.stopPropagation();window.__del(${f.id})">✕</button>
        </div>
      </div>
      <div class="f-body">
        <div class="fbox">
          ${f.body.split('\n').map(l=>`<div class="fl">${l}</div>`).join('')}
          ${f.notes?`<div class="fc">// ${f.notes}</div>`:''}
        </div>
      </div>`;
    c.appendChild(d);
  });
}
window.__del = id => deleteFormula(id);

// ── FORMULA ACCORDION ─────────────────────────────────────
export function toggleFCard(el) {
  el.nextElementSibling.classList.toggle('open');
}

// ── INIT ──────────────────────────────────────────────────
function wireAll() {
  // T-shirt
  oninput(['ts-body','ts-sleeve','ts-chest','ts-gsm','ts-qty','ts-waste'], calcTshirt);
  // Collar
  oninput(['cl-len','cl-wid','cl-gsm','cl-qty','cl-waste'], calcCollar);
  // Cuff
  oninput(['cu-len','cu-wid','cu-gsm','cu-qty','cu-waste'], calcCuff);
  // Pant
  oninput(['pt-inseam','pt-rise','pt-waist','pt-thigh','pt-fabwid','pt-waste','pt-qty'], calcPant);
  // Pocket
  oninput(['pk-len','pk-wid','pk-gsm','pk-qty','pk-waste'], calcPocket);
  // Booking
  oninput(['bk-mlen','bk-calen','bk-mwid','bk-cawid','bk-gsm','bk-pcs','bk-cutpct'], calcBooking);
  // Knit price
  oninput(['kp-wt','kp-gsm','kp-wid','kp-ppkg'], calcKnitPrice);
  // Thread
  oninput(['th-cons','th-qty','th-waste','th-spec'], calcThread);
  // Button
  oninput(['bt-pcs','bt-qty','bt-waste','bt-type'], calcButton);
  // Lace
  oninput(['lc-cons','lc-qty','lc-waste'], calcLace);
  // Interlining
  oninput(['il-cons','il-qty','il-waste'], calcInterling);
  // Size ratio
  oninput(['sr-qty','sr-waste','sr-S','sr-M','sr-L','sr-XL','sr-XXL','sr-3XL'], calcSizeRatio);
  // FOB
  oninput(['fob-fab','fob-acc','fob-cm','fob-transport','fob-cf','fob-overhead','fob-profit','fob-freight','fob-insurance'], calcFob);
  // Converters
  wireConverters();
  // Modal close on overlay
  g('addModal')?.addEventListener('click', e => { if(e.target===g('addModal')) closeAddModal(); });
  // Initial run
  calcTshirt(); calcCollar(); calcCuff(); calcPant(); calcPocket();
  calcBooking(); calcKnitPrice(); calcThread(); calcButton();
  calcLace(); calcInterling(); calcFob();
  wireConverters();
  renderCustomFormulas();
  // Init converter defaults
  set('cv-r-inch2cm', convert.inchToCm(1));
  set('cv-r-cm2inch', convert.cmToInch(2.54));
  set('cv-r-m2yd',    convert.meterToYard(1));
  set('cv-r-yd2m',    convert.yardToMeter(1));
  set('cv-r-gsm2oz',  convert.gsmToOz(200));
  set('cv-r-oz2gsm',  convert.ozToGsm(5.9));
  set('cv-r-btn',     convert.mmToLigne(14));
  set('cv-r-m2kg',    convert.mToKg(10, 1.5, 200));
  set('cv-r-kg2m',    convert.kgToM(30, 1.5, 200));
}

document.addEventListener('DOMContentLoaded', wireAll);

// expose for onclick in HTML
window.showPage    = showPage;
window.toggleUnit  = toggleUnit;
window.openAddModal  = openAddModal;
window.closeAddModal = closeAddModal;
window.saveFormula   = saveFormula;
window.toggleFCard   = toggleFCard;
window.calcSizeRatio = calcSizeRatio;
