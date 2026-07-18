import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Star, MapPin, ShieldCheck, Clock, MessageSquare, Briefcase, ChevronRight, Heart } from 'lucide-react';

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const { professionals, categories, currentUser, toggleSavedProfessional, savedProfessionals } = useStore();
  
  const pro = professionals.find(p => p.id === id);
  const isSaved = pro ? savedProfessionals.includes(pro.id) : false;

  if (!pro) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900">Professional Not Found</h2>
        <p className="mt-2 text-slate-500">The profile you are looking for does not exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/explore">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen pb-16">
      {/* Profile Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/40 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex text-sm text-slate-500 mb-6">
            <Link to="/explore" className="hover:text-slate-900">Directory</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-slate-900 font-medium">{pro.name}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img 
              src={pro.avatar} 
              alt={pro.name} 
              className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
            
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold text-slate-900">{pro.name}</h1>
                    {pro.verified && (
                      <ShieldCheck className="h-6 w-6 text-blue-500" title="Verified Professional" />
                    )}
                  </div>
                  <p className="text-lg text-slate-600">{pro.tagline}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{pro.rating}</span>
                      <span className="underline decoration-slate-300">({pro.reviewCount} reviews)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {pro.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {pro.jobsCompleted} jobs completed
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-none gap-2"
                    onClick={() => {
                      if (!currentUser) alert("Please sign in to save professionals.");
                      else toggleSavedProfessional(pro.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  {currentUser?.role === 'professional' ? (
                    <Button disabled className="flex-1 sm:flex-none bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200">
                      Booking Restricted
                    </Button>
                  ) : (
                    <Button asChild className="flex-1 sm:flex-none">
                      <Link to={`/book/${pro.id}`}>Book Services</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/40 shadow-sm hover:shadow-lg transition-all">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About Me</h2>
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap">{pro.bio}</p>
              </div>
            </section>

            <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/40 shadow-sm hover:shadow-lg transition-all">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Services Offered</h2>
              <div className="space-y-4">
                {pro.services.map(service => {
                  const category = categories.find(c => c.id === service.categoryId);
                  return (
                    <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-slate-50/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{service.name}</h3>
                          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{category?.name}</span>
                        </div>
                        <p className="text-sm text-slate-600">{service.description}</p>
                        <p className="text-xs text-slate-500 mt-2">{service.experienceYears} years experience</p>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:text-right shrink-0">
                        <div className="font-bold text-lg text-slate-900">
                          ₹{service.basePrice}
                          <span className="text-sm font-normal text-slate-500">
                            {service.priceUnit === 'hourly' ? '/hr' : service.priceUnit === 'starting_at' ? ' and up' : ' fixed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {pro.gallery && pro.gallery.length > 0 && (
              <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/40 shadow-sm hover:shadow-lg transition-all">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Portfolio Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {pro.gallery.map((img, idx) => (
                    <img key={idx} src={img} alt={`Portfolio ${idx + 1}`} className="rounded-lg object-cover aspect-square w-full shadow-sm" />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm hover:shadow-lg transition-all">
              <h3 className="font-bold text-slate-900 mb-4">Professional Details</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-slate-600">
                  <MessageSquare className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block font-medium text-slate-900">Response Time</span>
                    {pro.responseTime}
                  </div>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block font-medium text-slate-900">Service Area</span>
                    Up to {pro.serviceRadiusKm}km from {pro.location}
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-slate-900 mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {pro.languages.map(lang => (
                    <span key={lang} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {pro.certifications.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-slate-900 mb-2">Certifications</h4>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                    {pro.certifications.map((cert, idx) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm hover:shadow-lg transition-all">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Working Hours
              </h3>
              <ul className="space-y-2 text-sm">
                {Object.entries(pro.workingHours).map(([day, hours]) => (
                  <li key={day} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600">{day}</span>
                    <span className="font-medium text-slate-900">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
