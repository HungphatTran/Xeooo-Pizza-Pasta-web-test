import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Reservation } from '../types/restaurant';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle,
  Plus,
  Printer,
  Search,
  DollarSign,
  Coffee,
  Check
} from 'lucide-react';
import { triggerPrintReport } from '../utils/export';

interface OrderManagementProps {
  onSelectReservation: (res: Reservation) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ onSelectReservation }) => {
  const { reservations, menuItems, updateReservation, selectedDate } = useRestaurant();
  const [filterState, setFilterState] = useState<'all' | 'pending' | 'seated' | 'completed'>('all');
  const [addingDishToResId, setAddingDishToResId] = useState<string | null>(null);

  // Today's active reservations
  const activeOrders = reservations.filter((r) => {
    if (r.date !== selectedDate) return false;
    if (filterState === 'all') return true;
    if (filterState === 'pending') return r.status === 'confirmed' || r.status === 'pending_confirm';
    if (filterState === 'seated') return r.status === 'seated';
    if (filterState === 'completed') return r.status === 'completed';
    return true;
  });

  const handleAddDish = (res: Reservation, menuItemId: string) => {
    const menuItem = menuItems.find((m) => m.id === menuItemId);
    if (!menuItem) return;

    const existing = res.preOrderItems.find((p) => p.menuItemId === menuItemId);
    let updatedItems;
    if (existing) {
      updatedItems = res.preOrderItems.map((p) =>
        p.menuItemId === menuItemId ? { ...p, quantity: p.quantity + 1 } : p
      );
    } else {
      updatedItems = [
        ...res.preOrderItems,
        { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 },
      ];
    }

    const newTotal = res.totalAmount + menuItem.price;
    updateReservation(res.id, {
      preOrderItems: updatedItems,
      totalAmount: newTotal,
    });
    setAddingDishToResId(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-semibold">
          {[
            { id: 'all', label: 'Tất cả đơn' },
            { id: 'pending', label: 'Chờ khách đến' },
            { id: 'seated', label: 'Khách đang ngồi dùng' },
            { id: 'completed', label: 'Đã hoàn tất thanh toán' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id as typeof filterState)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterState === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg border border-stone-300 dark:border-stone-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Bếp / Bill</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeOrders.map((order) => {
          const isSeated = order.status === 'seated';
          const isCompleted = order.status === 'completed';

          return (
            <div
              key={order.id}
              className={`p-5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
                isSeated
                  ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/20'
                  : isCompleted
                  ? 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 opacity-75'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Table and Time */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-500">#{order.id}</span>
                    <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                      {order.tableName}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Khách: <strong>{order.customerName}</strong> ({order.pax} pax)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      {order.timeSlot}
                    </span>
                    <span className="block text-[10px] text-stone-400 mt-1 uppercase font-mono">
                      Tầng {order.floor}
                    </span>
                  </div>
                </div>

                {/* Pre-ordered Food / Items List */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3" />
                    <span>Món đã gọi:</span>
                  </div>

                  {order.preOrderItems.length > 0 ? (
                    <div className="space-y-1">
                      {order.preOrderItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-stone-800 dark:text-stone-200">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-mono text-stone-500 tabular-nums">
                            {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-xs italic">Chưa gọi món trước (gọi tại bàn)</p>
                  )}
                </div>

                {/* Decor Set & Event */}
                {(order.decorationSet !== 'none' || order.specialEventTitle) && (
                  <div className="p-2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
                    {order.decorationSet} · "{order.specialEventTitle || 'Đặc biệt'}"
                    {order.hasBlackboard && ' (Kèm bảng đen)'}
                  </div>
                )}
              </div>

              {/* Bottom Actions: Add Dish, Pay, View */}
              <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Tổng tiền bàn:</span>
                  <strong className="font-mono text-sm text-stone-900 dark:text-stone-100 tabular-nums">
                    {order.totalAmount.toLocaleString('vi-VN')} đ
                  </strong>
                </div>

                {/* Quick Add dish dropdown toggle */}
                {addingDishToResId === order.id ? (
                  <div className="space-y-1.5 p-2 bg-stone-100 dark:bg-stone-800 rounded-lg animate-in fade-in">
                    <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block">
                      Chọn món thêm nhanh:
                    </span>
                    <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto">
                      {menuItems.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleAddDish(order, m.id)}
                          className="text-left text-xs p-1.5 hover:bg-white dark:hover:bg-stone-700 rounded flex justify-between items-center"
                        >
                          <span className="truncate">{m.name}</span>
                          <span className="font-mono text-[11px] text-amber-500 shrink-0">
                            +{m.price.toLocaleString('vi-VN')}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setAddingDishToResId(null)}
                      className="text-[10px] text-stone-400 hover:text-stone-600 block text-center pt-1"
                    >
                      Đóng
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAddingDishToResId(order.id)}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm món</span>
                    </button>

                    <button
                      onClick={() => onSelectReservation(order)}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Chi tiết / Bill</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
