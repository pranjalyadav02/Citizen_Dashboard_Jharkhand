import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Award,
  MapPin,
  Phone,
  FileCheck,
  Download,
  Globe,
  Sliders,
  Sparkles,
  Layers,
} from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const { citizen, location, setIsLocationModalOpen, setIsShowcaseTourOpen, language, setLanguage } = useApp();

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(citizen, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `JanaSamadhan_Citizen_${citizen.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-950 text-amber-300 text-2xl font-black flex items-center justify-center shadow-md">
              {citizen.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">{citizen.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Aadhaar Masked Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Citizen ID: <strong className="font-mono">{citizen.id}</strong> • Phone: {citizen.phoneMasked}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Civic Log</span>
          </button>
        </div>

        {/* Registered Geography */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Primary Civic Jurisdiction
            </h3>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Update Jurisdiction
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">District</span>
              <span className="font-bold text-slate-900">{location.district}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Block</span>
              <span className="font-bold text-slate-900">{location.block}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Panchayat</span>
              <span className="font-bold text-slate-900">{location.panchayat}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Village / Ward</span>
              <span className="font-bold text-slate-900 truncate block">{location.village}</span>
            </div>
          </div>
        </div>

        {/* Civic Badges & Reputation */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Civic Reputation & Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {citizen.badges.map((b, i) => (
              <div
                key={i}
                className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center space-x-3"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">{b.name}</h4>
                  <p className="text-[11px] text-emerald-800">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIH Showcase Tour Trigger */}
        <div className="p-5 bg-gradient-to-r from-amber-950 to-slate-900 text-white rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Smart India Hackathon 2026
            </span>
            <h4 className="text-sm font-bold">Kanke Rural Road Lifecycle Story</h4>
            <p className="text-xs text-slate-300">
              Walk through the entire problem journey from citizen voice to defect warranty and public accountability.
            </p>
          </div>

          <button
            onClick={() => setIsShowcaseTourOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shrink-0 cursor-pointer"
          >
            Launch Tour
          </button>
        </div>
      </div>
    </div>
  );
};
