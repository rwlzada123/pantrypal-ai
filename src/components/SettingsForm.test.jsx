import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SettingsForm from "./SettingsForm";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "../utils/settings";

const savedSettings = {
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

function renderSettingsForm(overrides = {}) {
  const onSave = vi.fn();
  const onReset = vi.fn();
  let values = {
    ...DEFAULT_SETTINGS,
    allergies: [],
    ...overrides.initialValues,
  };

  const setValues = (updater) => {
    values = typeof updater === "function" ? updater(values) : updater;
    rerender(
      <SettingsForm
        values={values}
        onChange={setValues}
        savedValues={overrides.savedValues ?? savedSettings}
        onSave={onSave}
        onReset={onReset}
      />
    );
  };

  const view = render(
    <SettingsForm
      values={values}
      onChange={setValues}
      savedValues={overrides.savedValues ?? savedSettings}
      onSave={onSave}
      onReset={onReset}
    />
  );

  const rerender = view.rerender;

  return { ...view, onSave, onReset, getValues: () => values };
}

describe("SettingsForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a display name error for empty input", async () => {
    const user = userEvent.setup();
    renderSettingsForm({
      initialValues: { displayName: "Alex Cook" },
    });

    await user.clear(screen.getByLabelText(/display name/i));
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const displayNameInput = screen.getByLabelText(/display name/i);
    expect(displayNameInput).toHaveAttribute("aria-invalid", "true");
    expect(displayNameInput).toHaveAttribute(
      "aria-describedby",
      "displayName-error"
    );
    expect(screen.getByText("Display name is required.")).toHaveAttribute(
      "id",
      "displayName-error"
    );
  });

  it("shows a display name error for whitespace-only input", async () => {
    const user = userEvent.setup();
    renderSettingsForm({
      initialValues: { displayName: "Alex Cook" },
    });

    await user.clear(screen.getByLabelText(/display name/i));
    await user.type(screen.getByLabelText(/display name/i), "   ");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(screen.getByText("Display name is required.")).toBeInTheDocument();
  });

  it("shows display name length errors", async () => {
    const user = userEvent.setup();
    renderSettingsForm({
      initialValues: { displayName: "Alex Cook" },
    });

    await user.clear(screen.getByLabelText(/display name/i));
    await user.type(screen.getByLabelText(/display name/i), "A");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(
      screen.getByText("Display name must be at least 2 characters.")
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/display name/i));
    await user.type(screen.getByLabelText(/display name/i), "A".repeat(51));
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(
      screen.getByText("Display name must be 50 characters or fewer.")
    ).toBeInTheDocument();
  });

  it("allows an empty email and rejects invalid email", async () => {
    const user = userEvent.setup();
    const { onSave } = renderSettingsForm({
      initialValues: {
        displayName: "Alex Cook",
        email: "",
      },
    });

    await user.click(screen.getByRole("button", { name: /save settings/i }));
    expect(onSave).toHaveBeenCalledTimes(1);

    await user.type(screen.getByLabelText(/^email$/i), "bad-email");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const emailInput = screen.getByLabelText(/^email$/i);
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByText("Enter a valid email address.")).toHaveAttribute(
      "id",
      "email-error"
    );
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("saves valid settings and shows confirmation", async () => {
    const user = userEvent.setup();
    const { onSave } = renderSettingsForm({
      initialValues: {
        displayName: "Alex Cook",
        email: "alex@example.com",
        mealType: "Dinner",
        diet: "Vegetarian",
        cookingTime: 45,
        skillLevel: "Intermediate",
        servings: 4,
        budget: "Medium",
        allergies: ["Dairy"],
      },
    });

    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(onSave).toHaveBeenCalledWith({
      displayName: "Alex Cook",
      email: "alex@example.com",
      mealType: "Dinner",
      diet: "Vegetarian",
      cookingTime: 45,
      skillLevel: "Intermediate",
      servings: 4,
      budget: "Medium",
      allergies: ["Dairy"],
    });
    expect(localStorage.getItem(SETTINGS_STORAGE_KEY)).toBeTruthy();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Settings saved successfully."
    );
  });

  it("restores the last saved values when reset is clicked", async () => {
    const user = userEvent.setup();
    const { getValues } = renderSettingsForm({
      initialValues: savedSettings,
      savedValues: savedSettings,
    });

    await user.clear(screen.getByLabelText(/display name/i));
    await user.type(screen.getByLabelText(/display name/i), "Temporary Name");
    await user.click(screen.getByRole("button", { name: /reset changes/i }));

    expect(getValues().displayName).toBe("Alex Cook");
    expect(screen.getByLabelText(/display name/i)).toHaveValue("Alex Cook");
  });

  it("exposes allergy selected state with aria-pressed", async () => {
    const user = userEvent.setup();
    renderSettingsForm({
      initialValues: {
        displayName: "Alex Cook",
        allergies: [],
      },
    });

    const dairyButton = screen.getByRole("button", { name: "Dairy" });
    expect(dairyButton).toHaveAttribute("aria-pressed", "false");

    await user.click(dairyButton);
    expect(dairyButton).toHaveAttribute("aria-pressed", "true");

    await user.click(dairyButton);
    expect(dairyButton).toHaveAttribute("aria-pressed", "false");
  });

  it("associates field errors with controls", async () => {
    const user = userEvent.setup();
    renderSettingsForm({
      initialValues: { displayName: "Alex Cook", email: "alex@example.com" },
    });

    await user.clear(screen.getByLabelText(/^email$/i));
    await user.type(screen.getByLabelText(/^email$/i), "invalid");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const emailInput = screen.getByLabelText(/^email$/i);
    const error = screen.getByText("Enter a valid email address.");

    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput.getAttribute("aria-describedby")).toBe("email-error");
    expect(error).toHaveAttribute("id", "email-error");
    expect(within(error.closest(".text-field")).getByLabelText(/^email$/i)).toBe(
      emailInput
    );
  });
});
