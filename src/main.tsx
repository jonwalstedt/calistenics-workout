import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Home } from "./routes/home";
import { ErrorPage } from "./error-page";
import { WorkoutHistory } from "./routes/workout-history";
import { WorkoutSessionDataLoader } from "./routes/workout-session";
import { Settings } from "./routes/settings";
import { WorkoutSchedule } from "./routes/schedule";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { UserProvider, ThemeProvider } from "./context";
// @ts-expect-error - Virtual module from vite-plugin-pwa
import { registerSW } from "virtual:pwa-register";
import { OfflineNotification } from "./components/offline";
import { GlobalNavigation } from "./components/global-navigation";
import { initCookieConsent } from "./components/cookie-consent";
import { BackgroundWave } from "./components/background-wave";

// Initialize cookie consent banner
document.addEventListener("DOMContentLoaded", initCookieConsent);

// Register service worker for PWA
const updateSW = registerSW({
	onNeedRefresh() {
		// This function is called when a new version of the app is available
		if (confirm("New content available. Reload?")) {
			updateSW(true);
		}
	},
	onOfflineReady() {
		console.log("App ready to work offline");
	},
});

// Get the base URL from the import.meta.env
// In development, this will be '/'
// In production with GitHub Pages, this will match the repository name
const baseUrl = import.meta.env.BASE_URL;

// Layout component that includes the global navigation
function AppLayout() {
	return (
		<>
			<Outlet />
			<GlobalNavigation />
			<BackgroundWave />
		</>
	);
}

const router = createBrowserRouter(
	[
		{
			element: <AppLayout />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: "/",
					element: <Home />,
				},
				{
					path: "/history",
					element: <WorkoutHistory />,
				},
				{
					path: "/settings",
					element: <Settings />,
				},
				{
					path: "/schedule",
					element: <WorkoutSchedule />,
				},
			],
		},
		{
			path: "/workout/:workoutId",
			element: <WorkoutSessionDataLoader />,
			errorElement: <ErrorPage />,
		},
	],
	{
		// Use the base URL from environment for GitHub Pages compatibility
		basename: baseUrl,
	},
);

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<ThemeProvider>
				<Theme
					appearance="inherit"
					scaling="100%"
					radius="medium"
					accentColor="indigo"
				>
					<UserProvider>
						<OfflineNotification />
						<div className="content">
							<RouterProvider router={router} />
						</div>
					</UserProvider>
				</Theme>
			</ThemeProvider>
		</StrictMode>,
	);
} else {
	console.error("Root element not found");
}
