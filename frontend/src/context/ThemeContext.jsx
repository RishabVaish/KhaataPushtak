import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);
const THEME_KEY = "khaatapushtak_theme";

export const ThemeProvider = ({ children }) => {
  // Initialize from the DOM class already applied by the blocking
  // inline script in index.html (runs before React mounts). This is
  // what prevents a flash of the wrong theme: if we started from a
  // hardcoded "light" default here, dark-mode users would see one
  // light frame before React corrected it on the first render.
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  // Keep the DOM class and localStorage in sync whenever theme
  // state changes (i.e., when the user clicks the toggle).
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // If the user has never explicitly chosen a theme (no localStorage
  // value), follow the OS-level preference live — e.g., if their
  // system switches to dark mode at sunset, so does this app.
  // Once they click the toggle, localStorage records an explicit
  // choice and this listener's updates are moot (theme state itself
  // now drives everything).
  useEffect(() => {
    const storedPreference = localStorage.getItem(THEME_KEY);
    if (storedPreference) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setTheme(e.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
