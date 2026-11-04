import { useContext } from "react";
import { Bell, CalendarDays } from "lucide-react";
import { AppContext } from "../../context/AppContext";

function Header({ title, description }) {
  const { currentUser } = useContext(AppContext);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-8">

      <div>
        <p className="text-sm text-muted mb-1">
          Welcome back, {currentUser?.name?.split(" ")[0]}
        </p>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="text-sm text-muted mt-2">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <CalendarDays size={17} />
          <span>{today}</span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-canvas transition-colors"
        >
          <Bell size={18} />
        </button>
      </div>

    </header>
  );
}

export default Header;