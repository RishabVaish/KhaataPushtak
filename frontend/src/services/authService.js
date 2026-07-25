import api from "./api";

// This file is the ONLY place in the entire frontend that knows the
// actual shape of the /api/auth/* endpoints. AuthContext calls these
// functions without knowing or caring about URLs, HTTP verbs, or
// request bodies — that knowledge is fully encapsulated here. This
// mirrors the backend's controller/route separation: AuthContext is
// like a controller, this file is like the route + fetch layer.

// registerUser sends { name, email, password } and returns the
// backend's { success, data: { _id, name, email, avatar, token }, message }
export const registerUser = async (name, email, password) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
};

// loginUser sends { email, password } and returns the same shape
// as registerUser — both include a token, since both effectively
// authenticate the user immediately.
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// getProfile fetches the current user's data. No token is passed
// manually here — the Axios request interceptor in api.js attaches
// it automatically to every outgoing request. Passing it manually
// here would violate our "interceptor only" architecture rule.
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};
