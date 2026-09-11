import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  PROBLEMS_DATA, 
  PROJECTS_DATA, 
  INFRASTRUCTURE_ASSETS, 
  INTEGRITY_CASES, 
  WORK_VERIFICATIONS, 
  ACCOUNTABILITY_RECORDS, 
  INITIAL_NOTIFICATIONS, 
  CURRENT_CITIZEN 
} from '../data/mockData';

export interface CitizenStoreData {
  citizens: any[];
  problems: any[];
  projects: any[];
  infrastructure: any[];
  integrityCases: any[];
  verifications: any[];
  accountability: any[];
  notifications: any[];
}

function resolveStorePath(filename: string = 'governance_store.json'): string {
  let dirname = process.cwd();
  try {
    dirname = path.dirname(fileURLToPath(import.meta.url));
  } catch {}

  const candidates = [
    path.resolve(process.cwd(), '..', 'shared_data', filename),
    path.resolve(process.cwd(), 'shared_data', filename),
    path.resolve(dirname, '..', '..', '..', 'shared_data', filename),
    path.resolve(dirname, '..', '..', 'shared_data', filename),
    path.resolve('C:\\Users\\omen\\.gemini\\antigravity-ide\\scratch\\jharkhand_portals\\shared_data', filename)
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

class StorageEngine {
  private data: CitizenStoreData;
  private filePath: string;

  constructor() {
    this.filePath = resolveStorePath('governance_store.json');
    console.log('[Citizen Storage] Using storage file:', this.filePath);
    this.data = this.loadData();
  }

  private loadData(): CitizenStoreData {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.problems)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing store, creating new seed:', err);
    }

    // Initialize with clean state
    const initial: CitizenStoreData = {
      citizens: [CURRENT_CITIZEN],
      problems: [],
      projects: [],
      infrastructure: INFRASTRUCTURE_ASSETS,
      integrityCases: [],
      verifications: [],
      accountability: [],
      notifications: [],
    };

    this.saveData(initial);
    return initial;
  }

  public reload(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.problems)) {
          this.data = parsed;
        }
      }
    } catch (err) {
      console.warn('Could not reload citizen storage engine file:', err);
    }
  }

  public saveData(customData?: CitizenStoreData): void {
    const toSave = customData || this.data;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving storage engine file:', err);
    }
  }

  // PROBLEMS CRUD
  public getProblems(filter?: { district?: string; category?: string; query?: string; status?: string }): any[] {
    this.reload();
    let list = [...this.data.problems];
    if (filter?.district && filter.district !== 'All') {
      list = list.filter(p => (p.district || p.location?.district)?.toLowerCase() === filter.district?.toLowerCase());
    }
    if (filter?.category && filter.category !== 'All') {
      list = list.filter(p => (p.category || p.domain)?.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter?.status && filter.status !== 'All') {
      list = list.filter(p => p.status?.toLowerCase() === filter.status?.toLowerCase());
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.location?.village && p.location.village.toLowerCase().includes(q)) ||
        (p.location?.block && p.location.block.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getProblemById(id: string): any | undefined {
    this.reload();
    return this.data.problems.find(p => p.id?.toLowerCase() === id.toLowerCase());
  }

  public addProblem(problem: any): any {
    this.reload();
    const districtName = problem.location?.district || "Ranchi";
    const blockName = problem.location?.block || "Kanke";
    const newProblem = {
      ...problem,
      id: problem.id || `JH-PRB-${Date.now().toString().slice(-6)}`,
      district: districtName,
      block: blockName,
      category: problem.category || problem.domain || "Public Infrastructure",
      domain: problem.category || problem.domain || "Public Infrastructure",
      createdAt: problem.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dateReported: new Date().toISOString().split('T')[0],
      supportersCount: problem.supportersCount || 1,
      verifiedCitizenSupporters: problem.supportersCount || 1,
      experiencedCount: problem.experiencedCount || 1,
      status: problem.status || 'Submitted',
      severity: problem.severity || 'High',
      assignedDepartment: problem.assignedDepartment || 'Pending Triage',
      slaStatus: problem.slaStatus || 'Within SLA',
      slaDaysRemaining: problem.slaDaysRemaining || 7,
      comments: problem.comments || [],
      location: problem.location || {
        district: districtName,
        block: blockName,
        panchayat: problem.panchayat || "Boreya",
        village: problem.village || "Boreya Basti",
        coordinates: { lat: 23.435, lng: 85.321 }
      },
      aiIntelligence: problem.aiIntelligence || {
        likelyDepartment: 'Drinking Water & Sanitation Department',
        confidenceScore: 0.88,
        recommendedPriority: 'HIGH',
        riskLevel: 'HIGH',
        aiSummary: 'Citizen reported civic infrastructure issue requiring ground inspection.'
      },
      citizenRealityCheck: problem.citizenRealityCheck || {
        citizenAgreedPercentage: 92,
        totalVotes: 14,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    this.data.problems.unshift(newProblem);
    this.saveData();
    return newProblem;
  }

  public supportProblem(id: string, type: 'SUPPORT' | 'EXPERIENCED_THIS'): any | undefined {
    this.reload();
    const p = this.getProblemById(id);
    if (!p) return undefined;
    if (type === 'SUPPORT') {
      p.supportersCount = (p.supportersCount || 0) + 1;
      p.verifiedCitizenSupporters = (p.verifiedCitizenSupporters || 0) + 1;
    } else {
      p.experiencedCount = (p.experiencedCount || 0) + 1;
    }
    p.updatedAt = new Date().toISOString();
    this.saveData();
    return p;
  }

  public addProblemComment(id: string, comment: any): any | undefined {
    const p = this.getProblemById(id);
    if (!p) return undefined;
    if (!Array.isArray(p.comments)) p.comments = [];
    p.comments.push({
      id: `c-${Date.now()}`,
      author: comment.author || 'Verified Citizen',
      role: comment.role || 'Resident',
      text: comment.text,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      official: Boolean(comment.official)
    });
    p.updatedAt = new Date().toISOString();
    this.saveData();
    return p;
  }

  // INTEGRITY / WHISTLEBLOWER
  public getIntegrityCases(): any[] {
    return this.data.integrityCases;
  }

  public getIntegrityCaseById(id: string): any | undefined {
    return this.data.integrityCases.find(c => c.id?.toLowerCase() === id.toLowerCase());
  }

  public addIntegrityCase(c: any): any {
    const newCase = {
      ...c,
      id: c.id || `INT-JH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supportingVerifiedReports: c.supportingVerifiedReports || 1,
      currentWorkflowStage: c.currentWorkflowStage || 'Initial Citizen Filing',
      status: c.status || 'Active Reports Gathering',
      createdAt: c.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      is10kAlertTriggered: false
    };
    this.data.integrityCases.unshift(newCase);
    this.saveData();
    return newCase;
  }

  public supportIntegrityCase(id: string): any | undefined {
    const target = this.getIntegrityCaseById(id);
    if (!target) return undefined;
    target.supportingVerifiedReports = (target.supportingVerifiedReports || 0) + 1;
    if (target.supportingVerifiedReports >= 10000 && !target.is10kAlertTriggered) {
      target.is10kAlertTriggered = true;
      target.status = 'Investigation Requested';
      target.currentWorkflowStage = 'Investigation Requested';
      target.alertTriggeredDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      target.publicConfidenceText = 'High public concern - 10,000+ verified citizen reports';
    }
    this.saveData();
    return target;
  }

  // COMMUNITY VERIFICATIONS
  public getVerifications(): any[] {
    return this.data.verifications;
  }

  public submitVerificationVote(id: string, vote: { decision: string; comment: string; evidenceUrl?: string; author?: string }): any | undefined {
    const target = this.data.verifications.find(v => v.id?.toLowerCase() === id.toLowerCase());
    if (!target) return undefined;
    
    target.totalVotes = (target.totalVotes || 0) + 1;
    if (vote.decision === 'CONFIRMED') target.confirmedCompletedCount = (target.confirmedCompletedCount || 0) + 1;
    if (vote.decision === 'PROBLEMS_FOUND') target.reportedProblemsCount = (target.reportedProblemsCount || 0) + 1;
    if (vote.decision === 'CANNOT_VERIFY') target.cannotVerifyCount = (target.cannotVerifyCount || 0) + 1;

    target.communityVerificationPercent = Math.round(((target.confirmedCompletedCount || 0) / target.totalVotes) * 100);

    if (!Array.isArray(target.userAudits)) target.userAudits = [];
    target.userAudits.unshift({
      id: `aud-${Date.now()}`,
      userMasked: vote.author || 'Verified Resident',
      decision: vote.decision,
      comment: vote.comment,
      evidenceUrl: vote.evidenceUrl,
      timestamp: 'Just now',
      verifiedAtLocation: true
    });

    this.saveData();
    return target;
  }

  // INFRASTRUCTURE ASSETS
  public getInfrastructure(): any[] {
    return this.data.infrastructure;
  }

  // NOTIFICATIONS
  public getNotifications(): any[] {
    return this.data.notifications;
  }

  public markNotificationRead(id: string): void {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData();
    }
  }

  public markAllNotificationsRead(): void {
    this.data.notifications.forEach(n => n.read = true);
    this.saveData();
  }

  // CITIZEN PROFILE
  public getCitizen(): any {
    return this.data.citizens[0] || CURRENT_CITIZEN;
  }
}

export const storage = new StorageEngine();
