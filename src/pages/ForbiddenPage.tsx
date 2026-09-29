import React from 'react';
import { ShieldAlert, Lock, Home, ArrowLeft } from 'lucide-react';

interface Props {
  onGoHome: () => void;
  onLogin: () => void;
}

export const ForbiddenPage: React.FC<Props> = ({ onGoHome, onLogin }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            403 - Quyền Truy Cập Bị Từ Chối
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Bạn không có đặc quyền truy cập vào bảng quản trị hoặc dữ liệu tài chính nhạy cảm này. Vui lòng đăng nhập với tài khoản Quản Lý (Manager).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Lock className="w-4 h-4" />
            <span>Đăng Nhập Mã PIN Quản Trị</span>
          </button>
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-xs transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Về Đặt Bàn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
