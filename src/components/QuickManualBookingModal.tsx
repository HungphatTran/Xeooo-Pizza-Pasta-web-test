import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { FloorNumber, DecorationSet, ReservationStatus, EventOccasion } from '../types/restaurant';
import { TIME_SLOTS } from '../data/initialData';
import { X, Check, Sparkles, User, Phone, Users, Clock, MapPin } from 'lucide-react';

interface QuickManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFloor?: FloorNumber;
  defaultTimeSlot?: string;
}

export const QuickManualBookingModal: React.FC<QuickManualBookingModalProps> = ({
  isOpen,
  onClose,
  defaultFloor = 3,
  defaultTimeSlot = '19h00',
}) => {
  const { tables, addReservation, selectedDate } = useRestaurant();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [timeSlot, setTimeSlot] = useState(defaultTimeSlot);
  const [floor, setFloor] = useState<FloorNumber>(defaultFloor);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [pax, setPax] = useState(2);
  const [decorationSet, setDecorationSet] = useState<DecorationSet>('none');
  const [occasion, setOccasion] = useState<EventOccasion>('normal');
  const [specialEventTitle, setSpecialEventTitle] = useState('');
  const [hasBlackboard, setHasBlackboard] = useState(false);
  const [note, setNote] = useState('');
  const [depositAmount, setDepositAmount] = useState(200000);
  const [status, setStatus] = useState<ReservationStatus>('confirmed');

  if (!isOpen) return null;

  // Filter tables by floor
  const floorTables = tables.filter((t) => t.floor === floor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    const chosenTable = tables.find((t) => t.id === selectedTableId) || floorTables[0];

    addReservation({
      customerName,
      phone,
      email: email || `${phone}@guest.mocbistro.vn`,
      date: selectedDate,
      timeSlot,
      pax: Number(pax),
      tableId: chosenTable?.id || (floor === 1 ? 'b_window_1' : 'b2t3'),
      tableName: chosenTable?.name || `Bàn Tầng ${floor}`,
      floor,
      decorationSet,
      occasion,
      specialEventTitle: specialEventTitle.trim() || undefined,
      hasBlackboard,
      blackboardText: hasBlackboard ? specialEventTitle : undefined,
      note: note.trim() || undefined,
      status,
      depositAmount: Number(depositAmount),
      totalAmount: Number(depositAmount) + 450000,
      paymentStatus: 'deposit_paid',
      paymentMethod: 'vietqr',
      preOrderItems: [],
      source: 'manual_staff',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Nhận Bàn Thủ Công (Tại Quán)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Nhập nhanh thông tin khách để hiển thị ngay trên lưới quản lý bàn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tên khách hàng *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="VD: Thu Phương, Đăng, Ngọc Ánh"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Số điện thoại *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="VD: 0985358329"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Time Slot & Pax */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Khung giờ
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Số lượng khách (Pax)
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Khu vực tầng
              </label>
              <select
                value={floor}
                onChange={(e) => {
                  const f = Number(e.target.value) as FloorNumber;
                  setFloor(f);
                  const firstOfFloor = tables.find((t) => t.floor === f);
                  if (firstOfFloor) setSelectedTableId(firstOfFloor.id);
                }}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value={1}>Tầng 1 (Sân Vườn)</option>
                <option value={3}>Tầng 3 (Ấm Cúng & Bàn to)</option>
                <option value={4}>Tầng 4 (Rooftop / VIP)</option>
              </select>
            </div>
          </div>

          {/* Table select & Decor set */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Chọn bàn
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  {floorTables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.capacity} pax) - {t.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Gói Set Trang Trí (Cơ sở Đội Cấn)
              </label>
              <select
                value={decorationSet}
                onChange={(e) => setDecorationSet(e.target.value as DecorationSet)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="none">Tiệc thường (Không decor)</option>
                <option value="lung_linh">Set Lung Linh (Nến & Hoa - 150k)</option>
                <option value="am_cung">Set Ấm Cúng (Cozy by Xéooo - 100k)</option>
              </select>
            </div>
          </div>

          {/* Occasion inside the set */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Dịp tổ chức (Bao gồm trong Set Ấm Cúng & Lung Linh)
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as EventOccasion)}
              className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              <option value="normal">Ăn uống thông thường</option>
              <option value="birthday">🎂 Sinh nhật (Có mũ, nến, nhạc & giữ bánh)</option>
              <option value="anniversary">💍 Kỷ niệm / Anniversary (Có cánh hoa & thiệp)</option>
              <option value="dating">🥂 Hẹn hò lãng mạn</option>
            </select>
          </div>

          {/* Event title / Note / Blackboard checkbox */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Tên sự kiện / Ghi chú bảng đen
            </label>
            <input
              type="text"
              placeholder='VD: sinh nhật "Thu Phương", "happy moments", "quân iu"'
              value={specialEventTitle}
              onChange={(e) => setSpecialEventTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBlackboard}
                onChange={(e) => setHasBlackboard(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Kèm bảng đen viết phấn tên khách (bảng đen)
              </span>
            </label>
          </div>

          {/* Deposit & Initial Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tiền cọc nhận trước (VNĐ)
              </label>
              <input
                type="number"
                step="50000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Trạng thái xác nhận
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReservationStatus)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="confirmed">Đã xác nhận (Có tick xanh)</option>
                <option value="pending_confirm">Chờ duyệt / Chưa cọc</option>
                <option value="seated">Khách đã vào bàn</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-md shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Nhận Bàn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
