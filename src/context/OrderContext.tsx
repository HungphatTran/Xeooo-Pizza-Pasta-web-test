import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  KitchenDishStatus,
  KitchenOrderItem,
  EInvoice,
  RefundRecord,
  SplitBillParty,
  PaymentMethod,
} from '../types/restaurant';
import { StorageService } from '../services/storageService';
import { realtimeBus } from '../services/apiService';

interface OrderContextType {
  kitchenOrders: KitchenOrderItem[];
  eInvoices: EInvoice[];
  refunds: RefundRecord[];
  
  // Kitchen actions
  addKitchenOrder: (order: Omit<KitchenOrderItem, 'id' | 'orderedAt' | 'status'>) => KitchenOrderItem;
  updateDishStatus: (itemId: string, status: KitchenDishStatus) => void;
  removeKitchenItem: (itemId: string) => void;

  // Split bill & payment
  calculateSplitBill: (items: KitchenOrderItem[], partyCount: number) => SplitBillParty[];
  generateEInvoice: (invoiceData: Omit<EInvoice, 'id' | 'invoiceNumber' | 'lookupCode' | 'issuedAt'>) => EInvoice;
  requestRefund: (reservationId: string, customerName: string, amount: number, reason: string) => RefundRecord;
  approveRefund: (refundId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrderItem[]>(() => StorageService.getKitchenOrders());
  const [eInvoices, setEInvoices] = useState<EInvoice[]>([]);
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);

  useEffect(() => {
    StorageService.setKitchenOrders(kitchenOrders);
  }, [kitchenOrders]);

  const addKitchenOrder = useCallback((orderData: Omit<KitchenOrderItem, 'id' | 'orderedAt' | 'status'>): KitchenOrderItem => {
    const now = new Date();
    const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
    const newItem: KitchenOrderItem = {
      ...orderData,
      id: `kord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      orderedAt: timeStr,
      status: 'pending',
    };

    setKitchenOrders((prev) => [newItem, ...prev]);

    StorageService.logAction({
      userId: 'staff',
      userName: 'Nhân viên phục vụ',
      userRole: 'staff',
      action: 'ADD_KITCHEN_ORDER',
      entity: 'KITCHEN',
      entityId: newItem.id,
      details: `Gọi món [${newItem.dishName} x${newItem.quantity}] cho bàn ${newItem.tableName}`,
    });

    realtimeBus.emit('KITCHEN_ORDER_ADDED', newItem);
    return newItem;
  }, []);

  const updateDishStatus = useCallback((itemId: string, status: KitchenDishStatus) => {
    const now = new Date();
    const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;

    setKitchenOrders((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, status };
        if (status === 'cooking' && !item.startedCookingAt) updated.startedCookingAt = timeStr;
        if (status === 'ready' && !item.readyAt) updated.readyAt = timeStr;
        if (status === 'served' && !item.servedAt) updated.servedAt = timeStr;
        return updated;
      })
    );

    realtimeBus.emit('DISH_STATUS_CHANGED', { itemId, status });
  }, []);

  const removeKitchenItem = useCallback((itemId: string) => {
    setKitchenOrders((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const calculateSplitBill = useCallback((items: KitchenOrderItem[], partyCount: number): SplitBillParty[] => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const splitAmount = Math.round(totalAmount / Math.max(1, partyCount));

    return Array.from({ length: partyCount }, (_, index) => ({
      id: `party_${index + 1}`,
      name: `Khách ${index + 1}`,
      itemIds: items.map((i) => i.id),
      amount: splitAmount,
      isPaid: false,
    }));
  }, []);

  const generateEInvoice = useCallback((invoiceData: Omit<EInvoice, 'id' | 'invoiceNumber' | 'lookupCode' | 'issuedAt'>): EInvoice => {
    const randCode = Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = `HD-XEOOO-${new Date().getFullYear()}-${randCode}`;
    const lookupCode = `LOOKUP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newInvoice: EInvoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      invoiceNumber,
      lookupCode,
      issuedAt: new Date().toISOString(),
    };

    setEInvoices((prev) => [newInvoice, ...prev]);

    StorageService.logAction({
      userId: 'cashier',
      userName: 'Thu ngân',
      userRole: 'cashier',
      action: 'GENERATE_E_INVOICE',
      entity: 'INVOICE',
      entityId: invoiceNumber,
      details: `Xuất hóa đơn điện tử VAT [${invoiceNumber}] trị giá ${newInvoice.finalTotal.toLocaleString()}đ`,
    });

    return newInvoice;
  }, []);

  const requestRefund = useCallback((reservationId: string, customerName: string, amount: number, reason: string): RefundRecord => {
    const newRefund: RefundRecord = {
      id: `ref_${Date.now()}`,
      reservationId,
      customerName,
      originalAmount: amount,
      refundAmount: amount,
      reason,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setRefunds((prev) => [newRefund, ...prev]);
    return newRefund;
  }, []);

  const approveRefund = useCallback((refundId: string) => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? { ...r, status: 'approved', processedAt: new Date().toISOString(), approvedBy: 'Quản Lý' }
          : r
      )
    );
  }, []);

  return (
    <OrderContext.Provider
      value={{
        kitchenOrders,
        eInvoices,
        refunds,
        addKitchenOrder,
        updateDishStatus,
        removeKitchenItem,
        calculateSplitBill,
        generateEInvoice,
        requestRefund,
        approveRefund,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderProvider');
  return context;
};
