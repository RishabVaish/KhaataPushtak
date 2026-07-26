import { useState, useEffect } from "react";
import Modal from "./Modal";
import { CATEGORIES } from "../utils/categories";

// HisaabForm handles BOTH create and edit with one component.
// `initialData` being present/absent is the only thing that
// distinguishes the two cases — the form doesn't know or care
// whether onSubmit will result in a POST or a PUT; that decision
// belongs to Dashboard, which owns all business logic.
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

  // Re-populate the form every time the modal opens or the entry
  // being edited changes. Without this effect, editing entry A then
  // clicking edit on entry B would still show entry A's stale data,
  // since HisaabForm is one persistent component instance reused
  // across every open/close — it isn't remounted each time.
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
    // Dashboard's onSubmit decides create vs update — this component
    // just hands back the validated form data.
    onSubmit(formData);
  };

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
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            className={`w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-(--color-accent) ${
              errors.title ? "border-red-400" : "border-(--color-border)"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
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
            className={`w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-(--color-accent) resize-none ${
              errors.content ? "border-red-400" : "border-(--color-border)"
            }`}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content}</p>
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
            className="w-full px-3 py-2 rounded-lg border border-(--color-border) bg-transparent focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-(--color-border) font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 rounded-lg bg-(--color-accent) text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default HisaabForm;
