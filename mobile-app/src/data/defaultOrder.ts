import type { FarmOrder } from '../types/order';

export const DEFAULT_ORDER: FarmOrder = {
  id: '#ORD123456770',
  status: 'Delivered',
  date: '7 Jan, 2026',
  product: 'UPL Saaf Fungicide',
  weight: '250g',
  price: '₹ 466.65',
  amount: '466.65',
  paymentMethod: 'Cash on delivery',
  deliveredAt: 'on web, 7 Jan, 5:12 PM',
  deliveryTimelineLabel: 'Delivery on Web, 7 Ap',
  requestDate: '7 Jan, 2026 at 6:15 PM',
  cancellationReason: 'Ordered by mistake',
  returnRequest: {
    id: '#RTR12345678',
    reason: 'Wrong Product Received',
  },
  deliveryAddress: {
    name: 'Jagadeesh',
    lines:
      'H.No 12-4-56, Near bus Stand, Kappegalu Village, Bellary District\nKarnataka - 583101',
    phone: 'Phone: 1234567890',
  },
  events: [
    { name: 'Confirmed', date: '1 Jan, 2026', completed: true },
    { name: 'Packed', date: '3 Jan, 2026', completed: true },
    { name: 'Dispatched', date: '3 Jan, 2026', completed: true },
    { name: 'Out for Delivery', date: '5 Jan, 2026', completed: true },
    { name: 'Delivery', date: '7 Jan, 2026', completed: true },
  ],
};

export const PACKED_ORDER: FarmOrder = {
  ...DEFAULT_ORDER,
  id: '#ORD123456771',
  status: 'Packed',
  date: '1 Jan, 2026',
  deliveredAt: 'on web, 3 Jan, 11:24 AM',
  deliveryTimelineLabel: 'Packed on 3 Jan, 2026',
  events: [
    { name: 'Confirmed', date: '1 Jan, 2026', completed: true },
    { name: 'Packed', date: '3 Jan, 2026', completed: true },
    { name: 'Dispatched', date: '', completed: false },
    { name: 'Out for Delivery', date: '', completed: false },
    { name: 'Delivery', date: '', completed: false },
  ],
};

export const ORDERS: FarmOrder[] = [DEFAULT_ORDER, PACKED_ORDER];
