import React, { useRef } from 'react';
import { Reservation, MenuItem } from '../../types/restaurant';
import { X, Printer, Mail, Download, CheckCircle2, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  menuItems: MenuItem[];
}

export const EInvoiceModal: React.FC<Props> = ({ isOpen, onClose, reservation, menuItems }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `HD-XEOOO-2026-${reservation.id.replace('MB-', '')}`;
  const subtotal = reservation.totalAmount || 450000;
  const vatRate = 0.08;
  const vatAmount = Math.round(subtotal * vatRate);
  const grandTotal = subtotal + vatAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/70 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              Hóa Đơn Điện Tử VAT #{invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Hóa Đơn / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-stone-900 dark:text-stone-100 print:text-black print:p-0">
          {/* Company & Restaurant Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-amber-500">
                XÉOOO PIZZA &amp; PASTA
              </h2>
              <p className="text-[11px] text-stone-500 mt-1">
                Công Ty TNHH Ẩm Thực Ý Xéooo Sài Gòn<br />
                MST: 0317892233 · ĐT: 0903 888 777<br />
                Địa chỉ: Quận 1, TP. Hồ Chí Minh
              </p>
            </div>
            <div className="text-left sm:text-right font-mono space-y-1">
              <div className="text-base font-bold text-stone-800 dark:text-stone-200">HÓA ĐƠN GTGT</div>
              <div className="text-xs text-stone-500">Ký hiệu: 1C26TXX</div>
              <div className="text-xs text-amber-500 font-semibold">Số: {invoiceNumber}</div>
              <div className="text-[11px] text-stone-400">Ngày: {reservation.date}</div>
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Người Mua Hàng</span>
              <div className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5">{reservation.customerName}</div>
              <div className="text-stone-500">{reservation.phone} · {reservation.email}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Thông Tin Bàn</span>
              <div className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                {reservation.tableName} (Tầng {reservation.floor})
              </div>
              <div className="text-stone-500">Khung giờ: {reservation.timeSlot} · {reservation.pax} khách</div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-400 font-semibold text-[11px]">
                <th className="py-2">STT</th>
                <th className="py-2">Tên Món Ăn / Dịch Vụ</th>
                <th className="py-2 text-center">SL</th>
                <th className="py-2 text-right">Đơn Giá</th>
                <th className="py-2 text-right">Thành Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
              {reservation.preOrderItems && reservation.preOrderItems.length > 0 ? (
                reservation.preOrderItems.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 font-mono text-stone-400">{idx + 1}</td>
                    <td className="py-2.5 font-medium">{item.name}</td>
                    <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{item.price.toLocaleString()}đ</td>
                    <td className="py-2.5 text-right font-mono font-semibold">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="py-2">
                    <td className="py-2.5 font-mono text-stone-400">1</td>
                    <td className="py-2.5 font-medium">Bữa Ăn Tiệc Ý Tại Bàn ({reservation.tableName})</td>
                    <td className="py-2.5 text-center font-mono">1</td>
                    <td className="py-2.5 text-right font-mono">{subtotal.toLocaleString()}đ</td>
                    <td className="py-2.5 text-right font-mono font-semibold">{subtotal.toLocaleString()}đ</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* Financial summary */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-4 space-y-2">
            <div className="flex justify-between text-stone-500">
              <span>Cộng tiền hàng (Subtotal):</span>
              <span className="font-mono">{subtotal.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Thuế GTGT (VAT 8%):</span>
              <span className="font-mono">{vatAmount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Tiền cọc đã thanh toán (Deposit):</span>
              <span className="font-mono text-emerald-500">-{(reservation.depositAmount || 0).toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 dark:text-stone-100 border-t border-stone-200 dark:border-stone-800 pt-2">
              <span>Tổng Cộng Thanh Toán:</span>
              <span className="font-mono text-amber-500">
                {(grandTotal - (reservation.depositAmount || 0)).toLocaleString()}đ
              </span>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="grid grid-cols-2 text-center pt-8 text-[11px] text-stone-400">
            <div>
              <div className="font-semibold text-stone-700 dark:text-stone-300">Người Mua Hàng</div>
              <div className="mt-8 text-stone-400">(Ký, ghi rõ họ tên)</div>
            </div>
            <div>
              <div className="font-semibold text-stone-700 dark:text-stone-300">Đại Diện Quán Xéooo</div>
              <div className="mt-6 text-emerald-500 font-mono text-[10px] font-bold">
                [ĐÃ KÝ ĐIỆN TỬ BỞI XÉOOO PIZZA]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
