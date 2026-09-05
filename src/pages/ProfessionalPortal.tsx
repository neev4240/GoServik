import { Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, UserX, BookOpen, Clock,
  Award, Zap, CheckCircle2, HeartHandshake, TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore } from '../store';
import { useLanguage } from '../lib/i18n';
import { LanguageSwitcher } from '../components/LanguageSelector';

export function ProfessionalPortal() {
  const { currentUser } = useStore();
  const { t, lang } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 z-0"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3.5 py-1 text-[10px] uppercase tracking-widest font-bold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20 inline-block">
                {t('proPartnerNetwork')}
              </span>
              <LanguageSwitcher />
            </div>

            <h1 className="text-4xl font-black leading-[1.1] sm:text-5xl lg:text-6xl mb-6 tracking-tight">
              {t('proHeroTitle')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                {t('proHeroTitleSpan')}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              {t('proHeroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {currentUser?.role === 'professional' ? (
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-12 shadow-lg shadow-indigo-500/20">
                  <Link to="/dashboard">{t('proGoToDashboard')}</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-12 shadow-lg shadow-indigo-500/20">
                    <Link to="/register-professional">{t('proApplyBtn')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold text-xs h-12">
                    <Link to="/login-professional">{t('proLoginBtn')}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Strict Policy Section - Architectural Separation */}
      <section className="py-10 bg-amber-50/70 border-b border-amber-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">{t('proPolicyTitle')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('proPolicySubtitle')}
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <UserX className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{t('proSeparateAccounts')}:</span> {t('proSeparateAccountsDesc')}
                  </div>
                </li>
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{t('proDirectContractor')}:</span> {t('proDirectContractorDesc')}
                  </div>
                </li>
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <Clock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{t('proRealtimeWorkflow')}:</span> {t('proRealtimeWorkflowDesc')}
                  </div>
                </li>
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <BookOpen className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{t('proIdVerification')}:</span> {t('proIdVerificationDesc')}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Model & Transparency */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              {t('proFairEconomics')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              {t('proRevenueTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {t('proRevenueSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Launch Phase */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{t('proPhase1Badge')}</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{t('proPhase1Title')}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t('proPhase1Desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('proPhase1Active')}
                </span>
              </div>
            </div>

            {/* Platform Fee */}
            <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">{t('proCommissionBadge')}</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{t('proCommissionTitle')}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {t('proCommissionDesc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-200">
                <span className="text-xs font-bold text-indigo-700">
                  {t('proCommissionKeep')}
                </span>
              </div>
            </div>

            {/* Rating-Linked Subscriptions */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{t('proRatingTierBadge')}</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{t('proRatingTierTitle')}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t('proRatingTierDesc')}
                </p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>⭐ {lang === 'hi' ? '4.8 – 5.0 स्टार्स:' : '4.8 – 5.0 stars:'}</span>
                    <span className="text-emerald-600">{lang === 'hi' ? '₹100/माह (मैक्स डिस्काउंट)' : '₹100/mo (Max Discount)'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>⭐ {lang === 'hi' ? '4.5 – 4.79 स्टार्स:' : '4.5 – 4.79 stars:'}</span>
                    <span>{lang === 'hi' ? '₹250/माह (स्टैंडर्ड)' : '₹250/mo (Standard)'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>⭐ {lang === 'hi' ? '4.5 से कम स्टार्स:' : 'Below 4.5 stars:'}</span>
                    <span>{lang === 'hi' ? '₹500/माह (समीक्षा टियर)' : '₹500/mo (Review Tier)'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500">
                  {t('proRatingTierNotice')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Incentives & Gamification */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-indigo-700 bg-indigo-100/60 rounded-full">
              {t('proRewardsBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              {t('proRewardsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {t('proRewardsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                10
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('proReward10Title')}</h3>
              <p className="text-xs text-slate-500">
                {t('proReward10Desc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                50
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('proReward50Title')}</h3>
              <p className="text-xs text-slate-500">
                {t('proReward50Desc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                100
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('proReward100Title')}</h3>
              <p className="text-xs text-slate-500">
                {t('proReward100Desc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('proRewardSafetyTitle')}</h3>
              <p className="text-xs text-slate-500">
                {t('proRewardSafetyDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-14 sm:py-20 bg-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('proCtaTitle')}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            {t('proCtaSubtitle')}
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 font-black text-xs px-8 h-12 rounded-xl shadow-xl">
              <Link to="/register-professional">{t('proCtaApply')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
