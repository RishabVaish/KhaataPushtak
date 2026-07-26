// EmptyState covers THREE distinct scenarios — "no entries yet," "no search results," and "network error" — with one component. `action` is optional: only the error state needs a Retry button; passing nothing simply renders no button, keeping this component correct for all three cases without conditional props elsewhere.
const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in">
      <div
        className="text-4xl mb-3 text-(--color-text-secondary)"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-(--color-text-secondary) text-sm max-w-sm">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
