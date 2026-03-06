import { useState } from 'react';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import type { ProcessedRow, StateCombinationSummary, StateComplianceSummary } from '../types';
import { DetailedOrdersTable } from './DetailedOrdersTable';
import { SummaryTable } from './SummaryTable';
import { ComplianceSummary } from './ComplianceSummary';
import { exportComplianceClient, exportDetailedClient, exportStatePairsClient } from '../utils/export';

interface GstSummaryTabsProps {
  processedRows: ProcessedRow[];
  stateCombinationSummary: StateCombinationSummary[];
  stateComplianceSummary: StateComplianceSummary[];
}

type TabId = 'detailed' | 'summary' | 'compliance';

export function GstSummaryTabs({
  processedRows,
  stateCombinationSummary,
  stateComplianceSummary,
}: GstSummaryTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('detailed');

  const handleExportDetailed = async (format: 'xlsx' | 'csv') => {
    try {
      exportDetailedClient(format, processedRows);
    } catch (err) {
      // DOMException isn't always instanceof Error in browsers
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Detailed export failed:', err);
      alert(msg || 'Export failed');
    }
  };

  const handleExportSummary = async (format: 'xlsx' | 'csv') => {
    try {
      exportComplianceClient(format, stateComplianceSummary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Compliance export failed:', err);
      alert(msg || 'Export failed');
    }
  };

  const handleExportStatePairs = async (format: 'xlsx' | 'csv') => {
    try {
      exportStatePairsClient(format, stateCombinationSummary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('State pairs export failed:', err);
      alert(msg || 'Export failed');
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'detailed', label: 'Detailed Orders' },
    { id: 'summary', label: 'GST Summary (State Pairs)' },
    { id: 'compliance', label: 'Compliance Summary' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-lg bg-slate-900/80 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {activeTab === 'detailed' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleExportDetailed('xlsx')}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/20 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-600/30"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export XLSX
              </button>
              <button
                onClick={() => handleExportDetailed('csv')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          )}
          {activeTab === 'summary' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleExportStatePairs('xlsx')}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/20 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-600/30"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export XLSX
              </button>
              <button
                onClick={() => handleExportStatePairs('csv')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          )}
          {activeTab === 'compliance' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleExportSummary('xlsx')}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/20 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-600/30"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export XLSX
              </button>
              <button
                onClick={() => handleExportSummary('csv')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'detailed' && (
        <DetailedOrdersTable rows={processedRows} />
      )}
      {activeTab === 'summary' && (
        <SummaryTable data={stateCombinationSummary} />
      )}
      {activeTab === 'compliance' && (
        <ComplianceSummary data={stateComplianceSummary} />
      )}
    </div>
  );
}
