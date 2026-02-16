import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import type { ProcessedRow } from '../types';

interface DetailedOrdersTableProps {
  rows: ProcessedRow[];
}

type SortKey = keyof ProcessedRow;
type SortDir = 'asc' | 'desc';

export function DetailedOrdersTable({ rows }: DetailedOrdersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('orderId');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterState, setFilterState] = useState('');
  const [filterTaxType, setFilterTaxType] = useState('');
  const [filterSku, setFilterSku] = useState('');

  const taxTypes = useMemo(() => [...new Set(rows.map((r) => r.taxType))].sort(), [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (filterState) {
        const match =
          row.originState.toLowerCase().includes(filterState.toLowerCase()) ||
          row.destinationState.toLowerCase().includes(filterState.toLowerCase());
        if (!match) return false;
      }
      if (filterTaxType && row.taxType !== filterTaxType) return false;
      if (
        filterSku &&
        !row.sku.toLowerCase().includes(filterSku.toLowerCase())
      )
        return false;
      return true;
    });
  }, [rows, filterState, filterTaxType, filterSku]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const fmt = (n: number) => n.toFixed(2);

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: 'orderId', label: 'Order ID' },
    { key: 'sku', label: 'SKU' },
    { key: 'originState', label: 'Origin State' },
    { key: 'destinationState', label: 'Destination State' },
    { key: 'taxType', label: 'Tax Type' },
    { key: 'taxableAmount', label: 'Taxable Amount', className: 'text-right' },
    { key: 'cgst', label: 'CGST', className: 'text-right' },
    { key: 'sgst', label: 'SGST', className: 'text-right' },
    { key: 'igst', label: 'IGST', className: 'text-right' },
    { key: 'totalGst', label: 'Total GST', className: 'text-right' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by state..."
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <select
          value={filterTaxType}
          onChange={(e) => setFilterTaxType(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All Tax Types</option>
          {taxTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by SKU..."
          value={filterSku}
          onChange={(e) => setFilterSku(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none min-w-[160px]"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/80">
              {columns.map(({ key, label, className }) => (
                <th
                  key={key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 ${className || ''}`}
                >
                  <button
                    onClick={() => toggleSort(key)}
                    className="inline-flex items-center gap-1 hover:text-slate-200"
                  >
                    {label}
                    {sortKey === key ? (
                      sortDir === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-800/80 transition hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 font-mono text-sm text-slate-300">
                  {row.orderId}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">{row.sku}</td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {row.originState}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {row.destinationState}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.taxType === 'IGST'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {row.taxType}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                  {fmt(row.taxableAmount)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                  {fmt(row.cgst)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                  {fmt(row.sgst)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                  {fmt(row.igst)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm font-medium text-slate-200">
                  {fmt(row.totalGst)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        Showing {sortedRows.length} of {rows.length} rows
      </p>
    </div>
  );
}
