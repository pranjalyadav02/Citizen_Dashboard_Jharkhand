import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Asset, Contract } from '../../types';
import {
  Layers,
  Building,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const InfrastructureRegistry: React.FC = () => {
  const { selectedAssetId, setSelectedAssetId, navigateToProblem, navigateToIntegrityCase, language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const assets = apiService.getAssets();

  const filteredAssets = assets.filter((a) => {
    const matchesType = filterType === 'ALL' || a.type === filterType;
    const matchesSearch =
      !searchTerm ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.contract.contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi'
                ? 'सड़क परिसंपत्ति एवं ठेका पंजी'
                : 'Road Asset & Contractor Registry'}
            </h1>
            <span className="text-xs font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
              Defect Liability Audits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Public Works Department and Rural Development registry linking physical roads to contractors, warranty periods, and 30-day repair obligations.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by road asset, contractor name, or contract ID (e.g. ASSET-RD-KNK-042)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
        >
          <option value="ALL">All Asset Types</option>
          <option value="Road">Rural & State Roads</option>
          <option value="Water_Supply">Water Supply Schemes</option>
          <option value="Bridge">Bridges & Culverts</option>
          <option value="School_Building">School Buildings</option>
        </select>
      </div>

      {/* Asset Cards */}
      <div className="space-y-6">
        {filteredAssets.map((asset) => {
          const isSelected = selectedAssetId === asset.id;
          const isMissed = asset.repairStatus === 'Repair_Notice_Expired';

          return (
            <div
              key={asset.id}
              className={`bg-white rounded-2xl p-6 border shadow-xs transition-all space-y-5 ${
                isMissed
                  ? 'border-rose-300 ring-2 ring-rose-200/50'
                  : 'border-slate-200 hover:border-teal-500'
              }`}
            >
              {/* Top Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-teal-50 text-teal-900 px-2 py-0.5 rounded border border-teal-200">
                    {asset.id}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {asset.type} • {asset.lengthKm ? `${asset.lengthKm} km` : ''}
                  </span>
                  <span className="text-xs text-slate-500">
                    {asset.location.district} → {asset.location.block} Block
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {isMissed ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center space-x-1.5 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>⚠ Contractual Repair Deadline Missed</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Warranty Active
                    </span>
                  )}
                </div>
              </div>

              {/* Asset Name & Core Overview */}
              <div>
                <h3 className="text-lg font-black text-slate-900">{asset.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connecting: {asset.location.village} • Department: {asset.contract.department}
                </p>
              </div>

              {/* Associated Contract Transparency Grid */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Contract ID & Value
                  </span>
                  <span className="font-bold text-slate-900 font-mono block">
                    {asset.contract.id}
                  </span>
                  <span className="text-slate-600">
                    ₹{(asset.contract.projectValueInr / 10000000).toFixed(2)} Crores
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Responsible Contractor
                  </span>
                  <span className="font-bold text-slate-900 block">
                    {asset.contract.contractor.name}
                  </span>
                  <span className="text-slate-500">
                    Reg: {asset.contract.contractor.registrationNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Defect Liability Period
                  </span>
                  <span className="font-bold text-emerald-800 block">
                    {asset.contract.defectLiabilityYears} Years (Until {asset.contract.defectLiabilityEndDate})
                  </span>
                  <span className="text-slate-500">Full contractor warranty</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    30-Day Statutory Cure SLA
                  </span>
                  <span className={`font-bold block ${isMissed ? 'text-rose-700' : 'text-slate-800'}`}>
                    Notice: {asset.contract.statutoryNoticeServedDate || 'None'}
                  </span>
                  <span className="text-rose-700 font-semibold">
                    Deadline: {asset.contract.statutoryNoticeDeadline || 'N/A'}
                  </span>
                </div>
              </div>

              {/* If deadline missed callout */}
              {isMissed && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-300 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-rose-950 font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Contractor Non-Compliance Alert Broadcast to District Magistrate</span>
                  </div>
                  <p className="text-rose-900 leading-relaxed">
                    Formal cure notice was dispatched to contractor <strong>{asset.contract.contractor.name}</strong> on {asset.contract.statutoryNoticeServedDate}. The 30-day cure period expired on {asset.contract.statutoryNoticeDeadline} with zero ground remediation. Liquidated damages proceedings and bank guarantee forfeiture review have commenced under the Jharkhand Public Works Code.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => navigateToIntegrityCase('INT-RNC-KNK-004821')}
                      className="px-3 py-1.5 bg-rose-800 hover:bg-rose-900 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Endorse Public Integrity Investigation</span>
                    </button>
                    {asset.linkedProblemId && (
                      <button
                        onClick={() => navigateToProblem(asset.linkedProblemId!)}
                        className="text-xs font-bold text-slate-700 hover:underline flex items-center space-x-1"
                      >
                        <span>View Ground Pothole Ticket ({asset.linkedProblemId})</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Maintenance & Inspection Logs */}
              {asset.inspectionLogs && asset.inspectionLogs.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Official Quality Tests & Inspection History ({asset.inspectionLogs.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {asset.inspectionLogs.map((log, i) => (
                      <div
                        key={log.id || i}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{log.date}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              (log.result || log.status) === 'Critical_Defects_Found'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {(log.result || log.status || 'Verified').replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-tight">{log.notes || log.findings}</p>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Auditor: {log.inspector}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
