export default function cropImage(imageSrc, crop, width, height) {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      context.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        width,
        height
      );

      resolve(canvas.toDataURL("image/jpeg", 1));
    };
    image.onerror = () => resolve(null);
  });
}
