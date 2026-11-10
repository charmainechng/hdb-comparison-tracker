import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ResaleTracker } from './components/ResaleTracker';
import { ComparisonView } from './components/ComparisonView';
import { AmenityRadarMap } from './components/AmenityRadarMap';
import { AffordabilityView } from './components/AffordabilityView';
import { PriceTrendsView } from './components/PriceTrendsView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { LiveDataModal } from './components/LiveDataModal';
import { HDB_PROPERTIES } from './data/hdbData';
import { HdbProperty } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'compare' | 'radar' | 'affordability' | 'trends'>('tracker');
  const [compareList, setCompareList] = useState<HdbProperty[]>([
    HDB_PROPERTIES[0], // Bishan 273A
    HDB_PROPERTIES[1], // SkyVille @ Dawson
  ]);
  const [activeProperty, setActiveProperty] = useState<HdbProperty | null>(null);
  const [selectedRadarProperty, setSelectedRadarProperty] = useState<HdbProperty>(HDB_PROPERTIES[0]);
  const [aiAdvisorOpen, setAiAdvisorOpen] = useState<boolean>(false);
  const [liveDataOpen, setLiveDataOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleCompare = (property: HdbProperty) => {
    const exists = compareList.some((item) => item.id === property.id);
    if (exists) {
      setCompareList(compareList.filter((item) => item.id !== property.id));
      showToast(`Removed Blk ${property.block} from comparison.`);
    } else {
      if (compareList.length >= 3) {
        showToast('Maximum 3 HDB properties can be compared at once.');
        return;
      }
      setCompareList([...compareList, property]);
      showToast(`Added Blk ${property.block} to comparison matrix.`);
    }
  };

  const handleOpenAiValuation = (property: HdbProperty) => {
    setActiveProperty(property);
    setAiAdvisorOpen(true);
  };

  const handleOpenAffordability = (property: HdbProperty) => {
    setActiveProperty(property);
    setActiveTab('affordability');
  };

  const handleSelectPropertyForRadar = (property: HdbProperty) => {
    setSelectedRadarProperty(property);
    setActiveTab('radar');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Bar adheres strictly to 3-zone Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={compareList.length}
        onOpenAiAdvisor={() => setAiAdvisorOpen(true)}
        onOpenLiveData={() => setLiveDataOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'tracker' && (
          <ResaleTracker
            properties={HDB_PROPERTIES}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onSelectProperty={(prop) => setActiveProperty(prop)}
            onOpenAiValuation={handleOpenAiValuation}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            compareList={compareList}
            allProperties={HDB_PROPERTIES}
            onRemoveFromCompare={(prop) => handleToggleCompare(prop)}
            onAddToCompare={(prop) => handleToggleCompare(prop)}
            onClearCompare={() => setCompareList([])}
            onSelectProperty={(prop) => setActiveProperty(prop)}
            onRunAiComparison={() => setAiAdvisorOpen(true)}
          />
        )}

        {activeTab === 'radar' && (
          <AmenityRadarMap
            properties={HDB_PROPERTIES}
            selectedProperty={selectedRadarProperty}
            onSelectProperty={(prop) => setSelectedRadarProperty(prop)}
            onOpenDetails={(prop) => setActiveProperty(prop)}
          />
        )}

        {activeTab === 'affordability' && (
          <AffordabilityView
            selectedProperty={activeProperty}
            allProperties={HDB_PROPERTIES}
          />
        )}

        {activeTab === 'trends' && (
          <PriceTrendsView
            properties={HDB_PROPERTIES}
            onSelectProperty={(prop) => setActiveProperty(prop)}
          />
        )}
      </main>

      {/* Property Details Modal / Drawer */}
      <PropertyDetailModal
        property={activeProperty}
        onClose={() => setActiveProperty(null)}
        isCompared={activeProperty ? compareList.some((p) => p.id === activeProperty.id) : false}
        onToggleCompare={handleToggleCompare}
        onOpenAiValuation={handleOpenAiValuation}
        onOpenAffordability={handleOpenAffordability}
      />

      {/* AI Property Advisory Modal */}
      <AiAdvisorModal
        isOpen={aiAdvisorOpen}
        onClose={() => setAiAdvisorOpen(false)}
        activeProperty={activeProperty || HDB_PROPERTIES[0]}
        compareList={compareList}
        allProperties={HDB_PROPERTIES}
      />

      {/* Live Data Connector Modal */}
      <LiveDataModal
        isOpen={liveDataOpen}
        onClose={() => setLiveDataOpen(false)}
      />

      {/* Quiet Editorial Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">EstatePulse SG</span>
            <span>·</span>
            <span>Singapore HDB Resale & Amenity Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Data: Housing & Development Board · SLA Bala's Table · MOE P1 Zones</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
