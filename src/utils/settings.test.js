import { beforeEach, describe, expect, it } from "vitest";

import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  loadSettings,
  normalizeSettings,
  saveSettings,
  validateDisplayName,
  validateEmail,
  validateSettings,
} from "./settings";

describe("settings validation", () => {
  it("rejects an empty display name", () => {
    expect(validateDisplayName("")).toBe("Display name is required.");
  });

  it("rejects a whitespace-only display name", () => {
    expect(validateDisplayName("   ")).toBe("Display name is required.");
  });

  it("rejects too-short and too-long display names", () => {
    expect(validateDisplayName("A")).toBe(
      "Display name must be at least 2 characters."
    );
    expect(validateDisplayName("A".repeat(51))).toBe(
      "Display name must be 50 characters or fewer."
    );
  });

  it("allows an empty optional email", () => {
    expect(validateEmail("")).toBeNull();
    expect(validateEmail("   ")).toBeNull();
  });

  it("rejects invalid non-empty email addresses", () => {
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
  });
});

describe("settings persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves valid settings and restores them after refresh", () => {
    const settings = {
      displayName: "Alex Cook",
      email: "alex@example.com",
      mealType: "Dinner",
      diet: "Vegetarian",
      cookingTime: 45,
      skillLevel: "Intermediate",
      servings: 4,
      budget: "Medium",
      allergies: ["Dairy"],
    };

    saveSettings(settings);

    expect(localStorage.getItem(SETTINGS_STORAGE_KEY)).toBeTruthy();
    expect(loadSettings()).toEqual(settings);
  });

  it("handles malformed localStorage JSON", () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, "{not-json");

    expect(loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      allergies: [],
    });
  });

  it("falls back when stored settings are incomplete or invalid", () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        displayName: "Sam",
        mealType: "Brunch",
        diet: "Keto",
        cookingTime: 90,
        skillLevel: "Expert",
        servings: 9,
        budget: "High",
        allergies: ["Sesame", "Dairy"],
      })
    );

    expect(loadSettings()).toEqual({
      displayName: "Sam",
      email: "",
      mealType: DEFAULT_SETTINGS.mealType,
      diet: DEFAULT_SETTINGS.diet,
      cookingTime: DEFAULT_SETTINGS.cookingTime,
      skillLevel: DEFAULT_SETTINGS.skillLevel,
      servings: DEFAULT_SETTINGS.servings,
      budget: DEFAULT_SETTINGS.budget,
      allergies: ["Dairy"],
    });
  });

  it("validates settings before save", () => {
    const result = validateSettings({
      ...DEFAULT_SETTINGS,
      displayName: "",
      email: "bad-email",
      mealType: "Brunch",
      allergies: ["Unknown"],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.displayName).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.mealType).toBeTruthy();
    expect(result.errors.allergies).toBeTruthy();
  });

  it("normalizes partial objects safely", () => {
    expect(normalizeSettings(null)).toEqual({
      ...DEFAULT_SETTINGS,
      allergies: [],
    });
  });
});
