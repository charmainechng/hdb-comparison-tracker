import React, { useState } from 'react';
import { 
  GraduationCap, 
  Train, 
  ShoppingBag, 
  Utensils, 
  Trees, 
  MapPin, 
  Layers, 
  Navigation,
  Info,
  CheckCircle2
} from 'lucide-react';
import { HdbProperty } from '../types';

interface AmenityRadarMapProps {
  properties: HdbProperty[];
  selectedProperty: HdbProperty;
  onSelectProperty: (property: HdbProperty) => void;
  onOpenDetails: (property: HdbProperty) => void;
}

export const AmenityRadarMap: React.FC<AmenityRadarMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenDetails,
}) => {
  const [activeLayers, setActiveLayers] = useState<{
    mrt: boolean;
    schools: boolean;
    hawkers: boolean;
    malls: boolean;
    parks: boolean;
  }>({
    mrt: true,
    schools: true,
    hawkers: true,
    malls: true,
    parks: true,
  });

  const [activeRadiusRing, setActiveRadiusRing] = useState<'all' | '500m' | '1km' | '2km'>('all');

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Primary schools filtered by distance for the selected block
  const schoolsWithin1km = selectedProperty.nearbySchools.filter(
    (s) => s.category === 'Primary' && s.distanceMeters <= 1000
  );
  const schools1to2km = selectedProperty.nearbySchools.filter(
    (s) => s.category === 'Primary' && s.distanceMeters > 1000 && s.distanceMeters <= 2000
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
              Spatial Proximity & Catchment Analyzer
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Amenity & School 1km Radar Visualizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Under Singapore MOE rules, living within 1km of a primary school gives Singapore Citizens 
              the highest priority in Phase 2C balloting. Inspect exact walking times and transport links.
            </p>
          </div>

          {/* Quick Property Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Focused Block:</span>
            <select
              value={selectedProperty.id}
              onChange={(e) => {
                const found = properties.find((p) => p.id === e.target.value);
                if (found) onSelectProperty(found);
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.town}: Blk {p.block} {p.streetName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Canvas + Radar Breakdown Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Radar Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            {/* Radius Filters */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium mr-1">Rings:</span>
              <button
                onClick={() => setActiveRadiusRing('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeRadiusRing === 'all'
                    ? 'bg-slate-900 text-white dark:bg-red-600'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                All Rings
              </button>
              <button
                onClick={() => setActiveRadiusRing('500m')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeRadiusRing === '500m'
                    ? 'bg-slate-900 text-white dark:bg-red-600'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                500m (MRT)
              </button>
              <button
                onClick={() => setActiveRadiusRing('1km')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeRadiusRing === '1km'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                1km (MOE P1)
              </button>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => toggleLayer('mrt')}
                className={`px-2 py-1 rounded border text-[11px] font-medium flex items-center gap-1 ${
                  activeLayers.mrt
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'opacity-40 border-slate-200'
                }`}
              >
                <Train className="w-3 h-3" />
                <span>MRT</span>
              </button>

              <button
                onClick={() => toggleLayer('schools')}
                className={`px-2 py-1 rounded border text-[11px] font-medium flex items-center gap-1 ${
                  activeLayers.schools
                    ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'opacity-40 border-slate-200'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Schools</span>
              </button>

              <button
                onClick={() => toggleLayer('hawkers')}
                className={`px-2 py-1 rounded border text-[11px] font-medium flex items-center gap-1 ${
                  activeLayers.hawkers
                    ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'opacity-40 border-slate-200'
                }`}
              >
                <Utensils className="w-3 h-3" />
                <span>Hawkers</span>
              </button>

              <button
                onClick={() => toggleLayer('malls')}
                className={`px-2 py-1 rounded border text-[11px] font-medium flex items-center gap-1 ${
                  activeLayers.malls
                    ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300'
                    : 'opacity-40 border-slate-200'
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Malls</span>
              </button>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[460px] bg-slate-950 rounded-xl my-4 overflow-hidden border border-slate-800 select-none">
            {/* Grid Pattern Background */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Singapore Coastline & Town outlines abstract graphic */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
              {/* Abstract Singapore island silhouette */}
              <path
                d="M 120 300 Q 200 150 450 140 Q 750 120 880 260 Q 820 420 550 480 Q 250 460 120 300 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="2"
              />
            </svg>

            {/* Interactive SVG Radar centered around Selected Block */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Concentric rings centered at (selectedProperty.coordinates.mapX, mapY) */}
              {/* 500m Transit Ring */}
              {(activeRadiusRing === 'all' || activeRadiusRing === '500m') && (
                <circle
                  cx={selectedProperty.coordinates.mapX}
                  cy={selectedProperty.coordinates.mapY}
                  r="7"
                  fill="rgba(16, 185, 129, 0.08)"
                  stroke="#10B981"
                  strokeWidth="0.4"
                  strokeDasharray="1 1"
                />
              )}

              {/* 1km MOE Primary 1 Priority Ring */}
              {(activeRadiusRing === 'all' || activeRadiusRing === '1km') && (
                <circle
                  cx={selectedProperty.coordinates.mapX}
                  cy={selectedProperty.coordinates.mapY}
                  r="14"
                  fill="rgba(59, 130, 246, 0.08)"
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                />
              )}

              {/* 2km Secondary Priority Ring */}
              {(activeRadiusRing === 'all' || activeRadiusRing === '2km') && (
                <circle
                  cx={selectedProperty.coordinates.mapX}
                  cy={selectedProperty.coordinates.mapY}
                  r="26"
                  fill="transparent"
                  stroke="#64748B"
                  strokeWidth="0.3"
                  strokeDasharray="1.5 1.5"
                />
              )}
            </svg>

            {/* Other HDB Properties Pins */}
            {properties.map((p) => {
              const isCurrent = p.id === selectedProperty.id;

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProperty(p)}
                  style={{
                    left: `${p.coordinates.mapX}%`,
                    top: `${p.coordinates.mapY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute cursor-pointer transition-all ${
                    isCurrent ? 'z-30 scale-125' : 'z-20 hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  title={`Blk ${p.block} ${p.streetName} (${p.town})`}
                >
                  {isCurrent ? (
                    <div className="relative flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
                        HDB
                      </div>
                      <div className="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap border border-slate-700">
                        Blk {p.block} {p.streetName.split(' ')[0]}
                      </div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-400 flex items-center justify-center text-[10px] text-white">
                      ●
                    </div>
                  )}
                </div>
              );
            })}

            {/* Selected Property's MRT Station Pin */}
            {activeLayers.mrt && (
              <div
                style={{
                  left: `${selectedProperty.coordinates.mapX + 4}%`,
                  top: `${selectedProperty.coordinates.mapY - 3}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20 flex items-center gap-1 bg-emerald-950/90 border border-emerald-600 text-emerald-200 px-2 py-0.5 rounded shadow text-[10px] font-bold"
              >
                <Train className="w-3 h-3 text-emerald-400" />
                <span>{selectedProperty.nearestMrt.name}</span>
              </div>
            )}

            {/* Selected Property's 1km Schools Pins */}
            {activeLayers.schools &&
              schoolsWithin1km.map((sch, i) => (
                <div
                  key={sch.id}
                  style={{
                    left: `${selectedProperty.coordinates.mapX + (i % 2 === 0 ? -6 : 7)}%`,
                    top: `${selectedProperty.coordinates.mapY + (i % 2 === 0 ? 5 : -7)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-20 flex items-center gap-1 bg-blue-950/90 border border-blue-500 text-blue-200 px-2 py-0.5 rounded shadow text-[10px] font-medium"
                >
                  <GraduationCap className="w-3 h-3 text-blue-400" />
                  <span>{sch.name.split(' ')[0]} (1km)</span>
                </div>
              ))}

            {/* Selected Property's Hawker Pin */}
            {activeLayers.hawkers && selectedProperty.amenities.find(a => a.type === 'hawker') && (
              <div
                style={{
                  left: `${selectedProperty.coordinates.mapX - 5}%`,
                  top: `${selectedProperty.coordinates.mapY - 4}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20 flex items-center gap-1 bg-amber-950/90 border border-amber-600 text-amber-200 px-2 py-0.5 rounded shadow text-[10px]"
              >
                <Utensils className="w-3 h-3 text-amber-400" />
                <span>Hawker ({selectedProperty.amenities.find(a => a.type === 'hawker')?.walkMinutes}m)</span>
              </div>
            )}

            {/* Map Legend (quiet zero-pill layout in corner) */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                <span>Selected HDB Block</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border border-blue-400 bg-blue-950 inline-block" />
                <span>1km MOE P1 Radius (Phase 2C)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border border-dashed border-emerald-400 bg-emerald-950 inline-block" />
                <span>500m Transit Walking Zone</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Click any block marker on the map to re-center radar radius circles.</span>
          </div>
        </div>

        {/* Right Column: In-Depth Radar Breakdown for Selected Block (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                {selectedProperty.town} Estate
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Blk {selectedProperty.block} {selectedProperty.streetName}
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                {selectedProperty.flatType} · S${selectedProperty.resalePrice.toLocaleString()} (S${selectedProperty.psf} psf)
              </div>
            </div>

            {/* Primary Schools Summary Card */}
            <div className="border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Primary Schools Within 1km
                </span>
                <span className="font-mono">{schoolsWithin1km.length} Eligible</span>
              </div>

              {schoolsWithin1km.length === 0 ? (
                <div className="text-xs text-slate-500 py-1">
                  No primary schools within 1km. Eligible schools start at 1.2km (Phase 2C secondary priority).
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {schoolsWithin1km.map((s) => (
                    <div key={s.id} className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40 text-xs">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                          {s.phase2cBallotingTier.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {s.distanceMeters}m ({s.walkMinutes} min walk) · {s.coEd}
                        {s.sapStatus && ' · SAP'}
                        {s.giftedEducation && ' · GEP'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MRT Connectivity Card */}
            <div className="border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-emerald-600" />
                  Transit Proximity
                </span>
                <span className="font-mono">{selectedProperty.nearestMrt.walkMinutes} Mins Walk</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {selectedProperty.nearestMrt.name} ({selectedProperty.nearestMrt.code})
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {selectedProperty.nearestMrt.distanceMeters} meters away · {selectedProperty.nearestMrt.line}
              </div>
              {selectedProperty.nearestMrt.isShelteredWalkway && (
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ 100% Weather-Sheltered Walkway
                </div>
              )}
            </div>

            {/* Daily Amenities Checklist */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Neighbourhood Amenities Checklist
              </div>
              <div className="space-y-1.5">
                {selectedProperty.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-2"
                  >
                    {amenity.type === 'hawker' ? (
                      <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    ) : amenity.type === 'mall' || amenity.type === 'supermarket' ? (
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    ) : (
                      <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {amenity.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {amenity.distanceMeters}m · ~{amenity.walkMinutes} mins walk · {amenity.highlight}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenDetails(selectedProperty)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg transition-colors text-center"
            >
              Inspect Full Unit Details & Price History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
