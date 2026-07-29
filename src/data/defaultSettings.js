export const defaultPreferences = {
  mealType: "Any",
  diet: "No preference",
  cookingTime: 30,
  skillLevel: "Beginner",
  servings: 2,
  budget: "Low",
  allergies: [],
};

export const defaultSettings = {
  profile: {
    displayName: "",
    email: "",
  },
  defaultPreferences,
};

export const SETTINGS_STORAGE_KEY = "pantrypalSettings";
