import React from "react";

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <div
      className="settings-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="settings-card confirm-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="settings-title">{title}</div>
        <p className="confirm-message">{message}</p>
        <div className="settings-footer">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
