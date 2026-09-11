/**
 * JanaSamadhan - Connected API Service
 * Synchronizes client state with the Express backend REST API
 * Fallback to local persistent cache for offline / resilience.
 */

import {
  Problem,
  Project,
  InfrastructureAsset,
  IntegrityCase,
  WorkVerificationAudit,
  AccountabilityRecord,
  CitizenNotification,
} from '../types';
import {
  PROBLEMS_DATA,
  PROJECTS_DATA,
  INFRASTRUCTURE_ASSETS,
  INTEGRITY_CASES,
  WORK_VERIFICATIONS,
  ACCOUNTABILITY_RECORDS,
  INITIAL_NOTIFICATIONS,
  CURRENT_CITIZEN,
} from '../data/mockData';

const STORAGE_KEYS = {
  PROBLEMS: 'janasamadhan_problems',
  PROJECTS: 'janasamadhan_projects',
  INTEGRITY: 'janasamadhan_integrity',
  VERIFICATIONS: 'janasamadhan_verifications',
  NOTIFICATIONS: 'janasamadhan_notifications',
};

class ApiService {
  private problemsCache: Problem[];
  private projectsCache: Project[];
  private assetsCache: InfrastructureAsset[];
  private integrityCache: IntegrityCase[];
  private verificationsCache: WorkVerificationAudit[];
  private notificationsCache: CitizenNotification[];

  constructor() {
    this.problemsCache = this.getStored<Problem[]>(STORAGE_KEYS.PROBLEMS, []);
    this.projectsCache = this.getStored<Project[]>(STORAGE_KEYS.PROJECTS, []);
    this.assetsCache = [];
    this.integrityCache = this.getStored<IntegrityCase[]>(STORAGE_KEYS.INTEGRITY, []);
    this.verificationsCache = this.getStored<WorkVerificationAudit[]>(STORAGE_KEYS.VERIFICATIONS, []);
    this.notificationsCache = this.getStored<CitizenNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);

