import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem } from '../types/restaurant';
import {
  QrCode,
  Heart,
  Search,
  UtensilsCrossed,
  Sparkles,
  Plus,
  Check,
  Star,
  Flame,
  Info,
} from 'lucide-react';

export const QRMenuPage: React.FC = () => {
  const { menuItems, wishlistIds, toggleWishlist, isInWishlist, addKitchenOrder, addToast, tables } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'starter' | 'main' | 'drinks' | 'dessert'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableId, setSelectedTableId] = useState('b3t3');
  const [onlyWishlist, setOnlyWishlist] = useState(false);

  const filteredDishes = menuItems.filter((dish) => {
    const matchCat = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchWishlist = onlyWishlist ? isInWishlist(dish.id) : true;
    return matchCat && matchSearch && matchWishlist;
  });

  const handleOrderDirect = (dish: MenuItem) => {
    const targetTable = tables.find((t) => t.id === selectedTableId) || tables[0];
    addKitchenOrder({
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableId: targetTable.id,
      tableName: targetTable.name,
      menuItemId: dish.id,
      dishName: dish.name,
      quantity: 1,
      price: dish.price,
      priority: 'normal',
    });
    addToast('Gọi món thành công', `Đã bắn món [${dish.name}] vào bếp cho ${targetTable.name}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header bar with QR Check-in badge */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs">
            <QrCode className="w-3.5 h-3.5" />
            <span>Thực Đơn Điện Tử Trực Tuyến &amp; Check-in</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Khám Phá Hương Vị Ý Thượng Hạng
          </h1>
          <p className="text-xs text-stone-500 max-w-xl">
            Pizza nướng củi men chậm 48h, Mỳ Ý sốt kem Truffle đen độc bản, và Vang đỏ hảo hạng tuyển chọn
          </p>
        </div>

        {/* Check-in selector for dine-in */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs space-y-2 w-full md:w-auto">
          <div className="flex items-center gap-2 font-semibold text-stone-800 dark:text-stone-200">
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>Đang Ngồi Tại Bàn:</span>
          </div>
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 font-bold text-amber-500 outline-none"
          >
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (Tầng {t.floor})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-stone-400 block text-center">
            * Bấm "Gọi Món Này" để gửi trực tiếp tới màn hình bếp KDS
          </span>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'Tất Cả Món' },
            { id: 'starter', label: 'Khai Vị & Salad' },
            { id: 'main', label: 'Pizza & Mỳ Ý' },
            { id: 'drinks', label: 'Đồ Uống & Vang' },
            { id: 'dessert', label: 'Tráng Miệng' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Wishlist Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên món, nguyên liệu..."
              className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl pl-9 pr-3 py-2 text-stone-900 dark:text-stone-100 outline-none text-xs"
            />
          </div>

          <button
            onClick={() => setOnlyWishlist(!onlyWishlist)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-semibold transition ${
              onlyWishlist
                ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-rose-500' : ''}`} />
            <span>Món Yêu Thích ({wishlistIds.length})</span>
          </button>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => {
          const isFav = isInWishlist(dish.id);
          return (
            <div
              key={dish.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between group transition hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => toggleWishlist(dish.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 backdrop-blur-xs text-white hover:text-rose-500 transition"
                  title="Thêm vào danh sách yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {dish.isPopular && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-bold px-2.5 py-0.5 rounded-full text-[10px] shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Bán Chạy Nhất
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {dish.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-400 italic">{dish.nameEn}</div>
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-amber-500 font-mono">
                    {dish.price.toLocaleString()}đ
                  </span>
                  <button
                    onClick={() => handleOrderDirect(dish)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Gọi Món Này</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
