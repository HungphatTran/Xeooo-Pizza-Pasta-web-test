import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  IngredientItem,
  DishRecipe,
  Supplier,
  StockTransaction,
} from '../types/restaurant';
import { StorageService } from '../services/storageService';

interface InventoryContextType {
  ingredients: IngredientItem[];
  recipes: DishRecipe[];
  suppliers: Supplier[];
  transactions: StockTransaction[];
  lowStockItems: IngredientItem[];

  // Actions
  restockIngredient: (ingredientId: string, quantity: number, cost: number, supplierName: string) => void;
  deductStockForOrder: (menuItemId: string, quantity: number) => void;
  addIngredient: (item: Omit<IngredientItem, 'id'>) => void;
  updateIngredient: (id: string, updates: Partial<IngredientItem>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<IngredientItem[]>(() => StorageService.getIngredients());
  const [recipes] = useState<DishRecipe[]>(() => StorageService.getRecipes());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => StorageService.getSuppliers());
  const [transactions, setTransactions] = useState<StockTransaction[]>([
    {
      id: 'tx_1',
      ingredientId: 'ing_flour_00',
      ingredientName: 'Bột mì Ý Caputo Tipo 00',
      type: 'inbound',
      quantity: 50,
      unit: 'kg',
      cost: 2100000,
      date: '2026-09-20',
      operatorName: 'Thu Hà',
      note: 'Nhập lô hàng định kỳ từ Stella Milano',
    },
    {
      id: 'tx_2',
      ingredientId: 'ing_mozzarella',
      ingredientName: 'Phô mai tươi Mozzarella',
      type: 'outbound_order',
      quantity: 3.5,
      unit: 'kg',
      cost: 647500,
      date: '2026-09-28',
      operatorName: 'Bếp Bánh Pizza',
      note: 'Tự động trừ kho theo 25 bánh pizza bán ra',
    },
  ]);

  useEffect(() => {
    StorageService.setIngredients(ingredients);
  }, [ingredients]);

  useEffect(() => {
    StorageService.setSuppliers(suppliers);
  }, [suppliers]);

  const lowStockItems = ingredients.filter((ing) => ing.currentStock <= ing.minThreshold);

  const restockIngredient = useCallback((ingredientId: string, quantity: number, cost: number, supplierName: string) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== ingredientId) return ing;
        return {
          ...ing,
          currentStock: ing.currentStock + quantity,
          lastRestockedDate: new Date().toISOString().split('T')[0],
        };
      })
    );

    const ing = ingredients.find((i) => i.id === ingredientId);
    const newTx: StockTransaction = {
      id: `tx_${Date.now()}`,
      ingredientId,
      ingredientName: ing ? ing.name : 'Nguyên liệu',
      type: 'inbound',
      quantity,
      unit: ing ? ing.unit : 'kg',
      cost,
      date: new Date().toISOString().split('T')[0],
      operatorName: 'Quản Lý Kho',
      note: `Nhập kho từ ${supplierName}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    StorageService.logAction({
      userId: 'manager',
      userName: 'Quản lý kho',
      userRole: 'manager',
      action: 'RESTOCK_INGREDIENT',
      entity: 'INVENTORY',
      entityId: ingredientId,
      details: `Nhập kho +${quantity} ${ing?.unit} [${ing?.name}] từ nhà cung cấp ${supplierName}`,
    });
  }, [ingredients]);

  const deductStockForOrder = useCallback((menuItemId: string, quantity: number) => {
    const recipe = recipes.find((r) => r.menuItemId === menuItemId);
    if (!recipe) return;

    setIngredients((prev) =>
      prev.map((ing) => {
        const itemInRecipe = recipe.ingredients.find((ri) => ri.ingredientId === ing.id);
        if (itemInRecipe) {
          const usedAmount = itemInRecipe.amount * quantity;
          return {
            ...ing,
            currentStock: Math.max(0, Number((ing.currentStock - usedAmount).toFixed(2))),
          };
        }
        return ing;
      })
    );
  }, [recipes]);

  const addIngredient = useCallback((itemData: Omit<IngredientItem, 'id'>) => {
    const newItem: IngredientItem = {
      ...itemData,
      id: `ing_${Date.now()}`,
    };
    setIngredients((prev) => [newItem, ...prev]);
  }, []);

  const updateIngredient = useCallback((id: string, updates: Partial<IngredientItem>) => {
    setIngredients((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const addSupplier = useCallback((supData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...supData,
      id: `sup_${Date.now()}`,
    };
    setSuppliers((prev) => [newSup, ...prev]);
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        ingredients,
        recipes,
        suppliers,
        transactions,
        lowStockItems,
        restockIngredient,
        deductStockForOrder,
        addIngredient,
        updateIngredient,
        addSupplier,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};
