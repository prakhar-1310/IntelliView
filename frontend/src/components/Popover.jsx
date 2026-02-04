import React, { useRef, useEffect } from "react";

export default function Popover({ open, anchorRef, onClose, children }) {
  const popoverRef = useRef();

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        (!anchorRef.current || !anchorRef.current.contains(event.target))
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  // Position below anchor
  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const style = anchorRect
    ? {
        position: "fixed",
        top: anchorRect.bottom + 8,
        left: anchorRect.left + anchorRect.width / 2,
        transform: "translateX(-50%)",
        zIndex: 1000,
      }
    : { display: "none" };

  return (
    <div ref={popoverRef} style={style} className="bg-white rounded-lg shadow-lg p-4 max-w-xs w-[320px] border border-gray-300">
      {children}
    </div>
  );
}
