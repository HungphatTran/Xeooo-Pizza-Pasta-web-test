import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { TableItem, FloorNumber, TableStatus } from '../types/restaurant';
import {
  Users,
  CheckCircle,
  Eye,
  Sparkles,
  Layers,
  Flame,
  Wine
} from 'lucide-react';

interface FloorPlanVisualizerProps {
  selectable?: boolean;
  selectedTableId?: string;
  onSelectTable?: (table: TableItem) => void;
}

export const FloorPlanVisualizer: React.FC<FloorPlanVisualizerProps> = ({
  selectable = true,
  selectedTableId,
  onSelectTable,
}) => {
  const { tables, updateTableStatus, currentRole, reservations, selectedDate } = useRestaurant();
  const [activeFloor, setActiveFloor] = useState<FloorNumber>(3);
  const [inspectedTable, setInspectedTable] = useState<TableItem | null>(null);

  const floorTables = tables.filter((t) => t.floor === activeFloor);

  // Check if a table has an active reservation today
  const getTableReservation = (tableId: string) => {
    return reservations.find((r) => r.tableId === tableId && r.date === selectedDate);
  };

  const getStatusColor = (status: TableStatus, isSelected: boolean) => {
    if (isSelected) {
      return 'border-amber-500 bg-amber-500/20 text-amber-500 ring-2 ring-amber-500';
    }
    switch (status) {
      case 'available':
        return 'border-emerald-600/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500';
      case 'reserved':
        return 'border-amber-500/60 bg-amber-500/15 text-amber-400 hover:border-amber-400';
      case 'occupied':
        return 'border-rose-600/60 bg-rose-500/15 text-rose-400 hover:border-rose-400';
      case 'cleaning':
        return 'border-stone-500 bg-stone-500/10 text-stone-400 hover:border-stone-400';
    }
  };

  const handleTableClick = (table: TableItem) => {
    setInspectedTable(table);
    if (onSelectTable) {
      onSelectTable(table);
    }
  };

  return (
    <div className="space-y-4">
      {/* Floor selection bar & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
        {/* Floor switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
          <button
            onClick={() => setActiveFloor(1)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFloor === 1
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Tầng 1 (Sân Vườn)
          </button>
          <button
            onClick={() => setActiveFloor(3)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFloor === 3
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Tầng 3 (Ấm Cúng & Bàn to)
          </button>
          <button
            onClick={() => setActiveFloor(4)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFloor === 4
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Tầng 4 (B4 & B5 Max 6 khách)
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-stone-600 dark:text-stone-400">Trống</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-stone-600 dark:text-stone-400">Đã đặt trước</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-stone-600 dark:text-stone-400">Đang phục vụ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-500"></span>
            <span className="text-stone-600 dark:text-stone-400">Cần dọn</span>
          </div>
        </div>
      </div>

      {/* Interactive 2D Floor Plan Canvas */}
      <div className="relative w-full aspect-16/9 min-h-[420px] bg-stone-950 border border-stone-800 rounded-xl p-6 overflow-hidden shadow-inner flex flex-col justify-between">
        {/* Subtle architectural grid lines & floor decorations */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Architectural zone banners */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 font-mono">
          <div className="flex items-center gap-2 border border-stone-800 bg-stone-900/80 px-2.5 py-1 rounded">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>SƠ ĐỒ MẶT BẰNG · TẦNG {activeFloor}</span>
          </div>

          <div className="flex items-center gap-4">
            {activeFloor === 1 && (
              <span className="text-emerald-400/80 font-medium">🌿 KHU VỰC VƯỜN HOA & VIEW CỬA SỔ</span>
            )}
            {activeFloor === 3 && (
              <span className="text-orange-400/80 font-medium">✨ KHÔNG GIAN HẸN HÒ & SINH NHẬT ẤM CÚNG</span>
            )}
            {activeFloor === 4 && (
              <span className="text-amber-400 font-medium">
                🍸 TẦNG 4 (BỐ TRÍ TƯƠNG TỰ TẦNG 3 · RIÊNG B4 & B5 NGỒI TỐI ĐA 6 KHÁCH)
              </span>
            )}
          </div>
        </div>

        {/* Physical architectural anchors */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center gap-1 text-[11px] font-mono text-stone-600 border border-dashed border-stone-800 p-2 rounded">
          <Wine className="w-4 h-4 text-stone-500" />
          <span>QUẦY BAR</span>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-[11px] font-mono text-stone-600 border border-dashed border-stone-800 px-3 py-1 rounded">
          <span>LỐI VÀO / CẦU THANG</span>
        </div>

        {/* Tables scattered across spatial coordinates */}
        <div className="relative z-20 w-full h-full my-auto flex items-center justify-center">
          <div className="relative w-full h-[320px]">
            {floorTables.map((table) => {
              const isSelected = selectedTableId === table.id;
              const res = getTableReservation(table.id);
              const colorClasses = getStatusColor(table.status, isSelected);

              return (
                <div
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  style={{
                    position: 'absolute',
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${table.width}px`,
                    height: `${table.height}px`,
                  }}
                  className={`border-2 cursor-pointer transition-all duration-150 flex flex-col items-center justify-center p-1.5 shadow-lg group select-none ${
                    table.shape === 'circle' ? 'rounded-full' : table.shape === 'booth' ? 'rounded-2xl' : 'rounded-lg'
                  } ${colorClasses}`}
                >
                  <span className="font-bold text-xs tracking-tight line-clamp-1 text-center">
                    {table.id.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-1 text-[10px] text-stone-300 opacity-90">
                    <Users className="w-2.5 h-2.5" />
                    <span>{table.capacity}p</span>
                  </div>

                  {res && (
                    <div className="text-[9px] px-1 bg-stone-900/90 text-amber-300 rounded font-medium mt-0.5 truncate max-w-[90%]">
                      {res.customerName}
                    </div>
                  )}

                  {table.capacity === 6 && (
                    <div className="absolute -top-2 -left-1 bg-emerald-500 text-stone-950 font-bold text-[8px] px-1 rounded shadow-xs">
                      Bàn to 6p
                    </div>
                  )}

                  {table.isVip && (
                    <div className="absolute -top-2 -right-1 bg-amber-500 text-stone-950 font-bold text-[8px] px-1 rounded shadow-xs flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2" />
                      <span>VIP</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom helper tip */}
        <div className="relative z-10 text-[11px] text-stone-500 flex items-center justify-between">
          <span>* Click vào bàn để chọn giữ chỗ hoặc xem chi tiết khách đang dùng</span>
          <span>Sức chứa: 2 - 12 pax/bàn</span>
        </div>
      </div>

      {/* Table details inspector panel when a table is clicked */}
      {inspectedTable && (
        <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold font-mono">
              {inspectedTable.id.toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>{inspectedTable.name}</span>
                <span className="text-xs font-normal text-stone-500 font-mono">
                  (Tầng {inspectedTable.floor} · {inspectedTable.capacity} khách)
                </span>
              </h4>
              <p className="text-xs text-stone-500">
                {getTableReservation(inspectedTable.id) ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Đã đặt bởi khách: {getTableReservation(inspectedTable.id)?.customerName} ({getTableReservation(inspectedTable.id)?.timeSlot})
                  </span>
                ) : (
                  <span>Bàn đang sẵn sàng đón khách</span>
                )}
              </p>
            </div>
          </div>

          {/* If staff/manager, allow quick status toggle */}
          {currentRole !== 'customer' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Đổi trạng thái:</span>
              {(['available', 'occupied', 'cleaning', 'reserved'] as TableStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => updateTableStatus(inspectedTable.id, st)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    inspectedTable.status === st
                      ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                      : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {st === 'available' && 'Trống'}
                  {st === 'occupied' && 'Có khách'}
                  {st === 'cleaning' && 'Cần dọn'}
                  {st === 'reserved' && 'Giữ chỗ'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
