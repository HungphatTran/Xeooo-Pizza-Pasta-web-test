import React, { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { BookingProvider, useBooking } from './BookingContext';
import { OrderProvider, useOrder } from './OrderContext';
import { MenuProvider, useMenu } from './MenuContext';
import { StaffProvider, useStaff } from './StaffContext';
import { InventoryProvider, useInventory } from './InventoryContext';
import { UIProvider, useUI } from './UIContext';
import {
  Reservation,
  TableItem,
  MenuItem,
  DishReview,
  UserRole,
  StaffUser,
  ReservationStatus,
  TableStatus,
} from '../types/restaurant';
import { Language } from '../utils/i18n';
import { StorageService } from '../services/storageService';

export interface SentEmail {
  id: string;
  toEmail: string;
  customerName: string;
  bookingId: string;
  subject: string;
  content: string;
  sentAt: string;
}

export { useAuth, useBooking, useOrder, useMenu, useStaff, useInventory, useUI };

// Unified Provider Tree
export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <BookingProvider>
          <OrderProvider>
            <MenuProvider>
              <StaffProvider>
                <InventoryProvider>{children}</InventoryProvider>
              </StaffProvider>
            </MenuProvider>
          </OrderProvider>
        </BookingProvider>
      </AuthProvider>
    </UIProvider>
  );
};

