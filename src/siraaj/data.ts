import type { Package, FamilyDiscount, Testimonial, Program, Feature, Stat, HeroSettings, SiteContent, User, Teacher, Child } from './types'

// ── Default site content (used as initial state) ──────────────────────────────

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'basic',
    nameAr: 'الأساسية',
    nameEn: 'Basic',
    price: 360,
    sessions: 8,
    sessionsPerWeek: 2,
    color: '#F45B06',
    featuresAr: [
      'معلم/معلمة متخصص/ة',
      'خطة تعليمية منظمة',
      'متابعة الحفظ والمراجعة',
      'واجبات وأنشطة تعليمية',
      'تقرير متابعة دوري لولي الأمر',
      'شهادة إتمام المستوى',
    ],
    featuresEn: [
      'Specialized teacher',
      'Organized educational plan',
      'Memorization & revision tracking',
      'Educational assignments & activities',
      'Periodic progress report for guardian',
      'Level completion certificate',
    ],
  },
  {
    id: 'premium',
    nameAr: 'المميزة',
    nameEn: 'Premium',
    price: 450,
    originalPrice: 540,
    sessions: 12,
    sessionsPerWeek: 3,
    color: '#44C3C6',
    highlight: true,
    badge: { ar: 'الأكثر طلباً', en: 'Most Popular' },
    featuresAr: [
      'معلم/معلمة متخصص/ة',
      'خطة تعليمية منظمة',
      'متابعة الحفظ والمراجعة',
      'واجبات وأنشطة تعليمية',
      'تقرير متابعة دوري لولي الأمر',
      'شهادة إتمام المستوى',
    ],
    featuresEn: [
      'Specialized teacher',
      'Organized educational plan',
      'Memorization & revision tracking',
      'Educational assignments & activities',
      'Periodic progress report for guardian',
      'Level completion certificate',
    ],
  },
  {
    id: 'vip',
    nameAr: 'VIP',
    nameEn: 'VIP',
    price: 750,
    originalPrice: 900,
    sessions: 20,
    sessionsPerWeek: 5,
    color: '#7C3AED',
    badge: { ar: 'الأفضل', en: 'Best Value' },
    featuresAr: [
      'معلم/معلمة متخصص/ة',
      'خطة تعليمية منظمة',
      'متابعة الحفظ والمراجعة',
      'واجبات وأنشطة تعليمية',
      'تقرير متابعة دوري لولي الأمر',
      'شهادة إتمام المستوى',
    ],
    featuresEn: [
      'Specialized teacher',
      'Organized educational plan',
      'Memorization & revision tracking',
      'Educational assignments & activities',
      'Periodic progress report for guardian',
      'Level completion certificate',
    ],
  },
]

export const DEFAULT_FAMILY_DISCOUNTS: FamilyDiscount[] = [
  { order: 1, discount: 0, labelAr: 'الطفل الأول', labelEn: '1st Child', icon: '👧' },
  { order: 2, discount: 10, labelAr: 'الطفل الثاني', labelEn: '2nd Child', icon: '👦' },
  { order: 3, discount: 15, labelAr: 'الطفل الثالث', labelEn: '3rd Child', icon: '👧' },
  { order: 4, discount: 20, labelAr: '٤ أطفال فأكثر', labelEn: '4+ Children', icon: '👨‍👩‍👧‍👦' },
]

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    nameAr: 'أم عبدالله الرشيدي',
    nameEn: 'Um Abdullah Al-Rashidi',
    textAr: 'أكاديمية سراج غيّرت حياة ابني! المعلم متخصص ومتابع، وابني حفظ جزءاً كاملاً في ثلاثة أشهر فقط.',
    textEn: "Siraj Academy changed my son's life! The teacher is specialized and attentive. My son memorized a full juz in just three months.",
    rating: 5,
    country: 'السعودية',
  },
  {
    id: 't2',
    nameAr: 'أبو يوسف المصري',
    nameEn: 'Abu Yusuf Al-Masri',
    textAr: 'التقارير الدورية التي تصلني عن تقدم أطفالي تجعلني مطمئناً تماماً. جودة التعليم لا تُضاهى.',
    textEn: "The periodic reports I receive about my children's progress give me complete peace of mind. The quality of education is unmatched.",
    rating: 5,
    country: 'مصر',
  },
  {
    id: 't3',
    nameAr: 'رانيا الكويتية',
    nameEn: 'Rania Al-Kuwaitia',
    textAr: 'ابنتي الآن تتلو القرآن بتجويد رائع، والمعلمة صابرة ومحترفة. أنصح كل أم بسراج.',
    textEn: 'My daughter now recites the Quran with beautiful tajweed. The teacher is patient and professional. I recommend Siraj to every mother.',
    rating: 5,
    country: 'الكويت',
  },
]

