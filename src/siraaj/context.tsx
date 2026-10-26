import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Language, User, SubscriptionState, SiteContent, Package, Testimonial, Program, Feature, Stat, FamilyDiscount, HeroSettings, Teacher } from './types'
import { DEFAULT_SITE_CONTENT } from './data'
import {
  api, ApiError, tokenStore,
  mapUser, mapPackage, mapProgram, mapTeacher, mapFamilyDiscount, mapFeature, mapStudent,
  toPackageRequest, toProgramRequest, saveUsdPrice,
  type AdminStudent,
} from './api'

const HIDDEN_PROGRAM_NAMES = new Set<string>([
  'تفسير القرآن',
  'تفسير القران',
  'تعليم القراءة النورانية',
  'تعليم القراءه النورانيه',
])
const isVisibleProgram = (p: Program) => !HIDDEN_PROGRAM_NAMES.has(p.nameAr)


interface AppContextType {
  // Auth (متصلة بالـ backend)
  currentUser: User | null
  login: (phone: string, password: string) => Promise<{ user: User | null; error: string | null }>
  registerUser: (data: {
    nameAr: string
    nameEn?: string
    phone: string
    password: string
    confirmPassword?: string
    role: string
    guardianPhone?: string
    referralCode?: string
  }) => Promise<{ user: User | null; error: string | null }>
  logout: () => void
  authError: string | null

  // Language
  language: Language
  setLanguage: (lang: Language) => void
  t: (ar: string, en: string) => string
  dir: 'rtl' | 'ltr'

  // Subscription flow
  selectedPackageId: string | null
  setSelectedPackageId: (id: string | null) => void
  subscriptionState: SubscriptionState | null
  setSubscriptionState: (state: SubscriptionState | null) => void

  // Site content
  siteContent: SiteContent
  contentLoading: boolean
  refreshContent: () => Promise<void>
  updateHero: (hero: HeroSettings) => void
  setPackages: (packages: Package[]) => void
  addPackage: (pkg: Package) => Promise<void>
  updatePackage: (pkg: Package) => Promise<void>
  deletePackage: (id: string) => Promise<void>
  setFamilyDiscounts: (discounts: FamilyDiscount[]) => void
  setTestimonials: (testimonials: Testimonial[]) => void
  addTestimonial: (t: Testimonial) => void
  updateTestimonial: (t: Testimonial) => void
  deleteTestimonial: (id: string) => void
  setPrograms: (programs: Program[]) => void
  addProgram: (p: Program) => Promise<void>
  updateProgram: (p: Program) => Promise<void>
  deleteProgram: (id: string) => Promise<void>
  setFeatures: (features: Feature[]) => void
  addFeature: (f: Feature) => void
  updateFeature: (f: Feature) => void
  deleteFeature: (id: string) => void
  setStats: (stats: Stat[]) => void

  // Teachers (من الـ backend، تتطلب صلاحية admin)
  teachers: Teacher[]
  addTeacher: (teacher: Teacher) => Promise<void>
  updateTeacher: (teacher: Teacher) => Promise<void>
  deleteTeacher: (id: string) => Promise<void>
  teacherStudentCount: (teacherId: string) => number

  // Students (من الـ backend، تتطلب صلاحية admin)
  students: AdminStudent[]
  studentsLoading: boolean
  refreshStudents: () => Promise<void>
  assignStudentTeacher: (studentId: string, teacherId: string | null) => Promise<void>

  // Discounts / Payments
  validateDiscount: (code: string) => Promise<{ valid: boolean; discountAmount: number; message?: string }>
  payForSubscription: (input: {
    packageId: string
    amount: number
    paymentMethod: string
    card?: { number: string; expiry: string; cvv: string; name: string }
  }) => Promise<void>
}


const AppContext = createContext<AppContextType | null>(null)

