import React from 'react';
import { CustomerBookingFlow } from '../components/CustomerBookingFlow';
import { useRestaurant } from '../context/RestaurantContext';
import { Sparkles, Tag, Utensils, Heart, Clock, Award } from 'lucide-react';

interface Props {
  onSuccess?: (bookingId: string) => void;
  onOpenEmailModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const BookingPage: React.FC<Props> = ({ onSuccess, onOpenEmailModal, onNavigateToTab }) => {
  const { appliedCoupon, applyCouponCode } = useRestaurant();

  return (
    <div className="space-y-6">
      {/* Promotional Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Ưu Đãi Đặt Bàn Trực Tuyến Hôm Nay:
            </span>
            <p className="text-stone-600 dark:text-stone-300">
              Nhập mã <strong className="font-mono text-amber-500">XEOOO50K</strong> giảm ngay 50.000đ hoặc{' '}
              <strong className="font-mono text-amber-500">ROMANTIC20</strong> giảm 20% gói trang trí tiệc lãng mạn.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('loyalty')}
          className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400 transition shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Xem Kho Voucher</span>
        </button>
      </div>

      {/* Main Booking Wizard */}
      <CustomerBookingFlow
        onSuccess={(id) => {
          if (onSuccess) onSuccess(id);
        }}
        onOpenEmailModal={onOpenEmailModal}
      />
    </div>
  );
};
