import { useLocalSearchParams } from 'expo-router';
import { DEFAULT_ORDER, ORDERS } from '../data/defaultOrder';
import type { FarmOrder } from '../types/order';

// Replace this adapter with the authenticated user's order query when login is connected.
export function useOrder(): FarmOrder {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  return ORDERS.find((order) => order.id === orderId) ?? DEFAULT_ORDER;
}

export function useOrders(): FarmOrder[] {
  return ORDERS;
}
