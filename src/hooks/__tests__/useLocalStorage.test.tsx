import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock StorageEvent for testing cross-tab functionality
class StorageEventMock extends Event {
  key: string;
  newValue: string | null;
  oldValue: string | null;
  storageArea: Storage | null;

  constructor(options: { key: string; newValue: string | null; oldValue: string | null }) {
    super('storage');
    this.key = options.key;
    this.newValue = options.newValue;
    this.oldValue = options.oldValue;
    this.storageArea = localStorageMock as unknown as Storage;
  }
}

describe('useLocalStorage', () => {
  // Setup localStorage mock before tests
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('should use the initialValue when localStorage is empty', () => {
    const initialValue = { name: 'Test User' };
    const { result } = renderHook(() => useLocalStorage('user', initialValue));

    expect(result.current[0]).toEqual(initialValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
  });

  it('should retrieve value from localStorage if it exists', () => {
    const storedValue = { name: 'Stored User' };
    
    // Setup the mock before rendering the hook
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify(storedValue);
      }
      return null;
    });

    const { result } = renderHook(() => useLocalStorage('user', { name: 'Default' }));

    expect(result.current[0]).toEqual(storedValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
  });

  it('should update localStorage when the state changes', () => {
    const { result } = renderHook(() => useLocalStorage('user', { name: 'Initial' }));

    act(() => {
      const setValue = result.current[1];
      setValue({ name: 'Updated' });
    });

    expect(result.current[0]).toEqual({ name: 'Updated' });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({ name: 'Updated' }));
  });

  it('should handle functional updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      const setValue = result.current[1];
      setValue((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('counter', '1');
  });

  it('should update when localStorage changes in another tab', () => {
    const { result } = renderHook(() => useLocalStorage('user', { name: 'Initial' }));

    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEventMock({
        key: 'user',
        newValue: JSON.stringify({ name: 'Updated From Other Tab' }),
        oldValue: JSON.stringify({ name: 'Initial' }),
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toEqual({ name: 'Updated From Other Tab' });
  });

  it('should handle parsing errors gracefully', () => {
    // Reset the previous mocks
    vi.resetAllMocks();
    
    // Mock console.warn to prevent actual warnings during test
    const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Cause a parsing error by returning invalid JSON
    localStorageMock.getItem.mockReturnValueOnce('invalid json');

    const initialValue = { name: 'Default' };
    const { result } = renderHook(() => useLocalStorage('user', initialValue));

    // Should use initial value when parsing fails
    expect(result.current[0]).toEqual(initialValue);
    expect(consoleWarnMock).toHaveBeenCalled();

    consoleWarnMock.mockRestore();
  });

  it('should handle localStorage being unavailable', () => {
    // Reset mocks for this test
    vi.resetAllMocks();
    
    // Mock console.warn to prevent actual warnings during test
    const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Simulate localStorage.setItem throwing an error
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('localStorage is not available');
    });

    const { result } = renderHook(() => useLocalStorage('user', { name: 'Initial' }));

    act(() => {
      const setValue = result.current[1];
      setValue({ name: 'Updated' });
    });

    // Should update the state even if localStorage fails
    expect(result.current[0]).toEqual({ name: 'Updated' });
    expect(consoleWarnMock).toHaveBeenCalled();

    consoleWarnMock.mockRestore();
  });
});