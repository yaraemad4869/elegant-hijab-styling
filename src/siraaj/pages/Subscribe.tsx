import { useState } from 'react'
import { useNavigate } from '../router-compat'
import { Check, Tag, CreditCard, Smartphone, Globe, ArrowLeft, ArrowRight, CheckCircle, X } from 'lucide-react'
import { useApp } from '../context'
import { DAYS, TIMES, packageIcon } from '../data'
import { usdAmount } from '../price'
import type { PaymentMethod } from '../types'

export default function Subscribe() {
  const { t, dir, language, currentUser, selectedPackageId, setSelectedPackageId, subscriptionState, validateDiscount, payForSubscription } = useApp()
  const navigate = useNavigate()

  const { siteContent } = useApp()
  const [referralDiscount, setReferralDiscount] = useState(0)
  const pkg = siteContent.packages.find(p => p.id === (selectedPackageId || 'premium')) || siteContent.packages[1] || siteContent.packages[0]

  const [schedule, setSchedule] = useState<string[]>(subscriptionState?.schedule || [])
  const [discountCode, setDiscountCode] = useState(subscriptionState?.discountCode || '')
  const [discountApplied, setDiscountApplied] = useState(subscriptionState?.discountAmount ? subscriptionState.discountAmount > 0 : false)
  const [codeError, setCodeError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [paymentStep, setPaymentStep] = useState<'package' | 'schedule' | 'payment' | 'success'>('package')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [termsError, setTermsError] = useState('')

  // Card form state
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')

  const familyDiscount = subscriptionState?.discountAmount || 0
  const finalPrice = Math.max(0, pkg.price - familyDiscount - (discountApplied ? referralDiscount : 0))

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft

  const toggleSlot = (slot: string) => {
    setSchedule(prev => {
      if (prev.includes(slot)) return prev.filter(s => s !== slot)
      if (prev.length >= pkg.sessionsPerWeek) return prev
      return [...prev, slot]
    })
  }

  const [discountLoading, setDiscountLoading] = useState(false)

  const applyDiscount = async () => {
    setCodeError('')
    if (!discountCode.trim()) return
    setDiscountLoading(true)
    const res = await validateDiscount(discountCode)
    setDiscountLoading(false)
    if (res.valid) {
      setReferralDiscount(res.discountAmount || 0)
      setDiscountApplied(true)
    } else {
      setDiscountApplied(false)
      setReferralDiscount(0)
      setCodeError(res.message || t('الكود غير صحيح أو غير موجود', 'Invalid or non-existent code'))
    }
  }

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const validateCard = () => {
    const errs: Record<string, string> = {}
    if (card.number.replace(/\s/g, '').length !== 16) errs.number = t('رقم البطاقة غير صحيح', 'Invalid card number')
    if (card.expiry.length !== 5) errs.expiry = t('تاريخ انتهاء غير صحيح', 'Invalid expiry date')
    if (card.cvv.length < 3) errs.cvv = t('CVV غير صحيح', 'Invalid CVV')
    if (!card.name.trim()) errs.name = t('اسم حامل البطاقة مطلوب', 'Cardholder name is required')
    return errs
  }

  const handlePay = async () => {
    if (!termsAccepted) {
      setTermsError(t('يجب الموافقة على الشروط والأحكام أولاً', 'You must accept the terms and conditions first'))
      return
    }
    setTermsError('')
    if (paymentMethod === 'card') {
      const errs = validateCard()
      if (Object.keys(errs).length > 0) { setCardErrors(errs); return }
      setCardErrors({})
    }
    setPayLoading(true)
    setPayError('')
    try {
      await payForSubscription({
        packageId: pkg.id,
        amount: finalPrice,
        paymentMethod: paymentMethod || 'card',
        card: paymentMethod === 'card' ? card : undefined,
      })
      setPaymentStep('success')
    } catch (err) {
      setPayError(err instanceof Error ? err.message : t('تعذّر إتمام الدفع', 'Payment could not be completed'))
    } finally {
      setPayLoading(false)
    }
  }

  if (paymentStep === 'success') {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center px-4 islamic-pattern">
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(68,195,198,0.15)', border: '2px solid rgba(68,195,198,0.3)' }}
          >
            <CheckCircle size={48} style={{ color: 'var(--emerald-light)' }} />
          </div>
          <h1 className="font-display text-4xl font-bold mb-3 gold-text">
            {t('تم الاشتراك بنجاح!', 'Subscribed Successfully!')}
          </h1>
          <p className="text-muted-foreground mb-2">
            {t('مبروك! تم تسجيل اشتراكك في باقة', 'Congratulations! Your subscription to the')} <strong className="text-foreground">{language === 'ar' ? pkg.nameAr : pkg.nameEn}</strong> {t('بنجاح', 'package was successful')}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {t('سيتواصل معك معلمك المخصص خلال ٢٤ ساعة لتأكيد المواعيد', 'Your assigned teacher will contact you within 24 hours to confirm the schedule')}
          </p>
          <div
            className="p-4 rounded-xl mb-6 text-sm"
            style={{ background: 'rgba(244,91,6,0.08)', border: '1px solid rgba(244,91,6,0.2)' }}
          >
            <p className="text-muted-foreground">{t('المبلغ المدفوع', 'Amount Paid')}</p>
            {language === 'en' && pkg.priceUsd != null && pkg.price > 0 ? (
              <>
                <p className="font-display text-2xl font-bold gold-text" dir="ltr">$ {Math.round((finalPrice / pkg.price) * pkg.priceUsd * 100) / 100}</p>
                <p className="text-xs text-muted-foreground mt-1" dir="ltr">≈ {finalPrice} {t('ريال/شهر', 'SAR/month')}</p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl font-bold gold-text">{finalPrice} {t('ريال/شهر', 'SAR/month')}</p>
                {pkg.priceUsd != null && pkg.price > 0 && (
                  <p className="text-xs text-muted-foreground mt-1" dir="ltr">≈ $ {Math.round((finalPrice / pkg.price) * pkg.priceUsd * 100) / 100}</p>
                )}
              </>
            )}

          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full py-3.5 text-base">
            {t('الذهاب إلى حسابي', 'Go to My Account')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div dir={dir} className="min-h-screen py-20 px-4 islamic-pattern">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(244,91,6,0.05) 0%, transparent 60%)' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-2">
            {paymentStep === 'package'
              ? t('اختر باقتك', 'Choose Your Package')
              : paymentStep === 'schedule'
                ? t('اختر مواعيدك', 'Choose Your Schedule')
                : t('إتمام الدفع', 'Complete Payment')}
          </h1>
          <p className="text-muted-foreground">
            {paymentStep === 'package'
              ? t('الخطوة الثانية: اختر الباقة المناسبة لك', 'Step two: pick the package that suits you')
              : paymentStep === 'schedule'
                ? t(`اختر ${pkg.sessionsPerWeek} مواعيد أسبوعياً لباقتك`, `Select ${pkg.sessionsPerWeek} weekly slots for your package`)
                : t('أكمل بياناتك وادفع بأمان', 'Complete your details and pay securely')}
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 text-xs">
          {[
            { id: 'package', label: t('الباقة', 'Package') },
            { id: 'schedule', label: t('المواعيد', 'Schedule') },
            { id: 'payment', label: t('الدفع', 'Payment') },
          ].map((step, i) => {
            const order = ['package', 'schedule', 'payment']
            const active = order.indexOf(paymentStep) >= i
            return (
              <div key={step.id} className="flex items-center gap-2">
                <span
                  className="px-3 py-1.5 rounded-full font-semibold"
                  style={{
                    background: active ? 'var(--primary)' : 'var(--muted)',
                    color: active ? '#FFFFFF' : 'var(--muted-foreground)',
                  }}
                >
                  {i + 1}. {step.label}
                </span>
                {i < 2 && <span className="w-5 h-px" style={{ background: 'var(--border)' }} />}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {paymentStep === 'package' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {siteContent.packages.filter(p => p.active !== false).map(item => {
                  const isSelected = item.id === pkg.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPackageId(item.id)}
                      className="text-start rounded-2xl p-5 transition-all"
                      style={{
                        background: 'var(--card)',
                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: `${item.color}22` }}
                        >
                          {packageIcon(item)}
                        </div>
                        <div>
                          <p className="font-bold">{language === 'ar' ? item.nameAr : item.nameEn}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.sessions} {t('حصة/شهر', 'sessions/month')} — {item.sessionsPerWeek} {t('أسبوعياً', 'weekly')}
                          </p>
                        </div>
                      </div>
                      <p className="font-display text-2xl font-bold gold-text mb-3" dir={language === 'en' && item.priceUsd != null ? 'ltr' : undefined}>
                        {language === 'en' && item.priceUsd != null ? (
                          <>
                            $ {item.priceUsd}
                            <span className="text-sm font-semibold text-muted-foreground"> ≈ {item.price} {t('ريال', 'SAR')}</span>
                          </>
                        ) : (
                          <>{item.price} {t('ريال', 'SAR')}</>
                        )}
                      </p>

                      <ul className="flex flex-col gap-1.5">
                        {(language === 'ar' ? item.featuresAr : item.featuresEn).slice(0, 4).map(f => (
                          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {isSelected && (
                        <p className="mt-3 text-xs font-semibold text-primary">✓ {t('الباقة المختارة', 'Selected package')}</p>
                      )}
                    </button>
                  )
                })}
                <div className="sm:col-span-2">
                  <button
                    onClick={() => setPaymentStep('schedule')}
                    disabled={!pkg}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {t('التالي: اختيار المواعيد', 'Next: Choose Schedule')}
                    <Arrow size={16} />
                  </button>
                </div>
              </div>
            ) : paymentStep === 'schedule' ? (
              <div
                className="rounded-2xl card-glow"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {/* Schedule grid */}
                <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setPaymentStep('package')}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
                  >
                    <BackArrow size={14} /> {t('رجوع للباقات', 'Back to Packages')}
                  </button>
                  <h2 className="font-bold text-lg mb-1">{t('الجدول الأسبوعي', 'Weekly Schedule')}</h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    {t(`اختر ${pkg.sessionsPerWeek} حصص أسبوعياً — المختار: ${schedule.length}/${pkg.sessionsPerWeek}`, `Select ${pkg.sessionsPerWeek} sessions/week — Selected: ${schedule.length}/${pkg.sessionsPerWeek}`)}
                  </p>

                  <div className="overflow-x-auto -mx-1">
                    <table className="w-full min-w-[500px] text-xs">
                      <thead>
                        <tr>
                          <th className="text-muted-foreground font-medium py-2 px-2 text-start w-16">
                            {t('الوقت', 'Time')}
                          </th>
                          {DAYS.map(day => (
                            <th key={day.id} className="text-muted-foreground font-medium py-2 px-1 text-center">
                              {language === 'ar' ? day.ar : day.en}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TIMES.map(time => (
                          <tr key={time} className="border-t" style={{ borderColor: 'rgba(244,91,6,0.06)' }}>
                            <td className="py-1.5 px-2 text-muted-foreground font-en text-xs">{time}</td>
                            {DAYS.map(day => {
                              const slot = `${day.id}-${time}`
                              const isSelected = schedule.includes(slot)
                              const isDisabled = !isSelected && schedule.length >= pkg.sessionsPerWeek
                              return (
                                <td key={day.id} className="py-1 px-1 text-center">
                                  <button
                                    onClick={() => !isDisabled && toggleSlot(slot)}
                                    disabled={isDisabled}
                                    className="w-8 h-7 rounded-lg transition-all text-xs font-semibold"
                                    style={{
                                      background: isSelected
                                        ? 'var(--primary)'
                                        : isDisabled
                                          ? 'rgba(244,91,6,0.04)'
                                          : 'rgba(244,91,6,0.06)',
                                      color: isSelected ? '#FFFFFF' : isDisabled ? 'rgba(107,122,144,0.3)' : 'var(--muted-foreground)',
                                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    }}
                                  >
                                    {isSelected ? <Check size={11} className="mx-auto" /> : ''}
                                  </button>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Discount code */}
                <div className="p-6">
                  <h2 className="font-bold text-base mb-3">{t('كود الخصم', 'Discount Code')}</h2>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountApplied(false); setCodeError('') }}
                        placeholder={t('أدخل كود صديقك هنا', "Enter your friend's code here")}
                        className="w-full px-4 py-3 ps-10"
                        disabled={discountApplied}
                        dir="ltr"
                      />
                      <Tag size={14} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '12px' }} />
                      {discountApplied && (
                        <button
                          onClick={() => { setDiscountApplied(false); setDiscountCode('') }}
                          className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                          style={{ [language === 'ar' ? 'left' : 'right']: '12px' }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={applyDiscount}
                      disabled={discountApplied || !discountCode || discountLoading}
                      className="btn-outline px-5 py-3 disabled:opacity-40"
                    >
                      {discountApplied ? t('✓ مطبّق', '✓ Applied') : t('تطبيق', 'Apply')}
                    </button>
                  </div>
                  {codeError && <p className="text-xs text-destructive mt-1">{codeError}</p>}
                  {discountApplied && (
                    <p className="text-xs font-semibold mt-2" style={{ color: 'var(--emerald-light)' }}>
                      ✓ {t(`تم تطبيق خصم ${referralDiscount} ريال`, `${referralDiscount} SAR discount applied`)}
                    </p>
                  )}

                  {currentUser?.referralCode && (
                    <div
                      className="mt-4 p-3 rounded-xl text-xs"
                      style={{ background: 'rgba(244,91,6,0.05)', border: '1px solid rgba(244,91,6,0.1)' }}
                    >
                      <p className="text-muted-foreground">{t('كودك الخاص لدعوة الأصدقاء:', 'Your personal referral code:')}</p>
                      <p className="font-bold text-primary font-en mt-1">{currentUser.referralCode}</p>
                    </div>
                  )}

                  <button
                    onClick={() => schedule.length === pkg.sessionsPerWeek && setPaymentStep('payment')}
                    disabled={schedule.length !== pkg.sessionsPerWeek}
                    className="btn-primary w-full py-3.5 mt-6 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {t('التالي: الدفع', 'Next: Payment')}
                    <Arrow size={16} />
                  </button>
                  {schedule.length !== pkg.sessionsPerWeek && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      {t(`يرجى اختيار ${pkg.sessionsPerWeek - schedule.length} مواعيد أخرى`, `Please select ${pkg.sessionsPerWeek - schedule.length} more slot(s)`)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl card-glow"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {/* Payment method selection */}
                <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setPaymentStep('schedule')}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-5"
                  >
                    <BackArrow size={14} /> {t('رجوع للمواعيد', 'Back to Schedule')}
                  </button>
                  <h2 className="font-bold text-lg mb-4">{t('طريقة الدفع', 'Payment Method')}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'card' as const, icon: <CreditCard size={20} />, ar: 'بطاقة ائتمان / فيزا', en: 'Credit Card / Visa', subAr: 'Visa, Mastercard, Stripe', subEn: 'Visa, Mastercard, Stripe' },
                      { id: 'instapay' as const, icon: <Smartphone size={20} />, ar: 'إنستاباي', en: 'InstaPay', subAr: 'تحويل فوري', subEn: 'Instant transfer' },
                      { id: 'paymob' as const, icon: <Globe size={20} />, ar: 'Paymob', en: 'Paymob', subAr: 'بوابة دفع آمنة', subEn: 'Secure payment gateway' },
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center"
                        style={{
                          background: paymentMethod === method.id ? 'rgba(244,91,6,0.1)' : 'var(--muted)',
                          border: `2px solid ${paymentMethod === method.id ? 'var(--primary)' : 'var(--border)'}`,
                        }}
                      >
                        <div style={{ color: paymentMethod === method.id ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                          {method.icon}
                        </div>
                        <p className="font-semibold text-sm">{language === 'ar' ? method.ar : method.en}</p>
                        <p className="text-xs text-muted-foreground">{language === 'ar' ? method.subAr : method.subEn}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment form */}
                {paymentMethod && (
                  <div className="p-6">
                    {paymentMethod === 'card' && (
                      <div className="flex flex-col gap-4">
                        <h3 className="font-bold">{t('بيانات البطاقة', 'Card Details')}</h3>
                        {/* Card number */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold">{t('رقم البطاقة', 'Card Number')}</label>
                          <input
                            type="text"
                            value={card.number}
                            onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 font-en tracking-widest"
                            dir="ltr"
                            maxLength={19}
                          />
                          {cardErrors.number && <p className="text-xs text-destructive">{cardErrors.number}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold">{t('تاريخ الانتهاء', 'Expiry Date')}</label>
                            <input
                              type="text"
                              value={card.expiry}
                              onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 font-en"
                              dir="ltr"
                              maxLength={5}
                            />
                            {cardErrors.expiry && <p className="text-xs text-destructive">{cardErrors.expiry}</p>}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold">CVV</label>
                            <input
                              type="text"
                              value={card.cvv}
                              onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                              placeholder="123"
                              className="w-full px-4 py-3 font-en"
                              dir="ltr"
                              maxLength={4}
                            />
                            {cardErrors.cvv && <p className="text-xs text-destructive">{cardErrors.cvv}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold">{t('اسم حامل البطاقة', 'Cardholder Name')}</label>
                          <input
                            type="text"
                            value={card.name}
                            onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                            placeholder="Mohamed Ahmed"
                            className="w-full px-4 py-3"
                            dir="ltr"
                          />
                          {cardErrors.name && <p className="text-xs text-destructive">{cardErrors.name}</p>}
                        </div>
                        <div
                          className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl"
                          style={{ background: 'rgba(244,91,6,0.05)', border: '1px solid rgba(244,91,6,0.1)' }}
                        >
                          🔒 {t('بياناتك محمية بتشفير SSL — مدعوم بـ Stripe', 'Your data is protected with SSL encryption — powered by Stripe')}
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'instapay' && (
                      <div className="flex flex-col gap-4 items-center text-center">
                        <h3 className="font-bold">{t('تعليمات إنستاباي', 'InstaPay Instructions')}</h3>
                        <div
                          className="w-40 h-40 rounded-2xl flex items-center justify-center text-5xl"
                          style={{ background: 'rgba(244,91,6,0.08)', border: '2px dashed rgba(244,91,6,0.3)' }}
                        >
                          📱
                        </div>
                        <div
                          className="p-4 rounded-xl text-sm w-full text-start"
                          style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                        >
                          <p className="font-bold mb-2">{t('تحويل إلى:', 'Transfer to:')}</p>
                          <p className="text-muted-foreground">{t('رقم الهاتف / InstaPay:', 'Phone / InstaPay:')}</p>
                          <p className="font-bold font-en text-primary text-lg" dir="ltr">{siteContent.hero.instapayNumber}</p>
                          <p className="text-muted-foreground mt-2">{t('اسم المستفيد:', 'Beneficiary Name:')}</p>
                          <p className="font-bold">{siteContent.hero.instapayName}</p>
                          <p className="text-muted-foreground mt-2">{t('المبلغ:', 'Amount:')}</p>
                          <p className="font-display font-bold text-2xl gold-text">{finalPrice} {t('ريال', 'SAR')}</p>
                          {language === 'en' && pkg.priceUsd != null && pkg.price > 0 && (
                            <p className="text-xs text-muted-foreground mt-1" dir="ltr">≈ $ {Math.round((finalPrice / pkg.price) * pkg.priceUsd * 100) / 100}</p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t('بعد التحويل، أرسل إيصال التحويل على واتساب: +20 100 000 0000', 'After transfer, send receipt via WhatsApp: +20 100 000 0000')}
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'paymob' && (
                      <div className="flex flex-col gap-4 items-center text-center">
                        <h3 className="font-bold">{t('الدفع عبر Paymob', 'Pay via Paymob')}</h3>
                        <div className="text-6xl">🔐</div>
                        <p className="text-muted-foreground text-sm max-w-xs">
                          {t('ستُحوَّل إلى بوابة Paymob الآمنة لإتمام عملية الدفع بأمان تام', 'You will be redirected to the secure Paymob gateway to complete your payment safely')}
                        </p>
                        <div
                          className="p-4 rounded-xl text-sm w-full"
                          style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                        >
                          <p className="text-muted-foreground">{t('المبلغ الإجمالي:', 'Total Amount:')}</p>
                          <p className="font-display font-bold text-2xl gold-text">{finalPrice} {t('ريال', 'SAR')}</p>
                          {language === 'en' && pkg.priceUsd != null && pkg.price > 0 && (
                            <p className="text-xs text-muted-foreground mt-1" dir="ltr">≈ $ {Math.round((finalPrice / pkg.price) * pkg.priceUsd * 100) / 100}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {payError && (
                      <div
                        className="px-4 py-3 rounded-xl text-sm text-destructive mt-4"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        {payError}
                      </div>
                    )}

                    <div
                      className="mt-6 p-4 rounded-xl"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={e => { setTermsAccepted(e.target.checked); setTermsError('') }}
                          className="mt-1 w-4 h-4 flex-shrink-0"
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span className="text-sm">
                          {t('أوافق على الشروط والأحكام وسياسة الاسترداد الخاصة بمنصة سراج.', 'I agree to Siraj terms, conditions and refund policy.')}{' '}
                          <button
                            type="button"
                            onClick={e => { e.preventDefault(); setTermsOpen(true) }}
                            className="text-primary font-semibold underline"
                          >
                            {t('اقرأ المزيد', 'Read more')}
                          </button>
                        </span>
                      </label>
                      {termsError && <p className="text-xs text-destructive mt-2">{termsError}</p>}
                    </div>

                    {termsOpen && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(19,36,57,0.6)' }}
                        onClick={() => setTermsOpen(false)}
                      >
                        <div
                          dir={dir}
                          onClick={e => e.stopPropagation()}
                          className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl p-6"
                          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-xl font-bold">{t('الشروط والأحكام', 'Terms & Conditions')}</h3>
                            <button onClick={() => setTermsOpen(false)} className="text-muted-foreground hover:text-foreground">
                              <X size={18} />
                            </button>
                          </div>
                          <div className="flex flex-col gap-3 text-sm text-muted-foreground leading-relaxed">
                            <p>{t('1. الاشتراك شهري ويبدأ من تاريخ الدفع، ويشمل عدد الحصص المحدد في الباقة المختارة.', '1. The subscription is monthly, starts from the payment date, and includes the number of sessions in the selected package.')}</p>
                            <p>{t('2. يلتزم الطالب بحضور الحصص في المواعيد المختارة، ويمكن تأجيل الحصة بإخطار المعلم قبل 6 ساعات على الأقل.', '2. The student commits to the chosen schedule; a session may be rescheduled with at least 6 hours notice.')}</p>
                            <p>{t('3. الحصص التي تُلغى دون إخطار مسبق تُحتسب ضمن حصص الشهر ولا تُعوَّض.', '3. Sessions cancelled without prior notice count against the monthly quota and are not compensated.')}</p>
                            <p>{t('4. يحق لك طلب استرداد المبلغ خلال 7 أيام من بداية الاشتراك إذا لم تتجاوز الحصص المستهلكة حصتين.', '4. You may request a refund within 7 days of the subscription start if no more than two sessions have been used.')}</p>
                            <p>{t('5. تحتفظ المنصة بحق تغيير المعلم عند الضرورة مع إخطار الطالب مسبقاً وضمان نفس المستوى.', '5. The platform may change the teacher when necessary, with prior notice and equal quality.')}</p>
                            <p>{t('6. بيانات الدفع تُعالَج عبر بوابات دفع آمنة، ولا تُخزَّن بيانات البطاقة على خوادم المنصة.', '6. Payment data is processed through secure gateways; card details are not stored on our servers.')}</p>
                            <p>{t('7. أي إساءة في استخدام المنصة أو مخالفة لآداب الحلقات قد تؤدي لإيقاف الحساب دون استرداد.', '7. Misuse of the platform or violating class etiquette may lead to account suspension without refund.')}</p>
                          </div>
                          <button
                            onClick={() => { setTermsAccepted(true); setTermsError(''); setTermsOpen(false) }}
                            className="btn-primary w-full py-3 mt-5"
                          >
                            {t('قرأت وأوافق', 'I have read and agree')}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handlePay}
                      disabled={payLoading || !termsAccepted}
                      className="btn-primary w-full py-3.5 mt-4 text-base flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      {payLoading ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                          {t('جارٍ المعالجة...', 'Processing...')}
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'instapay' ? t('تأكيد الإرسال', 'Confirm Submission') :
                            paymentMethod === 'paymob' ? t('الذهاب لـ Paymob', 'Go to Paymob') :
                              t('ادفع الآن', 'Pay Now')}
                          — {finalPrice} {t('ريال', 'SAR')}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl card-glow p-6 sticky top-24"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h2 className="font-bold mb-5">{t('ملخص الطلب', 'Order Summary')}</h2>

              {/* Package */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl mb-4"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${pkg.color}22` }}
                >
                  {packageIcon(pkg)}
                </div>
                <div>
                  <p className="font-bold text-sm">{t('باقة', 'Package')} {language === 'ar' ? pkg.nameAr : pkg.nameEn}</p>
                  <p className="text-xs text-muted-foreground">{pkg.sessions} {t('حصة/شهر', 'sessions/month')}</p>
                </div>
              </div>

              {/* Selected slots */}
              {schedule.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{t('المواعيد المختارة:', 'Selected slots:')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {schedule.map(slot => {
                      const [dayId, time] = slot.split('-')
                      const day = DAYS.find(d => d.id === dayId)
                      return (
                        <span
                          key={slot}
                          className="text-xs px-2 py-1 rounded-lg font-en"
                          style={{ background: 'rgba(244,91,6,0.1)', border: '1px solid rgba(244,91,6,0.2)', color: 'var(--primary)' }}
                        >
                          {language === 'ar' ? day?.ar : day?.en} {time}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 text-sm border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('سعر الباقة', 'Package price')}</span>
                  <span dir={language === 'en' && pkg.priceUsd != null ? 'ltr' : undefined}>
                    {language === 'en' && pkg.priceUsd != null ? `$ ${usdAmount(pkg.price, pkg) ?? pkg.priceUsd}` : `${pkg.price} ${t('ر', 'SAR')}`}
                  </span>
                </div>
                {familyDiscount > 0 && (
                  <div className="flex justify-between text-emerald-light">
                    <span>{t('خصم العائلة', 'Family discount')}</span>
                    <span>- {familyDiscount} {t('ر', 'SAR')}</span>
                  </div>
                )}
                {discountApplied && (
                  <div className="flex justify-between text-emerald-light">
                    <span>{t('خصم دعوة صديق', 'Referral discount')}</span>
                    <span>- {referralDiscount} {t('ر', 'SAR')}</span>
                  </div>
                )}
                <div
                  className="flex justify-between font-bold text-base pt-2 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span>{t('الإجمالي', 'Total')}</span>
                  <span className="gold-text font-display text-xl" dir={language === 'en' && pkg.priceUsd != null ? 'ltr' : undefined}>
                    {language === 'en' && pkg.priceUsd != null ? `$ ${Math.round((finalPrice / pkg.price) * pkg.priceUsd * 100) / 100}` : `${finalPrice} ${t('ر', 'SAR')}`}
                  </span>
                </div>
                {pkg.priceUsd != null && pkg.price > 0 && (
                  <div className="flex justify-between text-sm">
                    {language === 'en' ? (
                      <>
                        <span className="text-muted-foreground">{t('الإجمالي بالريال', 'Total in SAR')}</span>
                        <span dir="ltr" className="font-semibold">{finalPrice} SAR</span>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">{t('الإجمالي بالدولار', 'Total in USD')}</span>
                        <span dir="ltr" className="font-semibold">$ {Math.round((finalPrice / pkg.price) * pkg.priceUsd * 100) / 100}</span>
                      </>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">{t('شهرياً', 'per month')}</p>

              </div>

              {/* Trust badges */}
              <div
                className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-muted-foreground p-3 rounded-xl"
                style={{ background: 'rgba(244,91,6,0.04)' }}
              >
                <span>🔒 {t('دفع آمن', 'Secure')}</span>
                <span>✅ {t('ضمان الجودة', 'Quality')}</span>
                <span>↩️ {t('استرداد مضمون', 'Refund')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
