import React, { useState } from "react";


export default function TreeNode({ label, badge, onClick, children, initiallyOpen=false }) {
  const [open, setOpen] = useState(initiallyOpen);

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen(v => !v);
    if (onClick) onClick();
  };

  return (
    <div className="tree-node">
      <div className="tree-label" onClick={handleToggle}>
        <span className="arrow">{open ? "▼" : "▶"}</span>
        <span className="tree-icon">📘</span>
        <span className="tree-text">{label}</span>
        {badge ? <span className="tree-badge">{badge}</span> : null}
      </div>

      {open && children ? <div className="tree-children">{children}</div> : null}
    </div>
  );
}
