import React, { useState } from 'react';
import { useRestaurant, SentEmail } from '../context/RestaurantContext';
import { Mail, Copy, Check, Send, X, QrCode, Clock, User, CheckCircle2 } from 'lucide-react';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { sentEmails, addToast } = useRestaurant();
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(
    sentEmails.length > 0 ? sentEmails[0] : null
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    if (!selectedEmail) return;
    navigator.clipboard.writeText(selectedEmail.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Đã sao chép', 'Nội dung email đã được lưu vào bộ nhớ tạm', 'info');
  };

  const handleResend = () => {
    addToast('Đã gửi lại email', `Đã chuyển tiếp email xác nhận tới ${selectedEmail?.toEmail}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Hệ Thống Gửi Email Xác Nhận Đặt Bàn Tự Động
              </h3>
              <p className="text-[11px] text-stone-500">
                Email thông báo chi tiết mã giữ bàn, sơ đồ vị trí & tiền cọc
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

        {/* Modal content body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* Left: Email List */}
          <div className="border-r border-stone-200 dark:border-stone-800 overflow-y-auto p-3 space-y-2 bg-stone-50/50 dark:bg-stone-950/20">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-1">
              Thư đã gửi ({sentEmails.length})
            </span>

            {sentEmails.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                Chưa có email nào. Hãy thực hiện đặt bàn để kiểm tra!
              </div>
            ) : (
              sentEmails.map((item: SentEmail) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEmail(item)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all text-xs ${
                    selectedEmail?.id === item.id
                      ? 'border-amber-500 bg-white dark:bg-stone-800 shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-800/60'
                  }`}
                >
                  <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                    {item.customerName}
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                    #{item.bookingId}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 truncate">
                    {item.sentAt}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Selected Email Preview */}
          <div className="md:col-span-2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
            {selectedEmail ? (
              <div className="space-y-4">
                {/* Meta details */}
                <div className="space-y-1.5 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Người nhận:</span>
                    <strong className="font-mono text-stone-900 dark:text-stone-100">
                      {selectedEmail.toEmail}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Tiêu đề:</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      {selectedEmail.subject}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Thời gian gửi:</span>
                    <span className="font-mono text-stone-500">{selectedEmail.sentAt}</span>
                  </div>
                </div>

                {/* HTML Email mockup styled card */}
                <div className="p-5 border border-stone-200 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-900 space-y-3 font-sans text-xs shadow-xs">
                  {/* Brand logo in email */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                    <span className="font-serif text-base font-bold text-amber-500">
                      Xéooo Pizza & Pasta
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40">
                      ĐÃ XÁC NHẬN
                    </span>
                  </div>

                  {/* Body content */}
                  <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
                    {selectedEmail.content}
                  </div>

                  {/* QR Check-in preview box */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-8 h-8 text-stone-800 dark:text-stone-200" />
                      <div className="text-[10px] text-stone-500">
                        <span>Đưa mã QR này cho nhân viên phục vụ khi đến quán</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom action buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Sao chép email</span>
                  </button>

                  <button
                    onClick={handleResend}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi lại email cho khách</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400 text-xs">
                Chọn một email ở danh sách bên trái để xem nội dung
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
