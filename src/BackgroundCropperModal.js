import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImageUtil";

export default function BackgroundCropperModal({ imageSrc, onCropComplete, onClose, width, height }) {
  const aspect = width / height;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  async function handleSave() {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
    onCropComplete(croppedImage);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded relative" style={{ width: 400, height: 600 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          cropShape="rect"
          showGrid={true}
        />
        <div className="mt-4 flex gap-2 justify-end">
          <button className="px-3 py-1 rounded bg-gray-300" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-500 text-white" onClick={handleSave}>Crop & Set</button>
        </div>
      </div>
    </div>
  );
}
