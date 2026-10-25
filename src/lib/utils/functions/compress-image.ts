/**
 * Compresses an image File in the browser before uploading.
 * Drops 4MB-8MB phone photos down to ~80KB while keeping text crystal clear.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  quality = 0.75
): Promise<File> {
  // Skip if it's not an image (e.g. PDF) or already tiny (< 150KB)
  if (!file.type.startsWith("image/") || file.size <= 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down proportionally if wider/taller than maxWidth
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file); // Fallback to original if canvas fails
        return;
      }

      // Fill white background (in case of transparent PNGs) & draw image
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Export as WebP (smallest size, supported by all modern browsers)
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file); // Keep original if compression didn't shrink it
            return;
          }

          const cleanName = file.name.replace(/\.[^/.]+$/, "");
          const compressedFile = new File([blob], `${cleanName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // Fallback to original on error
    };

    img.src = objectUrl;
  });
}