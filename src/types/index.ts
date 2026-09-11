/**
 * JanaSamadhan - Jharkhand Societal Innovation & Accountability Platform
 * Monorepo-ready Core Domain Models
 * Designed to be extracted into @packages/types
 */

// ==========================================
// 1. GEOGRAPHIC & ADMINISTRATIVE TYPES
// ==========================================

export interface State {
  id: string;
  name: string;
  nameHi: string;
  code: string; // e.g. "JH"
}

export interface District {
  id: string;
  stateId: string;
  name: string;
  nameHi: string;
  code: string; // e.g. "RNC"
  headquarters: string;
}

export interface Block {
  id: string;
  districtId: string;
  name: string;
  nameHi: string;
  code: string; // e.g. "KNK"
  totalPanchayats: number;
}

export interface Panchayat {
  id: string;
  blockId: string;
  name: string;
  nameHi: string;
  type: 'Panchayat' | 'ULB'; // Gram Panchayat or Urban Local Body
}

export interface Village {
  id: string;
  panchayatId: string;
  name: string;
  nameHi: string;
  type: 'Village' | 'Ward';
  pincode: string;
  approxPopulation?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  addressText?: string;
  district: string;
  block: string;
  panchayat: string;
  village: string;
  landmark?: string;
}

// ==========================================
// 2. CITIZEN & COMMUNITY TYPES
// ==========================================

export interface Citizen {
  id: string;
  name: string;
  phoneMasked: string; // e.g. "+91 98*** **412"
  isVerified: boolean;
  verificationMethod?: 'JanAadhaar_Token' | 'Mobile_OTP' | 'Panchayat_Voter_ID';
  residence: {
    district: string;
    block: string;
    panchayat: string;
    village: string;
  };
  badges: Array<{
    id: string;
    title: string;
    icon: string;
    description: string;
    earnedDate: string;
  }>;
  reputationScore: number;
}

// ==========================================
// 3. PROBLEM & CHALLENGE TYPES
// ==========================================

export type ProblemCategory =
  | 'Roads & Transport'
  | 'Water Resources'
  | 'Sanitation'
  | 'Healthcare'
  | 'Education'
  | 'Agriculture'
  | 'Environment'
  | 'Energy'
  | 'Urban Development'
  | 'Accessibility'
  | 'Public Administration'
  | 'Rural Livelihoods'
  | 'Infrastructure'
  | 'Public Services'
  | 'Other';

export type ProblemSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ProblemStage =
  | 'Submitted'
  | 'AI Triaged'
  | 'Community Validated'
  | 'Government Verified'
  | 'Published as Challenge'
  | 'Problem Statement Refined'
  | 'Assigned to University / Industry / Contractor'
  | 'Assigned to University/Industry'
  | 'Research / Solution in Progress'
  | 'Project Started'
  | 'Pilot Deployed'
  | 'Field Pilot'
  | 'Citizen Verification'
  | 'Closed / Resolved'
  | 'Completed';

export interface ProblemEvidence {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  caption?: string;
  timestamp: string;
  verifiedGps?: {
    latitude: number;
    longitude: number;
    matchesReportLocation: boolean;
  };
  fileHashVerified?: boolean;
}

export interface ProblemVote {
  userId: string;
  voteType: 'SUPPORT' | 'EXPERIENCED_THIS';
  timestamp: string;
  userVillage?: string;
}

export interface ProblemCluster {
  id: string;
  name: string;
  category: ProblemCategory;
  primaryBlock: string;
  totalLinkedProblems: number;
  radiusKm: number;
  centerCoordinates: [number, number];
}

export interface Problem {
  id: string; // e.g. "JH-RNC-KNK-000184"
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  category: ProblemCategory;
  severity: ProblemSeverity;
  affectedPopulationText: string;
  affectedCountApprox: number;
  location: GeoLocation;
  reportedDate: string;
  /** API-compatible fields retained for reports and tracker views. */
  createdAt?: string;
  status?: string;
  reporterId?: string;
  reporterName?: string;
  reporterMasked: string;
  stage: ProblemStage;
  isGovernmentVerified: boolean;
  supportersCount: number;
  experiencedCount: number;
  evidences: ProblemEvidence[];
  clusterId?: string;
  clusterName?: string;
  responsibleDepartment: string;
  matchedAssetId?: string; // Linked road or water facility asset
  associatedProjectId?: string;
  linkedProjectId?: string;
  contractorMatch?: {
    id: string;
    name: string;
    contractId: string;
    defectLiabilityEndDate: string;
    status: string;
    statutoryNoticeServedDate?: string;
    statutoryNoticeDeadline?: string;
  };
  comments?: Array<{
    id: string;
    author: string;
    role: string;
    date: string;
    text: string;
    official: boolean;
  }>;
  aiTriage: {
    confidence: number;
    suggestedSeverity: ProblemSeverity;
    similarReportsCount: number;
    recommendedDepartment: string;
    potentialUniversityDisciplines: string[];
    clusterCandidate?: string;
    generatedSummary: string;
  };
}

