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
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Find the perfect professional for your next project.
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl">
              GoServik is the premium marketplace connecting you with verified, top-rated independent professionals across hundreds of services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/explore" className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-slate-900 shadow transition-colors hover:bg-slate-100">
                I Want to Hire a Professional
              </Link>
              <Link to="/register" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 backdrop-blur-sm px-8 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800">
                I Am a Professional
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b bg-white py-12">
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
      <section className="py-16 sm:py-24 bg-slate-50">
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
                className="group relative flex flex-col rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
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
