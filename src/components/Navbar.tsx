import React from 'react';
import { Building2, Layers, MapPin, Calculator, TrendingUp, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'tracker' | 'compare' | 'radar' | 'affordability' | 'trends';
  setActiveTab: (tab: 'tracker' | 'compare' | 'radar' | 'affordability' | 'trends') => void;
  compareCount: number;
  onOpenAiAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  compareCount,
  onOpenAiAdvisor,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element) */}
        <div 
          onClick={() => setActiveTab('tracker')} 
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            SG
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            EstatePulse SG
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'tracker'
                ? 'text-red-600 dark:text-red-400 font-semibold border-b-2 border-red-600 dark:border-red-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Resale Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'compare'
                ? 'text-red-600 dark:text-red-400 font-semibold border-b-2 border-red-600 dark:border-red-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Compare Units</span>
            {compareCount > 0 && (
              <span className="ml-1 text-xs font-mono font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.2 rounded">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'radar'
                ? 'text-red-600 dark:text-red-400 font-semibold border-b-2 border-red-600 dark:border-red-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Amenity & School Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('affordability')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'affordability'
                ? 'text-red-600 dark:text-red-400 font-semibold border-b-2 border-red-600 dark:border-red-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>CPF & Affordability</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'trends'
                ? 'text-red-600 dark:text-red-400 font-semibold border-b-2 border-red-600 dark:border-red-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Town Trends & Bala's Table</span>
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAiAdvisor}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask HDB AI Advisor</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden flex overflow-x-auto border-t border-slate-200 dark:border-slate-800 px-4 py-2 gap-4 text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`whitespace-nowrap py-1 ${activeTab === 'tracker' ? 'text-red-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Tracker
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`whitespace-nowrap py-1 ${activeTab === 'compare' ? 'text-red-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Compare ({compareCount})
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`whitespace-nowrap py-1 ${activeTab === 'radar' ? 'text-red-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          School Radar
        </button>
        <button
          onClick={() => setActiveTab('affordability')}
          className={`whitespace-nowrap py-1 ${activeTab === 'affordability' ? 'text-red-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          CPF Calculator
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`whitespace-nowrap py-1 ${activeTab === 'trends' ? 'text-red-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Bala's Decay
        </button>
      </div>
    </header>
  );
};
