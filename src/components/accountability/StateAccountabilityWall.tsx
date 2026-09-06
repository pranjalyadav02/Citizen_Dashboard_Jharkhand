import React from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import {
  ShieldAlert,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  ThumbsDown,
  TrendingDown,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const StateAccountabilityWall: React.FC = () => {
  const { navigateToAsset, navigateToIntegrityCase, language } = useApp();
  const assets = apiService.getAssets();
  const integrityCases = apiService.getIntegrityCases();

  // Department Satisfaction Ratings
  const departments = [
    { name: 'Rural Works Department (RWD)', rating: 68, activeIssues: 18, resolvedInSla: 72, trend: 'down' },
    { name: 'Drinking Water & Sanitation (DWSD)', rating: 74, activeIssues: 12, resolvedInSla: 79, trend: 'up' },
    { name: 'Agriculture & Animal Husbandry', rating: 88, activeIssues: 5, resolvedInSla: 91, trend: 'up' },
    { name: 'Health, Medical Education & Family Welfare', rating: 82, activeIssues: 9, resolvedInSla: 84, trend: 'up' },
    { name: 'School Education & Literacy', rating: 79, activeIssues: 11, resolvedInSla: 81, trend: 'up' },
    { name: 'Urban Development & Housing (UDHD)', rating: 61, activeIssues: 24, resolvedInSla: 64, trend: 'down' },
  ];

  // Non-compliant / Repeat Defect Contracts
  const nonCompliantAssets = assets.filter((a) => a.repairStatus === 'Repair_Notice_Expired');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Wall Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'hi'
                ? 'राज्य सार्वजनिक जवाबदेही दीवार'
                : 'State Public Accountability Wall'}
            </h1>
            <p className="text-xs text-slate-400">
              Government of Jharkhand Open Public Audit • Defect Notice Register, Statutory Penalties & Department Performance.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Formal Non-Compliance & Missed SLA Wall */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Contractors with Expired Statutory Cure Deadlines</span>
            </h2>
            <p className="text-xs text-slate-500">
              Contracts where 30-day statutory repair notices have expired without contractor mobilization.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
            {nonCompliantAssets.length} Active Defaults
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nonCompliantAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl p-5 border-2 border-rose-300 shadow-xs space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-rose-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                    Contract: {asset.contract.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{asset.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white shrink-0 animate-pulse">
                  DEFAULT FLAGGED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Contractor</span>
                  <span className="font-bold text-slate-900">{asset.contract.contractor.name}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Project Value</span>
                  <span className="font-bold text-slate-900">
                    ₹{(asset.contract.projectValueInr / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Notice Dispatched</span>
                  <span className="font-semibold text-slate-800">{asset.contract.statutoryNoticeServedDate}</span>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-rose-700 font-bold uppercase block">Expired Deadline</span>
                  <span className="font-bold text-rose-900">{asset.contract.statutoryNoticeDeadline}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Supervising Engineer dispatched Memo #RWD/HQ/2026/049 recommending 10% liquidated damages deductions and blacklisting review under Rule 23 of State Procurement Regulations.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigateToAsset(asset.id)}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center space-x-1"
                >
                  <span>View Asset Audit Log</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => navigateToIntegrityCase('INT-RNC-KNK-004821')}
                  className="px-3 py-1.5 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-xs font-bold"
                >
                  View 10,000+ Case
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Citizen Satisfaction Ratings by Department */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Citizen Satisfaction Ratings by Department (Live Aggregation)
          </h2>
          <p className="text-xs text-slate-500">
            Computed from post-resolution citizen verification audits across all 24 districts of Jharkhand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                  {dept.name}
                </h4>
                {dept.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 font-sans">
                  {dept.rating}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {dept.resolvedInSla}% on-time SLA
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${dept.rating}%` }}
                  className={`h-full ${dept.rating >= 75 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>{dept.activeIssues} Open Tickets</span>
                <span className="font-semibold text-slate-700">Audit Status: Monitored</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Official Vigilance & Government Inquiry Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-purple-700" />
            <span>High-Priority Vigilance Dispatches & Inquiries</span>
          </h2>
          <p className="text-xs text-slate-500">
            Actions ordered by Deputy Commissioner, State Vigilance Bureau, and Administrative Secretaries upon crossing public thresholds.
          </p>
        </div>

        <div className="space-y-3">
          {integrityCases.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                    {c.id}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{c.title}</span>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                  {c.supportingVerifiedReports.toLocaleString()} Verified Endorsements
                </span>
              </div>

              {c.governmentResponseSummary && (
                <div className="text-xs text-purple-950 bg-white p-3 rounded-lg border border-purple-200 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>{c.department}</span>
                    <span className="text-slate-400 font-normal">{c.submittedDate}</span>
                  </div>
                  <p className="text-slate-700">{c.governmentResponseSummary}</p>
                  {c.authorityActionSummary && (
                    <span className="text-[11px] text-emerald-800 font-semibold block">
                      Action Ordered: {c.authorityActionSummary}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
