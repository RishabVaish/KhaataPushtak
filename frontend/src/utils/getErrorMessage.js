// getErrorMessage takes any error thrown by an Axios call and
// returns a single, human-readable string — ready to hand straight
// to toast.error(). This is a PURE function: no side effects, no
// state, just input → output. That's exactly why it lives in
// utils/ rather than services/ (which does I/O) or context/
// (which holds state).
const getErrorMessage = (error) => {
  // A timeout is technically a "no response" case too, but deserves
  // its own message — "check your connection" is misleading if the
  // real issue is a slow/hung server, not a dead connection.
  if (error.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  // Case 1: No response at all — the request never reached the
  // server (backend down, no internet, CORS block, etc.)
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }

  const { status, data } = error.response;

  // Case 2: Backend DID respond with a structured error message
  // (our centralized errorHandler middleware always sends one).
  if (data?.message) {
    return data.message;
  }

  // Case 3: Fallback messages by status code, in case the backend
  // response didn't include a message for some reason.
  switch (status) {
    case 401:
      return "You are not authorized. Please log in again.";
    case 404:
      return "The requested resource was not found.";
    case 500:
      return "Something went wrong on our end. Please try again later.";
    default:
      return "An unexpected error occurred.";
  }
};

export default getErrorMessage;
