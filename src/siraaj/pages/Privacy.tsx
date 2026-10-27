import { Mail } from 'lucide-react'
import { useApp } from '../context'

interface Section {
  h: string
  ps: string[]
}

export default function Privacy() {
  const { t, dir, language } = useApp()

  const sections: Section[] = language === 'ar'
    ? [
        {
          h: 'المعلومات التي نجمعها',
          ps: [
            'نجمع عند التسجيل اسم ولي الأمر أو الطالب ورقم الهاتف، وعند تسجيل الأطفال نجمع اسم كل طفل وعمره ومستواه التعليمي وجدول حصصه.',
            'لا نحفظ بيانات بطاقات الدفع على أنظمتنا؛ تُعالَج المدفوعات عبر مزودي الدفع المعتمدين.',
          ],
        },
        {
          h: 'كيف نستخدم معلوماتك',
          ps: [
            'نستخدم بياناتك لتقديم الحلقات التعليمية، وتنسيق المواعيد مع المعلمين، وإرسال تقارير المتابعة لولي الأمر، والتواصل معك بشأن اشتراكك.',
          ],
        },
        {
          h: 'مشاركة البيانات',
          ps: [
            'لا نبيع بياناتك ولا نتاجر بها. تُشارك بيانات الطالب مع المعلم المخصص له فقط، ومع مزودي الدفع والخدمات التقنية بالحد اللازم لتشغيل الخدمة.',
          ],
        },
        {
          h: 'أمان المعلومات',
          ps: [
            'نستخدم اتصالاً مشفراً ونصرّف صلاحيات الوصول للبيانات بحسب الدور (إدارة، معلم، ولي أمر) للحفاظ على خصوصية بياناتكم.',
          ],
        },
        {
          h: 'خصوصية الأطفال',
          ps: [
            'تسجيل بيانات الأطفال يتم بواسطة ولي الأمر وبمسؤوليته، ونلتزم بأعلى درجات الحماية لبياناتهم.',
          ],
        },
        {
          h: 'حقوقك',
          ps: [
            'يمكنك في أي وقت طلب الوصول إلى بياناتك أو تصحيحها أو حذفها عبر التواصل معنا على البريد الإلكتروني أدناه.',
          ],
        },
      ]
    : [
        {
          h: 'Information We Collect',
          ps: [
            'At registration we collect the guardian or student name and phone number; for children we collect each child’s name, age, learning level, and class schedule.',
            'We never store card details on our systems; payments are processed by approved payment providers.',
          ],
        },
        {
          h: 'How We Use Your Information',
          ps: [
            'We use your data to deliver the classes, coordinate schedules with teachers, send progress reports to guardians, and communicate about your subscription.',
          ],
        },
        {
          h: 'Data Sharing',
          ps: [
            'We never sell your data. A student’s data is shared only with their assigned teacher, and with payment and technical providers strictly as needed to run the service.',
          ],
        },
        {
          h: 'Data Security',
          ps: [
            'We use encrypted connections and role-based access (admin, teacher, guardian) to keep your data private.',
          ],
        },
        {
          h: 'Children’s Privacy',
          ps: [
            'Children’s data is registered by the guardian and under their responsibility, and we protect it with the highest level of care.',
          ],
        },
        {
          h: 'Your Rights',
          ps: [
            'You may request access to, correction of, or deletion of your data at any time via the email below.',
          ],
        },
      ]

  return (
    <div dir={dir} className="min-h-screen px-5 pb-20 pt-32 md:px-8">
      <div className="mx-auto max-w-3xl">
        <span className="section-kicker">{t('سِراج', 'Siraj')}</span>
        <h1 className="section-title mt-3">{t('سياسة الخصوصية', 'Privacy Policy')}</h1>
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
              {t('لأي استفسار حول سياسة الخصوصية، راسلنا على:', 'For any question about this policy, email us at:')}
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
