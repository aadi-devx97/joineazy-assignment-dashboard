
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  UserRound,
} from "lucide-react";

import { AppContext } from "../context/AppContextDefinition";

function LoginPage() {
  const { users, login } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState("student-1");
  const [error, setError] = useState("");

  const professors = users.filter(
    (user) => user.role === "professor"
  );

  const students = users.filter(
    (user) => user.role === "student"
  );

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    const result = login(selectedUser);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(
      result.user.role === "professor" ? "/professor" : "/student"
    );
  };

  const selectedAccount = users.find(
    (user) => user.id === selectedUser
  );

  const isProfessor = selectedAccount?.role === "professor";

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
              Select a demo account to explore the platform.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="demo-user"
                className="block text-sm font-medium mb-2"
              >
                Select your account
              </label>

              <select
                id="demo-user"
                value={selectedUser}
                onChange={(event) =>
                  setSelectedUser(event.target.value)
                }
                className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive transition-colors"
              >
                <optgroup label="Professors">
                  {professors.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Students">
                  {students.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Selected account information */}
            <div className="flex items-center gap-3 p-3 bg-canvas rounded-lg border border-border">
              <div className="w-9 h-9 rounded-full bg-olive/15 text-olive flex items-center justify-center">
                {isProfessor ? (
                  <BookOpen size={19} />
                ) : (
                  <UserRound size={19} />
                )}
              </div>

              <div>
                <p className="text-xs text-muted">
                  Account type
                </p>

                <p className="text-sm font-medium capitalize">
                  {selectedAccount?.role || "Select an account"}
                </p>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-dark text-white font-medium py-3 rounded-lg transition-colors"
            >
              Continue to dashboard
              <ArrowRight size={18} />
            </button>
          </form>

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
