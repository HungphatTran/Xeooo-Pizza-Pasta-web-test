import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/reservations',
      desc: 'Lấy danh sách tất cả bàn đã đặt theo ngày (lọc theo floor, status)',
      response: '{\n  "status": "success",\n  "count": 48,\n  "data": [{ "id": "MB-8347", "customerName": "Ngọc Anh", "timeSlot": "19h00" }]\n}',
    },
    {
      method: 'POST',
      path: '/api/v1/reservations',
      desc: 'Tạo đặt bàn mới trực tuyến kèm kiểm tra trùng lặp bàn tự động',
      response: '{\n  "id": "MB-9921",\n  "status": "confirmed",\n  "depositRequired": 100000,\n  "vietqrUrl": "https://img.vietqr.io/..."\n}',
    },
    {
      method: 'POST',
      path: '/api/v1/kitchen/orders',
      desc: 'Bắn đơn gọi món trực tiếp vào màn hình Kitchen Display System (KDS)',
      response: '{\n  "orderId": "ORD-1102",\n  "tableId": "b3t3",\n  "status": "cooking",\n  "estimatedPrepMinutes": 12\n}',
    },
    {
      method: 'POST',
      path: '/api/v1/ai/traffic-forecast',
      desc: 'Dự báo lưu lượng khách và đề xuất nhân sự phục vụ theo mô hình Gemini AI',
      response: '{\n  "date": "2026-09-29",\n  "expectedPax": 142,\n  "peakHour": "19:00",\n  "recommendedWaiters": 5\n}',
    },
    {
      method: 'POST',
      path: '/api/v1/billing/e-invoice',
      desc: 'Phát hành hóa đơn điện tử GTGT hợp chuẩn cơ quan thuế',
      response: '{\n  "invoiceNumber": "HD-XEOOO-2026-8347",\n  "subtotal": 450000,\n  "vat": 36000,\n  "lookupCode": "XEOOO-ABC123"\n}',
    },
  ];

  const copyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Tài Liệu API &amp; Tích Hợp (OpenAPI 3.1)
                <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono font-semibold px-2 py-0.5 rounded">
                  v4.0.0
                </span>
              </h3>
              <p className="text-[11px] text-stone-500">RESTful JSON endpoints cho POS, KDS và ứng dụng di động</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 bg-stone-100 dark:bg-stone-800/60 rounded-xl text-stone-600 dark:text-stone-300 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-100">Base URL: </span>
              <code className="font-mono text-amber-500">https://api.xeooo-pizza.com/api/v1</code>
            </div>
            <span className="text-[11px] font-mono bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded">
              Bearer JWT
            </span>
          </div>

          <div className="space-y-3">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 space-y-2.5 bg-stone-50/50 dark:bg-stone-950/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono font-semibold text-stone-800 dark:text-stone-200">{ep.path}</code>
                  </div>
                  <span className="text-stone-500 text-[11px]">{ep.desc}</span>
                </div>

                <div className="relative">
                  <pre className="p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                    {ep.response}
                  </pre>
                  <button
                    onClick={() => copyCode(ep.response, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition"
                    title="Sao chép JSON mẫu"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex justify-between items-center text-xs">
          <span className="text-stone-400 font-mono text-[11px]">Hỗ trợ Webhooks &amp; WebSocket Events</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
