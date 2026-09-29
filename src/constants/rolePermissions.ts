import { UserRole } from '../types/restaurant';

export type Permission =
  | 'view_menu'
  | 'create_booking'
  | 'view_history'
  | 'view_schedule'
  | 'manage_tables'
  | 'manage_kds'
  | 'manage_orders'
  | 'view_revenue'
  | 'manage_inventory'
  | 'manage_staff'
  | 'manage_settings'
  | 'issue_e_invoice'
  | 'process_refund';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  customer: ['view_menu', 'create_booking', 'view_history'],
  staff: [
    'view_menu',
    'create_booking',
    'view_history',
    'view_schedule',
    'manage_tables',
    'manage_kds',
    'manage_orders',
  ],
  cashier: [
    'view_menu',
    'create_booking',
    'view_history',
    'view_schedule',
    'manage_tables',
    'manage_kds',
    'manage_orders',
    'issue_e_invoice',
    'process_refund',
  ],
  manager: [
    'view_menu',
    'create_booking',
    'view_history',
    'view_schedule',
    'manage_tables',
    'manage_kds',
    'manage_orders',
    'view_revenue',
    'manage_inventory',
    'manage_staff',
    'manage_settings',
    'issue_e_invoice',
    'process_refund',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
