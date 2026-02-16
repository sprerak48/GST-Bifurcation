import { useCallback, useState } from 'react';
import { FileSpreadsheet, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  validationStatus: 'idle' | 'valid' | 'invalid';
  error: string | null;
  onReset: () => void;
  hasData: boolean;
}

export function FileUpload({
  onFileSelect,
  loading,
  validationStatus,
  error: _error,
  onReset,
  hasData,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed p-10 transition-all
          ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}
          ${validationStatus === 'invalid' ? 'border-amber-500/50' : ''}
          ${validationStatus === 'valid' ? 'border-emerald-500/50' : ''}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          disabled={loading}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          {loading ? (
            <>
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-slate-400">Processing CSV...</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-slate-800 p-4">
                <FileSpreadsheet className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200">
                  {isDragging ? 'Drop your CSV here' : 'Drop Amazon B2C Report CSV'}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  or click to browse • Supports 10k–100k rows
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {hasData && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
          Clear & upload new file
        </button>
      )}
    </div>
  );
}
