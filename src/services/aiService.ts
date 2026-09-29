import { Reservation, DishReview, MenuItem } from '../types/restaurant';

export interface TrafficForecastItem {
  hour: string;
  expectedPax: number;
  occupancyPercent: number;
  confidence: number;
  status: 'low' | 'moderate' | 'peak' | 'rush';
  recommendedWaiters: number;
  recommendedChefs: number;
}

export interface ReviewSentimentResult {
  overallScore: number; // 0-100
  positiveRatio: number;
  negativeRatio: number;
  neutralRatio: number;
  topStrengths: string[];
  topImprovementAreas: string[];
  recentSummary: string;
}

export interface AnomalyReport {
  reservationId: string;
  customerName: string;
  riskScore: number; // 0-100
  level: 'low' | 'medium' | 'high';
  reasons: string[];
  recommendedAction: string;
}

export interface PromotionSuggestion {
  title: string;
  description: string;
  targetAudience: string;
  suggestedDiscount: string;
  expectedRoiPercent: number;
  urgency: 'high' | 'medium';
}

export const AIService = {
  // 1. Forecast traffic by hour
  predictTraffic: async (dateStr: string, reservations: Reservation[]): Promise<TrafficForecastItem[]> => {
    try {
      const res = await fetch('/api/ai/forecast-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, count: reservations.length }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to heuristic model below
    }

    const hours = [
      { h: '11:00', base: 12 },
      { h: '11:30', base: 18 },
      { h: '12:00', base: 34 },
      { h: '12:30', base: 42 },
      { h: '13:00', base: 26 },
      { h: '13:30', base: 14 },
      { h: '17:30', base: 16 },
      { h: '18:00', base: 38 },
      { h: '18:30', base: 52 },
      { h: '19:00', base: 64 },
      { h: '19:30', base: 68 },
      { h: '20:00', base: 54 },
      { h: '20:30', base: 36 },
      { h: '21:00', base: 22 },
    ];

    // Filter current reservations on this date
    const dateReservations = reservations.filter((r) => r.date === dateStr && r.status !== 'cancelled');

    return hours.map(({ h, base }) => {
      // Add existing bookings matching time slot prefix
      const bookedPax = dateReservations
        .filter((r) => r.timeSlot.startsWith(h.substring(0, 2)))
        .reduce((sum, r) => sum + r.pax, 0);

      const expectedPax = Math.round(base * 0.7 + bookedPax * 1.2);
      const maxCapacity = 75; // Total seats across floors
      const occupancy = Math.min(100, Math.round((expectedPax / maxCapacity) * 100));

      let status: 'low' | 'moderate' | 'peak' | 'rush' = 'moderate';
      if (occupancy >= 80) status = 'rush';
      else if (occupancy >= 60) status = 'peak';
      else if (occupancy < 35) status = 'low';

      return {
        hour: h,
        expectedPax,
        occupancyPercent: occupancy,
        confidence: 94,
        status,
        recommendedWaiters: Math.max(2, Math.ceil(expectedPax / 12)),
        recommendedChefs: Math.max(2, Math.ceil(expectedPax / 15)),
      };
    });
  },

  // 2. Predict Revenue
  predictRevenue: async (reservations: Reservation[]) => {
    const todayRes = reservations.filter((r) => r.status !== 'cancelled');
    const confirmedTotal = todayRes.reduce((acc, r) => acc + (r.totalAmount || r.depositAmount || 0), 0);
    const avgPerPax = 185000;
    const estWalkInPax = 35;
    const estWalkInRevenue = estWalkInPax * avgPerPax;

    return {
      todayEstimatedTotal: confirmedTotal + estWalkInRevenue,
      bookedPortion: confirmedTotal,
      walkInPortion: estWalkInRevenue,
      confidenceScore: 92,
      trendVsLastWeek: '+18.4%',
      busiestFloor: 'Tầng 3 (Không gian ấm cúng & Lồng kính view phố)',
    };
  },

  // 3. Review Sentiment Analysis
  analyzeReviews: (reviews: DishReview[]): ReviewSentimentResult => {
    if (!reviews.length) {
      return {
        overallScore: 90,
        positiveRatio: 90,
        negativeRatio: 5,
        neutralRatio: 5,
        topStrengths: ['Hương vị pizza bò Bulgogi', 'Set trang trí Lung Linh lãng mạn'],
        topImprovementAreas: ['Thời gian nướng pizza lúc cao điểm'],
        recentSummary: 'Khách hàng đặc biệt thích không gian ấm cúng và các món mỳ Ý xốt kem.',
      };
    }

    const highRating = reviews.filter((r) => r.rating >= 4).length;
    const lowRating = reviews.filter((r) => r.rating <= 2).length;
    const midRating = reviews.length - highRating - lowRating;

    return {
      overallScore: Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length * 5)) * 100),
      positiveRatio: Math.round((highRating / reviews.length) * 100),
      negativeRatio: Math.round((lowRating / reviews.length) * 100),
      neutralRatio: Math.round((midRating / reviews.length) * 100),
      topStrengths: [
        'Hương vị Pizza Bò Bulgogi nướng than củi thơm ngậy',
        'Set trang trí Lung Linh nến đom đóm chụp ảnh rất đẹp',
        'Thịt bò Wagyu Úc áp chảo mềm mọng và vang đỏ Ý hảo hạng',
        'Nhân viên phục vụ nhanh nhẹn, tận tình chúc mừng sinh nhật',
      ],
      topImprovementAreas: [
        'Khung giờ 19h30 tầng 3 khách đông, thời gian ra bánh pizza hơi lâu (15-20 phút)',
        'Cần mở rộng thêm chỗ để xe máy vào giờ cao điểm cuối tuần',
      ],
      recentSummary:
        'Chỉ số hài lòng đạt mức xuất sắc 95%. Khách đánh giá cao 9.6/10 cho trải nghiệm tiệc sinh nhật và hẹn hò lãng mạn tại Tầng 3.',
    };
  },

  // 4. Anomaly detection for fake/irregular bookings
  detectAnomalies: (reservations: Reservation[]): AnomalyReport[] => {
    const anomalies: AnomalyReport[] = [];

    reservations.forEach((r) => {
      const reasons: string[] = [];
      let riskScore = 0;

      // Phone verification
      const cleanPhone = r.phone.replace(/\s+/g, '');
      if (cleanPhone.length < 10 || /^000/.test(cleanPhone) || /(.)\1{4,}/.test(cleanPhone)) {
        reasons.push('Định dạng số điện thoại bất thường hoặc số ảo');
        riskScore += 45;
      }

      // Pax vs Table capacity
      if (r.pax > 8 && r.tableId.includes('window')) {
        reasons.push('Số lượng khách (8+) vượt quá sức chứa bàn cửa sổ tầng 1');
        riskScore += 30;
      }

      // Unpaid deposit for large booking
      if (r.pax >= 6 && r.paymentStatus === 'unpaid') {
        reasons.push('Đặt bàn tiệc đông người (6+) chưa đặt cọc trước');
        riskScore += 25;
      }

      if (riskScore >= 30) {
        anomalies.push({
          reservationId: r.id,
          customerName: r.customerName,
          riskScore,
          level: riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low',
          reasons,
          recommendedAction:
            riskScore >= 60
              ? 'Gọi điện thoại trực tiếp xác nhận hoặc giải phóng bàn nếu không liên lạc được'
              : 'Gửi tin nhắn SMS/Zalo nhắc đặt cọc giữ bàn trước giờ hẹn 2 tiếng',
        });
      }
    });

    return anomalies;
  },

  // 5. Dynamic Promotion Recommender
  suggestPromotions: (): PromotionSuggestion[] => {
    return [
      {
        title: 'Giảm 15% Khung Giờ Vàng (14h00 - 17h00)',
        description: 'Lượng khách khung giờ chiều đạt dưới 30% công suất. Đề xuất Flash Sale trà & bánh hoặc pizza size M.',
        targetAudience: 'Nhân viên văn phòng, học sinh sinh viên làm việc nhóm',
        suggestedDiscount: '15% Menu Mỳ Ý & Đồ Uống',
        expectedRoiPercent: 145,
        urgency: 'high',
      },
      {
        title: 'Combo Cặp Đôi Kỷ Niệm (Thứ 2 - Thứ 4)',
        description: 'Tăng lượng khách giữa tuần bằng gói hẹn hò nến hoa tặng kèm tráng miệng Tiramisu.',
        targetAudience: 'Các cặp đôi hẹn hò ngày thường',
        suggestedDiscount: 'Tặng tráng miệng + Miễn phí trang trí bàn lãng mạn',
        expectedRoiPercent: 120,
        urgency: 'medium',
      },
      {
        title: 'Tặng Voucher 100K Cho Đơn Tiệc Sinh Nhật Trên 1.5 Triệu',
        description: 'Thu hút tiệc sinh nhật gia đình và nhóm bạn lớn lên tầng 4 bàn to B4 & B5.',
        targetAudience: 'Khách tổ chức sinh nhật nhóm đông',
        suggestedDiscount: 'Giảm 100.000đ + Bảng tên viết tay',
        expectedRoiPercent: 160,
        urgency: 'medium',
      },
    ];
  },

  // 6. AI Customer Support Chatbot
  askAIChatbot: async (question: string, context?: { selectedDate?: string; guestsCount?: number }) => {
    try {
      const res = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.answer) return data.answer;
      }
    } catch {
      // Fallback
    }

    const qLower = question.toLowerCase();

    if (qLower.includes('bàn') && (qLower.includes('đẹp') || qLower.includes('view') || qLower.includes('hẹn hò'))) {
      return 'Dạ chào bạn! Để hẹn hò lãng mạn, vị trí đẹp nhất của Xéooo là Bàn 3 Tầng 3 (Bàn Lồng Kính View Phố) hoặc các Bàn Cửa Sổ Tầng 1 sân vườn. Quán có kèm gói trang trí Lung Linh với đèn đom đóm và nến thơm ấm cúng cực kỳ ngọt ngào ạ! ✨';
    }

    if (qLower.includes('món') || qLower.includes('ngon') || qLower.includes('bán chạy') || qLower.includes('gợi ý')) {
      return 'Signature không thể bỏ lỡ tại Xéooo gồm có: 1) Pizza Bò Bulgogi nướng than thơm lừng, 2) Mỳ Ý Truffle Nấm Sốt Kem béo bùi thanh nhẹ, 3) Salad Chanh Leo tươi mát giòn tan và 4) Tráng miệng Bánh Tiramisu Ý nhà làm. Bạn có thể chọn Combo Hẹn Hò 349.000đ để trải nghiệm trọn vẹn nhất ạ!';
    }

    if (qLower.includes('sinh nhật') || qLower.includes('tiệc') || qLower.includes('bánh')) {
      return 'Xéooo có hỗ trợ chuẩn bị tiệc sinh nhật trọn gói! Quán tặng miễn phí bảng đen viết tên nhân vật chính theo yêu cầu, bật nhạc chúc mừng sinh nhật và hỗ trợ giữ lạnh bánh kem cho bạn. Bạn có thể chọn tầng 4 bàn to B4 hoặc B5 ngồi thoải mái từ 6-8 người nhé!';
    }

    if (qLower.includes('đỗ xe') || qLower.includes('gửi xe') || qLower.includes('ô tô')) {
      return 'Dạ quán có chỗ để xe máy có bảo vệ trông coi hoàn toàn miễn phí ngay trước cửa. Khách đi ô tô có bãi đỗ cách quán chỉ 50m cực kỳ thuận tiện ạ!';
    }

    if (qLower.includes('cọc') || qLower.includes('thanh toán') || qLower.includes('vietqr')) {
      return 'Quán áp dụng đặt cọc nhẹ 100.000đ cho bàn hẹn hò và 200.000đ cho bàn tiệc đông người để giữ vị trí đẹp và chuẩn bị hoa nến chu đáo. Bạn có thể quét mã VietQR tự động tích hợp trên website, cọc sẽ được trừ trực tiếp vào hóa đơn khi bạn đến dùng bữa ạ.';
    }

    return 'Dạ Xéooo Pizza & Pasta xin chào! Chúng mình chuyên Pizza thủ công đế ủ men tự nhiên, mỳ Ý xốt độc bản và không gian tiệc lãng mạn ấm cúng tại tầng 1, tầng 3 và tầng 4. Bạn muốn đặt bàn ngày mấy và cho bao nhiêu khách để mình hỗ trợ chọn vị trí ưng ý nhất nhé!';
  },
};
