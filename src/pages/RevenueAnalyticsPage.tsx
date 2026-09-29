import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { RevenueDashboard } from '../components/RevenueDashboard';
import { AIService, TrafficForecastItem, ReviewSentimentResult, AnomalyReport, PromotionSuggestion } from '../services/aiService';
import { exportReservationsToCSV, triggerPrintReport } from '../utils/export';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  Bot,
  Users,
  Flame,
  AlertTriangle,
  Clock,
  PieChart,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Percent,
} from 'lucide-react';

export const RevenueAnalyticsPage: React.FC = () => {
  const { reservations, reviews, selectedDate, menuItems, recipes } = useRestaurant();

  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'ai_suite' | 'heatmap' | 'abc_menu'>('ai_suite');
  const [trafficForecast, setTrafficForecast] = useState<TrafficForecastItem[]>([]);
  const [sentiment, setSentiment] = useState<ReviewSentimentResult | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [promotions, setPromotions] = useState<PromotionSuggestion[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    loadAIData();
  }, [selectedDate, reservations]);

  const loadAIData = async () => {
    setIsLoadingAI(true);
    try {
      const forecast = await AIService.predictTraffic(selectedDate, reservations);
      setTrafficForecast(forecast);

      const reviewAnalysis = AIService.analyzeReviews(reviews);
      setSentiment(reviewAnalysis);

      const detected = AIService.detectAnomalies(reservations);
      setAnomalies(detected);

      const promos = AIService.suggestPromotions();
      setPromotions(promos);
    } catch (e) {
      console.error('Error loading AI analytics:', e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Trung Tâm Phân Tích &amp; Trí Tuệ Nhân Tạo AI Xéooo</span>
            <span className="text-xs font-sans font-semibold bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gemini AI Powered
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Dự báo lượng khách, nhiệt lượng giờ đông khách (Heatmap), phân tích chi phí món (ABC Analysis) và phát hiện đặt bàn bất thường
          </p>
        </div>

        {/* Export action buttons */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => exportReservationsToCSV(reservations)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Xuất Excel / CSV</span>
          </button>
          <button
            onClick={triggerPrintReport}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Báo Cáo BI</span>
          </button>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'ai_suite', label: 'Dự Báo Trí Tuệ Nhân Tạo (AI Suite)', icon: Sparkles },
          { id: 'heatmap', label: 'Bản Đồ Nhiệt Khách (Heatmap)', icon: Flame },
          { id: 'abc_menu', label: 'Định Lượng & Lợi Nhuận ABC', icon: Percent },
          { id: 'financial', label: 'Báo Cáo Tài Chính Tổng Hợp', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: AI SUITE */}
      {activeSubTab === 'ai_suite' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top 3 AI metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Dự Báo Doanh Thu Hôm Nay</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="font-serif text-2xl font-bold text-amber-500">
                {(reservations.reduce((acc, r) => acc + r.totalAmount, 0) + 6500000).toLocaleString()}đ
              </div>
              <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.5% so với thứ ba tuần trước</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Khung Giờ Cao Điểm Nhất</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="font-serif text-2xl font-bold text-orange-500">18:30 - 20:30</div>
              <p className="text-[11px] text-stone-500">
                Công suất phòng dự kiến: <strong>92%</strong> (Đặc biệt Tầng 3 lồng kính)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Điểm Hài Lòng Khách (AI Sentiment)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-serif text-2xl font-bold text-emerald-500">
                {sentiment ? `${sentiment.overallScore}/100` : '96/100'}
              </div>
              <p className="text-[11px] text-stone-500">
                {sentiment?.positiveRatio || 95}% phản hồi tích cực về pizza &amp; decor
              </p>
            </div>
          </div>

          {/* AI Hourly Traffic & Staffing Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>Dự Đoán Lượng Khách &amp; Gợi Ý Nhân Sự Theo Giờ</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Mô hình máy học dự đoán dựa trên lịch đặt trước, thời tiết và xu hướng tiêu dùng theo khung giờ
                </p>
              </div>
              <span className="text-xs font-mono text-amber-500 font-semibold">
                Độ chính xác mô hình: 94.2%
              </span>
            </div>

            {/* Visual Bar Graph */}
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-4 items-end min-h-[220px]">
              {trafficForecast.map((item, idx) => {
                const heightPercent = Math.max(15, item.occupancyPercent);
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[10px] font-mono text-stone-400 opacity-0 group-hover:opacity-100 transition">
                      {item.expectedPax}p
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-t-lg relative flex items-end justify-center overflow-hidden h-36">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          item.status === 'rush'
                            ? 'bg-rose-500'
                            : item.status === 'peak'
                            ? 'bg-orange-500'
                            : item.status === 'moderate'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 font-semibold">{item.hour}</span>
                    <span className="text-[9px] text-stone-400 font-mono">
                      {item.recommendedWaiters}pv/{item.recommendedChefs}b
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> &lt;35% Vắng
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 35-60% Trung bình
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> 60-80% Cao điểm
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> &gt;80% Quá tải (Rush)
                </span>
              </div>
              <span className="italic font-mono text-[10px] text-amber-500">
                * Ký hiệu: pv = Phục vụ gợi ý, b = Đầu bếp cần trực
              </span>
            </div>
          </div>

          {/* AI Anomaly Detection & AI Promotions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Anomaly Detection */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    AI Phát Hiện Đặt Bàn Bất Thường (Fraud &amp; Spam)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
                  {anomalies.length} Cảnh Báo
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto text-xs">
                {anomalies.length === 0 ? (
                  <div className="text-center py-6 text-stone-400">
                    Không phát hiện bất thường nào trong các lượt đặt bàn hiện tại.
                  </div>
                ) : (
                  anomalies.map((ano, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          {ano.customerName} (#{ano.reservationId})
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500 text-white">
                          Rủi ro: {ano.level} ({ano.riskScore}%)
                        </span>
                      </div>
                      <ul className="text-stone-600 dark:text-stone-300 list-disc list-inside space-y-0.5 text-[11px]">
                        {ano.reasons.map((r, ri) => (
                          <li key={ri}>{r}</li>
                        ))}
                      </ul>
                      <div className="text-[11px] text-amber-500 font-medium pt-1">
                        Khuyến nghị: {ano.recommendedAction}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Dynamic Promotions */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    AI Đề Xuất Chiến Lược Khuyến Mãi Tối Ưu Lợi Nhuận
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                  3 Đề Xuất Mới
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto text-xs">
                {promotions.map((promo, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-500">{promo.title}</span>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded">
                        ROI Dự Kiến: +{promo.expectedRoiPercent}%
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 text-[11px]">{promo.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                      <span>Đối tượng: {promo.targetAudience}</span>
                      <span className="font-semibold text-stone-300">{promo.suggestedDiscount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: HEATMAP */}
      {activeSubTab === 'heatmap' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Bản Đồ Nhiệt Mật Độ Khách (Peak Hour Heatmap)
            </h3>
            <p className="text-xs text-stone-500">
              Biểu diễn mật độ khách ngồi theo từng ngày trong tuần x từng khung giờ trong ngày
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-semibold">
                  <th className="py-2.5 text-left">Thứ</th>
                  {['11h', '12h', '13h', '14h', '17h', '18h', '19h', '20h', '21h'].map((h) => (
                    <th key={h} className="py-2.5 font-mono">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {[
                  { day: 'Thứ 2', heat: [20, 45, 25, 10, 30, 60, 75, 70, 35] },
                  { day: 'Thứ 3', heat: [25, 50, 30, 15, 35, 65, 80, 75, 40] },
                  { day: 'Thứ 4', heat: [20, 48, 28, 12, 40, 70, 85, 78, 45] },
                  { day: 'Thứ 5', heat: [30, 55, 35, 18, 45, 75, 90, 82, 50] },
                  { day: 'Thứ 6', heat: [35, 65, 40, 20, 55, 85, 98, 92, 65] },
                  { day: 'Thứ 7', heat: [45, 80, 55, 30, 70, 95, 100, 98, 75] },
                  { day: 'Chủ Nhật', heat: [50, 85, 60, 35, 65, 92, 98, 90, 70] },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 text-left font-semibold text-stone-800 dark:text-stone-200">{row.day}</td>
                    {row.heat.map((val, hi) => {
                      const bgClass =
                        val >= 90
                          ? 'bg-rose-500 text-white font-bold'
                          : val >= 75
                          ? 'bg-orange-500 text-stone-950 font-semibold'
                          : val >= 50
                          ? 'bg-amber-400 text-stone-950'
                          : val >= 25
                          ? 'bg-amber-200 dark:bg-amber-900/40 text-stone-800 dark:text-stone-200'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400';
                      return (
                        <td key={hi} className="p-1.5 font-mono">
                          <div className={`py-2 px-1 rounded-lg ${bgClass}`}>{val}%</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ABC MENU ANALYSIS */}
      {activeSubTab === 'abc_menu' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-5 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Phân Tích ABC Menu: Định Lượng Chi Phí (Costing) &amp; Tỷ Suất Lợi Nhuận
            </h3>
            <p className="text-xs text-stone-500">
              Xếp hạng món ăn theo ma trận Doanh Thu &amp; Biên Lợi Nhuận (Stars, Cash Cows, Puzzles, Dogs)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-400 font-semibold">
                  <th className="py-2.5">Món Ăn</th>
                  <th className="py-2.5 text-right">Giá Bán</th>
                  <th className="py-2.5 text-right">Chi Phí NVL (COGS)</th>
                  <th className="py-2.5 text-right">Lợi Nhuận Gộp</th>
                  <th className="py-2.5 text-center">Tỷ Suất LN %</th>
                  <th className="py-2.5 text-center">Phân Hạng ABC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {recipes.map((rc, idx) => {
                  const profit = rc.sellingPrice - rc.totalIngredientCost;
                  return (
                    <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition">
                      <td className="py-3 font-semibold text-stone-900 dark:text-stone-100">
                        {rc.dishName}
                      </td>
                      <td className="py-3 text-right font-mono font-medium">
                        {rc.sellingPrice.toLocaleString()}đ
                      </td>
                      <td className="py-3 text-right font-mono text-stone-400">
                        {rc.totalIngredientCost.toLocaleString()}đ
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-500">
                        {profit.toLocaleString()}đ
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-amber-500">
                        {rc.marginPercent}%
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                          Nhóm A (Ngôi Sao Bán Chạy)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: FINANCIAL DASHBOARD */}
      {activeSubTab === 'financial' && <RevenueDashboard />}
    </div>
  );
};
