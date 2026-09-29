export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REFRESH_TOKEN: '/api/v1/auth/refresh-token',
    LOGOUT: '/api/v1/auth/logout',
    VERIFY_2FA: '/api/v1/auth/verify-2fa',
    ME: '/api/v1/auth/me',
  },
  RESERVATIONS: {
    LIST: '/api/v1/reservations',
    DETAIL: (id: string) => `/api/v1/reservations/${id}`,
    CREATE: '/api/v1/reservations',
    UPDATE: (id: string) => `/api/v1/reservations/${id}`,
    CANCEL: (id: string) => `/api/v1/reservations/${id}/cancel`,
    AUTO_ASSIGN: '/api/v1/reservations/auto-assign',
  },
  TABLES: {
    LIST: '/api/v1/tables',
    UPDATE_STATUS: (id: string) => `/api/v1/tables/${id}/status`,
    MERGE: '/api/v1/tables/merge',
    SPLIT: '/api/v1/tables/split',
    MOVE: '/api/v1/tables/move',
  },
  KITCHEN: {
    ORDERS: '/api/v1/kitchen/orders',
    UPDATE_DISH_STATUS: (id: string) => `/api/v1/kitchen/orders/${id}/status`,
  },
  INVENTORY: {
    INGREDIENTS: '/api/v1/inventory/ingredients',
    RESTOCK: '/api/v1/inventory/restock',
    SUPPLIERS: '/api/v1/inventory/suppliers',
    RECIPES: '/api/v1/inventory/recipes',
  },
  STAFF: {
    SHIFTS: '/api/v1/staff/shifts',
    CLOCK_IN: '/api/v1/staff/clock-in',
    CLOCK_OUT: '/api/v1/staff/clock-out',
    KPIS: '/api/v1/staff/kpis',
    SWAP_REQUEST: '/api/v1/staff/swap-request',
  },
  AI: {
    TRAFFIC_FORECAST: '/api/v1/ai/traffic-forecast',
    REVENUE_FORECAST: '/api/v1/ai/revenue-forecast',
    SENTIMENT: '/api/v1/ai/sentiment',
    ANOMALIES: '/api/v1/ai/anomalies',
    CHATBOT: '/api/v1/ai/chatbot',
    PROMOTIONS: '/api/v1/ai/promotions',
  },
  BILLING: {
    SPLIT_BILL: '/api/v1/billing/split',
    E_INVOICE: '/api/v1/billing/e-invoice',
    REFUND: '/api/v1/billing/refund',
  },
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Xéooo Pizza & Pasta',
  APP_VERSION: '4.2.0-production',
  API_TIMEOUT_MS: 15000,
  MAX_UPLOAD_SIZE_MB: 10,
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en'] as const,
  SESSION_TIMEOUT_MINUTES: 120,
} as const;
