# Calisthenics Workout App

A mobile-first progressive web application (PWA) for tracking calisthenics workouts. The app features a modern UI with both light and dark mode support, works offline, and can be installed on mobile devices.

## Features

- Daily workout routines with exercise instructions
- Workout history tracking with calendar view
- Light and dark theme support (system preference or manual toggle)
- Offline mode - works without internet connection
- Mobile-first responsive design
- PWA support - can be installed on mobile devices

## Development Setup

This project requires Node.js 18 or higher and uses npm with `legacy-peer-deps` enabled due to dependency compatibility issues with React 19.

### Quick Setup

Run the setup script to configure npm and install dependencies:

```bash
./setup-dev.sh
```

### Manual Setup

If you prefer a manual setup:

1. Configure npm to use legacy-peer-deps:
   ```bash
   npm config set legacy-peer-deps true
   ```

2. Install dependencies:
   ```bash
   npm ci --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run storybook` - Start Storybook for component development

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment workflow is defined in `.github/workflows/deploy.yml`.

The production version is available at: https://[username].github.io/calistenics-workout/

## Technical Details

- Built with React 19 and TypeScript
- Uses Vite for fast development and optimized builds
- State management with React Context API
- Routing with React Router
- UI components with Radix UI
- Offline support with Service Workers (Workbox)
- Component documentation with Storybook
- Testing with Vitest

## Dependencies Configuration

This project uses several configuration files to ensure consistent behavior:

- `.npmrc` - Sets global npm configuration for the project
- `package.json` - Contains npm scripts and dependency information
- `.github/workflows/deploy.yml` - GitHub Actions workflow for deployment

The `legacy-peer-deps=true` setting is required due to compatibility issues between the latest React version and some dependencies. This setting is configured in:
- `.npmrc`
- GitHub Actions workflow
- npm configuration in `package.json`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
