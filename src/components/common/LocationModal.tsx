import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, BLOCKS_RANCHI, PANCHAYATS_KANKE, VILLAGES_KANKE } from '../../data/mockData';
import { JHARKHAND_STATE_MAP, JHARKHAND_DISTRICTS_GEO } from '../../data/jharkhandMapData';
import { MapPin, X, Check, ArrowRight, Map as MapIcon, Maximize2, ExternalLink } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, location, setLocation, language } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState(location.district || 'Ranchi');
  const [selectedBlock, setSelectedBlock] = useState(location.block || 'Kanke');
  const [selectedPanchayat, setSelectedPanchayat] = useState(location.panchayat || 'Boreya');
  const [selectedVillage, setSelectedVillage] = useState(location.village || 'Boreya Basti (Village X)');
  const [showStateMapModal, setShowStateMapModal] = useState(false);

  if (!isLocationModalOpen) return null;

  const currentGeo = JHARKHAND_DISTRICTS_GEO.find(
    (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
  ) || JHARKHAND_DISTRICTS_GEO.find((d) => d.name === 'Ranchi')!;

  const handleApply = () => {
    setLocation({
      district: selectedDistrict,
      block: selectedBlock,
      panchayat: selectedPanchayat,
      village: selectedVillage,
    });
    setIsLocationModalOpen(false);
  };

  const handleResetToDemo = () => {
    setSelectedDistrict('Ranchi');
    setSelectedBlock('Kanke');
    setSelectedPanchayat('Boreya');
    setSelectedVillage('Boreya Basti (Village X)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <MapPin className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'hi' ? 'अपना कार्यक्षेत्र चुनें' : 'Select Your Civic Area'}
              </h2>
              <p className="text-xs text-emerald-200">
                {language === 'hi' ? '24 ज़िले • आधिकारिक मानचित्र आधारित' : 'Jharkhand 24-District Hierarchy & Maps'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Map Preview Card for Selected District */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs">
            <div className="relative h-28 bg-slate-900 overflow-hidden group">
              <img
                src={currentGeo.mapImage}
                alt={`${currentGeo.name} District Map`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = JHARKHAND_STATE_MAP.imageUrl;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
                <div>
                  <span className="font-bold text-sm">{currentGeo.name} District</span>
                  <span className="text-[10px] text-emerald-300 block">{currentGeo.division} Division • HQ: {currentGeo.headquarters}</span>
                </div>
                <button
                  onClick={() => setShowStateMapModal(true)}
                  className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow"
                >
                  <Maximize2 className="w-3 h-3" />
                  State Map
                </button>
              </div>
            </div>
            <div className="p-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Population: {currentGeo.population}</span>
              <span>{currentGeo.blocksCount} Blocks • MapsofIndia Source</span>
            </div>
          </div>

          {/* 1. District (All 24) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              1. {language === 'hi' ? 'ज़िला (District - 24 Districts)' : 'District (24 Districts)'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                const dName = e.target.value;
                setSelectedDistrict(dName);
                if (dName === 'Ranchi') {
                  setSelectedBlock('Kanke');
                } else {
                  const g = JHARKHAND_DISTRICTS_GEO.find(x => x.name === dName);
                  setSelectedBlock(g?.keyBlocks[0] || 'Sadar Block');
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.nameHi}) - HQ: {d.headquarters}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Block / Tehsil */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              2. {language === 'hi' ? 'प्रखंड / तहसील (Block / Tehsil)' : 'Block / Tehsil'}
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {selectedDistrict === 'Ranchi' ? (
                BLOCKS_RANCHI.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} Block ({b.nameHi}) - {b.totalPanchayats} Panchayats
                  </option>
                ))
              ) : (
                currentGeo.keyBlocks.map((b) => (
                  <option key={b} value={b}>
                    {b} Block
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 3. Panchayat / ULB */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              3. {language === 'hi' ? 'ग्राम पंचायत / निकाय (Panchayat / ULB)' : 'Panchayat / ULB'}
            </label>
            <select
              value={selectedPanchayat}
              onChange={(e) => setSelectedPanchayat(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {PANCHAYATS_KANKE.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.type === 'ULB' ? 'शहरी वार्ड' : 'ग्राम पंचायत'})
                </option>
              ))}
            </select>
          </div>

          {/* 4. Village / Ward */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              4. {language === 'hi' ? 'गाँव / टोला / वार्ड (Village / Ward)' : 'Village / Ward / Habitation'}
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {VILLAGES_KANKE.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} (Pin: {v.pincode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
          >
            {language === 'hi' ? 'डिफ़ॉल्ट SIH क्षेत्र चुनें' : 'Reset to SIH Demo Area'}
          </button>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center space-x-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'hi' ? 'लागू करें' : 'Apply Area'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* State Map Lightbox */}
      {showStateMapModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden text-white flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Jharkhand District Map (MapsofIndia Reference)</h3>
              </div>
              <button
                onClick={() => setShowStateMapModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex justify-center bg-slate-950 max-h-[600px]">
              <img
                src={JHARKHAND_STATE_MAP.imageUrl}
                alt="Jharkhand State District Map"
                className="max-h-[550px] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>Source: MapsofIndia.com</span>
              <button
                onClick={() => setShowStateMapModal(false)}
                className="px-3 py-1 bg-slate-800 text-white rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
