import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import getErrorMessage from "../utils/getErrorMessage";
import Button from "../components/Button";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
      );
      toast.success(`Welcome to KhaataPushtak, ${user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass =
    "w-full pl-10 pr-3 py-2 rounded-lg border bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]";

  return (
    <div className="max-w-md mx-auto mt-4 sm:mt-8 animate-fade-in">
      <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-(--color-text-secondary) text-sm mb-6">
          Start keeping track of your Hisaabs
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <div className="relative">
              <FiUser
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
                aria-hidden="true"
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ravi Kumar"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`${inputBaseClass} ${
                  errors.name ? "border-red-400" : "border-(--color-border)"
                }`}
              />
            </div>
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="text-red-500 text-xs mt-1"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
                aria-hidden="true"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`${inputBaseClass} ${
                  errors.email ? "border-red-400" : "border-(--color-border)"
                }`}
              />
            </div>
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-red-500 text-xs mt-1"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`${inputBaseClass} pr-10 ${
                  errors.password ? "border-red-400" : "border-(--color-border)"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-red-500 text-xs mt-1"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
                aria-hidden="true"
              />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-error" : undefined
                }
                className={`${inputBaseClass} ${
                  errors.confirmPassword
                    ? "border-red-400"
                    : "border-(--color-border)"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p
                id="confirm-error"
                role="alert"
                className="text-red-500 text-xs mt-1"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-center text-(--color-text-secondary) mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-(--color-accent) font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
