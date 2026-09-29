import React, { useState } from 'react';
import { ManualBookingMatrix } from '../components/ManualBookingMatrix';
import { FloorNumber, Reservation } from '../types/restaurant';
import { useRestaurant } from '../context/RestaurantContext';
import { Calendar, Filter, Plus, Search, Sparkles } from 'lucide-react';

interface Props {
  onOpenQuickBooking: (floor: FloorNumber, timeSlot?: string) => void;
  onSelectReservation: (res: Reservation) => void;
}

export const SchedulePage: React.FC<Props> = ({ onOpenQuickBooking, onSelectReservation }) => {
  const { selectedDate, setSelectedDate, reservations } = useRestaurant();
  const [floorFilter, setFloorFilter] = useState<'all' | FloorNumber>('all');

  const todayCount = reservations.filter((r) => r.date === selectedDate && r.status !== 'cancelled').length;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Khung Nhận Bàn Thủ Công Theo Giờ</span>
            <span className="text-xs font-sans font-semibold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
              {todayCount} bàn hôm nay
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Bảng ma trận quản lý ca trực tiếp theo giờ x Tầng 1 (Sân vườn), Tầng 3 (Ấm cúng &amp; Lồng kính) và Tầng 4 (Bàn to)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQuickBooking(3, '19h00')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Đặt Bàn Nhanh</span>
          </button>
        </div>
      </div>

      {/* Manual Matrix Grid */}
      <ManualBookingMatrix
        onOpenQuickBooking={onOpenQuickBooking}
        onSelectReservation={onSelectReservation}
      />
    </div>
  );
};
