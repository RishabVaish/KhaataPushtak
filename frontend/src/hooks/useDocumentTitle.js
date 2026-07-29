import { useEffect } from "react";

// Sets document.title for the current page. Appends the app name
// consistently so every tab reads "Page — KhaataPushtak" rather than
// each page inventing its own suffix format. This is the SPA
// equivalent of per-page <title> tags — the closest thing to
// "dynamic metadata" without a server-rendering setup.
const useDocumentTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} — KhaataPushtak` : "KhaataPushtak";

    // Restore whatever title was set before, on unmount — prevents
    // a stale title lingering if navigation happens in an unusual
    // order (e.g., browser back/forward with cached components).
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
