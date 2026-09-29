export interface IngredientItem {
  id: string;
  name: string;
  nameEn: string;
  sku: string;
  category: 'flour_dairy' | 'meat_seafood' | 'sauce_condiments' | 'beverage' | 'packaging';
  unit: 'kg' | 'g' | 'liter' | 'ml' | 'piece' | 'can';
  currentStock: number;
  minThreshold: number;
  optimalStock: number;
  costPerUnit: number; // VND
  supplierId: string;
  supplierName: string;
  lastRestockedDate: string;
  expiryDate?: string;
  location: string; // e.g. 'Kho mát T1', 'Tủ đông T3', 'Kệ khô Bếp'
}

export interface DishRecipe {
  menuItemId: string;
  dishName: string;
  servings: number;
  ingredients: {
    ingredientId: string;
    ingredientName: string;
    amount: number;
    unit: string;
  }[];
  totalIngredientCost: number;
  sellingPrice: number;
  marginPercent: number;
  preparationTimeMinutes: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  suppliedCategories: string[];
  reliabilityRating: number; // 1-5
}

export interface StockTransaction {
  id: string;
  ingredientId: string;
  ingredientName: string;
  type: 'inbound' | 'outbound_order' | 'outbound_waste' | 'adjustment';
  quantity: number;
  unit: string;
  cost: number;
  referenceId?: string; // e.g. Order ID, Goods Receipt ID
  date: string;
  operatorName: string;
  note?: string;
}
