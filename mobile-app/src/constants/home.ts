import type { HomeCategory } from '@/types/home';

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: 'seeds',
    name: 'Seeds',
    image: require('../../assets/images/categories/seeds.png'),
  },
  {
    id: 'fertilizers',
    name: 'Fertilizers',
    image: require('../../assets/images/categories/fertilizers.png'),
  },
  {
    id: 'pesticides',
    name: 'Pesticides',
    image: require('../../assets/images/categories/pesticides.png'),
  },
  {
    id: 'fungicides',
    name: 'Fungicides',
    image: require('../../assets/images/categories/fungicides.png'),
  },
  {
    id: 'farming-tools',
    name: 'Farming Tools',
    image: require('../../assets/images/categories/farming-tools.png'),
  },
];
export const HOME_HEADER_DATA = {
  location: 'Kolar, Karnataka',
  walletBalance: 500,
} as const;
