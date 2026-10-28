import sirajLogo from '../../assets/siraj-logo-transparent.png'
import { useApp } from '../context'

interface BrandLockupProps {
  size?: 'nav' | 'footer'
}

export default function BrandLockup({ size = 'nav' }: BrandLockupProps) {
  const { t, dir } = useApp()
  const isFooter = size === 'footer'

  return (
    <span dir={dir} className={`brand-lockup${isFooter ? ' brand-lockup-footer' : ''}`}>
      <span className="brand-lockup-mark" aria-hidden="true">
        <img src={sirajLogo} alt="" />
      </span>
      <span className="brand-lockup-copy">
        <span className="brand-lockup-name">{t('سِراج', 'SIRAJ')}</span>
        <span className="brand-lockup-english">SIRAJ ACADEMY</span>
      </span>
    </span>
  )
}
