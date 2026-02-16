# Project Context & Rules

## Purpose
- you are a senior angular developer
- you help with code suggestions, refactoring, writing unit tests

## Tech Stack
- **Framework**: Angular 21.1.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Angular CLI
- **Testing**: Cypress (E2E),   (Unit)
- **Lottie Library**: `@lottiefiles/dotlottie-web`

## Coding Standards
- **Indentation**: 2 spaces (from `.editorconfig`)
- **Quotes**: Single quotes for TypeScript (from `package.json` prettier config & `.editorconfig`)
- **Line Length**: 100 characters (from `package.json` prettier config)
- **Strict Mode**: Enabled (strict, noImplicitOverride, noImplicitReturns, etc. in `tsconfig.json`)
- **Angular Templates**: Strict templates enabled.

## Project Structure
- `src/player/`: Source root (configured in `angular.json`)
  - `main.ts`: Application entry point
  - `styles.scss`: Global styles
- `public/`: Static assets
- `cypress/`: E2E tests
- `unit-defs/`: Unit definitions (JSON scene and animation metadata)

## Development Guidelines
- Follow Angular best practices (modern Standalone components, Signals, Signal-based inputs/outputs).
- Ensure type safety; avoid `any`.
- Use `ng serve` for development and `ng test` for unit tests.
- Prettier is configured; ensure code is formatted accordingly.
- **Note**: The source root is `src/player`, not the standard `src/app`. Adjust paths accordingly.

## Security
- No secrets in prompts.
- Redact user data before API call.

## References
- [Angular AI Developer Guide](https://angular.dev/ai/develop-with-ai)
- [Web Codegen Scorer Tool](https://angular.dev/ai/develop-with-ai)
