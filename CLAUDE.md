# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Test Commands

- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run single test
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Lint Commands

- `npm run lint` - Run ESLint on all files

## Code Style Guidelines

- **TypeScript**: Use strict typing with explicit interfaces and return types
- **Imports**: Group imports (React, third-party, local), use named imports
- **Components**: Functional components with props destructuring
- **Naming**: PascalCase for components/interfaces, camelCase for variables/functions
- **Styling**: CSS Modules with kebab-case class names
- **Error Handling**: Try/catch blocks, graceful fallbacks, console warnings
- **Tests**: Vitest with JSDOM, detailed mocks, place in `__tests__` folders

## Workflow

- write tests first
- write code to pass tests
- refactor code to improve readability and performance
- run tests after each change
- run linter after each change
- run build after each change
- run tests before each commit
- use descriptive commit messages
- do small commits
