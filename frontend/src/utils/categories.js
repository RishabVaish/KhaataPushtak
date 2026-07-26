// This array MUST match the enum in server/models/Hisaab.js exactly.
// Both HisaabForm (create/edit) and FilterBar (dashboard filtering)
// import from here — so if the backend ever adds a category, this
// is the ONE file to update, and both UI locations pick it up
// automatically.
export const CATEGORIES = [
  "Grocery",
  "Food",
  "Shopping",
  "Bills",
  "Travel",
  "Home",
  "Other",
];
