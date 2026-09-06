import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, BLOCKS_RANCHI, PANCHAYATS_KANKE, VILLAGES_KANKE } from '../../data/mockData';
import { MapPin, X, Check, ArrowRight } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, location, setLocation, language } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState(location.district);
  const [selectedBlock, setSelectedBlock] = useState(location.block);
  const [selectedPanchayat, setSelectedPanchayat] = useState(location.panchayat);
  const [selectedVillage, setSelectedVillage] = useState(location.village);

  if (!isLocationModalOpen) return null;

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
                {language === 'hi' ? 'राज्य → ज़िला → प्रखंड → पंचायत → गाँव' : 'Jharkhand Geographic Hierarchy'}
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
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-start space-x-3">
            <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wider mt-0.5">SIH Demo Focus</span>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Default seeded dataset covers <strong>Ranchi District → Kanke Block → Boreya / Sukurhutu Panchayats</strong> for the Smart India Hackathon showcase.
            </p>
          </div>

          {/* 1. District */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              1. {language === 'hi' ? 'ज़िला (District)' : 'District'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                if (e.target.value === 'Ranchi') {
                  setSelectedBlock('Kanke');
                } else {
                  setSelectedBlock('Headquarters Block');
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.nameHi})
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
              {BLOCKS_RANCHI.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} Block ({b.nameHi}) - {b.totalPanchayats} Panchayats
                </option>
              ))}
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
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow-sm flex items-center space-x-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'hi' ? 'लागू करें' : 'Set Location'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
