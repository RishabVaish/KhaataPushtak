// This is a minimal shell for now — no auth-aware links, no user
// menu yet. Phase 2.2 will expand this once login/logout state
// exists via AuthContext. Keeping it this simple ensures the layout
// and routing foundation work independently of authentication.
const Navbar = () => {
  return (
    <header className="border-b border-(--color-border) bg-(--color-surface)">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-tight">
          KhaataPushtak
        </span>
      </div>
    </header>
  );
};

export default Navbar;
