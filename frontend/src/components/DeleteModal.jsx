import Modal from "./Modal";

// Reuses the same generic Modal shell as HisaabForm — proof that
// extracting Modal separately was worth it. This component only
// adds its own CONTENT (a warning message + two buttons); the
// backdrop/centering/close mechanics are inherited for free.
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  entryTitle,
  isDeleting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Hisaab?">
      <p className="text-sm text-(--color-text-secondary) mb-6">
        Are you sure you want to delete{" "}
        <span className="font-medium text-(--color-text-primary)">
          "{entryTitle}"
        </span>
        ? This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-lg border border-(--color-border) font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
