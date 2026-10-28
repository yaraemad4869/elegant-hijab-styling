import { useState } from 'react'
import { Link, useNavigate } from '../router-compat'
import { Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
import { useApp } from '../context'
import sirajLogo from '../../assets/siraj-logo-transparent.png'

export default function Login() {
  const { login, t, dir, language, selectedPackageId } = useApp()
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { user, error: loginError } = await login(phone, password)
    setLoading(false)

    if (!user) {
      setError(loginError || t('رقم الجوال أو كلمة المرور غير صحيحة', 'Incorrect phone number or password'))
      return
    }

    if (selectedPackageId) {
      navigate('/subscribe')
    } else if (user.role === 'admin') {
      navigate('/admin')
    } else if (user.role === 'teacher') {
      navigate('/teacher')
    } else {
      navigate('/dashboard')
    }
  }

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center px-4 islamic-pattern">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(244,91,6,0.06) 0%, transparent 60%)' }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <img
              src={sirajLogo}
              alt="شعار أكاديمية سراج"
              className="w-24 h-24 rounded-2xl object-contain mb-2 drop-shadow-md"
            />
          </Link>
          <h1 className="text-xl font-bold mt-6">{t('مرحباً بعودتك', 'Welcome Back')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('سجّل دخولك للمتابعة', 'Sign in to continue')}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 card-glow"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">{t('رقم الجوال', 'Phone Number')}</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t('أدخل رقم جوالك', 'Enter your phone number')}
                  className="w-full px-4 py-3 ps-11"
                  required
                  dir="ltr"
                />
                <Phone size={16} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '14px' }} />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">{t('كلمة المرور', 'Password')}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('أدخل كلمة المرور', 'Enter your password')}
                  className="w-full px-4 py-3 ps-11 pe-11"
                  required
                />
                <Lock size={16} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '14px' }} />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  style={{ [language === 'ar' ? 'left' : 'right']: '14px' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm text-destructive"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>
                  {t('تسجيل الدخول', 'Sign In')}
                  <Arrow size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 section-divider" />
            <span className="text-xs text-muted-foreground">{t('أو', 'or')}</span>
            <div className="flex-1 section-divider" />
          </div>

          {/* Register */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('ليس لديك حساب؟', "Don't have an account?")}{' '}
              <Link to="/register" className="text-primary hover:text-accent font-semibold transition-colors">
                {t('سجّل الآن', 'Register Now')}
              </Link>
            </p>
          </div>
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
