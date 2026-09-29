import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Search,
  Calendar,
  UtensilsCrossed,
  LayoutGrid,
  DollarSign,
  Shield,
  Moon,
  Sun,
  Globe,
  Database,
  ChefHat,
  Package,
  Users,
  Sparkles,
  X,
  CreditCard,
  QrCode,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenBackup: () => void;
  onOpenStaffLogin: () => void;
}

export const CommandPalette: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenBackup,
  onOpenStaffLogin,
}) => {
  const {
    isDarkMode,
    toggleDarkMode,
    language,
    setLanguage,
    reservations,
    tables,
    menuItems,
    currentRole,
    addToast,
  } = useRestaurant();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'nav_booking',
      title: 'Đặt Bàn Trực Tuyến',
      category: 'Điều hướng',
      icon: Calendar,
      action: () => {
        onNavigate('booking');
        onClose();
      },
    },
    {
      id: 'nav_schedule',
      title: 'Khung Nhận Bàn Theo Giờ (Matrix)',
      category: 'Nghiệp vụ nội bộ',
      icon: LayoutGrid,
      action: () => {
        onNavigate('schedule');
        onClose();
      },
    },
    {
      id: 'nav_floormap',
      title: 'Sơ Đồ Bàn & Không Gian Tầng',
      category: 'Nghiệp vụ nội bộ',
      icon: UtensilsCrossed,
      action: () => {
        onNavigate('floormap');
        onClose();
      },
    },
    {
      id: 'nav_kds',
      title: 'Màn Hình Bếp Trực Tiếp (Kitchen KDS)',
      category: 'Bếp & Vận hành',
      icon: ChefHat,
      action: () => {
        onNavigate('kds');
        onClose();
      },
    },
    {
      id: 'nav_tracker',
      title: 'Màn Hình Khách Theo Dõi Món',
      category: 'Khách hàng',
      icon: Sparkles,
      action: () => {
        onNavigate('tracker');
        onClose();
      },
    },
    {
      id: 'nav_inventory',
      title: 'Quản Lý Kho & Định Lượng Món',
      category: 'Quản lý',
      icon: Package,
      action: () => {
        onNavigate('inventory');
        onClose();
      },
    },
    {
      id: 'nav_staff_hr',
      title: 'Quản Lý Ca Làm & Chấm Công',
      category: 'Nhân sự',
      icon: Users,
      action: () => {
        onNavigate('staff_hr');
        onClose();
      },
    },
    {
      id: 'nav_loyalty',
      title: 'Khuyến Mãi & Hạng Thành Viên',
      category: 'Khách hàng',
      icon: CreditCard,
      action: () => {
        onNavigate('loyalty');
        onClose();
      },
    },
    {
      id: 'nav_qrmenu',
      title: 'Menu Điện Tử QR Gọi Món Tại Bàn',
      category: 'Khách hàng',
      icon: QrCode,
      action: () => {
        onNavigate('qrmenu');
        onClose();
      },
    },
    {
      id: 'nav_revenue',
      title: 'Báo Cáo Doanh Thu & AI Dự Báo',
      category: 'Quản lý',
      icon: DollarSign,
      action: () => {
        onNavigate('revenue');
        onClose();
      },
    },
    {
      id: 'act_theme',
      title: isDarkMode ? 'Chuyển sang Giao Diện Sáng (Light Mode)' : 'Chuyển sang Giao Diện Tối (Dark Mode)',
      category: 'Hệ thống',
      icon: isDarkMode ? Sun : Moon,
      action: () => {
        toggleDarkMode();
        addToast('Giao diện', `Đã chuyển sang chế độ ${isDarkMode ? 'sáng' : 'tối'}`);
        onClose();
      },
    },
    {
      id: 'act_lang',
      title: language === 'vi' ? 'Switch to English Language' : 'Chuyển sang Tiếng Việt',
      category: 'Hệ thống',
      icon: Globe,
      action: () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
        addToast('Language', language === 'vi' ? 'Switched to English' : 'Đã chuyển sang Tiếng Việt');
        onClose();
      },
    },
    {
      id: 'act_backup',
      title: 'Sao Lưu & Xuất Dữ Liệu Đám Mây',
      category: 'Hệ thống',
      icon: Database,
      action: () => {
        onOpenBackup();
        onClose();
      },
    },
    {
      id: 'act_login',
      title: currentRole === 'customer' ? 'Đăng Nhập Nhân Viên (PIN ca trực)' : 'Đổi Tài Khoản / Phân Quyền',
      category: 'Bảo mật',
      icon: Shield,
      action: () => {
        onOpenStaffLogin();
        onClose();
      },
    },
  ];

  // Search filtered items
  const filteredActions = quickActions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedReservations = query.trim().length >= 2
    ? reservations
        .filter(
          (r) =>
            r.id.toLowerCase().includes(query.toLowerCase()) ||
            r.customerName.toLowerCase().includes(query.toLowerCase()) ||
            r.phone.includes(query) ||
            r.tableName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const matchedDishes = query.trim().length >= 2
    ? menuItems
        .filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-stone-800 gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm trang, mã đặt bàn, khách hàng, món ăn hoặc gõ lệnh... (ESC để đóng)"
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Matched Bookings */}
          {matchedReservations.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 px-3 py-1">
                Đặt Bàn Khớp ({matchedReservations.length})
              </div>
              {matchedReservations.map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    onNavigate('schedule');
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/80 cursor-pointer transition text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      #{res.id}
                    </span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">{res.customerName}</span>
                    <span className="text-stone-400">· {res.phone}</span>
                  </div>
                  <div className="text-stone-500 dark:text-stone-400">
                    {res.tableName} · {res.timeSlot}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Matched Dishes */}
          {matchedDishes.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 px-3 py-1">
                Món Ăn ({matchedDishes.length})
              </div>
              {matchedDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => {
                    onNavigate('qrmenu');
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/80 cursor-pointer transition text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-medium text-stone-900 dark:text-stone-100">{dish.name}</span>
                  </div>
                  <span className="font-mono text-stone-600 dark:text-stone-300">
                    {dish.price.toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Actions & Navigation */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 px-3 py-1">
              Hành Động Nhanh & Điều Hướng
            </div>
            {filteredActions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition text-xs text-stone-700 dark:text-stone-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-stone-900 dark:text-stone-100">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                    {item.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 font-mono text-[10px]">Ctrl</kbd> +{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 font-mono text-[10px]">K</kbd> Mở thanh lệnh
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 font-mono text-[10px]">ESC</kbd> Đóng
            </span>
          </div>
          <span className="text-amber-500 font-medium">Xéooo FastPOS v4.0</span>
        </div>
      </div>
    </div>
  );
};
