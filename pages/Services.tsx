import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Wrench, Clock, Tag, ArrowRight, CheckCircle2, Zap, Droplets, Snowflake, Hammer, Activity, Tv } from 'lucide-react';
import { api } from '../api/client';
import { ServiceCategory, Service } from '../types';

export const Services: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const catIdParam = searchParams.get('category');
    if (catIdParam) {
      setSelectedCategory(Number(catIdParam));
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, svcs] = await Promise.all([
        api.getCategories(),
        api.getServices(selectedCategory || undefined)
      ]);
      setCategories(cats);
      setServices(svcs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
          Transparent Service Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Fixora Verified Home Services
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Fixed rate diagnostic visits, certified tools, and upfront transparent parts estimates.
        </p>
      </div>

      {/* Search Bar & Category Filter Chips */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchParams({});
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchParams({ category: cat.id.toString() });
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading catalog...</div>
      ) : filteredServices.length === 0 ? (
        <div className="py-20 text-center">
          <Wrench className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No services found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(svc => (
            <div
              key={svc.id}
              className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/60 transition group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    Verified Task
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {svc.duration_estimate}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  {svc.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {svc.description || 'Standard service performed according to Fixora manufacturer safety checklist.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Range</span>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                    ₹{svc.price_estimate_min} - ₹{svc.price_estimate_max}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/technicians?service_id=${svc.id}`)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1 transition"
                >
                  Find Experts <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
