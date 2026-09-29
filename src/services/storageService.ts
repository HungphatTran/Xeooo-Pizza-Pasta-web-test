import {
  AuditLogEntry,
  ComboDeal,
  CouponItem,
  CustomerProfile,
  DishRecipe,
  DishReview,
  IngredientItem,
  KitchenOrderItem,
  MenuItem,
  Reservation,
  StaffKPI,
  StaffUser,
  Supplier,
  TableItem,
  WaitingListEntry,
  WorkShift,
  AttendanceRecord,
} from '../types/restaurant';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_RESERVATIONS,
  INITIAL_REVIEWS,
  INITIAL_STAFF,
  INITIAL_TABLES,
} from '../data/initialData';
import {
  INITIAL_COMBOS,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_INGREDIENTS,
  INITIAL_KITCHEN_ORDERS,
  INITIAL_RECIPES,
  INITIAL_SHIFTS,
  INITIAL_SUPPLIERS,
  INITIAL_WAITING_LIST,
  INITIAL_ATTENDANCE,
  INITIAL_STAFF_KPIS,
} from '../data/extendedData';

const KEYS = {
  RESERVATIONS: 'xeooo_res_v4',
  TABLES: 'xeooo_tab_v4',
  MENU: 'xeooo_menu_v4',
  REVIEWS: 'xeooo_rev_v4',
  STAFF: 'xeooo_stf_v4',
  INGREDIENTS: 'xeooo_ing_v4',
  RECIPES: 'xeooo_rec_v4',
  SUPPLIERS: 'xeooo_sup_v4',
  SHIFTS: 'xeooo_shf_v4',
  ATTENDANCE: 'xeooo_att_v4',
  KPIS: 'xeooo_kpi_v4',
  CUSTOMERS: 'xeooo_cus_v4',
  COMBOS: 'xeooo_cmb_v4',
  COUPONS: 'xeooo_cpn_v4',
  KITCHEN_ORDERS: 'xeooo_kord_v4',
  WAITING_LIST: 'xeooo_wait_v4',
  AUDIT_LOGS: 'xeooo_audit_v4',
  THEME_DARK: 'xeooo_dark_v4',
  LANG: 'xeooo_lang_v4',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.warn(`Storage get error for ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Storage set error for ${key}:`, e);
  }
}