    // Initial background sync with backend API
    this.syncFromBackend();
  }

  private getStored<T>(key: string, fallback: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      }
    } catch {
      // Fallback
    }
    return fallback;
  }

  private setStored<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      console.warn('Storage write failed', err);
    }
  }

  // --- BACKGROUND SYNC FROM BACKEND ---
  private async syncFromBackend() {
    if (typeof window === 'undefined') return;
    try {
      // Fetch problems
      const probRes = await fetch('/api/v1/citizen/challenges');
      if (probRes.ok) {
        const json = await probRes.json();
        if (json.success && Array.isArray(json.data)) {
          this.problemsCache = json.data;
          this.setStored(STORAGE_KEYS.PROBLEMS, this.problemsCache);
        }
      }

      // Fetch integrity cases
      const intRes = await fetch('/api/v1/citizen/integrity');
      if (intRes.ok) {
        const json = await intRes.json();
        if (json.success && Array.isArray(json.data)) {
          this.integrityCache = json.data;
          this.setStored(STORAGE_KEYS.INTEGRITY, this.integrityCache);
        }
      }

      // Fetch verifications
      const verRes = await fetch('/api/v1/citizen/verifications');
      if (verRes.ok) {
        const json = await verRes.json();
        if (json.success && Array.isArray(json.data)) {
          this.verificationsCache = json.data;
          this.setStored(STORAGE_KEYS.VERIFICATIONS, this.verificationsCache);
        }
      }

      // Fetch notifications
      const notRes = await fetch('/api/v1/citizen/notifications');
      if (notRes.ok) {
        const json = await notRes.json();
        if (json.success && Array.isArray(json.data)) {
          this.notificationsCache = json.data;
          this.setStored(STORAGE_KEYS.NOTIFICATIONS, this.notificationsCache);
        }
      }
    } catch (e) {
      // Backend might still be starting or running offline
    }
  }

  // --- PROBLEMS ---
  getProblems(): Problem[] {
    return this.problemsCache;
  }

  getProblemById(id: string): Problem | undefined {
    return this.problemsCache.find((p) => p.id?.toLowerCase() === id.toLowerCase());
  }

  createProblem(problem: Problem): Problem {
    this.problemsCache = [problem, ...this.problemsCache];
    this.setStored(STORAGE_KEYS.PROBLEMS, this.problemsCache);

    // Sync with backend API
    fetch('/api/v1/citizen/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem),
    }).catch((err) => console.warn('Backend sync error:', err));

    return problem;
  }

  supportProblem(problemId: string, type: 'SUPPORT' | 'EXPERIENCED_THIS'): Problem | undefined {
    const target = this.problemsCache.find((p) => p.id === problemId);
    if (!target) return undefined;

    if (type === 'SUPPORT') {
      target.supportersCount = (target.supportersCount || 0) + 1;
    } else {
      target.experiencedCount = (target.experiencedCount || 0) + 1;
    }

    this.setStored(STORAGE_KEYS.PROBLEMS, this.problemsCache);

    // Sync with backend
    fetch(`/api/v1/citizen/challenges/${problemId}/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    }).catch((err) => console.warn('Backend sync error:', err));

    return target;
  }

  addCommentToProblem(
    problemId: string,
    comment: { author: string; role: string; text: string; official: boolean }
  ): Problem | undefined {
    const target = this.problemsCache.find((p) => p.id === problemId);
    if (!target) return undefined;

    if (!target.comments) {
      target.comments = [];
    }
    const newComment = {
      id: 'c-' + Date.now(),
      author: comment.author,
      role: comment.role,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      text: comment.text,
      official: comment.official,
    };
    target.comments.push(newComment);
    this.setStored(STORAGE_KEYS.PROBLEMS, this.problemsCache);

    // Sync with backend
    fetch(`/api/v1/citizen/challenges/${problemId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    }).catch((err) => console.warn('Backend sync error:', err));

    return target;
  }

  // --- PROJECTS ---
  getProjects(): Project[] {
    return this.projectsCache;
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsCache.find((p) => p.id === id);
  }

  // --- INFRASTRUCTURE ASSETS ---
  getInfrastructureAssets(): InfrastructureAsset[] {
    return this.assetsCache;
  }

  getAssets(): InfrastructureAsset[] {
    return this.getInfrastructureAssets();
  }

  getAssetById(id: string): InfrastructureAsset | undefined {
    return this.assetsCache.find((a) => a.id === id);
  }

  // --- INTEGRITY & ANTI-CORRUPTION ---
  getIntegrityCases(): IntegrityCase[] {
    return this.integrityCache;
  }

  getIntegrityCaseById(id: string): IntegrityCase | undefined {
    return this.integrityCache.find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  createIntegrityCase(concern: IntegrityCase): IntegrityCase {
    return this.createIntegrityConcern(concern);
  }

  createIntegrityConcern(concern: IntegrityCase): IntegrityCase {
    this.integrityCache = [concern, ...this.integrityCache];
    this.setStored(STORAGE_KEYS.INTEGRITY, this.integrityCache);

    // Sync with backend
    fetch('/api/v1/citizen/integrity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(concern),
    }).catch((err) => console.warn('Backend sync error:', err));

    return concern;
  }

  supportIntegrityCase(caseId: string): IntegrityCase | undefined {
    const target = this.integrityCache.find((c) => c.id === caseId);
    if (!target) return undefined;

    target.supportingVerifiedReports = (target.supportingVerifiedReports || 0) + 1;
    if (target.supportingVerifiedReports >= 10000 && !target.is10kAlertTriggered) {
      target.is10kAlertTriggered = true;
      target.status = 'Investigation Requested';
      target.currentWorkflowStage = 'Investigation Requested';
      target.alertTriggeredDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      target.publicConfidenceText = 'High public concern - 10,000+ verified citizen reports';
    }

    this.setStored(STORAGE_KEYS.INTEGRITY, this.integrityCache);

    // Sync with backend
    fetch(`/api/v1/citizen/integrity/${caseId}/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch((err) => console.warn('Backend sync error:', err));

    return target;
  }

  // --- WORK VERIFICATION AUDITS ---
  getWorkVerifications(): WorkVerificationAudit[] {
    return this.verificationsCache;
  }

  submitWorkAuditVote(
    auditId: string,
    decision: 'CONFIRMED' | 'PROBLEMS_FOUND' | 'CANNOT_VERIFY',
    comment: string,
    evidenceUrl?: string
  ): WorkVerificationAudit | undefined {
    const target = this.verificationsCache.find((a) => a.id === auditId);
    if (!target) return undefined;

    target.totalVotes = (target.totalVotes || 0) + 1;
    if (decision === 'CONFIRMED') target.confirmedCompletedCount = (target.confirmedCompletedCount || 0) + 1;
    if (decision === 'PROBLEMS_FOUND') target.reportedProblemsCount = (target.reportedProblemsCount || 0) + 1;
    if (decision === 'CANNOT_VERIFY') target.cannotVerifyCount = (target.cannotVerifyCount || 0) + 1;

    target.communityVerificationPercent = Math.round(((target.confirmedCompletedCount || 0) / target.totalVotes) * 100);

    if (!target.userAudits) target.userAudits = [];
    target.userAudits.unshift({
      id: 'aud-' + Date.now(),
      userMasked: `${CURRENT_CITIZEN.name} (Citizen #${CURRENT_CITIZEN.id.slice(-6)})`,
      decision,
      comment,
      evidenceUrl,
      timestamp: 'Just now',
      verifiedAtLocation: true,
    });

    this.setStored(STORAGE_KEYS.VERIFICATIONS, this.verificationsCache);

    // Sync with backend
    fetch(`/api/v1/citizen/verifications/${auditId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, comment, evidenceUrl }),
    }).catch((err) => console.warn('Backend sync error:', err));

    return target;
  }

  // --- STATE ACCOUNTABILITY WALL ---
  getAccountabilityRecords(): AccountabilityRecord[] {
    return ACCOUNTABILITY_RECORDS;
  }

  // --- NOTIFICATIONS ---
  getNotifications(): CitizenNotification[] {
    return this.notificationsCache;
  }

  markNotificationRead(id: string): void {
    const target = this.notificationsCache.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.setStored(STORAGE_KEYS.NOTIFICATIONS, this.notificationsCache);
      fetch(`/api/v1/citizen/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
    }
  }

  markAllNotificationsRead(): void {
    this.notificationsCache = this.notificationsCache.map((n) => ({ ...n, read: true }));
    this.setStored(STORAGE_KEYS.NOTIFICATIONS, this.notificationsCache);
    fetch('/api/v1/citizen/notifications/read-all', { method: 'POST' }).catch(() => {});
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
