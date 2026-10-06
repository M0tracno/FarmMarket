import { CART_CONFIG, CURRENCY } from '@/constants/config';
import { type CartConfig, type CartItem, type CartPriceSummary, type Product } from '@/types';

export function formatPaise(paise: number, trimWhole = false): string {
  return `${CURRENCY.SYMBOL} ${formatPaiseCompact(paise, trimWhole)}`;
}

export function formatPaiseCompact(paise: number, trimWhole = false): string {
  const fractionDigits = trimWhole && paise % CURRENCY.PAISE_PER_RUPEE === 0
    ? 0
    : CURRENCY.FRACTION_DIGITS;
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: CURRENCY.FRACTION_DIGITS,
    useGrouping: trimWhole,
  }).format(paise / CURRENCY.PAISE_PER_RUPEE);
}

export function computePriceSummary(
  items: readonly CartItem[],
  config: CartConfig = CART_CONFIG,
): CartPriceSummary {
  const productTotalPaise = items.reduce(
    (sum, item) => sum + item.product.pricePaise * item.quantity,
    0,
  );
  const isShippingFree =
    productTotalPaise >= config.FREE_SHIPPING_THRESHOLD_PAISE;
  const shippingPaise = items.length === 0 || isShippingFree
    ? 0
    : config.DEFAULT_SHIPPING_PAISE;

  return {
    productTotalPaise,
    shippingPaise,
    shippingOriginalPaise: config.DEFAULT_SHIPPING_PAISE,
    isShippingFree,
    orderTotalPaise: productTotalPaise + shippingPaise,
  };
}

export function calcDiscountPercent(mrpPaise: number, pricePaise: number): number {
  if (mrpPaise <= 0 || mrpPaise <= pricePaise) return 0;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}

export function getProductDiscountPercent(product: Product): number {
  return product.discountPercent ?? calcDiscountPercent(product.mrpPaise, product.pricePaise);
}
