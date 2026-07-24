// TEMPORARY placeholder — this file exists only to verify the
// routing + layout foundation renders correctly end-to-end.
// It will be REPLACED by the real Dashboard page in the next phase.
const Home = () => {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">
        KhaataPushtak V2 — Frontend Foundation Ready
      </h1>
      <p className="text-[var(--color-text-secondary)]">
        Routing, layout, Tailwind, and Axios are wired up. Real pages
        come next.
      </p>
    </div>
  );
};

export default Home;
