import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StaffRoleManagement } from '../components/StaffRoleManagement';
import { StorageService } from '../services/storageService';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Smartphone,
  LogOut,
  ArrowRightLeft,
  Award,
  FileText,
  Search,
} from 'lucide-react';

export const StaffHRPage: React.FC = () => {
  const {
    shifts,
    attendance,
    swapRequests,
    kpis,
    clockIn,
    clockOut,
    calculatePayroll,
    approveShiftSwap,
    activeStaff,
    sessions,
    terminateRemoteSession,
    addToast,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'shifts' | 'attendance' | 'kpis' | 'sessions' | 'audit' | 'rbac'>('shifts');

  const auditLogs = StorageService.getAuditLogs();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Quản Trị Nhân Sự, Chấm Công &amp; Bảo Mật RBAC</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Lịch làm việc ca trực, chấm công thời gian thực, tính lương cơ bản, KPI phục vụ và nhật ký kiểm toán hệ thống
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 'shifts', label: 'Lịch Phân Ca' },
            { id: 'attendance', label: 'Chấm Công Vào/Ra' },
            { id: 'kpis', label: 'Bảng Lương & KPI' },
            { id: 'sessions', label: 'Thiết Bị Đăng Nhập' },
            { id: 'audit', label: 'Nhật Ký (Audit Log)' },
            { id: 'rbac', label: 'Bảo Mật 2FA & RBAC' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SHIFTS & SWAP REQUESTS */}
      {activeTab === 'shifts' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Shift Swap Requests alert */}
          {swapRequests.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-500">
                <span className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  Yêu Cầu Đổi Ca Làm Cần Phê Duyệt ({swapRequests.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {swapRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {req.requesterStaffName} ➜ {req.targetStaffName}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">{req.shiftDate}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Lý do: {req.reason}</p>
                    <div className="flex justify-end gap-2 pt-1">
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => {
                            approveShiftSwap(req.id);
                            addToast('Đã duyệt đổi ca', `Đã duyệt đổi ca giữa ${req.requesterStaffName} và ${req.targetStaffName}`, 'success');
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-500 transition"
                        >
                          Duyệt Đổi Ca
                        </button>
                      ) : (
                        <span className="text-emerald-500 font-bold text-[11px]">Đã Phê Duyệt</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shifts table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Bảng Phân Ca Làm Việc Hôm Nay</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shifts.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-stone-100">{s.staffName}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        s.type === 'morning'
                          ? 'bg-blue-500/10 text-blue-400'
                          : s.type === 'evening'
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {s.type === 'morning' ? 'Ca Sáng' : s.type === 'evening' ? 'Ca Chiều Tối' : 'Ca Full'}
                    </span>
                  </div>
                  <div className="text-stone-500 font-mono">
                    Thời gian: {s.startTime} - {s.endTime}
                  </div>
                  <div className="text-stone-500">Phụ trách: Tầng {s.floorAssigned}</div>
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
                    <span className="text-emerald-500 font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {s.status === 'in_progress' ? 'Đang trong ca' : 'Đã lên lịch'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE (CHẤM CÔNG) */}
      {activeTab === 'attendance' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Quick Clock-in Card */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Chấm Công Điện Tử (Clock-in / Clock-out)
              </h3>
              <p className="text-xs text-stone-500">
                Nhân viên hiện tại: <strong>{activeStaff.name}</strong> ({activeStaff.role.toUpperCase()})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  clockIn(activeStaff.id, activeStaff.name);
                  addToast('Chấm công vào', `Đã ghi nhận giờ vào ca cho ${activeStaff.name}`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition"
              >
                Vào Ca Làm (Clock In)
              </button>
              <button
                onClick={() => {
                  const lastAtt = attendance.find((a) => a.staffId === activeStaff.id && !a.checkOutTime);
                  if (lastAtt) {
                    clockOut(lastAtt.id);
                    addToast('Chấm công ra', `Đã ghi nhận tan ca cho ${activeStaff.name}`, 'info');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs transition"
              >
                Tan Ca (Clock Out)
              </button>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-semibold bg-stone-50/50 dark:bg-stone-950/40">
                  <th className="py-3 px-4">Nhân Viên</th>
                  <th className="py-3 px-4">Ngày Làm</th>
                  <th className="py-3 px-4">Giờ Vào Ca</th>
                  <th className="py-3 px-4">Giờ Tan Ca</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">{att.staffName}</td>
                    <td className="py-3 px-4 font-mono text-stone-400">{att.date}</td>
                    <td className="py-3 px-4 font-mono text-emerald-500 font-bold">{att.checkInTime}</td>
                    <td className="py-3 px-4 font-mono text-stone-500">{att.checkOutTime || 'Đang làm...'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        Đúng Giờ (On Time)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KPIS & PAYROLL */}
      {activeTab === 'kpis' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kpis.map((kpi) => {
              const payroll = calculatePayroll(kpi.staffId);
              return (
                <div
                  key={kpi.staffId}
                  className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{kpi.staffName}</span>
                      <div className="text-[11px] text-stone-400 mt-0.5">Mức lương: {kpi.hourlyWage.toLocaleString()}đ/giờ</div>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="space-y-2 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Số bàn phục vụ:</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{kpi.tablesServed} bàn</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Độ hài lòng khách:</span>
                      <span className="font-mono font-bold text-amber-500">{kpi.customerSatisfactionScore} / 5.0 ★</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Tỷ lệ đúng giờ:</span>
                      <span className="font-mono font-bold text-emerald-500">{kpi.punctualityRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Tiền thưởng Tips/KPI:</span>
                      <span className="font-mono font-bold text-emerald-500">+{kpi.totalTipsBonus.toLocaleString()}đ</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
                    <span className="font-semibold text-stone-600 dark:text-stone-400">Lương Tháng Dự Kiến:</span>
                    <span className="font-mono text-base font-bold text-amber-500">
                      {payroll.total.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SESSIONS & REMOTE LOGOUT */}
      {activeTab === 'sessions' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Quản Lý Thiết Bị &amp; Đăng Xuất Từ Xa
            </h3>
            <p className="text-xs text-stone-500">
              Danh sách các máy tính POS, iPad quầy thu ngân và thiết bị nhân viên đang đăng nhập ca trực
            </p>
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.userId}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>{sess.name}</span>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded">
                        Đang hoạt động
                      </span>
                    </div>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      {sess.deviceInfo} · IP: {sess.ipAddress} · Đăng nhập: {sess.loginAt}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    terminateRemoteSession(sess.userId);
                    addToast('Đã đăng xuất thiết bị', `Đã ngắt kết nối thiết bị của ${sess.name}`, 'info');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-semibold text-xs flex items-center gap-1.5 transition self-end sm:self-center"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng Xuất Từ Xa</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Nhật Ký Thao Tác Hệ Thống (Audit Trail)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Ghi lại mọi hoạt động đặt bàn, hủy bàn, sửa giá, gộp bàn, chấm công và đăng nhập của nhân viên
            </p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto text-xs font-mono">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-500">[{log.action}]</span>
                    <span className="text-stone-600 dark:text-stone-300 font-sans font-medium">
                      Bởi: {log.userName} ({log.userRole})
                    </span>
                  </div>
                  <div className="text-stone-500 font-sans text-[11px]">{log.details}</div>
                </div>
                <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RBAC & 2FA */}
      {activeTab === 'rbac' && <StaffRoleManagement />}
    </div>
  );
};
