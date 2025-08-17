import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImageUtil";

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

  // lock page scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    if (!zoomRef.current) return;
    const el = zoomRef.current;
    const min = Number(el.min ?? 0);
    const max = Number(el.max ?? 1);
    const pct = ((zoom - min) / (max - min)) * 100;
    el.style.setProperty("--_val", `${pct}%`);
  }, [zoom]);

  const handleCropComplete = useCallback((_, areaPx) => {
    setCroppedAreaPixels(areaPx);
  }, []);

  async function handleSave() {
    if (!croppedAreaPixels) return;
    const dataUrl = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
    onCropComplete?.(dataUrl);
  }

  const portalTarget = document.getElementById("modal-root") || document.body;

  return ReactDOM.createPortal(
    <div
      className="cropper-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="cropper-card" onClick={(e) => e.stopPropagation()}>
        <div className="cropper-title">Crop background</div>

        {/* Crop area */}
        <div
          className="cropper-area"
          style={{
            // keep device aspect ratio, responsive height
            aspectRatio: `${width} / ${height}`,
          }}
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
            showGrid={true}
          />
        </div>

        {/* Zoom control */}
        <div className="cropper-zoom">
          <label htmlFor="bg-zoom">Zoom</label>
          <input
            ref={zoomRef}
            id="bg-zoom"
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        {/* Actions */}
        <div className="cropper-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Crop & Set</button>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
