import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { SETTINGS_STORAGE_KEY } from "./utils/settings";

vi.mock("./components/Hero", () => ({
  default: () => <div data-testid="hero" />,
}));

vi.mock("./components/LoadingRecipe", () => ({
  default: () => <div data-testid="loading-recipe" />,
}));

vi.mock("./components/RecipeCard", () => ({
  default: () => <div data-testid="recipe-card" />,
}));

describe("App settings integration", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("pre-fills MealForm with saved meal preferences after refresh", async () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        displayName: "Alex Cook",
        email: "alex@example.com",
        mealType: "Dinner",
        diet: "Vegetarian",
        cookingTime: 45,
        skillLevel: "Intermediate",
        servings: 4,
        budget: "Medium",
        allergies: ["Dairy", "Gluten"],
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/^meal type$/i)).toHaveValue("Dinner");
    });

    expect(screen.getByLabelText(/^diet$/i)).toHaveValue("Vegetarian");
    expect(screen.getByLabelText(/maximum time/i)).toHaveValue("45");
    expect(screen.getByLabelText(/cooking skill/i)).toHaveValue("Intermediate");
    expect(screen.getByLabelText(/^servings$/i)).toHaveValue("4");
    expect(screen.getByLabelText(/^budget$/i)).toHaveValue("Medium");
    expect(screen.getByRole("button", { name: "Dairy" })).toHaveClass("selected");
    expect(screen.getByRole("button", { name: "Gluten" })).toHaveClass(
      "selected"
    );
  });
});
