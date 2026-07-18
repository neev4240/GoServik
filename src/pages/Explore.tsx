import { useState, useMemo, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Wrench, Zap, Tv, Hammer, Paintbrush, 
  ShieldAlert, TreePine, Grid3X3, Cctv, Cpu, Truck, 
  Droplets, Smile, HeartPulse, ShieldCheck, Search, Filter, ArrowRight 
} from 'lucide-react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';

// Icon map for the 16 categories
const iconMap: Record<string, any> = {
  Sparkles, Wrench, Zap, Tv, Hammer, Paintbrush, 
  ShieldAlert, TreePine, Grid3X3, Cctv, Cpu, Truck, 
  Droplets, Smile, HeartPulse, ShieldCheck
};

const servicesByCategory: Record<string, string[]> = {
  'cat-1': ['Full Home Deep Cleaning', 'Sofa Wet Shampooing', 'Bathroom Sanitization', 'Kitchen Degreasing'],
  'cat-2': ['Emergency Leakage & Pipe Repair', 'Faucet & Sink Install', 'Drainage Clog Removal', 'Geyser Inspection'],
  'cat-3': ['Switch & Socket Repair', 'Ceiling Fan Installation', 'House Re-wiring Inspection', 'Inverter Battery Service'],
  'cat-4': ['AC Servicing & Filter Wash', 'AC Gas Refilling', 'Refrigerator Repair', 'Washing Machine Repair'],
  'cat-5': ['Door Lock & Hinge Repair', 'Furniture Repair & Assembly', 'Modular Cabinet Adjustment', 'Drawer Slider Install'],
  'cat-6': ['Wall Paint Touch-ups', 'Waterproofing Damage Inspection', 'Interior Wall Texture', 'Flat Painting Consult'],
  'cat-7': ['General Pest Control', 'Cockroach & Ant Gel', 'Bedbug Herbal Spray', 'Termite Protection'],
  'cat-8': ['Lawn Mowing & Grass Trim', 'Weeding & Soil Treatment', 'Indoor Planter Maintenance', 'New Garden Setup'],
  'cat-9': ['Floor/Wall Tile Grouting', 'Cement Wall Crack Plastering', 'Bathroom Tiling Repair', 'Brickwork/Masonry'],
  'cat-10': ['CCTV Camera Setup', 'Smart Door Lock Setup', 'Video Doorbell Wiring', 'Security Sensors Consult'],
  'cat-11': ['Router Setup & WiFi', 'Smart Speaker Setup', 'Smart TV Installation', 'Smart Lighting Switch'],
  'cat-12': ['Local Shift Pre-move', 'Packing & Loading Help', 'Furniture Reassembly', 'Inter-city Relocation'],
  'cat-13': ['Kitchen Chimney Clean', 'Water Purifier RO Service', 'Microwave Deep Clean', 'Hob & Stove Checkup'],
  'cat-14': ['Men Haircut & Groom', 'Women Hair & Styling', 'Facial & Face Massage', 'Stress Relief Massage'],
  'cat-15': ['Physio Pain Assessment', 'Elderly Companion Visit', 'Daily Nursing Visit', 'Infant Care Consult'],
  'cat-16': ['Whole House Sanitization', 'Steam Disinfection', 'Workstation Spray', 'Car Cabin Fogging']
};

export function Explore() {
  const { categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const query = searchQuery.toLowerCase();
      const nameMatch = cat.name.toLowerCase().includes(query);
      const descMatch = cat.description.toLowerCase().includes(query);
      const suboptions = servicesByCategory[cat.id] || [];
      const suboptionsMatch = suboptions.some(sub => sub.toLowerCase().includes(query));
      return nameMatch || descMatch || suboptionsMatch;
    });
  }, [categories, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6 border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Explore Home Services</h1>
          <p className="text-slate-500 mt-1">Select a verified service category. Book standard diagnostics visits in a single click.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services, e.g. AC, leakage, paint, cleanup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl h-11 px-6 text-xs text-white">Search</Button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Showing {filteredCategories.length} Service Categories
          </div>
          <div className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg font-bold">
            ⚡ All visits priced at flat ₹99 diagnosis fee
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(cat => {
            const IconComponent = iconMap[cat.icon] || Sparkles;
            const suboptions = servicesByCategory[cat.id] || [];

            return (
              <div 
                key={cat.id} 
                className="group flex flex-col justify-between p-6 border border-white/40 rounded-3xl bg-white/60 backdrop-blur-md hover:shadow-xl hover:bg-white transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {cat.name}
                      </h2>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Urban Assist Certified</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4 h-10 line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Popular Specializations:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {suboptions.map(sub => (
                        <span 
                          key={sub} 
                          className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Standard Visit Rate</span>
                    <span className="text-lg font-black text-slate-900 block">₹99</span>
                  </div>
                  <Button 
                    asChild 
                    className="bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md h-10 px-5 text-xs transition-all duration-300"
                  >
                    <Link to={`/book?category=${cat.id}`}>
                      Book Diagnostic Visit <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="col-span-full text-center py-20 border rounded-3xl bg-slate-50/50">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-4 animate-bounce" />
              <h3 className="text-lg font-extrabold text-slate-900">No Service Categories Match</h3>
              <p className="text-slate-500 text-xs mt-1">Try checking your spelling or search for a general term like 'clean' or 'repair'.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