export const StorageService = {
  // Reservations
  getReservations: (): Reservation[] => safeGet(KEYS.RESERVATIONS, INITIAL_RESERVATIONS),
  setReservations: (data: Reservation[]) => safeSet(KEYS.RESERVATIONS, data),

  // Tables
  getTables: (): TableItem[] => safeGet(KEYS.TABLES, INITIAL_TABLES),
  setTables: (data: TableItem[]) => safeSet(KEYS.TABLES, data),

  // Menu Items
  getMenuItems: (): MenuItem[] => safeGet(KEYS.MENU, INITIAL_MENU_ITEMS),
  setMenuItems: (data: MenuItem[]) => safeSet(KEYS.MENU, data),

  // Reviews
  getReviews: (): DishReview[] => safeGet(KEYS.REVIEWS, INITIAL_REVIEWS),
  setReviews: (data: DishReview[]) => safeSet(KEYS.REVIEWS, data),

  // Staff
  getStaff: (): StaffUser[] => safeGet(KEYS.STAFF, INITIAL_STAFF),
  setStaff: (data: StaffUser[]) => safeSet(KEYS.STAFF, data),

  // Inventory & Recipes
  getIngredients: (): IngredientItem[] => safeGet(KEYS.INGREDIENTS, INITIAL_INGREDIENTS),
  setIngredients: (data: IngredientItem[]) => safeSet(KEYS.INGREDIENTS, data),

  getRecipes: (): DishRecipe[] => safeGet(KEYS.RECIPES, INITIAL_RECIPES),
  setRecipes: (data: DishRecipe[]) => safeSet(KEYS.RECIPES, data),

  getSuppliers: (): Supplier[] => safeGet(KEYS.SUPPLIERS, INITIAL_SUPPLIERS),
  setSuppliers: (data: Supplier[]) => safeSet(KEYS.SUPPLIERS, data),

  // Shifts & Attendance
  getShifts: (): WorkShift[] => safeGet(KEYS.SHIFTS, INITIAL_SHIFTS),
  setShifts: (data: WorkShift[]) => safeSet(KEYS.SHIFTS, data),

  getAttendance: (): AttendanceRecord[] => safeGet(KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  setAttendance: (data: AttendanceRecord[]) => safeSet(KEYS.ATTENDANCE, data),

  getKPIs: (): StaffKPI[] => safeGet(KEYS.KPIS, INITIAL_STAFF_KPIS),
  setKPIs: (data: StaffKPI[]) => safeSet(KEYS.KPIS, data),

  // Loyalty & Marketing
  getCustomers: (): CustomerProfile[] => safeGet(KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  setCustomers: (data: CustomerProfile[]) => safeSet(KEYS.CUSTOMERS, data),

  getCombos: (): ComboDeal[] => safeGet(KEYS.COMBOS, INITIAL_COMBOS),
  setCombos: (data: ComboDeal[]) => safeSet(KEYS.COMBOS, data),

  getCoupons: (): CouponItem[] => safeGet(KEYS.COUPONS, INITIAL_COUPONS),
  setCoupons: (data: CouponItem[]) => safeSet(KEYS.COUPONS, data),

  // KDS & Waiting List
  getKitchenOrders: (): KitchenOrderItem[] => safeGet(KEYS.KITCHEN_ORDERS, INITIAL_KITCHEN_ORDERS),
  setKitchenOrders: (data: KitchenOrderItem[]) => safeSet(KEYS.KITCHEN_ORDERS, data),

  getWaitingList: (): WaitingListEntry[] => safeGet(KEYS.WAITING_LIST, INITIAL_WAITING_LIST),
  setWaitingList: (data: WaitingListEntry[]) => safeSet(KEYS.WAITING_LIST, data),

  // Audit Logs
  getAuditLogs: (): AuditLogEntry[] => safeGet(KEYS.AUDIT_LOGS, [
    {
      id: 'log_init',
      timestamp: new Date().toISOString(),
      userId: 'system',
      userName: 'Hệ Thống Xéooo',
      userRole: 'manager',
      action: 'BOOT_SYSTEM',
      entity: 'APP',
      details: 'Khởi tạo hệ thống quản trị nhà hàng Xéooo Pizza & Pasta v4.0',
    }
  ]),
  logAction: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const logs = StorageService.getAuditLogs();
    const newLog: AuditLogEntry = {
      ...entry,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    safeSet(KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 199)]); // Keep last 200 logs
  },

  // Export full snapshot
  exportAll: (): string => {
    const snapshot = {
      version: '4.0.0',
      exportedAt: new Date().toISOString(),
      restaurant: 'Xéooo Pizza & Pasta',
      reservations: StorageService.getReservations(),
      tables: StorageService.getTables(),
      menu: StorageService.getMenuItems(),
      reviews: StorageService.getReviews(),
      ingredients: StorageService.getIngredients(),
      recipes: StorageService.getRecipes(),
      shifts: StorageService.getShifts(),
      customers: StorageService.getCustomers(),
      coupons: StorageService.getCoupons(),
      combos: StorageService.getCombos(),
      kitchenOrders: StorageService.getKitchenOrders(),
      waitingList: StorageService.getWaitingList(),
      auditLogs: StorageService.getAuditLogs(),
    };
    return JSON.stringify(snapshot, null, 2);
  },

  // Import full snapshot
  importAll: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.reservations || !data.tables) return false;
      if (data.reservations) StorageService.setReservations(data.reservations);
      if (data.tables) StorageService.setTables(data.tables);
      if (data.menu) StorageService.setMenuItems(data.menu);
      if (data.reviews) StorageService.setReviews(data.reviews);
      if (data.ingredients) StorageService.setIngredients(data.ingredients);
      if (data.recipes) StorageService.setRecipes(data.recipes);
      if (data.shifts) StorageService.setShifts(data.shifts);
      if (data.customers) StorageService.setCustomers(data.customers);
      if (data.coupons) StorageService.setCoupons(data.coupons);
      if (data.combos) StorageService.setCombos(data.combos);
      if (data.kitchenOrders) StorageService.setKitchenOrders(data.kitchenOrders);
      if (data.waitingList) StorageService.setWaitingList(data.waitingList);

      StorageService.logAction({
        userId: 'admin',
        userName: 'Quản Lý',
        userRole: 'manager',
        action: 'RESTORE_BACKUP',
        entity: 'DATABASE',
        details: 'Đã phục hồi cơ sở dữ liệu từ bản sao lưu JSON',
      });
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },

  // Reset to default
  resetAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    StorageService.logAction({
      userId: 'admin',
      userName: 'Quản Lý',
      userRole: 'manager',
      action: 'RESET_DATA',
      entity: 'DATABASE',
      details: 'Khôi phục toàn bộ dữ liệu mẫu ban đầu của quán',
    });
  },
};
