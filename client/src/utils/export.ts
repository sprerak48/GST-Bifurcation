import * as XLSX from 'xlsx';
import type { ProcessedRow, StateCombinationSummary, StateComplianceSummary } from '../types';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(val: unknown) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportDetailedClient(format: 'xlsx' | 'csv', rows: ProcessedRow[]) {
  if (format === 'xlsx') {
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
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    downloadBlob(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'gst-detailed-report.xlsx');
    return;
  }

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
  downloadBlob(new Blob([lines.join('\n')], { type: 'text/csv' }), 'gst-detailed-report.csv');
}

export function exportStatePairsClient(format: 'xlsx' | 'csv', rows: StateCombinationSummary[]) {
  if (format === 'xlsx') {
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
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    downloadBlob(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'gst-state-pairs-summary.xlsx');
    return;
  }

  const headers = ['Origin State', 'Destination State', 'Tax Type', 'Taxable Amount', 'CGST', 'SGST', 'IGST', 'Total GST'];
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
  downloadBlob(new Blob([lines.join('\n')], { type: 'text/csv' }), 'gst-state-pairs-summary.csv');
}

export function exportComplianceClient(format: 'xlsx' | 'csv', rows: StateComplianceSummary[]) {
  if (format === 'xlsx') {
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
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    downloadBlob(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'gst-state-summary.xlsx');
    return;
  }

  const headers = ['State', 'Total CGST', 'Total SGST', 'Total IGST', 'Total Taxable Value', 'Total GST Liability'];
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
  downloadBlob(new Blob([lines.join('\n')], { type: 'text/csv' }), 'gst-state-summary.csv');
}

