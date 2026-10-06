import { type DeliveryAddress } from '@/types';

/**
 * Dev-only mock address. Swap with real user address from API.
 */
export const MOCK_ADDRESS: DeliveryAddress = {
  id: 'addr-001',
  line1: 'H.No 12-4-56, Near bus Stand',
  area: 'Kappegalu Village',
  district: 'Bellary District',
  state: 'Karnataka',
  pincode: '583101',
};
