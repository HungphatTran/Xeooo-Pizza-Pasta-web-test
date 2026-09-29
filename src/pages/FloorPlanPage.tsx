import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { FloorPlanVisualizer } from '../components/FloorPlanVisualizer';
import { TableItem, FloorNumber, TableStatus } from '../types/restaurant';
import {
  Merge,
  Split,
  MoveRight,
  Sparkles,
  Users,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Armchair,
  Check,
} from 'lucide-react';

export const FloorPlanPage: React.FC = () => {
  const {
    tables,
    updateTableStatus,
    mergeTables,
    splitTable,
    moveTable,
    autoAssignTable,
    waitingList,
    addToWaitingList,
    updateWaitingStatus,
    removeFromWaitingList,
    reservations,
    selectedDate,
    addToast,
  } = useRestaurant();

  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [mergeSecondaryId, setMergeSecondaryId] = useState<string>('');
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [targetMoveTableId, setTargetMoveTableId] = useState<string>('');

  // Waiting list state
  const [newWaitName, setNewWaitName] = useState('');
  const [newWaitPhone, setNewWaitPhone] = useState('');
  const [newWaitPax, setNewWaitPax] = useState(2);
  const [newWaitFloor, setNewWaitFloor] = useState<FloorNumber>(3);

  // Auto assign state
  const [autoPax, setAutoPax] = useState(4);
  const [autoAssignedResult, setAutoAssignedResult] = useState<TableItem | null>(null);

  const activeReservationsOnTable = selectedTable
    ? reservations.filter((r) => r.tableId === selectedTable.id && r.date === selectedDate)
    : [];

  const handleRunAutoAssign = () => {
    const result = autoAssignTable(autoPax);
    setAutoAssignedResult(result);
    if (result) {
      addToast('Tối ưu bàn thành công', `Đã tìm thấy [${result.name}] sức chứa ${result.capacity} khách tối ưu nhất`, 'success');
    } else {
      addToast('Hết bàn trống', `Không còn bàn trống phù hợp cho ${autoPax} khách`, 'warning');
    }
  };

  const handleAddWaiting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaitName.trim() || !newWaitPhone.trim()) return;
    addToWaitingList({
      customerName: newWaitName,
      phone: newWaitPhone,
      pax: newWaitPax,
      preferredFloor: newWaitFloor,
      estimatedWaitMinutes: 15,
      notes: `Ưa thích Tầng ${newWaitFloor}`,
    });
    setNewWaitName('');
    setNewWaitPhone('');
    addToast('Danh sách chờ', `Đã thêm khách ${newWaitName} (${newWaitPax} pax) vào hàng đợi.`);
  };

  const handleConfirmMerge = () => {
    if (!selectedTable || !mergeSecondaryId) return;
    const success = mergeTables(selectedTable.id, mergeSecondaryId);
    if (success) {
      addToast('Gộp bàn thành công', `Đã gộp thành công vào bàn ${selectedTable.name}`, 'success');
      setIsMergeModalOpen(false);
    }
  };

  const handleConfirmSplit = () => {
    if (!selectedTable) return;
    const success = splitTable(selectedTable.id);
    if (success) {
      addToast('Tách bàn thành công', `Đã tách bàn ${selectedTable.name} về vị trí độc lập`, 'success');
    }
  };

  const handleConfirmMove = () => {
    if (!selectedTable || !targetMoveTableId || !activeReservationsOnTable[0]) return;
    const success = moveTable(activeReservationsOnTable[0].id, targetMoveTableId);
    if (success) {
      addToast('Chuyển bàn thành công', 'Đã cập nhật vị trí bàn mới cho khách.', 'success');
      setIsMoveModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Sơ Đồ Bàn &amp; Điều Phối Không Gian Tầng</span>
            <span className="text-xs font-sans font-semibold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
              {tables.filter((t) => t.status === 'available').length} bàn trống
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Kéo thả sắp xếp bàn, gộp/tách bàn cho tiệc lớn, chuyển bàn và danh sách chờ thời gian thực
          </p>
        </div>

        {/* Auto assign helper */}
        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
          <span className="font-medium text-stone-600 dark:text-stone-300 ml-1">Xếp bàn nhanh:</span>
          <select
            value={autoPax}
            onChange={(e) => setAutoPax(Number(e.target.value))}
            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 font-mono text-xs text-stone-800 dark:text-stone-200"
          >
            {[2, 4, 6, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n} Khách
              </option>
            ))}
          </select>
          <button
            onClick={handleRunAutoAssign}
            className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tìm Bàn Tối Ưu</span>
          </button>
        </div>
      </div>

      {/* Main Floor Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Interactive Floor Visualizer */}
        <div className="lg:col-span-3 space-y-4">
          <FloorPlanVisualizer
            selectable
            selectedTableId={selectedTable?.id}
            onSelectTable={(tbl) => setSelectedTable(tbl)}
          />

          {/* Table Operations Bar (Active when table selected) */}
          {selectedTable && (
            <div className="bg-white dark:bg-stone-900 border border-amber-500/40 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {selectedTable.name}
                  </span>
                  <span className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">
                    Sức chứa: {selectedTable.capacity} khách
                  </span>
                  {selectedTable.mergedWith?.length ? (
                    <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">
                      Đã gộp {selectedTable.mergedWith.length} bàn
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-stone-500">
                  {activeReservationsOnTable.length > 0 ? (
                    <span>
                      Đang có đặt bàn: <strong>{activeReservationsOnTable[0].customerName}</strong> ({activeReservationsOnTable[0].timeSlot})
                    </span>
                  ) : (
                    <span>Hiện chưa có khách ngồi hoặc đặt trước lúc này</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Status Switcher */}
                <select
                  value={selectedTable.status}
                  onChange={(e) => updateTableStatus(selectedTable.id, e.target.value as TableStatus)}
                  className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-medium"
                >
                  <option value="available">Bàn trống</option>
                  <option value="reserved">Đã đặt trước</option>
                  <option value="occupied">Đang có khách</option>
                  <option value="cleaning">Cần dọn dẹp</option>
                </select>

                {/* Merge Table button */}
                <button
                  onClick={() => setIsMergeModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium flex items-center gap-1.5 transition"
                >
                  <Merge className="w-3.5 h-3.5" />
                  <span>Gộp Bàn</span>
                </button>

                {/* Split Table button */}
                {selectedTable.mergedWith?.length ? (
                  <button
                    onClick={handleConfirmSplit}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-medium flex items-center gap-1.5 transition"
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span>Tách Bàn</span>
                  </button>
                ) : null}

                {/* Move Table button */}
                {activeReservationsOnTable.length > 0 && (
                  <button
                    onClick={() => setIsMoveModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-medium flex items-center gap-1.5 transition"
                  >
                    <MoveRight className="w-3.5 h-3.5" />
                    <span>Chuyển Bàn Cho Khách</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Waiting List Management */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  Danh Sách Chờ (Waiting List)
                </h3>
              </div>
              <span className="text-[11px] font-mono bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded">
                {waitingList.filter((w) => w.status === 'waiting').length} chờ
              </span>
            </div>

            {/* Waiting List Entries */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto text-xs">
              {waitingList.length === 0 ? (
                <div className="text-center py-6 text-stone-400 text-xs">
                  Hiện không có khách nào trong hàng đợi
                </div>
              ) : (
                waitingList.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {entry.customerName}
                      </span>
                      <span className="font-mono text-[11px] text-stone-400">
                        Lúc {entry.addedAt}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-500 text-[11px]">
                      <span>{entry.phone}</span>
                      <span className="font-medium text-amber-500">
                        {entry.pax} Khách · Chờ ~{entry.estimatedWaitMinutes}p
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-700/40">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          entry.status === 'waiting'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {entry.status === 'waiting' ? 'Đang đợi bàn' : 'Đã vào bàn'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {entry.status === 'waiting' && (
                          <button
                            onClick={() => updateWaitingStatus(entry.id, 'seated')}
                            className="p-1 rounded hover:bg-emerald-500/10 text-emerald-500"
                            title="Xếp vào bàn"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => removeFromWaitingList(entry.id)}
                          className="p-1 rounded hover:bg-rose-500/10 text-rose-500"
                          title="Hủy khỏi danh sách"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add To Waiting List Form */}
            <form onSubmit={handleAddWaiting} className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2.5 text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300 block text-[11px]">
                + Thêm khách vãng lai chờ bàn:
              </span>
              <input
                type="text"
                placeholder="Tên khách hàng..."
                value={newWaitName}
                onChange={(e) => setNewWaitName(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-900 dark:text-stone-100 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder="Số điện thoại..."
                  value={newWaitPhone}
                  onChange={(e) => setNewWaitPhone(e.target.value)}
                  className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-900 dark:text-stone-100 outline-none"
                />
                <select
                  value={newWaitPax}
                  onChange={(e) => setNewWaitPax(Number(e.target.value))}
                  className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 text-stone-900 dark:text-stone-100"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 12].map((p) => (
                    <option key={p} value={p}>
                      {p} khách
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400 transition"
              >
                Ghi Nhận Chờ Bàn
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MERGE TABLE MODAL */}
      {isMergeModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Gộp Bàn Cho Khách Đoàn Đông
            </h3>
            <p className="text-xs text-stone-500">
              Bạn đang chọn gộp thêm bàn phụ vào <strong>{selectedTable.name}</strong> (Tầng {selectedTable.floor}).
            </p>
            <div className="space-y-2 text-xs">
              <label className="font-medium text-stone-700 dark:text-stone-300">Chọn bàn phụ cần gộp:</label>
              <select
                value={mergeSecondaryId}
                onChange={(e) => setMergeSecondaryId(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
              >
                <option value="">-- Chọn bàn cùng tầng --</option>
                {tables
                  .filter((t) => t.floor === selectedTable.floor && t.id !== selectedTable.id && !t.parentTableId)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Sức chứa: {t.capacity} khách)
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsMergeModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmMerge}
                disabled={!mergeSecondaryId}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-semibold hover:bg-amber-400 disabled:opacity-40"
              >
                Xác Nhận Gộp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOVE TABLE MODAL */}
      {isMoveModalOpen && selectedTable && activeReservationsOnTable[0] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Chuyển Khách Sang Bàn Khác
            </h3>
            <p className="text-xs text-stone-500">
              Khách <strong>{activeReservationsOnTable[0].customerName}</strong> muốn chuyển từ {selectedTable.name}.
            </p>
            <div className="space-y-2 text-xs">
              <label className="font-medium text-stone-700 dark:text-stone-300">Chọn bàn đích chuyển tới:</label>
              <select
                value={targetMoveTableId}
                onChange={(e) => setTargetMoveTableId(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
              >
                <option value="">-- Chọn bàn trống --</option>
                {tables
                  .filter((t) => t.id !== selectedTable.id && t.status === 'available')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Tầng {t.floor} - Max {t.capacity} khách)
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsMoveModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmMove}
                disabled={!targetMoveTableId}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-semibold hover:bg-amber-400 disabled:opacity-40"
              >
                Xác Nhận Chuyển Bàn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
