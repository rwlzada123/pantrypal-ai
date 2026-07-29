import {
  allergyOptions,
  budgetOptions,
  cookingTimes,
  diets,
  mealTypes,
  servingsOptions,
  skillLevels,
} from "../data/options";

/** Documented localStorage key for user settings persistence. */
export const SETTINGS_STORAGE_KEY = "pantrypal-user-settings";

export const DEFAULT_SETTINGS = {
  displayName: "",
  email: "",
  mealType: "Any",
  diet: "No preference",
  cookingTime: 30,
  skillLevel: "Beginner",
  servings: 2,
  budget: "Low",
  allergies: [],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAllowedValue(value, allowedValues) {
  return allowedValues.includes(value);
}

function normalizeAllergies(allergies) {
  if (!Array.isArray(allergies)) {
    return [...DEFAULT_SETTINGS.allergies];
  }

  const filtered = allergies.filter((allergy) =>
    allergyOptions.includes(allergy)
  );

  return [...new Set(filtered)];
}

export function extractMealPreferences(settings) {
  return {
    mealType: settings.mealType,
    diet: settings.diet,
    cookingTime: settings.cookingTime,
    skillLevel: settings.skillLevel,
    servings: settings.servings,
    budget: settings.budget,
    allergies: [...settings.allergies],
  };
}

export function normalizeSettings(raw) {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_SETTINGS, allergies: [] };
  }

  const displayName =
    typeof raw.displayName === "string"
      ? raw.displayName
      : DEFAULT_SETTINGS.displayName;

  const email =
    typeof raw.email === "string" ? raw.email : DEFAULT_SETTINGS.email;

  const mealType = isAllowedValue(raw.mealType, mealTypes)
    ? raw.mealType
    : DEFAULT_SETTINGS.mealType;

  const diet = isAllowedValue(raw.diet, diets)
    ? raw.diet
    : DEFAULT_SETTINGS.diet;

  const cookingTime = isAllowedValue(raw.cookingTime, cookingTimes)
    ? raw.cookingTime
    : DEFAULT_SETTINGS.cookingTime;

  const skillLevel = isAllowedValue(raw.skillLevel, skillLevels)
    ? raw.skillLevel
    : DEFAULT_SETTINGS.skillLevel;

  const servings = isAllowedValue(raw.servings, servingsOptions)
    ? raw.servings
    : DEFAULT_SETTINGS.servings;

  const budget = isAllowedValue(raw.budget, budgetOptions)
    ? raw.budget
    : DEFAULT_SETTINGS.budget;

  const allergies = normalizeAllergies(raw.allergies);

  return {
    displayName,
    email,
    mealType,
    diet,
    cookingTime,
    skillLevel,
    servings,
    budget,
    allergies,
  };
}

export function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!stored) {
      return { ...DEFAULT_SETTINGS, allergies: [] };
    }

    const parsed = JSON.parse(stored);
    return normalizeSettings(parsed);
  } catch {
    return { ...DEFAULT_SETTINGS, allergies: [] };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function validateDisplayName(displayName) {
  const trimmed = displayName.trim();

  if (!trimmed) {
    return "Display name is required.";
  }

  if (trimmed.length < 2) {
    return "Display name must be at least 2 characters.";
  }

  if (trimmed.length > 50) {
    return "Display name must be 50 characters or fewer.";
  }

  return null;
}

export function validateEmail(email) {
  const trimmed = email.trim();

  if (!trimmed) {
    return null;
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validateMealField(name, value) {
  const allowedValuesByField = {
    mealType: mealTypes,
    diet: diets,
    cookingTime: cookingTimes,
    skillLevel: skillLevels,
    servings: servingsOptions,
    budget: budgetOptions,
  };

  const allowedValues = allowedValuesByField[name];

  if (!allowedValues || !isAllowedValue(value, allowedValues)) {
    return `Select a valid ${name}.`;
  }

  return null;
}

export function validateAllergies(allergies) {
  if (!Array.isArray(allergies)) {
    return "Allergies must be selected from the available options.";
  }

  const invalid = allergies.filter(
    (allergy) => !allergyOptions.includes(allergy)
  );

  if (invalid.length > 0) {
    return "Allergies must be selected from the available options.";
  }

  return null;
}

export function validateSettings(settings) {
  const errors = {};

  const displayNameError = validateDisplayName(settings.displayName);
  if (displayNameError) {
    errors.displayName = displayNameError;
  }

  const emailError = validateEmail(settings.email);
  if (emailError) {
    errors.email = emailError;
  }

  for (const field of [
    "mealType",
    "diet",
    "cookingTime",
    "skillLevel",
    "servings",
    "budget",
  ]) {
    const fieldError = validateMealField(field, settings[field]);
    if (fieldError) {
      errors[field] = fieldError;
    }
  }

  const allergiesError = validateAllergies(settings.allergies);
  if (allergiesError) {
    errors.allergies = allergiesError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getValidatedSettings(settings) {
  const normalized = normalizeSettings(settings);
  const validation = validateSettings({
    ...normalized,
    displayName: normalized.displayName.trim(),
    email: normalized.email.trim(),
  });

  if (!validation.isValid) {
    return { isValid: false, errors: validation.errors, settings: null };
  }

  const validatedSettings = {
    ...normalized,
    displayName: normalized.displayName.trim(),
    email: normalized.email.trim(),
  };

  return {
    isValid: true,
    errors: {},
    settings: validatedSettings,
  };
}
