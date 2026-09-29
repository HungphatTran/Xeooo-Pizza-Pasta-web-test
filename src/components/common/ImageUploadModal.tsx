import React, { useState, useRef } from 'react';
import { optimizeImage } from '../../utils/imageOptimizer';
import { Upload, X, Check, Image as ImageIcon, Sparkles, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (urls: string[]) => void;
  title?: string;
}

interface UploadedPreview {
  id: string;
  name: string;
  originalSizeKb: number;
  optimizedSizeKb: number;
  dataUrl: string;
}

export const ImageUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  title = 'Tải Lên Hình Ảnh Món Ăn / Không Gian',
}) => {
  const [previews, setPreviews] = useState<UploadedPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3'>('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const newPreviews: UploadedPreview[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const { dataUrl, originalSize, optimizedSize } = await optimizeImage(file, {
          format: 'image/webp',
          quality: 0.85,
        });

        newPreviews.push({
          id: `img_${Date.now()}_${i}`,
          name: file.name,
          originalSizeKb: Math.round(originalSize / 1024),
          optimizedSizeKb: Math.round(optimizedSize / 1024),
          dataUrl,
        });
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }

    setPreviews((prev) => [...prev, ...newPreviews]);
    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    onUploadSuccess(previews.map((p) => p.dataUrl));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
          <span className="text-stone-600 dark:text-stone-300 font-medium">Tỷ lệ khung hình:</span>
          <div className="flex items-center gap-1">
            {(['1:1', '16:9', '4:3'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  aspectRatio === r
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-white dark:bg-stone-700 text-stone-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-stone-300 dark:border-stone-700 hover:border-amber-500 bg-stone-50/50 dark:bg-stone-950/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-amber-500" />
          <div className="space-y-0.5">
            <span className="font-semibold text-stone-900 dark:text-stone-100 block">
              Kéo thả nhiều ảnh vào đây hoặc bấm để chọn từ máy
            </span>
            <span className="text-[11px] text-stone-400">
              Tự động nén chuẩn WebP thế hệ mới (tiết kiệm 75% dung lượng)
            </span>
          </div>
        </div>

        {/* Previews List */}
        {previews.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <span className="font-semibold text-stone-700 dark:text-stone-300 block">
              Ảnh đã tối ưu ({previews.length}):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {previews.map((p) => (
                <div
                  key={p.id}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2"
                >
                  <img src={p.dataUrl} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 truncate">
                    <div className="font-medium text-stone-900 dark:text-stone-100 truncate text-[11px]">{p.name}</div>
                    <div className="text-[10px] text-emerald-500 font-mono">
                      {p.originalSizeKb}KB ➜ {p.optimizedSizeKb}KB
                    </div>
                  </div>
                  <button
                    onClick={() => removePreview(p.id)}
                    className="p-1 text-stone-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={previews.length === 0 || isProcessing}
            className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400 disabled:opacity-40 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Lưu {previews.length} Ảnh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
