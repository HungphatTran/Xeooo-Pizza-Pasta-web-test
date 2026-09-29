import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  WorkShift,
  AttendanceRecord,
  ShiftSwapRequest,
  StaffKPI,
} from '../types/restaurant';
import { StorageService } from '../services/storageService';

interface StaffContextType {
  shifts: WorkShift[];
  attendance: AttendanceRecord[];
  swapRequests: ShiftSwapRequest[];
  kpis: StaffKPI[];

  // Shift actions
  addShift: (shift: Omit<WorkShift, 'id'>) => void;
  updateShiftStatus: (shiftId: string, status: WorkShift['status']) => void;
  requestShiftSwap: (swap: Omit<ShiftSwapRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveShiftSwap: (swapId: string) => void;

  // Attendance actions
  clockIn: (staffId: string, staffName: string) => void;
  clockOut: (attendanceId: string) => void;

  // Payroll
  calculatePayroll: (staffId: string) => { hours: number; baseSalary: number; tips: number; total: number };
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<WorkShift[]>(() => StorageService.getShifts());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [kpis] = useState<StaffKPI[]>(() => StorageService.getKPIs());
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([
    {
      id: 'swap_1',
      requesterStaffId: 'staff_2',
      requesterStaffName: 'Quốc Bảo',
      targetStaffId: 'staff_1',
      targetStaffName: 'Thu Hà',
      shiftDate: new Date().toISOString().split('T')[0],
      reason: 'Có lịch thi học kỳ chiều tối nay',
      status: 'pending',
      createdAt: '08:30 Hôm nay',
    },
  ]);

  useEffect(() => {
    StorageService.setShifts(shifts);
  }, [shifts]);

  useEffect(() => {
    StorageService.setAttendance(attendance);
  }, [attendance]);

  const addShift = useCallback((shiftData: Omit<WorkShift, 'id'>) => {
    const newShift: WorkShift = {
      ...shiftData,
      id: `shift_${Date.now()}`,
    };
    setShifts((prev) => [newShift, ...prev]);
  }, []);

  const updateShiftStatus = useCallback((shiftId: string, status: WorkShift['status']) => {
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? { ...s, status } : s)));
  }, []);

  const requestShiftSwap = useCallback((swapData: Omit<ShiftSwapRequest, 'id' | 'createdAt' | 'status'>) => {
    const newSwap: ShiftSwapRequest = {
      ...swapData,
      id: `swap_${Date.now()}`,
      status: 'pending',
      createdAt: 'Vừa xong',
    };
    setSwapRequests((prev) => [newSwap, ...prev]);
  }, []);

  const approveShiftSwap = useCallback((swapId: string) => {
    setSwapRequests((prev) =>
      prev.map((s) => (s.id === swapId ? { ...s, status: 'approved' } : s))
    );
  }, []);

  const clockIn = useCallback((staffId: string, staffName: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
    const newAtt: AttendanceRecord = {
      id: `att_${Date.now()}`,
      staffId,
      staffName,
      date: now.toISOString().split('T')[0],
      checkInTime: timeStr,
      status: 'on_time',
    };
    setAttendance((prev) => [newAtt, ...prev]);
  }, []);

  const clockOut = useCallback((attendanceId: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
    setAttendance((prev) =>
      prev.map((a) => (a.id === attendanceId ? { ...a, checkOutTime: timeStr, hoursWorked: 6.5 } : a))
    );
  }, []);

  const calculatePayroll = useCallback((staffId: string) => {
    const kpi = kpis.find((k) => k.staffId === staffId) || kpis[0];
    const hours = 176; // Average monthly hours
    const baseSalary = hours * kpi.hourlyWage;
    const tips = kpi.totalTipsBonus;
    return {
      hours,
      baseSalary,
      tips,
      total: baseSalary + tips,
    };
  }, [kpis]);

  return (
    <StaffContext.Provider
      value={{
        shifts,
        attendance,
        swapRequests,
        kpis,
        addShift,
        updateShiftStatus,
        requestShiftSwap,
        approveShiftSwap,
        clockIn,
        clockOut,
        calculatePayroll,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) throw new Error('useStaff must be used within a StaffProvider');
  return context;
};
