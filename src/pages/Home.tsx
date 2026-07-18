import { Link } from 'react-router-dom';
import { Search, Briefcase, Star, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';

export function Home() {
  const { categories } = useStore();
  const topCategories = categories.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            
            <div className="flex-1 max-w-xl">
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 inline-block mb-6">
                Verified Marketplace
              </span>
              <h1 className="text-4xl font-extrabold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl mb-6 tracking-tight">
                Your destination for <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">expert help.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl">
                Discover and book verified home service professionals across 16+ categories. Premium quality, standardized pricing, and instant scheduling.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/explore" className="group relative flex-1 p-6 bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-200">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">I Want to Book a Service</div>
                  <div className="text-xs text-slate-500">Explore and book home services</div>
                </Link>
                
                <Link to="/professionals" className="group relative flex-1 p-6 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-white mb-1">I am a Professional</div>
                  <div className="text-xs text-indigo-100">Join as a verified partner</div>
                </Link>
              </div>
            </div>

            <div className="w-full md:w-[420px] shrink-0 hidden lg:flex flex-col gap-6">
               <div className="bg-white/80 rounded-3xl p-6 shadow-2xl shadow-indigo-100/50 border border-white relative overflow-hidden backdrop-blur-xl">
                 <div className="absolute top-0 right-0 p-4">
                    <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      Direct Booking
                    </div>
                 </div>
                 <div className="flex gap-4 items-center mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-xl text-indigo-600">
                      <ShieldCheck className="h-8 w-8 text-indigo-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 leading-tight">Direct Booking Model</h3>
                      <div className="text-sm text-slate-500">Transparent & Commission-Free</div>
                    </div>
                 </div>
                 <div className="space-y-3.5 mb-6">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-indigo-600 font-bold text-sm bg-indigo-50 px-2.5 py-0.5 rounded-lg">0%</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">No Platform Commission</div>
                        <div className="text-[10px] text-slate-500">You book instantly and pay directly after service, with no middleman.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-indigo-600 font-bold text-sm bg-indigo-50 px-2 py-0.5 rounded-lg">✓</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Standard Diagnostics Fee</div>
                        <div className="text-[10px] text-slate-500">Flat ₹99 visit fee. No complex pricing charts or size estimates.</div>
                      </div>
                    </div>
                 </div>
                 <Link to="/explore">
                   <Button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 h-auto">Find Services Now</Button>
                 </Link>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white/40 backdrop-blur-sm border-y border-white/40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Verified Professionals</h3>
                <p className="text-sm text-slate-500 mt-1">Every professional is vetted for quality and reliability.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Transparent Reviews</h3>
                <p className="text-sm text-slate-500 mt-1">Read genuine reviews from verified past customers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-purple-50 p-3 text-purple-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Seamless Booking</h3>
                <p className="text-sm text-slate-500 mt-1">Book services instantly with transparent pricing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Popular Categories</h2>
            <Link to="/explore" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCategories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/explore?category=${cat.id}`}
                className="group relative flex flex-col rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md p-6 shadow-sm transition-all hover:shadow-xl hover:bg-white"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                  {/* Mock icons, ideally mapped to lucide components */}
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-slate-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
