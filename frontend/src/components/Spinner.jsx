// A minimal, reusable spinner. No state, no logic — purely presentational, which is exactly what belongs in components/. Tailwind's `animate-spin` utility handles the rotation animation;
// we don't need any custom CSS or JS timer for this.
const Spinner = () => {
  return (
    <div className="flex justify-center py-12">
      <div
        className="w-8 h-8 border-3 border-(--color-border) border-t-(--color-accent) rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;
