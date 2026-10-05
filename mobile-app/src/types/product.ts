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
