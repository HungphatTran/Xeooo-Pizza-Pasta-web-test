import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Reservation, FloorNumber } from '../types/restaurant';
import { TIME_SLOTS } from '../data/initialData';
import { exportReservationsToCSV, triggerPrintReport } from '../utils/export';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ManualBookingMatrixProps {
  onOpenQuickBooking: (floor: FloorNumber, timeSlot?: string) => void;
  onSelectReservation: (reservation: Reservation) => void;
}

export const ManualBookingMatrix: React.FC<ManualBookingMatrixProps> = ({
  onOpenQuickBooking,
  onSelectReservation,
}) => {
  const {
    reservations,
    selectedDate,
    setSelectedDate,
    updateReservationStatus,
  } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterFloor, setFilterFloor] = useState<'all' | '1' | '3-4'>('all');

  // Filter reservations for current selected date
  const dateReservations = reservations.filter((r) => r.date === selectedDate);

  // Search filter
  const filteredReservations = dateReservations.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(term) ||
      r.phone.includes(term) ||
      r.tableName.toLowerCase().includes(term) ||
      (r.specialEventTitle && r.specialEventTitle.toLowerCase().includes(term)) ||
      (r.note && r.note.toLowerCase().includes(term)) ||
      r.id.toLowerCase().includes(term)
    );
  });

  // Calculate statistics for shift
  const totalPax = filteredReservations.reduce((acc, curr) => acc + curr.pax, 0);
  const confirmedCount = filteredReservations.filter((r) => r.status === 'confirmed' || r.status === 'seated').length;

  // Toggle checkmark status directly in table (like the green tick in image.png)
  const handleToggleCheck = (e: React.MouseEvent, res: Reservation) => {
    e.stopPropagation();
    if (res.status === 'confirmed') {
      updateReservationStatus(res.id, 'seated');
    } else if (res.status === 'seated') {
      updateReservationStatus(res.id, 'completed');
    } else {
      updateReservationStatus(res.id, 'confirmed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header / Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Ngày phục vụ:
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 border-l border-stone-200 dark:border-stone-700 pl-3">
            <span>Tổng khách: <strong className="tabular-nums font-mono text-stone-900 dark:text-stone-100">{totalPax}</strong> pax</span>
            <span>·</span>
            <span>Đã xác nhận: <strong className="tabular-nums font-mono text-emerald-600 dark:text-emerald-400">{confirmedCount}</strong> bàn</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm khách, SĐT, mã bàn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md w-44 sm:w-56 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Quick Manual Booking Button */}
          <button
            onClick={() => onOpenQuickBooking(3)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-md shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nhận Bàn Thủ Công</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={() => exportReservationsToCSV(filteredReservations, `dat_ban_${selectedDate}.csv`)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md border border-stone-300 dark:border-stone-700 transition-colors"
            title="Xuất file Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          {/* Print PDF */}
          <button
            onClick={triggerPrintReport}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md border border-stone-300 dark:border-stone-700 transition-colors"
            title="In / Xuất PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In PDF</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet / Grid Matrix matching image.png exactly */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            {/* Header row modeled after image.png */}
            <thead>
              <tr className="border-b border-stone-300 dark:border-stone-700">
                {/* Giờ column */}
                <th className="w-24 sm:w-28 py-3 px-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-r border-stone-300 dark:border-stone-700 text-center tracking-wide">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Giờ</span>
                  </div>
                </th>

                {/* Tầng 3 - 4 Column: ORANGE header as in user photo */}
                {(filterFloor === 'all' || filterFloor === '3-4') && (
                  <th
                    colSpan={3}
                    className="py-3 px-4 bg-orange-600 text-white font-bold text-center text-sm tracking-wide border-r border-stone-300 dark:border-stone-700"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-200" />
                      <span>TẦNG 3 - 4 (Lounge & Rooftop)</span>
                    </div>
                  </th>
                )}

                {/* Tầng 1 Column: GREEN header as in user photo */}
                {(filterFloor === 'all' || filterFloor === '1') && (
                  <th
                    colSpan={2}
                    className="py-3 px-4 bg-emerald-600 text-white font-bold text-center text-sm tracking-wide"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4 text-emerald-200" />
                      <span>TẦNG 1 (Sân Vườn & Cửa Sổ)</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            {/* Body rows for each time slot */}
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {TIME_SLOTS.map((timeSlot) => {
                // Get all reservations at this time slot
                const slotReservations = filteredReservations.filter((r) => r.timeSlot === timeSlot);
                const floor34Res = slotReservations.filter((r) => r.floor === 3 || r.floor === 4);
                const floor1Res = slotReservations.filter((r) => r.floor === 1);

                return (
                  <tr
                    key={timeSlot}
                    className="hover:bg-amber-50/20 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    {/* Time cell */}
                    <td className="w-24 sm:w-28 py-3 px-3 font-mono font-bold text-stone-800 dark:text-stone-200 text-center border-r border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30 tabular-nums">
                      {timeSlot}
                    </td>

                    {/* Tầng 3 - 4 Cell Slots (3 visual columns or flexible list) */}
                    {(filterFloor === 'all' || filterFloor === '3-4') && (
                      <td
                        colSpan={3}
                        className="p-2 border-r border-stone-300 dark:border-stone-700 align-top min-w-[280px]"
                      >
                        {floor34Res.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {floor34Res.map((res) => {
                              const isLungLinh = res.decorationSet === 'lung_linh';
                              const isAmCung = res.decorationSet === 'am_cung';
                              const isSinhNhat = res.occasion === 'birthday';
                              const isKiNiem = res.occasion === 'anniversary';

                              return (
                                <div
                                  key={res.id}
                                  onClick={() => onSelectReservation(res)}
                                  className={`p-2.5 rounded border cursor-pointer hover:shadow-md transition-all text-xs relative leading-relaxed ${
                                    res.hasBlackboard || res.id === 'MB-9381'
                                      ? 'border-amber-700 bg-amber-50/60 dark:bg-amber-950/30 ring-1 ring-amber-600'
                                      : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/90'
                                  }`}
                                >
                                  {/* Top line: Customer name, Pax, Table note */}
                                  <div className="flex items-start justify-between gap-1 font-semibold text-stone-900 dark:text-stone-100">
                                    <span>
                                      {res.customerName} - {res.pax} pax
                                      {res.tableName && (
                                        <span className="text-stone-600 dark:text-stone-400 font-mono text-[11px] ml-1">
                                          ({res.tableId})
                                        </span>
                                      )}
                                    </span>

                                    {/* Verified checkmark badge as shown in image.png with green check */}
                                    <button
                                      onClick={(e) => handleToggleCheck(e, res)}
                                      className="p-0.5 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform"
                                      title="Nhấn để đổi trạng thái xác nhận / đã vào bàn"
                                    >
                                      {res.status === 'confirmed' || res.status === 'seated' ? (
                                        <CheckCircle2 className="w-4 h-4 fill-emerald-100 text-emerald-600 dark:fill-emerald-950 dark:text-emerald-400" />
                                      ) : (
                                        <div className="w-3.5 h-3.5 rounded-full border border-stone-400" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Second line: Event & Decor Set note */}
                                  {(res.decorationSet !== 'none' || res.specialEventTitle) && (
                                    <div className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 flex flex-wrap items-center gap-1">
                                      {isLungLinh && <span className="text-amber-600 dark:text-amber-400">set lung linh</span>}
                                      {isAmCung && <span className="text-orange-600 dark:text-orange-400">ấm cúng</span>}
                                      {isSinhNhat && <span className="text-rose-600 dark:text-rose-400">sinh nhật</span>}
                                      {isKiNiem && <span className="text-purple-600 dark:text-purple-400">kỉ niệm</span>}
                                      {res.specialEventTitle && (
                                        <span className="italic font-medium">"{res.specialEventTitle}"</span>
                                      )}
                                      {res.hasBlackboard && (
                                        <span className="text-stone-500 font-semibold">(bảng đen)</span>
                                      )}
                                    </div>
                                  )}

                                  {/* Third line: Phone and status */}
                                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                                    <span className="font-mono tabular-nums">{res.phone}</span>
                                    <span className="text-[10px] uppercase font-mono text-stone-400">#{res.id}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenQuickBooking(3, timeSlot)}
                            className="w-full py-2 border border-dashed border-stone-200 dark:border-stone-800 text-stone-400 hover:text-amber-600 hover:border-amber-400 dark:hover:border-amber-600 rounded text-[11px] flex items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Nhận bàn Tầng 3-4 ({timeSlot})</span>
                          </button>
                        )}
                      </td>
                    )}

                    {/* Tầng 1 Cell Slots */}
                    {(filterFloor === 'all' || filterFloor === '1') && (
                      <td
                        colSpan={2}
                        className="p-2 align-top min-w-[240px]"
                      >
                        {floor1Res.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {floor1Res.map((res) => (
                              <div
                                key={res.id}
                                onClick={() => onSelectReservation(res)}
                                className={`p-2.5 rounded border cursor-pointer hover:shadow-md transition-all text-xs leading-relaxed ${
                                  res.id === 'MB-9728' || res.hasBlackboard
                                    ? 'border-amber-700 bg-amber-50/60 dark:bg-amber-950/30'
                                    : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/90'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-1 font-semibold text-stone-900 dark:text-stone-100">
                                  <span>
                                    {res.customerName} - {res.pax} pax
                                  </span>

                                  <button
                                    onClick={(e) => handleToggleCheck(e, res)}
                                    className="p-0.5 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform"
                                  >
                                    {res.status === 'confirmed' || res.status === 'seated' ? (
                                      <CheckCircle2 className="w-4 h-4 fill-emerald-100 text-emerald-600 dark:fill-emerald-950 dark:text-emerald-400" />
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full border border-stone-400" />
                                    )}
                                  </button>
                                </div>

                                <div className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 flex flex-wrap items-center gap-1">
                                  {res.decorationSet === 'lung_linh' && <span className="text-amber-600">lung linh</span>}
                                  {res.decorationSet === 'am_cung' && <span className="text-orange-600">ấm cúng</span>}
                                  {res.specialEventTitle && <span className="italic font-medium">"{res.specialEventTitle}"</span>}
                                  {res.note && <span className="text-stone-500 font-mono">({res.tableName})</span>}
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                                  <span className="font-mono tabular-nums">{res.phone}</span>
                                  <span className="text-[10px] uppercase font-mono text-stone-400">#{res.id}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenQuickBooking(1, timeSlot)}
                            className="w-full py-2 border border-dashed border-stone-200 dark:border-stone-800 text-stone-400 hover:text-emerald-600 hover:border-emerald-400 dark:hover:border-emerald-600 rounded text-[11px] flex items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Nhận bàn Tầng 1 ({timeSlot})</span>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer hint for staff */}
      <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-2 py-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
          <span>Click vào thẻ khách để xem chi tiết / sửa đơn / in bill. Nhấn icon tick xanh để đổi trạng thái sang "Đã vào bàn".</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-500 rounded-sm inline-block"></span> Tầng 3-4</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> Tầng 1</span>
        </div>
      </div>
    </div>
  );
};
