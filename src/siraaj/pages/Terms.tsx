import { Mail } from 'lucide-react'
import { useApp } from '../context'

interface Section {
  h: string
  ps: string[]
}

export default function Terms() {
  const { t, dir, language } = useApp()

  const sections: Section[] = language === 'ar'
    ? [
        {
          h: 'وصف الخدمة',
          ps: [
            'توفر أكاديمية سِراج حلقات تعليمية مباشرة أونلاين في القرآن الكريم والتجويد والعلوم الشرعية، عبر باقات اشتراك شهرية بعدد حصص محدد.',
          ],
        },
        {
          h: 'الحساب وبيانات التسجيل',
          ps: [
            'يتعهد المستخدم بصحة البيانات المدخلة عند التسجيل، والمحافظة على سرية كلمة المرور وعدم مشاركتها مع أي طرف آخر.',
          ],
        },
        {
          h: 'الاشتراك والدفع',
          ps: [
            'تُدفع قيمة الباقة مقدماً شهرياً بالريال السعودي (أو ما يقابلها) عبر وسائل الدفع المتاحة في صفحة الاشتراك.',
            'تبدأ صلاحية الاشتراك من تاريخ تأكيد الدفع وتستمر لمدة شهر تقويمي.',
          ],
        },
        {
          h: 'المواعيد والحصص',
          ps: [
            'يُحدد جدول الحصص بالاتفاق بين الطالب (أو ولي الأمر) والمعلم، وتُعد مواعيد الحصص بمرونة عند وجود ظروف طارئة بإخطار مسبق.',
            'الحصص التي لم تُستوفى خلال الشهر لا تُرحَّل تلقائياً لما بعده إلا باتفاق خاص.',
          ],
        },
        {
          h: 'الإلغاء والاسترداد',
          ps: [
            'يمكن إلغاء الاشتراك في أي وقت بمراسلتنا. قيمة الحصص التي قُدمت فعلاً غير مستردة، وتُدرس طلبات استرداد باقي المبلغ لكل حالة على حدة.',
          ],
        },
        {
          h: 'الاستخدام المقبول',
          ps: [
            'يتعهد الطالب وولي الأمر باحترام المعلمين والطلاب الآخرين، وعدم تسجيل الحصص أو نشر محتواها دون إذن مكتوب من الأكاديمية.',
          ],
        },
        {
          h: 'تعديل الشروط',
          ps: [
            'يحق للأكاديمية تحديث هذه الشروط، وتُعلن التعديلات الجوهرية عبر قنوات التواصل الرسمية قبل تفعيلها.',
          ],
        },
      ]
    : [
        {
          h: 'Service Description',
          ps: [
            'Siraj Academy provides live online classes in Quran, tajweed, and Islamic studies through monthly subscription packages with a fixed number of sessions.',
          ],
        },
        {
          h: 'Account & Registration',
          ps: [
            'Users commit to providing accurate registration data and to keeping their password confidential.',
          ],
        },
        {
          h: 'Subscription & Payment',
          ps: [
            'Package fees are paid monthly in advance in SAR (or equivalent) via the payment methods available on the subscription page.',
            'The subscription starts on the payment confirmation date and runs for one calendar month.',
          ],
        },
        {
          h: 'Schedules & Sessions',
          ps: [
            'The class schedule is agreed between the student (or guardian) and the teacher, and can be rearranged flexibly with prior notice.',
            'Unused sessions do not automatically roll over to the next month unless specially agreed.',
          ],
        },
        {
          h: 'Cancellation & Refunds',
          ps: [
            'You may cancel at any time by contacting us. Fees for sessions already delivered are non-refundable; other refund requests are reviewed case by case.',
          ],
        },
        {
          h: 'Acceptable Use',
          ps: [
            'Students and guardians commit to respecting teachers and other students, and to not recording or sharing class content without written permission.',
          ],
        },
        {
          h: 'Changes to These Terms',
          ps: [
            'The Academy may update these terms; material changes are announced through official channels before taking effect.',
          ],
        },
      ]

  return (
    <div dir={dir} className="min-h-screen px-5 pb-20 pt-32 md:px-8">
      <div className="mx-auto max-w-3xl">
        <span className="section-kicker">{t('سِراج', 'Siraj')}</span>
        <h1 className="section-title mt-3">{t('الشروط والأحكام', 'Terms & Conditions')}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t('آخر تحديث: يناير ٢٠٢٦', 'Last updated: January 2026')}</p>

        <div className="mt-10 flex flex-col gap-8">
          {sections.map(section => (
            <section key={section.h}>
              <h2 className="text-xl font-bold text-foreground">{section.h}</h2>
              {section.ps.map((p, i) => (
                <p key={i} className="mt-3 leading-8 text-muted-foreground">{p}</p>
              ))}
            </section>
          ))}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground">{t('التواصل معنا', 'Contact Us')}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t('لأي استفسار حول الشروط والأحكام، راسلنا على:', 'For any question about these terms, email us at:')}
            </p>
            <a href="mailto:info@sirajacademy.com" className="mt-3 inline-flex items-center gap-2 font-bold text-primary">
              <Mail size={18} />
              <span dir="ltr">info@sirajacademy.com</span>
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
