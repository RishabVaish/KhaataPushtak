import { FiSearch } from "react-icons/fi";

// Fully controlled, presentational — value/onChange come from Dashboard, which owns the actual search state and debouncing.
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your hisaabs..."
        aria-label="Search your hisaabs"
        className="w-full pl-10 pr-3 py-2 rounded-lg border border-(--color-border) bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
      />
    </div>
  );
};

export default SearchBar;
