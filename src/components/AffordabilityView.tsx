import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  Building2,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { calculateMortgage } from '../utils/calculator';
import { HdbProperty } from '../types';

interface AffordabilityViewProps {
  selectedProperty?: HdbProperty | null;
  allProperties: HdbProperty[];
}

export const AffordabilityView: React.FC<AffordabilityViewProps> = ({
  selectedProperty,
  allProperties,
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(
    selectedProperty ? selectedProperty.resalePrice : 850000
  );
  const [householdIncome, setHouseholdIncome] = useState<number>(9500);
  const [buyerAge, setBuyerAge] = useState<number>(32);
  const [loanType, setLoanType] = useState<'hdb' | 'bank'>('hdb');
  const [firstTimer, setFirstTimer] = useState<boolean>(true);
  const [within4kmParents, setWithin4kmParents] = useState<boolean>(true);
  const [flatType, setFlatType] = useState<string>('4 ROOM');

  // Compute live mortgage metrics
  const results = calculateMortgage(
    {
      propertyPrice,
      householdIncome,
      buyerAge,
      loanType,
      firstTimer,
      within4kmParents,
      existingCommitments: 0,
    },
    flatType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
              Financial Stress-Testing Engine
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              CPF Housing Grants & Mortgage Affordability
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Test your eligibility for Enhanced Housing Grant (EHG), Family Grant, and Proximity Housing Grant (PHG), 
              plus check compliance with Singapore’s 30% Mortgage Servicing Ratio (MSR).
            </p>
          </div>

          {/* Quick Listing autofill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Load from Listing:</span>
            <select
              onChange={(e) => {
                const p = allProperties.find((item) => item.id === e.target.value);
                if (p) {
                  setPropertyPrice(p.resalePrice);
                  setFlatType(p.flatType);
                }
              }}
              defaultValue=""
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="" disabled>Choose property...</option>
              {allProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.town}: Blk {p.block} (S${(p.resalePrice / 1000).toFixed(0)}k)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs + Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Station (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Buyer Parameters & Assumptions
          </h3>

          {/* Property Price Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Target Resale Price</span>
              <span className="font-mono text-sm tabular-nums text-slate-900 dark:text-white font-bold">
                S${propertyPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={400000}
              max={1400000}
              step={10000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(parseInt(e.target.value, 10))}
              className="w-full accent-red-600"
            />
          </div>

          {/* Flat Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Flat Type (Affects Family Grant)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['3 ROOM', '4 ROOM', '5 ROOM'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFlatType(type)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    flatType === type
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-red-600 dark:border-red-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Household Income Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Monthly Household Income</span>
              <span className="font-mono text-sm tabular-nums text-slate-900 dark:text-white font-bold">
                S${householdIncome.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={3000}
              max={22000}
              step={500}
              value={householdIncome}
              onChange={(e) => setHouseholdIncome(parseInt(e.target.value, 10))}
              className="w-full accent-red-600"
            />
            <div className="text-[11px] text-slate-500 mt-0.5">
              EHG cap: S$9,000/mo · Family Grant ceiling: S$14,000/mo
            </div>
          </div>

          {/* Buyer Age */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Age of Main Applicant</span>
              <span className="font-mono text-sm tabular-nums text-slate-900 dark:text-white font-bold">
                {buyerAge} years old
              </span>
            </div>
            <input
              type="range"
              min={21}
              max={55}
              step={1}
              value={buyerAge}
              onChange={(e) => setBuyerAge(parseInt(e.target.value, 10))}
              className="w-full accent-red-600"
            />
            <div className="text-[11px] text-slate-500 mt-0.5">
              Max Loan Tenure: {results.maxTenure} years (capped at age 65 or 25 yrs)
            </div>
          </div>

          {/* Loan Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Financing Loan Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLoanType('hdb')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  loanType === 'hdb'
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">HDB Housing Loan</div>
                <div className="text-[11px] opacity-80 font-mono">2.6% p.a. · 80% LTV</div>
              </button>

              <button
                type="button"
                onClick={() => setLoanType('bank')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  loanType === 'bank'
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Commercial Bank Loan</div>
                <div className="text-[11px] opacity-80 font-mono">3.1% p.a. · 75% LTV</div>
              </button>
            </div>
          </div>

          {/* Grant Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={firstTimer}
                onChange={(e) => setFirstTimer(e.target.checked)}
                className="rounded text-red-600 accent-red-600"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                First-Timer Applicant (Eligible for EHG & Family Grant)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={within4kmParents}
                onChange={(e) => setWithin4kmParents(e.target.checked)}
                className="rounded text-red-600 accent-red-600"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Living within 4km of Parents (Proximity Housing Grant PHG)
              </span>
            </label>
          </div>
        </div>

        {/* Right Financial Results Engine (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Repayment Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Estimated Monthly Installment</div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                  S${results.monthlyInstallment.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </div>
              </div>

              {/* MSR Badge */}
              <div className="flex items-center gap-2">
                <div className={`p-2.5 rounded-lg border text-xs font-semibold ${
                  results.isMsrCompliant
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {results.isMsrCompliant ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>MSR: {results.msrPercentage}% of income</span>
                  </div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">
                    {results.isMsrCompliant ? 'Within 30% MSR cap' : 'Exceeds 30% HDB MSR limit'}
                  </div>
                </div>
              </div>
            </div>

            {/* Grant Stack Card */}
            <div className="border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <span>Eligible CPF Housing Grants</span>
                <span className="text-base font-mono tabular-nums">
                  S${results.grants.totalGrant.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Enhanced Grant (EHG)</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    S${results.grants.ehg.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Family Grant</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    S${results.grants.familyGrant.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Proximity Grant (PHG)</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    S${results.grants.phg.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Downpayment & Stamp Duty Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Upfront Cash & CPF Capital Requirement
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500">Buyer's Stamp Duty (IRAS)</div>
                  <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    S${results.bsd.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Tiered BSD rate</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500">Min Cash Downpayment</div>
                  <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    S${results.minCashDownpayment.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">{loanType === 'hdb' ? '0% cash for HDB' : '5% cash for Bank'}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500">CPF OA / Cash Downpayment</div>
                  <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    S${results.cpfOrCashDownpayment.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Total downpayment: S${results.downpaymentTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Loan Principal & Term */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Eligible Loan Principal: </span>
                <span className="font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  S${results.loanPrincipal.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Loan Tenure: </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {results.maxTenure} years ({results.interestRate}% p.a.)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
