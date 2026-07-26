import { useEffect, useRef } from "react";

// Modal is a generic SHELL — backdrop, centering, close button, and now: Escape-to-close, focus management, and entrance animation. Neither HisaabForm nor DeleteModal need to reimplement any of this.
const Modal = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef(null);

  // Escape-key handling: attached to `document` (not the modal itself) because focus might be on any element inside the modal when the key is pressed — listening at the document level catches it regardless of which specific input/button is focused.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    // Cleanup: remove the listener when the modal closes OR unmounts —
    // without this, closed modals would leave "ghost" listeners that
    // pile up and fire onClose unexpectedly on unrelated pages.
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management: when the modal opens, move keyboard focus INTO it. Without this, a keyboard-only user who just opened the modal would still have focus stuck on the "New Hisaab" button behind the overlay — confusing, and a real accessibility failure.
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        // role="dialog" + aria-modal tell assistive tech this is a modal dialog, not just another chunk of page content. tabIndex={-1} makes the div itself focusable via .focus() in JS (above) without adding it to the normal Tab order.
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="bg-(--color-surface) rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-scale-in focus:outline-none"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-(--color-text-secondary) hover:text-(--color-text-primary) text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded"
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
