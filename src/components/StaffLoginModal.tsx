import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { UserRole, StaffUser } from '../types/restaurant';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Fingerprint,
  X,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTab?: string;
  onSuccess: (role: UserRole) => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  targetTab,
  onSuccess,
}) => {
  const { staffUsers, setCurrentRole, addToast } = useRestaurant();

  const [selectedStaffId, setSelectedStaffId] = useState<string>('staff-1');
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  if (!isOpen) return null;

  const currentStaff = staffUsers.find((s: StaffUser) => s.id === selectedStaffId) || staffUsers[0];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (pinInput === currentStaff.pin) {
      setCurrentRole(currentStaff.role);
      addToast('Đăng nhập thành công', `Chào ${currentStaff.name} (${currentStaff.role.toUpperCase()})`, 'success');
      onSuccess(currentStaff.role);
      onClose();
    } else {
      setErrorMessage(`Mã PIN không đúng! Gợi ý: PIN của ${currentStaff.name} là "${currentStaff.pin}"`);
    }
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsBiometricScanning(false);
      setCurrentRole(currentStaff.role);
      addToast('Xác thực sinh trắc học thành công', `Chào ${currentStaff.name}`, 'success');
      onSuccess(currentStaff.role);
      onClose();
    }, 1000);
  };

  const handleQuickSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    const staff = staffUsers.find((s: StaffUser) => s.id === staffId);
    if (staff) {
      setPinInput(staff.pin);
      setErrorMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                Xác Thực Nội Bộ Nhân Viên
              </h3>
              <p className="text-[11px] text-stone-500">
                Chỉ dành riêng cho nhân viên và quản lý Xéooo Pizza
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {targetTab && targetTab === 'revenue' && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Bảo mật:</strong> Báo cáo doanh thu chỉ cho phép <strong>Quản Lý</strong> (Manager) truy cập!
            </span>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Quick Staff Account Switcher */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Chọn tài khoản ca trực:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {staffUsers.map((staff: StaffUser) => {
                const isSelected = selectedStaffId === staff.id;
                return (
                  <div
                    key={staff.id}
                    onClick={() => handleQuickSelect(staff.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                        : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-xs text-stone-700 dark:text-stone-300">
                        {staff.role === 'manager' ? '👑' : staff.role === 'cashier' ? '💳' : '🍽️'}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span>{staff.name}</span>
                          <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                            staff.role === 'manager'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold'
                              : staff.role === 'cashier'
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {staff.role === 'manager' ? 'Quản lý' : staff.role === 'cashier' ? 'Thu ngân' : 'Nhân viên'}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          Mã PIN: {staff.pin} {staff.role === 'manager' ? '(Toàn quyền xem doanh thu)' : '(Không xem doanh thu)'}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PIN Input form */}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Nhập mã PIN 4 chữ số:
                </label>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                  Gợi ý: {currentStaff.pin}
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Nhập PIN (VD: 8888, 1234, 0000)"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg tracking-widest font-mono text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>

              <button
                type="button"
                onClick={handleBiometricAuth}
                disabled={isBiometricScanning}
                className="w-full py-2.5 px-3 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Fingerprint className={`w-4 h-4 ${isBiometricScanning ? 'text-amber-500 animate-pulse' : 'text-stone-500'}`} />
                <span>{isBiometricScanning ? 'Đang quét...' : 'Vân Tay / FaceID'}</span>
              </button>
            </div>
          </form>

          {/* Quick Note about Access Control */}
          <div className="text-[11px] text-stone-500 leading-relaxed border-t border-stone-200 dark:border-stone-800 pt-3">
            <span className="font-semibold text-stone-700 dark:text-stone-300">Chính sách bảo mật:</span> Khách hàng chỉ được đặt bàn & xem menu/sơ đồ bàn. Để bảo mật doanh số kinh doanh, số liệu tài chính chỉ hiển thị khi đăng nhập tài khoản <strong>Quản Lý</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
