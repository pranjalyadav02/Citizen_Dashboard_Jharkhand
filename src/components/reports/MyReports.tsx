import React from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  ArrowRight,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

export const MyReports: React.FC = () => {
  const { citizen, setSelectedProblemId, setActiveTab, navigateToProblem, navigateToProject, language } = useApp();
  const problems = apiService.getProblems();

  // Citizen's problems
  const myProblems = problems.filter((p) => p.reporterMasked.includes('Rameshwar Murmu'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              {citizen.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {language === 'hi' ? 'मेरी नागरिक रिपोर्टें' : 'My Reported Challenges'}
              </h1>
              <p className="text-xs text-slate-500">
                Signed in as <strong>{citizen.name}</strong> • Phone: {citizen.phoneMasked} • Kanke Block
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>Report Another Problem</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Active Tickets ({myProblems.length})
          </h2>
          <span className="text-xs text-slate-400">Synced to device & cloud</span>
        </div>

        {myProblems.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            {/* Top meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                  {report.id}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {report.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Reported: {report.reportedDate}
                </span>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                Status: {report.stage}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {report.description}
              </p>
            </div>

            {/* Structured Info Grid */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Assigned Authority
                </span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{report.responsibleDepartment}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Solution Progress
                </span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span>
                    {report.associatedProjectId || report.linkedProjectId ? 'TRL 7 (Field Testing)' : 'Civic Triage & Contractor Notice'}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Partner / Contractor
                </span>
                <span className="font-bold text-slate-800 truncate block mt-0.5">
                  {report.contractorMatch?.name || (report.matchedAssetId ? 'ABC Infrastructure Pvt. Ltd.' : 'BIT Mesra Innovation Cell')}
                </span>
              </div>
            </div>

            {/* Action Required Callout if applicable */}
            {report.matchedAssetId && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex items-center justify-between text-xs text-amber-950">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Action:</strong> Linked to Public Works Contract. You can track defect liability and integrity audits.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('integrity')}
                  className="px-2.5 py-1 bg-amber-900 text-white rounded-lg font-bold text-[11px] shrink-0"
                >
                  View Integrity
                </button>
              </div>
            )}

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {report.supportersCount} citizens supporting this ticket
              </span>

              <button
                onClick={() => navigateToProblem(report.id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Track Full 11-Stage Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
