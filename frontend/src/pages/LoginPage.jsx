
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import { AppContext } from "../context/AppContextDefinition";

function LoginPage() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(
      result.user.role === "professor"
        ? "/professor"
        : "/student"
    );
  };

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-olive text-white rounded-xl mb-5">
            <GraduationCap size={26} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Joineazy
          </h1>

          <p className="text-muted mt-2 text-sm">
            Assignment management, made simpler.
          </p>
        </div>

        {/* Login panel */}
        <section className="bg-surface border border-border rounded-2xl p-7 shadow-sm">
          <div className="mb-7">
            <p className="text-terracotta text-xs font-semibold uppercase tracking-widest mb-2">
              Welcome back
            </p>

            <h2 className="text-2xl font-semibold">
              Sign in to continue
            </h2>

            <p className="text-muted text-sm mt-2">
              Enter your account details to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-canvas border border-border rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-olive transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-canvas border border-border rounded-lg pl-10 pr-11 py-3 text-sm outline-none focus:border-olive transition-colors"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 bg-red-50 rounded-lg p-3"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-dark text-white font-medium py-3 rounded-lg transition-colors"
            >
              Sign in
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-canvas border border-border rounded-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              Demo accounts
            </p>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Professor:</span>{" "}
                alex@joineazy.com
              </p>

              <p>
                <span className="font-medium">Student:</span>{" "}
                aarav@student.com
              </p>

              <p>
                <span className="font-medium">Password:</span>{" "}
                Demo123!
              </p>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-muted">
              New to Joineazy?{" "}
              <Link
                to="/register"
                className="font-medium text-olive hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>

        <p className="text-center text-xs text-muted mt-7">
          Joineazy · Learning & Assignment Platform
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
