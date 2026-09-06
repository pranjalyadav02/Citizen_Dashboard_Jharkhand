import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Problem, ProblemStage } from '../../types';
import {
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bell,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building,
  GraduationCap,
  Hammer,
  ShieldAlert,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
  Send,
} from 'lucide-react';

const STAGES: { stage: ProblemStage; label: string }[] = [
  { stage: 'Submitted', label: '1. Submitted' },
  { stage: 'AI Triaged', label: '2. AI Triaged' },
  { stage: 'Community Validated', label: '3. Community Validated' },
  { stage: 'Government Verified', label: '4. Gov Verified' },
  { stage: 'Published as Challenge', label: '5. Published Challenge' },
  { stage: 'Problem Statement Refined', label: '6. R&D Scoped' },
  { stage: 'Assigned to University / Industry / Contractor', label: '7. Partner Assigned' },
  { stage: 'Research / Solution in Progress', label: '8. Solution (TRL)' },
  { stage: 'Pilot Deployed', label: '9. Pilot Deployed' },
  { stage: 'Citizen Verification', label: '10. Citizen Audit' },
  { stage: 'Closed / Resolved', label: '11. Resolved' },
];

export const ProblemDetail: React.FC<{ problemId: string; onBack: () => void }> = ({
  problemId,
  onBack,
}) => {
  const { triggerRefresh, navigateToProject, navigateToAsset, navigateToIntegrityCase, language } = useApp();
  const problem = apiService.getProblemById(problemId);

  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <p className="text-slate-500 font-medium">Problem ticket not found or archived.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
        >
          Return to List
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.stage === problem.stage);

  const handleSupport = () => {
    apiService.supportProblem(problem.id, 'SUPPORT');
    triggerRefresh();
  };

  const handleExperienced = () => {
    apiService.supportProblem(problem.id, 'EXPERIENCED_THIS');
    triggerRefresh();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    apiService.addCommentToProblem(problem.id, {
      author: 'Rameshwar Murmu (Citizen)',
      role: 'Citizen',
      text: commentText.trim(),
      official: false,
    });
    setCommentText('');
    triggerRefresh();
  };

  const handleCopyShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Return */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problems</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubscribed(!subscribed)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              subscribed
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{subscribed ? 'Subscribed to Updates' : 'Subscribe'}</span>
          </button>

          <button
            onClick={handleCopyShare}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Problem Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="font-mono text-xs font-black bg-emerald-900 text-amber-300 px-2.5 py-1 rounded-lg">
              {problem.id}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              {problem.category}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
              {problem.severity} Severity
            </span>
            {problem.isGovernmentVerified && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Panchayat / Gov Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Reported: {problem.reportedDate}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {problem.title}
          </h1>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>
        </div>

        {/* Location & Demographics Hierarchy */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Jurisdiction</span>
            <span className="font-semibold text-slate-900">
              {problem.location.district} → {problem.location.block} Block
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Panchayat & Village</span>
            <span className="font-semibold text-slate-900">
              {problem.location.panchayat} • {problem.location.village}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Citizens</span>
            <span className="font-semibold text-slate-900">
              ~{problem.affectedCountApprox.toLocaleString()} ({problem.affectedPopulationText})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Reporter Masking</span>
            <span className="font-semibold text-slate-900">{problem.reporterMasked}</span>
          </div>
        </div>

        {/* Community Support Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSupport}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4 text-emerald-300" />
              <span>Support This Problem ({problem.supportersCount})</span>
            </button>

            <button
              onClick={handleExperienced}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              I Experience This ({problem.experiencedCount})
            </button>
          </div>

          <button
            onClick={() => navigateToIntegrityCase('INT-RNC-KNK-004821')}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center space-x-1.5 underline underline-offset-2"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Flag Integrity Concern / Corruption Notice</span>
          </button>
        </div>
      </div>

      {/* 11-Stage Visual Lifecycle Tracker */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Official 11-Stage Civic Lifecycle
            </h3>
            <p className="text-xs text-slate-500">
              Real-time progression from citizen submission to university research, deployment, and community audit.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold border border-emerald-300">
            Active: {problem.stage}
          </span>
        </div>

        {/* Timeline Horizontal / Wrapping Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {STAGES.map((s, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            return (
              <div
                key={s.stage}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-emerald-900 text-white border-emerald-950 font-bold shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono">
                    Step {index + 1}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  {isCurrent && <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-spin" />}
                </div>
                <div className="line-clamp-2 leading-tight">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidences & Photos */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Citizen Ground Evidences ({problem.evidences.length})
          </h3>
          <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GPS Geotag & EXIF Integrity Verified</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {problem.evidences.map((ev) => (
            <div
              key={ev.id}
              className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 space-y-2 pb-3"
            >
              <img
                src={ev.url}
                alt={ev.caption}
                className="w-full h-48 object-cover border-b border-slate-200"
              />
              <div className="px-3 space-y-1">
                <p className="text-xs font-bold text-slate-900">{ev.caption}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>GPS: {ev.verifiedGps.latitude}° N, {ev.verifiedGps.longitude}° E</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                    Match 100%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Infrastructure & Responsible Contractor (If Applicable) */}
      {problem.matchedAssetId && (() => {
        const matchedAsset = apiService.getAssetById(problem.matchedAssetId!);
        if (!matchedAsset) return null;
        const isMissed = matchedAsset.repairStatus === 'Repair_Notice_Expired';

        return (
          <div className="bg-amber-50/70 rounded-2xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hammer className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                    Responsible Public Works Contract & Asset Link
                  </h3>
                  <p className="text-xs text-amber-800">
                    Matched via Geographic Asset Register to active defect liability warranty.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigateToAsset(matchedAsset.id)}
                className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Contract</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Contractor</span>
                <span className="font-bold text-slate-900">{matchedAsset.contract.contractor.name}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Defect Liability Expiry</span>
                <span className="font-bold text-slate-900">{matchedAsset.contract.defectLiabilityEndDate}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">30-Day Cure Deadline</span>
                <span className="font-bold text-rose-700">{matchedAsset.contract.statutoryNoticeDeadline || 'Notice Pending'}</span>
              </div>
            </div>

            {isMissed && (
              <div className="p-3 bg-rose-100 rounded-xl border border-rose-300 flex items-start space-x-2 text-xs text-rose-950">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">⚠ Statutory Repair SLA Exceeded: </span>
                  <span>Contractor failed to mobilize repairs within 30 days. Liquidated damages and penalty proceedings initiated.</span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Linked University / Industry Innovation Project (If Applicable) */}
      {(problem.associatedProjectId || problem.linkedProjectId) && (() => {
        const pId = problem.associatedProjectId || problem.linkedProjectId!;
        const project = apiService.getProjectById(pId);
        if (!project) return null;

        return (
          <div className="bg-blue-50/70 rounded-2xl p-6 border-2 border-blue-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
                    Active University / Industry R&D Solution: {project.title}
                  </h3>
                  <p className="text-xs text-blue-800">
                    Lead: {project.university.name} • TRL {project.trl}: {project.trlStageName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigateToProject(project.id)}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Track TRL & Prototype</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Comments & Community Voice */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-emerald-800" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Citizen Testimonies & Field Updates ({problem.comments?.length || 0})
          </h3>
        </div>

        {/* Add comment input */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add your local eyewitness account, impact report or update..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-3 divide-y divide-slate-100">
          {(problem.comments || []).map((c) => (
            <div key={c.id} className="pt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{c.author}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                    {c.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{c.date}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
