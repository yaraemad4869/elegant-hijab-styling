import { useApp } from '../context'
import reviewStudent1 from '../../assets/review-student-1.mp4'
import reviewStudent2 from '../../assets/review-student-2.mp4'
import reviewParent1 from '../../assets/review-parent-1.mp4'

const VIDEOS = [
  { src: reviewStudent1, titleAr: 'رأي طالب في حلقات التجويد', titleEn: 'A student on Tajweed circles' },
  { src: reviewStudent2, titleAr: 'تجربة طالبة مع حفظ القرآن', titleEn: 'A student on Quran memorization' },
  { src: reviewParent1, titleAr: 'رأي ولي أمر في متابعة أبنائه', titleEn: 'A parent on following up with their kids' },
]

export default function Reviews() {
  const { t, dir, language, siteContent } = useApp()

  return (
    <div dir={dir} className="min-h-screen py-24 px-4 islamic-pattern">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
            {t('شهاداتهم', 'Testimonials')}
          </p>
          <h1 className="font-display text-4xl font-bold mb-3">{t('آراء طلابنا', 'Our Students Reviews')}</h1>
          <p className="text-muted-foreground">
            {t('شاهد تجارب طلابنا وأولياء الأمور مع منصة سراج.', 'Watch our students and parents share their experience.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map(video => (
            <div
              key={video.src}
              className="rounded-2xl overflow-hidden card-glow"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <video src={video.src} controls playsInline preload="metadata" className="w-full aspect-video bg-black" />
              <p className="p-4 text-sm font-semibold">{language === 'ar' ? video.titleAr : video.titleEn}</p>
            </div>
          ))}
        </div>

        {siteContent.testimonials.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold mb-5 text-center">
              {t('آراء مكتوبة', 'Written Reviews')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {siteContent.testimonials.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl p-5"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    “{language === 'ar' ? item.textAr : item.textEn}”
                  </p>
                  <p className="font-semibold text-sm">{language === 'ar' ? item.nameAr : item.nameEn}</p>
                  <p className="text-xs text-primary">{'★'.repeat(item.rating)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
