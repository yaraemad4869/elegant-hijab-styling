import { Link } from '../router-compat'
import { useApp } from '../context'
import sirajLogo from '../../assets/siraj-logo-icon-only.jpeg'

export default function Footer() {
    const { t, dir } = useApp()

    return (
        <footer
            dir={dir}
            id="contact"
            className="islamic-pattern"
            style={{ borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.98)' }}
        >
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center mb-4">
                            <img
                                src={sirajLogo}
                                alt="شعار أكاديمية سراج"
                                className="w-16 h-16 rounded-xl object-contain"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t(
                                'أكاديمية سراج لتعليم القرآن الكريم وعلومه أونلاين — نور يضيء دروب المتعلمين.',
                                'Siraj Academy for online Quran education — a light that illuminates learners\' paths.'
                            )}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 text-foreground">{t('الأكاديمية', 'Academy')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/#packages" className="hover:text-primary transition-colors">{t('الباقات', 'Packages')}</a></li>
                            <li><a href="/#family" className="hover:text-primary transition-colors">{t('عروض العائلة', 'Family Offers')}</a></li>
                            <li><a href="/#referral" className="hover:text-primary transition-colors">{t('دعوة صديق', 'Refer a Friend')}</a></li>
                            <li><Link to="/register" className="hover:text-primary transition-colors">{t('سجّل الآن', 'Register Now')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold mb-4 text-foreground">{t('الحساب', 'Account')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/login" className="hover:text-primary transition-colors">{t('تسجيل الدخول', 'Login')}</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition-colors">{t('حساب جديد', 'New Account')}</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors">{t('حسابي', 'My Account')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 text-foreground">{t('تواصل معنا', 'Contact Us')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span>📧</span>
                                <span>info@sirajacademy.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📱</span>
                                <span dir="ltr">+966 50 000 0000</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>🕐</span>
                                <span>{t('٩ صباحاً – ١٠ مساءً', '9 AM – 10 PM')}</span>
                            </li>
                        </ul>
                        <div className="flex gap-3 mt-4">
                            {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                                <button
                                    key={i}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
                                    style={{ background: 'rgba(244,91,6,0.1)', border: '1px solid var(--border)' }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
                    style={{ borderTop: '1px solid var(--border)' }}
                >
                    <p>
                        {t(
                            '© ٢٠٢٥ أكاديمية سراج. جميع الحقوق محفوظة.',
                            '© 2025 Siraj Academy. All rights reserved.'
                        )}
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary transition-colors">{t('سياسة الخصوصية', 'Privacy Policy')}</a>
                        <a href="#" className="hover:text-primary transition-colors">{t('الشروط والأحكام', 'Terms & Conditions')}</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
