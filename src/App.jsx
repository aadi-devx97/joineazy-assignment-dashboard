import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <main className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Joineazy Dashboard
      </h1>

      <p>Current theme: {theme}</p>

      <button
        onClick={toggleTheme}
        className="bg-olive text-white px-5 py-3 rounded-lg"
      >
        Switch Theme
      </button>
    </main>
  );
}

export default App;