import { parse } from 'csv-parse';
import { normalizeState } from './stateNormalizer.js';

/**
 * Column mapping for Amazon B2C report - handles various possible headers
 */
const COLUMN_MAP = {
  orderId: ['Order Id', 'Order ID', 'OrderId', 'order_id'],
  sku: ['Sku', 'SKU', 'sku'],
  sellerGstin: ['Seller Gstin', 'Seller GSTIN', 'seller_gstin'],
  originState: ['Ship From State', 'Ship From state', 'Warehouse State', 'Dispatch State'],
  destinationState: ['Ship To State', 'Ship To State', 'Buyer State', 'Destination State'],
  taxableAmount: ['Tax Exclusive Gross', 'Taxable Amount', 'Tax Exclusive gross'],
  totalTaxAmount: ['Total Tax Amount', 'Total tax amount'],
  invoiceNumber: ['Invoice Number', 'Invoice No'],
  transactionType: ['Transaction Type', 'Transaction type'],
  shipmentItemId: ['Shipment Item Id', 'Shipment Item ID'],
};

function findColumn(headers, aliases) {
  const headerMap = Object.fromEntries(headers.map((h) => [h.trim(), h]));
  for (const alias of aliases) {
    if (headerMap[alias]) return headerMap[alias];
  }
  return null;
}

function parseNumber(val) {
  if (val === '' || val === null || val === undefined) return 0;
  const str = String(val).replace(/,/g, '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse CSV buffer with streaming support for large files
 * @param {Buffer} buffer - CSV file buffer
 * @returns {Promise<{processedRows: Array, errors: Array, skippedCount: number}>}
 */
export async function processCSV(buffer) {
  const processedRows = [];
  const errors = [];
  let skippedCount = 0;

  return new Promise((resolve, reject) => {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      bom: true,
    });

    let headersChecked = false;
    let columnKeys = null;

    parser.on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        if (!headersChecked) {
          const headers = Object.keys(record);
          columnKeys = {
            orderId: findColumn(headers, COLUMN_MAP.orderId),
            sku: findColumn(headers, COLUMN_MAP.sku),
            sellerGstin: findColumn(headers, COLUMN_MAP.sellerGstin),
            originState: findColumn(headers, COLUMN_MAP.originState),
            destinationState: findColumn(headers, COLUMN_MAP.destinationState),
            taxableAmount: findColumn(headers, COLUMN_MAP.taxableAmount),
            totalTaxAmount: findColumn(headers, COLUMN_MAP.totalTaxAmount),
            invoiceNumber: findColumn(headers, COLUMN_MAP.invoiceNumber),
            transactionType: findColumn(headers, COLUMN_MAP.transactionType),
            shipmentItemId: findColumn(headers, COLUMN_MAP.shipmentItemId),
          };

          if (!columnKeys.originState || !columnKeys.destinationState) {
            errors.push({
              row: processedRows.length + 1,
              message: 'Missing required columns: Ship From State or Ship To State',
            });
            headersChecked = true;
            continue;
          }
          headersChecked = true;
        }

        const originState = columnKeys.originState ? record[columnKeys.originState] : '';
        const destinationState = columnKeys.destinationState ? record[columnKeys.destinationState] : '';

        const txType = columnKeys.transactionType ? record[columnKeys.transactionType] : '';
        const taxableAmount = parseNumber(columnKeys.taxableAmount ? record[columnKeys.taxableAmount] : 0);
        const totalTaxAmount = parseNumber(columnKeys.totalTaxAmount ? record[columnKeys.totalTaxAmount] : 0);

        // Normalize states; use "Unknown" for missing so we process all rows
        const normalizedOrigin = normalizeState(originState) || 'Unknown';
        const normalizedDestination = normalizeState(destinationState) || 'Unknown';

        if (!originState?.trim() || !destinationState?.trim()) {
          errors.push({
            row: processedRows.length + 1,
            orderId: columnKeys.orderId ? record[columnKeys.orderId] : '',
            message: `Missing state (using Unknown): Origin="${originState}" Dest="${destinationState}"`,
          });
        }

        processedRows.push({
          orderId: columnKeys.orderId ? record[columnKeys.orderId] : '',
          sku: columnKeys.sku ? record[columnKeys.sku] : '',
          sellerGstin: columnKeys.sellerGstin ? record[columnKeys.sellerGstin] : '',
          originState: normalizedOrigin,
          destinationState: normalizedDestination,
          taxableAmount: Math.round(taxableAmount * 100) / 100,
          totalTaxAmount: Math.round(totalTaxAmount * 100) / 100,
          invoiceNumber: columnKeys.invoiceNumber ? record[columnKeys.invoiceNumber] : '',
          transactionType: txType,
          shipmentItemId: columnKeys.shipmentItemId ? record[columnKeys.shipmentItemId] : '',
        });
      }
    });

    parser.on('error', reject);
    parser.on('end', () => {
      resolve({
        processedRows,
        errors,
        skippedCount,
      });
    });

    parser.write(buffer);
    parser.end();
  });
}
