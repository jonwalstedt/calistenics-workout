import { useRouteError } from 'react-router-dom';

// Define an interface for the possible error shapes
interface RouterError {
  statusText?: string;
  message?: string;
}

export function ErrorPage() {
  const error = useRouteError() as RouterError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
