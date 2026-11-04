import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout({ title, description, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex">

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onClose={closeMobileMenu}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10">

        <div className="max-w-7xl mx-auto">

          {/* Mobile menu button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsMobileOpen((previous) => !previous)}
              aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileOpen}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-lg bg-surface hover:bg-canvas"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Page header */}
          <Header
            title={title}
            description={description}
          />

          {/* Page content */}
          {children}

        </div>

      </main>
    </div>
  );
}

export default DashboardLayout;