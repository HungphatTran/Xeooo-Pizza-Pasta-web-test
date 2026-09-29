import React, { useState } from 'react';
import { OrderManagement } from '../components/OrderManagement';
import { Reservation } from '../types/restaurant';
import { SplitBillModal } from '../components/common/SplitBillModal';
import { EInvoiceModal } from '../components/common/EInvoiceModal';
import { useRestaurant } from '../context/RestaurantContext';
import { Calculator, FileText, CheckCircle2, QrCode } from 'lucide-react';

interface Props {
  onSelectReservation: (res: Reservation) => void;
}

export const OrderManagementPage: React.FC<Props> = ({ onSelectReservation }) => {
  const { reservations, kitchenOrders, menuItems } = useRestaurant();
  const [selectedSplitRes, setSelectedSplitRes] = useState<Reservation | null>(null);
  const [selectedInvoiceRes, setSelectedInvoiceRes] = useState<Reservation | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Quản Lý Đơn Gọi &amp; Phục Vụ Bếp Thời Gian Thực</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi danh sách món ăn đã đặt trước, thêm món nhanh cho bàn đang ngồi, chia hóa đơn (Split Bill) và xuất hóa đơn điện tử
          </p>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              const seatedRes = reservations.find((r) => r.status === 'seated') || reservations[0];
              if (seatedRes) setSelectedSplitRes(seatedRes);
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold flex items-center gap-1.5 transition"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-500" />
            <span>Chia Tiền (Split Bill)</span>
          </button>
          <button
            onClick={() => {
              const compRes = reservations.find((r) => r.status === 'completed' || r.status === 'seated') || reservations[0];
              if (compRes) setSelectedInvoiceRes(compRes);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xuất Hóa Đơn VAT</span>
          </button>
        </div>
      </div>

      {/* Main Order Management List */}
      <OrderManagement onSelectReservation={onSelectReservation} />

      {/* Split Bill Modal */}
      {selectedSplitRes && (
        <SplitBillModal
          isOpen={!!selectedSplitRes}
          onClose={() => setSelectedSplitRes(null)}
          tableName={selectedSplitRes.tableName}
          items={kitchenOrders.filter((k) => k.tableId === selectedSplitRes.tableId)}
        />
      )}

      {/* E-Invoice Modal */}
      {selectedInvoiceRes && (
        <EInvoiceModal
          isOpen={!!selectedInvoiceRes}
          onClose={() => setSelectedInvoiceRes(null)}
          reservation={selectedInvoiceRes}
          menuItems={menuItems}
        />
      )}
    </div>
  );
};
