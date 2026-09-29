export type MembershipTier = 'standard' | 'silver' | 'gold' | 'platinum';

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: MembershipTier;
  points: number;
  totalSpent: number;
  visitCount: number;
  joinedDate: string;
  referralCode: string;
  referredBy?: string;
  wishlistDishIds: string[];
}

export interface CouponItem {
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number; // e.g. 15 (%) or 50000 (VND)
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  applicableOccasion?: string;
  isActive: boolean;
}

export interface ComboDeal {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  dishIds: string[];
  originalPrice: number;
  comboPrice: number;
  image: string;
  tag: string;
  isAvailable: boolean;
}

export interface GiftCard {
  code: string;
  balance: number;
  initialValue: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message?: string;
  expiryDate: string;
  isRedeemed: boolean;
}

export interface WaitingListEntry {
  id: string;
  customerName: string;
  phone: string;
  pax: number;
  preferredFloor?: number;
  addedAt: string;
  estimatedWaitMinutes: number;
  status: 'waiting' | 'called' | 'seated' | 'cancelled';
  notes?: string;
}
