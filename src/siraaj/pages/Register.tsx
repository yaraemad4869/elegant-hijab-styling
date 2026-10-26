import { useState } from 'react'
import { Link, useNavigate } from '../router-compat'
import { User, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, GraduationCap, Users } from 'lucide-react'
import { useApp } from '../context'
import type { UserRole } from '../types'
import sirajLogo from '../../assets/siraj-logo-icon-only.jpeg'

export default function Register() {
  const { registerUser, t, dir, language, selectedPackageId } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<'student' | 'guardian' | null>(null)

  const [form, setForm] = useState({
    nameAr: '',
    nameEn: '',
    phone: '',
    password: '',
    confirmPassword: '',
    guardianPhone: '',
    age: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.nameAr.trim()) errs.nameAr = t('الاسم مطلوب', 'Name is required')
    if (!form.phone.trim()) errs.phone = t('رقم الجوال مطلوب', 'Phone number is required')
    if (form.phone.length < 10) errs.phone = t('رقم الجوال غير صحيح', 'Invalid phone number')
    if (!form.password) errs.password = t('كلمة المرور مطلوبة', 'Password is required')
    if (form.password.length < 6) errs.password = t('كلمة المرور يجب أن تكون ٦ أحرف على الأقل', 'Password must be at least 6 characters')
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('كلمتا المرور غير متطابقتين', 'Passwords do not match')
    if (role === 'student' && !form.guardianPhone.trim()) errs.guardianPhone = t('رقم ولي الأمر مطلوب', "Guardian's phone is required")
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    const { user, error: registerError } = await registerUser({
      nameAr: form.nameAr,
      nameEn: form.nameEn || form.nameAr,
      phone: form.phone,
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: role as UserRole,
      guardianPhone: role === 'student' ? form.guardianPhone : undefined,
    })

    setLoading(false)

    if (!user) {
      setErrors({ submit: registerError || t('تعذّر إنشاء الحساب', 'Could not create the account') })
      return
    }

    if (role === 'guardian') {
      navigate('/register/child')
    } else if (selectedPackageId) {
      navigate('/subscribe')
    } else {
      navigate('/subscribe')
    }
  }

  const inputCls = (field: string) =>
    `w-full px-4 py-3 ${errors[field] ? 'border-destructive!' : ''}`

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center px-4 py-20 islamic-pattern">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(244,91,6,0.06) 0%, transparent 60%)' }}
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <img
              src={sirajLogo}
              alt="شعار أكاديمية سراج"
              className="w-24 h-24 rounded-2xl object-contain mb-2 drop-shadow-md"
            />
          </Link>
          <h1 className="text-2xl font-bold mt-4">{t('إنشاء حساب جديد', 'Create New Account')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('انضم لأكاديمية سراج وابدأ رحلتك مع القرآن', 'Join Siraj Academy and start your Quran journey')}
          </p>
        </div>

        <div
          className="rounded-2xl p-8 card-glow"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {/* Step 1: Role selection */}
          {step === 1 ? (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-muted-foreground mb-6">
                  {t('من أنت؟ اختر نوع الحساب', 'Who are you? Choose your account type')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: 'student' as const,
                    icon: <GraduationCap size={32} />,
                    titleAr: 'طالب',
                    titleEn: 'Student',
                    descAr: 'أريد أن أتعلم القرآن',
                    descEn: 'I want to learn the Quran',
                  },
                  {
                    id: 'guardian' as const,
                    icon: <Users size={32} />,
                    titleAr: 'ولي أمر',
                    titleEn: 'Guardian',
                    descAr: 'أسجّل لطفلي أو أطفالي',
                    descEn: "I'm registering for my child(ren)",
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all text-center"
                    style={{
                      background: role === opt.id ? 'rgba(244,91,6,0.1)' : 'var(--muted)',
                      border: `2px solid ${role === opt.id ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >
                    <div style={{ color: role === opt.id ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                      {opt.icon}
                    </div>
                    <div>
                      <p className="font-bold text-base">{language === 'ar' ? opt.titleAr : opt.titleEn}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'ar' ? opt.descAr : opt.descEn}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {t('التالي', 'Next')}
                <Arrow size={16} />
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
                <Link to="/login" className="text-primary hover:text-accent font-semibold">
                  {t('تسجيل الدخول', 'Login')}
                </Link>
              </p>
            </div>
          ) : (
            /* Step 2: Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
                >
                  {language === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                  {t('رجوع', 'Back')}
                </button>
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(244,91,6,0.1)', color: 'var(--primary)' }}
                >
                  {role === 'student' ? t('طالب', 'Student') : t('ولي أمر', 'Guardian')}
                </div>
              </div>

              {/* Full Name Arabic */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">{t('الاسم الكامل (عربي)', 'Full Name (Arabic)')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.nameAr}
                    onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                    placeholder={t('محمد أحمد', 'Mohamed Ahmed')}
                    className={inputCls('nameAr') + ' ps-11'}
                    required
                  />
                  <User size={15} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '14px' }} />
                </div>
                {errors.nameAr && <p className="text-xs text-destructive">{errors.nameAr}</p>}
              </div>

              {/* Full Name English (optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                  {t('الاسم (إنجليزي) — اختياري', 'Full Name (English) — Optional')}
                </label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                  placeholder="Mohamed Ahmed"
                  className="w-full px-4 py-3"
                  dir="ltr"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">{t('رقم الجوال', 'Phone Number')}</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder={t('01012345678', '01012345678')}
                    className={inputCls('phone') + ' ps-11'}
                    dir="ltr"
                    required
                  />
                  <Phone size={15} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '14px' }} />
                </div>
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              {/* Guardian phone (student only) */}
              {role === 'student' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">{t('رقم جوال ولي الأمر', "Guardian's Phone Number")}</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={form.guardianPhone}
                      onChange={e => setForm(f => ({ ...f, guardianPhone: e.target.value }))}
                      placeholder="01098765432"
                      className={inputCls('guardianPhone') + ' ps-11'}
                      dir="ltr"
                    />
                    <Phone size={15} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '14px' }} />
                  </div>
                  {errors.guardianPhone && <p className="text-xs text-destructive">{errors.guardianPhone}</p>}
                </div>
              )}

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">{t('كلمة المرور', 'Password')}</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={t('٦ أحرف على الأقل', 'At least 6 characters')}
                    className={inputCls('password') + ' ps-11 pe-11'}
                    required
                  />
                  <Lock size={15} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '14px' }} />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    style={{ [language === 'ar' ? 'left' : 'right']: '14px' }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">{t('تأكيد كلمة المرور', 'Confirm Password')}</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder={t('أعد كتابة كلمة المرور', 'Re-enter your password')}
                  className={inputCls('confirmPassword') + ' px-4 py-3'}
                  required
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>

              {errors.submit && (
                <div
                  className="px-4 py-3 rounded-xl text-sm text-destructive"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {errors.submit}
                </div>
              )}


              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <>
                    {role === 'guardian' ? t('التالي: بيانات الطفل', 'Next: Child Details') : t('إنشاء الحساب', 'Create Account')}
                    <Arrow size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">
            {t('← العودة للرئيسية', '← Back to Home')}
          </Link>
        </p>
      </div>
    </div>
  )
}
