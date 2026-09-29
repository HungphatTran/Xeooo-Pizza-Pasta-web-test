import { UserRole } from './restaurant';

export type ShiftType = 'morning' | 'evening' | 'full_day' | 'split';

export interface WorkShift {
  id: string;
  staffId: string;
  staffName: string;
  role: UserRole;
  date: string; // YYYY-MM-DD
  type: ShiftType;
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "15:00"
  floorAssigned: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'swapped' | 'absent';
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  hoursWorked?: number;
  status: 'on_time' | 'late' | 'overtime';
  note?: string;
}

export interface ShiftSwapRequest {
  id: string;
  requesterStaffId: string;
  requesterStaffName: string;
  targetStaffId: string;
  targetStaffName: string;
  shiftDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface StaffKPI {
  staffId: string;
  staffName: string;
  tablesServed: number;
  ordersHandled: number;
  avgPreparationTimeMinutes?: number;
  customerSatisfactionScore: number; // 1-5
  punctualityRate: number; // percentage
  hourlyWage: number;
  totalTipsBonus: number;
  estimatedMonthlySalary: number;
}
