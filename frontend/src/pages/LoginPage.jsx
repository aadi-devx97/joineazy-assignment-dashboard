import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";

import { AppContext } from "../context/AppContextDefinition";
import { mockUsers } from "../data/mockData";

function LoginPage() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState("student-1");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = mockUsers.find(
      (item) => item.id === selectedUser
    );

    if (!user) return;

    login(user.id);

    navigate(user.role === "admin" ? "/admin" : "/student");
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
              Select a demo account to explore the dashboard.
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
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive transition-colors"
              >
                <optgroup label="Administrators">
                  {mockUsers
                    .filter((user) => user.role === "admin")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </optgroup>

                <optgroup label="Students">
                  {mockUsers
                    .filter((user) => user.role === "student")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <div className="flex items-center gap-3 p-3 bg-canvas rounded-lg border border-border">
              <div className="w-9 h-9 rounded-full bg-olive/15 text-olive flex items-center justify-center">
                {selectedUser.startsWith("admin") ? (
                  <ShieldCheck size={19} />
                ) : (
                  <GraduationCap size={19} />
                )}
              </div>

              <div>
                <p className="text-xs text-muted">
                  Account type
                </p>

                <p className="text-sm font-medium capitalize">
                  {selectedUser.startsWith("admin")
                    ? "Administrator"
                    : "Student"}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-dark text-white font-medium py-3 rounded-lg transition-colors"
            >
              Continue to dashboard
              <ArrowRight size={18} />
            </button>

          </form>

          <p className="text-xs text-muted text-center mt-6">
            Demo environment · No password required
          </p>
        </section>

        <p className="text-center text-xs text-muted mt-7">
          Joineazy · Assignment & Review Platform
        </p>

      </div>
    </main>
  );
}

export default LoginPage;