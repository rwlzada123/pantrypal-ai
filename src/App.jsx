import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MealForm from "./components/MealForm";
import LoadingRecipe from "./components/LoadingRecipe";
import RecipeCard from "./components/RecipeCard";
import SettingsForm from "./components/SettingsForm";
import {
  extractMealPreferences,
  loadSettings,
} from "./utils/settings";
import "./App.css";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [initialSettings] = useState(() => loadSettings());

  const [preferences, setPreferences] = useState(() =>
    extractMealPreferences(initialSettings)
  );

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("generator");

  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedRecipes")) || [];
    } catch {
      return [];
    }
  });

  const [lastSavedSettings, setLastSavedSettings] = useState(() => ({
    ...initialSettings,
    allergies: [...initialSettings.allergies],
  }));

  const [settingsDraft, setSettingsDraft] = useState(() => ({
    ...initialSettings,
    allergies: [...initialSettings.allergies],
  }));

  async function handleSubmit(event) {
    event.preventDefault();

    if (ingredients.length < 2) {
      setError("Please add at least two ingredients.");
      return;
    }

    setError("");
    setRecipe(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Recipe generation failed."
        );
      }

      setRecipe(data.recipe);

      setTimeout(() => {
        document
          .getElementById("recipe-result")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setIngredients([]);
    setPreferences(extractMealPreferences(lastSavedSettings));
    setRecipe(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSaveRecipe(recipeToSave) {
    const alreadySaved = savedRecipes.some(
      (savedRecipe) =>
        savedRecipe.title === recipeToSave.title &&
        savedRecipe.description === recipeToSave.description
    );

    if (alreadySaved) {
      return;
    }

    const updatedRecipes = [...savedRecipes, recipeToSave];

    setSavedRecipes(updatedRecipes);

    localStorage.setItem(
      "savedRecipes",
      JSON.stringify(updatedRecipes)
    );
  }

  function handleSettingsSave(savedSettings) {
    setLastSavedSettings(savedSettings);
    setSettingsDraft({
      ...savedSettings,
      allergies: [...savedSettings.allergies],
    });
    setPreferences(extractMealPreferences(savedSettings));
  }

  function handleSettingsReset() {
    setSettingsDraft({
      ...lastSavedSettings,
      allergies: [...lastSavedSettings.allergies],
    });
  }

  return (
    <div className="app">
      <Header
        savedCount={savedRecipes.length}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main>
        {activeView === "generator" && (
          <>
            <Hero />

            <MealForm
              ingredients={ingredients}
              setIngredients={setIngredients}
              preferences={preferences}
              setPreferences={setPreferences}
              onSubmit={handleSubmit}
              error={error}
              isLoading={isLoading}
            />

            {isLoading && <LoadingRecipe />}

            {recipe && (
              <RecipeCard
                recipe={recipe}
                onReset={handleReset}
                onSave={handleSaveRecipe}
                isSaved={savedRecipes.some(
                  (savedRecipe) =>
                    savedRecipe.title === recipe.title &&
                    savedRecipe.description === recipe.description
                )}
              />
            )}
          </>
        )}

        {activeView === "saved" && (
          <section className="saved-recipes-section">
            <h1>Saved Recipes</h1>

            {savedRecipes.length === 0 ? (
              <p>You have not saved any recipes yet.</p>
            ) : (
              <div className="saved-recipes-grid">
                {savedRecipes.map((savedRecipe, index) => (
                  <article
                    className="saved-recipe-card"
                    key={`${savedRecipe.title}-${index}`}
                  >
                    <h2>{savedRecipe.title}</h2>
                    <p>{savedRecipe.description}</p>

                    <button
                      type="button"
                      onClick={() => {
                        setRecipe(savedRecipe);
                        setActiveView("generator");

                        setTimeout(() => {
                          document
                            .getElementById("recipe-result")
                            ?.scrollIntoView({
                              behavior: "smooth",
                            });
                        }, 100);
                      }}
                    >
                      View recipe
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeView === "settings" && (
          <SettingsForm
            values={settingsDraft}
            onChange={setSettingsDraft}
            savedValues={lastSavedSettings}
            onSave={handleSettingsSave}
            onReset={handleSettingsReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
