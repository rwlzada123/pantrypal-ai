import { ChefHat, Sparkles } from "lucide-react";

function LoadingRecipe() {
  return (
    <section className="loading-card" aria-live="polite">
      <div className="loading-icon">
        <ChefHat size={34} />
        <span className="loading-sparkle">
          <Sparkles size={18} />
        </span>
      </div>

      <div>
        <p className="loading-kicker">PantryPal is cooking</p>
        <h2>Creating your personalized recipe...</h2>

        <p>
          Matching your ingredients, preferences, cooking time,
          and dietary needs.
        </p>
      </div>

      <div className="loading-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

export default LoadingRecipe;