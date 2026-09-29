import React, { lazy, Suspense } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CardSkeleton } from './components/common/LoadingSkeleton';
import { MainLayout } from './layouts/MainLayout';
import { UserRole } from './types/restaurant';
import { Lock } from 'lucide-react';

// Lazy loaded page modules for optimal bundle code splitting and speed
const BookingPage = lazy(() => import('./pages/BookingPage').then((m) => ({ default: m.BookingPage })));
const SchedulePage = lazy(() => import('./pages/SchedulePage').then((m) => ({ default: m.SchedulePage })));
const FloorPlanPage = lazy(() => import('./pages/FloorPlanPage').then((m) => ({ default: m.FloorPlanPage })));
const KitchenKDSPage = lazy(() => import('./pages/KitchenKDSPage').then((m) => ({ default: m.KitchenKDSPage })));
const CustomerOrderTrackerPage = lazy(() => import('./pages/CustomerOrderTrackerPage').then((m) => ({ default: m.CustomerOrderTrackerPage })));
const OrderManagementPage = lazy(() => import('./pages/OrderManagementPage').then((m) => ({ default: m.OrderManagementPage })));
const RevenueAnalyticsPage = lazy(() => import('./pages/RevenueAnalyticsPage').then((m) => ({ default: m.RevenueAnalyticsPage })));
const InventoryPage = lazy(() => import('./pages/InventoryPage').then((m) => ({ default: m.InventoryPage })));
const StaffHRPage = lazy(() => import('./pages/StaffHRPage').then((m) => ({ default: m.StaffHRPage })));
const LoyaltyPromotionsPage = lazy(() => import('./pages/LoyaltyPromotionsPage').then((m) => ({ default: m.LoyaltyPromotionsPage })));
const CustomerHistoryPage = lazy(() => import('./pages/CustomerHistoryPage').then((m) => ({ default: m.CustomerHistoryPage })));
const QRMenuPage = lazy(() => import('./pages/QRMenuPage').then((m) => ({ default: m.QRMenuPage })));
const SystemSettingsPage = lazy(() => import('./pages/SystemSettingsPage').then((m) => ({ default: m.SystemSettingsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const ForbiddenPage = lazy(() => import('./pages/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage })));

function ProtectedRoute({
  allowedRoles,
  currentRole,
  onRequireLogin,
  onFallback,
  children,
}: {
  allowedRoles: UserRole[];
  currentRole: UserRole;
  onRequireLogin: () => void;
  onFallback: () => void;
  children: React.ReactNode;
}) {
  if (!allowedRoles.includes(currentRole)) {
    return <ForbiddenPage onGoHome={onFallback} onLogin={onRequireLogin} />;
  }
  return <>{children}</>;
}

function PageRouter() {
  const { currentRole, activeNavTab, setActiveNavTab } = useRestaurant();

  const handleOpenStaffLogin = () => {
    // Triggers login modal in MainLayout via state
    const staffBtn = document.querySelector('[title*="Đổi Tài Khoản"]') as HTMLElement;
    staffBtn?.click();
  };

  return (
    <Suspense fallback={<CardSkeleton count={3} />}>
      {activeNavTab === 'booking' && (
        <BookingPage
          onOpenEmailModal={() => {}}
          onNavigateToTab={(tab) => setActiveNavTab(tab)}
        />
      )}

      {activeNavTab === 'qrmenu' && <QRMenuPage />}

      {activeNavTab === 'tracker' && <CustomerOrderTrackerPage />}

      {activeNavTab === 'loyalty' && <LoyaltyPromotionsPage />}

      {activeNavTab === 'floormap' && <FloorPlanPage />}

      {activeNavTab === 'history' && (
        <CustomerHistoryPage
          onSelectReservation={() => {}}
          onOpenEmailModal={() => {}}
        />
      )}

      {activeNavTab === 'schedule' && (
        <ProtectedRoute
          allowedRoles={['staff', 'cashier', 'manager']}
          currentRole={currentRole}
          onRequireLogin={handleOpenStaffLogin}
          onFallback={() => setActiveNavTab('booking')}
        >
          <SchedulePage
            onOpenQuickBooking={() => {}}
            onSelectReservation={() => {}}
          />
        </ProtectedRoute>
      )}

      {activeNavTab === 'kds' && (
        <ProtectedRoute
          allowedRoles={['staff', 'cashier', 'manager']}
          currentRole={currentRole}
          onRequireLogin={handleOpenStaffLogin}
          onFallback={() => setActiveNavTab('booking')}
        >
          <KitchenKDSPage />
        </ProtectedRoute>
      )}

      {activeNavTab === 'orders' && (
        <ProtectedRoute
          allowedRoles={['staff', 'cashier', 'manager']}
          currentRole={currentRole}
          onRequireLogin={handleOpenStaffLogin}
          onFallback={() => setActiveNavTab('booking')}
        >
          <OrderManagementPage onSelectReservation={() => {}} />
        </ProtectedRoute>
      )}

      {activeNavTab === 'revenue' && (
        <ProtectedRoute
          allowedRoles={['manager']}
          currentRole={currentRole}
          onRequireLogin={handleOpenStaffLogin}
          onFallback={() => setActiveNavTab('booking')}
        >
          <RevenueAnalyticsPage />
        </ProtectedRoute>
      )}

      {activeNavTab === 'inventory' && (
        <ProtectedRoute
          allowedRoles={['staff', 'cashier', 'manager']}
          currentRole={currentRole}
          onRequireLogin={handleOpenStaffLogin}
          onFallback={() => setActiveNavTab('booking')}
        >
          <InventoryPage />
        </ProtectedRoute>
      )}

      {activeNavTab === 'staff_hr' && (
        <ProtectedRoute
          allowedRoles={['manager', 'cashier', 'staff']}
          currentRole={currentRole}
          onRequireLogin={handleOpenStaffLogin}
          onFallback={() => setActiveNavTab('booking')}
        >
          <StaffHRPage />
        </ProtectedRoute>
      )}

      {activeNavTab === 'settings' && (
        <ProtectedRoute
          allowedRoles={['manager']}
          currentRole={currentRole}
          onRequireLogin={handleOpenStaffLogin}
          onFallback={() => setActiveNavTab('booking')}
        >
          <SystemSettingsPage />
        </ProtectedRoute>
      )}

      {/* 404 Route Fallback */}
      {![
        'booking',
        'qrmenu',
        'tracker',
        'loyalty',
        'floormap',
        'history',
        'schedule',
        'kds',
        'orders',
        'revenue',
        'inventory',
        'staff_hr',
        'settings',
      ].includes(activeNavTab) && (
        <NotFoundPage onGoHome={() => setActiveNavTab('booking')} />
      )}
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <RestaurantProvider>
        <MainLayout>
          <PageRouter />
        </MainLayout>
      </RestaurantProvider>
    </ErrorBoundary>
  );
}
