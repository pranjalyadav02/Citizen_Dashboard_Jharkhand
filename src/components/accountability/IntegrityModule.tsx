import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { IntegrityCase, IntegrityConcernType } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Clock,
  Building,
  UserCheck,
  Lock,
  Send,
  EyeOff,
  ThumbsUp,
  Share2,
} from 'lucide-react';

export const IntegrityModule: React.FC = () => {
  const { selectedCaseId, setSelectedCaseId, triggerRefresh, language } = useApp();
  const cases = apiService.getIntegrityCases();

  const [activeTab, setActiveTab] = useState<'browse' | 'report'>('browse');

  // Form State for reporting concern
  const [concernTitle, setConcernTitle] = useState('');
  const [targetEntity, setTargetEntity] = useState('ABC Infrastructure & Developers Pvt. Ltd.');
  const [concernType, setConcernType] = useState<IntegrityConcernType>('Contract non-compliance');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSupportCase = (caseId: string) => {
    apiService.supportIntegrityCase(caseId);
    triggerRefresh();
  };

  const handleSubmitConcern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concernTitle.trim()) return;

    const newCase: IntegrityCase = {
      id: `INT-RNC-KNK-${Math.floor(100000 + Math.random() * 900000).toString().slice(-6)}`,
      trackingPinHash: Math.floor(1000 + Math.random() * 9000).toString(),
      title: concernTitle,
      concernType: concernType,
      department: 'Rural Works Department & Vigilance',
      officeOrScheme: targetEntity,
      incidentLocation: {
        latitude: 23.4358,
        longitude: 85.3214,
        district: 'Ranchi',
        block: 'Kanke',
        panchayat: 'Boreya',
        village: 'Boreya Basti',
      },
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      slaDeadline: '24 Hours SLA Active',
      slaRemainingHours: 24,
      slaBreached: false,
      isAnonymous: isAnonymous,
      status: 'Submitted',
      supportingVerifiedReports: 1,
      disputingReports: 0,
      publicConfidenceText: 'Initial whistleblower report filed',
      is10kAlertTriggered: false,
      currentWorkflowStage: 'Citizen Concern Filed',
      governmentResponseSummary: 'Transmitted to Sub-Divisional Officer (SDO) Sadar for initial review.',
      authorityActionSummary: description || 'Citizen eye-witness report submitted via JanaSamadhan.',
      history: [
        {
          stage: 'Citizen Concern Filed',
          timestamp: 'Just now',
          note: 'Filed via encrypted citizen portal',
        },
      ],
    };

    apiService.createIntegrityCase(newCase);
    setSubmittedSuccess(true);
    triggerRefresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 border border-purple-900/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-400 text-purple-300 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">
              {language === 'hi'
                ? 'निगरानी व भ्रष्टाचार-रोधी प्रणाली (10,000 दहलीज)'
                : 'Integrity & Anti-Corruption Engine'}
            </h1>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Secure, end-to-end encrypted civic whistleblower platform. When verified reports against substandard work exceed the <strong>10,000 threshold</strong>, an emergency High-Priority Alert is automatically dispatched to the Deputy Commissioner and State Vigilance Bureau.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/80 border border-purple-700/50'
            }`}
          >
            Active Inquiries ({cases.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('report');
              setSubmittedSuccess(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
            }`}
          >
            + Report Concern
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE INQUIRIES & 10,000+ THRESHOLD CASES */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {cases.map((c) => {
            const is10k = c.is10kAlertTriggered;

            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl p-6 border shadow-xs space-y-5 transition-all ${
                  is10k
                    ? 'border-purple-400 ring-2 ring-purple-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Top Badge Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {c.id}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                      {c.concernType}
                    </span>
                    <span className="text-xs text-slate-400">• Logged: {c.submittedDate}</span>
                  </div>

                  {is10k ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm flex items-center space-x-1.5 animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                      <span>10,000+ THRESHOLD TRIGGERED (HIGH-PRIORITY ALERT)</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {c.status}
                    </span>
                  )}
                </div>

                {/* Title & Target Entity */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">{c.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span>Department / Scheme: <strong>{c.department}</strong></span>
                    <span>•</span>
                    <span>Target Office: <strong>{c.officeOrScheme}</strong></span>
                    <span>•</span>
                    <span>Location: {c.incidentLocation.block}, {c.incidentLocation.village}</span>
                  </div>
                </div>

                {/* Authority Action & Response Summary */}
                {c.governmentResponseSummary && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
                    <span className="font-bold text-slate-900 block">District Authority Cognizance:</span>
                    <p>{c.governmentResponseSummary}</p>
                    {c.authorityActionSummary && (
                      <p className="text-slate-600 font-medium pt-1 border-t border-slate-200/60 mt-1">
                        <strong>Action Ordered:</strong> {c.authorityActionSummary}
                      </p>
                    )}
                  </div>
                )}

                {/* 10,000+ Threshold Live Tracker */}
                <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-purple-950">
                        Verified Citizen Corroborations
                      </span>
                      <p className="text-[11px] text-purple-800">
                        {c.supportingVerifiedReports.toLocaleString()} Citizens have digitally corroborated this investigation
                      </p>
                    </div>

                    <span className="font-black text-purple-950 text-sm font-mono">
                      {c.supportingVerifiedReports >= 10000 ? '100% (Threshold Passed)' : `${Math.round((c.supportingVerifiedReports / 10000) * 100)}%`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (c.supportingVerifiedReports / 10000) * 100)}%` }}
                      className={`h-full transition-all ${
                        c.supportingVerifiedReports >= 10000 ? 'bg-rose-600' : 'bg-purple-700'
                      }`}
                    />
                  </div>

                  {/* High Priority Alert Dispatch info */}
                  {is10k && (
                    <div className="pt-2 border-t border-purple-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-rose-900 flex items-center space-x-1.5">
                          <Clock className="w-4 h-4 text-rose-600" />
                          <span>Statutory 24-Hour Government Action Clock Active</span>
                        </span>
                        <span className="font-mono font-bold text-rose-700 text-[11px]">
                          SLA Deadline: {c.slaDeadline}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-purple-200 text-xs space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Authorities Alerted Automatically
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px] border border-slate-200">
                            Deputy Commissioner, Ranchi
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px] border border-slate-200">
                            State Vigilance Bureau
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px] border border-slate-200">
                            Principal Secretary, Rural Development
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline History */}
                {c.history && c.history.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Investigation Activity Log ({c.history.length})
                    </span>
                    <div className="space-y-1.5">
                      {c.history.map((h, i) => (
                        <div
                          key={i}
                          className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{h.stage}</span>
                            <span className="text-[10px] text-slate-400">{h.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{h.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Protected by Jharkhand Civic Whistleblower Provisions
                  </span>

                  <button
                    onClick={() => handleSupportCase(c.id)}
                    className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4 text-purple-300" />
                    <span>Corroborate & Support ({c.supportingVerifiedReports.toLocaleString()})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: SUBMIT ANONYMOUS INTEGRITY CONCERN */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Submit an Integrity Concern or Corruption Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Reports of sub-standard materials, phantom billing, contractor negligence, or bribery.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>256-Bit Encrypted</span>
            </span>
          </div>

          {submittedSuccess ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">
                Integrity Concern Safely Registered
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Your report has been encrypted and assigned a confidential case ID. It will count toward the 10,000 threshold alert for Kanke Block.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold"
              >
                View Active Investigations
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitConcern} className="space-y-5">
              {/* Anonymous Toggle Strip */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Submit Anonymously</h4>
                    <p className="text-[11px] text-slate-500">
                      Your identity and phone number will not be visible on any public logs.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Concern Title *
                </label>
                <input
                  type="text"
                  required
                  value={concernTitle}
                  onChange={(e) => setConcernTitle(e.target.value)}
                  placeholder="e.g., Substandard bitumen and missing drainage culvert on Kanke rural road"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>

              {/* Target Entity & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Contractor or Office
                  </label>
                  <input
                    type="text"
                    value={targetEntity}
                    onChange={(e) => setTargetEntity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Concern Category
                  </label>
                  <select
                    value={concernType}
                    onChange={(e) => setConcernType(e.target.value as IntegrityConcernType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-700"
                  >
                    <option value="Contract non-compliance">Contract non-compliance / Poor Quality</option>
                    <option value="Bribe demanded">Bribe demanded</option>
                    <option value="Extra payment demanded for a free service">Extra payment for free service</option>
                    <option value="Fake completion">Fake completion (Phantom work)</option>
                    <option value="Service intentionally delayed">Service intentionally delayed</option>
                    <option value="Other integrity concern">Other integrity concern</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Eye-Witness Statement & Facts
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide dates, measurements, core thickness issues, or contractor interaction details..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-700 leading-relaxed"
                />
              </div>

              {/* Evidence Upload */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  Attach Laboratory Core Reports, Photographs, or Audio Records
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Encrypted locally before transmission. Strips camera device identifiers.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit to Vigilance Engine</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
