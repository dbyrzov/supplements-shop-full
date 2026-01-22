export type CreateOrderItemInput = {
  productId: number;
  quantity: number;
};

export type CreateOrderInput = {
  userId: number;
  items: CreateOrderItemInput[];
  shippingAddress: string;
  paymentMethod?: 'card' | 'paypal' | 'cash';
  notes?: string;
  couponCode?: string;
};
