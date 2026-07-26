import { CATEGORIES } from "../utils/categories";

// Same controlled-component pattern as SearchBar — Dashboard owns `category` and `sort`, this just renders the two dropdowns.
const FilterBar = ({ category, onCategoryChange, sort, onSortChange }) => {
  return (
    <div className="flex gap-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="px-3 py-2 rounded-lg border border-(--color-border) bg-transparent text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
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
        aria-label="Sort order"
        className="px-3 py-2 rounded-lg border border-(--color-border) bg-transparent text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};

export default FilterBar;
