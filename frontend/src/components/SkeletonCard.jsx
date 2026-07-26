// Mimics HisaabCard's exact layout (title+badge row, two content lines, footer row) using gray blocks with a pulse animation. aria-hidden because it conveys no real information to screen readers — the page's actual loading state should be announced elsewhere (Dashboard uses aria-busy for that, see Dashboard.jsx).
const SkeletonCard = () => {
  return (
    <div
      className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5 flex flex-col gap-3 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="h-5 w-2/3 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-5 w-16 rounded-full bg-black/10 dark:bg-white/10 shrink-0" />
      </div>
      <div className="h-3 w-full rounded bg-black/10 dark:bg-white/10" />
      <div className="h-3 w-5/6 rounded bg-black/10 dark:bg-white/10" />
      <div className="flex items-center justify-between pt-2 border-t border-(--color-border)">
        <div className="h-3 w-20 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-3 w-10 rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
};

export default SkeletonCard;
