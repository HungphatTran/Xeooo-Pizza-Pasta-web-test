import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { TableItem, FloorNumber, DecorationSet, PreOrderItem, PaymentMethod, EventOccasion } from '../types/restaurant';
import { TIME_SLOTS } from '../data/initialData';
import { FloorPlanVisualizer } from './FloorPlanVisualizer';
import { PaymentModal } from './PaymentModal';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Mail,
  Heart,
  Plus,
  Minus
} from 'lucide-react';

interface CustomerBookingFlowProps {
  onSuccess: (bookingId: string) => void;
  onOpenEmailModal: () => void;
}

export const CustomerBookingFlow: React.FC<CustomerBookingFlowProps> = ({
  onSuccess,
  onOpenEmailModal,
}) => {
  const {
    tables,
    menuItems,
    addReservation,
    selectedDate,
    setSelectedDate,
  } = useRestaurant();

  // Wizard Step State (1: Date & Time, 2: Floor & Table, 3: Decor, 4: Pre-order, 5: Contact Info)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [timeSlot, setTimeSlot] = useState('19h00');
  const [pax, setPax] = useState(2);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [decorationSet, setDecorationSet] = useState<DecorationSet>('lung_linh');
  const [occasion, setOccasion] = useState<EventOccasion>('birthday');
  const [specialEventTitle, setSpecialEventTitle] = useState('');
  const [hasBlackboard, setHasBlackboard] = useState(true);
  const [preOrderItems, setPreOrderItems] = useState<PreOrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  // Payment Modal Trigger
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [completedBookingId, setCompletedBookingId] = useState<string | null>(null);

  // Calculation: Exactly 2 sets at Xéooo Đội Cấn: am_cung (100k) & lung_linh (150k).
  // Birthday / Anniversary are celebration occasions included inside the sets!
  const decorPrice = decorationSet === 'lung_linh' ? 150000 : decorationSet === 'am_cung' ? 100000 : 0;
  const foodTotal = preOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const depositRequired = 200000 + (pax > 4 ? 300000 : 0);
  const estimatedTotal = depositRequired + decorPrice + foodTotal;

  // Handle adding pre-order items
  const handlePreOrderChange = (item: typeof menuItems[0], delta: number) => {
    setPreOrderItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((i) => i.menuItemId !== item.id);
        }
        return prev.map((i) => (i.menuItemId === item.id ? { ...i, quantity: newQty } : i));
      } else if (delta > 0) {
        return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
      }
      return prev;
    });
  };

  // Trigger Online Payment
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;
    setShowPaymentModal(true);
  };

  // Payment Success callback from gateway
  const handlePaymentSuccess = (transactionId: string) => {
    setShowPaymentModal(false);

    const targetTable = selectedTable || tables.find((t) => t.floor === 3) || tables[0];

    const newRes = addReservation({
      customerName,
      phone,
      email: email || `${phone}@guest.mocbistro.vn`,
      date: selectedDate,
      timeSlot,
      pax,
      tableId: targetTable.id,
      tableName: targetTable.name,
      floor: targetTable.floor,
      decorationSet,
      occasion,
      specialEventTitle: specialEventTitle.trim() || undefined,
      hasBlackboard,
      blackboardText: hasBlackboard ? specialEventTitle : undefined,
      note: note.trim() || undefined,
      status: 'confirmed',
      depositAmount: depositRequired,
      totalAmount: estimatedTotal,
      paymentStatus: 'deposit_paid',
      paymentMethod: selectedPaymentMethod,
      paymentTransactionId: transactionId,
      preOrderItems,
      source: 'online',
    });

    setCompletedBookingId(newRes.id);
    onSuccess(newRes.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Booking Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-800 bg-stone-900 text-stone-100 p-6 sm:p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{
            backgroundImage: "url('/src/assets/images/xeooo_artisan_pizza_1790658644475.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cozy by Xéooo · Handmade Pizza, Pasta & Cocktails</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Đặt Bàn Xéooo Pizza & Pasta
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Giữ trước bàn đẹp theo sơ đồ (Bàn Cửa Sổ, Bàn To Tầng 3, Rooftop Lake View), chọn các gói set trang trí hẹn hò nến đom đóm "Lung Linh" hoặc "Ấm Cúng" và cọc VietQR nhanh chóng.
          </p>
        </div>
      </div>

      {/* Booking Steps Progress Indicator */}
      <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { num: 1, label: 'Thời gian & Pax' },
            { num: 2, label: 'Chọn bàn sơ đồ' },
            { num: 3, label: 'Gói trang trí' },
            { num: 4, label: 'Gọi món trước' },
            { num: 5, label: 'Thanh toán cọc' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                currentStep === s.num
                  ? 'bg-amber-500/15 text-amber-500 font-bold border border-amber-500/30'
                  : currentStep > s.num
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-stone-400 cursor-not-allowed'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] ${
                  currentStep === s.num
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : currentStep > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation State if finished */}
      {completedBookingId ? (
        <div className="p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Đặt Bàn Thành Công!
            </h3>
            <p className="text-sm text-stone-500">
              Mã xác nhận bàn của quý khách là: <strong className="font-mono text-amber-500 text-base">#{completedBookingId}</strong>
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-left text-xs space-y-2 border border-stone-200 dark:border-stone-700">
            <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
              <span className="text-stone-500">Khách hàng:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{customerName} ({phone})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
              <span className="text-stone-500">Thời gian:</span>
              <span className="font-mono font-medium">{timeSlot}, ngày {selectedDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
              <span className="text-stone-500">Vị trí bàn:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {selectedTable?.name || 'Bàn tầng 3'} ({pax} pax)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Đã thanh toán cọc:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {depositRequired.toLocaleString('vi-VN')} VNĐ (VietQR)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onOpenEmailModal}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Xem Thư Xác Nhận Email</span>
            </button>
            <button
              onClick={() => {
                setCompletedBookingId(null);
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Đặt thêm bàn khác
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* STEP 1: Date, Time & Pax */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Bước 1: Chọn Ngày, Giờ và Số Lượng Khách
                </h3>
                <p className="text-xs text-stone-500">
                  Chọn khung giờ mong muốn để nhà hàng chuẩn bị chu đáo nhất
                </p>
              </div>

              {/* Date selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Chọn ngày dùng bữa</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Pax selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>Số lượng khách (Pax)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPax(num)}
                      className={`w-12 h-10 rounded-lg text-xs font-mono font-bold transition-all ${
                        pax === num
                          ? 'bg-amber-600 text-white shadow-xs scale-105'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Khung giờ đón khách</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-colors ${
                        timeSlot === slot
                          ? 'bg-stone-900 text-amber-400 dark:bg-amber-500 dark:text-stone-950 font-bold border border-amber-500 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-colors"
                >
                  <span>Tiếp tục: Chọn sơ đồ bàn</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Interactive Floor & Table Map */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    Bước 2: Chọn Bàn Trên Sơ Đồ Không Gian
                  </h3>
                  <p className="text-xs text-stone-500">
                    Chọn tầng và click trực tiếp vào bàn bạn muốn đặt
                  </p>
                </div>
                {selectedTable && (
                  <div className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded text-xs font-semibold text-amber-500">
                    Đã chọn: {selectedTable.name} (Tầng {selectedTable.floor})
                  </div>
                )}
              </div>

              <FloorPlanVisualizer
                selectable={true}
                selectedTableId={selectedTable?.id}
                onSelectTable={(table) => setSelectedTable(table)}
              />

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-colors"
                >
                  <span>Tiếp tục: Gói trang trí</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Decoration Set & Occasions */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-semibold text-amber-500 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Xéooo Pizza & Pasta · Cơ Sở Đội Cấn</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Bước 3: Chọn Gói Trang Trí (Set Ấm Cúng & Set Lung Linh)
                </h3>
                <p className="text-xs text-stone-500">
                  Xéooo Đội Cấn phục vụ 2 gói trang trí đặc trưng (Dịp Sinh Nhật & Kỷ Niệm được tích hợp sẵn trong 2 set này)
                </p>
              </div>

              {/* Exactly 2 decoration sets of Xeooo + regular table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: 'lung_linh',
                    name: 'Set Lung Linh',
                    badge: 'Bestseller · Yêu thích nhất',
                    desc: 'Dây đèn đom đóm fairy light lung linh huyền ảo, nến thơm nghệ thuật, cánh hoa hồng rải bàn, ly rượu vang pha lê lấp lánh.',
                    price: 150000,
                    icon: '✨',
                  },
                  {
                    id: 'am_cung',
                    name: 'Set Ấm Cúng',
                    badge: 'Cozy by Xéooo',
                    desc: 'Ánh nến sáp tự nhiên dịu nhẹ, hoa tươi để bàn phong cách mộc mạc Vintage, âm nhạc lofi acoustic nhẹ nhàng, không gian riêng tư ấm áp.',
                    price: 100000,
                    icon: '🕯️',
                  },
                  {
                    id: 'none',
                    name: 'Bàn Tiêu Chuẩn',
                    badge: 'Standard Dining',
                    desc: 'Bàn ăn chuẩn bị sẵn bộ dao nĩa theo món, cốc nến thơm nhỏ xinh miễn phí, không decor cầu kỳ.',
                    price: 0,
                    icon: '🍽️',
                  },
                ].map((decor) => (
                  <div
                    key={decor.id}
                    onClick={() => setDecorationSet(decor.id as DecorationSet)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      decorationSet === decor.id
                        ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-2xl">{decor.icon}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono">
                          {decor.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {decor.name}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                        {decor.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">Phí dịch vụ decor:</span>
                      <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 tabular-nums">
                        {decor.price === 0 ? 'Miễn phí' : `+${decor.price.toLocaleString('vi-VN')} đ`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Celebration Occasions (Birthday & Anniversary are integrated in the sets) */}
              <div className="p-4 bg-stone-50/80 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Dịp tổ chức tiệc (Đã bao gồm trong Set Ấm Cúng & Lung Linh):</span>
                  </label>
                  <span className="text-[11px] text-stone-500 italic">Chọn để quán chuẩn bị chu đáo nhất</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'birthday', label: 'Sinh Nhật (Birthday)', icon: '🎂', note: 'Bao gồm mũ sinh nhật, nến, nhạc chúc mừng & giữ bánh kem' },
                    { id: 'anniversary', label: 'Kỷ Niệm (Anniversary)', icon: '💍', note: 'Kỷ niệm ngày yêu/ngày cưới, rải cánh hoa hồng & thiệp' },
                    { id: 'dating', label: 'Hẹn Hò Lãng Mạn', icon: '🥂', note: 'Bàn hẹn hò đôi ấm áp, nến thơm & âm nhạc dịu êm' },
                    { id: 'normal', label: 'Ăn Uống Thông Thường', icon: '🍕', note: 'Bữa ăn ấm cúng cùng bạn bè, gia đình' },
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccasion(occ.id as EventOccasion)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        occasion === occ.id
                          ? 'border-amber-500 bg-amber-500/15 font-semibold text-stone-900 dark:text-stone-100 ring-1 ring-amber-500'
                          : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <span>{occ.icon}</span>
                        <span className="truncate">{occ.label}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-tight">
                        {occ.note}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Chalkboard Lettering Art Service */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none font-semibold text-stone-800 dark:text-stone-200">
                    <input
                      type="checkbox"
                      checked={hasBlackboard}
                      onChange={(e) => setHasBlackboard(e.target.checked)}
                      className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>
                      Chuẩn bị <strong>Bảng Đen Viết Chữ Phấn Nghệ Thuật</strong> để bàn (Đặc trưng nổi tiếng của Xéooo)
                    </span>
                  </label>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                    Miễn phí
                  </span>
                </div>

                {hasBlackboard && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Tên hoặc lời chúc bạn muốn quán viết nắn nót lên bảng đen:
                      </label>
                      <input
                        type="text"
                        placeholder='Ví dụ: Happy Birthday Thu Phương, Kỷ niệm 1000 days, Đậu iu, minh xuân, quân iu...'
                        value={specialEventTitle}
                        onChange={(e) => setSpecialEventTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Live chalkboard preview */}
                    <div className="p-3 bg-stone-950 rounded-xl border-4 border-amber-900/60 shadow-inner text-center font-serif relative overflow-hidden">
                      <div className="text-[10px] tracking-widest text-amber-300/70 uppercase font-mono mb-1">
                        ★ XÉOOO PIZZA & PASTA · ĐỘI CẤN ★
                      </div>
                      <div className="text-sm sm:text-base font-bold text-amber-200 tracking-wide py-1 drop-shadow-sm">
                        {specialEventTitle.trim() ? `♥ ${specialEventTitle.trim()} ♥` : '♥ Happy Birthday & Cozy Moments ♥'}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono italic">
                        {occasion === 'birthday' ? '🎂 Chúc bạn một ngày sinh nhật thật tuyệt vời!' : occasion === 'anniversary' ? '💍 Chúc mừng kỷ niệm ngày yêu thương!' : '✨ Chúc bạn có bữa tối thật lãng mạn & ấm cúng!'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-colors"
                >
                  <span>Tiếp tục: Thực đơn & Món ăn</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Pre-order Menu Items */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    Bước 4: Đặt Trước Món Ăn & Đồ Uống (Tùy Chọn)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Bếp sẽ chuẩn bị sẵn để món ăn lên nhanh đúng giờ bạn đến quán
                  </p>
                </div>
                {foodTotal > 0 && (
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Tiền món: {foodTotal.toLocaleString('vi-VN')} đ
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map((item) => {
                  const pre = preOrderItems.find((p) => p.menuItemId === item.id);
                  const qty = pre ? pre.quantity : 0;

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-stone-50/50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 flex gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 object-cover rounded-lg shrink-0 bg-stone-200 dark:bg-stone-700"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                          <span className="font-mono text-xs font-bold text-amber-500">
                            {item.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>

                        {/* Quantity buttons */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handlePreOrderChange(item, -1)}
                            disabled={qty === 0}
                            className="w-6 h-6 rounded bg-stone-200 dark:bg-stone-700 disabled:opacity-30 text-stone-800 dark:text-stone-200 flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold tabular-nums w-4 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePreOrderChange(item, 1)}
                            className="w-6 h-6 rounded bg-amber-500 text-stone-950 font-bold flex items-center justify-center hover:bg-amber-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-colors"
                >
                  <span>Tiếp tục: Thông tin & Thanh toán</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Contact Info & Checkout */}
          {currentStep === 5 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6 animate-in fade-in">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Bước 5: Thông Tin Đặt Chỗ & Cổng Thanh Toán Trực Tuyến
                </h3>
                <p className="text-xs text-stone-500">
                  Email xác nhận có mã QR check-in sẽ được gửi tự động ngay khi thanh toán cọc thành công
                </p>
              </div>

              {/* Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Họ và tên quý khách *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Thu Phương"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Số điện thoại nhận tin nhắn *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0985358329"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email nhận vé xác nhận & hóa đơn
                  </label>
                  <input
                    type="email"
                    placeholder="VD: thuphuong.sn@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Ghi chú thêm cho phục vụ
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Xếp bàn gần cửa sổ, chuẩn bị nến trước 10p"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Phương thức thanh toán cọc bảo mật
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'vietqr', label: 'VietQR NAPAS', sub: 'Quét mọi app ngân hàng' },
                    { id: 'momo', label: 'Ví MoMo', sub: 'Xác thực ví nhanh' },
                    { id: 'zalopay', label: 'ZaloPay', sub: 'Thanh toán tức thì' },
                    { id: 'card', label: 'Thẻ Quốc Tế / ATM', sub: 'Visa / Master / JCB' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(m.id as PaymentMethod)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPaymentMethod === m.id
                          ? 'border-amber-500 bg-amber-500/10 shadow-xs ring-1 ring-amber-500'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-500 mb-1" />
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100">{m.label}</div>
                      <div className="text-[10px] text-stone-400">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Breakdown Summary Box */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Tiền cọc giữ bàn ({pax} khách · {timeSlot}):</span>
                  <span className="font-mono tabular-nums">{depositRequired.toLocaleString('vi-VN')} đ</span>
                </div>
                {decorPrice > 0 && (
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Phí gói trang trí ({decorationSet}):</span>
                    <span className="font-mono tabular-nums">{decorPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {foodTotal > 0 && (
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Tiền món gọi trước ({preOrderItems.length} món):</span>
                    <span className="font-mono tabular-nums">{foodTotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-700">
                  <span>Số tiền cần thanh toán cọc ngay:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {depositRequired.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Thanh Toán Cọc & Hoàn Tất Giữ Bàn</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          amount={depositRequired}
          bookingInfo={{
            customerName,
            phone,
            date: selectedDate,
            timeSlot,
            pax,
            table: selectedTable?.name || 'Tầng 3',
          }}
          method={selectedPaymentMethod}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
