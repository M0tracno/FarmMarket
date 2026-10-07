import { type Product } from './product';

export interface CartConfig {
  FREE_SHIPPING_THRESHOLD_PAISE: number;
  DEFAULT_SHIPPING_PAISE: number;
  MAX_QUANTITY_PER_ITEM: number;
  MIN_QUANTITY_PER_ITEM: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartPriceSummary {
  productTotalPaise: number;
  shippingPaise: number;
  shippingOriginalPaise: number;
  isShippingFree: boolean;
  orderTotalPaise: number;
}

export interface DeliveryAddress {
  id: string;
  line1: string;
  area: string;
  district: string;
  state: string;
  pincode: string;
}
