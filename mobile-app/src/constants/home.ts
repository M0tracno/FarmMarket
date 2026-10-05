import type { HomeCategory } from '@/types/home';

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: 'seeds',
    name: 'Seeds',
    image: require('../../assets/images/categories/seeds.png'),
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
    id: 'fertilizers',
    name: 'Fertilizers',
    image: require('../../assets/images/categories/fertilizers.png'),
  },
  {
    id: 'farming-tools',
    name: 'Farming Tools',
    image: require('../../assets/images/categories/farming-tools.png'),
  },
];
export const HOME_TOP_COMPANIES: HomeCategory[] = [
  {
    id: 'bayer',
    name: 'Bayer',
    image: require('../../assets/images/companies/Bayer.png'),
  },
  {
    id: 'coromandel',
    name: 'Coromandel',
    image: require('../../assets/images/companies/Coromandel.png'),
  },
  {
    id: 'upl',
    name: 'UPL',
    image: require('../../assets/images/companies/UPL.png'),
  },
  {
    id: 'syngenta',
    name: 'Syngenta',
    image: require('../../assets/images/companies/Syngenta.png'),
  },
  {
    id: 'rallis',
    name: 'Rallis',
    image: require('../../assets/images/companies/Rallis.png'),
  },
];
export const HOME_HEADER_DATA = {
  location: 'Kolar, Karnataka',
  walletBalance: 500,
} as const;
