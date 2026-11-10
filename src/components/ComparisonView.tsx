import React from 'react';
import { 
  Building2, 
  Trash2, 
  Plus, 
  Sparkles, 
  GraduationCap, 
  Train, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { HdbProperty } from '../types';
import { calculateBSD } from '../utils/calculator';

interface ComparisonViewProps {
  compareList: HdbProperty[];
  allProperties: HdbProperty[];
  onRemoveFromCompare: (property: HdbProperty) => void;
  onAddToCompare: (property: HdbProperty) => void;
  onClearCompare: () => void;
  onSelectProperty: (property: HdbProperty) => void;
  onRunAiComparison: (properties: HdbProperty[]) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  compareList,
  allProperties,
  onRemoveFromCompare,
  onAddToCompare,
  onClearCompare,
  onSelectProperty,
  onRunAiComparison,
}) => {
  // If fewer than 2 units are selected, allow user to quickly select from available properties
  const availableToAdd = allProperties.filter(
    (p) => !compareList.some((c) => c.id === p.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
              Head-to-Head Property Evaluator
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Multi-Property Comparison Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Compare up to 3 HDB flats side-by-side across transacted price, remaining lease decay, 
              MOE 1km primary school eligibility, and daily commute time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={onClearCompare}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
              >
                Clear Selection
              </button>
            )}

            {compareList.length >= 2 && (
              <button
                onClick={() => onRunAiComparison(compareList)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Comparison Verdict</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* When 0 units selected */}
      {compareList.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              No HDB properties currently selected
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select 2 or 3 properties below to generate an instantaneous side-by-side comparison 
              of schools, lease decay, and transport convenience.
            </p>
          </div>

          {/* Quick preset comparisons */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Popular Comparisons to Try:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  const p1 = allProperties.find((p) => p.town === 'Bishan');
                  const p2 = allProperties.find((p) => p.town === 'Queenstown');
                  if (p1 && p2) {
                    onAddToCompare(p1);
                    onAddToCompare(p2);
                  }
                }}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium transition-colors"
              >
                Bishan (Catholic High) vs Queenstown (SkyVille)
              </button>
              <button
                onClick={() => {
                  const p1 = allProperties.find((p) => p.town === 'Clementi');
                  const p2 = allProperties.find((p) => p.town === 'Tampines');
                  if (p1 && p2) {
                    onAddToCompare(p1);
                    onAddToCompare(p2);
                  }
                }}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium transition-colors"
              >
                Clementi (Nan Hua SAP) vs Tampines (GreenRidges)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {compareList.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 w-48 bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold align-top">
                    Feature & Metric
                  </th>
                  {compareList.map((prop) => (
                    <th key={prop.id} className="p-4 min-w-[260px] align-top bg-white dark:bg-slate-900">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                            {prop.town}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            Blk {prop.block} {prop.streetName}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {prop.flatType} · {prop.flatModel}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveFromCompare(prop)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove unit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3">
                        <img
                          src={prop.imageUrl}
                          alt={prop.streetName}
                          referrerPolicy="no-referrer"
                          className="w-full h-28 object-cover rounded-lg"
                        />
                      </div>
                    </th>
                  ))}

                  {/* Slot to add another property */}
                  {compareList.length < 3 && (
                    <th className="p-4 min-w-[220px] bg-slate-50/50 dark:bg-slate-800/30 border-l border-slate-200 dark:border-slate-800 align-middle text-center">
                      <div className="space-y-2 p-4">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Add 3rd Unit to Compare
                        </div>
                        <select
                          onChange={(e) => {
                            const found = allProperties.find((p) => p.id === e.target.value);
                            if (found) onAddToCompare(found);
                            e.target.value = '';
                          }}
                          defaultValue=""
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                        >
                          <option value="" disabled>Select HDB Block...</option>
                          {availableToAdd.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.town}: Blk {p.block} ({p.flatType})
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {/* Financial Section */}
                <tr className="bg-slate-50/60 dark:bg-slate-800/40">
                  <td colSpan={compareList.length + (compareList.length < 3 ? 2 : 1)} className="py-2 px-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    1. Price & Capital Valuation
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Transacted / Asking Price</td>
                  {compareList.map((prop) => (
                    <td key={prop.id} className="py-3 px-4 font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums">
                      S${prop.resalePrice.toLocaleString()}
                    </td>
                  ))}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Price Per Sqft (PSF)</td>
                  {compareList.map((prop) => (
                    <td key={prop.id} className="py-3 px-4 font-mono tabular-nums">
                      S${prop.psf} psf
                    </td>
                  ))}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Floor Area</td>
                  {compareList.map((prop) => (
                    <td key={prop.id} className="py-3 px-4 font-mono tabular-nums">
                      {prop.floorAreaSqm} sqm ({prop.floorAreaSqft} sqft)
                    </td>
                  ))}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Buyer's Stamp Duty (BSD)</td>
                  {compareList.map((prop) => {
                    const bsd = calculateBSD(prop.resalePrice);
                    return (
                      <td key={prop.id} className="py-3 px-4 font-mono tabular-nums">
                        S${bsd.toLocaleString()}
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                {/* Lease & Bala's Table Section */}
                <tr className="bg-slate-50/60 dark:bg-slate-800/40">
                  <td colSpan={compareList.length + (compareList.length < 3 ? 2 : 1)} className="py-2 px-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    2. Lease Decay & Value Retention (Bala's Table)
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Remaining Lease</td>
                  {compareList.map((prop) => (
                    <td key={prop.id} className="py-3 px-4">
                      <div className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                        {prop.remainingLeaseYears} yrs {prop.remainingLeaseMonths} mos
                      </div>
                      <div className="text-[11px] text-slate-500">Commenced {prop.leaseCommenceDate}</div>
                    </td>
                  ))}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Bala's Table Retention</td>
                  {compareList.map((prop) => (
                    <td key={prop.id} className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        <span>{prop.balasTableRetentionPct}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {prop.remainingLeaseYears < 60 ? 'Higher depreciation velocity' : 'Healthy equity preservation'}
                      </div>
                    </td>
                  ))}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                {/* Schools & MOE Phase 2C Section */}
                <tr className="bg-slate-50/60 dark:bg-slate-800/40">
                  <td colSpan={compareList.length + (compareList.length < 3 ? 2 : 1)} className="py-2 px-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    3. Nearby Schools & MOE Primary 1 Priority
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Primary Schools (&lt; 1km)</td>
                  {compareList.map((prop) => {
                    const top1km = prop.nearbySchools.filter(
                      (s) => s.category === 'Primary' && s.distanceMeters <= 1000
                    );
                    return (
                      <td key={prop.id} className="py-3 px-4">
                        {top1km.length === 0 ? (
                          <span className="text-slate-400">None within 1km</span>
                        ) : (
                          <div className="space-y-1.5">
                            {top1km.map((sch) => (
                              <div key={sch.id} className="text-xs">
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {sch.name}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {sch.distanceMeters}m · {sch.phase2cBallotingTier}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Primary Schools (1km - 2km)</td>
                  {compareList.map((prop) => {
                    const sch1to2 = prop.nearbySchools.filter(
                      (s) => s.category === 'Primary' && s.distanceMeters > 1000 && s.distanceMeters <= 2000
                    );
                    return (
                      <td key={prop.id} className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {sch1to2.length} School{sch1to2.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {sch1to2.map((s) => s.name).join(', ') || 'None'}
                        </div>
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                {/* Transport & Amenities Section */}
                <tr className="bg-slate-50/60 dark:bg-slate-800/40">
                  <td colSpan={compareList.length + (compareList.length < 3 ? 2 : 1)} className="py-2 px-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    4. Public Transport & Daily Amenities
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Nearest MRT Station</td>
                  {compareList.map((prop) => (
                    <td key={prop.id} className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {prop.nearestMrt.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {prop.nearestMrt.distanceMeters}m · ~{prop.nearestMrt.walkMinutes} min walk
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {prop.nearestMrt.line}
                      </div>
                      {prop.nearestMrt.isShelteredWalkway && (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                          ✓ Sheltered Walkway
                        </span>
                      )}
                    </td>
                  ))}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Hawker & Food Market</td>
                  {compareList.map((prop) => {
                    const hawker = prop.amenities.find((a) => a.type === 'hawker');
                    return (
                      <td key={prop.id} className="py-3 px-4">
                        {hawker ? (
                          <>
                            <div className="font-bold text-slate-900 dark:text-white">{hawker.name}</div>
                            <div className="text-[11px] text-slate-500">{hawker.distanceMeters}m · {hawker.highlight}</div>
                          </>
                        ) : (
                          <span className="text-slate-400">Coffeeshops within 200m</span>
                        )}
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-500">Shopping Mall</td>
                  {compareList.map((prop) => {
                    const mall = prop.amenities.find((a) => a.type === 'mall');
                    return (
                      <td key={prop.id} className="py-3 px-4">
                        {mall ? (
                          <>
                            <div className="font-bold text-slate-900 dark:text-white">{mall.name}</div>
                            <div className="text-[11px] text-slate-500">{mall.distanceMeters}m · {mall.highlight}</div>
                          </>
                        ) : (
                          <span className="text-slate-400">Neighbourhood retail</span>
                        )}
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>

                {/* Actions row */}
                <tr>
                  <td className="py-4 px-4 font-medium text-slate-500">Actions</td>
                  {compareList.map((prop) => (
                    <td key={prop.id} className="py-4 px-4">
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                      >
                        Inspect Full Profile
                      </button>
                    </td>
                  ))}
                  {compareList.length < 3 && <td className="bg-slate-50/20 dark:bg-slate-800/10" />}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
