import { type DeliveryAddress } from '@/types';

export function formatAddress(address: DeliveryAddress): string {
  return `${address.line1}, ${address.area}, ${address.district}, ${address.state} - ${address.pincode}`;
}

export function formatAddressShort(address: DeliveryAddress, maxLength: number = 80): string {
  const full = formatAddress(address);
  if (full.length <= maxLength) return full;
  return `${full.slice(0, maxLength - 3)}...`;
}
