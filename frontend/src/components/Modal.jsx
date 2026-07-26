// Modal is a generic SHELL — it owns the backdrop overlay, centering,
// and the close button. It knows NOTHING about forms or deletion; it
// just renders whatever `children` it's given inside a styled box.
// Both HisaabForm and DeleteModal wrap their own content in this,
// avoiding duplicated overlay/positioning code in two places.
const Modal = ({ isOpen, onClose, title, children }) => {
  // Returning null (rendering nothing) when closed is simpler than
  // managing a separate "mounted" vs "visible" state — React just
  // doesn't render this subtree at all when isOpen is false.
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      // Clicking the dark backdrop itself closes the modal — but
      // clicking INSIDE the white card must NOT close it. We achieve
      // this by only closing when the click target IS the backdrop
      // (e.currentTarget), not something nested inside it.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-(--color-surface) rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-(--color-text-secondary) hover:text-(--color-text-primary) text-xl leading-none"
            aria-label="Close"
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
