import { CATEGORIES } from "../utils/categories";

// Same "dumb component" pattern as SearchBar — fully controlled via
// props, no internal state. Dashboard owns `category` and `sort`
// and decides what happens when they change (re-fetching the list).
const FilterBar = ({ category, onCategoryChange, sort, onSortChange }) => {
  return (
    <div className="flex gap-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};

export default FilterBar;
