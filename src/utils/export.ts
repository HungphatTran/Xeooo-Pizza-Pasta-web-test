import { Reservation, RevenueRecord } from '../types/restaurant';

/**
 * Exports data to CSV file with UTF-8 BOM so Microsoft Excel can display
 * Vietnamese accented characters correctly without encoding issues.
 */
export function exportReservationsToCSV(reservations: Reservation[], filename = 'danh_sach_dat_ban.csv') {
  const headers = [
    'Mã đặt bàn',
    'Khách hàng',
    'Số điện thoại',
    'Email',
    'Ngày',
    'Khung giờ',
    'Số lượng (Pax)',
    'Tầng',
    'Bàn',
    'Gói set trang trí',
    'Tên sự kiện',
    'Trạng thái',
    'Tiền cọc (VNĐ)',
    'Tổng cộng (VNĐ)',
    'Thanh toán',
    'Phương thức',
    'Nguồn đặt',
    'Ghi chú'
  ];

  const rows = reservations.map(r => [
    r.id,
    `"${r.customerName.replace(/"/g, '""')}"`,
    `'${r.phone}`,
    r.email || '',
    r.date,
    r.timeSlot,
    r.pax,
    `Tầng ${r.floor}`,
    `"${r.tableName}"`,
    r.decorationSet,
    `"${(r.specialEventTitle || '').replace(/"/g, '""')}"`,
    r.status,
    r.depositAmount,
    r.totalAmount,
    r.paymentStatus,
    r.paymentMethod || 'chưa rõ',
    r.source === 'online' ? 'Website Online' : 'Nhân viên thủ công',
    `"${(r.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRevenueToCSV(records: RevenueRecord[], filename = 'bao_cao_doanh_thu.csv') {
  const headers = ['Ngày', 'Tổng doanh thu (VNĐ)', 'Số lượt đặt bàn', 'Tổng lượng khách (Pax)', 'Cọc Online', 'Thu tại quán'];
  const rows = records.map(r => [
    r.date,
    r.revenue,
    r.bookingsCount,
    r.paxCount,
    r.onlineDeposit,
    r.inStorePayment
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrintReport() {
  window.print();
}
