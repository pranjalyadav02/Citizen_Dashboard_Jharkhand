import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Building2,
  Clock,
  ShieldAlert,
  Send,
  Eye,
  Award,
} from 'lucide-react';

export const ShowcaseTourModal: React.FC = () => {
  const { isShowcaseTourOpen, setIsShowcaseTourOpen, setActiveTab, setSelectedProblemId, setSelectedAssetId, setSelectedCaseId } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isShowcaseTourOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      title: 'Citizen Identifies & Reports the Problem',
      subtitle: 'Kanke to Boreya Link Road Potholes',
      icon: Send,
      badge: 'Step 1: Citizen Voice',
      description:
        'A local citizen (Rameshwar Murmu) reports severe surface degradation and vehicle accidents on the newly constructed 4.6 km Kanke to Boreya road, utilizing voice transcription and geotagged photographic proof.',
      actionText: 'Open Problem Details',
      action: () => {
        setSelectedProblemId('JH-RNC-KNK-000184');
        setActiveTab('explore');
        setIsShowcaseTourOpen(false);
      },
    },
    {
      stepNumber: 2,
      title: 'AI Assisted Triage & Spatial Clustering',
      subtitle: 'Automatic Category, Severity & Duplicate Match',
      icon: FileSearch,
      badge: 'Step 2: AI Problem Intelligence',
      description:
        'The platform’s AI engine analyzes the submission, identifies 7 similar reports within 2.4 km, groups them into the "Kanke Rural Road Damage Cluster", and estimates ~8,500 affected citizens.',
      actionText: 'Try "Report a Problem" AI Triage',
      action: () => {
        setActiveTab('report');
        setIsShowcaseTourOpen(false);
      },
    },
    {
      stepNumber: 3,
      title: 'Contract Match & Responsible Contractor Identified',
      subtitle: 'Automated Link to Public Works Asset Registry',
      icon: Building2,
      badge: 'Step 3: Contract Registry Match',
      description:
        'The system automatically matches the location coordinates to Asset ASSET-RD-KNK-042 and Contract RWD/RNC/KNK/2023-24/082 (₹4.82 Cr) awarded to ABC Infrastructure & Developers Pvt. Ltd., identifying an active 5-year defect liability warranty.',
      actionText: 'Inspect Contract & Asset Record',
      action: () => {
        setSelectedAssetId('ASSET-RD-KNK-042');
        setActiveTab('infrastructure');
        setIsShowcaseTourOpen(false);
      },
    },
    {
      stepNumber: 4,
      title: '30-Day Contractual Repair Obligation & Missed SLA',
      subtitle: 'Statutory Notice & Deadline Expiry',
      icon: Clock,
      badge: 'Step 4: Statutory Repair SLA',
      description:
        'Contractor ABC Infrastructure was formally notified on 05 Feb 2026. The 30-day statutory cure deadline expired on 07 Mar 2026 with zero mobilization. The system automatically flagged: "⚠ Contractual repair deadline missed".',
      actionText: 'View Infrastructure SLA Tracker',
      action: () => {
        setActiveTab('infrastructure');
        setIsShowcaseTourOpen(false);
      },
    },
    {
      stepNumber: 5,
      title: '10,000+ Verified Citizen Surge & High-Priority Alert',
      subtitle: 'Public Concern Triggers Competent Authority Inquiry',
      icon: ShieldAlert,
      badge: 'Step 5: Integrity & Anti-Corruption Alert',
      description:
        'Citizens report sub-standard materials and bribery. When verified citizen reports exceed the 10,000 threshold (10,241 verified reports), the platform automatically dispatches a High-Priority Integrity Alert to the Deputy Commissioner and State Vigilance Bureau.',
      actionText: 'View 10,000+ Alert & 24h SLA',
      action: () => {
        setSelectedCaseId('INT-RNC-KNK-004821');
        setActiveTab('integrity');
        setIsShowcaseTourOpen(false);
      },
    },
    {
      stepNumber: 6,
      title: 'State Accountability & Verified Non-Compliance Wall',
      subtitle: 'Public Transparency without Premature Accusations',
      icon: Award,
      badge: 'Step 6: Public Accountability Wall',
      description:
        'Official inquiries establish contractor default. Liquidated damages and bank guarantee encashment are posted on the public State Accountability Wall with verifiable documentary timelines.',
      actionText: 'Open State Accountability Wall',
      action: () => {
        setActiveTab('accountability');
        setIsShowcaseTourOpen(false);
      },
    },
  ];

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-700/80 text-[11px] font-bold tracking-wider uppercase text-emerald-100">
              SIH 2026 Showcase Story
            </span>
            <span className="text-xs text-emerald-200">Kanke Rural Road Lifecycle</span>
          </div>
          <button
            onClick={() => setIsShowcaseTourOpen(false)}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-300 ${
                i <= currentStep ? 'bg-emerald-700' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {current.badge}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{current.title}</h3>
              <p className="text-xs font-medium text-emerald-700">{current.subtitle}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-700 leading-relaxed">{current.description}</p>
          </div>

          <div className="pt-2">
            <button
              onClick={current.action}
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold shadow flex items-center justify-center space-x-2 transition-all"
            >
              <span>{current.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">Click step action or next to proceed</span>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-4 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center space-x-1"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setIsShowcaseTourOpen(false)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finish Tour</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
