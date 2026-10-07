export const BOTTOM_NAV_ITEMS = [
  { label: 'Home', href: '/(main)/home', icon: 'home-outline' as const, iconSize: 25 },
  { label: 'Advisor', href: '/(main)/advisor', icon: 'headset-outline' as const, iconSize: 29 },
  { label: 'Orders', href: '/(main)/orders', icon: 'cube-outline' as const, iconSize: 26 },
  { label: 'Profile', href: '/(main)/profile', icon: 'person-circle-outline' as const, iconSize: 29 },
] as const;

export const HELP_ISSUES = [
  'Wrong Product Received',
  'Product Damaged',
  'Product Missing in Package',
  'Expired Product Received',
  'Product Quality Issue',
  'Wrong Quality Received',
  'Package Opened or Leaking',
  'Ordered by Mistake',
  'Other',
] as const;


export const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Change in requirement',
  'Found a better price',
  'Delivery taking too long',
  'Other',
] as const;