export const DEFAULT_PROGRAMS: Program[] = [
  { id: 'p2', icon: '🌙', nameAr: 'حفظ القرآن الكريم', nameEn: 'Quran Memorization', descAr: 'بمنهج متسلسل ومنظم', descEn: 'With a structured curriculum', active: true },
  { id: 'p3', icon: '✨', nameAr: 'أحكام التجويد', nameEn: 'Tajweed Rules', descAr: 'بتطبيق عملي مستمر', descEn: 'With continuous practical application', active: true },
]

export const DEFAULT_FEATURES: Feature[] = [
  { id: 'f1', icon: '🎓', nameAr: 'معلمون متخصصون', nameEn: 'Expert Teachers', titleAr: 'معلمون متخصصون', titleEn: 'Expert Teachers', descAr: 'معلمون وشيوخ مؤهلون بأسانيد متصلة وخبرة تعليمية واسعة', descEn: 'Qualified teachers and scholars with connected chains and wide teaching experience' },
  { id: 'f2', icon: '📅', nameAr: 'مرونة تامة', nameEn: 'Full Flexibility', titleAr: 'مرونة تامة', titleEn: 'Full Flexibility', descAr: 'اختر مواعيدك المناسبة من أي مكان في العالم على مدار اليوم', descEn: 'Choose your schedule from anywhere in the world, throughout the day' },
  { id: 'f3', icon: '📊', nameAr: 'تقارير دورية', nameEn: 'Progress Reports', titleAr: 'تقارير دورية', titleEn: 'Progress Reports', descAr: 'تقارير تفصيلية منتظمة لمتابعة تقدم طفلك مع ولي الأمر', descEn: "Regular detailed reports to track your child's progress" },
  { id: 'f4', icon: '🏆', nameAr: 'شهادات معتمدة', nameEn: 'Certified Diplomas', titleAr: 'شهادات معتمدة', titleEn: 'Certified Diplomas', descAr: 'شهادات إتمام المستويات تُمنح عند إكمال كل مرحلة', descEn: 'Level completion certificates awarded upon completing each stage' },
  { id: 'f5', icon: '👨‍👩‍👧‍👦', nameAr: 'باقات عائلية', nameEn: 'Family Packages', titleAr: 'باقات عائلية', titleEn: 'Family Packages', descAr: 'خصومات حصرية لتسجيل أكثر من طفل في نفس الوقت', descEn: 'Exclusive discounts for enrolling multiple children' },
  { id: 'f6', icon: '🤝', nameAr: 'دعم مستمر', nameEn: 'Continuous Support', titleAr: 'دعم مستمر', titleEn: 'Continuous Support', descAr: 'فريق دعم متاح طوال الأسبوع للإجابة عن استفساراتك', descEn: 'Support team available throughout the week' },
]

export const DEFAULT_STATS: Stat[] = [
  { id: 's1', valueAr: '+٢٠٠٠', valueEn: '2000+', labelAr: 'طالب وطالبة', labelEn: 'Students' },
  { id: 's2', valueAr: '+٥٠', valueEn: '50+', labelAr: 'معلم متخصص', labelEn: 'Qualified Teachers' },
  { id: 's3', valueAr: '+٣٠', valueEn: '30+', labelAr: 'دولة', labelEn: 'Countries' },
  { id: 's4', valueAr: '٩٨٪', valueEn: '98%', labelAr: 'رضا الطلاب', labelEn: 'Student Satisfaction' },
]

