import { useNavigate } from '../router-compat'
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Headphones, ShieldCheck, Sparkles } from 'lucide-react'
import { useApp } from '../context'
import { packageIcon } from '../data'
import { hasRealOriginalPrice, usdAmount } from '../price'
import heroFamily from '../../assets/siraj-hero-family.jpg'
import teacherSession from '../../assets/siraj-teacher-session.jpg'

export default function Landing() {
  const { t, dir, language, setSelectedPackageId, currentUser, siteContent } = useApp()
  const navigate = useNavigate()
  const { packages: allPackages, familyDiscounts, programs, features, stats, hero, testimonials } = siteContent
  const packages = allPackages.filter(pkg => pkg.active !== false)
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const handleSubscribe = (packageId: string) => {
    setSelectedPackageId(packageId)
    navigate(currentUser ? '/subscribe' : '/login')
  }

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <section className="home-hero overflow-hidden px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-36">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="order-2 lg:order-1">
            <div className="hero-image-shell">
              <img src={heroFamily} alt={t('أم وطفلتها تتعلمان القرآن عبر الإنترنت', 'A mother and daughter learning Quran online')} width={1408} height={1008} className="aspect-[7/5] w-full object-cover" />
              <div className="hero-image-tag"><Sparkles size={16} />{t('تعليم مباشر وتفاعلي', 'Live, interactive learning')}</div>
            </div>
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-start">
            <span className="font-display text-4xl font-black text-primary md:text-5xl">{t('سِراج', 'SIRAJ ACADEMY')}</span>
            <h1 className="mt-5 text-4xl font-black leading-[1.25] text-foreground md:text-6xl">
              {t('رحلة تبدأ بآية...', 'A journey begins with a verse...')}
              <span className="mt-1 block text-primary">{t('وتنتهي بقلبٍ معلّق بالقرآن.', 'and grows into a lifelong love of Quran.')}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg lg:mx-0">
              {language === 'ar' ? hero.titleAr : hero.titleEn}. {language === 'ar' ? hero.subtitleAr : hero.subtitleEn}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button onClick={() => navigate('/register')} className="btn-accent inline-flex min-h-14 items-center justify-center gap-2 px-7 text-base">
                {t('ابدأ رحلتك الآن', 'Start your journey')}<Arrow size={18} />
              </button>
              <a href="#packages" className="btn-outline inline-flex min-h-14 items-center justify-center px-7 text-base">{t('استكشف الباقات', 'Explore packages')}</a>
            </div>
            <div className="mt-9 grid grid-cols-3 gap-2 border-t border-border pt-6">
              {stats.slice(0, 3).map(stat => (
                <div key={stat.id} className="text-center lg:text-start">
                  <div className="text-xl font-black text-foreground md:text-2xl">{language === 'ar' ? stat.valueAr : stat.valueEn}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{language === 'ar' ? stat.labelAr : stat.labelEn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {features.length > 0 && (
        <section className="section-band px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <span className="section-kicker">{t('لماذا سراج؟', 'Why Siraj?')}</span>
                <h2 className="section-title mt-4">{t('لماذا يختار أولياء الأمور سراج؟', 'Why do parents choose Siraj?')}</h2>
                <p className="mt-5 max-w-xl leading-8 text-muted-foreground">
                  {t('كل تفصيلة في رحلتنا التعليمية صُممت لتمنح الطالب تعلماً متقناً، وتمنح ولي الأمر الثقة والاطمئنان في كل خطوة.', 'Every part of our learning journey gives students mastery and parents confidence at every step.')}
                </p>
              </div>
              <div className="learning-image-frame">
                <img src={teacherSession} alt={t('معلم قرآن يتابع طفلين في حصة مباشرة', 'A Quran teacher guiding two children in a live lesson')} loading="lazy" width={1408} height={1008} className="aspect-[7/5] w-full object-cover" />
              </div>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.slice(0, 4).map(feature => (
                <article key={feature.id} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{language === 'ar' ? (feature.titleAr || feature.nameAr) : (feature.titleEn || feature.nameEn)}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{language === 'ar' ? feature.descAr : feature.descEn}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {programs.length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="section-kicker">{t('ماذا نقدم؟', 'What we offer')}</span>
              <h2 className="section-title mt-4">{t('تعليم أصيل بأسلوب معاصر', 'Authentic learning, modern delivery')}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{t('برامج مرنة تبني صلة حقيقية بالقرآن وتناسب مستوى كل طالب وعمره.', 'Flexible programs that build a genuine Quran connection for every age and level.')}</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
              {programs.filter(program => program.active !== false).map(program => (
                <article key={program.id} className="program-card group">
                  <div className="program-icon">{program.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{language === 'ar' ? program.nameAr : program.nameEn}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{language === 'ar' ? program.descAr : program.descEn}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {packages.length > 0 && (
        <section id="packages" className="packages-band px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="section-kicker">{t('الباقات', 'Packages')}</span>
              <h2 className="section-title mt-4">{t('اختر الباقة التي تناسب رحلتك', 'Choose the plan for your journey')}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{t('جميع الباقات تمنحك نفس الجودة التعليمية والمتابعة المستمرة.', 'Every plan includes the same teaching quality and continuous support.')}</p>
            </div>
            <div className={`mt-12 grid items-stretch gap-6 ${packages.length >= 3 ? 'lg:grid-cols-3' : packages.length === 2 ? 'mx-auto max-w-4xl md:grid-cols-2' : 'mx-auto max-w-md'}`}>
              {packages.map(pkg => (
                <article key={pkg.id} className={`package-card ${pkg.highlight ? 'package-card-featured' : ''}`}>
                  {pkg.badge && <span className="package-badge">{language === 'ar' ? pkg.badge.ar : pkg.badge.en}</span>}
                  <div className="flex items-center gap-3">
                    <div className="program-icon text-xl">{packageIcon(pkg)}</div>
                    <div>
                      <h3 className="text-xl font-black text-foreground">{language === 'ar' ? pkg.nameAr : pkg.nameEn}</h3>
                      <p className="text-xs text-muted-foreground">{pkg.sessionsPerWeek} {t('حصص أسبوعياً', 'sessions weekly')}</p>
                    </div>
                  </div>
                  <div className="mt-7 border-b border-border pb-7">
                    {hasRealOriginalPrice(pkg) && (
                      <p className="text-sm text-muted-foreground line-through">
                        {language === 'en' && pkg.priceUsd != null ? `$ ${usdAmount(pkg.originalPrice ?? pkg.price, pkg) ?? pkg.priceUsd}` : `${pkg.originalPrice} ${t('ريال', 'SAR')}`}
                      </p>
                    )}
                    {language === 'en' && pkg.priceUsd != null ? (
                      <div className="mt-1 flex items-end gap-2"><strong className="text-4xl font-black text-primary" dir="ltr">$ {pkg.priceUsd}</strong><span className="pb-1 text-sm text-muted-foreground">{t('دولار / شهر', 'USD / month')}</span></div>
                    ) : (
                      <div className="mt-1 flex items-end gap-2"><strong className="text-4xl font-black text-primary">{pkg.price}</strong><span className="pb-1 text-sm text-muted-foreground">{t('ريال / شهر', 'SAR / month')}</span></div>
                    )}
                    {pkg.priceUsd != null && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {language === 'en'
                          ? <>or <strong className="text-foreground">{pkg.price} SAR</strong> / month</>
                          : <>{t('أو', 'or')} <strong className="text-foreground" dir="ltr">$ {pkg.priceUsd}</strong> {t('دولار / شهر', 'USD / month')}</>}
                      </p>
                    )}

                    <p className="mt-2 text-sm font-semibold text-foreground">{pkg.sessions} {t('حصة شهرياً', 'sessions monthly')}</p>
                  </div>
                  <ul className="my-7 flex-1 space-y-3">
                    {(language === 'ar' ? pkg.featuresAr : pkg.featuresEn).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-foreground"><Check size={17} className="mt-0.5 shrink-0 text-primary" /><span>{feature}</span></li>
                    ))}
                  </ul>
                  <button onClick={() => handleSubscribe(pkg.id)} className={pkg.highlight ? 'btn-accent min-h-12 w-full px-5' : 'btn-outline min-h-12 w-full px-5'}>{t('اختر هذه الباقة', 'Choose this plan')}</button>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [ShieldCheck, t('جودة تعليمية عالية', 'High teaching quality')],
                [Headphones, t('دعم مستمر', 'Continuous support')],
                [ClipboardCheck, t('متابعة دورية', 'Regular progress reports')],
                [Sparkles, t('مرونة في المواعيد', 'Flexible scheduling')],
              ].map(([Icon, label]) => {
                const BenefitIcon = Icon as typeof ShieldCheck
                return <div key={String(label)} className="package-assurance"><BenefitIcon size={20} /><span>{label as string}</span></div>
              })}
            </div>
          </div>
        </section>
      )}

      {familyDiscounts.length > 0 && (
        <section id="family" className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <span className="section-kicker">{t('للعائلات', 'For families')}</span>
              <h2 className="section-title mt-4">{t('كلما كبرت العائلة، زاد التوفير', 'More learners, more savings')}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{t('نؤمن أن نور القرآن يستحق أن يصل إلى جميع أفراد الأسرة، لذلك أعددنا خصومات خاصة للعائلات.', 'We want Quran learning to reach the whole family, with dedicated family savings.')}</p>
              <button onClick={() => navigate('/register')} className="btn-accent mt-7 inline-flex min-h-12 items-center gap-2 px-6">{t('سجّل عائلتك', 'Register your family')}<Arrow size={17} /></button>
            </div>
            <div className="family-table">
              {familyDiscounts.map(discount => (
                <div key={discount.order} className="family-row">
                  <span className="text-2xl">{discount.icon}</span>
                  <span className="font-bold text-foreground">{language === 'ar' ? discount.labelAr : discount.labelEn}</span>
                  <strong className="text-primary">{discount.discount > 0 ? `${discount.discount}%` : t('السعر كامل', 'Full price')}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section id="reviews" className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="section-kicker">{t('آراء طلابنا', 'Testimonials')}</span>
              <h2 className="section-title mt-4">{t('قصص نجاح مع سِراج', 'Success stories with Siraj')}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{t('آراء أولياء الأمور والطلاب الذين بدأوا رحلتهم معنا.', 'What parents and students say about their journey with us.')}</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map(item => (
                <article key={item.id} className="feature-card">
                  <div className="flex gap-1 text-lg text-accent" aria-label={`${item.rating}/5`}>{'★'.repeat(Math.max(1, Math.min(5, item.rating)))}</div>
                  <p className="mt-4 text-sm leading-7 text-foreground">{language === 'ar' ? `«${item.textAr}»` : `"${item.textEn}"`}</p>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-sm font-bold text-foreground">{language === 'ar' ? item.nameAr : item.nameEn}</p>
                    <p className="text-xs text-muted-foreground">{item.country}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="referral" className="final-cta px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <span className="section-kicker section-kicker-light">{t('ابدأ اليوم', 'Start today')}</span>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight text-primary-foreground md:text-5xl">{language === 'ar' ? hero.taglineAr : hero.taglineEn}</h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-primary-foreground/80">{t(`ادعُ صديقاً واحصلا معاً على خصم ${hero.referralDiscount} ريال على الاشتراك التالي.`, `Invite a friend and both receive ${hero.referralDiscount} SAR off your next subscription.`)}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('/register')} className="btn-light min-h-14 px-8">{t('سجّل الآن', 'Register now')}</button>
            <a href="#packages" className="btn-dark-outline min-h-14 px-8">{t('عرض الباقات', 'View packages')}</a>
          </div>
        </div>
      </section>
    </div>
  )
}