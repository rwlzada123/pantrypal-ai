import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Clock3,
  Coins,
  Mail,
  Salad,
  Save,
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
  skillLevels,
} from "../data/options";
import { validateSettings } from "../utils/validateSettings";

function SettingsForm({ settings, onSave }) {
  const [formData, setFormData] = useState(settings);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setFormData((currentSettings) => ({
      ...currentSettings,
      profile: {
        ...currentSettings.profile,
        [name]: value,
      },
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
    setSaveMessage("");
  }

  function handlePreferenceChange(event) {
    const { name, value } = event.target;

    setFormData((currentSettings) => ({
      ...currentSettings,
      defaultPreferences: {
        ...currentSettings.defaultPreferences,
        [name]:
          name === "servings" || name === "cookingTime"
            ? Number(value)
            : value,
      },
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
    setSaveMessage("");
  }

  function toggleAllergy(allergy) {
    setFormData((currentSettings) => {
      const selected =
        currentSettings.defaultPreferences.allergies.includes(allergy);

      return {
        ...currentSettings,
        defaultPreferences: {
          ...currentSettings.defaultPreferences,
          allergies: selected
            ? currentSettings.defaultPreferences.allergies.filter(
                (item) => item !== allergy
              )
            : [
                ...currentSettings.defaultPreferences.allergies,
                allergy,
              ],
        },
      };
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      allergies: undefined,
    }));
    setSaveMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { isValid, errors: validationErrors } =
      validateSettings(formData);

    if (!isValid) {
      setErrors(validationErrors);
      setSaveMessage("");
      return;
    }

    const normalizedSettings = {
      profile: {
        displayName: formData.profile.displayName.trim(),
        email: formData.profile.email.trim(),
      },
      defaultPreferences: {
        ...formData.defaultPreferences,
      },
    };

    onSave(normalizedSettings);
    setFormData(normalizedSettings);
    setErrors({});
    setSaveMessage("Settings saved successfully.");
  }

  function handleReset() {
    setFormData(settings);
    setErrors({});
    setSaveMessage("");
  }

  const { profile, defaultPreferences } = formData;

  return (
    <section className="generator-card settings-card">
      <div className="section-title">
        <span className="section-icon">
          <Settings size={22} />
        </span>

        <div>
          <p className="section-kicker">Your account</p>
          <h2>Settings</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-heading">
          <div>
            <label htmlFor="displayName">Profile</label>
            <p>How PantryPal should address you.</p>
          </div>
        </div>

        <div className="settings-grid">
          <label className="text-field">
            <span className="select-label">
              <User size={17} />
              Display name
            </span>

            <input
              id="displayName"
              name="displayName"
              type="text"
              value={profile.displayName}
              onChange={handleProfileChange}
              placeholder="e.g. Alex"
              aria-invalid={Boolean(errors.displayName)}
              aria-describedby={
                errors.displayName ? "displayName-error" : undefined
              }
              autoComplete="name"
            />

            {errors.displayName && (
              <span
                className="field-error"
                id="displayName-error"
                role="alert"
              >
                {errors.displayName}
              </span>
            )}
          </label>

          <label className="text-field">
            <span className="select-label">
              <Mail size={17} />
              Email
              <span className="field-optional">Optional</span>
            </span>

            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />

            {errors.email && (
              <span className="field-error" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </label>
        </div>

        <div className="form-divider" />

        <div className="field-heading">
          <div>
            <label>Default meal preferences</label>
            <p>These values pre-fill the meal generator each time.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="select-field">
            <span className="select-label">
              <Salad size={17} />
              Meal type
            </span>

            <select
              name="mealType"
              value={defaultPreferences.mealType}
              onChange={handlePreferenceChange}
              aria-invalid={Boolean(errors.mealType)}
            >
              {mealTypes.map((mealType) => (
                <option key={mealType}>{mealType}</option>
              ))}
            </select>

            {errors.mealType && (
              <span className="field-error" role="alert">
                {errors.mealType}
              </span>
            )}
          </label>

          <label className="select-field">
            <span className="select-label">
              <Sparkles size={17} />
              Diet
            </span>

            <select
              name="diet"
              value={defaultPreferences.diet}
              onChange={handlePreferenceChange}
              aria-invalid={Boolean(errors.diet)}
            >
              {diets.map((diet) => (
                <option key={diet}>{diet}</option>
              ))}
            </select>

            {errors.diet && (
              <span className="field-error" role="alert">
                {errors.diet}
              </span>
            )}
          </label>

          <label className="select-field">
            <span className="select-label">
              <Clock3 size={17} />
              Maximum time
            </span>

            <select
              name="cookingTime"
              value={defaultPreferences.cookingTime}
              onChange={handlePreferenceChange}
              aria-invalid={Boolean(errors.cookingTime)}
            >
              {cookingTimes.map((time) => (
                <option value={time} key={time}>
                  {time} minutes
                </option>
              ))}
            </select>

            {errors.cookingTime && (
              <span className="field-error" role="alert">
                {errors.cookingTime}
              </span>
            )}
          </label>

          <label className="select-field">
            <span className="select-label">
              <ChefHat size={17} />
              Cooking skill
            </span>

            <select
              name="skillLevel"
              value={defaultPreferences.skillLevel}
              onChange={handlePreferenceChange}
              aria-invalid={Boolean(errors.skillLevel)}
            >
              {skillLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>

            {errors.skillLevel && (
              <span className="field-error" role="alert">
                {errors.skillLevel}
              </span>
            )}
          </label>

          <label className="select-field">
            <span className="select-label">
              <Users size={17} />
              Servings
            </span>

            <select
              name="servings"
              value={defaultPreferences.servings}
              onChange={handlePreferenceChange}
              aria-invalid={Boolean(errors.servings)}
            >
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <option value={number} key={number}>
                  {number}
                </option>
              ))}
            </select>

            {errors.servings && (
              <span className="field-error" role="alert">
                {errors.servings}
              </span>
            )}
          </label>

          <label className="select-field">
            <span className="select-label">
              <Coins size={17} />
              Budget
            </span>

            <select
              name="budget"
              value={defaultPreferences.budget}
              onChange={handlePreferenceChange}
              aria-invalid={Boolean(errors.budget)}
            >
              {budgetOptions.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>

            {errors.budget && (
              <span className="field-error" role="alert">
                {errors.budget}
              </span>
            )}
          </label>
        </div>

        <div className="allergy-section">
          <span className="select-label">
            <AlertTriangle size={17} />
            Allergies to avoid
          </span>

          <div className="choice-chips">
            {allergyOptions.map((allergy) => {
              const selected =
                defaultPreferences.allergies.includes(allergy);

              return (
                <button
                  type="button"
                  className={
                    selected ? "choice-chip selected" : "choice-chip"
                  }
                  onClick={() => toggleAllergy(allergy)}
                  key={allergy}
                >
                  {allergy}
                </button>
              );
            })}
          </div>

          {errors.allergies && (
            <span className="field-error" role="alert">
              {errors.allergies}
            </span>
          )}
        </div>

        {saveMessage && (
          <div className="form-success" role="status">
            <CheckCircle2 size={18} />
            {saveMessage}
          </div>
        )}

        <div className="settings-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={handleReset}
          >
            Reset changes
          </button>

          <button className="generate-button settings-save-button" type="submit">
            <Save size={20} />
            Save settings
          </button>
        </div>
      </form>
    </section>
  );
}

export default SettingsForm;
