import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Train, 
  GraduationCap, 
  ShoppingBag, 
  Utensils, 
  Trees, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Check,
  Calculator,
  Building
} from 'lucide-react';
import { HdbProperty } from '../types';

interface PropertyDetailModalProps {
  property: HdbProperty | null;
  onClose: () => void;
  isCompared: boolean;
  onToggleCompare: (property: HdbProperty) => void;
  onOpenAiValuation: (property: HdbProperty) => void;
  onOpenAffordability: (property: HdbProperty) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isCompared,
  onToggleCompare,
  onOpenAiValuation,
  onOpenAffordability,
}) => {
  if (!property) return null;

  const schoolsWithin1km = property.nearbySchools.filter(
    (s) => s.category === 'Primary' && s.distanceMeters <= 1000
  );
  const schools1to2km = property.nearbySchools.filter(
    (s) => s.category === 'Primary' && s.distanceMeters > 1000 && s.distanceMeters <= 2000
  );
  const otherSchools = property.nearbySchools.filter((s) => s.category !== 'Primary');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Close Button */}
        <div className="relative h-56 sm:h-72 w-full bg-slate-100 dark:bg-slate-800 shrink-0">
          <img
            src={property.imageUrl}
            alt={`Blk ${property.block} ${property.streetName}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay titles */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-200 mb-1">
              <span>{property.town}</span>
              <span aria-hidden="true">·</span>
              <span>Postal {property.postalCode}</span>
              <span aria-hidden="true">·</span>
              <span>{property.flatType} ({property.flatModel})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Block {property.block} {property.streetName}
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          {/* Primary Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Resale Price</div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                S${property.resalePrice.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 font-mono">S${property.psf} psf</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Floor Area & Level</div>
              <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {property.floorAreaSqm} sqm
              </div>
              <div className="text-xs text-slate-500">{property.floorAreaSqft} sqft · Storey {property.storeyRange}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Remaining Lease</div>
              <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {property.remainingLeaseYears}y {property.remainingLeaseMonths}m
              </div>
              <div className="text-xs text-slate-500">Commenced {property.leaseCommenceDate}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Bala's Table Value</div>
              <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                {property.balasTableRetentionPct}%
              </div>
              <div className="text-xs text-slate-500">Leasehold Retention</div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onToggleCompare(property)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isCompared
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {isCompared ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isCompared ? 'Remove from Comparison' : 'Add to Comparison'}</span>
            </button>

            <button
              onClick={() => onOpenAiValuation(property)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Valuation & Risk Analysis</span>
            </button>

            <button
              onClick={() => onOpenAffordability(property)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate CPF & Monthly Mortgage</span>
            </button>
          </div>

          {/* Section 1: Schools & MOE Primary 1 Registration Radar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Primary Schools & P1 Registration Priority</span>
              </h3>
              <span className="text-xs text-slate-500">MOE Phase 2C Rules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* < 1km Category */}
              <div className="border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-800 dark:text-blue-300">
                  <span>Within 1km (Highest P1 Priority)</span>
                  <span className="font-mono">{schoolsWithin1km.length} School{schoolsWithin1km.length !== 1 ? 's' : ''}</span>
                </div>

                {schoolsWithin1km.length === 0 ? (
                  <p className="text-xs text-slate-500">No primary schools within 1.0 km radius.</p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {schoolsWithin1km.map((sch) => (
                      <div key={sch.id} className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {sch.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {sch.distanceMeters}m · ~{sch.walkMinutes} mins walk · {sch.coEd}
                              {sch.sapStatus && ' · SAP'}
                              {sch.giftedEducation && ' · GEP'}
                              {sch.affiliation && ` · Affiliated to ${sch.affiliation}`}
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            sch.phase2cBallotingTier.includes('High')
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {sch.phase2cBallotingTier.split(' ')[0]} Risk
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 1km - 2km Category */}
              <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Between 1km – 2km (Secondary Priority)</span>
                  <span className="font-mono">{schools1to2km.length} School{schools1to2km.length !== 1 ? 's' : ''}</span>
                </div>

                {schools1to2km.length === 0 ? (
                  <p className="text-xs text-slate-500">No other primary schools in 1-2km range.</p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {schools1to2km.map((sch) => (
                      <div key={sch.id} className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {sch.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {sch.distanceMeters}m · ~{sch.walkMinutes} mins · {sch.coEd}
                          {sch.sapStatus && ' · SAP'}
                          {sch.giftedEducation && ' · GEP'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: MRT Connectivity & Local Amenities */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Train className="w-5 h-5 text-emerald-600" />
              <span>Public Transport & Daily Amenities</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* MRT Box */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-1">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Nearest MRT Station
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {property.nearestMrt.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {property.nearestMrt.distanceMeters}m · ~{property.nearestMrt.walkMinutes} mins walk
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Line: {property.nearestMrt.line}
                </div>
                {property.nearestMrt.isShelteredWalkway && (
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                    ✓ Sheltered linkway to gantry
                  </div>
                )}
              </div>

              {/* Hawker & Food */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-1">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  <span>Food & Hawker Centres</span>
                </div>
                {property.amenities.filter(a => a.type === 'hawker').map(a => (
                  <div key={a.id} className="text-xs pt-1">
                    <div className="font-bold text-slate-900 dark:text-white">{a.name}</div>
                    <div className="text-[11px] text-slate-500">{a.distanceMeters}m · {a.highlight}</div>
                  </div>
                ))}
              </div>

              {/* Malls & Supermarkets */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-1">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Malls & Groceries</span>
                </div>
                {property.amenities.filter(a => a.type === 'mall' || a.type === 'supermarket').slice(0, 2).map(a => (
                  <div key={a.id} className="text-xs pt-1">
                    <div className="font-bold text-slate-900 dark:text-white">{a.name}</div>
                    <div className="text-[11px] text-slate-500">{a.distanceMeters}m · {a.highlight}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: 4-Year Price Trend Visualizer */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span>Historical Resale Price Trajectory (2023 - 2026)</span>
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <div className="h-40 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2">
                {property.priceTrend.map((pt, i) => {
                  const minP = 500000;
                  const maxP = 1300000;
                  const pct = Math.max(10, Math.min(100, ((pt.price - minP) / (maxP - minP)) * 100));

                  return (
                    <div key={pt.yearQuarter} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <div className="text-[10px] font-mono tabular-nums text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        S${(pt.price / 1000).toFixed(0)}k
                      </div>
                      <div 
                        style={{ height: `${pct}%` }}
                        className="w-full max-w-[42px] bg-red-600 dark:bg-red-500 rounded-t-sm hover:brightness-110 transition-all cursor-pointer relative"
                      />
                      <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap mt-1">
                        {pt.yearQuarter}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Recent Real Block Transactions Table */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Registered Precinct Transactions
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Transaction Month</th>
                    <th className="py-2.5 px-3">Storey Range</th>
                    <th className="py-2.5 px-3">Floor Area</th>
                    <th className="py-2.5 px-3 text-right">Transacted Price</th>
                    <th className="py-2.5 px-3 text-right">PSF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {property.recentTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-mono text-slate-700 dark:text-slate-300">{tx.month}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Storey {tx.storeyRange}</td>
                      <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">{tx.floorAreaSqm} sqm</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        S${tx.resalePrice.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">
                        S${tx.psf}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Source: HDB Resale Data & OneMap MOE Boundaries
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
