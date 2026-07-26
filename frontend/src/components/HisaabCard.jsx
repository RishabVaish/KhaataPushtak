import { FiEdit2, FiTrash2 } from "react-icons/fi";
import formatDate from "../utils/formatDate";

// HisaabCard is purely presentational: it receives a `hisaab` object
// plus two CALLBACK props (onEdit, onDelete). It never calls
// hisaabService or knows what editing/deleting actually DOES — it
// just tells its parent (Dashboard) "the user clicked edit on THIS
// entry" by calling onEdit(hisaab). This is React's core data-flow
// principle: data flows DOWN via props, events flow UP via callbacks.
const HisaabCard = ({ hisaab, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5 flex flex-col gap-3">
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

        <div className="flex gap-3">
          <button
            onClick={() => onEdit(hisaab)}
            className="text-(--color-text-secondary) hover:text-(--color-accent) transition-colors"
            aria-label="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(hisaab)}
            className="text-(--color-text-secondary) hover:text-red-500 transition-colors"
            aria-label="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HisaabCard;
