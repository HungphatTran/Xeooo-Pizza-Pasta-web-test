import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types/restaurant';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  AlertCircle,
  CreditCard,
  Smartphone,
  X
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  bookingInfo: {
    customerName: string;
    phone: string;
    date: string;
    timeSlot: string;
    pax: number;
    table: string;
  };
  method: PaymentMethod;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  amount,
  bookingInfo,
  method,
  onClose,
  onSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(bookingInfo.customerName.toUpperCase());

  // Generate realistic unique transaction reference
  const [transactionRef] = useState(
    () => `MOC${Math.floor(100000 + Math.random() * 900000)}`
  );

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePaymentConfirmation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(transactionRef);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Cổng Thanh Toán Trực Tuyến Bảo Mật
              </h3>
              <p className="text-[11px] text-stone-500">Mã hóa chuẩn SSL 256-bit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on selected method */}
        <div className="p-6 space-y-5">
          {/* Countdown timer */}
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs">
            <span className="text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Thời gian giữ bàn còn lại:</span>
            </span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300 tabular-nums text-sm">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {method === 'vietqr' ? (
            /* VietQR NAPAS Display */
            <div className="space-y-4 text-center">
              <div className="inline-block p-3 bg-white border border-stone-200 rounded-2xl shadow-sm">
                {/* Simulated dynamic SVG QR Code with Napas & Vietcombank logo */}
                <div className="w-48 h-48 bg-stone-100 rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-2">
                  <div className="absolute top-1 left-2 text-[9px] font-bold text-emerald-700">
                    VIETQR | NAPAS247
                  </div>
                  <div className="w-36 h-36 bg-white p-2 rounded-lg border border-stone-200 flex flex-col items-center justify-center">
                    <QrCode className="w-32 h-32 text-stone-900" />
                  </div>
                  <div className="absolute bottom-1 font-mono text-[9px] text-stone-600">
                    MOC BISTRO · VCB
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <p className="font-medium text-stone-900 dark:text-stone-100">
                  Mở ứng dụng ngân hàng bất kỳ để quét mã QR
                </p>
                <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800 rounded-lg text-left">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Số tiền cọc:</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                      {amount.toLocaleString('vi-VN')} VNĐ
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-1">
                      <strong className="font-mono text-stone-900 dark:text-stone-100 text-xs">
                        {transactionRef}
                      </strong>
                      <button
                        onClick={() => handleCopy(transactionRef)}
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                        title="Sao chép mã"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : method === 'momo' || method === 'zalopay' ? (
            /* E-Wallet Display */
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                <Smartphone className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Thanh toán qua Ví {method === 'momo' ? 'MoMo' : 'ZaloPay'}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Xác nhận giao dịch thanh toán đặt cọc <strong>{amount.toLocaleString('vi-VN')} đ</strong>
                </p>
              </div>
            </div>
          ) : (
            /* Card payment form */
            <div className="space-y-3 text-left">
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">Số thẻ thanh toán</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">Hết hạn (MM/YY)</label>
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    defaultValue="•••"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Simulated auto-webhook check / confirmation button */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={handleSimulatePaymentConfirmation}
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang kết nối cổng thanh toán...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã Chuyển Tiền Thành Công (Xác Nhận Ngay)</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-stone-400 mt-2">
              * Hệ thống tự động xác nhận sau khi nhận tín hiệu từ ngân hàng (Webhook Instant Sync).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
