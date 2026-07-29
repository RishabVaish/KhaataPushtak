const FullPageLoader = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-(--color-bg)"
      role="status"
      aria-label="Loading"
    >
      <div className="w-10 h-10 border-3 border-(--color-border) border-t-(--color-accent) rounded-full animate-spin" />
    </div>
  );
};

export default FullPageLoader;
