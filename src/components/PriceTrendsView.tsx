import React, { useState } from 'react';
import { 
  TrendingUp, 
  HelpCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Building2, 
  BarChart3,
  Percent
} from 'lucide-react';
import { TOWN_MEDIAN_STATS, BALAS_TABLE } from '../data/hdbData';
import { HdbProperty } from '../types';

interface PriceTrendsViewProps {
  properties: HdbProperty[];
  onSelectProperty: (property: HdbProperty) => void;
}

export const PriceTrendsView: React.FC<PriceTrendsViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [selectedTown, setSelectedTown] = useState<string>('Queenstown');

  const towns = Object.keys(TOWN_MEDIAN_STATS);

  // Bala curve points
  const balaPoints = Object.entries(BALAS_TABLE)
    .map(([years, pct]) => ({ years: parseInt(years, 10), pct }))
    .sort((a, b) => a.years - b.years);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
            Town Benchmarks & SLA Bala's Table
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Resale Price Trends & Leasehold Decay Dynamics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Understand capital growth across mature and non-mature Singapore towns, and evaluate 
            long-term equity preservation against the Singapore Land Authority (SLA) Bala's Table leasehold decay curve.
          </p>
        </div>
      </div>

      {/* Grid: Town Comparison Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-red-600" />
          <span>Singapore HDB Town Resale Benchmarks (2026 Q1)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {towns.map((town) => {
            const stats = TOWN_MEDIAN_STATS[town];
            const isSelected = selectedTown === town;

            return (
              <div
                key={town}
                onClick={() => setSelectedTown(town)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-red-50/50 border-red-500 dark:bg-red-950/30 dark:border-red-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{town}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    +{stats.qoqChange}% QoQ
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    S${stats.medianPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    S${stats.medianPsf} psf · {stats.transactedCount} units
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bala's Table Lease Decay Visualization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
              Actuarial Value Retention
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>SLA Bala's Table Lease Decay Curve</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Bala's Table indicates what percentage of a property's freehold value remains based on years left.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-200">Key Rule: </span>
            <span>At &lt;60 years remaining, CPF usage is prorated. At &lt;30 years, no CPF allowed.</span>
          </div>
        </div>

        {/* SVG Bala Curve */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950 rounded-xl p-4 sm:p-6 overflow-hidden border border-slate-800">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 400" preserveAspectRatio="none">
            {/* Background horizontal grid lines */}
            {[20, 40, 60, 80, 100].map((level) => {
              const y = 350 - (level / 100) * 300;
              return (
                <g key={level}>
                  <line x1="50" y1={y} x2="950" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="35" y={y + 4} fill="#64748b" fontSize="12" textAnchor="end" fontFamily="JetBrains Mono">
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Critical inflection line at 60 years */}
            <line x1="500" y1="50" x2="500" y2="350" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="505" y="65" fill="#f59e0b" fontSize="11" fontFamily="Plus Jakarta Sans">
              60-Year Inflection (CPF Limits)
            </text>

            {/* Bala Table Curve Line */}
            <path
              d={balaPoints.reduce((acc, pt, idx) => {
                const x = 50 + ((pt.years - 30) / 70) * 900;
                const y = 350 - (pt.pct / 100) * 300;
                return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
            />

            {/* Markers for Tracked Properties on the Curve */}
            {properties.map((prop) => {
              const x = 50 + ((prop.remainingLeaseYears - 30) / 70) * 900;
              const y = 350 - (prop.balasTableRetentionPct / 100) * 300;

              return (
                <g key={prop.id} className="cursor-pointer group">
                  <circle cx={x} cy={y} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={x}
                    y={y - 12}
                    fill="#ffffff"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="Plus Jakarta Sans"
                    fontWeight="bold"
                    className="opacity-80 group-hover:opacity-100"
                  >
                    {prop.town.split(' ')[0]} ({prop.remainingLeaseYears}y)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
            <span>30 Yrs (32.8%)</span>
            <span>45 Yrs (51.4%)</span>
            <span>60 Yrs (68.1%)</span>
            <span>75 Yrs (82.2%)</span>
            <span>90 Yrs (93.0%)</span>
            <span>99 Yrs (96.0%)</span>
          </div>
        </div>

        {/* Informative Table of Properties & Bala Retention */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4">HDB Block & Town</th>
                <th className="py-2.5 px-4">Commencement</th>
                <th className="py-2.5 px-4 font-mono">Remaining Lease</th>
                <th className="py-2.5 px-4 font-mono text-right">Bala Retention %</th>
                <th className="py-2.5 px-4">Lease Health Status</th>
                <th className="py-2.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                    Blk {p.block} {p.streetName} ({p.town})
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">{p.leaseCommenceDate}</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {p.remainingLeaseYears} years {p.remainingLeaseMonths} mos
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                    {p.balasTableRetentionPct}%
                  </td>
                  <td className="py-2.5 px-4">
                    {p.remainingLeaseYears >= 80 ? (
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">Prime Liquidity (Minimal Decay)</span>
                    ) : p.remainingLeaseYears >= 60 ? (
                      <span className="text-blue-700 dark:text-blue-300 font-medium">Moderate Decay Velocity</span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-300 font-medium">High Depreciation (CPF Restraints)</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => onSelectProperty(p)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
