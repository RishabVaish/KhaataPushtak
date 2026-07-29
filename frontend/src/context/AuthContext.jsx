import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";
import { isTokenExpired } from "../utils/jwt";

// createContext() creates the "channel." Any component wrapped by
// <AuthProvider> can subscribe to this channel via useAuth() below,
// without props being passed down manually through every level.
const AuthContext = createContext(null);

// localStorage keys, defined once here to avoid typos scattered
// across files (a "khaatapushtak_token" typo in one place and
// "khaatapushtak-token" in another would silently break auth).
const TOKEN_KEY = "khaatapushtak_token";
const USER_KEY = "khaatapushtak_user";

export const AuthProvider = ({ children }) => {
  // user: the logged-in user's public data (never the password).
  // token: the raw JWT string, mirrored into localStorage.
  // loading: true only during the initial rehydration check on
  // page load — lets ProtectedRoute avoid a flash-redirect to
  // /login before we've had a chance to check localStorage.
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Runs exactly once, when the app first mounts (empty dependency
  // array). This is what makes the session PERSIST across page
  // refreshes — without it, refreshing would always show "logged
  // out" even though a valid token sits in localStorage.
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    // Proactively reject an expired token instead of restoring a
    // session that would just fail on the first API call anyway.
    // This avoids a confusing flash where the UI briefly shows
    // "logged in" before an inevitable 401 logs the user back out.
    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else if (storedToken) {
      // A stored token existed but is expired/invalid — clear the
      // stale session rather than leaving dead data in localStorage.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    setLoading(false);
  }, []);

  // Small internal helper — both login() and register() end with
  // "save this user+token to state AND localStorage," so we avoid
  // repeating that logic twice.
  const persistSession = (userData, jwt) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  };

  // login() is what pages/Login.jsx calls. It delegates the actual
  // HTTP call to authService — this function's job is ONLY to manage
  // state and storage, not to know about URLs or request bodies.
  const login = async (email, password) => {
    const response = await authService.loginUser(email, password);
    const { token: jwt, ...userData } = response.data;
    persistSession(userData, jwt);
    return userData;
  };

  // register() mirrors login() — our backend logs a user in
  // immediately upon registration (returns a token), so the flow
  // is identical after the API call succeeds.
  const register = async (name, email, password) => {
    const response = await authService.registerUser(name, email, password);
    const { token: jwt, ...userData } = response.data;
    persistSession(userData, jwt);
    return userData;
  };

  // logout() clears everything: React state AND localStorage. Any
  // component reading `user`/`isAuthenticated` from context
  // re-renders automatically because setUser/setToken trigger it —
  // that's React's reactivity model at work.
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  };

  // updateUser() lets other parts of the app (e.g., a future
  // "Edit Profile" page) patch the stored user object — for example
  // after changing their name or avatar — without a full re-login.
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  // Derived value, not separate state — isAuthenticated is always
  // exactly "do we have a user?" There's no scenario where these
  // two facts disagree, so we compute it fresh every render instead
  // of risking it going out of sync as its own useState.
  const isAuthenticated = !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook — the idiomatic React pattern for consuming context.
// Components write `const { user, login } = useAuth();` instead of
// the more verbose `useContext(AuthContext)` everywhere. It also
// gives us one place to throw a helpful error if someone forgets
// to wrap the app in <AuthProvider>.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
