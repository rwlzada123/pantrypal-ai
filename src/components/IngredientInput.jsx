import { Plus, X } from "lucide-react";
import { useState } from "react";

function IngredientInput({ ingredients, setIngredients }) {
  const [value, setValue] = useState("");

  function addIngredient() {
    const cleanedIngredient = value.trim();

    if (!cleanedIngredient) {
      return;
    }

    const alreadyExists = ingredients.some(
      (ingredient) =>
        ingredient.toLowerCase() === cleanedIngredient.toLowerCase()
    );

    if (!alreadyExists) {
      setIngredients([...ingredients, cleanedIngredient]);
    }

    setValue("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addIngredient();
    }
  }

  function removeIngredient(ingredientToRemove) {
    setIngredients(
      ingredients.filter(
        (ingredient) => ingredient !== ingredientToRemove
      )
    );
  }

  return (
    <div className="ingredient-section">
      <div className="field-heading">
        <div>
          <label htmlFor="ingredient-input">
            What ingredients do you have?
          </label>

          <p>Type an ingredient and press Enter or Add.</p>
        </div>

        <span className="ingredient-counter">
          {ingredients.length} added
        </span>
      </div>

      <div className="ingredient-input-row">
        <input
          id="ingredient-input"
          type="text"
          value={value}
          placeholder="e.g. chicken, rice, tomatoes"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="add-button"
          onClick={addIngredient}
        >
          <Plus size={19} />
          Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="ingredient-tags">
          {ingredients.map((ingredient) => (
            <span className="ingredient-tag" key={ingredient}>
              {ingredient}

              <button
                type="button"
                onClick={() => removeIngredient(ingredient)}
                aria-label={`Remove ${ingredient}`}
              >
                <X size={15} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default IngredientInput;