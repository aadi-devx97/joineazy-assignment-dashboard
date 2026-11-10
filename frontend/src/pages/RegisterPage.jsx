
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  UserRound,
  Mail,
  LockKeyhole,
  BookOpen,
} from "lucide-react";

import { AppContext } from "../context/AppContextDefinition";

function RegisterPage() {
  const { register } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const { name, email, password, confirmPassword, role } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = register({
      name,
      email,
      password,
      role,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);

    navigate(role === "professor" ? "/professor" : "/student");
  };

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-olive text-white rounded-xl mb-5">
            <GraduationCap size={26} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Join Joineazy
          </h1>

          <p className="text-muted mt-2 text-sm">
            Create an account to get started.
          </p>
        </div>

        {/* Registration form */}
        <section className="bg-surface border border-border rounded-2xl p-7 shadow-sm">
          <div className="mb-6">
            <p className="text-terracotta text-xs font-semibold uppercase tracking-widest mb-2">
              Get started
            </p>

            <h2 className="text-2xl font-semibold">
              Create your account
            </h2>

            <p className="text-sm text-muted mt-2">
              Choose how you'll use the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-canvas border border-border rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-olive"
                />
              </div>
            </div>

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
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-canvas border border-border rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-olive"
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
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full bg-canvas border border-border rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-olive"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your password again"
                className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
              />
            </div>

            {/* Account role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium mb-2"
              >
                I am joining as a
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      role: "student",
                    }))
                  }
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.role === "student"
                      ? "border-olive bg-olive/10 text-olive"
                      : "border-border text-muted hover:bg-canvas"
                  }`}
                >
                  <UserRound size={17} />
                  Student
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      role: "professor",
                    }))
                  }
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.role === "professor"
                      ? "border-olive bg-olive/10 text-olive"
                      : "border-border text-muted hover:bg-canvas"
                  }`}
                >
                  <BookOpen size={17} />
                  Professor
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-olive">
                Account created successfully!
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-dark text-white font-medium py-3 rounded-lg transition-colors"
            >
              Create account
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-olive hover:underline"
              >
                Sign in
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

export default RegisterPage;
