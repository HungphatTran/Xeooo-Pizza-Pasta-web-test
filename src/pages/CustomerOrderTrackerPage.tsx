import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { KitchenOrderItem } from '../types/restaurant';
import { Sparkles, Utensils, Flame, CheckCircle2, Clock, Search, ArrowRight } from 'lucide-react';

export const CustomerOrderTrackerPage: React.FC = () => {
  const { kitchenOrders, tables } = useRestaurant();
  const [selectedTableId, setSelectedTableId] = useState<string>('b3t3');

  const tableOrders = kitchenOrders.filter((k) => k.tableId === selectedTableId);
  const currentTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const getStepIndex = (status: KitchenOrderItem['status']) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'cooking':
        return 2;
      case 'ready':
        return 3;
      case 'served':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Theo Dõi Đơn Món Trực Tiếp Của Bạn</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
          Tiến Độ Chế Biến Món Ăn Tại Bàn
        </h1>
        <p className="text-xs text-stone-500 max-w-lg mx-auto">
          Các đầu bếp thủ công tại Xéooo đang chuẩn bị từng mẻ pizza men tươi và nước sốt pasta thơm nức mũi cho bạn
        </p>

        {/* Table Selector */}
        <div className="pt-3 flex items-center justify-center gap-2">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-300">Đang xem bàn:</span>
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-500 shadow-xs outline-none"
          >
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (Tầng {t.floor})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dishes progress cards */}
      <div className="space-y-4">
        {tableOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-stone-500 text-sm">Hiện tại bàn này chưa có món nào trong hàng đợi bếp</p>
            <span className="text-xs text-stone-400">
              Nhân viên sẽ bắn đơn vào hệ thống ngay khi bạn xác nhận chọn món!
            </span>
          </div>
        ) : (
          tableOrders.map((item) => {
            const step = getStepIndex(item.status);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-3">
                  <div>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {item.dishName}
                    </span>
                    <span className="ml-2 font-mono text-xs font-semibold text-amber-500">
                      Số lượng: x{item.quantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-stone-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Gọi món lúc: {item.orderedAt}</span>
                  </div>
                </div>

                {/* 4-Step Tracker Line */}
                <div className="grid grid-cols-4 gap-2 relative pt-2">
                  {/* Step 1 */}
                  <div className="text-center space-y-1.5">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition ${
                        step >= 1
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      1
                    </div>
                    <span className="block text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                      Đã nhận đơn
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="text-center space-y-1.5">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition ${
                        step >= 2
                          ? 'bg-orange-500 text-stone-950 shadow-sm animate-pulse'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      2
                    </div>
                    <span className="block text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                      Đang chế biến
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="text-center space-y-1.5">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition ${
                        step >= 3
                          ? 'bg-emerald-500 text-stone-950 shadow-sm'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      3
                    </div>
                    <span className="block text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                      Sẵn sàng ra bàn
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="text-center space-y-1.5">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition ${
                        step >= 4
                          ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      4
                    </div>
                    <span className="block text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                      Đã phục vụ
                    </span>
                  </div>
                </div>

                {item.note && (
                  <div className="text-[11px] text-stone-500 italic bg-stone-50 dark:bg-stone-800/40 p-2 rounded-lg">
                    Ghi chú món: {item.note}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
