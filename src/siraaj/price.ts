import type { Package } from './types'

/** هل يوجد سعر أصلي يستحق العرض؟ يُعرض فقط إذا كان أكبر من السعر بعد الخصم */
export function hasRealOriginalPrice(p: Package): boolean {
  return p.originalPrice != null && p.originalPrice > p.price
}

/** تحويل مبلغ بالريال السعودي إلى الدولار وفق سعر الباقة */
export function usdAmount(sar: number, p: Package): number | null {
  if (p.priceUsd == null || !p.price) return null
  return Math.round((sar / p.price) * p.priceUsd * 100) / 100
}
