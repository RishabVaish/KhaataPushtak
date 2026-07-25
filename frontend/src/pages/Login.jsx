import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import getErrorMessage from "../utils/getErrorMessage";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Controlled form state — React owns the input values, not the DOM.
  // This is what lets us validate and reset the form programmatically.
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A single handler for BOTH fields — reads which input fired the
  // event from e.target.name, avoiding two nearly-identical handlers.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear that field's error the moment the user starts fixing it —
    // better UX than leaving a stale error visible while they type.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Client-side validation catches obvious mistakes BEFORE we spend
  // a network round-trip on them. This is a UX optimization, not a
  // security measure — the backend still validates everything again,
  // since client-side checks can always be bypassed.
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser's native full-page form submit
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-(--color-text-secondary) text-sm mb-6">
          Log in to access your Hisaabs
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-(--color-accent) ${
                  errors.email ? "border-red-400" : "border-(--color-border)"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field with show/hide toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-(--color-accent) ${
                  errors.password ? "border-red-400" : "border-(--color-border)"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-(--color-accent) text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-center text-(--color-text-secondary) mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-(--color-accent) font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
