import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { ProblemDetail } from './ProblemDetail';
import { CATEGORIES } from '../home/LocalDashboard';
import { ProblemCategory, ProblemSeverity } from '../../types';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ThumbsUp,
  Layers,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export const ProblemList: React.FC = () => {
  const { selectedProblemId, setSelectedProblemId, setActiveTab, location, language } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<string>('RECENT');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Helper to calculate distance in km (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;  
    const dLon = (lon2 - lon1) * Math.PI / 180; 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    if (val === 'PROXIMITY' && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          },
          (error) => {
            console.warn("Error getting location", error);
            // Fallback location (Ranchi center)
            setUserLocation({ lat: 23.3441, lng: 85.3096 });
          }
        );
      } else {
        setUserLocation({ lat: 23.3441, lng: 85.3096 });
      }
    }
  };

  const getSeverityWeight = (severity: string) => {
    switch (severity) {
      case 'Critical': return 4;
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  const problems = apiService.getProblems();

  // If a specific problem is selected, render ProblemDetail
  if (selectedProblemId) {
    return (
      <ProblemDetail
        problemId={selectedProblemId}
        onBack={() => setSelectedProblemId(null)}
      />
    );
  }

  // Filter problems based on user criteria
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.village.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'ALL' || p.severity === selectedSeverity;
    const matchesStage = selectedStage === 'ALL' || p.stage === selectedStage;
    const matchesVerified = !onlyVerified || p.isGovernmentVerified;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStage && matchesVerified;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === 'URGENCY') {
      const urgencyDiff = getSeverityWeight(b.severity) - getSeverityWeight(a.severity);
      if (urgencyDiff !== 0) return urgencyDiff;
      return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
    }
    if (sortBy === 'SECTOR') {
      const sectorDiff = a.category.localeCompare(b.category);
      if (sectorDiff !== 0) return sectorDiff;
      return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
    }
    if (sortBy === 'PROXIMITY' && userLocation) {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.latitude, a.location.longitude);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.latitude, b.location.longitude);
      return distA - distB;
    }
    // Default RECENT
    return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'नागरिक समस्याएं व चुनौतियां' : 'Explore Community Challenges'}
            </h1>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
              {filteredProblems.length} records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified grassroots issues reported across Jharkhand districts awaiting university innovation or contractor resolution.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, road name, village, or Problem ID (e.g. JH-RNC-KNK-000184)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Dropdown */}
          <div className="w-full md:w-44">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Gov Verified Toggle */}
          <label className="flex items-center space-x-2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Gov Verified</span>
          </label>
        </div>

        {/* Sorting row */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-center space-x-2 text-slate-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="ml-2 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="RECENT">Most Recent</option>
              <option value="URGENCY">Urgency Level (High to Low)</option>
              <option value="SECTOR">Sector (A-Z)</option>
              <option value="PROXIMITY">Proximity (Closest First)</option>
            </select>
            {sortBy === 'PROXIMITY' && !userLocation && (
              <span className="text-[10px] text-amber-600 ml-2 animate-pulse">Locating...</span>
            )}
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProblems.map((p) => {
          const distance = sortBy === 'PROXIMITY' && userLocation 
            ? calculateDistance(userLocation.lat, userLocation.lng, p.location.latitude, p.location.longitude) 
            : null;

          return (
          <div
            key={p.id}
            onClick={() => setSelectedProblemId(p.id)}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {p.id}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {p.category}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    p.severity === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : p.severity === 'High'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}
                >
                  {p.severity}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
                {language === 'hi' && p.titleHi ? p.titleHi : p.title}
              </h3>

              <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{p.location.block} • {p.location.village}</span>
                {distance !== null && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">{distance.toFixed(1)} km</span>
                  </>
                )}
                <span>•</span>
                <span>{p.reportedDate}</span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {language === 'hi' && p.descriptionHi ? p.descriptionHi : p.description}
              </p>

              {p.clusterName && (
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">Cluster: {p.clusterName}</span>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {p.stage}
                </span>

                <div className="flex items-center space-x-2 text-slate-600">
                  <span className="flex items-center space-x-1 text-xs">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{p.supportersCount}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                <span>View Full Details & Lifecycle</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};
