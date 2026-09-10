import fs from 'fs';
import path from 'path';
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

const SHARED_DIR = path.resolve(process.cwd(), '..', 'shared_data');
const LOCAL_DIR = path.resolve(process.cwd(), 'data');
const SHARED_FILE = path.join(SHARED_DIR, 'governance_store.json');
const LOCAL_FILE = path.join(LOCAL_DIR, 'db.json');

class StorageEngine {
  private data: CitizenStoreData;
  private filePath: string;

  constructor() {
    // Prefer shared store if in multi-portal folder, otherwise local
    if (fs.existsSync(SHARED_DIR) || fs.existsSync(path.resolve(process.cwd(), '..', 'Government_Command_Jharkhand'))) {
      if (!fs.existsSync(SHARED_DIR)) {
        try { fs.mkdirSync(SHARED_DIR, { recursive: true }); } catch (e) {}
      }
      this.filePath = SHARED_FILE;
    } else {
      if (!fs.existsSync(LOCAL_DIR)) {
        try { fs.mkdirSync(LOCAL_DIR, { recursive: true }); } catch (e) {}
      }
      this.filePath = LOCAL_FILE;
    }

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

    // Initialize with rich seed data
    const initial: CitizenStoreData = {
      citizens: [CURRENT_CITIZEN],
      problems: PROBLEMS_DATA,
      projects: PROJECTS_DATA,
      infrastructure: INFRASTRUCTURE_ASSETS,
      integrityCases: INTEGRITY_CASES,
      verifications: WORK_VERIFICATIONS,
      accountability: ACCOUNTABILITY_RECORDS,
      notifications: INITIAL_NOTIFICATIONS,
    };

    this.saveData(initial);
    return initial;
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
    let list = [...this.data.problems];
    if (filter?.district && filter.district !== 'All') {
      list = list.filter(p => p.location?.district?.toLowerCase() === filter.district?.toLowerCase());
    }
    if (filter?.category && filter.category !== 'All') {
      list = list.filter(p => p.category?.toLowerCase() === filter.category?.toLowerCase());
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
        (p.location?.village && p.location.village.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getProblemById(id: string): any | undefined {
    return this.data.problems.find(p => p.id?.toLowerCase() === id.toLowerCase());
  }

  public addProblem(problem: any): any {
    const newProblem = {
      ...problem,
      id: problem.id || `JH-PRB-${Date.now().toString().slice(-6)}`,
      createdAt: problem.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      supportersCount: problem.supportersCount || 1,
      experiencedCount: problem.experiencedCount || 1,
      status: problem.status || 'SUBMITTED',
      severity: problem.severity || 'High',
      comments: problem.comments || [],
      location: problem.location || {
        district: "Ranchi",
        block: "Kanke",
        panchayat: "Boreya",
        village: "Boreya Basti",
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
    const p = this.getProblemById(id);
    if (!p) return undefined;
    if (type === 'SUPPORT') {
      p.supportersCount = (p.supportersCount || 0) + 1;
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
