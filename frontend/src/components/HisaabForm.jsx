import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { CATEGORIES } from "../utils/categories";

// HisaabForm handles BOTH create and edit with one component.
// `initialData` being present/absent is the only thing that
// distinguishes the two cases — the form doesn't know or care
// whether onSubmit will result in a POST or a PUT.
const HisaabForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: CATEGORIES[0],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        content: initialData?.content || "",
        category: initialData?.category || CATEGORIES[0],
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  // Shared input classes, extracted as a local constant (not a new
  // file) since it's just a string used 2x in this one component —
  // not worth promoting to a shared component across the whole app.
  const inputBaseClass =
    "w-full px-3 py-2 rounded-lg border bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Hisaab" : "Create New Hisaab"}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            autoFocus
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className={`${inputBaseClass} ${
              errors.title ? "border-red-400" : "border-(--color-border)"
            }`}
          />
          {errors.title && (
            <p
              id="title-error"
              role="alert"
              className="text-red-500 text-xs mt-1"
            >
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Details
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            value={formData.content}
            onChange={handleChange}
            placeholder="Add details about this entry..."
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? "content-error" : undefined}
            className={`${inputBaseClass} resize-none ${
              errors.content ? "border-red-400" : "border-(--color-border)"
            }`}
          />
          {errors.content && (
            <p
              id="content-error"
              role="alert"
              className="text-red-500 text-xs mt-1"
            >
              {errors.content}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${inputBaseClass} border-(--color-border)`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HisaabForm;
