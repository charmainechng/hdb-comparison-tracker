import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  GraduationCap, 
  Train, 
  Clock, 
  Building, 
  Check, 
  Plus, 
  ArrowUpDown, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Layers,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { HdbProperty } from '../types';
import { TOWN_MEDIAN_STATS } from '../data/hdbData';

interface ResaleTrackerProps {
  properties: HdbProperty[];
  compareList: HdbProperty[];
  onToggleCompare: (property: HdbProperty) => void;
  onSelectProperty: (property: HdbProperty) => void;
  onOpenAiValuation: (property: HdbProperty) => void;
}

export const ResaleTracker: React.FC<ResaleTrackerProps> = ({
  properties,
  compareList,
  onToggleCompare,
  onSelectProperty,
  onOpenAiValuation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [selectedFlatType, setSelectedFlatType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1400000);
  const [nearMrtOnly, setNearMrtOnly] = useState<boolean>(false);
  const [nearTopSchoolOnly, setNearTopSchoolOnly] = useState<boolean>(false);
  const [minLease, setMinLease] = useState<number>(50);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Towns list
  const towns = useMemo(() => {
    const list = Array.from(new Set(properties.map((p) => p.town)));
    return list.sort();
  }, [properties]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesAddress =
          item.block.toLowerCase().includes(query) ||
          item.streetName.toLowerCase().includes(query) ||
          item.town.toLowerCase().includes(query);
        const matchesMrt = item.nearestMrt.name.toLowerCase().includes(query);
        const matchesSchool = item.nearbySchools.some((s) => s.name.toLowerCase().includes(query));
        if (!matchesAddress && !matchesMrt && !matchesSchool) return false;
      }

      // Town filter
      if (selectedTown !== 'all' && item.town !== selectedTown) {
        return false;
      }

      // Flat type filter
      if (selectedFlatType !== 'all' && item.flatType !== selectedFlatType) {
        return false;
      }

      // Price filter
      if (item.resalePrice > maxPrice) {
        return false;
      }

      // Lease filter
      if (item.remainingLeaseYears < minLease) {
        return false;
      }

      // Proximity to MRT (<500m)
      if (nearMrtOnly && item.nearestMrt.distanceMeters > 500) {
        return false;
      }

      // Within 1km of popular P1 school
      if (nearTopSchoolOnly) {
        const hasTopSchoolWithin1km = item.nearbySchools.some(
          (s) => s.isPopularP1 && s.distanceMeters <= 1000
        );
        if (!hasTopSchoolWithin1km) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.resalePrice - b.resalePrice;
      if (sortBy === 'priceDesc') return b.resalePrice - a.resalePrice;
      if (sortBy === 'psfAsc') return a.psf - b.psf;
      if (sortBy === 'psfDesc') return b.psf - a.psf;
      if (sortBy === 'leaseDesc') return b.remainingLeaseYears - a.remainingLeaseYears;
      if (sortBy === 'mrtAsc') return a.nearestMrt.distanceMeters - b.nearestMrt.distanceMeters;
      return 0;
    });
  }, [
    properties,
    searchQuery,
    selectedTown,
    selectedFlatType,
    maxPrice,
    minLease,
    nearMrtOnly,
    nearTopSchoolOnly,
    sortBy,
  ]);

  const isCompared = (id: string) => compareList.some((item) => item.id === id);

  return (
    <div className="space-y-6">
      {/* Top Editorial Kicker & Market Context */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
              Singapore Public Housing Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              HDB Resale Tracker & Micro-Location Explorer
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Track actual registered transacted prices, remaining lease decay risk via Bala's Table, 
              and exact 1km primary school registration boundaries for Phase 2C balloting priority.
            </p>
          </div>

          {/* Singapore Market Overview Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:w-auto w-full pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6 shrink-0">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">National Median 4-Room</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                S$628,000
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">+1.3% QoQ</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Prime Central Median</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                S$995,000
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">Bishan / Queenstown</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-500 dark:text-slate-400">Tracked Units</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {filteredProperties.length} of {properties.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Updated 2026 Q1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Station */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        {/* Search Bar + Primary Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by block, street (e.g. Dawson, Bishan St 24, Clementi), or school..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="psfAsc">PSF: Low to High</option>
                <option value="psfDesc">PSF: High to Low</option>
                <option value="leaseDesc">Remaining Lease: Longest</option>
                <option value="mrtAsc">Nearest to MRT</option>
              </select>
            </div>

            {/* Layout Switcher */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pillows and Sliders */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Town Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              HDB Town / Estate
            </label>
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Singapore Towns</option>
              {towns.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </select>
          </div>

          {/* Flat Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Flat Type
            </label>
            <select
              value={selectedFlatType}
              onChange={(e) => setSelectedFlatType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Flat Types</option>
              <option value="3 ROOM">3-Room (~70 sqm)</option>
              <option value="4 ROOM">4-Room (~90-95 sqm)</option>
              <option value="5 ROOM">5-Room (~110-115 sqm)</option>
              <option value="EXECUTIVE">Executive / Maisonette</option>
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              <span>Max Budget</span>
              <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                S${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={1400000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-red-600"
            />
          </div>

          {/* Min Remaining Lease Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              <span>Min Remaining Lease</span>
              <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                {minLease} years
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              step={5}
              value={minLease}
              onChange={(e) => setMinLease(parseInt(e.target.value, 10))}
              className="w-full accent-red-600"
            />
          </div>
        </div>

        {/* Key Proximity Radar Quick Toggles (Functional Filter Buttons) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Proximity Filters:</span>
          
          <button
            onClick={() => setNearMrtOnly(!nearMrtOnly)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 border ${
              nearMrtOnly
                ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>&lt; 500m Walk to MRT</span>
            {nearMrtOnly && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
          </button>

          <button
            onClick={() => setNearTopSchoolOnly(!nearTopSchoolOnly)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 border ${
              nearTopSchoolOnly
                ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>&lt; 1km to Top MOE Primary (Phase 2C)</span>
            {nearTopSchoolOnly && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
          </button>

          {(nearMrtOnly || nearTopSchoolOnly || selectedTown !== 'all' || selectedFlatType !== 'all' || maxPrice < 1400000 || minLease > 50 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTown('all');
                setSelectedFlatType('all');
                setMaxPrice(1400000);
                setMinLease(50);
                setNearMrtOnly(false);
                setNearTopSchoolOnly(false);
                setSearchQuery('');
              }}
              className="text-xs text-red-600 hover:underline ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white font-mono">{filteredProperties.length}</span> verified HDB listings matching criteria
        </div>
        {compareList.length > 0 && (
          <div className="flex items-center gap-2">
            <span>{compareList.length} of 3 units selected for comparison</span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Building className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No HDB blocks match your active filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your budget, expanding the town selection, or removing the 1km primary school proximity constraint.
          </p>
          <button
            onClick={() => {
              setSelectedTown('all');
              setSelectedFlatType('all');
              setMaxPrice(1400000);
              setMinLease(50);
              setNearMrtOnly(false);
              setNearTopSchoolOnly(false);
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-red-600 rounded-lg hover:bg-slate-800"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'cards' && filteredProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((prop) => {
            const topSchools1km = prop.nearbySchools.filter(
              (s) => s.category === 'Primary' && s.distanceMeters <= 1000
            );
            const inCompare = isCompared(prop.id);

            return (
              <div
                key={prop.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner with Fallback */}
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                    <img
                      src={prop.imageUrl}
                      alt={`HDB Blk ${prop.block} ${prop.streetName}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Quiet Editorial Tag */}
                    {prop.featuredTag && (
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                        {prop.featuredTag}
                      </div>
                    )}

                    {/* Compare Button on Image */}
                    <button
                      onClick={() => onToggleCompare(prop)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur transition-all flex items-center gap-1 ${
                        inCompare
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white/90 text-slate-800 hover:bg-white dark:bg-slate-900/90 dark:text-slate-100'
                      }`}
                    >
                      {inCompare ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Comparing</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Compare</span>
                        </>
                      )}
                    </button>

                    {/* Price Badge Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white drop-shadow-sm">
                      <div>
                        <div className="text-xl font-bold font-mono tabular-nums leading-none">
                          S${prop.resalePrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-200 font-mono mt-0.5">
                          S${prop.psf} psf · {prop.floorAreaSqm} sqm ({prop.floorAreaSqft} sqft)
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-200">
                        Floor {prop.storeyRange}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    {/* Header: Address & Zero-Pill Metadata */}
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        Blk {prop.block} {prop.streetName}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{prop.town}</span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.flatType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.flatModel}</span>
                      </div>
                    </div>

                    {/* Lease & Bala's Table Decay Indicator */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Remaining Lease:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                          {prop.remainingLeaseYears} yrs {prop.remainingLeaseMonths} mos
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>Bala's Table Value Retention:</span>
                        <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                          {prop.balasTableRetentionPct}%
                        </span>
                      </div>
                    </div>

                    {/* Micro-Location: MRT Proximity */}
                    <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Train className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          {prop.nearestMrt.name} ({prop.nearestMrt.code})
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {prop.nearestMrt.distanceMeters}m · ~{prop.nearestMrt.walkMinutes} mins walk
                          {prop.nearestMrt.isShelteredWalkway && ' (Sheltered)'}
                        </div>
                      </div>
                    </div>

                    {/* Micro-Location: Schools Within 1km */}
                    <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">
                          {topSchools1km.length > 0 ? (
                            <span>{topSchools1km.length} Primary School{topSchools1km.length > 1 ? 's' : ''} &lt; 1km</span>
                          ) : (
                            <span>No Primary Schools &lt; 1km</span>
                          )}
                        </div>
                        {topSchools1km.length > 0 && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {topSchools1km.map((s) => s.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="w-full py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-center"
                  >
                    View Details & Trends
                  </button>
                  <button
                    onClick={() => onOpenAiValuation(prop)}
                    className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Valuation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredProperties.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Address / Block</th>
                  <th className="py-3 px-4">Town</th>
                  <th className="py-3 px-4">Flat Type</th>
                  <th className="py-3 px-4 text-right">Price (SGD)</th>
                  <th className="py-3 px-4 text-right">PSF</th>
                  <th className="py-3 px-4">Remaining Lease</th>
                  <th className="py-3 px-4">Nearest MRT</th>
                  <th className="py-3 px-4">Primary Schools (&lt;1km)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProperties.map((prop) => {
                  const topSchools = prop.nearbySchools.filter(
                    (s) => s.category === 'Primary' && s.distanceMeters <= 1000
                  );
                  const inCompare = isCompared(prop.id);

                  return (
                    <tr
                      key={prop.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="hover:text-red-600 text-left"
                        >
                          Blk {prop.block} {prop.streetName}
                        </button>
                        <div className="text-[11px] text-slate-400 font-normal">
                          Floor {prop.storeyRange} · {prop.floorAreaSqm} sqm
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {prop.town}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {prop.flatType}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        S${prop.resalePrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        S${prop.psf}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {prop.remainingLeaseYears} yrs ({prop.balasTableRetentionPct}%)
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <div className="font-medium">{prop.nearestMrt.name}</div>
                        <div className="text-[11px] text-slate-400">{prop.nearestMrt.distanceMeters}m · {prop.nearestMrt.walkMinutes}m walk</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {topSchools.length > 0 ? (
                          <div className="line-clamp-1" title={topSchools.map(s => s.name).join(', ')}>
                            {topSchools.map(s => s.name).join(', ')}
                          </div>
                        ) : (
                          <span className="text-slate-400">None &lt;1km</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => onToggleCompare(prop)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            inCompare
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {inCompare ? 'Comparing' : '+ Compare'}
                        </button>
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
