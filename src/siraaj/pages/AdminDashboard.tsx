import { useState } from 'react'
import {
  Users, UserCheck, BookOpen, TrendingUp, Search, Plus, X, Pencil, Trash2,
  Save, Phone, User, Lock, ChevronDown, ChevronUp, Check, AlertTriangle,
  ToggleLeft, ToggleRight, RotateCcw,
} from 'lucide-react'
import { useApp } from '../context'
import { DEFAULT_SITE_CONTENT, packageIcon } from '../data'
import type { Package, /*Testimonial, */Program, Feature, Stat, /*FamilyDiscount,*/ Teacher, HeroSettings } from '../types'

type Tab = 'overview' | 'students' | 'teachers' | 'packages' | 'content' | 'settings'
type ContentSub = /*'testimonials' | */'programs' | 'features' /*| 'stats'*/

// ── Reusable inline form field ─────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function inputCls(extra = '') {
  return `w-full px-3 py-2.5 text-sm rounded-xl ${extra}`
}

// ── Package Modal ──────────────────────────────────────────────────────────────
function PackageModal({ initial, onSave, onClose, lang }: {
  initial: Partial<Package> | null
  onSave: (p: Package) => void
  onClose: () => void
  lang: 'ar' | 'en'
}) {
  const t = (ar: string, en: string) => lang === 'ar' ? ar : en
  const [form, setForm] = useState<Package>({
    id: initial?.id || `pkg-${Date.now()}`,
    nameAr: initial?.nameAr || '',
    nameEn: initial?.nameEn || '',
    price: initial?.price || 0,
    priceUsd: initial?.priceUsd,

    originalPrice: initial?.originalPrice,
    sessions: initial?.sessions || 8,
    sessionsPerWeek: initial?.sessionsPerWeek || 2,
    color: initial?.color || '#44C3C6',
    highlight: initial?.highlight || false,
    active: initial?.active !== false,
    badge: initial?.badge,
    featuresAr: initial?.featuresAr || [],
    featuresEn: initial?.featuresEn || [],
  })
  const [featuresArText, setFeaturesArText] = useState((initial?.featuresAr || []).join('\n'))
  const [featuresEnText, setFeaturesEnText] = useState((initial?.featuresEn || []).join('\n'))
  const [badgeAr, setBadgeAr] = useState(initial?.badge?.ar || '')
  const [badgeEn, setBadgeEn] = useState(initial?.badge?.en || '')

  const handleSave = () => {
    onSave({
      ...form,
      featuresAr: featuresArText.split('\n').map(s => s.trim()).filter(Boolean),
      featuresEn: featuresEnText.split('\n').map(s => s.trim()).filter(Boolean),
      badge: badgeAr || badgeEn ? { ar: badgeAr, en: badgeEn } : undefined,
    })
  }

  const colors = ['#F45B06', '#44C3C6', '#7C3AED', '#2563EB', '#DC2626', '#F59E0B']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-2xl rounded-2xl card-glow overflow-y-auto max-h-[90vh]" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-6 border-b sticky top-0 z-10" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-lg">{initial?.id ? t('تعديل الباقة', 'Edit Package') : t('إضافة باقة جديدة', 'Add New Package')}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('الاسم بالعربي', 'Name (Arabic)')}>
            <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className={inputCls()} placeholder={t('الأساسية', 'Basic')} />
          </Field>
          <Field label={t('الاسم بالإنجليزي', 'Name (English)')}>
            <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className={inputCls()} placeholder="Basic" dir="ltr" />
          </Field>
          <Field label={t('السعر (ريال/شهر)', 'Price (SAR/month)')}>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} className={inputCls()} min={0} />
          </Field>
          <Field label={t('السعر الأصلي (اختياري)', 'Original Price (optional)')}>
            <input type="number" value={form.originalPrice || ''} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value ? +e.target.value : undefined }))} className={inputCls()} min={0} placeholder={t('اتركه فارغاً إذا لا يوجد', 'Leave empty if none')} />
          </Field>
          <Field label={t('السعر بالدولار (اختياري)', 'Price in USD (optional)')}>
            <input type="number" value={form.priceUsd ?? ''} onChange={e => setForm(f => ({ ...f, priceUsd: e.target.value ? +e.target.value : undefined }))} className={inputCls()} min={0} step="0.01" placeholder={t('مثال: 120', 'e.g. 120')} />
          </Field>

          <Field label={t('عدد الحصص الشهرية', 'Monthly Sessions')}>
            <input type="number" value={form.sessions} onChange={e => setForm(f => ({ ...f, sessions: +e.target.value }))} className={inputCls()} min={1} />
          </Field>
          <Field label={t('حصص أسبوعياً', 'Weekly Sessions')}>
            <input type="number" value={form.sessionsPerWeek} onChange={e => setForm(f => ({ ...f, sessionsPerWeek: +e.target.value }))} className={inputCls()} min={1} max={7} />
          </Field>
          <Field label={t('شارة (عربي)', 'Badge (Arabic)')}>
            <input value={badgeAr} onChange={e => setBadgeAr(e.target.value)} className={inputCls()} placeholder={t('الأكثر طلباً', 'Most Popular')} />
          </Field>
          <Field label={t('شارة (إنجليزي)', 'Badge (English)')}>
            <input value={badgeEn} onChange={e => setBadgeEn(e.target.value)} className={inputCls()} placeholder="Most Popular" dir="ltr" />
          </Field>
          <Field label={t('اللون', 'Color')}>
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} className="w-8 h-8 rounded-lg transition-all" style={{ background: c, border: form.color === c ? '2.5px solid white' : '2px solid transparent', transform: form.color === c ? 'scale(1.15)' : 'none' }} />
              ))}
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-8 h-8 rounded-lg cursor-pointer" title={t('لون مخصص', 'Custom color')} style={{ padding: 1 }} />
            </div>
          </Field>
          <Field label="">
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input type="checkbox" checked={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.checked }))} className="checkbox-custom" />
              <span className="text-sm">{t('باقة مميزة (أبرزها)', 'Highlighted package')}</span>
            </label>
          </Field>
          <Field label="">
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input type="checkbox" checked={form.active !== false} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="checkbox-custom" />
              <span className="text-sm">{t('نشط/غير نشط', 'Active / Inactive')}</span>
            </label>
          </Field>
          <div className="sm:col-span-2">
            <Field label={t('المميزات بالعربي (سطر لكل ميزة)', 'Features Arabic (one per line)')}>
              <textarea value={featuresArText} onChange={e => setFeaturesArText(e.target.value)} rows={5} className={inputCls()} placeholder={t('معلم متخصص\nخطة تعليمية\n...', 'Specialized teacher\nEducational plan\n...')} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label={t('المميزات بالإنجليزي (سطر لكل ميزة)', 'Features English (one per line)')}>
              <textarea value={featuresEnText} onChange={e => setFeaturesEnText(e.target.value)} rows={5} className={inputCls()} dir="ltr" placeholder="Specialized teacher&#10;Educational plan&#10;..." />
            </Field>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"><Save size={16} />{t('حفظ', 'Save')}</button>
          <button onClick={onClose} className="btn-outline px-6 py-3">{t('إلغاء', 'Cancel')}</button>
        </div>
      </div>
    </div>
  )
}

