# CLAUDE.md

## Project Guidelines

### 1. Reuse existing code whenever possible
Before creating new components, utilities, or data structures, check whether similar functionality already exists in the project. Reuse existing code instead of duplicating it.

### 2. Verify all changes before finishing
After implementing a feature, always run:
- `npm test`
- `npm run lint`
- `npm run build`

Do not consider a task complete unless all three commands succeed.

### 3. Preserve accessibility and validation
All form inputs should include proper labels and accessible error messages. User input must be validated before being saved or submitted.

### 4. Keep components focused
Each component should have a single responsibility. Shared logic should be moved into utility functions when appropriate to keep components readable and maintainable.