export const DEFAULT_HERO: HeroSettings = {
  titleAr: 'أكاديمية متخصصة في تعليم القرآن الكريم وعلومه عبر الإنترنت',
  titleEn: 'A specialized academy for online Quran education and its sciences',
  subtitleAr: 'معلمون متخصصون • جداول مرنة • من أي مكان في العالم',
  subtitleEn: 'Expert teachers • Flexible schedules • From anywhere in the world',
  taglineAr: 'ابدأ رحلتك مع القرآن اليوم',
  taglineEn: 'Start your Quran journey today',
  instapayNumber: '+20 100 000 0000',
  instapayName: 'أكاديمية سراج',
  contactPhone: '+966 50 000 0000',
  contactEmail: 'info@sirajacademy.com',
  referralDiscount: 50,
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  packages: DEFAULT_PACKAGES,
  familyDiscounts: DEFAULT_FAMILY_DISCOUNTS,
  testimonials: DEFAULT_TESTIMONIALS,
  programs: DEFAULT_PROGRAMS,
  features: DEFAULT_FEATURES,
  stats: DEFAULT_STATS,
  hero: DEFAULT_HERO,
}

// ── Schedule data (not editable by admin for now) ─────────────────────────────

export const DAYS = [
  { id: 'sat', ar: 'السبت', en: 'Sat' },
  { id: 'sun', ar: 'الأحد', en: 'Sun' },
  { id: 'mon', ar: 'الاثنين', en: 'Mon' },
  { id: 'tue', ar: 'الثلاثاء', en: 'Tue' },
  { id: 'wed', ar: 'الأربعاء', en: 'Wed' },
  { id: 'thu', ar: 'الخميس', en: 'Thu' },
]

export const TIMES = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
]

export const LEVELS = [
  { id: 'beginner', ar: 'مبتدئ', en: 'Beginner' },
  { id: 'quran', ar: 'حفظ القرآن', en: 'Quran Memorization' },
  { id: 'tajweed', ar: 'تجويد', en: 'Tajweed' },
]

// ── Mock user data ─────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    nameAr: 'إدارة سراج',
    nameEn: 'Siraj Admin',
    phone: '01000000000',
    password: 'admin123',
    role: 'admin',
    referralCode: 'ADMIN001',
  },
  {
    id: 'student-1',
    nameAr: 'أحمد محمد علي',
    nameEn: 'Ahmed Mohamed Ali',
    phone: '01012345678',
    password: '123456',
    role: 'student',
    referralCode: 'SIRAJ-AMA',
    packageId: 'premium',
    schedule: ['sat-09:00', 'mon-09:00', 'wed-09:00'],
    teacherId: 'teacher-1',
    joinDate: '2024-09-01',
  },
  {
    id: 'guardian-1',
    nameAr: 'محمد أحمد السيد',
    nameEn: 'Mohamed Ahmed El-Sayed',
    phone: '01098765432',
    password: '123456',
    role: 'guardian',
    referralCode: 'SIRAJ-MAS',
    childrenIds: ['child-1', 'child-2'],
    joinDate: '2024-08-15',
  },
  {
    id: 'teacher-1',
    nameAr: 'الشيخ كريم رضا',
    nameEn: 'Sheikh Karim Rida',
    phone: '01111111111',
    password: 'teacher123',
    role: 'teacher',
    referralCode: 'TEACHER-KR',
    joinDate: '2024-01-10',
  },
]

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'teacher-1',
    nameAr: 'الشيخ كريم رضا',
    nameEn: 'Sheikh Karim Rida',
    phone: '01111111111',
    password: 'teacher123',
    specialization: 'حفظ وتجويد',
    studentIds: ['student-1', 'student-3', 'student-4'],
    joinDate: '2024-01-10',
  },
  {
    id: 'teacher-2',
    nameAr: 'الشيخة فاطمة نور',
    nameEn: 'Sheikha Fatima Nour',
    phone: '01222222222',
    password: 'teacher123',
    specialization: 'تجويد وقراءات',
    studentIds: ['student-2', 'child-1'],
    joinDate: '2024-02-20',
  },
  {
    id: 'teacher-3',
    nameAr: 'الشيخ عمر حسين',
    nameEn: 'Sheikh Omar Hussein',
    phone: '01333333333',
    password: 'teacher123',
    specialization: 'نورانية وحفظ',
    studentIds: ['child-2', 'student-5'],
    joinDate: '2024-03-05',
  },
]