// ── Testimonial Modal ──────────────────────────────────────────────────────────
// function TestimonialModal({ initial, onSave, onClose, lang }: {
//   initial: Partial<Testimonial> | null; onSave: (t: Testimonial) => void; onClose: () => void; lang: 'ar' | 'en'
// }) {
//   const tl = (ar: string, en: string) => lang === 'ar' ? ar : en
//   const [form, setForm] = useState<Testimonial>({
//     id: initial?.id || `t-${Date.now()}`,
//     nameAr: initial?.nameAr || '', nameEn: initial?.nameEn || '',
//     textAr: initial?.textAr || '', textEn: initial?.textEn || '',
//     rating: initial?.rating || 5, country: initial?.country || '',
//   })
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
//       <div className="w-full max-w-xl rounded-2xl card-glow" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
//         <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
//           <h2 className="font-bold text-lg">{initial?.id ? tl('تعديل الشهادة', 'Edit Testimonial') : tl('إضافة شهادة', 'Add Testimonial')}</h2>
//           <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
//         </div>
//         <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Field label={tl('الاسم (عربي)', 'Name (Arabic)')}><input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className={inputCls()} /></Field>
//           <Field label={tl('الاسم (إنجليزي)', 'Name (English)')}><input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className={inputCls()} dir="ltr" /></Field>
//           <Field label={tl('الدولة', 'Country')}><input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={inputCls()} /></Field>
//           <Field label={tl('التقييم (١-٥)', 'Rating (1-5)')}><input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))} className={inputCls()} /></Field>
//           <div className="sm:col-span-2"><Field label={tl('النص (عربي)', 'Text (Arabic)')}><textarea value={form.textAr} onChange={e => setForm(f => ({ ...f, textAr: e.target.value }))} rows={3} className={inputCls()} /></Field></div>
//           <div className="sm:col-span-2"><Field label={tl('النص (إنجليزي)', 'Text (English)')}><textarea value={form.textEn} onChange={e => setForm(f => ({ ...f, textEn: e.target.value }))} rows={3} className={inputCls()} dir="ltr" /></Field></div>
//         </div>
//         <div className="p-6 pt-0 flex gap-3">
//           <button onClick={() => onSave(form)} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"><Save size={16} />{tl('حفظ', 'Save')}</button>
//           <button onClick={onClose} className="btn-outline px-6 py-3">{tl('إلغاء', 'Cancel')}</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// ── Program / Feature Modal (shared structure) ─────────────────────────────────
function BilingualItemModal<T extends { id: string; icon: string; nameAr: string; nameEn: string; descAr: string; descEn: string; active?: boolean }>({
  title, initial, onSave, onClose, lang,
}: { title: string; initial: Partial<T> | null; onSave: (item: T) => void; onClose: () => void; lang: 'ar' | 'en' }) {
  const tl = (ar: string, en: string) => lang === 'ar' ? ar : en
  const [form, setForm] = useState({ id: initial?.id || `item-${Date.now()}`, icon: initial?.icon || '📌', nameAr: initial?.nameAr || '', nameEn: initial?.nameEn || '', descAr: initial?.descAr || '', descEn: initial?.descEn || '', active: initial?.active ?? true })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-xl rounded-2xl card-glow" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={tl('الأيقونة (إيموجي)', 'Icon (emoji)')}><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className={inputCls()} placeholder="📖" /></Field>
          <div />
          <Field label={tl('الاسم (عربي)', 'Name (Arabic)')}><input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className={inputCls()} /></Field>
          <Field label={tl('الاسم (إنجليزي)', 'Name (English)')}><input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className={inputCls()} dir="ltr" /></Field>
          <Field label={tl('الوصف (عربي)', 'Description (Arabic)')}><input value={form.descAr} onChange={e => setForm(f => ({ ...f, descAr: e.target.value }))} className={inputCls()} /></Field>
          <Field label={tl('الوصف (إنجليزي)', 'Description (English)')}><input value={form.descEn} onChange={e => setForm(f => ({ ...f, descEn: e.target.value }))} className={inputCls()} dir="ltr" /></Field>
          <div className="sm:col-span-2">
            <Field label={tl('الحالة', 'Status')}>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input type="checkbox" checked={form.active !== false} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm">{tl('نشط', 'Active')}</span>
              </label>
            </Field>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={() => onSave(form as T)} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"><Save size={16} />{tl('حفظ', 'Save')}</button>
          <button onClick={onClose} className="btn-outline px-6 py-3">{tl('إلغاء', 'Cancel')}</button>
        </div>
      </div>
    </div>
  )
}

