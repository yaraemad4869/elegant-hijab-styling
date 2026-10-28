import type { Package } from './types'

/** سعر عرض احتياطي فقط؛ يظل مبلغ الدفع المرسل للخادم بالريال السعودي. */
const SAR_PER_USD = 3.75

/** هل يوجد سعر أصلي يستحق العرض؟ يُعرض فقط إذا كان أكبر من السعر بعد الخصم */
export function hasRealOriginalPrice(p: Package): boolean {
  return p.originalPrice != null && p.originalPrice > p.price
}

/** تحويل مبلغ بالريال إلى الدولار بسعر الإدارة إن وُجد، وإلا بنسبة 3.75 للعرض فقط. */
export function usdAmount(sar: number, p: Package): number | null {
  if (!Number.isFinite(sar)) return null
  if (p.priceUsd != null && Number.isFinite(p.priceUsd) && p.price > 0) {
    return Math.round((sar / p.price) * p.priceUsd * 100) / 100
  }
  return Math.round((sar / SAR_PER_USD) * 100) / 100
}
