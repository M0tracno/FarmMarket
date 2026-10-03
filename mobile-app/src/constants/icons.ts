import type { ImageSourcePropType } from 'react-native';

export const ICONS = {
  back: 'arrow-back',
  forward: 'arrow-forward',
  close: 'close',
  menu: 'menu',
  search: 'search',
  add: 'add',
  remove: 'remove',
  check: 'checkmark',
  chevronRight: 'chevron-forward',
  chevronLeft: 'chevron-back',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',

  home: 'home-outline',
  products: 'grid-outline',
  cart: 'cart-outline',
  orders: 'receipt-outline',
  profile: 'person-outline',
  heart: 'heart-outline',
  star: 'star-outline',
  location: 'location-outline',
  notifications: 'notifications-outline',
  wallet: 'wallet-outline',
  settings: 'settings-outline',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  calendar: 'calendar-outline',
  filter: 'filter-outline',
  refresh: 'refresh',
  help: 'help-circle-outline',
} as const;

export const CUSTOM_ICONS: Partial<
  Record<keyof typeof ICONS, ImageSourcePropType>
> = {
  cart: require('../../assets/icons/cart.png'),
  location: require('../../assets/icons/location.png'),
  notifications: require('../../assets/icons/notification.png'),
  wallet: require('../../assets/icons/wallet.png'),
};

export type IconName = keyof typeof ICONS;
