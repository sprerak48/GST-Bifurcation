import type { StateCombinationSummary } from '../types';

interface SummaryTableProps {
  data: StateCombinationSummary[];
}

export function SummaryTable({ data }: SummaryTableProps) {
  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/80">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Origin State
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Destination State
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tax Type
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Taxable Amount
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              CGST
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              SGST
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              IGST
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total GST
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-800/80 transition hover:bg-slate-800/30"
            >
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
  );
}