// ==========================================
// 4. INFRASTRUCTURE & CONTRACTOR TYPES
// ==========================================

export interface Contractor {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  rating: number; // 1 to 5
  activeProjects: number;
  pastDefectsResolved: number;
  currentNonComplianceCount: number;
}

export interface ContractObligation {
  id: string;
  description: string;
  guaranteeYears: number;
  defectLiabilityEndDate: string;
  repairDeadlineDays: number; // e.g. must fix within 30 days of notice
}

export interface Contract {
  id: string;
  contractNumber: string;
  assetId: string;
  assetName: string;
  contractor: Contractor;
  projectValueInr: number;
  completionDate: string;
  defectLiabilityEndDate: string;
  defectLiabilityYears?: number;
  status: 'Active_Liability' | 'Warranty_Expired' | 'Default_Notice_Issued';
  supervisingDepartment: string;
  department?: string;
  supervisingOfficerMasked: string;
  repairObligationDays: number;
  statutoryNoticeServedDate?: string;
  statutoryNoticeDeadline?: string;
}

export type AssetRepairStatus =
  | 'No_Defects'
  | 'Contractor_Notified'
  | 'Repair_In_Progress'
  | 'Repair_Deadline_Missed'
  | 'Repair_Notice_Expired'
  | 'Escalated_To_Vigilance';

export interface InfrastructureAsset {
  id: string; // e.g. "ASSET-RD-KNK-042"
  name: string;
  type: 'Road' | 'Water Tank' | 'School Building' | 'Primary Health Centre' | 'Solar Mini-Grid' | 'Panchayat Bhavan';
  location: GeoLocation;
  lengthKm?: number;
  contract: Contract;
  lastInspectionDate: string;
  currentCondition: 'Good' | 'Fair' | 'Damaged' | 'Critical Failure';
  activeDefectReportId?: string;
  defectReportedDate?: string;
  contractorNotifiedDate?: string;
  repairDeadlineDate?: string;
  repairStatus: AssetRepairStatus;
  linkedProblemId?: string;
  inspectionLogs?: Array<{
    id?: string;
    date: string;
    inspector: string;
    findings?: string;
    notes?: string;
    status?: string;
    result?: string;
  }>;
}

export type Asset = InfrastructureAsset;

// ==========================================
// 5. UNIVERSITY, INDUSTRY & PROJECT TYPES
// ==========================================

export interface UniversityPartner {
  id: string;
  name: string;
  shortName: string; // e.g. "BIT Mesra", "IIT ISM Dhanbad", "NIT Jamshedpur", "Ranchi University"
  city: string;
  facultyMentor: string;
  studentTeamLead: string;
  department: string;
  labName: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  type: 'Startup' | 'MSME' | 'CSR Organization' | 'Incubator';
  focus: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  completedDate?: string;
  evidenceUrl?: string;
}

export const TRL_DEFINITIONS: Record<number, { title: string; desc: string }> = {
  1: { title: 'TRL 1: Basic Principles Observed', desc: 'Scientific research begins to be translated into applied R&D.' },
  2: { title: 'TRL 2: Technology Concept Formulated', desc: 'Practical applications invented and preliminary design conceptualized.' },
  3: { title: 'TRL 3: Proof of Concept', desc: 'Active R&D initiated. Analytical and laboratory studies physically validate predictions.' },
  4: { title: 'TRL 4: Lab Validation', desc: 'Basic technological components tested in a controlled laboratory environment.' },
  5: { title: 'TRL 5: Relevant Environment Validation', desc: 'Basic technological components tested in a simulated/relevant field environment.' },
  6: { title: 'TRL 6: Prototype Tested in Relevant Environment', desc: 'Engineering-scale prototype model tested in representative field conditions.' },
  7: { title: 'TRL 7: Prototype Demonstrated in Field', desc: 'Prototype near or at planned operational scale demonstrated in target rural/urban environment.' },
  8: { title: 'TRL 8: System Complete & Qualified', desc: 'Technology proven to work in final form and under full operational parameters.' },
  9: { title: 'TRL 9: Full Operational Deployment', desc: 'Actual system proven and field-deployed across Jharkhand communities.' },
};

