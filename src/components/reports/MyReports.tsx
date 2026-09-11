import React from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import {
  Building,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';

export const MyReports: React.FC = () => {
  const { citizen, setSelectedProblemId, setActiveTab, navigateToProblem, language } = useApp();

  const allProblems = apiService.getProblems();

  // Find citizen's own problems
  const myProblems = allProblems.filter(
    (p) =>
      p.reporterId === citizen.id ||
      p.reporterName?.toLowerCase().includes('murmu') ||
      p.reporterMasked?.includes('Murmu') ||
      p.reporterMasked?.includes(citizen.name) ||
      p.id.startsWith('JH-PRB-')
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow">
              {citizen.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {language === 'hi' ? 'मेरी नागरिक रिपोर्टें' : 'My Reported Challenges'}
              </h1>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'नागरिक खाता:' : 'Signed in as'}{' '}
                <strong>{citizen.name}</strong> • {citizen.phoneMasked} • {citizen.residence?.district || 'Ranchi'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('transparency')}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{language === 'hi' ? 'समाधान व पारदर्शिता' : 'Solutions Tracker'}</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report Problem'}</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'सक्रिय समस्याएं व टिकट' : 'Active Tickets'} ({myProblems.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {language === 'hi' ? 'सुरक्षित नागरिक रिकॉर्ड' : 'Verified Citizen Record'}
          </span>
        </div>

        {myProblems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'hi'
                  ? 'आपने अभी तक कोई समस्या दर्ज नहीं की है'
                  : 'No tickets reported by you yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'hi'
                  ? 'सड़क, पेयजल, बिजली, स्वास्थ्य या अन्य नागरिक सुविधाओं में किसी भी समस्या को तुरंत दर्ज करें और सीधे विभागीय कार्रवाई ट्रैक करें।'
                  : 'Report roads, water supply, electricity, or health defects in your locality. Track assignments and verify solutions.'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('report')}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>{language === 'hi' ? 'पहली समस्या दर्ज करें' : 'Report Your First Problem'}</span>
            </button>
          </div>
        ) : (
          myProblems.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Top meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                    {report.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {report.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'हाल ही में दर्ज'}
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                  {report.status || report.stage || 'Reported'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' && report.titleHi ? report.titleHi : report.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {language === 'hi' && report.descriptionHi ? report.descriptionHi : report.description}
                </p>
              </div>

              {/* Structured Info Grid */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {language === 'hi' ? 'संबंधित विभाग' : 'Assigned Department'}
                  </span>
                  <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">{report.responsibleDepartment || 'प्रशासनिक नोडल सेल'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {language === 'hi' ? 'समाधान प्रगति' : 'Solution Progress'}
                  </span>
                  <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>
                      {report.status === 'Resolved'
                        ? language === 'hi'
                          ? 'समाधान पूर्ण एवं सत्यापित'
                          : 'Resolved & Verified'
                        : language === 'hi'
                        ? 'विभागीय कार्रवाई जारी'
                        : 'Action Underway'}
                    </span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {language === 'hi' ? 'स्थान' : 'Location'}
                  </span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5">
                    {report.location?.district} &gt; {report.location?.block}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-500">
                  {language === 'hi' ? 'नागरिक ट्रैकिंग आईडी:' : 'Tracking ID:'}{' '}
                  <strong className="font-mono text-slate-700">{report.id}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('transparency')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                    <span>{language === 'hi' ? 'समाधान व पारदर्शिता स्थिति' : 'Track Solution & Transparency'}</span>
                  </button>
                  <button
                    onClick={() => navigateToProblem(report.id)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'पूर्ण विवरण' : 'Case Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
