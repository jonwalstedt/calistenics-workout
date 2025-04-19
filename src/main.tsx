import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './routes/root';
import { ErrorPage } from './error-page';
import { WorkoutHistory } from './routes/workout-history';
import { WorkoutSession } from './routes/workout-session';
import '@radix-ui/themes/styles.css';
import './index.css';
import { Theme } from '@radix-ui/themes';
import { UserProvider } from './context';
// @ts-expect-error - Virtual module from vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register';
import { OfflineNotification } from './components/offline';

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // This function is called when a new version of the app is available
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/history',
    element: <WorkoutHistory />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/workout/:workoutId',
    element: <WorkoutSession />,
    errorElement: <ErrorPage />,
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Theme>
        <UserProvider>
          <OfflineNotification />
          <div className="content">
            <RouterProvider router={router} />
          </div>
        </UserProvider>
      </Theme>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
