import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { IngredientItem, Supplier } from '../types/restaurant';
import {
  Package,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Building,
  FileText,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const {
    ingredients,
    suppliers,
    transactions,
    lowStockItems,
    restockIngredient,
    addIngredient,
    recipes,
    addToast,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'stock' | 'suppliers' | 'history' | 'recipes'>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedRestockItem, setSelectedRestockItem] = useState<IngredientItem | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [restockCost, setRestockCost] = useState(500000);

  const filteredIngredients = ingredients.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRestock = (item: IngredientItem) => {
    setSelectedRestockItem(item);
    setRestockQty(item.optimalStock - item.currentStock > 0 ? item.optimalStock - item.currentStock : 10);
    setRestockCost(item.costPerUnit * 10);
    setIsRestockModalOpen(true);
  };

  const handleConfirmRestock = () => {
    if (!selectedRestockItem) return;
    restockIngredient(selectedRestockItem.id, restockQty, restockCost, selectedRestockItem.supplierName);
    setIsRestockModalOpen(false);
    addToast('Nhập kho thành công', `Đã cộng thêm ${restockQty} ${selectedRestockItem.unit} cho [${selectedRestockItem.name}]`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Quản Lý Kho Nguyên Liệu &amp; Định Lượng Bếp</span>
            {lowStockItems.length > 0 && (
              <span className="text-xs font-sans font-semibold bg-rose-500/10 text-rose-500 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                {lowStockItems.length} mặt hàng sắp hết
              </span>
            )}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi tồn kho thực phẩm tươi Ý, bột men, phô mai Mozzarella, tự động trừ kho khi bán món và quản lý đối tác cung ứng
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
          {[
            { id: 'stock', label: 'Tồn Kho Hiện Tại' },
            { id: 'suppliers', label: 'Nhà Cung Cấp' },
            { id: 'history', label: 'Lịch Sử Nhập/Xuất' },
            { id: 'recipes', label: 'Công Thức Định Lượng' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: STOCK INVENTORY */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          {/* Low Stock Warning Banner */}
          {lowStockItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-400">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Cảnh báo: <strong>{lowStockItems.map((i) => i.name).join(', ')}</strong> đã giảm xuống dưới ngưỡng tối thiểu! Cần đặt bổ sung sớm.
                </span>
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="flex items-center px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl gap-2.5">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên nguyên liệu, mã SKU, vị trí kho (Kho lạnh T1, Kệ khô T3)..."
              className="w-full bg-transparent border-none outline-none text-xs text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Stock Table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-semibold bg-stone-50/50 dark:bg-stone-950/40">
                    <th className="py-3 px-4">Nguyên Liệu</th>
                    <th className="py-3 px-4">Mã SKU</th>
                    <th className="py-3 px-4 text-right">Tồn Kho Hiện Tại</th>
                    <th className="py-3 px-4 text-right">Ngưỡng Tối Thiểu</th>
                    <th className="py-3 px-4 text-right">Đơn Giá Nhập</th>
                    <th className="py-3 px-4">Vị Trí Lưu Kho</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredIngredients.map((ing) => {
                    const isLow = ing.currentStock <= ing.minThreshold;
                    return (
                      <tr key={ing.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                        <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">
                          <div>{ing.name}</div>
                          <div className="text-[10px] text-stone-400 font-normal">{ing.nameEn}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-400">{ing.sku}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          <span className={isLow ? 'text-rose-500 font-bold' : 'text-stone-900 dark:text-stone-100'}>
                            {ing.currentStock} {ing.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-stone-400">
                          {ing.minThreshold} {ing.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-amber-500">
                          {ing.costPerUnit.toLocaleString()}đ/{ing.unit}
                        </td>
                        <td className="py-3 px-4 text-stone-500">{ing.location}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleOpenRestock(ing)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold text-[11px] transition shadow-xs"
                          >
                            + Nhập Kho
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{sup.name}</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                  Đánh giá: {sup.reliabilityRating} ★
                </span>
              </div>
              <div className="text-xs text-stone-500 space-y-1">
                <div>Liên hệ: <strong>{sup.contactPerson}</strong> ({sup.phone})</div>
                <div>Email: {sup.email}</div>
                <div>Địa chỉ: {sup.address}</div>
              </div>
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-1 text-[10px]">
                {sup.suppliedCategories.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-400">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TRANSACTIONS HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-3">
          <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
            Lịch Sử Nhập / Trừ Kho Thực Tế
          </h3>
          <div className="space-y-2 text-xs">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        tx.type === 'inbound'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {tx.type === 'inbound' ? 'Nhập Kho' : 'Trừ Kho Món Bán'}
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{tx.ingredientName}</span>
                  </div>
                  <div className="text-stone-500 text-[11px]">{tx.note} · Bởi: {tx.operatorName}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-amber-500">
                    {tx.type === 'inbound' ? '+' : '-'}{tx.quantity} {tx.unit}
                  </div>
                  <div className="text-[10px] text-stone-400">{tx.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RECIPES */}
      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recipes.map((rc, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{rc.dishName}</span>
                <span className="text-[11px] font-mono text-emerald-500 font-bold">
                  Biên LN: {rc.marginPercent}%
                </span>
              </div>
              <div className="text-stone-500 space-y-1 text-[11px]">
                <div>Giá bán: <strong className="font-mono text-stone-800 dark:text-stone-200">{rc.sellingPrice.toLocaleString()}đ</strong></div>
                <div>Chi phí NVL: <strong className="font-mono text-rose-400">{rc.totalIngredientCost.toLocaleString()}đ</strong></div>
                <div>Thời gian nướng/nấu: {rc.preparationTimeMinutes} phút</div>
              </div>
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1 text-[11px]">
                <span className="font-semibold text-stone-400 block">Định lượng nguyên liệu:</span>
                {rc.ingredients.map((ing, ii) => (
                  <div key={ii} className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>{ing.ingredientName}</span>
                    <span className="font-mono">{ing.amount} {ing.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && selectedRestockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Nhập Hàng Vào Kho: {selectedRestockItem.name}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-stone-500 block mb-1">Số lượng nhập ({selectedRestockItem.unit}):</label>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 font-mono text-sm text-stone-900 dark:text-stone-100 outline-none"
                />
              </div>
              <div>
                <label className="text-stone-500 block mb-1">Tổng tiền hóa đơn nhập hàng (VND):</label>
                <input
                  type="number"
                  value={restockCost}
                  onChange={(e) => setRestockCost(Number(e.target.value))}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 font-mono text-sm text-stone-900 dark:text-stone-100 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRestock}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400"
              >
                Xác Nhận Nhập Kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
