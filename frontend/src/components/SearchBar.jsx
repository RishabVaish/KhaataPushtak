import { FiSearch } from "react-icons/fi";

// SearchBar is a "dumb"/presentational component — it holds NO state
// of its own. `value` and `onChange` are passed in as props from
// Dashboard, which owns the actual search state and decides when to
// debounce/fetch. This keeps SearchBar reusable and easy to reason
// about: given the same props, it always looks the same.
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your hisaabs..."
        className="w-full pl-10 pr-3 py-2 rounded-lg border border-(--color-border) bg-transparent focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
      />
    </div>
  );
};

export default SearchBar;
