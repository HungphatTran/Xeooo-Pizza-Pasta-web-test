import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  Sparkles,
  Tag,
  Gift,
  Award,
  Users,
  Clock,
  Flame,
  Copy,
  Check,
  Percent,
  CreditCard,
  Share2,
} from 'lucide-react';

export const LoyaltyPromotionsPage: React.FC = () => {
  const { combos, coupons, customers, applyCouponCode, appliedCoupon, addToast } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'vouchers' | 'combos' | 'tiers' | 'giftcards' | 'referral'>('vouchers');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [inputCoupon, setInputCoupon] = useState('');

  // Sample active member (first customer in list)
  const currentMember = customers[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast('Đã sao chép mã', `Mã [${code}] đã được lưu vào bộ nhớ tạm.`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code: string) => {
    const res = applyCouponCode(code, 400000);
    if (res.success) {
      addToast('Áp dụng thành công', res.message, 'success');
    } else {
      addToast('Không thể áp dụng', res.message, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Ưu Đãi, Hạng Thành Viên &amp; Combo Đặc Biệt</span>
            <span className="text-xs font-sans font-semibold bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Member Club
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Tích điểm nâng hạng Bạc, Vàng, Bạch Kim, mã giảm giá Flash Sale, Happy Hour và quà tặng bạn bè
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 'vouchers', label: 'Kho Voucher / Coupon' },
            { id: 'combos', label: 'Combo Món Tiết Kiệm' },
            { id: 'tiers', label: 'Hạng Thành Viên' },
            { id: 'giftcards', label: 'Thẻ Quà Tặng (Gift Card)' },
            { id: 'referral', label: 'Giới Thiệu Bạn Bè' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Member summary widget */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white border border-stone-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-bold text-xl shadow-md">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-serif font-bold text-lg">{currentMember.name}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                Hạng {currentMember.tier.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Số điện thoại: {currentMember.phone} · Đã ghé thăm {currentMember.visitCount} lần
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-stone-700 pt-3 sm:pt-0 sm:pl-6 text-center sm:text-left">
          <div>
            <div className="text-[11px] text-stone-400">Điểm Tích Lũy</div>
            <div className="font-mono text-2xl font-bold text-amber-400">{currentMember.points} Pts</div>
          </div>
          <div>
            <div className="text-[11px] text-stone-400">Tổng Chi Tiêu</div>
            <div className="font-mono text-lg font-bold text-emerald-400">
              {currentMember.totalSpent.toLocaleString()}đ
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Flash sale & Happy hour alert */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 to-amber-500/10 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Happy Hour (14:00 - 17:00 Hàng Ngày):
                </span>
                <p className="text-stone-600 dark:text-stone-300">
                  Giảm ngay 15% cho tất cả món Pizza &amp; Trà thảo mộc khi dùng bữa khung giờ chiều tại quán.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-lg">
              Áp dụng tự động
            </span>
          </div>

          {/* Vouchers list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((cpn) => {
              const isCopied = copiedCode === cpn.code;
              const isApplied = appliedCoupon?.code === cpn.code;
              return (
                <div
                  key={cpn.code}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {cpn.title}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Đơn tối thiểu: {cpn.minOrderValue.toLocaleString()}đ · Hạn dùng: {cpn.validUntil}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {cpn.code}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                    <button
                      onClick={() => handleCopy(cpn.code)}
                      className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1.5 font-medium transition"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Đã Sao Chép' : 'Sao Chép Mã'}</span>
                    </button>
                    <button
                      onClick={() => handleApply(cpn.code)}
                      className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                      }`}
                    >
                      {isApplied ? 'Đang Dùng' : 'Áp Dụng Ngay'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COMBOS */}
      {activeTab === 'combos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between text-xs"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-bold px-2.5 py-0.5 rounded-full text-[10px] shadow-sm">
                  {combo.tag}
                </span>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {combo.name}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{combo.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="line-through text-stone-400 font-mono text-[11px] block">
                      {combo.originalPrice.toLocaleString()}đ
                    </span>
                    <span className="font-serif text-lg font-bold text-amber-500 font-mono">
                      {combo.comboPrice.toLocaleString()}đ
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addToast('Đặt combo', `Đã thêm [${combo.name}] vào thực đơn bàn tiệc`, 'success');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold transition"
                  >
                    Chọn Combo Này
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TIERS */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          {[
            {
              tier: 'Bạc (Silver Member)',
              pts: '0 - 199 Pts',
              color: 'from-stone-300 to-stone-400',
              perks: ['Tích 5% điểm trên mỗi hóa đơn', 'Tặng 1 ly Mocktail ngày sinh nhật', 'Ưu tiên xếp bàn trước'],
            },
            {
              tier: 'Vàng (Gold Member)',
              pts: '200 - 399 Pts',
              color: 'from-amber-400 to-amber-500',
              perks: [
                'Tích 8% điểm trên mỗi hóa đơn',
                'Giảm 10% gói decor tiệc lãng mạn',
                'Miễn phí đổi món hoặc tráng miệng',
                'Tặng bánh kem sinh nhật cỡ nhỏ',
              ],
            },
            {
              tier: 'Bạch Kim (Platinum VIP)',
              pts: '400+ Pts',
              color: 'from-stone-100 to-amber-200',
              perks: [
                'Tích 12% điểm trên mỗi hóa đơn',
                'Miễn phí 100% gói trang trí tiệc Lung Linh',
                'Ưu tiên tuyệt đối bàn Lồng Kính View Phố Tầng 3',
                'Tặng 1 chai vang đỏ Ý thượng hạng trong tháng sinh nhật',
              ],
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 text-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">{t.tier}</span>
                  <span className="text-[11px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                    {t.pts}
                  </span>
                </div>
                <div className="space-y-1.5 pt-2">
                  {t.perks.map((p, pi) => (
                    <div key={pi} className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: GIFT CARDS */}
      {activeTab === 'giftcards' && (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-5 text-xs">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Thẻ Quà Tặng Ẩm Thực (E-Gift Card)
              </h3>
              <p className="text-stone-500">Món quà hoàn hảo gửi tặng người thương, gia đình và đồng nghiệp</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950 text-white space-y-4 shadow-xl border border-amber-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-amber-400 font-mono">XÉOOO DINING CARD</span>
                <div className="font-serif text-xl font-bold mt-1">500.000 VNĐ</div>
              </div>
              <span className="text-xl">🍕</span>
            </div>
            <div className="flex justify-between items-end font-mono text-xs text-stone-400">
              <div>MÃ: XEOOO-GIFT-8899</div>
              <div>HSD: 31/12/2026</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REFERRAL */}
      {activeTab === 'referral' && (
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-4 text-xs text-center">
          <Share2 className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            Giới Thiệu Bạn Bè - Cùng Nhận Quà Xéooo
          </h3>
          <p className="text-stone-500 leading-relaxed">
            Chia sẻ mã giới thiệu của bạn cho bạn bè. Khi bạn bè đặt bàn lần đầu, họ nhận ngay voucher 50K và bạn được cộng 100 điểm thưởng!
          </p>
          <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl font-mono text-base font-bold text-amber-500 flex items-center justify-center gap-3">
            <span>{currentMember.referralCode}</span>
            <button
              onClick={() => handleCopy(currentMember.referralCode)}
              className="text-stone-400 hover:text-stone-200"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
