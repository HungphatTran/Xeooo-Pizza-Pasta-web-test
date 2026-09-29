import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  MenuItem,
  DishReview,
  ComboDeal,
  CouponItem,
  GiftCard,
  CustomerProfile,
} from '../types/restaurant';
import { StorageService } from '../services/storageService';

interface MenuContextType {
  menuItems: MenuItem[];
  reviews: DishReview[];
  combos: ComboDeal[];
  coupons: CouponItem[];
  appliedCoupon: CouponItem | null;
  wishlistIds: string[];
  customers: CustomerProfile[];
  
  // Actions
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addReview: (review: Omit<DishReview, 'id' | 'date'>) => void;
  applyCouponCode: (code: string, currentTotal: number) => { success: boolean; discountAmount: number; message: string };
  removeAppliedCoupon: () => void;
  toggleWishlist: (dishId: string) => void;
  isInWishlist: (dishId: string) => boolean;
  addPointsToCustomer: (phone: string, points: number, spentAmount: number) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => StorageService.getMenuItems());
  const [reviews, setReviews] = useState<DishReview[]>(() => StorageService.getReviews());
  const [combos, setCombos] = useState<ComboDeal[]>(() => StorageService.getCombos());
  const [coupons, setCoupons] = useState<CouponItem[]>(() => StorageService.getCoupons());
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => StorageService.getCustomers());
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('xeooo_wishlist');
      return saved ? JSON.parse(saved) : ['dish_pizza_bulgogi', 'dish_pasta_truffle'];
    } catch {
      return ['dish_pizza_bulgogi', 'dish_pasta_truffle'];
    }
  });

  useEffect(() => {
    StorageService.setMenuItems(menuItems);
  }, [menuItems]);

  useEffect(() => {
    StorageService.setReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    StorageService.setCustomers(customers);
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('xeooo_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addMenuItem = useCallback((itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `dish_${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  }, []);

  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addReview = useCallback((reviewData: Omit<DishReview, 'id' | 'date'>) => {
    const newRev: DishReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verifiedBooking: true,
    };
    setReviews((prev) => [newRev, ...prev]);
  }, []);

  const applyCouponCode = useCallback((code: string, currentTotal: number) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { success: false, discountAmount: 0, message: 'Mã khuyến mãi không tồn tại!' };
    }
    if (!coupon.isActive) {
      return { success: false, discountAmount: 0, message: 'Mã khuyến mãi đã hết hạn hoặc tạm dừng!' };
    }
    if (currentTotal < coupon.minOrderValue) {
      return {
        success: false,
        discountAmount: 0,
        message: `Đơn tối thiểu phải từ ${coupon.minOrderValue.toLocaleString()}đ để áp dụng mã này!`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'fixed_amount') {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((currentTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    setAppliedCoupon(coupon);
    return {
      success: true,
      discountAmount: discount,
      message: `Đã áp dụng mã [${coupon.code}] thành công! Giảm ${discount.toLocaleString()}đ.`,
    };
  }, [coupons]);

  const removeAppliedCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const toggleWishlist = useCallback((dishId: string) => {
    setWishlistIds((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  }, []);

  const isInWishlist = useCallback((dishId: string) => wishlistIds.includes(dishId), [wishlistIds]);

  const addPointsToCustomer = useCallback((phone: string, points: number, spentAmount: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.phone === phone) {
          const newPts = c.points + points;
          const newSpent = c.totalSpent + spentAmount;
          let tier = c.tier;
          if (newPts >= 400) tier = 'platinum';
          else if (newPts >= 200) tier = 'gold';
          else if (newPts >= 100) tier = 'silver';

          return {
            ...c,
            points: newPts,
            totalSpent: newSpent,
            visitCount: c.visitCount + 1,
            tier,
          };
        }
        return c;
      })
    );
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        reviews,
        combos,
        coupons,
        appliedCoupon,
        wishlistIds,
        customers,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addReview,
        applyCouponCode,
        removeAppliedCoupon,
        toggleWishlist,
        isInWishlist,
        addPointsToCustomer,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};
