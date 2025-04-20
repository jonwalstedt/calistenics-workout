// Import sound files from assets
import aboutToStartSound from '../../assets/sounds/about-to-start.mp3';
import exerciseCompleteSound from '../../assets/sounds/exercise-complete.mp3';

// Sound URLs - using imported assets
const SOUNDS = {
  ABOUT_TO_START: aboutToStartSound,
  EXERCISE_COMPLETE: exerciseCompleteSound,
};

class AudioService {
  private audioCache = new Map<string, HTMLAudioElement>();
  private isMuted = false;

  constructor() {
    // Preload sounds
    this.preloadSounds();
  }

  /**
   * Preload all sounds to avoid latency when playing
   */
  private preloadSounds(): void {
    for (const soundUrl of Object.values(SOUNDS)) {
      try {
        const audio = new Audio();
        audio.src = soundUrl;
        
        // Add load event listener to verify the sound loads properly
        audio.addEventListener('canplaythrough', () => {
          console.log(`Sound loaded successfully: ${soundUrl}`);
        });
        
        // Add error event listener to catch and log load failures
        audio.addEventListener('error', (e) => {
          console.error(`Error loading sound: ${soundUrl}`, e);
        });
        
        // Preload the audio by loading metadata
        audio.load();
        
        // Store in cache
        this.audioCache.set(soundUrl, audio);
      } catch (error) {
        console.error(`Failed to preload sound: ${soundUrl}`, error);
      }
    }
  }

  /**
   * Play the "about to start" sound when pause is ending
   */
  playAboutToStartSound(): void {
    if (this.isMuted) return;
    this.playSound(SOUNDS.ABOUT_TO_START);
  }

  /**
   * Play the "exercise complete" sound when an exercise finishes
   */
  playExerciseCompleteSound(): void {
    if (this.isMuted) return;
    this.playSound(SOUNDS.EXERCISE_COMPLETE);
  }

  /**
   * Toggle mute state
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Get current mute state
   */
  getMuteState(): boolean {
    return this.isMuted;
  }

  /**
   * Set mute state
   */
  setMute(muted: boolean): void {
    this.isMuted = muted;
  }

  /**
   * Generic method to play any sound by URL
   */
  private playSound(soundUrl: string): void {
    try {
      let audio = this.audioCache.get(soundUrl);
      
      if (!audio) {
        // Fallback if preloading failed
        console.log(`Creating new audio for sound: ${soundUrl}`);
        audio = new Audio();
        audio.src = soundUrl;
        audio.load();
        this.audioCache.set(soundUrl, audio);
      }
      
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.error(`Error playing sound: ${soundUrl}`, err);
      });
    } catch (error) {
      console.error(`Failed to play sound: ${soundUrl}`, error);
    }
  }
}

// Create a singleton instance
const audioService = new AudioService();

export default audioService; 