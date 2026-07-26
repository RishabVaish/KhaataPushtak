// Reusable button covering the 3 visual "kinds" used across the app (primary action, secondary/cancel, destructive). Extracted because Login, Register, HisaabForm, and DeleteModal were each re-implementing identical disabled/loading/focus styling — a DRY violation that also meant fixing a focus-ring bug would require editing 4 files.
const VARIANT_STYLES = {
  primary: "bg-[var(--color-accent)] text-white hover:opacity-90",
  secondary:
    "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      // active:scale-[0.98] gives tactile "press" feedback — a cheap, lightweight micro-animation with zero extra dependencies. focus-visible (not focus:) means the ring only appears for keyboard users tabbing through, not on every mouse click — the modern accessible-by-default pattern.
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-150 active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-surface)
        ${VARIANT_STYLES[variant]} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span
          className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
