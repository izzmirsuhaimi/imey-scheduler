import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import cropImage from "../utils/crop_image";

export default function BackgroundCropperModal({
  imageSrc,
  onCropComplete,
  onClose,
  width,
  height,
}) {
  const aspect = width / height;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!zoomRef.current) return;
    const element = zoomRef.current;
    const min = Number(element.min ?? 0);
    const max = Number(element.max ?? 1);
    const percent = ((zoom - min) / (max - min)) * 100;
    element.style.setProperty("--_val", `${percent}%`);
  }, [zoom]);

  const handleCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleSave() {
    if (!croppedAreaPixels) return;
    const dataUrl = await cropImage(imageSrc, croppedAreaPixels, width, height);
    onCropComplete?.(dataUrl);
  }

  return ReactDOM.createPortal(
    <div
      className="cropper-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="cropper-card" onClick={(event) => event.stopPropagation()}>
        <div className="cropper-title">Crop background</div>

        <div
          className="cropper-area"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid
          />
        </div>

        <div className="cropper-zoom">
          <label htmlFor="background-zoom">Zoom</label>
          <input
            ref={zoomRef}
            id="background-zoom"
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </div>

        <div className="cropper-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Crop & Set
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
