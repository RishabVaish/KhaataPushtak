import mongoose from "mongoose";

// A "Hisaab" (ledger entry) has a title, content, and a category.
// This schema is the contract that ALL data must satisfy before
// it's allowed into the database — this is our first line of defense
// against bad/malformed data.
const hisaabSchema = new mongoose.Schema(
  {
    // Links every Hisaab to exactly one owner. ObjectId + ref lets
    // Mongoose "populate" this field with the actual User document
    // on demand, without duplicating user data into every Hisaab.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true, // removes leading/trailing whitespace automatically
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      enum: {
        values: [
          "Grocery",
          "Food",
          "Shopping",
          "Bills",
          "Travel",
          "Home",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
      default: "Other",
    },
  },
  {
    // Automatically adds and manages createdAt & updatedAt fields.
    // updatedAt refreshes every time .save() or a findOneAndUpdate runs.
    timestamps: true,
  },
);

// mongoose.model(name, schema) — Mongoose pluralizes "Hisaab" to the
// "hisaabs" collection in MongoDB automatically.
const Hisaab = mongoose.model("Hisaab", hisaabSchema);

export default Hisaab;
