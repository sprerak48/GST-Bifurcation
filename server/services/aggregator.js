/**
 * Aggregation services for GST summaries
 */

function round2(val) {
  return Math.round(val * 100) / 100;
}

/**
 * Aggregate by Origin State, Destination State, Tax Type
 * Output: | Origin State | Destination State | Tax Type | Taxable Amount | CGST | SGST | IGST | Total GST |
 */
export function aggregateByStateCombination(processedRows) {
  const map = new Map();

  for (const row of processedRows) {
    const key = `${row.originState}|${row.destinationState}|${row.taxType}`;
    const existing = map.get(key) || {
      originState: row.originState,
      destinationState: row.destinationState,
      taxType: row.taxType,
      taxableAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalGst: 0,
    };

    existing.taxableAmount = round2(existing.taxableAmount + row.taxableAmount);
    existing.cgst = round2(existing.cgst + row.cgst);
    existing.sgst = round2(existing.sgst + row.sgst);
    existing.igst = round2(existing.igst + row.igst);
    existing.totalGst = round2(existing.totalGst + row.totalGst);

    map.set(key, existing);
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      a.originState.localeCompare(b.originState) ||
      a.destinationState.localeCompare(b.destinationState)
  );
}

/**
 * Compliance summary grouped by State (Origin State = seller's place of supply)
 * Output: Total CGST, Total SGST, Total IGST, Total Taxable Value, Total GST Liability per state
 */
export function aggregateByState(processedRows) {
  const map = new Map();

  for (const row of processedRows) {
    // For compliance: CGST/SGST accrue to Origin State, IGST to Centre
    const stateKey = row.originState;
    const existing = map.get(stateKey) || {
      state: stateKey,
      totalCgst: 0,
      totalSgst: 0,
      totalIgst: 0,
      totalTaxableValue: 0,
      totalGstLiability: 0,
    };

    existing.totalCgst = round2(existing.totalCgst + row.cgst);
    existing.totalSgst = round2(existing.totalSgst + row.sgst);
    existing.totalIgst = round2(existing.totalIgst + row.igst);
    existing.totalTaxableValue = round2(existing.totalTaxableValue + row.taxableAmount);
    existing.totalGstLiability = round2(
      existing.totalGstLiability + row.cgst + row.sgst + row.igst
    );

    map.set(stateKey, existing);
  }

  return Array.from(map.values()).sort((a, b) => a.state.localeCompare(b.state));
}
