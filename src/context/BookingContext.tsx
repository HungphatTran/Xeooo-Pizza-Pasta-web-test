import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Reservation,
  TableItem,
  ReservationStatus,
  TableStatus,
  WaitingListEntry,
  FloorNumber,
} from '../types/restaurant';
import { StorageService } from '../services/storageService';
import { realtimeBus } from '../services/apiService';
import { TODAY_STR } from '../data/initialData';

interface BookingContextType {
  reservations: Reservation[];
  tables: TableItem[];
  waitingList: WaitingListEntry[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Reservation actions
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt'>) => Reservation;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;

  // Table actions
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  updateTablePosition: (tableId: string, x: number, y: number) => void;
  mergeTables: (primaryTableId: string, secondaryTableId: string) => boolean;
  splitTable: (primaryTableId: string) => boolean;
  moveTable: (reservationId: string, targetTableId: string) => boolean;
  autoAssignTable: (pax: number, preferredFloor?: FloorNumber) => TableItem | null;

  // Waiting list actions
  addToWaitingList: (entry: Omit<WaitingListEntry, 'id' | 'addedAt' | 'status'>) => WaitingListEntry;
  updateWaitingStatus: (id: string, status: WaitingListEntry['status']) => void;
  removeFromWaitingList: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>(() => StorageService.getReservations());
  const [tables, setTables] = useState<TableItem[]>(() => StorageService.getTables());
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>(() => StorageService.getWaitingList());
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_STR);

  // Sync to Storage whenever state changes
  useEffect(() => {
    StorageService.setReservations(reservations);
  }, [reservations]);

  useEffect(() => {
    StorageService.setTables(tables);
  }, [tables]);

  useEffect(() => {
    StorageService.setWaitingList(waitingList);
  }, [waitingList]);

  // Realtime listeners
  useEffect(() => {
    const unsub = realtimeBus.on('RESERVATION_UPDATED', (updated: Reservation) => {
      setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    });
    return unsub;
  }, []);

  const addReservation = useCallback((reservationData: Omit<Reservation, 'id' | 'createdAt'>): Reservation => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `MB-${randomDigits}`;
    const newReservation: Reservation = {
      ...reservationData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Update table status if seated
    if (newReservation.status === 'seated') {
      setTables((prev) =>
        prev.map((t) => (t.id === newReservation.tableId ? { ...t, status: 'occupied' } : t))
      );
    } else if (newReservation.status === 'confirmed') {
      setTables((prev) =>
        prev.map((t) => (t.id === newReservation.tableId && t.status === 'available' ? { ...t, status: 'reserved' } : t))
      );
    }

    StorageService.logAction({
      userId: 'system',
      userName: newReservation.customerName,
      userRole: 'customer',
      action: 'ADD_RESERVATION',
      entity: 'RESERVATION',
      entityId: newId,
      details: `Đặt bàn mới: ${newReservation.tableName} lúc ${newReservation.timeSlot} (${newReservation.pax} khách)`,
    });

    realtimeBus.emit('RESERVATION_CREATED', newReservation);
    return newReservation;
  }, []);

