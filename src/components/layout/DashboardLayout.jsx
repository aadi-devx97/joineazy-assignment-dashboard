import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout({ title, description, children }) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10">

        <div className="max-w-7xl mx-auto">

          <Header
            title={title}
            description={description}
          />

          {children}

        </div>

      </main>
    </div>
  );
}

export default DashboardLayout;