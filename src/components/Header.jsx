import { ChefHat, Heart } from "lucide-react";

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
        >
          Meal Generator
        </button>

        <button
          className={`nav-link ${
            activeView === "saved" ? "active" : ""
          }`}
          onClick={() => setActiveView("saved")}
        >
          <Heart size={17} />
          Saved
          <span className="saved-count">
            {savedCount}
          </span>
        </button>
      </nav>
    </header>
  );
}

export default Header;