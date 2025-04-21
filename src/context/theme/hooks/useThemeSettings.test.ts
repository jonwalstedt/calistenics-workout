import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { useThemeSettings } from './useThemeSettings';
import * as utils from '../utils';

describe('useThemeSettings', () => {
  // Setup mocks
  let localStorageMock: { [key: string]: string } = {};
  let mediaQueryListMock: { 
    matches: boolean; 
    addEventListener: Mock;
    removeEventListener: Mock;
  };
  
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = vi.fn((key) => localStorageMock[key] || null);
    Storage.prototype.setItem = vi.fn((key, value) => {
      localStorageMock[key] = String(value);
    });
    
    // Mock document methods
    document.documentElement.dataset.theme = '';
    
    // Mock window.matchMedia
    mediaQueryListMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockImplementation(() => mediaQueryListMock);
    
    // Spy on utils functions
    vi.spyOn(utils, 'getInitialTheme');
    vi.spyOn(utils, 'getSystemPreference');
    
    // Reset localStorage mock for each test
    localStorageMock = {};
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  // Test initial state
  describe('initial state', () => {
    it('should initialize with the theme from getInitialTheme', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('light');
      vi.mocked(utils.getSystemPreference).mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeSettings());
      
      expect(utils.getInitialTheme).toHaveBeenCalled();
      expect(result.current.theme).toBe('light');
      expect(result.current.effectiveTheme).toBe('light');
    });
    
    it('should set system preference from getSystemPreference', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('system');
      vi.mocked(utils.getSystemPreference).mockReturnValue('dark');
      
      const { result } = renderHook(() => useThemeSettings());
      
      expect(utils.getSystemPreference).toHaveBeenCalled();
      expect(result.current.theme).toBe('system');
      expect(result.current.effectiveTheme).toBe('dark');
    });
  });
  
  // Test theme toggling
  describe('toggleTheme', () => {
    it('should cycle from light to dark', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeSettings());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('dark');
      expect(result.current.effectiveTheme).toBe('dark');
    });
    
    it('should cycle from dark to system', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('dark');
      vi.mocked(utils.getSystemPreference).mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeSettings());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('system');
      expect(result.current.effectiveTheme).toBe('light');
    });
    
    it('should cycle from system to light', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('system');
      
      const { result } = renderHook(() => useThemeSettings());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('light');
      expect(result.current.effectiveTheme).toBe('light');
    });
  });
  
  // Test system preference changes
  describe('system preference changes', () => {
    it('should update effectiveTheme when system preference changes and theme is system', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('system');
      vi.mocked(utils.getSystemPreference).mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeSettings());
      
      // Initial state
      expect(result.current.theme).toBe('system');
      expect(result.current.effectiveTheme).toBe('light');
      
      // Simulate media query change
      act(() => {
        const changeHandler = mediaQueryListMock.addEventListener.mock.calls[0][1];
        changeHandler({ matches: true } as MediaQueryListEvent);
      });
      
      // After system preference change
      expect(result.current.theme).toBe('system');
      expect(result.current.effectiveTheme).toBe('dark');
    });
    
    it('should not affect effectiveTheme when system preference changes but theme is not system', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeSettings());
      
      // Initial state
      expect(result.current.theme).toBe('light');
      expect(result.current.effectiveTheme).toBe('light');
      
      // Simulate media query change
      act(() => {
        const changeHandler = mediaQueryListMock.addEventListener.mock.calls[0][1];
        changeHandler({ matches: true } as MediaQueryListEvent);
      });
      
      // After system preference change - should still be light
      expect(result.current.theme).toBe('light');
      expect(result.current.effectiveTheme).toBe('light');
    });
  });
  
  // Test side effects
  describe('side effects', () => {
    it('should update document.documentElement.dataset.theme with effectiveTheme', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('dark');
      
      renderHook(() => useThemeSettings());
      
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
    
    it('should save theme to localStorage when it changes', () => {
      vi.mocked(utils.getInitialTheme).mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeSettings());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
    
    it('should remove the media query listener on unmount', () => {
      const { unmount } = renderHook(() => useThemeSettings());
      
      unmount();
      
      expect(mediaQueryListMock.removeEventListener).toHaveBeenCalled();
    });
  });
});
