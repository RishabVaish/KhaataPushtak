import { memo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import formatDate from "../utils/formatDate";

// HisaabCard is purely presentational: data flows down via props, events flow up via onEdit/onDelete callbacks. Wrapped in React.memo — since Dashboard renders one of these per entry, and most user interactions (typing in search, filtering) only change WHICH entries appear, not every entry's own data, memoization skips re-rendering cards whose own props are unchanged. This only works because Dashboard passes STABLE callback references via useCallback — an inline arrow function passed as a prop would be a "new" function every render, defeating memo entirely.
const HisaabCard = ({ hisaab, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5 flex flex-col gap-3 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-lg wrap-break-word">{hisaab.title}</h3>
        <span className="shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-(--color-accent)/10 text-(--color-accent)">
          {hisaab.category}
        </span>
      </div>

      <p className="text-sm text-(--color-text-secondary) line-clamp-3">
        {hisaab.content}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-(--color-border)">
        <span className="text-xs text-(--color-text-secondary)">
          {formatDate(hisaab.createdAt)}
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(hisaab)}
            className="p-1.5 rounded-md text-(--color-text-secondary) hover:text-(--color-accent) hover:bg-(--color-accent)/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
            aria-label={`Edit ${hisaab.title}`}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(hisaab)}
            className="p-1.5 rounded-md text-(--color-text-secondary) hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label={`Delete ${hisaab.title}`}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(HisaabCard);