  const updateReservationStatus = useCallback((id: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, status };

        // Auto update table status
        if (status === 'seated') {
          setTables((tbls) => tbls.map((t) => (t.id === r.tableId ? { ...t, status: 'occupied' } : t)));
        } else if (status === 'completed' || status === 'cancelled') {
          setTables((tbls) => tbls.map((t) => (t.id === r.tableId ? { ...t, status: 'cleaning' } : t)));
        }

        realtimeBus.emit('RESERVATION_UPDATED', updated);
        return updated;
      })
    );

    StorageService.logAction({
      userId: 'staff',
      userName: 'Nhân viên ca trực',
      userRole: 'staff',
      action: 'UPDATE_STATUS',
      entity: 'RESERVATION',
      entityId: id,
      details: `Cập nhật trạng thái đặt bàn ${id} -> [${status}]`,
    });
  }, []);

  const updateReservation = useCallback((id: string, updates: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...updates };
        realtimeBus.emit('RESERVATION_UPDATED', updated);
        return updated;
      })
    );
  }, []);

  const deleteReservation = useCallback((id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    StorageService.logAction({
      userId: 'manager',
      userName: 'Quản lý',
      userRole: 'manager',
      action: 'DELETE_RESERVATION',
      entity: 'RESERVATION',
      entityId: id,
      details: `Đã xóa đặt bàn ${id}`,
    });
  }, []);

  const updateTableStatus = useCallback((tableId: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status } : t))
    );
  }, []);

  const updateTablePosition = useCallback((tableId: string, x: number, y: number) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, x, y } : t))
    );
  }, []);

  // Merge tables (Gộp bàn)
  const mergeTables = useCallback((primaryTableId: string, secondaryTableId: string): boolean => {
    const primary = tables.find((t) => t.id === primaryTableId);
    const secondary = tables.find((t) => t.id === secondaryTableId);
    if (!primary || !secondary) return false;

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === primaryTableId) {
          const mergedList = t.mergedWith || [];
          return {
            ...t,
            capacity: t.capacity + secondary.capacity,
            name: `${t.name} + [${secondary.name}]`,
            mergedWith: [...mergedList, secondaryTableId],
          };
        }
        if (t.id === secondaryTableId) {
          return {
            ...t,
            parentTableId: primaryTableId,
            status: 'occupied',
          };
        }
        return t;
      })
    );

    StorageService.logAction({
      userId: 'staff',
      userName: 'Nhân viên ca trực',
      userRole: 'staff',
      action: 'MERGE_TABLES',
      entity: 'FLOOR_PLAN',
      details: `Đã gộp ${secondary.name} vào ${primary.name}`,
    });
    return true;
  }, [tables]);

  // Split tables (Tách bàn)
  const splitTable = useCallback((primaryTableId: string): boolean => {
    const primary = tables.find((t) => t.id === primaryTableId);
    if (!primary || !primary.mergedWith?.length) return false;

    const mergedIds = primary.mergedWith;

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === primaryTableId) {
          // Restore default capacity estimate
          return {
            ...t,
            name: t.name.split(' + [')[0],
            capacity: Math.max(2, t.capacity - 4),
            mergedWith: [],
          };
        }
        if (mergedIds.includes(t.id)) {
          return {
            ...t,
            parentTableId: undefined,
            status: 'available',
          };
        }
        return t;
      })
    );

    StorageService.logAction({
      userId: 'staff',
      userName: 'Nhân viên ca trực',
      userRole: 'staff',
      action: 'SPLIT_TABLES',
      entity: 'FLOOR_PLAN',
      details: `Đã tách bàn ${primary.name} về vị trí ban đầu`,
    });
    return true;
  }, [tables]);

  // Move table (Chuyển bàn cho khách)
  const moveTable = useCallback((reservationId: string, targetTableId: string): boolean => {
    const res = reservations.find((r) => r.id === reservationId);
    const targetTable = tables.find((t) => t.id === targetTableId);
    if (!res || !targetTable) return false;

    const oldTableId = res.tableId;

    // Update reservation
    updateReservation(reservationId, {
      tableId: targetTable.id,
      tableName: targetTable.name,
      floor: targetTable.floor,
    });

    // Update tables status
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === oldTableId) return { ...t, status: 'cleaning' };
        if (t.id === targetTableId) return { ...t, status: res.status === 'seated' ? 'occupied' : 'reserved' };
        return t;
      })
    );

    StorageService.logAction({
      userId: 'staff',
      userName: 'Nhân viên phục vụ',
      userRole: 'staff',
      action: 'MOVE_TABLE',
      entity: 'RESERVATION',
      entityId: reservationId,
      details: `Chuyển khách ${res.customerName} từ bàn [${res.tableName}] sang bàn [${targetTable.name}]`,
    });
    return true;
  }, [reservations, tables, updateReservation]);

  // Auto assign optimal table
  const autoAssignTable = useCallback((pax: number, preferredFloor?: FloorNumber): TableItem | null => {
    const availableTables = tables.filter((t) => {
      const matchStatus = t.status === 'available';
      const matchFloor = preferredFloor ? t.floor === preferredFloor : true;
      const matchCapacity = t.capacity >= pax;
      return matchStatus && matchFloor && matchCapacity;
    });

    if (!availableTables.length) return null;

    // Sort by tightest capacity fit
    availableTables.sort((a, b) => a.capacity - b.capacity);
    return availableTables[0];
  }, [tables]);

  // Waiting list
  const addToWaitingList = useCallback((entryData: Omit<WaitingListEntry, 'id' | 'addedAt' | 'status'>): WaitingListEntry => {
    const now = new Date();
    const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
    const newEntry: WaitingListEntry = {
      ...entryData,
      id: `wait_${Date.now()}`,
      addedAt: timeStr,
      status: 'waiting',
    };

    setWaitingList((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const updateWaitingStatus = useCallback((id: string, status: WaitingListEntry['status']) => {
    setWaitingList((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)));
  }, []);

  const removeFromWaitingList = useCallback((id: string) => {
    setWaitingList((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return (
    <BookingContext.Provider
      value={{
        reservations,
        tables,
        waitingList,
        selectedDate,
        setSelectedDate,
        addReservation,
        updateReservationStatus,
        updateReservation,
        deleteReservation,
        updateTableStatus,
        updateTablePosition,
        mergeTables,
        splitTable,
        moveTable,
        autoAssignTable,
        addToWaitingList,
        updateWaitingStatus,
        removeFromWaitingList,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};
