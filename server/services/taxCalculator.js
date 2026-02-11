/**
 * GST Bifurcation Logic (CRITICAL for compliance)
 *
 * Rule 1: IF Origin State == Destination State → CGST + SGST (Intra-State)
 * Rule 2: ELSE → IGST (Inter-State)
 *
 * Bifurcation:
 * - Intra-State: CGST = Total Tax / 2, SGST = Total Tax / 2, IGST = 0
 * - Inter-State: CGST = 0, SGST = 0, IGST = Total Tax
 *
 * All amounts rounded to 2 decimal places.
 */

function round2(val) {
  return Math.round(val * 100) / 100;
}

/**
 * Determine tax type and split Total Tax Amount
 * @param {Object} row - Parsed order row
 * @returns {Object} Row with cgst, sgst, igst, taxType
 */
export function calculateTaxForRow(row) {
  const { originState, destinationState, totalTaxAmount } = row;

  const isIntraState = originState.toLowerCase() === destinationState.toLowerCase();

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let taxType = '';

  if (isIntraState) {
    taxType = 'CGST + SGST';
    cgst = round2(totalTaxAmount / 2);
    sgst = round2(totalTaxAmount / 2);
    igst = 0;
    // Ensure CGST + SGST = Total Tax (handle rounding)
    const sum = cgst + sgst;
    if (Math.abs(sum - totalTaxAmount) > 0.01) {
      cgst = round2(totalTaxAmount - sgst);
    }
  } else {
    taxType = 'IGST';
    cgst = 0;
    sgst = 0;
    igst = round2(totalTaxAmount);
  }

  return {
    ...row,
    taxType,
    cgst,
    sgst,
    igst,
    totalGst: round2(cgst + sgst + igst),
  };
}

/**
 * Process all order rows with GST bifurcation
 * @param {Array} rows - Parsed CSV rows
 * @returns {Array} Rows with tax split
 */
export function processOrders(rows) {
  return rows.map(calculateTaxForRow);
}
