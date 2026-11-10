import React, { useState, useEffect } from 'react';
import { 
  X, 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';

interface LiveDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveDataModal: React.FC<LiveDataModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hdb' | 'onemap' | 'health'>('hdb');
  const [searchTerm, setSearchTerm] = useState<string>('Bishan');
  const [onemapQuery, setOnemapQuery] = useState<string>('raffles place');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hdbRecords, setHdbRecords] = useState<any[]>([]);
  const [onemapResults, setOnemapResults] = useState<any[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [headerInfo, setHeaderInfo] = useState<any>(null);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
      setHeaderInfo(data.headers);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchHdbData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const url = `/api/hdbresale?type=resale&limit=25&q=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch Data.gov.sg records');
      }
      setHdbRecords(data.records || []);
      setHeaderInfo(data.headersSent);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error fetching HDB live data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOneMapData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const url = `/api/hdbresale?type=amenities&searchVal=${encodeURIComponent(onemapQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch OneMap amenities');
      }
      setOnemapResults(data.results || []);
      setHeaderInfo(data.headersSent);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error fetching OneMap amenities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
      fetchHdbData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Live Data Connector (Serverless Endpoints)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  AccountKey Header Active
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct live API connection to Data.gov.sg HDB datastore & OneMap Singapore API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="px-5 pt-3 pb-0 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('hdb');
              if (hdbRecords.length === 0) fetchHdbData();
            }}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'hdb'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>HDB Resale (Data.gov.sg)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('onemap');
              if (onemapResults.length === 0) fetchOneMapData();
            }}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'onemap'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Amenities & Geocoding (OneMap)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('health');
              fetchHealth();
            }}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'health'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Endpoint Health & Headers</span>
          </button>
        </div>

        {/* Tab 1: Live HDB Resale Data */}
        {activeTab === 'hdb' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold">Target Resource: </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 break-all">
                  d_8b84c4ee58e3cfc0ece0d773c8ca6abc
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search town/street..."
                    className="pl-3 pr-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={fetchHdbData}
                  disabled={isLoading}
                  className="px-3 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Fetch Live</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {/* Records Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2 px-3">Month</th>
                    <th className="py-2 px-3">Town</th>
                    <th className="py-2 px-3">Block / Street</th>
                    <th className="py-2 px-3">Flat Type</th>
                    <th className="py-2 px-3">Storey Range</th>
                    <th className="py-2 px-3 text-right">Floor Area</th>
                    <th className="py-2 px-3 text-right">Price (SGD)</th>
                    <th className="py-2 px-3 text-right">PSF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {hdbRecords.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">{r.month}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">{r.town}</td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                        Blk {r.block} {r.streetName}
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{r.flatType}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{r.storeyRange}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {r.floorAreaSqm} sqm
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        S${r.resalePrice?.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500 tabular-nums">
                        S${r.psf}
                      </td>
                    </tr>
                  ))}
                  {hdbRecords.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No records fetched. Click "Fetch Live" to pull real transactions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: OneMap Amenities */}
        {activeTab === 'onemap' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold">OneMap API: </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  /api/common/elastic/search
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={onemapQuery}
                  onChange={(e) => setOnemapQuery(e.target.value)}
                  placeholder="e.g. raffles place, bishan mrt..."
                  className="pl-3 pr-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <button
                  onClick={fetchOneMapData}
                  disabled={isLoading}
                  className="px-3 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Search className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Search Amenity</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {onemapResults.map((item, idx) => (
                  <div key={idx} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.SEARCHVAL}</div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5">{item.ADDRESS}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Postal: {item.POSTAL || 'N/A'} · Building: {item.BUILDING || 'N/A'}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px] text-slate-500 shrink-0">
                      <div>Lat: {parseFloat(item.LATITUDE || '0').toFixed(4)}</div>
                      <div>Lng: {parseFloat(item.LONGITUDE || '0').toFixed(4)}</div>
                    </div>
                  </div>
                ))}
                {onemapResults.length === 0 && !isLoading && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No amenities found for query "{onemapQuery}".
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Endpoint Health & Headers */}
        {activeTab === 'health' && (
          <div className="p-5 space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Serverless API Structure & Routing Specifications
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                The application exposes serverless endpoints under the root <code>/api</code> folder:
              </p>

              <div className="space-y-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-emerald-600 font-bold">GET /api/health</div>
                  <div className="text-slate-500 mt-0.5">Health check handler in /api/health.ts</div>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-blue-600 font-bold">GET/POST /api/hdbresale?type=resale&limit=50&q=Bishan</div>
                  <div className="text-slate-500 mt-0.5">
                    Live proxy to Data.gov.sg (resource d_8b84c4ee58e3cfc0ece0d773c8ca6abc) with AccountKey header
                  </div>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-purple-600 font-bold">GET/POST /api/hdbresale?type=amenities&searchVal=raffles%20place</div>
                  <div className="text-slate-500 mt-0.5">
                    Live proxy to OneMap elastic search with AccountKey header
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300">
                <span className="font-bold">Required Header: </span>
                <span><code>AccountKey</code> is dynamically sent with every outbound request. To set your personal key, assign <code>ACCOUNT_KEY</code> in environment variables or pass <code>AccountKey</code> in client request headers without hardcoding.</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Serverless files located at /api/health.ts and /api/hdbresale.ts</span>
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
