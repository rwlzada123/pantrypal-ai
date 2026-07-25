import { ChefHat, Heart } from "lucide-react";

function Header() {
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
        <button className="nav-link active">Meal Generator</button>

        <button className="nav-link">
          <Heart size={17} />
          Saved
          <span className="saved-count">0</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;