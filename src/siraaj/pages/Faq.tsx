import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useApp } from '../context'

const FAQS = [
  {
    q: { ar: 'كيف تتم الحصص في منصة سراج؟', en: 'How are the sessions held?' },
    a: {
      ar: 'الحصص فردية مباشرة (أونلاين) مع المعلم عبر مكالمة فيديو، بمواعيد تختارها أنت حسب باقتك.',
      en: 'Sessions are live one-to-one online video classes with your teacher, at times you choose based on your package.',
    },
  },
  {
    q: { ar: 'ما هي مدة الحصة الواحدة؟', en: 'How long is one session?' },
    a: {
      ar: 'مدة الحصة الافتراضية 30 دقيقة، ويمكن تمديدها حسب الباقة والاتفاق مع المعلم.',
      en: 'A session lasts 30 minutes by default and can be extended depending on your package.',
    },
  },
  {
    q: { ar: 'هل يوجد معلمات للفتيات والسيدات؟', en: 'Are there female teachers?' },
    a: {
      ar: 'نعم، لدينا معلمات مجازات لتعليم الفتيات والسيدات، ويمكنك طلب ذلك عند التسجيل.',
      en: 'Yes, we have certified female teachers for girls and women. You can request this at registration.',
    },
  },
  {
    q: { ar: 'ماذا لو فاتتني حصة؟', en: 'What if I miss a session?' },
    a: {
      ar: 'يمكنك تأجيل الحصة بإخطار المعلم قبل الموعد بـ 6 ساعات على الأقل، وتُعوَّض خلال نفس الشهر.',
      en: 'You can reschedule by notifying the teacher at least 6 hours in advance; it will be compensated within the same month.',
    },
  },
  {
    q: { ar: 'ما طرق الدفع المتاحة؟', en: 'Which payment methods are available?' },
    a: {
      ar: 'نستقبل الدفع بالبطاقات البنكية (فيزا/ماستركارد)، إنستاباي، وبوابة Paymob.',
      en: 'We accept bank cards (Visa/Mastercard), InstaPay, and the Paymob gateway.',
    },
  },
  {
    q: { ar: 'هل هناك خصومات للعائلات؟', en: 'Are there family discounts?' },
    a: {
      ar: 'نعم، يزداد الخصم مع كل فرد إضافي من نفس العائلة، بالإضافة لخصم دعوة الأصدقاء.',
      en: 'Yes, the discount grows with each additional family member, plus a referral discount.',
    },
  },
]

export default function Faq() {
  const { t, dir, language } = useApp()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div dir={dir} className="min-h-screen py-24 px-4 islamic-pattern">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
            {t('مركز المساعدة', 'Help Center')}
          </p>
          <h1 className="font-display text-4xl font-bold mb-3">{t('الأسئلة الشائعة', 'FAQ')}</h1>
          <p className="text-muted-foreground">
            {t('كل ما تودّ معرفته قبل الانضمام إلى حلقات سراج.', 'Everything you want to know before joining Siraj.')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-5 text-start"
              >
                <span className="font-semibold">{language === 'ar' ? item.q.ar : item.q.en}</span>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 transition-transform"
                  style={{ transform: open === i ? 'rotate(180deg)' : 'none', color: 'var(--primary)' }}
                />
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {language === 'ar' ? item.a.ar : item.a.en}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