// مفتاح تخزين الباقات غير النشطة (السيرفر لا يرجعها في القائمة العامة)
const INACTIVE_PACKAGES_KEY = 'siraj_inactive_packages'

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [language, setLanguageState] = useState<Language>('ar')
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState | null>(null)
  // المحتوى الثابت (آراء/مميزات/إحصائيات/الهيرو) يبقى محلياً لعدم وجود endpoints له،
  // بينما الباقات والبرامج تُحمَّل من الـ backend.
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT)
  const [contentLoading, setContentLoading] = useState(true)
  const [teachers, setTeachersState] = useState<Teacher[]>([])
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)


  // القراءة من التخزين المحلي بعد التحميل فقط (حتى لا يختلف SSR عن المتصفح)
  useEffect(() => {
    setCurrentUser(loadFromStorage<User | null>('siraj_user', null))
    setLanguageState(loadFromStorage<Language>('siraj_lang', 'ar'))
    setSiteContent(loadFromStorage<SiteContent>('siraj_content', DEFAULT_SITE_CONTENT))
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) saveToStorage('siraj_lang', language) }, [hydrated, language])
  useEffect(() => { if (hydrated) saveToStorage('siraj_user', currentUser) }, [hydrated, currentUser])
  useEffect(() => { if (hydrated) saveToStorage('siraj_content', siteContent) }, [hydrated, siteContent])

  // ── توحيد محتوى الباقات: نفس مميزات الباقة الأساسية، والفرق في السعر وعدد الحصص فقط ──
  const unifyPackageFeatures = (list: Package[]): Package[] => {
    const base = list.find(p => /basic|أساس/i.test(`${p.nameEn} ${p.nameAr}`)) ?? list[0]
    if (!base) return list
    return list.map(p => ({ ...p, featuresAr: base.featuresAr, featuresEn: base.featuresEn }))
  }

  // ── تحميل المحتوى من الـ backend ───────────────────────────────────────────
  const refreshContent = useCallback(async () => {
    setContentLoading(true)
    try {
      const [pkgs, progs, fams, feats] = await Promise.all([
        api.packages.list().catch(() => null),
        api.programs.list().catch(() => null),
        api.familyDiscounts.list().catch(() => null),
        api.features.list().catch(() => null),
      ])
      // الباقات غير النشطة لا يرجعها السيرفر، لذلك نحتفظ بنسخة منها محلياً لتظل ظاهرة في لوحة الإدارة
      const inactive = loadFromStorage<Package[]>(INACTIVE_PACKAGES_KEY, [])
      const merged = pkgs && pkgs.length
        ? [...unifyPackageFeatures(pkgs.map(mapPackage)), ...inactive.filter(ip => !pkgs.some(p => p.id === ip.id)).map(p => ({ ...p, active: false }))]
        : null
      setSiteContent(c => ({
        ...c,
        packages: merged ?? c.packages,
        programs: progs && progs.length ? progs.map(mapProgram).filter(isVisibleProgram) : c.programs,
        familyDiscounts: fams && fams.length ? fams.map(mapFamilyDiscount) : c.familyDiscounts,
        features: feats && feats.length ? feats.map(mapFeature) : c.features,
      }))
    } finally {
      setContentLoading(false)
    }
  }, [])

  const refreshTeachers = useCallback(async () => {
    if (!tokenStore.get()) return
    try {
      const list = await api.teachers.list()
      setTeachersState(Array.isArray(list) ? list.map(mapTeacher) : [])
    } catch {
      setTeachersState([])
    }
  }, [])

  const refreshStudents = useCallback(async () => {
    if (!tokenStore.get()) return
    setStudentsLoading(true)
    try {
      const list = await api.students.list()
      setStudents(Array.isArray(list) ? list.map(mapStudent) : [])
    } catch {
      setStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }, [])

  // إسناد معلم لطالب — يُحدَّث فوراً محلياً ثم يُعاد التحميل من الخادم
  const assignStudentTeacher = useCallback(async (studentId: string, teacherId: string | null) => {
    await api.students.update(studentId, { teacherId })
    setStudents(prev => prev.map(s => (s.id === studentId ? { ...s, teacherId: teacherId || undefined } : s)))
    void refreshStudents()
  }, [refreshStudents])


  useEffect(() => { void refreshContent() }, [refreshContent])
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      void refreshTeachers()
      void refreshStudents()
    }
  }, [currentUser, refreshTeachers, refreshStudents])

  const setLanguage = (lang: Language) => setLanguageState(lang)

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login: AppContextType['login'] = async (phone, password) => {
    setAuthError(null)
    try {
      const res = await api.auth.login(phone.trim(), password)
      tokenStore.set(res.token, res.refreshToken)
      const user = mapUser(res.user)
      setCurrentUser(user)
      return { user, error: null }
    } catch (err) {
      const error = err instanceof ApiError ? err.message : 'حدث خطأ غير متوقع'
      setAuthError(error)
      return { user: null, error }
    }
  }

  const registerUser: AppContextType['registerUser'] = async (data) => {
    setAuthError(null)
    try {
      const res = await api.auth.register({
        nameAr: data.nameAr,
        nameEn: data.nameEn || data.nameAr,
        phone: data.phone.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword ?? data.password,
        role: data.role,
        guardianPhone: data.guardianPhone || undefined,
        referralCode: data.referralCode || undefined,
      })
      tokenStore.set(res.token, res.refreshToken)
      const user = mapUser(res.user)
      setCurrentUser(user)
      return { user, error: null }
    } catch (err) {
      const error = err instanceof ApiError ? err.message : 'حدث خطأ غير متوقع'
      setAuthError(error)
      return { user: null, error }
    }
  }

  const logout = () => {
    tokenStore.clear()
    setCurrentUser(null)
    setSelectedPackageId(null)
    setSubscriptionState(null)
  }

  // ── الباقات (backend) ──────────────────────────────────────────────────────
  const setPackages = (packages: Package[]) => setSiteContent(c => ({ ...c, packages }))

  const addPackage = async (pkg: Package) => {
    const created = await api.packages.create(toPackageRequest(pkg))
    saveUsdPrice(created.id, pkg.priceUsd)
    setSiteContent(c => ({ ...c, packages: [...c.packages, { ...mapPackage(created), priceUsd: pkg.priceUsd }] }))
  }


  const rememberInactive = (pkg: Package | null, removeId?: string) => {
    const list = loadFromStorage<Package[]>(INACTIVE_PACKAGES_KEY, [])
    const next = list.filter(p => p.id !== (removeId ?? pkg?.id))
    if (pkg) next.push({ ...pkg, active: false })
    saveToStorage(INACTIVE_PACKAGES_KEY, next)
  }

  const updatePackage = async (pkg: Package) => {
    saveUsdPrice(pkg.id, pkg.priceUsd)
    const updated = await api.packages.update(pkg.id, toPackageRequest(pkg))
    const mapped = updated ? { ...mapPackage(updated), active: pkg.active !== false, priceUsd: pkg.priceUsd } : pkg

    // نحفظ نسخة محلية من الباقات غير النشطة حتى تظل ظاهرة في لوحة الإدارة فقط
    rememberInactive(pkg.active === false ? mapped : null, pkg.id)
    setSiteContent(c => ({ ...c, packages: c.packages.map(p => (p.id === pkg.id ? mapped : p)) }))
  }

  // حذف نهائي من كل مكان
  const deletePackage = async (id: string) => {
    await api.packages.remove(id)
    rememberInactive(null, id)
    setSiteContent(c => ({ ...c, packages: c.packages.filter(p => p.id !== id) }))
  }

  // ── البرامج (backend) ──────────────────────────────────────────────────────
  const setPrograms = (programs: Program[]) => setSiteContent(c => ({ ...c, programs }))

  const addProgram = async (item: Program) => {
    const created = await api.programs.create(toProgramRequest(item))
    setSiteContent(c => ({ ...c, programs: [...c.programs, mapProgram(created)] }))
  }

  const updateProgram = async (item: Program) => {
    const updated = await api.programs.update(item.id, toProgramRequest(item))
    const mapped = updated ? mapProgram(updated) : item
    setSiteContent(c => ({ ...c, programs: c.programs.map(p => (p.id === item.id ? mapped : p)) }))
  }

  const deleteProgram = async (id: string) => {
    await api.programs.remove(id)
    setSiteContent(c => ({ ...c, programs: c.programs.filter(p => p.id !== id) }))
  }

  // ── المعلمون (backend / admin) ─────────────────────────────────────────────
  const addTeacher = async (teacher: Teacher) => {
    await api.teachers.create({
      nameAr: teacher.nameAr,
      nameEn: teacher.nameEn || teacher.nameAr,
      phone: teacher.phone,
      password: teacher.password,
      specialization: teacher.specialization,
    })
    await refreshTeachers()
  }

  const updateTeacher = async (teacher: Teacher) => {
    await api.teachers.update(teacher.id, {
      nameAr: teacher.nameAr,
      nameEn: teacher.nameEn || teacher.nameAr,
      phone: teacher.phone,
      specialization: teacher.specialization,
    })
    await refreshTeachers()
  }

  const deleteTeacher = async (id: string) => {
    await api.teachers.remove(id)
    setTeachersState(prev => prev.filter(t => t.id !== id))
    void refreshStudents()
  }

  // عدد طلاب المعلم يُحسب من قائمة الطلاب الفعلية (يبدأ من صفر للمعلم الجديد)
  const teacherStudentCount = (teacherId: string) =>
    students.filter(s => s.teacherId === teacherId).length


  // ── الخصومات والدفع (backend) ──────────────────────────────────────────────
  const validateDiscount = async (code: string) => {
    try {
      const res = await api.discounts.validate(code.trim())
      return res ?? { valid: false, discountAmount: 0 }
    } catch (err) {
      return { valid: false, discountAmount: 0, message: err instanceof ApiError ? err.message : undefined }
    }
  }

  const payForSubscription: AppContextType['payForSubscription'] = async ({ packageId, amount, paymentMethod, card }) => {
    if (!currentUser) throw new ApiError('يجب تسجيل الدخول أولاً', 401)

    // إنشاء اشتراك الطالب في برنامج (إن توفّر برنامج نشط)، ثم بدء الدفع
    const program = siteContent.programs.find(p => p.active !== false) || siteContent.programs[0]
    let studentProgramId = ''
    if (program) {
      const created = await api.studentPrograms.create({
        studentId: currentUser.id,
        programId: program.id,
        packageId,
      })
      studentProgramId = created?.id || ''
    }

    await api.payments.initiate({
      studentId: currentUser.id,
      studentProgramId,
      paymentMethod,
      amount,
      cardNumber: card?.number.replace(/\s/g, ''),
      cardExpiry: card?.expiry,
      cardCvv: card?.cvv,
      cardHolderName: card?.name,
    })
  }

  // ── محتوى محلي (لا توجد له endpoints بعد) ─────────────────────────────────
  const updateHero = (hero: HeroSettings) => setSiteContent(c => ({ ...c, hero }))
  const setFamilyDiscounts = (familyDiscounts: FamilyDiscount[]) => setSiteContent(c => ({ ...c, familyDiscounts }))

  const setTestimonials = (testimonials: Testimonial[]) => setSiteContent(c => ({ ...c, testimonials }))
  const addTestimonial = (item: Testimonial) => setSiteContent(c => ({ ...c, testimonials: [...c.testimonials, item] }))
  const updateTestimonial = (item: Testimonial) => setSiteContent(c => ({ ...c, testimonials: c.testimonials.map(x => x.id === item.id ? item : x) }))
  const deleteTestimonial = (id: string) => setSiteContent(c => ({ ...c, testimonials: c.testimonials.filter(x => x.id !== id) }))

  const setFeatures = (features: Feature[]) => setSiteContent(c => ({ ...c, features }))
  const addFeature = (item: Feature) => setSiteContent(c => ({ ...c, features: [...c.features, item] }))
  const updateFeature = (item: Feature) => setSiteContent(c => ({ ...c, features: c.features.map(x => x.id === item.id ? item : x) }))
  const deleteFeature = (id: string) => setSiteContent(c => ({ ...c, features: c.features.filter(x => x.id !== id) }))

  const setStats = (stats: Stat[]) => setSiteContent(c => ({ ...c, stats }))

  const t = (ar: string, en: string) => language === 'ar' ? ar : en
  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <AppContext.Provider value={{
      currentUser, login, registerUser, logout, authError,
      language, setLanguage, t, dir,
      selectedPackageId, setSelectedPackageId,
      subscriptionState, setSubscriptionState,
      siteContent, contentLoading, refreshContent,
      updateHero,
      setPackages, addPackage, updatePackage, deletePackage,
      setFamilyDiscounts,
      setTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      setPrograms, addProgram, updateProgram, deleteProgram,
      setFeatures, addFeature, updateFeature, deleteFeature,
      setStats,
      teachers, addTeacher, updateTeacher, deleteTeacher, teacherStudentCount,
      students, studentsLoading, refreshStudents, assignStudentTeacher,
      validateDiscount, payForSubscription,

    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
