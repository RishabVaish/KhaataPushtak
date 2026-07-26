// EmptyState covers THREE distinct scenarios the Dashboard can be
// in — "no entries yet," "no search results," and "network error" —
// with one component. All three look structurally identical (an
// icon, a heading, a message); only the CONTENT differs. Rather
// than three near-duplicate components, we pass content as props.
// This is standard React reuse: behavior/structure lives in the
// component, content lives in whoever renders it.
const EmptyState = ({ icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-(--color-text-secondary) text-sm max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
