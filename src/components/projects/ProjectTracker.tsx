import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Project, TRL_DEFINITIONS } from '../../types';
import {
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Sliders,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

export const ProjectTracker: React.FC = () => {
  const { selectedProjectId, setSelectedProjectId, navigateToProblem, triggerRefresh, language } = useApp();
  const [filterUniversity, setFilterUniversity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [demoRequested, setDemoRequested] = useState<Record<string, boolean>>({});

  const projects = apiService.getProjects();

  const handleRequestDemo = (projectId: string) => {
    setDemoRequested((prev) => ({ ...prev, [projectId]: true }));
  };

  const filteredProjects = projects.filter((pr) => {
    const matchesUni =
      filterUniversity === 'ALL' ||
      pr.university.name.includes(filterUniversity) ||
      pr.university.shortName.includes(filterUniversity);
    const matchesSearch =
      !searchTerm ||
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.university.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUni && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi'
                ? 'विश्वविद्यालय एवं उद्योग अनुसंधान समाधान'
                : 'University & Industry Solutions'}
            </h1>
            <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
              SIH TRL 1–9 Tracker
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparently tracking grassroots challenges as they advance from university labs to commercial pilots and field deployment across Jharkhand.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by technology, university, faculty, or district..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <select
          value={filterUniversity}
          onChange={(e) => setFilterUniversity(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          <option value="ALL">All Academic Institutions</option>
          <option value="BIT Mesra">BIT Mesra</option>
          <option value="NIT Jamshedpur">NIT Jamshedpur</option>
          <option value="IIT ISM Dhanbad">IIT (ISM) Dhanbad</option>
          <option value="Birsa Agricultural">Birsa Agricultural University</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const trlMeta = TRL_DEFINITIONS[project.trl as keyof typeof TRL_DEFINITIONS] || {
            title: `TRL ${project.trl}`,
            desc: 'In development',
          };
          const isRequested = demoRequested[project.id];
          const completedMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length;

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Strip */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                      {project.id}
                    </span>
                    <button
                      onClick={() => navigateToProblem(project.problemId)}
                      className="text-xs font-bold text-emerald-800 hover:underline flex items-center space-x-1"
                      title="View parent citizen problem"
                    >
                      <span>Problem: {project.problemId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    Target: {project.targetDeploymentDate}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* TRL Progress Bar */}
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-950 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      <span>{trlMeta.title}</span>
                    </span>
                    <span className="font-mono font-bold text-blue-800 text-[11px]">
                      Stage {project.trl} of 9
                    </span>
                  </div>

                  {/* 9 Segment Visual Bar */}
                  <div className="grid grid-cols-9 gap-1 h-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                      <div
                        key={lvl}
                        className={`rounded-xs transition-all ${
                          lvl <= project.trl ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                        title={`TRL ${lvl}`}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-blue-900 font-medium">
                    {trlMeta.desc}
                  </p>
                </div>

                {/* Institution & Industry Partners */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Lead University
                    </span>
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="truncate">{project.university.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {project.university.facultyMentor}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Industry / CSR Partner
                    </span>
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-slate-700 shrink-0" />
                      <span className="truncate">{project.industryPartner ? project.industryPartner.name : 'State R&D Consortium'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {project.industryPartner ? project.industryPartner.focus : 'Direct Government Partnership'}
                    </p>
                  </div>
                </div>

                {/* Milestones Achieved */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Key Milestones Achieved ({completedMilestones}/{project.milestones.length})
                  </span>
                  <div className="space-y-1">
                    {project.milestones.slice(0, 3).map((m, idx) => {
                      const isDone = m.status === 'COMPLETED';
                      return (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-[11px] text-slate-700"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className={isDone ? 'font-medium' : 'text-slate-500'}>
                            {m.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Pilot Site: <strong>{project.locationSummary}</strong></span>
                </div>

                <button
                  onClick={() => handleRequestDemo(project.id)}
                  disabled={isRequested}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isRequested
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-blue-800 hover:bg-blue-900 text-white shadow-xs'
                  }`}
                >
                  {isRequested ? '✓ Demo Requested for Your Area' : 'Request Field Demo in My Village'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
