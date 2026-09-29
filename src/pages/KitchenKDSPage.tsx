import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { KitchenDishStatus, KitchenOrderItem } from '../types/restaurant';
import {
  ChefHat,
  Clock,
  Flame,
  CheckCircle2,
  Volume2,
  VolumeX,
  AlertTriangle,
  Sparkles,
  Utensils,
  ArrowRight,
} from 'lucide-react';

export const KitchenKDSPage: React.FC = () => {
  const { kitchenOrders, updateDishStatus, addToast } = useRestaurant();
  const [filterFloor, setFilterFloor] = useState<'all' | 't1' | 't3' | 't4'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const pendingItems = kitchenOrders.filter((k) => k.status === 'pending');
  const cookingItems = kitchenOrders.filter((k) => k.status === 'cooking');
  const readyItems = kitchenOrders.filter((k) => k.status === 'ready');
  const servedItems = kitchenOrders.filter((k) => k.status === 'served');

  const handleAdvanceStatus = (item: KitchenOrderItem) => {
    let nextStatus: KitchenDishStatus = 'cooking';
    if (item.status === 'pending') nextStatus = 'cooking';
    else if (item.status === 'cooking') nextStatus = 'ready';
    else if (item.status === 'ready') nextStatus = 'served';

    updateDishStatus(item.id, nextStatus);

    if (soundEnabled && typeof Audio !== 'undefined') {
      try {
        // Subtle audio feedback simulation
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = nextStatus === 'ready' ? 660 : 440;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch {
        // ignore
      }
    }

    addToast(
      'Cập nhật bếp KDS',
      `${item.dishName} (${item.tableName}) -> [${nextStatus.toUpperCase()}]`,
      'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* KDS Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Kitchen Display System (KDS Bếp Trực Tiếp)</span>
              <span className="text-xs font-sans font-semibold bg-orange-500/15 text-orange-500 px-2.5 py-0.5 rounded-full animate-pulse">
                Live
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Hàng đợi chế biến món thời gian thực, đếm giờ ra đồ và cảnh báo món ăn cần ưu tiên
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'border-amber-500/40 text-amber-500 bg-amber-500/10'
                : 'border-stone-300 dark:border-stone-700 text-stone-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Chuông báo: {soundEnabled ? 'Bật' : 'Tắt'}</span>
          </button>
        </div>
      </div>

      {/* 4-Column Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Col 1: Pending (Chờ Nấu) */}
        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                1. Chờ Nấu ({pendingItems.length})
              </h3>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">Pending</span>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 text-xs">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                    {item.tableName}
                  </span>
                  <span className="font-mono text-[11px] text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.orderedAt}
                  </span>
                </div>

                <div>
                  <div className="font-semibold text-sm text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>{item.dishName}</span>
                    <span className="font-mono text-amber-500 text-sm font-bold">x{item.quantity}</span>
                  </div>
                  {item.note && (
                    <div className="text-[11px] text-rose-500 bg-rose-500/10 p-1.5 rounded-md mt-1.5 font-medium">
                      Ghi chú: {item.note}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAdvanceStatus(item)}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Bắt Đầu Nấu</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Cooking (Đang Chế Biến) */}
        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                2. Đang Chế Biến ({cookingItems.length})
              </h3>
            </div>
            <span className="text-[10px] text-orange-500 font-mono font-semibold">Cooking</span>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 text-xs">
            {cookingItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-orange-500/40 shadow-xs space-y-2.5 ring-1 ring-orange-500/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                    {item.tableName}
                  </span>
                  <span className="font-mono text-[11px] text-orange-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 animate-bounce" />
                    Từ {item.startedCookingAt || item.orderedAt}
                  </span>
                </div>

                <div>
                  <div className="font-semibold text-sm text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>{item.dishName}</span>
                    <span className="font-mono text-orange-500 text-sm font-bold">x{item.quantity}</span>
                  </div>
                  {item.note && (
                    <div className="text-[11px] text-rose-500 bg-rose-500/10 p-1.5 rounded-md mt-1.5 font-medium">
                      Ghi chú: {item.note}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAdvanceStatus(item)}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 rounded-lg font-bold flex items-center justify-center gap-1.5 transition text-xs shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xong Món (Ready)</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Ready (Sẵn Sàng Ra Bàn) */}
        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                3. Chờ Phục Vụ ({readyItems.length})
              </h3>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono font-semibold">Ready</span>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 text-xs">
            {readyItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-emerald-500/40 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {item.tableName}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-500 font-bold">
                    Xong lúc {item.readyAt}
                  </span>
                </div>

                <div className="font-semibold text-sm text-stone-900 dark:text-stone-100 flex items-center justify-between">
                  <span>{item.dishName}</span>
                  <span className="font-mono text-emerald-500 text-sm font-bold">x{item.quantity}</span>
                </div>

                <button
                  onClick={() => handleAdvanceStatus(item)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Đã Bưng Ra Bàn</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Col 4: Served (Đã Phục Vụ Xong) */}
        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                4. Đã Phục Vụ ({servedItems.length})
              </h3>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">Served</span>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 text-xs opacity-75">
            {servedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-stone-500">
                    {item.tableName}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400">
                    Lên bàn: {item.servedAt || 'Vừa xong'}
                  </span>
                </div>
                <div className="font-medium text-stone-700 dark:text-stone-300">
                  {item.dishName} x{item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
