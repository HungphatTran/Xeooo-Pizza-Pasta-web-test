import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StaffUser, UserRole, UserSession } from '../types/restaurant';
import { StorageService } from '../services/storageService';

interface AuthContextType {
  currentRole: UserRole;
  activeStaff: StaffUser;
  staffUsers: StaffUser[];
  sessions: UserSession[];
  isAuthenticatedStaff: boolean;
  setCurrentRole: (role: UserRole) => void;
  setActiveStaff: (staff: StaffUser) => void;
  loginWithPin: (pin: string) => { success: boolean; staff?: StaffUser; error?: string };
  loginWithSocial: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  logout: () => void;
  terminateRemoteSession: (sessionId: string) => void;
  verify2FA: (code: string) => boolean;
  is2FAPending: boolean;
  setPending2FA: (pending: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staffUsers] = useState<StaffUser[]>(() => StorageService.getStaff());
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('xeooo_auth_role') as UserRole) || 'customer';
  });

  const [activeStaff, setActiveStaffState] = useState<StaffUser>(() => {
    const savedId = localStorage.getItem('xeooo_auth_staff_id');
    const found = staffUsers.find((s) => s.id === savedId);
    return found || staffUsers[0];
  });

  const [sessions, setSessions] = useState<UserSession[]>([
    {
      userId: 'staff_1',
      name: 'Thu Hà (Trưởng Ca)',
      role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      loginAt: '10:00 - Hôm nay',
      deviceInfo: 'POS iPad Pro (Tầng 3 Quầy Bar)',
      ipAddress: '192.168.1.104',
      twoFactorVerified: true,
    },
    {
      userId: 'cashier_1',
      name: 'Bảo Trâm (Thu Ngân)',
      role: 'cashier',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      loginAt: '10:15 - Hôm nay',
      deviceInfo: 'Máy tính POS Bàn Thu Ngân T1',
      ipAddress: '192.168.1.102',
      twoFactorVerified: true,
    },
    {
      userId: 'mgr_1',
      name: 'Anh Tuấn (Quản Lý)',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      loginAt: '09:20 - Hôm nay',
      deviceInfo: 'MacBook Pro M3 (Quản Trị)',
      ipAddress: '192.168.1.101',
      twoFactorVerified: true,
    },
  ]);

  const [is2FAPending, setPending2FA] = useState<boolean>(false);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('xeooo_auth_role', role);
    StorageService.logAction({
      userId: activeStaff.id,
      userName: activeStaff.name,
      userRole: role,
      action: 'SWITCH_ROLE',
      entity: 'AUTH',
      details: `Chuyển quyền sang [${role.toUpperCase()}]`,
    });
  };

  const setActiveStaff = (staff: StaffUser) => {
    setActiveStaffState(staff);
    localStorage.setItem('xeooo_auth_staff_id', staff.id);
  };

  const loginWithPin = (pin: string) => {
    const matched = staffUsers.find((s) => s.pin === pin);
    if (!matched) {
      StorageService.logAction({
        userId: 'unknown',
        userName: 'Khách / Nhân viên',
        userRole: 'customer',
        action: 'FAILED_LOGIN',
        entity: 'AUTH',
        details: 'Đăng nhập thất bại: Sai mã PIN',
      });
      return { success: false, error: 'Mã PIN bảo mật không chính xác!' };
    }

    if (matched.twoFactorEnabled && matched.role === 'manager') {
      setPending2FA(true);
    }

    setActiveStaff(matched);
    setCurrentRole(matched.role);

    StorageService.logAction({
      userId: matched.id,
      userName: matched.name,
      userRole: matched.role,
      action: 'STAFF_LOGIN',
      entity: 'AUTH',
      details: `Đăng nhập ca trực thành công quyền ${matched.role.toUpperCase()}`,
    });

    return { success: true, staff: matched };
  };

  const loginWithSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    // Simulating OAuth social profile login
    await new Promise((r) => setTimeout(r, 600));
    setCurrentRole('customer');
    StorageService.logAction({
      userId: 'social_user',
      userName: `Khách hàng (${provider.toUpperCase()})`,
      userRole: 'customer',
      action: 'SOCIAL_LOGIN',
      entity: 'AUTH',
      details: `Khách đăng nhập qua tài khoản ${provider}`,
    });
  };

  const verify2FA = (code: string) => {
    if (code === '123456' || code === '888888') {
      setPending2FA(false);
      StorageService.logAction({
        userId: activeStaff.id,
        userName: activeStaff.name,
        userRole: activeStaff.role,
        action: '2FA_VERIFIED',
        entity: 'AUTH',
        details: 'Xác thực hai bước (2FA) bảo mật thành công',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentRole('customer');
    localStorage.removeItem('xeooo_auth_role');
    StorageService.logAction({
      userId: activeStaff.id,
      userName: activeStaff.name,
      userRole: activeStaff.role,
      action: 'LOGOUT',
      entity: 'AUTH',
      details: 'Đã đăng xuất khỏi tài khoản nhân viên',
    });
  };

  const terminateRemoteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.userId !== sessionId));
    StorageService.logAction({
      userId: activeStaff.id,
      userName: activeStaff.name,
      userRole: activeStaff.role,
      action: 'TERMINATE_SESSION',
      entity: 'AUTH',
      details: `Đã cưỡng chế đăng xuất từ xa phiên làm việc [${sessionId}]`,
    });
  };

  const isAuthenticatedStaff = currentRole !== 'customer';

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        activeStaff,
        staffUsers,
        sessions,
        isAuthenticatedStaff,
        setCurrentRole,
        setActiveStaff,
        loginWithPin,
        loginWithSocial,
        logout,
        terminateRemoteSession,
        verify2FA,
        is2FAPending,
        setPending2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
