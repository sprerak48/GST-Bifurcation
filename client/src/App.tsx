import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { uploadCSV } from './api';
import type { UploadResponse } from './types';
import { FileUpload } from './components/FileUpload';
import { GstSummaryTabs } from './components/GstSummaryTabs';
import { AIAgent } from './components/AIAgent';

function App() {
  const [data, setData] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleFileSelect = async (file: File) => {
    setError(null);
    setValidationStatus('idle');

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setValidationStatus('invalid');
      setError('Only CSV files are allowed');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadCSV(file);
      setData(result);
      setValidationStatus('valid');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setValidationStatus('invalid');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setValidationStatus('idle');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="font-bold text-2xl sm:text-3xl tracking-tight text-white">
            GST Bifurcation
          </h1>
          <p className="mt-1 text-slate-400">
            Automated GST split for multi-state Amazon B2C orders — CGST, SGST & IGST
          </p>
        </header>

        <FileUpload
          onFileSelect={handleFileSelect}
          loading={loading}
          validationStatus={validationStatus}
          error={error}
          onReset={handleReset}
          hasData={!!data}
        />

        {validationStatus === 'valid' && data && (
          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span>
              Processed <strong>{data.stats.totalProcessed}</strong> rows
              {data.stats.skippedCount > 0 && (
                <> • Skipped {data.stats.skippedCount}</>
              )}
              {data.stats.totalErrors > 0 && (
                <> • {data.stats.totalErrors} errors</>
              )}
            </span>
          </div>
        )}

        {validationStatus === 'invalid' && error && (
          <div className="mt-6 flex items-center gap-2 text-sm text-amber-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <AIAgent data={data} />

        {data && (
          <div className="mt-10">
            <GstSummaryTabs
              processedRows={data.processedRows}
              stateCombinationSummary={data.stateCombinationSummary}
              stateComplianceSummary={data.stateComplianceSummary}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
