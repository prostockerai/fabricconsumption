/* ============================================================
   GarmentsCalc BD — formulas.js
   ALL calculation logic lives here.
   To add a new formula: add a new exported function.
   ============================================================ */

"use strict";

// ── UNIT CONVERSION CONSTANTS ──────────────────────────────
const C = {
  CM_TO_M:     0.01,          // cm → m (divide 10000 = ×0.01 × 0.01)
  IN_TO_M:     0.0254,        // inch → m
  IN2_TO_M2:   1 / 1550.0031, // inch² → m²  (1550.0031 is exact)
  CM2_TO_M2:   1 / 10000,     // cm² → m²
  M_TO_YD:     1.09361,
  YD_TO_M:     0.9144,
  IN_TO_CM:    2.54,
  MM_TO_LIGNE: 1.5748,
  LB_TO_KG:    0.453592,
  OZ_TO_GSM:   33.9057,       // oz/yd² × 33.9057 = gsm
};

// ── HELPERS ───────────────────────────────────────────────
export function round(v, d = 4) {
  return isNaN(v) || !isFinite(v) ? null : +v.toFixed(d);
}
export function fmt(v, d = 4, unit = '') {
  if (v === null || v === undefined) return '—';
  return v.toFixed(d) + (unit ? ' ' + unit : '');
}

// ── 1. KNIT FABRIC CONSUMPTION — GSM/WEIGHT METHOD ────────
// Garment area (m²) × GSM / 1000 = kg per piece
// Used for T-shirts, Polo body, Hoodies, etc.
// unit: 'cm' | 'inch'

export function knitConsumption({ length_m_or_mix, width_m, gsm, qty = 1, wastage_pct = 0 }) {
  // length and width must already be in METERS
  const area_m2   = length_m_or_mix * width_m;          // m²
  const per_pc_kg = (gsm * area_m2) / 1000;             // kg/pc
  const total_kg  = per_pc_kg * qty * (1 + wastage_pct / 100);
  return {
    area_m2:    round(area_m2, 6),
    per_pc_kg:  round(per_pc_kg, 6),
    total_kg:   round(total_kg, 4),
  };
}

// ── 2. T-SHIRT BODY CONSUMPTION ───────────────────────────
// Formula source: industry standard — area = (body+sleeve) × (half_chest × 2)
// Both CM and INCH supported
export function tshirtConsumption({ body_len, sleeve_len, half_chest, gsm, qty, wastage_pct, unit }) {
  const toM    = unit === 'cm' ? C.CM_TO_M : C.IN_TO_M;
  const len_m  = (body_len + sleeve_len) * toM;
  const wid_m  = half_chest * 2 * toM;       // full chest width in meters
  return knitConsumption({ length_m_or_mix: len_m, width_m: wid_m, gsm, qty, wastage_pct });
}

// ── 3. COLLAR / CUFF / POCKET CONSUMPTION ─────────────────
// Simple rectangle: length × width × GSM / 1000
export function rectConsumption({ length, width, gsm, qty, wastage_pct, unit }) {
  const divFactor = unit === 'cm' ? C.CM2_TO_M2 : C.IN2_TO_M2;
  const area_m2   = length * width * divFactor;
  const per_pc_kg = (gsm * area_m2) / 1000;
  const total_kg  = per_pc_kg * qty * (1 + wastage_pct / 100);
  return {
    area_m2:   round(area_m2, 6),
    per_pc_kg: round(per_pc_kg, 6),
    total_kg:  round(total_kg, 4),
  };
}

