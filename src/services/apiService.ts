/**
 * JanaSamadhan - Core API & Storage Service
 * Monorepo-ready abstraction layer for citizen queries, mutations,
 * offline synchronization, and state management.
 */

import {
  Problem,
  Project,
  InfrastructureAsset,
  IntegrityCase,
  AccountabilityRecord,
  WorkVerificationAudit,
  CitizenNotification,
  Citizen,
} from '../types';
import {
  PROBLEMS_DATA,
  PROJECTS_DATA,
  INFRASTRUCTURE_ASSETS,
  INTEGRITY_CASES,
  ACCOUNTABILITY_RECORDS,
  WORK_VERIFICATIONS,
  INITIAL_NOTIFICATIONS,
  CURRENT_CITIZEN,
} from '../data/mockData';

const STORAGE_KEYS = {
  PROBLEMS: 'janasamadhan_problems',
  PROJECTS: 'janasamadhan_projects',
  INTEGRITY: 'janasamadhan_integrity',
  VERIFICATIONS: 'janasamadhan_verifications',
  NOTIFICATIONS: 'janasamadhan_notifications',
  OFFLINE_QUEUE: 'janasamadhan_offline_queue',
};

class ApiService {
  private getStored<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage write failed', err);
    }
  }

  // --- PROBLEMS ---
  getProblems(): Problem[] {
    return this.getStored<Problem[]>(STORAGE_KEYS.PROBLEMS, PROBLEMS_DATA);
  }

  getProblemById(id: string): Problem | undefined {
    return this.getProblems().find((p) => p.id === id);
  }

  createProblem(problem: Problem): Problem {
    const problems = this.getProblems();
    const updated = [problem, ...problems];
    this.setStored(STORAGE_KEYS.PROBLEMS, updated);
    return problem;
  }

  supportProblem(problemId: string, type: 'SUPPORT' | 'EXPERIENCED_THIS'): Problem | undefined {
    const problems = this.getProblems();
    const target = problems.find((p) => p.id === problemId);
    if (!target) return undefined;

    if (type === 'SUPPORT') {
      target.supportersCount += 1;
    } else {
      target.experiencedCount += 1;
    }

    this.setStored(STORAGE_KEYS.PROBLEMS, problems);
    return target;
  }

  addCommentToProblem(
    problemId: string,
    comment: { author: string; role: string; text: string; official: boolean }
  ): Problem | undefined {
    const problems = this.getProblems();
    const target = problems.find((p) => p.id === problemId);
    if (!target) return undefined;

    if (!target.comments) {
      target.comments = [];
    }
    target.comments.push({
      id: 'c-' + Date.now(),
      author: comment.author,
      role: comment.role,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      text: comment.text,
      official: comment.official,
    });

    this.setStored(STORAGE_KEYS.PROBLEMS, problems);
    return target;
  }

  // --- PROJECTS ---
  getProjects(): Project[] {
    return this.getStored<Project[]>(STORAGE_KEYS.PROJECTS, PROJECTS_DATA);
  }

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  // --- INFRASTRUCTURE ASSETS & CONTRACTS ---
  getInfrastructureAssets(): InfrastructureAsset[] {
    return INFRASTRUCTURE_ASSETS;
  }

  getAssets(): InfrastructureAsset[] {
    return this.getInfrastructureAssets();
  }

  getAssetById(id: string): InfrastructureAsset | undefined {
    return INFRASTRUCTURE_ASSETS.find((a) => a.id === id);
  }

  // --- INTEGRITY & ANTI-CORRUPTION CASES ---
  getIntegrityCases(): IntegrityCase[] {
    return this.getStored<IntegrityCase[]>(STORAGE_KEYS.INTEGRITY, INTEGRITY_CASES);
  }

  getIntegrityCaseById(id: string): IntegrityCase | undefined {
    return this.getIntegrityCases().find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  createIntegrityCase(concern: IntegrityCase): IntegrityCase {
    return this.createIntegrityConcern(concern);
  }

  createIntegrityConcern(concern: IntegrityCase): IntegrityCase {
    const list = this.getIntegrityCases();
    const updated = [concern, ...list];
    this.setStored(STORAGE_KEYS.INTEGRITY, updated);
    return concern;
  }

  supportIntegrityCase(caseId: string): IntegrityCase | undefined {
    const list = this.getIntegrityCases();
    const target = list.find((c) => c.id === caseId);
    if (!target) return undefined;

    target.supportingVerifiedReports += 1;
    // Check 10k threshold condition dynamically!
    if (target.supportingVerifiedReports >= 10000 && !target.is10kAlertTriggered) {
      target.is10kAlertTriggered = true;
      target.status = 'Investigation Requested';
      target.currentWorkflowStage = 'Investigation Requested';
      target.alertTriggeredDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      target.publicConfidenceText = 'High public concern - 10,000+ verified citizen reports';
    }

    this.setStored(STORAGE_KEYS.INTEGRITY, list);
    return target;
  }

  // --- CITIZEN VERIFICATION AUDITS ---
  getWorkVerifications(): WorkVerificationAudit[] {
    return this.getStored<WorkVerificationAudit[]>(STORAGE_KEYS.VERIFICATIONS, WORK_VERIFICATIONS);
  }

  submitWorkAuditVote(
    auditId: string,
    decision: 'CONFIRMED' | 'PROBLEMS_FOUND' | 'CANNOT_VERIFY',
    comment: string,
    evidenceUrl?: string
  ): WorkVerificationAudit | undefined {
    const audits = this.getWorkVerifications();
    const target = audits.find((a) => a.id === auditId);
    if (!target) return undefined;

    target.totalVotes += 1;
    if (decision === 'CONFIRMED') target.confirmedCompletedCount += 1;
    if (decision === 'PROBLEMS_FOUND') target.reportedProblemsCount += 1;
    if (decision === 'CANNOT_VERIFY') target.cannotVerifyCount += 1;

    // Recalculate percentages
    const positiveRatio = target.totalVotes > 0 ? (target.confirmedCompletedCount / target.totalVotes) * 100 : 0;
    target.communityVerificationPercent = Math.round(positiveRatio);

    target.userAudits.unshift({
      id: 'aud-' + Date.now(),
      userMasked: `${CURRENT_CITIZEN.name} (Citizen #${CURRENT_CITIZEN.id.slice(-6)})`,
      decision,
      comment,
      evidenceUrl,
      timestamp: 'Just now',
      verifiedAtLocation: true,
    });

    this.setStored(STORAGE_KEYS.VERIFICATIONS, audits);
    return target;
  }

  // --- STATE ACCOUNTABILITY WALL ---
  getAccountabilityRecords(): AccountabilityRecord[] {
    return ACCOUNTABILITY_RECORDS;
  }

  // --- NOTIFICATIONS ---
  getNotifications(): CitizenNotification[] {
    return this.getStored<CitizenNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const target = notifs.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // --- GLOBAL SEARCH ---
  searchAll(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return { problems: [], projects: [], assets: [], cases: [] };

    const problems = this.getProblems().filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.village.toLowerCase().includes(q) ||
        p.location.block.toLowerCase().includes(q)
    );

    const projects = this.getProjects().filter(
      (pr) =>
        pr.id.toLowerCase().includes(q) ||
        pr.title.toLowerCase().includes(q) ||
        pr.university.name.toLowerCase().includes(q) ||
        pr.university.shortName.toLowerCase().includes(q)
    );

    const assets = this.getInfrastructureAssets().filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.contract.contractor.name.toLowerCase().includes(q) ||
        a.contract.contractNumber.toLowerCase().includes(q)
    );

    const cases = this.getIntegrityCases().filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.officeOrScheme.toLowerCase().includes(q)
    );

    return { problems, projects, assets, cases };
  }
}

export const apiService = new ApiService();
