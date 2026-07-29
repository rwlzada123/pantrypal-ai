import { ChefHat, Heart, Settings } from "lucide-react";

function Header({
  savedCount,
  activeView,
  setActiveView,
}) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-icon">
          <ChefHat size={24} />
        </div>

        <span>
          PantryPal <strong>AI</strong>
        </span>
      </div>

      <nav className="main-nav">
        <button
          className={`nav-link ${
            activeView === "generator" ? "active" : ""
          }`}
          onClick={() => setActiveView("generator")}
          aria-current={activeView === "generator" ? "page" : undefined}
        >
          Meal Generator
        </button>

        <button
          className={`nav-link ${
            activeView === "saved" ? "active" : ""
          }`}
          onClick={() => setActiveView("saved")}
          aria-current={activeView === "saved" ? "page" : undefined}
        >
          <Heart size={17} />
          Saved
          <span className="saved-count">
            {savedCount}
          </span>
        </button>

        <button
          className={`nav-link ${
            activeView === "settings" ? "active" : ""
          }`}
          onClick={() => setActiveView("settings")}
          aria-current={activeView === "settings" ? "page" : undefined}
        >
          <Settings size={17} />
          Settings
        </button>
      </nav>
    </header>
  );
}

export default Header;
