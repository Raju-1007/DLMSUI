import React from "react";


export default function MessageModal({ type, message, onClose }) {
  if (!message) return null;

  return (
    <div className="msg-overlay" onClick={onClose}>
      <div className="msg-box" onClick={(e) => e.stopPropagation()}>
        <div className="msg-header">Message</div>

        <div className="msg-body">
          {type === "success" ? (
            <div className="msg-icon success">✓</div>
          ) : (
            <div className="msg-icon error">✕</div>
          )}

          <p className="msg-text">{message}</p>
        </div>

        <button className="msg-close" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
