export interface ProcessedRow {
  orderId: string;
  sku: string;
  sellerGstin: string;
  originState: string;
  destinationState: string;
  taxType: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  invoiceNumber: string;
  transactionType: string;
  shipmentItemId: string;
}

export interface StateCombinationSummary {
  originState: string;
  destinationState: string;
  taxType: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
}

export interface StateComplianceSummary {
  state: string;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTaxableValue: number;
  totalGstLiability: number;
}

export interface UploadResponse {
  processedRows: ProcessedRow[];
  stateCombinationSummary: StateCombinationSummary[];
  stateComplianceSummary: StateComplianceSummary[];
  stats: {
    totalProcessed: number;
    totalErrors: number;
    skippedCount: number;
    errors: Array<{ row: number; message?: string; orderId?: string }>;
  };
}
