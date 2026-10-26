export type Language = 'ar' | 'en'
export type UserRole = 'student' | 'guardian' | 'teacher' | 'admin'
export type PaymentMethod = 'card' | 'instapay' | 'paymob'

export interface Package {
  id: string
  nameAr: string
  nameEn: string
  price: number
  originalPrice?: number
  sessions: number
  sessionsPerWeek: number
  featuresAr: string[]
  featuresEn: string[]
  badge?: { ar: string; en: string }
  color: string
  highlight?: boolean
  active?: boolean
}

export interface FamilyDiscount {
  order: number
  discount: number
  labelAr: string
  labelEn: string
  icon: string
}

export interface Testimonial {
  id: string
  nameAr: string
  nameEn: string
  textAr: string
  textEn: string
  rating: number
  country: string
}

export interface Program {
  id: string
  icon: string
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  active?: boolean
}

export interface Feature {
  id: string
  icon: string
  nameAr: string
  nameEn: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
}

export interface Stat {
  id: string
  valueAr: string
  valueEn: string
  labelAr: string
  labelEn: string
}

export interface HeroSettings {
  titleAr: string | null
  titleEn: string | null
  subtitleAr: string | null
  subtitleEn: string | null
  taglineAr: string | null
  taglineEn: string | null

  instapayNumber: string
  instapayName: string
  contactPhone: string
  contactEmail: string
  referralDiscount: number | null
}

export interface SiteContent {
  packages: Package[]
  familyDiscounts: FamilyDiscount[]
  testimonials: Testimonial[]
  programs: Program[]
  features: Feature[]
  stats: Stat[]
  hero: HeroSettings
}

export interface User {
  id: string
  nameAr: string
  nameEn: string
  phone: string
  password: string
  role: UserRole
  referralCode: string
  packageId?: string
  schedule?: string[]
  childrenIds?: string[]
  teacherId?: string
  joinDate?: string
}

export interface Child {
  id: string
  nameAr: string
  nameEn: string
  age: number
  level: string
  guardianId: string
  packageId: string
  schedule: string[]
  teacherId?: string
}

export interface Teacher {
  id: string
  nameAr: string
  nameEn: string
  phone: string
  password: string
  specialization: string
  studentIds: string[]
  joinDate: string
}

export interface SubscriptionState {
  packageId: string
  schedule: string[]
  discountCode: string
  discountAmount: number
  finalPrice: number
  childData?: Omit<Child, 'id' | 'guardianId'>
}
