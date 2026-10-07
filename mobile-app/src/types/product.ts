import type { ImageSourcePropType } from 'react-native';

export interface ProductItem {
  id: string;
  name: string;
  specs: string;
  pricePaise: number;
  originalPricePaise: number;
  discountPercentage: number;
  image: ImageSourcePropType;
  category: string;
}

export interface SectionBanner {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}
export interface Product {
  id: string;
  name: string;
  imageUrl: string | number;
  variant: string;
  pricePaise: number;
  mrpPaise: number;
  discountPercent?: number;
  category: string;
}
