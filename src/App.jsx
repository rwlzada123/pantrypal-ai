import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MealForm from "./components/MealForm";
import LoadingRecipe from "./components/LoadingRecipe";
import RecipeCard from "./components/RecipeCard";
import "./App.css";

const initialPreferences = {
  mealType: "Any",
  diet: "No preference",
  cookingTime: 30,
  skillLevel: "Beginner",
  servings: 2,
  budget: "Low",
  allergies: [],
};

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [preferences, setPreferences] =
    useState(initialPreferences);

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    setPreferences(initialPreferences);
    setRecipe(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="app">
      <Header />

      <main>
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
          />
        )}
      </main>
    </div>
  );
}

export default App;