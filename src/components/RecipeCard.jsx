import {
  ChefHat,
  Clock3,
  Heart,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Users,
} from "lucide-react";

import NutritionCard from "./NutritionCard";

function RecipeCard({
  recipe,
  onReset,
  onSave,
  isSaved,
}) {
  return (
    <section className="recipe-section" id="recipe-result">
      <div className="recipe-header">
        <div>
          <span className="recipe-kicker">
            <Sparkles size={15} />
            Your generated meal
          </span>

          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
        </div>

        <div className="recipe-actions">
          <button
            type="button"
            className="save-recipe-button"
            onClick={() => onSave(recipe)}
            disabled={isSaved}
          >
            <Heart size={17} />
            {isSaved ? "Saved" : "Save recipe"}
          </button>

          <button
            type="button"
            className="new-recipe-button"
            onClick={onReset}
          >
            <RotateCcw size={17} />
            Start again
          </button>
        </div>
      </div>

      <div className="recipe-meta">
        <span>
          <Clock3 size={18} />
          {recipe.totalTime} minutes
        </span>

        <span>
          <Users size={18} />
          {recipe.servings} servings
        </span>

        <span>
          <ChefHat size={18} />
          {recipe.difficulty}
        </span>
      </div>

      <div className="recipe-layout">
        <article className="recipe-content">
          <section className="recipe-block">
            <h3>Ingredients</h3>

            <ul className="ingredient-list">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </section>

          <section className="recipe-block">
            <h3>Instructions</h3>

            <ol className="instruction-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={`${instruction}-${index}`}>
                  <span>{index + 1}</span>
                  <p>{instruction}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="substitution-box">
            <h3>Easy substitutions</h3>

            <ul>
              {recipe.substitutions.map((substitution, index) => (
                <li key={`${substitution}-${index}`}>
                  {substitution}
                </li>
              ))}
            </ul>
          </section>

          <section className="waste-tip">
            <Lightbulb size={22} />

            <div>
              <h3>Food-waste tip</h3>
              <p>{recipe.wasteTip}</p>
            </div>
          </section>
        </article>

        <NutritionCard nutrition={recipe.nutrition} />
      </div>
    </section>
  );
}

export default RecipeCard;