// Import all images from the assets folder
import jumpSquats from '../assets/jump-squats.png';
import pushUps from '../assets/push-ups.png';
import mountainClimbers from '../assets/mountain-climbers.png';
import gluteBridges from '../assets/glute-bridges.png';
import plank from '../assets/plank.png';
import highKnees from '../assets/high-knees.png';
import plankShoulderTaps from '../assets/plank-shoulder-taps.png';
import russianTwists from '../assets/russian-twists.png';
import burpees from '../assets/burpees.png';
import bicycleCrunches from '../assets/bicycle-crunches.png';
import hollowHold from '../assets/hollow-hold.png';
import jumpingLunges from '../assets/jumping-lunges.png';
import wallSit from '../assets/wall-sit.png';
import squats from '../assets/squats.png';
import calfRaises from '../assets/calf-raises.png';
import plankWithLegLifts from '../assets/plank-with-leg-lifts.png';
import armCircles from '../assets/arm-circles.png';
import slowMarchInPlace from '../assets/slow-march-in-place.png';
import catCowStretch from '../assets/cat-cow-stretch.png';
import forwardFoldHang from '../assets/forward-fold-hang.png';
import gluteBridgeHold from '../assets/glute-bridge-hod.png';
import deepSquatHold from '../assets/deep-squat-hold.png';
import tricepsDipsChair from '../assets/triceps-dips-chair.png';
import plankToPushUp from '../assets/plank-to-push-up.png';
import sidePlank from '../assets/side-plank.png';
import flutterKicks from '../assets/flutter-kicks.png';
import fastFeet from '../assets/fast-feet.png';
import birdDog from '../assets/bird-dog.png';
import vUps from '../assets/v-ups.png';
import sidePlankReach from '../assets/side-plank-reach.png';
import legRaises from '../assets/leg-raises.png';

// Create a mapping of image paths to actual imported images
const imageMap: Record<string, string> = {
  '../assets/jump-squats.png': jumpSquats,
  '../assets/push-ups.png': pushUps,
  '../assets/mountain-climbers.png': mountainClimbers,
  '../assets/glute-bridges.png': gluteBridges,
  '../assets/plank.png': plank,
  '../assets/high-knees.png': highKnees,
  '../assets/plank-shoulder-taps.png': plankShoulderTaps,
  '../assets/russian-twists.png': russianTwists,
  '../assets/burpees.png': burpees,
  '../assets/bicycle-crunches.png': bicycleCrunches,
  '../assets/hollow-hold.png': hollowHold,
  '../assets/jumping-lunges.png': jumpingLunges,
  '../assets/wall-sit.png': wallSit,
  '../assets/squats.png': squats,
  '../assets/calf-raises.png': calfRaises,
  '../assets/plank-with-leg-lifts.png': plankWithLegLifts,
  '../assets/arm-circles.png': armCircles,
  '../assets/slow-march-in-place.png': slowMarchInPlace,
  '../assets/cat-cow-stretch.png': catCowStretch,
  '../assets/forward-fold-hang.png': forwardFoldHang,
  '../assets/glute-bridge-hod.png': gluteBridgeHold,
  '../assets/deep-squat-hold.png': deepSquatHold,
  '../assets/triceps-dips-chair.png': tricepsDipsChair,
  '../assets/plank-to-push-up.png': plankToPushUp,
  '../assets/side-plank.png': sidePlank,
  '../assets/flutter-kicks.png': flutterKicks,
  '../assets/fast-feet.png': fastFeet,
  '../assets/bird-dog.png': birdDog,
  '../assets/v-ups.png': vUps,
  '../assets/side-plank-reach.png': sidePlankReach,
  '../assets/leg-raises.png': legRaises,
};

/**
 * Get the actual image source for a given path from the JSON data
 */
export function getImageSrc(path: string): string {
  return imageMap[path] || ''; // Return the imported image or empty string if not found
}

export default getImageSrc;