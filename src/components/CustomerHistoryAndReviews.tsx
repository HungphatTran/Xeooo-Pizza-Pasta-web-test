import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Reservation } from '../types/restaurant';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  FileText,
  User,
  Phone,
  QrCode
} from 'lucide-react';

interface CustomerHistoryAndReviewsProps {
  onSelectReservation: (res: Reservation) => void;
  onOpenEmailModal: () => void;
}

export const CustomerHistoryAndReviews: React.FC<CustomerHistoryAndReviewsProps> = ({
  onSelectReservation,
  onOpenEmailModal,
}) => {
  const { reservations, reviews, addReview, menuItems } = useRestaurant();

  const [activeSubTab, setActiveSubTab] = useState<'history' | 'reviews'>('history');
  const [searchPhone, setSearchPhone] = useState('');

  // Review Form state
  const [selectedDishId, setSelectedDishId] = useState(menuItems[0]?.id || '');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter reservations by phone or show recent if search is empty
  const customerReservations = reservations.filter((r) => {
    if (!searchPhone.trim()) return true;
    return r.phone.includes(searchPhone.trim()) || r.customerName.toLowerCase().includes(searchPhone.toLowerCase());
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !comment) return;

    setIsSubmitting(true);
    const chosenDish = menuItems.find((m) => m.id === selectedDishId);

    addReview({
      menuItemId: selectedDishId,
      dishName: chosenDish?.name || 'Món ăn tại quán',
      customerName: reviewerName,
      rating,
      comment,
      verifiedBooking: true,
    });

    setComment('');
    setReviewerName('');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center justify-between p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'history'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Sử Đặt Bàn Khách Hàng</span>
          </button>
          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'reviews'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Đánh Giá Món Ăn & Không Gian</span>
          </button>
        </div>

        <span className="text-xs text-stone-400 font-mono hidden sm:inline">
          {activeSubTab === 'history'
            ? `${customerReservations.length} lượt đặt bàn`
            : `${reviews.length} đánh giá thực tế`}
        </span>
      </div>

      {/* SUB-TAB 1: BOOKING HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {/* Lookup search bar */}
          <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nhập số điện thoại hoặc tên để tra cứu lịch sử đặt bàn..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            {searchPhone && (
              <button
                onClick={() => setSearchPhone('')}
                className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>

          {/* Reservation cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerReservations.map((res) => (
              <div
                key={res.id}
                className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-3 hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-500">#{res.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-medium text-stone-600 dark:text-stone-300">
                        {res.status === 'confirmed'
                          ? 'Đã xác nhận'
                          : res.status === 'seated'
                          ? 'Đã vào bàn'
                          : res.status === 'completed'
                          ? 'Đã hoàn tất'
                          : 'Chờ duyệt'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      {res.customerName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      {res.depositAmount.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="block text-[10px] text-stone-400 uppercase">Cọc đã trả</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{res.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{res.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{res.tableName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-mono">{res.phone}</span>
                  </div>
                </div>

                {(res.decorationSet !== 'none' || res.specialEventTitle) && (
                  <div className="p-2 bg-amber-500/10 rounded-lg text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">
                      {res.decorationSet} {res.specialEventTitle ? `· "${res.specialEventTitle}"` : ''}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => onSelectReservation(res)}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Xem Hóa Đơn & Check-in Pass</span>
                  </button>

                  <button
                    onClick={onOpenEmailModal}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    title="Xem email xác nhận"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DISH REVIEWS & RATING FORM */}
      {activeSubTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review creation form */}
          <div className="lg:col-span-1 p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                Gửi Đánh Giá Của Bạn
              </h3>
              <p className="text-xs text-stone-500">
                Ý kiến của quý khách giúp nhà hàng không ngừng nâng cao chất lượng
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Chọn món ăn muốn đánh giá
                </label>
                <select
                  value={selectedDishId}
                  onChange={(e) => setSelectedDishId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Họ tên quý khách
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thu Phương"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Mức độ hài lòng ({rating} sao)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nhận xét chi tiết
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm về hương vị món ăn, cách phục vụ, ánh sáng bàn tiệc..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Gửi Nhận Xét</span>
              </button>
            </form>
          </div>

          {/* List of existing customer reviews */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span>Đánh Giá Từ Thực Khách Đã Trải Nghiệm</span>
              <span className="text-xs font-normal text-stone-500 font-mono">
                {reviews.length} đánh giá
              </span>
            </h3>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs flex items-center justify-center">
                        {rev.customerName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                            {rev.customerName}
                          </span>
                          {rev.verifiedBooking && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Đã dùng bữa</span>
                            </span>
                          )}
                        </div>
                        {rev.dishName && (
                          <span className="text-[11px] text-stone-500 block">
                            Món: {rev.dishName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-200 dark:text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="text-[10px] text-stone-400 font-mono">
                    Ngày đánh giá: {rev.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
