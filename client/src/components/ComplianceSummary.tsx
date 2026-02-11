import type { StateComplianceSummary } from '../types';

interface ComplianceSummaryProps {
  data: StateComplianceSummary[];
}

export function ComplianceSummary({ data }: ComplianceSummaryProps) {
  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/80">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              State
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total CGST
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total SGST
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total IGST
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Taxable Value
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total GST Liability
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-800/80 transition hover:bg-slate-800/30"
            >
              <td className="px-4 py-3 text-sm font-medium text-slate-200">
                {row.state}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                {fmt(row.totalCgst)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                {fmt(row.totalSgst)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                {fmt(row.totalIgst)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                {fmt(row.totalTaxableValue)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm font-medium text-emerald-400">
                {fmt(row.totalGstLiability)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
