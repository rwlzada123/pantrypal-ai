import {
  AlertTriangle,
  ChefHat,
  Clock3,
  Coins,
  Salad,
  Sparkles,
  Users,
} from "lucide-react";

import IngredientInput from "./IngredientInput";

import {
  allergyOptions,
  budgetOptions,
  cookingTimes,
  diets,
  mealTypes,
  skillLevels,
} from "../data/options";

function MealForm({
  ingredients,
  setIngredients,
  preferences,
  setPreferences,
  onSubmit,
  error,
  isLoading,
}) {
  function handleChange(event) {
    const { name, value } = event.target;

    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [name]:
        name === "servings" || name === "cookingTime"
          ? Number(value)
          : value,
    }));
  }

  function toggleAllergy(allergy) {
    setPreferences((currentPreferences) => {
      const selected =
        currentPreferences.allergies.includes(allergy);

      return {
        ...currentPreferences,
        allergies: selected
          ? currentPreferences.allergies.filter(
              (item) => item !== allergy
            )
          : [...currentPreferences.allergies, allergy],
      };
    });
  }

  return (
    <section className="generator-card">
      <div className="section-title">
        <span className="section-icon">
          <ChefHat size={22} />
        </span>

        <div>
          <p className="section-kicker">Create your meal</p>
          <h2>Tell us what is in your kitchen</h2>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <IngredientInput
          ingredients={ingredients}
          setIngredients={setIngredients}
        />

        <div className="form-divider" />

        <div className="field-heading">
          <div>
            <label>Personalize your recipe</label>
            <p>Choose the options that match your needs.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="select-field">
            <span className="select-label">
              <Salad size={17} />
              Meal type
            </span>

            <select
              name="mealType"
              value={preferences.mealType}
              onChange={handleChange}
            >
              {mealTypes.map((mealType) => (
                <option key={mealType}>{mealType}</option>
              ))}
            </select>
          </label>

          <label className="select-field">
            <span className="select-label">
              <Sparkles size={17} />
              Diet
            </span>

            <select
              name="diet"
              value={preferences.diet}
              onChange={handleChange}
            >
              {diets.map((diet) => (
                <option key={diet}>{diet}</option>
              ))}
            </select>
          </label>

          <label className="select-field">
            <span className="select-label">
              <Clock3 size={17} />
              Maximum time
            </span>

            <select
              name="cookingTime"
              value={preferences.cookingTime}
              onChange={handleChange}
            >
              {cookingTimes.map((time) => (
                <option value={time} key={time}>
                  {time} minutes
                </option>
              ))}
            </select>
          </label>

          <label className="select-field">
            <span className="select-label">
              <ChefHat size={17} />
              Cooking skill
            </span>

            <select
              name="skillLevel"
              value={preferences.skillLevel}
              onChange={handleChange}
            >
              {skillLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>

          <label className="select-field">
            <span className="select-label">
              <Users size={17} />
              Servings
            </span>

            <select
              name="servings"
              value={preferences.servings}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <option value={number} key={number}>
                  {number}
                </option>
              ))}
            </select>
          </label>

          <label className="select-field">
            <span className="select-label">
              <Coins size={17} />
              Budget
            </span>

            <select
              name="budget"
              value={preferences.budget}
              onChange={handleChange}
            >
              {budgetOptions.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="allergy-section">
          <span className="select-label">
            <AlertTriangle size={17} />
            Allergies to avoid
          </span>

          <div className="choice-chips">
            {allergyOptions.map((allergy) => {
              const selected =
                preferences.allergies.includes(allergy);

              return (
                <button
                  type="button"
                  className={
                    selected
                      ? "choice-chip selected"
                      : "choice-chip"
                  }
                  onClick={() => toggleAllergy(allergy)}
                  key={allergy}
                >
                  {allergy}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
            <div className="form-error" role="alert">
                <AlertTriangle size={18} />
                {error}
            </div>
            )}

            <button
            className="generate-button"
            type="submit"
            disabled={isLoading}
            >
            <Sparkles size={20} />

            {isLoading
                ? "Creating your recipe..."
                : "Generate my recipe"}
            </button>

        <p className="form-note">
          PantryPal provides AI-generated meal suggestions and
          approximate nutrition information.
        </p>
      </form>
    </section>
  );
}

export default MealForm;