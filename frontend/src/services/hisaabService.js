import api from "./api";

// This file is the ONLY place that knows the shape of /api/hisaab/*
// endpoints. Dashboard.jsx calls these functions and receives plain
// JS data back — it never touches axios, URLs, or query strings
// directly. The JWT is attached automatically by the request
// interceptor in api.js; nothing here passes a token manually.

// getAllHisaab supports optional search/category/sort — passed as
// URL query params via Axios's `params` option, which handles
// encoding special characters (spaces, symbols) safely for us.
export const getAllHisaab = async ({ search, category, sort } = {}) => {
  const response = await api.get("/hisaab", {
    params: { search, category, sort },
  });
  return response.data; // { success, count, data: [...] }
};

export const getSingleHisaab = async (id) => {
  const response = await api.get(`/hisaab/${id}`);
  return response.data; // { success, data: {...} }
};

// createHisaab sends { title, content, category }. Note: no `user`
// field is ever sent — the backend derives ownership from the JWT
// (see controllers/hisaabController.js), so the frontend doesn't
// need to know the logged-in user's own ID for this call at all.
export const createHisaab = async (hisaabData) => {
  const response = await api.post("/hisaab", hisaabData);
  return response.data; // { success, data: {...}, message }
};

export const updateHisaab = async (id, hisaabData) => {
  const response = await api.put(`/hisaab/${id}`, hisaabData);
  return response.data;
};

export const deleteHisaab = async (id) => {
  const response = await api.delete(`/hisaab/${id}`);
  return response.data;
};