export interface Project {
  id: string; // e.g. "PRJ-JH-2026-089"
  problemId: string;
  title: string;
  problemTitle: string;
  locationSummary: string;
  trl: number; // Technology Readiness Level 1 to 9
  trlStageName: string;
  university: UniversityPartner;
  industryPartner?: IndustryPartner;
  governmentDepartment: string;
  startedDate: string;
  targetDeploymentDate: string;
  currentMilestoneIndex: number;
  milestones: ProjectMilestone[];
  budgetInr: number;
  fundingSource: string;
  summary: string;
  pilotResults?: string;
  citizenVerificationOpen: boolean;
}

// ==========================================
// 6. CITIZEN VERIFICATION OF COMPLETED WORK
// ==========================================

export interface WorkVerificationAudit {
  id: string;
  projectId: string;
  assetId?: string;
  title: string;
  departmentClaimedCompletionDate: string;
  officialCompletionPercent: number; // 100%
  communityVerificationPercent: number; // e.g. 61%
  evidenceConfidencePercent: number; // e.g. 72%
  status: 'Verification_Open' | 'Community_Verified_Complete' | 'Defects_Reported_Audit_Required';
  totalVotes: number;
  confirmedCompletedCount: number;
  reportedProblemsCount: number;
  cannotVerifyCount: number;
  userAudits: Array<{
    id: string;
    userMasked: string;
    decision: 'CONFIRMED' | 'PROBLEMS_FOUND' | 'CANNOT_VERIFY';
    comment: string;
    evidenceUrl?: string;
    timestamp: string;
    verifiedAtLocation: boolean;
  }>;
}

// ==========================================
// 7. INTEGRITY & ANTI-CORRUPTION TYPES
// ==========================================

export type IntegrityConcernType =
  | 'Bribe demanded'
  | 'Extra payment demanded for a free service'
  | 'Service intentionally delayed'
  | 'Service denied'
  | 'Officer misconduct'
  | 'Fake completion'
  | 'Contract non-compliance'
  | 'Other integrity concern';

export type IntegrityStatus =
  | 'Submitted'
  | 'Assigned'
  | 'Response pending'
  | 'Response received'
  | 'Investigation Requested'
  | 'Under investigation'
  | 'Escalated'
  | 'Resolved';

export interface IntegrityCase {
  id: string; // e.g. "INT-RNC-KNK-004821"
  trackingPinHash: string; // secure pin for citizen tracking
  title: string;
  concernType: IntegrityConcernType;
  department: string;
  officeOrScheme: string;
  incidentLocation: GeoLocation;
  submittedDate: string;
  slaDeadline: string; // 24-hour SLA
  slaRemainingHours: number;
  slaBreached: boolean;
  isAnonymous: boolean;
  status: IntegrityStatus;
  supportingVerifiedReports: number;
  disputingReports: number;
  publicConfidenceText: string;
  is10kAlertTriggered: boolean;
  alertTriggeredDate?: string;
  currentWorkflowStage:
    | 'Citizen Concern Filed'
    | 'Investigation Requested'
    | 'Preliminary Inquiry'
    | 'Evidence Review'
    | 'Competent Authority Decision'
    | 'Disciplinary Action / Closure';
  governmentResponseSummary?: string;
  authorityActionSummary?: string;
  history: Array<{
    stage: string;
    timestamp: string;
    note: string;
  }>;
}

// ==========================================
// 8. STATE ACCOUNTABILITY & AUDIT RECORD
// ==========================================

export interface AccountabilityRecord {
  id: string;
  entityName: string; // Contractor or Office
  entityType: 'Contractor' | 'Department Agency' | 'Supplier';
  location: string;
  projectName: string;
  issueType: string;
  contractualDeadline: string;
  status: 'Verified unresolved' | 'Penalty Imposed' | 'Blacklisted' | 'Rectification In Progress';
  escalationLevel: 'District Authority' | 'State Vigilance Bureau' | 'Public Works Department';
  evidenceTimeline: Array<{
    date: string;
    event: string;
    verifiedBy: string;
  }>;
}

// ==========================================
// 9. NOTIFICATION TYPE
// ==========================================

export interface CitizenNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'verification' | 'assignment' | 'milestone' | 'sla' | 'alert' | 'work_ready';
  read: boolean;
  linkTab?: string;
  referenceId?: string;
}
