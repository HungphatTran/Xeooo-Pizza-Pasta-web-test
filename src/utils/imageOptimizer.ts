export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Compresses an image file client-side using an offscreen canvas and converts to WebP.
 * Helps prevent slow uploads and reduces bundle/bandwidth usage.
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<{ blob: Blob; dataUrl: string; originalSize: number; optimizedSize: number }> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82, format = 'image/webp' } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Blob conversion failed'));
              return;
            }
            const dataUrl = canvas.toDataURL(format, quality);
            resolve({
              blob,
              dataUrl,
              originalSize: file.size,
              optimizedSize: blob.size,
            });
          },
          format,
          quality
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
    };

    reader.onerror = () => reject(new Error('File read failed'));
  });
}
