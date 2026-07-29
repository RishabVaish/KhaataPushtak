// A JWT is three base64url segments separated by dots:
// header.payload.signature — we only ever need to READ the payload
// here (to check its expiry), never verify the signature. Signature
// verification is the BACKEND's job on every request; doing it here
// would be pointless (a client can't be trusted to verify its own
// token) and would require a crypto library for zero real benefit.

// decodeToken extracts and parses the middle (payload) segment.
// Returns null if the token is malformed rather than throwing —
// callers treat "can't decode" the same as "no valid session."
export const decodeToken = (token) => {
  try {
    const payloadSegment = token.split(".")[1];
    const decoded = atob(payloadSegment.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

// isTokenExpired checks the `exp` claim (seconds since epoch, per
// the JWT spec) against the current time. Used on app load to avoid
// restoring a session with an already-dead token — saving a wasted
// API call that would just come back 401 anyway.
export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;

  const nowInSeconds = Date.now() / 1000;
  return payload.exp < nowInSeconds;
};
