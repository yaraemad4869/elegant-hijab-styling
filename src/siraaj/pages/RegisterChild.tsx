import { useState } from 'react'
import { useNavigate } from '../router-compat'
import { User, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useApp } from '../context'
import { LEVELS } from '../data'
import sirajLogo from '../../assets/siraj-logo-transparent.png'

export default function RegisterChild() {
  const { t, dir, language, setSelectedPackageId, setSubscriptionState, currentUser, siteContent } = useApp()
  const { familyDiscounts: FAMILY_DISCOUNTS } = siteContent
  const PACKAGES = siteContent.packages.filter(p => p.active !== false)
  const navigate = useNavigate()

  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [level, setLevel] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const childrenCount = (currentUser?.childrenIds?.length || 0) + 1
  const discount = FAMILY_DISCOUNTS.find(fd => fd.order === Math.min(childrenCount, 4))?.discount || 0

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!childName.trim()) errs.childName = t('اسم الطفل مطلوب', "Child's name is required")
    if (!childAge) errs.childAge = t('عمر الطفل مطلوب', "Child's age is required")
    if (!level) errs.level = t('المستوى مطلوب', 'Level is required')
    if (!selectedPackage) errs.selectedPackage = t('يرجى اختيار الباقة', 'Please select a package')
    return errs
  }

  const handleContinue = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const pkg = PACKAGES.find(p => p.id === selectedPackage)!
    const discountedPrice = Math.round(pkg.price * (1 - discount / 100))

    setSelectedPackageId(selectedPackage)
    setSubscriptionState({
      packageId: selectedPackage,
      schedule: [],
      discountCode: '',
      discountAmount: pkg.price - discountedPrice,
      finalPrice: discountedPrice,
      childData: {
        nameAr: childName,
        nameEn: childName,
        age: parseInt(childAge),
        level,
        packageId: selectedPackage,
        schedule: [],
      },
    })
    navigate('/subscribe')
  }

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center px-4 py-20 islamic-pattern">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(244,91,6,0.06) 0%, transparent 60%)' }}
      />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={sirajLogo}
            alt="شعار أكاديمية سراج"
            className="w-20 h-20 rounded-2xl object-contain mb-4 mx-auto drop-shadow-md"
          />
          <h1 className="text-2xl font-bold">{t('بيانات الطفل', "Child's Details")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('سجّل بيانات طفلك واختر الباقة المناسبة له', "Register your child's details and choose the right package")}
          </p>
          {childrenCount > 1 && discount > 0 && (
            <div
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(68,195,198,0.12)', color: 'var(--emerald-light)', border: '1px solid rgba(68,195,198,0.2)' }}
            >
              🎉 {t(`طفلك الـ${childrenCount} يحصل على خصم ${discount}%`, `Your ${childrenCount}${childrenCount === 2 ? 'nd' : childrenCount === 3 ? 'rd' : 'th'} child gets ${discount}% off!`)}
            </div>
          )}
        </div>

        <div
          className="rounded-2xl card-glow"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {/* Child details section */}
          <div className="p-8 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-lg mb-5">{t('بيانات الطفل', "Child's Information")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-semibold">{t('اسم الطفل', "Child's Name")}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={childName}
                    onChange={e => setChildName(e.target.value)}
                    placeholder={t('يوسف محمد', 'Youssef Mohamed')}
                    className="w-full px-4 py-3 ps-11"
                  />
                  <User size={15} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '14px' }} />
                </div>
                {errors.childName && <p className="text-xs text-destructive">{errors.childName}</p>}
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">{t('العمر', 'Age')}</label>
                <select
                  value={childAge}
                  onChange={e => setChildAge(e.target.value)}
                  className="w-full px-4 py-3"
                >
                  <option value="">{t('اختر العمر', 'Select age')}</option>
                  {Array.from({ length: 20 }, (_, i) => i + 4).map(age => (
                    <option key={age} value={age}>{age} {t('سنوات', 'years')}</option>
                  ))}
                </select>
                {errors.childAge && <p className="text-xs text-destructive">{errors.childAge}</p>}
              </div>

              {/* Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">{t('المستوى الحالي', 'Current Level')}</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full px-4 py-3"
                >
                  <option value="">{t('اختر المستوى', 'Select level')}</option>
                  {LEVELS.map(lv => (
                    <option key={lv.id} value={lv.id}>{language === 'ar' ? lv.ar : lv.en}</option>
                  ))}
                </select>
                {errors.level && <p className="text-xs text-destructive">{errors.level}</p>}
              </div>
            </div>
          </div>

          {/* Package selection */}
          <div className="p-8">
            <h2 className="font-bold text-lg mb-2">{t('اختر الباقة', 'Choose Package')}</h2>
            <p className="text-sm text-muted-foreground mb-5">
              {t('جميع الباقات تشمل نفس مستوى الجودة — الفرق في عدد الحصص الأسبوعية فقط', 'All packages include the same quality level — the difference is only in the number of weekly sessions')}
            </p>
            {errors.selectedPackage && <p className="text-xs text-destructive mb-3">{errors.selectedPackage}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {PACKAGES.map(pkg => {
                const discountedPrice = Math.round(pkg.price * (1 - discount / 100))
                const isSelected = selectedPackage === pkg.id

                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className="flex flex-col p-5 rounded-2xl text-start transition-all relative"
                    style={{
                      background: isSelected ? 'rgba(244,91,6,0.08)' : 'var(--muted)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >
                    {isSelected && (
                      <div
                        className="absolute top-3 end-3 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--primary)' }}
                      >
                        <Check size={11} color="#FFFFFF" />
                      </div>
                    )}
                    {pkg.badge && (
                      <span className={`text-xs font-bold mb-2 inline-block ${pkg.id === 'vip' ? 'badge-vip' : 'badge-popular'}`}>
                        {language === 'ar' ? pkg.badge.ar : pkg.badge.en}
                      </span>
                    )}
                    <p className="font-bold text-sm mb-1">{language === 'ar' ? pkg.nameAr : pkg.nameEn}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {pkg.sessions} {t('حصة/شهر', 'sessions/month')}
                    </p>
                    {discount > 0 ? (
                      <div>
                        <p className="text-xs text-muted-foreground line-through">{pkg.price} {t('ر', 'SAR')}</p>
                        <p className="font-display font-bold text-lg gold-text">{discountedPrice} <span className="text-xs text-muted-foreground font-body">{t('ر/شهر', 'SAR/mo')}</span></p>
                      </div>
                    ) : (
                      <p className="font-display font-bold text-lg gold-text">{pkg.price} <span className="text-xs text-muted-foreground font-body">{t('ر/شهر', 'SAR/mo')}</span></p>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Family discounts info */}
            <div
              className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: 'rgba(244,91,6,0.05)', border: '1px solid rgba(244,91,6,0.12)' }}
            >
              <p className="font-semibold text-primary mb-2">{t('🎁 خصومات العائلة', '🎁 Family Discounts')}</p>
              <div className="grid grid-cols-2 gap-1 text-muted-foreground text-xs">
                {FAMILY_DISCOUNTS.map(fd => (
                  <div key={fd.order} className="flex items-center gap-2">
                    <span>{fd.icon}</span>
                    <span>{language === 'ar' ? fd.labelAr : fd.labelEn}:</span>
                    <span className={fd.discount > 0 ? 'text-emerald-light font-bold' : ''}>
                      {fd.discount > 0 ? `${fd.discount}% ${t('خصم', 'off')}` : t('سعر كامل', 'Full price')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="btn-outline px-6 py-3 flex items-center gap-2"
              >
                {language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {t('رجوع', 'Back')}
              </button>
              <button
                onClick={handleContinue}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
              >
                {t('التالي: اختيار المواعيد', 'Next: Choose Schedule')}
                <Arrow size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