// ── Teacher Modal ──────────────────────────────────────────────────────────────
function TeacherModal({ initial, onSave, onClose, lang }: { initial: Partial<Teacher> | null; onSave: (t: Teacher) => void; onClose: () => void; lang: 'ar' | 'en' }) {
  const tl = (ar: string, en: string) => lang === 'ar' ? ar : en
  const [form, setForm] = useState<Teacher>({ id: initial?.id || `teacher-${Date.now()}`, nameAr: initial?.nameAr || '', nameEn: initial?.nameEn || '', phone: initial?.phone || '', password: initial?.password || '', specialization: initial?.specialization || '', studentIds: initial?.studentIds || [], joinDate: initial?.joinDate || new Date().toISOString().split('T')[0] })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl card-glow" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-lg">{initial?.id ? tl('تعديل المعلم', 'Edit Teacher') : tl('إضافة معلم', 'Add Teacher')}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={tl('الاسم (عربي)', 'Name (Arabic)')}><input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className={inputCls()} /></Field>
          <Field label={tl('الاسم (إنجليزي)', 'Name (English)')}><input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className={inputCls()} dir="ltr" /></Field>
          <Field label={tl('رقم الجوال', 'Phone')}><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls()} dir="ltr" /></Field>
          <Field label={tl('التخصص', 'Specialization')}><input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} className={inputCls()} /></Field>
          <div className="sm:col-span-2">
            <Field label={tl('كلمة المرور', 'Password')}><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={inputCls()} /></Field>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={() => onSave(form)} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"><Save size={16} />{tl('حفظ', 'Save')}</button>
          <button onClick={onClose} className="btn-outline px-6 py-3">{tl('إلغاء', 'Cancel')}</button>
        </div>
      </div>
    </div>
  )
}

