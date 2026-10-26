// src/api.ts
// ── طبقة الاتصال بالـ Backend (Siraaj API) ───────────────────────────────────
// Swagger: http://siraaj.runasp.net/swagger/index.html

import type { FamilyDiscount, Feature, Package, Program, Teacher, User, UserRole } from './types'

/**
 * في وضع التطوير نستخدم البروكسي المعرّف في vite.config.ts ('/api')
 * وفي الإنتاج نستخدم رابط الـ backend المباشر.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  '/api/public/backend'

const TOKEN_KEY = 'siraj_token'
const REFRESH_KEY = 'siraj_refresh_token'

export const tokenStore = {
  get: () => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  getRefresh: () => {
    try { return localStorage.getItem(REFRESH_KEY) } catch { return null }
  },
  set: (token: string, refreshToken?: string | null) => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
      if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
    } catch { /* ignore */ }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)
    } catch { /* ignore */ }
  },
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  message?: string
  statusCode?: number
  errors?: Record<string, string[]>
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = 'GET', body, auth = true } = options

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = auth ? tokenStore.get() : null
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('تعذّر الاتصال بالخادم، تحقق من الإنترنت', 0)
  }

  const text = await res.text()
  let payload: ApiEnvelope<T> | null = null
  if (text) {
    try { payload = JSON.parse(text) as ApiEnvelope<T> } catch { /* not json */ }
  }

  if (!res.ok || (payload && payload.success === false)) {
    if (res.status === 401) tokenStore.clear()
    throw new ApiError(
      payload?.message || `فشل الطلب (${res.status})`,
      res.status,
      payload?.errors,
    )
  }

  // الـ backend يغلّف الاستجابة داخل { success, data }
  return (payload && 'data' in payload ? (payload.data as T) : (payload as unknown as T))
}

// ── أنواع استجابات الـ backend ────────────────────────────────────────────────

export interface ApiUser {
  id: string
  nameAr: string
  nameEn: string
  phone: string
  role: string
  referralCode: string
  packageId?: string | null
  teacherId?: string | null
  schedule?: string | string[] | null
  joinDate?: string | null
}

export interface AuthResponse {
  user: ApiUser
  token: string
  refreshToken: string
  discountApplied?: number | null
}

export interface ApiPackage {
  id: string
  nameAr: string
  nameEn: string
  price: number
  originalPrice: number | null
  sessions: number
  sessionsPerWeek: number
  color: string
  isHighlighted: boolean
  badgeAr: string | null
  badgeEn: string | null
  featuresAr: string[]
  featuresEn: string[]
  isActive?: boolean
}

export interface ApiProgram {
  id: string
  icon: string
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  isActive: boolean
}

export interface ApiFamilyDiscount {
  order: number
  discountPercentage: number
  labelAr: string
  labelEn: string
  icon: string | null
}

export interface ApiFeature {
  id: string
  icon: string | null
  nameAr: string
  nameEn: string
  titleAr?: string | null
  titleEn?: string | null
  descAr: string
  descEn: string
}

export interface ApiStudent {
  id: string
  nameAr: string
  nameEn: string
  phone: string
  role?: string
  referralCode?: string
  packageId?: string | null
  packageName?: string | null
  packageNameAr?: string | null
  teacherId?: string | null
  teacherName?: string | null
  teacherNameAr?: string | null
  status?: string | null
  schedule?: string | string[] | null
  joinDate?: string | null
}

/** شكل الطالب المستخدَم في لوحة الإدارة */
export interface AdminStudent {
  id: string
  nameAr: string
  nameEn: string
  phone: string
  referralCode: string
  packageId?: string
  packageName?: string
  teacherId?: string
  teacherName?: string
  status: string
  joinDate?: string
}

export function mapStudent(s: ApiStudent): AdminStudent {
  return {
    id: s.id,
    nameAr: s.nameAr,
    nameEn: s.nameEn || s.nameAr,
    phone: s.phone,
    referralCode: s.referralCode || '',
    packageId: s.packageId || undefined,
    packageName: s.packageNameAr || s.packageName || undefined,
    teacherId: s.teacherId || undefined,
    teacherName: s.teacherNameAr || s.teacherName || undefined,
    status: (s.status || 'active').toLowerCase(),
    joinDate: (s.joinDate || '').split('T')[0] || undefined,
  }
}