export const MOCK_CHILDREN: Child[] = [
  {
    id: 'child-1',
    nameAr: 'يوسف محمد',
    nameEn: 'Youssef Mohamed',
    age: 8,
    level: 'نورانية',
    guardianId: 'guardian-1',
    packageId: 'basic',
    schedule: ['sun-15:00', 'tue-15:00'],
    teacherId: 'teacher-2',
  },
  {
    id: 'child-2',
    nameAr: 'مريم محمد',
    nameEn: 'Mariam Mohamed',
    age: 11,
    level: 'حفظ القرآن',
    guardianId: 'guardian-1',
    packageId: 'premium',
    schedule: ['sat-16:00', 'mon-16:00', 'wed-16:00'],
    teacherId: 'teacher-3',
  },
]

export const MOCK_ALL_STUDENTS: Array<User & { packageName?: string; status: string }> = [
  { ...MOCK_USERS[1], packageName: 'المميزة', status: 'active' },
  {
    id: 'student-2',
    nameAr: 'سارة إبراهيم',
    nameEn: 'Sara Ibrahim',
    phone: '01055555555',
    password: '123456',
    role: 'student',
    referralCode: 'SIRAJ-SI',
    packageId: 'vip',
    teacherId: 'teacher-2',
    joinDate: '2024-09-15',
    packageName: 'VIP',
    status: 'active',
  },
  {
    id: 'student-3',
    nameAr: 'عمر خالد',
    nameEn: 'Omar Khaled',
    phone: '01066666666',
    password: '123456',
    role: 'student',
    referralCode: 'SIRAJ-OK',
    packageId: 'basic',
    teacherId: 'teacher-1',
    joinDate: '2024-10-01',
    packageName: 'الأساسية',
    status: 'active',
  },
  {
    id: 'student-4',
    nameAr: 'نور حسام',
    nameEn: 'Nour Hossam',
    phone: '01077777777',
    password: '123456',
    role: 'student',
    referralCode: 'SIRAJ-NH',
    packageId: 'premium',
    teacherId: 'teacher-1',
    joinDate: '2024-11-05',
    packageName: 'المميزة',
    status: 'active',
  },
  {
    id: 'student-5',
    nameAr: 'يزن طارق',
    nameEn: 'Yazan Tarek',
    phone: '01088888888',
    password: '123456',
    role: 'student',
    referralCode: 'SIRAJ-YT',
    packageId: 'basic',
    teacherId: 'teacher-3',
    joinDate: '2024-11-20',
    packageName: 'الأساسية',
    status: 'pending',
  },
]

export function generateReferralCode(name: string): string {
  const suffix = name.replace(/\s/g, '').slice(0, 3).toUpperCase()
  const num = Math.floor(Math.random() * 900) + 100
  return `SIRAJ-${suffix}${num}`
}

export function validateReferralCode(code: string, existingCodes: string[]): boolean {
  if (!code || code.length < 6) return false
  return existingCodes.some(c => c.toLowerCase() === code.toLowerCase()) || code.length >= 8
}

// ── أيقونة الباقة (المعرّفات الآن GUID قادمة من الـ backend) ─────────────────
export function packageIcon(p: { nameEn?: string; nameAr?: string; highlight?: boolean }): string {
  const name = `${p.nameEn || ''} ${p.nameAr || ''}`.toLowerCase()
  if (name.includes('basic') || name.includes('أساس')) return '🟢'
  if (name.includes('vip') || name.includes('مميز') || p.highlight) return '⭐'
  if (name.includes('ملكي') || name.includes('royal')) return '👑'
  return '👑'
}
