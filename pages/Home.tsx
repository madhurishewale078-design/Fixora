import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Wrench, ShieldCheck, ArrowRight, Zap, Droplets, 
  Snowflake, Hammer, Activity, Tv, CheckCircle2, Star, 
  Clock, Award, HelpCircle, ChevronRight, Users, ThumbsUp
} from 'lucide-react';
import { api } from '../api/client';
import { ServiceCategory, Technician } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [featuredTechs, setFeaturedTechs] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, techs] = await Promise.all([
          api.getCategories(),
          api.getTechnicians()
        ]);
        setCategories(cats);
        setFeaturedTechs(techs.slice(0, 3));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'Snowflake': return <Snowflake className="w-6 h-6 text-cyan-500" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-emerald-500" />;
      case 'Tv': return <Tv className="w-6 h-6 text-purple-500" />;
      default: return <Wrench className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-transparent to-transparent dark:from-emerald-950/20 pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Fixora USP: “Diagnose First. Book Only When Needed.”</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Having a home problem? <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Let Fixora diagnose it first.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Never get overcharged or book unnecessary visits. Our smart AI troubleshooting engine safely checks your issue in seconds. If a simple DIY fix is safe, we guide you. If you need hands-on help, we connect you with verified local experts.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                to="/ai-assistant"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 group transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
                Diagnose a Problem Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 font-semibold text-sm shadow-sm transition"
              >
                Browse All Services
              </Link>
              <Link
                to="/register/technician"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium transition"
              >
                Become a Technician →
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Verified Professionals
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Safe Non-Hazardous DIY Rules
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-500" /> Transparent Upfront Pricing
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* How Fixora Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
            Intelligent Workflow
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            How Fixora Protects Your Wallet & Time
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Most home visits are for simple tripped switches or clogged aerators. Here is why Fixora is fundamentally different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 relative group hover:-translate-y-1 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
              Select Problem
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tell Fixora what is happening—fan not working, AC lukewarm, or water dripping under the sink.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 relative group hover:-translate-y-1 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold flex items-center justify-center text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
              AI Decision Tree
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Answer 2-3 simple non-technical questions. The system isolates the root cause safely.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 relative group hover:-translate-y-1 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold flex items-center justify-center text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
              Safe DIY or Recommendation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If it is a safe step (filter clean or MCB flip), fix it for free! If hazardous, we recommend a technician.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 relative group hover:-translate-y-1 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
              Verified Booking & Review
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Book the matched technician with prefilled diagnosis notes. Rate the service when completed.
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
              Expertise On Demand
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Home Service Categories
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View all 20+ specialized services <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/services?category=${cat.id}`}
              className="p-5 rounded-2xl glass-card hover:border-emerald-500/80 flex flex-col items-center text-center group transition"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {cat.services?.length || 4} services
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive AI Preview Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Fixora Diagnostic Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Test Our AI Troubleshooting Assistant
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Experience the patented “Diagnose First” interactive wizard. Choose from electrical, plumbing, AC cooling, or water purifier fault trees.
            </p>
            <div className="pt-2">
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-emerald-50 font-bold text-xs shadow-lg transition"
              >
                Launch Diagnostic Wizard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Technicians */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
              Certified Professionals
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Top-Rated Local Technicians
            </h2>
          </div>
          <Link
            to="/technicians"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Explore all verified technicians <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTechs.map(tech => (
            <div
              key={tech.id}
              className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={tech.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                    alt={tech.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {tech.full_name}
                      </h3>
                      <span title="Verified Partner"><ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /></span>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {tech.category_name} • {tech.experience_years} yrs exp
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong className="text-slate-800 dark:text-slate-200">{tech.rating}</strong>
                      <span>({tech.total_reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                  {tech.bio || 'Verified service professional with expertise in quick diagnosis and long-lasting repairs.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Service Area:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                    {tech.service_area}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Link
                  to={`/technicians/${tech.id}`}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College Project Viva / Presentation Showcase Pill */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Fixora Engineering Presentation Suite Ready
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Includes complete Software Requirements Specification (SRS), ER Diagram, DFD Levels, 27-chapter Project Report, and Viva Q&As.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 shadow-sm"
            >
              Demo Quick Logins
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
