import { PaymentMethod, PaymentStatus } from './restaurant';

export type KitchenDishStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'cancelled';

export interface KitchenOrderItem {
  id: string;
  orderId: string;
  reservationId?: string;
  tableId: string;
  tableName: string;
  menuItemId: string;
  dishName: string;
  quantity: number;
  price: number;
  status: KitchenDishStatus;
  note?: string;
  orderedAt: string;
  startedCookingAt?: string;
  readyAt?: string;
  servedAt?: string;
  priority?: 'normal' | 'rush' | 'vip';
}

export interface SplitBillParty {
  id: string;
  name: string;
  itemIds: string[]; // kitchen item ids or fractional
  amount: number;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
}

export interface EInvoice {
  id: string;
  invoiceNumber: string;
  reservationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  companyName?: string;
  taxCode?: string;
  companyAddress?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  vatRate: number; // 0.08 or 0.1
  vatAmount: number;
  discountAmount: number;
  finalTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  issuedAt: string;
  lookupCode: string;
}

export interface RefundRecord {
  id: string;
  reservationId: string;
  customerName: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: string;
  processedAt?: string;
  approvedBy?: string;
}
