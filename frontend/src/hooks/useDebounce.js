import { useState, useEffect } from "react";

// useDebounce returns a "delayed" copy of whatever value you pass
// in — it only updates after `delay` milliseconds have passed
// WITHOUT the input value changing again. This is the standard
// technique for search inputs: it prevents firing an API call on
// every single keystroke.
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer that will update debouncedValue after `delay` ms.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CLEANUP FUNCTION: React runs this before the NEXT effect run
    // (i.e., the next time `value` changes) OR when the component
    // unmounts. This cancels the timer we just started above —
    // so if the user types again within 400ms, the previous timer
    // never fires, and a fresh one starts. Only the LAST keystroke's
    // timer ever survives to actually update debouncedValue.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
