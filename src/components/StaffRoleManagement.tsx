import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { UserRole } from '../types/restaurant';
import {
  ShieldCheck,
  Fingerprint,
  KeyRound,
  UserCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Users,
  Eye,
  AlertCircle
} from 'lucide-react';

export const StaffRoleManagement: React.FC = () => {
  const {
    staffUsers,
    activeStaff,
    setActiveStaff,
    currentRole,
    setCurrentRole,
    addToast
  } = useRestaurant();

  const [simulatingBiometrics, setSimulatingBiometrics] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSimulateBiometrics = () => {
    setSimulatingBiometrics(true);
    setBiometricSuccess(false);

    setTimeout(() => {
      setSimulatingBiometrics(false);
      setBiometricSuccess(true);
      addToast('Sinh trắc học thành công', 'Nhận diện TouchID/FaceID hợp lệ', 'success');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      setOtpVerified(true);
      addToast('Xác thực 2 lớp (2FA)', 'Mã bảo mật 6 số hợp lệ', 'success');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          <span>Hệ Thống Phân Quyền Nhân Viên & Bảo Mật 2 Lớp (2FA)</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Quản lý quyền truy cập RBAC, xác thực sinh trắc học FaceID/TouchID và mã OTP cho thu ngân & quản lý
        </p>
      </div>

      {/* Security Simulator & Active User Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biometrics Scan Simulator */}
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-amber-500" />
              <span>Đăng Nhập Bằng Sinh Trắc Học</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
              WebAuthn / FIDO2
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Mô phỏng xác thực vân tay hoặc nhận diện khuôn mặt để mở khóa bảng điều khiển doanh thu và cấp quyền thu ngân.
          </p>

          <div className="flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={handleSimulateBiometrics}
              disabled={simulatingBiometrics}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                simulatingBiometrics
                  ? 'bg-amber-500/20 text-amber-500 animate-pulse ring-4 ring-amber-500/30'
                  : biometricSuccess
                  ? 'bg-emerald-500/20 text-emerald-500 ring-4 ring-emerald-500/30'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:scale-105'
              }`}
            >
              <Fingerprint className="w-10 h-10" />
            </button>

            <span className="text-xs font-semibold mt-3 text-stone-700 dark:text-stone-300">
              {simulatingBiometrics
                ? 'Đang quét sinh trắc học...'
                : biometricSuccess
                ? 'Đã xác thực danh tính an toàn ✓'
                : 'Chạm để quét vân tay / FaceID'}
            </span>
          </div>
        </div>

        {/* 2FA OTP Authentication */}
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <span>Xác Thực 2 Lớp (2FA OTP)</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium">
              Google Authenticator
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Bảo mật tuyệt đối cho tài khoản Quản trị viên khi xuất file báo cáo doanh thu nhạy cảm.
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Nhập mã OTP 6 số (Mã demo: 123456)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{otpVerified ? 'Đã kích hoạt 2FA' : 'Xác minh mã bảo mật'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Staff Accounts List & Quick Switch */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs p-6 space-y-4">
        <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" />
          <span>Danh Sách Nhân Sự & Phân Quyền Vai Trò</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffUsers.map((staff) => (
            <div
              key={staff.id}
              className={`p-4 rounded-xl border transition-all ${
                activeStaff.id === staff.id
                  ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-200 font-serif">
                  {staff.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {staff.name}
                  </h4>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 capitalize font-medium">
                    {staff.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                <span className="text-stone-400 font-mono">PIN: {staff.pin}</span>
                <button
                  onClick={() => {
                    setActiveStaff(staff);
                    setCurrentRole(staff.role);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded"
                >
                  Đăng nhập role này
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Permission Matrix Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 dark:border-stone-800">
          <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
            Ma Trận Phân Quyền Chi Tiết (Role-Based Access Control)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-300">
              <tr>
                <th className="py-3 px-4">Quyền Hạn / Tính Năng</th>
                <th className="py-3 px-4 text-center">Khách Hàng (Customer)</th>
                <th className="py-3 px-4 text-center">Phục Vụ (Staff)</th>
                <th className="py-3 px-4 text-center">Thu Ngân (Cashier)</th>
                <th className="py-3 px-4 text-center">Quản Lý (Manager)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {[
                { feature: 'Đặt bàn & chọn bàn trên sơ đồ', customer: true, staff: true, cashier: true, manager: true },
                { feature: 'Xem lưới nhận bàn thủ công (Grid)', customer: false, staff: true, cashier: true, manager: true },
                { feature: 'Đổi trạng thái bàn (Trống/Đang dùng/Dọn)', customer: false, staff: true, cashier: true, manager: true },
                { feature: 'Thêm món gọi vào bàn tại chỗ', customer: false, staff: true, cashier: true, manager: true },
                { feature: 'Xác nhận thanh toán & in hóa đơn', customer: false, staff: false, cashier: true, manager: true },
                { feature: 'Xem báo cáo doanh thu ngày & tháng', customer: false, staff: false, cashier: false, manager: true },
                { feature: 'Xuất file Excel & in PDF báo cáo', customer: false, staff: false, cashier: false, manager: true },
                { feature: 'Sao lưu đám mây & Phục hồi dữ liệu', customer: false, staff: false, cashier: false, manager: true },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                  <td className="py-3 px-4 font-medium text-stone-900 dark:text-stone-100">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.customer ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-stone-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.staff ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-stone-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.cashier ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-stone-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.manager ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-stone-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
