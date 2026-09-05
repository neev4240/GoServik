import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Shield, CheckCircle2, Star, Award, MapPin, Phone, Mail, Clock, Users } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { LanguageSwitcher } from '../components/LanguageSelector';

// --- ABOUT PAGE ---
export function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100">{t('aboutStoryPill')}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t('aboutMainTitle')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('aboutMainSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{t('aboutStatPartners')}</h3>
            <p className="text-xs text-slate-500">{t('aboutStatPartnersDesc')}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{t('aboutStatDirect')}</h3>
            <p className="text-xs text-slate-500">{t('aboutStatDirectDesc')}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{t('aboutStatRating')}</h3>
            <p className="text-xs text-slate-500">{t('aboutStatRatingDesc')}</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('aboutNoMiddlemenTitle')}</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t('aboutNoMiddlemenDesc')}
          </p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start text-sm text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span><b>{t('aboutStdPricing')}</b> {t('aboutStdPricingDesc')}</span>
            </div>
            <div className="flex gap-3 items-start text-sm text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span><b>{t('aboutTraining')}</b> {t('aboutTrainingDesc')}</span>
            </div>
            <div className="flex gap-3 items-start text-sm text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span><b>{t('aboutSafetyFirst')}</b> {t('aboutSafetyFirstDesc')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CONTACT PAGE ---
export function ContactPage() {
  const { t } = useLanguage();
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 inline-block">{t('contactSupportPill')}</span>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('contactMainTitle')}</h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('contactMainSubtitle')}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <MapPin className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-bold">{t('contactOffice')}</p>
                  <p className="text-xs text-slate-500">{t('contactOfficeVal')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-bold">{t('contactHelpline')}</p>
                  <p className="text-xs text-slate-500">{t('contactHelplineVal')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-bold">Support Email</p>
                  <p className="text-xs text-slate-500">{t('contactEmailVal')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('contactSendMsgTitle')}</h2>
            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-100 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold">{t('contactSuccessTitle')}</h3>
                <p className="text-xs">{t('contactSuccessDesc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('contactFullName')}</label>
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
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('contactEmailOrMobile')}</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="your@email.com or 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('contactHelpQuery')}</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder={t('contactQueryPlaceholder')}
                  />
                </div>
                <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">
                  {t('contactSubmitTicket')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TRUST & SAFETY ---
export function TrustSafetyPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100">{t('trustPill')}</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('trustMainTitle')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('trustMainSubtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">{t('trustStepBg')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('trustStepBgDesc')}
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">{t('trustVerifiedProfiles')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('trustVerifiedProfilesDesc')}
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">{t('trustSos')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('trustSosDesc')}
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
  const { t } = useLanguage();

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100">{t('howItWorksPill')}</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('howItWorksMainTitle')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('howItWorksMainSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">01</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">🔍</div>
            <h3 className="font-bold text-slate-800 text-sm">{t('howStep1Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('howStep1Desc')}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">02</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">📅</div>
            <h3 className="font-bold text-slate-800 text-sm">{t('howStep2Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('howStep2Desc')}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">03</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">⚡</div>
            <h3 className="font-bold text-slate-800 text-sm">{t('howStep3Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('howStep3Desc')}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4">04</div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">💳</div>
            <h3 className="font-bold text-slate-800 text-sm">{t('howStep4Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('howStep4Desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUCCESS STORIES ---
export function SuccessStoriesPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100">{t('storiesPill')}</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('storiesMainTitle')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('storiesMainSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-xl space-y-4 flex flex-col justify-between">
            <p className="text-slate-600 italic text-sm leading-relaxed">
              {t('story1Quote')}
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">RP</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{t('story1Author')}</h4>
                <p className="text-xs text-indigo-600">{t('story1Role')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-xl space-y-4 flex flex-col justify-between">
            <p className="text-slate-600 italic text-sm leading-relaxed">
              {t('story2Quote')}
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">SK</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{t('story2Author')}</h4>
                <p className="text-xs text-indigo-600">{t('story2Role')}</p>
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
  const { t } = useLanguage();

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-600 bg-slate-100 rounded-full border border-slate-200">{t('guidelinesPill')}</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('guidelinesMainTitle')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('guidelinesMainSubtitle')}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">{t('guideProTitle')}</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">{t('guideStandard')}</p>
                <p className="text-xs">{t('guideStandardDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">{t('guideNoOffPlatform')}</p>
                <p className="text-xs">{t('guideNoOffPlatformDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">{t('guideAvailability')}</p>
                <p className="text-xs">{t('guideAvailabilityDesc')}</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t">{t('guideCustTitle')}</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">{t('guideRespect')}</p>
                <p className="text-xs">{t('guideRespectDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">{t('guideClearAccess')}</p>
                <p className="text-xs">{t('guideClearAccessDesc')}</p>
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
  const { t } = useLanguage();

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900">{t('privacyTitle')}</h1>
          <p className="text-xs text-slate-400 font-mono">KaamNow Trust & Privacy 2026</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('privacySubtitle')}
          </p>
          <div className="space-y-4 text-sm text-slate-700">
            <h2 className="font-bold text-slate-900">{t('privacySec1Title')}</h2>
            <p className="text-xs text-slate-500">{t('privacySec1Desc')}</p>
            
            <h2 className="font-bold text-slate-900">{t('privacySec2Title')}</h2>
            <p className="text-xs text-slate-500">{t('privacySec2Desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TERMS OF SERVICE ---
export function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-transparent min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900">{t('termsTitle')}</h1>
          <p className="text-xs text-slate-400 font-mono">KaamNow Marketplace Terms 2026</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('termsSubtitle')}
          </p>
          <div className="space-y-4 text-sm text-slate-700">
            <h2 className="font-bold text-slate-900">{t('termsSec1Title')}</h2>
            <p className="text-xs text-slate-500">{t('termsSec1Desc')}</p>
            
            <h2 className="font-bold text-slate-900">{t('termsSec2Title')}</h2>
            <p className="text-xs text-slate-500">{t('termsSec2Desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

