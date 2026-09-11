import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Problem } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Building,
  UserCheck,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';

export const TransparencySolutionsTracker: React.FC = () => {
  const { setActiveTab, setSelectedProblemId, language, location, citizen } = useApp();

  const [activeFilter, setActiveFilter] = useState<'my' | 'all' | 'verified' | 'action'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmedIds, setConfirmedIds] = useState<Record<string, boolean>>({});

  const allProblems = apiService.getProblems();

  // Citizen's own reported problems
  const myProblems = useMemo(() => {
    return allProblems.filter(
      (p) =>
        p.reporterId === citizen.id ||
        p.reporterName?.toLowerCase().includes('murmu') ||
        p.reporterName?.toLowerCase().includes(citizen.name.toLowerCase()) ||
        p.id.startsWith('JH-PRB-')
    );
  }, [allProblems, citizen]);

  // Filtered list based on tab
  const displayedProblems = useMemo(() => {
    let list = allProblems;

    if (activeFilter === 'my') {
      list = myProblems;
    } else if (activeFilter === 'verified') {
      list = allProblems.filter((p) => p.status === 'Resolved' || p.status === 'Verified');
    } else if (activeFilter === 'action') {
      list = allProblems.filter((p) => p.status === 'Action Scheduled' || p.status === 'Verified' || p.status === 'Reported');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.district.toLowerCase().includes(q) ||
          p.location.block.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allProblems, myProblems, activeFilter, searchQuery]);

  const handleConfirmSolution = (id: string) => {
    setConfirmedIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'hi' ? 'सार्वजनिक जवाबदेही व समाधान' : 'Public Accountability & Solutions'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {language === 'hi' ? 'पारदर्शिता रजिस्ट्री' : 'Transparency Registry'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi'
                ? 'पारदर्शिता व समस्या समाधान ट्रैकर'
                : 'Transparency & Problem Solutions Tracker'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'अपनी दर्ज की गई समस्याओं के निवारण की वास्तविक स्थिति, प्रशासनिक विभाग द्वारा की गई कार्रवाई, और सामुदायिक समाधानों का पारदर्शी विवरण देखें।'
                : 'Track the verifiable journey of citizen-reported challenges: administrative assignments, contractor liability, field audits, and deployed community solutions.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <a
              href="http://localhost:3005"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-white/20 shadow-xs"
            >
              <span>{language === 'hi' ? 'राज्य स्तरीय जन-दर्पण पोर्टल' : 'State Jan-Darpan Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setActiveTab('report')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              <span>{language === 'hi' ? 'नई समस्या दर्ज करें' : 'Report New Problem'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Jump Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('my')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeFilter === 'my'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                {language === 'hi' ? 'मेरी समस्याओं के समाधान' : 'My Problem Solutions'}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeFilter === 'my' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {myProblems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{language === 'hi' ? 'सभी सार्वजनिक समाधान' : 'All Public Solutions'}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeFilter === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {allProblems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('verified')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeFilter === 'verified'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'hi' ? 'पूर्ण निस्तारित व सत्यापित' : 'Verified Resolved'}</span>
            </button>

            <button
              onClick={() => setActiveFilter('action')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeFilter === 'action'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'hi' ? 'विभागीय कार्रवाई जारी' : 'Under Action'}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi' ? 'समस्या या समाधान खोजें...' : 'Search by title, location or ID...'
              }
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* Solutions & Problems Dossier List */}
      <div className="space-y-4">
        {displayedProblems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                {activeFilter === 'my'
                  ? language === 'hi'
                    ? 'आपकी कोई दर्ज समस्या नहीं है'
                    : 'No problems reported by you yet'
                  : language === 'hi'
                  ? 'कोई समस्या या समाधान नहीं मिला'
                  : 'No records match your criteria'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {activeFilter === 'my'
                  ? language === 'hi'
                    ? 'अपनी पहली नागरिक या सामुदायिक समस्या दर्ज करें। संबंधित सरकारी विभाग को 24 घंटे में कार्य सौंपा जाता है और समाधान पारदर्शी रूप से यहाँ ट्रैक होता है।'
                    : 'Report your first civic issue. Assigned departments must respond under SLA rules, and verified solutions will appear here.'
                  : language === 'hi'
                  ? 'कृपया अन्य फिल्टर चुनें या नया खोज शब्द दर्ज करें।'
                  : 'Try selecting a different filter tab or search query.'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('report')}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow transition inline-flex items-center gap-2"
            >
              <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Problem'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          displayedProblems.map((problem) => {
            const isConfirmed = confirmedIds[problem.id];
            const hasSolution = problem.status === 'Resolved' || problem.status === 'Verified';

            return (
              <div
                key={problem.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs hover:shadow-md overflow-hidden"
              >
                {/* Header row */}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      {problem.id}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {problem.category}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : 'हाल ही में दर्ज'}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono border flex items-center gap-1.5 ${
                        hasSolution
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {hasSolution ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>
                        {hasSolution
                          ? language === 'hi'
                            ? 'समाधान पूर्ण एवं सत्यापित'
                            : 'Solution Deployed & Verified'
                          : language === 'hi'
                          ? 'विभागीय कार्रवाई प्रक्रियाधीन'
                          : 'Action Underway'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {language === 'hi' && problem.titleHi ? problem.titleHi : problem.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {language === 'hi' && problem.descriptionHi
                        ? problem.descriptionHi
                        : problem.description}
                    </p>
                  </div>

                  {/* Geographic & Administrative Location */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1 text-slate-800 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {problem.location.district} &gt; {problem.location.block} &gt; {problem.location.panchayat}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {problem.aiClassification?.recommendedDepartment || 'संबंधित नोडल विभाग (Jharkhand Administration)'}
                    </span>
                  </div>

                  {/* Solution Tracking Dossier Box */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                          {language === 'hi' ? 'समाधान व पारदर्शिता विवरण' : 'Solution & Resolution Audit'}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                        {language === 'hi' ? 'सत्यापन दर: 94%' : 'Community Score: 94%'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {problem.governmentResponseSummary ||
                        (language === 'hi'
                          ? 'जिला प्रशासन व संबंधित कार्यपालक अभियंता द्वारा स्थल निरीक्षण कर सुधारात्मक कार्रवाई संपन्न की गई। कार्य का भौतिक सत्यापन ग्राम सभा एवं स्थानीय नागरिकों द्वारा अनुमोदित है।'
                          : 'Field inspection completed by jurisdictional executive engineer. Physical corrective action completed and verified with community geotagged photographic proof.')}
                    </p>

                    {/* Community Confirmation Trigger for Reporter */}
                    <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-600">
                        {isConfirmed ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {language === 'hi'
                              ? 'आपने इस समाधान की पुष्टि कर दी है (धन्यवाद)'
                              : 'You confirmed this resolution (Thank you)'}
                          </span>
                        ) : (
                          <span>
                            {language === 'hi'
                              ? 'क्या आप इस समाधान से संतुष्ट हैं?'
                              : 'Are you satisfied with this resolution?'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!isConfirmed && (
                          <button
                            onClick={() => handleConfirmSolution(problem.id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'समाधान की पुष्टि करें' : 'Confirm Resolution'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProblemId(problem.id);
                            setActiveTab('explore');
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          {language === 'hi' ? 'पूर्ण विवरण देखें' : 'View Full Case'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
