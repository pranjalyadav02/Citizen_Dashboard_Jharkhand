import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { WorkVerificationAudit } from '../../types';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Clock,
  Building,
  Flame,
} from 'lucide-react';

export const WorkVerification: React.FC = () => {
  const { navigateToProblem, triggerRefresh, language } = useApp();
  const verifications = apiService.getWorkVerifications();

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittedFeedback, setSubmittedFeedback] = useState<Record<string, boolean>>({});

  const handleVote = (
    auditId: string,
    decision: 'CONFIRMED' | 'PROBLEMS_FOUND' | 'CANNOT_VERIFY'
  ) => {
    const comment = commentInputs[auditId] || 'Citizen ground audit vote submitted.';
    apiService.submitWorkAuditVote(auditId, decision, comment);
    setSubmittedFeedback((prev) => ({ ...prev, [auditId]: true }));
    triggerRefresh();
  };

  const verificationStreak = 12; // Mock data for user's active participation streak
  const totalVerifiedCount = 45; // Mock data for total lifetime impact

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {language === 'hi'
                  ? 'पूर्ण कार्यों का नागरिक सत्यापन'
                  : 'Citizen Verification of Completed Work'}
              </h1>
              <p className="text-xs text-slate-500">
                Government and contractors cannot close a civic ticket without ground audit and voting by local residents.
              </p>
            </div>
          </div>

          {/* Verification Streak Indicator */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 px-4 py-2 rounded-xl shrink-0 shadow-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-black text-orange-700">{verificationStreak}</span>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Day Streak</span>
              </div>
              <span className="text-[10px] text-orange-800 font-medium">{totalVerifiedCount} impacts made</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Citizen audit votes directly update <strong>Contractor Performance Scores</strong> and trigger mandatory re-inspection if satisfaction falls below 75%.
          </span>
        </div>
      </div>

      {/* Verification Items List */}
      <div className="space-y-6">
        {verifications.map((item) => {
          const hasVoted = submittedFeedback[item.id];
          const total = item.totalVotes || 1;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              {/* Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {item.id}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Project: {item.projectId}
                  </span>
                  <span className="text-xs text-slate-400">
                    • Claimed Completion: {item.departmentClaimedCompletionDate}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    item.status === 'Community_Verified_Complete'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : item.status === 'Defects_Reported_Audit_Required'
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official claim: 100% physically completed • Citizen ground confidence: {item.communityVerificationPercent}%
                </p>
              </div>

              {/* Live Citizen Audit Poll Statistics */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Community Verification Tally ({item.totalVotes} verified votes)
                  </span>
                  <span
                    className={`font-bold ${
                      item.communityVerificationPercent < 75 ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    Citizen Approval: {item.communityVerificationPercent}%
                  </span>
                </div>

                <div className="flex h-3 rounded-full overflow-hidden bg-slate-200">
                  <div
                    style={{ width: `${(item.confirmedCompletedCount / total) * 100}%` }}
                    className="bg-emerald-600"
                    title="Yes, Completely"
                  />
                  <div
                    style={{ width: `${(item.reportedProblemsCount / total) * 100}%` }}
                    className="bg-rose-500"
                    title="Problems Found"
                  />
                  <div
                    style={{ width: `${(item.cannotVerifyCount / total) * 100}%` }}
                    className="bg-slate-400"
                    title="Cannot Verify"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pt-1">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                    <span>Fully Resolved ({item.confirmedCompletedCount})</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    <span>Defects / Incomplete ({item.reportedProblemsCount})</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                    <span>Uncertain / Needs Visit ({item.cannotVerifyCount})</span>
                  </span>
                </div>
              </div>

              {/* Recent Citizen Audit Comments */}
              {item.userAudits && item.userAudits.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Verified Resident Field Audits ({item.userAudits.length})
                  </span>
                  <div className="space-y-2">
                    {item.userAudits.slice(0, 2).map((audit) => (
                      <div
                        key={audit.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{audit.userMasked}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              audit.decision === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {audit.decision}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">{audit.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Citizen Interactive Voting Box */}
              {!hasVoted ? (
                <div className="p-5 bg-emerald-50/50 rounded-2xl border-2 border-emerald-300 space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-slate-900">
                      Has this work been satisfactorily completed in your village?
                    </h4>
                    <p className="text-xs text-slate-500">
                      Cast your verdict as an eyewitness local resident.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleVote(item.id, 'CONFIRMED')}
                      className="py-3 px-4 bg-white hover:bg-emerald-100/60 border-2 border-emerald-400 hover:border-emerald-600 rounded-xl text-xs font-bold text-emerald-950 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Yes, Completely</span>
                    </button>

                    <button
                      onClick={() => handleVote(item.id, 'PROBLEMS_FOUND')}
                      className="py-3 px-4 bg-white hover:bg-rose-100/60 border-2 border-rose-400 hover:border-rose-600 rounded-xl text-xs font-bold text-rose-950 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Problems Found</span>
                    </button>

                    <button
                      onClick={() => handleVote(item.id, 'CANNOT_VERIFY')}
                      className="py-3 px-4 bg-white hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span>Cannot Verify</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-100 rounded-xl border border-emerald-300 flex items-center space-x-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>
                    Thank you! Your citizen audit vote has been officially logged in the public ledger.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
