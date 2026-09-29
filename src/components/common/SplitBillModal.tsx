import React, { useState } from 'react';
import { KitchenOrderItem, PaymentMethod } from '../../types/restaurant';
import { X, Users, Calculator, QrCode, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  items: KitchenOrderItem[];
}

export const SplitBillModal: React.FC<Props> = ({ isOpen, onClose, tableName, items }) => {
  const [splitCount, setSplitCount] = useState<number>(2);
  const [paidParties, setPaidParties] = useState<number[]>([]);
  const [selectedPartyForQR, setSelectedPartyForQR] = useState<number | null>(1);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const perPersonAmount = Math.round(totalAmount / Math.max(1, splitCount));

  const togglePaid = (partyIndex: number) => {
    setPaidParties((prev) =>
      prev.includes(partyIndex) ? prev.filter((p) => p !== partyIndex) : [...prev, partyIndex]
    );
  };

  const currentSplitAmount = selectedPartyForQR ? perPersonAmount : totalAmount;
  // Generate VietQR URL with real VietinBank or Techcombank simulation
  const qrUrl = `https://img.vietqr.io/image/970415-113366668888-compact2.png?amount=${currentSplitAmount}&addInfo=XEOOO%20${tableName.replace(/\s+/g, '')}%20P${selectedPartyForQR}&accountName=XEOOO%20PIZZA%20PASTA`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Chia Tiền Hóa Đơn (Split Bill)
              </h3>
              <p className="text-xs text-stone-500">{tableName} · Tổng hóa đơn: {totalAmount.toLocaleString()}đ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Split Mode Selector */}
          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-stone-800 dark:text-stone-200">Số người cùng chia:</span>
            </div>
            <div className="flex items-center gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setSplitCount(num)}
                  className={`w-8 h-8 rounded-lg font-mono font-semibold transition ${
                    splitCount === num
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Parties List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: splitCount }).map((_, idx) => {
              const partyNum = idx + 1;
              const isPaid = paidParties.includes(partyNum);
              const isSelected = selectedPartyForQR === partyNum;

              return (
                <div
                  key={partyNum}
                  onClick={() => setSelectedPartyForQR(partyNum)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-500/10'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      Khách #{partyNum}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePaid(partyNum);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-500 hover:text-stone-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isPaid ? 'Đã Thanh Toán' : 'Chưa Trả'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-base font-bold text-amber-500">
                    {perPersonAmount.toLocaleString()}đ
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live VietQR section */}
          {selectedPartyForQR && (
            <div className="p-4 bg-stone-50 dark:bg-stone-950/80 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 shrink-0">
                <img
                  src={qrUrl}
                  alt="VietQR Split Bill"
                  className="w-32 h-32 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <QrCode className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    Mã VietQR Cho Khách #{selectedPartyForQR}
                  </span>
                </div>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Quét bằng mọi ứng dụng ngân hàng (Vietcombank, MB, Techcombank, TPBank, MoMo...). Số tiền và nội dung bàn được điền tự động 100%.
                </p>
                <div className="pt-1 font-mono text-xs font-semibold text-amber-500">
                  Số tiền: {perPersonAmount.toLocaleString()}đ · Khách #{selectedPartyForQR}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
