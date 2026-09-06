import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { analyzeProblemContent, INITIAL_AI_STEPS, AIAnalysisResult, AIAnalysisStep } from '../../services/aiService';
import { Problem, ProblemCategory, ProblemSeverity, GeoLocation } from '../../types';
import { CATEGORIES } from '../home/LocalDashboard';
import {
  Mic,
  MicOff,
  MapPin,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  Layers,
  GraduationCap,
  Building,
  RefreshCw,
} from 'lucide-react';

export const ReportWizard: React.FC = () => {
  const { location, setActiveTab, navigateToProblem, triggerRefresh, language } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProblemCategory>('Roads & Transport');
  const [severity, setSeverity] = useState<ProblemSeverity>('High');
  const [whoIsAffected, setWhoIsAffected] = useState('Commuters, school children, and local farmers');
  const [affectedCountApprox, setAffectedCountApprox] = useState<number>(1200);

  // Step 2 Location State
  const [district, setDistrict] = useState(location.district);
  const [block, setBlock] = useState(location.block);
  const [panchayat, setPanchayat] = useState(location.panchayat);
  const [village, setVillage] = useState(location.village);
  const [landmark, setLandmark] = useState('Near Kanke Block Junction & Weekly Haat');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 23.4358, lng: 85.3214 });

  // Step 3 Evidence State
  const [evidences, setEvidences] = useState<
    Array<{
      id: string;
      name: string;
      type: 'photo' | 'video' | 'doc';
      url: string;
      gpsVerified: boolean;
      timestamp: string;
      size: string;
    }>
  >([
    {
      id: 'ev-1',
      name: 'Pothole_Damage_Chainage_2.4.jpg',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      gpsVerified: true,
      timestamp: 'Today, 08:45 AM',
      size: '2.4 MB',
    },
  ]);

  // Step 4 AI Processing State
  const [aiSteps, setAiSteps] = useState<AIAnalysisStep[]>(INITIAL_AI_STEPS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  // Simulated Voice Transcription
  const handleVoiceToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      // Simulate speech-to-text filling
      setTimeout(() => {
        const simulatedText =
          'The road connecting our village to the main market has developed large potholes and becomes dangerous during the monsoon. Several school children fell off bicycles last week.';
        setDescription((prev) => (prev ? `${prev} ${simulatedText}` : simulatedText));
        if (!title) {
          setTitle('Severe road damage and deep potholes on main village connecting road');
        }
        setIsRecordingVoice(false);
      }, 2400);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleUseMyLocation = () => {
    setDistrict('Ranchi');
    setBlock('Kanke');
    setPanchayat('Boreya');
    setVillage('Boreya Basti (Village X)');
    setCoordinates({ lat: 23.4358, lng: 85.3214 });
    setLandmark('GPS Lock: Near Boreya Primary School');
  };

  // Run AI analysis animation when entering Step 4
  const startAIAnalysis = () => {
    setCurrentStep(4);
    setIsAnalyzing(true);
    setAiSteps(INITIAL_AI_STEPS.map((s) => ({ ...s, completed: false })));

    const result = analyzeProblemContent(title, description, category, village);
    setAiResult(result);

    // Progressively tick off steps
    INITIAL_AI_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setAiSteps((prev) => prev.map((s, i) => (i <= idx ? { ...s, completed: true } : s)));
        if (idx === INITIAL_AI_STEPS.length - 1) {
          setIsAnalyzing(false);
        }
      }, (idx + 1) * 350);
    });
  };

  // Final Submission Handler
  const handleFinalSubmit = (asSeparate: boolean = true) => {
    const newId = `JH-RNC-${block.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000).toString().slice(-6)}`;
    const newProblem: Problem = {
      id: newId,
      title: title || 'Reported Community Issue',
      description: description || 'No detailed description provided.',
      category: category,
      severity: severity,
      affectedPopulationText: whoIsAffected,
      affectedCountApprox: affectedCountApprox,
      location: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        district,
        block,
        panchayat,
        village,
        landmark,
      },
      reportedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reporterMasked: 'Rameshwar Murmu (Citizen #883921)',
      stage: 'AI Triaged',
      isGovernmentVerified: false,
      supportersCount: 1,
      experiencedCount: 1,
      clusterId: aiResult?.clusterCandidate ? aiResult.clusterCandidate.clusterId : undefined,
      clusterName: aiResult?.clusterCandidate ? aiResult.clusterCandidate.clusterName : undefined,
      responsibleDepartment: aiResult?.responsibleAuthority || 'District Administration',
      evidences: evidences.map((ev) => ({
        id: ev.id,
        type: 'image',
        url: ev.url,
        timestamp: ev.timestamp,
        caption: ev.name,
        verifiedGps: { latitude: coordinates.lat, longitude: coordinates.lng, matchesReportLocation: true },
        fileHashVerified: true,
      })),
      aiTriage: {
        confidence: aiResult?.confidence || 94,
        suggestedSeverity: aiResult?.severity || severity,
        similarReportsCount: aiResult?.similarReportsCount || 7,
        recommendedDepartment: aiResult?.responsibleAuthority || 'Rural Works Department',
        potentialUniversityDisciplines: aiResult?.potentialUniversityDisciplines || ['Civil Engineering', 'GIS Mapping'],
        clusterCandidate: aiResult?.clusterCandidate?.clusterName,
        generatedSummary: aiResult?.executiveSummary || 'Automated triage completed successfully.',
      },
    };

    apiService.createProblem(newProblem);
    triggerRefresh();
    navigateToProblem(newId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Wizard Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Wizard Header Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
              Citizen Reporting Wizard • Smart Triage
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
              {language === 'hi' ? 'सामुदायिक समस्या दर्ज करें' : 'Report a Community Problem'}
            </h2>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  stepNum === currentStep
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : stepNum < currentStep
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {stepNum < currentStep ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
              </div>
            ))}
          </div>
        </div>

        {/* Step Progress Labels */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 text-xs text-slate-500 font-medium flex items-center justify-between">
          <span className="font-bold text-slate-800">
            {currentStep === 1 && 'Step 1: What is the problem?'}
            {currentStep === 2 && 'Step 2: Where is the problem?'}
            {currentStep === 3 && 'Step 3: Add photographic & sensor evidence'}
            {currentStep === 4 && 'Step 4: AI Triage & Problem Intelligence'}
            {currentStep === 5 && 'Step 5: Duplicate & Cluster Matching'}
          </span>
          <span className="text-[11px] text-slate-400">Step {currentStep} of 5</span>
        </div>

        {/* ========================================================= */}
        {/* STEP 1: WHAT IS THE PROBLEM? */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="p-6 space-y-6 animate-fade-in">
            {/* Voice Input Strip */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                  <Mic className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'hi' ? 'बोलकर दर्ज करें' : 'Describe by Voice (Assisted Input)'}</span>
                </h4>
                <p className="text-xs text-emerald-800">
                  {language === 'hi'
                    ? 'अपनी भाषा में बोलें। AI स्वचालित रूप से विवरण को पाठ में बदलेगा।'
                    : 'Click to dictate in Hindi or English. Voice is automatically transcribed.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-rose-600 text-white animate-pulse shadow-md'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecordingVoice ? 'Listening & Transcribing...' : '🎙 Describe by Voice'}</span>
              </button>
            </div>

            {/* Problem Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Problem Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Severe road deterioration and dangerous crater potholes on Kanke to Boreya Market Road"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Detailed Description *
                </label>
                <span className="text-[11px] text-slate-400">Editable transcription</span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is broken, how long it has been in this condition, and what risks it poses to the community..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
              />
            </div>

            {/* Category & Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProblemCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Estimated Severity *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as ProblemSeverity)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Critical">Critical (Immediate danger to life / complete utility shutdown)</option>
                  <option value="High">High (Major public impediment / safety hazard)</option>
                  <option value="Medium">Medium (Moderate recurring inconvenience)</option>
                  <option value="Low">Low (Minor aesthetic or preventive repair)</option>
                </select>
              </div>
            </div>

            {/* Who is affected & population count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Who is Affected? *
                </label>
                <input
                  type="text"
                  value={whoIsAffected}
                  onChange={(e) => setWhoIsAffected(e.target.value)}
                  placeholder="e.g., School children, vegetable farmers, patients visiting PHC"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Approx Affected People
                </label>
                <input
                  type="number"
                  value={affectedCountApprox}
                  onChange={(e) => setAffectedCountApprox(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: WHERE IS THE PROBLEM? */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Precise Geographic Location
                </h3>
                <p className="text-xs text-slate-500">
                  Problems are catalogued geographically to route them to the relevant Block & Panchayat.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseMyLocation}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-emerald-300 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>Use My GPS Location</span>
              </button>
            </div>

            {/* Simulated Interactive Map Display */}
            <div className="relative w-full h-52 bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
              <div
                className="absolute inset-0 opacity-40 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]"
              />
              <div className="relative z-10 text-center space-y-1.5 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-300 shadow-sm">
                <div className="inline-flex p-2 rounded-full bg-rose-500 text-white shadow-md animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Coordinates: {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
                </div>
                <div className="text-[11px] text-emerald-800 font-medium">
                  {block} Block • {panchayat} Panchayat • {village}
                </div>
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Block / Tehsil
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Panchayat / ULB
                </label>
                <input
                  type="text"
                  value={panchayat}
                  onChange={(e) => setPanchayat(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Village / Ward / Toli
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Landmark / Specific Location
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g., Near Boreya Primary High School & Weekly Market Ground"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>Add Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: ADD EVIDENCE */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="p-6 space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Photographic & Document Evidence
              </h3>
              <p className="text-xs text-slate-500">
                Ground evidence validates the challenge for Panchayat Officers and University researchers.
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 bg-emerald-50/40 text-center space-y-3 cursor-pointer transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPG, PNG, MP4 videos, PDF surveys & audio recordings (Max 25 MB)
                </p>
              </div>

              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Automatic EXIF Geotag Extraction & Integrity Hash</span>
              </div>
            </div>

            {/* Evidence Previews with GPS Metadata simulation */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Attached Evidence Files ({evidences.length})
              </span>

              {evidences.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={ev.url}
                      alt={ev.name}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-300 shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{ev.name}</h5>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                        <span>{ev.size}</span>
                        <span>•</span>
                        <span>{ev.timestamp}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          ✓ GPS: {coordinates.lat}° N, {coordinates.lng}° E
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-1 rounded-lg shrink-0">
                    Hash Verified
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={startAIAnalysis}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Submit for AI Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: AI ANALYSIS & PROBLEM INTELLIGENCE CARD */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <div className="p-6 space-y-6 animate-fade-in">
            {/* Animated Triage Checklist */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
                    {isAnalyzing ? 'Analyzing your report...' : 'AI Triage Complete'}
                  </span>
                </div>
                {isAnalyzing && (
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {aiSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-2 text-xs transition-opacity duration-300 ${
                      step.completed ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Problem Intelligence Card */}
            {aiResult && !isAnalyzing && (
              <div className="bg-emerald-50/50 rounded-2xl p-6 border-2 border-emerald-300/80 shadow-sm space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        AI Problem Intelligence Card
                      </h4>
                      <p className="text-[11px] text-emerald-800">
                        Confidence Score: <strong>{aiResult.confidence}%</strong> • Spatial Heuristics
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Requires Human / Gov Validation
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
                    <span className="font-bold text-slate-900">{aiResult.category}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Severity</span>
                    <span className="font-bold text-rose-700">{aiResult.severity}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Pop.</span>
                    <span className="font-bold text-slate-900">{aiResult.affectedPopulationEstimate}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Similar Reports</span>
                    <span className="font-bold text-blue-700">{aiResult.similarReportsCount} nearby</span>
                  </div>
                </div>

                {/* Responsible Authority & Disciplines */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Likely Responsible Authority
                    </span>
                    <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <Building className="w-4 h-4 text-emerald-700" />
                      <span>{aiResult.responsibleAuthority}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Potential University Expertise Disciplines
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiResult.potentialUniversityDisciplines.map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-semibold flex items-center space-x-1"
                        >
                          <GraduationCap className="w-3 h-3 text-blue-700" />
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {aiResult.matchedContractAsset && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 space-y-1">
                      <span className="text-[10px] text-amber-900 font-bold uppercase block">
                        Linked Public Asset & Active Guarantee
                      </span>
                      <p className="text-xs text-amber-950 font-bold">
                        {aiResult.matchedContractAsset.assetName} (Contractor: {aiResult.matchedContractAsset.contractorName})
                      </p>
                      <p className="text-[11px] text-amber-800">
                        Active 5-year defect liability warranty detected. Contractor has a 30-day statutory repair obligation.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 italic">
                  * Note: AI recommendations and discipline suggestions are advisory and require human and government department verification.
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>Check Duplicates & Clusters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: DUPLICATE / RELATED PROBLEM DETECTION & SUBMIT */}
        {/* ========================================================= */}
        {currentStep === 5 && (
          <div className="p-6 space-y-6 animate-fade-in">
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>We found similar reports near you.</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                7 similar reports were found within 2.4 km in <strong>{location.block} Block</strong>. Rather than rejecting your submission, our platform can cluster your report to strengthen collective community advocacy!
              </p>

              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Detected Problem Cluster</span>
                <h4 className="text-xs font-bold text-slate-900">
                  “Kanke Rural Road Damage Cluster”
                </h4>
                <p className="text-[11px] text-slate-600">
                  Covering 4.6 km stretch • 487 verified citizen supporters • Under defect liability review
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Choose How to Proceed:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => handleFinalSubmit(false)}
                  className="p-4 bg-emerald-50 hover:bg-emerald-100/70 border-2 border-emerald-400 rounded-2xl cursor-pointer transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                      Recommended
                    </span>
                    <h5 className="text-sm font-bold text-emerald-950">
                      Join Existing Problem Cluster
                    </h5>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Merges your photos and testimony into the 487-citizen collective report to accelerate government inspection.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Join Existing Problem Cluster
                  </button>
                </div>

                <div
                  onClick={() => handleFinalSubmit(true)}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-2xl cursor-pointer transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                      Independent
                    </span>
                    <h5 className="text-sm font-bold text-slate-900">
                      Submit as Separate Problem
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Creates a distinct new ticket with its own independent SLA, tracking ID and Panchayat verification queue.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Submit as Separate Problem
                  </button>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4 border-t border-slate-200 flex justify-start">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to AI Assessment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
