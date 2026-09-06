/**
 * JanaSamadhan - AI Problem Intelligence Service
 * Handles multi-step triage, clustering, severity estimation,
 * authority routing, and university discipline matching.
 */

import { ProblemCategory, ProblemSeverity } from '../types';

export interface AIAnalysisStep {
  id: string;
  label: string;
  completed: boolean;
}

export interface AIAnalysisResult {
  category: ProblemCategory;
  problemType: string;
  severity: ProblemSeverity;
  affectedPopulationEstimate: string;
  confidence: number;
  similarReportsCount: number;
  clusterCandidate?: {
    clusterId: string;
    clusterName: string;
    distanceKm: number;
    count: number;
  };
  responsibleAuthority: string;
  potentialUniversityDisciplines: string[];
  matchedContractAsset?: {
    assetId: string;
    assetName: string;
    contractorName: string;
    liabilityActive: boolean;
  };
  executiveSummary: string;
}

export const INITIAL_AI_STEPS: AIAnalysisStep[] = [
  { id: 'transcribe', label: 'Transcribing & Voice Normalization', completed: false },
  { id: 'category', label: 'Identifying Civic Domain Category', completed: false },
  { id: 'geo', label: 'Checking Spatial Coordinates & Jurisdiction', completed: false },
  { id: 'search', label: 'Searching Similar Problems & Spatial Buffer', completed: false },
  { id: 'duplicate', label: 'Detecting Duplicates & Cluster Membership', completed: false },
  { id: 'severity', label: 'Estimating Community Severity & Vulnerability', completed: false },
  { id: 'authority', label: 'Identifying Responsible Government Department', completed: false },
  { id: 'partners', label: 'Finding Potential University & Industry Research Partners', completed: false },
];

/**
 * Deterministic analysis engine tailored for SIH demo with realistic heuristics
 */
export function analyzeProblemContent(
  title: string,
  description: string,
  categoryHint: string,
  villageName: string
): AIAnalysisResult {
  const combined = `${title} ${description} ${categoryHint} ${villageName}`.toLowerCase();

  // 1. Road / Pothole / Infrastructure detection
  if (combined.includes('road') || combined.includes('pothole') || combined.includes('सड़क') || combined.includes('गड्ढे') || combined.includes('tar') || combined.includes('bridge')) {
    return {
      category: 'Roads & Transport',
      problemType: 'Surface Asphalt Delamination & Structural Potholes',
      severity: 'High',
      affectedPopulationEstimate: '~8,500 commuters & village residents',
      confidence: 96,
      similarReportsCount: 7,
      clusterCandidate: {
        clusterId: 'CLUS-KNK-RD-01',
        clusterName: 'Kanke Rural Road Damage Cluster',
        distanceKm: 2.4,
        count: 7,
      },
      responsibleAuthority: 'Rural Works Department (RWD), Ranchi Division',
      potentialUniversityDisciplines: [
        'Civil & Structural Engineering',
        'Transportation GIS Mapping',
        'Pavement Material Science & Aggregate Testing',
      ],
      matchedContractAsset: {
        assetId: 'ASSET-RD-KNK-042',
        assetName: 'Kanke Block to Boreya Basti Road (ODR-14)',
        contractorName: 'ABC Infrastructure & Developers Pvt. Ltd.',
        liabilityActive: true,
      },
      executiveSummary:
        'AI detected structural asphalt detachment on a recently paved rural road asset. Spatial clustering matched 7 other verified citizen submissions within 2.4 km. Active defect liability warranty exists until March 2030.',
    };
  }

  // 2. Water table / Arsenic / Contamination
  if (combined.includes('water') || combined.includes('borewell') || combined.includes('handpump') || combined.includes('पानी') || combined.includes('arsenic') || combined.includes('चापाकल')) {
    return {
      category: 'Water Resources',
      problemType: 'Groundwater Table Depletion & Heavy Mineral Contamination',
      severity: 'Critical',
      affectedPopulationEstimate: '~2,400 village residents',
      confidence: 94,
      similarReportsCount: 12,
      clusterCandidate: {
        clusterId: 'CLUS-SKH-WT-02',
        clusterName: 'Kanke Sub-Basin Groundwater Contamination Cluster',
        distanceKm: 3.1,
        count: 12,
      },
      responsibleAuthority: 'Drinking Water & Sanitation Department (DWSD)',
      potentialUniversityDisciplines: [
        'Environmental Chemical Engineering (BIT Mesra)',
        'Hydrogeology & Aquifer Modeling',
        'IoT Telemetric Sensor Networks',
      ],
      matchedContractAsset: {
        assetId: 'ASSET-WT-SKH-019',
        assetName: 'Sukurhutu Deep Borewell & Solar Overhead Tank',
        contractorName: 'Pragati Aqua Solutions & Infra Ltd.',
        liabilityActive: true,
      },
      executiveSummary:
        'Report indicates acute water distress combined with potential mineral toxicity. Matched with active Smart India Hackathon research initiative under BIT Mesra Water Quality Lab.',
    };
  }

  // 3. Agriculture / Cold storage / Crop rot
  if (combined.includes('crop') || combined.includes('vegetable') || combined.includes('cold storage') || combined.includes('टमाटर') || combined.includes('सब्जी') || combined.includes('farmer')) {
    return {
      category: 'Agriculture',
      problemType: 'Post-Harvest Spoilage & Cold Chain Deficit',
      severity: 'High',
      affectedPopulationEstimate: '~1,800 marginal vegetable farmers',
      confidence: 92,
      similarReportsCount: 5,
      responsibleAuthority: 'Department of Agriculture, Animal Husbandry & Co-operative',
      potentialUniversityDisciplines: [
        'Renewable Thermal Refrigeration (NIT Jamshedpur)',
        'Phase-Change Material Systems',
        'Agricultural Economics & Cooperative Logistics',
      ],
      executiveSummary:
        'High harvest glut perishability detected. Recommends decentralized solar micro-cold rooms to bypass distant mandi cartels.',
    };
  }

  // 4. Default / General civic case
  return {
    category: (categoryHint as ProblemCategory) || 'Public Services',
    problemType: 'Community Infrastructure & Public Service Challenge',
    severity: 'Medium',
    affectedPopulationEstimate: '~1,200 local residents',
    confidence: 90,
    similarReportsCount: 3,
    responsibleAuthority: 'District Administration / Block Development Office',
    potentialUniversityDisciplines: ['Rural Technology Development', 'Data Science & Public Policy', 'Sustainable Civil Infrastructure'],
    executiveSummary:
      'Report processed and spatial coordinates validated. Geotagged evidence ready for Panchayat Officer on-ground verification.',
  };
}
