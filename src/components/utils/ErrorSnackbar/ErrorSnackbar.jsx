import React, { useEffect } from 'react';
import './ErrorSnackbar.css';

export default function ErrorSnackbar({ open, message, duration = 5000, onClose, isError }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="error-snackbar open"
      onClick={onClose}
      tabIndex={0}
      style={{ background: isError ? "#b00020" : "#47ce47" }}
    >
      <div className="error-snackbar__message">{message}</div>
      <button
        aria-label="Dismiss error"
        className="error-snackbar__close"
        onClick={(e) => {
          e.stopPropagation();
          onClose && onClose();
        }}
      >
        ×
      </button>
    </div>
  );
}
