import {
  allergyOptions,
  budgetOptions,
  cookingTimes,
  diets,
  mealTypes,
  skillLevels,
} from "../data/options";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSettings(settings) {
  const errors = {};

  const displayName = settings.profile.displayName.trim();

  if (!displayName) {
    errors.displayName = "Display name is required.";
  } else if (displayName.length < 2) {
    errors.displayName = "Display name must be at least 2 characters.";
  } else if (displayName.length > 50) {
    errors.displayName = "Display name must be 50 characters or fewer.";
  }

  const email = settings.profile.email.trim();

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const { defaultPreferences } = settings;

  if (!mealTypes.includes(defaultPreferences.mealType)) {
    errors.mealType = "Select a valid meal type.";
  }

  if (!diets.includes(defaultPreferences.diet)) {
    errors.diet = "Select a valid diet option.";
  }

  if (!cookingTimes.includes(defaultPreferences.cookingTime)) {
    errors.cookingTime = "Select a valid cooking time.";
  }

  if (!skillLevels.includes(defaultPreferences.skillLevel)) {
    errors.skillLevel = "Select a valid skill level.";
  }

  const servings = Number(defaultPreferences.servings);

  if (!Number.isInteger(servings) || servings < 1 || servings > 6) {
    errors.servings = "Servings must be between 1 and 6.";
  }

  if (!budgetOptions.includes(defaultPreferences.budget)) {
    errors.budget = "Select a valid budget option.";
  }

  if (!Array.isArray(defaultPreferences.allergies)) {
    errors.allergies = "Allergies must be a valid list.";
  } else {
    const invalidAllergy = defaultPreferences.allergies.find(
      (allergy) => !allergyOptions.includes(allergy)
    );

    if (invalidAllergy) {
      errors.allergies = "One or more allergy selections are invalid.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
