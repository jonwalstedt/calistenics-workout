import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import ErrorPage from './error-page';
import WorkoutHistory from './routes/WorkoutHistory';
import WorkoutSession from './routes/WorkoutSession';
import '@radix-ui/themes/styles.css';
import './index.css';
import { Theme } from '@radix-ui/themes';
import { UserProvider } from './context';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <UserProvider>
        <div className="content">
          <RouterProvider router={router} />
        </div>
      </UserProvider>
    </Theme>
  </StrictMode>
);