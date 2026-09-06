import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Search, X, AlertTriangle, ShieldCheck, Hammer, Layers, FileText, ArrowUpRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, navigateToProblem, navigateToProject, navigateToAsset, navigateToIntegrityCase, language } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const results = apiService.searchAll(query);
  const hasResults =
    results.problems.length > 0 ||
    results.projects.length > 0 ||
    results.assets.length > 0 ||
    results.cases.length > 0;

  const handleSelect = (callback: () => void) => {
    callback();
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'आईडी, सड़क, समस्या, विश्वविद्यालय या ठेकेदार खोजें...'
                : 'Search Problem ID, Road Asset, University, Contractor, Village...'
            }
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-white border border-slate-300 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="p-5 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'hi' ? 'त्वरित खोज सुझाव' : 'Popular Search Queries'}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Kanke Road (JH-RNC-KNK-000184)', q: 'Kanke road' },
                { label: 'BIT Mesra Arsenic Project', q: 'BIT Mesra' },
                { label: 'ABC Infrastructure Contract', q: 'ABC Infrastructure' },
                { label: '10,000+ Verified Case (INT-004821)', q: 'INT-RNC-KNK-004821' },
                { label: 'Sukurhutu Water', q: 'Sukurhutu' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(chip.q)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-xs font-medium text-slate-700 rounded-lg border border-slate-200 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && (
          <div className="p-4 overflow-y-auto space-y-6">
            {!hasResults && (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="text-sm font-medium">
                  {language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No records match your query'}
                </p>
                <p className="text-xs text-slate-400">
                  Try searching "Kanke", "Boreya", "Road", "BIT Mesra", or "ABC"
                </p>
              </div>
            )}

            {/* Problems Section */}
            {results.problems.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Problems & Challenges ({results.problems.length})</span>
                </div>
                <div className="space-y-2">
                  {results.problems.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(() => navigateToProblem(p.id))}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer transition-all flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {p.id}
                          </span>
                          <span className="text-xs font-medium text-slate-500">{p.category}</span>
                          <span className="text-xs font-medium text-slate-400">• {p.location.village}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">{p.title}</h4>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* University & Industry Projects Section */}
            {results.projects.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  <Hammer className="w-3.5 h-3.5 text-blue-600" />
                  <span>University & Innovation Projects ({results.projects.length})</span>
                </div>
                <div className="space-y-2">
                  {results.projects.map((pr) => (
                    <div
                      key={pr.id}
                      onClick={() => handleSelect(() => navigateToProject(pr.id))}
                      className="p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                            {pr.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">TRL {pr.trl}/9</span>
                          <span className="text-xs font-medium text-slate-500">• {pr.university.shortName}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">{pr.title}</h4>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Infrastructure Assets & Contracts */}
            {results.assets.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>Road & Infrastructure Contracts ({results.assets.length})</span>
                </div>
                <div className="space-y-2">
                  {results.assets.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleSelect(() => navigateToAsset(a.id))}
                      className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl cursor-pointer transition-all flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                            {a.id}
                          </span>
                          <span className="text-xs font-medium text-slate-600">{a.type}</span>
                          <span className="text-xs text-rose-700 font-bold">• {a.repairStatus.replace(/_/g, ' ')}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">{a.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Contractor: <strong>{a.contract.contractor.name}</strong> • Value: ₹{(a.contract.projectValueInr / 10000000).toFixed(2)} Cr
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integrity Cases */}
            {results.cases.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Integrity Concerns & Accountability ({results.cases.length})</span>
                </div>
                <div className="space-y-2">
                  {results.cases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(() => navigateToIntegrityCase(c.id))}
                      className="p-3 bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 rounded-xl cursor-pointer transition-all flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                            {c.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">{c.concernType}</span>
                          {c.is10kAlertTriggered && (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                              10,000+ VERIFIED
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">{c.title}</h4>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
