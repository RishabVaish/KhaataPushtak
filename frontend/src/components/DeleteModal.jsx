import Modal from "./Modal";
import Button from "./Button";

// Reuses the generic Modal shell (backdrop, Escape-to-close, focus management) — proof that extracting Modal separately was worth it. Now also reuses Button for consistent loading/disabled states.
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
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          isLoading={isDeleting}
          className="flex-1"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
