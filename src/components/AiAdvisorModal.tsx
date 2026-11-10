import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Loader2, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { HdbProperty } from '../types';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProperty: HdbProperty | null;
  compareList: HdbProperty[];
  allProperties: HdbProperty[];
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  activeProperty,
  compareList,
  allProperties,
}) => {
  const [analysisType, setAnalysisType] = useState<'single' | 'compare' | 'custom'>(
    compareList.length >= 2 ? 'compare' : 'single'
  );
  const [userQuery, setUserQuery] = useState<string>('');
  const [preferences, setPreferences] = useState<string>(
    'Family with children planning for Primary 1 (P1) registration and daily MRT commute'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync mode when modal opens
  useEffect(() => {
    if (isOpen) {
      if (compareList.length >= 2) {
        setAnalysisType('compare');
      } else if (activeProperty) {
        setAnalysisType('single');
      } else {
        setAnalysisType('custom');
      }
      setAnalysisResult(null);
      setErrorMsg(null);
    }
  }, [isOpen, activeProperty, compareList]);

  if (!isOpen) return null;

  const runAnalysis = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const payload: any = {
        type: analysisType,
        userQuery,
        preferences,
      };

      if (analysisType === 'single') {
        payload.properties = activeProperty ? [activeProperty] : [allProperties[0]];
      } else if (analysisType === 'compare') {
        payload.properties = compareList.length >= 2 ? compareList : allProperties.slice(0, 2);
      } else {
        payload.properties = compareList.length > 0 ? compareList : allProperties.slice(0, 3);
      }

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate advisory.');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with AI valuation service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                HDB Copilot & Valuation Advisor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Powered by Gemini 3.8 Flash · Singapore Resale, MOE P1 & Bala's Table Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisory Mode Selector */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAnalysisType('single');
                setAnalysisResult(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                analysisType === 'single'
                  ? 'bg-slate-900 text-white dark:bg-red-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Single Unit Valuation
            </button>

            <button
              onClick={() => {
                setAnalysisType('compare');
                setAnalysisResult(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                analysisType === 'compare'
                  ? 'bg-slate-900 text-white dark:bg-red-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Head-to-Head Comparison ({compareList.length} Units)
            </button>

            <button
              onClick={() => {
                setAnalysisType('custom');
                setAnalysisResult(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                analysisType === 'custom'
                  ? 'bg-slate-900 text-white dark:bg-red-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Custom Property Query
            </button>
          </div>

          {/* Context note */}
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
            {analysisType === 'single' && (
              <span>
                Analyzing:{' '}
                <strong>
                  {activeProperty
                    ? `Blk ${activeProperty.block} ${activeProperty.streetName} (${activeProperty.town})`
                    : 'Select a block to inspect'}
                </strong>
              </span>
            )}
            {analysisType === 'compare' && (
              <span>
                Comparing:{' '}
                <strong>
                  {compareList.length >= 2
                    ? compareList.map((c) => `${c.town} Blk ${c.block}`).join(' vs ')
                    : 'Comparing top 2 benchmark blocks (Bishan vs Queenstown)'}
                </strong>
              </span>
            )}
            {analysisType === 'custom' && (
              <span>Ask any strategic question regarding Singapore HDB rules, grants, or towns.</span>
            )}
          </div>
        </div>

        {/* Input prompt & Preferences */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Buyer Profile & Specific Question
            </label>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={
                analysisType === 'compare'
                  ? 'e.g. Which unit offers better Primary 1 balloting security and 10-year capital stability?'
                  : 'e.g. Is S$980k fair value for this floor level, and what is the lease decay risk?'
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Singapore Resale & School Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Property Advisory</span>
                </>
              )}
            </button>

            {analysisResult && (
              <button
                onClick={runAnalysis}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run Analysis</span>
              </button>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Analysis Result Output */}
          {analysisResult && (
            <div className="mt-4 p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Executive Property Valuation & MOE School Verdict</span>
              </div>
              <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 space-y-3 font-normal prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Advisory takes into account IRAS BSD, SLA Bala's Table, and MOE Phase 2C rules.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
