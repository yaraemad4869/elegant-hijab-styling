import { describe, expect, it } from 'vitest'
import { hasRealOriginalPrice, usdAmount } from '../siraaj/price'
import type { Package } from '../siraaj/types'

const pkg = (over: Partial<Package>): Package => ({
  id: 'test',
  nameAr: 'باقة',
  nameEn: 'Plan',
  price: 360,
  sessions: 8,
  sessionsPerWeek: 2,
  featuresAr: [],
  featuresEn: [],
  color: '#F45B06',
  ...over,
})

describe('hasRealOriginalPrice — عرض السعر الأصلي', () => {
  it('باقة بدون عرض (الأساسية) تظهر بسعر واحد بدون سعر أصلي', () => {
    expect(hasRealOriginalPrice(pkg({ price: 360, originalPrice: undefined }))).toBe(false)
  })

  it('السعر الأصلي المساوي أو الأصغر من السعر بعد الخصم لا يظهر', () => {
    expect(hasRealOriginalPrice(pkg({ price: 450, originalPrice: 450 }))).toBe(false)
    expect(hasRealOriginalPrice(pkg({ price: 450, originalPrice: 400 }))).toBe(false)
  })

  it('السعر الأصلي الأكبر من السعر بعد الخصم يظهر', () => {
    expect(hasRealOriginalPrice(pkg({ price: 450, originalPrice: 540 }))).toBe(true)
  })
})

describe('usdAmount — التحويل للدولار', () => {
  it('يحوّل الريال إلى الدولار بنسبة سعر الباقة', () => {
    expect(usdAmount(360, pkg({ priceUsd: 96 }))).toBe(96)
    expect(usdAmount(180, pkg({ priceUsd: 96 }))).toBe(48)
  })

  it('يستخدم نسبة الريال إلى الدولار إذا لم يحدد المدير سعراً بالدولار', () => {
    expect(usdAmount(360, pkg({ priceUsd: undefined }))).toBe(96)
    expect(usdAmount(180, pkg({ priceUsd: undefined }))).toBe(48)
  })
})
