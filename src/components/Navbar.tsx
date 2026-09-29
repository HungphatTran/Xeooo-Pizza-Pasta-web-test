import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { translations } from '../utils/i18n';
import { PWAInstallButton } from './common/PWAInstallButton';
import {
  Sun,
  Moon,
  Globe,
  Wifi,
  WifiOff,
  Cloud,
  ShieldCheck,
  CalendarCheck,
  Grid3X3,
  MapPin,
  UtensilsCrossed,
  Search,
  BarChart3,
  Menu as MenuIcon,
  X,
  Mail,
  Lock,
  LogOut,
  Sparkles,
  ChefHat,
  Package,
  Users,
  Settings,
  QrCode,
  Tag,
  Command,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBackupModal: () => void;
  onOpenEmailModal: () => void;
  onOpenStaffLogin: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBackupModal,
  onOpenEmailModal,
  onOpenStaffLogin,
  onOpenCommandPalette,
}) => {
  const {
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    isOnline,
    setCommandPaletteOpen,
    addToast,
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define role-specific navigation links
  const getNavItems = () => {
    if (currentRole === 'customer') {
      return [
        { id: 'booking', label: 'Đặt Bàn Trực Tuyến', icon: CalendarCheck },
        { id: 'qrmenu', label: 'Thực Đơn QR', icon: QrCode },
        { id: 'tracker', label: 'Theo Dõi Món', icon: Sparkles },
        { id: 'loyalty', label: 'Ưu Đãi & Hội Viên', icon: Tag },
        { id: 'floormap', label: 'Sơ Đồ Bàn (T1 · T3 · T4)', icon: MapPin },
        { id: 'history', label: 'Tra Cứu & Đánh Giá', icon: Search },
      ];
    }

    if (currentRole === 'staff' || currentRole === 'cashier') {
      return [
        { id: 'schedule', label: 'Khung Giờ (Matrix)', icon: Grid3X3 },
        { id: 'kds', label: 'Bếp Trực Tiếp (KDS)', icon: ChefHat },
        { id: 'floormap', label: 'Sơ Đồ & Gộp Bàn', icon: MapPin },
        { id: 'orders', label: 'Đơn Gọi & Split Bill', icon: UtensilsCrossed },
        { id: 'inventory', label: 'Kho Nguyên Liệu', icon: Package },
        { id: 'staff_hr', label: 'Ca Trực & Chấm Công', icon: Users },
        { id: 'booking', label: 'Tạo Đơn Đặt Bàn', icon: CalendarCheck },
      ];
    }

    // Manager role: Full access
    return [
      { id: 'schedule', label: 'Khung Giờ', icon: Grid3X3 },
      { id: 'floormap', label: 'Sơ Đồ Bàn', icon: MapPin },
      { id: 'kds', label: 'Bếp KDS', icon: ChefHat },
      { id: 'orders', label: 'Đơn Gọi', icon: UtensilsCrossed },
      { id: 'revenue', label: 'Doanh Thu & AI', icon: BarChart3 },
      { id: 'inventory', label: 'Kho & Định Lượng', icon: Package },
      { id: 'staff_hr', label: 'Nhân Sự & Lương', icon: Users },
      { id: 'loyalty', label: 'Khuyến Mãi', icon: Tag },
      { id: 'booking', label: 'Khách Đặt Bàn', icon: CalendarCheck },
      { id: 'settings', label: 'Cài Đặt', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const handleRoleChange = (role: typeof currentRole) => {
    if (role === 'manager' || role === 'staff' || role === 'cashier') {
      onOpenStaffLogin();
    } else {
      setCurrentRole('customer');
      setActiveTab('booking');
      addToast('Chuyển quyền', 'Đã về chế độ Khách Hàng đặt bàn.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* ZONE 1: BRAND LOGO */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab(currentRole === 'customer' ? 'booking' : 'schedule')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-stone-900 border border-amber-500/40 p-1 flex items-center justify-center shadow-md group-hover:border-amber-500 transition">
                <img src="/icon.svg" alt="Xéooo Pizza Logo" className="w-full h-full object-contain" />
              </div>
              <div className="hidden xs:block">
                <div className="font-serif font-bold text-base sm:text-lg tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-500 transition">
                  Xéooo Pizza &amp; Pasta
                </div>
                <div className="text-[10px] text-stone-500 tracking-wider font-mono">
                  Đội Cấn · Tầng 1, 3 &amp; 4
                </div>
              </div>
            </button>
          </div>

          {/* ZONE 2: DESKTOP NAVIGATION TABS */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-2xl py-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: ACTIONS & UTILITIES */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                if (onOpenCommandPalette) onOpenCommandPalette();
                else setCommandPaletteOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 text-xs font-mono transition"
              title="Tìm kiếm & thanh lệnh (Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px]">Ctrl+K</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
              title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="px-2 py-1 rounded-xl text-xs font-mono font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
              title="Đổi ngôn ngữ"
            >
              {language.toUpperCase()}
            </button>

            {/* Role indicator & Login Modal trigger */}
            {currentRole === 'customer' ? (
              <button
                onClick={() => onOpenStaffLogin()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-700 dark:text-stone-300 font-semibold text-xs transition"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Nhân Viên</span>
              </button>
            ) : (
              <button
                onClick={() => handleRoleChange('customer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 font-semibold text-xs transition"
                title="Đăng xuất về chế độ Khách Hàng"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="uppercase">{currentRole}</span>
                <LogOut className="w-3 h-3 ml-0.5" />
              </button>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 dark:border-stone-800 space-y-2 animate-in slide-in-from-top-2 text-xs">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl font-medium flex items-center gap-2 transition ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
