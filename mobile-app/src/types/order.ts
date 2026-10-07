export interface OrderEvent {
  name: string;
  date: string;
  completed: boolean;
}

export interface FarmOrder {
  id: string;
  status: 'Delivered' | 'Packed';
  date: string;
  product: string;
  weight: string;
  price: string;
  amount: string;
  paymentMethod: string;
  deliveredAt: string;
  deliveryTimelineLabel: string;
  requestDate: string;
  cancellationReason: string;
  returnRequest: {
    id: string;
    reason: string;
  };
  deliveryAddress: {
    name: string;
    lines: string;
    phone: string;
  };
  events: OrderEvent[];
}
