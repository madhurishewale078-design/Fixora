import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Star, ShieldCheck, MapPin, Wrench, Filter, Map, List } from 'lucide-react';
import { api } from '../api/client';
import { Technician, ServiceCategory } from '../types';
import { StarRating } from '../components/StarRating';
import { MapLocationPicker } from '../components/MapLocationPicker';
import { BookingModal } from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

export const Technicians: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchArea, setSearchArea] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [selectedTechForBooking, setSelectedTechForBooking] = useState<Technician | null>(null);
  const diagnosisFromUrl = searchParams.get('diagnosis') || undefined;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTechnicians();
  }, [selectedCategory, searchArea, searchQuery]);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTechnicians = async () => {
    setLoading(true);
    try {
      const data = await api.getTechnicians({
        category_id: selectedCategory || undefined,
        service_area: searchArea || undefined,
        search: searchQuery || undefined
      });
      setTechnicians(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (tech: Technician) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedTechForBooking(tech);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
          Verified Local Talent
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Verified Professional Technicians
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Only technicians approved by Fixora administration after identity & skill vetting appear here.
        </p>
      </div>

      {diagnosisFromUrl && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>
            <strong>AI Diagnostic Notes Attached:</strong> Ready to hand over to your chosen professional.
          </span>
          <button onClick={() => navigate('/technicians')} className="text-xs underline font-semibold">
            Clear
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Category Dropdown */}
          <select
            value={selectedCategory || ''}
            onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Service Area Filter */}
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Service Area (e.g. Kothrud, Baner)..."
              value={searchArea}
              onChange={e => setSearchArea(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Search by Name */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search technician name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 self-end md:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              viewMode === 'map' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Map
          </button>
        </div>
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="rounded-3xl overflow-hidden glass-card p-4">
          <div className="mb-3 text-xs text-slate-500">
            Showing verified technician coverage radius across Pune (OpenStreetMap + Leaflet integration).
          </div>
          <MapLocationPicker
            latitude={18.5204}
            longitude={73.8567}
            serviceRadiusMeters={5000}
            readOnly={true}
            className="h-96 rounded-2xl overflow-hidden"
          />
        </div>
      )}

      {/* Technician Listing */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading verified technicians...</div>
      ) : technicians.length === 0 ? (
        <div className="py-20 text-center">
          <Wrench className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No approved technicians found in this area/category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map(tech => (
            <div
              key={tech.id}
              className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition group"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={tech.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                    alt={tech.full_name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                        {tech.full_name}
                      </h3>
                      <span title="Verified Specialist"><ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /></span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {tech.category_name} • {tech.experience_years} Years Exp
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <StarRating rating={Math.round(tech.rating)} size="sm" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{tech.rating}</span>
                      <span className="text-[11px] text-slate-400">({tech.total_reviews})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                  {tech.bio || 'Experienced Fixora partner specialized in rapid fault resolution and clean installation.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Coverage:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {tech.service_area}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Completed Jobs:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{tech.total_jobs} services</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/technicians/${tech.id}`)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleBookClick(tech)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedTechForBooking && (
        <BookingModal
          isOpen={true}
          onClose={() => setSelectedTechForBooking(null)}
          technician={selectedTechForBooking}
          diagnosisSummary={diagnosisFromUrl}
          onSuccess={() => {
            navigate('/customer/dashboard');
          }}
        />
      )}

    </div>
  );
};
