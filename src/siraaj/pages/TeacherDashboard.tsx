import { useApp } from '../context'
import { MOCK_ALL_STUDENTS, MOCK_TEACHERS, DAYS } from '../data'

export default function TeacherDashboard() {
  const { currentUser, t, dir, language, siteContent } = useApp()

  const teacher = MOCK_TEACHERS.find(tc => tc.phone === currentUser?.phone) || MOCK_TEACHERS[0]
  const myStudents = MOCK_ALL_STUDENTS.filter(s => teacher.studentIds.includes(s.id))

  return (
    <div dir={dir} className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">{t('لوحة المعلم', "Teacher's Panel")}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold gold-text">
            {currentUser?.nameAr || teacher.nameAr}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{teacher.specialization}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { value: myStudents.length, labelAr: 'طلابي', labelEn: 'My Students', color: 'var(--primary)' },
            { value: myStudents.filter(s => s.status === 'active').length, labelAr: 'طلاب نشطون', labelEn: 'Active Students', color: 'var(--emerald-light)' },
            { value: teacher.joinDate, labelAr: 'تاريخ الانضمام', labelEn: 'Join Date', color: '#A855F7', isDate: true },
          ].map((s, i) => (
            <div key={i} className="card-glow p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="font-display text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? s.labelAr : s.labelEn}</p>
            </div>
          ))}
        </div>

        {/* Students list */}
        <div
          className="card-glow rounded-2xl overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-lg">{t('قائمة طلابي', 'My Students List')}</h2>
          </div>

          {myStudents.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">📚</p>
              <p>{t('لا يوجد طلاب مسجلون حتى الآن', 'No students enrolled yet')}</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {myStudents.map(student => {
                const pkg = siteContent.packages.find(p => p.id === student.packageId)
                return (
                  <div key={student.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 table-row-hover">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: 'rgba(244,91,6,0.15)', color: 'var(--primary)' }}
                      >
                        {student.nameAr.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{language === 'ar' ? student.nameAr : student.nameEn}</p>
                        <p className="text-xs text-muted-foreground font-en" dir="ltr">{student.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      {pkg && (
                        <span
                          className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ background: 'rgba(244,91,6,0.1)', color: 'var(--primary)' }}
                        >
                          {t('باقة', 'Pkg')} {language === 'ar' ? pkg.nameAr : pkg.nameEn}
                        </span>
                      )}
                      {pkg && (
                        <span className="text-xs text-muted-foreground">
                          {pkg.sessionsPerWeek} {t('حصص/أسبوع', 'sessions/week')}
                        </span>
                      )}
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          background: student.status === 'active' ? 'rgba(68,195,198,0.12)' : 'rgba(245,158,11,0.12)',
                          color: student.status === 'active' ? 'var(--emerald-light)' : '#F59E0B',
                        }}
                      >
                        {student.status === 'active' ? t('نشط', 'Active') : t('معلق', 'Pending')}
                      </span>

                      {/* Schedule */}
                      <div className="flex flex-wrap gap-1">
                        {(student.schedule || []).slice(0, 3).map(slot => {
                          const [dayId, time] = slot.split('-')
                          const day = DAYS.find(d => d.id === dayId)
                          return (
                            <span key={slot} className="text-[10px] px-2 py-0.5 rounded font-en" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                              {language === 'ar' ? day?.ar : day?.en} {time}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Schedule overview */}
        <div
          className="card-glow rounded-2xl mt-6 p-6"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h2 className="font-bold text-lg mb-4">{t('نظرة على جدولي الأسبوعي', 'My Weekly Schedule Overview')}</h2>
          <p className="text-sm text-muted-foreground">
            {t(
              'يمكنك متابعة جميع حصصك الأسبوعية مع طلابك من خلال صفحة حسابك.',
              'You can track all your weekly sessions with your students through your control panel.'
            )}
          </p>
          <div className="grid grid-cols-6 gap-2 mt-5">
            {DAYS.map(day => {
              const daySlots = myStudents.flatMap(s => (s.schedule || []).filter(slot => slot.startsWith(day.id)))
              return (
                <div key={day.id} className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-center text-muted-foreground mb-1">
                    {language === 'ar' ? day.ar : day.en}
                  </p>
                  {daySlots.length === 0 ? (
                    <div className="h-8 rounded-lg" style={{ background: 'var(--muted)' }} />
                  ) : (
                    daySlots.map((slot, i) => (
                      <div
                        key={i}
                        className="h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{ background: 'rgba(244,91,6,0.15)', color: 'var(--primary)' }}
                      >
                        {slot.split('-')[1]}
                      </div>
                    ))
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
