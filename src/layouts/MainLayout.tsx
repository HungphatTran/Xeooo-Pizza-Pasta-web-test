import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Breadcrumbs, BreadcrumbItem } from '../components/common/Breadcrumbs';
import { AIChatbotDrawer } from '../components/common/AIChatbotDrawer';
import { OfflineIndicator } from '../components/common/OfflineIndicator';
import { OnboardingTour } from '../components/common/OnboardingTour';
import { CommandPalette } from '../components/common/CommandPalette';
import { QuickManualBookingModal } from '../components/QuickManualBookingModal';
import { ReservationDetailModal } from '../components/ReservationDetailModal';
import { EmailConfirmationModal } from '../components/EmailConfirmationModal';
import { CloudBackupModal } from '../components/CloudBackupModal';
import { StaffLoginModal } from '../components/StaffLoginModal';
import { useRestaurant } from '../context/RestaurantContext';
import { FloorNumber, Reservation, UserRole } from '../types/restaurant';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const TAB_BREADCRUMB_MAP: Record<string, string> = {
  booking: 'Đặt Bàn Trực Tuyến',
  qrmenu: 'Thực Đơn Điện Tử QR',
  tracker: 'Theo Dõi Món Tại Bàn',
  loyalty: 'Ưu Đãi & Hội Viên',
  floormap: 'Sơ Đồ Bàn (T1 · T3 · T4)',
  history: 'Tra Cứu & Đánh Giá',
  schedule: 'Khung Nhận Bàn Theo Giờ',
  kds: 'Kitchen Display System (KDS)',
  orders: 'Quản Lý Đơn Gọi & Split Bill',
  revenue: 'Doanh Thu & AI Suite',
  inventory: 'Kho & Định Lượng Món',
  staff_hr: 'Nhân Sự, Chấm Công & KPI',
  settings: 'Cài Đặt Hệ Thống',
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const {
    activeNavTab,
    setActiveNavTab,
    notifications,
    dismissNotification,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
  } = useRestaurant();

  // Modals state
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [quickBookingFloor, setQuickBookingFloor] = useState<FloorNumber>(3);
  const [quickBookingSlot, setQuickBookingSlot] = useState<string>('19h00');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: TAB_BREADCRUMB_MAP[activeNavTab] || 'Phân Hệ',
      tabId: activeNavTab,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        onOpenStaffLogin={() => setIsStaffLoginOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Breadcrumbs items={breadcrumbItems} onNavigate={(tab) => setActiveNavTab(tab)} />
        {children}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-stone-200 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/60 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif font-medium text-stone-700 dark:text-stone-300">
            © 2026 Xéooo Pizza &amp; Pasta · Cơ sở Đội Cấn.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>Hệ thống đặt bàn &amp; vận hành thời gian thực · Cổng VietQR NAPAS</span>
            <span>·</span>
            <a
              href="/xeooo_pizza_pasta_source.zip"
              download="xeooo_pizza_pasta_source.zip"
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline inline-flex items-center gap-1"
              title="Tải toàn bộ file mã nguồn dự án"
            >
              📥 Tải mã nguồn (.ZIP)
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive Utilities */}
      <AIChatbotDrawer />
      <OfflineIndicator />
      <OnboardingTour />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveNavTab(tab)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenStaffLogin={() => setIsStaffLoginOpen(true)}
      />

      <QuickManualBookingModal
        isOpen={isQuickBookingOpen}
        onClose={() => setIsQuickBookingOpen(false)}
        defaultFloor={quickBookingFloor}
        defaultTimeSlot={quickBookingSlot}
      />

      <ReservationDetailModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
      />

      <EmailConfirmationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

      <CloudBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      <StaffLoginModal
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
        onSuccess={(role: UserRole) => {
          setIsStaffLoginOpen(false);
          if (role === 'manager') setActiveNavTab('revenue');
          else setActiveNavTab('schedule');
        }}
      />

      {/* Global Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 text-xs animate-in slide-in-from-right duration-200 ${
              n.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500/30 text-emerald-900 dark:text-emerald-100'
                : n.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500/30 text-amber-900 dark:text-amber-100'
                : n.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500/30 text-rose-900 dark:text-rose-100'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
            }`}
          >
            {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
            {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
            {n.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
            {n.type === 'info' && <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-0.5">
              <div className="font-bold">{n.title}</div>
              <div className="text-[11px] opacity-85 leading-relaxed">{n.message}</div>
            </div>

            <button
              onClick={() => dismissNotification(n.id)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