export interface ApiTeacher {
  id: string
  nameAr: string
  nameEn: string
  phone: string
  specialization: string
  studentIds?: string[] | null
  joinDate?: string | null
}

// ── محوّلات بين شكل الـ API وشكل الواجهة ─────────────────────────────────────

function parseSchedule(schedule: ApiUser['schedule']): string[] {
  if (Array.isArray(schedule)) return schedule
  if (typeof schedule === 'string' && schedule.trim()) {
    try {
      const parsed = JSON.parse(schedule)
      return Array.isArray(parsed) ? parsed : []
    } catch { return [] }
  }
  return []
}

export function mapUser(u: ApiUser): User {
  return {
    id: u.id,
    nameAr: u.nameAr,
    nameEn: u.nameEn || u.nameAr,
    phone: u.phone,
    password: '',
    role: (u.role?.toLowerCase() as UserRole) || 'student',
    referralCode: u.referralCode,
    packageId: u.packageId || undefined,
    teacherId: u.teacherId || undefined,
    schedule: parseSchedule(u.schedule),
    joinDate: u.joinDate || undefined,
  }
}

// ── سعر الباقة بالدولار (يُحفظ محلياً لعدم وجوده في الـ backend) ─────────────
const USD_PRICES_KEY = 'siraj_package_usd_prices'

