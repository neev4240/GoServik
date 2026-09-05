import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Shield, CheckCircle2, Star, Award, MapPin, Phone, Mail, Clock, HelpCircle, Heart, Users, Compass } from 'lucide-react';

// --- ABOUT PAGE ---
export function AboutPage() {
  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100">Our Story</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Connecting You With Independent Experts</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            KaamNow is India's fast, trusted, bilingual service marketplace connecting customers with nearby independent skilled professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">10,000+ Partners</h3>
            <p className="text-xs text-slate-500">Rigorous background verification and identity screening processes.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Direct Meetings</h3>
            <p className="text-xs text-slate-500">Easily compare multiple independent experts by inviting them to your home.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">4.8+ Avg Rating</h3>
            <p className="text-xs text-slate-500">Customers consistently rate our specialized partners as top-tier industry experts.</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Direct Marketplace, Zero Middlemen</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            KaamNow is a direct marketplace and connector. KaamNow itself does not perform the trade services, and verified professionals are independent contractors, not employees of KaamNow. We provide identity verification, transparent diagnostics rate guidance, direct in-app chat, and the KaamNow Work Protection guarantee.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start text-sm text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span><b>Standardized Pricing:</b> No pre-booking haggling. Transparent, pre-approved Indian Rupee rate cards for all service packages.</span>
            </div>
            <div className="flex gap-3 items-start text-sm text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span><b>Advanced Training:</b> Intensive bootcamps covering technical execution, safety standards, and hygiene.</span>
            </div>
            <div className="flex gap-3 items-start text-sm text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span><b>Safety First:</b> Mandatory identity validation, address verification, and continuous performance tracking.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CONTACT PAGE ---
export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-6">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 inline-block">Support</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our specialized support team is available 24/7 to assist customers and professionals with bookings, payments, and platform onboarding.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <MapPin className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold">Corporate Office</p>
                <p className="text-xs text-slate-500">Sector 43, Gurugram, Haryana, 122002, India</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold">Helpline</p>
                <p className="text-xs text-slate-500">1800-419-4530 (Toll-free, India)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold">Support Email</p>
                <p className="text-xs text-slate-500">support@kaamnow.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Send a Message</h2>
          {submitted ? (
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-100 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold">Message Submitted!</h3>
              <p className="text-xs">Thank you for reaching out. We will respond within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address / Mobile</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="your@email.com or XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">How can we help?</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Describe your inquiry or support request..."
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">
                Submit Helpline Ticket
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// --- TRUST & SAFETY ---
export function TrustSafetyPage() {
  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100">Guaranteed Protection</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Trust & Safety Shield</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your safety and peace of mind are our absolute priority. We implement strict standards to protect every booking.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">7-Step Background Checks</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every service professional goes through physical address verification, government-issued photo ID checks, criminal background checks, past employer reviews, and practical test-bench qualification. Only top candidates are allowed onto the platform.
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">Verified Profiles & Reviews</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We confirm address records and ID details of every expert. Customers are free to read past user ratings and make informed decisions easily.
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">SOS Emergency Support & Geolocation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                During an active booking, both customers and professionals can trigger an SOS button from the dashboard to directly ping our 24/7 security control room and emergency helpline contacts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HOW IT WORKS ---
export function HowItWorksPage() {
  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100">Simple Walkthrough</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">How KaamNow Works</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect. Book. Sorted. We've simplified how you book top-tier independent professionals with complete safety and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">01</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">🔍</div>
            <h3 className="font-bold text-slate-800 text-sm">Explore Services</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Browse verified expert categories and standardized transparent pricing packages in Indian Rupees.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">02</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">📅</div>
            <h3 className="font-bold text-slate-800 text-sm">Schedule Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Select your preferred date, time slot, and enter any special instructions for the service delivery.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">03</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">⚡</div>
            <h3 className="font-bold text-slate-800 text-sm">Instant Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Our platform pairs you with the highest-rated verified partner available in your location radius.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">04</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">💳</div>
            <h3 className="font-bold text-slate-800 text-sm">Safe Checkouts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Safe payment models holding the amount securely until you verify the job is fully completed to your liking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUCCESS STORIES ---
export function SuccessStoriesPage() {
  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100">On-ground Impact</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Partner Success Stories</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            By standardizing and supporting independent micro-entrepreneurs, we help our partners double their monthly earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-xl space-y-4 flex flex-col justify-between">
            <p className="text-slate-600 italic text-sm leading-relaxed">
              "Before joining KaamNow, my plumbing work was highly seasonal. I had to pay heavy commissions to local brokers just to find jobs. Now, I receive pre-paid confirmed bookings in my area daily, and my family's income has stabilized at 3x higher than before."
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">RP</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Rajesh Prasad</h4>
                <p className="text-xs text-indigo-600">Expert Plumbing Partner, Delhi NCR</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-xl space-y-4 flex flex-col justify-between">
            <p className="text-slate-600 italic text-sm leading-relaxed">
              "The direct booking tools and fair 5% platform fee on KaamNow transformed how customers view my service. I get respected, paid fairly, and can easily manage my availability directly from my partner app dashboard."
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">SK</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Savita Kumari</h4>
                <p className="text-xs text-indigo-600">Elite Deep Cleaning Specialist, Gurugram</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMMUNITY GUIDELINES ---
export function CommunityGuidelinesPage() {
  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-600 bg-slate-100 rounded-full border border-slate-200">Our Code</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Community Guidelines</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We foster a safe, respectful, and highly professional community of customers and service partners.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">For Service Professionals</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Professional Standards</p>
                <p className="text-xs">Follow standard trade safety parameters, carry valid government identification, and maintain respectful conduct at all client locations.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Zero Direct Solicitation</p>
                <p className="text-xs">Exchanging contact info to take bookings off-platform is strictly prohibited to maintain standardized visit rate parameters.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Availability Integrity</p>
                <p className="text-xs">Do not reject accepted service slots except in medical/critical emergencies to keep customer satisfaction high.</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t">For Customers</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Respectful Work Environments</p>
                <p className="text-xs">Treat visiting technicians and partners with dignity, ensure access, and keep pets or infants secured during service operations.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Clear Access & Description</p>
                <p className="text-xs">Provide accurate descriptions of tasks (e.g. height, electricity access) so our partners bring correct tools.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PRIVACY POLICY ---
export function PrivacyPolicyPage() {
  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-400 font-mono">Last updated: September 2026</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          At KaamNow, we value and respect the confidentiality of our users. This privacy policy outlines how we collect, store, process, and protect your information when you access our marketplace platform.
        </p>
        <div className="space-y-4 text-sm text-slate-700">
          <h2 className="font-bold text-slate-900">1. Information We Collect</h2>
          <p className="text-xs text-slate-500">We collect your name, email address, mobile number, geolocation coordinates (to pair you with nearest available partners), payment details, and booking metadata.</p>
          
          <h2 className="font-bold text-slate-900">2. How We Use Information</h2>
          <p className="text-xs text-slate-500">All data is used directly to fulfill booking requests, dispatch verified technicians, trigger emergency SOS triggers, and maintain support helplines.</p>
        </div>
      </div>
    </div>
  );
}

// --- TERMS OF SERVICE ---
export function TermsPage() {
  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-400 font-mono">Last updated: September 2026</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Welcome to KaamNow. By accessing or using our marketplace platform, you agree to comply with and be bound by the following Terms and Conditions of use. KaamNow is a technology marketplace connecting customers with independent service professionals. KaamNow does not perform services directly and professionals are independent contractors.
        </p>
        <div className="space-y-4 text-sm text-slate-700">
          <h2 className="font-bold text-slate-900">1. Standardized Bookings & Visit Fee</h2>
          <p className="text-xs text-slate-500">Bookings placed through KaamNow are subject to the ₹99 diagnostic visiting fee card. Any modifications, spare parts, or custom pricing requests must be confirmed between customer and professional.</p>
          
          <h2 className="font-bold text-slate-900">2. Cancellation Policy</h2>
          <p className="text-xs text-slate-500">Bookings cancelled within 2 hours of the scheduled service slot may incur a standard ₹100 dispatch penalty fee to compensate partners for fuel and mobilization.</p>
        </div>
      </div>
    </div>
  );
}