// ── 4. WOVEN PANT CONSUMPTION (YARD-BASED) ────────────────
// Source: textilelearner.net — industry standard formula
// Returns yards/pc and total yards (woven is sold in yards/meters)
// fabric_width in INCHES (standard for woven)
export function pantConsumption_yard({ inseam, front_rise, waistband_h, half_thigh, fabric_width_in, wastage_pct = 5, qty = 1, unit = 'inch' }) {
  // Convert all measurements to INCHES first
  const toIn  = unit === 'cm' ? 1 / C.IN_TO_CM : 1;
  const ins   = inseam * toIn;
  const fr    = front_rise * toIn;
  const wb    = waistband_h * toIn;
  const ht    = half_thigh * toIn;
  const fw    = fabric_width_in; // always in inches (specify on form)

  // Standard formula for woven pant:
  // [ (waist×rise)×2 + (half_thigh×2×inseam)×2 ] ÷ 36 ÷ fabricWidth_in
  // Each front/back panel: width = half_thigh×2, length = inseam + front_rise
  const panel_area = (ht * 2) * (ins + fr + wb); // one panel, in²
  const total_in2  = panel_area * 2;              // × 2 for front+back
  const yards_pc   = (total_in2 / fw / 36) * (1 + wastage_pct / 100);
  const total_yds  = yards_pc * qty;
  const yds_per_dz = yards_pc * 12;

  return {
    yards_pc:   round(yards_pc, 4),
    total_yds:  round(total_yds, 4),
    yds_per_dz: round(yds_per_dz, 4),
    meters_pc:  round(yards_pc * C.YD_TO_M, 4),
  };
}

// ── 5. MARKER-BASED CONSUMPTION ───────────────────────────
// Used for woven fabrics. Returns meters AND yards
export function markerConsumption({ marker_len, cut_allow_len, marker_wid, cut_allow_wid, gsm, pcs_in_marker, cutting_pct, unit = 'inch' }) {
  // Convert to inches first (marker data commonly in inches)
  const toIn = unit === 'cm' ? 1 / C.IN_TO_CM : unit === 'm' ? 1 / C.IN_TO_M : 1;

  const eff_len_in = (marker_len + cut_allow_len) * toIn;
  const eff_wid_in = (marker_wid + cut_allow_wid) * toIn;

  // kg per marker
  const net_kg = gsm * eff_len_in * eff_wid_in * C.IN2_TO_M2 / 1000;
  // per dozen
  const con_per_dz    = (net_kg / pcs_in_marker) * 12;
  const con_with_cut  = con_per_dz * (1 + cutting_pct / 100);
  // meters (for fabric ordering)
  const eff_len_m     = eff_len_in * C.IN_TO_M;

  return {
    net_kg_per_marker: round(net_kg, 4),
    con_per_dz:        round(con_per_dz, 4),
    con_with_cut:      round(con_with_cut, 4),
    req_dia_inch:      marker_wid,
    eff_len_m:         round(eff_len_m, 3),
  };
}

// ── 6. KNIT FABRIC PRICE PER METER ────────────────────────
// Source: KNIT FABRIC PRICE sheet in user's Excel
export function knitFabricPrice({ weight_kg, gsm, width_m, price_per_kg }) {
  // Length of fabric for given weight
  const fab_len_m    = (weight_kg * 1000) / (gsm * width_m);
  const price_per_m  = (weight_kg * price_per_kg) / fab_len_m;
  const total_price  = price_per_m * fab_len_m;

  return {
    fab_len_m:   round(fab_len_m, 4),
    price_per_m: round(price_per_m, 4),
    total_price: round(total_price, 2),
  };
}

// ── 7. SEWING THREAD CONSUMPTION ──────────────────────────
// Source: textilelearner.net
// Thread spec: '50/2' = 4000m/cone (knit), '40/2' = 4000m, '20/2' = 3000m (woven)
// Wastage 15% standard
export function threadConsumption({ cons_per_garment_m, qty, thread_spec, wastage_pct = 15 }) {
  const THREAD_M = { '50/2': 4000, '40/2': 4000, '20/2': 3000, '30/2': 4000, '60/2': 4000 };
  const mPerCone = THREAD_M[thread_spec] || 4000;
  const cones    = ((cons_per_garment_m * qty) / mPerCone) * (1 + wastage_pct / 100);
  return {
    cones:     Math.ceil(round(cones, 2)),
    exact:     round(cones, 2),
    m_per_cone: mPerCone,
  };
}

// ── 8. BUTTON CONSUMPTION ─────────────────────────────────
// Source: textilelearner.net
// Plastic: 1 Great Gross (GG) = 1728 pcs, wastage 5%
// Metal:   1 Gross (G)        = 144  pcs, wastage 6%
export function buttonConsumption({ pcs_per_garment, qty, button_type, wastage_pct }) {
  const denom   = button_type === 'plastic' ? 1728 : 144;
  const unit_nm = button_type === 'plastic' ? 'GG' : 'G';
  const def_waste = button_type === 'plastic' ? 5 : 6;
  const wp      = wastage_pct ?? def_waste;
  const raw     = (pcs_per_garment * qty) / denom;
  const total   = raw * (1 + wp / 100);
  // Convention: don't round before decimal in button calc (textilelearner rule)
  return {
    total:    round(total, 2),
    unit:     unit_nm,
    raw:      round(raw, 4),
  };
}

