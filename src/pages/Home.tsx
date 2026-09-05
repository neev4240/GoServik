import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  Shield, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Zap, 
  Wrench, 
  Hammer, 
  Grid3X3, 
  Paintbrush, 
  Layers, 
  Columns, 
  Tv, 
  Sparkles, 
  ShieldCheck, 
  LayoutDashboard, 
  Lock, 
  Building2, 
  Trees, 
  Flame, 
  ClipboardCheck,
  HeartHandshake,
  Clock,
  BadgePercent
} from 'lucide-react';
import { useStore } from '../store';
import { useLanguage } from '../lib/i18n';
import { KAAMNOW_CATEGORIES } from '../lib/categories';

const ICON_MAP: Record<string, any> = {
  Zap,
  Wrench,
  Hammer,
  Grid3X3,
  Paintbrush,
  Layers,
  Columns,
  Tv,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  Lock,
  Building2,
  Trees,
  Flame,
  ClipboardCheck
};

export function Home() {
  const { professionals, reviews } = useStore();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular quick tags
  const popularSearches = [
    { label: 'Fan Installation', categoryId: 'cat-electrical' },
    { label: 'Pipe Leakage', categoryId: 'cat-plumbing' },
    { label: 'CCTV Setup', categoryId: 'cat-smarthome' },
    { label: 'Modular Kitchen', categoryId: 'cat-interior' },
    { label: 'Door Lock Repair', categoryId: 'cat-carpentry' },
    { label: 'Full Deep Cleaning', categoryId: 'cat-cleaning' }
  ];

  // Dynamic search suggestions
  const matchingCategories = KAAMNOW_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.hindiName && cat.hindiName.includes(searchQuery)) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const sampleTestingPro = professionals.find(p => p.id === 'pro-sample-testing') || professionals[0];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-850 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-indigo-200 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Independent Marketplace</span>
                <span className="text-white/40">•</span>
                <span>16 Service Categories</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                  {t('needAPro')}
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-blue-200 tracking-wide">
                  {t('tagline')}
                </p>
              </div>

              <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-xl font-normal">
                {t('heroSub')}
              </p>

              {/* Search Box */}
              <div className="relative max-w-xl pt-2">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Search className="w-5 h-5 text-indigo-600" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={t('searchPlaceholder')}
                      className="w-full pl-12 pr-28 py-4 bg-white text-slate-900 rounded-2xl shadow-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-400/30 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Autocomplete suggestions dropdown */}
                {showSuggestions && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 max-h-72 overflow-y-auto">
                    {matchingCategories.length > 0 ? (
                      <div>
                        <div className="px-4 py-2 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b">
                          Matching Categories & Skills
                        </div>
                        {matchingCategories.map(cat => (
                          <div
                            key={cat.id}
                            onClick={() => {
                              navigate(`/book?category=${cat.id}`);
                              setShowSuggestions(false);
                            }}
                            className="px-4 py-3 hover:bg-indigo-50/70 border-b border-slate-100 last:border-0 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-100/60 text-indigo-700 rounded-lg">
                                {(() => {
                                  const Icon = ICON_MAP[cat.icon] || Briefcase;
                                  return <Icon className="w-4 h-4" />;
                                })()}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">
                                  {lang === 'hi' ? cat.hindiName || cat.name : cat.name}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate max-w-xs">
                                  {cat.subcategories.slice(0, 3).join(', ')}...
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-indigo-600">Select →</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No direct match found. Press Enter to search all registered professionals.
                      </div>
                    )}
                  </div>
                )}

                {/* Quick suggestions pills */}
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-indigo-200">
                  <span className="font-semibold text-[11px] text-indigo-300">Popular:</span>
                  {popularSearches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigate(`/book?category=${item.categoryId}`)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors border border-white/10"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/explore"
                  className="px-6 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-indigo-600" />
                  {t('findAProBtn')}
                </Link>

                <Link
                  to="/professionals"
                  className="px-6 py-3.5 bg-indigo-600/60 hover:bg-indigo-600 border border-indigo-400/40 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-indigo-200" />
                  {t('joinAsProBtn')}
                </Link>
              </div>
            </div>

            {/* Right Card: KaamNow Model Highlights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-5">
                
                {/* Header tag */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                    Why Customers Choose KaamNow
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    100% Direct Marketplace
                  </span>
                </div>

                {/* Feature 1: Diagnostic Fee */}
                <div className="flex items-start gap-3.5 p-3.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                    <span className="font-black text-sm">₹99</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Standard Diagnostic / Visit Model</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Pay just ₹99 for eligible diagnostic inspections. Quotes and materials are confirmed upfront before major repairs.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Work Protection */}
                <div className="flex items-start gap-3.5 p-3.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">KaamNow Work Protection</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Every booking completed via KaamNow is backed by our Work Protection policy covering damages, delays, and verified resolution.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Safety Preferences */}
                <div className="flex items-start gap-3.5 p-3.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-400/20 text-indigo-300 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Safety & Comfort Preferences</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Filter by Elder-Safe and Women-Safe preferences for personalized comfort with verified professionals.
                    </p>
                  </div>
                </div>

                {/* Direct link */}
                <Link
                  to="/explore"
                  className="block w-full py-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold text-center text-xs shadow-md transition-all"
                >
                  Explore All Verified Professionals →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 16 Service Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-extrabold uppercase tracking-wider">
            {t('browseCategories')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All 16 Service Categories
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            From electrical repairs to civil renovations, find independent experts with mapped sub-services.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {KAAMNOW_CATEGORIES.map((category) => {
            const IconComponent = ICON_MAP[category.icon] || Briefcase;
            return (
              <Link
                key={category.id}
                to={`/book?category=${category.id}`}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-500 hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {lang === 'hi' ? category.hindiName || category.name : category.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {lang === 'hi' ? category.hindiDescription || category.description : category.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-400">
                    {category.subcategories.length} tasks
                  </span>
                  <span className="font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Book <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How KaamNow Works */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Connect. Book. Sorted.
            </h2>
            <p className="text-sm text-slate-500">
              KaamNow gives you complete transparency to select the exact professional who fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Connect Your Need</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose from 16 categories, select multiple specific sub-services with checkboxes, and pin your address with Google Maps precision.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-200">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Book the Right Pro</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review matched professionals scored by skill overlap, distance, ratings, hourly & full-day packages, and book instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-200">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Work Sorted & Protected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Confirm your schedule, message the professional directly, and complete the work with KaamNow Work Protection coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Demo Pro Spotlight ("Sample Testing") */}
      {sampleTestingPro && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Briefcase className="w-80 h-80 -mr-16 -mb-16" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="relative">
                  <img 
                    src={sampleTestingPro.avatar} 
                    alt={sampleTestingPro.name} 
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
                  />
                  <span className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-400/30 inline-block mb-1">
                    Featured Verified Professional
                  </span>
                  <h3 className="text-2xl font-black text-white">{sampleTestingPro.name}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{sampleTestingPro.tagline}</p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4 text-xs text-slate-300">
                <p className="leading-relaxed text-slate-200">
                  {sampleTestingPro.bio}
                </p>

                <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10 text-center">
                  <div>
                    <span className="block text-lg font-black text-white flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {sampleTestingPro.rating}
                    </span>
                    <span className="text-[10px] text-slate-400">{sampleTestingPro.reviewCount} Reviews</span>
                  </div>
                  <div>
                    <span className="block text-lg font-black text-white">{sampleTestingPro.jobsCompleted}+</span>
                    <span className="text-[10px] text-slate-400">Jobs Completed</span>
                  </div>
                  <div>
                    <span className="block text-lg font-black text-emerald-400">₹{sampleTestingPro.hourlyRate}/hr</span>
                    <span className="text-[10px] text-slate-400">Transparent Rate</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sampleTestingPro.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200">
                      {skill.categoryName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col gap-3 justify-center">
                <Link
                  to={`/book?proId=${sampleTestingPro.id}&category=${sampleTestingPro.skills[0]?.categoryId || 'cat-electrical'}`}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center text-xs rounded-xl shadow-lg transition-all"
                >
                  Direct Book This Professional →
                </Link>
                <Link
                  to="/explore"
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-center text-xs rounded-xl border border-white/15 transition-all"
                >
                  Compare With Other Pros
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Verified Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-16 bg-slate-100 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Real Feedback
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Verified Booking Reviews
                </h2>
              </div>
              <Link to="/explore" className="text-xs font-bold text-indigo-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <img 
                      src={review.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                      alt={review.customerName} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{review.customerName}</h4>
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Booking
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer Banner */}
      <section className="py-14 bg-indigo-600 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-black tracking-tight">
            Are You a Skilled Independent Professional?
          </h2>
          <p className="text-sm text-indigo-100 max-w-xl mx-auto leading-relaxed">
            Join KaamNow to receive verified local customer bookings directly. Set your own prices, choose your trade categories, and earn milestone bonuses.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/professionals"
              className="px-8 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 font-black text-sm rounded-xl shadow-xl transition-all"
            >
              Register as a KaamNow Professional
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
