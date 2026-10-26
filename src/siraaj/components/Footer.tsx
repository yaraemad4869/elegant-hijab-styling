import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Link } from '../router-compat'
import { useApp } from '../context'
import sirajLogo from '../../assets/siraj-logo-icon-only.jpeg'

function TikTokIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
    )
}

function WhatsAppIcon() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.297.347-.495.116-.198.058-.371-.058-.52-.116-.116-.652-1.568-.893-2.14-.232-.57-.467-.494-.643-.503-.166-.008-.357-.01-.547-.01-.19 0-.497.073-.757.372-.26.297-.99.966-.99 2.354 0 1.388 1.013 2.73 1.155 2.927.14.198 1.988 3.034 4.816 4.255.673.29 1.198.465 1.607.595.676.213 1.29.183 1.776.111.542-.081 1.666-.682 1.9-1.34.235-.659.235-1.223.165-1.34-.07-.116-.26-.185-.557-.334z" />
            <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.411zM12.05 21.785h-.005a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98 1.005-3.648-.234-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.893 9.885z" />
        </svg>
    )
}

function XIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

export default function Footer() {
    const { t, dir } = useApp()
    const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight

    const socials: { label: string; bg: string; icon: ReactNode }[] = [
        { label: 'TikTok', bg: '#000000', icon: <TikTokIcon /> },
        { label: 'Instagram', bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', icon: <Instagram size={18} /> },
        { label: 'Facebook', bg: '#1877F2', icon: <Facebook size={18} /> },
        { label: 'WhatsApp', bg: '#25D366', icon: <WhatsAppIcon /> },
        { label: 'LinkedIn', bg: '#0A66C2', icon: <Linkedin size={18} /> },
        { label: 'YouTube', bg: '#FF0000', icon: <Youtube size={18} /> },
        { label: 'X', bg: '#000000', icon: <XIcon /> },
    ]

    return (
        <footer dir={dir} id="contact" className="site-footer">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
                <div className="grid gap-12 md:grid-cols-3">
                    {/* تابعنا */}
                    <div>
                        <h4 className="footer-heading">{t('تابعنا', 'Follow Us')}</h4>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {socials.map(s => (
                                <a key={s.label} href="#" aria-label={s.label} className="footer-social" style={{ background: s.bg }}>
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* الدعم */}
                    <div>
                        <h4 className="footer-heading">{t('الدعم', 'Support')}</h4>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <a href="mailto:info@sirajacademy.com" className="footer-link">
                                    <span>{t('تواصل معنا', 'Contact Us')}</span>
                                    <Chevron size={14} />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer-link">
                                    <span>{t('سياسة الخصوصية', 'Privacy Policy')}</span>
                                    <Chevron size={14} />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer-link">
                                    <span>{t('الشروط والأحكام', 'Terms & Conditions')}</span>
                                    <Chevron size={14} />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* روابط سريعة */}
                    <div>
                        <h4 className="footer-heading">{t('روابط سريعة', 'Quick Links')}</h4>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <a href="/#packages" className="footer-link">
                                    <span>{t('الباقات', 'Packages')}</span>
                                    <Chevron size={14} />
                                </a>
                            </li>
                            <li>
                                <a href="/#family" className="footer-link">
                                    <span>{t('عروض العائلة', 'Family Offers')}</span>
                                    <Chevron size={14} />
                                </a>
                            </li>
                            <li>
                                <Link to="/register" className="footer-link">
                                    <span>{t('سجّل الآن', 'Register Now')}</span>
                                    <Chevron size={14} />
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="footer-link">
                                    <span>{t('الأسئلة الشائعة', 'FAQ')}</span>
                                    <Chevron size={14} />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* الهوية */}
                <div className="mt-14 flex flex-col items-center text-center">
                    <img
                        src={sirajLogo}
                        alt="شعار أكاديمية سراج"
                        className="w-20 h-20 rounded-2xl object-contain p-1.5"
                        style={{ background: '#FFFFFF' }}
                    />
                    <p className="footer-tagline mt-4 text-2xl">
                        {t('معنا نورٌ يضيء دروب المتعلمين', "With us, a light illuminates every learner's path")}
                    </p>
                    <p className="footer-muted mt-3 max-w-lg text-sm leading-7">
                        {t('أكاديمية متخصصة في تعليم القرآن الكريم وعلومه أونلاين — معلمون متخصصون، جداول مرنة، ومتابعة مستمرة.', 'A specialized online Quran academy — expert teachers, flexible schedules, and continuous support.')}
                    </p>
                </div>

                <div className="footer-divider footer-muted mt-10 pt-6 text-center text-xs">
                    <p>{t('© ٢٠٢٥ أكاديمية سراج. جميع الحقوق محفوظة.', '© 2025 Siraj Academy. All rights reserved.')}</p>
                </div>
            </div>
        </footer>
    )
}
