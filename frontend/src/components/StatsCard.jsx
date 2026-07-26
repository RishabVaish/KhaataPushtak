// Generic stat display — takes a label, value, and icon as props.
// Named generically (not "TotalEntriesCard") so it's ready to reuse
// for future stats without writing a near-duplicate component.
const StatsCard = ({ label, value, icon }) => {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5 flex items-center gap-4">
      <div className="text-2xl text-(--color-accent)">{icon}</div>
      <div>
        <p className="text-2xl font-semibold leading-none">{value}</p>
        <p className="text-sm text-(--color-text-secondary) mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
