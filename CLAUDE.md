# CLAUDE.md

## PantryPal Project Rules

1. Meal preferences must be stored through `utils/settings.js`. Do not duplicate localStorage logic in components.

2. Every form must use controlled React inputs, validate user input before saving, and provide accessible labels and error messages.

3. Before considering any feature complete, run:
   - npm test
   - npm run lint
   - npm run build

4. Reuse existing option lists (diet, cuisine, meal type, allergies) from `src/data/options.js` instead of creating duplicates.