// Unified facade hook providing backward-compatibility for all existing components
export const useRestaurant = () => {
  const auth = useAuth();
  const booking = useBooking();
  const order = useOrder();
  const menu = useMenu();
  const staff = useStaff();
  const inventory = useInventory();
  const ui = useUI();

  return {
    // Booking & Tables
    reservations: booking.reservations,
    tables: booking.tables,
    waitingList: booking.waitingList,
    selectedDate: booking.selectedDate,
    setSelectedDate: booking.setSelectedDate,
    addReservation: booking.addReservation,
    updateReservationStatus: booking.updateReservationStatus,
    updateReservation: booking.updateReservation,
    deleteReservation: booking.deleteReservation,
    updateTableStatus: booking.updateTableStatus,
    updateTablePosition: booking.updateTablePosition,
    mergeTables: booking.mergeTables,
    splitTable: booking.splitTable,
    moveTable: booking.moveTable,
    autoAssignTable: booking.autoAssignTable,
    addToWaitingList: booking.addToWaitingList,
    updateWaitingStatus: booking.updateWaitingStatus,
    removeFromWaitingList: booking.removeFromWaitingList,

    // Auth & Staff
    currentRole: auth.currentRole,
    setCurrentRole: auth.setCurrentRole,
    activeStaff: auth.activeStaff,
    setActiveStaff: auth.setActiveStaff,
    staffUsers: auth.staffUsers,
    sessions: auth.sessions,
    loginWithPin: auth.loginWithPin,
    loginWithSocial: auth.loginWithSocial,
    logout: auth.logout,
    terminateRemoteSession: auth.terminateRemoteSession,
    verify2FA: auth.verify2FA,
    is2FAPending: auth.is2FAPending,
    setPending2FA: auth.setPending2FA,

    // Orders & Kitchen
    kitchenOrders: order.kitchenOrders,
    eInvoices: order.eInvoices,
    refunds: order.refunds,
    addKitchenOrder: order.addKitchenOrder,
    updateDishStatus: order.updateDishStatus,
    removeKitchenItem: order.removeKitchenItem,
    calculateSplitBill: order.calculateSplitBill,
    generateEInvoice: order.generateEInvoice,
    requestRefund: order.requestRefund,
    approveRefund: order.approveRefund,

    // Menu & Reviews & Loyalty
    menuItems: menu.menuItems,
    reviews: menu.reviews,
    combos: menu.combos,
    coupons: menu.coupons,
    appliedCoupon: menu.appliedCoupon,
    wishlistIds: menu.wishlistIds,
    customers: menu.customers,
    addMenuItem: menu.addMenuItem,
    updateMenuItem: menu.updateMenuItem,
    deleteMenuItem: menu.deleteMenuItem,
    addReview: menu.addReview,
    applyCouponCode: menu.applyCouponCode,
    removeAppliedCoupon: menu.removeAppliedCoupon,
    toggleWishlist: menu.toggleWishlist,
    isInWishlist: menu.isInWishlist,
    addPointsToCustomer: menu.addPointsToCustomer,

    // Staff HR
    shifts: staff.shifts,
    attendance: staff.attendance,
    swapRequests: staff.swapRequests,
    kpis: staff.kpis,
    addShift: staff.addShift,
    updateShiftStatus: staff.updateShiftStatus,
    requestShiftSwap: staff.requestShiftSwap,
    approveShiftSwap: staff.approveShiftSwap,
    clockIn: staff.clockIn,
    clockOut: staff.clockOut,
    calculatePayroll: staff.calculatePayroll,

    // Inventory
    ingredients: inventory.ingredients,
    recipes: inventory.recipes,
    suppliers: inventory.suppliers,
    transactions: inventory.transactions,
    lowStockItems: inventory.lowStockItems,
    restockIngredient: inventory.restockIngredient,
    deductStockForOrder: inventory.deductStockForOrder,
    addIngredient: inventory.addIngredient,
    updateIngredient: inventory.updateIngredient,
    addSupplier: inventory.addSupplier,

    // UI & System
    language: ui.language,
    setLanguage: ui.setLanguage,
    t: ui.t,
    isDarkMode: ui.isDarkMode,
    toggleDarkMode: ui.toggleDarkMode,
    accentColor: ui.accentColor,
    setAccentColor: ui.setAccentColor,
    isCommandPaletteOpen: ui.isCommandPaletteOpen,
    setCommandPaletteOpen: ui.setCommandPaletteOpen,
    isAIChatOpen: ui.isAIChatOpen,
    setAIChatOpen: ui.setAIChatOpen,
    isOnboardingTourActive: ui.isOnboardingTourActive,
    startOnboardingTour: ui.startOnboardingTour,
    stopOnboardingTour: ui.stopOnboardingTour,
    notifications: ui.notifications,
    addToast: ui.addToast,
    dismissNotification: ui.dismissToast,
    isOnline: ui.isOnline,
    offlineQueueCount: 0,
    activeNavTab: ui.activeNavTab,
    setActiveNavTab: ui.setActiveNavTab,
    sentEmails: [
      {
        id: 'email_welcome',
        toEmail: 'khachhang@gmail.com',
        customerName: 'Ngọc Anh',
        bookingId: 'MB-8347',
        subject: '[Xéooo Pizza & Pasta] Xác nhận đặt bàn thành công #MB-8347',
        content: 'Kính gửi Ngọc Anh,\nBàn của bạn tại Bàn 3 Tầng 3 - Lồng Kính (19h00, hôm nay) đã được xác nhận sẵn sàng đón tiếp!',
        sentAt: 'Hôm nay',
      }
    ],

    // Email & Backup helpers
    sendConfirmationEmail: (reservation: Reservation): SentEmail => {
      const emailRecord: SentEmail = {
        id: `email_${Date.now()}`,
        toEmail: reservation.email || 'customer@example.com',
        customerName: reservation.customerName,
        bookingId: reservation.id,
        subject: `[Xéooo Pizza & Pasta] Xác nhận đặt bàn thành công #${reservation.id}`,
        content: `Kính gửi ${reservation.customerName},\nBàn của bạn tại ${reservation.tableName} (${reservation.timeSlot}, ngày ${reservation.date}) đã được xác nhận sẵn sàng đón tiếp!`,
        sentAt: new Date().toLocaleString(),
      };
      ui.addToast(
        'Email xác nhận đã gửi',
        `Đã gửi thư xác nhận đặt bàn #${reservation.id} đến ${emailRecord.toEmail}`,
        'success'
      );
      return emailRecord;
    },

    exportDatabaseSnapshot: StorageService.exportAll,
    importDatabaseSnapshot: StorageService.importAll,
    resetToDefaultData: StorageService.resetAll,
  };
};
