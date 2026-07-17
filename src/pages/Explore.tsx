import { useState, useMemo, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';

export function Explore() {
  const { professionals, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const selectedCategory = searchParams.get('category');

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      if (selectedCategory) {
        const hasCategory = pro.services.some(s => s.categoryId === selectedCategory);
        if (!hasCategory) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          pro.name.toLowerCase().includes(q) ||
          pro.services.some(s => s.name.toLowerCase().includes(q)) ||
          pro.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [professionals, selectedCategory, searchQuery]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Explore Professionals</h1>
          <p className="text-slate-500 mt-1">Find and compare the best independent professionals.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services, professionals, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }}
                className={`block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${!selectedCategory ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    searchParams.set('category', cat.id);
                    setSearchParams(searchParams);
                  }}
                  className={`block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedCategory === cat.id ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-slate-500">
            Showing {filteredProfessionals.length} professionals
          </div>

          <div className="space-y-4">
            {filteredProfessionals.map(pro => (
              <div key={pro.id} className="group flex flex-col sm:flex-row gap-6 p-6 border border-white/40 rounded-2xl bg-white/60 backdrop-blur-md hover:shadow-xl hover:bg-white transition-all">
                <img 
                  src={pro.avatar} 
                  alt={pro.name} 
                  className="h-24 w-24 rounded-full object-cover shrink-0 mx-auto sm:mx-0"
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h2 className="text-xl font-bold text-slate-900">
                          <Link to={`/pro/${pro.id}`} className="hover:underline">{pro.name}</Link>
                        </h2>
                        {pro.verified && (
                          <ShieldCheck className="h-5 w-5 text-blue-500" title="Verified Professional" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{pro.tagline}</p>
                      
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-slate-900">{pro.rating}</span>
                          <span>({pro.reviewCount} reviews)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {pro.location}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button asChild variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl h-10">
                        <Link to={`/pro/${pro.id}`}>View Profile</Link>
                      </Button>
                      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 h-10">
                        <Link to={`/book/${pro.id}`}>Book Now</Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                    {pro.services.map(s => (
                      <span key={s.id} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProfessionals.length === 0 && (
              <div className="text-center py-20 border rounded-xl bg-slate-50">
                <Search className="mx-auto h-10 w-10 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No professionals found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
