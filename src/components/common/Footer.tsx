import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Phone, FileCheck, ExternalLink, Heart, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, language } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-16 pb-20 lg:pb-8">
      {/* Upper Helpline Strip */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-xs">Citizen Grievance & Emergency Helplines</p>
              <p className="text-[11px] text-slate-400">CM Jan Samvad: 181 | Vigilance Anti-Corruption Toll-Free: 1064 | Women Helpline: 181</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300 font-semibold">Department Response SLA Tracking Active (24 Hours)</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About Platform */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
              JS
            </div>
            <span className="text-white font-extrabold text-base tracking-tight">JanaSamadhan</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Jharkhand Societal Innovation & Accountability Platform. Built for the Smart India Hackathon (SIH) to crowdsource grassroots challenges and connect communities with government, universities, and industry.
          </p>
          <div className="pt-2 text-[11px] text-emerald-400 font-mono">
            Core Message: “Report a problem. Track its journey. Verify the solution.”
          </div>
        </div>

        {/* Col 2: Citizen Services */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Citizen Portals</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => setActiveTab('explore')} className="hover:text-emerald-400 transition-colors">
                Explore Problems by Block
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('report')} className="hover:text-emerald-400 transition-colors">
                Report a Community Problem
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('my-reports')} className="hover:text-emerald-400 transition-colors">
                My Reports & Lifecycles
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('verify')} className="hover:text-emerald-400 transition-colors">
                Citizen Verification of Completed Work
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('integrity')} className="hover:text-emerald-400 transition-colors">
                Report an Anonymous Integrity Concern
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Public Transparency */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Public Transparency</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => setActiveTab('infrastructure')} className="hover:text-emerald-400 transition-colors">
                Road Asset & Contractor Registry
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('accountability')} className="hover:text-emerald-400 transition-colors">
                State Accountability Wall
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('projects')} className="hover:text-emerald-400 transition-colors">
                University TRL Research Pilots
              </button>
            </li>
            <li>
              <span className="text-slate-500 cursor-not-allowed">District Mineral Fund (DMFT) Audits</span>
            </li>
            <li>
              <span className="text-slate-500 cursor-not-allowed">Contractor Defect Liability Clauses</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Monorepo & SIH Context */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Monorepo Architecture</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Citizen Portal application ready for federation into <code>apps/citizen</code>, sharing core packages:
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">@packages/types</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">@packages/geography</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">@packages/ui</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">@packages/auth</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Government of Jharkhand © 2026. Designed strictly for civic integrity and transparent governance.
          </p>
        </div>
      </div>
    </footer>
  );
};