// ── Delete confirm ─────────────────────────────────────────────────────────────
function ConfirmDelete({ message, onConfirm, onCancel, lang }: { message: string; onConfirm: () => void; onCancel: () => void; lang: 'ar' | 'en' }) {
  const tl = (ar: string, en: string) => lang === 'ar' ? ar : en
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl card-glow p-6 text-center" style={{ background: 'var(--card)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <AlertTriangle size={36} className="mx-auto mb-3 text-destructive" />
        <p className="font-bold mb-1">{tl('تأكيد الحذف', 'Confirm Delete')}</p>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--destructive)', border: '1px solid rgba(239,68,68,0.3)' }}>{tl('حذف', 'Delete')}</button>
          <button onClick={onCancel} className="btn-outline flex-1 py-2.5 text-sm">{tl('إلغاء', 'Cancel')}</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const {
    t, dir, language, siteContent, currentUser,
    addPackage, updatePackage, deletePackage,
    /*setFamilyDiscounts,*/
    // addTestimonial, updateTestimonial, deleteTestimonial,
    addProgram, updateProgram, //deleteProgram,
    addFeature, updateFeature, deleteFeature,
    updateHero,
    teachers, addTeacher, updateTeacher, deleteTeacher, teacherStudentCount,
    students, studentsLoading, refreshStudents, assignStudentTeacher, //,setStats
  } = useApp()

  const { packages, /*familyDiscounts, testimonials,*/ programs, features, stats, hero } = siteContent

  const [apiError, setApiError] = useState<string | null>(null)
  // كل عمليات الحفظ/الحذف تمر على الـ backend الآن
  const run = (action: () => Promise<unknown>) => {
    setApiError(null)
    void action().catch((err: unknown) => setApiError(err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بالخادم'))
  }

  const [tab, setTab] = useState<Tab>('overview')
  const [contentSub, setContentSub] = useState<ContentSub>('programs')
  const [search, setSearch] = useState('')

  // Modal state
  const [pkgModal, setPkgModal] = useState<{ open: boolean; data: Partial<Package> | null }>({ open: false, data: null })
  // const [testModal, setTestModal] = useState<{ open: boolean; data: Partial<Testimonial> | null }>({ open: false, data: null })
  const [progModal, setProgModal] = useState<{ open: boolean; data: Partial<Program> | null }>({ open: false, data: null })
  const [featModal, setFeatModal] = useState<{ open: boolean; data: Partial<Feature> | null }>({ open: false, data: null })
  const [teacherModal, setTeacherModal] = useState<{ open: boolean; data: Partial<Teacher> | null }>({ open: false, data: null })
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; message: string; onConfirm: () => void } | null>(null)
  // تعديل معلم الطالب داخل الجدول
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [teacherDraft, setTeacherDraft] = useState('')


  // Hero/settings local edit state
  const [heroEdit, setHeroEdit] = useState<HeroSettings>(hero)
  const [heroSaved, setHeroSaved] = useState(false)

  // Family discounts local edit
  // const [fdEdit, setFdEdit] = useState<FamilyDiscount[]>(familyDiscounts)

  // Stats local edit
  const [statsEdit, setStatsEdit] = useState<Stat[]>(stats)

  const filteredStudents = students.filter(s =>
    s.nameAr.includes(search) || s.nameEn.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search)
  )

  // صلاحيات إدارة الباقات: للأدمن فقط
  const isAdmin = currentUser?.role === 'admin'

  // باقات افتراضية محذوفة — يمكن للأدمن استرجاعها بضغطة
  const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()
  const missingDefaultPackages = DEFAULT_SITE_CONTENT.packages.filter(
    dp => !packages.some(p => sameName(p.nameAr, dp.nameAr) || sameName(p.nameEn, dp.nameEn))
  )

  const totalRevenue = packages.reduce((acc, pkg) => {
    const count = students.filter(s => s.packageId === pkg.id).length
    return acc + pkg.price * count
  }, 0)

  const mainTabs: { id: Tab; ar: string; en: string; icon: string }[] = [
    { id: 'overview', ar: 'نظرة عامة', en: 'Overview', icon: '📊' },
    { id: 'students', ar: 'الطلاب', en: 'Students', icon: '👥' },
    { id: 'teachers', ar: 'المعلمون', en: 'Teachers', icon: '🎓' },
    { id: 'packages', ar: 'الباقات', en: 'Packages', icon: '📦' },
    { id: 'content', ar: 'المحتوى', en: 'Content', icon: '✏️' },
    { id: 'settings', ar: 'الإعدادات', en: 'Settings', icon: '⚙️' },
  ]

  const confirmDelete = (message: string, onConfirm: () => void) => {
    setDeleteConfirm({ open: true, message, onConfirm })
  }

  return (
    <div dir={dir} className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">{t('إدارة المنصة', 'Platform Management')}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold gold-text">{t('الإدارة العامة', 'Admin Dashboard')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('تحكم في كل محتوى الموقع وبياناته', 'Control all website content and data')}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2 flex-nowrap">
          {mainTabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5"
              style={{ background: tab === tb.id ? 'var(--primary)' : 'var(--card)', color: tab === tb.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)', border: `1px solid ${tab === tb.id ? 'transparent' : 'var(--border)'}` }}
            >
              <span>{tb.icon}</span>
              {language === 'ar' ? tb.ar : tb.en}
            </button>
          ))}
        </div>

        {apiError && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm text-destructive flex items-center justify-between gap-3"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <span>{apiError}</span>
            <button onClick={() => setApiError(null)} className="opacity-70 hover:opacity-100"><X size={14} /></button>
          </div>
        )}



        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <Users size={22} />, value: students.length, labelAr: 'إجمالي الطلاب', labelEn: 'Total Students', color: 'var(--primary)' },
                { icon: <UserCheck size={22} />, value: teachers.length, labelAr: 'المعلمون', labelEn: 'Teachers', color: 'var(--emerald-light)' },
                { icon: <BookOpen size={22} />, value: packages.length, labelAr: 'الباقات', labelEn: 'Packages', color: '#A855F7' },
                { icon: <TrendingUp size={22} />, value: `${totalRevenue.toLocaleString()} ${t('ر', 'SAR')}`, labelAr: 'إيراد الشهر', labelEn: 'Monthly Revenue', color: '#F59E0B' },
              ].map((s, i) => (
                <div key={i} className="card-glow p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                  <p className="font-display text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{language === 'ar' ? s.labelAr : s.labelEn}</p>
                </div>
              ))}
            </div>
            <div className="card-glow p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-lg mb-5">{t('توزيع الطلاب على الباقات', 'Student Distribution by Package')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {packages.map(pkg => {
                  const count = students.filter(s => s.packageId === pkg.id).length
                  const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0
                  return (
                    <div key={pkg.id} className="p-4 rounded-xl" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm">{language === 'ar' ? pkg.nameAr : pkg.nameEn}</span>
                        <span className="text-sm font-bold" style={{ color: pkg.color }}>{count} {t('طالب', 'students')}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(244,91,6,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pkg.color }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Students ── */}
        {tab === 'students' && (
          <div className="card-glow rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-lg">{t('جميع الطلاب', 'All Students')}</h2>
                <span className="text-xs text-muted-foreground">{students.length}</span>
                <button onClick={() => run(() => refreshStudents())} className="text-xs underline text-muted-foreground hover:text-foreground">{t('تحديث', 'Refresh')}</button>
              </div>
              <div className="relative w-full sm:w-72">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('بحث...', 'Search...')} className="w-full px-4 py-2.5 ps-10 text-sm" />
                <Search size={14} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ [language === 'ar' ? 'right' : 'left']: '12px' }} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(244,91,6,0.04)', borderBottom: '1px solid var(--border)' }}>
                    {[t('الطالب', 'Student'), t('الجوال', 'Phone'), t('الباقة', 'Package'), t('المعلم', 'Teacher'), t('تاريخ الانضمام', 'Join Date'), t('الحالة', 'Status'), ''].map((h, hi) => (
                      <th key={hi} className="text-start text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, i) => {
                    const editing = editingStudentId === student.id
                    const teacher = teachers.find(tc => tc.id === student.teacherId)
                    return (
                      <tr key={student.id} className="table-row-hover" style={{ borderBottom: i < filteredStudents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(244,91,6,0.15)', color: 'var(--primary)' }}>{student.nameAr.charAt(0)}</div>
                            <div><p className="font-semibold text-sm">{language === 'ar' ? student.nameAr : student.nameEn}</p><p className="text-xs text-muted-foreground font-en">{student.referralCode}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-en text-muted-foreground" dir="ltr">{student.phone}</td>
                        <td className="px-4 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: 'rgba(244,91,6,0.1)', color: 'var(--primary)' }}>{student.packageName || '—'}</span>
                        </td>
                        <td className="px-4 py-4">
                          {editing ? (
                            <select
                              value={teacherDraft}
                              onChange={e => setTeacherDraft(e.target.value)}
                              className="text-sm px-2 py-1.5 rounded-lg"
                              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                            >
                              <option value="">{t('بدون معلم', 'No teacher')}</option>
                              {teachers.map(tc => (
                                <option key={tc.id} value={tc.id}>{language === 'ar' ? tc.nameAr : tc.nameEn}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm">
                              {teacher ? (language === 'ar' ? teacher.nameAr : teacher.nameEn) : (student.teacherName || <span className="text-muted-foreground">{t('غير محدد', 'Unassigned')}</span>)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground font-en">{student.joinDate}</td>
                        <td className="px-4 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: student.status === 'active' ? 'rgba(68,195,198,0.12)' : 'rgba(245,158,11,0.12)', color: student.status === 'active' ? 'var(--emerald-light)' : '#F59E0B' }}>
                            {student.status === 'active' ? t('نشط', 'Active') : t('معلق', 'Pending')}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {editing ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  run(async () => { await assignStudentTeacher(student.id, teacherDraft || null); setEditingStudentId(null) })
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(68,195,198,0.15)', color: 'var(--emerald-light)' }}
                                title={t('حفظ', 'Save')}
                              ><Check size={14} /></button>
                              <button onClick={() => setEditingStudentId(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--muted)' }} title={t('إلغاء', 'Cancel')}><X size={14} /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingStudentId(student.id); setTeacherDraft(student.teacherId || '') }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ background: 'rgba(244,91,6,0.12)', color: 'var(--primary)' }}
                              title={t('تعديل المعلم', 'Edit teacher')}
                            ><Pencil size={13} /></button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users size={28} className="mx-auto mb-2 opacity-40" />
                  <p>{studentsLoading ? t('جاري التحميل...', 'Loading...') : t('لا توجد نتائج', 'No results')}</p>
                </div>
              )}
            </div>
          </div>
        )}


        {/* ── Teachers ── */}
        {tab === 'teachers' && (
          <>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-muted-foreground">{teachers.length} {t('معلم مسجل', 'teachers registered')}</p>
              <button onClick={() => setTeacherModal({ open: true, data: null })} className="btn-primary px-5 py-2.5 flex items-center gap-2 text-sm"><Plus size={16} />{t('إضافة معلم', 'Add Teacher')}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teachers.map(teacher => (
                <div key={teacher.id} className="card-glow p-5 rounded-2xl relative group" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="absolute top-3 end-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setTeacherModal({ open: true, data: teacher })} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: 'rgba(244,91,6,0.12)', color: 'var(--primary)' }}><Pencil size={13} /></button>
                    <button onClick={() => confirmDelete(t(`حذف ${teacher.nameAr}؟`, `Delete ${teacher.nameEn}?`), () => { run(() => deleteTeacher(teacher.id)); setDeleteConfirm(null) })} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--destructive)' }}><Trash2 size={13} /></button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold" style={{ background: 'rgba(244,91,6,0.15)', color: 'var(--primary)' }}>{teacher.nameAr.charAt(0)}</div>
                    <div><p className="font-bold">{language === 'ar' ? teacher.nameAr : teacher.nameEn}</p><p className="text-xs text-muted-foreground">{teacher.specialization}</p></div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">{t('الجوال', 'Phone')}</span><span className="font-en">{teacher.phone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t('الطلاب', 'Students')}</span><span className="font-bold text-primary">{teacherStudentCount(teacher.id)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t('الانضمام', 'Joined')}</span><span className="font-en text-muted-foreground">{teacher.joinDate}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Packages ── */}
        {tab === 'packages' && (
          <>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-muted-foreground">{packages.length} {t('باقة', 'packages')}</p>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  {missingDefaultPackages.length > 0 && (
                    <button
                      onClick={() => run(async () => { for (const dp of missingDefaultPackages) await addPackage({ ...dp, active: true }) })}
                      className="btn-outline px-4 py-2.5 flex items-center gap-2 text-sm"
                    >
                      <RotateCcw size={15} />
                      {t(`استرجاع الباقات المحذوفة (${missingDefaultPackages.length})`, `Restore deleted packages (${missingDefaultPackages.length})`)}
                    </button>
                  )}
                  <button onClick={() => setPkgModal({ open: true, data: null })} className="btn-primary px-5 py-2.5 flex items-center gap-2 text-sm"><Plus size={16} />{t('إضافة باقة', 'Add Package')}</button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map(pkg => (
                <div key={pkg.id} className="card-glow rounded-2xl overflow-hidden relative group" style={{ background: 'var(--card)', border: `1.5px solid ${pkg.highlight ? 'rgba(244,91,6,0.4)' : 'var(--border)'}`, opacity: pkg.active === false ? 0.55 : 1 }}>
                  {pkg.highlight && <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#44C3C6,#FF8A3D)' }} />}
                  <div className="p-5">
                    {isAdmin && (
                      <div className="absolute top-4 end-4 flex items-center gap-1 z-10">
                        <button
                          onClick={() => run(() => updatePackage({ ...pkg, active: pkg.active === false }))}
                          className="px-2.5 h-8 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold"
                          style={pkg.active === false
                            ? { background: 'rgba(239,68,68,0.12)', color: 'var(--destructive)' }
                            : { background: 'rgba(68,195,198,0.15)', color: '#12A5A8' }}
                          title={t('نشط/غير نشط', 'Active / Inactive')}
                        >
                          {pkg.active === false ? <ToggleLeft size={15} /> : <ToggleRight size={15} />}
                          {pkg.active === false ? t('غير نشط', 'Inactive') : t('نشط', 'Active')}
                        </button>
                        <button onClick={() => setPkgModal({ open: true, data: pkg })} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,91,6,0.12)', color: 'var(--primary)' }}><Pencil size={13} /></button>
                        <button onClick={() => confirmDelete(t(`حذف باقة ${pkg.nameAr}؟`, `Delete ${pkg.nameEn} package?`), () => { run(() => deletePackage(pkg.id)); setDeleteConfirm(null) })} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--destructive)' }}><Trash2 size={13} /></button>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${pkg.color}22` }}>
                        {packageIcon(pkg)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2"><p className="font-bold">{language === 'ar' ? pkg.nameAr : pkg.nameEn}</p>{pkg.highlight && <span className="badge-popular text-[10px]">{t('مميزة', 'Featured')}</span>}</div>
                        <p className="text-xs text-muted-foreground">{pkg.sessionsPerWeek} {t('حصص/أسبوع', 'sessions/week')}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="font-display text-2xl font-bold gold-text">{pkg.price}</span>
                      <span className="text-muted-foreground text-xs">{t('ر/شهر', 'SAR/mo')}</span>
                      {pkg.originalPrice && <span className="text-muted-foreground text-xs line-through ms-1">{pkg.originalPrice}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{pkg.sessions} {t('حصة شهرياً', 'sessions/month')}</p>
                    <ul className="space-y-1.5">
                      {(language === 'ar' ? pkg.featuresAr : pkg.featuresEn).slice(0, 3).map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-xs text-foreground/80"><Check size={11} style={{ color: pkg.color }} className="flex-shrink-0" />{f}</li>
                      ))}
                      {pkg.featuresAr.length > 3 && <li className="text-xs text-muted-foreground">+{pkg.featuresAr.length - 3} {t('أكثر', 'more')}</li>}
                    </ul>
                  </div>
                </div>
              ))}
              {packages.length === 0 && (
                <div className="sm:col-span-3 text-center py-16 text-muted-foreground">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
                  <p>{t('لا توجد باقات — أضف باقة جديدة', 'No packages — add a new one')}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Content ── */}
        {tab === 'content' && (
          <>
            {/* Sub-tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
              {([
                // { id: 'testimonials' as ContentSub, ar: 'الشهادات', en: 'Testimonials' },
                { id: 'programs' as ContentSub, ar: 'البرامج', en: 'Programs' },
                { id: 'features' as ContentSub, ar: 'المميزات', en: 'Features' }
                // { id: 'stats' as ContentSub, ar: 'الإحصائيات', en: 'Stats' },
              ]).map(sub => (
                <button key={sub.id} onClick={() => setContentSub(sub.id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: contentSub === sub.id ? 'var(--card)' : 'transparent', color: contentSub === sub.id ? 'var(--primary)' : 'var(--muted-foreground)' }}
                >
                  {language === 'ar' ? sub.ar : sub.en}
                </button>
              ))}
            </div>

            {/* Testimonials */}
            {/* {contentSub === 'testimonials' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">{testimonials.length} {t('شهادة', 'testimonials')}</p>
                  <button onClick={() => setTestModal({ open: true, data: null })} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Plus size={14} />{t('إضافة', 'Add')}</button>
                </div>
                <div className="flex flex-col gap-4">
                  {testimonials.map(test => (
                    <div key={test.id} className="card-glow p-5 rounded-2xl flex gap-4 group relative" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      <div className="absolute top-3 end-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setTestModal({ open: true, data: test })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,91,6,0.12)', color: 'var(--primary)' }}><Pencil size={12} /></button>
                        <button onClick={() => confirmDelete(t('حذف هذه الشهادة؟', 'Delete this testimonial?'), () => { deleteTestimonial(test.id); setDeleteConfirm(null) })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--destructive)' }}><Trash2 size={12} /></button>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: 'rgba(244,91,6,0.15)', color: 'var(--primary)' }}>{test.nameAr.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1"><p className="font-semibold text-sm">{test.nameAr}</p><p className="text-xs text-muted-foreground">— {test.country}</p></div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{test.textAr}</p>
                      </div>
                    </div>
                  ))}
                  {testimonials.length === 0 && <div className="text-center py-10 text-muted-foreground text-sm">{t('لا توجد شهادات بعد', 'No testimonials yet')}</div>}
                </div>
              </>
            )} */}

            {/* Programs */}
            {contentSub === 'programs' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">{programs.length} {t('برنامج', 'programs')}</p>
                  <button onClick={() => setProgModal({ open: true, data: null })} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Plus size={14} />{t('إضافة', 'Add')}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {programs.map(prog => {
                    const isActive = prog.active !== false
                    return (
                      <div key={prog.id} className="card-glow p-4 rounded-2xl flex gap-3 group relative" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                        <div className="absolute top-3 end-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setProgModal({ open: true, data: prog })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,91,6,0.12)', color: 'var(--primary)' }}><Pencil size={12} /></button>
                          <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: isActive ? 'rgba(68,195,198,0.12)' : 'rgba(245,158,11,0.12)', color: isActive ? 'var(--emerald-light)' : '#F59E0B' }}>
                            {isActive ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
                          </span>
                          {/* <button onClick={() => confirmDelete(t('حذف هذا البرنامج؟', 'Delete this program?'), () => { deleteProgram(prog.id); setDeleteConfirm(null) })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--destructive)' }}><Trash2 size={12} /></button> */}
                        </div>
                        <span className="text-2xl flex-shrink-0">{prog.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm">{prog.nameAr}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{prog.descAr}</p>
                          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                            <input type="checkbox" checked={isActive} onChange={e => run(() => updateProgram({ ...prog, active: e.target.checked }))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                            <span>{t('نشط/غير نشط', 'Active / Inactive')}</span>
                          </label>
                        </div>
                      </div>
                    )
                  })}
                  {programs.length === 0 && <div className="sm:col-span-2 text-center py-10 text-muted-foreground text-sm">{t('لا توجد برامج بعد', 'No programs yet')}</div>}
                </div>
              </>
            )}

            {/* Features */}
            {contentSub === 'features' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">{features.length} {t('ميزة', 'features')}</p>
                  <button onClick={() => setFeatModal({ open: true, data: null })} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Plus size={14} />{t('إضافة', 'Add')}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map(feat => (
                    <div key={feat.id} className="card-glow p-4 rounded-2xl flex gap-3 group relative" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      <div className="absolute top-3 end-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setFeatModal({ open: true, data: feat })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,91,6,0.12)', color: 'var(--primary)' }}><Pencil size={12} /></button>
                        <button onClick={() => confirmDelete(t('حذف هذه الميزة؟', 'Delete this feature?'), () => { deleteFeature(feat.id); setDeleteConfirm(null) })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--destructive)' }}><Trash2 size={12} /></button>
                      </div>
                      <span className="text-2xl flex-shrink-0">{feat.icon}</span>
                      <div><p className="font-semibold text-sm">{feat.titleAr}</p><p className="text-xs text-muted-foreground line-clamp-2">{feat.descAr}</p></div>
                    </div>
                  ))}
                  {features.length === 0 && <div className="sm:col-span-2 text-center py-10 text-muted-foreground text-sm">{t('لا توجد مميزات بعد', 'No features yet')}</div>}
                </div>
              </>
            )}

            {/* Stats */}
            {/* {contentSub === 'stats' && ( */}
            {/* <>
              <p className="text-sm text-muted-foreground mb-4">{t('الإحصائيات التي تظهر في الهيرو', 'Stats displayed in the hero section')}</p>
              <div className="flex flex-col gap-3">
                {statsEdit.map((s, i) => (
                  <div key={s.id} className="card-glow p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 items-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <Field label={t('القيمة (عربي)', 'Value (AR)')}>
                      <input value={s.valueAr} onChange={e => setStatsEdit(prev => prev.map((x, j) => j === i ? { ...x, valueAr: e.target.value } : x))} className={inputCls()} />
                    </Field>
                    <Field label={t('القيمة (إنجليزي)', 'Value (EN)')}>
                      <input value={s.valueEn} onChange={e => setStatsEdit(prev => prev.map((x, j) => j === i ? { ...x, valueEn: e.target.value } : x))} className={inputCls()} dir="ltr" />
                    </Field>
                    <Field label={t('الوصف (عربي)', 'Label (AR)')}>
                      <input value={s.labelAr} onChange={e => setStatsEdit(prev => prev.map((x, j) => j === i ? { ...x, labelAr: e.target.value } : x))} className={inputCls()} />
                    </Field>
                    <Field label={t('الوصف (إنجليزي)', 'Label (EN)')}>
                      <input value={s.labelEn} onChange={e => setStatsEdit(prev => prev.map((x, j) => j === i ? { ...x, labelEn: e.target.value } : x))} className={inputCls()} dir="ltr" />
                    </Field>
                  </div>
                ))}
              </div>
              <button onClick={() => { setStats(statsEdit) }} className="btn-primary mt-4 px-6 py-2.5 flex items-center gap-2 text-sm">
                <Save size={15} />{t('حفظ الإحصائيات', 'Save Stats')}
              </button>
            </>
            )} */}
          </>
        )}

        {/* ── Settings ── */}
        {tab === 'settings' && (
          <div className="flex flex-col gap-8">
            {/* Hero settings */}
            <div className="card-glow p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-lg mb-5">{t('إعدادات الهيرو', 'Hero Settings')}</h2>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('العنوان الرئيسي (عربي)', 'Main Title (Arabic)')}>
                  <textarea value={heroEdit.titleAr} onChange={e => setHeroEdit(h => ({ ...h, titleAr: e.target.value }))} rows={2} className={inputCls()} />
                </Field>
                <Field label={t('العنوان الرئيسي (إنجليزي)', 'Main Title (English)')}>
                  <textarea value={heroEdit.titleEn} onChange={e => setHeroEdit(h => ({ ...h, titleEn: e.target.value }))} rows={2} className={inputCls()} dir="ltr" />
                </Field>
                <Field label={t('العنوان الفرعي (عربي)', 'Subtitle (Arabic)')}>
                  <input value={heroEdit.subtitleAr} onChange={e => setHeroEdit(h => ({ ...h, subtitleAr: e.target.value }))} className={inputCls()} />
                </Field>
                <Field label={t('العنوان الفرعي (إنجليزي)', 'Subtitle (English)')}>
                  <input value={heroEdit.subtitleEn} onChange={e => setHeroEdit(h => ({ ...h, subtitleEn: e.target.value }))} className={inputCls()} dir="ltr" />
                </Field>
                <Field label={t('سطر CTA (عربي)', 'CTA Line (Arabic)')}>
                  <input value={heroEdit.taglineAr} onChange={e => setHeroEdit(h => ({ ...h, taglineAr: e.target.value }))} className={inputCls()} />
                </Field>
                <Field label={t('سطر CTA (إنجليزي)', 'CTA Line (English)')}>
                  <input value={heroEdit.taglineEn} onChange={e => setHeroEdit(h => ({ ...h, taglineEn: e.target.value }))} className={inputCls()} dir="ltr" />
                </Field>
              </div> */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* <Field label={t('خصم الإحالة (ريال)', 'Referral Discount (SAR)')}>
                  <input type="number" min={0} value={heroEdit.referralDiscount} onChange={e => setHeroEdit(h => ({ ...h, referralDiscount: +e.target.value }))} className={inputCls()} />
                </Field> */}
                <Field label={t('رقم إنستاباي', 'InstaPay Number')}>
                  <input value={heroEdit.instapayNumber} onChange={e => setHeroEdit(h => ({ ...h, instapayNumber: e.target.value }))} className={inputCls()} dir="ltr" />
                </Field>
                <Field label={t('اسم مستفيد إنستاباي', 'InstaPay Beneficiary Name')}>
                  <input value={heroEdit.instapayName} onChange={e => setHeroEdit(h => ({ ...h, instapayName: e.target.value }))} className={inputCls()} />
                </Field>
                <Field label={t('رقم التواصل', 'Contact Phone')}>
                  <input value={heroEdit.contactPhone} onChange={e => setHeroEdit(h => ({ ...h, contactPhone: e.target.value }))} className={inputCls()} dir="ltr" />
                </Field>
                <Field label={t('البريد الإلكتروني', 'Contact Email')}>
                  <input value={heroEdit.contactEmail} onChange={e => setHeroEdit(h => ({ ...h, contactEmail: e.target.value }))} className={inputCls()} dir="ltr" />
                </Field>
              </div>
              <button onClick={() => { updateHero(heroEdit); setHeroSaved(true); setTimeout(() => setHeroSaved(false), 2000) }} className="btn-primary mt-5 px-6 py-2.5 flex items-center gap-2 text-sm">
                {heroSaved ? <><Check size={15} />{t('تم الحفظ!', 'Saved!')}</> : <><Save size={15} />{t('حفظ إعدادات الهيرو', 'Save Hero Settings')}</>}
              </button>
            </div>

            {/* Family Discounts */}
            {/* <div className="card-glow p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-lg mb-5">{t('خصومات العائلة', 'Family Discounts')}</h2>
              <div className="flex flex-col gap-3">
                {fdEdit.map((fd, i) => (
                  <div key={fd.order} className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                    <Field label={t('الترتيب', 'Order')}>
                      <input type="number" value={fd.order} readOnly className={inputCls('opacity-50')} />
                    </Field>
                    <Field label={t('الأيقونة', 'Icon')}>
                      <input value={fd.icon} onChange={e => setFdEdit(prev => prev.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))} className={inputCls()} />
                    </Field>
                    <Field label={t('الاسم (عربي)', 'Label (AR)')}>
                      <input value={fd.labelAr} onChange={e => setFdEdit(prev => prev.map((x, j) => j === i ? { ...x, labelAr: e.target.value } : x))} className={inputCls()} />
                    </Field>
                    <Field label={t('نسبة الخصم %', 'Discount %')}>
                      <input type="number" min={0} max={100} value={fd.discount} onChange={e => setFdEdit(prev => prev.map((x, j) => j === i ? { ...x, discount: +e.target.value } : x))} className={inputCls()} />
                    </Field>
                  </div>
                ))}
              </div>
              <button onClick={() => setFamilyDiscounts(fdEdit)} className="btn-primary mt-4 px-6 py-2.5 flex items-center gap-2 text-sm">
                <Save size={15} />{t('حفظ خصومات العائلة', 'Save Family Discounts')}
              </button>
            </div> */}

            {/* Reset to defaults */}
            {/* <div className="card-glow p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h2 className="font-bold text-base mb-1 text-destructive">{t('منطقة الخطر', 'Danger Zone')}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t('إعادة ضبط جميع محتوى الموقع للقيم الافتراضية', 'Reset all site content to default values')}</p>
              <button
                onClick={() => confirmDelete(t('سيتم فقدان جميع التعديلات. هل أنت متأكد؟', 'All changes will be lost. Are you sure?'), () => {
                  localStorage.removeItem('siraj_content')
                  window.location.reload()
                })}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--destructive)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <AlertTriangle size={14} />{t('إعادة الضبط', 'Reset to Defaults')}
              </button>
            </div> */}
          </div>
        )}
      </div>

      {/* Modals */}
      {isAdmin && pkgModal.open && (
        <PackageModal initial={pkgModal.data} lang={language}
          onSave={pkg => { run(() => (pkgModal.data?.id ? updatePackage(pkg) : addPackage(pkg))); setPkgModal({ open: false, data: null }) }}
          onClose={() => setPkgModal({ open: false, data: null })}
        />
      )}
      {/* {testModal.open && (
        <TestimonialModal initial={testModal.data} lang={language}
          onSave={item => { testModal.data?.id ? updateTestimonial(item) : addTestimonial(item); setTestModal({ open: false, data: null }) }}
          onClose={() => setTestModal({ open: false, data: null })}
        />
      )} */}
      {progModal.open && (
        <BilingualItemModal<Program> title={t(progModal.data?.id ? 'تعديل البرنامج' : 'إضافة برنامج', progModal.data?.id ? 'Edit Program' : 'Add Program')} initial={progModal.data} lang={language}
          onSave={item => { run(() => (progModal.data?.id ? updateProgram(item) : addProgram(item))); setProgModal({ open: false, data: null }) }}
          onClose={() => setProgModal({ open: false, data: null })}
        />
      )}
      {featModal.open && (
        <BilingualItemModal<Feature> title={t(featModal.data?.id ? 'تعديل الميزة' : 'إضافة ميزة', featModal.data?.id ? 'Edit Feature' : 'Add Feature')} initial={featModal.data ? { ...featModal.data, nameAr: featModal.data.titleAr || featModal.data.nameAr, nameEn: featModal.data.titleEn || featModal.data.nameEn } : null} lang={language}
          onSave={item => { const feat: Feature = { ...item, titleAr: item.nameAr, titleEn: item.nameEn }; featModal.data?.id ? updateFeature(feat) : addFeature(feat); setFeatModal({ open: false, data: null }) }}
          onClose={() => setFeatModal({ open: false, data: null })}
        />
      )}
      {teacherModal.open && (
        <TeacherModal initial={teacherModal.data} lang={language}
          onSave={teacher => { run(() => (teacherModal.data?.id ? updateTeacher(teacher) : addTeacher(teacher))); setTeacherModal({ open: false, data: null }) }}
          onClose={() => setTeacherModal({ open: false, data: null })}
        />
      )}
      {deleteConfirm?.open && (
        <ConfirmDelete message={deleteConfirm.message} onConfirm={deleteConfirm.onConfirm} onCancel={() => setDeleteConfirm(null)} lang={language} />
      )}
    </div>
  )
}
