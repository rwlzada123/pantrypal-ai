import { useState } from "react";
import {
  AlertTriangle,
  Clock3,
  Coins,
  Mail,
  Salad,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import {
  allergyOptions,
  budgetOptions,
  cookingTimes,
  diets,
  mealTypes,
  servingsOptions,
  skillLevels,
} from "../data/options";
import { getValidatedSettings, saveSettings } from "../utils/settings";

function SettingsForm({
  values,
  onChange,
  savedValues,
  onSave,
  onReset,
}) {
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");

  function handleFieldChange(event) {
    const { name, value } = event.target;

    onChange((currentValues) => ({
      ...currentValues,
      [name]:
        name === "servings" || name === "cookingTime"
          ? Number(value)
          : value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  function toggleAllergy(allergy) {
    onChange((currentValues) => {
      const selected = currentValues.allergies.includes(allergy);

      return {
        ...currentValues,
        allergies: selected
          ? currentValues.allergies.filter((item) => item !== allergy)
          : [...currentValues.allergies, allergy],
      };
    });

    setErrors((currentErrors) => {
      if (!currentErrors.allergies) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors.allergies;
      return nextErrors;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaveMessage("");

    const result = getValidatedSettings(values);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    saveSettings(result.settings);
    onSave(result.settings);
    setErrors({});
    setSaveMessage("Settings saved successfully.");
  }

  function handleResetClick() {
    onChange({ ...savedValues, allergies: [...savedValues.allergies] });
    setErrors({});
    setSaveMessage("");
    onReset();
  }

  return (
    <section className="generator-card settings-card">
      <div className="section-title">
        <span className="section-icon">
          <Settings size={22} />
        </span>

        <div>
          <p className="section-kicker">Your profile</p>
          <h2>Settings</h2>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className="settings-profile-grid">
          <div className="text-field">
            <label className="select-label" htmlFor="displayName">
              <User size={17} />
              Display name
            </label>

            <input
              id="displayName"
              className="text-input"
              name="displayName"
              type="text"
              value={values.displayName}
              onChange={handleFieldChange}
              aria-invalid={errors.displayName ? "true" : undefined}
              aria-describedby={
                errors.displayName ? "displayName-error" : undefined
              }
            />

            {errors.displayName && (
              <p className="field-error" id="displayName-error">
                {errors.displayName}
              </p>
            )}
          </div>

          <div className="text-field">
            <label className="select-label" htmlFor="email">
              <Mail size={17} />
              Email
            </label>

            <input
              id="email"
              className="text-input"
              name="email"
              type="email"
              value={values.email}
              onChange={handleFieldChange}
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            {errors.email && (
              <p className="field-error" id="email-error">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="form-divider" />

        <div className="field-heading">
          <div>
            <h3 className="settings-subheading">Default meal preferences</h3>
            <p>These values pre-fill the meal generator form.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="select-field">
            <label className="select-label" htmlFor="mealType">
              <Salad size={17} />
              Default meal type
            </label>

            <select
              id="mealType"
              name="mealType"
              value={values.mealType}
              onChange={handleFieldChange}
              aria-invalid={errors.mealType ? "true" : undefined}
              aria-describedby={errors.mealType ? "mealType-error" : undefined}
            >
              {mealTypes.map((mealType) => (
                <option key={mealType}>{mealType}</option>
              ))}
            </select>

            {errors.mealType && (
              <p className="field-error" id="mealType-error">
                {errors.mealType}
              </p>
            )}
          </div>

          <div className="select-field">
            <label className="select-label" htmlFor="diet">
              <Sparkles size={17} />
              Default diet
            </label>

            <select
              id="diet"
              name="diet"
              value={values.diet}
              onChange={handleFieldChange}
              aria-invalid={errors.diet ? "true" : undefined}
              aria-describedby={errors.diet ? "diet-error" : undefined}
            >
              {diets.map((diet) => (
                <option key={diet}>{diet}</option>
              ))}
            </select>

            {errors.diet && (
              <p className="field-error" id="diet-error">
                {errors.diet}
              </p>
            )}
          </div>

          <div className="select-field">
            <label className="select-label" htmlFor="cookingTime">
              <Clock3 size={17} />
              Default maximum cooking time
            </label>

            <select
              id="cookingTime"
              name="cookingTime"
              value={values.cookingTime}
              onChange={handleFieldChange}
              aria-invalid={errors.cookingTime ? "true" : undefined}
              aria-describedby={
                errors.cookingTime ? "cookingTime-error" : undefined
              }
            >
              {cookingTimes.map((time) => (
                <option value={time} key={time}>
                  {time} minutes
                </option>
              ))}
            </select>

            {errors.cookingTime && (
              <p className="field-error" id="cookingTime-error">
                {errors.cookingTime}
              </p>
            )}
          </div>

          <div className="select-field">
            <label className="select-label" htmlFor="skillLevel">
              <Settings size={17} />
              Default cooking skill
            </label>

            <select
              id="skillLevel"
              name="skillLevel"
              value={values.skillLevel}
              onChange={handleFieldChange}
              aria-invalid={errors.skillLevel ? "true" : undefined}
              aria-describedby={
                errors.skillLevel ? "skillLevel-error" : undefined
              }
            >
              {skillLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>

            {errors.skillLevel && (
              <p className="field-error" id="skillLevel-error">
                {errors.skillLevel}
              </p>
            )}
          </div>

          <div className="select-field">
            <label className="select-label" htmlFor="servings">
              <Users size={17} />
              Default servings
            </label>

            <select
              id="servings"
              name="servings"
              value={values.servings}
              onChange={handleFieldChange}
              aria-invalid={errors.servings ? "true" : undefined}
              aria-describedby={errors.servings ? "servings-error" : undefined}
            >
              {servingsOptions.map((number) => (
                <option value={number} key={number}>
                  {number}
                </option>
              ))}
            </select>

            {errors.servings && (
              <p className="field-error" id="servings-error">
                {errors.servings}
              </p>
            )}
          </div>

          <div className="select-field">
            <label className="select-label" htmlFor="budget">
              <Coins size={17} />
              Default budget
            </label>

            <select
              id="budget"
              name="budget"
              value={values.budget}
              onChange={handleFieldChange}
              aria-invalid={errors.budget ? "true" : undefined}
              aria-describedby={errors.budget ? "budget-error" : undefined}
            >
              {budgetOptions.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>

            {errors.budget && (
              <p className="field-error" id="budget-error">
                {errors.budget}
              </p>
            )}
          </div>
        </div>

        <div className="allergy-section">
          <span className="select-label" id="allergies-label">
            <AlertTriangle size={17} />
            Allergies to avoid
          </span>

          <div
            className="choice-chips"
            role="group"
            aria-labelledby="allergies-label"
            aria-describedby={errors.allergies ? "allergies-error" : undefined}
          >
            {allergyOptions.map((allergy) => {
              const selected = values.allergies.includes(allergy);

              return (
                <button
                  type="button"
                  className={
                    selected ? "choice-chip selected" : "choice-chip"
                  }
                  onClick={() => toggleAllergy(allergy)}
                  key={allergy}
                  aria-pressed={selected}
                >
                  {allergy}
                </button>
              );
            })}
          </div>

          {errors.allergies && (
            <p className="field-error" id="allergies-error">
              {errors.allergies}
            </p>
          )}
        </div>

        {saveMessage && (
          <p className="save-status" role="status" aria-live="polite">
            {saveMessage}
          </p>
        )}

        <div className="settings-actions">
          <button className="secondary-button" type="button" onClick={handleResetClick}>
            Reset changes
          </button>

          <button className="generate-button settings-save-button" type="submit">
            Save settings
          </button>
        </div>
      </form>
    </section>
  );
}

export default SettingsForm;
