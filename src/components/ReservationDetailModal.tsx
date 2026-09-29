import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Reservation, ReservationStatus } from '../types/restaurant';
import {
  X,
  Printer,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Sparkles,
  UtensilsCrossed,
  CreditCard,
  Trash2,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { triggerPrintReport } from '../utils/export';

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  onClose: () => void;
  onOpenEmailModal: () => void;
}

export const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  reservation,
  onClose,
  onOpenEmailModal,
}) => {
  const { updateReservationStatus, deleteReservation, currentRole } = useRestaurant();

  if (!reservation) return null;

  const handleStatusChange = (newStatus: ReservationStatus) => {
    updateReservationStatus(reservation.id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn đặt bàn #${reservation.id}?`)) {
      deleteReservation(reservation.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-amber-500">
                #{reservation.id}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {reservation.status === 'confirmed'
                  ? 'Đã xác nhận'
                  : reservation.status === 'seated'
                  ? 'Đang ngồi bàn'
                  : reservation.status === 'completed'
                  ? 'Đã hoàn tất'
                  : 'Chờ duyệt'}
              </span>
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              Chi Tiết Phiếu Đặt Bàn & Thanh Toán
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass / Invoice Card */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Main Info Box */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-stone-400" />
                <strong className="text-sm text-stone-900 dark:text-stone-100">
                  {reservation.customerName}
                </strong>
              </div>
              <span className="font-mono text-xs text-stone-500">{reservation.pax} Pax</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-mono">{reservation.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-mono font-medium">{reservation.timeSlot}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{reservation.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {reservation.tableName} (Tầng {reservation.floor})
                </span>
              </div>
            </div>
          </div>

          {/* Decor set & Special Event Note */}
          {(reservation.decorationSet !== 'none' || reservation.specialEventTitle) && (
            <div className="p-3 bg-amber-500/10 rounded-xl text-xs space-y-1">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Gói trang trí: {reservation.decorationSet}</span>
              </div>
              {reservation.specialEventTitle && (
                <p className="text-stone-700 dark:text-stone-300 italic">
                  Chủ đề: "{reservation.specialEventTitle}"
                </p>
              )}
              {reservation.hasBlackboard && (
                <span className="inline-block text-[11px] font-semibold text-stone-500">
                  * Kèm bảng đen viết tên
                </span>
              )}
            </div>
          )}

          {/* Pre-ordered dishes */}
          {reservation.preOrderItems.length > 0 && (
            <div className="space-y-1.5 p-3 border border-stone-200 dark:border-stone-700 rounded-xl">
              <span className="font-semibold text-stone-500 flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Món ăn gọi trước:</span>
              </span>
              {reservation.preOrderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-mono text-stone-500 tabular-nums">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Payment & Deposit Summary */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Tiền cọc đã trả:</span>
              <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                {reservation.depositAmount.toLocaleString('vi-VN')} đ ({reservation.paymentMethod})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Ước tính tổng hóa đơn:</span>
              <strong className="font-mono text-stone-900 dark:text-stone-100">
                {reservation.totalAmount.toLocaleString('vi-VN')} đ
              </strong>
            </div>
            <div className="flex justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-700">
              <span>Còn lại cần thanh toán khi dùng bữa:</span>
              <span className="font-mono font-medium">
                {Math.max(0, reservation.totalAmount - reservation.depositAmount).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Staff controls for status update */}
          {currentRole !== 'customer' && (
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="font-semibold text-stone-500 block">Cập nhật tiến độ phục vụ:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-colors ${
                    reservation.status === 'confirmed'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Đã duyệt
                </button>
                <button
                  onClick={() => handleStatusChange('seated')}
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-colors ${
                    reservation.status === 'seated'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Đã vào bàn
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-colors ${
                    reservation.status === 'completed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Thanh toán xong
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-colors ${
                    reservation.status === 'cancelled'
                      ? 'bg-red-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Hủy đơn
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <button
                onClick={triggerPrintReport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Bill / PDF</span>
              </button>

              <button
                onClick={onOpenEmailModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Xem Thư Email</span>
              </button>
            </div>

            {currentRole !== 'customer' && (
              <button
                onClick={handleDelete}
                className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Hủy đơn này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
