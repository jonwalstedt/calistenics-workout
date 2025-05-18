import { Button, Flex } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";
import { useWorkoutSchedule } from "../../hooks";
import { useUser } from "../../context";
import styles from "./GlobalNavigation.module.css";
import {
	DoneIcon,
	HistoryIcon,
	HouseIcon,
	PlayIcon,
	ScheduleIcon,
} from "./assets";

export function GlobalNavigation() {
	const location = useLocation();
	const { isLoggedIn } = useUser();

	// Determine if we're in a workout session (to hide the navigation)
	const isWorkoutSession = location.pathname.includes("/workout/");

	const url = location.pathname;

	if (!isLoggedIn || isWorkoutSession) {
		return null; // Don't show navigation if not logged in or during workout
	}

	return (
		<div className={styles.navContainer}>
			<Flex className={styles.navContent} justify="between" align="center">
				<Button variant="ghost" size="3" className={styles.navButton} asChild>
					<Link to="/history">
						<HistoryIcon />
					</Link>
				</Button>
				{url !== "/" ? (
					<Button variant="ghost" size="3" className={styles.navButton} asChild>
						<Link to="/">
							<HouseIcon />
						</Link>
					</Button>
				) : (
					<StartWorkoutButton />
				)}
				<Button variant="ghost" size="3" className={styles.navButton} asChild>
					<Link to="/schedule">
						<ScheduleIcon />
					</Link>
				</Button>
			</Flex>
		</div>
	);
}

const StartWorkoutButton = () => {
	const { hasCompletedTodaysWorkout } = useUser();
	const { getTodayWorkout, isLoaded } = useWorkoutSchedule();

	// Get today's workout
	const todayWorkout = isLoaded ? getTodayWorkout() : null;

	if (!todayWorkout || hasCompletedTodaysWorkout()) {
		return (
			<Button
				size="4"
				className={styles.mainButton}
				variant="ghost"
				disabled={true}
				asChild={true}
			>
				<DoneIcon />
			</Button>
		);
	}
	return (
		<Link to={`/workout/${todayWorkout.day}`} className={styles.playButton}>
			<PlayIcon />
		</Link>
	);
};
