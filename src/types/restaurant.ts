export type UserRole = 'customer' | 'staff' | 'cashier' | 'manager';

export type FloorNumber = 1 | 3 | 4;

export type TableShape = 'rect' | 'circle' | 'booth';

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'cleaning';

export interface TableItem {
  id: string; // e.g. 'b2t3', 'b3t3', 'b4t3', 'b5t3', 'b1t1', 'b2t1', 'b_window_1'
  name: string; // 'Bàn 3 Tầng 3 (Bàn to)', 'Bàn Cửa Sổ', etc.
  floor: FloorNumber;
  capacity: number; // 2, 4, 6, 8, 12
  shape: TableShape;
  x: number; // percentage in floor plan
  y: number;
  width: number;
  height: number;
  isVip?: boolean;
  status: TableStatus;
  mergedWith?: string[]; // IDs of tables currently merged into this table
  parentTableId?: string; // If this is part of a merged group
  isLocked?: boolean;
}

export * from './auth';
export * from './orders';
export * from './inventory';
export * from './staff';
export * from './loyalty';

export type DecorationSet = 'none' | 'am_cung' | 'lung_linh';

export type EventOccasion = 'normal' | 'birthday' | 'anniversary' | 'dating';

export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'starter' | 'main' | 'drinks' | 'dessert' | 'set';
  price: number;
  description: string;
  descriptionEn: string;
  image: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isChefSpecial?: boolean;
}

export interface DishReview {
  id: string;
  menuItemId?: string;
  dishName?: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verifiedBooking?: boolean;
}

export type ReservationStatus = 
  | 'pending_confirm' // Đang chờ quán duyệt
  | 'confirmed'       // Đã xác nhận (có dấu tick xanh như ảnh)
  | 'seated'          // Khách đã vào bàn
  | 'completed'       // Đã dùng bữa & thanh toán xong
  | 'cancelled';      // Đã hủy

export type PaymentMethod = 'vietqr' | 'momo' | 'zalopay' | 'card' | 'cash';

export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded';

export interface PreOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  id: string; // Booking code e.g. 'MB-8347', 'MB-1166'
  customerName: string;
  phone: string;
  email: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '12h00', '18h30', '19h00'
  pax: number;
  tableId: string; // e.g. 'b3t3'
  tableName: string;
  floor: FloorNumber;
  decorationSet: DecorationSet;
  occasion?: EventOccasion;
  specialEventTitle?: string; // e.g. "Ngọc Anh", "minh xuân", "happy moments", "quân iu"
  hasBlackboard?: boolean; // (bảng đen)
  blackboardText?: string;
  note?: string; // ghi chú bàn to, bàn cửa sổ, v.v.
  status: ReservationStatus;
  depositAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentTransactionId?: string;
  preOrderItems: PreOrderItem[];
  createdAt: string;
  source: 'online' | 'manual_staff'; // Khách đặt web hoặc nhân viên nhận thủ công
}

export interface StaffUser {
  id: string;
  name: string;
  role: UserRole;
  pin: string;
  avatar: string;
  twoFactorEnabled: boolean;
  biometricsEnabled: boolean;
}

export interface RevenueRecord {
  date: string; // YYYY-MM-DD
  revenue: number;
  bookingsCount: number;
  paxCount: number;
  onlineDeposit: number;
  inStorePayment: number;
}
