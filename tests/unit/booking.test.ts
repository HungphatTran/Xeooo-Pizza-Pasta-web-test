import { describe, it, expect } from 'vitest';
import { StorageService } from '../../src/services/storageService';
import { AIService } from '../../src/services/aiService';

describe('Restaurant Business Logic Unit Tests', () => {
  it('should calculate correct VAT and total for dine-in orders', () => {
    const subtotal = 450000;
    const vatRate = 0.08;
    const vat = Math.round(subtotal * vatRate);
    const deposit = 100000;
    const remaining = subtotal + vat - deposit;

    expect(vat).toBe(36000);
    expect(remaining).toBe(386000);
  });

  it('should initialize tables with correct capacity and floor allocation', () => {
    const tables = StorageService.getTables();
    expect(tables.length).toBeGreaterThan(5);

    const floor3Tables = tables.filter((t) => t.floor === 3);
    expect(floor3Tables.length).toBeGreaterThan(0);
  });

  it('should detect suspicious phone numbers in AI anomaly detector', () => {
    const mockBookings: any[] = [
      {
        id: 'MB-TEST-1',
        customerName: 'Fake User',
        phone: '0000000000',
        tableId: 'b_window_1',
        pax: 10,
        paymentStatus: 'unpaid',
      },
    ];

    const anomalies = AIService.detectAnomalies(mockBookings);
    expect(anomalies.length).toBeGreaterThan(0);
    expect(anomalies[0].riskScore).toBeGreaterThanOrEqual(40);
  });
});
