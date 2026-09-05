import { useState, useMemo, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  Shield, 
  Star, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
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
  Filter,
  Check
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

export function Explore() {
  const { professionals, categories } = useStore();
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialProtection = searchParams.get('protection') === 'true';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [viewMode, setViewMode] = useState<'categories' | 'pros'>('categories');
  const [filterElderSafe, setFilterElderSafe] = useState(false);
  const [filterWomenSafe, setFilterWomenSafe] = useState(false);
  const [filterProtection, setFilterProtection] = useState(initialProtection);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return KAAMNOW_CATEGORIES.filter(cat => {
      if (!query) return true;
      const nameMatch = cat.name.toLowerCase().includes(query);
      const hindiNameMatch = cat.hindiName ? cat.hindiName.toLowerCase().includes(query) : false;
      const subMatch = cat.subcategories.some(sub => sub.toLowerCase().includes(query));
      return nameMatch || hindiNameMatch || subMatch;
    });
  }, [searchQuery]);

  // Filter Professionals
  const filteredPros = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return professionals.filter(pro => {
      // Category filter
      if (activeCategory !== 'all') {
        const hasCat = pro.skills?.some(s => s.categoryId === activeCategory);
        if (!hasCat) return false;
      }

      // Safety filters
      if (filterElderSafe && !pro.satisfiesElderSafe) return false;
      if (filterWomenSafe && !pro.satisfiesWomenSafe) return false;

      // Query filter
      if (query) {
        const nameMatch = pro.name.toLowerCase().includes(query);
        const taglineMatch = (pro.tagline || '').toLowerCase().includes(query);
        const skillMatch = pro.skills?.some(s => 
          s.categoryName.toLowerCase().includes(query) ||
          s.subcategories.some(sub => sub.toLowerCase().includes(query))
        );
        return nameMatch || taglineMatch || skillMatch;
      }

      return true;
    });
  }, [professionals, activeCategory, filterElderSafe, filterWomenSafe, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Search and Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                Direct Marketplace
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">16 Categories</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Explore Services & Verified Professionals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find independent professionals, view transparent rates, and book diagnostic visits.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category, task or skill (e.g. fan, pipe, AC)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* View Toggle & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'categories'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              16 Trade Categories ({filteredCategories.length})
            </button>
            <button
              onClick={() => setViewMode('pros')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'pros'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified Professionals ({filteredPros.length})
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setFilterProtection(!filterProtection)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                filterProtection
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Work Protection</span>
              {filterProtection && <Check className="w-3 h-3 text-emerald-700" />}
            </button>

            <button
              onClick={() => setFilterElderSafe(!filterElderSafe)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                filterElderSafe
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
              <span>Elder-Safe</span>
              {filterElderSafe && <Check className="w-3 h-3 text-indigo-700" />}
            </button>

            <button
              onClick={() => setFilterWomenSafe(!filterWomenSafe)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                filterWomenSafe
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
              <span>Women-Safe</span>
              {filterWomenSafe && <Check className="w-3 h-3 text-indigo-700" />}
            </button>
          </div>
        </div>

        {/* Categories View */}
        {viewMode === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCategories.map((cat) => {
              const IconComponent = ICON_MAP[cat.icon] || Briefcase;
              return (
                <div 
                  key={cat.id} 
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                        ₹99 Visit Fee
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">
                      {lang === 'hi' ? cat.hindiName || cat.name : cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {lang === 'hi' ? cat.hindiDescription || cat.description : cat.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Popular Tasks:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cat.subcategories.slice(0, 3).map((sub, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setViewMode('pros');
                      }}
                      className="text-[11px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      View Pros
                    </button>
                    <Link
                      to={`/book?category=${cat.id}`}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                    >
                      Book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Professionals List View */}
        {viewMode === 'pros' && (
          <div className="space-y-4">
            {filteredPros.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No professionals found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or adjusting your safety filters to see more results.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setFilterElderSafe(false);
                    setFilterWomenSafe(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredPros.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Pro Bio */}
                  <div className="flex items-start gap-4">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{pro.name}</h3>
                        {pro.verified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        )}
                        {pro.satisfiesElderSafe && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-100">
                            Elder-Safe
                          </span>
                        )}
                        {pro.satisfiesWomenSafe && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-100">
                            Women-Safe
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 font-medium mt-0.5">{pro.tagline}</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-2">{pro.bio}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {pro.rating} ({pro.reviewCount} reviews)
                        </span>
                        <span>•</span>
                        <span>{pro.jobsCompleted}+ jobs</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {pro.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rates and Direct Book Button */}
                  <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rates</span>
                      <span className="text-lg font-black text-slate-900">₹{pro.hourlyRate}/hr</span>
                      <span className="text-[10px] text-slate-500 block">Full day: ₹{pro.fullDayRate || 2200}</span>
                    </div>

                    <Link
                      to={`/book?category=${pro.skills[0]?.categoryId || 'cat-electrical'}`}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      Book Service <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