export function loadUsdPrices(): Record<string, number> {
  try {
    const raw = localStorage.getItem(USD_PRICES_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch { return {} }
}

export function saveUsdPrice(id: string, usd?: number) {
  try {
    const all = loadUsdPrices()
    if (usd == null || Number.isNaN(usd)) delete all[id]
    else all[id] = usd
    localStorage.setItem(USD_PRICES_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

export function mapPackage(p: ApiPackage): Package {

  return {
    id: p.id,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    price: p.price,
    priceUsd: loadUsdPrices()[p.id],

    originalPrice: p.originalPrice ?? undefined,
    sessions: p.sessions,
    sessionsPerWeek: p.sessionsPerWeek,
    featuresAr: p.featuresAr ?? [],
    featuresEn: p.featuresEn ?? [],
    badge: p.badgeAr || p.badgeEn ? { ar: p.badgeAr || '', en: p.badgeEn || '' } : undefined,
    color: p.color || '#44C3C6',
    highlight: p.isHighlighted,
    active: p.isActive ?? true,
  }
}

export function toPackageRequest(p: Package) {
  return {
    nameAr: p.nameAr,
    nameEn: p.nameEn || p.nameAr,
    price: Math.round(p.price),
    priceUsd: p.priceUsd ?? 0,

    originalPrice: p.originalPrice ? Math.round(p.originalPrice) : 0,
    sessions: p.sessions,
    sessionsPerWeek: p.sessionsPerWeek,
    color: p.color,
    isHighlighted: !!p.highlight,
    badgeAr: p.badge?.ar || '',
    badgeEn: p.badge?.en || '',
    featuresAr: p.featuresAr,
    featuresEn: p.featuresEn,
    isActive: p.active !== false,
  }
}

export function mapProgram(p: ApiProgram): Program {
  return {
    id: p.id,
    icon: p.icon || '📖',
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    descAr: p.descAr,
    descEn: p.descEn,
    active: p.isActive,
  }
}

export function toProgramRequest(p: Program) {
  return {
    icon: p.icon,
    nameAr: p.nameAr,
    nameEn: p.nameEn || p.nameAr,
    descAr: p.descAr,
    descEn: p.descEn,
    isActive: p.active !== false,
  }
}

export function mapFamilyDiscount(d: ApiFamilyDiscount): FamilyDiscount {
  return {
    order: d.order,
    discount: d.discountPercentage ?? 0,
    labelAr: d.labelAr,
    labelEn: d.labelEn || d.labelAr,
    icon: d.icon || '👤',
  }
}

export function mapFeature(f: ApiFeature): Feature {
  return {
    id: f.id,
    icon: f.icon || '✨',
    nameAr: f.nameAr,
    nameEn: f.nameEn || f.nameAr,
    titleAr: f.titleAr || f.nameAr,
    titleEn: f.titleEn || f.nameEn || f.nameAr,
    descAr: f.descAr,
    descEn: f.descEn || f.descAr,
  }
}

export function mapTeacher(t: ApiTeacher): Teacher {
  return {
    id: t.id,
    nameAr: t.nameAr,
    nameEn: t.nameEn || t.nameAr,
    phone: t.phone,
    password: '',
    specialization: t.specialization || '',
    studentIds: t.studentIds ?? [],
    joinDate: t.joinDate || new Date().toISOString().split('T')[0],
  }
}

// ── نقاط النهاية ──────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: (phone: string, password: string) =>
      request<AuthResponse>('/auth/login', { method: 'POST', auth: false, body: { phone, password } }),

    register: (body: {
      nameAr: string
      nameEn: string
      phone: string
      password: string
      confirmPassword: string
      role: string
      guardianPhone?: string
      referralCode?: string
    }) => request<AuthResponse>('/auth/register', { method: 'POST', auth: false, body }),

    refresh: (refreshToken: string) =>
      request<AuthResponse>('/auth/refresh-token', { method: 'POST', auth: false, body: { refreshToken } }),
  },

  packages: {
    list: () => request<ApiPackage[]>('/packages', { auth: false }),
    get: (id: string) => request<ApiPackage>(`/packages/${id}`, { auth: false }),
    create: (body: ReturnType<typeof toPackageRequest>) =>
      request<ApiPackage>('/packages', { method: 'POST', body }),
    update: (id: string, body: ReturnType<typeof toPackageRequest>) =>
      request<ApiPackage>(`/packages/${id}`, { method: 'PUT', body }),
    remove: (id: string) => request<unknown>(`/packages/${id}`, { method: 'DELETE' }),
  },

  programs: {
    list: () => request<ApiProgram[]>('/programs', { auth: false }),
    create: (body: ReturnType<typeof toProgramRequest>) =>
      request<ApiProgram>('/programs', { method: 'POST', body }),
    update: (id: string, body: ReturnType<typeof toProgramRequest>) =>
      request<ApiProgram>(`/programs/${id}`, { method: 'PUT', body }),
    remove: (id: string) => request<unknown>(`/programs/${id}`, { method: 'DELETE' }),
  },

  teachers: {
    list: () => request<ApiTeacher[]>('/admin/teachers'),
    create: (body: { nameAr: string; nameEn: string; phone: string; password: string; specialization: string }) =>
      request<ApiTeacher>('/admin/teachers', { method: 'POST', body }),
    update: (id: string, body: { nameAr: string; nameEn: string; phone: string; specialization: string }) =>
      request<ApiTeacher>(`/admin/teachers/${id}`, { method: 'PUT', body }),
    remove: (id: string) => request<unknown>(`/admin/teachers/${id}`, { method: 'DELETE' }),
  },

  familyDiscounts: {
    list: () => request<ApiFamilyDiscount[]>('/family-discounts', { auth: false }),
  },

  features: {
    list: () => request<ApiFeature[]>('/features', { auth: false }),
  },

  students: {
    list: () => request<ApiStudent[]>('/admin/students'),
    me: () => request<ApiUser>('/students/me'),
    update: (id: string, body: { teacherId?: string | null; status?: string; nameAr?: string; nameEn?: string; phone?: string }) =>
      request<ApiStudent>(`/admin/students/${id}`, { method: 'PUT', body }),
  },

  discounts: {
    validate: (code: string) =>
      request<{ valid: boolean; discountAmount: number; message?: string }>('/discounts/validate', {
        method: 'POST',
        auth: false,
        body: { code },
      }),
  },

  studentPrograms: {
    create: (body: { studentId: string; programId: string; packageId: string }) =>
      request<{ id: string }>('/student-programs', { method: 'POST', body }),
  },

  payments: {
    initiate: (body: {
      studentId: string
      studentProgramId: string
      paymentMethod: string
      paymentMethodId?: string
      amount: number
      cardNumber?: string
      cardExpiry?: string
      cardCvv?: string
      cardHolderName?: string
    }) => request<{ paymentId?: string; redirectUrl?: string; status?: string }>('/payments/initiate', {
      method: 'POST',
      body,
    }),
    history: (studentId: string) => request<unknown[]>(`/payments/history/${studentId}`),
    invoices: (studentId: string) => request<unknown[]>(`/payments/invoices/${studentId}`),
    subscriptions: (studentId: string) => request<unknown[]>(`/payments/subscriptions/${studentId}`),
  },
}
