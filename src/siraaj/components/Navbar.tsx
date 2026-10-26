import { useState } from 'react'
import { Link, useNavigate } from '../router-compat'
import { Menu, X, Globe, LogOut, LayoutDashboard } from 'lucide-react'
import { useApp } from '../context'
import sirajLogo from '../../assets/siraj-logo-icon-only.jpeg'

export default function Navbar() {
  const { currentUser, language, setLanguage, logout, t, dir } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const getDashboardPath = () => {
    if (!currentUser) return '/login'
    if (currentUser.role === 'admin') return '/admin'
    if (currentUser.role === 'teacher') return '/teacher'
    return '/dashboard'
  }

  const navLinks = [
    { label: t('الباقات', 'Packages'), href: '/#packages' },
    { label: t('عروض العائلة', 'Family Offers'), href: '/#family' },
    { label: t('دعوة صديق', 'Referral'), href: '/#referral' },
    { label: t('تواصل معنا', 'Contact'), href: '/#contact' },
  ]

  const pageLinks = [
    { label: t('الأسئلة الشائعة', 'FAQ'), to: '/faq' },
    ...(currentUser?.role === 'admin'
      ? [{ label: t('آراء طلابنا', 'Reviews'), to: '/reviews' }]
      : []),
  ]

  return (
    <nav
      dir={dir}
      className="site-navbar fixed inset-x-0 top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - made much bigger */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <img
              src={sirajLogo}
              alt="شعار أكاديمية سراج"
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav - with bigger font */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <Globe size={16} />
              <span className="font-en font-medium">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 text-base px-4 py-2 btn-outline"
                >
                  <LayoutDashboard size={18} />
                  {t('حسابي', 'My Account')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-base px-4 py-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut size={18} />
                  {t('خروج', 'Logout')}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="btn-outline px-5 py-2 text-sm">
                  {t('تسجيل الدخول', 'Login')}
                </Link>
                <Link to="/register" className="btn-accent px-5 py-2 text-sm">
                  {t('اشترك الآن', 'Subscribe')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden py-4 flex flex-col gap-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base text-muted-foreground hover:text-foreground px-2 py-1"
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-base text-muted-foreground hover:text-foreground px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              {currentUser ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMenuOpen(false)}
                    className="text-base px-4 py-2 btn-outline text-center"
                  >
                    {t('حسابي', 'My Account')}
                  </Link>
                  <button onClick={handleLogout} className="text-base px-4 py-2 text-destructive text-center">
                    {t('تسجيل الخروج', 'Logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-base px-4 py-2 btn-outline text-center">
                    {t('تسجيل الدخول', 'Login')}
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="text-base px-4 py-2 btn-primary text-center">
                    {t('اشترك الآن', 'Subscribe')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}