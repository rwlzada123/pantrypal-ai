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
  const [preferences, setPreferences] = useState(initialPreferences);

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (ingredients.length < 2) {
      setError("Please add at least two ingredients.");
      return;
    }

    setError("");
    setRecipe(null);
    setIsLoading(true);

    const fakeRecipe = {
      title: "Creamy Pantry Chicken and Rice",
      description:
        "A comforting one-pan meal using simple pantry ingredients.",
      preparationTime: 10,
      cookingTime: 25,
      totalTime: 35,
      servings: preferences.servings,
      difficulty: preferences.skillLevel,
      ingredients: [
        `${preferences.servings} cups cooked rice`,
        "300 g chicken breast, sliced",
        "2 tomatoes, chopped",
        "1 small onion, diced",
        "2 cloves garlic, minced",
        "1 tablespoon cooking oil",
        "1 teaspoon paprika",
        "Salt and black pepper to taste",
      ],
      instructions: [
        "Heat the oil in a large pan over medium heat.",
        "Add the onion and cook for 3 minutes until softened.",
        "Add the garlic and chicken. Cook until the chicken is lightly browned.",
        "Add the tomatoes, paprika, salt, and black pepper.",
        "Cook for 8–10 minutes until the chicken is fully cooked.",
        "Add the cooked rice and stir everything together.",
        "Cook for another 3 minutes, then serve warm.",
      ],
      substitutions: [
        "Replace chicken with chickpeas for a vegetarian version.",
        "Use pasta instead of rice if needed.",
      ],
      wasteTip:
        "Store leftover portions in an airtight container and refrigerate for up to two days.",
      nutrition: {
        calories: 520,
        protein: 38,
        carbohydrates: 58,
        fat: 15,
        fiber: 6,
      },
    };

    setTimeout(() => {
      setRecipe(fakeRecipe);
      setIsLoading(false);

      setTimeout(() => {
        document
          .getElementById("recipe-result")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1800);
  }

  function handleReset() {
    setIngredients([]);
    setPreferences(initialPreferences);
    setRecipe(null);
    setError("");
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