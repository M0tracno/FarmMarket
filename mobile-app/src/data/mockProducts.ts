import { CART_CONFIG } from '@/constants/config';
import { IMAGES } from '@/constants/images';
import { type CartItem, type Product } from '@/types';

export const MOCK_CART_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'UPL Saaf Fungicide',
    imageUrl: IMAGES.saaf,
    variant: '250g',
    pricePaise: 46665,
    mrpPaise: 54900,
    discountPercent: 14,
    category: 'Fungicide',
  },
];

export const MOCK_RECOMMENDATION_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'UPL Saaf Fungicide',
    imageUrl: IMAGES.saaf,
    variant: '250g',
    pricePaise: 46665,
    mrpPaise: 54900,
    discountPercent: 14,
    category: 'Fungicide',
  },
  {
    id: 'prod-003',
    name: 'Bayer Nativo Fungicide',
    imageUrl: IMAGES.nativo,
    variant: '250g',
    pricePaise: 110000,
    mrpPaise: 112000,
    discountPercent: 14,
    category: 'Fungicide',
  },
  {
    id: 'prod-004',
    name: 'Coromandel Gromor ...',
    imageUrl: IMAGES.gromor,
    variant: '50kg',
    pricePaise: 110000,
    mrpPaise: 112000,
    discountPercent: 14,
    category: 'Fertiliser',
  },
];


export const MOCK_CART_ITEMS: CartItem[] = MOCK_CART_PRODUCTS.map((product) => ({
  product,
  quantity: CART_CONFIG.MIN_QUANTITY_PER_ITEM,
}));

export const MOCK_CART_CONFIG = {
  ...CART_CONFIG,
  FREE_SHIPPING_THRESHOLD_PAISE: 0,
};
