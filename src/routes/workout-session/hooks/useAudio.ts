import { useState, useEffect, useCallback } from 'react';
import audioService from '../../../components/audio/AudioService';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false);

  // Initialize mute state from AudioService
  useEffect(() => {
    setIsMuted(audioService.getMuteState());
  }, []);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    const newMuteState = audioService.toggleMute();
    setIsMuted(newMuteState);
  }, []);

  return { isMuted, toggleMute };
} 