import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // creates a unique index — no two users can share an email
      trim: true,
      lowercase: true, // normalizes "User@Mail.com" -> "user@mail.com"
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // NEVER return password field in queries by default
    },
    avatar: {
      type: String, // will hold an image URL (e.g., Cloudinary) in future
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// ── Pre-save hook ────────────────────────────────────────
// Runs automatically BEFORE every .save(). We only hash the password
// if it's new or has changed — otherwise, every time a user updates
// their name, we'd re-hash an ALREADY-hashed password (bug!).
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10); // "10 rounds" - industry standard cost factor
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method ──────────────────────────────────────
// Lets controllers do: `await user.matchPassword(enteredPassword)`
// instead of importing bcrypt everywhere. Keeps bcrypt logic
// encapsulated inside the model, where password logic belongs.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
