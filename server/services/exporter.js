import * as XLSX from 'xlsx';

/**
 * Export detailed line-item report
 */
export function exportDetailedXlsx(rows) {
  const data = rows.map((r) => ({
    'Order ID': r.orderId,
    SKU: r.sku,
    'Seller GSTIN': r.sellerGstin,
    'Origin State': r.originState,
    'Destination State': r.destinationState,
    'Tax Type': r.taxType,
    'Taxable Amount': r.taxableAmount,
    CGST: r.cgst,
    SGST: r.sgst,
    IGST: r.igst,
    'Total GST': r.totalGst,
    'Transaction Type': r.transactionType,
    'Invoice Number': r.invoiceNumber,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'GST Detailed Report');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export function exportDetailedCsv(rows) {
  const headers = [
    'Order ID',
    'SKU',
    'Seller GSTIN',
    'Origin State',
    'Destination State',
    'Tax Type',
    'Taxable Amount',
    'CGST',
    'SGST',
    'IGST',
    'Total GST',
    'Transaction Type',
    'Invoice Number',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        escapeCsv(r.orderId),
        escapeCsv(r.sku),
        escapeCsv(r.sellerGstin),
        escapeCsv(r.originState),
        escapeCsv(r.destinationState),
        escapeCsv(r.taxType),
        r.taxableAmount,
        r.cgst,
        r.sgst,
        r.igst,
        r.totalGst,
        escapeCsv(r.transactionType),
        escapeCsv(r.invoiceNumber),
      ].join(',')
    );
  }
  return lines.join('\n');
}

/**
 * Export state-wise GST summary
 */
export function exportSummaryXlsx(rows) {
  const data = rows.map((r) => ({
    State: r.state,
    'Total CGST': r.totalCgst,
    'Total SGST': r.totalSgst,
    'Total IGST': r.totalIgst,
    'Total Taxable Value': r.totalTaxableValue,
    'Total GST Liability': r.totalGstLiability,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'State GST Summary');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Export state combination summary (Origin, Destination, Tax Type aggregates)
 */
export function exportStateCombinationXlsx(rows) {
  const data = rows.map((r) => ({
    'Origin State': r.originState,
    'Destination State': r.destinationState,
    'Tax Type': r.taxType,
    'Taxable Amount': r.taxableAmount,
    CGST: r.cgst,
    SGST: r.sgst,
    IGST: r.igst,
    'Total GST': r.totalGst,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'State Pairs Summary');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export function exportStateCombinationCsv(rows) {
  const headers = [
    'Origin State',
    'Destination State',
    'Tax Type',
    'Taxable Amount',
    'CGST',
    'SGST',
    'IGST',
    'Total GST',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        escapeCsv(r.originState),
        escapeCsv(r.destinationState),
        escapeCsv(r.taxType),
        r.taxableAmount,
        r.cgst,
        r.sgst,
        r.igst,
        r.totalGst,
      ].join(',')
    );
  }
  return lines.join('\n');
}

export function exportSummaryCsv(rows) {
  const headers = [
    'State',
    'Total CGST',
    'Total SGST',
    'Total IGST',
    'Total Taxable Value',
    'Total GST Liability',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        escapeCsv(r.state),
        r.totalCgst,
        r.totalSgst,
        r.totalIgst,
        r.totalTaxableValue,
        r.totalGstLiability,
      ].join(',')
    );
  }
  return lines.join('\n');
}

function escapeCsv(val) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