// ── 9. LACE / TAPE CONSUMPTION ────────────────────────────
// Source: textilelearner.net
// O/Q pcs, consumption in inches per garment → yards
export function laceConsumption({ cons_per_garment_in, qty, wastage_pct = 5 }) {
  const raw_yds  = (cons_per_garment_in * qty) / 36;
  const total    = raw_yds * (1 + wastage_pct / 100);
  return {
    total_yds: Math.ceil(round(total, 2)),
    exact_yds: round(total, 2),
  };
}

// ── 10. INTERLINING CONSUMPTION ───────────────────────────
// cons in yds/dz
export function interlingConsumption({ cons_per_dz_yds, qty, wastage_pct = 5 }) {
  const raw   = (cons_per_dz_yds / 12) * qty;
  const total = raw * (1 + wastage_pct / 100);
  return { total_yds: round(total, 2) };
}

// ── 11. SIZE RATIO LABEL CALCULATION ──────────────────────
// Source: textilelearner.net
// sizes: [{name:'S', ratio:1},{name:'M',ratio:2},...] qty = total pcs
export function sizeRatioCalc({ qty, sizes, wastage_pct = 5 }) {
  const total_ratio = sizes.reduce((s, x) => s + x.ratio, 0);
  return sizes.map(s => {
    const base = (qty * s.ratio) / total_ratio;
    const with_waste = base * (1 + wastage_pct / 100);
    return { name: s.name, ratio: s.ratio, qty: Math.ceil(round(with_waste, 0)) };
  });
}

// ── 12. FOB COSTING ───────────────────────────────────────
// Based on textilelearner.net cost breakdown
export function fobCosting({ fabric_cost_dz, accessories_cost_dz, cm_per_dz, transport_pct = 0.5, cf_pct = 2, overhead_pct = 0.5, profit_pct = 10, freight_pct = 4, insurance_pct = 1 }) {
  const subtotal    = fabric_cost_dz + accessories_cost_dz + cm_per_dz;
  const transport   = subtotal * transport_pct / 100;
  const cf          = subtotal * cf_pct / 100;
  const overhead    = subtotal * overhead_pct / 100;
  const net_cost    = subtotal + transport + cf + overhead;
  const profit      = net_cost * profit_pct / 100;
  const net_fob_dz  = net_cost + profit;
  const freight     = net_fob_dz * freight_pct / 100;
  const net_cf_dz   = net_fob_dz + freight;
  const insurance   = net_cf_dz * insurance_pct / 100;
  const net_cif_dz  = net_cf_dz + insurance;
  return {
    subtotal:   round(subtotal, 2),
    net_cost:   round(net_cost, 2),
    net_fob_dz: round(net_fob_dz, 2),
    net_fob_pc: round(net_fob_dz / 12, 2),
    net_cf_dz:  round(net_cf_dz, 2),
    net_cif_dz: round(net_cif_dz, 2),
  };
}

// ── 13. UNIT CONVERTERS ───────────────────────────────────
export const convert = {
  inchToCm:    v => round(v * C.IN_TO_CM, 4),
  cmToInch:    v => round(v / C.IN_TO_CM, 4),
  meterToYard: v => round(v * C.M_TO_YD, 4),
  yardToMeter: v => round(v * C.YD_TO_M, 4),
  mToKg:       (len, wid, gsm) => round(gsm * len * wid / 1000, 3),
  kgToM:       (kg, wid, gsm)  => round((kg * 1000) / (gsm * wid), 4),
  gsmToOz:     v => round(v / C.OZ_TO_GSM, 4),
  ozToGsm:     v => round(v * C.OZ_TO_GSM, 2),
  mmToLigne:   v => round(v * C.MM_TO_LIGNE, 2),
  ligneToMm:   v => round(v / C.MM_TO_LIGNE, 2),
};
