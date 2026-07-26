// Converts a MongoDB ISO date string into a short, readable format.
// Pure function — same input always produces the same output, no
// side effects — which is exactly why it belongs in utils/, not
// duplicated inline inside HisaabCard.
const formatDate = (isoString) => {
  const date = new Date(isoString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default formatDate;
