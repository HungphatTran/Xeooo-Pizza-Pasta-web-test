import { UserRole } from './restaurant';

export interface UserSession {
  userId: string;
  name: string;
  role: UserRole;
  avatar: string;
  token?: string;
  refreshToken?: string;
  loginAt: string;
  deviceInfo: string;
  ipAddress?: string;
  twoFactorVerified?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ip?: string;
}

export interface SecuritySettings {
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  sessionTimeoutMinutes: number;
  require2FAForManagers: boolean;
  biometricsAllowed: boolean;
}
