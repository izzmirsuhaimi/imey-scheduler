// src/cropImageUtil.js
export default function getCroppedImg(imageSrc, crop, width, height) {
  return new Promise(resolve => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x, crop.y, crop.width, crop.height, // source crop
        0, 0, width, height // dest size
      );

      // Use a data URL instead of blob URL:
      const dataUrl = canvas.toDataURL("image/jpeg", 1);
      resolve(dataUrl);
    };
    // If loading fails, still resolve to blank to avoid throwing an Event
    image.onerror = () => resolve(null);
  });
}
