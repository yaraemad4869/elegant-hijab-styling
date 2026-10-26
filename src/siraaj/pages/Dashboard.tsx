import { useState } from 'react'
import { useNavigate } from '../router-compat'
import { Copy, Check, BookOpen, Calendar, Award, Users, TrendingUp, Plus } from 'lucide-react'
import { useApp } from '../context'
import { MOCK_CHILDREN, DAYS, packageIcon } from '../data'

export default function Dashboard() {
  const { currentUser, t, dir, language, setSelectedPackageId, siteContent } = useApp()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  if (!currentUser) {
    navigate('/login')
    return null
  }

  const isGuardian = currentUser.role === 'guardian'
  const pkg = siteContent.packages.find(p => p.id === currentUser.packageId)
  const children = MOCK_CHILDREN.filter(c => currentUser.childrenIds?.includes(c.id))

  const copyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubscribe = (packageId: string) => {
    setSelectedPackageId(packageId)
    navigate('/subscribe')
  }

  const weeklyProgress = [65, 80, 45, 90, 70, 85, 60]
  const days = [t('س', 'S'), t('أ', 'S'), t('ث', 'M'), t('ر', 'T'), t('خ', 'W'), t('ج', 'T'), t('ح', 'F')]

  return (
    <div dir={dir} className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">{t('أهلاً وسهلاً,', 'Welcome back,')}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold gold-text">{currentUser.nameAr}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isGuardian
              ? t('لوحة تحكم ولي الأمر', "Guardian's Dashboard")
              : t('لوحة تحكم الطالب', "Student's Dashboard")}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          {[
            { icon: <BookOpen size={20} />, value: pkg ? pkg.sessions.toString() : '—', labelAr: 'حصص الشهر', labelEn: 'Monthly Sessions', color: 'var(--primary)' },
            { icon: <Calendar size={20} />, value: isGuardian ? children.length.toString() : '3', labelAr: isGuardian ? 'أطفال مسجلون' : 'حصص مكتملة', labelEn: isGuardian ? 'Enrolled Children' : 'Completed Sessions', color: 'var(--emerald-light)' },
            // { icon: <TrendingUp size={20} />, value: '١٢', valueEn: '12', labelAr: 'يوماً متواصلاً', labelEn: 'Day Streak', color: '#A855F7' },
            // { icon: <Award size={20} />, value: '٢', valueEn: '2', labelAr: 'شهادة مكتسبة', labelEn: 'Certificates Earned', color: '#F59E0B' },
          ].map((stat, i) => (
            <div
              key={i}
              className="card-glow p-5 rounded-2xl flex flex-col gap-2"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18`, color: stat.color }}>
                {stat.icon}
              </div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? stat.labelAr : stat.labelEn}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Current subscription */}
            {!isGuardian && pkg && (
              <div
                className="card-glow p-6 rounded-2xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <h2 className="font-bold text-lg mb-4">{t('اشتراكي الحالي', 'My Current Subscription')}</h2>
                <div
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: `${pkg.color}10`, border: `1px solid ${pkg.color}30` }}
                >
                  <div className="text-4xl">{packageIcon(pkg)}</div>
                  <div className="flex-1">
                    <p className="font-bold text-xl">{t('باقة', 'Package')} {language === 'ar' ? pkg.nameAr : pkg.nameEn}</p>
                    <p className="text-sm text-muted-foreground">{pkg.sessions} {t('حصة شهرياً', 'sessions/month')} — {pkg.sessionsPerWeek} {t('أسبوعياً', '/week')}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-display text-2xl font-bold gold-text">{pkg.price}</p>
                    <p className="text-xs text-muted-foreground">{t('ريال/شهر', 'SAR/mo')}</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="mt-5">
                  <p className="text-sm font-semibold text-muted-foreground mb-3">{t('مواعيد حصصي الأسبوعية', 'My Weekly Schedule')}</p>
                  <div className="flex flex-wrap gap-2">
                    {(currentUser.schedule || ['sat-09:00', 'mon-09:00', 'wed-09:00']).map(slot => {
                      const [dayId, time] = slot.split('-')
                      const day = DAYS.find(d => d.id === dayId)
                      return (
                        <span
                          key={slot}
                          className="text-xs px-3 py-1.5 rounded-lg font-en"
                          style={{ background: 'rgba(244,91,6,0.1)', border: '1px solid rgba(244,91,6,0.2)', color: 'var(--primary)' }}
                        >
                          {language === 'ar' ? day?.ar : day?.en} {time}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Guardian: children list */}
            {isGuardian && (
              <div
                className="card-glow p-6 rounded-2xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg">{t('أطفالي المسجلون', 'My Enrolled Children')}</h2>
                  <button
                    onClick={() => navigate('/register/child')}
                    className="btn-outline px-4 py-2 text-sm flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    {t('إضافة طفل', 'Add Child')}
                  </button>
                </div>
                {children.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Users size={32} className="mx-auto mb-3 opacity-40" />
                    <p>{t('لا يوجد أطفال مسجلون حتى الآن', 'No children enrolled yet')}</p>
                    <button onClick={() => navigate('/register/child')} className="btn-primary mt-4 px-6 py-2 text-sm">
                      {t('سجّل طفلك الآن', 'Enroll Your Child Now')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {children.map((child, i) => {
                      const childPkg = siteContent.packages.find(p => p.id === child.packageId)
                      return (
                        <div
                          key={child.id}
                          className="p-4 rounded-xl"
                          style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                              style={{ background: `rgba(244,91,6,0.15)`, color: 'var(--primary)' }}
                            >
                              {child.nameAr.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold">{language === 'ar' ? child.nameAr : child.nameEn}</p>
                              <p className="text-xs text-muted-foreground">{child.age} {t('سنة', 'years')} — {child.level}</p>
                            </div>
                            <span
                              className="text-xs px-2 py-1 rounded-full font-semibold"
                              style={{ background: 'rgba(68,195,198,0.12)', color: 'var(--emerald-light)' }}
                            >
                              {t('نشط', 'Active')}
                            </span>
                          </div>
                          {childPkg && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{t('الباقة:', 'Package:')} <strong>{language === 'ar' ? childPkg.nameAr : childPkg.nameEn}</strong></span>
                              <span className="text-muted-foreground">{childPkg.price} {t('ر/شهر', 'SAR/mo')}</span>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {child.schedule.map(slot => {
                              const [dayId, time] = slot.split('-')
                              const day = DAYS.find(d => d.id === dayId)
                              return (
                                <span key={slot} className="text-[10px] px-2 py-1 rounded font-en" style={{ background: 'rgba(244,91,6,0.08)', color: 'var(--primary)' }}>
                                  {language === 'ar' ? day?.ar : day?.en} {time}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Progress chart */}
            {/* <div
              className="card-glow p-6 rounded-2xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h2 className="font-bold text-lg mb-5">{t('تقدم هذا الأسبوع', 'This Week\'s Progress')}</h2>
              <div className="flex items-end gap-2 h-24">
                {weeklyProgress.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${val}%`,
                        background: i === 3 ? 'var(--primary)' : 'rgba(244,91,6,0.3)',
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Referral code */}
            <div
              className="card-glow-gold p-6 rounded-2xl"
              style={{ background: 'linear-gradient(135deg,#FFFFFF,#F1F5F9)', border: '1px solid rgba(244,91,6,0.3)' }}
            >
              <p className="text-sm font-semibold mb-1 text-primary">🤝 {t('كود دعوة صديق', 'Referral Code')}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {t('شارك كودك — كلاكما يحصل على ٥٠ ريال خصم', 'Share your code — both get 50 SAR off')}
              </p>
              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(244,91,6,0.2)' }}
              >
                <span className="flex-1 font-bold font-en text-primary tracking-widest text-sm">{currentUser.referralCode}</span>
                <button
                  onClick={copyCode}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: copied ? 'rgba(68,195,198,0.2)' : 'rgba(244,91,6,0.15)', color: copied ? 'var(--emerald-light)' : 'var(--primary)' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {copied ? t('✓ تم النسخ!', '✓ Copied!') : t('اضغط لنسخ الكود', 'Click to copy the code')}
              </p>
            </div>

            {/* Upgrade package */}
            {/* {!isGuardian && currentUser.packageId !== 'vip' && (
              <div
                className="card-glow p-5 rounded-2xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <h3 className="font-bold mb-2">{t('ترقية الباقة', 'Upgrade Package')}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {t('حقق تقدماً أسرع مع المزيد من الحصص', 'Achieve faster progress with more sessions')}
                </p>
                <div className="flex flex-col gap-2">
                  {siteContent.packages.filter(p => p.id !== currentUser.packageId && p.active !== false).map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSubscribe(p.id)}
                      className="flex items-center gap-3 p-3 rounded-xl text-sm transition-all text-start"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    >
                      <span className="text-xl">{packageIcon(p)}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{language === 'ar' ? p.nameAr : p.nameEn}</p>
                        <p className="text-xs text-muted-foreground">{p.price} {t('ر/شهر', 'SAR/mo')}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )} */}

            {/* Quick info */}
            <div
              className="card-glow p-5 rounded-2xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-bold mb-3">{t('معلوماتي', 'My Info')}</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('الاسم', 'Name')}</span>
                  <span className="font-medium text-end">{currentUser.nameAr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('الجوال', 'Phone')}</span>
                  <span className="font-medium font-en" dir="ltr">{currentUser.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('النوع', 'Type')}</span>
                  <span className="font-medium">
                    {currentUser.role === 'student' ? t('طالب', 'Student') : t('ولي أمر', 'Guardian')}
                  </span>
                </div>
                {currentUser.joinDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('تاريخ الانضمام', 'Join Date')}</span>
                    <span className="font-medium font-en">{currentUser.joinDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
